[Back to PDCA Process Improvements](./pdca.process.improvements/) | [CMMI Understanding](./PDCA.understanding.CMMI.md) | [How to Decide](./PDCA.howto.decide.md) | [Template](./template.md)

# 📋 **How to Write Excellent PDCAs - Consolidated Guidelines**

**🗓️ Date:** 2025-10-10-UTC-0240  
**🎯 Objective:** Consolidated PDCA writing guidelines with DRY principle applied  

**👤 Agent Role:** Process Documentation → Knowledge Management Enhancement  
**👤 Branch:** dev/0350 → DRY Compliance  

---

## **🎯 SINGLE SOURCE OF TRUTH**

### **Template Location (ALWAYS USE THIS)**

**File:** [template.md](./template.md)

**Usage:**
1. Copy `template.md` to your session directory
2. Replace `{{PLACEHOLDERS}}` with actual values
3. Never duplicate template structure in documentation
4. Template is the ONLY source of truth for format

---

## **📋 PDCA WRITING PROCESS**

### **Step 1: Copy Template**
```bash
cp scrum.pmo/roles/_shared/PDCA/template.md <your-session-directory>/YYYY-MM-DD-UTC-HHMM.pdca.md
```

**Naming Convention:** See [CMM3 Checklist Section 4](../../SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation)

### **Step 2: Fill Placeholders**
Replace all `{{PLACEHOLDER}}` values - see [template.md](./template.md) for complete list.

### **Step 3: Fill Content Sections**
Follow the structure in [template.md](./template.md) - all sections are defined there.

---

## **🔑 KEY PRINCIPLES**

### **CMM4: Report, Ask, Fix Ambiguities**
**Essential Wisdom:** Finding and fixing ambiguities in CMM3 documentation earns CMM4 badges.

**The Pattern:**
1. **Report:** "I found two conflicting sources (howto says X, template says Y)"
2. **Ask:** "Which is correct? Should we fix the ambiguity?"
3. **Fix:** Apply DRY principle, make one source of truth
4. **Result:** CMM3 documentation improved, ambiguity eliminated

**Why this is CMM4:**
- **CMM3:** Follow documentation correctly
- **CMM4:** Identify when documentation is wrong and fix it
- **CMM5:** Prevent documentation from becoming wrong in the first place

**Example from this session:**
- Found: `howto.PDCA.md` had template version 3.1.4.2, but `template.md` was 3.2.4.2
- Asked: "Where did I get 3.1.4.2 wrongly? Let's kill these ambiguities."
- Fixed: Applied DRY - removed duplicate template structure, reference `template.md` only
- Result: No more version conflicts, single source of truth

**Key Insight:** Don't blindly trust documentation. Question it. Improve it. That's CMM4.

### **DRY (Don't Repeat Yourself)**
- Template is the ONLY source of format truth
- Documentation explains HOW to use template
- Never duplicate template structure in howto docs

### **Verbatim TRON Quotes**
- Always quote user feedback EXACTLY as stated
- Include UTC timestamps: `(YYYY-MM-DD-UTC-HHMM)`
- Never paraphrase or summarize user guidance

### **Dual Link Format**
**See:** [CMM3 Checklist Section 6](../../SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format)
- PDCA files use relative paths
- Chat responses use `file://` absolute URLs

### **CMM Badge Tracking**
- Document current badge level
- Include badge type (e.g., Technical Excellence, Process Mastery)
- Record when badge was earned

---

## **🚨 CRITICAL REQUIREMENTS**

### **1. Use Current Template**
- **ALWAYS** check [template.md](./template.md) for latest format
- **NEVER** rely on examples or documentation for structure
- Template is versioned and maintains format consistency

### **2. Git Commit Format**
See [CMM3 Checklist Section 4](../../SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation)

### **3. Template Compliance**
See [CMM3 Checklist Section 5](../../SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance) for:
- Required sections
- Horizontal separators
- Emoji consistency

---

## **❌ COMMON MISTAKES TO AVOID**

1. **Using old template versions** → See [template.md](./template.md)
2. **Paraphrasing TRON feedback** → Quote verbatim (Key Principles above)
3. **Skipping sections** → See [CMM3 Checklist Section 5](../../SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance)
4. **Wrong dual link format** → See [CMM3 Checklist Section 6](../../SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format)
5. **Duplicating content** → Violates DRY principle (this document is the example!)

---

## **✅ CHECKLIST BEFORE COMMITTING PDCA**

**See CMM3 Compliance Checklist:** [SaveRestartAgent/cmm3.compliance.checklist.md](../../SaveRestartAgent/cmm3.compliance.checklist.md)

Specifically:
- **Section 4:** Naming/Location requirements
- **Section 5:** PDCA Template compliance (all required sections, emojis, separators)
- **Section 6:** Dual link format (relative in files, file:// in chat)

---

## **🔗 REFERENCES**

- **Template (SINGLE SOURCE OF TRUTH):** [template.md](./template.md)
- **CMMI Understanding:** [PDCA.understanding.CMMI.md](./PDCA.understanding.CMMI.md)
- **Decision Making:** [PDCA.howto.decide.md](./PDCA.howto.decide.md)
- **Process Improvements:** [pdca.process.improvements/](./pdca.process.improvements/)

---

**Last Updated:** 2025-10-10-UTC-0240  
**Updated By:** Claude (CMM4)  
**Reason:** Applied DRY principle - removed template duplication, reference template.md only
