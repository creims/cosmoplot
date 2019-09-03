export interface Point {
    x: number;
    y: number;
}

export function distance(a: Point, b: Point) : number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// AKA lerp or linear interpolate
export function mix(a: Point, b: Point, ratio: number) : Point {
    if(ratio <= 0.0) return a;
    if(ratio >= 1.0) return b;

    const bRatio = 1.0 - ratio;
    const mixedX = a.x * ratio + b.x * bRatio;
    const mixedY = a.y * ratio + b.y * bRatio;
    return {x: mixedX, y: mixedY};
}

export function pointToString(p : Point) {
    return '(' + p.x + ', ' + p.y + ')';
}
