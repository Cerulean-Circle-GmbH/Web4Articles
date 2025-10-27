#!/bin/sh
echo "🧪 Running TestComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
