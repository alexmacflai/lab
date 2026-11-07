---
kind: instruction
description: Naming rules for files and folders: case, length, plurals, dates and renaming.
---

# Naming

- Use lowercase kebab-case for files and folders: `error-handling.md`, `release-notes/`.
- Exceptions: `README.md`, `AGENTS.md`, and files whose name a tool fixes (`CLAUDE.md`, `SKILL.md`).
- Name by content, not kind: `handoff-format.md`, not `handoff-doc.md`. Front-matter states the kind.
- Do not repeat the folder in the name: `engineering/error-handling.md`, not `engineering/engineering-error-handling.md`.
- Keep names to one to four words.
- Use plural folder names for collections: `specs/`, `reports/`, `skills/`.
- Do not use numeric prefixes (`01-setup.md`). Routing and links set reading order; renumbering breaks links.
- Do not put dates in names, except reports and report folders: `2026-10-26-checker-results.md`.
- When renaming, update every link to the file in the same change.
