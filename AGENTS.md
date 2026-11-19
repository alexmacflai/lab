# Agent instructions

This repository is a lab of independent interactive web prototypes, each in its own folder under `prototypes/`.

Write in British English.

## Rules for every task

- Before creating or editing a Markdown file in `knowledge/` or `.agents/skills/`, follow [knowledge/meta/](knowledge/meta/README.md).
- Follow [knowledge/agents/](knowledge/agents/README.md): when to act or ask, scope, conflicts, communication, verification, safety and learning.
- Choose guidance by what the work changes, not how the request is worded: work that changes what users read is copywriting work; work that changes how the interface looks or behaves is design work. Reproducing supplied copy or a supplied design exactly needs no domain guidance.
- Whenever creating or changing text people read, follow [copywriting/](knowledge/copywriting/README.md) and apply [humanise-copy](.agents/skills/humanise-copy/SKILL.md) before completion. This covers the lab index and every prototype, including copy embedded in code. Preserve exact supplied or approved wording and attributed quotations; leave effective copy unchanged.
- Before committing, run `python3 knowledge/tools/adf.py check` and fix every error.
- Follow [prototypes.md](knowledge/product/prototypes.md) when adding or changing a prototype.
- Several agent sessions often work in this checkout at once. Before switching its branch, check for other running sessions. If there are any, use a separate worktree.

## Routing

| If you are…                               | Read                                                   | Then use |
|-------------------------------------------|--------------------------------------------------------|----------|
| Setting up the project's knowledge        | —                                                      | [set-up-project](.agents/skills/set-up-project/SKILL.md) |
| Starting or picking up a task             | [knowledge/agents/](knowledge/agents/README.md)        | [start-task](.agents/skills/start-task/SKILL.md) |
| Investigating a problem                   | [knowledge/setup.md](knowledge/setup.md)               | [investigate-problem](.agents/skills/investigate-problem/SKILL.md) |
| Verifying work                            | [verification.md](knowledge/agents/verification.md)    | [verify-work](.agents/skills/verify-work/SKILL.md) |
| Planning work that needs a spec           | [writing/specs.md](knowledge/meta/writing/specs.md)    | [write-spec](.agents/skills/write-spec/SKILL.md) |
| Reviewing a change                        | [verification.md](knowledge/agents/verification.md)    | [review-change](.agents/skills/review-change/SKILL.md) |
| Recording how a recurring change is done  | [writing/docs.md](knowledge/meta/writing/docs.md#pattern-docs) | [document-pattern](.agents/skills/document-pattern/SKILL.md) |
| Handing off unfinished work               | —                                                      | [hand-off](.agents/skills/hand-off/SKILL.md) |
| Working alongside other agents            | [parallel-work.md](knowledge/agents/parallel-work.md)  | —        |
| Adding, moving or removing files or domains | [knowledge/meta/](knowledge/meta/README.md)          | [maintain-structure](.agents/skills/maintain-structure/SKILL.md) |
| Setting up, building, testing or running  | [knowledge/setup.md](knowledge/setup.md)               | —        |
| Looking for a skill                       | [.agents/skills/](.agents/skills/README.md)            | —        |
| Creating a prototype from notes or an idea | [prototypes.md](knowledge/product/prototypes.md)      | [create-prototype](.agents/skills/create-prototype/SKILL.md) |
| Changing a prototype                      | [prototypes.md](knowledge/product/prototypes.md), [knowledge/setup.md](knowledge/setup.md) | [verify-work](.agents/skills/verify-work/SKILL.md) |
| Deciding what a prototype does or how it should feel | [knowledge/product/](knowledge/product/README.md) | —        |
| Writing or changing code                  | [knowledge/engineering/](knowledge/engineering/README.md) | —        |
| Writing or changing text people read      | [knowledge/copywriting/](knowledge/copywriting/README.md) | [humanise-copy](.agents/skills/humanise-copy/SKILL.md) |
