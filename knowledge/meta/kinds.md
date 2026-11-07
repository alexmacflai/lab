---
kind: instruction
description: The five kinds of file (instruction, doc, skill, spec and report), what each is for and how binding it is.
tags: [structure]
---

# Kinds

Every Markdown file in `knowledge/` and `.agents/skills/` is one of five kinds. The kind tells readers what the file is for and how far to obey it. Entry points (`README.md`, `AGENTS.md`) and tool files have no kind.

| Kind | What it is | Reader | Authority | Lives in |
|---|---|---|---|---|
| `instruction` | A rule for how to work whenever a situation occurs | Agents | Binding on every task it applies to | Its domain, `agents/`, `meta/`, `product/` or `knowledge/` |
| `skill` | Numbered steps for one task | Agents; a short opening for people | Binding while doing that task | `.agents/skills/<name>/SKILL.md` |
| `doc` | How something is: architecture, patterns, setup | Agents and people | Reference; true until shown wrong | Its domain, `agents/`, `meta/`, `product/` or `knowledge/` |
| `spec` | Work not done yet | People agreeing it; agents doing it | Binding for that work once `accepted` | `knowledge/specs/` |
| `report` | What happened or was found | People; the next agent | Evidence only, never guidance | `knowledge/reports/` |

## Choosing the kind

Take the first match:

1. Tells the reader what to do whenever a situation occurs → `instruction`.
2. Steps for carrying out one task → `skill`.
3. Describes work not done yet → `spec`.
4. Records what happened or was found → `report`.
5. Describes how things are → `doc`.

## Common mistakes

- A doc that says "always" or "never" contains rules: move them to an instruction.
- An instruction with numbered steps for one task is a skill.
- Recommendations in a report are not guidance until someone turns them into an instruction, doc or skill.

## When files disagree

- Instructions and skills override docs. Fix the doc.
- Tests and checks show what the code does now. When a doc disagrees with them, decide which is wrong: fix the doc, or report the bug.
- Reports never override anything.
- If an accepted spec conflicts with an instruction, ask the user.
