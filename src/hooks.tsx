import {useCallback, useState} from "react";
import {CanvasRefs} from "./types";

// We use a callback hook to store the context as state
// This avoids calling ref.getContext every time we update the canvas
export function useCanvasRefs(): CanvasRefs {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    // Called when a canvas is mounted
    const callback = useCallback((canvas: HTMLCanvasElement) => {
        if (canvas !== null) {
            setCtx(canvas.getContext('2d'));
        }
    }, []);

    return [ctx, callback];
}
