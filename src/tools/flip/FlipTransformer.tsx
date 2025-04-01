type TransformOptions = { flipH: boolean, flipV: boolean, rotation: number, scaleX: number, scaleY: number }

function applyTransform(ctx: CanvasRenderingContext2D, options: Partial<TransformOptions> = {}) {
    const canvas = ctx.canvas;

    // Default values
    const {
        flipH = false,
        flipV = false,
        rotation = 0,
        scaleX = 1,
        scaleY = 1
    } = options;

    const rad = (rotation * Math.PI) / 180;

    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    const normalizedRotation = ((rotation % 360) + 360) % 360;

    let newWidth = canvas.width;
    let newHeight = canvas.height;

    if (normalizedRotation === 90 || normalizedRotation === 270) {
        [newWidth, newHeight] = [canvas.height, canvas.width];
    }
    
    // Create a temporary canvas with updated dimensions
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = originalWidth;
    tempCanvas.height = originalHeight;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    // Copy current canvas content to temp canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Resize the original canvas to fit the new dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Clear and reset transformations
    ctx.clearRect(0, 0, newWidth, newHeight);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Calculate the center of the new bounding box
    const centerX = newWidth / 2;
    const centerY = newHeight / 2;

    // Translate to the new center, rotate, and scale
    ctx.translate(centerX, centerY);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 * scaleX : scaleX, flipV ? -1 * scaleY : scaleY);

    // Shift back by half of original dimensions to keep content centered
    ctx.drawImage(tempCanvas, -originalWidth / 2, -originalHeight / 2);

    // Reset transform for future operations
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export default applyTransform