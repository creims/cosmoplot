import React, {useCallback, useEffect, useState} from 'react';
import {Point, distance} from './Point';
import {radius} from './Draw';
import GridCanvas from './GridCanvas';
import PlotCanvas from './PlotCanvas';
import {Dimensions, LineStyle, Viewport} from "./types";

function getRegularViewport(min: number, max: number, windowX: number, windowY: number): Viewport {
    let ratioX: number = 1;
    let ratioY: number = 1;
    if (windowX > windowY) {
        ratioY = windowY / windowX;
    } else {
        ratioX = windowX / windowY;
    }

    const xMin = min * ratioX;
    const xMax = max * ratioX;
    const yMin = min * ratioY;
    const yMax = max * ratioY;

    return {
        x: {min: xMin, max: xMax, extent: xMax - xMin},
        y: {min: yMin, max: yMax, extent: yMax - yMin}
    };
}

function getDefaultViewport(windowX: number, windowY: number) : Viewport {
    return getRegularViewport(-10.5, 10.5, windowX, windowY);
}

function scaleViewport(v: Viewport, ratio: number) {
    return {
      x: {min: v.x.min * ratio, max: v.x.max * ratio, extent: v.x.extent * ratio},
      y: {min: v.y.min * ratio, max: v.y.max * ratio, extent: v.y.extent * ratio}
    };
}

const Graph: React.FC<Dimensions> = (props: Dimensions) => {
    const [activePoint, setActivePoint] = useState<number | undefined>(undefined);
    const [ptrDown, setPtrDown] = useState<boolean>(false);
    const [worldPoints, setWorldPoints] = useState<Point[]>([]);
    const [devicePoints, setDevicePoints] = useState<Point[]>([]);
    const [viewport, setViewport] = useState<Viewport>(getDefaultViewport(props.width, props.height));
    const [lineStyle, setLineStyle] = useState<LineStyle>('bezier');

    // We store world coordinates and convert back to device coordinates to display
    function toWorld(point: Point): Point {
        return {
            x: point.x / props.width * viewport.x.extent + viewport.x.min,
            y: (props.height - point.y) / props.height * viewport.y.extent + viewport.y.min
        };
    }

    // We wrap toDevice conversion with useCallback so that the useEffect below has static dependencies
    const toDevice = useCallback((point: Point) => {
        return {
            x: Math.round((point.x - viewport.x.min) / viewport.x.extent * props.width),
            y: Math.round(props.height - ((point.y - viewport.y.min) / viewport.y.extent * props.height))
        };
    }, [props.width, props.height, viewport]);

    // When worldPoints changes, update devicePoints to trigger a redraw
    useEffect(() => {
        setDevicePoints(worldPoints.map(toDevice));
    }, [toDevice, worldPoints]);

    function handlePointerDown(e: React.PointerEvent) {
        // Set the active point
        // New active point should be the one closest to click, but only if a point is close enough
        let min: number = radius;
        const clicked: Point = {x: e.clientX, y: e.clientY};
        let newActivePoint: number | undefined = undefined;
        devicePoints.forEach((loc, index) => {
            const dist = distance(clicked, loc);
            if (dist < min) {
                newActivePoint = index;
                min = dist;
            }
        });

        if (activePoint !== newActivePoint) {
            setActivePoint(newActivePoint);
        }

        setPtrDown(true);
    }

    function handlePointerMove(e: React.PointerEvent) {
        if (!ptrDown) return;

        if (activePoint === undefined) { // Pan the graph
            const xRatio = e.movementX / props.width;
            const dx = (viewport.x.max - viewport.x.min) * xRatio;
            const xMin = viewport.x.min - dx;
            const xMax = viewport.x.max - dx;

            const yRatio = e.movementY / props.height;
            const dy = (viewport.y.max - viewport.y.min) * yRatio;
            const yMin = viewport.y.min + dy;
            const yMax = viewport.y.max + dy;

            setViewport({
                x: {min: xMin, max: xMax, extent: xMax - xMin},
                y: {min: yMin, max: yMax, extent: yMax - yMin}
            });
        } else { // Move the point
            // TODO: optimization: use reducer for points since useState does not merge lists
            const clickedPoint = {x: e.clientX, y: e.clientY};
            const newWorld = worldPoints.slice();
            newWorld[activePoint] = toWorld(clickedPoint);

            setWorldPoints(newWorld);
        }
    }

    function handlePointerUp(e: React.PointerEvent) {
        setPtrDown(false);
    }

    function handleDoubleClick(e: React.MouseEvent) {
        const newDevicePoint: Point = {x: e.clientX, y: e.clientY};
        setActivePoint(worldPoints.length);
        setDevicePoints([...devicePoints, newDevicePoint]);
        setWorldPoints([...worldPoints, toWorld(newDevicePoint)]);
    }

    function handleWheel(e: React.WheelEvent) {
        if(e.deltaY === 0) return;

        if(e.deltaY > 0) { // Scroll down (towards)
            setViewport(scaleViewport(viewport, 1.2));
        } else { // Scroll up (away)
            setViewport(scaleViewport(viewport, 0.8));
        }
    }

    return <>
        <div
            style={{
                width: props.width,
                height: props.height
            }}

            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            onWheel={handleWheel}
            className='fixed layer-top'
        />
        <GridCanvas
            width={props.width}
            height={props.height}
            viewport={viewport}
        />
        <PlotCanvas
            width={props.width}
            height={props.height}
            points={devicePoints}
            activePoint={activePoint}
            lineType={lineStyle}
        />
        <select
        className='layer-control'
        id='line-style'
        onChange={e => { setLineStyle(e.target.value as LineStyle); }}
        >
        <option value={'bezier'}>Bezier</option>
        <option value={'line'}>Line</option>
        <option value={'cycle'}>Cycle</option>
        <option value={'plot'}>Plot</option>
    </select>
    </>
};

export default Graph;