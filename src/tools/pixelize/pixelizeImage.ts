function pixelizeImage(image: HTMLImageElement | null, canvasRef: React.RefObject<HTMLCanvasElement | null>, pixelSize: number): string | null {
  if (!image) return null;

  const canvas = canvasRef.current!;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixels = imgData.data;

  for (let y = 0; y < canvas.height; y += pixelSize) {
    for (let x = 0; x < canvas.width; x += pixelSize) {
      // Get the average color in the block
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          let px = x + dx;
          let py = y + dy;
          if (px < canvas.width && py < canvas.height) {
            let idx = (py * canvas.width + px) * 4;
            r += pixels[idx];
            g += pixels[idx + 1];
            b += pixels[idx + 2];
            count++;
          }
        }
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      // Set all pixels in the block to the average color
      for (let dy = 0; dy < pixelSize; dy++) {
        for (let dx = 0; dx < pixelSize; dx++) {
          let px = x + dx;
          let py = y + dy;
          if (px < canvas.width && py < canvas.height) {
            let idx = (py * canvas.width + px) * 4;
            pixels[idx] = r;
            pixels[idx + 1] = g;
            pixels[idx + 2] = b;
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL();
}

export default pixelizeImage;