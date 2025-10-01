#!/bin/sh
echo "📦 Installing dependencies at project root..."
cd ../../../ && npm install

echo "🔗 Creating symlink to shared node_modules..."
cd components/Web4TSComponent/0.3.0.10
ln -sf ../../../node_modules node_modules
