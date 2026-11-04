---
name: start-task
description: Turn a request into a goal and acceptance criteria.
---

# Start a task

Use this at the start of every task, including one handed over by another agent or session. It produces a short written statement of what will be done and how it will be shown to be done, before anything changes.

## When to use

- Starting new work, or continuing work from a handoff report.
- Not for: answering a question that changes nothing.

## Inputs

- The user's request, and the spec or handoff report it names, if any.

## Steps

1. Read the request. If it names a spec, read it; work only from a spec with status `accepted`.
2. If the work continues from a handoff, read the latest handoff report for it in `knowledge/reports/`. Check its "done and verified" claims cheaply before relying on them.
3. Follow routing from `AGENTS.md` to the guidance and skills the task needs. Read only what applies. Name the guidance you will follow and anything you are deliberately setting aside, so the user can correct a misreading before work starts.
4. Write down the goal, constraints, non-goals and acceptance criteria. Without a spec, derive them from the request.
5. Resolve unknowns using [autonomy.md](../../../knowledge/agents/autonomy.md): ask when the answer changes the result; otherwise choose a reversible default and state it.
6. Plan the change in a few steps.

## Done when

- The goal and acceptance criteria are written down, and every assumption is stated, before the first change.
