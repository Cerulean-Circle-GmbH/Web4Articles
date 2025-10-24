# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

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

