# 📋 **Essential PDCA Guide - CMM3 Template Compliance Required**

**🚨 CRITICAL CMM3 REQUIREMENT:** Starting agents MUST read and follow the actual template.md file  
**📋 Template Reference:** [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md) - v3.1.4.2 format MANDATORY  
**🎯 Purpose:** Core requirements for correct PDCA creation and collaborative decision making  
**📏 Length:** Essential information only - detailed examples in [appendix](./howto.PDCA.appendix.md)  
**🔄 CMM3/CMM4:** Systematic feedback loops through decision framework and quality validation  
**⚙️ Tech Stack:** Read [docs/tech-stack.md](../../../docs/tech-stack.md) for technical constraints (Vitest mandatory, Jest BANNED)  
**🔧 Tool Precondition:** `source source.env` from project root for Web4 tool availability via scripts/ directory  
**⚡ Git Safety:** `git config pull.rebase false` before any git operations to prevent merge conflicts  
**🏆 Golden Rule:** "Don't teach others what you don't understand yourself" - CMM4 process feedback preventing harm through validation-first approach

**⚠️ AGENT STARTUP PROTOCOL:** Before creating any PDCA, agents must:
1. Read [template.md](./template.md) completely 
2. Follow the exact v3.1.4.2 structure including all placeholder fields
3. Include ALL 6 mandatory sections: SUMMARY, PLAN, DO, CHECK, ACT, EMOTIONAL REFLECTION
4. Use template placeholders ({{TITLE}}, {{OBJECTIVE}}, etc.) as guidance for content structure

---

## **🚨 6 MANDATORY PDCA SECTIONS (NON-NEGOTIABLE)**

### **1. HEADER FORMAT (CMM3 COMPLIANCE REQUIRED)**

**⚠️ CRITICAL: Agents must read and follow the actual template.md file for v3.1.4.2 format**

Reference the official template: [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md)

```markdown
# 📋 **PDCA Cycle: {{TITLE}} - {{DESCRIPTION}}**

**🗓️ Date:** {{UTC_TIMESTAMP}}  
**🎯 Objective:** {{OBJECTIVE}}  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** {{AGENT_NAME}} → {{AGENT_DESCRIPTION}}  
**👤 Agent Role:** {{ROLE_NAME}} → {{CONTEXT_SPECIALIZATION}}  
**👤 Branch:** {{BRANCH_NAME}} → {{BRANCH_PURPOSE}}  
**🔄 Sync Requirements:** {{SYNC_BRANCHES}} → {{SYNC_PURPOSE}}  
**🎯 Project Journal Session:** {{SESSION_NAME}} → {{CONTEXT_SPECIALIZATION}}
**🎯 Sprint:** {{SPRINT_NAME}} → {{CONTEXT_SPECIALIZATION}}
**✅ Task:** {{TASK_NAME}}  
**🚨 Issues:** {{KEY_ISSUES}}  

**📎 Previous Commit:** {{PREVIOUS_COMMIT_SHA}} - {{PREVIOUS_COMMIT_DESCRIPTION}}  
**🔗 Previous PDCA:** [GitHub]({{GITHUB_URL}}) | [§/{{LOCAL_PATH}}]({{LOCAL_PATH}})
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

### **3-6. MANDATORY PDCA SECTIONS WITH SEPARATORS (FOLLOW TEMPLATE.MD)**

**⚠️ CMM3 REQUIREMENT: Use exact template.md structure for all sections**

```markdown
---
## **📋 PLAN**
**Objective:** {{PLAN_OBJECTIVE}}
**Requirements Traceability:** {{REQUIREMENT_UUID}}
**Implementation Strategy:**
- **{{STRATEGY_ELEMENT_1}}:** {{STRATEGY_DESCRIPTION_1}}
- **{{STRATEGY_ELEMENT_2}}:** {{STRATEGY_DESCRIPTION_2}}
- **{{STRATEGY_ELEMENT_3}}:** {{STRATEGY_DESCRIPTION_3}}

---
## **🔧 DO**
**{{DO_SECTION_TITLE}}**
{{#each DO_ACTIONS}}
**{{ACTION_INDEX}}. {{ACTION_TITLE}}**
```{{ACTION_LANGUAGE}}
{{ACTION_CODE_OR_CONTENT}}
```
{{/each}}

---
## **✅ CHECK**
**Verification Results:**
**{{CHECK_CATEGORY_1}} ({{STATUS_1}})**
```
{{VERIFICATION_OUTPUT_1}}
```
**TRON QA Feedback Validation**
> **"{{VERBATIM_QA_FEEDBACK}}"**

---
## **🎯 ACT**
**Success Achieved:** {{SUCCESS_SUMMARY}}
**{{ACT_CATEGORY_1}} Enhanced:**
- **{{ENHANCEMENT_1}}:** {{ENHANCEMENT_DESCRIPTION_1}}
**Future Enhancements:**
1. **{{FUTURE_1}}:** {{FUTURE_DESCRIPTION_1}}

## **💫 EMOTIONAL REFLECTION: {{EMOTIONAL_HEADLINE}}**
### **{{EMOTIONAL_CATEGORY_1}}:**
**{{EMOTIONAL_INTENSITY}}** {{EMOTIONAL_DESCRIPTION_1}}

---
## **🎯 PDCA PROCESS UPDATE**
**Process Learning:**
- ✅ **PDCA Protocol:** Must create PDCA documentation for all significant work
**Quality Impact:** {{QUALITY_IMPACT_DESCRIPTION}}
**Next PDCA Focus:** {{NEXT_FOCUS_DESCRIPTION}}

---
**🎯 {{FINAL_SUMMARY_WITH_EMOJIS}}**
**"{{PHILOSOPHICAL_INSIGHT}}"** 🔧📊

---
### **📚 The 42 Revelation**
**Understanding requires regression testing:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md](../../project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revolution.md)
**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨
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

## **📋 CHAT DECISION REPORTING PROTOCOL (CRITICAL)**

### **🚨 MANDATORY: Copy QA Decisions Exactly**

**✅ CORRECT Chat Format (Hybrid Approach):**
```markdown
### **QA Decisions**
- [x] Completed: [Decision already made]
- [ ] **Decision 1:** [Title]
  - a) [Option with rationale]
  - b) [Option with rationale]
- [ ] **Decision 2:** [Title]
  - a) [Option with rationale]
  - b) [Option with rationale]
```

**❌ WRONG Chat Responses:**
```markdown
### **QA Decisions:**
**All clear, no decisions to make** - Session objectives completed
```

### **🔍 Decision Reporting Rules**

**1. EXACT COPY REQUIREMENT:**
- Copy the entire QA Decisions section from PDCA to chat
- Use identical checkbox format: `- [x]` and `- [ ]`
- Keep exact decision titles and options
- Never substitute your interpretation

**2. "ALL CLEAR" USAGE CRITERIA:**
- ONLY when PDCA literally contains no pending `- [ ]` decisions
- ONLY when no user choices are required
- NEVER as substitute for actual decisions
- NEVER based on your work completion status

**3. NUMBERED DECISION FORMAT:**
- Users respond with format: "1a, 2b, 3c"
- Each decision gets a number: Decision 1, Decision 2, etc.
- Each option gets a letter: a, b, c
- Mobile-friendly for quick responses

### **🎯 Common Error Patterns to Avoid**

**❌ WRONG Mental Model:**
```
"All clear" = I finished my work satisfactorily
"No decisions" = My analysis is complete
```

**✅ CORRECT Mental Model:**
```
"All clear" = No decisions in PDCA require user response
"Copy exact" = QA Decisions section copied exactly to chat
```

### **📊 Decision Reporting Examples**

**Example 1 - Has Decisions:**
```markdown
### **QA Decisions**
- [x] **Template Analysis**: Completed version alignment from 3.1 to 3.1.4.2
- [ ] **Decision 1: Implementation Priority**
  - a) **Immediate Implementation** - Start automation development now
  - b) **Sprint Planning** - Add to next sprint backlog
  - c) **Research Phase** - Investigate requirements further
```

**Example 2 - No Decisions:**
```markdown
### **QA Decisions**
**All clear, no decisions to make** - Analysis complete with clear next steps
```

### **🔧 Troubleshooting Decision Reporting**

**If you're unsure about decision reporting:**

1. **Check PDCA QA Decisions section** - Are there any `- [ ]` items?
2. **If YES** - Copy the entire section exactly to chat
3. **If NO** - Use "All clear, no decisions to make"
4. **Never editorialize** - Don't substitute your interpretation
5. **When in doubt** - Copy the decisions exactly

### **⚠️ CRITICAL WARNING**

**NEVER substitute "All clear" when decisions exist in PDCA!**

This creates confusion because:
- User expects to make choices but sees "all clear"
- Decision information is lost in chat response
- Process compliance is broken
- User authority over decisions is undermined

### **📚 Decision Reporting Reference Guide**

**For Complex Decision Scenarios:**

**Multi-Stage Decisions:**
```markdown
- [x] **Phase 1 Complete**: Analysis finished with recommendations
- [ ] **Decision 1: Approach Selection**
  - a) **Option A** with detailed rationale
  - b) **Option B** with detailed rationale
- [ ] **Decision 2: Timeline**
  - a) **Immediate** - Start within 24 hours
  - b) **Scheduled** - Add to sprint planning
```

**Conditional Decisions:**
```markdown
- [ ] **Decision 1: Primary Approach**
  - a) **Automated Solution** - If technical resources available
  - b) **Manual Process** - If automation complexity too high
  - c) **Hybrid Approach** - Combine automated and manual elements
```

**Follow-up Decisions:**
```markdown
- [x] **Initial Analysis**: Framework gaps identified
- [ ] **Decision 1: Gap Resolution Priority**
  - a) **Documentation First** - Update guides before implementation
  - b) **Implementation First** - Fix issues then document
  - c) **Parallel Approach** - Documentation and implementation together
```

---

## **🆘 WHEN IN DOUBT ABOUT DECISION REPORTING**

**If you are uncertain about:**
- Whether decisions exist in your PDCA
- How to format decisions in chat
- Whether to use "All clear" or copy decisions
- How to handle complex decision scenarios

**ASK QA IN DOUBT**

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