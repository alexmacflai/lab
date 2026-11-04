---
name: set-up-design
description: Draft design principles, visual language and patterns.
---

# Set up design

Writes the intent behind the product's design: what it values, how it looks, and when to use which component and pattern. How things are built stays with the code.

## When to use

- Setting up a project, from [set-up-project](../set-up-project/SKILL.md), or when this area is missing or partial.
- Not for: changing an area that is done; edit its files.

## Inputs

- Existing designs, design files, the product itself, and the user's answers.

## Steps

1. Creating `knowledge/design/` creates a domain: if the user did not choose it in [set-up-project](../set-up-project/SKILL.md), get their [approval](../../../knowledge/agents/autonomy.md#approval) first.
2. Read what exists: design files, tokens, the product's screens and its component code.
3. Ask, in one message and at most eight questions, only what you could not read and what would change the drafts: the principles, what the product should feel like, its references, and where the design files and tokens are.
4. Sum up what you understood in a few lines, and let the user correct it before drafting.
5. Copy [README.md](assets/design/README.md), [principles.md](assets/design/principles.md) and [visual-language.md](assets/design/visual-language.md) to `knowledge/design/` and fill in the last two.
6. If the product has components, copy [components.md](assets/design/components.md) and list them. If it has screens, copy [interaction-patterns.md](assets/design/interaction-patterns.md) and [information-architecture.md](assets/design/information-architecture.md) and describe what exists.
7. Follow each template's usage comment, then remove the comment.
8. Show the user the drafts and apply their corrections. Leave a fill-in comment wherever nothing is known yet.
9. Route the new files and run the checker, following [maintain-structure](../maintain-structure/SKILL.md).

## Done when

- `principles.md` lists the design principles.
- Every new file passes the checker, and the user knows which fill-in comments remain.
