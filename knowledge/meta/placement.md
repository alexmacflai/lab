---
kind: instruction
description: Where each kind of file, folder and domain belongs.
tags: [structure]
---

# Placement

First decide the file's kind: [kinds.md](kinds.md).

## Decide the location

1. Extend an existing file whose scope fits the topic.
2. How files in `knowledge/` are organised or written: `knowledge/meta/`.
3. How agents work on any task: `knowledge/agents/`.
4. A procedure: `.agents/skills/<name>/SKILL.md`, one folder per skill, never grouped.
5. Planned work that needs lasting agreement and acceptance criteria: `knowledge/specs/`. Findings, evidence or handoffs that need a lasting record: `knowledge/reports/`, dated.
6. One domain's material: `knowledge/<domain>/`. The product, its users and how it works: `knowledge/product/`. Other project-wide material: directly in `knowledge/`.
7. Never group files by kind into subfolders such as `docs/`; front-matter states the kind.
8. Supplied material, such as designs or PDFs: [references.md](references.md).
9. Create a folder, with its `README.md`, only when its first file arrives.

## Domains

- A domain is a field of work matching an industry role, such as design, engineering, copywriting or marketing. `meta/`, `agents/`, `product/`, `specs/`, `reports/` and project-wide documents are not domains.
- Create one only for a field with its own rules or vocabulary that most other tasks do not need.
- Get the user's [approval](../agents/autonomy.md#approval) before creating, splitting, merging or removing a domain.
- Keep domains side by side in `knowledge/`. Never nest them.
- Keep material with the domain that owns it; link to it, never copy it.

## Long documents

Keep one file per topic. When a file exceeds its [size budget](writing/general.md#size-budgets), split it by area:

- Three parts or fewer: sibling files with a shared prefix, such as `accessibility-forms.md`.
- More than three: a folder named after the topic. Its `README.md` replaces the original: an overview, then its routing table. It is not a domain, needs no approval and holds no further folders. In `reports/`, date the folder: `2026-10-27-user-interviews/`.

Projects that already have files: follow [existing-projects.md](existing-projects.md).
