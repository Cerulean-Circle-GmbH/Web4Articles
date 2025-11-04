#!/bin/bash
# test-completion.sh - Automated completion test runner
# CMM3-compliant black-box tests for bash completion
# @pdca 2025-11-05-UTC-0027-completion-test-suite.pdca.md

cd /Users/Shared/Workspaces/temp/Web4Articles
source source.env

PASS=0
FAIL=0

echo "🧪 Running Bash Completion Test Suite"
echo "======================================"
echo ""

# Helper function to strip ANSI color codes
strip_ansi() {
  echo "$1" | sed 's/\x1b\[[0-9;]*m//g'
}

# Test 1.1: Single method match with documentation
echo "Test 1.1: Single method match 'on'"
OUTPUT=$(web4tscomponent shCompletion 1 web4tscomponent on 2>&1)
CLEAN=$(strip_ansi "$OUTPUT")
if echo "$CLEAN" | grep -q "📊 Completing: METHOD" && \
   echo "$CLEAN" | grep -q "📖 Documentation:" && \
   echo "$CLEAN" | grep -q "WORD: on"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  echo "Output:"
  echo "$CLEAN"
  ((FAIL++))
fi
echo ""

# Test 1.2: Multiple method matches with filter
echo "Test 1.2: Multiple method matches 'set'"
OUTPUT=$(web4tscomponent shCompletion 1 web4tscomponent set 2>&1)
CLEAN=$(strip_ansi "$OUTPUT")
if echo "$CLEAN" | grep -q "📊 Completing: METHOD" && \
   echo "$CLEAN" | grep -q "1: set" && \
   echo "$CLEAN" | grep -q "2: setCICDVersion" && \
   echo "$CLEAN" | grep -q "WORD: set" && \
   echo "$CLEAN" | grep -q "WORD: setCICDVersion"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi
echo ""

# Test 2.1: Component parameter completion
echo "Test 2.1: Component parameter completion"
OUTPUT=$(web4tscomponent shCompletion 2 web4tscomponent on "" 2>&1)
CLEAN=$(strip_ansi "$OUTPUT")
if echo "$CLEAN" | grep -q "📊 Completing: PARAMETER of on" && \
   echo "$CLEAN" | grep -q "Parameter: <component>" && \
   echo "$CLEAN" | grep -q "Callback: DefaultCLI.componentParameterCompletion()" && \
   echo "$CLEAN" | grep -q "WORD: PDCA"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi
echo ""

# Test 2.2: Component parameter with filter
echo "Test 2.2: Component parameter with filter 'PD'"
OUTPUT=$(web4tscomponent shCompletion 2 web4tscomponent on PD 2>&1)
CLEAN=$(strip_ansi "$OUTPUT")
# Note: Filtering is done by bash, not by our code, so all components are returned
# We just verify the completion output is correct
if echo "$CLEAN" | grep -q "📊 Completing: PARAMETER of on" && \
   echo "$CLEAN" | grep -q "WORD: PDCA"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi
echo ""

# Test 3.1: Semantic version parameter completion
echo "Test 3.1: Semantic version parameter completion"
OUTPUT=$(web4tscomponent shCompletion 2 web4tscomponent setCICDVersion "" 2>&1)
CLEAN=$(strip_ansi "$OUTPUT")
if echo "$CLEAN" | grep -q "📊 Completing: PARAMETER of setCICDVersion" && \
   echo "$CLEAN" | grep -q "Callback: DefaultWeb4TSComponent.targetVersionParameterCompletion()" && \
   echo "$CLEAN" | grep -q "WORD: dev" && \
   echo "$CLEAN" | grep -q "WORD: latest"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi
echo ""

# Test 3.2: Semantic version with filter
echo "Test 3.2: Semantic version with filter 'l'"
OUTPUT=$(web4tscomponent shCompletion 2 web4tscomponent setCICDVersion l 2>&1)
CLEAN=$(strip_ansi "$OUTPUT")
# Note: Filtering is done by bash, not by our code, so all versions are returned
# We just verify the completion output is correct
if echo "$CLEAN" | grep -q "📊 Completing: PARAMETER of setCICDVersion" && \
   echo "$CLEAN" | grep -q "WORD: latest"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi
echo ""

# Test 4.1: Method chaining after "on"
echo "Test 4.1: Method chaining after 'on IdealMinimalComponent latest li'"
OUTPUT=$(web4tscomponent shCompletion 4 web4tscomponent on IdealMinimalComponent latest li 2>&1)
CLEAN=$(strip_ansi "$OUTPUT")
if echo "$CLEAN" | grep -q "📊 Completing: METHOD (after 'on IdealMinimalComponent" && \
   echo "$CLEAN" | grep -q "📖 Documentation:" && \
   echo "$CLEAN" | grep -q "WORD: links"; then
  echo "✅ PASS"
  ((PASS++))
else
  echo "❌ FAIL"
  ((FAIL++))
fi
echo ""

# Summary
echo "=========================================="
echo "Test Results: $PASS passed, $FAIL failed"
echo "=========================================="

if [ $FAIL -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Some tests failed!"
  exit 1
fi

