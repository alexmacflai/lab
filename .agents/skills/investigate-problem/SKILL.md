---
name: investigate-problem
description: Find the cause of a failure from evidence.
---

# Investigate a problem

Use this when something is broken or behaves unexpectedly and the cause is not known. It produces a cause supported by evidence, or a clear statement of what is still unknown.

## When to use

- A failure, error, wrong output or unexpected behaviour.
- Not for: a known problem with a recorded fix; apply the fix from `knowledge/setup.md`.

## Inputs

- What was observed, where, and how to reproduce it if known.

## Steps

1. State the observed problem exactly: what happened, what was expected, where.
2. Check the known problems in [setup.md](../../../knowledge/setup.md) and any guidance routed from `AGENTS.md` for the affected area.
3. Reproduce the problem. If you cannot, record what you tried.
4. List plausible causes. Test the cheapest to check first, one at a time, keeping the evidence for each.
5. Stop when one cause explains all the evidence. Change nothing beyond what the investigation needs.
6. If a setup problem was the cause, record the fix in `knowledge/setup.md`.

## Done when

- The report states the cause and its evidence, or the causes ruled out and what remains uncertain.
- Any fix is described separately from the diagnosis, and is applied only if it is in scope.
