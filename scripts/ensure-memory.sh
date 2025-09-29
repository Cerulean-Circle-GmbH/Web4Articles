#!/bin/bash
# Memory Validation and Generation Script
# Purpose: Ensure memory.md exists and is current before agent work

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧠 Memory Validation Script${NC}"
echo -e "${BLUE}=========================${NC}"

WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
MEMORY_FILE="$WORKSPACE_ROOT/memory.md"

cd "$WORKSPACE_ROOT"

# Check if memory.md exists
if [[ ! -f "$MEMORY_FILE" ]]; then
    echo -e "${YELLOW}⚠️  Memory file not found. Generating comprehensive memory...${NC}"
    ./scripts/generate-memory.sh
    exit 0
fi

# Check if memory is older than 1 day
if [[ $(find "$MEMORY_FILE" -mtime +1 2>/dev/null) ]]; then
    echo -e "${YELLOW}⚠️  Memory is older than 1 day. Updating...${NC}"
    ./scripts/generate-memory.sh
    exit 0
fi

# Check if memory contains expected content
if ! grep -q "Agent Context Memory" "$MEMORY_FILE" 2>/dev/null; then
    echo -e "${RED}❌ Memory appears incomplete or corrupted. Regenerating...${NC}"
    ./scripts/generate-memory.sh
    exit 0
fi

# Check memory size (should be substantial)
WORD_COUNT=$(wc -w < "$MEMORY_FILE" 2>/dev/null || echo "0")
if [[ $WORD_COUNT -lt 1000 ]]; then
    echo -e "${YELLOW}⚠️  Memory seems too small ($WORD_COUNT words). Regenerating...${NC}"
    ./scripts/generate-memory.sh
    exit 0
fi

# Memory is good
echo -e "${GREEN}✅ Memory is current and comprehensive${NC}"
echo -e "${GREEN}📊 Memory contains: $WORD_COUNT words of project knowledge${NC}"
echo -e "${GREEN}📄 File: $MEMORY_FILE${NC}"
echo -e "${BLUE}🎯 Ready for agent work with complete context!${NC}"
