---
name: set-up-copywriting
description: Draft voice and tone, copy rules and microcopy.
---

# Set up copywriting

Writes how the product sounds and the rules its text follows, so text written by different people and agents reads as one product.

## When to use

- Setting up a project, from [set-up-project](../set-up-project/SKILL.md), or when this area is missing or partial.
- Not for: changing an area that is done; edit its files.

## Inputs

- Existing text in the product, its website or its documents, and the user's answers.

## Steps

1. Creating `knowledge/copywriting/` creates a domain: if the user did not choose it in [set-up-project](../set-up-project/SKILL.md), get their [approval](../../../knowledge/agents/autonomy.md#approval) first.
2. Read existing text and note the patterns it already follows.
3. Ask, in one message and at most eight questions, only what you could not read and what would change the drafts: who the product sounds like, how tone changes when things go wrong, the channels it writes for, and any rules the user already applies.
4. Sum up what you understood in a few lines, and let the user correct it before drafting.
5. Copy [README.md](assets/copywriting/README.md) and [voice-and-tone.md](assets/copywriting/voice-and-tone.md) to `knowledge/copywriting/` and fill in `voice-and-tone.md`.
6. Copy [copy-rules.md](assets/copywriting/copy-rules.md) there and fill in the rules the existing text and answers show.
7. If the product has recurring short text, copy [microcopy.md](assets/copywriting/microcopy.md) there with real examples.
8. Follow each template's usage comment, then remove the comment.
9. Show the user the drafts and apply their corrections. Leave a fill-in comment wherever nothing is known yet.
10. Route the new files and run the checker, following [maintain-structure](../maintain-structure/SKILL.md).

## Done when

- `voice-and-tone.md` has its Voice section filled in.
- Every new file passes the checker, and the user knows which fill-in comments remain.
