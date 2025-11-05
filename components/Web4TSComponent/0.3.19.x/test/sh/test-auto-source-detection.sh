#!/bin/bash
# Test: Auto-source detection using exported variables
# Real-world scenario: Each web4tscomponent call is a NEW process
# Uses 'web4tscomponent links' for speed (usage dialog is very slow)

COMPONENT_PATH="/Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.17.1"
cd "$COMPONENT_PATH" || exit 1

echo "🧪 Test: Auto-source using WEB4_PROJECT_ROOT detection"
echo "=========================================================="
echo ""

# Test 1: Fresh shell (no sourcing) - should source
echo "Test 1: Truly fresh shell (env -i) - should auto-source"
echo "---------------------------------------------------------"
env -i bash -c "cd $COMPONENT_PATH && PATH=/usr/bin:/bin:/usr/sbin:/sbin ./web4tscomponent links 2>&1 | grep -c 'Web4 environment loaded'" > /tmp/test1.txt
COUNT1=$(cat /tmp/test1.txt)
if [ "$COUNT1" -eq 1 ]; then
    echo "✅ PASS: Sourced in fresh shell (count=$COUNT1)"
else
    echo "❌ FAIL: Expected 1 'environment loaded' message, got $COUNT1"
    exit 1
fi
echo ""

# Test 2: Already sourced shell - should NOT source again
echo "Test 2: Already sourced - should skip sourcing"
echo "-----------------------------------------------"
bash -c "cd $COMPONENT_PATH && source source.env > /dev/null 2>&1 && ./web4tscomponent links 2>&1 | grep -c 'Web4 environment loaded'" > /tmp/test2.txt
COUNT2=$(cat /tmp/test2.txt)
if [ "$COUNT2" -eq 0 ]; then
    echo "✅ PASS: Skipped sourcing when already loaded (count=$COUNT2)"
elif [ "$COUNT2" -eq 1 ]; then
    echo "❌ FAIL: Should skip sourcing but sourced again (count=$COUNT2)"
    echo "   This means detection logic is broken"
    exit 1
else
    echo "❌ FAIL: Unexpected count: $COUNT2"
    exit 1
fi
echo ""

echo "=========================================================="
echo "✅ ALL TESTS PASSED: WEB4_PROJECT_ROOT detection works correctly"
echo ""

