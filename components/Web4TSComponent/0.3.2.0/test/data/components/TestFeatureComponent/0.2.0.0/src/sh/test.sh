#!/bin/sh
echo "🧪 Running TestFeatureComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
