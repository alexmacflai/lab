---
kind: instruction
description: How to write a skill, a repeatable step-by-step procedure for one task, with a complete example.
---

# Writing skills

What a skill is and how binding it is: see [kinds.md](../kinds.md). A skill has two readers: write a short opening for people, then steps for agents. To add, test or update one, see [skill-upkeep.md](skill-upkeep.md).

## Example

A complete file; keep these sections in this order.

```markdown
---
name: add-component
description: Add an interface component that matches the existing ones.
---

# Add a component

Creates an interface component that follows the existing ones, with its tests.

## When to use
- A design introduces a component the code does not have. Not for: changing an existing component.

## Inputs
- The design and the component's name.

## Steps
1. Copy the structure of `src/ui/button.tsx` into `src/ui/<name>.tsx`.
2. Add each variant the design shows.
3. Write tests beside it and run the test command in `knowledge/setup.md`.

## Done when
- The tests pass, and each variant matches the design, checked by a person.
```

## Optional sections

Add only when needed:

- **Read first:** the guidance the task needs.
- **Judgment:** what changes the result, where fixed steps don't fit.
- **Approval:** actions that wait for the user.
- Mechanical steps go in a script in `scripts/`, run from a step.

## Good

- Each step has an observable result.
- Links to docs instead of explaining inline.
- "Done when" says what proves success, not only what to run.

## Too much

- Branches for rare cases: link to a separate skill instead.
- Rules that apply beyond this task: move them to an instruction.

## Templates

- Keep files it copies in `assets/`, mirroring their destinations, linked from their step.
- Start each with a `<!-- template: … -->` comment: destination, how many, naming.
- Fill-in comments say what to write and consider. No links: they break once copied.
