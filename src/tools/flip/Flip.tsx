import { useRef } from "react"
import ImageInput from "../../reusable/ImageInput"
import DownloadButton from "../../reusable/DownloadButton"
import useHandleFile from "../../hooks/useHandeFile";
import FlipTransformer from "./FlipTransformer";
import FlipControls from "./FlipControls"

const Flip = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);

    const applyFlip = FlipTransformer({ image, canvasRef });

    return (<>
        <canvas id="canvas" ref={canvasRef} />

        {!image && (<div>Upload an image to begin editing </div>)}
        {image &&
            <div>
                <FlipControls {...applyFlip} />
                <DownloadButton onClickAction={handleDownload} />
            </div>
        }

        <ImageInput onUploadAction={handleUpload} />

    </>)
};

export default Flip