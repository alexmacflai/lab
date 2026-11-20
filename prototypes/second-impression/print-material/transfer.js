// Broad dry-transfer structure is sampled rather than synthesised per screen pixel.
export const TRANSFER = `
uniform sampler2D uTransferFilm;
float proofBlotch(vec2 mm) {
  float angle=uProofSeed*2.399963;
  mat2 rotation=mat2(cos(angle),sin(angle),-sin(angle),cos(angle));
  // An 80 mm reference tile at 0.5 scale: 40 mm; do not scale its layers twice.
  vec2 p=rotation*mm/40.+vec2(fract(uProofSeed*.137),fract(uProofSeed*.719));
  float worn=texture(uTransferFilm,p).r;
  float edge=max(fwidth(worn)*.6,.025);
  return smoothstep(.20-edge,.55+edge,worn);
}
`;
