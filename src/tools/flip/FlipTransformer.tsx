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

    // Create a temporary canvas to store the current state
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    // Copy current canvas content to temp canvas
    tempCtx!.drawImage(canvas, 0, 0);

    // Clear the original canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate center of canvas for transform origin
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Reset any existing transforms
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Set up the transformation
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(
        flipH ? -1 * scaleX : scaleX,
        flipV ? -1 * scaleY : scaleY
    );
    ctx.translate(-centerX, -centerY);

    // Draw the temp canvas content with the applied transformation
    ctx.drawImage(tempCanvas, 0, 0);

    // Reset transform for future operations
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export default applyTransform