#!/bin/bash
# Web4TSCTesting Location-Resilient CLI v0.1.0.0
# Generated following Web4 Location-Resilient CLI Standard
# Purpose: Test and validate Web4TSComponent from any directory

# Store original execution directory
ORIGINAL_DIR="$(pwd)"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Project root detection - Web4 Standard Pattern
find_project_root() {
    local current_dir="$(pwd)"
    
    # Try git root first
    local git_root
    git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [[ -n "$git_root" ]] && [[ -f "$git_root/package.json" ]]; then
        echo "$git_root"
        return 0
    fi
    
    # Walk up directory tree looking for package.json
    local dir="$current_dir"
    while [[ "$dir" != "/" ]]; do
        if [[ -f "$dir/package.json" ]]; then
            echo "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    
    # Try script directory as fallback
    if [[ -f "$SCRIPT_DIR/../../../package.json" ]]; then
        echo "$(cd "$SCRIPT_DIR/../../.." && pwd)"
        return 0
    fi
    
    echo "ERROR: Could not find project root with package.json" >&2
    return 1
}

# Locate project root
PROJECT_ROOT=$(find_project_root)
if [[ $? -ne 0 ]]; then
    exit 1
fi

# Component resolution - Web4 Standard Pattern
COMPONENT_VERSION="0.1.0.0"
COMPONENT_NAME="web4tscTesting"
COMPONENT_DIR="$PROJECT_ROOT/temp/$COMPONENT_NAME/$COMPONENT_VERSION"
CLI_PATH="$COMPONENT_DIR/dist/ts/layer5/Web4TSCTestingCLI.js"

# Validation checks
if [[ ! -d "$COMPONENT_DIR" ]]; then
    echo "ERROR: Component directory not found: $COMPONENT_DIR" >&2
    echo "Expected structure: temp/web4tscTesting/0.1.0.0/" >&2
    exit 1
fi

# Auto-build integration - Web4 Standard Pattern
if [[ ! -f "$CLI_PATH" ]] || [[ "$COMPONENT_DIR/src" -nt "$CLI_PATH" ]]; then
    echo "🔨 Building Web4TSCTesting CLI v$COMPONENT_VERSION..."
    
    cd "$COMPONENT_DIR" || {
        echo "ERROR: Could not change to component directory: $COMPONENT_DIR" >&2
        exit 1
    }
    
    # Check for package.json
    if [[ ! -f "package.json" ]]; then
        echo "ERROR: package.json not found in component directory" >&2
        exit 1
    fi
    
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        echo "📦 Installing dependencies..."
        npm install || {
            echo "ERROR: npm install failed" >&2
            exit 1
        }
    fi
    
    # Build the project
    npm run build || {
        echo "ERROR: npm run build failed" >&2
        exit 1
    }
    
    echo "✅ Build completed successfully"
fi

# Final CLI validation
if [[ ! -f "$CLI_PATH" ]]; then
    echo "ERROR: CLI file still not found after build: $CLI_PATH" >&2
    exit 1
fi

# Context preservation - Web4 Standard Pattern
cd "$ORIGINAL_DIR" || {
    echo "ERROR: Could not return to original directory: $ORIGINAL_DIR" >&2
    exit 1
}

# Execute CLI with all arguments
echo "🧪 Web4TSCTesting v$COMPONENT_VERSION"
echo "📁 Project Root: $PROJECT_ROOT"
echo "🔗 Component: $COMPONENT_DIR"
echo "⚡ Executing from: $ORIGINAL_DIR"
echo ""

node "$CLI_PATH" "$@"
exit_code=$?

# Return to original directory (redundant but safe)
cd "$ORIGINAL_DIR" || true

exit $exit_code
