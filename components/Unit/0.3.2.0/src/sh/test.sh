#!/bin/sh
echo "🧪 Running Unit tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
