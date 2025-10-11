#!/bin/sh
# npm test → test.sh → web4tscomponent test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run web4tscomponent test (handles vitest execution, recursion prevention, and promotion)
./web4tscomponent test

