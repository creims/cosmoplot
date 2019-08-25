import React, {useEffect} from 'react';
import {Point} from "./Point";
import {useCanvasRefs} from "./CanvasProps";
import {drawLine, drawPoint} from './Draw';
import {LineStyle} from "./types";

type PlotCanvasProps = {
    width: number,
    height: number,
    points: Point[],
    activePoint: number | undefined,
    lineType: LineStyle
};

const PlotCanvas: React.FC<PlotCanvasProps> = (props: PlotCanvasProps) => {
    const [ctx, canvasRef] = useCanvasRefs();

    useEffect(() => {
        if (ctx === null) return;

        ctx.clearRect(0, 0, props.width, props.height);
        drawLine(ctx, props.points, props.lineType);
        props.points.forEach((point, index) => {
            let style: string;
            if (index === props.activePoint) {
                style = 'red';
            } else {
                style = 'blue';
            }

            drawPoint(ctx, point, style);
        });
    }, [ctx, props.points, props.activePoint, props.width, props.height, props.lineType]);

    return <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        className='fixed layer-middle'
    />
};

export default PlotCanvas;