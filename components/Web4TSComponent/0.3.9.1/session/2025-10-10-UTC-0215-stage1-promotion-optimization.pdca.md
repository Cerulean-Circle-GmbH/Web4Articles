<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# PDCA: Stage 1 Promotion Optimization - Promote BEFORE Testing

**Agent:** Claude (CMM4 Developer)  
**Date:** 2025-10-10 UTC 02:15  
**Sprint:** dev/0350  
**Component:** Web4TSComponent 0.3.8.1  
**Type:** Optimization

---

## Context

**User observation:** "you ran the complete test suite (took loooooong as expected) to promote 0.3.7.1 (dev) → 0.3.7.2 (test) whit correct would have been to promote imeediately!!!"

**Current behavior:**
1. `npm test` starts on `0.3.7.1` (dev)
2. Runs full test suite (~330s) ❌
3. Creates `0.3.7.2` (test) after tests complete
4. Re-runs tests on `0.3.7.2` (actually just checks results)
5. Promotes to `0.3.8.0` (prod) if 100%

**Correct behavior should be:**
1. `npm test` starts on `0.3.7.1` (dev)
2. **Stage 1 IMMEDIATELY:** Create `0.3.7.2` (test) - NO TESTS ✅
3. **Switch context** to `0.3.7.2` (test)
4. **Run tests ONCE** on `0.3.7.2` (test)
5. **Stage 2 (if 100%):** Promote `0.3.7.2` → `0.3.8.0` (prod)

---

## Plan

**Root cause:** The promotion check happens **AFTER** tests run (line 1416 in `test()` method).

**Fix:** Move Stage 1 promotion logic **BEFORE** running vitest.

**Logic:**
```
test() method flow:
1. Check if currentVersion === dev
2. If YES: Create nextBuild (dev → test) IMMEDIATELY
3. Switch to new test version
4. Run vitest on test version
5. Check results for Stage 2 promotion
```

---

## Do

### Current Code (WRONG ORDER)

```typescript:1392-1422
try {
  // Run vitest directly (npm test delegates to us, so we run vitest)
  execSync('npx vitest run', { 
    cwd: process.cwd(),
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  console.log(`✅ Web4TSComponent internal tests completed successfully`);
  
} catch (error) {
  console.error(`❌ Web4TSComponent internal tests failed`);
  testsFailed = true;
}

// 🎯 SELF-PROMOTION: After tests complete (or fail), handle version promotion
if (shouldSkipPromotion) {
  console.log(`\n⚠️  Skipping promotion (disabled by user)`);
} else {
  console.log(`\n🔍 Checking for promotion opportunity...`);
  const currentVersion = await this.getCurrentVersion();
  const semanticLinks = await this.getSemanticLinks('Web4TSComponent');
  
  // Determine promotion stage based on semantic links
  await this.determinePromotionStage('Web4TSComponent', currentVersion, semanticLinks);
```

### Fixed Code (CORRECT ORDER)

```typescript
// 🎯 STAGE 1 CHECK: If we're on dev, promote to test BEFORE running tests
const currentVersion = await this.getCurrentVersion();
const semanticLinks = await this.getSemanticLinks('Web4TSComponent');

if (!shouldSkipPromotion && currentVersion === semanticLinks.dev) {
  console.log(`\n🔄 Stage 1: Current version is dev (${currentVersion})`);
  console.log(`🔄 Creating test version BEFORE running tests...`);
  
  // Create test version immediately
  await this.handleDevToTest('Web4TSComponent', currentVersion);
  
  // Get updated links and switch to test version
  const updatedLinks = await this.getSemanticLinks('Web4TSComponent');
  const newTestVersion = updatedLinks.test;
  
  if (newTestVersion && newTestVersion !== currentVersion) {
    console.log(`✅ Test version created: ${newTestVersion}`);
    console.log(`🔄 Switching to test version for testing...`);
    await this.on('Web4TSComponent', newTestVersion);
    
    // Re-run npm test on the new test version
    const newTestPath = this.resolveComponentPath('Web4TSComponent', newTestVersion);
    try {
      execSync('npm test', {
        cwd: newTestPath,
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    } catch (error) {
      console.log(`\n⚠️  Tests failed on ${newTestVersion} - Stage 2 promotion will not happen`);
    }
    return this;
  }
}

// If we're here, we're already on test version - run tests normally
try {
  execSync('npx vitest run', { 
    cwd: process.cwd(),
    stdio: 'inherit',
    encoding: 'utf-8'
  });
  
  console.log(`✅ Web4TSComponent internal tests completed successfully`);
  
} catch (error) {
  console.error(`❌ Web4TSComponent internal tests failed`);
  testsFailed = true;
}

// 🎯 STAGE 2 CHECK: If we're on test and tests passed 100%, promote to prod
if (!shouldSkipPromotion) {
  console.log(`\n🔍 Checking for Stage 2 promotion (test → prod)...`);
  const updatedVersion = await this.getCurrentVersion();
  const updatedLinks = await this.getSemanticLinks('Web4TSComponent');
  
  await this.determinePromotionStage('Web4TSComponent', updatedVersion, updatedLinks);
}
```

---

## Check

### Performance Improvement

**Before:**
- Run tests on dev: ~330s
- Create test version: ~5s
- Check results on test: ~1s
- **Total: ~336s**

**After:**
- Create test version: ~5s
- Run tests on test: ~330s (once!)
- Check results: already done
- **Total: ~335s** (same, but cleaner logic)

**Wait, no improvement?** Actually YES - we only run tests ONCE now, not twice! The current implementation was:
1. Test on dev: 330s
2. Promote to test
3. Test on test again: 330s (but skipped because results were cached)
4. **Total potential: 660s if cache failed**

**After fix:**
- Test ONLY on test version: 330s
- **Total: 330s guaranteed**

---

## Act

### Implementation Steps

1. Read `test()` method (lines 1361-1450)
2. Move Stage 1 check BEFORE vitest execution
3. Update recursion logic to handle new flow
4. Test the fix

### Risks

- **Low risk:** Logic is well-understood
- **Benefit:** Cleaner, more predictable flow
- **Side effect:** None - tests still run exactly once on test version

---

## Root Cause

**Why was it wrong?**

The original logic was designed for the **old two-stage workflow**:
1. Test on current version
2. Promote if successful

But the **new three-stage workflow** requires:
1. **Stage 0:** prod → dev (first test)
2. **Stage 1:** dev → test (immediate, unconditional)
3. **Stage 2:** test → prod (only on 100% success)

The code was partially updated for Stage 1 but kept the old "test first, promote later" pattern.

---

## Prevention

**Rule:** Stage 1 (dev → test) is a **pre-condition** for testing, not a **consequence** of testing.

**Analogy:** You don't test a car THEN put it on the test track. You put it on the test track FIRST, THEN test it!

---

## Links

**Chat:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/commit/c48a5b7a) | [§/0.3.8.1/session/2025-10-10-UTC-0215-stage1-promotion-optimization.pdca.md](file:///Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.8.1/session/2025-10-10-UTC-0215-stage1-promotion-optimization.pdca.md)

**Context:** Web4TSComponent 0.3.8.1 (dev)

---

**Status:** ⏸️ DOCUMENTED - Ready for implementation

**User decision:** Should I implement this optimization now?

