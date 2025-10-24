# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../LICENSE) and AI-GPL Addendum (../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

# Simple PlantUML SVG Generator - Web4Articles
# Generates SVG files for all PlantUML diagrams with proper path handling

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Set Java environment
export JAVA_HOME=/usr/local/opt/openjdk
export PATH="$JAVA_HOME/bin:$PATH"

echo -e "${BLUE}🚀 Simple PlantUML SVG Generator${NC}"
echo "Java version: $(java -version 2>&1 | head -n 1)"
echo "PlantUML version: $(plantuml -version 2>&1 | head -n 1)"
echo ""

total_generated=0

# Function to process a single puml file
process_puml_file() {
    local puml_file="$1"
    local puml_dir="$(dirname "$puml_file")"
    local filename="$(basename "$puml_file" .puml)"
    
    # Determine SVG output directory
    local svg_dir=""
    if [[ "$puml_dir" == */src/puml ]]; then
        # Component structure: replace puml with svg
        svg_dir="${puml_dir%/puml}/svg"
    else
        # Root level: create svg directory alongside puml
        svg_dir="$(dirname "$puml_dir")/svg"
    fi
    
    # Create svg directory
    mkdir -p "$svg_dir"
    
    # Generate SVG
    echo -e "${YELLOW}📊 $puml_file -> $svg_dir/$filename.svg${NC}"
    plantuml -tsvg -o "$svg_dir" "$puml_file"
    
    if [[ -f "$svg_dir/$filename.svg" ]]; then
        echo -e "   ${GREEN}✅ Success${NC}"
        total_generated=$((total_generated + 1))
    else
        echo -e "   ❌ Failed"
    fi
}

echo -e "${BLUE}🔍 Finding all PlantUML files...${NC}"

# Find and process all .puml files
while IFS= read -r -d '' puml_file; do
    process_puml_file "$puml_file"
done < <(find . -name "*.puml" -type f -print0)

echo ""
echo -e "${GREEN}🎉 Generation complete!${NC}"
echo -e "${GREEN}📊 Total SVGs generated: $total_generated${NC}"
echo ""
echo -e "${BLUE}📋 All SVG files:${NC}"
find . -name "*.svg" -not -path "./.git/*" | sort
