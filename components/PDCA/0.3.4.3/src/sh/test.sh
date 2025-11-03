#!/bin/sh
# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

# npm test → test.sh → pdca test → vitest (with recursion prevention & promotion)

# Smart build before testing
./src/sh/build.sh

# Run pdca test (handles vitest execution, recursion prevention, and promotion)
./pdca test

