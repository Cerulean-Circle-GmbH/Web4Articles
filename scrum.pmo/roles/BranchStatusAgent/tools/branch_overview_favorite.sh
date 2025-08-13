#!/usr/bin/env bash
set -euo pipefail

# Generate favorite branch overview format with PR info
# Usage: branch_overview_favorite.sh OUTPUT_FILE

out_file="${1:-}"
if [[ -z "${out_file}" ]]; then
  echo "Usage: $0 OUTPUT_FILE" >&2
  exit 1
fi

remote_url="$(git config --get remote.origin.url)"
owner_repo="$(printf "%s" "$remote_url" | sed -E 's#^https?://[^/]+/([^/]+/[^/]+)(\.git)?$#\1#')"
owner="${owner_repo%%/*}"
token="$(printf "%s" "$remote_url" | sed -nE 's#^https?://x-access-token:([^@]+)@github.com/.*#\1#p')"
repo_url="https://github.com/${owner_repo}"
now_utc="$(date -u +'%F %H:%M UTC')"

api() { # path
  curl -sS -H "Accept: application/vnd.github+json" -H "Authorization: token ${token}" "https://api.github.com/$1"
}

print_branch_with_details() { # branch_ref like origin/foo/bar
  local full_ref="$1"; local branch="${full_ref#origin/}"
  printf "%s\n" "- [ ] \`$full_ref\`"
  # PR lookup (latest matching head)
  local prs_json; prs_json="$(api "repos/${owner_repo}/pulls?state=all&head=${owner}:${branch}")"
  local pr_number; pr_number="$(printf "%s" "$prs_json" | sed -n 's/.*"number": \([0-9]\+\).*/\1/p' | head -1)"
  if [[ -n "${pr_number}" ]]; then
    local pr_json; pr_json="$(api "repos/${owner_repo}/pulls/${pr_number}")"
    local pr_state; pr_state="$(printf "%s" "$pr_json" | sed -n 's/.*"state": "\([^"]\+\)".*/\1/p' | head -1)"
    local pr_base; pr_base="$(printf "%s" "$pr_json" | sed -n 's/.*"base": {[^}]*"ref": "\([^"]\+\)".*/\1/p' | head -1)"
    local merged; merged="$(printf "%s" "$pr_json" | sed -n 's/.*"merged": \(true\|false\).*/\1/p' | head -1)"
    local merged_note=""
    if [[ "$merged" == "true" ]]; then merged_note="merged to ${pr_base}"; else merged_note="state: ${pr_state} to ${pr_base}"; fi
    printf "%s\n" "  - [ ] Contains [PR #$pr_number]($repo_url/pull/$pr_number) ($merged_note)"
  else
    printf "%s\n" "  - [ ] No PR found"
  fi
  # Background agent placeholder (unknown mapping)
  if [[ "$branch" == cursor/* ]]; then
    printf "%s\n" "  - [ ] Background Agent: not linked"
  else
    printf "%s\n" "  - [ ] No background agent found"
  fi
}

# counts
total_remote=$(git branch -r --format='%(refname:short)' | sed '/->/d' | wc -l | tr -d ' ')
merged_main=$(git branch -r --merged origin/main | sed '/->/d' | wc -l | tr -d ' ')
unmerged_main=$(git branch -r --no-merged origin/main | sed '/->/d' | wc -l | tr -d ' ')
merged_rel=$(git branch -r --merged origin/release/dev | sed '/->/d' | wc -l | tr -d ' ' || true)
unmerged_rel=$(git branch -r --no-merged origin/release/dev | sed '/->/d' | wc -l | tr -d ' ' || true)

{
  printf "[Back to Index](../../../index.md)\n\n# Branch Overview\n\n"
  printf "**Generated:** %s  \n**Repository:** [%s](%s)\n\n" "$now_utc" "Web4Articles" "$repo_url"
  printf "## Branch Categorization\n\n"
  printf "### Unmerged Branches to release/dev\n\nThese branches have not been merged into release/dev and may contain pending release work:\n\n"
  while IFS= read -r ref; do print_branch_with_details "$ref"; done < <(git branch -r --no-merged origin/release/dev | sed 's#^  *##' | sed '/->/d' || true)
  printf "\n### Unmerged Branches to main\n\nThese branches have not been merged into main and may contain active work:\n\n"
  while IFS= read -r ref; do print_branch_with_details "$ref"; done < <(git branch -r --no-merged origin/main | sed 's#^  *##' | sed '/->/d')
  printf "\n### Already Merged Branches (to main)\n\n"
  git branch -r --merged origin/main | sed 's#^  *##' | sed '/->/d' | awk '{print "- [x] `"$0"`"}'
  printf "\n### Branches Not to Touch\n\nThese branches serve special purposes and should be handled with care:\n\n"
  printf "%s\n" "- \`origin/main\` - Primary branch (protected)"
  printf "%s\n\n" "- \`origin/retro/2025-08-10-agent-retro\` - Retro branch (protected)"
  printf "## Summary Statistics\n\n- **Total Remote Branches:** %s\n- **Unmerged to main:** %s\n- **Merged to main:** %s\n- **Unmerged to release/dev:** %s\n- **Merged to release/dev:** %s\n\n" "$total_remote" "$unmerged_main" "$merged_main" "$unmerged_rel" "$merged_rel"
  printf "[Back to Index](../../../index.md)\n"
} >"$out_file"