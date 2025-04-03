/**
 * Applies a watermark (text or image) to an image
 * @param image The source image
 * @param canvas The canvas element to draw on
 * @param options Watermark styling and positioning options
 * @param generateDataURL Whether to return a data URL (expensive operation)
 * @returns The canvas context or data URL if generateDataURL is true
 */
export function adjustWatermark(
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  options: WatermarkOptions,
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

  // Clear the canvas and draw the original image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Apply transparency to the context for watermark
  ctx.globalAlpha = options.opacity / 100;

  // Switch based on watermark type
  if (options.type === 'text' && options.text) {
    applyTextWatermark(ctx, canvas.width, canvas.height, options);
  } else if (options.type === 'image' && options.image) {
    applyImageWatermark(ctx, canvas.width, canvas.height, options);
  }

  // Reset opacity
  ctx.globalAlpha = 1;

  // Return the data URL only if requested, otherwise return the context
  return generateDataURL ? canvas.toDataURL() : ctx;
}

/**
 * Apply text watermark to canvas
 */
function applyTextWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  options: WatermarkOptions
) {
  if (options.type !== 'text' || !options.text) return;

  // Apply text styling with defaults for potentially undefined values
  ctx.font = `${options.textStyle || 'normal'} ${options.textSize || 24}px ${options.textFont || 'Arial'}`;
  ctx.fillStyle = options.textColor || '#ffffff';
  ctx.textAlign = options.textAlign || 'right' as CanvasTextAlign;

  // Calculate text position
  const { x, y } = calculatePosition(
    options.position,
    canvasWidth,
    canvasHeight,
    options.textSize || 24, // Default text size
    ctx.measureText(options.text).width,
    options.padding
  );

  // Draw the text
  ctx.fillText(options.text, x, y);
}

/**
 * Apply image watermark to canvas
 */
function applyImageWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  options: WatermarkOptions
) {
  if (options.type !== 'image' || !options.image) return;

  // Calculate image size while maintaining aspect ratio
  const { width, height } = calculateImageSize(
    options.image,
    (options.imageSize || 20) / 100, // Convert percentage to decimal, default 20%
    canvasWidth,
    canvasHeight
  );

  // Calculate position
  const { x, y } = calculatePosition(
    options.position,
    canvasWidth,
    canvasHeight,
    height,
    width,
    options.padding
  );

  // Draw the image
  ctx.drawImage(options.image, x, y, width, height);
}

/**
 * Calculate position based on watermark position and canvas dimensions
 */
function calculatePosition(
  position: WatermarkPosition,
  canvasWidth: number,
  canvasHeight: number,
  height: number,
  width: number,
  padding: number
): { x: number; y: number } {
  let x: number, y: number;

  switch (position) {
    case 'topLeft':
      x = padding;
      y = padding + height / 2;
      break;

    case 'topCenter':
      x = canvasWidth / 2;
      y = padding + height / 2;
      break;

    case 'topRight':
      x = canvasWidth - padding;
      y = padding + height / 2;
      break;

    case 'centerLeft':
      x = padding;
      y = canvasHeight / 2;
      break;

    case 'center':
      x = canvasWidth / 2;
      y = canvasHeight / 2;
      break;

    case 'centerRight':
      x = canvasWidth - padding;
      y = canvasHeight / 2;
      break;

    case 'bottomLeft':
      x = padding;
      y = canvasHeight - padding - height / 2;
      break;

    case 'bottomCenter':
      x = canvasWidth / 2;
      y = canvasHeight - padding - height / 2;
      break;

    case 'bottomRight':
    default:
      x = canvasWidth - padding;
      y = canvasHeight - padding - height / 2;
      break;
  }

  return { x, y };
}

/**
 * Calculate image dimensions while maintaining aspect ratio
 */
function calculateImageSize(
  image: HTMLImageElement,
  sizePercentage: number,
  canvasWidth: number,
  canvasHeight: number
): { width: number; height: number } {
  // Base size on the smaller dimension of the canvas
  const maxSize = Math.min(canvasWidth, canvasHeight) * sizePercentage;

  // Calculate dimensions that maintain aspect ratio
  const aspectRatio = image.width / image.height;
  let width: number, height: number;

  if (aspectRatio >= 1) {
    // Wider image
    width = maxSize;
    height = maxSize / aspectRatio;
  } else {
    // Taller image
    height = maxSize;
    width = maxSize * aspectRatio;
  }

  return { width, height };
}

// Types and constants
export type WatermarkType = 'text' | 'image';
export type TextAlign = 'left' | 'center' | 'right';
export type WatermarkPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerLeft'
  | 'center'
  | 'centerRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

export interface WatermarkOptions {
  type: WatermarkType;
  position: WatermarkPosition;
  opacity: number; // 0-100
  padding: number; // pixels from edge

  // Text watermark options
  text?: string;
  textFont?: string;
  textSize?: number;
  textColor?: string;
  textStyle?: string;
  textAlign?: TextAlign;

  // Image watermark options
  image?: HTMLImageElement;
  imageSize?: number; // 0-100 (percentage of canvas)
}

export const fontOptions = [
  'Arial',
  'Verdana',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Impact'
];

export const fontStyleOptions = ['normal', 'italic', 'bold', 'bold italic'];

export const defaultWatermarkOptions: WatermarkOptions = {
  type: 'text',
  position: 'bottomRight',
  opacity: 70,
  padding: 20,
  text: '© Copyright',
  textFont: 'Arial',
  textSize: 24,
  textColor: '#ffffff',
  textStyle: 'bold',
  textAlign: 'right',
  imageSize: 20 // 20% of the smallest canvas dimension
}; 