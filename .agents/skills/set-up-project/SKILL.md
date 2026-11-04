---
name: set-up-project
description: Set up a project's knowledge, one area at a time.
---

# Set up a project

A short wizard for the start of a project. It looks at what already exists, shows which areas are missing, and lets the user choose for each one: set it up now, do it by hand later, or skip it. It gathers enough for agents to explore and work on the project, not a full definition.

## When to use

- A new project, a project that has just adopted the framework, or one with areas still missing.
- Not for: extending an area that is done; edit its files.

## Inputs

- The project's files, and the user's answers.

## Steps

1. Read what exists: `README.md`, the code, existing documentation and anything the user points to. If the project already has its own docs, follow [existing-projects.md](../../../knowledge/meta/existing-projects.md).
2. Find each area's status from its files. Missing: none of its files exist. Partial: a file still has a `<!-- fill in` comment. Done: neither.

   | Area | Files | Sub-skill |
   |---|---|---|
   | Product | `knowledge/product/` | [set-up-product](../set-up-product/SKILL.md) |
   | Copywriting | `knowledge/copywriting/` | [set-up-copywriting](../set-up-copywriting/SKILL.md) |
   | Design | `knowledge/design/` | [set-up-design](../set-up-design/SKILL.md) |
   | Engineering | `knowledge/engineering/` | [set-up-engineering](../set-up-engineering/SKILL.md) |
   | Environment | `knowledge/setup.md` | [set-up-environment](../set-up-environment/SKILL.md) |

3. Show the user each area with its status, and ask for each one that is not done: now, by hand later, or skip. Recommend product first. Say that choosing copywriting, design or engineering approves creating that domain.
4. Run the sub-skill for each area chosen for now, one at a time. Finish one before starting the next.
5. For each area the user will do by hand, give them the path to its sub-skill's `assets/` folder, which holds the templates.

## Done when

- Each area chosen for now has at least its sub-skill's minimum.
- Skipped areas have no files in `knowledge/`.
- The checker reports no errors, and the user has the status of every area.
