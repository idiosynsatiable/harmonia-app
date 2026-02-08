# ensure PROJECT_ROOT is defined at top of deploy script (idempotent-ish)
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PROJECT_ROOT
python3 - <<'PY'
import pathlib, re
p = pathlib.Path("deploy-railway.sh")
if not p.exists():
    print("deploy-railway.sh not found (skip)")
    raise SystemExit(0)

s = p.read_text(encoding="utf-8")
if "PROJECT_ROOT=" in s:
    print("deploy-railway.sh already defines PROJECT_ROOT (skip)")
    raise SystemExit(0)

lines = s.splitlines()
insert = [
  'set -euo pipefail',
  'PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
  'export PROJECT_ROOT',
  ''
]

# If it already has set -euo pipefail, don't duplicate it
if any("set -euo pipefail" in l for l in lines[:5]):
    insert = [
      'PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"',
      'export PROJECT_ROOT',
      ''
    ]

# Insert after shebang if present
out = []
i = 0
if lines and lines[0].startswith("#!"):
    out.append(lines[0])
    out.extend(insert)
    out.extend(lines[1:])
else:
    out.extend(insert)
    out.extend(lines)

p.write_text("\n".join(out) + "\n", encoding="utf-8")
print("patched deploy-railway.sh")
PY
