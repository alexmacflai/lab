import { libraryMaterial } from './material.js';

const TITLES = ['The wild garden', 'The secret agent', 'A book of birds', 'The sea around us',
  'Invisible cities', 'The waves', 'The wind in the willows', 'The machine stops',
  'The left hand of darkness', 'The return of the native', "If on a winter’s night a traveller",
  'The poetics of space', 'The phantom tollbooth', 'Persuasion', 'On growth and form',
  'A room of one’s own', 'The hobbit', 'The long goodbye', 'English journey', 'Coming up for air',
  "The country diary of an Edwardian lady", "The little prince",
  "The stone of heaven", "The railway children",
  "The book of the sea", "The art of memory",
  "A natural history of the hedgerow", "The moonstone",
  "The hidden life of trees", "Pilgrim at Tinker Creek",
  "The Odyssey", "The language of cities",
  "The once and future king", "An introduction to astronomy",
  "The journal of a disappointed man", "The collected poems",
  "The living mountain", "The architecture of happiness",
  "A sand county almanac", "The island of the day before"];

async function card(index) {
  const image = new Image(); image.src = new URL(`assets/card-${String(index + 1).padStart(2, '0')}.webp`, import.meta.url);
  await image.decode();
  return { id: `library-${index + 1}`, name: TITLES[index], paperType: 'library-cards', ratio: 5 / 3,
    viewHeight: 1.84, cornerRadius: [.004, .008, .014, .02, .006][index % 5], edge: 'card', seed: 9101 + index * 71, tint: [1, 1, 1],
    surfaceRefined: true, creaseSharp: true, condition: index % 5 === 0 ? 'Lightly bent card' : 'Preserved card',
    folds: index % 5 === 0 ? [{ u: .78, v: .82, angle: .6, amplitude: .003, width: .045, length: .16 }] : [],
    bumps: [{ u: .48, v: .52, radius: .6, amplitude: .0015 + index % 4 * .0006 }],
    curl: .0007 + index % 5 * .0003, micro: .00002, phase: index * 1.13, mark: null,
    makeTexture: () => image };
}

export async function loadCards() { return (await Promise.all(TITLES.map((_, index) => card(index)))).map(libraryMaterial); }
