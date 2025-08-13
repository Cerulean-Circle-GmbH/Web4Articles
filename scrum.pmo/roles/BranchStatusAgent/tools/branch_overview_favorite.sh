#!/usr/bin/env bash
set -euo pipefail

# Generate favorite branch overview format
# Usage: branch_overview_favorite.sh OUTPUT_FILE

out_file="${1:-}"
if [[ -z "${out_file}" ]]; then
  echo "Usage: $0 OUTPUT_FILE" >&2
  exit 1
fi

repo_url="https://github.com/$(git remote -v | awk '/origin.*fetch/{print $2}' | sed -E 's#^https?://[^/]+/##; s#\.git$##' | head -1)"
now_utc="$(date -u +'%F %H:%M UTC')"

# counts
total_remote=$(git branch -r --format='%(refname:short)' | sed '/->/d' | wc -l | tr -d ' ')
merged_main=$(git branch -r --merged origin/main | sed '/->/d' | wc -l | tr -d ' ')
unmerged_main=$(git branch -r --no-merged origin/main | wc -l | tr -d ' ')
merged_rel=$(git branch -r --merged origin/release/dev | sed '/->/d' | wc -l | tr -d ' ' || true)
unmerged_rel=$(git branch -r --no-merged origin/release/dev | wc -l | tr -d ' ' || true)

{
  printf "[Back to Index](../../../index.md)\n\n# Branch Overview\n\n"
  printf "**Generated:** %s  \n**Repository:** [%s](%s)\n\n" "$now_utc" "Web4Articles" "$repo_url"
  printf "## Branch Categorization\n\n"
  printf "### Unmerged Branches to main\n\nThese branches have not been merged into main and may contain active work:\n\n"
  git branch -r --no-merged origin/main | sed 's#^  *##' | sed '/->/d' | awk '{print "- [ ] `"$0"`"}'
  printf "\n### Unmerged Branches to release/dev\n\nThese branches have not been merged into release/dev and may contain pending release work:\n\n"
  git branch -r --no-merged origin/release/dev | sed 's#^  *##' | awk '{print "- [ ] `"$0"`"}' || true
  printf "\n### Already Merged Branches (to main)\n\n"
  git branch -r --merged origin/main | sed 's#^  *##' | sed '/->/d' | awk '{print "- [x] `"$0"`"}'
  printf "\n### Branches Not to Touch\n\nThese branches serve special purposes and should be handled with care:\n\n- `origin/main` - Primary branch (protected)\n- `origin/retro/2025-08-10-agent-retro` - Retro branch (protected)\n\n"
  printf "## Summary Statistics\n\n- **Total Remote Branches:** %s\n- **Unmerged to main:** %s\n- **Merged to main:** %s\n- **Unmerged to release/dev:** %s\n- **Merged to release/dev:** %s\n\n" "$total_remote" "$unmerged_main" "$merged_main" "$unmerged_rel" "$merged_rel"
  printf "[Back to Index](../../../index.md)\n"
} >"$out_file"