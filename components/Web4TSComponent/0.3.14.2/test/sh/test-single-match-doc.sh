#!/bin/bash
cd /Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.14.2
source /Users/Shared/Workspaces/temp/Web4Articles/source.env >/dev/null 2>&1
COMP_WORDS=(web4tscomponent compl)
COMP_CWORD=1
_web4_generic_completion
echo ""
echo "COMPREPLY: ${COMPREPLY[*]}"