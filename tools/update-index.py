#!/usr/bin/env python3
"""Write the list of prototypes in the root index.html from each prototype's README.

    python3 tools/update-index.py           # regenerate the list
    python3 tools/update-index.py --check   # exit 1 if the list is out of date or metadata is invalid
"""
import datetime
import html
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROTOTYPES = ROOT / "prototypes"
INDEX = ROOT / "index.html"
START = "<!-- prototypes:start (generated, do not edit) -->"
END = "<!-- prototypes:end -->"
FIELDS = ("title", "description", "date")


def read_front_matter(path):
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---" or "---" not in lines[1:]:
        return None
    fields = {}
    for line in lines[1 : lines.index("---", 1)]:
        key, _, value = line.partition(":")
        fields[key.strip()] = value.strip().strip("\"'")
    return fields


def read_prototype(folder):
    """Return (metadata, problems) for one prototype folder."""
    readme = folder / "README.md"
    if not (folder / "index.html").is_file():
        return None, ["has no index.html"]
    if not readme.is_file():
        return None, ["has no README.md"]
    meta = read_front_matter(readme)
    if meta is None:
        return None, ["README.md has no front-matter"]
    problems = []
    for field in FIELDS:
        value = meta.get(field, "")
        if not value or "<!--" in value:
            problems.append(f"README.md needs a value for '{field}'")
    try:
        datetime.date.fromisoformat(meta.get("date", ""))
    except ValueError:
        problems.append("README.md 'date' must be YYYY-MM-DD")
    return {**meta, "folder": folder.name}, problems


def collect():
    prototypes, problems = [], []
    if PROTOTYPES.is_dir():
        for folder in sorted(p for p in PROTOTYPES.iterdir() if p.is_dir() and not p.name.startswith(".")):
            meta, found = read_prototype(folder)
            problems += [f"prototypes/{folder.name}: {p}" for p in found]
            if not found:
                prototypes.append(meta)
    # Newest first, then by title. Sorting twice keeps the title order within a date.
    prototypes.sort(key=lambda m: m["title"].lower())
    prototypes.sort(key=lambda m: m["date"], reverse=True)
    return prototypes, problems


def render(prototypes):
    rows = []
    for m in prototypes:
        rows.append(
            # Name index.html in full: over file:// a link to the folder opens a directory listing.
            f'      <li><a href="prototypes/{html.escape(m["folder"])}/index.html">'
            f'<time datetime="{html.escape(m["date"])}">{html.escape(m["date"])}</time>'
            f'<span class="title">{html.escape(m["title"])}</span>'
            f'<span class="description">{html.escape(m["description"])}</span></a></li>'
        )
    return "\n".join(rows)


def main():
    check = "--check" in sys.argv[1:]
    prototypes, problems = collect()
    for problem in problems:
        print(f"error: {problem}", file=sys.stderr)
    if problems:
        return 1
    page = INDEX.read_text(encoding="utf-8")
    if START not in page or END not in page:
        print(f"error: index.html is missing the {START} markers", file=sys.stderr)
        return 1
    before = page[: page.index(START) + len(START)]
    after = page[page.index(END) :]
    updated = f"{before}\n{render(prototypes)}\n      {after}"
    if updated == page:
        print(f"Index is up to date: {len(prototypes)} prototypes.")
        return 0
    if check:
        print("error: index.html is out of date. Run: python3 tools/update-index.py", file=sys.stderr)
        return 1
    INDEX.write_text(updated, encoding="utf-8")
    print(f"Updated index.html: {len(prototypes)} prototypes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
