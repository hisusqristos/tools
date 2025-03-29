import { useRef } from "react"
import ImageInput from "../../reusable/ImageInput"
import DownloadButton from "../../reusable/DownloadButton"
import useHandleFile from "../../hooks/useHandleFile";

const Crop = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);

    return (<>
        <ImageInput onUploadAction={handleUpload} />
        <canvas id="canvas" ref={canvasRef} />

        {image && <canvas ref={overlayCanvasRef} />}
        {!image && <div> Upload an image to begin editing </div>}

        <DownloadButton onClickAction={handleDownload} />
    </>)
};

export default Crop