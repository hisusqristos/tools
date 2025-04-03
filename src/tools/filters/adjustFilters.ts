/**
 * Apply various filters to an image
 * @param image The source image to adjust
 * @param canvas The canvas element to draw on
 * @param filterType The type of filter to apply
 * @param intensity The intensity of the filter (0-100)
 * @param generateDataURL Whether to return a data URL (expensive operation)
 * @returns The canvas context or data URL if generateDataURL is true
 */
export function adjustFilters(
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  filterType: FilterType,
  intensity: number = 100,
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
  // Skip processing if no filter is selected or intensity is 0
  if (filterType === 'none' || intensity === 0) {
    return generateDataURL ? canvas.toDataURL() : ctx;
  }

  // Get the image data to manipulate
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  
  // Scale intensity to 0-1 range
  const normalizedIntensity = intensity / 100;

  // Apply the selected filter
  switch (filterType) {
    case 'sepia':
      applySepia(data, normalizedIntensity);
      break;
    case 'vintage':
      applyVintage(data, normalizedIntensity);
      break;
    case 'noir':
      applyNoir(data, normalizedIntensity);
      break;
    case 'cool':
      applyCool(data, normalizedIntensity);
      break;
    case 'warm':
      applyWarm(data, normalizedIntensity);
      break;
    case 'faded':
      applyFaded(data, normalizedIntensity);
      break;
    case 'dramatic':
      applyDramatic(data, normalizedIntensity);
      break;
    case 'polaroid':
      applyPolaroid(data, normalizedIntensity);
      break;
    default:
      // No filter applied
      break;
  }

  // Put the modified image data back on the canvas
  ctx.putImageData(imageData, 0, 0);
  
  // Return the data URL only if requested, otherwise return the context
  return generateDataURL ? canvas.toDataURL() : ctx;
}

export type FilterType = 
  | 'none' 
  | 'sepia' 
  | 'vintage' 
  | 'noir' 
  | 'cool' 
  | 'warm'
  | 'faded'
  | 'dramatic'
  | 'polaroid';

export const filterInfo: Record<FilterType, { name: string, description: string }> = {
  none: { 
    name: 'None', 
    description: 'No filter applied' 
  },
  sepia: { 
    name: 'Sepia', 
    description: 'Classic warm brown tone for a vintage look' 
  },
  vintage: { 
    name: 'Vintage', 
    description: 'Faded colors with warm highlights' 
  },
  noir: { 
    name: 'Noir', 
    description: 'High contrast black and white for dramatic effect' 
  },
  cool: { 
    name: 'Cool', 
    description: 'Enhances blues for a cooler atmosphere' 
  },
  warm: { 
    name: 'Warm', 
    description: 'Enhances reds and yellows for a warmer feel' 
  },
  faded: { 
    name: 'Faded', 
    description: 'Reduced contrast and saturation for a faded look' 
  },
  dramatic: { 
    name: 'Dramatic', 
    description: 'Enhanced contrast and vibrance for a bold look' 
  },
  polaroid: { 
    name: 'Polaroid', 
    description: 'Classic polaroid camera style with vignette' 
  }
};

/**
 * Apply sepia filter
 */
function applySepia(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate sepia values
    const newR = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
    const newG = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
    const newB = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
    
    // Apply with intensity
    data[i] = r * (1 - intensity) + newR * intensity;
    data[i + 1] = g * (1 - intensity) + newG * intensity;
    data[i + 2] = b * (1 - intensity) + newB * intensity;
  }
}

/**
 * Apply vintage filter
 */
function applyVintage(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Vintage look: slightly faded, warmer highlights
    const newR = Math.min(255, r * 1.1);
    const newG = g * 0.9;
    const newB = b * 0.9;
    
    // Slight sepia-like tone
    const blendR = 0.8 * r + 0.2 * g;
    const blendG = 0.8 * g + 0.1 * r + 0.1 * b;
    const blendB = 0.8 * b + 0.2 * g;
    
    // Apply with intensity
    data[i] = r * (1 - intensity) + (newR * 0.7 + blendR * 0.3) * intensity;
    data[i + 1] = g * (1 - intensity) + (newG * 0.7 + blendG * 0.3) * intensity;
    data[i + 2] = b * (1 - intensity) + (newB * 0.7 + blendB * 0.3) * intensity;
  }
}

/**
 * Apply noir filter (high contrast black and white)
 */
function applyNoir(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to grayscale
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Increase contrast
    if (gray < 128) {
      gray = gray * (1 - 0.4 * intensity);
    } else {
      gray = gray + (255 - gray) * 0.4 * intensity;
    }
    
    // Apply with intensity
    data[i] = r * (1 - intensity) + gray * intensity;
    data[i + 1] = g * (1 - intensity) + gray * intensity;
    data[i + 2] = b * (1 - intensity) + gray * intensity;
  }
}

/**
 * Apply cool filter (enhance blues)
 */
function applyCool(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Enhance blues, reduce reds
    const newR = r * 0.9;
    const newG = g * 1.0;
    const newB = Math.min(255, b * 1.2);
    
    // Apply with intensity
    data[i] = r * (1 - intensity) + newR * intensity;
    data[i + 1] = g * (1 - intensity) + newG * intensity;
    data[i + 2] = b * (1 - intensity) + newB * intensity;
  }
}

/**
 * Apply warm filter (enhance reds/yellows)
 */
function applyWarm(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Enhance reds and yellows, reduce blues
    const newR = Math.min(255, r * 1.2);
    const newG = Math.min(255, g * 1.1);
    const newB = b * 0.8;
    
    // Apply with intensity
    data[i] = r * (1 - intensity) + newR * intensity;
    data[i + 1] = g * (1 - intensity) + newG * intensity;
    data[i + 2] = b * (1 - intensity) + newB * intensity;
  }
}

/**
 * Apply faded look filter
 */
function applyFaded(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Reduce contrast and saturation
    const avgColor = (r + g + b) / 3;
    const newR = r * 0.7 + avgColor * 0.3;
    const newG = g * 0.7 + avgColor * 0.3;
    const newB = b * 0.7 + avgColor * 0.3;
    
    // Slightly adjust levels
    const finalR = Math.min(255, newR * 0.9 + 20);
    const finalG = Math.min(255, newG * 0.9 + 20);
    const finalB = Math.min(255, newB * 0.9 + 20);
    
    // Apply with intensity
    data[i] = r * (1 - intensity) + finalR * intensity;
    data[i + 1] = g * (1 - intensity) + finalG * intensity;
    data[i + 2] = b * (1 - intensity) + finalB * intensity;
  }
}

/**
 * Apply dramatic filter (enhanced contrast)
 */
function applyDramatic(data: Uint8ClampedArray, intensity: number): void {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Enhance contrast significantly
    const enhanceContrast = (color: number) => {
      if (color < 128) {
        return color * (1 - 0.5 * intensity);
      } else {
        return color + (255 - color) * 0.5 * intensity;
      }
    };
    
    const newR = enhanceContrast(r);
    const newG = enhanceContrast(g);
    const newB = enhanceContrast(b);
    
    // Enhance saturation
    const avg = (newR + newG + newB) / 3;
    const finalR = Math.min(255, avg + (newR - avg) * 1.3);
    const finalG = Math.min(255, avg + (newG - avg) * 1.3);
    const finalB = Math.min(255, avg + (newB - avg) * 1.3);
    
    // Apply with intensity
    data[i] = r * (1 - intensity) + finalR * intensity;
    data[i + 1] = g * (1 - intensity) + finalG * intensity;
    data[i + 2] = b * (1 - intensity) + finalB * intensity;
  }
}

/**
 * Apply polaroid filter
 */
function applyPolaroid(data: Uint8ClampedArray, intensity: number, width?: number, height?: number): void {
  // Calculate the dimensions to apply vignette if provided
  let w = width || Math.sqrt(data.length / 4);
  let h = height || (data.length / 4) / w;
  
  const centerX = w / 2;
  const centerY = h / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      
      // Skip if out of bounds
      if (i >= data.length) continue;
      
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Apply warmth and reduced contrast
      const newR = Math.min(255, r * 1.1);
      const newG = g * 1.0;
      const newB = b * 0.9;
      
      // Apply vignette effect (darker corners)
      const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const vignetteAmount = Math.pow(1 - distanceFromCenter / maxDistance, 1.5) * 0.8 + 0.2;
      
      const finalR = newR * vignetteAmount;
      const finalG = newG * vignetteAmount;
      const finalB = newB * vignetteAmount;
      
      // Apply with intensity
      data[i] = r * (1 - intensity) + finalR * intensity;
      data[i + 1] = g * (1 - intensity) + finalG * intensity;
      data[i + 2] = b * (1 - intensity) + finalB * intensity;
    }
  }
} 