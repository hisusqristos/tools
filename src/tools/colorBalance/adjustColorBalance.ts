/**
 * Adjusts the color balance of an image by modifying RGB channels independently
 * @param image The source image to adjust
 * @param canvas The canvas element to draw on
 * @param redAdjust Value between -100 and 100 to adjust the red channel
 * @param greenAdjust Value between -100 and 100 to adjust the green channel
 * @param blueAdjust Value between -100 and 100 to adjust the blue channel
 * @param generateDataURL Whether to return a data URL (expensive operation)
 * @returns The canvas context or data URL if generateDataURL is true
 */
export function adjustColorBalance(
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  redAdjust: number,
  greenAdjust: number,
  blueAdjust: number,
  generateDataURL: boolean = false
): string | CanvasRenderingContext2D | null {
  if (!image || !canvas) return null;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Set canvas dimensions to match the image (only if needed)
  if (canvas.width !== image.width || canvas.height !== image.height) {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  // Draw the original image to the canvas
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  // Skip processing if no adjustments are needed
  if (redAdjust === 0 && greenAdjust === 0 && blueAdjust === 0) {
    return generateDataURL ? canvas.toDataURL() : ctx;
  }
  
  // Get the image data to manipulate
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert adjustment values from -100/+100 scale to actual pixel adjustments
  // Use a factor of 2.55 to convert percentage to 0-255 range
  const redFactor = redAdjust * 2.55;
  const greenFactor = greenAdjust * 2.55;
  const blueFactor = blueAdjust * 2.55;

  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    // Adjust each channel independently
    // Red channel
    data[i] = Math.max(0, Math.min(255, data[i] + redFactor));
    
    // Green channel
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + greenFactor));
    
    // Blue channel
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + blueFactor));
    
    // Alpha channel (i+3) remains unchanged
  }

  // Put the modified image data back on the canvas
  ctx.putImageData(imageData, 0, 0);
  
  // Return the data URL only if requested, otherwise return the context
  return generateDataURL ? canvas.toDataURL() : ctx;
} 