[Back to SaveRestartAgent](../../../../roles/SaveRestartAgent/)

# 📋 **PDCA Cycle: Web4 Requirements Link Fix - Sprint-20 File Cherry-pick**

**🗓️ Date:** 2025-08-28-UTC-1204  
**🎯 Objective:** Fix broken web4-requirements-paradigm-shifts.md symbolic link  
**👤 Role:** Save/Restart Agent → Process Enhancement  
**🚨 Issues:** Symbolic link pointing to missing sprint-20/web4.requirement.md  
**📎 Previous Commit:** 7171e16 - Audit: Complete symbolic links inventory - 6 broken links found  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1203-symbolic-links-audit.md) | [scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1203-symbolic-links-audit.md](scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1203-symbolic-links-audit.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1204-web4-requirements-link-fix.md) | [scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1204-web4-requirements-link-fix.md](scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1204-web4-requirements-link-fix.md)
- **Fixed File:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/sprints/sprint-20/web4.requirement.md) | [scrum.pmo/sprints/sprint-20/web4.requirement.md](scrum.pmo/sprints/sprint-20/web4.requirement.md)
- **Working Link:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/roles/_shared/external-references/web4-requirements-paradigm-shifts.md) | [scrum.pmo/roles/_shared/external-references/web4-requirements-paradigm-shifts.md](scrum.pmo/roles/_shared/external-references/web4-requirements-paradigm-shifts.md)

### **QA Decisions**
- [x] Fixed web4-requirements-paradigm-shifts.md link
- [x] wiki/UCP.md identified as external repo - cannot fix

### **TRON Feedback (2025-08-28-UTC-1204)**
```quote
the wiki/UCP.md is a problem because it is in another git repo.
but fix docs/architecture/web4-requirements-paradigm-shifts.md
```

### **My Answer**
Initially misunderstood - the link doesn't point to docs/architecture but to sprint-20/web4.requirement.md. Cherry-picked the missing file from release/dev. The link now works correctly. Noted that wiki/UCP.md is in another repository and cannot be fixed here.

**Learning Applied:** Always check the actual symbolic link target, not just the link name which might be misleading.

---

## **📋 PLAN**

### **Fix Strategy**
1. **Understand the issue** - wiki/UCP.md is external repo
2. **Check actual link target** - Not docs/architecture as expected
3. **Find correct target** - sprint-20/web4.requirement.md
4. **Cherry-pick file** - Get from release/dev
5. **Verify fix** - Ensure link resolves

### **Expected Outcomes**
- web4-requirements-paradigm-shifts.md link functional
- Understanding of external repo limitations
- Documentation of actual link structure

---

## **🔧 DO**

### **1. Link Investigation**
```bash
ls -la scrum.pmo/roles/_shared/external-references/web4-requirements-paradigm-shifts.md
# -> ../../../sprints/sprint-20/web4.requirement.md
```
Surprise! Link points to sprint-20, not docs/architecture.

### **2. Target Search**
```bash
git ls-tree -r origin/release/dev | grep "sprint-20/web4.requirement.md"
# Found: 100644 blob 5effb8d7... scrum.pmo/sprints/sprint-20/web4.requirement.md
```

### **3. File Cherry-pick**
```bash
git checkout origin/release/dev -- scrum.pmo/sprints/sprint-20/web4.requirement.md
```

### **4. Link Verification**
```bash
cat scrum.pmo/roles/_shared/external-references/web4-requirements-paradigm-shifts.md | head
# Output: "# Web4 Requirements - Paradigm Shifts from Mainstream Programming"
```
Success! Link now resolves correctly.

### **5. External Repo Issue**
- wiki/UCP.md points to `../../../../wiki/UCP.md`
- This would be outside the Web4Articles repository
- Cannot be fixed within this repo
- Would require the wiki repo to be cloned/linked separately

---

## **✅ CHECK**

### **Verification Results**

**Link Fix (SUCCESSFUL)**
- web4-requirements-paradigm-shifts.md now resolves ✅
- Points to sprint-20/web4.requirement.md ✅
- Content accessible and readable ✅

**External Repo Understanding (CLEAR)**
- wiki/UCP.md cannot be fixed here ✅
- Would require external wiki repository ✅
- Documented for future reference ✅

**Remaining Broken Links (STATUS)**
- 1 external reference (wiki/UCP.md) - unfixable
- 1 project journal 2025-08-18-0833-recovery link
- 3 project journal 2025-08-20-1552 links

---

## **🎯 ACT**

### **Lessons Learned**
1. **Link names can be misleading** - Always check actual targets
2. **External repo links** - Cannot be fixed within current repo
3. **Sprint documentation** - Important files may be in sprint folders

### **Recommendations**
- Document external repo dependencies
- Consider removing or updating wiki/UCP.md link
- Continue fixing remaining broken links if needed

### **Next Steps**
1. Commit this fix
2. Consider fixing remaining project journal links
3. Document external dependencies

---

**One-line Summary:** 🔗 Fixed web4-requirements-paradigm-shifts.md by cherry-picking sprint-20/web4.requirement.md - link name was misleading! 📋✅