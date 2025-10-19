#!/bin/sh
# npm test → test.sh verbose → web4tscomponent test (verbose) → vitest (with recursion prevention & promotion)
# Direct test.sh call → silent build

MODE=${1:-silent}

if [ "$MODE" = "verbose" ]; then
    # Verbose build (npm test / npm run build)
    ./src/sh/build.sh verbose
else
    # Silent build (implicit builds)
    ./src/sh/build.sh
fi

# Run web4tscomponent test (handles vitest execution, recursion prevention, and promotion)
./web4tscomponent test

