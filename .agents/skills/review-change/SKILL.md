---
name: review-change
description: Review a change against its request and guidance.
---

# Review a change

Use this to review a change made by an agent or a person. It produces findings the author can act on, each tied to the request, the spec or a rule.

## When to use

- Reviewing a diff, branch or pull request.
- Not for: checking your own work before reporting it; use [verify-work](../verify-work/SKILL.md).

## Inputs

- The change, and the request or `accepted` spec it implements.

## Steps

1. Read the request or spec: goal, non-goals and acceptance criteria.
2. Follow routing from `AGENTS.md` to the guidance for the areas the change touches.
3. Read the whole change. Note anything missing, beyond scope, contrary to guidance, or likely to break.
4. Inspect the evidence the author gave. Run a check yourself where a claim matters and is cheap to confirm.
5. Before writing findings, list what is in scope: each acceptance criterion and each area the change touches. Mark each as checked, not applicable (with why), or not checked.
6. Write each finding with its location, the problem, why it matters and the rule or criterion it breaks. Put the most serious first. Report problems the change introduced or made worse; list problems that were already there separately, as out of scope.

## Done when

- Every acceptance criterion is marked as met, not met or not checked.
- The report says, for each part in scope, whether it was checked, not applicable or not checked.
- Each finding is actionable, and no check is claimed that was not run.
