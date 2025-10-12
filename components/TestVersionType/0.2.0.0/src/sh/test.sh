#!/bin/sh
# npm test → test.sh → testversiontype test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run testversiontype test (handles vitest execution, recursion prevention, and promotion)
./testversiontype test

