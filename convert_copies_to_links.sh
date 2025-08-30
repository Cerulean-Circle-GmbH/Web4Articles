#!/bin/bash
# Convert copied requirement files to symbolic links

cd spec/requirements.md

echo "🔄 Converting copied requirement files to symbolic links..."
echo "📊 Current status:"
echo "   📁 Symbolic links: $(ls -la *.requirement.md | grep "^l" | wc -l)"
echo "   📄 Copied files: $(ls -la *.requirement.md | grep "^-" | wc -l)"
echo ""

# Get all copied file UUIDs
COPIED_UUIDS=$(ls -la *.requirement.md | grep "^-" | awk '{print $9}' | sed 's/.requirement.md//')

CONVERTED_COUNT=0
ORPHANED_COUNT=0
ALREADY_LINKED_COUNT=0

for uuid in $COPIED_UUIDS; do
  echo "🔍 Processing: $uuid"
  
  # Check if already a symbolic link
  if [ -L "${uuid}.requirement.md" ]; then
    echo "   ⏭️  Already symbolic link, skipping"
    ALREADY_LINKED_COUNT=$((ALREADY_LINKED_COUNT + 1))
    continue
  fi
  
  # Find component source
  COMPONENT_SOURCE=$(find ../../components -name "${uuid}.requirement.md" -type f 2>/dev/null | head -1)
  
  if [ -n "$COMPONENT_SOURCE" ]; then
    echo "   📁 Found source: $COMPONENT_SOURCE"
    
    # Create backup
    cp "${uuid}.requirement.md" "${uuid}.requirement.md.backup"
    
    # Remove copied file
    rm "${uuid}.requirement.md"
    
    # Create symbolic link with relative path from spec/requirements.md
    RELATIVE_PATH=$(echo "$COMPONENT_SOURCE" | sed 's|^\./|../../|')
    ln -s "$RELATIVE_PATH" "${uuid}.requirement.md"
    
    echo "   ✅ Converted: copy → symbolic link"
    CONVERTED_COUNT=$((CONVERTED_COUNT + 1))
  else
    echo "   ⚠️  No component source found - orphaned requirement"
    ORPHANED_COUNT=$((ORPHANED_COUNT + 1))
  fi
  echo ""
done

echo "🎯 Conversion Summary:"
echo "   ✅ Converted: $CONVERTED_COUNT requirements"
echo "   ⚠️  Orphaned: $ORPHANED_COUNT requirements (no component source)"
echo "   ⏭️  Already linked: $ALREADY_LINKED_COUNT requirements"
echo ""
echo "📊 Final status:"
echo "   📁 Symbolic links: $(ls -la *.requirement.md | grep "^l" | wc -l)"
echo "   📄 Copied files remaining: $(ls -la *.requirement.md | grep "^-" | wc -l)"
