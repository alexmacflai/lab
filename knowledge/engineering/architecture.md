---
kind: doc
description: The lab's stack, where each kind of file goes, the invariants it keeps and how Keyhole's values flow from input to image and sound.
verified: 2026-11-04
---

# Architecture

## Stack

- HTML, CSS and JavaScript in the browser, with no build step, framework or package manifest.
- Browser APIs by piece: 2D canvas in Pen Pals, WebGL and Web Audio in Keyhole.
- Micro-thoughts loads MediaPipe Tasks Vision 1.1.1 from a CDN when Camera mode is chosen.
- Pen Pals and Micro-thoughts load their fonts from Google Fonts.

## Layout

| Content | Path | Status |
|---|---|---|
| A piece's page | `<piece>/index.html` | In use |
| A piece's media | `<piece>/`, beside its page | In use: `keyhole/placeholder.mp4` |
| A piece's other code | `<piece>/` | Created when a piece is split to fit the [size limits](code-rules.md) |
| Agent guidance and project knowledge | `AGENTS.md`, `knowledge/`, `.agents/skills/` | In use |

Nothing shared between pieces belongs at the repository root.

## Invariants

### Pieces stand alone

- **Applies to:** every piece.
- **Why:** each one must be readable, changeable and showable alone.
- **How it is checked:** by review. No code enforces it.
- **Does not apply:** only if the user asks for shared code.

## Modules

Each piece is one module. Pieces do not depend on each other.

## Data flow

The other pieces have no flow worth recording yet. In Keyhole, the most involved one:

1. Wheel, touch and keyboard input feed a smoothed progress value `p`, or the automatic return moves it.
2. `derive(p)` turns `p` into every parameter through curves set in `CONFIG`.
3. The same frame draws the image and sets the audio gain and filter from those values.
