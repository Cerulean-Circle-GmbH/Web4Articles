#!/bin/sh
echo "🧪 Running GitScrumProject tests..."

# Smart build before testing
./src/sh/build.sh

# Run tests
npm run vitest
