#!/bin/bash
# Memory Generation Script - Comprehensive Agent Context
# Purpose: Create memory.md with complete essential information (like MCP memory server)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
MEMORY_FILE="$WORKSPACE_ROOT/memory.md"
CONFIG_FILE="$WORKSPACE_ROOT/scripts/memory-crawl-rules.json"
MEMORY_TRACKER="$WORKSPACE_ROOT/.memory-tracker"
MEMORY_VERSIONS="$WORKSPACE_ROOT/.memory-versions"

# Incremental update settings
ENABLE_INCREMENTAL=true
FORCE_FULL_REGENERATION=${FORCE_FULL:-false}

echo -e "${BLUE}🧠 Memory Generation Script v4.1 (Performance Optimized)${NC}"
echo -e "${BLUE}====================================${NC}"
echo -e "${YELLOW}Purpose: Comprehensive agent context (MCP-style)${NC}"

cd "$WORKSPACE_ROOT"
START_TIME=$(date +%s)

# ========================================
# INCREMENTAL UPDATE FUNCTIONS
# ========================================

# Initialize or load file tracker
init_file_tracker() {
    if [[ ! -f "$MEMORY_TRACKER" ]]; then
        echo "# Memory File Tracker - Modification Times" > "$MEMORY_TRACKER"
        echo "# Format: filepath:mtime:size" >> "$MEMORY_TRACKER"
        echo -e "${YELLOW}📊 Initializing file tracker...${NC}"
    fi
}

# Check if file has changed since last memory generation
file_has_changed() {
    local file="$1"
    local current_mtime current_size
    
    if [[ ! -f "$file" ]]; then
        return 0  # File doesn't exist, consider it changed
    fi
    
    current_mtime=$(stat -c %Y "$file" 2>/dev/null || echo "0")
    current_size=$(stat -c %s "$file" 2>/dev/null || echo "0")
    
    # Check if file is tracked
    if grep -q "^$file:" "$MEMORY_TRACKER" 2>/dev/null; then
        local tracked_info=$(grep "^$file:" "$MEMORY_TRACKER")
        local tracked_mtime=$(echo "$tracked_info" | cut -d: -f2)
        local tracked_size=$(echo "$tracked_info" | cut -d: -f3)
        
        if [[ "$current_mtime" != "$tracked_mtime" ]] || [[ "$current_size" != "$tracked_size" ]]; then
            return 0  # File has changed
        else
            return 1  # File unchanged
        fi
    else
        return 0  # File not tracked, consider it changed
    fi
}

# Update file tracker with current file state
update_file_tracker() {
    local file="$1"
    local current_mtime current_size
    
    if [[ ! -f "$file" ]]; then
        return
    fi
    
    current_mtime=$(stat -c %Y "$file" 2>/dev/null || echo "0")
    current_size=$(stat -c %s "$file" 2>/dev/null || echo "0")
    
    # Remove old entry if exists
    grep -v "^$file:" "$MEMORY_TRACKER" > "$MEMORY_TRACKER.tmp" 2>/dev/null || touch "$MEMORY_TRACKER.tmp"
    
    # Add new entry
    echo "$file:$current_mtime:$current_size" >> "$MEMORY_TRACKER.tmp"
    
    mv "$MEMORY_TRACKER.tmp" "$MEMORY_TRACKER"
}

# Create memory version entry
create_memory_version() {
    local version_info="$1"
    local timestamp=$(date -u +"%Y-%m-%d-UTC-%H%M")
    
    # Create versions directory if it doesn't exist
    mkdir -p "$MEMORY_VERSIONS"
    
    # Backup current memory
    if [[ -f "$MEMORY_FILE" ]]; then
        cp "$MEMORY_FILE" "$MEMORY_VERSIONS/memory-$timestamp.md"
    fi
    
    # Create version log entry
    echo "[$timestamp] $version_info" >> "$MEMORY_VERSIONS/version-log.txt"
    echo -e "${BLUE}📚 Memory version created: $timestamp${NC}"
}

# Check if incremental update is needed - OPTIMIZED
check_incremental_update_needed() {
    local changed_files=0
    local total_files=0
    local priority_changed=false
    
    echo -e "${YELLOW}🔍 Checking for file changes since last memory generation...${NC}"
    
    # Check if memory file exists and is recent
    if [[ ! -f "$MEMORY_FILE" ]]; then
        echo -e "${YELLOW}📋 Memory file doesn't exist, full generation needed${NC}"
        return 0  # Full generation needed
    fi
    
    # Priority check: full include files first (most important)
    for file in "${FULL_INCLUDE_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            total_files=$((total_files + 1))
            if file_has_changed "$file"; then
                changed_files=$((changed_files + 1))
                priority_changed=true
                echo -e "${RED}  🔥 Priority file changed: $file${NC}"
            fi
        fi
    done
    
    # If priority files changed, we need full regeneration
    if [[ "$priority_changed" == "true" ]]; then
        echo -e "${RED}🚨 Critical files changed, full regeneration required${NC}"
        echo -e "${BLUE}📊 File Change Summary: $changed_files/$total_files files changed (priority files affected)${NC}"
        return 0  # Full generation needed
    fi
    
    # Check other discovered files only if no priority changes
    for file in "${ALL_MD_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            # Skip if already checked as full include file
            skip_file=false
            for full_file in "${FULL_INCLUDE_FILES[@]}"; do
                if [[ "$file" == "$full_file" ]]; then
                    skip_file=true
                    break
                fi
            done
            
            if [[ "$skip_file" == "false" ]]; then
                total_files=$((total_files + 1))
                if file_has_changed "$file"; then
                    changed_files=$((changed_files + 1))
                    echo -e "${YELLOW}  📝 Changed: $file${NC}"
                fi
            fi
        fi
    done
    
    echo -e "${BLUE}📊 File Change Summary: $changed_files/$total_files files changed${NC}"
    
    if [[ $changed_files -eq 0 ]] && [[ "$FORCE_FULL_REGENERATION" != "true" ]]; then
        echo -e "${GREEN}✅ No changes detected, memory is current${NC}"
        return 1  # No update needed
    else
        echo -e "${YELLOW}🔄 Changes detected, memory update needed${NC}"
        return 0  # Update needed
    fi
}

# Update file tracker for all processed files
update_all_file_trackers() {
    echo -e "${YELLOW}📊 Updating file modification tracker...${NC}"
    
    # Update core files
    for file in "${CORE_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            update_file_tracker "$file"
        fi
    done
    
    # Update discovered files
    for file in "${ALL_MD_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            update_file_tracker "$file"
        fi
    done
    
    echo -e "${GREEN}✅ File tracker updated${NC}"
}

# ========================================
# CONFIGURATION LOADING FUNCTIONS
# ========================================

# Load file categories from configuration
load_file_categories() {
    echo -e "${YELLOW}📂 Loading file categories from configuration...${NC}"
    
    # Load full include files
    FULL_INCLUDE_FILES=($(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
if 'full_include_files' in config:
    for file in config['full_include_files']['files']:
        print(file)
"))
    
    # Load smart extract patterns
    SMART_EXTRACT_PATTERNS=($(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
if 'smart_extract_files' in config:
    for pattern in config['smart_extract_files']['patterns']:
        print(pattern)
"))
    
    # Load summary only patterns
    SUMMARY_ONLY_PATTERNS=($(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
if 'summary_only_files' in config:
    for pattern in config['summary_only_files']['patterns']:
        print(pattern)
"))
    
    echo "  📊 Loaded ${#FULL_INCLUDE_FILES[@]} full include files"
    echo "  📊 Loaded ${#SMART_EXTRACT_PATTERNS[@]} smart extract patterns"
    echo "  📊 Loaded ${#SUMMARY_ONLY_PATTERNS[@]} summary only patterns"
}

# Categorize a file based on configuration
categorize_file() {
    local file="$1"
    
    # Check if it's a full include file
    for full_file in "${FULL_INCLUDE_FILES[@]}"; do
        if [[ "$file" == "$full_file" ]]; then
            echo "full_include"
            return
        fi
    done
    
    # Check if it matches smart extract patterns
    for pattern in "${SMART_EXTRACT_PATTERNS[@]}"; do
        if [[ "$file" == $pattern ]]; then
            echo "smart_extract"
            return
        fi
    done
    
    # Check if it matches summary only patterns  
    for pattern in "${SUMMARY_ONLY_PATTERNS[@]}"; do
        if [[ "$file" == $pattern ]]; then
            echo "summary_only"
            return
        fi
    done
    
    # Default to smart extract for uncategorized files
    echo "smart_extract"
}

# ========================================
# MAIN SCRIPT EXECUTION
# ========================================

# Initialize incremental update system
init_file_tracker

# Load file categories from configuration
load_file_categories

# Discover ALL markdown files using configuration patterns
echo -e "${YELLOW}🔍 Discovering all markdown files recursively...${NC}"

ALL_MD_FILES=()

# Load discovery patterns from configuration
DISCOVERY_PATTERNS=($(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
for pattern in config['discovery_patterns']['patterns']:
    print(pattern)
"))

# Add core files
CORE_FILES=($(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
for file in config['core_files']['files']:
    print(file)
"))

# Comprehensive file discovery
for pattern in "${DISCOVERY_PATTERNS[@]}"; do
    while IFS= read -r -d '' file; do
        if [[ -f "$file" ]]; then
            ALL_MD_FILES+=("$file")
        fi
    done < <(find . -path "./$pattern" -type f -print0 2>/dev/null)
done

# Add core files
for file in "${CORE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        ALL_MD_FILES+=("$file")
    fi
done

# Remove duplicates and sort
readarray -t ALL_MD_FILES < <(printf '%s\n' "${ALL_MD_FILES[@]}" | sort -u)

echo "  📊 Discovered ${#ALL_MD_FILES[@]} markdown files for comprehensive memory"

# ========================================
# INCREMENTAL UPDATE CHECK
# ========================================

if [[ "$ENABLE_INCREMENTAL" == "true" ]]; then
    if ! check_incremental_update_needed; then
        echo -e "${GREEN}✅ Memory is current, no regeneration needed${NC}"
        echo -e "${BLUE}📊 Performance: Incremental check completed in $(($(date +%s) - START_TIME)) seconds${NC}"
        exit 0
    fi
    
    # Create version backup before regeneration
    if [[ -f "$MEMORY_FILE" ]]; then
        create_memory_version "Incremental update: $(date -u +"%Y-%m-%d %H:%M") - Files changed"
    fi
else
    echo -e "${YELLOW}🔄 Full regeneration mode (incremental disabled)${NC}"
    if [[ -f "$MEMORY_FILE" ]]; then
        create_memory_version "Full regeneration: $(date -u +"%Y-%m-%d %H:%M")"
    fi
fi

# ========================================
# ENHANCED CONTENT EXTRACTION FUNCTIONS
# ========================================

# Remove navigation elements while preserving knowledge content
remove_navigation() {
    local content="$1"
    # Remove navigation patterns from config
    echo "$content" | sed \
        -e '/^\[Back to .*\].*/d' \
        -e '/^\[.*\].*|.*\[.*\].*/d' \
        -e '/^---$/d' \
        -e '/^\[.*\](\.\.\/.*)/d'
}

# Full content extraction (for critical files) - OPTIMIZED
extract_full_content() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return
    fi
    
    echo "### Complete Content from $file"
    echo ""
    
    # Optimized single-pass navigation removal
    sed \
        -e '/^\[Back to .*\].*/d' \
        -e '/^\[.*\].*|.*\[.*\].*/d' \
        -e '/^---$/d' \
        -e '/^\[.*\](\.\.\/.*)/d' \
        "$file"
    echo ""
}

# Smart content extraction (for important files) - OPTIMIZED
extract_smart_content() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return
    fi
    
    echo "### Key Content from $file"
    echo ""
    
    # Optimized single-pass extraction with navigation removal
    awk '
        # Remove navigation patterns first
        /^\[Back to .*\].*/ { next }
        /^\[.*\].*\|.*\[.*\].*/ { next }
        /^---$/ { next }
        /^\[.*\]\(\.\.\/.*\)/ { next }
        
        # Include all headers
        /^#+/ { print; next }
        
        # Include all lists (numbered and bulleted)
        /^[0-9]+\./ { print; next }
        /^-/ { print; next }
        /^\*/ { print; next }
        
        # Include code blocks
        /^```/ { in_code=1; print; next }
        in_code==1 { print; if(/^```/) in_code=0; next }
        
        # Include process descriptions and requirements
        /Purpose|Process|Requirement|Step|Task|Goal|Objective/ { print; next }
        /MUST|SHOULD|SHALL|REQUIRED|CRITICAL|IMPORTANT/ { print; next }
        
        # Include examples and commands
        /Example|Command|Usage/ { print; next }
        
        # Skip excessive empty lines but preserve structure
        /^$/ { if(prev_empty!=1) print; prev_empty=1; next }
        { prev_empty=0; print }
    ' "$file"
    echo ""
}

# Summary extraction (for reference files) - OPTIMIZED
extract_summary_content() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return
    fi
    
    echo "### Summary from $file"
    echo ""
    
    # Optimized summary extraction with compression
    awk '
        # Remove navigation patterns
        /^\[Back to .*\].*/ { next }
        /^\[.*\].*\|.*\[.*\].*/ { next }
        /^---$/ { next }
        /^\[.*\]\(\.\.\/.*\)/ { next }
        
        # Extract headers and their context
        /^#+/ { 
            print; 
            # Get next non-empty line as summary
            while(getline && /^$/) continue;
            if(NF > 0) print;
            next
        }
        
        # Include key list items with context
        /^-.*:/ { print; next }
        /CRITICAL|IMPORTANT|REQUIRED|MUST/ { print; next }
        
        # Skip excessive content but preserve structure
        NR <= 15 { print }
    ' "$file"
    echo ""
}

# Content compression function for redundant sections
compress_redundant_content() {
    local input_file="$1"
    
    # Remove duplicate headers and consolidate similar sections
    awk '
        # Track seen headers to avoid duplication
        /^###/ {
            if (seen_headers[$0]) next
            seen_headers[$0] = 1
        }
        
        # Remove excessive empty lines
        /^$/ {
            if (prev_empty) next
            prev_empty = 1
            print
            next
        }
        
        # Reset empty line tracker and print
        { prev_empty = 0; print }
    ' "$input_file"
}

# Legacy function for compatibility
extract_essential_content() {
    local file="$1"
    local max_lines="$2"
    
    extract_smart_content "$file"
}

# Extract role definitions
extract_role_info() {
    local file="$1"
    if [[ -f "$file" ]]; then
        local role_name=$(basename "$(dirname "$file")")
        echo "#### $role_name"
        
        # Extract purpose/description
        if grep -q "Purpose:" "$file" 2>/dev/null; then
            purpose=$(grep "Purpose:" "$file" | head -1 | sed 's/.*Purpose: *//' | sed 's/\*\*//g')
            echo "- **Purpose:** $purpose"
        elif grep -q "## Purpose" "$file" 2>/dev/null; then
            purpose=$(grep -A 3 "## Purpose" "$file" | tail -3 | tr '\n' ' ' | sed 's/- //g' | sed 's/\*\*//g')
            echo "- **Purpose:** $purpose"
        elif grep -q "Role Definition" "$file" 2>/dev/null; then
            definition=$(grep -A 3 "Role Definition" "$file" | tail -2 | tr '\n' ' ' | sed 's/- //g' | sed 's/\*\*//g')
            echo "- **Purpose:** $definition"
        fi
        
        # Extract key responsibilities
        if grep -q "Responsibilities" "$file" 2>/dev/null; then
            echo "- **Key Tasks:**"
            grep -A 5 "Responsibilities" "$file" | tail -4 | grep "^-" | head -3 | sed 's/^-/  -/'
        fi
        
        echo "- **Process File:** $file"
        echo ""
    fi
}

# Start generating comprehensive memory
cat > "$MEMORY_FILE" << EOF
# Agent Context Memory - Complete Knowledge Base
**Last Updated:** $(date -u +"%Y-%m-%d-UTC-%H%M")
**Version:** 2.0 - Comprehensive Context
**Purpose:** Complete agent background knowledge (injected into every conversation)
**Usage:** This memory provides ALL essential project knowledge for immediate use

---

## Project Overview - Web4Articles

**Web4Articles** is a DAPP (Decentralized Application) for collective intelligence in article writing, implementing comprehensive Web4 methodology with structured development processes, PDCA cycles, and multi-agent coordination.

### Core Philosophy (NEVER FORGET)
- **"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** - Collaborative intelligence principle
- **CMMI Level 4** process compliance with systematic improvement
- **DRY (Don't Repeat Yourself)** - No duplication of logic, documentation, or code
- **KISS (Keep It Simple and Short)** - Simple, clear solutions over complexity

---

## CRITICAL PROCESS REQUIREMENTS

### PDCA System (MANDATORY for ALL significant work)
**Template Location:** \`scrum.pmo/roles/_shared/PDCA/template.md\` (v3.1.4.2)

#### 6 Mandatory Sections (NEVER SKIP):
1. **Strict Header** - UTC timestamp, agent info, branch, sync requirements
2. **Summary with Dual Links** - GitHub | local paths, QA decisions, TRON feedback  
3. **Horizontal Separators** - Between all sections
4. **QA Feedback in Check** - Verbatim quotes with UTC timestamps
5. **Emotional Reflection** - Personal growth and journey aspects
6. **PDCA Process Update** - Learning and quality impact

#### Critical Format Requirements:
- **Dual Link Format:** \`[GitHub](URL) | [local/path](path)\`
- **Verbatim TRON Quotes:** NEVER paraphrase user feedback
- **UTC Timestamps:** All dates in YYYY-MM-DD-UTC-HHMM format
- **Immediate Commit & Push:** After EVERY PDCA creation

### Agent Startup Protocol (REQUIRED SEQUENCE)
EOF

# Add README content
if [[ -f "README.md" ]]; then
    echo "" >> "$MEMORY_FILE"
    echo "#### From README.md - Agent Startup Steps:" >> "$MEMORY_FILE"
    grep -A 20 "When You See" README.md | head -25 >> "$MEMORY_FILE"
fi

# Add technology stack
cat >> "$MEMORY_FILE" << 'EOF'

---

## Technology Stack & Standards

### Testing & Development
- **Testing Framework:** Vitest ONLY (Jest is BANNED)
- **Architecture:** 5-layer component structure, strict OOP
- **Code Style:** ESM-native, TypeScript-first
- **Tools:** Docker, PlantUML, Graphviz, GitHub CLI

### Web4 Methodology
- **Empty Constructors:** All objects use `constructor() {}`
- **Scenario Initialization:** Objects initialize from serialized scenarios
- **IOR System:** Internet Object Reference for distributed objects
- **Hibernation:** Complete object state serialization/restoration

---

## Agent Roles & Responsibilities

EOF

# Process all discovered files for comprehensive content
echo -e "${YELLOW}📋 Processing ${#ALL_MD_FILES[@]} files for comprehensive content...${NC}"

# Add role information (prioritized)
for file in "${ALL_MD_FILES[@]}"; do
    if [[ "$file" == *"/roles/"*"/process.md" ]]; then
        extract_role_info "$file" >> "$MEMORY_FILE"
    fi
done

# Add key content sections from all other files
cat >> "$MEMORY_FILE" << 'EOF'

---

## Additional Essential Content

EOF

# ========================================
# COMPREHENSIVE CONTENT PROCESSING
# ========================================

echo -e "${YELLOW}📋 Processing files with comprehensive content inclusion...${NC}"

# Track token usage
CURRENT_TOKENS=0
TOKEN_TARGET=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
print(config.get('quality_rules', {}).get('token_target', 15000))
")

TOKEN_MAXIMUM=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
print(config.get('quality_rules', {}).get('token_maximum', 22000))
")

TOKEN_WARNING=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
print(config.get('quality_rules', {}).get('token_warning', 20000))
")

echo "  🎯 Target: $TOKEN_TARGET tokens, Maximum: $TOKEN_MAXIMUM tokens"

# Process files by category priority
echo -e "${BLUE}📚 Phase 1: Full Include Files (Critical Content)${NC}"
for file in "${FULL_INCLUDE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  📖 Including complete content: $file"
        extract_full_content "$file" >> "$MEMORY_FILE"
        
        # Check token count
        CURRENT_TOKENS=$(wc -w < "$MEMORY_FILE" 2>/dev/null || echo "0")
        ESTIMATED_TOKENS=$((CURRENT_TOKENS * 150 / 100))
        
        if [[ $ESTIMATED_TOKENS -gt $TOKEN_MAXIMUM ]]; then
            echo -e "${YELLOW}⚠️  Approaching token limit at $ESTIMATED_TOKENS tokens${NC}"
        fi
    fi
done

echo -e "${BLUE}📚 Phase 2: Smart Extract Files (Important Content)${NC}"
for file in "${ALL_MD_FILES[@]}"; do
    category=$(categorize_file "$file")
    
    if [[ "$category" == "smart_extract" ]] && [[ -f "$file" ]]; then
        # Skip if already processed as full include
        skip_file=false
        for full_file in "${FULL_INCLUDE_FILES[@]}"; do
            if [[ "$file" == "$full_file" ]]; then
                skip_file=true
                break
            fi
        done
        
        if [[ "$skip_file" == "false" ]]; then
            echo "  📝 Smart extraction: $file"
            extract_smart_content "$file" >> "$MEMORY_FILE"
            
            # Check token count
            CURRENT_TOKENS=$(wc -w < "$MEMORY_FILE" 2>/dev/null || echo "0")
            ESTIMATED_TOKENS=$((CURRENT_TOKENS * 150 / 100))
            
            if [[ $ESTIMATED_TOKENS -gt $TOKEN_MAXIMUM ]]; then
                echo -e "${RED}🚫 Token limit reached at $ESTIMATED_TOKENS tokens, stopping smart extraction${NC}"
                break
            fi
        fi
    fi
done

echo -e "${BLUE}📚 Phase 3: Summary Only Files (Reference Content)${NC}"
# Only process summary files if we have token budget remaining
CURRENT_TOKENS=$(wc -w < "$MEMORY_FILE" 2>/dev/null || echo "0")
ESTIMATED_TOKENS=$((CURRENT_TOKENS * 150 / 100))

if [[ $ESTIMATED_TOKENS -lt $TOKEN_TARGET ]]; then
    for file in "${ALL_MD_FILES[@]}"; do
        category=$(categorize_file "$file")
        
        if [[ "$category" == "summary_only" ]] && [[ -f "$file" ]]; then
            echo "  📋 Summary extraction: $file"
            extract_summary_content "$file" >> "$MEMORY_FILE"
            
            # Check token count
            CURRENT_TOKENS=$(wc -w < "$MEMORY_FILE" 2>/dev/null || echo "0")
            ESTIMATED_TOKENS=$((CURRENT_TOKENS * 150 / 100))
            
            if [[ $ESTIMATED_TOKENS -gt $TOKEN_TARGET ]]; then
                echo -e "${YELLOW}✅ Token target reached at $ESTIMATED_TOKENS tokens${NC}"
                break
            fi
        fi
    done
else
    echo -e "${YELLOW}📊 Skipping summary files - already at $ESTIMATED_TOKENS tokens${NC}"
fi

# Add current project state
cat >> "$MEMORY_FILE" << EOF

---

## Current Project State

### Branch Information
- **Current Branch:** $(git branch --show-current 2>/dev/null || echo "Unknown")
- **Latest Commit:** $(git log -1 --pretty=format:"%h - %s" 2>/dev/null || echo "Unknown")

### Active Sprint
- **Latest Sprint:** $(ls scrum.pmo/sprints/ | grep sprint | sort -V | tail -1 2>/dev/null || echo "Unknown")

### Project Structure
\`\`\`
Web4Articles/
├── components/          # Web4 components (TSRanger, Unit, etc.)
├── scrum.pmo/          # Project management office
│   ├── roles/          # Agent role definitions  
│   ├── sprints/        # Sprint planning and tasks
│   └── project.journal/ # Session documentation
├── docs/               # Technical documentation
├── scripts/            # Automation and utilities
└── spec/               # Requirements and specifications
\`\`\`

---

## Decision Framework

### QA Decision Format (REQUIRED)
\`\`\`markdown
### **QA Decisions**
- [x] Completed decision: [Description]
- [ ] **Decision 1:** [Clear title]
  - a) [Option with rationale]
  - b) [Option with rationale]
\`\`\`

### When to Present Decisions
- **Real Risk Exists:** Destructive operations, data loss potential
- **Multiple Valid Approaches:** Different implementation strategies  
- **Ambiguous Requirements:** Unclear user instructions
- **Significant Impact:** Architecture, long-term maintenance

---

## Essential Commands

### Agent Identity & Startup
\`\`\`bash
# ALWAYS start with identity check
./scripts/agent-identity-first-startup.sh

# Check current branch
git branch --show-current

# Generate/update memory
./scripts/generate-memory.sh
\`\`\`

### PDCA Workflow
\`\`\`bash
# Use template from
scrum.pmo/roles/_shared/PDCA/template.md

# ALWAYS commit and push immediately after PDCA
git add -A
git commit -m "PDCA: [Title from PDCA header]"
git push origin [branch]
\`\`\`

### Session Management
\`\`\`bash
# Create session directory
mkdir -p scrum.pmo/project.journal/\$(date -u +"%Y-%m-%d-UTC-%H%M")-session

# Create dev branch
git checkout -b dev/\$(date -u +"%Y-%m-%d-UTC-%H%M")
git push -u origin dev/\$(date -u +"%Y-%m-%d-UTC-%H%M")
\`\`\`

---

## Quality Standards (NON-NEGOTIABLE)

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

## Recovery & Troubleshooting

### Lost Context
1. Read this memory.md (you're doing it now!)
2. Follow README.md startup protocol
3. Check identity: \`./scripts/agent-identity-first-startup.sh\`
4. Read role-specific process.md file

### Process Issues
- **PDCA Problems:** Read \`scrum.pmo/roles/_shared/PDCA/howto.PDCA.md\`
- **Decision Format:** Read \`scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md\`
- **Role Confusion:** Read \`scrum.pmo/roles/[YOUR-ROLE]/process.md\`

---

**🧠 This memory contains ALL essential knowledge for effective agent operation. You now have complete project context without needing to crawl files. Use this knowledge immediately, and read specific files only for detailed implementation.**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨

EOF

# Calculate statistics
END_TIME=$(date +%s)
GENERATION_TIME=$((END_TIME - START_TIME))
FILE_SIZE=$(wc -c < "$MEMORY_FILE" 2>/dev/null || echo "0")
WORD_COUNT=$(wc -w < "$MEMORY_FILE" 2>/dev/null || echo "0")
# Estimate tokens (more conservative for comprehensive content)
TOKEN_COUNT=$((WORD_COUNT * 150 / 100))

# ========================================
# CONTENT COMPRESSION AND OPTIMIZATION
# ========================================

echo -e "${YELLOW}🗜️  Applying content compression to reduce redundancy...${NC}"

# Create temporary file for compression
TEMP_MEMORY="$MEMORY_FILE.tmp"
compress_redundant_content "$MEMORY_FILE" > "$TEMP_MEMORY"

# Replace original with compressed version
mv "$TEMP_MEMORY" "$MEMORY_FILE"

echo -e "${GREEN}✅ Content compression completed${NC}"

# Update file trackers for incremental updates
if [[ "$ENABLE_INCREMENTAL" == "true" ]]; then
    update_all_file_trackers
fi

echo -e "${GREEN}✅ Comprehensive Memory Generation Completed!${NC}"
echo -e "${GREEN}📊 Enhanced Statistics:${NC}"
echo "  📄 Output file: $MEMORY_FILE"
echo "  📏 File size: $FILE_SIZE bytes"
echo "  📝 Words: $WORD_COUNT"
echo "  🎯 Estimated tokens: $TOKEN_COUNT"
echo "  ⏱️  Generation time: ${GENERATION_TIME}s"
echo "  🔄 Incremental updates: $([ "$ENABLE_INCREMENTAL" == "true" ] && echo "enabled" || echo "disabled")"
echo "  📚 Full include files: ${#FULL_INCLUDE_FILES[@]} processed"
echo "  📋 Content strategy: Comprehensive inclusion with navigation removal"
echo "  🎯 Token target: $TOKEN_TARGET (Maximum: $TOKEN_MAXIMUM)"

if [[ $TOKEN_COUNT -gt 8000 ]]; then
    echo -e "${YELLOW}⚠️  Warning: Token count ($TOKEN_COUNT) is high - consider optimization${NC}"
else
    echo -e "${GREEN}✅ Token count acceptable for comprehensive context${NC}"
fi

# ========================================
# AUTOMATIC AI OPTIMIZATION (IF ENABLED)
# ========================================

# Check if AI optimization is enabled and token count is high
AUTO_OPTIMIZE=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
print(config.get('auto_optimization', {}).get('enabled', False))
" 2>/dev/null || echo "False")

AUTO_OPTIMIZE_THRESHOLD=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
print(config.get('auto_optimization', {}).get('token_threshold', 35000))
" 2>/dev/null || echo "35000")

if [[ "$AUTO_OPTIMIZE" == "True" ]] && [[ $TOKEN_COUNT -gt $AUTO_OPTIMIZE_THRESHOLD ]]; then
    echo -e "${YELLOW}🤖 Auto-optimization enabled and token threshold exceeded${NC}"
    echo -e "${YELLOW}📊 Current: $TOKEN_COUNT tokens > Threshold: $AUTO_OPTIMIZE_THRESHOLD tokens${NC}"
    echo -e "${BLUE}🔄 Starting automatic AI optimization...${NC}"
    
    # Create backup before optimization
    OPTIMIZATION_BACKUP="$MEMORY_FILE.pre-optimization-$(date -u +"%Y-%m-%d-UTC-%H%M")"
    cp "$MEMORY_FILE" "$OPTIMIZATION_BACKUP"
    echo -e "${YELLOW}💾 Backup created: $OPTIMIZATION_BACKUP${NC}"
    
    # Run AI optimization
    if python3 "$WORKSPACE_ROOT/scripts/optimize-memory-smart.py" --auto-mode; then
        # Check if optimized file exists and replace original
        OPTIMIZED_MEMORY="$WORKSPACE_ROOT/memory-optimized.md"
        if [[ -f "$OPTIMIZED_MEMORY" ]]; then
            mv "$OPTIMIZED_MEMORY" "$MEMORY_FILE"
            
            # Recalculate statistics
            OPTIMIZED_WORD_COUNT=$(wc -w < "$MEMORY_FILE" 2>/dev/null || echo "0")
            OPTIMIZED_TOKEN_COUNT=$((OPTIMIZED_WORD_COUNT * 150 / 100))
            REDUCTION_PERCENT=$(((WORD_COUNT - OPTIMIZED_WORD_COUNT) * 100 / WORD_COUNT))
            
            echo -e "${GREEN}✅ AI optimization completed successfully!${NC}"
            echo -e "${GREEN}📊 Optimization Results:${NC}"
            echo "  📝 Original: $WORD_COUNT words ($TOKEN_COUNT tokens)"
            echo "  📝 Optimized: $OPTIMIZED_WORD_COUNT words ($OPTIMIZED_TOKEN_COUNT tokens)"
            echo "  📉 Reduction: $((WORD_COUNT - OPTIMIZED_WORD_COUNT)) words ($REDUCTION_PERCENT%)"
            echo "  💾 Original backed up to: $OPTIMIZATION_BACKUP"
            
            # Update final statistics
            WORD_COUNT=$OPTIMIZED_WORD_COUNT
            TOKEN_COUNT=$OPTIMIZED_TOKEN_COUNT
        else
            echo -e "${RED}❌ AI optimization failed - using original memory${NC}"
        fi
    else
        echo -e "${RED}❌ AI optimization failed - using original memory${NC}"
    fi
else
    if [[ "$AUTO_OPTIMIZE" != "True" ]]; then
        echo -e "${BLUE}ℹ️  Auto-optimization disabled in configuration${NC}"
    else
        echo -e "${BLUE}ℹ️  Token count ($TOKEN_COUNT) below auto-optimization threshold ($AUTO_OPTIMIZE_THRESHOLD)${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🎯 Memory ready for agent context injection!${NC}"
