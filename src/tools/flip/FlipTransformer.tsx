import { useState } from 'react';

const FlipTransformer = ({ image, canvasRef }: any) => {
    const [flipScale, setFlipScale] = useState({ x: 1, y: 1 });

    const applyFlip = (direction: 'horizontal' | 'vertical') => {

        if (!canvasRef.current || !image) return;

        let scaleX = 1;
        let scaleY = 1;

        if (direction === 'horizontal') {
            scaleX = -1;
        } else if (direction === 'vertical') {
            scaleY = -1;
        }

        const newFlipScale = { x: flipScale.x * scaleX, y: flipScale.y * scaleY };
        setFlipScale(newFlipScale);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.scale(newFlipScale.x, newFlipScale.y);

        const posX = newFlipScale.x === -1 ? -canvas.width : 0;
        const posY = newFlipScale.y === -1 ? -canvas.height : 0;

        ctx.drawImage(image, posX, posY, canvas.width, canvas.height);
    };

    return { applyFlip };
};


export default FlipTransformer