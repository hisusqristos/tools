import canvas, { createCanvas } from "canvas";
import { JSX } from "react";

const DownloadButton = (props: { color: string }): JSX.Element =>
(<div>
  <button onClick={() => { download(props.color) }}>
    Download
  </button>
</div>)

const download = (color: string) => {
  // to test
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  ctx.fillText("ekav?", 50, 100)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ///////
  const ImageURL = canvas.toDataURL('image/png');

  const a = document.createElement('a');
  a.href = ImageURL;
  a.download = 'edited-image.png';
  a.click();
}

export default DownloadButton