import React, {useCallback, useEffect, useState} from 'react';
import {Point, distance, pointToString} from './Point';
import {radius} from './Draw';
import GridCanvas from './GridCanvas';
import PlotCanvas from './PlotCanvas';
import {Dimensions, LineStyle, Viewport} from "./types";
import Modal from "./Modal";

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

function getDefaultViewport(windowX: number, windowY: number): Viewport {
    return getRegularViewport(-10.5, 10.5, windowX, windowY);
}

function scaleViewport(v: Viewport, ratio: number) {
    const newXExtent = v.x.extent * ratio;
    const newYExtent = v.y.extent * ratio;
    const newXMin = (v.x.extent - newXExtent) / 2 + v.x.min;
    const newYMin = (v.y.extent - newYExtent) / 2 + v.y.min;

    return {
        x: {min: newXMin, max: newXMin + newXExtent, extent: newXExtent},
        y: {min: newYMin, max: newYMin + newYExtent, extent: newYExtent}
    };
}

function exportString(points: Point[]): string {
    if(points.length === 0) return '[]';

    let str = '[' + pointToString(points[0]);
    for(let i = 1; i < points.length; i++) {
        str += ',' + pointToString(points[i]);
    }

   return str + ']';
}

// TODO: rewrite this monstrosity (it was fun though)
function importFromString(str: string): Point[] {
    type partialPointList = {x: undefined | number, points: Point[]};
    const startList : partialPointList = {x: undefined, points: []};
    return str.replace(/[^\d.,-]/gi, '')
        .split(',')
        .map(str => Number.parseFloat(str))
        .reduce((acc, curr) => {
            if(acc.x !== undefined) {
                acc.points.push({x: acc.x, y: curr});
                acc.x = undefined;
            } else {
                acc.x = curr;
            }
            return acc;
        }, startList).points;
}

// TODO: Hew the monolith! This component is too complex
const Graph: React.FC<Dimensions> = (props: Dimensions) => {
    const [activePoint, setActivePoint] = useState<number | undefined>(undefined);
    const [ptrDown, setPtrDown] = useState<boolean>(false);
    const [worldPoints, setWorldPoints] = useState<Point[]>([]);
    const [devicePoints, setDevicePoints] = useState<Point[]>([]);
    const [viewport, setViewport] = useState<Viewport>(getDefaultViewport(props.width, props.height));
    const [lineStyle, setLineStyle] = useState<LineStyle>('spline');
    const [isCycle, setIsCycle] = useState<boolean>(false);
    const [showExport, setShowExport] = useState<boolean>(false);
    const [showImport, setShowImport] = useState<boolean>(false);

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

    function clearPoints() {
        setWorldPoints([]);
        setActivePoint(undefined);
    }

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

        // Prevents undesired drag behavior on Chrome
        e.preventDefault();

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
        setWorldPoints([...worldPoints, toWorld(newDevicePoint)]);
    }

    function handleWheel(e: React.WheelEvent) {
        if (e.deltaY === 0) return;

        if (e.deltaY > 0) { // Scroll down: zoom out
            setViewport(scaleViewport(viewport, 1.2));
        } else { // Scroll up: zoom in
            setViewport(scaleViewport(viewport, 0.8));
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        switch (e.key) {
            case 'd' || 'D': // Delete the active point
                if (activePoint !== undefined) {
                    devicePoints.splice(activePoint, 1);
                    worldPoints.splice(activePoint, 1);
                    setActivePoint(undefined);
                    setWorldPoints(worldPoints);
                }
                break;
            default:
                break;
        }
    }

    // TODO: Extract modal contents to own components
    return <>
        <div
            style={{
                width: props.width,
                height: props.height
            }}
            tabIndex={0} // So we can focus the div and get keyboard events
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDoubleClick={handleDoubleClick}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            onBlur={() => {setActivePoint(undefined);}}
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
            isCycle={isCycle}
        />
        <div
            id='controls'
            className='ui-box layer-control'
        >
            <button
                onClick={clearPoints}
            >Clear</button>
            <select
                id='line-style'
                onChange={e => {
                    setLineStyle(e.target.value as LineStyle);
                }}
            >
                <option value={'spline'}>Spline</option>
                <option value={'bezier'}>Bezier</option>
                <option value={'line'}>Line</option>
                <option value={'plot'}>Plot</option>
            </select>
            <div>
                <input type='checkbox'
                       onChange={e => {
                           setIsCycle(e.target.checked);
                       }}
                />
                <label htmlFor='cycle'>Cycle</label>
            </div>
            <button onClick={() => {setShowExport(true)}}>Export</button>
            <button onClick={() => {setShowImport(true)}}>Import</button>
        </div>
        <Modal
            title='Export Points'
            children={<textarea readOnly style={{resize:'none'}} value={exportString(worldPoints)} />}
            show={showExport}
            handleClose={() => {
                setShowExport(false);
            }}
        />
        <Modal
            title='Import Points'
            children={
                <>
                <textarea
                    id='importText'
                    style={{resize:'none'}} />
                <button
                    onClick={() => {
                        const textArea = document.getElementById('importText') as HTMLTextAreaElement;
                        const importStr = textArea.value;
                        setWorldPoints(importFromString(importStr));
                    }}
                >Import</button>
                </>
            }
            show={showImport}
            handleClose={() => {
                setShowImport(false);
            }}
        />
    </>
};

export default Graph;