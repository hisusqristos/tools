import { useRef } from "react";
import useHandleFile from "../../hooks/useHandeFile";
import ComparisonSlider from "../../reusable/ComparisonSlider";
import DownloadButton from "../../reusable/DownloadButton";
import ImageInput from "../../reusable/ImageInput";
import { correctWhiteBalance } from "./correctWhiteBalance";

const WhiteBalance = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);
    const correctedSrc = correctWhiteBalance(image, canvasRef);

    return (
        <>
            <ImageInput onUploadAction={handleUpload} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {!image ? <div>Upload an image to begin editing</div> :
                <ComparisonSlider originalSrc={image.src} editedSrc={correctedSrc!} dimensions={{ width: canvasRef.current!.width, height: canvasRef.current!.height }} />}
            <DownloadButton onClickAction={handleDownload} />
        </>
    );
};

export default WhiteBalance