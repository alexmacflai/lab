---
kind: instruction
description: Where agents record what they learn: lessons, setup fixes and repeated corrections.
---

# Learning

- Record a lesson in the repository, in the change that taught it. When that is not possible, put it in the handoff.
- Check the known problems in [setup.md](../setup.md) before debugging setup. Record each setup fix there, in the same change.
- When the user corrects the same thing twice, propose an instruction in the relevant domain or in `agents/`. Add it only with the user's [approval](autonomy.md#approval).
- Turn a procedure you repeat into a skill.
- Keep only the user's personal preferences that do not affect the project in a tool's own memory.
