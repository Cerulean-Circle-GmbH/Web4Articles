<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Test Validation Table - Web4TSComponent 0.3.0.9

## Test Results Summary
- **Total Tests:** 28
- **Passed:** ✅ 4
- **Failed:** ❌ 24
- **Root Cause:** Path Resolution Mismatch (component creation in `test/data`, lookup in project root)

## Test Validation Details

| # | Test Name | File | Line | Intention | Expected Result | Actual Result | Root Cause | Issue Type | Status | Todo | 🔄 vs 0.3.0.6 |
|---|-----------|------|------|-----------|-----------------|---------------|------------|------------|--------|------|-------------|
| 1 | should create component with all features | functionality.test.ts | 71 | Create component with full scaffold | ✅ Component exists in test/data | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 2 | should create component with intelligent defaults | functionality.test.ts | 85 | Create component with default options | ✅ Component exists in test/data | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 3 | should handle version bumping correctly | functionality.test.ts | 99 | Increment version numbers | ✅ New version created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 4 | should handle patch version increments | functionality.test.ts | 121 | Increment patch version | ✅ Version 0.1.0.1 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 5 | should handle minor version increments | functionality.test.ts | 134 | Increment minor version | ✅ Version 0.1.1.0 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 6 | should handle major version increments | functionality.test.ts | 141 | Increment major version | ✅ Version 0.2.0.0 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 7 | should handle breaking version increments | functionality.test.ts | 148 | Increment breaking version | ✅ Version 0.5.0.0 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 8 | should handle version next patch correctly | functionality.test.ts | 155 | Next patch version | ✅ Version 0.1.0.1 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 9 | should handle version next minor correctly | functionality.test.ts | 162 | Next minor version | ✅ Version 0.1.1.0 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 10 | should handle version next major correctly | functionality.test.ts | 169 | Next major version | ✅ Version 0.2.0.0 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 11 | should handle version next breaking correctly | functionality.test.ts | 176 | Next breaking version | ✅ Version 0.5.0.0 created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 12 | should handle version latest correctly | functionality.test.ts | 183 | Latest version reference | ✅ Latest version created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 13 | should handle version current correctly | functionality.test.ts | 190 | Current version reference | ✅ Current version found | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 14 | should handle version list correctly | functionality.test.ts | 197 | List all versions | ✅ Version list returned | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 15 | should handle version delete correctly | functionality.test.ts | 204 | Delete specific version | ✅ Version deleted | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 16 | should handle version copy correctly | functionality.test.ts | 211 | Copy version to new | ✅ Version copied | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 17 | should handle version move correctly | functionality.test.ts | 218 | Move version to new | ✅ Version moved | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 18 | should handle version archive correctly | functionality.test.ts | 225 | Archive old version | ✅ Version archived | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 19 | should handle version restore correctly | functionality.test.ts | 232 | Restore archived version | ✅ Version restored | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 20 | should handle version status correctly | functionality.test.ts | 239 | Check version status | ✅ Status returned | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 21 | should handle version info correctly | functionality.test.ts | 246 | Get version info | ✅ Info returned | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 22 | should handle version compare correctly | functionality.test.ts | 253 | Compare versions | ✅ Comparison returned | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 23 | should handle version merge correctly | functionality.test.ts | 260 | Merge versions | ✅ Versions merged | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 24 | should handle version diff correctly | functionality.test.ts | 267 | Show version diff | ✅ Diff returned | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 25 | should load component context like Unit on method | command-chaining.test.ts | 108 | Load component context | ✅ Context loaded | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 26 | should handle chained version operations | command-chaining.test.ts | 122 | Chain version commands | ✅ Operations chained | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 27 | should handle chained create operations | command-chaining.test.ts | 129 | Chain create commands | ✅ Components created | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |
| 28 | should handle chained info operations | command-chaining.test.ts | 136 | Chain info commands | ✅ Info returned | ❌ Component not found | Path Resolution Mismatch | 🚫 TEST BROKEN | 📋 Todo | 🟩 IDENTICAL |

## Passing Tests

| # | Test Name | File | Line | Intention | Expected Result | Actual Result | Root Cause | Issue Type | Status | Todo | 🔄 vs 0.3.0.6 |
|---|-----------|------|------|-----------|-----------------|---------------|------------|------------|--------|------|-------------|
| 1 | should ALARM if DefaultCLI.ts is modified | file-protection.test.ts | 15 | Detect file modifications | ✅ Alarm triggered | ✅ Alarm triggered | N/A | ✅ TEST OK | ✅ Done | 🟩 IDENTICAL |
| 2 | should ALARM if Web4TSComponentCLI.ts is modified | file-protection.test.ts | 22 | Detect file modifications | ✅ Alarm triggered | ✅ Alarm triggered | N/A | ✅ TEST OK | ✅ Done | 🟩 IDENTICAL |
| 3 | should ALARM if TSCompletion.ts is modified | file-protection.test.ts | 29 | Detect file modifications | ✅ Alarm triggered | ✅ Alarm triggered | N/A | ✅ TEST OK | ✅ Done | 🟩 IDENTICAL |
| 4 | should detect unauthorized modifications | file-protection.test.ts | 36 | Monitor file integrity | ✅ Modifications detected | ✅ Modifications detected | N/A | ✅ TEST OK | ✅ Done | 🟩 IDENTICAL |

## Fix Strategy
**Root Cause:** All failing tests create components in `test/data` but expect them in project root `components/`.
**Solution:** Implement ProjectRootMocker to redirect `process.cwd()` during tests and align component creation/lookup paths.
