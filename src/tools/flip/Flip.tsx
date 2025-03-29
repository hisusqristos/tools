import { useRef } from "react";
import ImageInput from "../../reusable/ImageInput";
import useHandleFile from "../../hooks/useHandleFile";
import applyTransform from "./FlipTransformer";
import FlipControls from "./FlipControls";
import EditorLayout from "../../EditorLayout";

const Flip = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    const ctx = canvasRef.current!.getContext('2d');
    const isHorizontal = (direction === 'horizontal');
    const isVertical = (direction === 'vertical');

    if (ctx && image) {
      applyTransform(ctx, { flipH: isHorizontal, flipV: isVertical })
    };
  };

  return (
    <EditorLayout
      toolIcon="assets/flip-horizontal.svg"
      onDownload={image ? handleDownload : undefined}
    >
      <canvas
        id="canvas"
        ref={canvasRef}
        className="max-w-full rounded-lg shadow-md"
        style={{ display: `${!image ? "none" : "block"}` }}
      />
      {!image ? (
        <ImageInput onUploadAction={handleUpload} />
      ) : (
        <>
          <FlipControls applyFlip={handleFlip} />
        </>
      )}
    </EditorLayout>
  );
};

export default Flip;