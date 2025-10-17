#!/bin/sh
# npm test → test.sh → web4programmer test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run web4programmer test (handles vitest execution, recursion prevention, and promotion)
./web4programmer test

