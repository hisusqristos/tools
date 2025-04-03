/**
 * Adjusts the brightness and contrast of an image
 * @param image The source image to adjust
 * @param canvas The canvas element to draw on
 * @param brightness Value between -100 and 100 to adjust brightness
 * @param contrast Value between -100 and 100 to adjust contrast
 * @param generateDataURL Whether to return a data URL (expensive operation)
 * @returns The canvas context or data URL if generateDataURL is true
 */
export function adjustBrightness(
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  brightness: number,
  contrast: number,
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

  // Draw the original image to the canvas
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  // Skip processing if no adjustments are needed
  if (brightness === 0 && contrast === 0) {
    return generateDataURL ? canvas.toDataURL() : ctx;
  }
  
  // Get the image data to manipulate
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  
  // Convert brightness from -100/100 scale to a multiplier
  // 0 = no change, -100 = completely dark, 100 = much brighter
  const brightnessAdjust = brightness / 100;
  
  // Convert contrast from -100/100 scale to a multiplier
  // 0 = no change, negative = less contrast, positive = more contrast
  const contrastFactor = (contrast + 100) / 100; // 0-2 range where 1 is no change
  
  // Calculate contrast correction factor
  // This is the value that needs to be subtracted from each pixel to maintain average brightness
  const contrastCorrection = 128 * (1 - contrastFactor);
  
  // Process each pixel
  for (let i = 0; i < data.length; i += 4) {
    // For brightness: add a fixed value to each channel
    // For contrast: multiply by a factor and adjust to maintain average brightness
    
    // Apply to Red channel
    data[i] = Math.max(0, Math.min(255, 
      applyContrast(
        applyBrightness(data[i], brightnessAdjust), 
        contrastFactor, 
        contrastCorrection
      )
    ));
    
    // Apply to Green channel
    data[i + 1] = Math.max(0, Math.min(255, 
      applyContrast(
        applyBrightness(data[i + 1], brightnessAdjust), 
        contrastFactor, 
        contrastCorrection
      )
    ));
    
    // Apply to Blue channel
    data[i + 2] = Math.max(0, Math.min(255, 
      applyContrast(
        applyBrightness(data[i + 2], brightnessAdjust), 
        contrastFactor, 
        contrastCorrection
      )
    ));
    
    // Alpha channel (i+3) remains unchanged
  }

  // Put the modified image data back on the canvas
  ctx.putImageData(imageData, 0, 0);
  
  // Return the data URL only if requested, otherwise return the context
  return generateDataURL ? canvas.toDataURL() : ctx;
}

/**
 * Apply brightness adjustment to a pixel value
 */
function applyBrightness(pixel: number, brightness: number): number {
  if (brightness > 0) {
    // For positive brightness, scale up to 255
    return pixel + (255 - pixel) * brightness;
  } else if (brightness < 0) {
    // For negative brightness, scale down to 0
    return pixel * (1 + brightness);
  }
  return pixel; // No change if brightness is 0
}

/**
 * Apply contrast adjustment to a pixel value
 */
function applyContrast(pixel: number, contrastFactor: number, contrastCorrection: number): number {
  return pixel * contrastFactor + contrastCorrection;
} 