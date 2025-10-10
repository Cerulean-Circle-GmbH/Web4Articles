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

**Naming Convention (CMM3 Checklist Section 4):**
- Format: `YYYY-MM-DD-UTC-HHMM.pdca.md`
- NO descriptive text in filename
- Location: `scrum.pmo/roles/[AgentRole]/pdca/` or session directory

### **Step 2: Fill Placeholders**
Replace all `{{PLACEHOLDER}}` values:
- `{{TITLE}}` - Clear, specific title
- `{{DESCRIPTION}}` - Brief description
- `{{UTC_TIMESTAMP}}` - Format: YYYY-MM-DD-UTC-HHMM
- `{{OBJECTIVE}}` - Clear objective statement
- `{{CMM_STATUS}}` - Current CMM badge level
- `{{BADGE_TYPE}}` - Type of badge earned
- `{{BADGE_TIMESTAMP}}` - When badge was earned
- etc.

### **Step 3: Fill Content Sections**
Follow the structure in template.md:
- **📊 SUMMARY** - Links, decisions, TRON feedback
- **📋 PLAN** - What you're going to do
- **🔧 DO** - What you actually did
- **✅ CHECK** - Verification and results
- **🎯 ACT** - Deployment and next steps
- **💫 EMOTIONAL REFLECTION** - The journey
- **🎯 PDCA PROCESS UPDATE** - Learnings and improvements

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
**In PDCA Files:**
```markdown
[GitHub](https://github.com/.../blob/branch/path/to/file) | [§/path/from/root](../../../relative/path)
```

**In Chat Responses:**
```markdown
[GitHub](https://github.com/.../blob/commit-sha/path/to/file) | [§/path/from/root](file:///absolute/path)
```

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
```bash
git commit -m "YYYY-MM-DD-UTC-HHMM"
```
Example: `git commit -m "2025-10-10-UTC-0215"`

**Note:** Commit message matches PDCA filename (no descriptive text per CMM3 checklist)

### **3. Horizontal Separators**
Use `---` between major sections as shown in template

### **4. Emoji Consistency**
Follow template emoji usage exactly:
- 📋 for PLAN
- 🔧 for DO
- ✅ for CHECK
- 🎯 for ACT
- 💫 for EMOTIONAL REFLECTION

---

## **❌ COMMON MISTAKES TO AVOID**

1. **Using old template versions** → Always use latest template.md
2. **Paraphrasing TRON feedback** → Quote verbatim
3. **Skipping sections** → Template defines required sections
4. **Wrong dual link format** → PDCA uses relative, Chat uses file://
5. **Missing CMM badge info** → Required in current template
6. **Duplicating template in docs** → Violates DRY principle

---

## **✅ CHECKLIST BEFORE COMMITTING PDCA**

- [ ] Copied from latest [template.md](./template.md)
- [ ] All `{{PLACEHOLDERS}}` replaced with actual values
- [ ] TRON feedback quoted verbatim with UTC timestamp
- [ ] Dual links in correct format (relative paths in PDCA)
- [ ] CMM badge info included
- [ ] All required sections present (SUMMARY, PLAN, DO, CHECK, ACT, EMOTIONAL REFLECTION, PDCA PROCESS UPDATE)
- [ ] Horizontal separators (`---`) between sections
- [ ] Emojis match template format
- [ ] Git commit message format: `YYYY-MM-DD-UTC-HHMM`

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
