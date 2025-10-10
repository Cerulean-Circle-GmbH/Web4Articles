#!/bin/sh
# Dirtpig Detection Script
# Detects leftover test artifacts, stale docs, and version mismatches

echo "🐷 Web4TSComponent Dirtpig Detection"
echo "====================================="
echo ""

CURRENT_VERSION=$(basename "$PWD")
ERRORS=0

# 1. Check for wrong version in docs
echo "1️⃣  Checking for version mismatches in docs..."
if [ -f "CONTEXT_METHODS_AUDIT.md" ] || [ -f "TEST_SUMMARY.md" ]; then
  for doc in CONTEXT_METHODS_AUDIT.md TEST_SUMMARY.md; do
    if [ -f "$doc" ]; then
      # Extract versions mentioned in the doc
      WRONG_VERSIONS=$(grep -o "Web4TSComponent [0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+" "$doc" | grep -v "$CURRENT_VERSION" | sort -u)
      if [ -n "$WRONG_VERSIONS" ]; then
        echo "   ❌ $doc contains wrong versions:"
        echo "$WRONG_VERSIONS" | sed 's/^/      /'
        ERRORS=$((ERRORS + 1))
      fi
    fi
  done
fi

# 2. Check for leftover test scripts in root
echo "2️⃣  Checking for test scripts in root..."
TEST_SCRIPTS=$(find . -maxdepth 1 -name "*test*.sh" -o -name "*demo*.sh" -o -name "*component*.sh" 2>/dev/null | grep -v "^./web4tscomponent$")
if [ -n "$TEST_SCRIPTS" ]; then
  echo "   ❌ Found test scripts in root:"
  echo "$TEST_SCRIPTS" | sed 's/^/      /'
  ERRORS=$((ERRORS + 1))
fi

# 3. Check for backup/temp files
echo "3️⃣  Checking for backup/temp files..."
BACKUP_FILES=$(find . -maxdepth 2 -type f \( -name "*.backup" -o -name "*.old" -o -name "*.tmp" -o -name "*~" -o -name "*.bak" -o -name "*VERIFICATION*" \) 2>/dev/null)
if [ -n "$BACKUP_FILES" ]; then
  echo "   ❌ Found backup/temp files:"
  echo "$BACKUP_FILES" | sed 's/^/      /'
  ERRORS=$((ERRORS + 1))
fi

# 4. Check for broken symlinks
echo "4️⃣  Checking for broken symlinks..."
BROKEN_SYMLINKS=$(find . -maxdepth 1 -type l ! -exec test -e {} \; -print 2>/dev/null)
if [ -n "$BROKEN_SYMLINKS" ]; then
  echo "   ❌ Found broken symlinks:"
  echo "$BROKEN_SYMLINKS" | sed 's/^/      /'
  ERRORS=$((ERRORS + 1))
fi

# 5. Check for stale node_modules (should be symlink to shared)
echo "5️⃣  Checking node_modules..."
if [ -d "node_modules" ] && [ ! -L "node_modules" ]; then
  echo "   ⚠️  node_modules is a directory (should be symlink to shared)"
  echo "      This violates DRY principle but is not critical"
fi

echo ""
echo "====================================="
if [ $ERRORS -eq 0 ]; then
  echo "✅ No dirtpigs detected! Component is clean."
  exit 0
else
  echo "❌ Found $ERRORS dirtpig issue(s)!"
  echo ""
  echo "💡 Cleanup suggestions:"
  echo "   - Remove docs with wrong versions"
  echo "   - Delete test scripts from root"
  echo "   - Clean up backup/temp files"
  echo "   - Fix broken symlinks"
  exit 1
fi

