import { useRef } from "react"
import ImageInput from "../../reusable/ImageInput"
import DownloadButton from "../../reusable/DownloadButton"
import useHandleFile from "../../hooks/useHandeFile";
import CropTransformer from "./CropTransformer"

const Crop = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);

    const applyCrop = CropTransformer({ image, canvasRef, overlayCanvasRef });

    return (<>
        <ImageInput onUploadAction={handleUpload} />
        <canvas id="canvas" ref={canvasRef} />

        {image && <canvas ref={overlayCanvasRef} />}
        {!image && <div> Upload an image to begin editing </div>}

        <DownloadButton onClickAction={handleDownload} />
    </>)
};

export default Crop