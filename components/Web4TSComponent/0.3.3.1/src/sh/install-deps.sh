# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

if [ ! -d "../../../node_modules" ]; then
    echo "📦 Creating global node_modules..."
    cd ../../..
    npm install
    cd - > /dev/null
fi

echo "📦 Installing component dependencies..."
npm install

echo "🔗 Replacing with symlink to shared node_modules (DRY principle)..."
rm -rf node_modules
ln -sf ../../../node_modules node_modules
echo "✅ Component uses globally shared dependencies"
