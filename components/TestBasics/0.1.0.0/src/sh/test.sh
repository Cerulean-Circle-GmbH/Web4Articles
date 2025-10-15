#!/bin/sh
# npm test → test.sh → testbasics test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run testbasics test (handles vitest execution, recursion prevention, and promotion)
./testbasics test

