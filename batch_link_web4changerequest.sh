#!/bin/bash
# Batch link Web4ChangeRequest requirements to central discovery

cd spec/requirements.md

# Get all Web4ChangeRequest UUIDs
UUIDS=$(find ../../components/Web4ChangeRequest -name "*.requirement.md" -type f | xargs basename -s .requirement.md)

echo "🔗 Linking Web4ChangeRequest requirements to central discovery..."
echo "📊 Found $(echo "$UUIDS" | wc -l) Web4ChangeRequest requirements"

LINKED_COUNT=0
SKIPPED_COUNT=0

for uuid in $UUIDS; do
  if [ ! -e "${uuid}.requirement.md" ]; then
    echo "🔗 Linking: $uuid"
    ln -s "../../components/Web4ChangeRequest/0.1.3.0/spec/requirements.md/${uuid}.requirement.md" "${uuid}.requirement.md"
    LINKED_COUNT=$((LINKED_COUNT + 1))
  else
    echo "⏭️  Skipped: $uuid (already exists)"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
  fi
done

echo "✅ Web4ChangeRequest linking complete:"
echo "   🔗 Linked: $LINKED_COUNT requirements"
echo "   ⏭️  Skipped: $SKIPPED_COUNT requirements (already existed)"
echo "   📊 Total Web4ChangeRequest requirements: $(echo "$UUIDS" | wc -l)"
