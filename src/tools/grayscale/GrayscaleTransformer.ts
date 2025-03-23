const convertToGreyscale = (sourceCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement) => {
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;

    targetCanvas.width = sourceCanvas.width;
    targetCanvas.height = sourceCanvas.height;
    ctx.drawImage(sourceCanvas, 0, 0);

    const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
};


export { convertToGreyscale }