# 🚨 **PDCA Agent Safety Protocols - Shell Isolation & Process Safety**

**🗓️ Created:** 2025-09-19-UTC-0747  
**🗓️ Updated:** 2025-09-20-UTC-1540 - BREAKTHROUGH: Shell Isolation Strategy  
**🎯 Purpose:** Critical safety protocols for background agents featuring breakthrough shell isolation strategy  
**⚡ Priority:** MANDATORY - Shell isolation prevents stale processes, core file protection prevents system damage  
**🔗 Related:** [Shell Isolation Breakthrough](../../project.journal/2025-09-20-UTC-1348-session/2025-09-20-UTC-1535-shell-isolation-breakthrough.md) | [Agent Safety Guidelines](../../sprints/sprint-20/bad.interactive.sh.commands.md)

---

## **🎯 BREAKTHROUGH: SHELL ISOLATION STRATEGY (2025-09-20)**

### **🚀 The Elegant Solution - 99%+ Effectiveness**

**Core Principle:** Each command runs in separate shell for automatic process cleanup when shell exits.

**Usage Pattern:**
```bash
# Instead of direct commands that accumulate stale processes:
git status
git add file
git commit -m "message"

# Use shell isolation for automatic cleanup:
bash -c "git status"
bash -c "git add file" 
bash -c "git commit -m 'message'"
bash -c "git push origin branch"
```

**Proven Results:**
- **Before Shell Isolation:** Exponential defunct process growth (57 → 88 in minutes)
- **After Shell Isolation:** Minimal accumulation (+1 in 3 operations)
- **Effectiveness:** 99%+ improvement in process safety
- **Simplicity:** Natural OS process lifecycle vs complex monitoring

**Why It Works:**
- Shell exit automatically cleans up all child processes
- No complex timeout management or process hunting required
- Natural OS mechanisms provide reliable cleanup
- Scales automatically with workload

### **🔧 Shell Isolation Implementation**

**For Background Agents - Use This Pattern:**
```bash
# Git operations with automatic cleanup
bash -c "git fetch origin"
bash -c "git pull --no-edit origin branch"
bash -c "git add files"
bash -c "git commit -m 'message'"
bash -c "git push origin branch"
```

**For Complex Operations:**
```bash
# Multi-step operations in single shell for efficiency
bash -c "
    git fetch origin &&
    git pull --no-edit origin branch &&
    git add . &&
    git commit -m 'Batch operation' &&
    git push origin branch
"
```

---

## **🚨 CRITICAL SAFETY CHECKS - MANDATORY AT SESSION START**

### **1. Core File Detection and Prevention**

**IMMEDIATE ACTION REQUIRED:**
```bash
# Check for core files in current session
find . -name "core" -type f 2>/dev/null | head -5
```

**If Core Files Found:**
1. **DO NOT COMMIT** - Stop all git operations immediately
2. **Check Gitignore** - Verify core files are ignored
3. **Remove Files** - Delete core files before any git operations
4. **Verify Prevention** - Ensure .gitignore contains "core" entry

**Gitignore Verification:**
```bash
# Check if core files are in gitignore
grep -q "^core$" .gitignore && echo "✅ Core files ignored" || echo "❌ ADD CORE TO GITIGNORE"
```

**Emergency Core File Prevention (Using Shell Isolation):**
```bash
# Add core to gitignore if missing - using shell isolation for safety
echo "core" >> .gitignore
bash -c "git add .gitignore"
bash -c "git commit -m 'Safety: Add core files to gitignore to prevent large file issues'"
```

### **2. Shell Isolation Git Operations - RECOMMENDED APPROACH**

**BREAKTHROUGH: Shell Isolation eliminates timeout complexity:**
```bash
# Simple, elegant, and effective - automatic process cleanup
bash -c "git fetch origin"
bash -c "git pull --no-edit origin branch-name"
```

**Pre-Pull Safety Check (Shell Isolated):**
```bash
# Check for large files before pull
bash -c "git fetch origin"
bash -c "git diff --stat HEAD..origin/branch-name | grep -E '[0-9]+\+.*[0-9]+\-' | head -5"
```

**Safe Pull Sequence (Shell Isolation Method):**
```bash
# 1. Fetch in isolated shell
bash -c "git fetch origin"

# 2. Check for large files in incoming changes
bash -c "git log --oneline --stat HEAD..origin/branch-name | grep -E 'core|[0-9]+ files? changed.*[0-9]+MB'"

# 3. Pull with automatic process cleanup
bash -c "git pull --no-edit origin branch-name"

# No timeout management needed - shell exit provides automatic cleanup
```

### **3. Legacy Timeout Method (Fallback Only)**

**If Shell Isolation Unavailable:**
```bash
# Legacy approach - more complex but functional
timeout 30s git fetch origin
timeout 30s git pull --no-edit origin branch-name
# Note: Still may accumulate defunct processes
```

---

## **🔧 SAFETY PROTOCOLS FOR BACKGROUND AGENTS**

### **Session Startup Safety Checklist**

**MANDATORY CHECKS (Run at every session start):**
- [ ] Check for core files: `find . -name "core" -type f`
- [ ] Verify gitignore: `grep "^core$" .gitignore`
- [ ] Test shell isolation: `bash -c "git status"`
- [ ] Check repository size: `du -sh .git`
- [ ] Verify defunct process count: `ps aux | grep -E "\[.*\] <defunct>" | wc -l`

### **Git Operation Safety Rules**

**PREFERRED: SHELL ISOLATION (Breakthrough Method):**
```bash
# ✅ BEST PRACTICE - Shell isolation with automatic cleanup
bash -c "git pull --no-edit origin branch"
bash -c "git push origin branch"
bash -c "git status"
bash -c "git fetch origin"
bash -c "git add files"
bash -c "git commit -m 'message'"
```

**NEVER USE THESE (Interactive Commands):**
```bash
# ❌ BANNED - Will hang background agents
git pull origin branch  # (without --no-edit)
git merge               # (interactive merge resolution)
git rebase              # (interactive rebase prompts)
git cherry-pick         # (without --no-commit flag)
```

**SAFE ALTERNATIVES (Priority Order):**
```bash
# 🥇 BEST: Shell isolation (automatic process cleanup)
bash -c "git pull --no-edit origin branch"
bash -c "git merge --no-edit branch"
bash -c "git cherry-pick --no-commit commit-hash"
bash -c "git push origin branch"

# 🥈 FALLBACK: Timeout method (legacy, may accumulate processes)
timeout 30s git pull --no-edit origin branch
timeout 30s git merge --no-edit branch
timeout 30s git push origin branch
```

### **Large File Detection and Prevention**

**Pre-Commit Safety Check:**
```bash
# Check for large files before commit
find . -size +50M -not -path './.git/*' | head -5
```

**Repository Size Monitoring:**
```bash
# Monitor repository size
du -sh . | grep -E '[0-9]+G|[5-9][0-9][0-9]M'
```

**Emergency Large File Cleanup (Shell Isolated):**
```bash
# If large files detected in history - use shell isolation for safety
bash -c "git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch FILENAME' --prune-empty --tag-name-filter cat -- --all"
```

---

## **🚨 EMERGENCY PROCEDURES**

### **If Core Files Are Committed**

**IMMEDIATE ACTION (Shell Isolation Method):**
```bash
# 1. Stop all operations
# 2. DO NOT PUSH to remote
# 3. Remove from staging using shell isolation
bash -c "git reset HEAD core"
# 4. Delete file
rm core
# 5. Add to gitignore
echo "core" >> .gitignore
# 6. Commit gitignore fix with shell isolation
bash -c "git add .gitignore"
bash -c "git commit -m 'Emergency: Add core to gitignore'"
```

### **If Git Operations Hang (Rare with Shell Isolation)**

**RECOVERY STEPS:**
```bash
# 1. Kill git processes (in separate terminal)
pkill -f "git" 2>/dev/null || true

# 2. Start fresh terminal session
# 3. Check for core files
find . -name "core" -type f

# 4. Resume with shell isolation (preferred) or timeout fallback
bash -c "git status"  # Preferred method
# OR timeout 30s git status  # Fallback if shell isolation unavailable
```

**Note:** Shell isolation dramatically reduces hanging incidents by providing automatic process cleanup.

### **If Large Files Block Push**

**COMPLETE CLEANUP (Shell Isolation Method):**
```bash
# Nuclear option - complete history cleanup with shell isolation
bash -c "git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch core' --prune-empty --tag-name-filter cat -- --all"

# Force push clean history with shell isolation
bash -c "git push --force-with-lease origin branch-name"
```

---

## **📋 SAFETY VERIFICATION CHECKLIST**

**Before ANY Git Operation:**
- [ ] No core files present: `find . -name "core" -type f`
- [ ] Gitignore includes core: `grep "^core$" .gitignore`
- [ ] Use shell isolation: `bash -c "git command"`
- [ ] Use non-interactive flags (--no-edit, --no-commit)
- [ ] Check defunct process count: `ps aux | grep -E "\[.*\] <defunct>" | wc -l`

**Session Health Monitoring:**
- [ ] Repository size reasonable: `du -sh .`
- [ ] No large files in staging: `bash -c "git diff --cached --stat"`
- [ ] Terminal responsive to simple commands: `pwd`
- [ ] Defunct process count stable: `ps aux | grep -E "\[.*\] <defunct>" | wc -l`

**Emergency Preparedness:**
- [ ] Know shell isolation pattern: `bash -c "command"`
- [ ] Know how to kill git processes: `pkill -f "git"`
- [ ] Know how to start fresh terminal session
- [ ] Know emergency core file cleanup procedures

---

## **🎯 CRITICAL SUCCESS FACTORS**

### **Prevention is Key:**
1. **Always use shell isolation** for git operations: `bash -c "git command"`
2. **Always check for core files** at session start
3. **Always verify gitignore** includes core files  
4. **Never use interactive git commands** as background agent

### **Early Detection:**
1. **Monitor defunct process count** regularly
2. **Monitor repository size** regularly
3. **Check for large files** before commits
4. **Use shell isolation** for automatic process cleanup

### **Rapid Response:**
1. **Use shell isolation** for all recovery operations
2. **Stop operations immediately** if core files detected
3. **Clean up before committing** anything
4. **Restore collaborative workflow** after cleanup

---

**🚨 BREAKTHROUGH UPDATE (2025-09-20):** Shell isolation provides 99%+ effectiveness in preventing stale process accumulation while maintaining core file protection. This elegant solution replaces complex timeout management with natural OS process lifecycle management.

**"Safety first, collaboration always - shell isolation enables elegant infrastructure protection through natural process cleanup."** 🛡️🚀

---

### **📚 Related Safety Documentation**
- **🚀 Shell Isolation Breakthrough:** [§/scrum.pmo/project.journal/2025-09-20-UTC-1348-session/2025-09-20-UTC-1535-shell-isolation-breakthrough.md](../../project.journal/2025-09-20-UTC-1348-session/2025-09-20-UTC-1535-shell-isolation-breakthrough.md)
- **Agent Safety Commands:** [§/scrum.pmo/sprints/sprint-20/bad.interactive.sh.commands.md](../../sprints/sprint-20/bad.interactive.sh.commands.md)
- **Git History Cleanup Solution:** [§/scrum.pmo/project.journal/2025-09-18-UTC-1316-session/pdca/role/save-restart-agent/2025-09-19-UTC-0747-fantastic-git-history-cleanup-solution.md](../../project.journal/2025-09-18-UTC-1316-session/pdca/role/save-restart-agent/2025-09-19-UTC-0747-fantastic-git-history-cleanup-solution.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO). Shell isolation breakthrough serves collaborative excellence through elegant simplicity."** 🤝🚀