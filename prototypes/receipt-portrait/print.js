const WIDTH = 144;
const HEIGHT = 180;
const capture = document.createElement('canvas');
capture.width = WIDTH;
capture.height = HEIGHT;
const context = capture.getContext('2d', { willReadFrequently: true });
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function capturePrint(video, sequence, crop = null, mirrored = true) {
  const aspect = WIDTH / HEIGHT;
  let width = (video.videoWidth || video.width);
  let height = width / aspect;
  if (height > (video.videoHeight || video.height)) {
    height = (video.videoHeight || video.height);
    width = height * aspect;
  }
  if (crop) { height *= crop.height; width = height * aspect; }
  const left = Math.max(0, Math.min((video.videoWidth || video.width) - width,
    (crop?.x ?? .5) * (video.videoWidth || video.width) - width / 2));
  const top = Math.max(0, Math.min((video.videoHeight || video.height) - height,
    (crop?.y ?? .5) * (video.videoHeight || video.height) - height / 2));
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.save();
  if (mirrored) { context.translate(WIDTH, 0); context.scale(-1, 1); }
  context.drawImage(video, left, top, width, height, 0, 0, WIDTH, HEIGHT);
  context.restore();
  const pixels = context.getImageData(0, 0, WIDTH, HEIGHT);
  const ink = pixels.data;
  for (let y = 0; y < HEIGHT; y++) {
    const band = Math.sin(y * 1.9) * .018;
    for (let x = 0; x < WIDTH; x++) {
      const i = (y * WIDTH + x) * 4;
      const grey = (ink[i] * .299 + ink[i + 1] * .587 + ink[i + 2] * .114) / 255;
      const threshold = (bayer[(y % 4) * 4 + x % 4] + .5) / 16;
      const darkness = Math.max(0, Math.min(.94, (1 - grey - .12) * 1.3 + band));
      const coverage = ink[i + 3] / 255;
      ink[i] = 0; ink[i + 1] = 0; ink[i + 2] = 0;
      ink[i + 3] = darkness > threshold ? coverage * 255 : 0;
    }
  }
  const frame = document.createElement('canvas');
  frame.width = WIDTH; frame.height = HEIGHT;
  frame.getContext('2d').putImageData(pixels, 0, 0);
  return frame;
}
