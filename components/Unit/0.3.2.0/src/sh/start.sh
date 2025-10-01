#!/bin/sh
echo "🚀 Starting Unit (normal)..."

# Clean local artifacts
./src/sh/clean-local.sh

# Install dependencies and create symlink
./src/sh/install-deps.sh

# Build TypeScript
echo "🔨 Building TypeScript..."
npx tsc

# Run component
npm run component
