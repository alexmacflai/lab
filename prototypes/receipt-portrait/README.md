---
title: Receipt Portrait
description: A delayed camera portrait printed onto a collection of 100 folded paper receipts.
date: 2026-11-18
---

# Receipt Portrait

A collection of 100 authored receipts across 24 design families, including the original six reference receipts. Headers use original pictograms, seals, reverse-print panels and varied wordmarks. Paper conditions range from pristine to pocket-crumpled, with damage fixed per ticket. Thirty-three tickets carry a stain, stroke, note or doodle, including seven coffee stains roughly as wide as the receipt. Notes and eight different doodles use generated scanned-style textures rather than fonts or geometric icons. Each entry has its own transaction, layout settings, stock and edges. Neutral-black camera ink has fibre-scale gaps, uneven coverage, feed bands and slight edge bleed. It multiplies into the receipt before the shared surface is lit and rendered, so paper and print bend together. A geometry-derived shadow follows lifted edges. The receipts use authored layouts and a generated paper material rather than real scans. Camera frames remain in memory on your device and are never uploaded or saved.

## How to use

- Serve the lab locally and open this folder through localhost, or use HTTPS. The collection needs WebGL 2; it has no build step. Optional person detection loads MediaPipe from a CDN.
- Select a comparison thumbnail, use the arrow buttons or press Left/Right to hold one receipt still. The arrow controls wrap through all 100 receipts. Use **Previous 20** and **Next 20** to browse five gallery pages.
- Select **Play proof** to cycle the papers at 12 fps. Select **Pause proof** to hold the current receipt.
- **Sample print** shows your supplied photograph through the print filter without camera permission. Disable it to inspect the paper alone.
- Select **Start camera** and allow access. Your mirrored central camera crop appears at 144 × 180 pixels after a 500 ms delay. The default crop stays centred. Receipt cycling starts with the first delayed camera print.
- Enable **Keep me in frame** for smooth digital framing around detected people, or **Remove background** to leave the paper visible around them. Both are off by default and apply to camera prints, not the sample photograph. First use downloads MediaPipe Tasks Vision 1.2.3 and its Selfie Segmenter model. Detection runs on your device. These options target people, not arbitrary objects, and can miss hair, hands or held items. If loading fails, both switches turn off and the full camera frame remains available.
- On supported Apple devices, native **Center Stage** is available through the system camera menu. The prototype does not toggle it. Avoid combining it with digital framing if the result moves too much.
- **Cancel** abandons a pending camera request. **Stop camera** releases the camera and keeps the last print; receipt cycling pauses too. A late permission response after cancellation is released immediately.
- Use **Close-up**, **Background** and **Surface** to inspect folds, silhouettes and surface normals. The dark and checkerboard backgrounds help reveal edge defects.
- Press **D** for frame rate, delay and hand-placement controls. It also names the current condition, fold count and mark. Settings reset on reload.
- If access is denied, allow the camera in your browser's site settings and try again. Loading or graphics failures show a refresh message.

See the [production guide](production-guide.md) for design references, material provenance, fold parameters, rendering limitations and checks for future edits and additions.
