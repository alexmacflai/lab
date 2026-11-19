import { capturePrint } from './print.js';

export function samplePrint(phase = 0) {
  const image = document.createElement('canvas'); image.width = 640; image.height = 480;
  const ctx = image.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 640, 480);
  gradient.addColorStop(0, '#fafafa'); gradient.addColorStop(1, '#aaa');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 640, 480);
  const x = 320 + Math.sin(phase) * 14;
  ctx.fillStyle = '#505050'; ctx.beginPath(); ctx.ellipse(x, 490, 170, 175, 0, 0, Math.PI * 2); ctx.fill();
  const face = ctx.createLinearGradient(x - 90, 0, x + 90, 0);
  face.addColorStop(0, '#777'); face.addColorStop(.7, '#ddd'); face.addColorStop(1, '#aaa');
  ctx.fillStyle = face; ctx.beginPath(); ctx.ellipse(x, 220, 89, 121, .05, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(x - 4, 124, 86, 34, -.1, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#454545'; ctx.fillRect(x - 50, 204, 22, 7); ctx.fillRect(x + 27, 204, 22, 7);
  ctx.fillStyle = '#858585'; ctx.beginPath(); ctx.moveTo(x, 210); ctx.lineTo(x - 13, 263); ctx.lineTo(x + 7, 263); ctx.fill();
  ctx.strokeStyle = '#555'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 20, 285); ctx.quadraticCurveTo(x, 296, x + 24, 284); ctx.stroke();
  return capturePrint(image, Math.floor(phase));
}
