import { useRef } from "react";
import DragAndDrop from "../../reusable/DragAndDrop";
import useHandleFile from "../../hooks/useHandleFile";
import applyTransform from "./FlipTransformer";
import FlipControls from "./FlipControls";
import EditorLayout from "../../EditorLayout";

const Flip = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fullResCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload } = useHandleFile(canvasRef, fullResCanvasRef);

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    const ctx = canvasRef.current!.getContext('2d');
    const isHorizontal = (direction === 'horizontal');
    const isVertical = (direction === 'vertical');

    if (ctx && image) {
      applyTransform(ctx, { flipH: isHorizontal, flipV: isVertical })
    };
  };

  const handleRotate = (direction: 'left' | 'right') => {
    const ctx = canvasRef.current!.getContext('2d');
    const rotateDeg = (direction === 'right') ? 90 : 270

    if (ctx && image) {
      applyTransform(ctx, { rotation: rotateDeg })
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
        <>
          <FlipControls applyFlip={handleFlip} applyRotate={handleRotate} />
        </>
      )}

      <div className={`flex flex-row items-center justify-center overflow-hidden ${!image ? "hidden" : "block"}`} >
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-md max-w-full max-h-full"
        />

        <canvas
          ref={fullResCanvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </EditorLayout>
  );
};

export default Flip;