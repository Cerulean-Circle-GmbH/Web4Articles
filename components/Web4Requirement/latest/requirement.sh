#!/bin/bash

# Web4Requirement CLI Tool - Latest Version
# Usage: ./requirement.sh <command> [arguments]
# This script runs the TypeScript CLI directly using ts-node

# Get the directory where this script is located (resolve symlinks)
SCRIPT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}" 2>/dev/null || echo "${BASH_SOURCE[0]}")")" && pwd)"

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

# Path to the TypeScript CLI source
CLI_PATH="$SCRIPT_DIR/src/ts/layer5/RequirementCLI.ts"

# Check if CLI source exists
if [ ! -f "$CLI_PATH" ]; then
  echo "❌ CLI source not found at: $CLI_PATH"
  echo "🔧 Please ensure the Web4Requirement latest version is properly set up"
  exit 1
fi

# Check for ts-node availability
TS_NODE_PATH=""

# First check if ts-node is in project node_modules
if [ -f "$PROJECT_ROOT/node_modules/.bin/ts-node" ]; then
  TS_NODE_PATH="$PROJECT_ROOT/node_modules/.bin/ts-node"
elif command -v ts-node >/dev/null 2>&1; then
  TS_NODE_PATH="ts-node"
else
  echo "❌ ts-node not found. Please install ts-node:"
  echo "   npm install --save-dev ts-node"
  echo "   or globally: npm install -g ts-node"
  exit 1
fi

# Check for TypeScript configuration
TSCONFIG_PATH="$PROJECT_ROOT/tsconfig.json"
if [ ! -f "$TSCONFIG_PATH" ]; then
  echo "⚠️  Warning: tsconfig.json not found at $TSCONFIG_PATH"
fi

# Execute the CLI with context info and all arguments using proper ts-node compilation
# Disable experimental TypeScript support and force ts-node usage
NODE_OPTIONS="--loader=ts-node/esm --no-experimental-strip-types" DIRECTORY_CONTEXT="$CONTEXT_INFO" node "$CLI_PATH" "$@"