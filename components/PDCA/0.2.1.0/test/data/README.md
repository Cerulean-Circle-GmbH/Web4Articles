<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../../LICENSE) and AI-GPL Addendum (../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Test Data Directory

This directory contains **stable test fixtures** for the PDCA component test suite.

## Purpose

Tests must be **CMM3-compliant**: reproducible, verifiable, and never assume external state.

All test fixtures here are:
- ✅ **Version-controlled** (committed to git)
- ✅ **Stable** (never modified during manual testing)
- ✅ **Documented** (purpose clearly stated)
- ✅ **Verified** (tests check fixture exists before using)

## Fixtures

### `dual-link-tests/`

Test fixtures for dual link functionality testing.

| File | Purpose | Used By |
|------|---------|---------|
| `tc22-5-target.feature.pdca.md` | Real scenario test target | TC22.5 |
| `stable-target.md` | Generic test target | TC1, TC3, TC4 |
| `test-pdca-with-links.md` | Contains dual links for scanning tests | TC11, TC19 |

## CMM3 Principle

❌ **DON'T:** Assume files exist
```typescript
// Bad: Assumes README.md exists
pdca.getDualLink('README.md')
```

✅ **DO:** Verify and use controlled fixtures
```typescript
// Good: Use fixture and verify it exists
beforeAll(() => {
  if (!existsSync(FIXTURES.TARGET)) {
    throw new Error('Test fixture missing!');
  }
});
pdca.getDualLink(FIXTURES.TARGET)
```

## Adding New Fixtures

1. Create fixture file in appropriate subdirectory
2. Add entry to this README
3. Commit fixture to git
4. Update test to verify fixture exists in `beforeAll`

---

**Never assume. Always verify.** ✅

