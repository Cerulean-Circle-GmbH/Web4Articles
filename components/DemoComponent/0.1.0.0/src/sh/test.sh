#!/bin/sh
# npm test → test.sh → vitest directly (no CLI delegation to prevent recursion)

# Smart build before testing
./src/sh/build.sh

# Run vitest directly (no delegation - prevents infinite recursion)
# If you want promotion workflow, use: web4tscomponent on DemoComponent dev test
npx vitest run

