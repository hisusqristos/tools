const handleDownload = (ctx: CanvasRenderingContext2D | null) => {
    const imageUrl = ctx!.canvas.toDataURL()
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = "edited-image.png";
    a.click()
};

export default handleDownload