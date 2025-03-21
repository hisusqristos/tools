import { useRef } from "react"
import ImageInput from "../../reusable/ImageInput"
import DownloadButton from "../../reusable/DownloadButton"
import useHandleFile from "../../hooks/useHandeFile";
import GrayscaleTransformer from "./GrayscaleTransformer";
import GSControls from "./GSControls";

const Grayscale = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);
    const applyGS = GrayscaleTransformer({ image, canvasRef });

    return (<>
        <ImageInput onUploadAction={handleUpload} />
        <canvas id="canvas" ref={canvasRef} />

        {!image && (<div>Upload an image to begin editing </div>)}
        {image && <GSControls {...applyGS} />}

        <DownloadButton onClickAction={handleDownload} />
    </>)
};

export default Grayscale 