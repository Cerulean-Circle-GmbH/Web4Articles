# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

echo "🚀 Starting TestVersionType (full clean)..."

# Full clean (local + global)
./src/sh/clean.sh

# Install dependencies and create symlink
./src/sh/install-deps.sh

# Build TypeScript
echo "🔨 Building TypeScript..."
npx tsc

# Run component
npm run component
