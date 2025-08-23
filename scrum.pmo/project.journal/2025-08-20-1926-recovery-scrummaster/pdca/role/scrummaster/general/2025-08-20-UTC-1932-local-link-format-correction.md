# PDCA: Local Link Format Correction - Full Qualified Name

**Date:** 2025-08-20 UTC 19:32  
**Objective:** Correct local link format to use full qualified name as shown in process examples  
**Role:** ScrumMaster (Process Compliance Learning)  
**Issues:** Used /workspace/ prefix instead of relative path from workspace root

---

## **📋 Summary**

### **Artifact Links**
- **This PDCA**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/local-dev/scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1932-local-link-format-correction.md) | [scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1932-local-link-format-correction.md](scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1932-local-link-format-correction.md)

### **QA Decisions**
- [x] **FORMAT ERROR IDENTIFIED**: I was wrong, process examples show correct format
- [x] **FULL QUALIFIED NAME**: Relative path from workspace root without /workspace/
- [x] **SELF-CHECK APPLIED**: Asked "am I wrong or the process?"
- [ ] **COMPLIANCE ACHIEVED**: Using correct format going forward

---

## **Plan**

Study process examples, identify correct local link format, and apply full qualified name as required.

---

## **Do**

### **🎯 QA Feedback Integration:**

> **User Quote (2025-08-20 UTC 19:31)**: *"nice. you learn fast. but i want the local link with full qualified name. you wrong or the process. keep asking that yourself after i prompt."*

### **Self-Check Process:**

**Question:** Am I wrong or is the process wrong?

**Investigation:** Checked actual PDCA examples in fresh-dawn session:
```markdown
[scrum.pmo/project.journal/.../file.md](scrum.pmo/project.journal/.../file.md)
```

**Answer:** I was wrong. The process shows:
- No `/workspace/` prefix
- Full path from workspace root
- Relative format for local links

### **Correct Format Examples:**

**❌ What I did (WRONG):**
```markdown
[Local](/workspace/scrum.pmo/project.journal/...)
```

**✅ What process shows (RIGHT):**
```markdown
[scrum.pmo/project.journal/...](scrum.pmo/project.journal/...)
```

### **Full Qualified Name Understanding:**

- **Full**: Complete path from workspace root
- **Qualified**: Properly formatted for the context
- **Name**: The actual file path as it appears in the repository

---

## **Check**

### **Format Validation:**

**Process Examples Checked:**
- ✅ Fresh dawn session PDCAs use relative paths
- ✅ No /workspace/ prefix in any examples
- ✅ Full path from repository root
- ✅ Both link text and href use same path

**Self-Check Results:**
- ✅ Asked myself the question as instructed
- ✅ Found I was wrong, not the process
- ✅ Learned correct format from examples
- ✅ Ready to apply consistently

---

## **Act**

### **Immediate Actions:**

1. **Use Correct Format**: All future local links without /workspace/
2. **Maintain Self-Check**: Always ask "am I wrong or the process?"
3. **Follow Examples**: When uncertain, check existing PDCAs

### **Guardian Angel Teaching Applied:**

**"Keep asking that yourself after I prompt"**
- This creates a feedback loop for continuous improvement
- Prevents assumption that process is wrong
- Builds habit of self-verification

### **Corrected Link Examples:**

**Recovery PDCA**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/local-dev/scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1926-recovery-release-dev-understanding.md) | [scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1926-recovery-release-dev-understanding.md](scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1926-recovery-release-dev-understanding.md)

**Fix PDCA**: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/local-dev/scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1930-fix-link-format-process-compliance.md) | [scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1930-fix-link-format-process-compliance.md](scrum.pmo/project.journal/2025-08-20-1926-recovery-scrummaster/pdca/role/scrummaster/general/2025-08-20-UTC-1930-fix-link-format-process-compliance.md)

---

## **📋 PDCA Process Update**

### **ScrumMaster Learning:**
- ✅ **Local Link Format**: Full qualified name = relative from workspace root
- ✅ **No /workspace/ Prefix**: Links are repository-relative
- ✅ **Self-Check Habit**: Always ask "am I wrong or the process?"
- ✅ **Example Authority**: Trust existing PDCAs as format guide

### **Process Learning:**
- **Consistency Matters**: All PDCAs use same link format
- **Repository Context**: Links work from repository perspective
- **Guardian Wisdom**: Self-questioning prevents repeated errors
- **Fast Learning**: Each correction builds understanding

---

**📊 Summary:** Learned correct local link format (full qualified name without /workspace/), applied self-check discipline, and now following process examples exactly! 📋✅📚