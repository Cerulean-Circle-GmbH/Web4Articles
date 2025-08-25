# 🔄 **PDCA Entry: Timestamp Filename Correction - Git Creation Date Standardization**

**🗓️ Date:** 2025-01-24-UTC-1555  
**🎯 Objective:** Fix consolidated file names using git creation timestamps for proper naming consistency  
**👤 Role:** Save/Restart Agent → File Naming Standardization  
**🚨 Issues:** Consolidated files lost proper timestamp naming format  
**📎 Previous Commit:** 11a2a27d - SaveRestartAgent cleanup  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start/scrum.pmo/roles/SaveRestartAgent/pdca/2025-01-24-UTC-1550-saverestartAgent-cleanup.pdca.md) | [2025-01-24-UTC-1550-saverestartAgent-cleanup.pdca.md](../../../roles/SaveRestartAgent/pdca/2025-01-24-UTC-1550-saverestartAgent-cleanup.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start/scrum.pmo/project.journal/2025-08-24-consolidated-learning/2025-01-24-UTC-1555-timestamp-filename-correction.pdca.md) | [2025-01-24-UTC-1555-timestamp-filename-correction.pdca.md](2025-01-24-UTC-1555-timestamp-filename-correction.pdca.md)

### **QA Decisions**

**Decision 1: Timestamp Source Strategy**
- a) Use earliest git commit date (creation time)
- b) Use file system modification date
- c) Parse existing content for timestamp

### **User Feedback**
```quote
you consolidated these files well: /workspace/scrum.pmo/project.journal/2025-08-24-consolidated-learning/pdca-wild-west-workflow.md

but they lost their correct file name structure like /workspace/scrum.pmo/project.journal/2025-08-24-consolidated-learning/2025-01-24-UTC-1545-git-mv-consolidation.pdca.md

recreate it from the actual timestemp when they where craated in git.
this had to be done already in the past. maybe you canuse the codebase index to find the script.
otherwise just do it.
if something is unclear ask me and pdca.
```

### **My Answer**
Will fix filename standardization using git creation timestamps. Found pdca-wild-west-workflow.md was created 2025-08-25 09:48:01 UTC, should be renamed to "2025-08-25-UTC-0948-wild-west-workflow.pdca.md" format. Will create script to standardize all non-conforming files.

**Learning Applied:** Consistent naming enables better file organization and tracking.

---

## **📋 PLAN**

### **Standardization Strategy**
1. Find all files without proper timestamp format
2. Extract git creation date for each file  
3. Generate correct filename format: YYYY-MM-DD-UTC-HHMM-description.pdca.md
4. Use git mv to rename preserving history
5. Apply to all consolidated learning files

### **Expected Format**
- **Current:** pdca-wild-west-workflow.md
- **Correct:** 2025-08-25-UTC-0948-wild-west-workflow.pdca.md

---

## **🔧 DO**

### **1. Problem Identification**
Files needing correction in consolidated-learning/:
```
eod-summary.md → 2025-08-XX-UTC-XXXX-eod-summary.md
pdca-*.md → 2025-08-XX-UTC-XXXX-*.pdca.md
```

### **2. Git Timestamp Extraction Method**
```bash
# Get creation timestamp
git log --follow --reverse --format="%ai" -- filename | head -1
# Result: 2025-08-25 09:48:01 +0000
# Convert to: 2025-08-25-UTC-0948
```

### **3. Filename Generation Script**
```bash
#!/bin/bash
for file in scrum.pmo/project.journal/2025-08-24-consolidated-learning/pdca-*.md; do
  if [[ ! $(basename "$file") =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-UTC- ]]; then
    timestamp=$(git log --follow --reverse --format="%ai" -- "$file" | head -1)
    if [ -n "$timestamp" ]; then
      date_part=$(date -d "$timestamp" +"%Y-%m-%d-UTC-%H%M")
      basename=$(basename "$file" .md)
      description=${basename#pdca-}
      new_name="$date_part-$description.pdca.md"
      git mv "$file" "$(dirname "$file")/$new_name"
    fi
  fi
done
```

---

## **✅ CHECK**

### **Current Status**
- **Problem confirmed** - Files like pdca-wild-west-workflow.md need timestamp prefixes
- **Git timestamps available** - Can extract creation dates
- **Pattern established** - Follow existing 2025-01-24-UTC-1555 format
- **Script approach** - Use git mv to preserve history

### **Files Requiring Fix**
All files in consolidated-learning/ that don't start with YYYY-MM-DD-UTC pattern.

---

## **🎯 ACT**

### **Next Steps**
1. Implement timestamp extraction script
2. Apply git mv to all non-conforming files  
3. Verify consistent naming throughout
4. Commit standardized structure

### **Standardization Benefits**
- **Chronological ordering** - Files sort by creation time
- **Consistency** - All PDCAs follow same format
- **Trackability** - Clear timeline of activities
- **Professional structure** - Maintains documentation standards

---

**🔄 Ready to implement timestamp-based filename standardization.** ✅
