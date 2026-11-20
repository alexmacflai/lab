function path(c, points, close = false) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  if (close) c.closePath(); c.stroke();
}
function circle(c, x, y, radius, fill = false) {
  c.beginPath(); c.arc(x, y, radius, 0, Math.PI * 2); fill ? c.fill() : c.stroke();
}
function leaf(c, x = 0, y = 0) {
  c.beginPath(); c.moveTo(x - 10, y + 8); c.quadraticCurveTo(x - 15, y - 12, x + 12, y - 10);
  c.quadraticCurveTo(x + 16, y + 9, x - 10, y + 8); c.stroke(); path(c, [[x - 9, y + 7], [x + 7, y - 5]]);
}
const MARKS = {
  grocer(c) { leaf(c); path(c, [[-13, 12], [12, -11]]); },
  terminal(c) { c.strokeRect(-17, -11, 34, 22); c.fillRect(-17, -5, 34, 4); c.fillRect(-11, 5, 10, 2); },
  cafe(c) { path(c, [[-13, -5], [-10, 10], [9, 10], [12, -5]], true); circle(c, 14, 1, 5); path(c, [[-17, 14], [16, 14]]); path(c, [[-5, -11], [-8, -16], [-4, -21]]); },
  restaurant(c) { circle(c, 0, -14, 4); path(c, [[0, -10], [0, 16]]); path(c, [[-10, -3], [10, -3]]); c.beginPath(); c.arc(0, 1, 15, 0, Math.PI); c.stroke(); },
  hardware(c) { path(c, [[1, -19], [-13, 2], [-1, 2], [-5, 19], [14, -5], [2, -5]], true); },
  coupon(c) { path(c, [[-18, 0], [0, -17], [18, 0]]); path(c, [[-13, -3], [-13, 15], [13, 15], [13, -3]]); c.strokeRect(-4, 4, 8, 11); },
  books(c) { path(c, [[0, 14], [-17, 8], [-17, -14], [0, -7], [17, -14], [17, 8], [0, 14]], true); path(c, [[0, -7], [0, 14]]); },
  bakery(c) { path(c, [[-4, 17], [4, -18]]); for (let y = -12; y < 13; y += 7) { path(c, [[0, y], [-8, y - 6], [-8, y - 1], [0, y + 3]]); path(c, [[1, y], [10, y - 3], [8, y + 2], [0, y + 5]]); } },
  petrol(c) { c.beginPath(); c.moveTo(0, -19); c.bezierCurveTo(-24, 8, -11, 20, 0, 18); c.bezierCurveTo(19, 17, 17, 4, 0, -19); c.stroke(); },
  deli(c) { path(c, [[-15, 15], [13, -13]]); circle(c, -5, -5, 5); circle(c, 6, 6, 5); leaf(c, 6, -10); },
  pharmacy(c) { path(c, [[-5, -18], [5, -18], [5, -5], [18, -5], [18, 5], [5, 5], [5, 18], [-5, 18], [-5, 5], [-18, 5], [-18, -5], [-5, -5]], true); },
  florist(c) { for (let i = 0; i < 6; i++) circle(c, Math.cos(i * Math.PI / 3) * 10, Math.sin(i * Math.PI / 3) * 10, 6); circle(c, 0, 0, 4, true); },
  cinema(c) { c.strokeRect(-20, -14, 40, 28); for (let x = -15; x < 20; x += 8) { c.fillRect(x, -12, 4, 4); c.fillRect(x, 8, 4, 4); } path(c, [[-5, -5], [7, 0], [-5, 5]], true); },
  takeaway(c) { c.beginPath(); c.arc(0, -3, 18, 0, Math.PI); c.stroke(); path(c, [[-13, -7], [13, -7]]); path(c, [[-3, 11], [3, 11]]); path(c, [[-10, -19], [11, 9]]); path(c, [[-3, -23], [16, 5]]); },
  pizza(c) { path(c, [[-18, -12], [18, -12], [0, 20]], true); c.beginPath(); c.ellipse(0, -12, 18, 5, 0, Math.PI, 2 * Math.PI); c.stroke(); circle(c, -5, -2, 3); circle(c, 6, -4, 3); circle(c, 0, 9, 2); },
  fish(c) { c.beginPath(); c.ellipse(-2, 0, 16, 9, 0, 0, Math.PI * 2); c.stroke(); path(c, [[12, 0], [24, -11], [24, 11], [12, 0]]); circle(c, -9, -2, 1.5, true); },
  records(c) { circle(c, 0, 0, 19); circle(c, 0, 0, 14); circle(c, 0, 0, 8); circle(c, 0, 0, 2, true); path(c, [[12, -20], [24, -20], [24, 2], [14, 12]]); },
  garden(c) { path(c, [[0, 18], [0, -1]]); leaf(c, -7, -8); c.save(); c.scale(-1, 1); leaf(c, -7, 1); c.restore(); },
  pets(c) { c.beginPath(); c.ellipse(0, 8, 10, 8, 0, 0, Math.PI * 2); c.fill(); for (const [x, y] of [[-13, -4], [-5, -12], [5, -12], [13, -4]]) circle(c, x, y, 4, true); },
  repair(c) { circle(c, 0, 0, 13); circle(c, 0, 0, 5); for (let i = 0; i < 8; i++) { c.save(); c.rotate(i * Math.PI / 4); c.strokeRect(-3, -19, 6, 6); c.restore(); } },
  laundry(c) { path(c, [[-21, 12], [0, -2], [21, 12], [-21, 12]]); c.beginPath(); c.arc(0, -9, 6, Math.PI, 2.5 * Math.PI); c.stroke(); },
  barber(c) { circle(c, -10, 12, 6); circle(c, 10, 12, 6); path(c, [[-6, 8], [15, -18]]); path(c, [[6, 8], [-15, -18]]); circle(c, 0, 0, 2); },
  stationery(c) { path(c, [[-7, -19], [7, -19], [11, 5], [0, 20], [-11, 5]], true); path(c, [[0, 18], [0, 0]]); circle(c, 0, -3, 2); },
  museum(c) { path(c, [[-22, -10], [0, -22], [22, -10], [-22, -10]]); path(c, [[-23, 18], [23, 18]]); for (const x of [-14, 0, 14]) { c.strokeRect(x - 3, -6, 6, 20); } },
};
export function drawMark(ctx, family, x, y, size = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size, size); ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  MARKS[family]?.(ctx); ctx.restore();
}
