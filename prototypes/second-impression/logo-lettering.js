// Shared drawing operations, not identity templates. Every merchant authors its
// own wording, face, proportions, placement and treatment in the collection files.
export const word = (value, x, y, font, align = 'center') => c => {
  c.font = font; c.textAlign = align; c.fillText(value, x, y);
};
export const spaced = (value, x, y, font, gap) => c => {
  c.font = font; c.textAlign = 'left';
  const letters = [...value], widths = letters.map(letter => c.measureText(letter).width);
  let cursor = x - (widths.reduce((sum, width) => sum + width, 0) + gap * (letters.length - 1)) / 2;
  letters.forEach((letter, i) => { c.fillText(letter, cursor, y); cursor += widths[i] + gap; });
};
export const rule = (x, y, width, height = 2) => c => c.fillRect(x, y, width, height);
export const oval = (x, y, rx, ry, tone = 1) => c => {
  c.save(); c.globalAlpha = tone; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); c.restore();
};
export const reverse = (x, y, width, height, commands) => c => {
  c.fillRect(x, y, width, height);
  c.save(); c.globalCompositeOperation = 'destination-out'; commands.forEach(command => command(c)); c.restore();
};
export const identity = (direction, ...commands) => ({
  direction, draw: c => commands.forEach(command => command(c)),
});
