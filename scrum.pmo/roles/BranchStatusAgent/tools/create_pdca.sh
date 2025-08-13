#!/usr/bin/env bash
set -euo pipefail

# Usage: create_pdca.sh ROLE_NAME "QA_PROMPT_TEXT"
role="${1:-}"
qa_text="${2:-}"
if [[ -z "$role" || -z "$qa_text" ]]; then
  echo "Usage: $0 ROLE_NAME \"QA_PROMPT_TEXT\"" >&2
  exit 1
fi
now_file="$(date -u +%F-UTC-%H%M)"
now_iso="$(date -u +%FT%TZ)"
dir="scrum.pmo/roles/$role/PDCA"
mkdir -p "$dir"
out="$dir/$now_file.md"

cat >"$out" <<MD
# PDCA (Cycle)

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
# example commands
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