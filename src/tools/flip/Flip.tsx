import { useRef } from "react";
import ImageInput from "../../reusable/ImageInput";
import useHandleFile from "../../hooks/useHandeFile";
import FlipTransformer from "./FlipTransformer";
import FlipControls from "./FlipControls";
import EditorLayout from "../../EditorLayout";


const Flip = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);
  const { applyFlip } = FlipTransformer({ image, canvasRef });

  return (
    <EditorLayout 
      title="Flip Image" 
      toolIcon="assets/flip-horizontal.svg"
      onDownload={image ? handleDownload : undefined}
    >
      {!image ? (
        <ImageInput onUploadAction={handleUpload} />
      ) : (
        <>
          <canvas 
            id="canvas" 
            ref={canvasRef} 
            className="max-w-full rounded-lg shadow-md" 
          />
          <FlipControls applyFlip={applyFlip} />
        </>
      )}
    </EditorLayout>
  );
};

export default Flip;