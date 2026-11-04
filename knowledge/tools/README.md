# Tools

Scripts that keep `AGENTS.md`, `knowledge/` and `.agents/skills/` consistent with the conventions in `meta/`. They need Python 3.9 or later and nothing else.

## Usage

Run from the repository root:

```bash
python3 knowledge/tools/adf.py route            # regenerate folder routing tables
python3 knowledge/tools/adf.py route --check    # exit 1 if a routing table is out of date
python3 knowledge/tools/adf.py check            # report problems; exit 1 on errors
python3 knowledge/tools/adf.py check --strict   # also exit 1 on warnings
```

Both commands cover only `AGENTS.md`, `knowledge/` and `.agents/skills/`; the rest of the project is never checked or changed. `route` rewrites only the lines between routing markers. `check` reports broken links, invalid front-matter, descriptions and skill headers, unknown tags, misplaced kinds, bad names, missing or malformed folder READMEs, stale routing tables, unreachable files and possible secrets as errors. It reports size budgets, long descriptions and unverified docs as warnings. It skips files git ignores.

## Pre-commit hook

`pre-commit` runs `check` before each commit and blocks it on errors, without changing files. It checks the working tree, not only staged changes. Install it once per clone:

```bash
ln -s ../../knowledge/tools/pre-commit .git/hooks/pre-commit
```
