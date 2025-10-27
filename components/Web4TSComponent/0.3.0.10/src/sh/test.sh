#!/bin/sh
echo "🧪 Running Web4TSComponent tests..."

# Prepare (clean, install, build)
./src/sh/build.sh

# Run tests
npm run vitest
