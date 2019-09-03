import {Point, distance} from "./Point";

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

    // Solves Ax=b with the Thomas algorithm (from Wikipedia)
    for (let i = 1; i < n; i++) {
        const m = a[i] / b[i - 1];
        b[i] = b[i] - m * c[i - 1];
        r[i] = r[i] - m * r[i - 1];
    }

    cp1[n - 1] = r[n - 1] / b[n - 1];
    for (let i = n - 2; i >= 0; --i) {
        cp1[i] = (r[i] - c[i] * cp1[i + 1]) / b[i];
    }

    // We have p1, now compute p2
    for (let i = 0; i < n - 1; i++) {
        cp2[i] = 2 * knots[i + 1] - cp1[i + 1];
    }

    cp2[n - 1] = 0.5 * (knots[n] + cp1[n - 1]);

    return {cp1, cp2};
}

// Generates Bezier curves that smoothly connect a set of points
// This version is for an open curve (the endpoints are not connected)
export function fitCurve(points: Point[]): Point[] {
    if (points.length < 3) return points;

    const xCPs = computeControlPoints(points.map(p => p.x));
    const yCPs = computeControlPoints(points.map(p => p.y));

    const cubicCPs: Point[] = [points[0]];
    for (let i = 0; i < points.length - 1; i++) {
        cubicCPs.push({x: xCPs.cp1[i], y: yCPs.cp1[i]});
        cubicCPs.push({x: xCPs.cp2[i], y: yCPs.cp2[i]});
        cubicCPs.push(points[i + 1]);
    }

    return cubicCPs;
}

// If the endpoints of the curve are near to each other, the control points should be too (creates a smoother curve)
function weight(p1: Point, p2: Point): number {
    const minWeight = 0.00001;
    const dist = distance(p1, p2);
    return dist < minWeight ? minWeight : dist;
}

// Solves Ax = r by Gaussian elimination, or so I'm told
// Source: Lubos Brieda and Jaco Stuifbergen
// http://www.jacos.nl/jacos_html/spline/circular/
function thomasCycle(r_in: number[], a_in: number[], b_in: number[], c_in: number[]) {
    let i: number, m: number;
    const r = r_in.slice();
    const a = a_in.slice();
    const b = b_in.slice();
    const c = c_in.slice();
    const n = r.length;

    // last column of matrix
    const lc = new Array(n);
    lc[0] = a[0];

    // last row
    let lr = c[n - 1];

    for (i = 0; i < n - 3; i++) {
        m = a[i + 1] / b[i];
        b[i + 1] -= m * c[i];
        r[i + 1] -= m * r[i];
        lc[i + 1] = -m * lc[i];

        m = lr / b[i];
        b[n - 1] -= m * lc[i];
        lr = -m * c[i];
        r[n - 1] -= m * r[i]
    }

    m = a[i + 1] / b[i];
    b[i + 1] -= m * c[i];
    r[i + 1] -= m * r[i];
    c[i + 1] -= m * lc[i];
    m = lr / b[i];
    b[n - 1] -= m * lc[i];
    a[n - 1] -= m * c[i];
    r[n - 1] = r[n - 1] - m * r[i];
    i = n - 2;

    m = a[i + 1] / b[i];
    b[i + 1] -= m * c[i];
    r[i + 1] -= m * r[i];

    // Our return array, a vector
    const x = new Array(n);

    x[n - 1] = r[n - 1] / b[n - 1];
    lc[n - 2] = 0;
    for (i = n - 2; i >= 0; --i) {
        x[i] = (r[i] - c[i] * x[i + 1] - lc[i] * x[n - 1]) / b[i];
    }

    return x;
}

// Compute cubic bezier control points between desired knots of a spline
// Source: Lubos Brieda and Jaco Stuifbergen
// http://www.jacos.nl/jacos_html/spline/circular/
function computeControlPointsCycle(knots: number[], weights: number[]): { cp1: number[], cp2: number[] } {
    let W = weights.slice();
    let K = knots.slice();

    const n = K.length;
    let frac_i: number;

    // rhs vector
    const a: number [] = [];
    const b: number [] = [];
    const c: number [] = [];
    const r: number [] = [];

    // populate internal segments
    W[-1] = W[n - 1];
    W[n] = W[0];
    K[n] = K[0];
    for (let i = 0; i < n; i++) {
        frac_i = W[i] / W[i + 1];
        a[i] = W[i] * W[i];
        b[i] = 2 * W[i - 1] * (W[i - 1] + W[i]);
        c[i] = W[i - 1] * W[i - 1] * frac_i;
        r[i] = Math.pow(W[i - 1] + W[i], 2) * K[i] + Math.pow(W[i - 1], 2) * (1 + frac_i) * K[i + 1];

    }
    const cp1: number[] = thomasCycle(r, a, b, c);
    const cp2: number[] = [];

    //we have p1, now compute p2
    cp1[n] = cp1[0];
    for (let i = 0; i < n; i++) {
        cp2[i] = K[i + 1] * (1 + W[i] / W[i + 1]) - cp1[i + 1] * (W[i] / W[i + 1]);
    }

    return {cp1, cp2};
}

// This generates smooth bezier curves between a set of points, including start and end points
export function fitCurveCycle(points: Point[]): Point[] {
    if (points.length < 3) return points;

    const numSegments = points.length - 1;
    const weights: number[] = [];
    for (let i = 0; i < numSegments; i++) {
        weights.push(weight(points[i], points[i + 1]));
    }
    weights.push(weight(points[0], points[numSegments]));

    const xCPs = computeControlPointsCycle(points.map(p => p.x), weights);
    const yCPs = computeControlPointsCycle(points.map(p => p.y), weights);

    const cubicCPs: Point[] = [points[0]];
    for (let i = 0; i < points.length; i++) {
        cubicCPs.push({x: xCPs.cp1[i], y: yCPs.cp1[i]});
        cubicCPs.push({x: xCPs.cp2[i], y: yCPs.cp2[i]});
        cubicCPs.push(i === numSegments ? points[0] : points[i + 1]);
    }

    return cubicCPs;
}