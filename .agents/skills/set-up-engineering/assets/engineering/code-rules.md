---
kind: instruction
description: Rules for writing code in this project: reuse, dependencies, dead code, size, modularity, the project's own conventions and lessons.
---

<!-- template: Copy to knowledge/engineering/code-rules.md. There is one code-rules file. The rules below are defaults; change or remove any the project does not want, then remove this comment. -->

# Code rules

- Search for existing code to reuse before writing new code.
- Ask before adding a dependency.
- Delete code that is no longer used; do not comment it out.
- Keep files under 300 lines and functions under 50.
- Keep code local until it has a second real use. Share code for shared behaviour, not shared looks.

## Project conventions

<!-- fill in: the project's "use this, not that" choices, each as a bullet: libraries, patterns, naming, error handling and formatting. Rules a linter or formatter already enforces need not be repeated; name the tool instead. -->

## Lessons

<!-- fill in: what the project learned the hard way that the code does not show, each with its reason. Leave out what is obvious. A rule a bug fix reveals about how the product behaves goes in its feature doc instead. -->
