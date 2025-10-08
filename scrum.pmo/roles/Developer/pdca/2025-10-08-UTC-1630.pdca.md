# PDCA: Two-Stage Promotion Workflow - Critical Design Fix

**Date:** 2025-10-08 16:30 UTC  
**Type:** Critical Bug Fix  
**Severity:** HIGH  
**CMM Level:** 3 (Defined Process)

## PLAN

### Problem Statement
The promotion workflow was incorrectly implemented as a single-stage process, violating the intended design:

**Current Implementation (WRONG):**
```
0.3.4.1 (dev) → npm test passes 100%
  ↓
Creates 0.3.5.0 (nextPatch) → prod
Creates 0.3.5.1 (nextBuild) → dev, test
```

**Correct Two-Stage Workflow:**
```
STAGE 1: First npm test (any result)
0.3.4.1 (dev) → npm test (first run)
  ↓
Creates 0.3.4.2 (nextBuild) → test
Original 0.3.4.1 remains as dev

STAGE 2: 100% test pass
0.3.4.2 (test) → npm test passes 100%
  ↓
Creates 0.3.5.0 (nextMinor) → prod
Creates 0.3.5.1 (nextBuild) → dev, test
```

### Root Cause
The developer (AI) misunderstood the workflow and implemented only Stage 2, skipping Stage 1 entirely. This means:
- First test run immediately jumps to nextPatch (wrong!)
- No intermediate "test" stage for iterative development
- Violates the dev → test → prod progression principle

### Goal
Implement the correct two-stage promotion workflow:
1. **Stage 1:** dev → test (on first test run, any result)
2. **Stage 2:** test → prod + new dev (on 100% test pass)

### Success Criteria
1. First `npm test` promotes dev to test (nextBuild)
2. Subsequent tests on same version don't re-promote
3. 100% test pass promotes test to prod (nextMinor)
4. New dev version created after prod promotion
5. Workflow matches: 0.3.4.1 → 0.3.4.2 → 0.3.5.0 → 0.3.5.1

## DO

### Current Code Analysis

**Location:** `components/Web4TSComponent/0.3.4.1/src/ts/layer2/DefaultWeb4TSComponent.ts`

**Current `handleTestSuccessPromotion()` (Lines 1418-1505):**
```typescript
async handleTestSuccessPromotion(componentName: string, currentVersion: string): Promise<void> {
  // Safety checks...
  
  console.log(`🚀 100% test success confirmed! Starting version promotion workflow...`);
  
  try {
    // Step 1: Create nextPatch version from current
    const nextPatchVersion = await this.createNextPatchVersion(componentName, currentVersion);
    
    // Step 2: Set nextPatch as new prod
    await this.createSemanticLink(componentName, 'prod', nextPatchVersion);
    
    // Step 3: Create nextBuild version for development
    const nextBuildVersion = await this.createNextBuildVersion(componentName, nextPatchVersion);
    
    // Step 4: Set nextBuild as dev and test
    await this.createSemanticLink(componentName, 'dev', nextBuildVersion);
    await this.createSemanticLink(componentName, 'test', nextBuildVersion);
    
    // Step 5: Update latest to nextPatch
    await this.createSemanticLink(componentName, 'latest', nextPatchVersion);
  }
}
```

**Problems:**
1. Uses `nextPatch` instead of `nextMinor` for prod promotion
2. No Stage 1 (dev → test) implementation
3. Assumes every test run is a 100% success
4. Creates both prod and new dev in one step

### Implementation Plan

**1. Create `handleFirstTestRun()` - Stage 1:**
```typescript
/**
 * Handle first test run: promote dev to test
 * Stage 1: dev → test (nextBuild)
 * @cliHide
 */
private async handleFirstTestRun(componentName: string, currentVersion: string): Promise<void> {
  console.log(`\n🧪 First test run detected for ${componentName} ${currentVersion}`);
  console.log(`📋 Workflow Stage 1: dev → test (nextBuild)`);
  
  // Check if this version is already test
  const semanticLinks = await this.getSemanticLinks(componentName);
  if (semanticLinks.test === currentVersion) {
    console.log(`⚠️  Version ${currentVersion} is already marked as test - skipping Stage 1`);
    return;
  }
  
  try {
    // Create nextBuild version (increment build number)
    console.log(`\n🔧 Creating nextBuild version from ${currentVersion}...`);
    const nextBuildVersion = await this.createNextBuildVersion(componentName, currentVersion);
    
    // Set nextBuild as test
    console.log(`\n🧪 Setting ${nextBuildVersion} as test version...`);
    await this.createSemanticLink(componentName, 'test', nextBuildVersion);
    
    console.log(`\n✅ Stage 1 complete: ${currentVersion} (dev) → ${nextBuildVersion} (test)`);
    console.log(`📊 Next step: Work on ${nextBuildVersion} until 100% test coverage`);
    
  } catch (error) {
    console.error(`❌ Stage 1 promotion failed: ${(error as Error).message}`);
    throw error;
  }
}
```

**2. Fix `handleTestSuccessPromotion()` - Stage 2:**
```typescript
/**
 * Handle 100% test success: promote test to prod, create new dev
 * Stage 2: test → prod (nextMinor) + new dev (nextBuild)
 * @cliHide
 */
async handleTestSuccessPromotion(componentName: string, currentVersion: string): Promise<void> {
  console.log(`\n🎯 Analyzing test success for version promotion...`);
  
  // 🚨 CRITICAL: Never promote when in test environment (test/data)
  if (this.isTestEnvironment()) {
    console.log(`⚠️  Skipping promotion: Running in test environment`);
    console.log(`💡 Promotions only happen in real component directories, not test/data`);
    return;
  }
  
  // Safety check: verify this version is currently 'test'
  const semanticLinks = await this.getSemanticLinks(componentName);
  const currentTest = semanticLinks.test;
  
  if (currentTest !== currentVersion) {
    console.log(`⚠️  Skipping Stage 2: Current version (${currentVersion}) is not the test version`);
    console.log(`💡 Current test version is: ${currentTest || 'none'}`);
    console.log(`💡 Only the test version can be promoted to prod`);
    return;
  }
  
  // Safety check: verify this version hasn't already been promoted
  const currentProd = semanticLinks.prod;
  if (currentProd === currentVersion) {
    console.log(`⚠️  Version ${currentVersion} is already marked as prod - skipping promotion`);
    console.log(`💡 This prevents accidental double promotion`);
    return;
  }
  
  console.log(`🚀 100% test success confirmed! Starting Stage 2 promotion workflow...`);
  console.log(`📋 Workflow Stage 2: test → prod (nextMinor) + new dev (nextBuild)`);
  
  try {
    // Step 1: Create nextMinor version from current (test becomes prod)
    console.log(`\n🔧 Step 1: Creating nextMinor version from ${currentVersion}...`);
    const nextMinorVersion = await this.createNextMinorVersion(componentName, currentVersion);
    
    // Step 2: Set nextMinor as new prod
    console.log(`\n🚀 Step 2: Promoting ${nextMinorVersion} to prod...`);
    await this.createSemanticLink(componentName, 'prod', nextMinorVersion);
    console.log(`✅ Prod updated: prod → ${nextMinorVersion}`);
    
    // Step 3: Update latest to nextMinor (the new stable)
    console.log(`\n📦 Step 3: Updating latest to stable version...`);
    await this.createSemanticLink(componentName, 'latest', nextMinorVersion);
    console.log(`✅ Latest updated: latest → ${nextMinorVersion}`);
    
    // Step 4: Create nextBuild version for new development cycle
    console.log(`\n🔧 Step 4: Creating nextBuild version for development...`);
    const nextBuildVersion = await this.createNextBuildVersion(componentName, nextMinorVersion);
    
    // Step 5: Set nextBuild as new dev and test
    console.log(`\n🚧 Step 5: Setting up development workflow...`);
    await this.createSemanticLink(componentName, 'dev', nextBuildVersion);
    await this.createSemanticLink(componentName, 'test', nextBuildVersion);
    console.log(`✅ Dev updated: dev → ${nextBuildVersion}`);
    console.log(`✅ Test updated: test → ${nextBuildVersion}`);
    
    console.log(`\n🎉 Stage 2 promotion workflow completed successfully!`);
    console.log(`📊 Final state:`);
    console.log(`   🚀 prod:   ${nextMinorVersion} (promoted from ${currentVersion})`);
    console.log(`   📦 latest: ${nextMinorVersion} (stable release)`);
    console.log(`   🧪 test:   ${nextBuildVersion} (ready for next cycle)`);
    console.log(`   🚧 dev:    ${nextBuildVersion} (active development)`);
    
  } catch (error) {
    console.error(`❌ Stage 2 promotion failed: ${(error as Error).message}`);
    throw error;
  }
}
```

**3. Create `createNextMinorVersion()` helper:**
```typescript
/**
 * Create nextMinor version from current version
 * nextMinor increments minor version and resets patch and build to 0
 * e.g., 0.3.4.2 → 0.4.0.0
 * @cliHide
 */
private async createNextMinorVersion(componentName: string, currentVersion: string): Promise<string> {
  const originalContext = this.getComponentContext();
  
  // Temporarily set context to current version
  await this.on(componentName, currentVersion);
  
  try {
    await this.upgrade('nextMinor'); // Increment minor, reset patch and build
    
    // Calculate what the nextMinor version would be
    const parts = currentVersion.split('.').map(Number);
    const nextMinorVersion = `${parts[0]}.${parts[1] + 1}.0.0`; // Increment minor, reset others
    
    console.log(`✅ Created nextMinor version: ${nextMinorVersion}`);
    return nextMinorVersion;
    
  } finally {
    // Restore original context
    if (originalContext) {
      await this.on(originalContext.component, originalContext.version);
    }
  }
}
```

**4. Update `test()` method to determine which stage:**
```typescript
async test(enablePromotion: string = 'false'): Promise<this> {
  // ... existing test logic ...
  
  if (shouldSkipPromotion) {
    console.log(`\n⚠️  Skipping promotion (disabled by user)`);
  } else {
    console.log(`\n🔍 Checking for promotion opportunity...`);
    const currentVersion = await this.getCurrentVersion();
    
    // Determine which promotion stage to apply
    const semanticLinks = await this.getSemanticLinks('Web4TSComponent');
    const currentTest = semanticLinks.test;
    
    if (currentVersion !== currentTest) {
      // Stage 1: This is a dev version, promote to test
      await this.handleFirstTestRun('Web4TSComponent', currentVersion);
    } else {
      // Stage 2: This is the test version, check for 100% pass
      await this.handleTestSuccessPromotion('Web4TSComponent', currentVersion);
    }
  }
  
  return this;
}
```

### Workflow Example

**Starting State:**
```
0.3.4.1 → dev (current development)
0.3.4.0 → prod (previous stable)
```

**Stage 1 - First Test Run:**
```bash
cd /path/to/Web4TSComponent/0.3.4.1
npm test  # Any result (pass/fail)
```

**Result:**
```
🧪 First test run detected for Web4TSComponent 0.3.4.1
📋 Workflow Stage 1: dev → test (nextBuild)
🔧 Creating nextBuild version from 0.3.4.1...
✅ Created nextBuild version: 0.3.4.2
🧪 Setting 0.3.4.2 as test version...
✅ Stage 1 complete: 0.3.4.1 (dev) → 0.3.4.2 (test)
📊 Next step: Work on 0.3.4.2 until 100% test coverage

Current state:
  🚧 dev:  0.3.4.1 (original dev, continue work here)
  🧪 test: 0.3.4.2 (newly promoted, work toward 100%)
  🚀 prod: 0.3.4.0 (unchanged)
```

**Stage 2 - 100% Test Pass:**
```bash
cd /path/to/Web4TSComponent/0.3.4.2
# Fix all tests, achieve 100% coverage
npm test  # 100% pass
```

**Result:**
```
🎯 Analyzing test success for version promotion...
🚀 100% test success confirmed! Starting Stage 2 promotion workflow...
📋 Workflow Stage 2: test → prod (nextMinor) + new dev (nextBuild)

🔧 Step 1: Creating nextMinor version from 0.3.4.2...
✅ Created nextMinor version: 0.3.5.0

🚀 Step 2: Promoting 0.3.5.0 to prod...
✅ Prod updated: prod → 0.3.5.0

📦 Step 3: Updating latest to stable version...
✅ Latest updated: latest → 0.3.5.0

🔧 Step 4: Creating nextBuild version for development...
✅ Created nextBuild version: 0.3.5.1

🚧 Step 5: Setting up development workflow...
✅ Dev updated: dev → 0.3.5.1
✅ Test updated: test → 0.3.5.1

🎉 Stage 2 promotion workflow completed successfully!
📊 Final state:
   🚀 prod:   0.3.5.0 (promoted from 0.3.4.2)
   📦 latest: 0.3.5.0 (stable release)
   🧪 test:   0.3.5.1 (ready for next cycle)
   🚧 dev:    0.3.5.1 (active development)
```

## CHECK

### Verification Plan

**Test 1: Stage 1 Promotion (dev → test)**
```typescript
it('should promote dev to test on first test run (Stage 1)', async () => {
  // Create initial component
  await component.create('StageTest', '0.1.0.0', 'all');
  await component.on('StageTest', '0.1.0.0');
  await component.setDev('0.1.0.0');
  
  // Initial state
  let links = await component.getSemanticLinks('StageTest');
  expect(links.dev).toBe('0.1.0.0');
  expect(links.test).toBeNull(); // No test yet
  
  // First test run (Stage 1)
  await component.handleFirstTestRun('StageTest', '0.1.0.0');
  
  // Verify Stage 1 result
  links = await component.getSemanticLinks('StageTest');
  expect(links.dev).toBe('0.1.0.0'); // Still dev
  expect(links.test).toBe('0.1.0.1'); // New test (nextBuild)
  expect(existsSync(path.join(testDataDir, 'components', 'StageTest', '0.1.0.1'))).toBe(true);
});
```

**Test 2: Stage 2 Promotion (test → prod)**
```typescript
it('should promote test to prod on 100% pass (Stage 2)', async () => {
  // Create test version
  await component.create('StageTest', '0.1.0.1', 'all');
  await component.on('StageTest', '0.1.0.1');
  await component.setTest('0.1.0.1');
  await component.setProd('0.1.0.0'); // Old prod
  
  // Initial state
  let links = await component.getSemanticLinks('StageTest');
  expect(links.test).toBe('0.1.0.1');
  expect(links.prod).toBe('0.1.0.0');
  
  // 100% test pass (Stage 2)
  await component.handleTestSuccessPromotion('StageTest', '0.1.0.1');
  
  // Verify Stage 2 result
  links = await component.getSemanticLinks('StageTest');
  expect(links.prod).toBe('0.2.0.0'); // nextMinor
  expect(links.latest).toBe('0.2.0.0');
  expect(links.dev).toBe('0.2.0.1'); // New dev (nextBuild)
  expect(links.test).toBe('0.2.0.1');
  expect(existsSync(path.join(testDataDir, 'components', 'StageTest', '0.2.0.0'))).toBe(true);
  expect(existsSync(path.join(testDataDir, 'components', 'StageTest', '0.2.0.1'))).toBe(true);
});
```

**Test 3: Full Two-Stage Workflow**
```typescript
it('should complete full two-stage workflow: dev → test → prod', async () => {
  // Starting state: 0.3.4.1 as dev
  await component.create('FullWorkflow', '0.3.4.1', 'all');
  await component.on('FullWorkflow', '0.3.4.1');
  await component.setDev('0.3.4.1');
  await component.setProd('0.3.4.0'); // Previous prod
  
  // Stage 1: First test run
  await component.handleFirstTestRun('FullWorkflow', '0.3.4.1');
  let links = await component.getSemanticLinks('FullWorkflow');
  expect(links.test).toBe('0.3.4.2'); // dev → test (nextBuild)
  
  // Stage 2: 100% test pass
  await component.on('FullWorkflow', '0.3.4.2');
  await component.handleTestSuccessPromotion('FullWorkflow', '0.3.4.2');
  links = await component.getSemanticLinks('FullWorkflow');
  expect(links.prod).toBe('0.3.5.0'); // test → prod (nextMinor)
  expect(links.dev).toBe('0.3.5.1'); // New dev (nextBuild)
  expect(links.test).toBe('0.3.5.1');
});
```

### Expected Metrics
- **Stage 1 Success Rate:** 100% (always creates nextBuild)
- **Stage 2 Trigger:** Only when current version === test
- **Version Progression:** 0.3.4.1 → 0.3.4.2 → 0.3.5.0 → 0.3.5.1
- **Semantic Link Accuracy:** 100%
- **No Accidental Promotions:** 100%

## ACT

### Implementation Steps
1. ✅ Document correct workflow in PDCA
2. ⏳ Create `handleFirstTestRun()` method
3. ⏳ Create `createNextMinorVersion()` helper
4. ⏳ Fix `handleTestSuccessPromotion()` to use nextMinor
5. ⏳ Update `test()` method to choose correct stage
6. ⏳ Write comprehensive tests for both stages
7. ⏳ Update documentation and README
8. ⏳ Verify on real component (0.3.4.1 → 0.3.4.2 → 0.3.5.0 → 0.3.5.1)

### Process Improvements

**1. Design Documentation:**
- Always document multi-stage workflows with explicit stage boundaries
- Include example version progressions in comments
- Create workflow diagrams in README

**2. Code Review Checklist:**
- ✅ Verify workflow matches documented design
- ✅ Check version increment logic (build/patch/minor/major)
- ✅ Confirm semantic link updates
- ✅ Test both stages independently

**3. Testing Requirements:**
- Test each workflow stage separately
- Test full end-to-end workflow
- Test safety checks (skip conditions)
- Test edge cases (already promoted, wrong version)

### Lessons Learned

**1. Multi-Stage Workflows Need Clear State Tracking**
- Current version alone isn't enough
- Must check semantic links to determine stage
- Stage 1: Check if version is test (if not, promote)
- Stage 2: Check if version is test AND 100% pass (if yes, promote to prod)

**2. Version Increment Strategy Matters**
- dev → test: nextBuild (small increment, 0.3.4.1 → 0.3.4.2)
- test → prod: nextMinor (significant increment, 0.3.4.2 → 0.3.5.0)
- This clearly differentiates "iterative testing" from "production release"

**3. Semantic Links Are the Source of Truth**
- Don't guess promotion stage from version number
- Always check: which semantic link points to current version?
- Use this to determine: am I dev? test? prod?

**4. Safety Checks Are Critical**
- Never promote if already promoted (idempotent)
- Never promote wrong version (only test → prod)
- Never promote in test environment (test/data)

### Next Actions
1. ⏳ Implement the fixed workflow
2. ⏳ Write and run tests
3. ⏳ Update TEST_PROMOTION_STRATEGY.md with correct workflow
4. ⏳ Verify on 0.3.4.1 in production
5. 📚 Update README with two-stage workflow diagram
6. 📚 Add TSDoc comments explaining each stage
7. 🔄 Apply to other components if needed

---

**Status:** ⏳ Planned, ready for implementation  
**Impact:** CRITICAL - Fixes fundamental misunderstanding of promotion workflow  
**Follow-up:** Test on real component, update all documentation

**Key Insight:** **Two-stage workflows need explicit stage detection logic. Don't assume the current version's purpose - check the semantic links to know which stage applies.**

