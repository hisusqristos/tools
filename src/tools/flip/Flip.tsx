import { useRef } from "react";
import DragAndDrop from "../../reusable/DragAndDrop";
import useHandleFile from "../../hooks/useHandleFile";
import applyTransform from "./FlipTransformer";
import FlipControls from "./FlipControls";
import EditorLayout from "../../EditorLayout";
import useIframeResize from "../../hooks/useIframeResize";
import { useRouteParams } from "../../hooks/useRouteParams";

const Flip = () => {
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const routeParams = useRouteParams()
  const size = routeParams.size ? parseInt(routeParams.size) : 600
  const { image, handleUpload, handleDownload } = useHandleFile(originalCanvasRef, previewCanvasRef, size);

  useIframeResize()

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
        style={{ width: size, height: size }}
        className={`flex w-full items-center justify-center bg-beige-200 rounded-2xl ${!image ? "hidden" : "block"}`} >
        <canvas
          ref={previewCanvasRef}
          className="rounded-lg shadow-md max-w-full max-h-full"
        />
        <canvas ref={originalCanvasRef} className="hidden"></canvas>
      </div>
    </EditorLayout>
  );
};

export default Flip;