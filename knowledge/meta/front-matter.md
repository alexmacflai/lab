---
kind: instruction
description: The header every Markdown file starts with: its fields, their values, and the separate fields for skills.
tags: [tagging]
---

# Front-matter

Start every Markdown file in `knowledge/` and `.agents/skills/` with a YAML front-matter block. Entry points (`README.md`, `AGENTS.md`) and tool files (`CLAUDE.md`) are exempt; `SKILL.md` files use the [skill fields](#skill-fields).

## Fields

| Field | Required | Value |
|---|---|---|
| `kind` | Yes | `instruction`, `doc`, `skill`, `spec` or `report`, as defined in [kinds.md](kinds.md). Files in `specs/` are `spec` and files in `reports/` are `report`. |
| `description` | Yes | One sentence on what the file is or covers; see [Description](#description). |
| `tags` | No | Tags from a tag registry; see [tags.md](tags.md). |
| `status` | Specs only | `proposal`, `accepted`, `done` or `deprecated`. |
| `verified` | No, docs only | `YYYY-MM-DD` when someone last checked the doc against what it describes. |

- Add no other fields.
- Do not record the domain: the folder path shows it.
- Do not record edit dates: git has them.
- Set `verified` when you check a doc against reality, not when you edit it.

## Skill fields

`SKILL.md` files are kind `skill` and follow the [Agent Skills standard](https://agentskills.io/specification), with these fields:

| Field | Value |
|---|---|
| `name` | The skill's folder name. |
| `description` | What the skill does, in at most 12 words. Agents choose skills by it, and tools show it in their menus. |

## Description

- One sentence, at most 25 words, on what the file is or covers.
- Be specific enough to decide whether to open the file; folder routing tables copy it.
- Good: `Structure, state and styling patterns for UI components.`
- Bad: `This document describes components.`

## Tags

Follow [tags.md](tags.md): it holds the tag rules and the framework's tags.
