#!/bin/sh
echo "🧪 Running TestChainComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
