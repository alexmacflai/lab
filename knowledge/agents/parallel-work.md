---
kind: instruction
description: How agents share a project: branches, claiming work, shared files, evidence and resources.
---

# Parallel work

- Use one branch per task and, where the tools allow, one worktree.
- Before starting, check that no other task is already doing the same work, such as an existing branch for it.
- Do not edit files another active task is changing. Coordinate through the user.
- After merging, regenerate generated files such as folder routing tables instead of resolving their conflicts by hand.
- Keep evidence in paths specific to the task, such as dated report names.
- Use the shared resources allocated in [setup.md](../setup.md#shared-resources): ports, databases, test accounts. Never reuse another agent's running process or data.
