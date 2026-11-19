---
title: Receipt Portrait
description: A delayed camera portrait printed onto a collection of 100 folded paper receipts.
date: 2026-11-18
---

# Receipt Portrait

A collection of 100 authored receipts across 12 design families, including the original six reference receipts. Each entry has its own transaction, layout settings, stock, edges and fold configuration. Low-resolution camera ink multiplies into the receipt before the shared surface is lit and rendered, so paper and print bend together. A geometry-derived shadow follows lifted edges. The receipts use authored layouts and a generated paper material rather than real scans. Camera frames remain in memory on your device and are never uploaded or saved.

## How to use

- Serve the lab locally and open this folder through localhost, or use HTTPS. The collection needs WebGL 2; it has no build step or external dependencies.
- Select a comparison thumbnail, use the arrow buttons or press Left/Right to hold one receipt still. The arrow controls wrap through all 100 receipts. Use **Previous 20** and **Next 20** to browse five gallery pages.
- Select **Play proof** to cycle the papers at 12 fps. Select **Pause proof** to hold the current receipt.
- **Sample print** shows an illustrated test portrait without camera permission. Disable it to inspect the paper alone.
- Select **Start camera** and allow access. Your mirrored central camera crop appears at 144 × 180 pixels after a 500 ms delay. Centre yourself in the camera; there is no face tracking. Starting the camera also starts receipt cycling.
- **Cancel** abandons a pending camera request. **Stop camera** releases the camera and keeps the last print; pause the proof as well to hold the paper still. A late permission response after cancellation is released immediately.
- Use **Close-up**, **Background** and **Surface** to inspect folds, silhouettes and surface normals. The dark and checkerboard backgrounds help reveal edge defects.
- Press **D** for frame rate, delay and hand-placement controls. Settings reset on reload.
- If access is denied, allow the camera in your browser's site settings and try again. Loading or graphics failures show a refresh message.

See the [production guide](production-guide.md) for design references, material provenance, fold parameters, rendering limitations and checks for future edits and additions.
