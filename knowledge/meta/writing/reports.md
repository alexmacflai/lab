---
kind: instruction
description: How to write a report, a record of findings, results or the state of work at a handoff, with a complete example.
---

# Writing reports

What a report is and how binding it is: see [kinds.md](../kinds.md). Name it with a date prefix: `2026-10-26-<topic>.md`. A report split into a folder dates the folder instead.

## Example

A complete file. Keep these sections, in this order.

```markdown
---
kind: report
description: Results of the October checkout usability test.
---

# Checkout usability test

## Summary
Four of six participants paid without help. Two missed the delivery-date field, probably because of where it sits; that cause is untested.

## Evidence
- Six recorded sessions, 20–22 October, notes in `research/checkout/`.
- Paid without help: 4 of 6.

## Assumptions
- The participants represent first-time buyers.

## Open questions and next steps
- Test the delivery-date field above the payment form.
```

For a handoff, the summary also states the current state of the work and what is verified versus not yet verified.

## Good

- The summary comes first and stands alone.
- Observations are kept apart from interpretation.
- Assumptions are stated, not implied.

## Too much

- A chronological narrative of the process.
- Guidance for future work: turn it into an instruction, doc or skill and link it.

## When to update

- Reports are records. Do not change them once complete, except to correct a factual error.
- New findings go in a new report that links to the earlier one.
