#!/bin/sh
# npm test → test.sh → demoweb4component test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run demoweb4component test (handles vitest execution, recursion prevention, and promotion)
./demoweb4component test

