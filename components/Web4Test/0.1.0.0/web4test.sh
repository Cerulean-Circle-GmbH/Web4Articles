#!/bin/bash

# Web4Test CLI - Location-Resilient CLI for Tootsie Testing Framework
# Component: Web4Test v0.1.0.0
# Purpose: Web4-native test orchestration following location-resilient CLI standard

set -e  # Exit on any error

# ===================================================================
# Project Root Detection (Location-Resilient Standard)
# ===================================================================

detect_project_root() {
    local current_dir="$PWD"
    local search_dir="$current_dir"
    local max_depth=10
    local depth=0
    
    while [ $depth -lt $max_depth ]; do
        # Check for project markers
        if [[ -f "$search_dir/package.json" && -d "$search_dir/components" && -d "$search_dir/scrum.pmo" ]]; then
            echo "$search_dir"
            return 0
        fi
        
        # Move up one directory
        search_dir="$(dirname "$search_dir")"
        
        # Stop at root
        if [ "$search_dir" = "/" ]; then
            break
        fi
        
        depth=$((depth + 1))
    done
    
    echo ""
    return 1
}

# Detect project root
PROJECT_ROOT=$(detect_project_root)

if [ -z "$PROJECT_ROOT" ]; then
    echo "❌ Error: Could not detect Web4Articles project root"
    echo "   Please run this script from within the Web4Articles project directory"
    exit 1
fi

# ===================================================================
# Component Version Resolution
# ===================================================================

COMPONENT_NAME="Web4Test"
COMPONENT_VERSION="0.1.0.0"
COMPONENT_PATH="$PROJECT_ROOT/components/Web4Test/$COMPONENT_VERSION"

# Verify component exists
if [ ! -d "$COMPONENT_PATH" ]; then
    echo "❌ Error: Web4Test component not found at: $COMPONENT_PATH"
    exit 1
fi

# ===================================================================
# Auto-Build Integration
# ===================================================================

build_component() {
    echo "🔨 Building Web4Test component..."
    
    cd "$COMPONENT_PATH"
    
    if [ -f "package.json" ]; then
        if command -v npm >/dev/null 2>&1; then
            npm run build
        else
            echo "⚠️  Warning: npm not found, skipping build"
        fi
    else
        echo "⚠️  Warning: package.json not found, skipping build"
    fi
}

# Check if build is needed
if [ ! -d "$COMPONENT_PATH/dist" ] || [ "$COMPONENT_PATH/src" -nt "$COMPONENT_PATH/dist" ]; then
    build_component
fi

# ===================================================================
# Context Preservation & Execution
# ===================================================================

echo "🧪 Web4Test v$COMPONENT_VERSION"
echo "📁 Project Root: $PROJECT_ROOT"
echo "🔗 Component: $COMPONENT_PATH"
echo "⚡ Executing from: $PWD"
echo ""

# Show component information
show_component_info() {
    echo "🧪 Web4Test - Tootsie Framework v$COMPONENT_VERSION"
    echo "📋 Purpose: Web4-native test orchestration and test case management"
    echo "🏗️  Category: Object-Oriented Testing Infrastructure Component"
    echo ""
}

# Main command dispatcher
case "${1:-help}" in
    "run-web4tscomponent-tests")
        show_component_info
        echo "🎯 Running Web4TSComponent Test Suite..."
        cd "$PROJECT_ROOT"
        if [ -f "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" ]; then
            node "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" run-web4tscomponent-tests
        else
            echo "❌ Error: Compiled CLI not found. Try building the component first."
            exit 1
        fi
        ;;
        
    "run-version-tests")
        show_component_info
        echo "🎯 Running Version Management Tests..."
        cd "$PROJECT_ROOT"
        if [ -f "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" ]; then
            node "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" run-version-tests
        else
            echo "❌ Error: Compiled CLI not found. Try building the component first."
            exit 1
        fi
        ;;
        
    "run-cli-tests")
        show_component_info
        echo "🎯 Running CLI Generation Tests..."
        cd "$PROJECT_ROOT"
        if [ -f "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" ]; then
            node "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" run-cli-tests
        else
            echo "❌ Error: Compiled CLI not found. Try building the component first."
            exit 1
        fi
        ;;
        
    "run-compliance-tests")
        show_component_info
        echo "🎯 Running Web4 Compliance Tests..."
        cd "$PROJECT_ROOT"
        if [ -f "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" ]; then
            node "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" run-compliance-tests
        else
            echo "❌ Error: Compiled CLI not found. Try building the component first."
            exit 1
        fi
        ;;
        
    "run-once-tests")
        show_component_info
        echo "🎯 Running ONCE Component Tests..."
        cd "$PROJECT_ROOT"
        if [ -f "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" ]; then
            node "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" run-once-tests
        else
            echo "❌ Error: Compiled CLI not found. Try building the component first."
            exit 1
        fi
        ;;
        
    "run-all")
        show_component_info
        echo "🎯 Running All Tests..."
        cd "$PROJECT_ROOT"
        if [ -f "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" ]; then
            node "$COMPONENT_PATH/dist/ts/layer5/Web4TestCLI.js" run-all
        else
            echo "❌ Error: Compiled CLI not found. Try building the component first."
            exit 1
        fi
        ;;
        
    "build")
        echo "🔨 Building Web4Test component..."
        build_component
        echo "✅ Build completed"
        ;;
        
    "info")
        show_component_info
        echo "📊 Component Status:"
        echo "  Version: $COMPONENT_VERSION"
        echo "  Path: $COMPONENT_PATH"
        echo "  Built: $([ -d "$COMPONENT_PATH/dist" ] && echo "✅ Yes" || echo "❌ No")"
        echo "  Tests Available: $(find "$COMPONENT_PATH/test" -name "*.ts" 2>/dev/null | wc -l) test files"
        ;;
        
    "help"|"")
        show_component_info
        echo "🧪 Web4Test - Tootsie Framework"
        echo ""
        echo "USAGE:"
        echo "  web4test <command>"
        echo ""
        echo "COMMANDS:"
        echo "  run-web4tscomponent-tests  Run complete Web4TSComponent test suite"
        echo "  run-version-tests          Run version management tests only"
        echo "  run-cli-tests             Run CLI generation tests only"
        echo "  run-compliance-tests      Run Web4 compliance tests only"
        echo "  run-once-tests            Run ONCE component tests"
        echo "  run-all                   Run all available tests (Web4TSComponent + ONCE)"
        echo "  build                     Build the Web4Test component"
        echo "  info                      Show component information"
        echo "  help                      Show this help message"
        echo ""
        echo "EXAMPLES:"
        echo "  ./web4test.sh run-all"
        echo "  ./web4test.sh run-version-tests"
        echo "  ./web4test.sh run-once-tests"
        echo "  ./web4test.sh run-compliance-tests"
        echo ""
        echo "Web4 Principles Applied:"
        echo "- ✅ Empty Constructor Principle"
        echo "- ✅ Scenario-First Development"
        echo "- ✅ Non-Interactive Testing (No Hangs)"
        echo "- ✅ Location-Resilient CLI"
        echo "- ✅ 5-Layer Architecture"
        echo "- ✅ Object-Oriented Test Cases"
        echo "- ✅ IOR-Based Traceability"
        echo "- ✅ Evidence Preservation"
        echo ""
        ;;
        
    *)
        echo "❌ Unknown command: $1"
        echo "Use 'web4test help' to see available commands"
        exit 1
        ;;
esac
