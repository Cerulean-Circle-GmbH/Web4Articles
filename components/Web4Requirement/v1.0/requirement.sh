#!/bin/bash

# Web4Requirement CLI Tool
# Usage: ./requirement.sh <command> [arguments]

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

# Path to the compiled CLI
CLI_PATH="$SCRIPT_DIR/dist/ts/layer5/RequirementCLI.js"

# Check if CLI exists
if [ ! -f "$CLI_PATH" ]; then
  echo "❌ CLI not found at: $CLI_PATH"
  echo "🔧 Please run 'npm run build' first"
  exit 1
fi

# Execute the CLI with context info and all arguments
DIRECTORY_CONTEXT="$CONTEXT_INFO" node "$CLI_PATH" "$@"
