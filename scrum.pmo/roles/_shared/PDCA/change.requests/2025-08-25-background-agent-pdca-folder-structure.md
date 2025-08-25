# 📋 **Change Request: PDCA Folder Structure Clarification**

**🗓️ Date:** 2025-08-25-UTC-1211  
**👤 Submitted By:** Background Agent  
**🎯 Change Type:** Documentation Clarification  
**🚨 Issue:** PDCAs being created in new journal folders instead of existing session folders  

---

## **📊 PROBLEM DESCRIPTION**

### **Current Behavior**
Background agents (and possibly other agents) are creating new journal session folders for each PDCA instead of placing PDCAs within existing session folders.

### **Example of Incorrect Structure**
```
scrum.pmo/project.journal/
├── 2025-08-25-0947-external-references-learnings/  # Original session
│   └── pdca/role/architect/[pdca-files]
├── 2025-08-25-1111-background-agent-cmm3-compliance/  # NEW FOLDER (WRONG!)
│   └── pdca/role/background-agent/[pdca-files]
```

### **Correct Structure Should Be**
```
scrum.pmo/project.journal/
├── 2025-08-25-0947-external-references-learnings/  # Original session
│   └── pdca/
│       └── role/
│           ├── architect/[architect-pdca-files]
│           └── background-agent/[background-agent-pdca-files]  # SAME SESSION!
```

---

## **🔧 PROPOSED CHANGE**

### **Update howto.PDCA.md Section**
Add clarification to the "Directory Structure" section:

```markdown
### **Directory Structure:**
- **Role-based organization:** `pdca/role/[role_name]/`
- **Session-based grouping:** Within project journal sessions
- **CRITICAL:** When working within an existing session, place PDCAs in that session's pdca folder
  - DO NOT create new journal folders for each PDCA
  - Multiple roles can have PDCAs in the same session folder
  - Example: `session-folder/pdca/role/architect/` and `session-folder/pdca/role/developer/`
```

### **Add Example**
```markdown
### **PDCA Placement Examples:**

**✅ CORRECT - Multiple roles in same session:**
```
2025-08-25-0947-external-references-learnings/
└── pdca/
    └── role/
        ├── architect/
        │   └── 2025-08-25-UTC-1020-ucp-compliance.md
        ├── developer/
        │   └── 2025-08-25-UTC-1045-implementation.md
        └── background-agent/
            └── 2025-08-25-UTC-1111-format-update.md
```

**❌ INCORRECT - New folder for each PDCA:**
```
project.journal/
├── 2025-08-25-0947-external-references-learnings/
├── 2025-08-25-1045-developer-work/  # WRONG!
└── 2025-08-25-1111-background-agent-work/  # WRONG!
```
```

---

## **✅ BENEFITS**

1. **Maintains Session Context:** All related work stays together
2. **Reduces Folder Proliferation:** Prevents excessive journal folders
3. **Improves Traceability:** Easy to see all work done in a session
4. **Follows Existing Pattern:** Aligns with multi-role session structure

---

## **🎯 IMPLEMENTATION**

1. Update howto.PDCA.md with clarification
2. Add examples showing correct vs incorrect structure
3. Consider adding validation reminder in PDCA checklist

---

## **📝 NOTES**

- This issue was discovered when TRON requested: "DO not create new folder for each entry"
- Background agents need special attention as they may not have full session context
- The existing structure already supports multiple roles per session

---

**🎯 Requesting clarification on PDCA folder structure to prevent journal folder proliferation.** 📁✅