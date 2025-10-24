# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

echo "🔗 Creating symlink to shared node_modules..."
ln -sf ../../../node_modules node_modules

echo "📦 Installing component dependencies..."
npm install
