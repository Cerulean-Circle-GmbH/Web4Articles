# 🚨 **PDCA Agent Safety Protocols - Core File and Git Operation Safety**

**🗓️ Created:** 2025-09-19-UTC-0747  
**🎯 Purpose:** Critical safety protocols for background agents to prevent core file commits and git operation hangs  
**⚡ Priority:** MANDATORY - Must be checked at session start and before any git operations  
**🔗 Related:** [Agent Safety Guidelines](../../sprints/sprint-20/bad.interactive.sh.commands.md) | [Git History Cleanup Solution](../../project.journal/2025-09-18-UTC-1316-session/pdca/role/save-restart-agent/2025-09-19-UTC-0747-fantastic-git-history-cleanup-solution.md)

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

**Emergency Core File Prevention:**
```bash
# Add core to gitignore if missing
echo "core" >> .gitignore
git add .gitignore
git commit -m "Safety: Add core files to gitignore to prevent large file issues"
```

### **2. Git Pull Safety Protocol**

**MANDATORY TIMEOUT USAGE:**
```bash
# ALWAYS use timeout for git pull operations
timeout 30s git pull --no-edit origin branch-name
```

**Pre-Pull Safety Check:**
```bash
# Check for large files before pull
git fetch origin
git diff --stat HEAD..origin/branch-name | grep -E '[0-9]+\+.*[0-9]+\-' | head -5
```

**Safe Pull Sequence:**
```bash
# 1. Fetch with timeout
timeout 30s git fetch origin

# 2. Check for large files in incoming changes
git log --oneline --stat HEAD..origin/branch-name | grep -E 'core|[0-9]+ files? changed.*[0-9]+MB'

# 3. Pull with timeout and non-interactive flags
timeout 30s git pull --no-edit origin branch-name

# 4. If timeout occurs, start fresh terminal session
```

---

## **🔧 SAFETY PROTOCOLS FOR BACKGROUND AGENTS**

### **Session Startup Safety Checklist**

**MANDATORY CHECKS (Run at every session start):**
- [ ] Check for core files: `find . -name "core" -type f`
- [ ] Verify gitignore: `grep "^core$" .gitignore`
- [ ] Test git operations with timeout: `timeout 10s git status`
- [ ] Check repository size: `du -sh .git`

### **Git Operation Safety Rules**

**ALWAYS USE TIMEOUTS:**
```bash
# Safe git operations with timeouts
timeout 30s git pull --no-edit origin branch
timeout 30s git push origin branch
timeout 10s git status
timeout 10s git fetch origin
```

**NEVER USE THESE (Interactive Commands):**
```bash
# ❌ BANNED - Will hang background agents
git pull origin branch  # (without --no-edit and timeout)
git merge               # (interactive merge resolution)
git rebase              # (interactive rebase prompts)
git cherry-pick         # (without --no-commit flag)
```

**SAFE ALTERNATIVES:**
```bash
# ✅ SAFE - Non-interactive with timeouts
timeout 30s git pull --no-edit origin branch
timeout 30s git merge --no-edit branch
git cherry-pick --no-commit commit-hash
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

**Emergency Large File Cleanup:**
```bash
# If large files detected in history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch FILENAME' --prune-empty --tag-name-filter cat -- --all
```

---

## **🚨 EMERGENCY PROCEDURES**

### **If Core Files Are Committed**

**IMMEDIATE ACTION:**
```bash
# 1. Stop all operations
# 2. DO NOT PUSH to remote
# 3. Remove from staging
git reset HEAD core
# 4. Delete file
rm core
# 5. Add to gitignore
echo "core" >> .gitignore
# 6. Commit gitignore fix
git add .gitignore
git commit -m "Emergency: Add core to gitignore"
```

### **If Git Operations Hang**

**RECOVERY STEPS:**
```bash
# 1. Kill git processes (in separate terminal)
pkill -f "git" 2>/dev/null || true

# 2. Start fresh terminal session
# 3. Check for core files
find . -name "core" -type f

# 4. Resume with safety protocols
timeout 30s git status
```

### **If Large Files Block Push**

**COMPLETE CLEANUP:**
```bash
# Nuclear option - complete history cleanup
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch core' --prune-empty --tag-name-filter cat -- --all

# Force push clean history
git push --force-with-lease origin branch-name
```

---

## **📋 SAFETY VERIFICATION CHECKLIST**

**Before ANY Git Operation:**
- [ ] No core files present: `find . -name "core" -type f`
- [ ] Gitignore includes core: `grep "^core$" .gitignore`
- [ ] Use timeout for all git commands
- [ ] Use non-interactive flags (--no-edit, --no-commit)

**Session Health Monitoring:**
- [ ] Repository size reasonable: `du -sh .`
- [ ] No large files in staging: `git diff --cached --stat`
- [ ] Terminal responsive to simple commands: `pwd`

**Emergency Preparedness:**
- [ ] Know how to kill git processes: `pkill -f "git"`
- [ ] Know how to start fresh terminal session
- [ ] Know emergency core file cleanup procedures

---

## **🎯 CRITICAL SUCCESS FACTORS**

### **Prevention is Key:**
1. **Always check for core files** at session start
2. **Always verify gitignore** includes core files  
3. **Always use timeouts** for git operations
4. **Never use interactive git commands** as background agent

### **Early Detection:**
1. **Monitor repository size** regularly
2. **Check for large files** before commits
3. **Use safe git alternatives** with timeouts
4. **Maintain terminal responsiveness** through safe commands

### **Rapid Response:**
1. **Stop operations immediately** if core files detected
2. **Clean up before committing** anything
3. **Use emergency procedures** for history cleanup
4. **Restore collaborative workflow** after cleanup

---

**🚨 REMEMBER: Core files can grow to 4GB+ and completely block collaborative workflows. Prevention is infinitely better than cleanup!** 

**"Safety first, collaboration always - prevent infrastructure problems through vigilant protocol adherence."** 🛡️✨

---

### **📚 Related Safety Documentation**
- **Agent Safety Commands:** [§/scrum.pmo/sprints/sprint-20/bad.interactive.sh.commands.md](../../sprints/sprint-20/bad.interactive.sh.commands.md)
- **Git History Cleanup Solution:** [§/scrum.pmo/project.journal/2025-09-18-UTC-1316-session/pdca/role/save-restart-agent/2025-09-19-UTC-0747-fantastic-git-history-cleanup-solution.md](../../project.journal/2025-09-18-UTC-1316-session/pdca/role/save-restart-agent/2025-09-19-UTC-0747-fantastic-git-history-cleanup-solution.md)

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO). Safety protocols serve collaborative excellence."** 🤝🛡️