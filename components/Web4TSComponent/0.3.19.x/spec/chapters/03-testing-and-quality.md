# Chapter 3: Testing & Quality Assurance

**Document:** Web4TSComponent Technical Specification  
**Chapter:** Testing, Quality & Workflows  
**Focus:** How to test and validate components

[← Back to Index](../component.spec.md)

---

## 🔄 Development Workflow Reminder

Web4TSComponent enforces a **systematic development workflow**:

```
🔄 WORKFLOW CYCLE:

1. 🚧 Work on dev version
   → Implement features
   → Add methods
   → Fix issues

2. 🧪 Run test on dev version
   → If dev === test: auto-creates nextBuild
   → Switches context to new build
   → Runs tests

3. ✅ Tests Pass (100%):
   → Automatic version promotion
   → New prod version created
   → New dev version ready
   → Continue at step 1

4. ❌ Tests Fail:
   → Stay on test version
   → Fix issues
   → Re-run tests
   → Loop until success
```

### Never Do This:

- ❌ Work directly on prod version
- ❌ Skip testing before promotion
- ❌ Manually edit version numbers
- ❌ Create real node_modules directories
- ❌ Break the test → dev cycle
- ❌ Edit CLI files manually

### Always Do This:

- ✅ Work on dev until ready to test
- ✅ Test thoroughly before promotion
- ✅ Use automatic version promotion
- ✅ Maintain symlinked node_modules
- ✅ Follow the systematic workflow
- ✅ Use `npm start` for components

## 6. Testing Specification

### Simple Test Command:

```bash
cd /Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.5.1

# Just run npm test - that's it!
npm test

# DO NOT filter output with 2>&1, grep, tail, etc.
# Let the test output flow naturally - we built in all the redirections!
```

### What Happens When You Test:

1. **Smart Build** - Automatically rebuilds only if source files changed
2. **Run Vitest** - Executes comprehensive test suites (sequential, not parallel)
3. **Test Logging** - Output automatically saved to `test/logs/test-YYYYMMDD-HHMMSS.log`
4. **Verify DRY Compliance** - Ensures no node_modules duplication
5. **Test Success Verification** - Checks for 100% test pass rate
6. **Automatic Promotion** - If 100% success, triggers version promotion workflow

**⚠️ CRITICAL: Never filter test output!**
- ❌ DON'T: `npm test 2>&1 | tail -100` (makes you blind to test failures)
- ❌ DON'T: `npm test | grep something` (hides important context)
- ✅ DO: Just `npm test` - all output is already logged to `test/logs/`

### 🔧 Testing Generated Components (DemoComponent, etc.)

Generated components have **two ways** to run tests:

**Option 1: Simple Testing (no promotion) ← DEFAULT**
```bash
cd components/DemoComponent
npm test  # Runs vitest directly, no version promotion
```
- ✅ Fast iteration during development
- ✅ No setup required
- ❌ No automatic version promotion

**Option 2: Testing with Promotion Workflow**
```bash
# REQUIRED: Source the environment first
source source.env

# Set up semantic links
web4tscomponent on DemoComponent 0.1.0.0
web4tscomponent setDev 0.1.0.0

# Run with promotion workflow
web4tscomponent on DemoComponent dev test
```
- ✅ Automatic version promotion on 100% success
- ✅ Uses Web4TSComponent's proven promotion infrastructure
- ⚠️  Requires manual setup (semantic links)

**Why Two Modes?**
1. **`npm test`** is for rapid development - run tests quickly without promotion overhead
2. **`web4tscomponent on Component dev test`** is for release preparation - validates 100% success and promotes versions

**Important:** Generated components do NOT auto-promote on `npm test` by design. This prevents accidental promotions during development. Use the Web4TSComponent promotion workflow when you're ready to release.

---

## 🎉 What Happens on 100% Test Success?

When tests achieve **100% success**, Web4TSComponent triggers an **automatic version promotion workflow**. This is a CMM4 feedback loop system that systematically promotes versions through the development lifecycle.

### Automatic Version Promotion Workflow:

```
🎯 Starting Point: Version 0.3.3.2 (test version)
        ⬇️
🔧 Step 1: Create nextPatch
        → Increment patch: 0.3.3.2 → 0.3.4.0
        → Reset build number to 0
        ⬇️
🚀 Step 2: Promote to Production
        → Set prod symlink → 0.3.4.0
        → This version is now production-ready
        ⬇️
📦 Step 3: Update Latest
        → Set latest symlink → 0.3.4.0
        → Stable release for consumers
        ⬇️
🔧 Step 4: Create Next Development Version
        → Create nextBuild: 0.3.4.1
        → Ready for next development cycle
        ⬇️
🚧 Step 5: Set Development Workflow
        → Set dev symlink → 0.3.4.1
        → Set test symlink → 0.3.4.1
        → Continue development immediately
```

### Final State After 100% Test Success:

```
🚀 prod:   0.3.4.0  (promoted from tested version)
📦 latest: 0.3.4.0  (stable release)
🧪 test:   0.3.4.1  (ready for next test cycle)
🚧 dev:    0.3.4.1  (active development continues)
```

### Workflow Safety Features:

- ✅ **Prevents Double Promotion** - Won't promote if version is already prod
- ✅ **Verification Check** - Confirms 100% test success before promotion
- ✅ **Atomic Operations** - Each step completes before next begins
- ✅ **Clear Status Messages** - Always know what's happening
- ✅ **Error Recovery** - Manual intervention possible if needed

**Related:** See [Development Workflow](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/03-testing-and-quality.md#-development-workflow-reminder) | [chapters/03-testing-and-quality.md](chapters/03-testing-and-quality.md#-development-workflow-reminder) for the complete dev → test → prod cycle

### PDCA Integration:

This workflow implements **PDCA (Plan-Do-Check-Act)** at CMM4 level:

- **Plan:** Develop features on dev version
- **Do:** Execute implementation and testing
- **Check:** Run comprehensive test suite (this step)
- **Act:** Automatic promotion on success, iteration on failure

---

## 🆕 What's New in Version 0.3.3.2?

### DRY Compliance Test Suite

Version 0.3.3.2 introduces comprehensive **DRY (Don't Repeat Yourself) Principle enforcement** through automated testing:

#### New Test: `web4tscomponent.dry-compliance.test.ts`

This test suite prevents "junior hacking" behavior by enforcing:

1. **Symlinked node_modules Verification**
   - Ensures components use symlinks, NOT real directories
   - Detects DRY violations (duplicated dependencies)
   - Verifies only ONE global node_modules at project root

2. **Template Validation**
   - Validates `install-deps.sh` has correct order
   - Ensures `npm install` runs BEFORE symlink creation
   - Checks for global node_modules verification logic

3. **Multiple Component Compliance**
   - Tests that multiple components share dependencies
   - Verifies no dependency duplication across components
   - Confirms economic efficiency (storage and build time)

#### Why This Matters:

**Problem:** Previous agents would break the DRY principle by creating real node_modules directories in components, causing:
- Massive disk space waste (GB per component)
- Slower builds (duplicate npm installs)
- Inconsistent dependency versions
- CMM1 chaos instead of CMM3+ systematic approach

**Solution:** Automated detection and prevention through test suite that fails if DRY violations exist.

---

## 🧪 Comprehensive Test Suites

Version 0.3.3.2 includes **12 test suites** with sequential execution (prevents race conditions):

### Test Suite Breakdown:

| # | Test Suite | Purpose | Status |
|---|------------|---------|--------|
| 1 | `web4tscomponent.functionality.test.ts` | Component creation, versioning, upgrades | ✅ Core |
| 2 | `web4tscomponent.command-chaining.test.ts` | Method chaining, context loading | ✅ Core |
| 3 | `web4tscomponent.context-pattern.test.ts` | Context-aware operations | ✅ Core |
| 4 | `web4tscomponent.dry-compliance.test.ts` | **NEW!** DRY principle enforcement | ✅ NEW |
| 5 | `web4tscomponent.dirtpig-detection.test.ts` | Unauthorized file modification detection | ✅ Protection |
| 6 | `web4tscomponent.file-protection.test.ts` | Protected file integrity checks | ✅ Protection |
| 7 | `web4tscomponent.integration-success.test.ts` | Self-management capabilities | ✅ Integration |
| 8 | `web4tscomponent.real-usage.test.ts` | Real-world usage patterns | ✅ Validation |
| 9 | `web4tscomponent.symlink-management.test.ts` | Semantic version links (dev/test/prod) | ✅ Workflow |
| 10 | `web4tscomponent.version-display.test.ts` | Version display and formatting | ✅ Display |
| 11 | `web4tscomponent.version-promotion.test.ts` | Automatic promotion workflow | ✅ Workflow |
| 12 | `web4tscomponent.working-demo.test.ts` | Working demonstrations | ✅ Demo |

### Test Configuration:

```typescript
// vitest.config.ts - Ensures reliable test execution
{
  pool: 'forks',
  poolOptions: {
    forks: {
      singleFork: true  // Sequential execution prevents race conditions
    }
  },
  fileParallelism: false,
  maxConcurrency: 1
}
```

### Test Isolation Strategy:

- **Self-Discovering Project Root** - TypeScript uses `import.meta.url` to find its location and walks up to find project root (looks for `components/` directory)
- **Copy, Not Mock** - Components are physically copied to `test/data` (excluding `test/` and `node_modules/` to avoid recursion)
- **Direct Node Wrappers** - Fresh shell scripts generated that call `node .../CLI.js` directly
- **beforeEach** - Clean test environment for each test
- **afterEach** - Clean up test data after each test  
- **No Production Impact** - Tests never touch production components
- **No Symlinks** - Copying eliminates recursive loop risks (see Retroactive Isolation Architecture below)

### Retroactive Isolation Architecture (v0.3.14.4+):

**Problem:** Old CLI versions could modify production state, causing regressions.

**Solution:** Version-specific shell script wrappers that delegate to latest version's `test shell` command, forcing old versions into isolated `test/data` environments.

#### Architecture Components:

1. **Version Wrapper Generation** (`generateVersionWrappers`)
   - Scans all components in project
   - Generates `scripts/versions/{cliName}-v{version}` for each version
   - Replaces old symlinks with shell script wrappers
   - Template: `templates/sh/version-wrapper.sh.template`

2. **Test Environment Setup** (`initTestIsolationEnvironment`)
   - **CRITICAL DESIGN DECISION: Copy Files, NOT Symlinks!**
   - **Why Copy?** Symlinks create recursive path loops:
     - `test/data/components/X/0.1.0` → symlink to real component
     - Real component CONTAINS `test/data` directory  
     - Result: `test/data → component → test/data → ...` (infinite loop!)
   - **Copy Strategy:**
     ```typescript
     // COPY component files (exclude test/ and node_modules/)
     for (const entry of entries) {
       if (entry.name === 'test') {
         await fs.mkdir(destPath, { recursive: true });
         continue; // Skip test/ (avoid recursion)
       }
       if (entry.name === 'node_modules') {
         continue; // Skip node_modules (is a symlink)
       }
       await fs.cp(srcPath, destPath, { recursive: true });
     }
     ```
   - **Direct Node Wrapper:** Creates fresh shell script that calls `node` directly
     - **Why?** Old component's `web4tscomponent` might be a wrapper (from old `initProject`)
     - **Solution:** Generate new wrapper that directly executes the `.js` file:
       ```bash
       #!/bin/bash
       exec node "/path/to/component/dist/ts/layer5/CLI.js" "$@"
       ```
   - **Trade-offs:**
     - ⚠️ Disk Space: Copying uses more space than symlinking
     - ✅ Safety: Eliminates all recursive loop risks
     - ✅ Simplicity: No complex relative path calculations
     - ✅ Reliability: Works for ANY version, regardless of structure

3. **Wrapper Behavior:**
   ```bash
   # Detects environment mode
   if [[ Cursor Agent Mode ]]; then
       # Source test/data/source.env in current shell
       # Execute command without subshell (prevents hang)
       cd test/data && source source.env && {CLI_NAME} "$@"
   else
       # Normal user mode: delegate to latest
       exec {CLI_NAME} test shell {VERSION} "$@"
   fi
   ```

3. **Cursor Agent Detection:**
   - Checks `$CURSOR_AGENT` environment variable
   - Checks for `cursor.*agent` process via `pgrep`
   - Prevents interactive subshell creation in agent context
   - Executes commands in current shell to maintain Cursor control

4. **Test Environment Indicators:**
   - Welcome message shows test isolation status
   - **🧪 Test Isolation: {Component} {Version}** - when in test/data
   - **🤖 Cursor Agent Mode** - when running in Cursor agent
   - Helps developers identify execution context immediately

#### Benefits:

- ✅ **Production Safety:** Old versions CANNOT modify production state
- ✅ **Backward Compatibility:** Old version commands still work
- ✅ **Cursor Friendly:** No interactive shell hangs in agent mode
- ✅ **Transparent:** Users see clear indicators of execution context
- ✅ **Automatic:** Generated during `initProject`, no manual setup

#### Example:

```bash
# User calls old version
web4tscomponent-v0.3.13.2 test file

# Wrapper detects Cursor mode
# → cd /path/to/0.3.13.2/test/data
# → source source.env
# → web4tscomponent test file  # (runs in isolation)

# Welcome message shows:
# 🧪 Test Isolation: Web4TSComponent 0.3.13.2
# 🤖 Cursor Agent Mode: Shell commands execute in current context
```

---

