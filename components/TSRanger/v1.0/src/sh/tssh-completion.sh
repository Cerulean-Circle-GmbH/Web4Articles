#!/bin/bash
_tssh_completion() {
  COMPREPLY=($(COMP_CWORD=$COMP_CWORD COMP_LINE="$COMP_LINE" COMP_POINT="$COMP_POINT" tssh --complete "${COMP_WORDS[@]}"))
}
complete -F _tssh_completion tssh
