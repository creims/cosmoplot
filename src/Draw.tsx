import {Point} from './Point';
import {LineStyle} from "./types";
import {fitCurve, fitCurveCycle} from "./fitcurve";

export const radius: number = 8;

export function drawPoint(ctx: CanvasRenderingContext2D, location: Point, style: string) {
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(location.x, location.y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Minor lines are used for handles etc
function connectPts(ctx: CanvasRenderingContext2D, points: Point[], cycle: boolean, minor: boolean) {
    if (points.length < 2) return;

    const first = points[0];
    let cur;

    ctx.beginPath();
    if (minor) {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 0.5;
    }

    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i++) {
        cur = points[i];
        ctx.lineTo(cur.x, cur.y);
    }

    if (cycle) ctx.lineTo(first.x, first.y);

    ctx.stroke();
    if (minor) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
    }
}

function drawBezier(ctx: CanvasRenderingContext2D, start: Point, cp1: Point, cp2: Point, end: Point) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();
}

function drawQuadratic(ctx: CanvasRenderingContext2D, start: Point, cp: Point, end: Point) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(cp.x, cp.y, end.x, end.y);
    ctx.stroke();
}

function piecewiseCubicBezier(ctx: CanvasRenderingContext2D, points: Point[], drawHandles: boolean) {
    for (let i = 0; i < points.length;) {
        const left = points.length - i;
        const start: Point = points[i];
        if (left >= 4) {
            const cp1 = points[i + 1];
            const cp2 = points[i + 2];
            const end = points[i + 3];
            if(drawHandles) connectPts(ctx, [start, cp1, cp2, end], false, true);
            drawBezier(ctx, start, cp1, cp2, end);
            i += 3;
        } else if (left === 3) {
            const cp = points[i + 1];
            const end = points[i + 2];
            if(drawHandles) connectPts(ctx, [start, cp, end], false, true);
            drawQuadratic(ctx, start, cp, end);
            i += 2;
        } else if (left === 2) {
            const end = points[i + 1];
            connectPts(ctx, [start, end], false, false);
            i++;
        } else {
            break;
        }
    }
}

export function drawLine(ctx: CanvasRenderingContext2D, points: Point[], type: LineStyle, cycle: boolean) {
    if(cycle && type !== 'spline') {
        points = points.slice();
        points.push(points[0]);
    }

    switch (type) {
        case 'spline':
            const cps = cycle ? fitCurveCycle(points) : fitCurve(points);
            piecewiseCubicBezier(ctx, cps, false);
            break;
        case 'bezier':
            piecewiseCubicBezier(ctx, points, true) ;
            break;
        case 'line':
            connectPts(ctx, points, false, false);
            break;
        default: // Do nothing with plot types
            break;
    }
}


