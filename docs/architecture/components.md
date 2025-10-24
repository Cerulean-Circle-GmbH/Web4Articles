<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../LICENSE) and AI-GPL Addendum (../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Components Architecture (First Principle)

- Each major unit is a component (e.g., `TSRanger`, `GitScrumProject`).
- Each component lives in its own repository and is consumed as a submodule.
- Versions are maintained as dedicated branches per runtime target (e.g., `main`, `n14.4`, `njs14`).
- The root project orchestrates, aggregates docs, and runs integration tests only.

## Layout
```
components/
  TSRanger/         # submodule
  GitScrumProject/  # submodule
```

## Versioning branches per component
- `main`: latest Node LTS
- `n14.4`: Node 14.21.3 compatible
- `njs14`: ES2015 + .js specifiers

## Submodule operations
- Add: `git submodule add <repo-url> components/<Name>`
- Update: `git submodule update --remote --recursive`
- Checkout branch in all: `tools/submodules/checkout-branch <branch>`

## Rationale
- Enforces clear boundaries, independent versioning, and reuse.
- Simplifies backports without polluting mainline code.