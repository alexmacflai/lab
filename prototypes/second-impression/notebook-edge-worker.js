import { drawTornEdges } from './notebook-edge-proof.js';
import { recordEdgeRecipe } from './notebook-edge-recipe.js';

self.onmessage = ({ data: { width, height, seed, factory, widthMm } }) => {
  const recipe = recordEdgeRecipe(context => drawTornEdges(context,width,height,seed,factory,widthMm));
  self.postMessage(recipe,[recipe.values.buffer]);
};
