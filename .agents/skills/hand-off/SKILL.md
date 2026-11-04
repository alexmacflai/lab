---
name: hand-off
description: Write a handoff report for unfinished work.
---

# Hand off work

Use this when work stops before it is done, or passes to another agent or person. It produces a report that lets the next one continue without asking what happened.

## When to use

- A session ends with work unfinished.
- Work passes to another agent, session or person.
- Not for: finished work; report back as [verification.md](../../../knowledge/agents/verification.md#reporting-back) sets.

## Inputs

- The goal and spec, the current state of the work and its evidence.

## Steps

1. Create `knowledge/reports/YYYY-MM-DD-<topic>-handoff.md`, following [writing/reports.md](../../../knowledge/meta/writing/reports.md).
2. State the goal and link the spec, if any.
3. State the current state: done and verified, with evidence; done but not verified; not started.
4. List assumptions, open questions and lessons not yet recorded elsewhere.
5. State the next step and where the branch and evidence are.
6. Regenerate routing tables and run the checker, following [maintain-structure](../maintain-structure/SKILL.md).

## Done when

- Someone reading only the report knows what is done, what is proven, what is assumed and what to do next.
