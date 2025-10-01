#!/bin/sh
echo "🔧 Preparing Unit..."

# Clean everything
./src/sh/clean.sh

# Install dependencies and create symlink
./src/sh/install-deps.sh

# Build TypeScript
echo "🔨 Building TypeScript..."
npx tsc
