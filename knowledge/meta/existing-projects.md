---
kind: instruction
description: Fitting the framework into a project that already has its own entry points, tool files, documentation, other material or several packages.
tags: [structure]
---

# Existing projects

- The framework covers `AGENTS.md`, `knowledge/` and `.agents/skills/`. Everything else keeps the project's own layout, and the checker ignores it.
- Never change the project's `README.md`.

## Existing entry and tool files

When the project already has `AGENTS.md`, `CLAUDE.md` or `.claude/skills/`, show the user their content and propose where each part goes. Act only after the user's [approval](../agents/autonomy.md#approval):

- Rules move into `AGENTS.md` or the instruction that owns their topic.
- `CLAUDE.md` becomes the single line `@AGENTS.md`.
- Skills move to `.agents/skills/`, and `.claude/skills` becomes a link to it.

Never overwrite these files without the user's agreement.

## Existing Markdown

- Leave documentation sites, notes and other Markdown where they are.
- Move a file into `knowledge/` only with the user's [approval](../agents/autonomy.md#approval).
- Link to a documentation site instead of copying it.

## Other material

- An image, diagram or data file used by one document sits beside it: `knowledge/design/contrast-examples.png`.
- One used by several documents sits in their domain folder.
- Code, config and data stay in the project's own folders. Link to them by path.

## Several packages

- Keep one `AGENTS.md`, `knowledge/` and `.agents/skills/` at the repository root.
- Give a package its own short `AGENTS.md` only for rules that apply to it alone, and link back to the root `AGENTS.md`.
- Packages are not domains.
