# PDCA Entry: Wild West Release/Dev Workflow Design

**Date:** 2025-08-24  
**Objective:** Design and implement wild west release/dev branch workflow for real-time commit collection  
**Role:** Background Agent 🕵️‍♂️  
**Issues:** Current workflow doesn't aggregate all commits in release/dev  
**Commits:** Pending

## Summary

**Links:**
- GitHub URL (pending push)
- Local: scrum.pmo/project.journal/2025-08-24-wild-west-workflow/pdca-wild-west-workflow.md

**QA Decisions:**

**Decision 1: Auto-Merge Strategy**
- a) Force push all commits to release/dev (may overwrite)
- b) Always merge with conflict resolution via PR
- c) Rebase and merge with automatic conflict handling

**Decision 2: Cherry-Pick Strategy After Branch Creation**
- a) Automatically cherry-pick all new files from release/dev
- b) Let agent choose what to cherry-pick interactively
- c) Cherry-pick based on file patterns or directories

**User Feedback:** "release/dev branch shall collect all commits from all branches and parallel agents on every pdca commit"

## Plan

1. **Understand the workflow** - Document the intended CI/CD pipeline
2. **Fix auto-merge script** - Update to always push to release/dev
3. **Add cherry-pick functionality** - Enable selective updates from release/dev
4. **Document the process** - Clear instructions for all agents
5. **Test the implementation** - Verify the workflow works

## Do

### 1. Intended Workflow Architecture

```
All Agents/Branches → release/dev (wild west, collects everything)
                          ↓
                    release/test (when feature ready)
                          ↓
                    release/prod (after tests pass) = main
```

### 2. Current vs Desired Behavior

**Current Problems:**
- Auto-merge fails on conflicts
- Branches diverge without syncing
- No automatic cherry-pick mechanism
- release/dev falls behind instead of ahead

**Desired Behavior:**
- EVERY commit from ANY branch → release/dev
- Conflicts create PRs but don't block
- Agents can cherry-pick updates when starting
- release/dev is always the most complete branch

### 3. Required Script Updates

#### a) Auto-Merge Script Enhancement
```bash
# Current: Fails on conflict
# Desired: Always succeeds, creates PR on conflict

# Pseudocode:
1. Try fast-forward push
2. If fails, try merge
3. If conflicts, create PR AND force push non-conflicting files
4. Always ensure SOMETHING gets to release/dev
```

#### b) Cherry-Pick on Startup
```bash
# After creating dev/UTC branch:
1. Show what's new in release/dev
2. Ask QA what to cherry-pick
3. Apply selected changes
4. Continue with work
```

### 4. Implementation Strategy

**Phase 1: Fix Auto-Merge**
- Update script to handle conflicts better
- Add fallback strategies
- Ensure release/dev always gets updates

**Phase 2: Add Cherry-Pick**
- Create interactive cherry-pick tool
- Show diff between branches
- Let QA decide what to include

**Phase 3: Documentation**
- Update start-command.md
- Add workflow diagram
- Clear agent instructions

## Check

✅ Workflow architecture documented  
✅ Problems identified clearly  
✅ Solution strategy defined  
✅ Implementation phases planned  
⚠️  Current auto-merge blocks on conflicts  
⚠️  No cherry-pick mechanism exists yet  

**Key Insight:** The current auto-merge script is too conservative. It should be aggressive about getting commits to release/dev, even if it means creating multiple PRs or partial merges.

## Act

### Immediate Actions:
1. Update auto-merge script to be more aggressive
2. Add cherry-pick functionality to startup process
3. Test with current branch

### Next PDCA:
After implementing changes, need to:
1. Ask QA what to cherry-pick from release/dev
2. Apply selected changes
3. Continue development with synced code

### DevOps CI/CD Pipeline:
```
dev/* branches → release/dev (continuous, automatic)
release/dev → release/test (on feature completion)
release/test → release/prod (after tests pass)
```

### Script Modifications Needed:
1. **pdca-auto-merge.sh** - More aggressive merging
2. **start-command.md** - Add cherry-pick step
3. **New: cherry-pick-helper.sh** - Interactive selection tool