import { useEffect, useRef } from "react"
import ImageInput from "../../reusable/ImageInput"
import DownloadButton from "../../reusable/DownloadButton"
import useHandleFile from "../../hooks/useHandeFile";
import { convertToGreyscale } from "./GrayscaleTransformer";
import ComparisonSlider from "../../reusable/ComparisonSlider";

const Grayscale = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const grayscaleCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);

    useEffect(() => {
        if (!canvasRef.current || !grayscaleCanvasRef.current) return;
        convertToGreyscale(canvasRef.current, grayscaleCanvasRef.current);
    }, [image]);

    return (
        <>
            <ImageInput onUploadAction={handleUpload} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <canvas ref={grayscaleCanvasRef} style={{ display: "none" }} />

            {!image && <div>Upload an image to begin editing</div>}
            {image && <ComparisonSlider originalRef={canvasRef} editedRef={grayscaleCanvasRef} />}

            <DownloadButton onClickAction={handleDownload} />
        </>
    );
};

export default Grayscale 