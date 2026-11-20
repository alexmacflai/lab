import { seeded } from './receipts.js';
import { FACTORY_EDGES } from './notebook-shapes.js';

// Authored tear trajectories: long hesitant pulls, changes of direction and
// local catches. Depths are fractions of sheet width, not repeating edge noise.
const TRAJECTORIES = [
  [[0,.008],[.16,.012],[.3,.052],[.47,.025],[.62,.012],[.79,.018],[1,.024]],
  [[0,.065],[.13,.045],[.29,.02],[.46,.012],[.63,.028],[.76,.018],[.9,.011],[1,.02]],
  [[0,.01],[.22,.014],[.37,.027],[.51,.017],[.67,.051],[.83,.068],[1,.045]],
  [[0,.018],[.17,.036],[.32,.055],[.53,.028],[.71,.014],[.86,.021],[1,.038]],
  [[0,.035],[.19,.055],[.38,.03],[.56,.015],[.72,.024],[.84,.01],[1,.014]],
  [[0,.018],[.12,.01],[.29,.028],[.45,.016],[.61,.023],[.8,.056],[1,.068]],
];

function trajectory(points, t) {
  let i = 0;
  while (i < points.length - 2 && points[i + 1][0] < t) i++;
  const [a, y] = points[i], [b, z] = points[i + 1];
  const f = Math.max(0, Math.min(1, (t - a) / (b - a)));
  // Limited easing leaves distinct changes of pull direction without sharp teeth.
  const blend = .65 * f + .35 * f * f * (3 - 2 * f);
  return y * (1 - blend) + z * blend;
}

export function referenceTearShape(index, seed, ratio) {
  const random = seeded(seed + 3761), factory = FACTORY_EDGES[index];
  const paths = Array.from({ length: 4 }, (_, side) => ({
    points: TRAJECTORIES[(index + side * 2) % TRAJECTORIES.length],
    catches: Array.from({ length: 7 }, () => ({
      t: .08 + random() * .84, width: .015 + random() * .035, depth: (random() - .45) * .008,
    })),
  }));
  const inset = (t, side) => {
    if (factory[side]) return 0;
    const path = paths[side];
    return trajectory(path.points, t) + path.catches.reduce((sum, catchPoint) => {
      const distance = Math.abs(t - catchPoint.t) / catchPoint.width;
      return sum + (distance < 1 ? catchPoint.depth * (1 - distance) ** 2 : 0);
    }, 0);
  };
  return (u, v, point) => {
    // A linear perimeter remapping stays monotone even at the deepest tear.
    // Its extent is bounded; the centre and the existing fold heights are unchanged.
    const weight = d => Math.max(0, 1 - d / .13);
    point[0] += weight(u) * inset(v, 0) - weight(1 - u) * inset(v, 1);
    point[1] -= weight(v * ratio) * inset(u, 2);
    point[1] += weight((1 - v) * ratio) * inset(u, 3);
    return point;
  };
}
