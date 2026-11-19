---
name: create-prototype
description: Build a new prototype from notes, with the plan approved first.
---

# Create a prototype

Turns notes or an idea into a working prototype. It asks what the notes leave open and details the work before building, so the user can check that the agent understood them.

## When to use

- The user has notes or an idea for a new prototype.
- Not for: changing an existing prototype; use [start-task](../start-task/SKILL.md).

## Inputs

- The user's notes, and any material they supply.

## Read first

- [prototypes.md](../../../knowledge/product/prototypes.md), [product.md](../../../knowledge/product/product.md) and [code-rules.md](../../../knowledge/engineering/code-rules.md).

## Steps

1. Read the notes. Check `prototypes/` for a piece that already covers the idea.
2. Ask, in one message, only what the notes leave open and would change the result: the core interaction, how it responds to input, what it should feel like, whether it needs sound, a camera or supplied media. Give your recommendation for each. If nothing is open, say so and continue.
3. Show the plan in the message itself: what the prototype is, its name and folder, what will be built, what is deliberately left out, new dependencies or supplied material, and how it will be checked, including what cannot be checked.
4. Stop and wait for the user's explicit yes to the plan. If they correct it, show the changed plan and wait again.
5. Create the folder and its README following [prototypes.md](../../../knowledge/product/prototypes.md).
6. Build what the plan describes. Apply [humanise-copy](../humanise-copy/SKILL.md) to new or changed copy, including README metadata, instructions, accessible labels and strings in code. If the work has to go beyond the plan, ask first.
7. Run `python3 tools/update-index.py`, then follow [verify-work](../verify-work/SKILL.md) in a browser.
8. Report what was built and checked. State plainly what could not be checked, especially how it feels and sounds.

## Approval

- Building waits for the user's explicit yes to the plan, as [autonomy.md](../../../knowledge/agents/autonomy.md#approval) requires.

## Done when

- The prototype matches the approved plan, and works in a browser with no errors or warnings from its code in the console.
- Its README describes how it works now, and the index links to it.
- `python3 tools/update-index.py --check` and `python3 knowledge/tools/adf.py check` report no errors.
