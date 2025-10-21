#!/bin/bash
# Test completion parameter callback behavior
# Simulates: web4tscomponent completion parameter <TAB> and web4tscomponent completion parameter w<TAB>

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 Testing completion parameter callback behavior"
echo "=================================================="
echo ""

# Get project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
COMPONENT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
PROJECT_ROOT="$( cd "$COMPONENT_ROOT/../../.." && pwd )"

# Source the environment
cd "$PROJECT_ROOT"
source source.env >/dev/null 2>&1

CLI="web4tscomponent"

# Test 1: completion parameter <TAB> (empty prefix)
echo "Test 1: $CLI completion parameter <TAB>"
echo "  Simulating COMP_WORDS=('$CLI' 'completion' 'parameter' '') COMP_CWORD=3"

# Simulate bash completion variables
COMP_WORDS=("$CLI" "completion" "parameter" "")
COMP_CWORD=3
COMP_LINE="$CLI completion parameter "
cur="${COMP_WORDS[COMP_CWORD]}"
prev="${COMP_WORDS[COMP_CWORD-1]}"

# Call completion function
_web4_generic_completion

echo "  COMPREPLY count: ${#COMPREPLY[@]}"
if [ ${#COMPREPLY[@]} -gt 0 ]; then
    echo -e "  ${GREEN}✓ Got completions (first 5):${NC}"
    for i in {0..4}; do
        [ -n "${COMPREPLY[$i]}" ] && echo "    - ${COMPREPLY[$i]}"
    done
else
    echo -e "  ${RED}✗ No completions${NC}"
    exit 1
fi

echo ""

# Test 2: completion parameter w<TAB> (prefix filter)
echo "Test 2: $CLI completion parameter w<TAB>"
echo "  Simulating COMP_WORDS=('$CLI' 'completion' 'parameter' 'w') COMP_CWORD=3"

COMP_WORDS=("$CLI" "completion" "parameter" "w")
COMP_CWORD=3
COMP_LINE="$CLI completion parameter w"
cur="${COMP_WORDS[COMP_CWORD]}"
prev="${COMP_WORDS[COMP_CWORD-1]}"

# Call completion function
_web4_generic_completion

echo "  COMPREPLY count: ${#COMPREPLY[@]}"
if [ ${#COMPREPLY[@]} -eq 1 ]; then
    # Trim trailing space for comparison
    result="${COMPREPLY[0]}"
    result="${result%% }"  # Remove trailing spaces
    if [ "$result" == "what" ]; then
        echo -e "  ${GREEN}✓ Correctly filtered to 'what'${NC}"
    else
        echo -e "  ${RED}✗ Expected single completion 'what', got: '$result'${NC}"
        exit 1
    fi
else
    echo -e "  ${RED}✗ Expected 1 completion, got ${#COMPREPLY[@]}: ${COMPREPLY[*]}${NC}"
    exit 1
fi

echo ""

# Test 3: completion parameter what <TAB> (callback trigger)
echo "Test 3: $CLI completion parameter what <TAB> (should trigger whatParameterCompletion)"
echo "  Simulating COMP_WORDS=('$CLI' 'completion' 'parameter' 'what' '') COMP_CWORD=4"

COMP_WORDS=("$CLI" "completion" "parameter" "what" "")
COMP_CWORD=4
COMP_LINE="$CLI completion parameter what "
cur="${COMP_WORDS[COMP_CWORD]}"
prev="${COMP_WORDS[COMP_CWORD-1]}"

# Call completion function
_web4_generic_completion

echo "  COMPREPLY count: ${#COMPREPLY[@]}"
if [ ${#COMPREPLY[@]} -eq 2 ]; then
    if [[ " ${COMPREPLY[*]} " =~ " method " ]] && [[ " ${COMPREPLY[*]} " =~ " parameter " ]]; then
        echo -e "  ${GREEN}✓ Got callback results: method, parameter${NC}"
    else
        echo -e "  ${RED}✗ Expected 'method' and 'parameter', got: ${COMPREPLY[*]}${NC}"
        exit 1
    fi
else
    echo -e "  ${RED}✗ Expected 2 completions, got ${#COMPREPLY[@]}: ${COMPREPLY[*]}${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All tests passed!${NC}"

