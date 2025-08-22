[Back to Recovery Analysis](../)

# 🚨 **PDCA Prompt Protocol - All Agents Must Know**

**🎯 Purpose:** Define standard response when user prompts with single word `pdca`  
**📋 Status:** MANDATORY KNOWLEDGE - All agents must follow this protocol  
**⚡ Priority:** CRITICAL - Failure to follow breaks communication standards  

---

## **🔤 When User Prompts: `pdca`**

### **What This Means:**
The user is requesting a **PDCA Cycle document** about your current work, recovery, or recent actions following the mandatory format requirements.

### **What You Must Do:**

#### **Step 1: Create PDCA Document (MANDATORY)**
1. **Read Format Requirements FIRST:**
   - **CRITICAL:** Review [PDCA Format Requirements](./pdca-format-requirements-mandatory.md)
   - **ALL 6 sections required:** Header, Summary, Plan, Do, Check, Act
   - **Mandatory elements:** QA decisions, verbatim user feedback, dual links

2. **Create PDCA File:**
   - **Location:** Current session's PDCA directory structure
   - **Filename:** `YYYY-MM-DD-UTC-HHMM-[descriptive-title].md`
   - **Format:** MUST follow all mandatory requirements from format document

3. **Content Requirements:**
   ```markdown
   # 📋 **PDCA Cycle: [Title] - [Description]**
   
   **🗓️ Date:** YYYY-MM-DD-UTC-HHMM
   **🎯 Objective:** [Specific objective]
   **👤 Role:** [Current Role] → [Context]
   **🚨 Issues:** [Issues being addressed]
   **🔗 Last Commit SHA:** [SHA]
   **🔗 Previous PDCA:** [Link if applicable]
   
   ---
   
   ## **📊 SUMMARY**
   
   ### **Artifact Links**
   - [GitHub](URL) | [local/path](local/path)
   
   ### **QA Decisions**
   - [ ] [Specific decision with checkbox]
   - [ ] [Another pending decision]
   
   ### **TRON Feedback (YYYY-MM-DD-UTC-HHMM)**
   > **"pdca"**
   
   **Learning Applied:** [Key insight from PDCA request]
   
   ---
   
   ## **📋 PLAN**
   [Content]
   ---
   ## **🔧 DO**
   [Content]
   ---
   ## **✅ CHECK**
   [Content including verbatim user feedback]
   ---
   ## **🎯 ACT**
   [Content]
   ---
   ## **🎯 PDCA PROCESS UPDATE**
   [Mandatory process learning section]
   ---
   
   **[Concise summary with emojis]**
   ```

#### **Step 2: Chat Response (CRITICAL FORMAT)**

**✅ CORRECT Response Format:**
```
Brief status (1-2 lines maximum)

[GitHub](https://github.com/.../filename.md) | [path/to/filename.md](path/to/filename.md)
```

**❌ WRONG - DO NOT DO:**
- Long explanations in chat
- Copying PDCA content to chat
- Multiple paragraphs of text
- Missing dual links
- Non-working GitHub links

---

## **📋 Format Requirements Reference**

### **Mandatory Reading:**
- **Primary:** [PDCA Format Requirements Mandatory](./pdca-format-requirements-mandatory.md)
- **Template:** [Enhanced Recovery Template](./agent.recovery.v4.md#step-1-create-pdca-file)
- **Process:** [ScrumMaster Recovery Process](../scrum.pmo/roles/ScrumMaster/recovery-process.md)

### **Key Requirements:**
1. **All 6 sections mandatory** with horizontal separators (---)
2. **QA Decisions checkboxes** in Summary section
3. **Verbatim user feedback** with UTC timestamp in Check section
4. **Dual-link format** for all artifact references
5. **PDCA Process Update section** for continuous improvement
6. **Commit and push** before providing GitHub links

---

## **🚨 Critical Success Factors**

### **Before Responding to User:**
- [ ] **PDCA Created:** Complete PDCA document with all 6 mandatory sections
- [ ] **Format Verified:** All requirements from format document followed
- [ ] **Committed:** Changes committed to git
- [ ] **Pushed:** Changes pushed to GitHub (required for working GitHub links)
- [ ] **Links Tested:** Both GitHub and local links work correctly

### **Chat Response Requirements:**
- [ ] **Brief Status:** Maximum 1-2 lines about what PDCA covers
- [ ] **Dual Links:** Both GitHub and local links on same line
- [ ] **No Lengthy Content:** All details in PDCA file, not chat
- [ ] **Professional Tone:** Clear, direct, helpful

---

## **📊 Example Scenarios**

### **Scenario 1: During Active Work**
```
User: pdca

Agent Response:
PDCA created for current development work on Web4Requirement CLI enhancements.

[GitHub](https://github.com/.../2025-08-22-UTC-0945-web4requirement-cli-development.md) | [pdca/2025-08-22-UTC-0945-web4requirement-cli-development.md](pdca/2025-08-22-UTC-0945-web4requirement-cli-development.md)
```

### **Scenario 2: After Recovery**
```
User: pdca

Agent Response:
PDCA documenting successful agent recovery and context restoration as Developer role.

[GitHub](https://github.com/.../2025-08-22-UTC-0950-agent-recovery-developer.md) | [pdca/2025-08-22-UTC-0950-agent-recovery-developer.md](pdca/2025-08-22-UTC-0950-agent-recovery-developer.md)
```

### **Scenario 3: Process Improvement**
```
User: pdca

Agent Response:
PDCA analyzing sprint task coordination improvements and multi-role collaboration enhancements.

[GitHub](https://github.com/.../2025-08-22-UTC-1000-sprint-coordination-analysis.md) | [pdca/2025-08-22-UTC-1000-sprint-coordination-analysis.md](pdca/2025-08-22-UTC-1000-sprint-coordination-analysis.md)
```

---

## **🎯 Why This Protocol Exists**

### **User Benefits:**
- **Consistent Communication:** Same response format from all agents
- **Navigation Friendly:** Working links to access detailed documentation
- **Time Efficient:** Brief chat responses with comprehensive file documentation
- **Traceability:** Complete PDCA cycle documentation for all work

### **Agent Benefits:**
- **Clear Expectations:** Unambiguous protocol to follow
- **Process Compliance:** Ensures proper documentation standards
- **Recovery Support:** PDCA documents enable reliable agent recovery
- **Quality Assurance:** Systematic approach prevents format failures

### **System Benefits:**
- **Process Integrity:** Maintains PDCA discipline across all agents
- **Documentation Quality:** Consistent format enables easy parsing
- **Version Control:** All PDCA documents committed and tracked
- **Knowledge Preservation:** Complete context for future agent sessions

---

## **🚨 Failure Consequences**

### **What Happens When Protocol Not Followed:**
- **Process Breakdown:** TRON must manually correct format issues
- **Recovery Issues:** Future agents can't understand context
- **Credibility Loss:** Systematic approach appears broken
- **Session Disruption:** Focus shifts to fixing protocol instead of work progress

### **Common Mistakes to Avoid:**
1. **Skipping Format Requirements:** Not reading mandatory format document
2. **Incomplete PDCA:** Missing required sections or elements
3. **Chat Overload:** Putting detailed content in chat instead of files
4. **Broken Links:** Providing GitHub links before pushing changes
5. **No Commit:** Creating PDCA but not committing to version control

---

## **📚 Quick Reference Checklist**

When user prompts `pdca`:

1. **✅ Read:** [PDCA Format Requirements](./pdca-format-requirements-mandatory.md)
2. **✅ Create:** Complete PDCA document with all 6 mandatory sections
3. **✅ Include:** QA decisions, verbatim feedback, dual links, process update
4. **✅ Commit:** `git add . && git commit -m "descriptive message"`
5. **✅ Push:** `git push` (required for working GitHub links)
6. **✅ Respond:** Brief status + dual links only
7. **✅ Verify:** Both links work correctly

---

**🔧📊 Remember: "Much in files, relevant links in chat" - TRON's explicit communication protocol.**

**"Always 4 2 (FOR TWO) - systematic PDCA documentation enables collaborative intelligence."** 🔧📊
