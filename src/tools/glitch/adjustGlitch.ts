/**
 * Applies glitch effects to an image
 * @param image The source image to adjust
 * @param canvas The canvas element to draw on
 * @param rgbShiftAmount Amount of RGB channel shift (0-100)
 * @param scanlineAmount Intensity of scanline effect (0-100)
 * @param noiseAmount Amount of noise to apply (0-100)
 * @param blockAmount Amount of block displacement (0-100)
 * @param generateDataURL Whether to return a data URL (expensive operation)
 * @returns The canvas context or data URL if generateDataURL is true
 */
export function adjustGlitch(
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  rgbShiftAmount: number,
  scanlineAmount: number,
  noiseAmount: number,
  blockAmount: number,
  generateDataURL: boolean = false
): string | CanvasRenderingContext2D | null {
  if (!image || !canvas) return null;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  // Set canvas dimensions to match the image (only if needed)
  if (canvas.width !== image.width || canvas.height !== image.height) {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  // Skip processing if no adjustments are needed
  if (rgbShiftAmount === 0 && scanlineAmount === 0 && noiseAmount === 0 && blockAmount === 0) {
    // Just draw the original image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return generateDataURL ? canvas.toDataURL() : ctx;
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply RGB Shift effect
  if (rgbShiftAmount > 0) {
    applyRGBShift(ctx, image, rgbShiftAmount);
  } else {
    // If no RGB shift, just draw the original image once
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }

  // Get the image data to manipulate
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  
  // Apply scanlines effect
  if (scanlineAmount > 0) {
    applyScanlines(data, canvas.width, canvas.height, scanlineAmount);
  }
  
  // Apply noise effect
  if (noiseAmount > 0) {
    applyNoise(data, noiseAmount);
  }
  
  // Apply block displacement
  if (blockAmount > 0) {
    applyBlockDisplacement(data, canvas.width, canvas.height, blockAmount);
  }

  // Put the modified image data back on the canvas
  ctx.putImageData(imageData, 0, 0);
  
  // Return the data URL only if requested, otherwise return the context
  return generateDataURL ? canvas.toDataURL() : ctx;
}

/**
 * Applies RGB channel shifting effect
 */
function applyRGBShift(
  ctx: CanvasRenderingContext2D, 
  image: HTMLImageElement, 
  amount: number
): void {
  // Normalize amount to a reasonable pixel shift value (0-20 pixels)
  const shiftPixels = Math.floor((amount / 100) * 20);
  if (shiftPixels === 0) return;
  
  // Save current context state
  ctx.save();
  
  // Draw Red channel shifted to the right
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.7;
  ctx.drawImage(image, shiftPixels, 0);
  
  // Draw Blue channel shifted to the left
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.7;
  ctx.drawImage(image, -shiftPixels, 0);
  
  // Restore context state
  ctx.restore();
}

/**
 * Applies scanline effect
 */
function applyScanlines(
  data: Uint8ClampedArray, 
  width: number, 
  height: number,
  amount: number
): void {
  // Normalize amount (0-100) to scanline intensity
  const scanlineIntensity = amount / 100;
  // Every Nth row will be a scanline, based on amount
  const scanlineFrequency = Math.max(2, Math.floor((1 - scanlineIntensity) * 10) + 2);
  
  for (let y = 0; y < height; y++) {
    // Apply scanlines
    if (y % scanlineFrequency === 0) {
      const darkenAmount = 0.7 * scanlineIntensity;
      
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        data[i] = data[i] * (1 - darkenAmount); // Red
        data[i + 1] = data[i + 1] * (1 - darkenAmount); // Green
        data[i + 2] = data[i + 2] * (1 - darkenAmount); // Blue
        // Alpha remains unchanged
      }
    }
  }
}

/**
 * Applies noise effect
 */
function applyNoise(data: Uint8ClampedArray, amount: number): void {
  // Normalize amount (0-100) to noise intensity
  const noiseIntensity = amount / 100;
  
  for (let i = 0; i < data.length; i += 4) {
    // Only apply noise to some pixels randomly
    if (Math.random() < noiseIntensity * 0.3) {
      // Random noise value
      const noise = Math.random() * 255;
      
      // Apply noise to RGB channels
      data[i] = Math.min(255, data[i] + noise * noiseIntensity); // Red
      data[i + 1] = Math.min(255, data[i + 1] + noise * noiseIntensity); // Green
      data[i + 2] = Math.min(255, data[i + 2] + noise * noiseIntensity); // Blue
      // Alpha remains unchanged
    }
  }
}

/**
 * Applies block displacement effect
 */
function applyBlockDisplacement(
  data: Uint8ClampedArray, 
  width: number, 
  height: number,
  amount: number
): void {
  // Create a copy of the image data
  const tempData = new Uint8ClampedArray(data);
  
  // Normalize amount (0-100) to determine block size and displacement amount
  const maxBlockSize = Math.floor((amount / 100) * 30) + 1; // 1-30 pixels
  const numBlocks = Math.floor(amount / 10) + 1; // 1-10 blocks
  
  // Apply random block displacement
  for (let i = 0; i < numBlocks; i++) {
    // Random block position and size
    const blockX = Math.floor(Math.random() * width);
    const blockY = Math.floor(Math.random() * height);
    const blockWidth = Math.floor(Math.random() * maxBlockSize) + 5;
    const blockHeight = Math.floor(Math.random() * maxBlockSize) + 5;
    
    // Random displacement amount
    const displaceX = Math.floor(Math.random() * maxBlockSize * 2) - maxBlockSize;
    const displaceY = Math.floor(Math.random() * maxBlockSize * 2) - maxBlockSize;
    
    // Apply displacement to the block
    for (let y = blockY; y < blockY + blockHeight && y < height; y++) {
      for (let x = blockX; x < blockX + blockWidth && x < width; x++) {
        // Source pixel
        const srcX = x;
        const srcY = y;
        
        // Destination pixel with displacement
        const destX = x + displaceX;
        const destY = y + displaceY;
        
        // Check bounds
        if (destX >= 0 && destX < width && destY >= 0 && destY < height) {
          // Source and destination indices
          const srcIdx = (srcY * width + srcX) * 4;
          const destIdx = (destY * width + destX) * 4;
          
          // Copy pixel data
          data[destIdx] = tempData[srcIdx]; // Red
          data[destIdx + 1] = tempData[srcIdx + 1]; // Green
          data[destIdx + 2] = tempData[srcIdx + 2]; // Blue
          data[destIdx + 3] = tempData[srcIdx + 3]; // Alpha
        }
      }
    }
  }
} 