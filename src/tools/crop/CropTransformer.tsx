// @ts-nocheck

import { JSX, useCallback, useEffect, useRef, useState } from "react";

type Dimensions = { x: number, y: number, width: number, height: number }

type CropTransformerProps = {
    image: HTMLImageElement
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

const CropTransformer = ({ w, h }: { w: number; h: number }) => {
    const [canvas, setcanvas] = useState<any>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        setcanvas(canvasRef.current);
    }, [canvasRef])

    const ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    return <>
        <canvas ref={canvasRef} />
    </>;
};


export default CropTransformer;