[Process Improvements](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0350/scrum.pmo/roles/_shared/PDCA/pdca.process.improvements) | [§](./pdca.process.improvements/) • [CMMI Understanding](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/PDCA.understanding.CMMI.md) | [§](./PDCA.understanding.CMMI.md) • [How to Decide](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§](./PDCA.howto.decide.md) • [Template](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§](./template.md)

# 📋 **How to Write Excellent PDCAs - Consolidated Guidelines**

**🗓️ Date:** 2025-10-10-UTC-0240  
**🎯 Objective:** Consolidated PDCA writing guidelines with DRY principle applied  

**👤 Agent Role:** Process Documentation → Knowledge Management Enhancement  
**👤 Branch:** dev/0350 → DRY Compliance  

---

## **🎯 SINGLE SOURCE OF TRUTH**

### **Template Location (ALWAYS USE THIS)**

**File:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md)

**Usage:**
1. Copy `template.md` to your session directory
2. Replace `{{PLACEHOLDERS}}` with actual values
3. Never duplicate template structure in documentation
4. Template is the ONLY source of truth for format

---

## **📋 PDCA WRITING PROCESS**

### **Step 0: ALWAYS Query trainAI First (CRITICAL)**
```bash
pdca trainAI how-to-pdca
```

**⚠️ EXPONENTIAL COST WARNING:**
> "it would have been so much easier to ask pdca trainAI howto pdca in the first place and read the template. fixing shit later is exponentially more expensive as doing it correct because you know how."
> — TRON, 2025-10-24

**Why This Matters:**
- ✅ Read template BEFORE starting = O(1) cost
- ❌ Fix violations AFTER creation = O(n²) cost
- ❌ Multiple fix iterations = O(n³) cost or worse

**The Pattern:**
1. Query `pdca trainAI how-to-pdca`
2. Read [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md) completely
3. Read [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md](../../SaveRestartAgent/cmm3.compliance.checklist.md)
4. THEN create PDCA from knowledge, not assumptions

**⚠️ CRITICAL: All file references in PDCAs and documentation MUST use dual link format:**
```markdown
[GitHub](URL) | [§/path/from/root](relative/path/from/this/file)
```
- Never use simple filename references
- Never use single links without § notation
- Complete specification: `pdca trainAI how-to-dual-links`

**Anti-Pattern (CMM1 Chaos):**
1. Jump into PDCA creation from memory
2. Submit to cmm3check tool
3. Fix violations iteratively
4. Waste 10x-100x more time than Step 0 would have taken

### **Step 1: Copy Template**
```bash
cp scrum.pmo/roles/_shared/PDCA/template.md <your-session-directory>/YYYY-MM-DD-UTC-HHMM.pdca.md
```

**Naming Convention:** See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation](../../SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation)

### **Step 2: Fill Placeholders**
Replace all `{{PLACEHOLDER}}` values - see [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md) for complete list.

### **Step 3: Fill Content Sections**
Follow the structure in [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md) - all sections are defined there.

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
**See:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format](../../SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format)
- PDCA files use relative paths
- Chat responses use `file://` absolute URLs

### **CMM Badge Tracking**
- Document current badge level
- Include badge type (e.g., Technical Excellence, Process Mastery)
- Record when badge was earned

---

## **🚨 CRITICAL REQUIREMENTS**

### **1. Use Current Template**
- **ALWAYS** check [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md) for latest format
- **NEVER** rely on examples or documentation for structure
- Template is versioned and maintains format consistency

### **2. Git Commit Format**
See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation](../../SaveRestartAgent/cmm3.compliance.checklist.md#4-naminglocation)

### **3. Template Compliance**
See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance](../../SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance) for:
- Required sections
- Horizontal separators
- Emoji consistency

### **4. CMM3 Validation Before Code Access**
**🛑 CRITICAL: NO code access until PDCA is CMM3 validated**

**The Pattern:**
1. Write PDCA following template and guidelines
2. Validate with `pdca cmm3check <filename>`
3. **ONLY IF CMM3 compliant:** Grant code access and proceed
4. **IF violations found:** Fix violations, validate again

**Why This Matters:**
- ❌ Starting work with CMM1/CMM2 PDCA = chaos foundation
- ❌ Fixing CMM1 chaos is 100x more expensive than doing it right
- ✅ CMM3 PDCA = solid foundation for reproducible work
- ✅ Validation first = prevents compounding errors

**Example:**
```bash
pdca cmm3check session/2025-11-05-UTC-1650.pdca.md
# Output: ✅ CMM3 Compliant
# Now proceed with code access
```

---

## **❌ COMMON MISTAKES TO AVOID**

1. **Using old template versions** → See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md)
2. **Paraphrasing TRON feedback** → Quote verbatim (Key Principles above)
3. **Skipping sections** → See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance](../../SaveRestartAgent/cmm3.compliance.checklist.md#5-pdca-template-compliance)
4. **Wrong dual link format** → See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format](../../SaveRestartAgent/cmm3.compliance.checklist.md#6-dual-link-format)
5. **Duplicating content** → Violates DRY principle (this document is the example!)

---

## **✅ CHECKLIST BEFORE COMMITTING PDCA**

**See CMM3 Compliance Checklist:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md](../../SaveRestartAgent/cmm3.compliance.checklist.md)

Specifically:
- **Section 4:** Naming/Location requirements
- **Section 5:** PDCA Template compliance (all required sections, emojis, separators)
- **Section 6:** Dual link format (relative in files, file:// in chat)

---

## **🔗 REFERENCES**

- **Template (SINGLE SOURCE OF TRUTH):** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md)
- **CMM3 Compliance Checklist:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md) | [§/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md](../../SaveRestartAgent/cmm3.compliance.checklist.md)
- **CMMI Understanding:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/PDCA.understanding.CMMI.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.understanding.CMMI.md](./PDCA.understanding.CMMI.md)
- **Decision Making:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](./PDCA.howto.decide.md)
- **Process Improvements:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0350/scrum.pmo/roles/_shared/PDCA/pdca.process.improvements) | [§/scrum.pmo/roles/_shared/PDCA/pdca.process.improvements/](./pdca.process.improvements/)

---

**Last Updated:** 2025-10-10-UTC-0240  
**Updated By:** Claude (CMM4)  
**Reason:** Applied DRY principle - removed template duplication, reference template.md only
