#!/bin/bash
# Test Row 7: web4tscomponent completion m<TAB>
# Hardcode the exact bash completion context

cd /Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.14.3
source /Users/Shared/Workspaces/temp/Web4Articles/source.env >/dev/null 2>&1

# Simulate bash completion context for: web4tscomponent completion m<TAB>
COMP_WORDS=(web4tscomponent completion "m")
COMP_CWORD=2

echo "=== Test Setup ==="
echo "COMP_WORDS: ${COMP_WORDS[*]}"
echo "COMP_CWORD: $COMP_CWORD"
echo "cur: '${COMP_WORDS[COMP_CWORD]}'"
echo "prev: '${COMP_WORDS[COMP_CWORD-1]}'"
echo ""

# Call the completion function
_web4_generic_completion

echo ""
echo "=== Test Results ==="
echo "COMPREPLY: ${COMPREPLY[*]}"
echo "COMPREPLY count: ${#COMPREPLY[@]}"

# Verify expectations
if [ "${#COMPREPLY[@]}" -eq 1 ] && [ "${COMPREPLY[0]}" = "method" ]; then
    echo "✅ TEST PASSED: Only 'method' returned"
    exit 0
else
    echo "❌ TEST FAILED: Expected 'method', got '${COMPREPLY[*]}'"
    exit 1
fi

