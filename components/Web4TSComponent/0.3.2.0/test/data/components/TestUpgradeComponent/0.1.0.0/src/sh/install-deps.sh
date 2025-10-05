#!/bin/sh
echo "🔗 Creating symlink to shared node_modules..."
ln -sf ../../../node_modules node_modules

echo "📦 Installing component dependencies..."
npm install
