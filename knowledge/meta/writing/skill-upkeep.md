---
kind: instruction
description: When to add a skill, how to test one that relies on judgment, and when to update it.
---

# Skill upkeep

How to write a skill: see [skills.md](skills.md).

## Adding a skill

- Update an existing skill before adding another.
- Add a skill only once the task has repeated and its judgment calls are understood.
- Check that a realistic request selects the skill and a nearby, unrelated request does not.

## Testing a skill

- For a skill that relies on judgment, such as a review or an audit, keep behaviour tests in `evaluations.md` in its folder, linked from the skill.
- Each case gives a request, the evidence the agent sees, and what a good result looks like. Include cases where a pass is right.
- After a material change, run the cases in a fresh context, without the expected results.

## When to update

- Fix a step that fails, is missing or has changed in the task that found it, without approval; mention it in your report or handoff.
