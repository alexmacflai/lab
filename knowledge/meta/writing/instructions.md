---
kind: instruction
description: How to write an instruction, a binding rule for how to work, with a complete example.
---

# Writing instructions

What an instruction is and how binding it is: see [kinds.md](../kinds.md). Write it for agents.

## Example

A complete file.

```markdown
---
kind: instruction
description: Rules for interface text: capitalisation, button labels and error messages.
---

# Interface text

- Use sentence case for buttons and headings.
- Name the action on buttons: "Save changes", not "OK".
- In error messages, say what went wrong and what to do next. People fix problems faster when told how.
```

Group rules under headings when there are more than about ten.

## Good

- Specific and checkable: "Run the linter before committing", not "Keep code clean".
- A reason where it helps agents judge edge cases.
- Each rule stated once, in the file that owns its topic.

## Too much

- Background or explanation: move it to a doc and link it.
- Step-by-step procedures: move them to a skill.
- Rules that apply to only one task: put them in that task's skill.

## When to update

- When the way the project works changes, with the user's [approval](../../agents/autonomy.md#approval).
- When a rule is repeatedly misread or ignored: propose clearer wording.
