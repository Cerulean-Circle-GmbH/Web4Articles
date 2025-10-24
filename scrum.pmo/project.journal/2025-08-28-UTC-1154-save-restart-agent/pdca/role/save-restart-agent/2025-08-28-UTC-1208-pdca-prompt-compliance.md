<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to SaveRestartAgent](../../../../roles/SaveRestartAgent/)

# 📋 **PDCA Cycle: PDCA Prompt Compliance Check - howto.PDCA.md Enhancement**

**🗓️ Date:** 2025-08-28-UTC-1208  
**🎯 Objective:** Add 'pdca' prompt handling to howto.PDCA.md for compliance checking  

**👤 Agent Role:** Save/Restart Agent → Process Documentation Enhancement  
**👤 Branch:** save/start.v1 → Permanent Clean Reference
**🎯 Project Journal Session:** 2025-08-28-UTC-1154-save-restart-agent → Recovery & Compliance Session
**🎯 Sprint:** Sprint-21 → Process Standardization
**✅ Task:** PDCA Documentation & Process Maintenance
**🚨 Issues:** Missing guidance for 'pdca' prompt compliance checks  
**📎 Previous Commit:** cf6053a - DevOps: Non-interactive script standards - requirement f8a3b4c2 @scripts/tool v1.2.2.0  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1207-non-interactive-scripts.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1207-non-interactive-scripts.md](2025-08-28-UTC-1207-non-interactive-scripts.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1208-pdca-prompt-compliance.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-28-UTC-1208-pdca-prompt-compliance.md](2025-08-28-UTC-1208-pdca-prompt-compliance.md)
- **Updated File:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start.v1/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../../../../../roles/_shared/PDCA/howto.PDCA.md)

### **QA Decisions**
- [x] Added 'PDCA' prompt section to howto
- [x] Defined compliance check workflow
- [x] Specified response format

### **TRON Feedback (2025-08-28-UTC-1208)**
```quote
add to the howto pdca, that if i prompt `pdca` i want that the agent reviews its previour pdca a for compliants. that it reads the howto, the reposting and the dual linking again and alos the cmm understanding, so that it afterwards fixes the wrong pdca report. if it was compliant it means it needs to refresch its memory after a looong task where it might have forfotten it and shall go on with it and return to cmm3 compliance.
```

### **My Answer**
Added comprehensive section "RESPONDING TO 'PDCA' PROMPT - COMPLIANCE REVIEW" to howto.PDCA.md. Defined workflow: review previous PDCA, re-read key documents (howto, reporting requirement, dual link format, CMMI understanding), take action based on compliance status (fix if non-compliant, refresh memory if compliant), and provide structured response format.

**Learning Applied:** The 'pdca' prompt serves as a quality gate and memory refresh mechanism to maintain CMM3 compliance throughout long sessions.

---

## **📋 PLAN**

### **Enhancement Strategy**
1. **Add new section** after Quality Gates
2. **Define clear workflow** for 'pdca' prompt
3. **Specify documents** to re-read
4. **Create response template**
5. **Explain purpose** and benefits

### **Key Requirements**
- Review previous PDCA for compliance
- Re-read all PDCA standards
- Fix non-compliant PDCAs
- Refresh memory for long tasks
- Return to CMM3 compliance

---

## **🔧 DO**

### **1. Section Added to howto.PDCA.md**
Location: After "Quality Gates & Validation" section

### **2. Workflow Defined**
1. Review Previous PDCA
   - Read most recent PDCA
   - Check against howto.PDCA.md
   - Identify violations

2. Re-read Key Documents
   - howto.PDCA.md
   - PDCA.reporting.requirement.md
   - PDCA.dual.link.format.requirement.md
   - PDCA.understanding.CMMI.md

3. Actions Based on Status
   - Non-compliant: Fix and document
   - Compliant: Refresh and continue

### **3. Response Template Created**
```markdown
## PDCA Compliance Check Result
**Previous PDCA:** [GitHub](URL) | [local/path](path)
**Compliance Status:** ✅ Compliant / ❌ Non-Compliant
### Issues Found (if any):
### Actions Taken:
### Next Steps:
```

### **4. Purpose Documented**
- Quality gate for long sessions
- Memory refresh mechanism
- Compliance enforcement
- Learning from mistakes
- CMM3 maturity maintenance

---

## **✅ CHECK**

### **Verification Results**

**Section Added Successfully**
- ✅ **Location correct** - After validation checklist
- ✅ **Content comprehensive** - All requirements covered
- ✅ **Format consistent** - Matches howto style
- ✅ **Links provided** - To all key documents
- ✅ **Template included** - Response format defined

**TRON Requirements Met**
- ✅ **Review previous PDCA** - Step 1 defined
- ✅ **Read key documents** - Listed with links
- ✅ **Fix non-compliant** - Action defined
- ✅ **Memory refresh** - Purpose stated
- ✅ **CMM3 compliance** - Explicitly mentioned

**Integration Clean**
- Fixed merge conflict marker
- Maintains document flow
- Clear section boundaries

---

## **🎯 ACT**

### **Usage Guidelines**
1. **When user types 'pdca'**
   - Immediately start compliance check
   - Follow the defined workflow
   - Use the response template

2. **Document Reading Order**
   - howto.PDCA.md first
   - Reporting requirement
   - Dual link format
   - CMMI understanding

3. **Action Priority**
   - Fix non-compliance immediately
   - Create correction PDCA
   - Update learnings
   - Continue with standards

### **Benefits**
- Maintains quality in long sessions
- Prevents standard drift
- Reinforces learning
- Ensures CMM3 compliance
- Self-correction mechanism

### **Next Steps**
1. Test with actual 'pdca' prompt
2. Monitor agent compliance
3. Update if needed

---

## **💫 EMOTIONAL REFLECTION: Self-Correction Mechanism Implemented**

### **Pride:**
**DEEP** - Successfully captured TRON's vision for the 'pdca' prompt as a self-correction mechanism. The addition fits naturally into howto.PDCA.md.

### **Insight:**
**VALUABLE** - This feature transforms a simple prompt into a powerful quality control tool, especially valuable during long development sessions where standards might drift.

### **Commitment:**
**PERSONAL** - Will use this mechanism myself to ensure continued PDCA excellence and CMM3 compliance.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Improvement:** The 'pdca' prompt is now a formal compliance check mechanism, documented in our primary PDCA guidance. This creates a feedback loop for continuous quality improvement.

**Integration:** Seamlessly added to existing validation section, maintaining document coherence while adding significant value.

**Impact:** All agents now have a standard way to self-check and correct PDCA compliance, reducing quality drift over time.

---

**🎯 Added 'pdca' prompt compliance check to howto.PDCA.md - self-correction for quality! 📋🔄**