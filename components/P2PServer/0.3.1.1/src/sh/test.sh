#!/bin/sh
# npm test → test.sh → p2pserver test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run p2pserver test (handles vitest execution, recursion prevention, and promotion)
./p2pserver test

