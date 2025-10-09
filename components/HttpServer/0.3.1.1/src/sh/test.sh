#!/bin/sh
# npm test → test.sh → httpserver test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run httpserver test (handles vitest execution, recursion prevention, and promotion)
./httpserver test

