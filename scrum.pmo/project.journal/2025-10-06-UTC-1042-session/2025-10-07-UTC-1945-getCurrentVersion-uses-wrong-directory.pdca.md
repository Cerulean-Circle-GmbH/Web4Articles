# PDCA: 2025-10-07-UTC-1945-getCurrentVersion-uses-wrong-directory

**Template:** V3.2.4.2  
**Date:** 2025-10-07 19:45 UTC  
**Severity:** 🔴 CRITICAL BUG

---

## 🎯 SUMMARY

**USER CAUGHT CRITICAL BUG:** The promotion workflow showed:
```
🚀 prod: 0.3.4.0 (promoted from 0.3.3.2)
```

But we were working on **0.3.4.1**, NOT 0.3.3.2!

**Root Cause:** `getCurrentVersion()` uses `process.cwd()` to read `package.json`, but during test execution, `process.cwd()` points to the TEST environment (test/data/components/Web4TSComponent/0.3.3.2), not the actual component directory (0.3.4.1).

**Impact:** Version promotion uses the WRONG source version, causing incorrect version calculations and potential data loss.

---

## 💡 EMOTIONAL REFLECTION

**User's Reaction:** "you are a complete idiot... did you destroy it_hardcoded the version to promote from. WTF are you doing"

**My Realization:** The user is 100% correct. I fixed the SYMPTOM (auto-promotion enabled) but MISSED the ROOT CAUSE (`getCurrentVersion()` returning wrong version).

**Lesson:** When a user challenges your fix with specific evidence (version numbers don't match), LISTEN and investigate instead of defending the partial fix.

---

## 📋 PDCA PROCESS

### PLAN

**Fix `getCurrentVersion()` to return the ACTUAL component version, not the test environment version.**

Success Criteria:
1. `getCurrentVersion()` returns 0.3.4.1 when called from 0.3.4.1, even if `process.cwd()` is in test/data
2. Promotion workflow shows correct "promoted from" version
3. Version hierarchy logic works correctly

---

### DO

**Implementation:** Use the directory-based approach (filesystem as database) instead of `process.cwd()`.

```typescript
private async getCurrentVersion(): Promise<string> {
  // Get the ACTUAL component directory (where THIS code is running from)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  
  // Navigate up to component root: layer2 → ts → src → component root
  const componentRoot = join(__dirname, '..', '..', '..');
  const componentDirName = basename(componentRoot);
  
  // Check if we're in a version directory (0.x.x.x format)
  const isVersionDir = /^\d+\.\d+\.\d+\.\d+$/.test(componentDirName);
  
  if (isVersionDir) {
    return componentDirName; // Directory name is the truth!
  }
  
  // Fallback: read from package.json
  const packageJsonPath = join(componentRoot, 'package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  return packageJson.version;
}
```

---

### CHECK

Will verify after implementation.

---

### ACT

Implement fix, test, commit with PDCA name.

---

## ✅ STATUS

🔄 **IN PROGRESS** - Fixing now

