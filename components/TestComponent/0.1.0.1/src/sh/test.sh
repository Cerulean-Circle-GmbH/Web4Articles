#!/bin/sh
# npm test → test.sh → testcomponent test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run testcomponent test (handles vitest execution, recursion prevention, and promotion)
./testcomponent test

