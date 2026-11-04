---
kind: instruction
description: How bugs are fixed in the lab, when tests are added, and which checks must pass before work is done.
tags: [testing]
---

# Testing

- Reproduce every bug in a browser, fix it, then confirm it is gone.
- Never weaken, skip or delete a test to make it pass.
- Say plainly what could not be checked, especially how a piece feels and sounds.

## When to add tests

The lab has no automated tests. Do not add test tooling to the repository unless the user asks. Keep scripted browser checks outside it.

## Before work is done

- The piece loads and works in a browser, with no errors or warnings from its code in the console. Commands to serve it are in [setup.md](../setup.md).
- `python3 knowledge/tools/adf.py check` reports no errors.
