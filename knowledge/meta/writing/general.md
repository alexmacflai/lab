---
kind: instruction
description: Writing rules for every Markdown file: style, links, size budgets, when to update and approval. Each kind adds its own guide.
---

# General writing rules

These rules apply to every [kind](../kinds.md) of file. Then follow the guide for the kind you are writing:
[instructions](instructions.md), [docs](docs.md), [skills](skills.md), [specs](specs.md), [reports](reports.md).

## Style

- Write each section for its reader.
- For agents: imperative, terse, lists and tables, no preamble, no restating.
- For people: readable prose that explains why.
- One topic per file. Lead with what matters most.
- Prefer concrete pointers over description: name the real file, command or example.
- Link instead of repeating. If you are about to restate something, link to its source.
- Write in the language and spelling `AGENTS.md` states.

## Links

- Use relative links.
- Link to code by file path, without line numbers: they go stale.
- Link to external pages only for authoritative sources, such as standards.

## Size budgets

Soft limits. When a file goes over, trim it or split it as [placement.md](../placement.md#long-documents) describes.

| File | Words |
|---|---|
| `AGENTS.md` | 400 |
| Folder README, hand-written part | 200 |
| Instruction | 300 |
| Skill | 700 |
| Spec | 1,000 |
| Doc | 1,500 |
| Report | No limit; summary first |

## When to update

- Update a file in the same change that alters what it describes. Do not wait to be asked.
- Fix a file when you find it is wrong, even if your task is about something else.
- Do not rewrite for style alone or update a file when nothing it describes has changed.
- Do not add changelogs or "last updated" notes; git records history.

## Approval

Some changes need the user's approval first. What they are and how approval is given: [autonomy.md](../../agents/autonomy.md#approval).
