#!/bin/sh
# npm test → test.sh → pdca test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run pdca test (handles vitest execution, recursion prevention, and promotion)
./pdca test

