---
name: set-up-environment
description: Fill in setup steps and commands, and prove them.
---

# Set up environment

Fills in how to set up, build, test and run the project, and checks that the steps work, so agents stop rediscovering them.

## When to use

- Setting up a project, from [set-up-project](../set-up-project/SKILL.md), or when this area is missing or partial.
- Not for: changing an area that is done; edit its files.

## Inputs

- The project's README, dependency manifests, scripts and continuous integration configuration, and the user's answers.

## Steps

1. Read the README, dependency manifests, scripts and continuous integration configuration for setup steps and commands.
2. Fill in [setup.md](../../../knowledge/setup.md): prerequisites, setup steps ending with a command that proves the environment works, and the commands for build, test, lint and run.
3. Run the proving command and the test command. Record any problem you hit, and its fix, under Known problems.
4. Ask the user about shared resources you could not find, such as ports, databases and test accounts.
5. Show the user the drafts and apply their corrections. Leave a fill-in comment wherever nothing is known yet.
6. Route the new files and run the checker, following [maintain-structure](../maintain-structure/SKILL.md).

## Done when

- `knowledge/setup.md` has its setup steps and commands filled in, and the proving command was run.
- Every new file passes the checker, and the user knows which fill-in comments remain.
