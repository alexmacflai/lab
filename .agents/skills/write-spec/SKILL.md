---
name: write-spec
description: Draft a spec from a request and get it accepted.
---

# Write a spec

Use this when planned work needs agreement that outlasts the conversation. It produces a spec with status `proposal`, the questions the user must answer, and, once the user agrees, an `accepted` spec agents can work from.

## When to use

- Planned work that spans sessions or agents, or whose acceptance criteria a person must agree.
- Not for: a small change the request already defines; use [start-task](../start-task/SKILL.md).

## Inputs

- The user's request, and any reports, docs or earlier specs it names.

## Steps

1. Read the request and the guidance routed from `AGENTS.md` for the areas it touches. Check `knowledge/specs/` for a spec that already covers the work.
2. Decide whether you have enough to draft. If you do, draft and record the gaps under "Open questions". If not, ask only the questions whose answers change the spec, sum up what you understood, and let the user correct it before drafting.
3. Draft the spec in `knowledge/specs/` with status `proposal`, following [writing/specs.md](../../../knowledge/meta/writing/specs.md). Take the goal and its reasons from the request; do not add scope the request does not ask for. Keep apart what the user stated, what is documented, what you observed and what you inferred; mark unknowns as unknown. Write the goal, not a solution.
4. Under "Open questions", list every decision only the user can make. Give each the options and your recommendation.
5. Show the user the goal, scope, non-goals, acceptance criteria and open questions, in the message itself. Ask them to answer the questions and accept the spec.
6. Record each answer in the spec. Set the status to `accepted` only after the user's explicit yes, as [autonomy.md](../../../knowledge/agents/autonomy.md#approval) requires.

## Done when

- The spec is `accepted` by the user, or stays a `proposal` with its remaining questions stated.
- Every acceptance criterion can be checked, and the checker reports no errors.
