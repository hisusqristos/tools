import { useState, useCallback } from 'react';

/**
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @return {Object} Object containing image, handleUpload and handleDownload functions
 */
const useHandleFile = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
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
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    ctx!.drawImage(img, 0, 0, img.width, img.height);
                }
                setImage(img);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, [canvasRef]);


    const handleDownload = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const link = document.createElement('a');
        const dataURL = canvas.toDataURL('image/png');

        link.href = dataURL;
        link.download = 'edited-image.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [canvasRef]);

    return {
        image,
        handleUpload,
        handleDownload
    };
};

export default useHandleFile;