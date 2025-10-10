#!/bin/sh
# npm test → test.sh → user test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run user test (handles vitest execution, recursion prevention, and promotion)
./user test

