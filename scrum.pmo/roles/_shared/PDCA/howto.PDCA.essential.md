# 📋 **Essential PDCA Guide - Streamlined for Optimal Agent Performance**

**🎯 Purpose:** Core requirements for correct PDCA creation and collaborative decision making  
**📏 Length:** Essential information only - detailed examples in [appendix](./howto.PDCA.appendix.md)  
**🔄 CMM3/CMM4:** Systematic feedback loops through decision framework and quality validation

---

## **🚨 6 MANDATORY PDCA SECTIONS (NON-NEGOTIABLE)**

### **1. HEADER FORMAT**
```markdown
# 📋 **PDCA Cycle: [TITLE] - [DESCRIPTION]**

**🗓️ Date:** YYYY-MM-DD-UTC-HHMM  
**🎯 Objective:** [CLEAR OBJECTIVE]  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** [NAME] → [DESCRIPTION]  
**👤 Agent Role:** [ROLE] → [CONTEXT]  
**👤 Branch:** [BRANCH] → [PURPOSE]  
**🎯 Project Journal Session:** [SESSION] → [FOCUS]  
**🎯 Sprint:** [SPRINT] → [GOAL]  
**✅ Task:** [TASK NAME]  
**🚨 Issues:** [KEY ISSUES]  

**📎 Previous Commit:** [SHA] - [DESCRIPTION]  
**🔗 Previous PDCA:** [GitHub](URL) | [§/path](../relative/path)
```

### **2. SUMMARY WITH DUAL LINKS**
```markdown
## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](URL) | [§/path](../relative/path)
- **Other Files:** [GitHub](URL) | [§/path](../relative/path)

### **QA Decisions**
- [x] Completed: [Decision already made]
- [ ] **Decision 1:** [Title]
  - a) [Option with rationale]
  - b) [Option with rationale]

### **TRON Feedback (YYYY-MM-DD-UTC-HHMM)**
```quote
[EXACT VERBATIM QUOTE - NEVER PARAPHRASE]
```

### **My Answer**
[IMMEDIATE RESPONSE LIKE CHAT]
**Learning Applied:** [Key insight]
```

### **3-6. PDCA SECTIONS WITH SEPARATORS**
```markdown
---
## **📋 PLAN**
[Content]
---
## **🔧 DO** 
[Content]
---
## **✅ CHECK**
[Content with TRON feedback quotes]
---
## **💫 EMOTIONAL REFLECTION: [HEADLINE]**
[3 emotional categories with intensity levels]
---
## **🎯 PDCA PROCESS UPDATE**
**Process Learning:** [Bullet points]
**Quality Impact:** [Impact description]
**Next PDCA Focus:** [Next focus]
---
**🎯 [ONE-LINE SUMMARY WITH EMOJIS]**
**"[PHILOSOPHICAL INSIGHT]"** 🔧📊
```

---

## **🔗 DUAL LINK FORMAT (CRITICAL)**

### **✅ CORRECT FORMAT**
```markdown
[GitHub](https://github.com/.../file.md) | [§/path/from/root](../relative/path)
```

### **❌ COMMON MISTAKES**
```markdown
[GitHub](URL) | path/from/root                    ← Missing brackets
[GitHub](URL) | [path](full/path)                 ← Wrong path type
[GitHub](URL) | [path/from/root](path/from/root)  ← Missing § notation
```

### **FORMAT CONSTRUCTION**
1. GitHub URL: `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/[branch]/[path]`
2. Display: `[§/path/from/project/root]`
3. Relative: `(../relative/path/from/document)`
4. Combine: `[GitHub](URL) | [§/display](../relative)`

---

## **🚀 STARTUP DECISION FRAMEWORK**

### **3 STANDARD QUESTIONS (ALWAYS PRESENT)**
```markdown
### **QA Decisions**
- [ ] **Decision 1: Primary Work Focus Area**
  - a) Technical Development Focus
  - b) Architecture Focus  
  - c) Documentation Focus
  - d) Quality/Testing Focus

- [ ] **Decision 2: Role Selection for Session**
  - a) [Current Role] for [context]
  - b) Switch to Developer for implementation
  - c) Switch to Architect for design
  - d) Switch to Tester for quality
  - e) Switch to PO for requirements

- [ ] **Decision 3: Session Duration and Sprint Planning**
  - a) Full day session with multiple cycles
  - b) Half-day focused session
  - c) Quick analysis session
  - d) Extended multi-day session
```

---

## **⚡ GIT PROTOCOL (MANDATORY)**

1. **Immediate commit after PDCA creation**
2. **Commit message format:** `git commit -m "PDCA: [Title from header]"`
3. **Push immediately:** `git push origin [branch]`
4. **One PDCA = One commit**

---

## **💬 COMMUNICATION PROTOCOL**

### **Chat Response Rules**
- **Details go in PDCA files** - NOT in chat
- **Chat shows:** Links + Decisions ONLY
- **Copy QA Decisions EXACTLY** from PDCA to chat
- **Always end with dual links** to current artifacts
- **Never create different decisions** in chat vs PDCA

### **Decision Presentation**
- **Real choices only** - no fake opposites
- **Number decisions** (1a, 2b) for mobile-friendly responses
- **Include rationale** for each option
- **"All clear, no decisions"** when no real choices exist

---

## **🎯 NEVER 2 1 ALWAYS 4 2 (CORE PRINCIPLE)**

**NEVER 2 1 (TO ONE) - Avoid:**
- Making important decisions alone
- Assuming next steps without asking
- Saying "all clear" when guidance needed

**ALWAYS 4 2 (FOR TWO) - Practice:**
- Ask for user guidance on important choices
- Present real decisions when options exist
- Recognize user authority over approaches
- Work collaboratively on methodology

---

## **✅ ESSENTIAL CHECKLIST**

**Before Creating PDCA:**
- [ ] UTC timestamp format correct
- [ ] All 6 sections present with separators
- [ ] Dual links properly formatted
- [ ] Real decisions identified (or "all clear")

**After Creating PDCA:**
- [ ] Commit with proper message format
- [ ] Push immediately to remote
- [ ] Provide dual links in chat
- [ ] Copy decisions exactly to chat

---

**🎯 Essential PDCA guide enables correct behavior reproduction with streamlined information consumption** 📋⚡

**"Always 4 2 (FOR TWO) - essential information optimizes collaborative efficiency."** 🤝✨

---

**📚 For detailed examples, edge cases, and comprehensive guidance:** [PDCA Appendix](./howto.PDCA.appendix.md)