#!/bin/bash

# Web4Requirement CLI Wrapper - Version 0.1.3.0
# Location-resilient command wrapper

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Set PROJECT_ROOT if not already set
if [ -z "$PROJECT_ROOT" ]; then
  # Try to find project root by looking for package.json or .git
  PROJECT_ROOT="$SCRIPT_DIR"
  
  # Walk up directories to find project root
  while [ "$PROJECT_ROOT" != "/" ]; do
    if [ -f "$PROJECT_ROOT/package.json" ] || [ -d "$PROJECT_ROOT/.git" ]; then
      break
    fi
    PROJECT_ROOT="$(dirname "$PROJECT_ROOT")"
  done
  
  export PROJECT_ROOT
fi

# Store current directory to return to
CURRENT_DIR="$(pwd)"

# Find the CLI in the components directory structure
COMPONENT_VERSION="0.1.3.0"
COMPONENT_DIR="$PROJECT_ROOT/components/Web4Requirement/$COMPONENT_VERSION"
CLI_SOURCE_PATH="$COMPONENT_DIR/src/ts/RequirementCLI.ts"
CLI_PATH="$COMPONENT_DIR/dist/ts/RequirementCLI.js"

# Check if compiled CLI exists, if not try to build
if [ ! -f "$CLI_PATH" ]; then
    if [ ! -f "$CLI_SOURCE_PATH" ]; then
        echo "❌ CLI source not found at: $CLI_SOURCE_PATH"
        echo "📁 Component directory: $COMPONENT_DIR"
        exit 1
    fi
    
    echo "🔨 Building Web4Requirement CLI v$COMPONENT_VERSION..."
    cd "$COMPONENT_DIR"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    # Build the project
    if ! npm run build; then
        echo "❌ Build failed for Web4Requirement v$COMPONENT_VERSION"
        exit 1
    fi
    
    if [ ! -f "$CLI_PATH" ]; then
        echo "❌ CLI still not found at: $CLI_PATH after build"
        exit 1
    fi
fi

# Execute the CLI and return to original directory
cd "$CURRENT_DIR"
node "$CLI_PATH" "$@"