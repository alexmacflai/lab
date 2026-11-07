---
kind: instruction
description: How to write a doc, a description of how something in the project is, including pattern docs, with a complete example.
---

# Writing docs

What a doc is and how binding it is: see [kinds.md](../kinds.md). Agents and people both read docs, so write for agents first and keep it readable for people.

## Example

A complete file.

```markdown
---
kind: doc
description: Button variants, sizes and where their code lives.
verified: 2026-10-20
---

# Buttons

How buttons are built. Colours and spacing are in `tokens.md`.

## Variants

Primary, secondary and text, all defined in `src/ui/button.tsx`. The names match the design files.

## Sizes

Small and medium. Size changes the padding only, not the font size.
```

## Good

- Points to real examples: "Components follow the pattern in `src/ui/button.tsx`."
- Names the source of truth (code, config, another doc) and links to it.
- States the current state only.

## Too much

- Copying code or config: it goes stale. Link to it instead.
- History and past decisions: those belong in specs and reports.
- Rules: move them to an instruction.

## Pattern docs

A pattern doc shows how a recurring kind of change is done here. Say when it applies, describe the pattern, name the example file to copy, and list allowed variations and what to avoid. Write one after the same change has been made two or three times, or when a review corrects work for not following the existing way. Update it when its example files change.

## When to update

- In the same change that alters what the doc describes.
- When you find it is wrong. You do not need approval.
- Set `verified` when you have checked the content against reality.
- Split the doc when it grows past its budget.
