#!/bin/sh
echo "🧪 Running Web4TSComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
