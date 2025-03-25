function correctWhiteBalance(image: HTMLImageElement | null, canvasRef: React.RefObject<HTMLCanvasElement | null>): string | null {
    if (!image || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    let rTotal = 0;
    let gTotal = 0;
    let bTotal = 0;
    let count = 0;

    for (let i = 0; i < pixels.length; i += 4) {
        rTotal += pixels[i];
        gTotal += pixels[i + 1];
        bTotal += pixels[i + 2];
        count++;
    }

    const rMean = rTotal / count;
    const gMean = gTotal / count;
    const bMean = bTotal / count;

    const rScale = 255 / 2.3 / rMean;
    const gScale = 255 / 2 / gMean;
    const bScale = 255 / 2 / bMean;

    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = Math.min(255, pixels[i] * rScale);
        pixels[i + 1] = Math.min(255, pixels[i + 1] * gScale);
        pixels[i + 2] = Math.min(255, pixels[i + 2] * bScale);
    };

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
};

export { correctWhiteBalance };