# 🚀 Web4TSComponent 0.3.3.2 - TypeScript Component Standards Enforcement

**Version:** 0.3.3.2  
**Status:** Testing & DRY Compliance Validation  
**Type:** Meta-component with auto-discovery CLI  
**Purpose:** Create, manage, and enforce Web4 TypeScript component standards with automatic version promotion

---

## 🎯 The Only Command You Need to Know

```bash
npm start
```

**That's it.** Seriously. The component handles its entire lifecycle automatically:

- ✅ Checks if build is needed → **builds automatically**
- ✅ Checks dependencies → **installs automatically**
- ✅ Creates symlinks → **handles automatically**
- ✅ Runs itself → **works immediately**

**Every component created by Web4TSComponent works exactly the same way.** Just `npm start` and you're done.

### What `npm start` Actually Does:

```bash
# When you run: npm start
# The component automatically:
1. Runs smart build check (only rebuilds if needed)
2. Installs dependencies if missing (with DRY-compliant symlinks)
3. Compiles TypeScript to JavaScript
4. Starts the CLI ready for commands
5. Shows help with all auto-discovered methods
```

### Quick Start Example:

```bash
cd /Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.3.2

# Start the component (it handles everything automatically)
npm start

# Or use the component wrapper directly (it also auto-builds)
./web4tscomponent

# Create a new component (it will work the same way!)
./web4tscomponent create MyAwesomeComponent 0.1.0.0 all

# Test your new component (same pattern!)
cd ../../MyAwesomeComponent/0.1.0.0
npm start  # ← Same magic, fully automatic
```

---

## 💡 What is Web4TSComponent?

**Web4TSComponent** is a **TypeScript Component Standards Enforcement & Architecture Compliance tool** that serves as the foundation for all Web4 components. It's a meta-component that creates and manages other components.

### Core Capabilities:

1. **Creates versioned TypeScript components** with standardized architecture
2. **Enforces Web4 architectural principles** (empty constructors, scenario support, layered architecture)
3. **Auto-discovers CLI commands** from TypeScript methods (no manual CLI configuration)
4. **Manages automatic version promotion workflows** after successful testing
5. **Enforces DRY principle** (symlinked node_modules, no duplication)
6. **Provides comprehensive test suites** with isolated test environments
7. **Handles lifecycle automatically** (build, dependencies, execution)

### Key Features:

- ✅ **Auto-Discovery CLI** - Add methods to component, they appear in CLI automatically
- ✅ **Automatic Lifecycle** - `npm start` handles everything (build, deps, execution)
- ✅ **Project Initialization** - `initProject` bootstraps any project with Web4 standards
- ✅ **Version Management** - Semantic versioning with intelligent promotion workflow
- ✅ **DRY Compliance** - Detects and prevents node_modules duplication
- ✅ **Test Isolation** - ProjectRootMocker ensures tests don't affect production
- ✅ **Method Chaining** - Fluent API with context-aware operations
- ✅ **CMM3+ Compliance** - Objective, reproducible, automated verification
- ✅ **Self-Replicating** - Components created work the same way

---

## 🚀 Automatic Project Initialization

**You don't need to do anything!** Web4TSComponent automatically initializes your project structure on first run.

### What Happens Automatically:

1. **Creates Root `tsconfig.json`**
   - Provides base TypeScript configuration
   - All component tsconfig files `extend` from this root
   - Ensures consistent TypeScript settings across all components

2. **Creates Root `package.json`**
   - Defines global dependencies (TypeScript, Vitest, etc.)
   - Enables the DRY principle (Don't Repeat Yourself)
   - All components symlink to the global `node_modules`

3. **Creates Global `node_modules` Directory**
   - Single source of truth for all dependencies
   - Components symlink here instead of duplicating packages
   - Saves disk space and ensures version consistency

### Why This Matters (DRY Principle):

**WITHOUT initProject:**
```
❌ project/
   ├── Component1/0.1.0.0/node_modules/  (100MB)
   ├── Component2/0.1.0.0/node_modules/  (100MB)
   └── Component3/0.1.0.0/node_modules/  (100MB)
Total: 300MB of duplicated dependencies
```

**WITH initProject:**
```
✅ project/
   ├── tsconfig.json          (root config)
   ├── package.json           (root dependencies)
   ├── node_modules/          (100MB - single copy)
   ├── Component1/0.1.0.0/
   │   └── node_modules → ../../../node_modules  (symlink)
   ├── Component2/0.1.0.0/
   │   └── node_modules → ../../../node_modules  (symlink)
   └── Component3/0.1.0.0/
       └── node_modules → ../../../node_modules  (symlink)
Total: 100MB (67% space savings)
```

### When Does This Happen?

Automatic initialization triggers when you run:
- ✅ `npm start` (first time)
- ✅ `npm run build` (first time)
- ✅ `npm test` (first time)
- ✅ Any component creation

**The philosophy:** You should **never** have to manually initialize anything. Just `npm start` and everything works.

### Self-Healing Configuration

The system is **resilient** and automatically fixes corrupted configs:

- ✅ **Detects** broken or invalid JSON in `tsconfig.json` or `package.json`
- ✅ **Backs up** the corrupted file (timestamped: `*.backup.20251006-153000`)
- ✅ **Regenerates** a fresh, working configuration
- ✅ **Continues** without manual intervention

**Example:** If someone accidentally breaks `tsconfig.json`:
```bash
# Next npm start automatically:
⚠️  Detected corrupted tsconfig.json - backing up and resetting...
   Creating root tsconfig.json...
   ✅ Web4 project initialized
```

**What gets validated:**
- JSON syntax must be valid
- `tsconfig.json` must have `compilerOptions.module` (critical for ES modules)
- `package.json` must be parseable by Node.js

**What is preserved:**
- If configs are **valid but customized**, they are **NOT overwritten**
- Only **broken/corrupted** files trigger regeneration
- User customizations are safe as long as they're valid JSON

**Note:** If you really need to manually initialize (e.g., CI/CD pre-setup), you can still call:
```bash
./web4tscomponent initProject
```

---

## 🎯 How Auto-Discovery CLI Works (The Magic Explained)

### The Beautiful Simplicity:

```typescript
// When you run: ./web4tscomponent create MyComponent 0.1.0.0 all
// The CLI automatically:
// 1. Finds the 'create' method on DefaultWeb4TSComponent
// 2. Calls: component.create('MyComponent', '0.1.0.0', 'all')
// 3. That's it! No configuration needed.
```

### How Does It Know?

**Web4TSComponent has MAGIC:**
- Add a method to the component → it automatically appears in the CLI
- No CLI configuration needed
- No switch cases to update
- No hardcoded help text to maintain
- **It just works automatically!**

**Auto-Discovery Process:**
1. CLI scans `DefaultWeb4TSComponent` class using TypeScript reflection
2. Finds all public methods automatically
3. Reads TSDoc comments for parameter information
4. Generates help text from your comments
5. Routes commands to your methods automatically
6. **Zero configuration required!**

### What You'll See:

```bash
./web4tscomponent

# Output shows dozens of methods automatically:
# - create, upgrade, test, build, clean
# - on (context loading), version, list
# - And many more...
# You didn't configure ANY of them - they're discovered from TypeScript!
```

---

## 📚 Adding Methods to Components (The Safe Way)

### 🚨 CRITICAL: Don't Break Anything!

**New agents often try complex approaches and break everything. Here's the SIMPLE way:**

### Your Job is SIMPLE:

1. Add method to `DefaultWeb4TSComponent.ts`
2. Add 3 lines of TSDoc comments
3. That's it! CLI discovers it automatically

### Step 1: Add Method to Component (Only Place You Edit!)

Open: `src/ts/layer2/DefaultWeb4TSComponent.ts`

Add your method anywhere in the class:

```typescript
/**
 * Your new awesome feature
 * @param inputData Data to process
 * @param outputFormat Format for output (json, xml, csv)
 * @cliSyntax inputData outputFormat
 * @cliDefault outputFormat json
 */
async myAwesomeFeature(inputData: string, outputFormat: string = 'json'): Promise<this> {
  console.log(`🚀 Processing ${inputData} as ${outputFormat}`);
  
  // Your implementation here
  console.log(`✅ Awesome feature completed!`);
  
  return this; // Enable method chaining
}
```

### Step 2: Test It (Watch the Magic!)

```bash
# Just start the component (auto-build happens)
npm start

# Or use the wrapper
./web4tscomponent | grep myAwesome

# Use your method
./web4tscomponent myAwesomeFeature "test data" json
```

### Step 3: That's It! (Seriously!)

**No other files to edit:**
- ❌ Don't touch the CLI file
- ❌ Don't add switch cases
- ❌ Don't update help text
- ❌ Don't configure anything

**It's automatically discovered and available!**

---

## 🎯 TSDoc Magic (The 3 Lines That Make It Work)

### Required TSDoc Comments:

```typescript
/**
 * Human description of what the method does
 * @param paramName Description of parameter
 * @cliSyntax paramName anotherParam
 * @cliDefault paramName defaultValue
 * @cliHide  // Use this to hide internal methods
 */
```

### TSDoc Annotations Explained:

**`@cliSyntax paramName anotherParam`**
- Tells CLI what parameters to expect
- Generates: `myMethod <paramName> <anotherParam>`
- **Required for CLI discovery**

**`@cliDefault paramName defaultValue`**
- Sets default values for parameters
- Generates: `<paramName=defaultValue>` in help
- Makes parameters optional

**`@cliHide`**
- Hides method from CLI (for internal methods)
- Method exists but won't show in help

### Parameter Types That Work:

```typescript
// ✅ Simple parameters (recommended)
async myMethod(name: string, version: string): Promise<this>

// ✅ Optional parameters with defaults
async myMethod(name: string, options: string = 'default'): Promise<this>

// ✅ Return this for method chaining
return this; // Enables: component.method1().method2()
```

---

## ⚠️ Common New Agent Mistakes (Don't Do These!)

### ❌ Mistake 1: Editing the CLI File

```typescript
// ❌ DON'T DO THIS:
// Editing Web4TSComponentCLI.ts to add switch cases
switch (command) {
  case 'myNewMethod':  // ← DON'T ADD THESE!
    await this.myNewMethod();
    break;
}
```

**✅ CORRECT:** Just add method to DefaultWeb4TSComponent - CLI finds it automatically!

### ❌ Mistake 2: Complex Parameter Patterns

```typescript
// ❌ DON'T DO THIS:
async myMethod(options: { name: string, config: Config, flags: string[] }): Promise<void>
```

**✅ CORRECT:** Use simple parameters:
```typescript
async myMethod(name: string, config: string, flags: string): Promise<this>
```

### ❌ Mistake 3: Forgetting TSDoc

```typescript
// ❌ DON'T DO THIS:
async myMethod(param: string): Promise<void> {
  // No TSDoc comments
}
```

**✅ CORRECT:** Always add TSDoc:
```typescript
/**
 * Description of method
 * @param param Description of parameter
 * @cliSyntax param
 */
async myMethod(param: string): Promise<this>
```

### ❌ Mistake 4: Not Returning `this`

```typescript
// ❌ DON'T DO THIS:
async myMethod(): Promise<void> {
  // Can't chain methods
}
```

**✅ CORRECT:** Return this for chaining:
```typescript
async myMethod(): Promise<this> {
  return this; // Enables method chaining
}
```

---

## 🎯 Context-Aware Methods (Advanced Pattern)

### When Your Method Needs Component Context:

Some methods work on a specific component (like upgrade, optimize, analyze). Use this pattern:

```typescript
/**
 * Your context-aware method
 * @param parameter Your parameter
 * @cliSyntax parameter
 */
async myContextMethod(parameter: string): Promise<this> {
  // Get component context (set by 'on' command)
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before running this method.');
  }
  
  console.log(`🔧 Working on ${context.component} v${context.version}`);
  console.log(`   Path: ${context.path}`);
  
  // Your logic here using context.component, context.version, context.path
  
  return this;
}
```

**Usage:**
```bash
./web4tscomponent on MyComponent 0.1.0.0 myContextMethod "parameter"
```

---

## 📋 Method Addition Checklist (Copy This!)

### Before You Start:
- [ ] I understand I only edit DefaultWeb4TSComponent.ts
- [ ] I won't touch the CLI files
- [ ] I'll use simple parameters
- [ ] I'll add proper TSDoc comments

### Adding the Method:
- [ ] Open `src/ts/layer2/DefaultWeb4TSComponent.ts`
- [ ] Add method with TSDoc comments
- [ ] Use `@cliSyntax` for parameters
- [ ] Return `this` for chaining
- [ ] Keep parameters simple (strings, not objects)

### Testing:
- [ ] Run `npm start` to see method in help
- [ ] Test method: `./web4tscomponent myMethod param1 param2`
- [ ] Verify method chaining works if needed
- [ ] Check that nothing broke

### If Something Breaks:
- [ ] Check TSDoc syntax (missing @cliSyntax?)
- [ ] Check parameter types (too complex?)
- [ ] Check return type (should be Promise<this>)
- [ ] **Don't edit CLI files to "fix" it!**

---

## 🎯 Real-World Examples (Copy These Patterns!)

### Example 1: Simple Data Processing

```typescript
/**
 * Process component data with transformation
 * @param inputFile Path to input file
 * @param outputFormat Output format (json, xml, csv)
 * @cliSyntax inputFile outputFormat
 * @cliDefault outputFormat json
 */
async processData(inputFile: string, outputFormat: string = 'json'): Promise<this> {
  console.log(`🔄 Processing ${inputFile} as ${outputFormat}`);
  
  // Your processing logic here
  
  console.log(`✅ Data processing completed`);
  return this;
}
```

**Usage:** `./web4tscomponent processData myfile.txt xml`

### Example 2: Component Analysis

```typescript
/**
 * Analyze component for quality metrics
 * @param componentPath Path to component directory
 * @cliSyntax componentPath
 */
async analyzeQuality(componentPath: string): Promise<this> {
  console.log(`📊 Analyzing quality: ${componentPath}`);
  
  // Your analysis logic here
  
  console.log(`✅ Quality analysis completed`);
  return this;
}
```

**Usage:** `./web4tscomponent analyzeQuality components/MyComponent/0.1.0.0`

### Example 3: Method Chaining Support

```typescript
/**
 * Optimize component performance
 * @param level Optimization level (basic, advanced, extreme)
 * @cliSyntax level
 * @cliDefault level basic
 */
async optimize(level: string = 'basic'): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before optimizing.');
  }
  
  console.log(`⚡ Optimizing ${context.component} at ${level} level`);
  
  // Your optimization logic here
  
  console.log(`✅ Optimization completed`);
  return this;
}
```

**Usage:** `./web4tscomponent on MyComponent 0.1.0.0 optimize advanced`

### Example 4: Complete Method with Context

```typescript
/**
 * Validate component structure and dependencies
 * @param checkLevel Validation level (basic, thorough, strict)
 * @param fixIssues Whether to fix found issues automatically
 * @cliSyntax checkLevel fixIssues
 * @cliDefault checkLevel basic
 * @cliDefault fixIssues false
 */
async validateStructure(checkLevel: string = 'basic', fixIssues: string = 'false'): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before validating.');
  }
  
  console.log(`🔍 Validating ${context.component} structure at ${checkLevel} level`);
  
  // Your validation logic here
  const shouldFix = fixIssues === 'true';
  if (shouldFix) {
    console.log(`🔧 Fixing issues automatically`);
    // Fix logic here
  }
  
  console.log(`✅ Structure validation completed`);
  return this;
}
```

**Usage:**
```bash
# Basic validation
./web4tscomponent on MyComponent 0.1.0.0 validateStructure

# Thorough validation with auto-fix
./web4tscomponent on MyComponent 0.1.0.0 validateStructure thorough true

# Chain with other operations
./web4tscomponent on MyComponent 0.1.0.0 validateStructure basic false upgrade nextBuild
```

---

## 🔧 Troubleshooting (When Things Don't Work)

### Method Not Appearing in CLI?

```typescript
// Check these:
// 1. Method is public (not private)
// 2. Has @cliSyntax annotation
// 3. Proper TypeScript syntax
// 4. Component compiles without errors

// Common fix:
/**
 * @cliSyntax param1 param2  // ← Add this if missing
 */
async myMethod(param1: string, param2: string): Promise<this>
```

### Method Throws Errors?

```typescript
// Check these:
// 1. Parameter count matches @cliSyntax
// 2. Default values match @cliDefault
// 3. Return type is Promise<this>
// 4. Human-readable error messages

// Common fix:
async myMethod(param: string = 'default'): Promise<this> {  // ← Add default
  return this;  // ← Add return
}
```

### Method Chaining Not Working?

```typescript
// Check these:
// 1. Method returns Promise<this>
// 2. Uses getComponentContext() for context-aware operations
// 3. Loads context with 'on' command first

// Common fix:
const context = this.getComponentContext();
if (!context) {
  throw new Error('I need a component context first. Please use "on <component> <version>" before this method.');
}
```

### Component Won't Build?

```bash
# Force rebuild with clean
npm run clean
npm run build

# Or use force build flag
./src/sh/build.sh force
```

---

## 🧪 How to Test Web4TSComponent 0.3.3.2

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

When testing components **generated** by Web4TSComponent:

```bash
# REQUIRED: Source the environment to get web4tscomponent in PATH
source source.env

cd components/DemoComponent
npm test
```

**Why `source.env` is needed:**
- Generated components delegate to `web4tscomponent` for promotion workflows
- This is **INTENTIONAL**, not a bug - it's how version promotion is triggered
- Without sourcing, you'll get `command not found: web4tscomponent`
- The delegation enables automatic promotion for generated components too

**This is by design:**
- Web4TSComponent manages promotion workflows centrally
- Generated components inherit this capability via delegation
- Ensures consistent promotion behavior across all components

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

- **ProjectRootMocker** - Redirects `process.cwd()` to `test/data` directory
- **beforeEach** - Clean test environment for each test
- **afterEach** - Clean up test data after each test
- **No Production Impact** - Tests never touch production components

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

---

## 🏗️ Architecture Overview

### Component Structure:

```
Web4TSComponent/0.3.3.2/
├── src/
│   ├── ts/
│   │   ├── layer5/  Web4TSComponentCLI.ts (Entry point)
│   │   ├── layer4/  TSCompletion.ts (Completion helper)
│   │   ├── layer3/  Interfaces (contracts)
│   │   └── layer2/  DefaultWeb4TSComponent.ts (Implementation)
│   └── sh/
│       ├── build.sh (Smart build)
│       ├── test.sh (Test runner)
│       ├── install-deps.sh (DRY-compliant setup)
│       ├── start.sh (npm start handler)
│       └── ... (other lifecycle scripts)
├── test/
│   ├── data/ (Isolated test environment)
│   ├── utils/ (ProjectRootMocker)
│   └── *.test.ts (12 test suites)
├── templates/
│   ├── ts/ (TypeScript templates)
│   ├── sh/ (Shell script templates)
│   └── config/ (Configuration templates)
├── dist/ (Compiled output)
├── package.json (scripts: start, test, build, clean)
├── tsconfig.json
├── vitest.config.ts
└── README.md (This file)
```

### Layered Architecture:

- **Layer 5:** CLI entry point with command routing
- **Layer 4:** Helper utilities (completion, project root mocking)
- **Layer 3:** Interfaces and type definitions
- **Layer 2:** Implementation (DefaultWeb4TSComponent, DefaultCLI)
- **Layer 1:** (Reserved for future use)

---

## 🛡️ Web4 Compliance Principles

Web4TSComponent enforces these architectural principles:

### 1. Empty Constructor Principle

```typescript
// ✅ CORRECT
constructor() {
  this.model = { /* defaults */ };
}

// ❌ WRONG
constructor(config: Config) { }
```

### 2. Scenario Support

```typescript
// ✅ REQUIRED for all components
init(scenario: Scenario<Model>): this
async toScenario(): Promise<Scenario<Model>>
```

### 3. Human-Readable Errors

```typescript
// ✅ CORRECT
throw new Error('I couldn\'t find the component. Please check the name and version.');

// ❌ WRONG
throw new Error('ENOENT: no such file or directory');
```

### 4. Method Chaining

```typescript
// ✅ CORRECT - Return this for chaining
async myMethod(): Promise<this> {
  return this;
}
```

### 5. DRY Principle

```typescript
// ✅ CORRECT - Symlinked dependencies
ln -sf ../../../node_modules node_modules

// ❌ WRONG - Real directories duplicate dependencies
npm install  # without proper symlink setup
```

---

## 🚀 Quick Reference

### The Only Command You Really Need:

```bash
npm start  # Handles everything automatically
```

### Other Useful Commands (But npm start handles them):

```bash
# These happen automatically, but you can run them manually:
npm test       # Test the component
npm run build  # Build manually
npm run clean  # Clean and rebuild

# Direct CLI usage (after build):
./web4tscomponent                              # Show help
./web4tscomponent create MyComponent 0.1.0.0 all  # Create component
./web4tscomponent on MyComponent 0.1.0.0 test  # Load context and test
./web4tscomponent on MyComponent 0.1.0.0 upgrade nextBuild test  # Chain operations
```

### Semantic Version Links:

- **dev** - Active development version (work here)
- **test** - Version ready for testing (test here)
- **prod** - Production-ready version (100% tested)
- **latest** - Latest stable release (same as prod)

---

## 🎯 Why This Works (The Web4 Magic)

### Auto-Discovery Architecture:

1. **CLI scans DefaultWeb4TSComponent** using TypeScript reflection
2. **Finds all public methods** automatically
3. **Reads TSDoc comments** for parameter information
4. **Generates help text** from your comments
5. **Routes commands** to your methods automatically

### Zero Configuration:

- No CLI configuration files
- No method registration arrays
- No hardcoded command lists
- **Just add method + TSDoc = CLI command!**

### DRY Principle:

- Write method once → available everywhere
- TSDoc comments → automatic documentation
- Method signature → automatic parameter handling
- Symlinked dependencies → no duplication
- **No repetitive code anywhere!**

### Automatic Lifecycle:

- `npm start` → builds automatically
- Dependencies → install automatically
- Symlinks → create automatically
- CLI → starts automatically
- Components created → work the same way

---

## 🎯 CMM4 Implementation

Web4TSComponent implements **CMM4 (Capability Maturity Model Level 4)**:

### CMM3 Foundation:
- ✅ **Objective Definitions** - Tests provide reproducible verification
- ✅ **Automated Execution** - No manual steps required
- ✅ **Scientific Reproducibility** - Same input → same output always

### CMM4 Achievement:
- ✅ **Feedback Loop Mastery** - PDCA cycle with automatic promotion
- ✅ **Whitebox Understanding** - Tests document system behavior
- ✅ **Systematic Improvement** - Each cycle refines the process
- ✅ **Quantitative Management** - Test metrics drive decisions

### Not CMM5:
- ❌ **Not 100% perfection** - Targets 80/20 efficiency (SpaceX model)
- ✅ **Economic viability** - Balances quality with practicality
- ✅ **Continuous improvement** - Better over time, not perfect immediately

---

## 📊 Version History & Migration Path

### Version Progression:

- **0.3.0.x** - Initial auto-discovery CLI implementation
- **0.3.1.x** - Enhanced version management
- **0.3.2.x** - Test isolation and promotion workflow
- **0.3.3.0** - Comprehensive test suites
- **0.3.3.1** - Bug fixes and stability
- **0.3.3.2** - **DRY compliance enforcement + Automatic lifecycle (current)**

### Migration from Earlier Versions:

If migrating from earlier versions:

1. Check for real node_modules directories
2. Run DRY compliance tests to identify violations
3. Remove real directories and create symlinks
4. Verify with: `npm test`
5. Use `npm start` for everything

---

## 🔗 Related Documentation

- **CMM Understanding:** `/scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md`
- **PDCA Process:** `/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md`
- **Tech Stack:** `/docs/tech-stack.md`
- **Unit Component:** Similar auto-discovery CLI pattern

---

## 💡 For New Agents

**First Time with Web4TSComponent?**

### Start Here:

1. **Just run `npm start`** - Everything else is automatic
2. Read the **Auto-Discovery CLI** section above
3. Try adding a simple method to see the magic
4. Read the **CMM Understanding** document for context
5. Run `npm test` to see systematic verification

### Key Concepts:

- **One Command:** `npm start` handles everything
- **Auto-Discovery:** Add method → appears in CLI automatically
- **Method Chaining:** Return `this` from every method
- **TSDoc Magic:** 3 lines of comments make methods discoverable
- **DRY Compliance:** Symlinks, never duplicate node_modules
- **Systematic Process:** CMM4 feedback loops, not ad-hoc hacking

### Remember:

- This is a CMM4 system, not CMM1 chaos
- Tests define success objectively
- Automation prevents human error
- Systematic processes beat ad-hoc hacking
- **Components created work the same way!**

---

## 🎉 Success Criteria

Web4TSComponent 0.3.3.2 is successful when:

- ✅ All 12 test suites pass at 100%
- ✅ DRY compliance tests detect violations
- ✅ Automatic version promotion executes correctly
- ✅ No real node_modules directories in components
- ✅ Tests remain isolated from production
- ✅ Build process is efficient (smart rebuilds only)
- ✅ `npm start` works perfectly every time
- ✅ Created components work the same way

---

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🤝✨

**Web4TSComponent 0.3.3.2** - Standards Enforcement with DRY Compliance & Automatic Lifecycle 🚀