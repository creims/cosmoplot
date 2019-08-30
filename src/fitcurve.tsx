import {Point} from "./Point";

// Algorithm from an excellent post by Lubos Brieda: https://www.particleincell.com/2012/bezier-splines/
// Uses Thomas's Algorithm to compute control points from an array of knots.
// Using each pair of knots as endpoints, generates cubic bezier control points
// Must be performed on X and Y separately!
function computeControlPoints(knots: number[]): { cp1: number[], cp2: number[] } {
    // Control point lists.
    // After running, beziers from {knots[i], cp1[i], cp2[i], knots[i + 1]} will form a smooth curve.
    const cp1: number[] = [];
    const cp2: number[] = [];
    const n = knots.length - 1;

    // rhs vector
    const a: number[] = [];
    const b: number[] = [];
    const c: number[] = [];
    const r: number[] = [];

    // left most segment
    a[0] = 0;
    b[0] = 2;
    c[0] = 1;
    r[0] = knots[0] + 2 * knots[1];

    // internal segments
    for (let i = 1; i < n - 1; i++) {
        a[i] = 1;
        b[i] = 4;
        c[i] = 1;
        r[i] = 4 * knots[i] + 2 * knots[i + 1];
    }

    // right segment
    a[n - 1] = 2;
    b[n - 1] = 7;
    c[n - 1] = 0;
    r[n - 1] = 8 * knots[n - 1] + knots[n];

    // solves Ax=b with the Thomas algorithm (from Wikipedia)
    for (let i = 1; i < n; i++) {
        const m = a[i] / b[i - 1];
        b[i] = b[i] - m * c[i - 1];
        r[i] = r[i] - m * r[i - 1];
    }

    cp1[n - 1] = r[n - 1] / b[n - 1];
    for (let i = n - 2; i >= 0; --i)
        cp1[i] = (r[i] - c[i] * cp1[i + 1]) / b[i];

    //we have p1, now compute p2
    for (let i = 0; i < n - 1; i++)
        cp2[i] = 2 * knots[i + 1] - cp1[i + 1];

    cp2[n - 1] = 0.5 * (knots[n] + cp1[n - 1]);

    return {cp1: cp1, cp2: cp2};
}

// TODO: Add separate algorithm that correctly handles closed curves (loops)
// See http://www.jacos.nl/jacos_html/spline/circular/index.html
export function fitCurve(points: Point[]): Point[] {
    if(points.length < 3) return points;

    const xCPs = computeControlPoints(points.map(p => p.x));
    const yCPs = computeControlPoints(points.map(p => p.y));

    const cubicCPs: Point[] = [points[0]];
    for(let i = 0; i < points.length - 1; i++) {
        cubicCPs.push({x: xCPs.cp1[i], y: yCPs.cp1[i]});
        cubicCPs.push({x: xCPs.cp2[i], y: yCPs.cp2[i]});
        cubicCPs.push(points[i + 1]);
    }

    return cubicCPs;
}