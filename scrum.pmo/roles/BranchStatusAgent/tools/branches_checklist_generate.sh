#!/usr/bin/env bash
set -euo pipefail

# Usage: branches_checklist_generate.sh OUTPUT_FILE [REFERENCE_BRANCH=main]
out_file="${1:-}"
ref_branch="${2:-main}"
if [[ -z "${out_file}" ]]; then
  echo "Usage: $0 OUTPUT_FILE [REFERENCE_BRANCH]" >&2
  exit 1
fi
{
  printf "### Branch Review\n\n- Reference branch: %s\n\n" "$ref_branch"
  printf "- Do not touch branches:\n  - origin/main\n  - origin/retro/2025-08-10-agent-retro\n\n"
  printf "- Unmerged into %s:\n" "$ref_branch"
  git branch -r --no-merged origin/"$ref_branch" | sed 's#^  *##' | sed '/->/d' | awk '{print "  - [ ] "$0}'
  printf "\n- Unmerged into release/dev:\n"
  git branch -r --no-merged origin/release/dev | sed 's#^  *##' | awk '{print "  - [ ] "$0}' || true
  printf "\n- Merged into %s:\n" "$ref_branch"
  git branch -r --merged origin/"$ref_branch" | sed 's#^  *##' | sed '/->/d' | awk '{print "  - [x] "$0}'
} >"$out_file"