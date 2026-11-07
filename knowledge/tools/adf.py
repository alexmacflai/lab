#!/usr/bin/env python3
"""Tools for repositories that use the Agent Development Framework.

Requires Python 3.9 or later and only the standard library.

Usage:
    python3 adf.py route [--check] [--root PATH]
    python3 adf.py check [--strict] [--root PATH]

Commands:
    route   Rewrite the generated routing table in every folder README
            that has routing markers. With --check, change nothing and exit
            with status 1 if any routing table is out of date.
    check   Report files that break the framework's conventions. Exits
            with status 1 if there are errors, or with --strict, warnings.

Both commands cover only AGENTS.md, knowledge/ and .agents/skills/ under the
root; the rest of the project keeps its own layout and is never touched.
"""

import argparse
import collections
import datetime
import os
import re
import subprocess
import sys
import urllib.parse

ROUTING_START = "<!-- routing:start (generated, do not edit) -->"
ROUTING_START_PREFIX = "<!-- routing:start"
ROUTING_END = "<!-- routing:end -->"

# Files that never carry front-matter and never appear in a routing table.
EXEMPT_FILES = {"README.md", "AGENTS.md", "CLAUDE.md"}
SKIPPED_DIRS = {"node_modules", "__pycache__"}

# Conventions from knowledge/meta/.
# The framework covers only these paths; the rest of a project keeps its own layout.
KNOWLEDGE = "knowledge/"
SKILLS = ".agents/skills/"
SKILL_FILE = "SKILL.md"
KIND_FOLDERS = {"specs": "spec", "reports": "report"}
KINDS = {"instruction", "doc", "skill", "spec", "report"}
FIELDS = {"kind", "description", "tags", "status", "verified"}
# SKILL.md files follow the Agent Skills standard instead.
SKILL_FIELDS = {"name", "description"}
DESCRIPTION_CHARS = 1024
SKILL_NAME_CHARS = 64
# Tools show a skill's description in their menus, so it stays short.
SKILL_DESCRIPTION_WORDS = 12
STATUSES = {"proposal", "accepted", "done", "deprecated"}
WORD_BUDGETS = {"instruction": 300, "doc": 1500, "skill": 700, "spec": 1000}
AGENTS_BUDGET = 400
README_BUDGET = 200
FILE_DESCRIPTION_WORDS = 25
ROUTING_HEADER = "| File | Description |"
ROUTING_ROW = re.compile(r"^\| \[[^\]]+\]\(([^)]+)\)")
STALE_DAYS = 180
# Fill-in and template comments are scaffolding, removed once a file is written.
SCAFFOLD_COMMENT = re.compile(r"<!--\s*(fill in|template):.*?-->", re.S)
# Any tags.md inside a meta/ folder is a tag registry.
TAG_REGISTRY_NAME = "tags.md"
NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
DATE_PREFIX = re.compile(r"^\d{4}-\d{2}-\d{2}-")
# Common token formats; agents must never write secrets into these files.
SECRET_PATTERNS = [
    ("private key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("AWS access key", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("GitHub token", re.compile(r"\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})")),
    ("Slack token", re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{35}")),
    ("Stripe key", re.compile(r"\b[rs]k_(live|test)_[A-Za-z0-9]{16,}")),
    ("API key", re.compile(r"\bsk-[A-Za-z0-9_-]{20,}")),
]
LINK_PATTERN = re.compile(r"\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)")


# Front-matter


def unquote(value):
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
        return value[1:-1]
    return value


def parse_value(value):
    """Parse a front-matter value: a flow list such as [a, b], or a scalar."""
    if value.startswith("[") and value.endswith("]"):
        items = (unquote(item.strip()) for item in value[1:-1].split(","))
        return [item for item in items if item]
    if value[:1] not in "'\"":
        value = re.split(r"\s+#", value, maxsplit=1)[0].strip()
    return unquote(value)


def read_front_matter(text):
    """Return a file's front-matter fields as a dict, or None if it has none."""
    lines = text.split("\n")
    if not lines or lines[0].strip() != "---":
        return None
    fields = {}
    key = None
    for line in lines[1:]:
        if line.strip() == "---":
            return fields
        field = re.match(r"^([A-Za-z_][\w-]*):\s*(.*)$", line)
        nested = re.match(r"^\s+([A-Za-z_][\w-]*):\s*(.*)$", line)
        item = re.match(r"^\s*-\s+(.*)$", line)
        if nested and key and (fields[key] == "" or isinstance(fields[key], dict)):
            # A nested map, such as a skill's metadata block.
            if not isinstance(fields[key], dict):
                fields[key] = {}
            fields[key][nested.group(1)] = parse_value(nested.group(2).strip())
        elif field:
            key = field.group(1)
            fields[key] = parse_value(field.group(2).strip())
        elif item and key:
            if not isinstance(fields[key], list):
                fields[key] = []
            fields[key].append(unquote(item.group(1).strip()))
    return None


def strip_front_matter(text):
    match = re.match(r"---\n.*?\n---\n", text, re.S)
    return text[match.end():] if match else text


def as_list(value):
    if not value:
        return []
    return value if isinstance(value, list) else [value]


def in_scope(path):
    """Whether a /-separated path relative to the root is covered by the framework."""
    return path == "AGENTS.md" or path.startswith(KNOWLEDGE) or path.startswith(SKILLS)


def is_skill_file(path):
    return path.startswith(SKILLS) and path.count("/") == 3 and path.endswith("/" + SKILL_FILE)


def in_skill_folder(path):
    return path.startswith(SKILLS) and path.count("/") > 2


def is_skill_asset(path):
    # Templates a skill copies into the project; checked as the kind they will be there.
    parts = path.split("/")
    return path.startswith(SKILLS) and len(parts) > 4 and parts[3] == "assets"


# Routing


def read_text(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def readme_purpose(path):
    """Return the first sentence of a README's first paragraph after its title."""
    for paragraph in re.split(r"\n\s*\n", read_text(path)):
        paragraph = " ".join(paragraph.split())
        if not paragraph or paragraph.startswith(("#", "<!--", "---")):
            continue
        sentence = re.match(r"(.+?[.!?])(\s|$)", paragraph)
        return sentence.group(1) if sentence else paragraph
    return ""


def routing_row(name, link, description, tags, with_tags):
    cells = ["[{}]({})".format(name, link), description.replace("|", "\\|")]
    if with_tags:
        cells.append(", ".join(tags))
    return "| " + " | ".join(cells) + " |"


def sort_key(name):
    # Sort by name without extension, so accessibility.md comes before accessibility-forms.md.
    return os.path.splitext(name)[0]


def folder_tags(folder):
    """Return the tags of every Markdown file under a folder, sorted and without repeats."""
    tags = set()
    for parent, dirs, files in os.walk(folder):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d not in SKIPPED_DIRS]
        for name in files:
            if name.endswith(".md") and name not in EXEMPT_FILES:
                fields = read_front_matter(read_text(os.path.join(parent, name)))
                tags.update(as_list((fields or {}).get("tags")))
    return sorted(tags)


def build_routing(folder, warnings):
    """Return the routing table for a folder: its Markdown files, then its subfolders."""
    files, folders = [], []
    for name in sorted(os.listdir(folder), key=sort_key):
        path = os.path.join(folder, name)
        if os.path.isdir(path):
            readme = os.path.join(path, "README.md")
            skill = os.path.join(path, SKILL_FILE)
            if name.startswith(".") or name in SKIPPED_DIRS:
                continue
            if os.path.isfile(skill):
                description = (read_front_matter(read_text(skill)) or {}).get("description", "")
                folders.append((name + "/", name + "/" + SKILL_FILE, description, []))
            elif os.path.isfile(readme):
                folders.append((name + "/", name + "/README.md", readme_purpose(readme), folder_tags(path)))
        elif name.endswith(".md") and name not in EXEMPT_FILES:
            fields = read_front_matter(read_text(path))
            if not fields or not fields.get("description"):
                warnings.append("{}: no front-matter description; left out of the routing table".format(path))
                continue
            files.append((name, name, fields["description"], as_list(fields.get("tags"))))
    entries = files + folders
    if not entries:
        return []
    with_tags = any(entry[3] for entry in entries)
    header = [ROUTING_HEADER + (" Tags |" if with_tags else ""), "|---|---|" + ("---|" if with_tags else "")]
    return header + [routing_row(*entry, with_tags) for entry in entries]


def routing_bounds(lines):
    """Return the (start, end) line numbers of the routing markers, or None."""
    starts = [i for i, line in enumerate(lines) if line.strip().startswith(ROUTING_START_PREFIX)]
    ends = [i for i, line in enumerate(lines) if line.strip() == ROUTING_END]
    if not starts or not ends or ends[0] < starts[0]:
        return None
    return starts[0], ends[0]


def update_routing(readme, warnings):
    """Return the README text with a regenerated routing table, or None if it has no markers."""
    lines = read_text(readme).split("\n")
    if any(line.strip().startswith(ROUTING_START_PREFIX) for line in lines) and not routing_bounds(lines):
        warnings.append("{}: routing start marker has no end marker; not updated".format(readme))
        return None
    bounds = routing_bounds(lines)
    if not bounds:
        return None
    entries = build_routing(os.path.dirname(readme), warnings)
    lines[bounds[0]:bounds[1] + 1] = [ROUTING_START] + entries + [ROUTING_END]
    return "\n".join(lines)


def find_readmes(root):
    skills = os.path.join(root, SKILLS, "README.md")
    if os.path.isfile(skills):
        yield skills
    top = os.path.join(root, KNOWLEDGE)
    for folder, dirs, files in os.walk(top):
        dirs[:] = sorted(d for d in dirs if not d.startswith(".") and d not in SKIPPED_DIRS)
        if "README.md" in files:
            yield os.path.join(folder, "README.md")


def run_route(root, check):
    warnings, stale = [], []
    for readme in find_readmes(root):
        new_text = update_routing(readme, warnings)
        if new_text is None or new_text == read_text(readme):
            continue
        stale.append(os.path.relpath(readme, root))
        if not check:
            with open(readme, "w", encoding="utf-8") as f:
                f.write(new_text)
    for warning in warnings:
        print("warning: " + warning, file=sys.stderr)
    for path in stale:
        print(("Out of date: " if check else "Updated: ") + path)
    if not stale:
        print("All routing tables are up to date.")
    return 1 if check and stale else 0


# Check

Finding = collections.namedtuple("Finding", "level path line message")


def list_files(root):
    """Return the repository's files as /-separated paths relative to root.

    Uses git when available, so ignored files are skipped.
    """
    try:
        result = subprocess.run(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
            cwd=root, capture_output=True, check=True,
        )
        paths = [p for p in result.stdout.decode("utf-8").split("\0") if p]
    except (OSError, subprocess.CalledProcessError):
        paths = []
        for folder, dirs, files in os.walk(root):
            dirs[:] = [d for d in dirs if (d == ".agents" or not d.startswith(".")) and d not in SKIPPED_DIRS]
            paths.extend(os.path.relpath(os.path.join(folder, f), root).replace(os.sep, "/") for f in files)
    return sorted(p for p in paths if os.path.isfile(os.path.join(root, p)))


def prose_lines(text, keep_inline_code=False):
    """Yield (line number, line) for lines outside fenced code blocks."""
    fence = None
    for number, line in enumerate(text.split("\n"), 1):
        marker = re.match(r"^\s*(`{3,}|~{3,})", line)
        if marker:
            if fence is None:
                fence = marker.group(1)[0]
            elif marker.group(1)[0] == fence:
                fence = None
            continue
        if fence is None:
            yield number, line if keep_inline_code else re.sub(r"`[^`]*`", "", line)


def heading_anchors(text):
    """Return the GitHub-style anchors of a Markdown file's headings."""
    anchors, seen = set(), collections.Counter()
    for _, line in prose_lines(strip_front_matter(text), keep_inline_code=True):
        heading = re.match(r"^#{1,6}\s+(.*?)\s*#*\s*$", line)
        if heading:
            anchor = re.sub(r"[^\w\- ]", "", heading.group(1).lower()).replace(" ", "-")
            anchors.add(anchor if not seen[anchor] else "{}-{}".format(anchor, seen[anchor]))
            seen[anchor] += 1
    return anchors


def word_count(text):
    return len(text.split())


def is_tag_registry(path):
    parts = path.split("/")
    return parts[-1] == TAG_REGISTRY_NAME and "meta" in parts[:-1]


def read_registry(texts):
    """Return {tag: (registry path, line)} for every tag registry, or None if there is no registry."""
    registries = sorted(path for path in texts if is_tag_registry(path))
    if not registries:
        return None
    tags = {}
    for path in registries:
        # Rows of registry tables only; code blocks hold examples.
        for number, line in prose_lines(texts[path], keep_inline_code=True):
            row = re.match(r"^\|\s*`([^`]+)`\s*\|", line)
            if row:
                tags.setdefault(row.group(1), (path, number))
    return tags


def expected_kind(path):
    if is_skill_asset(path):
        return None, None
    if path.startswith(SKILLS):
        return SKILLS, "skill"
    parts = path.split("/")
    if len(parts) > 2 and parts[1] in KIND_FOLDERS:
        return parts[1] + "/", KIND_FOLDERS[parts[1]]
    return None, None


class Checker:
    def __init__(self, root, today):
        self.root = root
        self.today = today
        self.findings = []
        self.files = [p for p in list_files(root) if in_scope(p)]
        self.markdown = [p for p in self.files if p.endswith(".md")]
        self.texts = {p: read_text(os.path.join(root, p)) for p in self.markdown}
        self.registry = read_registry(self.texts)
        self.links = collections.defaultdict(set)
        self.used_tags = set()

    def error(self, path, line, message):
        self.findings.append(Finding("error", path, line, message))

    def warning(self, path, line, message):
        self.findings.append(Finding("warning", path, line, message))

    def run(self):
        for path in self.markdown:
            self.check_front_matter(path)
            self.check_size(path)
            self.check_links(path)
            self.check_secrets(path)
        self.check_names()
        self.check_readmes()
        self.check_reachable()
        self.check_unused_tags()
        return sorted(self.findings, key=lambda f: (f.path, f.line, f.message))

    def check_front_matter(self, path):
        name = path.split("/")[-1]
        fields = read_front_matter(self.texts[path])
        if name in EXEMPT_FILES:
            if fields is not None:
                self.error(path, 1, "{} must not have front-matter".format(name))
            return
        if fields is None:
            self.error(path, 1, "missing front-matter")
            return
        if is_skill_file(path):
            self.check_skill_fields(path, fields)
            return
        for field in sorted(set(fields) - FIELDS):
            self.error(path, 1, "unknown front-matter field '{}'".format(field))

        kind = fields.get("kind")
        if not kind:
            self.error(path, 1, "missing 'kind'")
        elif kind not in KINDS:
            self.error(path, 1, "unknown kind '{}'".format(kind))
        else:
            folder, expected = expected_kind(path)
            if expected and kind != expected:
                self.error(path, 1, "kind '{}' does not match '{}' (expected '{}')".format(kind, folder, expected))

        self.check_description(path, fields)

        status = fields.get("status")
        if kind == "spec" and not status:
            self.error(path, 1, "specs need a 'status'")
        elif status and kind != "spec":
            self.error(path, 1, "'status' is only used on specs")
        elif status and status not in STATUSES:
            self.error(path, 1, "unknown status '{}'".format(status))

        if "verified" in fields:
            self.check_verified(path, kind, fields["verified"])

        tags = as_list(fields.get("tags"))
        self.used_tags.update(tags)
        if tags and self.registry is None:
            self.error(path, 1, "uses tags but there is no tag registry (a tags.md in a meta/ folder)")
        for tag in tags:
            if self.registry is not None and tag not in self.registry:
                self.error(path, 1, "tag '{}' is not in any tag registry".format(tag))

        if kind == "report" and not any(DATE_PREFIX.match(part) for part in path.split("/")[2:]):
            self.error(path, 1, "report names, or their report folder, start with a date: YYYY-MM-DD-<topic>")

    def check_unused_tags(self):
        for tag, (path, line) in sorted((self.registry or {}).items()):
            if tag not in self.used_tags:
                self.warning(path, line, "tag '{}' is in the registry but no file uses it".format(tag))

    def check_description(self, path, fields):
        description = fields.get("description")
        if not description:
            self.error(path, 1, "missing 'description'")
        elif word_count(description) > FILE_DESCRIPTION_WORDS:
            self.warning(path, 1, "description has {} words (limit {})".format(word_count(description), FILE_DESCRIPTION_WORDS))

    def check_skill_fields(self, path, fields):
        for field in sorted(set(fields) - SKILL_FIELDS):
            self.error(path, 1, "unknown skill field '{}'; SKILL.md uses only name and description".format(field))
        folder = path.split("/")[2]
        name = fields.get("name")
        if not name:
            self.error(path, 1, "missing 'name'")
        elif name != folder:
            self.error(path, 1, "name '{}' must match the skill folder '{}'".format(name, folder))
        elif len(name) > SKILL_NAME_CHARS or not NAME_PATTERN.match(name):
            self.error(path, 1, "skill names are lowercase kebab-case, at most {} characters".format(SKILL_NAME_CHARS))
        description = fields.get("description")
        if not description:
            self.error(path, 1, "missing 'description'")
        elif len(description) > DESCRIPTION_CHARS:
            self.error(path, 1, "description has {} characters (limit {})".format(len(description), DESCRIPTION_CHARS))
        elif word_count(description) > SKILL_DESCRIPTION_WORDS:
            self.warning(path, 1, "description has {} words (limit {})".format(word_count(description), SKILL_DESCRIPTION_WORDS))

    def check_verified(self, path, kind, value):
        if kind != "doc":
            self.error(path, 1, "'verified' is only used on docs")
            return
        try:
            verified = datetime.datetime.strptime(str(value), "%Y-%m-%d").date()
        except ValueError:
            self.error(path, 1, "'verified' must be a date: YYYY-MM-DD")
            return
        age = (self.today - verified).days
        if age < 0:
            self.error(path, 1, "'verified' is in the future")
        elif age > STALE_DAYS:
            self.warning(path, 1, "verified {} days ago; check it is still accurate".format(age))

    def check_size(self, path):
        name = path.split("/")[-1]
        text = SCAFFOLD_COMMENT.sub("", self.texts[path])
        if name == "AGENTS.md":
            budget, words = AGENTS_BUDGET, word_count(text)
        elif name == "README.md":
            lines = text.split("\n")
            bounds = routing_bounds(lines)
            if bounds:
                lines = lines[:bounds[0]] + lines[bounds[1] + 1:]
            budget, words = README_BUDGET, word_count("\n".join(lines))
        elif name in EXEMPT_FILES:
            return
        else:
            kind = "skill" if is_skill_file(path) else (read_front_matter(text) or {}).get("kind")
            budget = WORD_BUDGETS.get(kind)
            words = word_count(strip_front_matter(text))
        if budget and words > budget:
            self.warning(path, 1, "{} words (budget {})".format(words, budget))

    def check_secrets(self, path):
        for number, line in enumerate(self.texts[path].split("\n"), 1):
            for name, pattern in SECRET_PATTERNS:
                if pattern.search(line):
                    self.error(path, number, "possible secret ({}); remove it and state where it is kept instead".format(name))

    def check_links(self, path):
        folder = os.path.dirname(path)
        for number, line in prose_lines(self.texts[path]):
            for match in LINK_PATTERN.finditer(line):
                target = match.group(1)
                if re.match(r"^[a-z][a-z0-9+.-]*:", target, re.I):
                    continue  # URL, mailto: and similar
                target_path, _, anchor = target.partition("#")
                target_path = urllib.parse.unquote(target_path)
                if not target_path:
                    resolved = path
                elif target_path.startswith("/"):
                    resolved = os.path.normpath(target_path.lstrip("/")).replace(os.sep, "/")
                else:
                    resolved = os.path.normpath(os.path.join(folder, target_path)).replace(os.sep, "/")
                full = os.path.join(self.root, resolved)
                if resolved.startswith("../") or not os.path.exists(full):
                    self.error(path, number, "broken link: {}".format(target))
                    continue
                if os.path.isdir(full):
                    resolved = "README.md" if resolved == "." else resolved + "/README.md"
                if resolved in self.texts:
                    self.links[path].add(resolved)
                if anchor and resolved in self.texts and anchor not in heading_anchors(self.texts[resolved]):
                    self.error(path, number, "broken link: no heading for #{} in {}".format(anchor, resolved))

    def check_names(self):
        folders = set()
        for path in self.markdown:
            parts = path.split("/")
            folders.update("/".join(parts[:i + 1]) for i in range(len(parts) - 1))
            name = parts[-1]
            if name not in EXEMPT_FILES and name != SKILL_FILE and not NAME_PATTERN.match(name[:-3]):
                self.error(path, 1, "file names use lowercase kebab-case")
        for folder in sorted(folders):
            name = folder.split("/")[-1]
            if not name.startswith(".") and not NAME_PATTERN.match(name):
                self.error(folder, 1, "folder names use lowercase kebab-case")

    def check_readmes(self):
        folders = {os.path.dirname(p) for p in self.markdown
                   if p.split("/")[-1] not in EXEMPT_FILES and not in_skill_folder(p)}
        if any(is_skill_file(p) for p in self.markdown):
            folders.add(SKILLS.rstrip("/"))
        for folder in sorted(folders):
            readme = (folder + "/README.md").lstrip("/")
            if readme not in self.texts:
                self.error(folder or ".", 1, "folder has Markdown files but no README.md")
        for path in self.markdown:
            # README templates get their routing table once copied.
            if path.split("/")[-1] != "README.md" or is_skill_asset(path):
                continue
            if path.startswith(KNOWLEDGE):
                self.check_readme_structure(path)
            full = os.path.join(self.root, path)
            new_text = update_routing(full, [])
            if new_text is not None and new_text != self.texts[path]:
                self.error(path, 1, "routing table is out of date; run: adf.py route")

    def check_readme_structure(self, path):
        """Folder READMEs in knowledge/: title, purpose, routing table."""
        text = self.texts[path]
        lines = text.split("\n")
        first = next((line for line in lines if line.strip()), "")
        if not first.startswith("# "):
            self.error(path, 1, "folder README must start with a '# ' title")
        if not readme_purpose(os.path.join(self.root, path)):
            self.error(path, 1, "folder README needs a sentence on the folder's purpose after its title")
        bounds = routing_bounds(lines)
        if not bounds:
            if build_routing(os.path.dirname(os.path.join(self.root, path)), []):
                self.error(path, 1, "folder README has no generated routing table; add the routing markers and run: adf.py route")
            return

    def routing_targets(self, readme):
        """Return the files a README's generated routing table lists."""
        lines = self.texts[readme].split("\n")
        bounds = routing_bounds(lines)
        folder = os.path.dirname(readme)
        targets = set()
        for line in lines[bounds[0] + 1:bounds[1]] if bounds else []:
            row = ROUTING_ROW.match(line)
            if row:
                targets.add((folder + "/" + row.group(1)).lstrip("/"))
        return targets

    def check_reachable(self):
        """Report Markdown files that no link or routing table leads to from the entry points."""
        reached = set()
        queue = [p for p in ("AGENTS.md", KNOWLEDGE + "README.md") if p in self.texts]
        while queue:
            path = queue.pop()
            if path in reached:
                continue
            reached.add(path)
            queue.extend(self.links[path])
            if path.split("/")[-1] == "README.md":
                queue.extend(self.routing_targets(path))
        for path in self.markdown:
            if path not in reached and path != "AGENTS.md":
                self.error(path, 1, "not reachable from AGENTS.md or knowledge/README.md through links or routing tables")


def run_check(root, strict, today=None):
    findings = Checker(root, today or datetime.date.today()).run()
    for f in findings:
        print("{}:{}: {}: {}".format(f.path, f.line, f.level, f.message))
    errors = sum(f.level == "error" for f in findings)
    warnings = len(findings) - errors
    print("{} errors, {} warnings.".format(errors, warnings) if findings else "No problems found.")
    return 1 if errors or (strict and warnings) else 0


def main(argv=None):
    parser = argparse.ArgumentParser(description="Agent Development Framework tools.")
    commands = parser.add_subparsers(dest="command", required=True)
    route = commands.add_parser("route", help="regenerate folder README routing tables")
    route.add_argument("--check", action="store_true", help="report out-of-date routing tables without changing them")
    route.add_argument("--root", default=".", help="repository root (default: current directory)")
    check = commands.add_parser("check", help="report files that break the framework's conventions")
    check.add_argument("--strict", action="store_true", help="treat warnings as errors")
    check.add_argument("--root", default=".", help="repository root (default: current directory)")
    args = parser.parse_args(argv)
    if args.command == "route":
        return run_route(args.root, args.check)
    if args.command == "check":
        return run_check(args.root, args.strict)
    return 2


if __name__ == "__main__":
    sys.exit(main())
