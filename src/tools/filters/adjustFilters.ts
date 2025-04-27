import { applySepia, applyVintage, applyNoir, applyCool, applyWarm, applyFaded, applyDramatic, applyPolaroid } from "./applyFilter";

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

  if (canvas.width !== image.width || canvas.height !== image.height) {
    canvas.width = image.width;
    canvas.height = image.height;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  if (filterType === 'none' || intensity === 0) {
    return generateDataURL ? canvas.toDataURL() : ctx;
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;

  const normalizedIntensity = intensity / 100;

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
      break;
  }

  ctx.putImageData(imageData, 0, 0);

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