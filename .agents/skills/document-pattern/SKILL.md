---
name: document-pattern
description: Record how a recurring change is done here.
---

# Document a pattern

Use this when the same kind of change keeps coming up. It produces a pattern doc that names a real file to copy, so later work fits the existing system without the details being repeated in every request.

## When to use

- The same kind of change has been made two or three times, or a review corrected work for not following the existing way.
- Not for: a way of working the project does not use yet; propose it to the user instead.

## Inputs

- The kind of change, and the examples or review comments that prompted it.

## Steps

1. Find two or three existing examples of the change. If there are fewer than two, stop and report that there is no pattern yet.
2. Compare them. Note what they all share and where they differ.
3. Choose the canonical example: the one that shows the shared parts most clearly. If the examples conflict and none is clearly right, ask the user which to follow.
4. Write the doc as [writing/docs.md](../../../knowledge/meta/writing/docs.md#pattern-docs) describes: when it applies, the pattern, the example file by path, allowed variations and what to avoid.
5. Place it in the domain the change belongs to, or directly in `knowledge/` if it spans domains, and route to it, using [maintain-structure](../maintain-structure/SKILL.md).

## Done when

- Every file the doc names exists, and the pattern it describes is visible in the canonical example.
- Routing reaches the doc, and the checker reports no errors.
