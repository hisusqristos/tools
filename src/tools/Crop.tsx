import { useRef, useState } from "react"
import ImageInput from "../reusable/ImageInput"
import DownloadButton from "../reusable/DownloadButton"
import handleDownload from "../utilities/handeDownload";

const Crop = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

    const handleUpload = (event: any) => {
        const imageFile = event.target.files[0]

        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()
            img.onload = (e) => {
                const ctx: CanvasRenderingContext2D = canvasRef.current!.getContext('2d')!;
                ctx.canvas.width = img.width
                ctx.canvas.height = img.height
                ctx.drawImage(img, 0, 0)

                setContext(ctx)
            }
            img.src = e.target?.result as string

        };
        reader.readAsDataURL(imageFile)
    };


    return (<>
        <ImageInput onUploadAction={handleUpload} />
        <canvas id="canvas" ref={canvasRef} />
        <DownloadButton onClickAction={() => handleDownload(context)} />
    </>)
};

export default Crop