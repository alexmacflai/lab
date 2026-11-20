export const PROFILES = [
  { id: 'clean', name: 'Well printed', description: 'Crisp dots, dense black, almost no feathering.', ink: [.025, 0, 0, 0], grain: .18 },
  { id: 'ordinary', name: 'Ordinary', description: 'Fine grain and restrained, irregular edge spread.', ink: [.10, .08, .10, 0], grain: 1 },
  { id: 'patchy', name: 'Weak transfer', description: 'Broad thin deposits with porous, broken coverage.', ink: [.06, .88, .05, 0], grain: 1 },
  { id: 'bleed', name: 'Moderate bleed', description: 'Uneven fibre-led spread; some dots merge.', ink: [.28, .08, .10, 0], grain: .85 },
  { id: 'heavy', name: 'Rare heavy bleed', description: 'Strong spreading confined to a few local patches.', ink: [.75, .15, .12, 0], grain: .65, rare: true },
  { id: 'combined', name: 'Weak transfer + bleed', description: 'Porous weak deposits with spreading around their ink.', ink: [.32, .88, .12, 0], grain: 1 },
  { id: 'contact', name: 'Fold-related transfer', description: 'Sharper raised contact; thin, softer deposits in recesses.', ink: [.08, .08, .95, 0], grain: .65 },
  { id: 'smear', name: 'Ridge smear', description: 'A short feed-direction drag near raised creases.', ink: [.12, .10, .25, .85], grain: .8 },
];
