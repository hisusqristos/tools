function drawScaledImage(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement | HTMLCanvasElement,
    maxValue: number
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensionsToFit(image.width, image.height, maxValue, maxValue);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
}

function dimensionsToFit(
    imgWidth: number,
    imgHeight: number,
    maxWidth: number,
    maxHeight: number
) {
    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    const width = Math.round(imgWidth * scale);
    const height = Math.round(imgHeight * scale);
    return { width, height };
}

export { drawScaledImage, dimensionsToFit }