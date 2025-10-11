#!/bin/sh
# npm test → test.sh → wsserver test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run wsserver test (handles vitest execution, recursion prevention, and promotion)
./wsserver test

