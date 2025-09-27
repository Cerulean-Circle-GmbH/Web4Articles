# 📋 **PDCA Cycle: ONCE CLI Naming Pattern Standardization**

**📅 Date:** 2025-08-29 UTC 17:55  
**🎯 Objective:** Fix ONCE CLI naming to match scripts/versions/ directory pattern  
**👤 Role:** Developer  
**🚨 Issues:** Inconsistent naming pattern breaking scripts/versions/ conventions  
**📎 Previous Commit:** Fix ONCE CLI naming: once0.1.0.0 → once-v0.1.0.0 to match scripts/versions/ pattern (changerequest-v*, requirement-v*, etc.)  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/scrum.pmo/project.journal/2025-08-29-UTC-1616-comprehensive-learning-session/pdca/2025-08-29-UTC-1750-web4cli-compliance-and-once-commands.md) | [../2025-08-29-UTC-1750-web4cli-compliance-and-once-commands.md](../2025-08-29-UTC-1750-web4cli-compliance-and-once-commands.md)  

## 📋 **Summary**

### **Artifact Links**
- [GitHub: setup-once-links.sh](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/scripts/setup-once-links.sh) | [scripts/setup-once-links.sh](scripts/setup-once-links.sh)
- [GitHub: once-v0.1.0.0](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/scripts/versions/once-v0.1.0.0) | [scripts/versions/once-v0.1.0.0](scripts/versions/once-v0.1.0.0)
- [GitHub: OnceCLI.ts](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/main/components/ONCE/0.1.0.0/src/ts/layer5/OnceCLI.ts) | [components/ONCE/0.1.0.0/src/ts/layer5/OnceCLI.ts](components/ONCE/0.1.0.0/src/ts/layer5/OnceCLI.ts)

### **QA Decisions**
- [x] Naming pattern analyzed: All tools use `{tool}-v{version}` format
- [x] ONCE CLI corrected: `once0.1.0.0` → `once-v0.1.0.0`  
- [x] Setup script updated: Generator now produces correct naming
- [x] CLI path references updated: Internal paths now point to correct script name
- [x] Old incorrectly named file removed and regenerated properly

---

## 🎯 **Plan**

### **Pattern Analysis Strategy**
1. **Examine scripts/versions/ Convention:** Identify standard naming pattern
2. **Locate ONCE Naming Issue:** Find where `once0.1.0.0` is generated
3. **Fix Generator Logic:** Update setup script to use correct pattern
4. **Update References:** Correct CLI internal path references
5. **Clean Migration:** Remove old file and regenerate with correct naming

### **Standard Pattern Discovered**
- `changerequest-v0.1.0.0`
- `requirement-v0.1.2.2`  
- `unit-v0.1.0.0`
- `user-v0.1.0.0`
- `web4tscomponent-v0.1.0.4`

**Pattern:** `{tool}-v{version}` not `{tool}{version}`

---

## 🔧 **Do**

### **Naming Convention Analysis**
1. **✅ Pattern Discovery:** Examined `scripts/versions/` directory structure
2. **✅ Inconsistency Identified:** `once0.1.0.0` breaks established `{tool}-v{version}` pattern
3. **✅ Root Cause Located:** Generator script used `once$ONCE_VERSION` instead of `once-v$ONCE_VERSION`

### **Fix Implementation**
```bash
# Before (incorrect pattern)
ONCE_VERSIONED="$VERSIONS_DIR/once$ONCE_VERSION"    # once0.1.0.0

# After (correct pattern)  
ONCE_VERSIONED="$VERSIONS_DIR/once-v$ONCE_VERSION"  # once-v0.1.0.0
```

### **Files Updated**
1. **✅ scripts/setup-once-links.sh:** Generator logic corrected
2. **✅ components/ONCE/0.1.0.0/src/ts/layer5/OnceCLI.ts:** Path references updated
3. **✅ Migration Executed:** Old file removed, new file generated
4. **✅ Usage Messages:** Setup script output corrected

### **CLI Reference Updates**
```typescript
// Before
console.log(`scripts/versions/once${this.onceVersion}`);

// After  
console.log(`scripts/versions/once-v${this.onceVersion}`);
```

---

## ✅ **Check**

### **QA Feedback**
*User Request: "look at the naming pattens in scripts/versions/ and fix once0.1.0.0 where it comes into existance." - 2025-08-29T17:55:00Z*

### **Verification Results**
1. **✅ Pattern Consistency:** Now matches all other tools in scripts/versions/
   - `changerequest-v0.1.0.0` ✅
   - `requirement-v0.1.2.2` ✅
   - `once-v0.1.0.0` ✅ (fixed)
   - `unit-v0.1.0.0` ✅
   - `web4tscomponent-v0.1.0.4` ✅

2. **✅ Functional Testing:**
   - `scripts/versions/once-v0.1.0.0 version` works correctly
   - Path display shows correct location
   - Generator produces correct naming
   - Old incorrectly named file removed

3. **✅ Reference Integrity:**
   - CLI internal paths updated
   - Setup script usage messages corrected
   - No broken links or references remain

4. **✅ Convention Compliance:**
   - Follows established scripts/versions/ directory standard
   - Maintains semantic versioning with proper delimiters
   - Professional naming consistency across all tools

---

## 🚀 **Act**

### **PDCA Process Update**
- **Naming Convention Enforced:** ONCE CLI now follows established scripts/versions/ pattern
- **Generator Logic Improved:** Setup script produces consistent naming across regenerations  
- **Reference Integrity Maintained:** All internal paths and displays updated accordingly
- **Migration Completed:** Clean transition from incorrect to correct naming

### **Architectural Benefits**
1. **Consistency:** All CLI tools now follow identical naming convention
2. **Predictability:** Users can expect `{tool}-v{version}` pattern universally  
3. **Maintainability:** Standard pattern easier to script and automate
4. **Professional Polish:** Eliminates naming inconsistencies in tool ecosystem

### **Pattern Evidence**
```bash
scripts/versions/
├── changerequest-v0.1.0.0
├── once-v0.1.0.0          # ✅ Now correct
├── requirement-v0.1.2.2
├── unit-v0.1.0.0
└── web4tscomponent-v0.1.0.4
```

### **Future Prevention**
- All new CLI tools will follow established `{tool}-v{version}` pattern
- Setup scripts reviewed for naming consistency
- Pattern documentation implicit in directory structure

---

**📋 One-line Summary:** Successfully standardized ONCE CLI naming from `once0.1.0.0` to `once-v0.1.0.0` matching scripts/versions/ directory pattern, ensuring consistency across all Web4 CLI tools 🎯✅📝
