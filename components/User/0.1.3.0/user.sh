#!/bin/bash

# Web4 User CLI Tool - Location Resilient Version
# Works from any directory, finds project root via git

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

# Show usage if no parameters provided
if [ $# -eq 0 ]; then
    echo "Web4 User CLI Tool"
    echo ""
    echo "Usage:"
    echo "  user create \"username\" [hostname]               # Create a new user scenario"
    echo "  user get \"username\"                            # Get user UUID and details"
    echo "  user fix-scenario <scenario-file>               # Fix owner UUID in scenario file"
    echo "  user fix-scenarios --all                        # Fix owner UUIDs in all scenario files"
    echo "  user list                                        # List all user scenarios"
    echo ""
    echo "Commands:"
    echo "  create      Create a new user scenario with deterministic UUID"
    echo "  get         Get consistent UUID and details for a username"
    echo "  fix-scenario Fix owner UUID in a specific scenario file"
    echo "  fix-scenarios Fix owner UUIDs in multiple scenario files"
    echo "  list        List all existing user scenarios"
    echo ""
    echo "Examples:"
    echo "  user create \"donges\" \"localhost\""
    echo "  user get \"donges\""
    echo "  user fix-scenario ../scenarios/index/a/b/c/d/e/file.scenario.json"
    echo "  user fix-scenarios --all"
    echo ""
    echo "User UUID Information:"
    echo "  User \"donges\" always gets UUID: 7e65139d-38cf-4f34-b769-0a86dd3a94e3"
    echo "  UUIDs are deterministic based on username for consistency"
    echo ""
    echo "📍 Current directory: $CURRENT_DIR"
    echo "📂 Project root: $PROJECT_ROOT"
    exit 0
fi

# Try multiple locations for the User CLI
CLI_LOCATIONS=(
    "$PROJECT_ROOT/components/User/0.1.3.0/dist/ts/layer5/UserCLI.js"
    "$PROJECT_ROOT/components/User/latest/dist/ts/layer5/UserCLI.js"
    "$PROJECT_ROOT/components/User/0.1.3.0/dist/ts/UserCLI.js"
)

CLI_PATH=""
for location in "${CLI_LOCATIONS[@]}"; do
    if [ -f "$location" ]; then
        CLI_PATH="$location"
        break
    fi
done

# Handle commands that can work with the User component directly
case "$1" in
    "get")
        if [ -z "$2" ]; then
            echo "❌ Error: get command requires username"
            echo "Usage: user get \"username\""
            exit 1
        fi
        
        USERNAME="$2"
        echo "🔍 Getting user information for: $USERNAME"
        
        # Use Node.js to get user UUID directly
        node -e "
        import { DefaultUser } from '$PROJECT_ROOT/components/User/0.1.3.0/dist/ts/layer2/DefaultUser.js';
        const user = new DefaultUser('$USERNAME');
        console.log('✅ User Information:');
        console.log('👤 Username:', user.username);
        console.log('🏠 Hostname:', user.hostname);
        console.log('🆔 Consistent UUID:', user.uuid);
        console.log('');
        console.log('📋 This UUID will be used for all scenarios created by this user');
        " --input-type=module
        exit 0
        ;;
    "fix-scenario")
        if [ -z "$2" ]; then
            echo "❌ Error: fix-scenario command requires scenario file path"
            echo "Usage: user fix-scenario <scenario-file-path>"
            exit 1
        fi
        
        SCENARIO_FILE="$2"
        echo "🔧 Fixing owner UUID in scenario: $(basename "$SCENARIO_FILE")"
        
        # Use the CLI tool
        node "$PROJECT_ROOT/components/User/0.1.3.0/fix-scenario-uuids.js" "$SCENARIO_FILE"
        exit $?
        ;;
    "fix-scenarios")
        if [ "$2" == "--all" ]; then
            echo "🔧 Fixing owner UUIDs in all scenario files"
            node "$PROJECT_ROOT/components/User/0.1.3.0/fix-scenario-uuids.js" --all
            exit $?
        else
            echo "❌ Error: fix-scenarios requires --all flag"
            echo "Usage: user fix-scenarios --all"
            exit 1
        fi
        ;;
    "list")
        echo "📋 Listing user scenarios:"
        if [ -d "$PROJECT_ROOT/components/User/0.1.3.0/scenarios" ]; then
            find "$PROJECT_ROOT/components/User/0.1.3.0/scenarios" -name "*.scenario.json" -type f | while read scenario_file; do
                if [ -f "$scenario_file" ]; then
                    filename=$(basename "$scenario_file" .scenario.json)
                    echo "👤 User scenario: $filename"
                    # Try to extract username from the scenario
                    if command -v node >/dev/null 2>&1; then
                        username=$(node -e "
                        try {
                            const fs = require('fs');
                            const scenario = JSON.parse(fs.readFileSync('$scenario_file', 'utf-8'));
                            if (scenario.model && scenario.model.username) {
                                console.log(scenario.model.username);
                            } else {
                                console.log('unknown');
                            }
                        } catch (e) {
                            console.log('unknown');
                        }
                        ")
                        echo "   Username: $username"
                    fi
                fi
            done
        else
            echo "No user scenarios directory found"
        fi
        exit 0
        ;;
esac

if [ -z "$CLI_PATH" ]; then
    echo "❌ User CLI not found in any expected location"
    echo "🔍 Searched locations:"
    for location in "${CLI_LOCATIONS[@]}"; do
        echo "   - $location"
    done
    echo ""
    echo "🔧 To fix this, from project root ($PROJECT_ROOT):"
    echo "   1. cd components/User/0.1.3.0"
    echo "   2. npm install"
    echo "   3. npm run build"
    echo ""
    echo "📍 Current directory: $CURRENT_DIR"
    echo "📂 Project root: $PROJECT_ROOT"
    echo "💡 Note: User component provides deterministic UUID generation and scenario fixing"
    echo "    Available methods: create user scenarios, fix owner UUIDs, get user info"
    exit 1
fi

# Check for Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Error: Node.js is required but not installed"
    exit 1
fi

# Execute the CLI with context info and all arguments
export DIRECTORY_CONTEXT="$CONTEXT_INFO"
node "$CLI_PATH" "$@"
