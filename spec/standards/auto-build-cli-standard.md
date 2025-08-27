# Auto-Build CLI Standard Specification
**Version:** 1.0.0  
**Status:** Draft  
**Created:** 2025-08-27 UTC 22:05  
**Requirement:** [f4eac062-9f10-420c-832a-ab8fdf96d313](../requirements.md/f4eac062-9f10-420c-832a-ab8fdf96d313.requirement.md)

## Abstract

This specification defines the universal auto-build pattern for Web4 CLI tools, establishing standards for dependency detection, silent operations, progress feedback, graceful fallback, and user guidance. This specification serves as the foundation for CMM Level 4 (Managed) process maturity with metrics and automated validation across all Web4 components.

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Architecture Requirements](#architecture-requirements)
4. [Implementation Standards](#implementation-standards)
5. [Build Process Protocol](#build-process-protocol)
6. [Error Handling & Fallback](#error-handling--fallback)
7. [User Experience Guidelines](#user-experience-guidelines)
8. [CMM Level 4 Integration](#cmm-level-4-integration)
9. [Validation & Testing](#validation--testing)
10. [Reference Implementation](#reference-implementation)

## Overview

### Purpose

The Auto-Build CLI Standard ensures consistent, reliable, and user-friendly CLI behavior across all Web4 components by automating dependency management and build processes while providing comprehensive feedback and graceful degradation.

### Scope

This standard applies to:
- All Web4 component CLI tools
- Shell script wrappers
- Node.js-based CLI implementations
- TypeScript/JavaScript build processes
- Package.json configurations

### Terminology

- **Auto-build**: Automatic dependency installation and compilation when CLI is not found
- **Silent Operations**: Build processes that suppress verbose output while preserving error information
- **Progressive Enhancement**: Gradual improvement of functionality based on available resources
- **Graceful Fallback**: Providing alternative functionality when primary features are unavailable

## Core Principles

### 1. Zero-Configuration Experience
CLI tools MUST work without manual setup or build commands from the user.

### 2. Location Resilience
CLI tools MUST work from any directory within the project structure.

### 3. Self-Healing Capability
CLI tools MUST attempt to resolve missing dependencies automatically.

### 4. Transparent Operations
All automated processes MUST provide clear progress indication and error reporting.

### 5. Graceful Degradation
CLI tools MUST provide alternative functionality when full features are unavailable.

## Architecture Requirements

### Project Root Detection

**REQUIRED**: All CLI tools MUST implement robust project root detection:

```bash
find_project_root() {
    # Primary: Git repository root
    local git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [ -n "$git_root" ] && [ -d "$git_root" ]; then
        # Verify Web4Articles project
        if [ -f "$git_root/package.json" ] || [ -f "$git_root/README.md" ]; then
            echo "$git_root"
            return 0
        fi
    fi
    
    # Fallback: Directory traversal
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

### Context Detection

**REQUIRED**: CLI tools MUST detect execution context:

```bash
# Component context detection
if [[ "$CURRENT_DIR" == *"/components/"*"/"*"/"* ]]; then
    COMPONENT_PATH=$(echo "$CURRENT_DIR" | grep -o '.*/components/[^/]*/[^/]*')
    if [ -n "$COMPONENT_PATH" ]; then
        CONTEXT_INFO="component:$COMPONENT_PATH"
    fi
fi

# Default context fallback
if [ -z "$CONTEXT_INFO" ]; then
    CONTEXT_INFO="arbitrary:$CURRENT_DIR"
fi
```

### Multi-Location CLI Resolution

**REQUIRED**: CLI tools MUST search multiple standard locations:

```bash
CLI_LOCATIONS=(
    "$PROJECT_ROOT/components/[Component]/latest/dist/ts/layer5/[Component]CLI.js"
    "$PROJECT_ROOT/scripts/dist/ts/layer5/[Component]CLI.js"
    "$PROJECT_ROOT/dist/ts/layer5/[Component]CLI.js"
)
```

## Implementation Standards

### Directory Structure Requirements

**MANDATORY** directory structure for all Web4 CLI components:

```
components/[ComponentName]/latest/
├── src/ts/layer5/
│   └── [ComponentName]CLI.ts     # CLI implementation
├── dist/ts/layer5/
│   └── [ComponentName]CLI.js     # Built CLI (auto-generated)
├── package.json                  # With CLI exports and build scripts
└── tsconfig.json                 # TypeScript configuration
```

### Package.json Configuration

**REQUIRED** package.json fields:

```json
{
  "exports": {
    "./cli": "./dist/ts/layer5/[ComponentName]CLI.js"
  },
  "bin": {
    "[component-name]-cli": "./dist/ts/layer5/[ComponentName]CLI.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist/"
  }
}
```

### Shell Script Wrapper Standards

**REQUIRED** shell script structure:

1. **Header** with tool description
2. **Project root detection** function
3. **Context detection** logic
4. **CLI location resolution** with multiple fallbacks
5. **Auto-build process** with progress feedback
6. **Node.js execution** with environment variables

## Build Process Protocol

### Phase 1: Detection

1. **Project Root Validation**
   ```bash
   PROJECT_ROOT=$(find_project_root)
   if [ -z "$PROJECT_ROOT" ]; then
       echo "❌ Error: Not in a Web4Articles project directory"
       echo "💡 Please run from within the Web4Articles git repository"
       exit 1
   fi
   ```

2. **CLI Existence Check**
   ```bash
   CLI_PATH=""
   for location in "${CLI_LOCATIONS[@]}"; do
       if [ -f "$location" ]; then
           CLI_PATH="$location"
           break
       fi
   done
   ```

### Phase 2: Auto-Build Process

**REQUIRED** when CLI_PATH is empty:

1. **Component Directory Validation**
   ```bash
   if [ ! -d "$PROJECT_ROOT/components/[Component]/latest" ]; then
       echo "❌ [Component] component directory not found"
       exit 1
   fi
   ```

2. **Dependency Installation**
   ```bash
   echo "📦 Installing dependencies..."
   if ! npm install --silent > /dev/null 2>&1; then
       echo "❌ npm install failed"
       exit 1
   fi
   ```

3. **Build Execution**
   ```bash
   echo "🔨 Building [Component] component..."
   if ! npm run build --silent > /dev/null 2>&1; then
       # Graceful fallback handling
   fi
   ```

4. **Post-Build CLI Resolution**
   ```bash
   # Re-check CLI locations after build
   for location in "${CLI_LOCATIONS[@]}"; do
       if [ -f "$location" ]; then
           CLI_PATH="$location"
           break
       fi
   done
   ```

### Phase 3: Execution

**REQUIRED** execution pattern:

```bash
# Environment setup
export DIRECTORY_CONTEXT="$CONTEXT_INFO"
export PROJECT_ROOT

# Node.js validation
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is required but not installed"
    exit 1
fi

# CLI execution
node "$CLI_PATH" "$@"
```

## Error Handling & Fallback

### Build Failure Scenarios

**MANDATORY** error handling for build failures:

1. **npm install failure**
   ```bash
   if ! npm install --silent > /dev/null 2>&1; then
       echo "❌ npm install failed"
       echo "💡 Check network connectivity and package.json"
       echo "🔧 Manual fix: cd $PROJECT_ROOT/components/[Component]/latest && npm install"
       exit 1
   fi
   ```

2. **npm run build failure**
   ```bash
   if ! npm run build --silent > /dev/null 2>&1; then
       echo "❌ Build failed - [Component] CLI implementation not available yet"
       echo ""
       echo "💡 The [Component] component currently provides:"
       echo "   - [Available functionality list]"
       echo ""
       echo "🔧 Available CLI tools:"
       echo "   - requirement  (requirement management)"
       echo "   - unit         (unit management)"
       echo "   - user         (user scenario management)"
       exit 1
   fi
   ```

3. **Missing CLI after build**
   ```bash
   if [ -z "$CLI_PATH" ]; then
       echo "✅ Build completed successfully"
       echo "💡 [Component] component built but CLI interface not implemented yet"
       echo ""
       echo "📋 Available functionality:"
       echo "   - [Direct functionality available]"
       echo ""
       echo "🔧 Alternative CLI tools:"
       echo "   - [Working alternatives]"
       exit 0
   fi
   ```

### Progressive Enhancement

**REQUIRED** fallback functionality when full CLI is unavailable:

1. **Direct command support** for essential operations
2. **Alternative tool recommendations**
3. **Manual process documentation**
4. **Future availability indication**

## User Experience Guidelines

### Progress Feedback Standards

**MANDATORY** progress indicators:

- `🔄` Auto-build initiation
- `📦` Dependency installation
- `🔨` Build process
- `✅` Success confirmation
- `❌` Error indication
- `💡` Helpful hints
- `🔧` Manual alternatives

### Message Formatting Standards

**REQUIRED** message structure:

```bash
# Success messages
echo "✅ [Action] completed successfully"

# Error messages  
echo "❌ Error: [Description]"
echo "💡 [Helpful suggestion]"
echo "🔧 Manual fix: [Specific commands]"

# Progress messages
echo "🔄 [Action] in progress..."
echo "📦 Installing dependencies..."
echo "🔨 Building [Component] component..."
```

### Information Hierarchy

1. **Primary Status** (Success/Error with icon)
2. **Context Information** (What happened)
3. **Helpful Guidance** (What to do next)
4. **Manual Alternatives** (If auto-build fails)
5. **Available Functionality** (What still works)

## CMM Level 4 Integration

### Metrics Collection

**REQUIRED** for CMM Level 4 compliance:

1. **Build Time Metrics**
   ```bash
   BUILD_START=$(date +%s)
   # ... build process ...
   BUILD_END=$(date +%s)
   BUILD_DURATION=$((BUILD_END - BUILD_START))
   ```

2. **Success/Failure Rates**
   ```bash
   # Log to metrics file
   echo "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ),auto-build,$COMPONENT_NAME,$BUILD_RESULT,$BUILD_DURATION" >> "$PROJECT_ROOT/metrics/auto-build.log"
   ```

3. **Resource Usage Tracking**
   ```bash
   # Monitor npm install/build resource usage
   /usr/bin/time -p npm install --silent > /dev/null 2> "$TEMP_DIR/build-metrics.log"
   ```

### Automated Quality Gates

**REQUIRED** validation points:

1. **Pre-build Validation**
   - Component directory structure
   - package.json completeness
   - TypeScript configuration

2. **Build Validation**
   - Compilation success
   - Output file generation
   - CLI entry point creation

3. **Post-build Validation**
   - CLI execution test
   - Help command test
   - Basic functionality test

### Process Improvement Feedback

**MANDATORY** for continuous improvement:

1. **Build failure analysis logging**
2. **Performance metrics collection**
3. **User experience feedback capture**
4. **Error pattern analysis**

## Validation & Testing

### Automated Test Requirements

**REQUIRED** test scenarios:

1. **Fresh Environment Test**
   ```bash
   # Test from clean state (no dist/ directory)
   rm -rf dist/
   ./scripts/[component] --help
   ```

2. **Cross-Directory Test**
   ```bash
   # Test from various project locations
   cd /tmp && /path/to/project/scripts/[component] --help
   cd /path/to/project/components/OtherComponent && ../../scripts/[component] --help
   ```

3. **Network Failure Simulation**
   ```bash
   # Test npm install failure handling
   export npm() { return 1; }
   ./scripts/[component] create test
   ```

4. **Build Failure Simulation**
   ```bash
   # Test TypeScript compilation failure
   echo "syntax error" >> src/ts/layer5/ComponentCLI.ts
   ./scripts/[component] --help
   ```

### Manual Testing Protocol

**REQUIRED** validation steps:

1. Delete all `dist/` directories
2. Run CLI from project root
3. Run CLI from component directory
4. Run CLI from arbitrary directory within project
5. Run CLI from outside project (should fail gracefully)
6. Validate error messages and guidance quality

## Reference Implementation

### Model Implementation: Unit CLI

The Unit component serves as the reference implementation:

**File**: `scripts/unit` ([GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/scripts/unit))

**Key Features Demonstrated**:
- ✅ Project root detection with git fallback
- ✅ Multi-location CLI resolution
- ✅ Silent auto-build with progress feedback
- ✅ Comprehensive error handling
- ✅ Graceful fallback with alternative suggestions
- ✅ Context detection and environment setup
- ✅ User-friendly progress indicators

### Implementation Template

```bash
#!/bin/bash
# [Component] CLI Tool - Auto-Build Standard Compliant

# 1. Project root detection (using standard function)
find_project_root() { ... }

# 2. Context detection
CURRENT_DIR="$(pwd)"
CONTEXT_INFO=""
# ... context detection logic ...

# 3. CLI location resolution
CLI_LOCATIONS=( ... )
CLI_PATH=""
# ... location search logic ...

# 4. Auto-build process
if [ -z "$CLI_PATH" ]; then
    echo "🔄 [Component] CLI not found, attempting to build..."
    # ... auto-build implementation ...
fi

# 5. Execution
export DIRECTORY_CONTEXT="$CONTEXT_INFO"
node "$CLI_PATH" "$@"
```

## Compliance Checklist

### For New CLI Tools

- [ ] **Project root detection** implemented
- [ ] **Multi-location CLI resolution** configured
- [ ] **Auto-build process** with silent operations
- [ ] **Progress feedback** with standard icons
- [ ] **Error handling** with helpful guidance
- [ ] **Graceful fallback** functionality
- [ ] **Context detection** for environment setup
- [ ] **Package.json** with CLI exports and scripts
- [ ] **TypeScript configuration** for layer5 compilation
- [ ] **Cross-directory testing** validated
- [ ] **CMM Level 4** metrics integration
- [ ] **Documentation** and help command

### For Existing CLI Tools

- [ ] **Requirement CLI**: Missing auto-build - requires manual implementation
- [ ] **User CLI**: ✅ Compliant with graceful fallback for missing UserCLI.js
- [ ] **Unit CLI**: ✅ Fully compliant reference implementation

## Version History

- **v1.0.0** (2025-08-27): Initial specification based on Unit and User CLI analysis
- **Future**: Integration feedback, CMM Level 4 metrics, additional components

---

*This specification serves as the foundation for CMM Level 4 (Managed) process maturity across all Web4 components, enabling consistent, reliable, and measurable CLI experiences.*
