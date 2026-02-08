#!/usr/bin/env python3
import os, re, subprocess, sys

SKIP_DIRS = {".git", "node_modules", "dist", "build", ".next", "out", ".turbo", ".cache"}

ABS_PREFIX_RE = re.compile(
    r"""(['"])                          # quote
        (/home/ubuntu/(?:harmonia_healing_app|harmonia_landing_app)/  # hardcoded root
        ([^'"]+))                        # relative tail
        \1                               # same quote
    """,
    re.VERBOSE,
)

def git_root():
    try:
        out = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], stderr=subprocess.DEVNULL)
        return out.decode().strip()
    except Exception:
        return os.getcwd()

def should_scan(path: str) -> bool:
    if not (path.endswith(".ts") or path.endswith(".tsx") or path.endswith(".js") or path.endswith(".mjs") or path.endswith(".cjs")):
        return False
    base = os.path.basename(path)
    # target test-ish + infra files most likely to contain hardcoded paths
    return (
        base.endswith(".test.ts") or base.endswith(".spec.ts") or
        "/tests/" in path.replace("\\", "/") or "/test/" in path.replace("\\", "/") or "/__tests__/" in path.replace("\\", "/") or
        base in {"vitest.config.ts", "vite.config.ts", "jest.config.js", "jest.config.ts"}
    )

def ensure_imports_and_root(src: str) -> str:
    # Ensure: import path from "node:path";
    if re.search(r'^\s*import\s+path\s+from\s+["\']node:path["\']\s*;\s*$', src, re.M) is None:
        # Insert after the last import line; if no imports, insert at top.
        lines = src.splitlines(True)
        insert_at = 0
        for i, line in enumerate(lines):
            if re.match(r'^\s*import\b', line):
                insert_at = i + 1
        lines.insert(insert_at, 'import path from "node:path";\n')
        src = "".join(lines)

    # Ensure: const ROOT = process.cwd();
    if re.search(r'^\s*const\s+ROOT\s*=\s*process\.cwd\(\)\s*;\s*$', src, re.M) is None:
        lines = src.splitlines(True)
        # place after imports block
        insert_at = 0
        for i, line in enumerate(lines):
            if re.match(r'^\s*import\b', line):
                insert_at = i + 1
        # add a spacer line if needed
        if insert_at > 0 and (insert_at >= len(lines) or lines[insert_at].strip() != ""):
            lines.insert(insert_at, "\n")
            insert_at += 1
        lines.insert(insert_at, "const ROOT = process.cwd();\n\n")
        src = "".join(lines)

    return src

def replace_abs_paths(src: str) -> (str, int):
    n = 0
    def repl(m):
        nonlocal n
        tail = m.group(3)
        # Normalize and split into segments
        tail = tail.strip("/")
        segs = [s for s in tail.split("/") if s]
        expr = "path.join(ROOT, " + ", ".join(repr(s) for s in segs) + ")"
        n += 1
        return expr

    # Replace quoted absolute string literal with an expression (no surrounding quotes)
    out = ABS_PREFIX_RE.sub(repl, src)
    return out, n

def main():
    root = git_root()
    changed_files = []
    total_repls = 0

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            fp = os.path.join(dirpath, fn)
            rel = os.path.relpath(fp, root).replace("\\", "/")
            if not should_scan(rel):
                continue

            try:
                with open(fp, "r", encoding="utf-8") as f:
                    src = f.read()
            except Exception:
                continue

            if "/home/ubuntu/" not in src:
                continue

            new_src, n = replace_abs_paths(src)
            if n == 0:
                continue

            new_src = ensure_imports_and_root(new_src)

            if new_src != src:
                with open(fp, "w", encoding="utf-8") as f:
                    f.write(new_src)
                changed_files.append(rel)
                total_repls += n

    print(f"[path-fix-v2] updated_files={len(changed_files)} replacements={total_repls}")
    for f in changed_files:
        print(" -", f)

if __name__ == "__main__":
    main()
