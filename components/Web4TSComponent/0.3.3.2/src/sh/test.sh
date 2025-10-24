# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

echo "🧪 Running Web4TSComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests with 120-second timeout to prevent infinite loops
echo "⏱️  Running tests with 120s timeout..."
timeout 120s npm run vitest || {
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 124 ]; then
    echo "❌ Tests timed out after 120 seconds (infinite loop detected)"
    exit 124
  else
    exit $EXIT_CODE
  fi
}
