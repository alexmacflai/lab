---
name: verify-work
description: Prove work is done before reporting it.
---

# Verify work

Use this before saying any work is done. It produces evidence for each acceptance criterion and an honest list of what was not verified.

## When to use

- Before reporting a task as done, or before a handoff claims something works.
- Not for: reviewing someone else's change; use [review-change](../review-change/SKILL.md).

## Inputs

- The acceptance criteria from the spec or the start of the task.
- The project's commands in [setup.md](../../../knowledge/setup.md).

## Steps

1. List the acceptance criteria.
2. For each, choose the cheapest check that actually proves it, following [verification.md](../../../knowledge/agents/verification.md).
3. Run each check and keep its evidence.
4. For subjective criteria, ask a person to review, stating exactly what to look at.
5. Report back in the order [verification.md](../../../knowledge/agents/verification.md#reporting-back) sets.

## Done when

- Every criterion is either verified with evidence or listed as not verified with the reason.
