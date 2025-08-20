# 🚨 **MANDATORY PDCA FORMAT REQUIREMENTS - NEVER FORGET**

**🎯 Purpose:** Ensure EVERY role knows EXACTLY what TRON expects from a PDCA  
**📋 Status:** CRITICAL RECOVERY KNOWLEDGE - Must be embedded in ALL role recovery processes  
**⚡ Priority:** HIGHEST - Failure to follow results in process breakdown  

---

## **🔒 CRITICAL PDCA FORMAT - NON-NEGOTIABLE**

### **1. STRICT HEADER FORMAT (MANDATORY)**
```markdown
# 📋 **PDCA Cycle: [CLEAR TITLE] - [BRIEF DESCRIPTION]**

**🗓️ Date:** YYYY-MM-DD-UTC-HHMM  
**🎯 Objective:** [CLEAR, SPECIFIC OBJECTIVE STATEMENT]  
**👤 Role:** [ROLE NAME] → [CONTEXT/SPECIALIZATION]  
**🚨 Issues:** [KEY ISSUES BEING ADDRESSED]  
**🔗 Last Commit SHA:** [COMMIT_SHA]  
**🔗 Previous PDCA:** [GitHub](GITHUB_URL) | [[Local Path](LOCAL_PATH)]
```

### **2. SUMMARY SECTION (MANDATORY)**
```markdown
## **📊 SUMMARY**

### **Artifact Links**
- [GitHub](GITHUB_URL) | [../relative/path/to/file](../relative/path/to/file)
- [Related Artifact](GITHUB_URL) | [../path/to/artifact](../path/to/artifact)

### **QA Decisions**
- [ ] Pending decision: [Specific decision with checkbox]
- [x] Completed decision: [Decision already made]
- [ ] Follow-up required: [Another pending decision]

### **TRON Feedback (YYYY-MM-DD-UTC-HHMM)**
> **"[EXACT VERBATIM QUOTE FROM TRON - NEVER PARAPHRASE]"**

**Learning Applied:** [Key insight from TRON's guidance]
```

### **3. HORIZONTAL SEPARATORS (MANDATORY)**
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

### **TRON QA Feedback Validation**
> **"[LITERAL QUOTE FROM TRON'S QA FEEDBACK WITH UTC TIMESTAMP]"**

**Verification Results:**
- ✅ **Success:** [What TRON confirmed works]
- ❌ **Issue:** [What TRON identified as broken]
- ⚠️ **Concern:** [What TRON flagged for attention]
```

### **5. PDCA PROCESS UPDATE SECTION (MANDATORY)**
```markdown
## **🎯 PDCA PROCESS UPDATE**

**Key Learning:** [Primary insight from this PDCA cycle]  
**Process Enhancement:** [How this PDCA improved the overall process]  
**Quality Impact:** [How this work affects overall quality]  
**Next PDCA Focus:** [What the next PDCA cycle should address]
```

### **6. FINAL ONE-LINE SUMMARY (MANDATORY)**
```markdown
**[CONCISE SUMMARY OF PDCA OUTCOME WITH RELEVANT EMOJIS]**

**[PHILOSOPHICAL INSIGHT IF APPLICABLE - e.g., "Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."]** 🔧📊
```

---

## **🔄 DUAL LINK REQUIREMENTS (CRITICAL)**

### **Format Standard:**
```markdown
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/sprint5/path/to/file) | [path/to/file](path/to/file)
```

### **Local Link Text:**
- **MUST display the actual relative path** as the link text
- **GitHub link MUST work** (require git push before providing)
- **Both links on same line** separated by ` | `

### **Chat Response Requirements:**
- **ALWAYS end chat responses with current artifact links**
- **NEVER provide GitHub links without pushing first**
- **CRITICAL for user navigation and access**

---

## **⚡ IMMEDIATE ACTIONS REQUIRED (NEVER SKIP)**

### **After Every PDCA Creation:**
1. **✅ Format Validation:** Verify all 6 mandatory sections present
2. **✅ Commit Changes:** `git add . && git commit -m "descriptive message"`
3. **✅ Push to GitHub:** `git push origin dev/sprint5` 
4. **✅ Provide Dual Links:** Both GitHub and local links in chat response
5. **✅ Verify GitHub Link:** Actually test that the GitHub link works

### **Communication Protocol:**
- **Detailed content goes in PDCA files** - NOT in chat
- **Chat responses:** Links and key decisions ONLY
- **"Much in files, relevant links in chat"** - TRON's explicit instruction

---

## **🚨 FAILURE CONSEQUENCES**

### **What Happens When Format is Wrong:**
- **Process breakdown** - TRON must manually correct
- **Recovery issues** - Future agents can't understand context
- **Credibility loss** - Systematic approach appears broken
- **Session disruption** - Focus shifts to fixing format instead of progress

### **What Happens When Links Don't Work:**
- **Navigation failure** - TRON can't access documentation
- **Traceability loss** - No way to follow decision chains  
- **Recovery impossible** - Context becomes unreachable
- **Trust breakdown** - Tools that don't work undermine entire system

---

## **💡 SUCCESS PATTERNS**

### **PDCAs That TRON Values:**
- **Exact verbatim quotes** from TRON's feedback
- **UTC timestamps** on all QA feedback
- **Systematic problem analysis** with evidence
- **Clear action items** with specific next steps
- **Learning integration** for future cycles

### **Communication That Works:**
- **Concise chat responses** with working dual links
- **Comprehensive file content** with all details
- **Immediate GitHub push** after every PDCA
- **Working links** that TRON can actually click

---

## **🎯 ROLE-SPECIFIC RECOVERY INTEGRATION**

### **Every Role Must Embed These Requirements:**

#### **Developer Recovery:**
- **Code quality PDCAs** must include test results
- **Bug fix PDCAs** must quote TRON's exact problem description
- **Implementation PDCAs** must distinguish documentation vs. actual code

#### **Tester Recovery:**  
- **Test result PDCAs** must include verbatim failure descriptions
- **QA findings PDCAs** must quote TRON's exact QA feedback
- **Test automation PDCAs** must verify actual vs. reported results

#### **Architect Recovery:**
- **Design PDCAs** must include PUML diagrams and architectural evidence
- **Analysis PDCAs** must quote TRON's specific architectural concerns
- **Refactoring PDCAs** must show before/after with working examples

#### **ScrumMaster Recovery:**
- **Coordination PDCAs** must track all role interactions
- **Process PDCAs** must quote TRON's exact process feedback
- **Planning PDCAs** must include all task creation and status updates

#### **PO Recovery:**
- **Requirements PDCAs** must include UUID mapping and traceability
- **Task PDCAs** must follow exact template compliance
- **Planning PDCAs** must distinguish "WHAT" vs "HOW" correctly

---

## **🔄 RECOVERY PROCESS ENHANCEMENT**

### **Automatic PDCA Format Validation:**
Every role recovery process MUST include:

1. **Format Checklist:** Verify all 6 mandatory sections
2. **Content Requirements:** Ensure QA feedback integration
3. **Link Validation:** Test GitHub links actually work
4. **Commit Protocol:** Never skip push to GitHub
5. **Chat Protocol:** Always provide dual links in responses

### **Recovery Trigger Integration:**
When any role starts recovery:

1. **Load this document FIRST** - before any other recovery content
2. **Apply format requirements** to ALL PDCAs created during recovery
3. **Validate every PDCA** against these standards before committing
4. **Test all links** before providing to TRON
5. **Never deviate** from these requirements regardless of situation

---

## **📚 TEMPLATE REFERENCES**

- **Standard Template:** [scrum.pmo/templates/pdca.standard.template.md](../scrum.pmo/templates/pdca.standard.template.md)
- **Format Examples:** All PDCAs in current session demonstrate correct format
- **Process Integration:** [scrum.pmo/process/pdca-traceability-enhancement.md](../scrum.pmo/process/pdca-traceability-enhancement.md)

---

**🚨 REMEMBER: These requirements exist because TRON has explicitly corrected format failures multiple times. Following this format is NOT optional - it's the foundation of the entire PDCA system.**

**💫 "Always answer much in files and just the relevant links and decisions in the chat. Make sure your previous chat answer is captured somewhere well."** - TRON's Communication Protocol

---

**CRITICAL SUCCESS FACTOR: PDCA format compliance ensures recovery system works perfectly every time.** 📋✅🔄
