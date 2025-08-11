# SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
# Copyright (c) 2025 The Web4Articles Authors
# Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
# Backlinks: /LICENSE , /AI-GPL.md
# Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.

#!/usr/bin/env bash
# oosh-completion.sh: prints completion candidates for the oosh CLI
# Usage:
#   - Programmatic completion (bash -C): complete -C /path/to/oosh-completion.sh oosh
#   - Direct invocation for tests: bash src/sh/oosh-completion.sh [args]

set -euo pipefail

DIR="$(cd "$(dirname "$0")/../.." && pwd)"

run_backend() {
  NODE_NO_WARNINGS=1 node --loader ts-node/esm "$DIR/src/ts/layer4/TSCompletion.ts" "$@"
}

normalize_args() {
  local -a in=("$@")
  # Drop leading command name if present
  if [[ "${in[0]:-}" == "oosh" ]]; then
    in=("${in[@]:1}")
  fi
  # Trim leading empty strings
  while [[ ${#in[@]} -gt 0 && "${in[0]}" == "" ]]; do
    in=("${in[@]:1}")
  done
  printf '%s\n' "${in[@]}"
}

main() {
  local -a args
  if [[ -n "${COMP_WORDS:-}" && -n "${COMP_CWORD:-}" ]]; then
    # Invoked by bash completion engine
    IFS=' ' read -r -a _words <<< "${COMP_WORDS}"
    args=("${_words[@]:1}")
    run_backend "${args[@]}"
    return 0
  fi

  # Direct invocation
  mapfile -t args < <(normalize_args "$@")
  if [[ ${#args[@]} -eq 2 ]]; then
    # Prefer parameter completion after exact method by adding empty third arg
    run_backend "${args[@]}" ""
  else
    run_backend "${args[@]}"
  fi
}

main "$@"
