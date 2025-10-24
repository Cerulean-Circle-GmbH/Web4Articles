# moveFile Test Fixtures

## Purpose

This directory contains committed test fixtures for `moveFile` functionality tests (TC30-TC38).

## Structure

```
movefile-tests/
├── source/
│   ├── test-file-a.md  # Primary test file to be moved
│   ├── test-file-b.md  # File with link to test-file-a
│   └── test-file-c.md  # File with link to test-file-a
└── target/
    └── subdir/         # Target directory for move operations
```

## Test Strategy

Tests use a **copy-before-test** pattern:
1. Before each test: Copy files from this directory to a temp location
2. Run moveFile operations on the copies
3. Assert on the copied files
4. Clean up temp files after test

This ensures:
- Original fixtures remain unchanged
- Tests are reproducible
- No git history pollution
- Real git operations can be tested

## Files Are Committed

All files in this directory are committed to git. This allows tests to use real `git mv` commands without creating dynamic test commits that pollute the repository history.

