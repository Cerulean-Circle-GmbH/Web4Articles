# 🚨 **AGENT BEHAVIOR UPDATE: PDCA File Naming Compliance - ONE TIME READ**

**🗓️ Date:** 2025-09-18-UTC-0840  
**🎯 Objective:** Update agent behavior for proper PDCA file naming convention compliance  
**⚠️ Status:** ONE-TIME READ - DO NOT COMMIT THIS FILE  

---

## **🔥 CRITICAL NAMING VIOLATION IDENTIFIED**

### **❌ WRONG PATTERN (NEVER USE):**
```
PDCA-descriptive-title-YYYY-MM-DD-UTC-HHMM.md
```

### **✅ CORRECT PATTERN (ALWAYS USE):**
```
YYYY-MM-DD-UTC-HHMM.pdca.md
```

---

## **📋 MANDATORY NAMING RULES**

### **1. Timestamp FIRST (NON-NEGOTIABLE)**
- **Format:** YYYY-MM-DD-UTC-HHMM.pdca.md
- **Reason:** Chronological ordering in file systems
- **Example:** 2025-09-18-UTC-0840-session-startup.md

### **2. NO "PDCA-" PREFIX (FORBIDDEN)**
- **Wrong:** PDCA-session-startup-2025-09-18-UTC-0840.md
- **Right:** 2025-09-18-UTC-0840-session-startup.md
- **Reason:** Redundant - files are already in PDCA directories

### **3. USE ACTUAL GIT CREATION TIMESTAMPS**
- **Command:** `git log --follow --format="%H %ai %s" filename.md | tail -1`
- **Convert timezone:** +0200 → subtract 2 hours for UTC
- **Example:** 16:40:34 +0200 = 14:40:34 UTC = 1440

### **4. ROLE-BASED DIRECTORY STRUCTURE**
- **Location:** `scrum.pmo/project.journal/session/pdca/role/[role]/`
- **Example:** `pdca/role/developer/2025-09-18-UTC-0840-filename.md`

---

## **🛠️ COMPLIANCE PROCESS**

### **When Creating New PDCA:**
1. **Get current UTC timestamp:** `date -u +"%Y-%m-%d-UTC-%H%M"`
2. **Use format:** `YYYY-MM-DD-UTC-HHMM.pdca.md`
3. **Place in:** `pdca/role/[your-role]/`
4. **NO "PDCA-" prefix ever**

### **When Renaming Existing Files:**
1. **Extract git creation date:** `git log --follow --format="%ai" file.md | tail -1`
2. **Convert to UTC if needed**
3. **Use git mv:** `git mv old-name.md YYYY-MM-DD-UTC-HHMM-new-name.md`
4. **Fix all internal links**

---

## **🚨 VIOLATION CONSEQUENCES**

### **Quality Impact:**
- **File System Chaos:** Wrong chronological ordering
- **Process Violation:** Non-compliance with established standards
- **Link Breakage:** Internal references become invalid
- **CMM3 Failure:** Systematic process requirements not met

### **Correction Required:**
- **Immediate Renaming:** All violations must be fixed
- **Link Updates:** All Previous PDCA references corrected
- **Process Compliance:** Future files must follow correct format

---

## **✅ VERIFICATION CHECKLIST**

Before creating any PDCA file:
- [ ] Timestamp is FIRST in filename
- [ ] NO "PDCA-" prefix used
- [ ] Actual UTC timestamp from git or current time
- [ ] Placed in proper role directory
- [ ] Descriptive title after timestamp
- [ ] Previous PDCA links use correct format

---

## **📚 REFERENCE EXAMPLES**

### **✅ CORRECT EXAMPLES:**
```
2025-09-18-UTC-0840-session-startup.md
2025-09-17-UTC-1436-cmm3-understanding.md
2025-09-18-UTC-0809-taskstatemachine-fix.md
```

### **❌ WRONG EXAMPLES (NEVER USE):**
```
PDCA-session-startup-2025-09-18-UTC-0840.md
PDCA-cmm3-understanding-2025-09-17-UTC-1436.md
PDCA-taskstatemachine-fix-2025-09-18-UTC-0809.md
```

---

## **🎯 IMMEDIATE ACTION REQUIRED**

1. **Review all your PDCA files**
2. **Identify naming violations**
3. **Extract git creation dates**
4. **Rename using git mv**
5. **Fix all broken links**
6. **Follow correct format for all future files**

---

**⚠️ THIS IS A ONE-TIME BEHAVIORAL UPDATE - DELETE AFTER READING**

**🎯 Compliance is mandatory - no exceptions for PDCA file naming convention**
