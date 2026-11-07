---
kind: instruction
description: What AGENTS.md and folder READMEs contain, the root and folder routing tables, and keeping routing current as files change.
tags: [routing, structure]
---

# Routing

Routing leads a reader from an entry point to the files a task needs.

## Entry points

- `README.md` is the project's own, for people; never change it.
- `AGENTS.md` contains, in order:
  1. One sentence on what the project is, and a link to `README.md`.
  2. The project's writing language and spelling.
  3. Rules for every task, or links to them.
  4. The root routing table.
- Never repeat `README.md` content in `AGENTS.md`.

## Folder READMEs

Every folder in `knowledge/` with Markdown files has a `README.md`, and so does `.agents/skills/`; individual skill folders do not. A folder README contains a title, one or two sentences on the folder's purpose, then its routing table.

Where a doc goes with a skill, link the skill from the doc.

## Root routing table

Written by hand in `AGENTS.md`, it routes common tasks across folders and names their skills.

```markdown
| If you are…             | Read    | Then use |
|-------------------------|---------|----------|
| Changing a UI component | design/ | .agents/skills/add-component/SKILL.md |
```

- One row per common task, starting with an -ing verb.
- Link to files or folders; do not describe them.
- Route one level down, deeper only for very common tasks.
- Put `—` in `Then use` when no skill applies.

## Folder routing tables

```markdown
<!-- routing:start (generated, do not edit) -->
| File | Description | Tags |
|---|---|---|
| [buttons.md](buttons.md) | Button variants and sizes. | ui |
<!-- routing:end -->
```

- Generated: never edit between the markers; run `adf.py route`.
- One row per file, then per subfolder. A subfolder row takes its README's first sentence and its files' tags.

## Keeping routing current

In the same change that adds, renames, moves or removes a file:

- Regenerate the folder routing tables.
- Update every link and root routing row to the file.
- Add a root routing row for a common task not yet routed.
- Delete files rather than mark them deprecated; only specs use `deprecated`.
