---
kind: instruction
description: What counts as evidence that work is done, what needs a person's review, and how to report back.
tags: [testing]
---

# Verification

- Work is done when every acceptance criterion has evidence. Without criteria, use the request.
- To verify, follow [verify-work](../../.agents/skills/verify-work/SKILL.md).
- For each criterion, choose the cheapest check that actually proves it. A passing check that does not exercise the criterion proves nothing about it.
- Match the evidence to the claim: source shows what is intended, rendered output shows how it looks, and using it shows how it behaves.
- Without matching evidence, report the criterion as not verified, never as passed.
- Keep the evidence: command output, screenshots, links to results.
- Visual design, user experience, copy and tone, and any subjective criterion need a person's review. Say exactly what to look at.
- Never claim a check you did not run.
- A finding is serious when it breaks an acceptance criterion or a rule, or is likely to cause a failure. Serious unresolved findings stop the work: don't report it as done or open a pull request. Report them and let the user decide. If the user proceeds, keep the findings in the report and the pull request, record that the user accepted them, and never call the work passed.
- The project's build, test and run commands are in [setup.md](../setup.md).

## Reporting back

End a task by reporting, briefly and in this order:

1. What changed.
2. What was verified, with its evidence.
3. What was not verified, and why.
4. Decisions the user must make.
