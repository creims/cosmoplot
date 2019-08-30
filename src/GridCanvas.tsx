import React, {useEffect} from 'react';
import {useCanvasRefs} from "./hooks";
import {Viewport, GraphData} from "./types";

type GraphBackgroundProps = {
    width: number,
    height: number,
    viewport: Viewport
};

// Pick the largest tick increment which is 1, 2, or 5 times a power of 10
function getIncrement(minTicks: number, span: number): number {
    const log = Math.log10(span / minTicks);

    const pow10 = Math.pow(10, Math.floor(log));
    const div = span / (pow10 * minTicks);

    if (div > 5) return pow10 * 5;
    if (div > 2) return pow10 * 2;
    return pow10;
}

function getIncrements(viewport: Viewport, width: number, height: number): GraphData {
    const minTicks: number = 14;

    //const worldIncrements = {dx: getIncrement(minTicks, xSpan), dy: getIncrement(minTicks, ySpan)};]
    const span = Math.max(viewport.x.extent, viewport.y.extent);
    const inc = getIncrement(minTicks, span);
    const worldIncrements = {dx: inc, dy: inc};
    const deviceDX = width / (viewport.x.extent / worldIncrements.dx);
    const deviceDY = height / (viewport.y.extent / worldIncrements.dy);
    const deviceIncrements = {dx: deviceDX, dy: deviceDY};

    // First tick is usually not exactly at the baseline
    let xOffset = Math.abs(viewport.x.min) % inc;
    let yOffset = Math.abs(viewport.y.min) % inc;

    xOffset = viewport.x.min > 0 ? -xOffset : xOffset;
    yOffset = viewport.y.min > 0 ? -yOffset : yOffset;

    // First tick is at min + offset
    const worldStarts = {x: xOffset + viewport.x.min, y: yOffset + viewport.y.min};
    const deviceStarts = {x: xOffset / viewport.x.extent * width, y: yOffset / viewport.y.extent * height};

    return {worldStarts, deviceStarts, worldIncrements, deviceIncrements};
}

// Format the number, chop off rounding errors, etc
// TODO: find complete solution that dodges floating point issues; as this one fails due to rounding and at certain sizes
// Possibility: store the increment as an int, multiply by tick amount, then manually add zeroes on either side
function formatNumber(n: number): string {
    return (Math.round(n * 1000) / 1000).toString();
}

function drawAxisLabel(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, offsetX: boolean): void {
    const m: TextMetrics = ctx.measureText(label);
    if(offsetX) x += m.width / 2;
    ctx.fillStyle = 'white';
    ctx.fillRect(x - m.width / 2, y - 8, m.width, 16);
    ctx.fillStyle = 'black';
    ctx.fillText(label, x, y);
}

function drawGraph(ctx: CanvasRenderingContext2D, width: number, height: number, data: GraphData) {
    if (ctx === null) return;

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'gray';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = '16px monospace';

    // Do Y axis first so the horizontal gridlines get cleared properly by drawAxisLabel
    // TODO: figure out better solution for labeling
    let labelY = data.worldStarts.y;
    let halfInc = data.worldIncrements.dy / 2;
    for (let y = height - data.deviceStarts.y; y >= 0; y -= data.deviceIncrements.dy) {
        if (labelY + halfInc > 0 && labelY - halfInc < 0) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(0, y, width, 0.8);
            ctx.strokeStyle = 'gray';
        } else {
            ctx.strokeRect(0, y, width, 0.1);
        }

        drawAxisLabel(ctx, formatNumber(labelY), 0, y, true);
        labelY += data.worldIncrements.dy;
    }

    let labelX = data.worldStarts.x;
    halfInc = data.worldIncrements.dx / 2;
    for (let x = data.deviceStarts.x; x < width; x += data.deviceIncrements.dx) {
        if (labelX + halfInc > 0 && labelX - halfInc < 0) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, 0, 0.8, height);
            ctx.strokeStyle = 'gray';
        } else {
            ctx.strokeRect(x, 0, 0.1, height);
        }

        drawAxisLabel(ctx, formatNumber(labelX), x, 10, false);
        labelX += data.worldIncrements.dx;
    }
}

const GridCanvas: React.FC<GraphBackgroundProps> = (props: GraphBackgroundProps) => {
    const [ctx, canvasRef] = useCanvasRefs();
    const increments = getIncrements(props.viewport, props.width, props.height);

    useEffect(() => {
        if (ctx === null) return;
        drawGraph(ctx, props.width, props.height, increments);
    }, [ctx, props, increments]);

    return <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        className='fixed layer-bottom'
    />
};

export default GridCanvas;