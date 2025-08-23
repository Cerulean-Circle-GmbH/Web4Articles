#!/usr/bin/env bash
set -euo pipefail

merged_main=$(git branch -r --merged origin/main | sed '/->/d' | wc -l | tr -d ' ')
unmerged_main=$(git branch -r --no-merged origin/main | wc -l | tr -d ' ')
merged_rel=$(git branch -r --merged origin/release/dev | sed '/->/d' | wc -l | tr -d ' ' || true)
unmerged_rel=$(git branch -r --no-merged origin/release/dev | wc -l | tr -d ' ' || true)
total_remote=$(git branch -r --format='%(refname:short)' | sed '/->/d' | wc -l | tr -d ' ')

printf "total_remote=%s\nmerged_main=%s\nunmerged_main=%s\nmerged_release_dev=%s\nunmerged_release_dev=%s\n" \
  "$total_remote" "$merged_main" "$unmerged_main" "$merged_rel" "$unmerged_rel"