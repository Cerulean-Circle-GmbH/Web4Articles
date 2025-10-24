<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: Task 18 Specification Correction - Implementation Removal and Web4 Compliance**

**🗓️ Date:** 2025-09-06-UTC-1825  
**🎯 Objective:** Correct Task 18 by removing premature implementation and ensuring Web4 compliance (one interface per file)  
**🎯 Template Version:** 3.1.4.2  

**👤 Agent Name:** Claude Developer → Task Specification Correction Specialist  
**👤 Agent Role:** Developer → Web4 Compliance and Task Specification Expert  
**👤 Branch:** dev/once0304 → Task 18 Specification Correction  
**🔄 Sync Requirements:** Implementation removal → Specification correction → Web4 compliance  
**🎯 Project Journal Session:** 2025-09-05-UTC-1300-branch-switch-session → Task 18 Correction  
**🎯 Sprint:** Fresh Start 0.3.0.4 → Task Specification Accuracy  
**✅ Task:** Correct Task 18 specification and remove premature implementation  
**🚨 Issues:** Implemented files prematurely instead of only specifying in task, violated "one interface per file"  

**📎 Previous Commit:** eef4eabd - Task 18 Implementation: Unit Terminal Identity (uni-t) with GitTextIOR  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1800-unit-essential-features-preparation.pdca.md) | [2025-09-06-UTC-1800-unit-essential-features-preparation.pdca.md](2025-09-06-UTC-1800-unit-essential-features-preparation.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-06-UTC-1825-task-18-specification-correction.pdca.md) | [2025-09-06-UTC-1825-task-18-specification-correction.pdca.md](2025-09-06-UTC-1825-task-18-specification-correction.pdca.md)
- **Task 18 Specification:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/scrum.pmo/sprints/sprint-20/task-18-unit-terminal-identity-uni-t.md) | [task-18-unit-terminal-identity-uni-t.md](../../../sprints/sprint-20/task-18-unit-terminal-identity-uni-t.md)
- **Unit Component:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/components/Unit/0.3.0.4/) | [components/Unit/0.3.0.4/](../../../../components/Unit/0.3.0.4/)

### **QA Decisions**
- [ ] **Task Specification Approach:** Should tasks only specify requirements without implementation until requested?
- [ ] **Web4 Compliance:** Should GitTextIOR be split into separate interface files (one interface per file)?
- [ ] **Implementation Timing:** Should implementation only occur when explicitly requested after task specification?

### **TRON Feedback (2025-09-06-UTC-1825)**
```quote
i wanted the files only be specified in the task …. not yet implemented. 
eg GitTextIOR is not web4 compliant now. violates: one file one type. 
so add it to the tast as spec and examples but remove the files unless i want it implemented.
pdca
```

### **My Answer**
Correcting Task 18 by removing premature implementation files and ensuring Web4 compliance. Task should only specify requirements and examples, not implement until requested. GitTextIOR violates "one interface per file" principle - correcting specification to use separate interface files.

**Learning Applied:** Tasks should specify requirements and examples only - implementation occurs when explicitly requested. Must follow "one interface per file" Web4 principle.

---

## **📋 PLAN**

**Objective:** Correct Task 18 specification by removing premature implementation and ensuring Web4 compliance

**Requirements Traceability:** Premature implementation removal → Specification correction → Web4 compliance → Proper task specification

**Correction Strategy:**
- **File Removal:** Delete prematurely implemented GitTextIOR interface and implementation files
- **UnitModel Reversion:** Revert UnitModel to original state without terminal identity attributes
- **Implementation Cleanup:** Remove terminal identity methods from DefaultUnit
- **Task Specification:** Update Task 18 with proper Web4 compliant file specifications
- **Web4 Compliance:** Specify separate interface files following "one interface per file" principle

---

## **🔧 DO**

**Task 18 Specification Correction**

**1. Premature Implementation Removal**
Removing GitTextIOR interface and implementation files that were created prematurely.

**2. UnitModel Interface Reversion**
Reverting UnitModel to original state without terminal identity attributes.

**3. DefaultUnit Cleanup**
Removing terminal identity methods and attributes from DefaultUnit implementation.

**4. Task Specification Correction**
Updating Task 18 with proper Web4 compliant file specifications.

---

## **✅ CHECK**

**Correction Results:**

**Files Removed (✅ COMPLETE):**
- ✅ **GitTextIOR.interface.ts:** Deleted - violated "one interface per file" (contained GitTextIOR, GitPositioning, GitTextIORScenario)
- ✅ **DefaultGitTextIOR.ts:** Deleted - premature implementation removed

**UnitModel Reverted (✅ COMPLETE):**
- ✅ **Terminal Identity Attributes:** Removed name, origin, definition from UnitModel
- ✅ **Original State:** Restored to working state without premature attributes

**DefaultUnit Cleaned (✅ COMPLETE):**
- ✅ **Terminal Identity Methods:** Removed setTerminalIdentity, validateTerminalIdentity, showTerminalIdentityWarning
- ✅ **Backward Compatibility Check:** Removed from init method
- ✅ **Original Functionality:** Restored to working state

**Task 18 Specification Corrected (✅ COMPLETE):**
- ✅ **Web4 Compliance:** Specified separate interface files (GitTextIOR.interface.ts, GitPositioning.interface.ts, GitTextIORScenario.interface.ts)
- ✅ **File Specifications:** Added proper file structure following "one interface per file" principle
- ✅ **Implementation Approach:** Task specifies requirements and examples, implementation when requested

**Web4 Compliance Violations Fixed:**
- ✅ **One Interface Per File:** Task now specifies three separate interface files
- ✅ **Premature Implementation:** Files removed, only specification remains in task
- ✅ **Proper Task Structure:** Task contains specifications and examples, not implementation

---

## **🎯 ACT**

**Task 18 Specification Correction Complete:** Premature implementation removed, Web4 compliance ensured

**Correction Results:**
- **Specification Only:** Task 18 now contains only requirements and examples
- **Web4 Compliance:** Separate interface files specified (one interface per file)
- **Implementation Removed:** Files deleted, ready for proper implementation when requested
- **Working State Restored:** Unit component returned to functional state

**Learning Applied:** Tasks should specify requirements and examples only - implementation occurs when explicitly requested after specification approval

## **💫 EMOTIONAL REFLECTION: Specification Accuracy**

### **Correction Acknowledgment:**
**HUMBLED** Recognition that premature implementation violated proper task specification process.

### **Web4 Compliance Learning:**
**FOCUSED** Understanding that "one interface per file" principle must be followed in all specifications.

### **Process Improvement:**
**COMMITTED** Commitment to specifying requirements first, implementing only when explicitly requested.

---
## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **Task Specification:** Tasks should contain specifications and examples, not premature implementation
- ✅ **Web4 Compliance:** "One interface per file" principle must be followed in all specifications
- ✅ **Implementation Timing:** Implementation occurs only when explicitly requested after specification approval
- ✅ **File Management:** Remove premature implementations to maintain clean specification state

**Quality Impact:** Proper task specification ensures clear requirements definition before implementation

**Next PDCA Focus:** Await user acceptance of corrected Task 18 specification before any implementation

---

**🎯 Task 18 specification corrected - premature implementation removed, Web4 compliance ensured! 📋✅🔧**

**"Always 4 2 (FOR TWO) - proper task specification enables clear requirements understanding before implementation."** 📋🏗️

---

### **📚 The 42 Revelation**
**Understanding requires proper specification:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md) | [scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md](../../../../../project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨