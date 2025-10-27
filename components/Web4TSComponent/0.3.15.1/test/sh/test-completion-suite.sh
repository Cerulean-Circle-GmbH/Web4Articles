#!/bin/bash
# Shell Test Suite for TAB Completion Integration
# Integrates end-to-end shell tests into the main test suite

echo "🧪 SHELL TEST SUITE: TAB Completion Integration"
echo "==============================================="

# Change to test/data directory where completion tests are located
cd "$(dirname "$0")/../data" || {
    echo "❌ Failed to change to test/data directory"
    exit 1
}

# Track test results
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test script and track results
run_test_script() {
    local script_name="$1"
    local description="$2"
    
    if [ ! -f "$script_name" ]; then
        echo "⚠️  Skipping $script_name (not found)"
        return
    fi
    
    echo
    echo "🔍 Running: $description"
    echo "Script: $script_name"
    echo "---"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if bash "$script_name"; then
        echo "✅ PASS: $description"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo "❌ FAIL: $description"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "Starting shell test suite execution..."

# Core Integration Tests
run_test_script "test-completion-integration.sh" "Comprehensive TSCompletion Integration"
run_test_script "test-tab-completion-e2e.sh" "End-to-End TAB Completion"

# Systematic Testing
run_test_script "test-systematic-tab-completion.sh" "Systematic CLI Command Testing"
run_test_script "test-parameter-completion-systematic.sh" "Systematic Parameter Testing"

# Specific Scenario Tests
run_test_script "test-all-cli-methods-parameters.sh" "All CLI Methods and Parameters"
run_test_script "test-remaining-tab-completion.sh" "Remaining TAB Completion Scenarios"

# Fixed Completion Tests
run_test_script "test-fixed-completion.sh" "Fixed Completion Validation"
run_test_script "test-fixed-bash-completion.sh" "Fixed Bash Completion"

echo
echo "🎯 SHELL TEST SUITE SUMMARY"
echo "============================"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"

if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ ALL SHELL TESTS PASSED!"
    exit 0
else
    echo "❌ $FAILED_TESTS SHELL TESTS FAILED"
    exit 1
fi
