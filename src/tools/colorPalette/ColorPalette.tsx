import { useEffect, useRef } from "react";
import DragAndDrop from "../../reusable/DragAndDrop";
import useHandleFile from "../../hooks/useHandleFile";
import EditorLayout from "../../EditorLayout";
import PaletteButtons from "./PaletteButtons";
import extractPalette from "./helpers/extractPalette";
import useIframeResize from "../../hooks/useIframeResize";

const ColorPalette = () => {
    const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { image, handleUpload, handleDownload } = useHandleFile(originalCanvasRef);
    useIframeResize()

    return (
        <EditorLayout
            toolIcon="assets/flip-horizontal.svg"
            onDownload={image ? handleDownload : undefined}
            onUpload={handleUpload}
        >
            {!image ? (
                <DragAndDrop onUploadAction={handleUpload} />
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <div
                        className={`flex items-center justify-center overflow-hidden ${!image ? "hidden" : "block"}`} >
                        <img src={image.src} alt="ads" className="w-[600px] h-[450px] object-cover rounded-lg" />
                        <canvas ref={originalCanvasRef} className="hidden"></canvas>
                    </div>
                    <PaletteButtons colors={extractPalette(image)} />
                </div>
            )}
        </EditorLayout>
    );
};

export default ColorPalette

