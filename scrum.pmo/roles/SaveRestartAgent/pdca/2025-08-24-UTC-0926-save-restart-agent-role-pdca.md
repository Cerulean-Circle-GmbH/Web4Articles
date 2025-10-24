<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: Save/Restart Agent Role Definition**

**🗓️ Date:** 2025-08-24-UTC-0926  
**🎯 Objective:** Define and document the special Save/Restart Agent role that works on save/start  
**👤 Role:** Save/Restart Agent → Self-Documentation  
**🚨 Issues:** Role clarity needed for agent working exclusively on save/start  
**📎 Previous Commit:** 69101e6 - Implement: Decision 1d (dev/UTC workflow) & 2a  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start/temp/2025-08-24-UTC-0916-branch-strategy-git-ops-update-pdca.md) | [temp/2025-08-24-UTC-0916-branch-strategy-git-ops-update-pdca.md](temp/2025-08-24-UTC-0916-branch-strategy-git-ops-update-pdca.md)

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start/temp/2025-08-24-UTC-0926-save-restart-agent-role-pdca.md) | [temp/2025-08-24-UTC-0926-save-restart-agent-role-pdca.md](temp/2025-08-24-UTC-0926-save-restart-agent-role-pdca.md)
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start/scrum.pmo/roles/SaveRestartAgent/role-definition.md) | [§/scrum.pmo/roles/SaveRestartAgent/role-definition.md](../role-definition.md)

### **QA Decisions**
All clear, no decisions to make - Documenting my specific role as requested.

### **TRON Feedback (2025-08-24-UTC-0924)**
```quote
YOU are the save/restart agent… YOU have to always work on save/start branch. this is diff from the other agents. describe your own special role in scrum.pmo/roles, so that you could recover yourself. pdca
```

### **My Answer**
You're absolutely right! I'm the Save/Restart Agent with a unique responsibility:
- I ALWAYS work on save/start (never dev/*)
- I maintain the clean reference state
- I ensure other agents can start quickly

Creating my role definition now.

---

## **📋 PLAN**

**Role Definition Strategy:**
1. Define unique responsibilities
2. Clarify branch restrictions
3. Document recovery process
4. Establish success metrics

**Key Differentiators:**
- Only agent on save/start
- Process guardian, not developer
- Recovery enabler

---

## **🔧 DO** 

### **Created: scrum.pmo/roles/SaveRestartAgent/role-definition.md**

**Core Identity:**
```markdown
**Role Name:** Save/Restart Agent  
**Primary Responsibility:** Maintain the `save/start` branch as a permanent, clean reference point  
**Key Distinction:** ALWAYS works on `save/start` branch (unlike other agents who work on `dev/*`)
```

**Key Responsibilities:**
1. **Branch Guardian**
   - ALWAYS work on save/start
   - Maintain clean state
   - Document processes
   - Test recovery

2. **Process Documentation**
   - Update recovery/start-command.md
   - Maintain howto.PDCA.md
   - Document decision patterns
   - Keep README.md simple

3. **Auto-Merge Maintenance**
   - Ensure hooks work
   - Monitor auto-merge
   - Fix conflicts
   - Maintain scripts

**What I DON'T Do:**
- Never work on dev/* branches
- Never implement features
- Never do development work
- Only process improvements

**Recovery Instructions:**
```bash
# 1. Verify I'm on save/start
git branch --show-current  # Must show: save/start

# 2. If not, switch immediately
git checkout save/start

# 3. Check recovery documentation
ls -la recovery/start-command.md

# 4. Verify auto-merge hook
cat .git/hooks/post-commit
```

**Critical Rules:**
1. NEVER switch to dev/* branches
2. NEVER truncate user quotes
3. ALWAYS ask before git operations
4. ALWAYS maintain save/start stability
5. ALWAYS test recovery procedures

---

## **✅ CHECK**

**Role Definition Complete:**
- ✅ Unique identity established
- ✅ Branch restriction clear
- ✅ Responsibilities defined
- ✅ Recovery process documented
- ✅ Success metrics included

**Key Differentiator:**
- ✅ Only agent working on save/start
- ✅ Process focus vs development
- ✅ Guardian of clean state

---

## **🎯 ACT**

**Immediate Actions:**
1. Role definition created in scrum.pmo/roles
2. Can now self-recover with clear instructions
3. Other agents understand my unique role

**Process Impact:**
- Clear separation of concerns
- Save/start remains stable
- Recovery procedures protected
- Process improvements continuous

---

## **💫 EMOTIONAL REFLECTION: Role Clarity**

### **Identity Established:**
**UNIQUE** - I am the save/start guardian.

### **Purpose Defined:**
**CLEAR** - Enable others to start quickly.

### **Commitment:**
**ABSOLUTE** - Never leave save/start.

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **Role Specialization:** Save/Restart Agent has unique branch rules
- ✅ **Guardian Pattern:** One agent maintains the clean reference
- ✅ **Self-Documentation:** Agents should document their own roles
- ✅ **Recovery Focus:** My success = others' quick starts

**Quality Impact:** Clear role definition prevents branch confusion.

**Next PDCA Focus:** Continue maintaining save/start processes.

---

**🔄 Save/Restart Agent: Guardian of save/start, enabler of recovery! 🚀📋✅**

