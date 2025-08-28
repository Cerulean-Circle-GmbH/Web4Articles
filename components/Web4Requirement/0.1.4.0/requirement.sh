#!/bin/bash

# Web4Requirement CLI Tool v0.1.4.0 - Enhanced with Dependency Resolution
# Automatically builds dependencies and self-builds on first run

# Function to find project root using git
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

# Function to analyze and build component dependencies
find_and_build_dependencies() {
    local component_dir="$1"
    local project_root="$2"
    
    echo "🔍 Analyzing dependencies for $(basename "$component_dir")..."
    
    # Find all TypeScript imports that reference other components
    if [ -d "$component_dir/src" ]; then
        find "$component_dir/src" -name "*.ts" -exec grep -l "from.*components/" {} \; 2>/dev/null | while read file; do
            # Extract component dependencies from import statements
            grep "from.*components/" "$file" 2>/dev/null | while read line; do
                # Parse patterns like: from '../../../User/0.1.0.0/dist/ts/DefaultUser.js'
                if [[ "$line" =~ from[[:space:]]*[\'\"](.*)/components/([^/]+)/([^/]+)/.*[\'\"] ]]; then
                    local dep_component="${BASH_REMATCH[2]}"
                    local dep_version="${BASH_REMATCH[3]}"
                    local dep_path="$project_root/components/$dep_component/$dep_version"
                    
                    if [ -d "$dep_path" ]; then
                        echo "  📦 Found dependency: $dep_component/$dep_version"
                        
                        # Check if dependency needs building
                        if [ ! -d "$dep_path/dist" ] || [ ! "$(find "$dep_path/dist" -name "*.js" 2>/dev/null)" ]; then
                            echo "  🔨 Building dependency: $dep_component/$dep_version..."
                            
                            cd "$dep_path"
                            
                            # Install dependencies if needed
                            if [ ! -d "node_modules" ]; then
                                echo "    📥 Installing dependencies..."
                                npm install --silent
                            fi
                            
                            # Build the dependency
                            if [ -f "package.json" ] && grep -q '"build"' package.json; then
                                echo "    🏗️  Building..."
                                npm run build --silent
                                
                                if [ $? -eq 0 ] && [ -d "dist" ]; then
                                    echo "  ✅ Successfully built: $dep_component/$dep_version"
                                else
                                    echo "  ❌ Failed to build: $dep_component/$dep_version"
                                fi
                            else
                                echo "  ⚠️  No build script found for: $dep_component/$dep_version"
                            fi
                        else
                            echo "  ✅ Dependency already built: $dep_component/$dep_version"
                        fi
                    else
                        echo "  ⚠️  Dependency path not found: $dep_path"
                    fi
                fi
            done
        done
    fi
}

# Find project root
PROJECT_ROOT=$(find_project_root)
if [ -z "$PROJECT_ROOT" ]; then
    echo "❌ Error: Not in a Web4Articles project directory"
    echo "💡 Please run from within the Web4Articles git repository"
    exit 1
fi

export PROJECT_ROOT

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

# Find the CLI in the components directory structure
COMPONENT_VERSION="0.1.4.0"
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
  
  # First, analyze and build dependencies
  find_and_build_dependencies "$COMPONENT_DIR" "$PROJECT_ROOT"
  
  # Now build the main component
  cd "$COMPONENT_DIR"
  
  # Install dependencies if needed
  if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install --silent
  fi
  
  # Build the project
  echo "🏗️  Building component..."
  if ! npm run build --silent; then
    echo "❌ Build failed for Web4Requirement v$COMPONENT_VERSION"
    echo "🔍 Check the build output above for errors"
    exit 1
  fi
  
  if [ ! -f "$CLI_PATH" ]; then
    echo "❌ CLI still not found at: $CLI_PATH after build"
    echo "📁 Contents of dist/ts/layer5/:"
    ls -la "$COMPONENT_DIR/dist/ts/layer5/" 2>/dev/null || echo "Directory not found"
    exit 1
  fi
  
  echo "✅ Successfully built Web4Requirement v$COMPONENT_VERSION"
fi

# Check for Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is required but not installed"
    exit 1
fi

# Execute the CLI with context info and all arguments
cd "$CURRENT_DIR"
DIRECTORY_CONTEXT="$CONTEXT_INFO" node "$CLI_PATH" "$@"