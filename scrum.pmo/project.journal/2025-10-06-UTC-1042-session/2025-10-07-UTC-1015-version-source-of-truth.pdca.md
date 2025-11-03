<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: Version Source of Truth - Directory vs package.json**

**🗓️ Date:** 2025-10-07-UTC-1015  
**🎯 Objective:** Determine the correct single source of truth for component versions - version directory name OR package.json  
**🎯 Template Version:** 3.2.4.2  
**🏅 CMM Badge:** CMM3 (Objective Definition - Systematic Analysis)  

**👤 Agent Name:** Claude  
**👤 Agent Role:** Architecture Decision Analysis Agent  
**👤 Branch:** dev/0308  
**🔄 Sync Requirements:** None (architectural analysis)  
**🎯 Project Journal Session:** 2025-10-06-UTC-1042-session → CMM3 compliance integration and audit documentation  
**🎯 Sprint:** N/A → Mid-session architectural clarification  
**✅ Task:** Analyze and decide: version directory name vs package.json as version source of truth  
**🚨 Issues:** Current implementation uses package.json but version directories are the actual file system structure  

---

## **📊 PLAN**

### **The Question:**

**What should be the single source of truth for a component's version?**

1. **Option A: Version Directory Name** (e.g., `0.3.4.1/`)
2. **Option B: package.json inside version directory** (e.g., `0.3.4.1/package.json`)

### **Current Situation:**

**What we just implemented:**
```typescript
// Web4TSComponentCLI.ts
private readVersionFromPackageJson(): string {
  const packageJsonPath = join(__dirname, '..', '..', '..', 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version; // Reading from package.json
}
```

**File System Structure:**
```
components/Web4TSComponent/
├── 0.3.4.1/              ← Version directory (name defines version)
│   ├── package.json      ← Contains "version": "0.3.4.1"
│   ├── src/
│   └── test/
├── 0.3.5.0/              ← Next version directory
│   └── package.json      ← Contains "version": "0.3.5.0"
└── latest → 0.3.5.0      ← Symlink (follows directory structure)
```

### **Analysis Framework:**

| Criterion | Version Directory | package.json | Winner |
|-----------|------------------|--------------|--------|
| **Filesystem Truth** | ✅ Actual structure | ❌ Just metadata | Directory |
| **npm Ecosystem** | ❌ Not npm-aware | ✅ Standard location | package.json |
| **Version Promotion** | ✅ Rename directory = version change | ❌ Must edit file | Directory |
| **Symlink Resolution** | ✅ Direct path parsing | ❌ Requires file read | Directory |
| **Self-Documentation** | ✅ `ls` shows versions | ❌ Need to open files | Directory |
| **Build Tools** | ❌ Non-standard | ✅ All tools read it | package.json |
| **Git Operations** | ✅ Move = atomic version change | ❌ File edit + commit | Directory |
| **Consistency Risk** | ⚠️ Directory ≠ package.json possible | ⚠️ package.json ≠ directory possible | TIE |

### **Critical Question:**

**Can directory name and package.json ever disagree?**

**Scenario 1: Manual Error**
```bash
# Oops! Created 0.3.5.0 directory but forgot to update package.json
components/Web4TSComponent/0.3.5.0/package.json → "version": "0.3.4.1"
```

**Scenario 2: Git Merge Conflict**
```bash
# Someone renamed directory, someone else updated package.json
git mv 0.3.4.1 0.3.5.0
# Conflict! Which version is correct?
```

**Scenario 3: Version Promotion Workflow**
```bash
# Step 1: Create directory
mkdir components/Web4TSComponent/0.3.5.0

# Step 2: Copy files
cp -r 0.3.4.1/* 0.3.5.0/

# Step 3: Update package.json  ← MUST REMEMBER THIS STEP!
sed -i 's/0.3.4.1/0.3.5.0/' 0.3.5.0/package.json
```

### **The Web4 Philosophy:**

**What does Web4 Component Architecture emphasize?**
1. **Filesystem as Database** - Directory structure IS the data model
2. **Version Isolation** - Each version in separate directory
3. **Semantic Versioning** - Directory names follow semver
4. **Symlink-based Promotion** - `latest`, `dev`, `test`, `prod` symlinks
5. **CLI Auto-Discovery** - Find components by scanning filesystem

**Key Insight:**
```bash
# This command shows ALL versions instantly:
ls components/Web4TSComponent/
# Output: 0.3.4.1  0.3.5.0  0.3.5.1  latest  dev  test  prod

# This command requires reading N files:
find components/Web4TSComponent -name package.json -exec jq -r .version {} \;
```

---

## **🛠️ DO**

### **Decision Analysis:**

#### **Option A: Version Directory as Source of Truth**

**Pros:**
- ✅ **Filesystem is database** - Directory name IS the version
- ✅ **Atomic version changes** - `git mv` changes version in one step
- ✅ **No synchronization issues** - Only one place to update
- ✅ **Fast lookups** - `basename $(pwd)` vs reading file
- ✅ **Self-documenting** - `ls` shows all versions immediately
- ✅ **Symlink logic** - `readlink latest` gives version directly
- ✅ **CLI discovery** - Scan directories, not files

**Cons:**
- ❌ **Non-standard** - npm ecosystem expects package.json
- ❌ **Build tool confusion** - Tools read package.json by default
- ❌ **Publishing issues** - `npm publish` uses package.json version
- ❌ **Editor confusion** - IDEs show package.json version in UI

**Implementation:**
```typescript
private getCurrentVersion(): string {
  // Get version from directory name (source of truth)
  const currentDir = path.basename(process.cwd());
  
  // Validate it's a version directory
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(currentDir)) {
    throw new Error(`Not in a version directory: ${currentDir}`);
  }
  
  return currentDir;
}

// Keep package.json in sync (validation only)
private validatePackageJsonSync(): void {
  const dirVersion = this.getCurrentVersion();
  const pkgVersion = JSON.parse(readFileSync('package.json', 'utf-8')).version;
  
  if (dirVersion !== pkgVersion) {
    throw new Error(`Version mismatch! Directory: ${dirVersion}, package.json: ${pkgVersion}`);
  }
}
```

#### **Option B: package.json as Source of Truth**

**Pros:**
- ✅ **npm ecosystem standard** - All tools expect it
- ✅ **Build tool compatibility** - Works with existing tooling
- ✅ **Publishing workflow** - `npm publish` just works
- ✅ **Editor support** - IDEs show version correctly
- ✅ **Industry standard** - Everyone knows package.json

**Cons:**
- ❌ **Consistency risk** - Directory name can drift from package.json
- ❌ **Two sources of truth** - Directory name AND file content
- ❌ **Slower lookups** - Must read and parse JSON file
- ❌ **Version promotion complexity** - Must update directory AND file
- ❌ **Symlink confusion** - Symlink points to directory, but version in file

**Implementation (Current):**
```typescript
private readVersionFromPackageJson(): string {
  const packageJsonPath = join(__dirname, '..', '..', '..', 'package.json');
  const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  return packageJson.version;
}

// Directory name must be kept in sync (manual effort)
// Risk: Directory says 0.3.5.0, package.json says 0.3.4.1
```

### **Hybrid Approach: Directory is Truth, package.json is Slave**

**Philosophy:**
- **Directory name is the authoritative version** (Web4 principle)
- **package.json must match directory** (validation enforced)
- **Build scripts auto-sync package.json** (eliminate manual errors)

**Implementation:**
```typescript
private getCurrentVersion(): string {
  // TRUTH: Read from directory name
  const currentDir = path.basename(process.cwd());
  
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(currentDir)) {
    // Not in a version directory - try package.json as fallback
    try {
      const pkgVersion = JSON.parse(readFileSync('package.json', 'utf-8')).version;
      console.warn(`⚠️  Not in version directory, using package.json: ${pkgVersion}`);
      return pkgVersion;
    } catch {
      throw new Error('Cannot determine version: not in version directory and no package.json');
    }
  }
  
  // VALIDATION: Ensure package.json matches
  try {
    const pkgVersion = JSON.parse(readFileSync('package.json', 'utf-8')).version;
    if (currentDir !== pkgVersion) {
      console.error(`❌ VERSION MISMATCH DETECTED!`);
      console.error(`   Directory: ${currentDir}`);
      console.error(`   package.json: ${pkgVersion}`);
      console.error(`   Auto-fixing package.json to match directory...`);
      this.autoFixPackageJsonVersion(currentDir);
    }
  } catch (error) {
    console.warn(`⚠️  Could not validate package.json: ${error}`);
  }
  
  return currentDir; // Directory is truth
}

private autoFixPackageJsonVersion(correctVersion: string): void {
  const packageJsonPath = 'package.json';
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = correctVersion;
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`   ✅ Auto-fixed package.json version to ${correctVersion}`);
}
```

**Benefits:**
- ✅ Clear hierarchy: Directory = truth, package.json = derivative
- ✅ Self-healing: Auto-fixes mismatches automatically
- ✅ Web4 compliant: Filesystem is database
- ✅ npm compatible: package.json is always correct after auto-fix
- ✅ Error prevention: Catches and fixes human mistakes

---

## **✅ CHECK**

### **Validation Criteria:**

| Requirement | Option A (Directory) | Option B (package.json) | Hybrid |
|-------------|---------------------|------------------------|--------|
| **Web4 Compliant** | ✅ YES | ❌ NO (two sources) | ✅ YES |
| **npm Compatible** | ⚠️ Needs sync | ✅ YES | ✅ YES (auto-sync) |
| **Consistency Guaranteed** | ✅ YES (one source) | ❌ NO (can drift) | ✅ YES (auto-fix) |
| **Fast Lookups** | ✅ YES | ❌ NO (file I/O) | ✅ YES |
| **Error Prone** | ❌ NO | ✅ YES (two places) | ❌ NO (auto-heals) |
| **Symlink Logic** | ✅ Simple | ⚠️ Complex | ✅ Simple |
| **Version Promotion** | ✅ One step | ❌ Two steps | ✅ One step + auto-fix |

### **Test Case:**

**Scenario: Version Promotion (0.3.4.1 → 0.3.5.0)**

**Current Approach (package.json as truth):**
```bash
1. Create directory: mkdir 0.3.5.0
2. Copy files: cp -r 0.3.4.1/* 0.3.5.0/
3. Edit package.json: sed -i 's/0.3.4.1/0.3.5.0/' 0.3.5.0/package.json  ← MUST REMEMBER!
4. Update symlinks: ln -sf 0.3.5.0 latest
5. Test: cd 0.3.5.0 && npm test

Risk: Forget step 3 → Version says 0.3.4.1 but directory says 0.3.5.0
```

**Hybrid Approach (directory as truth, auto-fix):**
```bash
1. Create directory: mkdir 0.3.5.0
2. Copy files: cp -r 0.3.4.1/* 0.3.5.0/
3. Enter directory: cd 0.3.5.0
4. Run build: npm run build
   → Auto-detects mismatch
   → Auto-fixes package.json to 0.3.5.0
   → Build succeeds
5. Update symlinks: ln -sf 0.3.5.0 latest
6. Test: npm test

Result: IMPOSSIBLE to have version mismatch (auto-heals on first build)
```

---

## **🔄 ACT**

### **Decision:**

**IMPLEMENT HYBRID APPROACH**

**Rationale:**
1. **Web4 Philosophy**: Directory name IS the version (filesystem as database)
2. **npm Compatibility**: package.json auto-synced for tooling
3. **Error Prevention**: Auto-healing eliminates human mistakes
4. **CMM3 Compliance**: Single source of truth with validation
5. **Best of Both Worlds**: Web4 principles + npm ecosystem compatibility

### **Implementation Plan:**

**Phase 1: Update getCurrentVersion() (Immediate)**
```typescript
// Change from: Read package.json
// Change to: Read directory name, validate/fix package.json
```

**Phase 2: Add Auto-Fix Logic**
```typescript
// Detect mismatch → backup old package.json → write correct version
```

**Phase 3: Update Tests**
```typescript
// Test: Mismatch detection
// Test: Auto-fix behavior
// Test: Fallback when not in version directory
```

**Phase 4: Update Documentation**
```markdown
# Version Source of Truth

**RULE: Directory name is the authoritative version.**

package.json is automatically synchronized to match directory name.

If mismatch detected:
1. Backup created: package.json.backup.TIMESTAMP
2. package.json auto-fixed to match directory
3. Warning logged but build continues
```

### **Migration Strategy:**

**For existing code:**
1. ✅ Keep current package.json reading (backward compatible)
2. ✅ Add directory name validation
3. ✅ Add auto-fix on mismatch
4. ✅ Log warnings but don't break existing workflows

**For new components:**
1. ✅ Directory name = version (enforced)
2. ✅ package.json auto-generated to match
3. ✅ Templates updated to sync automatically

### **Next Steps:**

1. Update `getCurrentVersion()` in `DefaultWeb4TSComponent.ts`
2. Add `autoFixPackageJsonVersion()` helper
3. Update `Web4TSComponentCLI.ts` to use directory-based version
4. Add test cases for mismatch detection and auto-fix
5. Update README to document the hierarchy

---

## **🔄 PDCA PROCESS UPDATE**

**Compliance Check:** Template 3.2.4.2 ✅, Dual links ✅, UTC timestamp ✅, 6 sections ✅, CMM Badge ✅

**Next Cycle:** Implement hybrid approach → version directory as truth, package.json as auto-synced slave

---

**📊 One-line Summary:** Analyzed version source of truth: **Directory name is authoritative** (Web4 principle), package.json auto-synced for npm compatibility (hybrid approach eliminates consistency risks). ✅🔄

---

### **📚 The 42 Revelation**
**Understanding requires regression testing:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md](../../project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md)

**CMM4 Achievement Excellence:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-27-UTC-2251/scrum.pmo/roles/SaveRestartAgent/pdca/2025-09-28-UTC-1108.pdca.md) | [§/scrum.pmo/roles/SaveRestartAgent/pdca/2025-09-28-UTC-1108.pdca.md](../../roles/SaveRestartAgent/pdca/2025-09-28-UTC-1108.pdca.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨

