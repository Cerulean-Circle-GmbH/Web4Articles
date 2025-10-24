<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Test Validation Table - Web4TSComponent 0.3.0.6

**Generated:** 2025-09-25-UTC-1030  
**Source:** [Detailed Test Validation Analysis](../../../scrum.pmo/project.journal/2025-09-24-UTC-0948-session/2025-09-24-UTC-1740-detailed-test-validation-analysis.md)  
**Overall Results:** 28 tests total, 13 passed, 15 failed (53.6% failure rate)

## Failed Tests Analysis

| # | Test Name | File | Line | Intention | Expected Result | Actual Result | Root Cause | Issue Type | Status | Todo |
|---|-----------|------|------|-----------|-----------------|---------------|------------|------------|--------|------|
| 1 | should handle component creation via CLI | [functionality.test.ts](web4tscomponent.functionality.test.ts#L91) | 91 | Verify CLI component creation | ✅ `existsSync(...) = true` | ❌ `false` | Test expects project root, component created in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 2 | should upgrade to next build (patch) version | [functionality.test.ts](web4tscomponent.functionality.test.ts#L102) | 102 | Test semantic versioning upgrade | ✅ Component found at project root | ❌ `Component not found: TestUpgradeComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 3 | should upgrade to next minor version | [functionality.test.ts](web4tscomponent.functionality.test.ts#L113) | 113 | Test minor version upgrade | ✅ Component found at project root | ❌ `Component not found: TestUpgradeComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 4 | should upgrade to next major version | [functionality.test.ts](web4tscomponent.functionality.test.ts#L124) | 124 | Test major version upgrade | ✅ Component found at project root | ❌ `Component not found: TestUpgradeComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 5 | should upgrade to explicit version | [functionality.test.ts](web4tscomponent.functionality.test.ts#L135) | 135 | Test explicit version upgrade | ✅ Component found at project root | ❌ `Component not found: TestUpgradeComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 6 | should preserve all files during upgrade | [functionality.test.ts](web4tscomponent.functionality.test.ts#L146) | 146 | Test file preservation in upgrade | ✅ Component found at project root | ❌ `Component not found: TestUpgradeComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 7 | should support full command chaining pattern | [functionality.test.ts](web4tscomponent.functionality.test.ts#L160) | 160 | Test command chaining integration | ✅ Component found at project root | ❌ `Component not found: TestFeatureComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 8 | should maintain context through multiple operations | [functionality.test.ts](web4tscomponent.functionality.test.ts#L171) | 171 | Test context preservation | ✅ Component found at project root | ❌ `Component not found: TestFeatureComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 9 | should execute on method via CLI | [functionality.test.ts](web4tscomponent.functionality.test.ts#L195) | 195 | Test CLI integration | ✅ CLI execution success | ❌ `process.exit unexpectedly called with "1"` | CLI uses same component lookup logic | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 10 | should execute upgrade via CLI after on | [functionality.test.ts](web4tscomponent.functionality.test.ts#L208) | 208 | Test CLI command chaining | ✅ CLI execution success | ❌ `process.exit unexpectedly called with "1"` | CLI uses same component lookup logic | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 11 | should create same structure as Web4TSComponent 1.0.0.0 | [functionality.test.ts](web4tscomponent.functionality.test.ts#L253) | 253 | Test feature equivalence | ✅ File structure exists | ❌ `expected false to be true` | File checks use hardcoded project root paths | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 12 | should load component context like Unit on method | [command-chaining.test.ts](web4tscomponent.command-chaining.test.ts#L58) | 58 | Test component context loading | ✅ Component found at project root | ❌ `Component not found: TestChainComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 13 | should enable command chaining after context loading | [command-chaining.test.ts](web4tscomponent.command-chaining.test.ts#L77) | 77 | Test chaining enablement | ✅ Component found at project root | ❌ `Component not found: TestChainComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 14 | should increment patch version (nextBuild) | [command-chaining.test.ts](web4tscomponent.command-chaining.test.ts#L86) | 86 | Test patch version increment | ✅ Component found at project root | ❌ `Component not found: TestChainComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |
| 15 | should increment minor version (nextMinor) | [command-chaining.test.ts](web4tscomponent.command-chaining.test.ts#L97) | 97 | Test minor version increment | ✅ Component found at project root | ❌ `Component not found: TestChainComponent v0.1.0.0` | on() method looks at project root, component in test/data | 🚫 TEST BROKEN | ✅ Mocking | 📋 Path align |