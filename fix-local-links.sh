#!/bin/bash

# Custom script to fix local file links in the wild west synthesis PDCA
set -e

echo "🔧 Fixing local file links in wild west synthesis PDCA"

PDCA_FILE="/workspace/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1540-wild-west-safe-merge-synthesis.md"
BACKUP_FILE="${PDCA_FILE}.bak"

# Create backup
echo "📄 Creating backup: ${BACKUP_FILE}"
cp "$PDCA_FILE" "$BACKUP_FILE"

# The relative path from the PDCA file to project root is 7 levels up
RELATIVE_PREFIX="../../../../../.."

echo "📍 Using relative prefix: $RELATIVE_PREFIX"

# Fix the local file links - replace absolute paths from project root with relative paths
echo "🔧 Fixing local file links..."

sed -i.tmp \
    -e "s|\[scrum\.pmo/project\.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1540-wild-west-safe-merge-synthesis\.md\](scrum\.pmo/project\.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1540-wild-west-safe-merge-synthesis\.md)|[scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1540-wild-west-safe-merge-synthesis.md](${RELATIVE_PREFIX}/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1540-wild-west-safe-merge-synthesis.md)|g" \
    -e "s|\[scrum\.pmo/project\.journal/2025-08-24-consolidated-learning/pdca-wild-west-workflow\.md\](scrum\.pmo/project\.journal/2025-08-24-consolidated-learning/pdca-wild-west-workflow\.md)|[scrum.pmo/project.journal/2025-08-24-consolidated-learning/pdca-wild-west-workflow.md](${RELATIVE_PREFIX}/scrum.pmo/project.journal/2025-08-24-consolidated-learning/pdca-wild-west-workflow.md)|g" \
    -e "s|\[scrum\.pmo/roles/CICDAgent/PDCA/2025-08-15-UTC-0824\.md\](scrum\.pmo/roles/CICDAgent/PDCA/2025-08-15-UTC-0824\.md)|[scrum.pmo/roles/CICDAgent/PDCA/2025-08-15-UTC-0824.md](${RELATIVE_PREFIX}/scrum.pmo/roles/CICDAgent/PDCA/2025-08-15-UTC-0824.md)|g" \
    -e "s|\[scrum\.pmo/project\.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1525-branch-merging-cicd-strategies-research\.md\](scrum\.pmo/project\.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1525-branch-merging-cicd-strategies-research\.md)|[scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1525-branch-merging-cicd-strategies-research.md](${RELATIVE_PREFIX}/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-25-UTC-1525-branch-merging-cicd-strategies-research.md)|g" \
    "$PDCA_FILE"

# Remove the temporary file
rm "${PDCA_FILE}.tmp"

echo "✅ Fixed local file links with relative paths"
echo "📁 Relative path used: $RELATIVE_PREFIX"

# Test one of the links
echo "🧪 Testing link access..."
PDCA_DIR="$(dirname "$PDCA_FILE")"
cd "$PDCA_DIR"

if [ -f "${RELATIVE_PREFIX}/scrum.pmo/project.journal/2025-08-24-consolidated-learning/pdca-wild-west-workflow.md" ]; then
    echo "✅ Link test successful: wild west workflow file accessible"
else
    echo "❌ Link test failed: wild west workflow file not accessible"
fi

echo "🎉 Local link fixing complete!"
