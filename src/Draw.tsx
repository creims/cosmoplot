import {Point} from './Point';
import {LineStyle} from "./types";

export const radius: number = 5;

export function drawPoint(ctx: CanvasRenderingContext2D, location: Point, style: string) {
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.arc(location.x, location.y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function connectPts(ctx: CanvasRenderingContext2D, points: Point[], cycle: boolean) {
    if(points.length < 2) return;
    const first = points[0];
    let cur;

    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for(let i = 1; i < points.length; i++) {
        cur = points[i];
        ctx.lineTo(cur.x, cur.y);
    }

    if(cycle) ctx.lineTo(first.x, first.y);

    ctx.stroke();
}

export function drawLine(ctx: CanvasRenderingContext2D, points: Point[], type: LineStyle) {
    switch (type) {
        case 'bezier':
            ctx.beginPath();
            for(let i = 0; i < points.length;) {
                const left = points.length - i;
                ctx.moveTo(points[i].x, points[i].y);
                if (left >= 4) {
                    const cp1 = points[i + 1];
                    const cp2 = points[i + 2];
                    const end = points[i + 3];
                    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
                    i += 3;
                } else if (left === 3) {
                    const cp = points[i + 1];
                    const end = points[i + 2];
                    ctx.quadraticCurveTo(cp.x, cp.y, end.x, end.y);
                    i += 2;
                } else if(left === 2) {
                    const end = points[i + 1];
                    ctx.lineTo(end.x, end.y);
                    i++;
                } else {
                    break;
                }
            }
            ctx.stroke();
            break;
        case 'cycle':
            connectPts(ctx, points, true);
            break;
        case 'line':
            connectPts(ctx, points, false);
            break;
        default: // Do nothing with plot types
            break;
    }
}


