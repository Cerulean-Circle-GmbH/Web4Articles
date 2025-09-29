#!/bin/bash
# Memory Version Tracker Script
# Purpose: Manage memory.md versions and provide rollback capabilities

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
MEMORY_VERSIONS="$WORKSPACE_ROOT/.memory-versions"
VERSION_LOG="$MEMORY_VERSIONS/version-log.txt"

echo -e "${BLUE}🧠 Memory Version Tracker v1.0${NC}"
echo -e "${BLUE}================================${NC}"

cd "$WORKSPACE_ROOT"

# Ensure versions directory exists
mkdir -p "$MEMORY_VERSIONS"

# Functions
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  list              List all memory versions"
    echo "  create [MESSAGE]  Create new version with optional message"
    echo "  restore [VERSION] Restore specific version"
    echo "  diff [VERSION]    Show differences from current"
    echo "  clean [DAYS]      Remove versions older than X days (default: 30)"
    echo "  stats             Show version statistics"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 create \"After role updates\""
    echo "  $0 restore 2025-09-29-UTC-0730"
    echo "  $0 diff 2025-09-29-UTC-0730"
    echo "  $0 clean 7"
}

list_versions() {
    echo -e "${YELLOW}📚 Memory Version History:${NC}"
    echo ""
    
    if [[ ! -f "$VERSION_LOG" ]]; then
        echo -e "${YELLOW}No versions found.${NC}"
        return
    fi
    
    echo "| Timestamp | Message |"
    echo "|-----------|---------|"
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^\[([^\]]+)\]\ (.+)$ ]]; then
            timestamp="${BASH_REMATCH[1]}"
            message="${BASH_REMATCH[2]}"
            echo "| $timestamp | $message |"
        fi
    done < "$VERSION_LOG"
    
    echo ""
    echo -e "${BLUE}📊 Available version files:${NC}"
    ls -la "$MEMORY_VERSIONS"/memory-*.md 2>/dev/null | awk '{print "  " $9 " (" $5 " bytes, " $6 " " $7 " " $8 ")"}' || echo "  No version files found"
}

create_version() {
    local message="$1"
    local timestamp=$(date -u +"%Y-%m-%d-UTC-%H%M")
    
    if [[ -z "$message" ]]; then
        message="Manual version creation"
    fi
    
    if [[ ! -f "$MEMORY_FILE" ]]; then
        echo -e "${RED}❌ Error: memory.md not found${NC}"
        exit 1
    fi
    
    # Create version backup
    cp "$MEMORY_FILE" "$MEMORY_VERSIONS/memory-$timestamp.md"
    
    # Log version
    echo "[$timestamp] $message" >> "$VERSION_LOG"
    
    echo -e "${GREEN}✅ Version created: $timestamp${NC}"
    echo -e "${BLUE}📄 Message: $message${NC}"
    echo -e "${BLUE}📊 Size: $(wc -c < "$MEMORY_FILE") bytes, $(wc -w < "$MEMORY_FILE") words${NC}"
}

restore_version() {
    local version="$1"
    
    if [[ -z "$version" ]]; then
        echo -e "${RED}❌ Error: Version timestamp required${NC}"
        echo "Use: $0 list to see available versions"
        exit 1
    fi
    
    local version_file="$MEMORY_VERSIONS/memory-$version.md"
    
    if [[ ! -f "$version_file" ]]; then
        echo -e "${RED}❌ Error: Version $version not found${NC}"
        echo "Available versions:"
        ls "$MEMORY_VERSIONS"/memory-*.md 2>/dev/null | sed 's/.*memory-\(.*\)\.md/  \1/' || echo "  No versions available"
        exit 1
    fi
    
    # Create backup of current memory before restore
    if [[ -f "$MEMORY_FILE" ]]; then
        local backup_timestamp=$(date -u +"%Y-%m-%d-UTC-%H%M")
        cp "$MEMORY_FILE" "$MEMORY_VERSIONS/memory-backup-before-restore-$backup_timestamp.md"
        echo "[$backup_timestamp] Backup before restore to $version" >> "$VERSION_LOG"
    fi
    
    # Restore version
    cp "$version_file" "$MEMORY_FILE"
    
    # Log restore
    local restore_timestamp=$(date -u +"%Y-%m-%d-UTC-%H%M")
    echo "[$restore_timestamp] Restored from version $version" >> "$VERSION_LOG"
    
    echo -e "${GREEN}✅ Memory restored from version: $version${NC}"
    echo -e "${BLUE}📄 Current memory.md updated${NC}"
    echo -e "${BLUE}📊 Size: $(wc -c < "$MEMORY_FILE") bytes, $(wc -w < "$MEMORY_FILE") words${NC}"
}

diff_version() {
    local version="$1"
    
    if [[ -z "$version" ]]; then
        echo -e "${RED}❌ Error: Version timestamp required${NC}"
        exit 1
    fi
    
    local version_file="$MEMORY_VERSIONS/memory-$version.md"
    
    if [[ ! -f "$version_file" ]]; then
        echo -e "${RED}❌ Error: Version $version not found${NC}"
        exit 1
    fi
    
    if [[ ! -f "$MEMORY_FILE" ]]; then
        echo -e "${RED}❌ Error: Current memory.md not found${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}📊 Differences between current memory and version $version:${NC}"
    echo ""
    
    # Show word count differences
    local current_words=$(wc -w < "$MEMORY_FILE")
    local version_words=$(wc -w < "$version_file")
    local word_diff=$((current_words - version_words))
    
    echo -e "${BLUE}Word count: Current=$current_words, Version=$version_words, Difference=$word_diff${NC}"
    echo ""
    
    # Show actual differences
    diff -u "$version_file" "$MEMORY_FILE" | head -50 || echo "Files are identical"
}

clean_versions() {
    local days="${1:-30}"
    
    echo -e "${YELLOW}🧹 Cleaning versions older than $days days...${NC}"
    
    local cleaned=0
    
    # Clean version files
    while IFS= read -r -d '' file; do
        if [[ $(find "$file" -mtime +$days) ]]; then
            echo "  🗑️  Removing: $(basename "$file")"
            rm "$file"
            cleaned=$((cleaned + 1))
        fi
    done < <(find "$MEMORY_VERSIONS" -name "memory-*.md" -print0 2>/dev/null)
    
    # Clean old log entries (keep last 100 entries regardless of age)
    if [[ -f "$VERSION_LOG" ]]; then
        tail -100 "$VERSION_LOG" > "$VERSION_LOG.tmp"
        mv "$VERSION_LOG.tmp" "$VERSION_LOG"
    fi
    
    echo -e "${GREEN}✅ Cleaned $cleaned old versions${NC}"
}

show_stats() {
    echo -e "${YELLOW}📊 Memory Version Statistics:${NC}"
    echo ""
    
    if [[ ! -d "$MEMORY_VERSIONS" ]]; then
        echo -e "${YELLOW}No version history found.${NC}"
        return
    fi
    
    local version_count=$(ls "$MEMORY_VERSIONS"/memory-*.md 2>/dev/null | wc -l)
    local total_size=$(du -sh "$MEMORY_VERSIONS" 2>/dev/null | cut -f1)
    local log_entries=$(wc -l < "$VERSION_LOG" 2>/dev/null || echo "0")
    
    echo "📄 Total versions: $version_count"
    echo "💾 Storage used: $total_size"
    echo "📝 Log entries: $log_entries"
    
    if [[ -f "$MEMORY_FILE" ]]; then
        echo "🧠 Current memory: $(wc -w < "$MEMORY_FILE") words, $(wc -c < "$MEMORY_FILE") bytes"
    fi
    
    echo ""
    echo -e "${BLUE}📅 Recent versions:${NC}"
    ls -lt "$MEMORY_VERSIONS"/memory-*.md 2>/dev/null | head -5 | awk '{print "  " $9 " (" $6 " " $7 " " $8 ")"}'
}

# Main command processing
case "${1:-help}" in
    "list"|"ls")
        list_versions
        ;;
    "create"|"new")
        create_version "$2"
        ;;
    "restore"|"rollback")
        restore_version "$2"
        ;;
    "diff"|"compare")
        diff_version "$2"
        ;;
    "clean"|"cleanup")
        clean_versions "$2"
        ;;
    "stats"|"status")
        show_stats
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Error: Unknown command '$1'${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
