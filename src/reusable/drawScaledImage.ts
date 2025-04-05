function drawScaledImage(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement | HTMLCanvasElement,
    maxWidth: number,
    maxHeight: number
) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
}

export { drawScaledImage }