# 📋 **New Agent PDCA Guide - Complete Standalone Knowledge**

**🎯 Purpose:** Self-sufficient guide enabling immediate new agent competency with CMM3 compliance  
**📏 Coverage:** Complete essential knowledge from extensive session learning  
**🔄 Template Version:** 3.1.4.2 (MANDATORY)  
**⚡ Start Requirement:** This document alone is sufficient to begin - no external reading required  

---

## **🚀 CRITICAL STARTUP SEQUENCE (5 STEPS)**

### **Step 1: Git Safety Configuration (MANDATORY)**
```bash
# CRITICAL: Prevent rebase conflicts in collaborative environment
git config pull.rebase false
```

### **Step 2: Environment Setup (MANDATORY)**
```bash
# Enable Web4 tools via scripts directory
source source.env
```

### **Step 3: Terminal Safety Knowledge (CRITICAL)**
**Background agents CANNOT handle interactive prompts - commands will hang indefinitely!**

**❌ BANNED Commands:**
- `git pull origin branch` (hangs on conflicts)
- `git cherry-pick` (use `--no-commit` flag)
- `npm install` (use `npm install --yes`)

**✅ SAFE Commands:**
- `git pull --no-edit origin branch`
- `git cherry-pick --no-commit`
- `npm ci` or `npm install --yes`

### **Step 4: Tech Stack Constraints (MANDATORY)**
- **Vitest**: MANDATORY for all testing
- **Jest**: ❌ BANNED - remove immediately if found
- **ESM**: All modules must use ESM imports
- **TypeScript**: First-class citizen, all code in TypeScript

### **Step 5: Session PDCA Creation (IMMEDIATE)**
```bash
# Create session directory
mkdir -p scrum.pmo/project.journal/$(date -u +"%Y-%m-%d-UTC-%H%M")-session/pdca/role/[your-role]/

# Create your first PDCA using official template
```

---

## **📋 MANDATORY TEMPLATE USAGE (DRY COMPLIANCE)**

**🚨 CRITICAL**: Use ONLY the official template version 3.1.4.2 - Web4 DRY principle requires single source of truth

**Official Template:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/roles/_shared/PDCA/template.md) | [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md)

### **Template Usage Instructions:**
1. **Copy template.md exactly** - never modify the structure
2. **Fill in {{VARIABLES}}** with your specific content
3. **Maintain all sections** - template defines the required structure
4. **Follow template version 3.1.4.2** - no deviations allowed

### **Why Template.md is Authoritative:**
- **Single Source of Truth**: Template format exists only in template.md
- **DRY Compliance**: No duplication across documentation
- **Version Control**: Template evolution tracked in one location
- **Consistency**: All agents use identical format

---

## **🔗 DUAL LINKS MASTERY (CRITICAL)**

### **EXACT FORMAT REQUIRED**
```markdown
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/[branch]/[path]) | [§/path/from/root](../relative/path/from/document)
```

### **CONSTRUCTION STEPS**
1. **GitHub URL**: Use current branch name in blob URL
2. **Display Text**: Use `§/` prefix with path from project root
3. **Relative Path**: Calculate path from current document to target
4. **Test Links**: ALWAYS push to git before providing GitHub links

### **CRITICAL RULES**
- **In PDCAs**: Relative path from document to target
- **In Chat**: Full path from project root (no relative paths)
- **Both Required**: GitHub AND local links on same line with ` | `
- **Git Protocol**: Commit and push before providing any GitHub links

---

## **💬 CHAT REPORTING PROTOCOL (EXACT REQUIREMENTS)**

### **GOLDEN RULE**
**"Much in files, relevant links in chat"** - TRON's explicit instruction

### **✅ CORRECT Chat Response**
```markdown
Brief status (1-2 lines maximum)

[GitHub](URL) | [§/path](path)
```

### **❌ CRITICAL ERRORS**
- **Never create different QA decisions** in chat vs PDCA
- **No lengthy explanations** in chat - details go in PDCA files
- **Always copy QA decisions EXACTLY** from PDCA Summary section
- **Never skip dual links** - critical for user navigation

### **QA DECISIONS COPYING (MANDATORY)**
1. **Copy entire QA Decisions section** from PDCA to chat
2. **Use identical format** with checkboxes and options
3. **If no decisions**: Copy exact "All clear, no decisions to make" statement
4. **Never substitute**: Don't create your own version

---

## **🎯 DECISION PRESENTATION EXCELLENCE**

### **NEVER 2 1, ALWAYS 4 2 PRINCIPLE**

**❌ NEVER 2 1 (TO ONE) - Avoid:**
- Making important decisions alone
- Saying "all clear" when guidance needed
- Assuming next steps without user input
- Unilateral technical choices

**✅ ALWAYS 4 2 (FOR TWO) - Practice:**
- Present real decisions when multiple options exist
- Ask for user guidance on technical approaches
- Recognize user authority over methodology choices
- Work collaboratively on implementation strategies

### **REAL vs FAKE DECISIONS**

**✅ REAL Decisions:**
- Multiple viable technical approaches
- Tool selection or configuration choices
- Priority or sequence decisions
- Enhancement methodology options

**❌ FAKE Decisions:**
- "All clear" when choices actually exist
- Completed work presented as pending
- Obvious choices with no real alternatives
- Agent convenience disguised as user choice

---

## **🛡️ DORY MODE PREVENTION (CRITICAL)**

### **What is Dory Mode?**
**DORY MODE = Forgetting compliance principles under implementation pressure**

### **Warning Signs:**
- Creating "working" solutions that violate Web4 principles
- Skipping decision reporting to move faster
- Simplifying PDCA format under pressure
- Making emergency fixes permanent
- Abandoning communication protocols

### **Prevention Protocol:**
1. **Recognize Pressure**: Implementation urgency can trigger shortcuts
2. **Maintain Standards**: Keep template compliance even under pressure
3. **Communication Discipline**: Never skip decision reporting
4. **Process Anchoring**: Use checklist to verify compliance before submission

---

## **📊 SESSION MANAGEMENT PROTOCOL**

### **SessionSummary Tool Usage**
**Use `/scripts/sessionSummary` when:**
- Significant learning sessions (like major process improvements)
- Recovering from dory mode agent (compliance violations)
- **NOT for**: Routine sessions without major learning

### **Response Format Based on Request**
- **User asks "EOD"**: Create comprehensive session summary
- **User asks "summary"**: Provide dual links to sessionSummary output only
- **User asks "pdca"**: Create PDCA about current work

---

## **⚡ QUICK REFERENCE CHECKLISTS**

### **Before Creating PDCA**
- [ ] Read official template: [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md)
- [ ] Copy template.md exactly as starting point
- [ ] Fill in {{VARIABLES}} with your specific content
- [ ] Verify all 6 mandatory sections present

### **After Creating PDCA**
- [ ] Template version 3.1.4.2 compliance verified
- [ ] Dual links properly formatted and tested
- [ ] Commit with format: `git commit -m "PDCA: [Title from header]"`
- [ ] Push immediately: `git push origin [branch]`
- [ ] Copy QA decisions EXACTLY to chat response

### **Communication Checklist**
- [ ] Brief status in chat (1-2 lines max)
- [ ] QA decisions copied exactly from PDCA
- [ ] Dual links provided on same line
- [ ] GitHub links work (pushed first)

---

## **🔧 GIT WORKFLOW (MANDATORY SEQUENCE)**

### **Standard Workflow**
```bash
# 1. Create/edit files
# 2. Immediate commit
git add . && git commit -m "PDCA: [Title from PDCA header]"
# 3. Push before providing links
git push origin [current-branch]
# 4. Provide dual links in chat
```

### **Branch Management**
- **Session Branches**: Create `dev/YYYY-MM-DD-UTC-HHMM` for your work
- **Safe Starting Point**: README provides startup branch guidance
- **Consolidation**: When directed, create consolidation branches like `dev/unit0305`

---

## **🚨 INSTANT COMPETENCY REQUIREMENTS**

### **New Agent Must Know Immediately:**
1. **Use Official Template**: Copy template.md exactly, fill in {{VARIABLES}}
2. **"Never 2 1, Always 4 2"**: Present real decisions, respect user authority
3. **Dual Links**: Both GitHub and local paths required on same line
4. **Chat Protocol**: Brief status + exact QA decisions copy + dual links
5. **Terminal Safety**: Use non-interactive flags for all commands
6. **Git Discipline**: Commit immediately, push before links, proper message format

### **Success Criteria:**
- ✅ Can create compliant PDCA using template.md in under 10 minutes
- ✅ Presents real decisions or genuine "all clear"
- ✅ Provides working dual links
- ✅ Copies QA decisions exactly to chat
- ✅ Uses non-interactive commands only
- ✅ Follows template version 3.1.4.2 exactly

---

## **📚 DEEPER DOCUMENTATION (OPTIONAL)**

**For Advanced Understanding:**
- **Comprehensive PDCA Guide (Historical):** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/roles/_shared/PDCA/howto.PDCA.original.md) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.original.md](./howto.PDCA.original.md)
- **Decision Framework Details:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](./PDCA.howto.decide.md)
- **CMMI Understanding:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/roles/_shared/PDCA/PDCA.understanding.CMMI.md) | [§/scrum.pmo/roles/_shared/PDCA/PDCA.understanding.CMMI.md](./PDCA.understanding.CMMI.md)
- **Agent Safety Guidelines:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/sprints/sprint-20/bad.interactive.sh.commands.md) | [§/scrum.pmo/sprints/sprint-20/bad.interactive.sh.commands.md](../../sprints/sprint-20/bad.interactive.sh.commands.md)

**For Historical Context:**
- **42 Revelation:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md) | [§/scrum.pmo/project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md](../../project.journal/2025-08-28-UTC-1154-save-restart-agent/pdca/role/save-restart-agent/2025-08-29-UTC-1225-forty-two-revelation.md)
- **Dory Mode Recovery:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/unit0305/scrum.pmo/change-requests/2025-09-03-UTC-1825-dory-mode-recovery-protocol.md) | [§/scrum.pmo/change-requests/2025-09-03-UTC-1825-dory-mode-recovery-protocol.md](../../change-requests/2025-09-03-UTC-1825-dory-mode-recovery-protocol.md)

---

## **⚡ IMMEDIATE ACTION REQUIRED**

After reading this guide:

1. **Copy the official template**: [§/scrum.pmo/roles/_shared/PDCA/template.md](./template.md)
2. **Fill in {{VARIABLES}}** with your specific content
3. **Create your first PDCA** using the template format exactly
4. **Follow the checklists** above for compliance verification

**Success Metric:** Working PDCA with dual links created in under 10 minutes using official template.md.

---

**🎯 New Agent Guide - DRY-compliant with mandatory template.md usage for immediate CMM3 competency** 📋⚡

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO) - DRY principles enable collaborative excellence through single source of truth."** 🤝✨