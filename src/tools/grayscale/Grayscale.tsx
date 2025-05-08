import { useRef } from "react";
import DragAndDrop from "../../reusable/DragAndDrop";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import { toGrayscale } from "./toGrayscale";
import ComparisonSlider from "../../reusable/ComparisonSlider";
import EditorLayout from "../../EditorLayout";


const Grayscale = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload, goToEditor } = useHandleFile(canvasRef);

  useIframeResize()

  const grayscaleSrc = toGrayscale(image, canvasRef);

  return (
    <EditorLayout 
      toolIcon="assets/grayscale.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
      goToEditor={goToEditor}
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <div className="flex w-full items-center justify-center">
          <ComparisonSlider 
            originalSrc={image.src} 
            editedSrc={grayscaleSrc!} 
          />
        </div>
      )}
    </EditorLayout>
  );
};

export default Grayscale;