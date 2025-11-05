# targetDirectory vs componentRoot - Decision Table

## Property Definitions

| Property | Meaning | Example (Production) | Example (Self-Test) |
|----------|---------|---------------------|---------------------|
| `projectRoot` | Workspace root | `/Users/.../Web4Articles` | `/Users/.../Web4Articles` |
| `componentRoot` | Where component lives | `/Users/.../components/Web4TSComponent/0.3.17.9` | `/Users/.../components/Web4TSComponent/0.3.17.9` |
| `targetDirectory` | Context for CREATE operations | `/Users/.../Web4Articles` | `/Users/.../Web4Articles` |

## Usage Analysis

### Current Usage of `targetDirectory`

| Location | Usage | Purpose | Correct Value |
|----------|-------|---------|---------------|
| `resolveComponentPath()` | `join(targetDirectory, 'components', name, ver)` | CREATE/FIND components | **projectRoot** ✅ |
| `isTestEnvironment()` | `targetDirectory.includes('/test/data')` | Detect test mode | **projectRoot** ✅ |
| `resolveProjectRoot()` | `return targetDirectory` | Get project root | **projectRoot** ✅ |
| `initProject()` | `targetDirectory` as project root | Initialize project | **projectRoot** ✅ |
| `verifyTestSuccess()` | `join(targetDirectory, 'components', ...)` | Find test results | **projectRoot** ✅ |

### Special Case: `test()` Method

| Scenario | What Needs to Happen | Which Path? | Current Bug |
|----------|---------------------|-------------|-------------|
| `web4tscomponent test` | Run tests from **component's own** test/ dir | `componentRoot` | ✅ NOW FIXED |
| `web4tscomponent test file 1` | Run specific test from component's test/ | `componentRoot` | ✅ NOW FIXED |
| `web4tscomponent on Unit 0.1.0.0 test` | Run tests from Unit's test/ dir | `context.componentRoot` | Need to check |

## Decision Table: Which Path to Use?

| Method | Operation Type | Path to Use | Reason |
|--------|---------------|-------------|--------|
| `create()` | CREATE component | `targetDirectory` | Creates in workspace |
| `initProject()` | CREATE config files | `targetDirectory` | Creates in project root |
| `build()` | BUILD self/context | `componentRoot` | Builds component's own code |
| `clean()` | CLEAN self/context | `componentRoot` | Cleans component's own dist |
| `upgrade()` | UPGRADE self/context | Both | Copies from componentRoot to targetDirectory |
| **`test()`** | **RUN tests** | **`componentRoot`** | **Tests are IN the component** |
| `resolveComponentPath()` | FIND/CREATE component | `targetDirectory` | Standard component location |

## Root Cause Analysis

**Problem**: `test()` command was using `targetDirectory` to determine where to run `npx vitest`.

**Why Wrong**: 
- `targetDirectory` = workspace root (`/Users/.../Web4Articles`)
- Tests are in component (`/Users/.../components/Web4TSComponent/0.3.17.9/test/`)
- Vitest ran from workspace root → found no `test/` directory

**Solution**: Use `componentRoot` for test execution, keep `targetDirectory` for everything else.

## Implementation Rule

```typescript
// RULE: Use componentRoot for RUNNING operations ON the component itself
// RULE: Use targetDirectory for CREATING/FINDING things IN the workspace

// ✅ CORRECT:
async test() {
  const target = this.model.context || this;
  const componentPath = target.model.componentRoot; // Where tests ARE
  execSync('npx vitest', { cwd: componentPath });
}

// ✅ CORRECT:
resolveComponentPath(name, version) {
  return join(this.model.targetDirectory, 'components', name, version); // Where to CREATE/FIND
}
```

## Verification Checklist

- [x] `web4tscomponent test` - Runs from componentRoot ✅
- [x] `web4tscomponent test file 1` - Executes specific test ✅
- [ ] `web4tscomponent create TestComp` - Creates in targetDirectory (test this)
- [ ] Tests can create test components without nesting violation (test this)
- [ ] `web4tscomponent on Unit 0.1.0.0 test` - Runs from Unit's componentRoot (test this)

## Final Answer

**`targetDirectory` = projectRoot** (for CREATE/FIND operations in workspace)  
**`componentRoot` = component's location** (for RUN operations on component itself)  

The `test()` method is correctly fixed to use `componentRoot` instead of `targetDirectory`.

