#!/bin/bash

_test_completion() {
    local logfile="/Users/Shared/Workspaces/temp/Web4Articles/temp/logs/test-completion-func.log"
    local cli="web4tscomponent"
    local callback="whatParameterCompletion"
    
    # Simulate COMP_WORDS
    local args=("completion" "")
    
    echo "=== IN COMPLETION FUNCTION ===" > "$logfile"
    echo "args count=${#args[@]}" >> "$logfile"
    echo "args[0]='${args[0]}'" >> "$logfile"
    echo "args[1]='${args[1]}'" >> "$logfile"
    
    # Call with command substitution
    result=$("$cli" completeParameter "$callback" "${args[@]}" 2>>"$logfile"; echo "PRESERVE_NEWLINES")
    result="${result%PRESERVE_NEWLINES}"
    
    echo "Result length: ${#result}" >> "$logfile"
    echo "Result: [$result]" >> "$logfile"
    
    echo "Result: [$result]"
    echo "Length: ${#result}"
}

# Simulate completion context
COMP_WORDS=(web4tscomponent completion "")
COMP_CWORD=2
_test_completion
