const WIDTH = 144;
const HEIGHT = 180;
const capture = document.createElement('canvas');
capture.width = WIDTH;
capture.height = HEIGHT;
const context = capture.getContext('2d', { willReadFrequently: true });
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function capturePrint(video, sequence) {
  const aspect = WIDTH / HEIGHT;
  let width = (video.videoWidth || video.width);
  let height = width / aspect;
  if (height > (video.videoHeight || video.height)) {
    height = (video.videoHeight || video.height);
    width = height * aspect;
  }
  context.save();
  context.translate(WIDTH, 0);
  context.scale(-1, 1);
  context.drawImage(video, ((video.videoWidth || video.width) - width) / 2,
    ((video.videoHeight || video.height) - height) / 2, width, height, 0, 0, WIDTH, HEIGHT);
  context.restore();
  const pixels = context.getImageData(0, 0, WIDTH, HEIGHT);
  const ink = pixels.data;
  for (let y = 0; y < HEIGHT; y++) {
    const band = Math.sin(y * 1.9 + sequence * .3) * .025;
    for (let x = 0; x < WIDTH; x++) {
      const i = (y * WIDTH + x) * 4;
      const grey = (ink[i] * .299 + ink[i + 1] * .587 + ink[i + 2] * .114) / 255;
      const threshold = (bayer[(y % 4) * 4 + x % 4] + .5) / 16;
      const darkness = Math.max(0, Math.min(.94, (1 - grey - .12) * 1.3 + band));
      ink[i] = 38; ink[i + 1] = 34; ink[i + 2] = 29;
      ink[i + 3] = darkness > threshold ? 205 + ((x * 17 + y * 13) % 50) : 0;
    }
  }
  const frame = document.createElement('canvas');
  frame.width = WIDTH; frame.height = HEIGHT;
  frame.getContext('2d').putImageData(pixels, 0, 0);
  return frame;
}
