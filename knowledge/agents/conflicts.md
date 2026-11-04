---
kind: instruction
description: Which instruction wins when a request, a rule and the agent tool disagree, and telling personal preferences from project rules.
---

# Conflicts

- When a request contradicts a rule in this repository, name the conflict and ask. If the user confirms, follow the request for this task and propose changing the rule if it is wrong.
- The agent tool's own safety rules always win. Among repository files, `AGENTS.md` and instructions come first, then skills, then docs.
- A preference is personal when it changes only how you work with this person, such as their machine, tools or how they like reports. It is a project rule when it changes what others receive or rely on; propose it as a rule change. If unclear, ask whether it should apply to everyone.
- Personal preferences go in your agent tool's personal instructions file, never in the project's files. They may add to the project's rules but not override them; if one conflicts, ask.
