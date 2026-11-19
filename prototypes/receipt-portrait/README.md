---
title: Receipt Portrait
description: A delayed camera portrait printed onto a collection of 100 folded paper receipts.
date: 2026-11-18
---

# Receipt Portrait

A collection of 100 authored receipts across 24 design families, including the original six reference receipts. Headers use original pictograms, seals, reverse-print panels and varied wordmarks. Paper conditions range from pristine to pocket-crumpled, with damage fixed per ticket. Thirty-three tickets carry a stain, stroke, note or doodle, including seven coffee stains roughly as wide as the receipt. Notes and eight different doodles use generated scanned-style textures rather than fonts or geometric icons. Each entry has its own transaction, layout settings, stock and edges. Dry-transfer footprints and their torn edge detail are evaluated directly in paper coordinates, using local contact and ink coverage instead of a low-resolution grunge bitmap. Each frame independently varies its neutral-black ink: most prints are clean or lightly textured, with occasional weak transfer, stronger bleed or fold-related marks. It multiplies into the receipt before the shared surface is lit and rendered, so paper and print bend together. A geometry-derived shadow follows lifted edges. The receipts use authored layouts and a generated paper material rather than real scans. Camera frames remain in memory on your device and are never uploaded or saved.

## How to use

- Open the main page on localhost or HTTPS. Each visit starts on a random receipt; playback continues in order through all 100 and wraps around. The receipt fits the space above the camera bar, up to approximately 800 CSS pixels tall. Your supplied photograph appears through the print filter before camera use.
- Print conditions and their texture placement vary with each new frame. Fold-related effects follow the same mesh normals as the paper. Stopping the camera holds the final impression.
- Select **Start camera** and allow access. The filled button becomes outlined while starting or running, then returns to filled when stopped. The current receipt stays still until the first delayed camera print is ready, then cycles at up to 12 fps. Playback uses a 12 fps schedule and advances one receipt per frame. The next paper is prepared during idle time. **Stop camera** releases the camera and holds the last receipt and print. **Cancel** abandons a pending camera request.
- On phones and short windows, open **Camera options** using the icon beside the camera button. Wider tablet and desktop layouts show both toggles beside a smaller camera button. **Keep me in frame** starts on; **Remove background** starts off. Both use toggles. The opaque drawer slides up from below the screen without shrinking the receipt; closing it also animates. Close it with its close button, Escape or by tapping outside it.
- In compact layouts, **Back camera** switches to the rear-facing camera. Front-camera prints are mirrored; back-camera prints retain their natural orientation. Switching releases the old stream and waits for a new delayed print. If the back camera is unavailable, the prototype falls back to the front camera.
- Person detection downloads when you first start the camera with either option enabled. Camera images stay on your device. The options target people and may miss hair, hands or held items. A detection failure turns both options off and shows a message; the full camera frame remains available.
- Native Apple **Center Stage**, where supported, remains in the system camera menu. Avoid combining it with digital framing if the result moves too much.
- If camera access is denied, allow it in your browser's site settings and try again. Loading and graphics failures show a refresh message. The page needs WebGL 2 and has no build step.

## Development view

Open [the development page](dev/) for inspection controls and the eight-condition print comparison. It shares the public page's `player.js`, renderer, camera processing and receipt assets; both pages use one collection.

- Select a thumbnail, use the arrow buttons or press Left/Right to hold a receipt. **Previous 20** and **Next 20** browse all five gallery pages.
- **Play proof** cycles receipts without the camera; **Pause proof** holds one. Proof playback cannot skip the initial camera-buffer wait.
- **Sample print** shows the filtered photograph. Disable it to inspect paper alone. Development camera options start off so an unprocessed camera feed is available for comparison.
- Use **Close-up**, **Background** and **Surface** to inspect folds, silhouettes, normals and edge defects.
- **Eight print conditions** compares clean printing, ordinary printing, weak transfer, moderate bleed, local heavy bleed, weak transfer with bleed, fold-related transfer and ridge smear. Cards use one receipt and the same photograph. Select a card or **Main print** to try it in the main preview, including with the camera. **Current print** restores the earlier fixed treatment for comparison.
- **Detail crops** changes the comparison cards only. **Print view** shows ink coverage, bleed radius, print-time contact or the transfer mask itself. Cards render at the screen’s pixel density, up to 3×. **Random each frame** independently chooses a condition for each new animation frame, with clean prints most common and heavy bleed rare. Texture position, orientation, scale, grain and strength also vary. **Randomise prints** previews fresh impressions on one held receipt at the selected frame rate; a named condition keeps that condition while randomising its details. Pause to hold one impression. Camera use stops this held-receipt preview; new camera frames still receive fresh impressions. Receipt thumbnails retain the existing print treatment.
- Press **D** for frame rate, delay and hand-placement controls, plus live condition, fold, mark and buffer values. Settings reset on reload.

See the [production guide](production-guide.md) for material provenance, physical dimensions, rendering limits and verification criteria.
