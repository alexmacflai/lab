---
kind: instruction
description: Rules for writing code in the lab: reuse, dependencies, dead code, size, modularity, its conventions and lessons.
---

# Code rules

- Search for existing code to reuse before writing new code.
- Ask before adding a dependency.
- Delete code that is no longer used; do not comment it out.
- Keep files under 300 lines and functions under 50.
- Keep code local until it has a second real use. Share code for shared behaviour, not shared looks.

## Project conventions

- Give motion-heavy pieces a debug view, toggled with `D` and hidden by default, that shows their live values.

## Lessons

- Judge motion by what the viewer experiences, such as the time to first visible movement, not by its settings. In Keyhole, a long ease-in cancelled a higher top speed, and a strict settling check added about 0.4 s of hidden wait to the delay.
