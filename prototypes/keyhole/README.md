---
title: Keyhole
description: A black screen with a keyhole you approach by scrolling, until you are looking through it into a video with sound.
date: 2026-11-04
---

# Keyhole

A black screen with a keyhole you approach by scrolling, until you are looking through it into a video with sound. Stop and you drift back into the dark.

## How to use

- Scroll, drag or use the keyboard (arrows, Page Up, Page Down, Space, Home, End) to move closer or further away.
- Up close, the keyhole's edge blurs away and the video comes into focus, while the sound grows louder and clearer.
- Stop, and after a short pause you drift back to black. Any manual input cancels the drift.
- Click, tap or press a key to turn on the sound. Without that, everything works silently.
- Press `D` for live debug values.

With reduced motion requested, the drift back is a fade to black instead of a zoom. If the video fails or WebGL is unavailable, a small message replaces the hints and the screen stays black.

Every tunable value is in `CONFIG` at the top of `index.html`. Serve it over HTTP with Range support, as [setup.md](../../knowledge/setup.md) describes.
