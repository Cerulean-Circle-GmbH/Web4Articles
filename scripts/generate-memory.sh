#!/bin/bash
# Memory Generation Script for Web4Articles
# Version: 1.0
# Purpose: Generate comprehensive memory.md from project markdown files

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
MEMORY_FILE="$WORKSPACE_ROOT/memory.md"
TEMP_DIR="/tmp/memory-generation-$$"
MAX_GENERATION_TIME=30

echo -e "${BLUE}🧠 Memory Generation Script v1.0${NC}"
echo -e "${BLUE}===========================================${NC}"

# Create temp directory
mkdir -p "$TEMP_DIR"
cd "$WORKSPACE_ROOT"

# Start timer
START_TIME=$(date +%s)

# Core files to always include
declare -a CORE_FILES=(
    "README.md"
    "index.md"
    "scrum.pmo/roles/_shared/PDCA/howto.PDCA.md"
    "scrum.pmo/roles/_shared/PDCA/template.md"
    "scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md"
)

# Additional file patterns to discover
declare -a DISCOVERY_PATTERNS=(
    "scrum.pmo/roles/*/process.md"
    "docs/*.md"
    "recovery.md"
)

# File tracking
declare -A PROCESSED_FILES
declare -a ALL_FOUND_FILES

echo -e "${YELLOW}📋 Step 1: Discovering core files...${NC}"

# Function to check if file exists and add to processing queue
check_and_add_file() {
    local file="$1"
    local full_path="$WORKSPACE_ROOT/$file"
    
    if [[ -f "$full_path" ]]; then
        if [[ -z "${PROCESSED_FILES[$file]:-}" ]]; then
            PROCESSED_FILES["$file"]=1
            ALL_FOUND_FILES+=("$file")
            echo "  ✅ Found: $file"
        fi
    else
        echo "  ⚠️  Missing: $file"
    fi
}

# Process core files
for file in "${CORE_FILES[@]}"; do
    check_and_add_file "$file"
done

echo -e "${YELLOW}📋 Step 1.5: Discovering additional files via patterns...${NC}"

# Process discovery patterns
for pattern in "${DISCOVERY_PATTERNS[@]}"; do
    while IFS= read -r -d '' file; do
        # Convert absolute path to relative
        rel_file="${file#$WORKSPACE_ROOT/}"
        check_and_add_file "$rel_file"
    done < <(find "$WORKSPACE_ROOT" -path "$WORKSPACE_ROOT/$pattern" -print0 2>/dev/null)
done

echo -e "${YELLOW}📋 Step 2: Following markdown links recursively...${NC}"

# Function to extract markdown links from a file
extract_links() {
    local file="$1"
    local full_path="$WORKSPACE_ROOT/$file"
    
    if [[ ! -f "$full_path" ]]; then
        return
    fi
    
    # Extract markdown links: [text](path.md) and [text](./path.md)
    # Also handle relative paths and clean them up
    grep -oE '\[.*\]\([^)]*\.md[^)]*\)' "$full_path" 2>/dev/null | \
    sed -E 's/.*\(([^)]*\.md[^)]*)\).*/\1/' | \
    while read -r link; do
        # Clean up the link
        clean_link=$(echo "$link" | sed 's/#.*//' | sed 's/^.\///')
        
        # Convert relative paths to absolute from workspace root
        if [[ "$clean_link" == ../* ]]; then
            # Handle ../ relative paths
            dir=$(dirname "$file")
            while [[ "$clean_link" == ../* ]]; do
                clean_link="${clean_link#../}"
                dir=$(dirname "$dir")
                if [[ "$dir" == "." ]]; then
                    dir=""
                fi
            done
            if [[ -n "$dir" ]]; then
                clean_link="$dir/$clean_link"
            fi
        elif [[ "$clean_link" == ./* ]]; then
            # Handle ./ relative paths
            dir=$(dirname "$file")
            clean_link="${clean_link#./}"
            if [[ "$dir" != "." ]]; then
                clean_link="$dir/$clean_link"
            fi
        elif [[ "$clean_link" != /* ]] && [[ "$clean_link" != http* ]]; then
            # Handle relative paths without ./
            dir=$(dirname "$file")
            if [[ "$dir" != "." ]]; then
                clean_link="$dir/$clean_link"
            fi
        fi
        
        # Only process .md files that exist
        if [[ "$clean_link" == *.md ]] && [[ -f "$WORKSPACE_ROOT/$clean_link" ]]; then
            check_and_add_file "$clean_link"
        fi
    done
}

# Recursive link following with depth tracking
MAX_DEPTH=3  # Reduced from 10 to avoid infinite loops
CURRENT_DEPTH=0

while [[ $CURRENT_DEPTH -lt $MAX_DEPTH ]]; do
    CURRENT_COUNT=${#ALL_FOUND_FILES[@]}
    
    echo "  🔍 Processing depth $CURRENT_DEPTH with ${#ALL_FOUND_FILES[@]} files..."
    
    # Process all currently known files for new links
    # Create a copy of the array to avoid modification during iteration
    files_to_process=("${ALL_FOUND_FILES[@]}")
    
    for file in "${files_to_process[@]}"; do
        echo "    📄 Processing: $file"
        extract_links "$file"
    done
    
    NEW_COUNT=${#ALL_FOUND_FILES[@]}
    
    echo "  📊 Depth $CURRENT_DEPTH: Found $NEW_COUNT total files (added $((NEW_COUNT - CURRENT_COUNT)))"
    
    # If no new files found, stop
    if [[ $NEW_COUNT -eq $CURRENT_COUNT ]]; then
        echo "  🏁 No new files found, stopping recursion"
        break
    fi
    
    ((CURRENT_DEPTH++))
done

echo -e "${YELLOW}📋 Step 3: Applying KISS + DRY deduplication...${NC}"

# Sort files for consistent processing
IFS=$'\n' ALL_FOUND_FILES=($(sort <<<"${ALL_FOUND_FILES[*]}"))
unset IFS

echo "  📊 Total unique files discovered: ${#ALL_FOUND_FILES[@]}"

# Categorize files
PROCESS_FILES=()
ROLE_FILES=()
SPRINT_FILES=()
DOC_FILES=()
SPEC_FILES=()

for file in "${ALL_FOUND_FILES[@]}"; do
    case "$file" in
        scrum.pmo/roles/*/process.md)
            ROLE_FILES+=("$file")
            ;;
        scrum.pmo/sprints/*/planning.md)
            SPRINT_FILES+=("$file")
            ;;
        scrum.pmo/roles/_shared/PDCA/*)
            PROCESS_FILES+=("$file")
            ;;
        docs/*)
            DOC_FILES+=("$file")
            ;;
        spec/*)
            SPEC_FILES+=("$file")
            ;;
        README.md|index.md|recovery.md)
            PROCESS_FILES+=("$file")
            ;;
    esac
done

echo "  📋 Process files: ${#PROCESS_FILES[@]}"
echo "  👥 Role files: ${#ROLE_FILES[@]}"
echo "  🏃 Sprint files: ${#SPRINT_FILES[@]}"
echo "  📖 Documentation files: ${#DOC_FILES[@]}"
echo "  📋 Specification files: ${#SPEC_FILES[@]}"

echo -e "${YELLOW}📋 Step 4: Generating memory.md structure...${NC}"

# Generate memory.md content
cat > "$MEMORY_FILE" << 'EOF'
# Agent Context Memory
**Last Updated:** $(date -u +"%Y-%m-%d-UTC-%H%M")
**Version:** 1.0
**Generated By:** Memory Generation Script
**Files Crawled:** TOTAL_FILES_PLACEHOLDER markdown files
**Deduplication Applied:** KISS + DRY rules

---

## Project Overview

**Web4Articles** is a DAPP (Decentralized Application) for collective intelligence in article writing. The project implements a comprehensive Web4 methodology with structured development processes, PDCA (Plan-Do-Check-Act) cycles, and multi-agent coordination.

### Core Philosophy
- **"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** - Collaborative intelligence principle
- **CMMI Level 4** process compliance with systematic improvement
- **DRY (Don't Repeat Yourself)** - No duplication of logic, documentation, or code
- **KISS (Keep It Simple, Stupid)** - Simple, clear solutions over complexity

---

## Process Framework

### PDCA System (Plan-Do-Check-Act)
**Template Version:** 3.1.4.2
**Location:** `scrum.pmo/roles/_shared/PDCA/template.md`

#### Mandatory 6-Section Format:
1. **Strict Header** - UTC timestamp, agent info, branch, sync requirements
2. **Summary with Dual Links** - GitHub | local paths, QA decisions, TRON feedback
3. **Horizontal Separators** - Between all sections
4. **QA Feedback in Check** - Verbatim quotes with UTC timestamps
5. **Emotional Reflection** - Personal growth and journey aspects
6. **PDCA Process Update** - Learning and quality impact

#### Critical Requirements:
- **Dual Link Format:** `[GitHub](URL) | [local/path](path)`
- **Verbatim TRON Quotes:** Never paraphrase user feedback
- **UTC Timestamps:** All dates in YYYY-MM-DD-UTC-HHMM format
- **Immediate Commit & Push:** After every PDCA creation

### Agent Roles & Responsibilities

AGENT_ROLES_PLACEHOLDER

---

## Current State

CURRENT_STATE_PLACEHOLDER

### Project Structure
```
Web4Articles/
├── components/          # Web4 components (TSRanger, Unit, etc.)
├── scrum.pmo/          # Project management office
│   ├── roles/          # Agent role definitions
│   ├── sprints/        # Sprint planning and tasks
│   └── project.journal/ # Session documentation
├── docs/               # Technical documentation
├── scripts/            # Automation and utilities
└── spec/               # Requirements and specifications
```

---

## Technical Context

### Technology Stack
- **Testing:** Vitest (Jest banned), ESM-native, TypeScript-first
- **Architecture:** 5-layer component structure, strict OOP
- **Tools:** Docker, PlantUML, Graphviz, GitHub CLI
- **Patterns:** Web4 constructor pattern, scenario hibernation, IOR references

### Web4 Methodology
- **Empty Constructors:** All objects use `constructor() {}`
- **Scenario Initialization:** Objects initialize from serialized scenarios
- **IOR System:** Internet Object Reference for distributed objects
- **Hibernation:** Complete object state serialization/restoration

### Key Components
KEY_COMPONENTS_PLACEHOLDER

---

## Decision Framework

### QA Decision Format
```markdown
### **QA Decisions**
- [x] Completed decision: [Description]
- [ ] **Decision 1:** [Clear title]
  - a) [Option with rationale]
  - b) [Option with rationale]
- [ ] **Decision 2:** [Another decision]
  - a) [Option A with consequences]
  - b) [Option B with consequences]
```

### When to Present Decisions
- **Real Risk Exists:** Destructive operations, data loss potential
- **Multiple Valid Approaches:** Different implementation strategies
- **Ambiguous Requirements:** Unclear user instructions
- **Significant Impact:** Architecture, long-term maintenance

### When NOT to Present Decisions
- **User Already Decided:** Clear, unambiguous instructions
- **No Real Risk:** Read-only operations, standard procedures
- **Only One Sensible Option:** Industry standards, project conventions
- **Fake Opposites:** "Do it" vs "Don't do it"

---

## Key Files & Links

### Core Process Files
KEY_PROCESS_FILES_PLACEHOLDER

### Role Process Files
ROLE_PROCESS_FILES_PLACEHOLDER

### Current Sprint
CURRENT_SPRINT_PLACEHOLDER

### Technical Documentation
TECHNICAL_DOCS_PLACEHOLDER

---

## Agent Startup Process

### Identity First Protocol
1. **Run Identity Check:** `./scripts/agent-identity-first-startup.sh`
2. **Verify RequestID:** Check Cursor UI or environment variable
3. **Read Identity Record:** `scrum.pmo/agents/registry/[REQUEST-ID].md`
4. **Follow Role Process:** Read appropriate process.md file

### Session Initialization
1. **Create Session Directory:** `scrum.pmo/project.journal/$(date -u +"%Y-%m-%d-UTC-%H%M")-session`
2. **Create Project Status:** Document current state
3. **Create Dev Branch:** `dev/$(date -u +"%Y-%m-%d-UTC-%H%M")`
4. **Create Session Start PDCA:** Document intentions and decisions

### Standard Startup Decisions
- **Decision 1: Primary Work Focus Area** (Technical/Architecture/Documentation/Quality)
- **Decision 2: Role Selection for Session** (Current role or switch)
- **Decision 3: Session Duration and Sprint Planning** (Full day/Half day/Quick analysis/Extended)

---

## Quality Standards

### Code Quality
- **Testing:** Vitest only, comprehensive coverage, non-interactive tests
- **Architecture:** 5-layer structure, strict OOP, DRY principles
- **Documentation:** Dual links, verbatim quotes, UTC timestamps
- **Process:** PDCA for all significant work, immediate commit/push

### Process Compliance
- **CMMI Level 4:** Systematic process improvement
- **Traceability:** Complete artifact linking and version control
- **Collaboration:** Multi-agent coordination with role switching
- **Learning:** Continuous improvement through PDCA cycles

---

## Communication Protocol

### Chat Responses
- **Detailed content in PDCAs** - NOT in chat
- **Dual links and decisions ONLY** in chat
- **Copy QA decisions EXACTLY** from PDCA to chat
- **Never create different decisions** in chat vs PDCA

### PDCA Requirements
- **Immediate commit and push** after creation
- **Dual links** for all artifacts
- **Verbatim TRON quotes** with UTC timestamps
- **Complete 6-section format** compliance

---

## Quick Reference Commands

### Identity & Startup
```bash
# Start every session
./scripts/agent-identity-first-startup.sh

# Check current branch
git branch --show-current

# Create session directory
mkdir -p scrum.pmo/project.journal/$(date -u +"%Y-%m-%d-UTC-%H%M")-session
```

### PDCA Creation
```bash
# Use template from
scrum.pmo/roles/_shared/PDCA/template.md

# Commit and push immediately
git add -A
git commit -m "PDCA: [Title from PDCA header]"
git push origin [branch]
```

### Testing
```bash
# Run tests (Vitest only)
npm test

# TSRanger testing (non-interactive)
components/TSRanger/v2.2/sh/tsranger test '[down]'
components/TSRanger/v2.2/sh/tsranger test 'g[tab]'
```

### Architecture
```bash
# Render PUML diagrams
plantuml -tsvg src/puml/*.puml

# Check specific diagram
plantuml -tsvg -failfast2 -v src/puml/<diagram>.puml
```

---

## Memory Maintenance

### Update Triggers
- Agent startup
- Key file modifications
- New PDCA creation
- Sprint changes
- Role assignments

### Deduplication Rules
- **One entry per file** - Each markdown file appears once
- **Latest version wins** - Use most recent if multiple versions
- **Consolidate similar content** - Merge related information
- **Reference, don't repeat** - Link to sources instead of duplicating

---

**🎯 This memory.md provides comprehensive context for all agent operations, ensuring consistent understanding and process compliance across all roles and sessions.**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨
EOF

# Replace placeholders with actual content
sed -i "s/TOTAL_FILES_PLACEHOLDER/${#ALL_FOUND_FILES[@]}/g" "$MEMORY_FILE"

# Generate role information
{
    echo ""
    for file in "${ROLE_FILES[@]}"; do
        role_name=$(basename "$(dirname "$file")")
        echo "#### $role_name"
        
        # Extract purpose from the file if available
        if grep -q "Purpose:" "$file" 2>/dev/null; then
            purpose=$(grep "Purpose:" "$file" | head -1 | sed 's/.*Purpose: */- **Purpose:** /')
            echo "$purpose"
        fi
        
        # Extract key responsibilities
        if grep -q "Key Responsibilities:" "$file" 2>/dev/null; then
            echo "- **Key Tasks:** $(grep -A 3 "Key Responsibilities:" "$file" | tail -3 | tr '\n' ' ' | sed 's/- //g')"
        fi
        
        echo ""
    done
} > "$TEMP_DIR/agent_roles.txt"

# Generate current state info
{
    echo "### Active Sprint Information"
    
    # Find the latest sprint
    latest_sprint=$(find scrum.pmo/sprints -name "planning.md" | sort | tail -1)
    if [[ -n "$latest_sprint" ]]; then
        sprint_name=$(basename "$(dirname "$latest_sprint")")
        echo "**Current Sprint:** $sprint_name"
        
        # Extract sprint goal if available
        if grep -q "Sprint Goal:" "$latest_sprint" 2>/dev/null; then
            goal=$(grep "Sprint Goal:" "$latest_sprint" | head -1 | sed 's/.*Sprint Goal: *//')
            echo "**Goal:** $goal"
        fi
    fi
} > "$TEMP_DIR/current_state.txt"

# Generate file lists
{
    echo ""
    for file in "${PROCESS_FILES[@]}"; do
        echo "- **$(basename "$file")** - $(dirname "$file" | sed 's|scrum.pmo/roles/_shared/PDCA/||' | sed 's|^.*||')"
    done
} > "$TEMP_DIR/process_files.txt"

{
    echo ""
    for file in "${ROLE_FILES[@]}"; do
        role_name=$(basename "$(dirname "$file")")
        echo "- **scrum.pmo/roles/$role_name/process.md** - $role_name process guide"
    done
} > "$TEMP_DIR/role_files.txt"

# Apply content replacements
sed -i "/AGENT_ROLES_PLACEHOLDER/r $TEMP_DIR/agent_roles.txt" "$MEMORY_FILE"
sed -i "s/AGENT_ROLES_PLACEHOLDER//" "$MEMORY_FILE"

sed -i "/CURRENT_STATE_PLACEHOLDER/r $TEMP_DIR/current_state.txt" "$MEMORY_FILE"
sed -i "s/CURRENT_STATE_PLACEHOLDER//" "$MEMORY_FILE"

sed -i "/KEY_PROCESS_FILES_PLACEHOLDER/r $TEMP_DIR/process_files.txt" "$MEMORY_FILE"
sed -i "s/KEY_PROCESS_FILES_PLACEHOLDER//" "$MEMORY_FILE"

sed -i "/ROLE_PROCESS_FILES_PLACEHOLDER/r $TEMP_DIR/role_files.txt" "$MEMORY_FILE"
sed -i "s/ROLE_PROCESS_FILES_PLACEHOLDER//" "$MEMORY_FILE"

# Replace remaining placeholders with default content
sed -i "s/KEY_COMPONENTS_PLACEHOLDER/- **TSRanger:** Interactive shell with completion and navigation\n- **Web4 Components:** Various project components in components\/ directory/" "$MEMORY_FILE"
sed -i "s/CURRENT_SPRINT_PLACEHOLDER/- Check latest sprint in scrum.pmo\/sprints\/ directory/" "$MEMORY_FILE"
sed -i "s/TECHNICAL_DOCS_PLACEHOLDER/- **docs\/** - Technical documentation directory\n- **recovery.md** - Recovery procedures/" "$MEMORY_FILE"

# Clean up timestamp format
sed -i "s/\$(date -u +\"%Y-%m-%d-UTC-%H%M\")/$(date -u +"%Y-%m-%d-UTC-%H%M")/g" "$MEMORY_FILE"

# Calculate generation time
END_TIME=$(date +%s)
GENERATION_TIME=$((END_TIME - START_TIME))

echo -e "${GREEN}✅ Memory generation completed!${NC}"
echo -e "${GREEN}📊 Statistics:${NC}"
echo "  📁 Files processed: ${#ALL_FOUND_FILES[@]}"
echo "  ⏱️  Generation time: ${GENERATION_TIME}s"
echo "  📄 Output file: $MEMORY_FILE"

# Validate generation time
if [[ $GENERATION_TIME -gt $MAX_GENERATION_TIME ]]; then
    echo -e "${YELLOW}⚠️  Warning: Generation took ${GENERATION_TIME}s (target: <${MAX_GENERATION_TIME}s)${NC}"
else
    echo -e "${GREEN}✅ Generation time within target (<${MAX_GENERATION_TIME}s)${NC}"
fi

# Check file size
if [[ -f "$MEMORY_FILE" ]]; then
    size=$(wc -c < "$MEMORY_FILE")
    echo "  📏 File size: $size bytes"
    
    # Estimate token count (rough approximation)
    words=$(wc -w < "$MEMORY_FILE")
    estimated_tokens=$((words * 140 / 100))  # 1.4 tokens per word estimate
    echo "  🎯 Estimated tokens: $estimated_tokens"
    
    if [[ $estimated_tokens -gt 5000 ]]; then
        echo -e "${YELLOW}⚠️  Warning: Estimated tokens ($estimated_tokens) exceed 5,000 target${NC}"
    else
        echo -e "${GREEN}✅ Token count within target (<5,000)${NC}"
    fi
fi

# Clean up
rm -rf "$TEMP_DIR"

echo -e "${BLUE}🎯 Memory generation script completed successfully!${NC}"
