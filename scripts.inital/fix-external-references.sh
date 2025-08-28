#!/bin/bash

# Fix External References Script - Self-contained symbolic link management
# Creates correct relative symbolic links from project root for external references

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Determine project root
print_status "Determining project root..."
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$PROJECT_ROOT" ]; then
    print_error "Not in a git repository. Cannot determine project root."
    exit 1
fi

print_success "Project root: $PROJECT_ROOT"

# Change to project root
cd "$PROJECT_ROOT"

# Define external references directory
EXT_REF_DIR="scrum.pmo/roles/_shared/external-references"
EXT_REF_PATH="$PROJECT_ROOT/$EXT_REF_DIR"

print_status "External references directory: $EXT_REF_PATH"

# Create external references directory if it doesn't exist
mkdir -p "$EXT_REF_PATH"

# Define target files and their desired link names (compatible with macOS bash)
LINK_NAMES=(
    "pdca-howto-guide.md"
    "project-readme.md"
    "web4-requirements-paradigm-shifts.md"
    "ucp-component-definition.md"
)

TARGET_FILES=(
    "scrum.pmo/roles/_shared/PDCA/howto.PDCA.md"
    "README.md"
    "scrum.pmo/sprints/sprint-20/web4.requirement.md"
    "workspacesMountPoint/2cuGitHub/cerulean-circle-unlimited-2cu/cerulean-circle-unlimited-2cu/product/development/coast/eamducp-repository/UCP.md"
)

# Function to calculate relative path
calculate_relative_path() {
    local from_dir="$1"
    local to_file="$2"
    
    # Use Python to calculate relative path (more reliable than bash)
    python3 -c "
import os
from_dir = os.path.abspath('$from_dir')
to_file = os.path.abspath('$to_file')
rel_path = os.path.relpath(to_file, from_dir)
print(rel_path)
" 2>/dev/null || {
        # Fallback for systems without Python3
        realpath --relative-to="$from_dir" "$to_file" 2>/dev/null || {
            print_error "Cannot calculate relative path. Need python3 or GNU coreutils."
            return 1
        }
    }
}

# Function to create symbolic link with proper relative path
create_external_link() {
    local link_name="$1"
    local target_file="$2"
    local link_path="$EXT_REF_PATH/$link_name"
    
    print_status "Processing: $link_name -> $target_file"
    
    # Check if target file exists
    if [ ! -f "$PROJECT_ROOT/$target_file" ]; then
        print_warning "Target file not found: $target_file"
        return 1
    fi
    
    # Remove existing link if it exists
    if [ -L "$link_path" ] || [ -f "$link_path" ]; then
        print_status "Removing existing link: $link_path"
        rm -f "$link_path"
    fi
    
    # Calculate relative path from external-references to target
    local rel_path
    rel_path=$(calculate_relative_path "$EXT_REF_PATH" "$PROJECT_ROOT/$target_file")
    if [ $? -ne 0 ]; then
        print_error "Failed to calculate relative path for $target_file"
        return 1
    fi
    
    # Create symbolic link
    print_status "Creating link: $link_name -> $rel_path"
    ln -sf "$rel_path" "$link_path"
    
    # Verify link works
    if [ -f "$link_path" ]; then
        print_success "✓ Link created and verified: $link_name"
        return 0
    else
        print_error "✗ Link verification failed: $link_name"
        return 1
    fi
}

# Main execution
print_status "Starting external references link creation..."

# Track success/failure
success_count=0
total_count=${#LINK_NAMES[@]}

# Create all external reference links
for i in "${!LINK_NAMES[@]}"; do
    link_name="${LINK_NAMES[$i]}"
    target_file="${TARGET_FILES[$i]}"
    if create_external_link "$link_name" "$target_file"; then
        ((success_count++))
    fi
done

# Create README.md for external references if it doesn't exist
README_PATH="$EXT_REF_PATH/README.md"
if [ ! -f "$README_PATH" ]; then
    print_status "Creating external references README.md..."
    cat > "$README_PATH" << 'EOF'
# External References - Key Documents

This directory contains symbolic links to essential documents that form the foundation of our Web4 project methodology and architecture.

## Core Documentation

### 📋 Process Documentation
- [pdca-howto-guide.md](pdca-howto-guide.md)
  - Comprehensive PDCA writing guidelines v2.5
  - Format requirements, quality gates, and validation checklist
  - Essential for all PDCA creation and review

### 🚀 Project Overview  
- [project-readme.md](project-readme.md)
  - Web4Articles DAPP overview
  - Quick start commands and key rules
  - Background agent operating procedures

### 🎯 Web4 Architecture
- [web4-requirements-paradigm-shifts.md](web4-requirements-paradigm-shifts.md)
  - Revolutionary Web4 methodology principles
  - 10 core paradigm shifts from mainstream programming
  - The Last Architecture (TLA) implementation requirements

### 🔧 Component Architecture
- [ucp-component-definition.md](ucp-component-definition.md)
  - UCP (Unit-Component-Package) fractal definition
  - 4 essential component qualities
  - Historical evolution from Delphi VCL to Web4 PWA

## Maintenance

To fix broken symbolic links, run from project root:
```bash
./scripts/fix-external-references.sh
```

This script automatically:
- Determines project root via git
- Calculates correct relative paths
- Creates working symbolic links
- Verifies link functionality

---

**All links are relative and work across different environments and git branches.**
EOF
    print_success "README.md created"
fi

# Display results
echo
print_status "=== SUMMARY ==="
print_status "Successfully created: $success_count/$total_count external reference links"

if [ $success_count -eq $total_count ]; then
    print_success "🎉 All external reference links created successfully!"
    echo
    print_status "External references available at:"
    print_status "$EXT_REF_DIR/"
    ls -la "$EXT_REF_PATH" | grep -E '\.md' | while read line; do
        print_status "  $line"
    done
else
    print_warning "⚠️  Some links failed to create. Check target file locations."
fi

echo
print_status "Script completed."
