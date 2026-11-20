import { libraryMaterial } from '../library-cards/material.js';

export function libraryComparison(papers) {
  const cases = [0, ...Array.from({ length: papers.length }, (_, i) => i).filter(i => libraryMaterial(papers[i], i) !== papers[i])];
  return { fit: true,
    description: 'Matched card surfaces with identical ink, lighting and placement. The approved materials keep most cards preserved, with occasional corner wear and gentle bends. Use Grid and solid ink to inspect the highlights on the ink.',
    papers: cases.flatMap(i => [{ ...papers[i], comparisonLabel: `${papers[i].name} · Original` },
      { ...libraryMaterial(papers[i], i), comparisonLabel: `${papers[i].name} · Approved${i === 0 ? ' (unchanged)' : ''}` }]) };
}
