#!/bin/sh
# npm test → test.sh → testliteral test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run testliteral test (handles vitest execution, recursion prevention, and promotion)
./testliteral test

