---
title: Receipt Portrait
description: A delayed camera portrait printed onto a collection of 100 folded paper receipts.
date: 2026-11-18
---

# Receipt Portrait

A collection of 100 authored receipts across 24 design families, including the original six reference receipts. Headers use original pictograms, seals, reverse-print panels and varied wordmarks. Paper conditions range from pristine to pocket-crumpled, with damage fixed per ticket. Thirty-three tickets carry a stain, stroke, note or doodle, including seven coffee stains roughly as wide as the receipt. Notes and eight different doodles use generated scanned-style textures rather than fonts or geometric icons. Each entry has its own transaction, layout settings, stock and edges. Neutral-black camera ink has fibre-scale gaps, uneven coverage, feed bands and slight edge bleed. It multiplies into the receipt before the shared surface is lit and rendered, so paper and print bend together. A geometry-derived shadow follows lifted edges. The receipts use authored layouts and a generated paper material rather than real scans. Camera frames remain in memory on your device and are never uploaded or saved.

## How to use

- Open the main page on localhost or HTTPS. The receipt fits the space above the camera bar, up to approximately 800 CSS pixels tall. Your supplied photograph appears through the print filter before camera use.
- Select **Start camera** and allow access. The filled button becomes outlined while starting or running, then returns to filled when stopped. The current receipt stays still until the first delayed camera print is ready, then cycles at 12 fps. **Stop camera** releases the camera and holds the last receipt and print. **Cancel** abandons a pending camera request.
- On phones and short windows, open **Camera options** using the icon beside the camera button. Wider tablet and desktop layouts show both toggles beside a smaller camera button. **Keep me in frame** starts on; **Remove background** starts off. Both use toggles. The opaque drawer slides up from below the screen without shrinking the receipt; closing it also animates. Close it with its close button, Escape or by tapping outside it.
- Person detection downloads when you first start the camera with either option enabled. Camera images stay on your device. The options target people and may miss hair, hands or held items. A detection failure turns both options off and shows a message; the full camera frame remains available.
- Native Apple **Center Stage**, where supported, remains in the system camera menu. Avoid combining it with digital framing if the result moves too much.
- If camera access is denied, allow it in your browser's site settings and try again. Loading and graphics failures show a refresh message. The page needs WebGL 2 and has no build step.

## Development view

Open [the development page](dev/) for inspection controls. It shares the public page's `player.js`, renderer, camera processing and receipt assets; both pages use one collection.

- Select a thumbnail, use the arrow buttons or press Left/Right to hold a receipt. **Previous 20** and **Next 20** browse all five gallery pages.
- **Play proof** cycles receipts without the camera; **Pause proof** holds one. Proof playback cannot skip the initial camera-buffer wait.
- **Sample print** shows the filtered photograph. Disable it to inspect paper alone. Development camera options start off so an unprocessed camera feed is available for comparison.
- Use **Close-up**, **Background** and **Surface** to inspect folds, silhouettes, normals and edge defects.
- Press **D** for frame rate, delay and hand-placement controls, plus live condition, fold, mark and buffer values. Settings reset on reload.

See the [production guide](production-guide.md) for material provenance, physical dimensions, rendering limits and verification criteria.
