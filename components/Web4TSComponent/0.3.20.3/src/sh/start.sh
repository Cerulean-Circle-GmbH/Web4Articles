#!/usr/bin/env sh
# DRY: Source shared component start library
# @pdca 2025-01-XX-UTC-optimize-shell-scripts-eliminate-dry.pdca.md
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
. "$SCRIPT_DIR/lib-component-start.sh"

# Call shared library with component-specific parameters
. "$SCRIPT_DIR/lib-component-start.sh" "Web4TSComponent" "dist/ts/layer5/Web4TSComponentCLI.js"
