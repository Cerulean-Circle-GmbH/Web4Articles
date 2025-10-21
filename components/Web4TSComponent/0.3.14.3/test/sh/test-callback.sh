#!/bin/bash

logfile="/Users/Shared/Workspaces/temp/Web4Articles/temp/logs/test-callback.log"
cli="web4tscomponent"
callback="whatParameterCompletion"

# Hardcode the args array
args=("completion" "")

echo "=== TEST CALLBACK ===" > "$logfile"
echo "cli=$cli" >> "$logfile"
echo "callback=$callback" >> "$logfile"
echo "args count=${#args[@]}" >> "$logfile"
echo "args[0]='${args[0]}'" >> "$logfile"
echo "args[1]='${args[1]}'" >> "$logfile"
echo "Full command: $cli completeParameter $callback ${args[*]}" >> "$logfile"

# Call with command substitution like source.env does
result=$("$cli" completeParameter "$callback" "${args[@]}" 2>>"$logfile"; echo "PRESERVE_NEWLINES")
result="${result%PRESERVE_NEWLINES}"

echo "Exit code: $?" >> "$logfile"
echo "Result length: ${#result}" >> "$logfile"
echo "Result: [$result]" >> "$logfile"

# Output to terminal
echo "Result: [$result]"
echo "Length: ${#result}"
