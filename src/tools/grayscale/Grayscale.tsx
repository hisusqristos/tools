import { useRef } from "react"
import ImageInput from "../../reusable/ImageInput"
import DownloadButton from "../../reusable/DownloadButton"
import useHandleFile from "../../hooks/useHandeFile";
import { toGrayscale } from "./toGrayscale";
import ComparisonSlider from "../../reusable/ComparisonSlider";
import "./styles.css";

const Grayscale = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { image, handleUpload, handleDownload } = useHandleFile(canvasRef);
    const greyscaleSrc = toGrayscale(image, canvasRef);

    return (
        <div className="container">
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {!image ? <div>Upload an image to begin editing</div> :
                <div>
                    <ComparisonSlider
                        originalSrc={image.src}
                        editedSrc={greyscaleSrc!}
                        dimensions={{ width: canvasRef.current!.width, height: canvasRef.current!.height }} />
                    <DownloadButton class="floated" onClickAction={handleDownload} />
                </div>
            }
            <ImageInput class="floated" onUploadAction={handleUpload} />
        </div>
    );
};

export default Grayscale 