---
kind: doc
description: Micro-thoughts, a short poem whose layout changes as the viewer moves the pointer or blinks.
verified: 2026-11-04
---

# Micro-thoughts

A short poem, "Fish air", on a page whose layout changes as the viewer moves the pointer or blinks. The folder is still named `poem-grid`.

## How it works

- A start screen offers Mouse or Camera before anything runs. Esc returns to it and stops the chosen mode.
- **Mouse:** an invisible grid covers the page, and moving to another cell switches to a different rendering of the poem.
- **Camera:** one face is tracked, and each blink changes to a random layout. A layout can return only after three others. The video stays on the device.
- In Camera mode, a floating view follows the face with its mesh drawn on it. It can be resized from its top corners, and a short status line turns green when ready.
- If the camera cannot be used, a notice offers to try again, use the mouse or go back.

## Related

- Code: [poem-grid/index.html](../../../poem-grid/index.html)
