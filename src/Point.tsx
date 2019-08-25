export interface Point {
    x: number;
    y: number;
}

export function distance(a: Point, b: Point) : number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}
