# 🚨 Bad Interactive Shell Commands - Agent Safety List

**🗓️ Created:** 2025-09-10-UTC-2115  
**🎯 Purpose:** Track shell commands that cause interactive hangs for background agents  
**⚠️ Critical:** Background agents CANNOT handle interactive prompts - these commands will hang indefinitely

---

## **❌ CONFIRMED BAD COMMANDS**

### **Git Operations**
- `git pull origin branch` - Can hang on merge conflicts requiring interactive resolution
- `git cherry-pick` - 🍒 DANGEROUS: Hangs on conflicts without `--no-commit` flag, use cherry picking as taking work exclusively and committing to another branch
- `git merge` - Interactive merge conflict resolution
- `git rebase` - Interactive rebase prompts
- `git reset --hard` - Destructive; discards local changes/history and can drop unpushed work
- `git push --force` / `--force-with-lease` - Destructive; rewrites remote history and can erase teammates' commits

### **Package Managers**
- `npm install` - Should use `npm install --yes` or `npm ci`
- `apt-get install` - Should use `apt-get install -y`

---

## **✅ SAFE ALTERNATIVES**

### **Git Operations**
- `git pull --no-edit origin branch` - Prevents interactive merge messages
- `git pull --rebase origin branch` - But requires `git config pull.rebase false` first
- `git cherry-pick --no-commit` - 🍒 SAFER: Prevents interactive conflict resolution, but cherry picking = taking work exclusively and committing to another branch
- `git status` - Always safe, read-only
- `git merge --ff-only` - Ensures fast-forward only; avoids unintended merges
- Create backup before risky operations: `git branch backup-$(date -u +%Y-%m-%d-UTC-%H%M%S)`
- Prefer `git revert <range>` to undo while preserving history instead of `reset --hard`

### **Package Managers**
- `npm ci` - Non-interactive, uses package-lock.json
- `npm install --yes` - Forces yes to all prompts
- `apt-get install -y package` - Auto-confirms installation

---

## **🔧 RECOVERY COMMANDS**

When stuck in interactive command:
- Background agents cannot send Ctrl+C
- Terminal session becomes unresponsive
- Must start new terminal session
- Previous work may be lost if not committed

**Prevention:** Always use non-interactive flags for background agent safety!

---

## **📋 INCIDENT LOG**

### **Incident 1: 2025-09-10-UTC-2115**
- **Command:** `git pull origin dev/once0304 && git push origin dev/once0304`
- **Issue:** Git pull hung on interactive merge/conflict resolution
- **Impact:** Terminal session became unresponsive, 900s timeout
- **Resolution:** Started fresh terminal session
- **Prevention:** Use `git pull --no-edit` or configure `pull.rebase false`

---

**⚠️ CRITICAL REMINDER: Background agents run autonomously and CANNOT interact with prompts!**