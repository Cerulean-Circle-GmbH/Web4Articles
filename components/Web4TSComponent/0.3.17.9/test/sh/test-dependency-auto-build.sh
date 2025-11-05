#!/bin/bash
# Test: Component Dependency Auto-Build
# Purpose: Verify dependencies are automatically built when needed
# CMM3: Automated, reproducible, verifiable

set -e  # Exit on any error

echo "🧪 Testing Component Dependency Auto-Build"
echo "=========================================="

# Test setup
PROJECT_ROOT="/Users/Shared/Workspaces/temp/Web4Articles"
cd "$PROJECT_ROOT"

# Set up PATH to find CLI commands
export PATH="$PROJECT_ROOT/scripts:$PATH"

# Helper function to check if dist exists
dist_exists() {
    local component=$1
    local version=$2
    if [ -d "components/$component/$version/dist" ]; then
        return 0
    else
        return 1
    fi
}

# Test 1: Clean both versions
echo ""
echo "📋 Test 1: Clean PDCA versions"
echo "   Cleaning PDCA 0.3.17.9..."
web4tscomponent on PDCA clean > /dev/null 2>&1

echo "   Cleaning PDCA 0.3.5.2..."
cd components/PDCA/0.3.5.2 && npm run clean > /dev/null 2>&1
cd "$PROJECT_ROOT"

# Verify both are clean
if dist_exists "PDCA" "0.3.17.9"; then
    echo "❌ FAILED: PDCA 0.3.17.9 dist/ still exists after clean"
    exit 1
fi

if dist_exists "PDCA" "0.3.5.2"; then
    echo "❌ FAILED: PDCA 0.3.5.2 dist/ still exists after clean"
    exit 1
fi

echo "   ✅ Both versions cleaned successfully"

# Test 2: Verify PDCA 0.3.17.9 can start (UX regression test)
echo ""
echo "📋 Test 2: Verify PDCA 0.3.17.9 can start after dependency clean"
if pdca --help > /tmp/test-pdca-start.log 2>&1; then
    echo "   ✅ PDCA 0.3.17.9 CLI starts successfully"
else
    echo "❌ FAILED: PDCA 0.3.17.9 CLI cannot start (node_modules issue?)"
    cat /tmp/test-pdca-start.log
    exit 1
fi

# Test 3: Build dependent component (should auto-build dependency)
echo ""
echo "📋 Test 3: Build PDCA 0.3.17.9 (should auto-build 0.3.5.2)"
pdca build > /tmp/test-dependency-build.log 2>&1

# Verify dependency was built
if ! dist_exists "PDCA" "0.3.5.2"; then
    echo "❌ FAILED: PDCA 0.3.5.2 dist/ not created (dependency not auto-built)"
    cat /tmp/test-dependency-build.log
    exit 1
fi

echo "   ✅ PDCA 0.3.5.2 automatically built as dependency"

# Verify dependent was built
if ! dist_exists "PDCA" "0.3.17.9"; then
    echo "❌ FAILED: PDCA 0.3.17.9 dist/ not created"
    cat /tmp/test-dependency-build.log
    exit 1
fi

echo "   ✅ PDCA 0.3.17.9 built successfully"

# Test 4: Verify runtime functionality
echo ""
echo "📋 Test 4: Verify trainAILegacy works (uses dependency)"
if pdca trainAILegacy decide > /tmp/test-trainai-legacy.log 2>&1; then
    # Check if output contains expected content
    if grep -q "How to Decide" /tmp/test-trainai-legacy.log; then
        echo "   ✅ trainAILegacy successfully accessed PDCA 0.3.5.2"
    else
        echo "❌ FAILED: trainAILegacy output doesn't contain expected content"
        cat /tmp/test-trainai-legacy.log
        exit 1
    fi
else
    echo "❌ FAILED: trainAILegacy command failed"
    cat /tmp/test-trainai-legacy.log
    exit 1
fi

# Test 5: Verify build log shows dependency build
echo ""
echo "📋 Test 5: Verify build log shows dependency auto-build"
if grep -q "Building 1 dependencies" /tmp/test-dependency-build.log; then
    echo "   ✅ Build log shows dependency detection"
else
    echo "❌ FAILED: Build log doesn't show dependency detection"
    cat /tmp/test-dependency-build.log
    exit 1
fi

if grep -q "Building dependency: PDCA/0.3.5.2" /tmp/test-dependency-build.log; then
    echo "   ✅ Build log shows PDCA 0.3.5.2 being built"
else
    echo "❌ FAILED: Build log doesn't show PDCA 0.3.5.2 build"
    cat /tmp/test-dependency-build.log
    exit 1
fi

if grep -q "Dependency built: PDCA/0.3.5.2" /tmp/test-dependency-build.log; then
    echo "   ✅ Build log confirms PDCA 0.3.5.2 built successfully"
else
    echo "❌ FAILED: Build log doesn't confirm PDCA 0.3.5.2 success"
    cat /tmp/test-dependency-build.log
    exit 1
fi

# All tests passed
echo ""
echo "=========================================="
echo "✅ ALL TESTS PASSED"
echo "   Component dependency auto-build is working correctly"
echo "   CMM3 Verified: Objective, Reproducible, Verifiable"
echo "=========================================="

exit 0

