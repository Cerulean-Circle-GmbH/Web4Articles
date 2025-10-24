#!/bin/bash
cd /var/dev/Workspaces/2cuGitHub/Web4Articles/components/Web4TSComponent/0.3.14.4
source /var/dev/Workspaces/2cuGitHub/Web4Articles/source.env >/dev/null 2>&1
COMP_WORDS=(web4tscomponent completion method "co")
COMP_CWORD=3
_web4_generic_completion 2>/dev/null
echo ""
echo "COMPREPLY: ${COMPREPLY[*]}"