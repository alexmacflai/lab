---
kind: doc
description: How to set up, build, test and run the project, the shared resources agents use, and known setup problems.
tags: [testing]
---

# Setup

How to set up, build, test and run this project, and the problems already solved.

## Setting up

Prototypes need no installation or build. Serving them needs Node.js, for `npx`.

From the repository root, start a server, then open `http://127.0.0.1:8080/` for the index:

```bash
npx --yes http-server -a 127.0.0.1 -p 8080 -c-1 .
```

To prove it works, request part of a video. The answer must be `206`:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -r 0-99 http://127.0.0.1:8080/prototypes/keyhole/video.mp4
```

Then install the pre-commit hook, once per clone:

```bash
ln -s ../../tools/pre-commit .git/hooks/pre-commit
```

## Commands

| Task | Command |
|---|---|
| Run | `npx --yes http-server -a 127.0.0.1 -p 8080 -c-1 .` |
| Update the index of prototypes | `python3 tools/update-index.py` |
| Check the conventions | `python3 knowledge/tools/adf.py check` |
| Build, test, lint | None: prototypes have no build step or automated tests. |

## Shared resources

- Ports: agents working at the same time each pick a free port. Check first with `lsof -nP -iTCP:<port> -sTCP:LISTEN`.
- Databases and test accounts: none.

## Known problems

| Symptom | Cause | Fix | Verified |
|---|---|---|---|
| A video does not play in Safari, or the server answers `200` to a range request | Python's `http.server` ignores Range requests | Use `http-server`, as above | 2026-11-04 |
| The keyhole prototype says it can't run as a local file | The page was opened from `file://`, which taints the WebGL texture | Serve it over HTTP | 2026-11-04 |
| A request returns another project's response or a 404 | Another process is on that port, sometimes on all interfaces | Pick a free port and check it with `lsof` | 2026-11-04 |
