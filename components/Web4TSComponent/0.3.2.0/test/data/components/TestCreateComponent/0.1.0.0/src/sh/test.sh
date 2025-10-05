#!/bin/sh
echo "🧪 Running TestCreateComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
