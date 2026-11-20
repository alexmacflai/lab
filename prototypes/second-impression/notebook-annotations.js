function tile(ctx, atlas, cell, columns, rows, x, y, width, angle, mm) {
  const cellWidth = atlas.width / columns, cellHeight = atlas.height / rows;
  ctx.save(); ctx.translate(x * mm, y * mm); ctx.rotate(angle);
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(atlas, cell % columns * cellWidth, Math.floor(cell / columns) * cellHeight,
    cellWidth, cellHeight, 0, 0, width * mm, width * mm * cellHeight / cellWidth);
  ctx.restore();
}

export function drawNotebookNotes(ctx, noteAtlas, annotations, index, mm) {
  const note = (cell, x, y, width, angle) => tile(ctx, noteAtlas, cell % 20, 4, 5, x, y, width, angle, mm);
  const passage = (x, y, width, angle) => tile(ctx, annotations, (index + Math.floor(index / 8)) % 4, 2, 4, x, y, width, angle, mm);
  const doodle = (x, y, width, angle) => tile(ctx, annotations, 4 + index % 4, 2, 4, x, y, width, angle, mm);
  // The canvas is the surviving piece of a larger page: the renderer's torn
  // silhouette masks paragraphs, diagrams and marginal notes at the actual boundary.
  switch (index % 8) {
    case 0:
      note(index, 7, 14, 42, -.24); doodle(34, 49, 26, .18); break;
    case 1:
      note(index, 5, 9, 30, .26); note(index + 7, 29, 41, 30, -.32);
      doodle(3, 51, 23, -.08); break;
    case 2:
      passage(-19, -12, 108, -.09); break;
    case 3:
      passage(-42, 31, 109, -.19); note(index, 57, 7, 36, 1.30); break;
    case 4:
      doodle(7, 10, 43, -.16); note(index, 22, 55, 30, .31); break;
    case 5:
      passage(-14, -17, 119, .18); break;
    case 6:
      note(index, 3, 18, 37, -.35); note(index + 11, 36, 52, 35, .39);
      doodle(27, 3, 24, .12); break;
    default:
      passage(-35, -8, 115, -.13); doodle(35, 55, 31, .25); break;
  }
}
