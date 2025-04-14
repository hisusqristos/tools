import { useRef } from "react";
import DragAndDrop from "../../reusable/DragAndDrop";
import useHandleFile from "../../hooks/useHandleFile";
import applyTransform from "./FlipTransformer";
import FlipControls from "./FlipControls";
import EditorLayout from "../../EditorLayout";

const Flip = ({ maxCanvasSize }: { maxCanvasSize?: number }) => {
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload } = useHandleFile(originalCanvasRef, previewCanvasRef, maxCanvasSize);

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    const ctx = previewCanvasRef.current!.getContext('2d');
    const originalCtx = originalCanvasRef.current!.getContext('2d');

    const isHorizontal = (direction === 'horizontal');
    const isVertical = (direction === 'vertical');

    if (ctx && originalCtx) {
      applyTransform(ctx, { flipH: isHorizontal, flipV: isVertical });
      applyTransform(originalCtx, { flipH: isHorizontal, flipV: isVertical });
    };
  };

  const handleRotate = (direction: 'left' | 'right') => {
    const ctx = previewCanvasRef.current!.getContext('2d');
    const originalCtx = originalCanvasRef.current!.getContext('2d');
    const rotateDeg = (direction === 'right') ? 90 : 270

    if (ctx && originalCtx) {
      applyTransform(ctx, { rotation: rotateDeg });
      applyTransform(originalCtx, { rotation: rotateDeg });
    };
  };

  return (
    <EditorLayout
      toolIcon="assets/flip-horizontal.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
    >
      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <FlipControls applyFlip={handleFlip} applyRotate={handleRotate} />
      )}

      <div
        style={{ width: maxCanvasSize, height: maxCanvasSize }}
        className={`flex items-center justify-center bg-beige-200 rounded-2xl ${!image ? "hidden" : "block"}`} >
        <canvas
          ref={previewCanvasRef}
          className="rounded-lg shadow-md w-max h-max"
        />
        <canvas ref={originalCanvasRef} className="hidden"></canvas>
      </div>
    </EditorLayout>
  );
};

export default Flip;