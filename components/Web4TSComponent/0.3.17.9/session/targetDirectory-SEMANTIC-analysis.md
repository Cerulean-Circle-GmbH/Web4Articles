# targetDirectory - SEMANTIC Analysis (Path Authority Principle)

## Path Authority Principle

**RULE**: Component NEVER calculates paths. CLI provides ALL paths in model.

## Semantic Definition

**`targetDirectory`** = **WHERE TO CREATE/OPERATE** (context for THIS execution)

| Context | targetDirectory Should Be | Why |
|---------|---------------------------|-----|
| Production use | `/path/to/workspace` | Create components in workspace |
| Self-test (Web4TSComponent testing itself) | `/path/to/Web4TSComponent/0.3.17.9/test/data` | CREATE test fixtures in test/data |
| Testing Unit component | `/path/to/Unit/0.1.0.0/test/data` | CREATE test fixtures for Unit |

## Current VIOLATIONS (Path Calculations in Component)

```typescript
// ❌ VIOLATION: Component calculates path from targetDirectory
resolveComponentPath(name, version) {
  return join(this.model.targetDirectory, 'components', name, version);
}

// ❌ VIOLATION: Component inspects path structure
isTestEnvironment() {
  return this.model.targetDirectory.includes('/test/data');
}

// ❌ VIOLATION: Component returns targetDirectory as projectRoot
resolveProjectRoot() {
  return this.model.targetDirectory;
}
```

**These are SEMANTIC violations because:**
1. Component is CALCULATING paths (should only USE model values)
2. Component is INSPECTING path structure (should not know about '/test/data')
3. Conflating `targetDirectory` with `projectRoot` (different semantics!)

## What Should Be in Model (Path Authority)

```typescript
interface ComponentModel {
  // CLI provides ALL these paths:
  projectRoot: string;        // Where workspace root is
  componentRoot: string;      // Where THIS component lives
  targetDirectory: string;    // Where to CREATE/OPERATE for THIS execution
  componentsDirectory: string; // Where components/ dir is (projectRoot + 'components')
  testDataDirectory?: string;  // test/data if in test mode
  isTestIsolation: boolean;   // Flag, not path calculation
}
```

## CORRECT Semantic Usage

### For Self-Testing Web4TSComponent

```typescript
// CLI initialization (Web4TSComponentCLI constructor):
this.component.model.projectRoot = '/path/to/workspace';
this.component.model.componentRoot = '/path/to/Web4TSComponent/0.3.17.9';

// For testing itself:
this.component.model.targetDirectory = path.join(
  this.component.model.componentRoot, 
  'test/data'
);
this.component.model.componentsDirectory = path.join(
  this.component.model.targetDirectory,
  'components'
);
this.component.model.isTestIsolation = true;
```

### For test() Method

```typescript
// ✅ CORRECT: Use componentRoot to RUN tests
async test() {
  const target = this.model.context || this;
  execSync('npx vitest', { 
    cwd: target.model.componentRoot // Where tests ARE
  });
}
```

### For create() Method

```typescript
// ✅ CORRECT: Use pre-calculated componentsDirectory
async create(name, version) {
  // NO path calculation! Just use model value
  const componentPath = path.join(
    this.model.componentsDirectory, // ✅ From model, not calculated
    name,
    version
  );
}
```

## The Problem with My "Fix"

**What I did:**
```typescript
// In test() method:
const componentPath = target.model.componentRoot; // ✅ This part is right
```

**What I DIDN'T fix:**
- All the path calculation violations still exist
- targetDirectory still semantically confused
- Component still violates path authority

## The REAL Fix Needed

1. **CLI must set targetDirectory semantically correct:**
   ```typescript
   // For self-test:
   targetDirectory = componentRoot + '/test/data'
   
   // For production:
   targetDirectory = projectRoot
   ```

2. **Component must NEVER calculate paths:**
   ```typescript
   // ❌ REMOVE:
   resolveComponentPath() { return join(targetDirectory, 'components'...) }
   
   // ✅ ADD to model:
   componentsDirectory: string  // CLI provides this
   ```

3. **Use semantic flags, not path inspection:**
   ```typescript
   // ❌ REMOVE:
   isTestEnvironment() { return targetDirectory.includes('/test/data') }
   
   // ✅ USE model flag:
   if (this.model.isTestIsolation) { ... }
   ```

## Decision: What to Fix NOW vs LATER

### NOW (Minimal fix for test execution)
- ✅ DONE: `test()` uses `componentRoot` (where tests are)
- Keep existing violations (they "work" but are semantically wrong)

### LATER (Proper refactoring - separate PDCA)
- Remove all `resolveXxxPath()` methods (path calculations)
- CLI provides all paths in model
- Component only USES model values
- Add `isTestIsolation` flag instead of path inspection

## Conclusion

**You're right**: This is about SEMANTIC correctness, not just "making it work."

My fix makes tests execute correctly, but doesn't address the deeper PATH AUTHORITY violations.

**Proper fix requires:**
1. CLI provides ALL paths in model
2. Component NEVER calculates paths
3. Separate PDCA to refactor path handling throughout

**For now**: Tests work, but we've documented the technical debt.

