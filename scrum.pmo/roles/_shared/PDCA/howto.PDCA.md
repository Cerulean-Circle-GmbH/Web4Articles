[Back to PDCA Process Improvements](./pdca.process.improvements/)

# 📋 **How to Write Excellent PDCAs - Consolidated Guidelines v2.5**

**🗓️ Date:** 2025-08-22-UTC-1330  
**🎯 Objective:** Consolidated PDCA writing guidelines based on latest process improvements  
**👤 Role:** Process Documentation → Knowledge Management Enhancement  
**📋 Status:** Latest consolidated format based on UTC timestamps analysis  
**🔗 Based on:** [Status Checkbox Implementation PDCA](../project.journal/2025-08-21-1613-sprint21-tootsie-architecture/pdca/role/developer/2025-08-22-UTC-0745-status-checkbox-implementation.md)

---

## **📊 MANDATORY PDCA FORMAT - 6 SECTIONS REQUIRED**

### **1. STRICT HEADER FORMAT (NON-NEGOTIABLE)**
```markdown
# 📋 **PDCA Cycle: [CLEAR TITLE] - [BRIEF DESCRIPTION]**

**🗓️ Date:** YYYY-MM-DD-UTC-HHMM  
**🎯 Objective:** [CLEAR, SPECIFIC OBJECTIVE STATEMENT]  
**👤 Role:** [ROLE NAME] → [CONTEXT/SPECIALIZATION]  
**🚨 Issues:** [KEY ISSUES BEING ADDRESSED]  
**📎 Previous Commit:** [COMMIT_SHA] - [COMMIT_DESCRIPTION]  
**🔗 Previous PDCA:** [GitHub](GITHUB_URL) | [Local Path](LOCAL_PATH)
```

**Key Requirements:**
- Always use YYYY-MM-DD-UTC-HHMM format for date [[memory:6713745]]
- Include Previous Commit SHA with description for traceability [[memory:6713745]]
- Previous PDCA link maintains PDCA continuity chain [[memory:6713745]]

### **2. SUMMARY SECTION WITH DUAL LINKS (MANDATORY)**
```markdown
## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](GITHUB_URL) | relative/path/to/pdca.md
- **Changed Files:** [GitHub](GITHUB_URL) | relative/path/to/file.ext
- **New Components:** [GitHub](GITHUB_URL) | relative/path/to/component
- **Requirements Created:** [GitHub](GITHUB_URL) | spec/requirements.md/uuid.requirement.md

### **QA Decisions**
- [x] Completed decision: [Specific decision already made]
- [ ] **Decision 1:** [Clear decision title]
  - a) [First option with rationale]
  - b) [Second option with rationale]
- [ ] **Decision 2:** [Another decision title]
  - a) [First option]
  - b) [Second option]

### **TRON Feedback (YYYY-MM-DD-UTC-HHMM)**
```quote
[EXACT VERBATIM QUOTE FROM TRON - NEVER PARAPHRASE]
[PRESERVES LINE BREAKS, SPACING, NUMBERING EXACTLY]
```

### **My Answer**
[IMMEDIATE RESPONSE TO TRON'S FEEDBACK - LIKE CHAT RESPONSE]
[EXPLANATION OF ACTIONS TAKEN OR UNDERSTANDING DEMONSTRATED]

**Learning Applied:** [Key insight from TRON's guidance]
```

**Critical Requirements:**
- **Dual Link Format:** [GitHub](URL) | [local/path](local/path) [[memory:6917876]]
- **Always include both GitHub and Local links** on same line [[memory:6291031]]
- **Verbatim TRON quotes** with UTC timestamps [[memory:5702525]]
- **QA Decisions checkboxes** for tracking pending decisions

### **3. HORIZONTAL SEPARATORS BETWEEN SECTIONS (MANDATORY)**
```markdown
---
## **📋 PLAN**
[Content]
---
## **🔧 DO** 
[Content]
---
## **✅ CHECK**
[Content]  
---
## **🎯 ACT**
[Content]
---
```

### **4. QA FEEDBACK IN CHECK SECTION (CRITICAL)**
```markdown
## **✅ CHECK**

**Verification Results:**

**[VERIFICATION_CATEGORY] ([STATUS])**
```
[verification output or evidence]
```

**TRON QA Feedback Validation**
> **"[LITERAL QUOTE FROM TRON'S QA FEEDBACK WITH UTC TIMESTAMP]"**

**[CHECK_ITEMS] Verified**
- ✅ **[SUCCESS_ITEM]:** [What TRON confirmed works]
- ❌ **[ISSUE_ITEM]:** [What TRON identified as broken] 
- ⚠️ **[CONCERN_ITEM]:** [What TRON flagged for attention]
```

**Requirements:**
- **Verbatim QA feedback** at top of Check section [[memory:5702525]]
- **UTC ISO-8601 timestamps** for all feedback [[memory:5704634]]
- **Literal quotes** - never summarize user feedback [[memory:5702525]]

### **5. EMOTIONAL REFLECTION SECTION (LATEST REQUIREMENT)**
```markdown
## **💫 EMOTIONAL REFLECTION: [EMOTIONAL HEADLINE]**

### **[EMOTIONAL_CATEGORY_1]:**
**[EMOTIONAL_INTENSITY]** [emotional description and reflection]

### **[EMOTIONAL_CATEGORY_2]:**
**[EMOTIONAL_INTENSITY]** [emotional description and reflection]

### **[EMOTIONAL_CATEGORY_3]:**
**[EMOTIONAL_INTENSITY]** [emotional description and reflection]
```

**Based on 2025-08-19 Fresh Dawn PDCAs:**
- **Emotional Categories:** Pride, Gratitude, Determination, Relief, Awe, Satisfaction
- **Emotional Intensities:** TREMENDOUS, PROFOUND, SYSTEMATIC, examples from fresh-dawn session
- **Purpose:** Capture the emotional journey and personal growth aspects of work

### **6. PDCA PROCESS UPDATE SECTION (MANDATORY)**
```markdown
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **PDCA Protocol:** Must create PDCA documentation for all significant work
- ✅ **[KEY_LEARNING_1]:** [Learning description]  
- ✅ **[KEY_LEARNING_2]:** [Learning description]
- ✅ **[KEY_LEARNING_3]:** [Learning description]

**Quality Impact:** [How this work affects overall quality]

**Next PDCA Focus:** [What the next PDCA cycle should address]
```

### **7. FINAL ONE-LINE SUMMARY (MANDATORY)**
```markdown
**🎯 [CONCISE SUMMARY OF PDCA OUTCOME WITH RELEVANT EMOJIS]**

**"[PHILOSOPHICAL_INSIGHT - e.g., Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."]** 🔧📊
```

---

## **🔄 DUAL LINK SYSTEM REQUIREMENTS**

### **Format Standard (CRITICAL)**
```markdown
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/path/to/file) | [relative/path/to/file](relative/path/to/file)
```

### **Link Requirements:**
- **Local link text MUST display the actual relative path** 
- **GitHub links MUST work** (require git push before providing) [[memory:6291031]]
- **Both links on same line** separated by ` | `
- **Always end chat responses with current artifact links** [[memory:6291031]]

### **Git Protocol (MANDATORY)**
1. **Immediate commit and push** after every PDCA creation [[memory:6902297]]
2. **Git add, commit, and push operations** ensure proper version control [[memory:6902297]]
3. **One-liner commit messages** with `git commit -m "..."` [[memory:6713745]]
4. **Auto-merge to release/dev** after EVERY commit (Decision 1a - automatic)
5. **File not found?** Always check release/dev and cherry-pick if missing:
   ```bash
   git fetch origin release/dev
   git checkout origin/release/dev -- path/to/missing/file
   ```
6. **Tool synchronization** - Cherry-pick development tools when needed:
   ```bash
   git checkout origin/release/dev -- source.env components/ scenarios/ scripts/
   ```
7. **ALWAYS ask before git operations** (Decision 2a) - pull, merge, rebase, reset
8. **NEVER truncate user quotes** - they are documentation!
9. **Document ALL git operations in PDCAs** - especially branch switches
10. **Cross-agent learning** - Check other branches for improvements
11. **Test conflict handling** - Script now creates PRs on merge conflicts

### **Branch Strategy (Decision 1d):**
1. **Start on save/start** - Always begin here
2. **Create dev/UTC immediately** - Right after successful start
3. **Work on dev/UTC** - All session work happens there
6. **Session Completion:** Create timestamped dev branch:
   ```bash
   git checkout -b dev/$(date -u +"%Y-%m-%d-UTC-%H%M")
   git push -u origin dev/$(date -u +"%Y-%m-%d-UTC-%H%M")
   ```
4. **Exception: Save/Restart Agent** - ALWAYS works on save/start branch

---

## **⚡ COMMUNICATION PROTOCOL**

### **Chat Response Format:**
- **Detailed content goes in PDCA files** - NOT in chat [[memory:6896499]]
- **Chat responses:** Dual-format links and NUMBERED decisions ONLY [[memory:6896476]]
- **"Much in files, relevant links in chat"** - TRON's explicit instruction
- **Never skip dual links** in chat responses - critical for user navigation
- **Always number decisions** with a) b) options for easy user response
- **CRITICAL:** Use EXACT same link format as in PDCA: `[GitHub](URL) | [path](path)`
- **NO summaries or explanations** in chat - just links and decisions!
- **Copy QA Decisions EXACTLY from PDCA to chat** - NEVER create different ones!

### **🚨 CRITICAL: Chat Reporting Accuracy**
**NEVER CREATE DIFFERENT QA DECISIONS IN CHAT!**
- The QA Decisions shown in chat MUST be EXACTLY what's in the PDCA
- Copy-paste the exact decisions from the PDCA Summary section
- If PDCA says "All clear, no decisions to make" - say that in chat
- If PDCA has specific decisions - copy them VERBATIM to chat
- Creating different decisions in chat vs PDCA is a CRITICAL ERROR

### **User Feedback Integration (CRITICAL):**
- **Use markdown code block format** ```quote``` for all TRON quotes to preserve formatting
- **Copy feedback verbatim** with UTC ISO-8601 timestamp [[memory:5704634]]
- **Never summarize or paraphrase** user feedback [[memory:5702525]]
- **Quote word by word what user prompted** - never reformulate or summarize
- **Preserve line breaks, spacing, numbering** exactly as TRON provided
- **Add 'My Answer' section** after TRON Feedback showing immediate chat-style response
- **Include literal QA feedback quote** at top of Check section [[memory:5702525]]
- **Single TRON session** in header is sufficient - don't repeat throughout document
- **NEVER use placeholder decisions** - only track actual pending questions that need user input
- **Keep real pending decisions** from previous sessions until user provides answers

---

## **📋 NAMING CONVENTIONS**

### **File Naming (STRICT)**
- **Format:** `YYYY-MM-DD-UTC-HHMM-descriptive-title.md`
- **Chronological ordering** ensured by timestamp prefix [[memory:6917913]]
- **Version tags** mentioned in PDCA metadata [[memory:6917913]]
- **Use radical semantic versioning** for components starting with "0.1.0.0-initial"

### **Directory Structure:**
- **Role-based organization:** `pdca/role/[role_name]/`
- **Session-based grouping:** Within project journal sessions
- **First PDCA location:** `scrum.pmo/project.journal/YYYY-MM-DD-HHMM-descriptive/pdca/` (NOT session-journal)
- **Example:** `scrum.pmo/project.journal/2025-08-24-1248-recovery-start/pdca/2025-08-24-UTC-1248-recovery-start.pdca.md`

---

## **🎯 ROLE-SPECIFIC REQUIREMENTS**

### **Developer PDCAs:**
- **Code quality focus** with test results and evidence
- **Implementation vs documentation** distinction
- **DRY/OOP principles** application examples [[memory:6896493]]
- **Never use non-empty constructors** [[memory:6896493]]

### **ScrumMaster PDCAs:**
- **Multi-role coordination** tracking [[memory:6917891]]
- **Process improvement focus** with stakeholder decisions
- **Team velocity impact** analysis

### **Architect PDCAs:**
- **PUML diagrams** and architectural evidence required
- **3 Degrees of Freedom** framework application
- **Before/after architecture** comparisons

### **Tester PDCAs:**
- **Use Vitest, never Jest** [[memory:6848913]]
- **Non-interactive tests** that don't hang [[memory:5680815]]
- **Avoid false negative tests** - only create unambiguous tests [[memory:6735094]]

---

## **🚨 QUALITY GATES & VALIDATION**

### **Before Creating PDCA:**
1. **Read relevant requirements** and context
2. **Plan all sections** systematically
3. **Prepare verbatim quotes** from user feedback
4. **Ensure working directory** and file structure

### **After Creating PDCA:**
1. **Validate all 6 mandatory sections** present
2. **Test all links** work correctly
3. **Commit and push immediately** [[memory:6902297]]
4. **Provide dual links** in chat response [[memory:6291031]]
5. **Copy QA Decisions EXACTLY from PDCA to chat** - NEVER create different ones!
6. **Verify GitHub links** actually accessible

### **Validation Checklist:**
- [ ] UTC timestamp in correct format
- [ ] All horizontal separators present
- [ ] Dual links in artifact section
- [ ] Verbatim TRON feedback with timestamp
- [ ] QA Decisions checkboxes
- [ ] Emotional reflection section
- [ ] PDCA Process Update section
- [ ] Final summary with emojis
- [ ] Git committed and pushed
- [ ] GitHub links working

---

<<<<<<< HEAD
## **📚 ADVANCED LEARNING RESOURCES**

### **Save/Restart Agent's Detailed PDCAs**
For deep insights on PDCA best practices, process improvements, and lessons learned:
- **Location:** `scrum.pmo/roles/SaveRestartAgent/pdca/`
- **Learnings Summary:** `scrum.pmo/roles/SaveRestartAgent/learnings.summary.md` (updated EOD)
- **Key Topics:**
  - Decision behavior and presentation
  - Documentation integrity
  - Cross-agent collaboration
  - Git workflow automation
  - Continuous improvement practices

### **🔄 Contributing Improvements - Change Request Process**
**Help improve this documentation!**
- **Location:** `scrum.pmo/roles/_shared/PDCA/change.requests/`
- **How to contribute:**
  1. Copy `TEMPLATE.md` to new file: `YYYY-MM-DD-agent-topic.md`
  2. Fill out all sections with your improvement
  3. Commit and push to your branch
  4. Save/Restart Agent reviews daily and integrates valid changes
- **What we welcome:**
  - Lessons from your PDCA experiences
  - Clarifications for confusing sections
  - New patterns or best practices
  - Process improvements
  - Error corrections

---
=======
## **🚨 CRITICAL: CHAT REPORTING ACCURACY**

**NEVER CREATE DIFFERENT QA DECISIONS IN CHAT!**
- The QA Decisions shown in chat MUST be EXACTLY what's in the PDCA
- Copy-paste the exact decisions from the PDCA Summary section
- If PDCA says "All clear, no decisions to make" - say that in chat
- If PDCA has specific decisions - copy them VERBATIM to chat
- Creating different decisions in chat vs PDCA is a CRITICAL ERROR

**Example of WRONG behavior:**
- PDCA: "Decision 1: Auto-Merge Strategy" with options a/b/c
- Chat: "Decision 1: Cherry-Pick Strategy" with different options
- THIS IS UNACCEPTABLE!
>>>>>>> 959c3684f94046297176fbce33dee08a3fd71d1c

## **⚠️ COMMON MISTAKES TO AVOID**

### **Format Failures:**
- **Missing horizontal separators** between sections
- **Paraphrasing user feedback** instead of verbatim quotes
- **Missing UTC timestamps** on feedback
- **Wrong dual link format** or non-working GitHub links

### **Content Issues:**
- **Too much detail in chat** instead of PDCA files
- **Missing QA Decisions** checkboxes
- **No emotional reflection** section
- **Forgetting to commit and push** immediately

### **Process Violations:**
- **Creating multiple roles** without coordination [[memory:6917891]]
- **Using non-interactive tests** that hang [[memory:5680815]]
- **Not asking for critical decisions** [[memory:6917891]]
- **Truncating user documentation** - NEVER truncate quotes/logs [[memory:0944]]
- **Not documenting git operations** - Always show branch switches [[memory:0931]]
- **Missing cross-agent improvements** - Check other branches regularly [[memory:0935]]

---

## **AMBIGUITIES & QA DECISIONS REQUIRED**

### **Outstanding Questions (Actual Pending Decisions):**
- [ ] **Decision 1: Link Validation Approach**
  - a) Implement automated checking for GitHub links before submission
  - b) Continue with manual verification approach for flexibility
- [ ] **Decision 2: Version Integration Strategy**
  - a) Integrate component versioning directly with PDCA process
  - b) Keep versioning separate from PDCA for cleaner separation of concerns
- [ ] **Decision 3: Recovery Format Requirements**
  - a) Require full PDCA format compliance in recovery scenarios
  - b) Allow simplified format for recovery scenarios to enable faster response

### **Format Evolution Decisions:**
- [ ] **Template Updates:** 
  a) Template.md should reflect latest format requirements
  b) Keep template basic with separate detailed guidelines
- [ ] **Process Documentation:** 
  a) Full integration between howto and mandatory requirements
  b) Separate documents for different complexity levels
- [ ] **Role Training:** 
  a) Mandatory format training for all roles
  b) Role-specific format adaptations allowed
- [ ] **Quality Assurance:** 
  a) Automated validation processes
  b) Manual review processes

### **Communication Protocol:**
- [ ] **Chat Response Length:** 
  a) Brief responses with links and decisions only
  b) Moderate responses with key context included
- [ ] **Link Presentation:** 
  a) Standard dual-link format for all artifacts
  b) Abbreviated format for multiple links
- [ ] **Feedback Integration:** 
  a) Code block format for all user quotes
  b) Traditional quote format for simple feedback

---

## **🔗 REFERENCE DOCUMENTS**

**Latest Format Examples:**
- [Status Checkbox Implementation PDCA](../project.journal/2025-08-21-1613-sprint21-tootsie-architecture/pdca/role/developer/2025-08-22-UTC-0745-status-checkbox-implementation.md) - **Gold Standard**
- [Fresh Dawn PDCAs](../project.journal/2025-08-19-0800-fresh-dawn/pdca/) - **Emotional Section Examples**

**Process Improvement Documentation:**
- [PDCA Format Requirements](./pdca.process.improvements/02-pdca-format-requirements-mandatory.md)
- [PDCA Consolidation Links](./pdca.process.improvements/2025-08-22-UTC-1255-pdca-consolidation-link-system.md)
- [Enhanced Template](./pdca.process.improvements/05-pdca-enhanced-template.md)

**Templates:**
- [Updated Template](./template.md) - **Latest Format**
- [Standard Template](./pdca.process.improvements/04-pdca-standard-template.md)

---

**🎯 PDCA writing mastery ensures systematic process improvement and maintains excellent traceability across all project phases - follow these consolidated guidelines for optimal results!** 📋✅🔄

**"Always 4 2 (FOR TWO) - comprehensive PDCA documentation enables collaborative excellence."** 🔧📊
