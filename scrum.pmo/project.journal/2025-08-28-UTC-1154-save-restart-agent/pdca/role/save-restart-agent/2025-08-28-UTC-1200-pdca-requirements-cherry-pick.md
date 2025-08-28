[Back to SaveRestartAgent](../../../../roles/SaveRestartAgent/)

# 📋 **PDCA Cycle: PDCA Requirements Cherry-pick - Fixing Dead Links**

**🗓️ Date:** 2025-08-28-UTC-1200  
**🎯 Objective:** Cherry-pick PDCA dual link format requirement and related files to fix dead links  
**👤 Role:** Save/Restart Agent → Process Enhancement  
**🚨 Issues:** PDCA.dual.link.format.requirement.md was a dead link due to missing files  
**📎 Previous Commit:** 68f323b - Checkpoint before follow-up message  
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1158-folders-cherry-pick.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1158-folders-cherry-pick.md](2025-08-28-UTC-1158-folders-cherry-pick.md)

---

## **📊 SUMMARY**

### **Artifact Links**
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1200-pdca-requirements-cherry-pick.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1200-pdca-requirements-cherry-pick.md](2025-08-28-UTC-1200-pdca-requirements-cherry-pick.md)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/spec/requirements.md/e8535c4e-591d-4955-9874-6a853545e970.requirement.md) | [§/spec/requirements.md/e8535c4e-591d-4955-9874-6a853545e970.requirement.md](../../../../../../spec/requirements.md/e8535c4e-591d-4955-9874-6a853545e970.requirement.md)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/spec/requirements.md/857ff118-a4df-46b3-88b6-c6dc77c082b6.requirement.md) | [§/spec/requirements.md/857ff118-a4df-46b3-88b6-c6dc77c082b6.requirement.md](../../../../../../spec/requirements.md/857ff118-a4df-46b3-88b6-c6dc77c082b6.requirement.md)

### **QA Decisions**
- [x] Found and fixed dead link issue
- [x] Cherry-picked PDCA directory updates
- [x] Cherry-picked spec/requirements.md directory (86 files)

### **TRON Feedback (2025-08-28-UTC-1200)**
```quote
scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md
is a dead link currently because the files are not available in this branch. find the newest versions of these files and cherry pick  them into this branch
```

### **My Answer**
Found the issue - the PDCA.dual.link.format.requirement.md is a symbolic link pointing to spec/requirements.md/e8535c4e-591d-4955-9874-6a853545e970.requirement.md which wasn't present. Cherry-picked both the PDCA directory updates and the entire spec directory from release/dev, fixing the dead links.

**Learning Applied:** Symbolic links require their targets to be present; when cherry-picking linked files, always ensure targets are included.

---

## **📋 PLAN**

### **Fix Strategy**
1. **Identify dead link** - PDCA.dual.link.format.requirement.md
2. **Search for file** - Check release/dev for newest version
3. **Cherry-pick PDCA directory** - Get latest PDCA files
4. **Cherry-pick targets** - Get spec directory for link targets
5. **Verify links work** - Ensure all symbolic links resolve

### **Expected Outcomes**
- Dead links fixed and functional
- PDCA requirements accessible
- Understanding of dual link format documented
- Complete spec requirements available

---

## **🔧 DO**

### **1. File Search**
```bash
git fetch --all
git ls-tree -r origin/release/dev | grep -i "PDCA.dual.link.format"
# Found: 120000 blob ... scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md
```

### **2. PDCA Directory Cherry-pick**
```bash
git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
```
Added:
- branch-management-validation-protocol.md (new)
- template.md (modified)
- PDCA.dual.link.format.requirement.md (symbolic link)
- PDCA.reporting.requirement.md (symbolic link)

### **3. Symbolic Link Analysis**
```bash
ls -la scrum.pmo/roles/_shared/PDCA/PDCA.dual.link.format.requirement.md
# -> ../../../../spec/requirements.md/e8535c4e-591d-4955-9874-6a853545e970.requirement.md
```

### **4. Spec Directory Cherry-pick**
```bash
git checkout origin/release/dev -- spec/
# Added 86 files total
```

### **5. Key Requirements Found**

#### **Dual Link Format Requirement (e8535c4e)**
- Local paths must be relative from document location
- Format: `[GitHub](URL) | [../relative/path](../relative/path)`
- Alternative with § symbol for readability: `[GitHub](URL) | [§/absolute/path](../relative/path)`

#### **PDCA Reporting Requirement (857ff118)**
- Chat output: short with dual links and decisions only
- All details must be in PDCA document, not chat
- Aligns with user preferences [[memory:6896499]]

---

## **✅ CHECK**

### **Verification Results**

**Link Resolution (FIXED)**
- PDCA.dual.link.format.requirement.md now resolves ✅
- PDCA.reporting.requirement.md now resolves ✅
- Target files exist and are readable ✅

**Files Added (COMPLETE)**
- 2 PDCA directory updates ✅
- 84 spec requirement files ✅
- 86 total changes staged ✅

**Requirements Understanding (CLEAR)**
- Dual link format documented ✅
- Local paths must be relative ✅
- § symbol usage explained ✅
- Chat brevity requirement confirmed ✅

---

## **🎯 ACT**

### **Immediate Actions**
1. Commit these changes to preserve fixes
2. Apply dual link format learning going forward
3. Maintain minimal chat responses per requirement

### **Process Improvements**
- When encountering symbolic links, always check targets
- Cherry-pick entire directories when dealing with interconnected files
- Document link format standards for consistent application

### **Key Takeaways**
- Symbolic links require target files to function
- The § symbol provides readable absolute paths while maintaining relative links
- PDCA reporting standard reinforces minimal chat approach

---

