#!/bin/sh
# npm test → test.sh → once test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run once test (handles vitest execution, recursion prevention, and promotion)
./once test

