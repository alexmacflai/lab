// Approved physical card surfaces, shared by the regular and development views.
const WEAR = new Map([[2, 0], [6, 3], [10, 1], [14, 2], [18, 0], [22, 1], [25, 2], [29, 3], [34, 0], [38, 1]]);
const BENDS = new Map([[4, 'corner'], [11, 'right'], [17, 'left'], [24, 'corner'], [31, 'left'], [37, 'right']]);

function cornerDistances(u, v, ratio, corner) {
  return [corner % 2 ? 1 - u : u, (corner > 1 ? 1 - v : v) * ratio];
}

function wornPoint(paper, corner) {
  return (u, v, point) => {
    const [x, y] = cornerDistances(u, v, paper.ratio, corner), radius = .028;
    if (x < radius && y < radius) {
      const cut = radius - Math.sqrt(Math.max(0, radius ** 2 - (radius - y) ** 2));
      point[0] += (corner % 2 ? -1 : 1) * Math.max(0, cut - x) * .75;
    }
    // A compressed corner, confined to the last few millimetres of stock.
    point[2] += .0014 * Math.exp(-(x * x + y * y) / .0018);
    return point;
  };
}

function bentPoint(paper, kind) {
  return (u, v, point) => {
    let distance, envelope = 1;
    if (kind === 'corner') {
      const [x, y] = cornerDistances(u, v, paper.ratio, 3);
      distance = .28 - x - y;
    } else {
      distance = .29 - (kind === 'right' ? 1 - u : u);
      envelope = Math.exp(-Math.pow((v - .51) * paper.ratio / .28, 4));
    }
    // A soft hinge leading to a lifted flap, not a repeating height field.
    if (distance > 0) {
      const lift = distance * distance / (distance + .018) * envelope;
      point[2] += .13 * lift;
      point[0] += (kind === 'left' ? 1 : -1) * .008 * lift;
      if (kind === 'corner') point[1] += .008 * lift;
    }
    return point;
  };
}

function wornTexture(paper, corner) {
  let texture;
  return () => {
    if (texture) return texture;
    const source = paper.makeTexture(); texture = document.createElement('canvas');
    texture.width = source.width; texture.height = source.height;
    const ctx = texture.getContext('2d'); ctx.drawImage(source, 0, 0);
    ctx.translate(corner % 2 ? texture.width : 0, corner > 1 ? texture.height : 0);
    ctx.scale(corner % 2 ? -1 : 1, corner > 1 ? -1 : 1);
    for (let i = 0; i < 18; i++) {
      const t = i * 1.618 + paper.seed;
      ctx.strokeStyle = i % 3 ? 'rgba(249,245,231,.38)' : 'rgba(114,102,82,.13)';
      ctx.lineWidth = .35 + (Math.sin(t) + 1) * .3;
      const x = 3 + i * 1.1, y = .6 + (Math.cos(t * 2.3) + 1) * 1.1;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 1 + (Math.sin(t) + 1) * 2, y + .8); ctx.stroke();
    }
    return texture;
  };
}

export function libraryMaterial(paper, index) {
  if (WEAR.has(index)) {
    const corner = WEAR.get(index);
    return { ...paper, originalMaterial: paper, condition: 'Light corner wear', surfacePoint: wornPoint(paper, corner), makeTexture: wornTexture(paper, corner) };
  }
  if (BENDS.has(index)) return { ...paper, originalMaterial: paper, condition: 'Gentle card bend', surfacePoint: bentPoint(paper, BENDS.get(index)) };
  return paper;
}

