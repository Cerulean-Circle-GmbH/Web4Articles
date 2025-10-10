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

### Test Results

**Executed:** 2025-10-10 UTC 02:30

**Workflow verification:**
```
🔄 Stage 1: Current version is dev (0.3.8.1)
🔄 Promoting dev → test BEFORE running tests...
✅ Test version created: 0.3.8.2
🔄 Switching to test version for testing...

🧪 Running Web4TSComponent internal tests...
 Test Files  15 passed (15)
      Tests  144 passed (144)
   Duration  413.11s

🚀 Stage 2: test → prod (checking for 100% test success)...
✅ 100% test success verified!
🎉 Stage 2 promotion workflow completed successfully!

📊 Final state:
   🚀 prod:   0.3.9.0 (promoted from 0.3.8.2)
   📦 latest: 0.3.9.0 (stable release)
   🧪 test:   0.3.9.1 (ready for next cycle)
   🚧 dev:    0.3.9.1 (active development)
```

**✅ PERFECT!** Stage 1 happened IMMEDIATELY, tests ran ONCE on test version, Stage 2 promoted correctly!

---

## Act

### Implementation Completed

✅ **File modified:** `/Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.8.1/src/ts/layer2/DefaultWeb4TSComponent.ts`

**Changes:**
1. Moved Stage 1 check BEFORE `npx vitest run` (lines 1388-1424)
2. Stage 1 now creates test version immediately when `currentVersion === dev`
3. Automatically switches context to new test version
4. Re-runs `npm test` on test version (which then checks Stage 2)
5. Stage 2 check happens AFTER tests complete (lines 1447-1456)

**Key insight:** Stage 1 is **unconditional** (always create test from dev), Stage 2 is **conditional** (requires 100% test success).

---

## Root Cause

**Why was it wrong?**

The original logic was designed for the **old two-stage workflow**:
1. Test on current version
2. Promote if successful

But the **new three-stage workflow** requires:
1. **Stage 0:** prod → dev (first test)
2. **Stage 1:** dev → test (immediate, unconditional) ← **This was happening AFTER tests**
3. **Stage 2:** test → prod (only on 100% success)

The code was partially updated for Stage 1 but kept the old "test first, promote later" pattern.

**The fix:** Recognize that Stage 1 is a **pre-condition** for testing (happens before), while Stage 2 is a **post-condition** (happens after).

---

## Prevention

**Rule:** Stage 1 (dev → test) is a **pre-condition** for testing, not a **consequence** of testing.

**Analogy:** You don't test a car THEN put it on the test track. You put it on the test track FIRST, THEN test it!

**Enforcement:** The workflow now enforces this order at the code level. Stage 1 is checked BEFORE `npx vitest run`, Stage 2 is checked AFTER.

---

## Links

**Chat:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/commit/[pending]) | [§/0.3.9.0/session/2025-10-10-UTC-0215-stage1-promotion-optimization.pdca.md](file:///Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.9.0/session/2025-10-10-UTC-0215-stage1-promotion-optimization.pdca.md)

**Context:** Web4TSComponent 0.3.9.0 (prod)

---

**Status:** ✅ COMPLETED - Successfully implemented and tested (0.3.8.1 → 0.3.9.0)

