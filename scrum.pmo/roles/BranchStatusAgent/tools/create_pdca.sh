#!/usr/bin/env bash
set -euo pipefail

# Usage: create_pdca.sh ROLE_NAME "QA_PROMPT_TEXT" [BRANCH]
role="${1:-}"
qa_text="${2:-}"
branch_input="${3:-}"
if [[ -z "$role" || -z "$qa_text" ]]; then
  echo "Usage: $0 ROLE_NAME \"QA_PROMPT_TEXT\"" >&2
  exit 1
fi
now_file="$(date -u +%F-UTC-%H%M)"
now_iso="$(date -u +%FT%TZ)"
dir="scrum.pmo/roles/$role/PDCA"
mkdir -p "$dir"
out="$dir/$now_file.md"
repo_url="https://github.com/Cerulean-Circle-GmbH/Web4Articles"
branch="${branch_input:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo release/dev)}"

cat >"$out" <<MD
# PDCA (Cycle) — ${role}

## Plan
- **Objective:** 
- **Scope:** 
- **Targets (metrics):** 
- **Inputs (files/dirs):** 
- **Acceptance Criteria:** 
- **Assumptions:** 
- **Constraints:** 
- **Options Considered (with pros/cons):** 
- **Rationale for Selected Option:** 
- **Risks and Mitigations:** 

## Do
- Actions executed:
- Commands run (examples):
```bash
git status --porcelain=v1 | cat
```

## Check
- Verifications performed:
- QA Feedback (quote literally):
> ${qa_text}
- Evidence (snippets/commands):
```bash
# evidence commands
```

## Act
- Improvements for next cycle:
- Automation to add:
- Follow-ups:

## Metadata
- Agent: ${role}
- Branch: 
- Commit: 
- Date: ${now_iso}
MD

echo "$out"