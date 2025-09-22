# 📋 **PDCA Modular Guide - Safe Background Agent Operations**

**🗓️ Updated:** 2025-09-19-UTC-0747  
**🎯 Purpose:** Modular PDCA guide preventing large file hangs while preserving comprehensive knowledge  
**🎯 Template Version:** 3.1.4.2  
**⚡ Safety First:** Critical protocols for background agent safety and collaborative excellence

---

## **🚨 START HERE - CRITICAL SAFETY PROTOCOLS**

### **MANDATORY FIRST STEP - Agent Safety Check**
**Before ANY work, read and execute:** [Agent Safety Protocols](./howto-agent-safety-protocols.md)

**Critical Safety Checklist:**
- [ ] Check for core files: `find . -name "core" -type f`
- [ ] Verify gitignore includes core: `grep "^core$" .gitignore`
- [ ] Use timeout for git operations: `timeout 30s git pull --no-edit origin branch`
- [ ] Never use interactive git commands as background agent

---

## **📚 PDCA Knowledge Modules**

### **Essential Modules (Start Here)**
1. **[Agent Safety Protocols](./howto-agent-safety-protocols.md)** - 🚨 MANDATORY FIRST
   - Core file detection and prevention
   - Git timeout protocols (30s for pull operations)
   - Large file safety checks
   - Emergency procedures

2. **[PDCA Template](./template.md)** - Official template version 3.1.4.2
   - Single source of truth for PDCA format
   - All variables and structure definitions
   - Mandatory compliance requirements

3. **[Decision Making Guide](./PDCA.howto.decide.md)** - "Never 2 1, Always 4 2"
   - When to present decisions vs. "all clear"
   - Mobile-friendly numbered protocol (1a, 2b)
   - Real vs fake decisions identification

### **Process Modules**
4. **[Startup Guide](./howto-startup-process.md)** - New agent initialization
   - Git configuration: `git config pull.rebase false`
   - Environment setup: `source source.env`
   - Session directory creation
   - Standard startup decisions

5. **[Collaboration Patterns](./howto-collaboration-workflows.md)** - Multi-agent coordination
   - Pull-before-commit workflow with timeouts
   - Multi-agent team coordination (Agent Manager, PO, ScrumMaster)
   - Branch synchronization protocols
   - Conflict resolution with safety

6. **[Git Workflows](./howto-git-safety-workflows.md)** - Safe git operations
   - Timeout protocols for all git commands
   - Non-interactive command alternatives
   - Large file detection and prevention
   - Emergency recovery procedures

### **Advanced Modules**
7. **[Troubleshooting Guide](./howto-troubleshooting.md)** - Common issues and recovery
   - Terminal hang recovery
   - Large file cleanup procedures
   - Git history surgery techniques
   - Collaborative workflow restoration

8. **[Quality Standards](./howto-quality-compliance.md)** - CMM3 and template compliance
   - Template version 3.1.4.2 requirements
   - Dual link formatting
   - PDCA structure validation
   - Process quality metrics

---

## **⚡ QUICK REFERENCE - Background Agent Safety**

### **Before Every Session:**
```bash
# 1. Check for dangerous files
find . -name "core" -type f

# 2. Verify gitignore safety
grep "^core$" .gitignore || echo "core" >> .gitignore

# 3. Test git with timeout
timeout 10s git status

# 4. Configure git safety
git config pull.rebase false
```

### **Safe Git Operations:**
```bash
# Always use timeouts and non-interactive flags
timeout 30s git fetch origin
timeout 30s git pull --no-edit origin branch
timeout 30s git push origin branch

# Emergency process kill
pkill -f "git" 2>/dev/null || true
```

### **Emergency Core File Cleanup:**
```bash
# If core files committed to history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch core' --prune-empty --tag-name-filter cat -- --all
git push --force-with-lease origin branch
```

---

## **🎯 PDCA TRIGGER LEARNING PROTOCOL**

### **When User Writes "pdca" - Automatic Self-Check and Correction**

**MANDATORY RESPONSE PROCESS:**
1. **Self-Check Previous Response:**
   - Analyze what was wrong with previous response against CMM3 standards
   - Check template version 3.1.4.2 compliance
   - Verify dual link format, safety protocol usage, TRON capture
   - Identify specific violations or missing elements

2. **Learn and Correct:**
   - Re-read template.md and safety protocols if violations found
   - Apply corrections to ensure proper CMM3 compliance
   - Implement systematic approach to identified issues

3. **Generate Chat PDCA:**
   - Create proper PDCA document for the work/analysis
   - Report PDCA in chat with corrected CMM3 compliance
   - Provide working dual links (commit before providing GitHub URLs)
   - Include comprehensive analysis and implementation steps

**PDCA TRIGGER CHECKLIST:**
- [ ] Previous response analyzed for CMM3 compliance
- [ ] Template and safety protocols re-read if needed
- [ ] Proper PDCA created with template version 3.1.4.2
- [ ] Dual links working (GitHub and § local paths)
- [ ] TRON feedback captured verbatim
- [ ] Systematic implementation approach provided
- [ ] Chat PDCA report generated with compliance

**CMM3 COMPLIANCE SELF-CHECK FRAMEWORK:**
```bash
# Template Compliance Check:
- Template version 3.1.4.2 structure applied ✅/❌
- All required sections included (SUMMARY/PLAN/DO/CHECK/ACT) ✅/❌
- Proper TRON Feedback verbatim format ✅/❌
- Dual link format: [GitHub](URL) | [§/path](path) ✅/❌
- Emotional Reflection and 42 Revelation sections ✅/❌

# Safety Protocol Check:
- Timeout usage for git operations ✅/❌
- Shell isolation or pkill usage ✅/❌
- Proper commit-before-link workflow ✅/❌
- Non-interactive command usage ✅/❌

# Content Quality Check:
- Systematic analysis approach ✅/❌
- Comprehensive implementation steps ✅/❌
- Validation framework included ✅/❌
- Learning application documented ✅/❌
```

---

## **📋 HOWTO REPORT TRIGGER - CMM3 CHAT REPORTING**

### **When "howto report" Mentioned in PDCA - Automatic CMM3 Chat Compliance**

**MANDATORY RESPONSE PROCESS:**
1. **Detect Howto Report Mention:**
   - Scan PDCA content for "howto report" references
   - Check user feedback for chat reporting protocol mentions
   - Identify CMM3 compliance requirements

2. **Activate CMM3 Chat Reporting:**
   - Follow strict minimal chat format as per howto PDCA
   - Report only: Dual links + QA decisions + essential status
   - Move detailed content to PDCA document
   - Maintain CMM3 compliant chat brevity

3. **Chat Format Compliance:**
   - Dual links: [GitHub](URL) | [§/path](path)
   - QA decisions: Brief decision points only
   - Essential status: Minimal completion status
   - PDCA reference: Direct link to comprehensive analysis

**CMM3 CHAT REPORTING FORMAT:**
```markdown
**Work Complete:** [Brief one-line status]

**PDCA Analysis:** [GitHub](URL) | [§/path](path)

**QA Decisions:**
- [x] **Decision 1:** Brief decision description
- [ ] **Decision 2:** Brief pending decision

**Essential Status:** [Minimal completion status]
```

**HOWTO REPORT TRIGGER CHECKLIST:**
- [ ] Howto report mention detected in content
- [ ] CMM3 chat format applied (minimal, dual links, decisions)
- [ ] Detailed content moved to PDCA document
- [ ] Chat brevity maintained per howto PDCA protocol
- [ ] Dual links working (GitHub and § local paths)
- [ ] Essential status only in chat response

---

## **🎯 MODULE CREATION STATUS**

**✅ Created:**
- Agent Safety Protocols (CRITICAL)
- PDCA Template (Official)
- Decision Making Guide (Complete)

**📋 To Create:**
- Startup Guide
- Collaboration Patterns  
- Git Workflows
- Troubleshooting Guide
- Quality Standards

**🎯 Design Principle:** Each module < 100 lines to prevent background agent hangs while preserving comprehensive knowledge through cross-references.

---

## **🤝 COLLABORATIVE EXCELLENCE INTEGRATION**

### **Multi-Agent Team Patterns:**
- **Agent Manager:** Registry tracking, lifecycle monitoring, coordination
- **PO (Product Owner):** Requirements, planning, acceptance criteria  
- **ScrumMaster:** Process compliance, team coordination, impediment removal
- **Developer:** Implementation, technical execution, code quality
- **Save/Restart Agent:** Documentation, process improvement, session management

### **Pull-Before-Commit Protocol:**
1. `timeout 30s git fetch origin` (check for updates)
2. Review changes with user (collaborative decision)
3. `timeout 30s git pull --no-edit origin branch` (safe integration)
4. Commit with clear message (team visibility)
5. `timeout 30s git push origin branch` (team synchronization)

---

## **📚 LEARNING PATHWAYS**

### **New Agent Journey:**
1. **Safety First:** Agent Safety Protocols → Immediate operational safety
2. **Foundation:** PDCA Template → Format compliance and structure
3. **Decision Making:** Decision Guide → Collaborative excellence patterns
4. **Startup:** Startup Guide → Session initialization competency
5. **Collaboration:** Collaboration Patterns → Multi-agent coordination

### **Experienced Agent Reference:**
- Quick safety checklist for session start
- Emergency procedures for infrastructure issues
- Advanced collaboration patterns for complex scenarios
- Quality compliance verification for CMM3 standards

---

**🛡️ SAFETY FIRST, COLLABORATION ALWAYS**

**Critical protocols prevent 4GB+ core file disasters that can block entire collaborative workflows. Prevention through vigilant safety protocol adherence enables continuous multi-agent excellence.**

[Agent Safety Protocols](./howto-agent-safety-protocols.md) | [PDCA Template](./template.md) | [Decision Making](./PDCA.howto.decide.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO). Safety protocols serve collaborative excellence - infrastructure vigilance enables team success."** 🤝🛡️✨