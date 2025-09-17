#!/bin/bash

# Web4Requirement CLI Tool - Version 0.1.0.0
# Location-resilient command wrapper

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

# Detect current working directory context
CURRENT_DIR="$(pwd)"
CONTEXT_INFO=""

# Check if we're in a component directory structure
# Pattern: components/[componentName]/[version]/ or similar
if [[ "$CURRENT_DIR" == *"/components/"*"/"*"/"* ]]; then
  # Extract component info
  COMPONENT_PATH=$(echo "$CURRENT_DIR" | grep -o '.*/components/[^/]*/[^/]*')
  if [ -n "$COMPONENT_PATH" ]; then
    CONTEXT_INFO="component:$COMPONENT_PATH"
  fi
fi

# If no component context detected, use arbitrary directory context
if [ -z "$CONTEXT_INFO" ]; then
  CONTEXT_INFO="arbitrary:$CURRENT_DIR"
fi

# Find the CLI in the components directory structure
COMPONENT_VERSION="0.1.0.0"
COMPONENT_DIR="$PROJECT_ROOT/components/Web4Requirement/$COMPONENT_VERSION"
CLI_SOURCE_PATH="$COMPONENT_DIR/src/ts/layer5/RequirementCLI.ts"
CLI_PATH="$COMPONENT_DIR/dist/ts/layer5/RequirementCLI.js"

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

# Execute the CLI with context info and all arguments
cd "$CURRENT_DIR"
DIRECTORY_CONTEXT="$CONTEXT_INFO" node "$CLI_PATH" "$@"
