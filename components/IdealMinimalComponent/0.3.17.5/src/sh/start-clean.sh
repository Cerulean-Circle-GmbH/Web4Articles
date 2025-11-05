#!/bin/sh
echo "🚀 Starting IdealMinimalComponent (full clean)..."

# Full clean (local + global)
./src/sh/clean.sh

# Install dependencies and create symlink
./src/sh/install-deps.sh

# Build TypeScript
echo "🔨 Building TypeScript..."
npx tsc

# Run component
npm run component
