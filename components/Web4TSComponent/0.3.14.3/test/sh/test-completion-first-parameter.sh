#!/bin/bash
# Test end-to-end completion for: web4tscomponent completion <TAB>
# Expected: Should complete to "method" or "parameter" (values from whatParameterCompletion)

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 Testing: web4tscomponent completion <TAB>"
echo "=============================================="
echo ""

# Get project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COMPONENT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
PROJECT_ROOT="$( cd "$COMPONENT_ROOT/../../.." && pwd )"

# Source the environment
cd "$PROJECT_ROOT"
source source.env >/dev/null 2>&1

CLI="web4tscomponent"

# Test: completion <TAB> (should show "method" and "parameter")
echo "Test: $CLI completion <TAB>"
echo "  Simulating COMP_WORDS=('$CLI' 'completion' '') COMP_CWORD=2"

# Simulate bash completion variables
COMP_WORDS=("$CLI" "completion" "")
COMP_CWORD=2
COMP_LINE="$CLI completion "
cur="${COMP_WORDS[COMP_CWORD]}"
prev="${COMP_WORDS[COMP_CWORD-1]}"

# Call completion function
_web4_generic_completion

echo "  COMPREPLY count: ${#COMPREPLY[@]}"
echo "  COMPREPLY: ${COMPREPLY[*]}"

if [ ${#COMPREPLY[@]} -eq 2 ]; then
    if [[ " ${COMPREPLY[*]} " =~ " method" ]] && [[ " ${COMPREPLY[*]} " =~ " parameter" ]]; then
        echo -e "  ${GREEN}✓ Got expected completions: method, parameter${NC}"
    else
        echo -e "  ${RED}✗ Expected 'method' and 'parameter', got: ${COMPREPLY[*]}${NC}"
        exit 1
    fi
elif [ ${#COMPREPLY[@]} -eq 0 ]; then
    echo -e "  ${RED}✗ No completions returned - callback not triggered${NC}"
    echo "  Expected: whatParameterCompletion should be called"
    exit 1
else
    echo -e "  ${RED}✗ Expected 2 completions, got ${#COMPREPLY[@]}: ${COMPREPLY[*]}${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Test passed!${NC}"

