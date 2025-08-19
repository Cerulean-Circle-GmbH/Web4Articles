# Lessons Learned: Terminal Hang During Branch Merge

**Date:** 2025-08-19-UTC-0850  
**Incident:** Terminal hang when merging release/dev into old branch

## Executive Summary

Attempting to merge a current branch (release/dev) into a significantly outdated branch (created from test/recovery/feature/analyze-ranger) causes terminal to hang irreversibly. This is not just about release/dev being problematic - it's about the danger of complex merges in the container environment.

## Root Cause

### The Perfect Storm
1. **Old Base Branch**: test/recovery is based on feature/analyze-ranger (old)
2. **Current Target**: release/dev is the latest development branch  
3. **Massive Divergence**: Likely hundreds of commits difference
4. **Merge Complexity**: Git attempting to reconcile massive changes
5. **Container Environment**: Terminal/git integration can't handle the load

### Why It Hangs
- The merge process overwhelms the git/terminal integration
- The `--strategy-option=theirs` flag may make it worse
- The container's terminal becomes unresponsive
- No way to interrupt or recover the terminal

## Prevention Guidelines

### ❌ NEVER DO THIS
```bash
# Starting from old branch
git checkout old-branch
git merge origin/release/dev  # TERMINAL WILL HANG
```

### ✅ ALWAYS DO THIS
```bash
# Start fresh from release/dev
git checkout origin/release/dev
git checkout -b new-work-branch
# Then cherry-pick or copy specific changes if needed
```

### Check Before Merge
```bash
# Check how far behind you are
git rev-list --count origin/release/dev..HEAD

# If > 50 commits behind, DO NOT MERGE
# Create fresh branch instead
```

## Recovery Process

If terminal hangs during merge:

1. **You cannot recover the terminal** - it's gone
2. Next agent must:
   - Read `/workspace/scrum.pmo/project.journal/2025-08-19-0825-sprint8-scrummaster/pdca/2025-08-19-UTC-0850-terminal-hang-analysis-handover.md`
   - Abort any partial merge
   - Start fresh from release/dev
   - Never attempt to complete the hung merge

## Updated Best Practices

### For Recovery Process
1. V4 recovery correctly uses feature/analyze-ranger (safe)
2. But if you need current code, create new branch from release/dev
3. Never merge forward into recovery branches

### For All Agents
1. **Branch Age Matters**: Check divergence before any merge
2. **Fresh Over Merge**: When in doubt, create fresh branch
3. **Container Limits**: This environment can't handle complex merges
4. **Document Hangs**: If you hang, document for next agent

## Impact on V4 Recovery

The V4 recovery process remains correct:
- Uses feature/analyze-ranger (safe, stable)
- Avoids release/dev during recovery
- Routes around the problem

But adds new guideline:
- If you need to update to latest code after recovery
- Create NEW branch from release/dev
- Do NOT merge into your recovery branch

## The Meta Learning

This incident proves the V4 recovery philosophy:
> "The best software design isn't about handling every possibility - it's about creating paths that avoid problems entirely."

We don't fix the hanging bug. We document it and route around it.

---

**Remember**: In this environment, terminal hangs are catastrophic. Prevention is the only cure.