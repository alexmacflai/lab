---
kind: doc
description: The principles every convention and instruction must satisfy, and how to check a change against them.
tags: [principles]
---

# Principles

These principles decide whether a convention or instruction belongs in this project. One that conflicts with them should be changed or removed, however useful it looks in isolation.

## 1. Economy: the structure must pay for itself

Every file, field and folder has a cost: tokens to read, time to maintain, and attention to navigate. The structure is only worth keeping if working with it costs less time and money than working without it, including the cost of misunderstandings between people and agents.

- Load context progressively: an agent reads only what its current task needs.
- Keep each kind of file within its [size budget](writing/general.md#size-budgets).
- Remove structure that does not save more than it costs.

## 2. AI-first, human-friendly

The structure mainly exists to orient agents: tell them where things are and how to work, so they don't spend time making decisions that have already been made. People must still be able to read and maintain everything.

- Write each section for its actual reader.
- Agent-facing text is terse, direct and imperative.
- Human-facing text uses readable prose and rich formatting.
- Files with both readers, such as skills, have a short human summary followed by agent steps, each written in its own style.

## 3. Every kind of file has a writing standard

Each kind of Markdown file has a defined purpose, what good looks like, what is too much, and when it must be updated. Agents should never have to guess the format, length or tone of a file. The standards live in [writing/](writing/README.md).

## 4. Decide once

Recurring choices are settled by conventions, so agents don't re-decide or improvise them. If two agents could reasonably do something differently, state the default.

## 5. Foolproof by design

There is one obvious place for every kind of material and one obvious next step for every common task. Mistakes are caught by automated checks, not by relying on agents to be careful.

## 6. Single source of truth

Each piece of information lives in one place and everything else links to it. Anything that can be derived, such as folder routing tables, dates and tool-specific instruction files, is generated rather than written by hand.

## 7. Self-maintaining

When a task changes something that a document describes, updating that document is part of the task, without waiting to be asked. Updating documents when nothing they describe has changed is unnecessary and should be avoided.

## 8. Evidence over assertion

Work is done when it is shown to be done. Results come with the evidence that supports them, and assumptions are stated rather than implied, especially when work passes between agents, sessions or people.

## Checking a change

Before adding or changing a convention or instruction:

1. Test it against each principle above.
2. In the proposal or spec, state how it satisfies each principle it affects.
3. Get the user's [approval](../agents/autonomy.md#approval) before it takes effect.
