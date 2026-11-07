---
name: maintain-structure
description: Add, move or remove files and keep routing correct.
---

# Maintain the structure

Use this whenever files in `knowledge/` or `.agents/skills/` are added, moved, renamed or removed. It keeps every file findable and the checker clean.

## When to use

- Adding, moving, renaming or removing a file, folder, skill or domain.
- Not for: editing a file's content without moving it; follow [writing.md](../../../knowledge/meta/writing/general.md).

## Inputs

- What the file is for, and the conventions in [knowledge/meta/](../../../knowledge/meta/README.md).

## Steps

1. Decide the kind with [kinds.md](../../../knowledge/meta/kinds.md) and the location with [placement.md](../../../knowledge/meta/placement.md). Creating, splitting, merging or removing a domain needs the user's [approval](../../../knowledge/agents/autonomy.md#approval) first.
2. Name it following [naming.md](../../../knowledge/meta/naming.md).
3. Write front-matter and content following [front-matter.md](../../../knowledge/meta/front-matter.md) and the guide for its kind.
4. Update routing and links following [routing.md](../../../knowledge/meta/routing.md). When adding or removing a skill, also update the stage table in the skills [README](../README.md).
5. Run `python3 knowledge/tools/adf.py route`.
6. Run `python3 knowledge/tools/adf.py check`. Fix every error and rerun until none remain.

## Done when

- The checker reports no errors, and every remaining warning is reported with a reason.
