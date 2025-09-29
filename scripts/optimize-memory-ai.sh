#!/bin/bash
# AI-Powered Memory Optimization Script
# Purpose: Use AI to optimize memory.md while preserving all essential meaning

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
WORKSPACE_ROOT="$(git rev-parse --show-toplevel)"
MEMORY_FILE="$WORKSPACE_ROOT/memory.md"
OPTIMIZED_MEMORY="$WORKSPACE_ROOT/memory-optimized.md"
BACKUP_DIR="$WORKSPACE_ROOT/.memory-optimization"
CHUNK_SIZE=8000  # Words per AI optimization chunk

echo -e "${BLUE}🤖 AI-Powered Memory Optimization Script${NC}"
echo -e "${BLUE}=====================================${NC}"

# Create backup and working directories
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date -u +"%Y-%m-%d-UTC-%H%M")
cp "$MEMORY_FILE" "$BACKUP_DIR/memory-pre-optimization-$TIMESTAMP.md"

echo -e "${YELLOW}📂 Created backup: $BACKUP_DIR/memory-pre-optimization-$TIMESTAMP.md${NC}"

# Analyze current memory
CURRENT_WORDS=$(wc -w < "$MEMORY_FILE")
CURRENT_LINES=$(wc -l < "$MEMORY_FILE")
ESTIMATED_TOKENS=$((CURRENT_WORDS * 150 / 100))

echo -e "${YELLOW}📊 Current Memory Analysis:${NC}"
echo "  📝 Words: $CURRENT_WORDS"
echo "  📄 Lines: $CURRENT_LINES"
echo "  🎯 Estimated tokens: $ESTIMATED_TOKENS"

# Function to create AI optimization prompt
create_optimization_prompt() {
    local section_content="$1"
    cat << 'EOF'
You are an expert technical documentation optimizer. Your task is to optimize the following markdown content while preserving ALL essential information and meaning.

OPTIMIZATION GOALS:
1. Reduce redundancy and repetitive phrases
2. Consolidate similar information 
3. Remove excessive empty lines and formatting
4. Compress verbose explanations without losing meaning
5. Merge duplicate headers and sections
6. Optimize list structures for conciseness

CRITICAL REQUIREMENTS:
- Preserve ALL essential information (no information loss)
- Keep all code blocks, commands, and technical details
- Maintain logical structure and readability
- Preserve all critical process requirements and standards
- Keep all agent role definitions and responsibilities
- Maintain all file paths, links, and references

CONTENT TO OPTIMIZE:
EOF
    echo "$section_content"
    echo ""
    echo "OPTIMIZED VERSION:"
}

# Function to split memory into chunks for AI processing
split_memory_for_ai() {
    echo -e "${YELLOW}🔄 Splitting memory into AI-processable chunks...${NC}"
    
    # Create chunks directory
    local chunks_dir="$BACKUP_DIR/chunks-$TIMESTAMP"
    mkdir -p "$chunks_dir"
    
    # Split by major sections to maintain context
    awk '
        BEGIN { chunk = 1; filename = "'$chunks_dir'/chunk-" chunk ".md" }
        /^## / { 
            if (NR > 1) {
                close(filename)
                chunk++
                filename = "'$chunks_dir'/chunk-" chunk ".md"
            }
        }
        { print > filename }
        END { close(filename) }
    ' "$MEMORY_FILE"
    
    echo "  📊 Created $(ls -1 "$chunks_dir"/chunk-*.md | wc -l) chunks"
    echo "$chunks_dir"
}

# Function to optimize a single chunk (placeholder for AI integration)
optimize_chunk() {
    local chunk_file="$1"
    local output_file="$2"
    
    echo -e "${BLUE}🤖 Optimizing $(basename "$chunk_file")...${NC}"
    
    # For now, create optimization prompt that could be sent to AI
    local content=$(cat "$chunk_file")
    local prompt_file="${chunk_file%.md}-prompt.txt"
    
    create_optimization_prompt "$content" > "$prompt_file"
    
    echo "  📝 Created optimization prompt: $prompt_file"
    echo "  ⚠️  Manual AI processing required - see implementation options below"
    
    # Placeholder: Copy original for now (to be replaced with AI-optimized content)
    cp "$chunk_file" "$output_file"
}

# Function to reassemble optimized chunks
reassemble_optimized_memory() {
    local chunks_dir="$1"
    local output_file="$2"
    
    echo -e "${YELLOW}🔧 Reassembling optimized chunks...${NC}"
    
    # Combine all optimized chunks
    > "$output_file"  # Clear output file
    
    for chunk in "$chunks_dir"/chunk-*-optimized.md; do
        if [[ -f "$chunk" ]]; then
            cat "$chunk" >> "$output_file"
            echo "" >> "$output_file"  # Add separator
        fi
    done
    
    echo "  ✅ Reassembled into: $output_file"
}

# Main optimization workflow
main() {
    echo -e "${YELLOW}🚀 Starting AI optimization workflow...${NC}"
    
    # Step 1: Split memory into chunks
    chunks_dir=$(split_memory_for_ai)
    
    # Step 2: Optimize each chunk
    echo -e "${YELLOW}🤖 Processing chunks for AI optimization...${NC}"
    for chunk in "$chunks_dir"/chunk-*.md; do
        if [[ -f "$chunk" ]]; then
            output_chunk="${chunk%.md}-optimized.md"
            optimize_chunk "$chunk" "$output_chunk"
        fi
    done
    
    # Step 3: Reassemble (after AI processing)
    reassemble_optimized_memory "$chunks_dir" "$OPTIMIZED_MEMORY"
    
    # Step 4: Statistics
    if [[ -f "$OPTIMIZED_MEMORY" ]]; then
        OPTIMIZED_WORDS=$(wc -w < "$OPTIMIZED_MEMORY")
        OPTIMIZED_TOKENS=$((OPTIMIZED_WORDS * 150 / 100))
        REDUCTION_PERCENT=$(((CURRENT_WORDS - OPTIMIZED_WORDS) * 100 / CURRENT_WORDS))
        
        echo -e "${GREEN}📊 Optimization Results:${NC}"
        echo "  📝 Original words: $CURRENT_WORDS"
        echo "  📝 Optimized words: $OPTIMIZED_WORDS"
        echo "  📉 Reduction: $((CURRENT_WORDS - OPTIMIZED_WORDS)) words ($REDUCTION_PERCENT%)"
        echo "  🎯 New token estimate: $OPTIMIZED_TOKENS"
        
        echo -e "${BLUE}📁 Files created:${NC}"
        echo "  📄 Optimized memory: $OPTIMIZED_MEMORY"
        echo "  📂 Processing chunks: $chunks_dir"
        echo "  💾 Backup: $BACKUP_DIR/memory-pre-optimization-$TIMESTAMP.md"
    fi
    
    echo ""
    echo -e "${YELLOW}⚠️  NEXT STEPS FOR AI INTEGRATION:${NC}"
    echo "1. Review chunk prompt files in: $chunks_dir"
    echo "2. Process each prompt through AI (GPT-4, Claude, etc.)"
    echo "3. Save AI responses as *-optimized.md files"
    echo "4. Run reassemble function to create final optimized memory"
    echo "5. Test and validate the optimized memory"
}

# Script execution
main "$@"

echo -e "${GREEN}✅ AI optimization preparation completed!${NC}"
