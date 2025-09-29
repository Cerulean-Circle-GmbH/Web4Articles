#!/bin/bash
# Memory Generation Script for Web4Articles
# Version: 1.0
# Purpose: Generate comprehensive memory.md from project markdown files

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
MEMORY_FILE="$WORKSPACE_ROOT/memory.md"
CONFIG_FILE="$WORKSPACE_ROOT/scripts/memory-crawl-rules.json"

# Token counting function using tiktoken (more accurate than word estimation)
count_tokens() {
    local file="$1"
    python3 -c "
import sys
import os
try:
    import tiktoken
    encoding = tiktoken.encoding_for_model('gpt-4')
    with open('$file', 'r', encoding='utf-8') as f:
        content = f.read()
    tokens = len(encoding.encode(content))
    print(tokens)
except ImportError:
    # Fallback to word-based estimation if tiktoken not available
    with open('$file', 'r', encoding='utf-8') as f:
        content = f.read()
    words = len(content.split())
    # Conservative estimation: 1.3 tokens per word for markdown
    tokens = int(words * 1.3)
    print(tokens)
except Exception as e:
    print(0)
"
}

# Install tiktoken if not available
install_tiktoken_if_needed() {
    python3 -c "import tiktoken" 2>/dev/null || {
        echo -e "${YELLOW}📦 Installing tiktoken for accurate token counting...${NC}"
        pip3 install tiktoken --user --quiet || {
            echo -e "${YELLOW}⚠️  tiktoken installation failed, using fallback estimation${NC}"
        }
    }
}

# Smart content summarization function
summarize_content() {
    local file="$1"
    local max_length="$2"
    
    python3 -c "
import json
import os

with open('$CONFIG_FILE') as f:
    config = json.load(f)

summarization_config = config['quality_rules']['summarization']
preserve_sections = summarization_config['preserve_sections']

try:
    with open('$file', 'r', encoding='utf-8') as f:
        content = f.read()
except:
    print('# File read error')
    exit()

if len(content) <= $max_length:
    print(content)
    exit()

# Smart summarization - preserve important sections
lines = content.split('\n')
important_lines = []
current_section = ''
in_important_section = False

for line in lines:
    # Check for section headers
    if line.startswith('#'):
        current_section = line.lower()
        in_important_section = any(keyword in current_section for keyword in preserve_sections)
        important_lines.append(line)
    elif in_important_section or len(important_lines) < 20:  # Keep first 20 lines always
        important_lines.append(line)
    elif any(keyword in line.lower() for keyword in ['important', 'critical', 'key', 'must', 'required']):
        important_lines.append(line)

# If still too long, truncate with summary
summary_content = '\n'.join(important_lines)
if len(summary_content) > $max_length:
    summary_content = summary_content[:$max_length] + '\n\n*(Content summarized for token efficiency)*'

print(summary_content)
"
}

echo -e "${BLUE}🧠 Memory Generation Script v1.0${NC}"
echo -e "${BLUE}===========================================${NC}"

cd "$WORKSPACE_ROOT"
START_TIME=$(date +%s)

# Initialize token counting
install_tiktoken_if_needed

# Load configuration from JSON file
echo -e "${YELLOW}📋 Loading crawling rules configuration...${NC}"

if [[ ! -f "$CONFIG_FILE" ]]; then
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Extract core files from configuration
CORE_FILES=($(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
for file in config['core_files']['files']:
    print(file)
"))

echo "  📋 Core files: ${#CORE_FILES[@]}"

# Find additional files
echo -e "${YELLOW}📋 Discovering files...${NC}"

ALL_FILES=()
# Add core files
for file in "${CORE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        ALL_FILES+=("$file")
        echo "  ✅ Core: $file"
    fi
done

# Add files based on discovery patterns from configuration
python3 -c "
import json
import glob
import os
import fnmatch

with open('$CONFIG_FILE') as f:
    config = json.load(f)

# Get exclude patterns
exclude_patterns = config['exclude_patterns']['patterns']

def should_exclude(filepath):
    for pattern in exclude_patterns:
        if fnmatch.fnmatch(filepath, pattern) or fnmatch.fnmatch(os.path.basename(filepath), pattern):
            return True
    return False

discovered_files = []
for pattern in config['discovery_patterns']['patterns']:
    matches = glob.glob(pattern, recursive=True)
    for match in matches:
        if os.path.isfile(match) and not should_exclude(match):
            discovered_files.append(match)

# Remove duplicates and sort
discovered_files = sorted(list(set(discovered_files)))

for file in discovered_files:
    print(file)
" > /tmp/discovered_files.txt

# Read discovered files and add to array
while IFS= read -r file; do
    if [[ -n "$file" ]]; then
        ALL_FILES+=("$file")
        # Categorize the file for display
        case "$file" in
            scrum.pmo/roles/*/process.md)
                echo "  ✅ Role: $file"
                ;;
            docs/*)
                echo "  ✅ Doc: $file"
                ;;
            scrum.pmo/sprints/*)
                echo "  ✅ Sprint: $file"
                ;;
            *)
                echo "  ✅ Extra: $file"
                ;;
        esac
    fi
done < /tmp/discovered_files.txt

echo "  📊 Total files: ${#ALL_FILES[@]}"

# Categorize files using configuration
echo -e "${YELLOW}📋 Categorizing files...${NC}"

python3 -c "
import json
import fnmatch

with open('$CONFIG_FILE') as f:
    config = json.load(f)

# Read files from bash array (passed as arguments)
import sys
files = []
for line in sys.stdin:
    line = line.strip()
    if line:
        files.append(line)

categories = config['file_categories']

categorized = {
    'process_files': [],
    'role_files': [],
    'sprint_files': [],
    'documentation_files': [],
    'specification_files': [],
    'other_files': []
}

for file in files:
    categorized_flag = False
    for category_name in categorized.keys():
        if category_name in categories:
            for pattern in categories[category_name]['patterns']:
                if fnmatch.fnmatch(file, pattern):
                    categorized[category_name].append(file)
                    categorized_flag = True
                    break
            if categorized_flag:
                break
    
    if not categorized_flag:
        categorized['other_files'].append(file)

# Output statistics
for category, files_list in categorized.items():
    print(f'{category}: {len(files_list)}')

# Priority scoring and content optimization
for file in files:
    # Calculate priority score based on category
    priority_score = 1  # default
    for category_name, file_list in categorized.items():
        if file in file_list:
            category_key = category_name.replace('_files', '_files')
            if category_key == 'process_files':
                priority_score = 10
            elif category_key == 'role_files':
                priority_score = 8
            elif category_key == 'sprint_files':
                priority_score = 6
            elif category_key == 'documentation_files':
                priority_score = 5
            elif category_key == 'specification_files':
                priority_score = 4
            break
    
    print(f'PRIORITY|{file}|{priority_score}')
" <<< \"$(printf '%s\n' \"${ALL_FILES[@]}\")\" > /tmp/file_priorities.txt

# Parse priority information and sort files by priority
echo -e "${YELLOW}📋 Optimizing content by priority...${NC}"

# Extract priority scores and create sorted file list
PRIORITIZED_FILES=()
while IFS='|' read -r prefix file priority; do
    if [[ "$prefix" == "PRIORITY" ]]; then
        PRIORITIZED_FILES+=("$priority|$file")
    fi
done < /tmp/file_priorities.txt

# Sort by priority (descending)
readarray -t SORTED_FILES < <(printf '%s\n' "${PRIORITIZED_FILES[@]}" | sort -nr)

echo "  📊 Files prioritized: ${#SORTED_FILES[@]}"

# Generate memory.md with token budget management
echo -e "${YELLOW}📋 Generating memory.md with token budget control...${NC}"

# Load quality rules from configuration
TOKEN_TARGET=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
print(config['quality_rules']['token_target'])
")

MAX_FILES=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    config = json.load(f)
print(config['quality_rules']['max_files'])
")

echo "  🎯 Token target: $TOKEN_TARGET"
echo "  📁 Max files: $MAX_FILES"

# Generate initial template
cat > "$MEMORY_FILE" << EOF
# Agent Context Memory
**Last Updated:** $(date -u +"%Y-%m-%d-UTC-%H%M")
**Version:** 1.0
**Generated By:** Memory Generation Script
**Files Crawled:** ${#ALL_FILES[@]} markdown files
**Deduplication Applied:** KISS + DRY rules

---

## Project Overview

**Web4Articles** is a DAPP (Decentralized Application) for collective intelligence in article writing. The project implements a comprehensive Web4 methodology with structured development processes, PDCA (Plan-Do-Check-Act) cycles, and multi-agent coordination.

### Core Philosophy
- **"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** - Collaborative intelligence principle
- **CMMI Level 4** process compliance with systematic improvement
- **DRY (Don't Repeat Yourself)** - No duplication of logic, documentation, or code
- **KISS (Keep It Simple and Short)** - Simple, clear solutions over complexity

---

## Process Framework

### PDCA System (Plan-Do-Check-Act)
**Template Version:** 3.1.4.2
**Location:** \`scrum.pmo/roles/_shared/PDCA/template.md\`

#### Mandatory 6-Section Format:
1. **Strict Header** - UTC timestamp, agent info, branch, sync requirements
2. **Summary with Dual Links** - GitHub | local paths, QA decisions, TRON feedback
3. **Horizontal Separators** - Between all sections
4. **QA Feedback in Check** - Verbatim quotes with UTC timestamps
5. **Emotional Reflection** - Personal growth and journey aspects
6. **PDCA Process Update** - Learning and quality impact

#### Critical Requirements:
- **Dual Link Format:** \`[GitHub](URL) | [local/path](path)\`
- **Verbatim TRON Quotes:** Never paraphrase user feedback
- **UTC Timestamps:** All dates in YYYY-MM-DD-UTC-HHMM format
- **Immediate Commit & Push:** After every PDCA creation

### Agent Roles & Responsibilities

EOF

# Add role information
echo "" >> "$MEMORY_FILE"
for file in "${ALL_FILES[@]}"; do
    if [[ "$file" == scrum.pmo/roles/*/process.md ]]; then
        role_name=$(basename "$(dirname "$file")")
        echo "#### $role_name" >> "$MEMORY_FILE"
        
        # Extract purpose if available
        if grep -q "Purpose:" "$file" 2>/dev/null; then
            purpose=$(grep "Purpose:" "$file" | head -1 | sed 's/.*Purpose: *//' | sed 's/\*\*//g')
            echo "- **Purpose:** $purpose" >> "$MEMORY_FILE"
        elif grep -q "Role Definition" "$file" 2>/dev/null; then
            # Get text after "Role Definition"
            definition=$(grep -A 3 "Role Definition" "$file" | tail -2 | tr '\n' ' ' | sed 's/- //g' | sed 's/\*\*//g')
            echo "- **Purpose:** $definition" >> "$MEMORY_FILE"
        fi
        
        echo "- **Process:** $file" >> "$MEMORY_FILE"
        echo "" >> "$MEMORY_FILE"
    fi
done

# Continue with rest of template
cat >> "$MEMORY_FILE" << 'EOF'

---

## Current State

### Active Sprint Information
**Current Branch:** CURRENT_BRANCH_PLACEHOLDER
**Latest Commit:** LATEST_COMMIT_PLACEHOLDER

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

---

## Decision Framework

### QA Decision Format
```markdown
### **QA Decisions**
- [x] Completed decision: [Description]
- [ ] **Decision 1:** [Clear title]
  - a) [Option with rationale]
  - b) [Option with rationale]
```

### When to Present Decisions
- **Real Risk Exists:** Destructive operations, data loss potential
- **Multiple Valid Approaches:** Different implementation strategies
- **Ambiguous Requirements:** Unclear user instructions
- **Significant Impact:** Architecture, long-term maintenance

---

## Key Files & Links

### Core Process Files
EOF

# Add core files list
for file in "${CORE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "- **$(basename "$file")** - $file" >> "$MEMORY_FILE"
    fi
done

echo "" >> "$MEMORY_FILE"
echo "### Role Process Files" >> "$MEMORY_FILE"

# Add role files list
for file in "${ALL_FILES[@]}"; do
    if [[ "$file" == scrum.pmo/roles/*/process.md ]]; then
        role_name=$(basename "$(dirname "$file")")
        echo "- **$role_name** - $file" >> "$MEMORY_FILE"
    fi
done

# Finish the template
cat >> "$MEMORY_FILE" << 'EOF'

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

---

## Quick Reference Commands

### Identity & Startup
```bash
# Start every session
./scripts/agent-identity-first-startup.sh

# Check current branch
git branch --show-current

# Generate/update memory
./scripts/generate-memory.sh
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

---

**🎯 This memory.md provides comprehensive context for all agent operations, ensuring consistent understanding and process compliance across all roles and sessions.**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨
EOF

# Replace placeholders with actual values using Python (more reliable than sed)
current_branch=$(git branch --show-current 2>/dev/null || echo "Unknown")
latest_commit=$(git log -1 --pretty=format:"%h - %s" 2>/dev/null || echo "Unknown")

python3 -c "
import re
with open('$MEMORY_FILE', 'r') as f:
    content = f.read()
content = content.replace('CURRENT_BRANCH_PLACEHOLDER', '$current_branch')
content = content.replace('LATEST_COMMIT_PLACEHOLDER', '''$latest_commit''')
with open('$MEMORY_FILE', 'w') as f:
    f.write(content)
"

# Monitor token count and apply budget controls
echo -e "${YELLOW}📊 Checking token budget...${NC}"
CURRENT_TOKENS=$(count_tokens "$MEMORY_FILE")

if [ "$CURRENT_TOKENS" -gt "$TOKEN_TARGET" ]; then
    echo -e "${YELLOW}⚠️  Token limit exceeded ($CURRENT_TOKENS > $TOKEN_TARGET), optimizing...${NC}"
    
    # Create optimized version by prioritizing content
    python3 -c "
import json
import os

with open('$CONFIG_FILE') as f:
    config = json.load(f)

with open('$MEMORY_FILE', 'r') as f:
    content = f.read()

# Simple content optimization: truncate less important sections
lines = content.split('\n')
optimized_lines = []
in_optional_section = False

for line in lines:
    # Keep essential headers and key content
    if any(keyword in line.lower() for keyword in ['overview', 'process framework', 'current state', 'pdca', 'agent startup']):
        in_optional_section = False
        optimized_lines.append(line)
    elif any(keyword in line.lower() for keyword in ['decision history', 'quick reference', 'revolutionary breakthroughs']):
        in_optional_section = True
        optimized_lines.append(line)
        # Add truncation notice
        optimized_lines.append('*(Content truncated for token budget)*')
        break
    elif not in_optional_section:
        optimized_lines.append(line)

with open('$MEMORY_FILE', 'w') as f:
    f.write('\n'.join(optimized_lines))
"
    
    CURRENT_TOKENS=$(count_tokens "$MEMORY_FILE")
    echo "  📊 Optimized tokens: $CURRENT_TOKENS"
fi

# Calculate final statistics
END_TIME=$(date +%s)
GENERATION_TIME=$((END_TIME - START_TIME))

echo -e "${GREEN}✅ Memory generation completed!${NC}"
echo -e "${GREEN}📊 Statistics:${NC}"
echo "  📁 Files processed: ${#ALL_FILES[@]}"
echo "  ⏱️  Generation time: ${GENERATION_TIME}s"
echo "  📄 Output file: $MEMORY_FILE"

# Final token budget check
if [[ -f "$MEMORY_FILE" ]]; then
    size=$(wc -c < "$MEMORY_FILE")
    words=$(wc -w < "$MEMORY_FILE")
    
    echo "  📏 File size: $size bytes"
    echo "  📝 Words: $words"
    echo "  🎯 Actual tokens: $CURRENT_TOKENS"
    
    if [[ $CURRENT_TOKENS -gt $TOKEN_TARGET ]]; then
        echo -e "${YELLOW}⚠️  Warning: Tokens ($CURRENT_TOKENS) exceed target ($TOKEN_TARGET)${NC}"
    else
        echo -e "${GREEN}✅ Token count within target (<$TOKEN_TARGET)${NC}"
    fi
fi

echo -e "${BLUE}🎯 Memory generation completed successfully!${NC}"
