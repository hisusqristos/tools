/**
 * Adds text overlay to an image
 * @param image The source image
 * @param canvas The canvas element to draw on
 * @param text The text to overlay
 * @param options Text styling and positioning options
 * @param generateDataURL Whether to return a data URL (expensive operation)
 * @returns The canvas context or data URL if generateDataURL is true
 */
export function adjustText(
  image: HTMLImageElement | null,
  canvas: HTMLCanvasElement | null,
  text: string,
  options: TextOptions,
  generateDataURL: boolean = false
): string | CanvasRenderingContext2D | null {
  if (!image || !canvas || !text.trim()) return null;

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
  
  // If no text is provided, just return the original image
  if (!text.trim()) {
    return generateDataURL ? canvas.toDataURL() : ctx;
  }

  // Apply text styling
  ctx.font = `${options.fontStyle} ${options.fontSize}px ${options.fontFamily}`;
  ctx.fillStyle = options.color;
  ctx.textAlign = options.textAlign;
  ctx.textBaseline = 'middle';
  
  // Calculate text position
  const x = calculateXPosition(options.textAlign, options.position.x, canvas.width);
  const y = calculateYPosition(options.position.y, canvas.height);

  // Calculate text metrics for highlight
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = options.fontSize * 1.2; // Approximate text height
  
  // Apply highlight if enabled
  if (options.effects.highlight) {
    ctx.save();
    
    // Set highlight color
    ctx.fillStyle = options.effects.highlightColor || '#ffff00';
    
    // Calculate highlight rectangle based on text alignment
    let highlightX = x;
    if (options.textAlign === 'center') {
      highlightX = x - textWidth / 2;
    } else if (options.textAlign === 'right') {
      highlightX = x - textWidth;
    }
    
    // Draw highlight rectangle behind text
    ctx.fillRect(
      highlightX, 
      y - textHeight / 2, 
      textWidth, 
      textHeight
    );
    
    ctx.restore();
    
    // Reset fill style to text color after highlight
    ctx.fillStyle = options.color;
  }

  // Apply text effects
  if (options.effects.shadow) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  
  if (options.effects.outline) {
    // Draw text stroke for outline effect
    ctx.strokeStyle = options.effects.outlineColor || 'black';
    ctx.lineWidth = options.effects.outlineWidth || 2;
    ctx.strokeText(text, x, y);
  }
  
  // Draw the text
  ctx.fillText(text, x, y);
  
  // Reset shadow settings
  ctx.shadowColor = 'rgba(0, 0, 0, 0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Return the data URL only if requested, otherwise return the context
  return generateDataURL ? canvas.toDataURL() : ctx;
}

/**
 * Calculate X position based on text alignment and relative position
 */
function calculateXPosition(
  align: TextAlign, 
  positionX: number, 
  canvasWidth: number
): number {
  // positionX is expected to be between 0-100 (percentage of canvas width)
  const x = (positionX / 100) * canvasWidth;
  
  // Adjust based on text alignment
  switch (align) {
    case 'center':
      return x;
    case 'right':
      return x;
    case 'left':
    default:
      return x;
  }
}

/**
 * Calculate Y position based on relative position
 */
function calculateYPosition(positionY: number, canvasHeight: number): number {
  // positionY is expected to be between 0-100 (percentage of canvas height)
  return (positionY / 100) * canvasHeight;
}

export interface TextOptions {
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  color: string;
  textAlign: TextAlign;
  position: {
    x: number; // 0-100 (percentage of canvas width)
    y: number; // 0-100 (percentage of canvas height)
  };
  effects: {
    shadow: boolean;
    outline: boolean;
    outlineColor?: string;
    outlineWidth?: number;
    highlight: boolean;
    highlightColor?: string;
  };
}

export type TextAlign = 'left' | 'center' | 'right';

export const fontOptions = [
  'Arial', 
  'Verdana', 
  'Helvetica', 
  'Times New Roman', 
  'Courier New', 
  'Georgia', 
  'Palatino', 
  'Impact', 
  'Comic Sans MS', 
  'Trebuchet MS'
];

export const fontStyleOptions = [
  'normal', 
  'italic', 
  'bold', 
  'bold italic'
];

export const defaultTextOptions: TextOptions = {
  fontFamily: 'Arial',
  fontSize: 30,
  fontStyle: 'bold',
  color: '#ffffff',
  textAlign: 'center',
  position: {
    x: 50, // center of image horizontally
    y: 50  // center of image vertically
  },
  effects: {
    shadow: true,
    outline: true,
    outlineColor: '#000000',
    outlineWidth: 2,
    highlight: false,
    highlightColor: '#ffff00'
  }
}; 