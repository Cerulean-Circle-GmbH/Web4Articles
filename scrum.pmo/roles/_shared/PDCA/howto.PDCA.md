[Back to PDCA Process Improvements](./pdca.process.improvements/) | [CMMI Understanding](./PDCA.understanding.CMMI.md) | [How to Decide](./PDCA.howto.decide.md) | [Template](./template.md)

<<<<<<< HEAD
# 📋 **How to Write Excellent PDCAs - Consolidated Guidelines v2.6 (Template v3.1.4.2)**

**🗓️ Date:** 2025-08-22-UTC-1330  
**🎯 Objective:** Consolidated PDCA writing guidelines based on latest process improvements  
=======
# 📋 **How to Write Excellent PDCAs - Consolidated Guidelines v2.6**

**🗓️ Date:** 2025-09-06-UTC-2130  
**🎯 Objective:** Updated PDCA writing guidelines with recovery system integration and latest process improvements
>>>>>>> origin/dev/2025-09-14-UTC-1425
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Role:** Process Documentation → Knowledge Management Enhancement  
**👤 Branch:** save/start.v1 → Template Evolution  
**🎯 Project Journal Session:** Template Documentation → Version 3.0  
**🎯 Sprint:** Sprint-21 → Process Standardization  
**✅ Task:** PDCA Writing Guidelines  
**🚨 Issues:** Version tracking needed for compliance  
**🔗 Based on:** [Status Checkbox Implementation PDCA](../project.journal/2025-08-21-1613-sprint21-tootsie-architecture/pdca/role/developer/2025-08-22-UTC-0745-status-checkbox-implementation.md)

---

## **📊 MANDATORY PDCA FORMAT - 6 SECTIONS REQUIRED**

### **1. STRICT HEADER FORMAT (NON-NEGOTIABLE)**
```markdown
# 📋 **PDCA Cycle: [CLEAR TITLE] - [BRIEF DESCRIPTION]**

**🗓️ Date:** YYYY-MM-DD-UTC-HHMM  
**🎯 Objective:** [CLEAR, SPECIFIC OBJECTIVE STATEMENT]  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** [AGENT NAME] → [AGENT DESCRIPTION]  
**👤 Agent Role:** [ROLE NAME] → [CONTEXT/SPECIALIZATION]  
**👤 Branch:** [BRANCH NAME] → [BRANCH PURPOSE]  
**🔄 Sync Requirements:** [SYNC BRANCHES] → [SYNC PURPOSE]  
**🎯 Project Journal Session:** [SESSION NAME] → [SESSION FOCUS]  
**🎯 Sprint:** [SPRINT NAME] → [SPRINT GOAL]  
**✅ Task:** [TASK NAME]  
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

**In PDCA Files:**
```markdown
[GitHub](https://github.com/.../blob/branch/path/to/file) | [§/path/from/root](../../../relative/path)
```

**In Chat Responses:**
```markdown
[GitHub](https://github.com/.../blob/branch/path/to/file) | [§/path/from/root](path/from/root)
```

### **Link Requirements:**
- **§ notation for display** when showing paths from project root
- **In PDCAs:** Relative path FROM document TO target
- **In Chat:** Full path from project root (NO relative paths)
- **GitHub links MUST work** (require git push before providing) [[memory:6291031]]
- **Both links on same line** separated by ` | `
- **Always end chat responses with current artifact links** [[memory:6291031]]

### **Critical Chat Rule:**
- Chat has NO document context - you're not "in" any file
- ALWAYS use project root paths in chat responses
- The link path equals the display path (minus §)

### **Git Protocol (MANDATORY)**
1. **Immediate commit and push** after every PDCA creation [[memory:6902297]]
2. **Git add, commit, and push operations** ensure proper version control [[memory:6902297]]
3. **One-liner commit messages** with PDCA name: `git commit -m "PDCA: [Title from PDCA header]"` [[memory:6713745]]
   - Example: `git commit -m "PDCA: Branch update coordination - cherry-pick strategy"`
   - Include the PDCA title for traceability and robustness
4. **Auto-merge to release/dev** after EVERY commit (Decision 1a - automatic)
5. **File not found?** Always check release/dev and cherry-pick if missing:
   ```bash
   git fetch origin release/dev
   git checkout origin/release/dev -- path/to/missing/file
   ```
6. **ALWAYS ask before git operations** (Decision 2a) - pull, merge, rebase, reset
7. **NEVER truncate user quotes** - they are documentation!
8. **Document ALL git operations in PDCAs** - especially branch switches
9. **Cross-agent learning** - Check other branches for improvements
10. **Test conflict handling** - Script now creates PRs on merge conflicts

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
- **CRITICAL: ALWAYS ASK FOR USER ACCEPTANCE** - Never assume task completion without explicit user validation
- **NEVER MARK TASKS AS COMPLETE** without user QA approval - this violates "Never 2 1 (TO ONE), Always 4 2 (FOR TWO)" principle

### **Task Status Management (PO Role Guidelines):**
- **Status Format:** Simple checkboxes without refinement substatus: `- [x] Planned`, `- [x] In Progress`, `- [x] QA Review`, `- [x] Done`
- **Refinement Elimination:** Subtasks should not have refinement status - they ARE the refinement
- **Status Progression:** Planned → In Progress → QA Review → Done (linear progression)
- **Planning Reflection:** Planning status reflects decisions status from inside task files
- **Subtask File Existence:** Use checkboxes in traceability to show actual file existence vs planned

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

## **🔄 RESPONDING TO 'PDCA' PROMPT - COMPLIANCE REVIEW**

When a user types just `pdca` as a prompt, this is a **compliance check request**. The agent MUST:

### **1. Review Previous PDCA**
- **Immediately read** the most recent PDCA created
- **Check compliance** against ALL sections in this howto.PDCA.md
- **Identify violations** of the mandatory 6-section format

### **2. Re-read Key Documents**
1. **This howto.PDCA.md** - Full review of all requirements
2. **[PDCA Reporting Requirement](./PDCA.reporting.requirement.md)** - Official standard
3. **[Dual Link Format Requirement](./PDCA.dual.link.format.requirement.md)** - Link standards
4. **[CMMI Understanding](./PDCA.understanding.CMMI.md)** - CMM Level 3 compliance

### **3. Actions Based on Compliance Status**

#### **If PDCA is Non-Compliant:**
1. **Create a new PDCA** documenting the fixes needed
2. **Fix the previous PDCA** to meet all requirements
3. **Document learnings** about what was missed
4. **Update the fixed PDCA** with correction notice
5. **Act and report** CMM3 compliant in your response

#### **If PDCA is Compliant:**
1. **Acknowledge compliance** - "Previous PDCA meets all requirements ✅"
2. **Refresh memory** after long tasks that may have caused forgetting
3. **Return to CMM3 compliance** mindset
4. **Continue with next task** maintaining standards
5. **Act and report** CMM3 compliant in your response

### **4. MANDATORY RESPONSE FORMAT**
After completing the compliance review, the agent MUST:
- **Report findings** in a structured, CMM3 compliant format
- **Take action** if needed (fixes or acknowledgment)
- **Maintain PDCA standards** in all subsequent responses
- **Create PDCAs** for any new work that follows

**WARNING:** Simply checking compliance without acting and reporting properly will trigger another `pdca` prompt from the user!

### **4. Response Format for 'pdca' Prompt**
```markdown
## PDCA Compliance Check Result

**Previous PDCA:** [GitHub](URL) | [local/path](path)
**Compliance Status:** ✅ Compliant / ❌ Non-Compliant

### Issues Found (if any):
- Missing section: [section name]
- Incorrect format: [issue description]
- Dual link errors: [specific problems]

### Actions Taken:
- [x] Re-read howto.PDCA.md
- [x] Reviewed reporting requirements
- [x] Checked dual link standards
- [x] Validated CMM3 compliance
- [ ] Fixed previous PDCA (if needed)
- [ ] Created correction PDCA (if needed)

### Next Steps:
[Continue with current task maintaining standards]
```

### **5. Purpose of 'pdca' Prompt**
- **Quality gate** for long sessions
- **Memory refresh** after complex tasks
- **Compliance enforcement** for standards
- **Learning opportunity** from mistakes
- **CMM3 maturity** maintenance

**Remember:** The 'pdca' prompt is a self-correction mechanism to ensure consistent quality throughout the session!

---

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

### **🎯 CRITICAL LEARNING: NEVER 2 1 ALWAYS 4 2 - Decision Authority and Trust**

**🗓️ Learning Date:** 2025-09-06-UTC-1132  
**📋 Source:** Background Agent Extended Session - Critical Decision Violations and Corrections  
**🔗 Learning PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-06-UTC-1132-session/pdca/role/po/2025-09-06-UTC-1132-critical-decision-violation-correction.md) | [§/scrum.pmo/project.journal/2025-09-06-UTC-1132-session/pdca/role/po/2025-09-06-UTC-1132-critical-decision-violation-correction.md](../../../project.journal/2025-09-06-UTC-1132-session/pdca/role/po/2025-09-06-UTC-1132-critical-decision-violation-correction.md)

#### **Core Principle Understanding**
**NEVER 2 1 ALWAYS 4 2** = **NEVER TO ONE, ALWAYS FOR TWO**

**❌ NEVER 2 1 (TO ONE) - Unilateral Decisions:**
- Never make important technical decisions alone
- Never assume methodology or tool usage approaches
- Never say "all clear" when guidance is needed
- Never proceed with assumptions about next steps

**✅ ALWAYS 4 2 (FOR TWO) - Collaborative Decisions:**
- Always ask for user guidance on important choices
- Always present real decisions when multiple options exist
- Always recognize user authority over technical approaches
- Always work collaboratively on methodology and next steps

#### **Critical Decision Categories Requiring User Input**
1. **Tool Usage and Configuration**: Which tools to use, how to configure them
2. **Technical Approaches**: Build processes, version selections, methodology choices
3. **Task Priority and Selection**: Which tasks to work on next, in what order
4. **Enhancement Methodology**: How to enhance tasks, what approach to take
5. **Process Deviations**: Any changes from established procedures
6. **Next Steps**: What to do after completing current work

#### **Trust and Authority Recognition**
**User Authority Over:**
- **Technical Decisions**: Tool configurations, build processes, version selections
- **Methodology Choices**: How to approach tasks, which tools to use
- **Priority Decisions**: Task order, focus areas, next steps
- **Process Control**: When to ask, when to proceed, how to enhance

**Agent Responsibility:**
- **Execute User Decisions**: Implement exactly as specified
- **Ask for Guidance**: Present real choices when options exist
- **Document Process**: Create comprehensive PDCA documentation
- **Report Results**: Provide detailed outcomes before next steps

#### **Practical Application Examples**

**❌ Wrong Approach (2 1 - TO ONE):**
```
"All clear, no decisions to make - proceeding with Task 13"
```

**✅ Correct Approach (4 2 - FOR TWO):**
```
Decision 1: Next Task Selection
- a) Continue with Task 13: Fix Existing Scenario Format
- b) Move to Task 1: IOR Interface Consolidation  
- c) Focus on different priority task
```

**❌ Wrong Tool Decision:**
```
"Tool has build issues, proceeding with manual analysis"
```

**✅ Correct Tool Decision:**
```
Decision 1: Tool Usage Approach
- a) Wait for you to fix tool dependencies
- b) Attempt alternative tool approaches
- c) Use manual analysis (may create harm)
```

#### **Implementation Success Validation**
When user decisions are implemented correctly:
- **Technical Solutions Work**: User specifications lead to successful outcomes
- **Tool Integration Success**: Proper configuration enables intended functionality  
- **Requirements Discovery**: Systematic analysis finds perfect requirement matches
- **Process Excellence**: Collaborative approach produces superior results

**Example Success:** requirement-v0.1.2.2 + unit-v0.1.0.0 configuration worked perfectly, enabling systematic requirements discovery for task enhancement.

#### **Key Learning for Future Agents**
- **Trust User Expertise**: User technical decisions consistently work better than agent assumptions
- **Ask Before Acting**: Present decisions for important choices, never assume
- **Collaborative Excellence**: 4 2 (FOR TWO) approach produces superior results
- **Process Compliance**: NEVER 2 1 ALWAYS 4 2 prevents harm and enables success

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
- **CRITICAL VIOLATION: Marking tasks complete without user approval** - Always ask "Do you accept this task as complete?"
- **Assuming user acceptance** instead of explicitly requesting QA validation
- **Truncating user documentation** - NEVER truncate quotes/logs [[memory:0944]]
- **Not documenting git operations** - Always show branch switches [[memory:0931]]
- **Missing cross-agent improvements** - Check other branches regularly [[memory:0935]]

### **🚨 CRITICAL: NO INTERACTIVE COMMANDS**
- **NEVER use commands that require user input** (e.g., `git cherry-pick` without `--no-commit`)
- **ALWAYS use non-interactive flags**: `--yes`, `--force`, `-y`, `--no-input`
- **Examples of FORBIDDEN commands:**
  - `git cherry-pick` (use `git cherry-pick --no-commit` or copy files directly)
  - `npm install` (use `npm install --yes`)
  - `apt-get install` (use `apt-get install -y`)
- **Background agents CANNOT interact** - we run autonomously!
- **If a command hangs**, it's likely waiting for input - CTRL+C and fix!

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

**PDCA Consolidation Hub:**
- [Process Improvements Hub](./pdca.process.improvements/) - **Complete PDCA Documentation Access**
- [PDCA Consolidation System](./pdca.process.improvements/2025-08-22-UTC-1255-pdca-consolidation-link-system.md) - **Centralized Link System**

**Latest Format Examples:**
- [Status Checkbox Implementation PDCA](../project.journal/2025-08-21-1613-sprint21-tootsie-architecture/pdca/role/developer/2025-08-22-UTC-0745-status-checkbox-implementation.md) - **Gold Standard**
- [Fresh Dawn PDCAs](../project.journal/2025-08-19-0800-fresh-dawn/pdca/) - **Emotional Section Examples**
- [Recovery System Integration](./pdca.process.improvements/13-recovery-system-pdca-format-integration.md) - **Universal Format Compliance**

**Process Improvement Documentation:**
- [PDCA Format Requirements](./pdca.process.improvements/02-pdca-format-requirements-mandatory.md) - **MANDATORY Reading**
- [PDCA Consolidation Links](./pdca.process.improvements/2025-08-22-UTC-1255-pdca-consolidation-link-system.md) - **Centralized Access**
- [Enhanced Template](./pdca.process.improvements/05-pdca-enhanced-template.md) - **Advanced Format**
- [Recovery Integration](./pdca.process.improvements/13-recovery-system-pdca-format-integration.md) - **Universal Compliance**

**Templates:**
- [Updated Template](./template.md) - **Latest Format v3.1.4.2**
- [Standard Template](./pdca.process.improvements/04-pdca-standard-template.md) - **Basic Format**
- [Enhanced Template](./pdca.process.improvements/05-pdca-enhanced-template.md) - **Advanced Features**

---

---

## **🔄 AGENT RECOVERY WORKFLOW**

### **For Recovered Agents Starting Fresh:**

When you start as a recovered agent (after expiry and resubmission):

1. **Check Your Identity Record**: 
   - Look for: `/scrum.pmo/agents/registry/[YOUR-REQUEST-ID].md`
   - This contains your identity, role, and purpose

2. **Read Identity Record Completely**:
   - Understand who you are
   - Review your responsibilities
   - Check previous work references
   - Note integration points

3. **Follow Startup Instructions**:
   - Each identity record has specific steps
   - Usually includes role README location
   - May reference previous work

4. **Create Recovery PDCA**:
   - Document your understanding
   - Confirm your identity
   - State your readiness
   - Plan immediate next steps

### **Identity Record Location Pattern:**
```
/scrum.pmo/agents/registry/[REQUEST-ID].md
```

### **Example:**
Agent bc-b1b62bba-9e33-46a3-a64d-8eb0162b8a89 should read:
```
/scrum.pmo/agents/registry/bc-b1b62bba-9e33-46a3-a64d-8eb0162b8a89.md
```

### **What Identity Records Contain:**
- Current and previous names
- Role and purpose
- Recovery context
- Responsibilities
- Previous work location
- Integration points
- Startup instructions

**CRITICAL**: This is the FIRST thing a recovered agent should check!

---

## **🔗 PDCA CONSOLIDATION HUB**

### **Centralized Access Point**
All PDCA process improvements and templates are available through the centralized hub:
- **Location:** `scrum.pmo/roles/_shared/PDCA/pdca.process.improvements/`
- **Purpose:** Single-point access to all PDCA documentation across the project
- **Benefits:** Efficient discovery, learning, and template comparison

### **Available Resources**
- **Core Documentation:** Prompt protocol, format requirements, traceability guidelines
- **Templates:** Standard, enhanced, and role-transition templates  
- **Analysis:** Writing mastery analysis, reporting reviews, meta-learning cycles
- **Historical:** Complete timeline of PDCA process improvements and evolution

### **Usage for Agents**
1. **New Agents:** Explore complete PDCA ecosystem for comprehensive understanding
2. **Template Selection:** Compare all available templates for optimal format choice
3. **Process Learning:** Study historical PDCA cycles for continuous improvement
4. **Format Compliance:** Access latest format requirements and examples

---

## **🚨 RECOVERY SYSTEM INTEGRATION**

### **Mandatory Format Requirements**
**CRITICAL:** Every recovery role must read and apply format requirements FIRST:
- **Location:** [PDCA Format Requirements](./pdca.process.improvements/02-pdca-format-requirements-mandatory.md)
- **Purpose:** Ensure every role knows exactly what is expected from PDCAs
- **Application:** Format compliance is NON-NEGOTIABLE for recovery system success

### **Universal Coverage**
All recovery processes now include embedded PDCA format requirements:
- **Developer Recovery:** Test results and code quality focus
- **Tester Recovery:** QA findings with exact verbatim quotes
- **Architect Recovery:** PUML diagrams and architectural evidence  
- **PO Recovery:** UUID mapping and template compliance
- **ScrumMaster Recovery:** Role coordination and process tracking
- **DevOps Recovery:** Infrastructure and exact error messages

### **Proactive Prevention**
Recovery system prevents format failures by:
- **Prominent Placement:** Requirements are FIRST thing every role sees
- **Impossible to Miss:** Warning format makes requirements unavoidable
- **Role Customization:** Each role has specific PDCA guidance
- **Central Reference:** Single authoritative source for all requirements

---

---

## **🔄 AGENT RECOVERY WORKFLOW**

### **For Recovered Agents Starting Fresh:**

When you start as a recovered agent (after expiry and resubmission):

1. **Check Your Identity Record**: 
   - Look for: `/scrum.pmo/agents/registry/[YOUR-REQUEST-ID].md`
   - This contains your identity, role, and purpose

2. **Read Identity Record Completely**:
   - Understand who you are
   - Review your responsibilities
   - Check previous work references
   - Note integration points

3. **Follow Startup Instructions**:
   - Each identity record has specific steps
   - Usually includes role README location
   - May reference previous work

4. **Create Recovery PDCA**:
   - Document your understanding
   - Confirm your identity
   - State your readiness
   - Plan immediate next steps

### **Identity Record Location Pattern:**
```
/scrum.pmo/agents/registry/[REQUEST-ID].md
```

### **Example:**
Agent bc-b1b62bba-9e33-46a3-a64d-8eb0162b8a89 should read:
```
/scrum.pmo/agents/registry/bc-b1b62bba-9e33-46a3-a64d-8eb0162b8a89.md
```

### **What Identity Records Contain:**
- Current and previous names
- Role and purpose
- Recovery context
- Responsibilities
- Previous work location
- Integration points
- Startup instructions

**CRITICAL**: This is the FIRST thing a recovered agent should check!

---

**🎯 PDCA writing mastery ensures systematic process improvement and maintains excellent traceability across all project phases - follow these consolidated guidelines for optimal results!** 📋✅🔄

**"Always 4 2 (FOR TWO) - comprehensive PDCA documentation enables collaborative excellence."** 🔧📊
