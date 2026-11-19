import { capturePrint } from './print.js';

export async function samplePrint() {
  const image = new Image(); image.src = 'sample-portrait.png'; await image.decode();
  const frame = document.createElement('canvas'); frame.width = 640; frame.height = 800;
  const ctx = frame.getContext('2d');
  // Remove the supplied frame's letterbox bars and centre the portrait on the face.
  const sourceHeight = image.naturalHeight - 22, sourceWidth = sourceHeight * .8;
  const left = Math.max(0, Math.min(image.naturalWidth - sourceWidth,
    image.naturalWidth * .43 - sourceWidth / 2));
  // capturePrint mirrors camera input; pre-mirror this still to retain its orientation.
  ctx.translate(frame.width, 0); ctx.scale(-1, 1);
  ctx.drawImage(image, left, 7, sourceWidth, sourceHeight, 0, 0, frame.width, frame.height);
  return capturePrint(frame, 0);
}
