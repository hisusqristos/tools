function toGrayscale(image: (HTMLImageElement | null), canvasRef: React.RefObject<HTMLCanvasElement | null>): (string | null) {
    if (!image) return null;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let pixels = imgData.data;
    for (var i = 0; i < pixels.length; i += 4) {

        let lightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;

        pixels[i] = lightness;
        pixels[i + 1] = lightness;
        pixels[i + 2] = lightness;
    };

    ctx.putImageData(imgData, 0, 0);
    
    return canvas.toDataURL()
};


export { toGrayscale }