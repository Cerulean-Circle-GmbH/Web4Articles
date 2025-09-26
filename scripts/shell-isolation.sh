#!/bin/bash
# Shell Isolation Safety Strategy - Web4Articles
# Each command runs in its own shell to prevent stale process accumulation

set -euo pipefail

LOGFILE="/tmp/shell-isolation.log"

# Logging function
log() {
    echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] SHELL-ISOLATION: $*" | tee -a "$LOGFILE"
}

# Count defunct processes
count_defunct() {
    ps aux | grep -E "\[.*\] <defunct>" | grep -v grep | wc -l
}

# Execute command in isolated shell
isolated_exec() {
    local cmd="$*"
    local before_count after_count
    
    before_count=$(count_defunct)
    log "BEFORE: $before_count defunct processes"
    log "EXECUTING: $cmd"
    
    # Execute in completely separate shell process
    bash -c "$cmd"
    local exit_code=$?
    
    # Small delay to allow process cleanup
    sleep 1
    
    after_count=$(count_defunct)
    log "AFTER: $after_count defunct processes (change: $((after_count - before_count)))"
    
    if [ $exit_code -eq 0 ]; then
        log "✅ Command succeeded with shell isolation"
    else
        log "❌ Command failed (exit code: $exit_code)"
    fi
    
    return $exit_code
}

# Safe git operations using shell isolation
git_isolated() {
    isolated_exec "git $*"
}

# Test the isolation strategy
test_isolation() {
    log "=== SHELL ISOLATION TEST START ==="
    
    local initial_count
    initial_count=$(count_defunct)
    log "Initial defunct process count: $initial_count"
    
    # Test basic git operations
    log "Testing git status..."
    git_isolated status
    
    log "Testing git branch..."
    git_isolated branch --show-current
    
    log "Testing git log (limited)..."
    git_isolated log --oneline -n 3
    
    local final_count
    final_count=$(count_defunct)
    log "Final defunct process count: $final_count"
    log "Net change: $((final_count - initial_count))"
    
    if [ $((final_count - initial_count)) -le 0 ]; then
        log "✅ SHELL ISOLATION EFFECTIVE - No process accumulation"
        return 0
    else
        log "⚠️  SHELL ISOLATION PARTIAL - Some accumulation detected"
        return 1
    fi
    
    log "=== SHELL ISOLATION TEST END ==="
}

# Main execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    case "${1:-test}" in
        "test")
            test_isolation
            ;;
        "exec")
            shift
            isolated_exec "$@"
            ;;
        "git")
            shift
            git_isolated "$@"
            ;;
        *)
            echo "Usage: $0 [test|exec|git] [command...]"
            echo "  test: Run isolation effectiveness test"
            echo "  exec: Execute command in isolated shell"
            echo "  git: Execute git command in isolated shell"
            exit 1
            ;;
    esac
fi