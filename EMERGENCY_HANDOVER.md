# EMERGENCY HANDOVER - Terminal Hang Recovery

**CRITICAL**: Previous agent terminal is hung. This is your recovery guide.

## IMMEDIATE CONTEXT
- **Date**: 2025-08-19-UTC-0855
- **Previous Agent**: Attempted to merge origin/release/dev into old branch
- **Result**: Terminal hung, possibly file system affected
- **Your Starting Point**: Unknown - terminal may be unresponsive

## STEP-BY-STEP RECOVERY

### 1. TEST YOUR ENVIRONMENT
```bash
# Try this first:
echo "Terminal test - $(date)"

# If no response in 5 seconds, skip to "TERMINAL IS HUNG" section
```

### 2. IF TERMINAL WORKS

#### Check Your State
```bash
pwd
git branch --show-current
ls -la .git/MERGE_* 2>/dev/null
```

#### Read Full Context
```bash
# Primary handover document:
cat /workspace/scrum.pmo/project.journal/2025-08-19-0825-sprint8-scrummaster/pdca/2025-08-19-UTC-0850-terminal-hang-analysis-handover.md

# Lessons learned:
cat /workspace/recovery.analysis/lessons-learned-terminal-hang.md
```

#### Clean Up Merge
```bash
# If MERGE_HEAD exists:
rm -f .git/MERGE_HEAD
rm -f .git/index.lock
git reset --hard HEAD
```

#### Start Fresh
```bash
# DO NOT try to complete the merge!
git checkout origin/release/dev
git checkout -b recovery/post-hang-$(date +%Y-%m-%d-%H%M)

# Restore backup if needed:
ls recovery.analysis.backup
# If exists and recovery.analysis is corrupted:
rm -rf recovery.analysis
mv recovery.analysis.backup recovery.analysis
```

### 3. IF TERMINAL IS HUNG

Use file reading tools only:
1. Read this file first (you probably already did)
2. Try to read: `/workspace/scrum.pmo/project.journal/2025-08-19-0825-sprint8-scrummaster/pdca/2025-08-19-UTC-0850-terminal-hang-analysis-handover.md`
3. Document what you can access
4. Create new PDCA with your findings

## CRITICAL WARNINGS

### NEVER DO
- ❌ Try to complete the aborted merge
- ❌ Use `git merge` with origin/release/dev on old branches
- ❌ Assume terminal commands will work

### ALWAYS DO
- ✅ Test terminal responsiveness first
- ✅ Create fresh branches from release/dev
- ✅ Document everything for next agent
- ✅ Route around problems, don't fix them

## ROOT CAUSE
The hang occurred because:
1. Starting branch was very old (from test/recovery → feature/analyze-ranger)
2. release/dev is current main development
3. Massive divergence (hundreds of commits)
4. Git merge couldn't handle the complexity
5. Container terminal integration failed

## YOUR MISSION SUMMARY
1. Get to a working state (fresh branch from release/dev)
2. Preserve recovery.analysis folder
3. Document your recovery process
4. Don't waste time trying to fix the broken merge

## PATHS YOU NEED
- Handover PDCA: `/workspace/scrum.pmo/project.journal/2025-08-19-0825-sprint8-scrummaster/pdca/2025-08-19-UTC-0850-terminal-hang-analysis-handover.md`
- Backup folder: `/workspace/recovery.analysis.backup`
- Session folder: `/workspace/scrum.pmo/project.journal/2025-08-19-0825-sprint8-scrummaster/`
- Lessons learned: `/workspace/recovery.analysis/lessons-learned-terminal-hang.md`

## IF ALL ELSE FAILS
Create a PDCA documenting:
- What you can access
- What commands work/don't work  
- Your recovery attempt
- Request for human intervention

Remember: Success is getting to a working state, not fixing everything.

---
**Good luck, next agent. You've got this.**