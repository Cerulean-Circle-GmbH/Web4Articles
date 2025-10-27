#!/bin/sh
echo "🧪 Running DemoComponent tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
