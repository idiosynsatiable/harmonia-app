#!/usr/bin/env python3
import os, re

SKIP_DIRS = {".git","node_modules","dist","build",".next","out",".turbo",".cache"}
# Replace both healing_app + landing_app absolute roots
ABS_PREFIX = re.compile(r"/home/ubuntu/(harmonia_healing_app|harmonia_landing_app)\b")

# Only touch “human + script” files (avoid binary)
EXT_OK = {
  ".md",".txt",".sh",".bash",".zsh",".py",".js",".cjs",".mjs",".ts",".tsx",".json",".yml",".yaml",".env.example",".toml",".ini"
}

def should_scan(path: str) -> bool:
    base = os.path.basename(path)
    if base.startswith(".") and base not in {".env.example"}:
        # still allow hidden config if it has a normal ext
        pass
    _, ext = os.path.splitext(path)
    if ext in EXT_OK:
        return True
    # also allow some common filenames with no ext
    if base in {"Dockerfile","Makefile","Procfile"}:
        return True
    return False

def main():
    root = os.getcwd()
    changed = 0
    repls = 0
    changed_files = []

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            p = os.path.join(dirpath, fn)
            rel = os.path.relpath(p, root).replace("\\","/")
            if not should_scan(p):
                continue
            try:
                with open(p, "r", encoding="utf-8") as f:
                    src = f.read()
            except Exception:
                continue

            if "/home/ubuntu/" not in src:
                continue

            new = ABS_PREFIX.sub("${PROJECT_ROOT}", src)
            if new != src:
                with open(p, "w", encoding="utf-8") as f:
                    f.write(new)
                changed += 1
                repls += len(ABS_PREFIX.findall(src))
                changed_files.append(rel)

    print(f"[path-fix-v3] updated_files={changed} replacements~={repls}")
    for f in changed_files:
        print(" -", f)

if __name__ == "__main__":
    main()
