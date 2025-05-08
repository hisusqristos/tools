import { useState } from 'react';
import { drawScaledImage } from '../reusable/drawScaledImage';

/**
 * @param {React.RefObject} canvasRef - Reference to the canvas element
 * @return {Object} Object containing image, handleUpload and handleDownload functions
 */
const useHandleFile = (originalCanvasRef: React.RefObject<HTMLCanvasElement | null>, previewCanvasRef?: React.RefObject<HTMLCanvasElement | null>, limit?: number) => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    /**
     * Handles file upload from input element
     * @param {Event} event - The change event from file input
     */
    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (!file || !file.type.match('image.*')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (originalCanvasRef.current) {
                    originalCanvasRef.current.width = img.width;
                    originalCanvasRef.current.height = img.height;
                    const ctx = originalCanvasRef.current.getContext('2d');
                    ctx?.drawImage(img, 0, 0);
                }

                if (previewCanvasRef?.current) {
                    const maxSize = limit ?? 300;
                    drawScaledImage(previewCanvasRef.current, img, maxSize);
                }

                setImage(img);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };


    const handleDownload = () => {
        if (!originalCanvasRef.current) return;
        const originalCanvas = originalCanvasRef.current;
        const link = document.createElement('a');
        link.href = originalCanvas.toDataURL('image/png');
        link.download = 'edited-image.png';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const goToEditor = async (  { signal }: { signal?: AbortSignal } = {},) => {
      if (!originalCanvasRef.current) return;
      originalCanvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          console.error('Canvas toBlob failed');
          return;
        }

        
        const file = new File([blob], crypto.randomUUID(), { type: blob.type });
        console.log(file, file.type);
        const { uploadUrl, imageUrl } = await fetch("https://editor.vertex.art/api/cdn", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(file),
            signal,
          }).then((res) => res.json());

          console.log("uploadUrl",uploadUrl, imageUrl);

         await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
            signal,
          });

      
          const encoded = encodeURIComponent(imageUrl);
        
        const editorUrl = `https://editor.vertex.art/demo?type=IMAGE&data=${encoded}`;
      
        window.open(editorUrl, '_blank');
      });
      
  };


    return { image, handleUpload, handleDownload, goToEditor };
};

export default useHandleFile;