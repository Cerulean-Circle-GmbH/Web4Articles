#!/bin/sh
# npm test → test.sh → democomponent test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run democomponent test (handles vitest execution, recursion prevention, and promotion)
./democomponent.sh test

