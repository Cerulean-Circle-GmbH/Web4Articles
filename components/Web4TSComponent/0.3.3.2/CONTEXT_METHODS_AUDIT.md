# Context Methods Audit - Web4TSComponent 0.3.3.2

**Audit Date:** Current Session  
**Purpose:** Systematic analysis of method documentation vs implementation  
**CMM4 Approach:** Whitebox understanding to identify inconsistencies

---

## 🎯 Audit Objective

Identify methods where **documentation** does NOT match **implementation** regarding context requirements:

1. **Missing @cliSyntax**: Methods that check for context but lack CLI discoverability
2. **Missing Context Checks**: Methods that should check for context but don't
3. **Incorrect Documentation**: Methods with wrong "(requires context)" comments

---

## ✅ Methods Properly Implemented (Reference Pattern)

### **upgrade** - Perfect Implementation
```typescript
/**
 * Upgrade component version with intelligent version bumping
 * @param versionType Type of version upgrade
 * @cliSyntax versionType  ← HAS @cliSyntax
 */
async upgrade(versionType: string): Promise<this> {
  const context = this.getComponentContext();  ← CHECKS CONTEXT
  if (!context) {
    throw new Error('No component context loaded. Use "on <component> <version>" first.');
  }
  // ... implementation
}
```

**Status:** ✅ Perfect
- Has @cliSyntax → Discoverable in CLI
- Checks context → Safe execution
- Documentation matches implementation

### **tree** - Perfect Implementation
```typescript
/**
 * Display directory structure for loaded component (requires context)  ← DOCUMENTED
 * @param depth Maximum depth to traverse
 * @cliSyntax depth showHidden  ← HAS @cliSyntax
 * @cliDefault depth 3
 */
async tree(depth: string = '3', showHidden: string = 'false'): Promise<this> {
  const context = this.getComponentContext();  ← CHECKS CONTEXT
  if (!context) {
    throw new Error('No component context loaded. Use "on <component> <version>" first.');
  }
  // ... implementation
}
```

**Status:** ✅ Perfect
- Documentation says "(requires context)"
- Has @cliSyntax → Discoverable
- Checks context → Safe

### **links** - Perfect Dual-Mode Implementation
```typescript
/**
 * Display semantic version links - shows own links if no context, or target component links if context loaded
 * @cliSyntax  ← HAS @cliSyntax
 * @cliExample web4tscomponent links
 * @cliExample web4tscomponent on Unit 0.3.2.0 links
 */
async links(): Promise<this> {
  const context = this.getComponentContext();  ← CHECKS CONTEXT
  
  if (!context) {
    // No context - show Web4TSComponent's own links
    // ... show own links
  } else {
    // Context loaded - show target component links
    // ... show target links
  }
  
  return this;
}
```

**Status:** ✅ Perfect Dual-Mode Pattern
- Works WITHOUT context (shows own links)
- Works WITH context (shows target links)
- Has @cliSyntax → Discoverable
- Documentation explains both modes

### **build** - Perfect Dual-Mode Implementation
```typescript
/**
 * Execute build command - builds own component if no context, or target component if context loaded
 * @cliSyntax  ← HAS @cliSyntax
 * @cliExample web4tscomponent build
 * @cliExample web4tscomponent on Unit 0.3.0.5 build
 */
async build(): Promise<this> {
  const context = this.getComponentContext();  ← CHECKS CONTEXT
  
  if (!context) {
    // No context - build Web4TSComponent itself
    // ... build self
  } else {
    // Context loaded - build target component
    // ... build target
  }
  
  return this;
}
```

**Status:** ✅ Perfect Dual-Mode Pattern
- Works WITHOUT context (builds self)
- Works WITH context (builds target)
- Has @cliSyntax → Discoverable

---

## 🚨 CRITICAL ISSUES FOUND

### Issue #1: **setDev** - Missing @cliSyntax

**Current State:**
```typescript
/**
 * Set development version link - version currently under development
 * @param targetVersion Version to set as dev (default: use current context version)
 * @example setDev 0.4.0.0
 * @example setDev
 * ❌ MISSING: @cliSyntax
 */
async setDev(targetVersion: string = 'current'): Promise<this> {
  const context = this.getComponentContext();  ← CHECKS CONTEXT
  if (!context) {
    throw new Error('No component context loaded. Use "on <component> <version>" first.');
  }
  // ... implementation
}
```

**Problem:**
- ❌ NO @cliSyntax annotation
- ❌ Method is NOT discoverable in CLI
- ❌ Users cannot use this method via CLI
- ✅ Has context check (correct)
- ✅ Has @example (but useless without @cliSyntax)

**Impact:** **HIGH** - Essential workflow method is hidden from CLI

**Fix Required:**
```typescript
/**
 * Set development version link - version currently under development (requires context)
 * @param targetVersion Version to set as dev (default: use current context version)
 * @cliSyntax targetVersion
 * @cliDefault targetVersion current
 * @cliExample web4tscomponent on Unit 0.3.0.5 setDev
 * @cliExample web4tscomponent on Unit 0.3.0.5 setDev 0.4.0.0
 */
```

---

### Issue #2: **setTest** - Missing @cliSyntax

**Current State:**
```typescript
/**
 * Set test version link - version ready for 100% revision testing
 * @param targetVersion Version to set as test (default: use current context version)
 * @example setTest 0.3.2.0
 * @example setTest
 * ❌ MISSING: @cliSyntax
 */
async setTest(targetVersion: string = 'current'): Promise<this> {
  const context = this.getComponentContext();  ← CHECKS CONTEXT
  if (!context) {
    throw new Error('No component context loaded. Use "on <component> <version>" first.');
  }
  // ... implementation
}
```

**Problem:**
- ❌ NO @cliSyntax annotation
- ❌ Method is NOT discoverable in CLI
- ✅ Has context check (correct)

**Impact:** **HIGH** - Essential workflow method is hidden from CLI

**Fix Required:**
```typescript
/**
 * Set test version link - version ready for 100% revision testing (requires context)
 * @param targetVersion Version to set as test (default: use current context version)
 * @cliSyntax targetVersion
 * @cliDefault targetVersion current
 * @cliExample web4tscomponent on Unit 0.3.0.5 setTest
 * @cliExample web4tscomponent on Unit 0.3.0.5 setTest 0.3.2.0
 */
```

---

### Issue #3: **setProd** - Missing @cliSyntax

**Current State:**
```typescript
/**
 * Set production version link - version that achieved 100% testing success
 * @param targetVersion Version to set as prod (default: use current context version)
 * @example setProd 0.3.1.0
 * @example setProd
 * ❌ MISSING: @cliSyntax
 */
async setProd(targetVersion: string = 'current'): Promise<this> {
  const context = this.getComponentContext();  ← CHECKS CONTEXT
  if (!context) {
    throw new Error('No component context loaded. Use "on <component> <version>" first.');
  }
  // ... implementation
}
```

**Problem:**
- ❌ NO @cliSyntax annotation
- ❌ Method is NOT discoverable in CLI
- ✅ Has context check (correct)

**Impact:** **HIGH** - Essential workflow method is hidden from CLI

**Fix Required:**
```typescript
/**
 * Set production version link - version that achieved 100% testing success (requires context)
 * @param targetVersion Version to set as prod (default: use current context version)
 * @cliSyntax targetVersion
 * @cliDefault targetVersion current
 * @cliExample web4tscomponent on Unit 0.3.0.5 setProd
 * @cliExample web4tscomponent on Unit 0.3.0.5 setProd 0.3.1.0
 */
```

---

## 📊 Audit Summary

### Methods Requiring Fixes:

| Method | Issue | Severity | Has Context Check | Has @cliSyntax | Discoverable |
|--------|-------|----------|-------------------|----------------|--------------|
| `setDev` | Missing @cliSyntax | HIGH | ✅ Yes | ❌ No | ❌ No |
| `setTest` | Missing @cliSyntax | HIGH | ✅ Yes | ❌ No | ❌ No |
| `setProd` | Missing @cliSyntax | HIGH | ✅ Yes | ❌ No | ❌ No |

### Methods Properly Implemented (Examples):

| Method | Pattern | Has @cliSyntax | Has Context Check | Status |
|--------|---------|----------------|-------------------|--------|
| `upgrade` | Context Required | ✅ Yes | ✅ Yes | ✅ Perfect |
| `tree` | Context Required | ✅ Yes | ✅ Yes | ✅ Perfect |
| `setLatest` | Context Required | ✅ Yes | ✅ Yes | ✅ Perfect |
| `start` | Context Required | ✅ Yes | ✅ Yes | ✅ Perfect |
| `clean` | Context Required | ✅ Yes | ✅ Yes | ✅ Perfect |
| `links` | Dual-Mode | ✅ Yes | ✅ Yes (conditional) | ✅ Perfect |
| `build` | Dual-Mode | ✅ Yes | ✅ Yes (conditional) | ✅ Perfect |
| `test` | Dual-Mode | ✅ Yes | ✅ Yes (conditional) | ✅ Perfect |

---

## 🎯 Patterns Identified

### Pattern A: Context Required (Strict)
```typescript
/**
 * Method description (requires context)
 * @param param Description
 * @cliSyntax param
 * @cliDefault param defaultValue
 * @cliExample web4tscomponent on Component 0.1.0.0 methodName
 */
async methodName(param: string = 'default'): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('No component context loaded. Use "on <component> <version>" first.');
  }
  // ... use context ...
  return this;
}
```

**Use when:** Method ALWAYS needs component context to operate.

**Examples:** `upgrade`, `tree`, `setLatest`, `start`, `clean`, `setDev`, `setTest`, `setProd`

### Pattern B: Dual-Mode (Context Optional)
```typescript
/**
 * Method description - works on self if no context, or target if context loaded
 * @cliSyntax
 * @cliExample web4tscomponent methodName
 * @cliExample web4tscomponent on Component 0.1.0.0 methodName
 */
async methodName(): Promise<this> {
  const context = this.getComponentContext();
  
  if (!context) {
    // Work on Web4TSComponent itself
    // ... operate on self ...
  } else {
    // Work on target component
    // ... operate on target ...
  }
  
  return this;
}
```

**Use when:** Method can operate on self OR on target component.

**Examples:** `links`, `build`, `test`

### Pattern C: No Context (Independent)
```typescript
/**
 * Method description
 * @param param Description
 * @cliSyntax param1 param2
 * @cliExample web4tscomponent methodName param1 param2
 */
async methodName(param1: string, param2: string): Promise<this> {
  // No context check - operates independently
  // ... implementation ...
  return this;
}
```

**Use when:** Method never needs component context.

**Examples:** `create`, `find`, `on`

---

## 🔧 Recommended Fixes

### Fix Priority: HIGH

**All three methods (`setDev`, `setTest`, `setProd`) need immediate fixes:**

1. Add `@cliSyntax targetVersion` annotation
2. Add `@cliDefault targetVersion current` annotation
3. Add "(requires context)" to documentation
4. Update @example to @cliExample with proper context usage

---

## 🧪 Verification Steps

After fixes are applied:

1. **Build Component:**
   ```bash
   npm run build
   ```

2. **Verify Methods Appear in CLI:**
   ```bash
   ./web4tscomponent | grep -E "(setDev|setTest|setProd)"
   ```

3. **Test Context-Required Behavior:**
   ```bash
   # Should fail with clear error message
   ./web4tscomponent setDev 0.4.0.0
   
   # Should succeed
   ./web4tscomponent on Web4TSComponent 0.3.3.2 setDev 0.4.0.0
   ```

4. **Test Method Chaining:**
   ```bash
   ./web4tscomponent on Unit 0.3.0.5 setDev 0.4.0.0 setTest 0.4.0.0 build
   ```

---

## 📝 CMM4 Lessons Learned

### Why This Happened:

1. **Pattern Inconsistency:** Some methods added with @example instead of @cliSyntax
2. **Auto-Discovery Gap:** Methods work internally but not discoverable externally
3. **Documentation Drift:** Implementation correct, documentation incomplete

### Prevention Strategy:

1. **Method Addition Checklist:** Always include @cliSyntax for public methods
2. **Test Discovery:** Run `./component | grep methodName` after adding methods
3. **Pattern Templates:** Use existing perfect methods as templates
4. **Automated Checks:** Add lint rule to verify @cliSyntax presence

### This is CMM4 in Action:

- ✅ **Whitebox Understanding:** Analyzed ALL methods systematically
- ✅ **Feedback Loop:** Identified gaps through comprehensive audit
- ✅ **Pattern Recognition:** Documented three distinct patterns
- ✅ **Systematic Fix:** Clear, reproducible correction strategy
- ✅ **Prevention:** Lessons learned to avoid future occurrences

---

**Audit Status:** Complete  
**Issues Found:** 3 HIGH priority  
**Fix Strategy:** Documented and ready for implementation  
**Estimated Fix Time:** 10 minutes (3 methods × ~3 minutes each)
