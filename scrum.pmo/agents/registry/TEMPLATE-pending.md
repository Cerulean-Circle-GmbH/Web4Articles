# 🆔 **Agent Identity Assignment - Pending QA Action**

## **📋 AGENT SELF-REGISTRATION COMPLETE**
- **Registration Date:** {{TIMESTAMP}}  
- **Session Branch:** {{BRANCH}}  
- **Registration Type:** Self-registered unknown agent  
- **Status:** ⏳ **AWAITING QA INPUT** ⬇️

---

## **🎯 QA ACTION REQUIRED: PROVIDE AGENT IDENTITY**

### **Step 1: RequestID Input**
```
🔹 CURSOR REQUESTID (from Cursor UI):
[PASTE REQUESTID HERE: bc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx]

✅ RequestID provided: [ ]  (QA check when completed)
```

### **Step 2: Agent Name Assignment**
```
🔹 AGENT NAME (descriptive, meaningful):
[ENTER AGENT NAME HERE: e.g., BackendDeveloper, SystemArchitect, QualityAgent]

✅ Agent name assigned: [ ]  (QA check when completed)
```

### **Step 3: Role Definition**
```
🔹 PRIMARY ROLE (select one):
[ ] BackgroundAgent - General development tasks
[ ] BackendAgent - Server-side development focus  
[ ] ArchitectAgent - System design and architecture
[ ] QualityAgent - Testing and validation focus
[ ] SaveRestartAgent - Session management and recovery
[ ] Other: [SPECIFY: ________________]

✅ Role selected: [ ]  (QA check when completed)
```

### **Step 4: Purpose Statement**
```
🔹 AGENT PURPOSE (what will this agent do?):
[DESCRIBE PURPOSE: e.g., Backend API development and documentation]

✅ Purpose defined: [ ]  (QA check when completed)
```

---

## **🔄 QA COMPLETION CHECKLIST**

After providing all information above:

### **File Management Actions:**
- [ ] **1. Rename File:** Change `pending-unknown-{{TIMESTAMP}}.md` to `[REQUESTID].md`
- [ ] **2. Update Header:** Change title to "Agent Identity Record"  
- [ ] **3. Complete Template:** Fill remaining identity record sections
- [ ] **4. Validation:** Confirm all checkboxes above are marked ✅

### **AgentManager Integration:**
- [ ] **5. Registry Update:** File will be automatically detected by AgentManager
- [ ] **6. Status Change:** Agent status will update from pending to active
- [ ] **7. Notification:** Agent will be notified on next identity check

---

## **📋 AGENT CONTEXT (For QA Reference)**
- **Session Directory:** Working on {{BRANCH}}
- **Expected Work:** {{TO_BE_DETERMINED}}
- **Session Duration:** {{TO_BE_DETERMINED}}
- **Branch Type:** {{TO_BE_DETERMINED}}

---

## **🎯 AFTER QA COMPLETION**

**File will become standard identity record:**
```markdown
# Agent Identity Record

## RequestID: [PROVIDED_REQUESTID]

### Identity
- **Current Name:** [PROVIDED_NAME]
- **Role:** [SELECTED_ROLE] 
- **Purpose:** [PROVIDED_PURPOSE]

### Current Status
- **Status:** ✅ Active
- **Created:** {{TIMESTAMP}}
- **Assigned:** [QA_COMPLETION_TIMESTAMP]
- **Branch:** {{BRANCH}}

### Core Responsibilities
[ROLE-SPECIFIC RESPONSIBILITIES]

### AgentManager Integration
- **Registry File:** bc-[requestid].md
- **Detection:** Automatic via AgentManager registry scan
- **Status Tracking:** Active agent lifecycle monitoring

**"Agent identity complete - ready for work!"** 🚀✨
```

---

**🔄 PROCESS FLOW POST-COMPLETION:**
1. **Agent runs identity script** → Finds complete identity record
2. **AgentManager detects** → New active agent in registry  
3. **Agent begins work** → Full identity and role clarity
4. **Systematic tracking** → CMM3-compliant identity management

---

**"Every agent deserves systematic identity with clear input fields"** 🆔✅