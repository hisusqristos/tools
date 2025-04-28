import { useRef, useState } from "react";
import DragAndDrop from "../../reusable/DragAndDrop";
import useHandleFile from "../../hooks/useHandleFile";
import pixelizeImage  from "./pixelizeImage";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";

const Pixelize = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);
  const [pixelSize, setPixelSize] = useState(20);
  const pixelizedSrc = pixelizeImage(image, canvasRef, pixelSize);

  return (
    <EditorLayout 
      toolIcon="assets/pixelize.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
    >
      <canvas ref={canvasRef} className="hidden" />
      {!image ? (
        <DragAndDrop onUploadAction={handleUpload} />
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-4 items-center">
          <RangeSlider 
            min={1} 
            max={50} 
            value={pixelSize} 
            onChange={setPixelSize} 
            label="Pixel Size" 
          />
          <img src={pixelizedSrc!} alt="Pixelized" />
        </div>
      )}
    </EditorLayout>
  );
};

export default Pixelize; 