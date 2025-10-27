#!/bin/sh
# Ensure global node_modules exists first
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
