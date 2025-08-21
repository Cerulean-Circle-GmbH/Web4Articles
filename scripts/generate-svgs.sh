#!/bin/bash

# Script to generate SVGs from all PlantUML files in the workspace
# This ensures consistent SVG generation with proper Java/PlantUML configuration

set -e

# Set Java environment
export JAVA_HOME=/usr/local/opt/openjdk
export PATH="$JAVA_HOME/bin:$PATH"

echo "🚀 Starting PlantUML SVG generation..."
echo "Java version: $(java -version 2>&1 | head -n 1)"
echo "PlantUML version: $(plantuml -version 2>&1 | head -n 1)"

# Function to generate SVGs for a component
generate_component_svgs() {
    local component_path="$1"
    local component_name=$(basename "$component_path")
    
    if [[ -d "$component_path/v1.0/src/puml" ]]; then
        echo "📊 Processing $component_name..."
        
        # Create svg directory if it doesn't exist
        mkdir -p "$component_path/v1.0/src/svg"
        
        # Generate SVGs
        cd "$component_path/v1.0/src/puml"
        plantuml -tsvg -o ../svg *.puml
        
        echo "✅ Generated SVGs for $component_name"
        ls -la ../svg/
        
        cd - > /dev/null
    fi
}

# Process all components
echo "🔍 Scanning for components..."
for component_dir in components/*/; do
    if [[ -d "$component_dir" ]]; then
        generate_component_svgs "$component_dir"
    fi
done

echo "🎉 SVG generation complete!"
echo ""
echo "📋 Summary:"
find components -name "*.svg" -exec echo "  {}" \;
