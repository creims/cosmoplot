export interface Dimensions {
    width: number;
    height: number;
}


// Specifies a range of values
export interface Range {
    min: number;
    max: number;
    extent: number;
}

// Specifies the area of the graph being viewed
export interface Viewport {
    x: Range;
    y: Range;
}

export interface Increments {
    dx: number;
    dy: number;
}

export interface StartingPoints {
    x: number;
    y: number;
}

export interface GraphData {
    worldStarts: StartingPoints;
    deviceStarts: StartingPoints;
    worldIncrements: Increments;
    deviceIncrements: Increments;
}

export type LineStyle = 'plot' | 'line' | 'bezier' | 'spline';
