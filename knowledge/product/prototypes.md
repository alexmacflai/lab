---
kind: instruction
description: What every prototype must have: its folder, its README and metadata, how it stays standalone and how it reaches the index.
tags: [structure]
---

# Prototypes

## Folder

- Put each prototype in `prototypes/<name>/`, named after the piece, with `index.html` as its entry point.
- Serve it as it is: no build step or framework. To stay within the [size limits](../engineering/code-rules.md), split code into native JavaScript modules.
- If a prototype truly needs a bundled dependency, ask the user first. It then gets its own build, with the output committed in its folder.
- Use relative paths for a prototype's own files, so its folder can move.
- Do not import from another prototype or change one as a side effect of working on another.

## README

Every prototype has a `README.md`, and it is the only description of the prototype. Do not repeat it in `knowledge/`. Keep it true when the interaction changes.

It starts with this front-matter:

| Field | Value |
|---|---|
| `title` | The prototype's name, as the index shows it. |
| `description` | One sentence on what it is, as the index shows it. |
| `date` | The day it was created, as `YYYY-MM-DD`. Do not change it later. |

Then two sections:

- An opening paragraph on what the prototype is.
- `## How to use`: how to interact with it, including keys, gestures and what happens when something fails.

## Index

- The list of prototypes in the root `index.html` is generated from the READMEs, newest first. Do not edit between its markers.
- After adding a prototype or changing its metadata, run `python3 tools/update-index.py`. The pre-commit hook blocks a commit if the list is out of date or metadata is invalid.

To create a prototype, use [create-prototype](../../.agents/skills/create-prototype/SKILL.md).
