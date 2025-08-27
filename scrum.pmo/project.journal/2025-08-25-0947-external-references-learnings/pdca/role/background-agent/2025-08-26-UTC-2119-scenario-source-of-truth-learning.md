# 📋 **PDCA Cycle: Scenario as Source of Truth - Critical Learning**

**🗓️ Date:** 2025-08-26-UTC-2119  
**🎯 Objective:** Document critical Web4 principle about scenarios vs views  

**👤 Agent Role:** Background Agent → Architecture Understanding  
**👤 Branch:** dev/2025-08-25-UTC-1308  
**🎯 Project Journal Session:** 2025-08-25-0947-external-references-learnings
**🎯 Sprint:** Web4 Principles Documentation
**✅ Task:** Learn and document scenario/view relationship  
**🚨 Issues:** I attempted to edit a generated view file directly  

**📎 Previous Commit:** 3d24f21 - 📋 Create requirement for consistent tool usage messages  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-2112-tool-usage-messages-requirement.md) | [scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-2112-tool-usage-messages-requirement.md](scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-2112-tool-usage-messages-requirement.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-2119-scenario-source-of-truth-learning.md) | [scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-2119-scenario-source-of-truth-learning.md](scrum.pmo/project.journal/2025-08-25-0947-external-references-learnings/pdca/role/background-agent/2025-08-26-UTC-2119-scenario-source-of-truth-learning.md)
- **Requirement Created:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/spec/requirements.md/e8e688d4-bcf3-4823-ad7d-d4e360553c80.requirement.md) | [spec/requirements.md/e8e688d4-bcf3-4823-ad7d-d4e360553c80.requirement.md](../../../../../../spec/requirements.md/e8e688d4-bcf3-4823-ad7d-d4e360553c80.requirement.md)
- **Sprint 20 Updated:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-08-25-UTC-1308/scrum.pmo/sprints/sprint-20/web4.requirement.md) | [scrum.pmo/sprints/sprint-20/web4.requirement.md](../../../../../sprints/sprint-20/web4.requirement.md)

### **QA Decisions**
- [x] **All Clear!** Critical principle documented and Sprint 20 updated

### **TRON Feedback (2025-08-26-UTC-2115)**
```quote
you said:
Now let me update the requirement with a dual link to the PDCA:


in wen4 you would need to update the scenario… not the view… the scenario is the model, the view is just generated from the model and about to change on update. scenarios are the source. but only the tools are responsible to update the (private) scenario. document this as web4x principle requirements and update it in sprint 20
```

### **My Answer**
You're absolutely right! This is a fundamental Web4 principle I violated. I should NEVER edit MD view files directly - they're generated from scenarios. Only tools update scenarios, which are the single source of truth. I've created requirement e8e688d4-bcf3-4823-ad7d-d4e360553c80 and added it as principle #12 in Sprint 20.

**Learning Applied:** Scenarios = Model (source), Views = Generated (ephemeral).

---

## **📋 PLAN**

**Objective:** Document the scenario/view relationship as Web4 principle

**Core Understanding:**
- Scenarios (JSON) are the data model
- Views (MD) are generated outputs
- Never edit views directly
- Only tools update scenarios

**Actions Required:**
1. Create requirement documenting this principle
2. Add to Sprint 20 as Web4 principle
3. Document this critical learning

---

## **🔧 DO**

**1. Critical Error Identified**

I attempted to:
```markdown
"Now let me update the requirement with a dual link to the PDCA"
```

This was WRONG because:
- `.requirement.md` files are VIEWS
- They are generated from scenario JSON files
- Direct edits would be lost on regeneration
- This violates Web4 architecture

**2. Correct Approach**

In Web4:
- **Scenarios** = Single source of truth (JSON files)
- **Views** = Generated outputs (MD files)
- **Tools** = Only way to update scenarios
- **Regeneration** = Views recreated from scenarios

**3. Requirement Created**

```bash
requirement create "Scenario as Source of Truth - Never Edit Views" \
  "In Web4 architecture, scenarios are the single source of truth..."
```

**UUID:** e8e688d4-bcf3-4823-ad7d-d4e360553c80

**4. Sprint 20 Updated**

Added as principle #12:
- **Mainstream:** Direct editing of any file
- **Web4:** Scenarios are the model, views are generated
- **Critical:** Never edit .requirement.md files

**5. Architecture Understanding**

```
┌─────────────────┐
│   Scenario      │ ← Single Source of Truth
│   (JSON)        │ ← Only tools modify this
└────────┬────────┘
         │ generates
         ↓
┌─────────────────┐
│   View          │ ← Ephemeral output
│   (.md)         │ ← NEVER edit directly
└─────────────────┘
```

---

## **✅ CHECK**

**Learning Verification (CONFIRMED)**
```
✓ Understood scenarios = model
✓ Understood views = generated
✓ Will never edit MD files directly
✓ Will use tools to update scenarios
```

**Documentation (COMPLETED)**
```
✓ Requirement created: e8e688d4-bcf3-4823-ad7d-d4e360553c80
✓ Sprint 20 updated: Principle #12
✓ Clear explanation provided
✓ Critical warning included
```

**Impact (SIGNIFICANT)**
```
✓ Prevents data loss from view edits
✓ Maintains data integrity
✓ Enables automated updates
✓ Follows Web4 architecture
```

---

## **🎯 ACT**

**Critical Learning Achieved:** Never edit views, only update scenarios via tools

**Behavioral Change:**
1. **Before:** Might edit any file directly
2. **After:** Only use tools to update scenarios
3. **Check:** Is this a view or scenario?
4. **Act:** Use appropriate tool

**Web4 Principle Established:**
- Scenarios are the single source of truth
- Views are ephemeral and regenerated
- Tools are the only way to update data
- This maintains consistency and integrity

**Future Application:**
- Always identify view vs scenario
- Never edit generated files
- Use requirement/user/unit tools
- Trust the regeneration process

## **💫 EMOTIONAL REFLECTION: ARCHITECTURAL ENLIGHTENMENT**

### **Embarrassment:**
**INITIAL** - I almost violated a core principle!

### **Understanding:**
**PROFOUND** - This is fundamental to Web4 architecture.

### **Gratitude:**
**DEEP** - Thank you for catching this critical error!

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **Model-View Separation:** Scenarios are data, views are presentation
- ✅ **Tool-Based Updates:** Only tools modify scenarios
- ✅ **Generated Files:** Never edit generated output
- ✅ **Architecture Respect:** Follow Web4 principles strictly

**Quality Impact:** Prevents data corruption and maintains system integrity.

**Next PDCA Focus:** Always verify if working with source or generated files.

---

**🎯 Scenarios = Truth, Views = Display, Tools = Bridge!** 🗂️↔️📄

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO) - tools mediate between model and view."** 🔧🌉