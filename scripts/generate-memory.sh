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

echo -e "${BLUE}🧠 Memory Generation Script v2.0${NC}"
echo -e "${BLUE}====================================${NC}"
echo -e "${YELLOW}Purpose: Comprehensive agent context (MCP-style)${NC}"

cd "$WORKSPACE_ROOT"
START_TIME=$(date +%s)

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

# Extract essential content from key files
extract_essential_content() {
    local file="$1"
    local max_lines="$2"
    
    if [[ -f "$file" ]]; then
        echo "### From $file"
        echo '```'
        head -n "$max_lines" "$file" | grep -v "^$" | head -20
        echo '```'
        echo ""
    fi
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

# Process other important files for key content
for file in "${ALL_MD_FILES[@]}"; do
    # Skip role files (already processed) and very large files
    if [[ "$file" != *"/roles/"*"/process.md" ]] && [[ -f "$file" ]]; then
        file_size=$(wc -l < "$file" 2>/dev/null || echo "0")
        if [[ $file_size -lt 200 ]] && [[ $file_size -gt 5 ]]; then
            echo "### Content from $file" >> "$MEMORY_FILE"
            # Extract key sections - headers and first few lines of each section
            awk '
                /^#/ { print; getline; print; next }
                /^-.*:/ { print; next }
                /Purpose|Important|Critical|Key|Must|Required/ { print; next }
                NR <= 10 { print }
            ' "$file" | head -15 >> "$MEMORY_FILE"
            echo "" >> "$MEMORY_FILE"
        fi
    fi
done

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

echo -e "${GREEN}✅ Memory Generation Completed!${NC}"
echo -e "${GREEN}📊 Statistics:${NC}"
echo "  📄 Output file: $MEMORY_FILE"
echo "  📏 File size: $FILE_SIZE bytes"
echo "  📝 Words: $WORD_COUNT"
echo "  🎯 Estimated tokens: $TOKEN_COUNT"
echo "  ⏱️  Generation time: ${GENERATION_TIME}s"

if [[ $TOKEN_COUNT -gt 8000 ]]; then
    echo -e "${YELLOW}⚠️  Warning: Token count ($TOKEN_COUNT) is high - consider optimization${NC}"
else
    echo -e "${GREEN}✅ Token count acceptable for comprehensive context${NC}"
fi

echo ""
echo -e "${BLUE}🎯 Memory ready for agent context injection!${NC}"
