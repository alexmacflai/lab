---
kind: doc
description: Keyhole, a black screen with a keyhole the viewer approaches by scrolling, until they are looking through it into a video with sound.
verified: 2026-11-04
---

# Keyhole

A black screen with a keyhole the viewer approaches by scrolling, until they are looking through it into a video with sound. When they stop, they drift back into the dark. The video is still a generated placeholder.

## How it works

- Scrolling, dragging or the keyboard (arrows, Page Up, Page Down, Space, Home, End) moves the viewer closer or further away.
- Up close, the keyhole's edge blurs away and the video comes into focus. Volume and low-pass filtering open with the same movement.
- After a short pause without input, the viewer drifts back to black. Any manual input cancels the drift.
- With reduced motion requested, the drift back is a fade to black instead of a zoom.
- Any click, tap or key press turns on the sound. Without one, everything works silently.
- Two hints, "scroll to look" and "click for sound" ("tap for sound" on touch-only devices), each fade on their own trigger and do not return during a visit.
- If the video fails or WebGL is unavailable, a small message replaces the hints and the screen stays black.
- `D` shows live debug values.

## Related

- Code: [keyhole/index.html](../../../keyhole/index.html). Every tunable value is in `CONFIG` at the top of the file.
