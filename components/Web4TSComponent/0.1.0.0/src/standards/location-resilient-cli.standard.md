# Web4 Location-Resilient CLI Standard v1.0

## Overview

This standard defines the requirements for Web4 component CLI scripts to work from any directory within a project. All Web4 components MUST implement location-resilient CLIs following this pattern.

## Core Principle

**Location Semantic Invariant**: A CLI command must produce identical results regardless of the directory from which it is executed within the project tree.

## Standard Requirements

### 1. Project Root Detection (MANDATORY)

All CLI scripts MUST implement intelligent project root detection using this hierarchy:

```bash
find_project_root() {
    # Try git first (most reliable)
    local git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [ -n "$git_root" ] && [ -d "$git_root" ]; then
        # Verify it's Web4Articles project by checking for key files
        if [ -f "$git_root/package.json" ] || [ -f "$git_root/README.md" ]; then
            echo "$git_root"
            return 0
        fi
    fi
    
    # Fallback: walk up looking for .git and package.json
    local current_dir="$PWD"
    while [ "$current_dir" != "/" ]; do
        if [ -d "$current_dir/.git" ] && [ -f "$current_dir/package.json" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    return 1
}
```

### 2. Component Version Resolution (MANDATORY)

CLI scripts MUST resolve their target component using the standard Web4 directory structure:

```bash
COMPONENT_VERSION="X.Y.Z.W"
COMPONENT_DIR="$PROJECT_ROOT/components/[ComponentName]/$COMPONENT_VERSION"
CLI_SOURCE_PATH="$COMPONENT_DIR/src/ts/layer5/[Component]CLI.ts"
CLI_PATH="$COMPONENT_DIR/dist/ts/layer5/[Component]CLI.js"
```

### 3. Auto-Build Integration (MANDATORY)

CLI scripts MUST automatically build the component if the compiled CLI does not exist:

```bash
if [ ! -f "$CLI_PATH" ]; then
  if [ ! -f "$CLI_SOURCE_PATH" ]; then
    echo "❌ CLI source not found at: $CLI_SOURCE_PATH"
    echo "📁 Component directory: $COMPONENT_DIR"
    exit 1
  fi
  
  echo "🔨 Building [Component] CLI v$COMPONENT_VERSION..."
  cd "$COMPONENT_DIR"
  
  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    npm install
  fi
  
  # Build the project
  if ! npm run build; then
    echo "❌ Build failed for [Component] v$COMPONENT_VERSION"
    exit 1
  fi
  
  if [ ! -f "$CLI_PATH" ]; then
    echo "❌ CLI still not found at: $CLI_PATH after build"
    exit 1
  fi
fi
```

### 4. Context Preservation (MANDATORY)

CLI scripts MUST preserve the original execution directory:

```bash
# Store current directory to return to
CURRENT_DIR="$(pwd)"

# ... perform component operations ...

# Execute the CLI and return to original directory
cd "$CURRENT_DIR"
DIRECTORY_CONTEXT="$CONTEXT_INFO" node "$CLI_PATH" "$@"
```

### 5. Error Handling (MANDATORY)

- MUST provide clear error messages with specific file paths
- MUST exit with appropriate error codes (0 for success, 1 for failure)
- MUST validate Node.js availability before execution
- MUST handle missing components gracefully

### 6. Context Detection (RECOMMENDED)

CLI scripts SHOULD detect execution context and pass it to the component:

```bash
# Detect context for the CLI
CURRENT_DIR="$(pwd)"
CONTEXT_INFO=""

# Check if we're in a component directory
if [[ "$CURRENT_DIR" == *"/components/"*"/"*"/"* ]]; then
    COMPONENT_PATH=$(echo "$CURRENT_DIR" | grep -o '.*/components/[^/]*/[^/]*')
    if [ -n "$COMPONENT_PATH" ]; then
        CONTEXT_INFO="component:$COMPONENT_PATH"
    fi
fi

# Default context if none detected
if [ -z "$CONTEXT_INFO" ]; then
    CONTEXT_INFO="arbitrary:$CURRENT_DIR"
fi
```

## Standard Template

Use the following template for all Web4 component CLI scripts:

```bash
#!/bin/bash

# [ComponentName] CLI Tool - Location Resilient Version
# Web4 Architecture Standard v1.0
# Works from any directory, finds project root via git

# [Include find_project_root function]
# [Include project root detection]
# [Include context detection]
# [Include component version resolution]
# [Include auto-build integration]
# [Include context preservation]
```

## Validation

Use `Web4TSComponentCLI validate-standard <script-path>` to verify compliance with this standard.

## Web4 Architecture Alignment

This standard implements core Web4 principles:

- **Semantic Invariants**: Location becomes semantically irrelevant
- **IOR Architecture**: Components referenced by version-specific paths
- **Occam's Razor**: Single pattern eliminates all location complexity
- **Universal Patterns**: Same approach works across all component types

## Compliance Checking

All components MUST pass validation before release:

```bash
web4tscomponent validate-standard scripts/versions/[component][version]
```

## Generation Tool

Use `Web4TSComponentCLI generate-cli <component-name> <version>` to generate standard-compliant scripts automatically.

---

**Status**: ACTIVE STANDARD v1.0  
**Applies To**: All Web4 Components  
**Enforcement**: Mandatory for all new components, existing components updated  
**Validation Tool**: Web4TSComponent CLI  


