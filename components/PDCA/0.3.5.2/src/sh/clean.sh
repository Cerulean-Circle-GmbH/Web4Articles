# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

echo "🧹 Cleaning all artifacts..."
rm -rf dist
rm -rf node_modules
# Note: Global node_modules at project root is NOT cleaned by component clean
# Use 'npm run clean:global' at project root to clean global node_modules
