---
kind: instruction
description: How to write, change and complete a spec, a description of intended work, with a complete example.
---

# Writing specs

What a spec is and how binding it is: see [kinds.md](../kinds.md). It binds its work until its status is `done`.

## Example

A complete file. Keep these sections, in this order.

```markdown
---
kind: spec
status: proposal
description: Moving the checkout delivery-date field so buyers stop missing it.
---

# Move the delivery-date field

## Goal
Buyers see the delivery date before paying. In testing, two of six missed it and got the wrong day.

## Scope
- Move the field above the payment form, on every screen size.

## Non-goals
- Redesigning the payment form.

## Constraints
- Keep the field's existing validation.

## Acceptance criteria
- The field appears above the payment form at every breakpoint.
- In a test with five buyers, none misses it.

## Open questions
- None.
```

## Good

- The goal explains why, so agents can keep the intended nuance.
- Non-goals name what not to do, which prevents overcomplicated work.
- Every acceptance criterion can be checked.
- Optional: a Decision section saying what was chosen, over what, and at what cost; keep it once done.

## Too much

- Implementation detail that is not a real constraint.
- Background that already exists in docs: link to it.

## Status

- `proposal`: under discussion.
- `accepted`: agreed; binding for the work.
- `done`: all acceptance criteria met.
- `deprecated`: abandoned or replaced; link to the replacement.

## When to update

- Re-read the spec before reporting the work as done, and check each acceptance criterion.
- Change the scope of an accepted spec only with the user's [approval](../../agents/autonomy.md#approval).
- Set `done` when the criteria are met, in the change that completes the work.
- In that change, update the feature docs in `product/features/` that the work changes.
