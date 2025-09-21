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