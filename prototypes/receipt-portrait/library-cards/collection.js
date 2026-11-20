const TITLES = ['The wild garden', 'The secret agent', 'A book of birds', 'The sea around us',
  'Invisible cities', 'The waves', 'The wind in the willows', 'The machine stops',
  'The left hand of darkness', 'The return of the native', "If on a winter’s night a traveller",
  'The poetics of space', 'The phantom tollbooth', 'Persuasion', 'On growth and form',
  'A room of one’s own', 'The hobbit', 'The long goodbye', 'English journey', 'Coming up for air'];

async function card(index) {
  const image = new Image(); image.src = new URL(`assets/card-${String(index + 1).padStart(2, '0')}.jpg`, import.meta.url);
  await image.decode();
  const face = document.createElement('canvas'); face.width = 800; face.height = 1333;
  const sourceWidth = Math.min(image.naturalWidth, image.naturalHeight * .6), sourceHeight = sourceWidth / .6;
  face.getContext('2d').drawImage(image, (image.naturalWidth - sourceWidth) / 2, (image.naturalHeight - sourceHeight) / 2, sourceWidth, sourceHeight, 0, 0, 800, 1333);
  return { id: `library-${index + 1}`, name: TITLES[index], paperType: 'library-cards', ratio: 5 / 3,
    viewHeight: 1.84, cornerRadius: [.004, .008, .014, .02, .006][index % 5], edge: 'card', seed: 9101 + index * 71, tint: [1, 1, 1],
    surfaceRefined: true, creaseSharp: true, condition: index % 5 === 0 ? 'Lightly bent card' : 'Preserved card',
    folds: index % 5 === 0 ? [{ u: .78, v: .82, angle: .6, amplitude: .003, width: .045, length: .16 }] : [],
    bumps: [{ u: .48, v: .52, radius: .6, amplitude: .0015 + index % 4 * .0006 }],
    curl: .0007 + index % 5 * .0003, micro: .00002, phase: index * 1.13, mark: null,
    makeTexture: () => face };
}

export async function loadCards() { return Promise.all(TITLES.map((_, index) => card(index))); }
