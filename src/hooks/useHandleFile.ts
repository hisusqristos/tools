import { useState, useCallback } from 'react';
import { drawScaledImage } from '../reusable/scaleCanvas';

/**
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @return {Object} Object containing image, handleUpload and handleDownload functions
 */
const useHandleFile = (
    previewCanvasRef: React.RefObject<HTMLCanvasElement | null>,
    fullResCanvasRef?: React.RefObject<HTMLCanvasElement | null>
) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    /**
     * Handles file upload from input element
     * @param {Event} event - The change event from file input
     */
    const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (!file || !file.type.match('image.*')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const fullCanvas = fullResCanvasRef?.current ?? previewCanvasRef.current;
                if (fullCanvas) {
                    fullCanvas.width = img.width;
                    fullCanvas.height = img.height;
                    fullCanvas.getContext('2d')?.drawImage(img, 0, 0);
                }

                if (fullResCanvasRef?.current && previewCanvasRef.current) {
                    drawScaledImage(previewCanvasRef.current, img, 600, 600);
                }

                setImage(img);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, [previewCanvasRef, fullResCanvasRef]);


    const handleDownload = useCallback(() => {
        if (!previewCanvasRef.current) return;

        const canvas = previewCanvasRef.current;
        const link = document.createElement('a');
        const dataURL = canvas.toDataURL('image/png');

        link.href = dataURL;
        link.download = 'edited-image.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [previewCanvasRef, fullResCanvasRef]);

    return {
        image,
        handleUpload,
        handleDownload
    };
};

export default useHandleFile;