import { useRef, useState } from "react";
import DragAndDrop from "../../reusable/DragAndDrop";
import useHandleFile from "../../hooks/useHandleFile";
import useIframeResize from "../../hooks/useIframeResize";
import pixelizeImage from "./pixelizeImage";
import EditorLayout from "../../EditorLayout";
import RangeSlider from "../../reusable/RangeSlider";

const Pixelize = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { image, handleUpload, handleDownload, goToEditor } = useHandleFile(canvasRef, previewCanvasRef, 600);

  useIframeResize()

  const [pixelSize, setPixelSize] = useState(20);
  const pixelizedSrc = pixelizeImage(image, previewCanvasRef, pixelSize);
  pixelizeImage(image, canvasRef, pixelSize);

  return (
    <EditorLayout
      toolIcon="assets/pixelize.svg"
      onDownload={image ? handleDownload : undefined}
      onUpload={handleUpload}
      goToEditor={goToEditor}
    >
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={previewCanvasRef} className="hidden" />
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
          <img src={pixelizedSrc!} alt="Pixelized" className="rounded-md"/>
        </div>
      )}
    </EditorLayout>
  );
};

export default Pixelize; 