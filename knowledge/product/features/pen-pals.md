---
kind: doc
description: Pen Pals, where autonomous pens draw on a small DOS-style canvas and the viewer can draw alongside them.
verified: 2026-11-04
---

# Pen Pals

Five autonomous pens draw on a 320×200 canvas in a DOS-style CGA look, and the viewer can draw alongside them. It opens with something already on the page.

## How it works

- Dragging on the canvas draws with the pointer.
- The legend lists each pen with its status. Clicking a pen, or pressing `1` to `5`, turns it on or off.
- Space pauses and resumes, `C` clears the canvas, and `-` and `+` set the speed from 1 to 9.
- The canvas scales by whole numbers to fit the window, so pixels stay hard-edged.
- With reduced motion requested, it starts at the lowest speed.

## Related

- Code: [pen-pals/index.html](../../../pen-pals/index.html)
