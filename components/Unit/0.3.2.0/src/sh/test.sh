#!/bin/sh
echo "🧪 Running Unit tests..."

# Prepare (clean, install, build)
./src/sh/build.sh

# Run tests
npm run vitest
