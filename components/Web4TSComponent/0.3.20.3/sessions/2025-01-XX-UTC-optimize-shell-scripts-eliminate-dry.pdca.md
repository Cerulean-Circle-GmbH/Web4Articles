# PDCA: Optimize Shell Scripts - Eliminate DRY Violations and Ensure npm install

**Date:** 2025-01-XX  
**Component:** Web4TSComponent 0.3.20.2  
**Issue:** Shell script duplication across components + missing npm install causing runtime errors  
**CMM Level:** CMM3 (Objective, Reproducible, Verifiable)

---

## 📋 PLAN

### Problem Statement

1. **DRY Violations in Shell Scripts:**
   - `start.sh` scripts are duplicated across all components (58+ copies)
   - Only differences: component name and CLI file name
   - `install-deps.sh` scripts also duplicated with inconsistent implementations
   - Some use `lib-project-root.sh`, others use hardcoded `../../..` paths

2. **Missing npm install:**
   - Error: `Cannot find package 'ws' imported from ONCE/0.3.20.5/dist/ts/layer2/ServerHierarchyManager.js`
   - Error: `Cannot find package 'uuid' imported from ONCE/0.3.20.5/dist/ts/layer2/ServerHierarchyManager.js`
   - `once links` command fails because dependencies not installed
   - `start.sh` checks for symlink but doesn't verify dependencies are actually installed in global node_modules

3. **Root Cause Analysis:**
   - `start.sh` condition: `if [ ! -L "node_modules" ] || [ ! -d "../../../node_modules" ]`
   - This only checks if symlink exists and if global node_modules directory exists
   - **Does NOT check if required packages are actually installed**
   - `install-deps.sh` runs `npm install` but may not install all dependencies if package.json changed
   - No verification that dependencies from package.json are present in node_modules

### Current State Analysis

**start.sh duplication pattern:**
```bash
# Pattern repeated in 58+ components:
echo "🚀 Starting {COMPONENT_NAME} (normal)..."
if [ ! -f "dist/ts/layer5/{COMPONENT_NAME}CLI.js" ] || find src -name "*.ts" -newer "dist/ts/layer5/{COMPONENT_NAME}CLI.js" 2>/dev/null | grep -q .; then
    # ... identical logic ...
fi
```

**install-deps.sh inconsistencies:**
- Web4TSComponent 0.3.20.2: Uses `lib-project-root.sh` (DRY approach)
- ONCE 0.3.20.5: Uses hardcoded `../../..` path (CMM2 approach)
- Some versions: Hardcoded paths, others: Library-based

### Solution Design

**Focus: Improve Component Creation and Update Mechanism**

1. **Create Shared Shell Library:**
   - `lib-component-start.sh` - Shared start logic
   - Parameters: component name, CLI file path
   - Used by NEW components created via `create` command
   - Used by OLD components updated via `updateBuildSystem` command

2. **Enhance Dependency Verification:**
   - Add `verify-deps.sh` to verify required packages are installed
   - Check package.json dependencies against node_modules
   - Run `npm install` if any dependencies missing
   - Ensure npm install runs BEFORE component execution

3. **Update Component Creation Process:**
   - Update `createShellScriptStructure()` to generate optimized scripts
   - New components automatically use shared libraries
   - Templates in `templates/sh/` define the optimized pattern

4. **Enhance updateBuildSystem:**
   - Update `updateBuildSystem()` to replace old shell scripts with optimized versions
   - Allow developers to update old components on-demand
   - No forced migration - update when needed

### CMM3 Verification Criteria

**Objective:**
- [ ] NEW components created use shared `lib-component-start.sh` library
- [ ] `updateBuildSystem` successfully updates old components to use shared libraries
- [ ] npm install runs automatically when dependencies missing
- [ ] Runtime errors eliminated (ws, uuid, etc. found) in new/updated components

**Reproducible:**
- [ ] Automated test: Verify NEW components created with optimized scripts
- [ ] Automated test: Verify `updateBuildSystem` updates old components correctly
- [ ] Automated test: Verify dependencies installed before execution
- [ ] Automated test: Verify DRY compliance in created/updated components

**Verifiable:**
- [ ] Test script runs and passes: `test/sh/test-shell-script-optimization.sh`
- [ ] NEW component created: `web4tscomponent create TestComponent 0.1.0.0 all` → uses shared libraries
- [ ] OLD component updated: `web4tscomponent on OldComponent 0.1.0.0 updateBuildSystem` → uses shared libraries
- [ ] Updated components start successfully: `npm start` works
- [ ] No runtime errors: `once links`, `web4tscomponent links`, etc. work in updated components

---

## 🔨 DO (Implementation)

### Step 1: Create Shared Start Library

**File:** `components/Web4TSComponent/0.3.20.2/src/sh/lib-component-start.sh`

```bash
#!/usr/bin/env sh
# Shared component start logic (DRY principle)
# Usage: . lib-component-start.sh "ComponentName" "dist/ts/layer5/ComponentCLI.js"

COMPONENT_NAME="$1"
CLI_FILE="$2"

if [ -z "$COMPONENT_NAME" ] || [ -z "$CLI_FILE" ]; then
    echo "❌ Error: lib-component-start.sh requires COMPONENT_NAME and CLI_FILE parameters"
    exit 1
fi

echo "🚀 Starting $COMPONENT_NAME (normal)..."

# Check if rebuild is needed
if [ ! -f "$CLI_FILE" ] || find src -name "*.ts" -newer "$CLI_FILE" 2>/dev/null | grep -q .; then
    echo "🔧 Source files updated, rebuilding..."
    
    # Clean local artifacts only
    ./src/sh/clean-local.sh
    
    # Install dependencies if needed
    if [ ! -L "node_modules" ] || [ ! -d "../../../node_modules" ]; then
        ./src/sh/install-deps.sh
    else
        echo "📦 Dependencies already installed"
    fi
    
    # Verify dependencies are actually installed
    if ! ./src/sh/verify-deps.sh; then
        echo "⚠️  Dependencies missing, installing..."
        ./src/sh/install-deps.sh
    fi
    
    # Build TypeScript
    echo "🔨 Building TypeScript..."
    npx tsc
else
    echo "✅ Component is up to date, skipping build"
    
    # Still verify dependencies (package.json may have changed)
    if ! ./src/sh/verify-deps.sh; then
        echo "⚠️  Dependencies missing, installing..."
        ./src/sh/install-deps.sh
    fi
fi

# Run component
npm run component
```

### Step 2: Create Dependency Verification Script

**File:** `components/Web4TSComponent/0.3.20.2/src/sh/verify-deps.sh`

```bash
#!/usr/bin/env sh
# Verify all dependencies from package.json are installed
# Returns 0 if all deps present, 1 if any missing

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
. "$SCRIPT_DIR/lib-project-root.sh"

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    exit 1
fi

# Check if global node_modules exists
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "❌ Global node_modules not found at $PROJECT_ROOT/node_modules"
    exit 1
fi

# Extract dependencies from package.json
DEPS=$(node -e "
const pkg = require('./package.json');
const deps = {...(pkg.dependencies || {}), ...(pkg.devDependencies || {})};
console.log(Object.keys(deps).join(' '));
")

MISSING=0
for DEP in $DEPS; do
    if [ ! -d "$PROJECT_ROOT/node_modules/$DEP" ]; then
        echo "⚠️  Missing dependency: $DEP"
        MISSING=1
    fi
done

if [ $MISSING -eq 1 ]; then
    exit 1
fi

exit 0
```

### Step 3: Update start.sh Template

**File:** `components/Web4TSComponent/0.3.20.2/templates/sh/start.sh.template`

```bash
#!/usr/bin/env sh
# DRY: Source shared component start library
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
. "$SCRIPT_DIR/lib-component-start.sh"

# Call shared library with component-specific parameters
. "$SCRIPT_DIR/lib-component-start.sh" "{{COMPONENT_NAME}}" "dist/ts/layer5/{{COMPONENT_NAME}}CLI.js"
```

### Step 4: Standardize install-deps.sh Template

**File:** `components/Web4TSComponent/0.3.20.2/templates/sh/install-deps.sh.template`

Ensure template uses `lib-project-root.sh` consistently (already in template, but verify).

### Step 5: Enhance updateBuildSystem Method

**File:** `components/Web4TSComponent/0.3.20.2/src/ts/layer2/DefaultWeb4TSComponent.ts`

Update `updateBuildSystem()` method to:
- Replace old `start.sh` with optimized version (sources shared library)
- Add `lib-component-start.sh` and `verify-deps.sh` if missing
- Update `install-deps.sh` to use `lib-project-root.sh` if using hardcoded paths
- Preserve component-specific customizations where appropriate

### Step 6: Create Automated Test

**File:** `components/Web4TSComponent/0.3.20.2/test/sh/test-shell-script-optimization.sh`

```bash
#!/usr/bin/env sh
# CMM3 Test: Verify shell script optimization and DRY compliance

set -e

echo "🧪 Testing shell script optimization..."

# Test 1: Verify shared library exists
if [ ! -f "src/sh/lib-component-start.sh" ]; then
    echo "❌ FAIL: lib-component-start.sh not found"
    exit 1
fi

# Test 2: Verify verify-deps.sh exists
if [ ! -f "src/sh/verify-deps.sh" ]; then
    echo "❌ FAIL: verify-deps.sh not found"
    exit 1
fi

# Test 3: Verify start.sh uses shared library
if ! grep -q "lib-component-start.sh" "src/sh/start.sh"; then
    echo "❌ FAIL: start.sh does not use shared library"
    exit 1
fi

# Test 4: Verify dependencies can be checked
if ! ./src/sh/verify-deps.sh; then
    echo "⚠️  WARNING: Some dependencies may be missing (this is expected if npm install not run)"
fi

echo "✅ All shell script optimization tests passed"
```

---

## ✅ CHECK (Verification)

### CMM3 Verification Checklist

**Objective Verification:**
- [ ] Run test: `./test/sh/test-shell-script-optimization.sh`
- [ ] Verify output shows all tests pass
- [ ] Check that `lib-component-start.sh` exists and is executable
- [ ] Check that `verify-deps.sh` exists and is executable
- [ ] Verify `start.sh` sources shared library (grep check)

**Reproducible Verification:**
- [ ] Run test 3 times, verify same results each time
- [ ] Create NEW component: `web4tscomponent create TestComponent 0.1.0.0 all`
- [ ] Verify NEW component uses shared libraries
- [ ] Update OLD component: `web4tscomponent on OldComponent 0.1.0.0 updateBuildSystem`
- [ ] Verify UPDATED component uses shared libraries
- [ ] Test updated component: `npm start` works, no missing package errors

**Verifiable Results:**
```
Test Output:
🧪 Testing shell script optimization...
✅ All shell script optimization tests passed
```

**Runtime Verification:**
```bash
# Test 1: Create NEW component with optimized scripts
web4tscomponent create TestComponent 0.1.0.0 all
cd components/TestComponent/0.1.0.0
npm start  # Should use lib-component-start.sh
./test/sh/test-shell-script-optimization.sh  # Should pass

# Test 2: Update OLD component
web4tscomponent on ONCE 0.3.20.5 updateBuildSystem
cd components/ONCE/0.3.20.5
npm start
once links  # Should work without "Cannot find package" errors
```

### Expected Outcomes

1. **DRY Compliance (New Components):**
   - NEW components created use shared `lib-component-start.sh`
   - Zero duplication of start logic in new components
   - Consistent behavior across all newly created components

2. **Update Mechanism (Old Components):**
   - `updateBuildSystem` successfully updates old components
   - Developers can update components on-demand
   - No forced migration - update when needed

3. **Dependency Management:**
   - `verify-deps.sh` checks all dependencies
   - `npm install` runs automatically when needed
   - Runtime errors eliminated (ws, uuid, etc. found) in updated components

4. **CMM3 Achievement:**
   - Automated test verifies solution
   - Reproducible results for create and updateBuildSystem
   - Objective pass/fail criteria

---

## 🎬 ACT (Next Steps)

### Immediate Actions

1. **Implement Shared Libraries:**
   - Create `lib-component-start.sh` in Web4TSComponent 0.3.20.2
   - Create `verify-deps.sh` in Web4TSComponent 0.3.20.2
   - Update `start.sh.template` to use shared library

2. **Update Component Creation Process:**
   - **Critical:** Update `createShellScriptStructure()` method in `DefaultWeb4TSComponent.ts`
   - Add `lib-component-start.sh` and `verify-deps.sh` to template generation list
   - Update `start.sh.template` to source shared library instead of duplicating logic
   - Ensure `install-deps.sh.template` uses `lib-project-root.sh` consistently
   - **Impact:** All NEW components created will automatically use optimized approach
   - **Multi-Component Benefit:** Consistent shell script behavior across all new components
   - **Dependency Verification:** New components will have automatic dependency checking built-in
   - Verify generated components work correctly with shared libraries

3. **Enhance updateBuildSystem Method:**
   - Update `updateBuildSystem()` in `DefaultWeb4TSComponent.ts`
   - Add logic to replace old `start.sh` with optimized version
   - Add `lib-component-start.sh` and `verify-deps.sh` to components being updated
   - Update `install-deps.sh` to use `lib-project-root.sh` if using hardcoded paths
   - **Impact:** Developers can update old components on-demand
   - **Benefit:** No forced migration - update when needed
   - Verify updated components work correctly with shared libraries

### Long-term Improvements

1. **Enhanced Dependency Management:**
   - Add dependency version checking
   - Warn on outdated dependencies
   - Auto-update when safe

2. **Performance Optimization:**
   - Cache dependency verification results
   - Skip unnecessary npm installs
   - Faster component startup

3. **CMM4 Feedback Loop:**
   - Monitor component startup times
   - Track dependency installation frequency
   - Optimize based on usage patterns

### Success Metrics

- **DRY Compliance:** NEW components use shared libraries (no duplication)
- **Update Mechanism:** `updateBuildSystem` successfully updates old components
- **Dependency Errors:** 0 runtime "Cannot find package" errors in new/updated components
- **Startup Time:** < 2 seconds for components with dependencies installed
- **Test Coverage:** Create and updateBuildSystem processes verified

---

## 📝 Notes

### Key Learnings

1. **DRY Principle Violation:**
   - 58+ copies of nearly identical start.sh scripts in existing components
   - Each component version has its own copy
   - **Solution:** Fix at creation time (new components) and update time (old components via updateBuildSystem)
   - No need to refactor all existing components - update when needed

2. **Dependency Verification Gap:**
   - Checking symlink existence ≠ checking dependencies installed
   - Need explicit verification of package.json dependencies
   - npm install may not install all dependencies if package.json changed

3. **CMM3 Approach:**
   - Automated test verifies solution objectively
   - Reproducible results across all components
   - Clear pass/fail criteria

### Related Issues

- Error: `Cannot find package 'ws'` - Fixed by verify-deps.sh
- Error: `Cannot find package 'uuid'` - Fixed by verify-deps.sh
- DRY violation: Duplicate start.sh scripts - Fixed by shared library

### Impact on Multi-Component Development

**The `create` Process Transformation:**

When developers run `web4tscomponent create MyComponent 0.1.0.0 all`, the component creation process generates shell scripts from templates. This optimization fundamentally changes what gets generated:

**Before Optimization:**
```typescript
// createShellScriptStructure() generates:
- start.sh (58+ lines, duplicated logic)
- install-deps.sh (100+ lines, hardcoded paths)
// Each component gets its own copy of identical logic
```

**After Optimization:**
```typescript
// createShellScriptStructure() generates:
- lib-component-start.sh (shared library, sourced by all)
- verify-deps.sh (shared library, sourced by all)
- start.sh (3 lines: sources shared library)
- install-deps.sh (uses lib-project-root.sh consistently)
// Components reference shared libraries, zero duplication
```

**Multi-Component Development Benefits:**

1. **Consistent Behavior:**
   - All new components use identical start logic
   - Dependency verification works the same way everywhere
   - No component-specific shell script bugs

2. **Automatic Dependency Management:**
   - New components automatically verify dependencies before execution
   - No more "Cannot find package" errors in newly created components
   - `npm install` runs automatically when needed

3. **Template-Based DRY Compliance:**
   - Templates in `templates/sh/` define the pattern once
   - All components created inherit the optimization
   - Future improvements to shared libraries benefit all components

4. **Reduced Maintenance:**
   - Fix shell script bugs in one place (shared library)
   - All components benefit immediately
   - No need to update 58+ component versions

5. **Create Process Changes Required:**
   ```typescript
   // In DefaultWeb4TSComponent.ts createShellScriptStructure():
   const scripts = [
     'lib-project-root.sh',      // Already exists
     'lib-component-start.sh',   // NEW: Shared start logic
     'verify-deps.sh',            // NEW: Dependency verification
     'clean.sh',
     'clean-local.sh',
     'clean-global.sh',
     'install-deps.sh',           // Updated to use lib-project-root.sh
     'build.sh',
     'start.sh',                   // Updated to use lib-component-start.sh
     'start-clean.sh',
     'test.sh'
   ];
   ```

6. **Update Mechanism (updateBuildSystem):**
   - Old components continue to work (they have their own copies)
   - Developers can update old components on-demand: `web4tscomponent on Component 0.1.0.0 updateBuildSystem`
   - No forced migration - update when needed
   - `updateBuildSystem` replaces old scripts with optimized versions

**Multi-Component Workflow Impact:**

When working with multiple components:
- **Before:** Each component might have slightly different shell script behavior
- **After:** All components behave identically (shared libraries ensure consistency)
- **Benefit:** Developers can trust that `npm start` works the same way in all components
- **Benefit:** Dependency issues are caught early and automatically fixed

**Example Multi-Component Scenario:**

```bash
# Developer creates 3 new components
web4tscomponent create ComponentA 0.1.0.0 all
web4tscomponent create ComponentB 0.1.0.0 all
web4tscomponent create ComponentC 0.1.0.0 all

# All 3 components:
# ✅ Use lib-component-start.sh (shared)
# ✅ Use verify-deps.sh (shared)
# ✅ Have identical start.sh behavior
# ✅ Automatically verify dependencies
# ✅ Work identically: npm start, dependency management, etc.

# Developer can trust consistent behavior across all components
```

### References

- CMM3 Verification Checklist: `pdca trainAI cmm3-verification`
- DRY Principle: Web4TSComponent README.md
- Shell Library Pattern: `lib-project-root.sh` (existing example)
- Multi-Component Development: `session/2025-11-06-UTC-0050.multi-component-development-workflow.pdca.md`
- Component Creation: `DefaultWeb4TSComponent.createShellScriptStructure()` method

---

**Status:** PLAN phase complete, ready for DO (Implementation)  
**Next:** 
1. Implement shared libraries (`lib-component-start.sh`, `verify-deps.sh`)
2. Update `createShellScriptStructure()` for component creation
3. Enhance `updateBuildSystem()` for updating old components

