import { useRef } from "react"
import useHandleFile from "../../hooks/useHandleFile";
import UploadButton from "../../reusable/UploadButton";

const Crop = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { image, handleUpload } = useHandleFile(canvasRef);

    return (<>
        <UploadButton onUpload={handleUpload} />
        <canvas id="canvas" ref={canvasRef} />

        {image && <canvas ref={overlayCanvasRef} />}
        {!image && <div> Upload an image to begin editing </div>}

    </>)
};

export default Crop