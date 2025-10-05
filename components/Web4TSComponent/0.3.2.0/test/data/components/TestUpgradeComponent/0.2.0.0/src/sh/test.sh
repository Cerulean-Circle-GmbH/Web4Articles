#!/bin/sh
echo "🧪 Running TestUpgradeComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
