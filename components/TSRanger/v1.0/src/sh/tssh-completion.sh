# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

_tssh_completion() {
  COMPREPLY=($(COMP_CWORD=$COMP_CWORD COMP_LINE="$COMP_LINE" COMP_POINT="$COMP_POINT" tssh --complete "${COMP_WORDS[@]}"))
}
complete -F _tssh_completion tssh
