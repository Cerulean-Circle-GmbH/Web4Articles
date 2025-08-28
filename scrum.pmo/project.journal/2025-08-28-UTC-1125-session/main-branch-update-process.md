[Back to Session](./)

# Main Branch Manual Update Process

**Date:** 2025-08-28-UTC-1130  
**Role:** ScrumMaster  
**Purpose:** Document and validate manual main branch update workflow

## Current State Analysis

### Local vs Remote Main
- **Local main:** 173a71b - Tools: Cherry-pick source.env... (at origin/save/start)
- **Origin/main:** 95da642 - URGENT: Create save/start.v2... (1 commit ahead)
- **Status:** Local main is behind origin/main by 1 commit

### Branch Relationships
```
origin/main (95da642) <- 1 commit ahead
    |
local main (173a71b) = origin/save/start = origin/save/start.v3
```

## Standard Workflow (Per Memory 7495247)

### Principle
"Always reset the 'main' branch to the latest version of save/start and start all operations from main"

### Manual Update Steps

#### Option A: Reset to save/start (Recommended)
```bash
# 1. Ensure you're not on main
git checkout dev/[your-branch]

# 2. Fetch latest changes
git fetch origin

# 3. Reset main to save/start
git checkout main
git reset --hard origin/save/start

# 4. Verify the reset
git log --oneline -5
git status
```

#### Option B: Update to latest origin/main
```bash
# 1. Ensure you're not on main  
git checkout dev/[your-branch]

# 2. Fetch and fast-forward
git checkout main
git pull origin main

# 3. Verify the update
git log --oneline -5
```

## Safety Checks

### Before Update
1. **Check uncommitted changes:** `git status`
2. **Backup current state:** `git branch backup/main-$(date +%Y%m%d-%H%M%S) main`
3. **Verify you're not on main:** `git branch --show-current`

### After Update
1. **Verify correct commit:** `git log -1 --oneline`
2. **Check branch tracking:** `git branch -vv`
3. **Ensure clean state:** `git status`

## Rollback Procedure

If update causes issues:
```bash
# Find backup branch
git branch | grep backup/main

# Reset to backup
git checkout main
git reset --hard backup/main-[timestamp]

# Or reset to specific commit
git reset --hard [previous-commit-sha]
```

## Decision Required

Given current state where origin/main (95da642) is ahead of save/start (173a71b):

**Which approach should we follow?**
1. Keep main at save/start (173a71b) - Following memory convention
2. Update main to match origin/main (95da642) - Following remote state
3. Investigate why origin/main diverged from save/start
4. Create new save/start version from current origin/main

## Recommendations

As ScrumMaster, I recommend:
1. **Maintain Convention:** Keep following the save/start reset pattern
2. **Document Divergence:** Record why origin/main moved ahead
3. **Team Communication:** Ensure all agents understand the workflow
4. **Consider Automation:** Script the reset process to prevent errors

## Process Benefits

- **Consistency:** All agents start from same known state
- **Safety:** Prevents accumulation of experimental changes
- **Clarity:** Clear process reduces confusion
- **Recovery:** Easy to return to known good state