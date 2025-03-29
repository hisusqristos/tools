import { useRef } from "react";
import ImageInput from "../../reusable/ImageInput";
import useHandleFile from "../../hooks/useHandleFile";
import { toGrayscale } from "./toGrayscale";
import ComparisonSlider from "../../reusable/ComparisonSlider";
import EditorLayout from "../../EditorLayout";


const Grayscale = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);
  const grayscaleSrc = toGrayscale(image, canvasRef);

  return (
    <EditorLayout 
      toolIcon="assets/grayscale.svg"
      onDownload={image ? handleDownload : undefined}
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {!image ? (
        <ImageInput onUploadAction={handleUpload} />
      ) : (
        <div className="w-full max-w-4xl">
          <ComparisonSlider 
            originalSrc={image.src} 
            editedSrc={grayscaleSrc!} 
            dimensions={{ 
              width: Math.min(800, canvasRef.current!.width), 
              height: Math.min(600, canvasRef.current!.height) 
            }} 
          />
        </div>
      )}
    </EditorLayout>
  );
};

export default Grayscale;