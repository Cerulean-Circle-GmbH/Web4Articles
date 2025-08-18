[Back to Recovery Analysis](./recovery-process-analysis.md)

# Recovery Branch Strategy - Critical Safety Design

**Date:** 2025-08-18  
**Priority:** CRITICAL  
**Issue:** release/dev recovery causes endless agent hangs

## ⚠️ CRITICAL WARNING

**DO NOT USE release/dev FOR RECOVERY** - It contains a "major updated version" of the recovery process that sends all background agents into endless hangs ("nirvana").

## Safe Recovery Branches

### Currently Working Branches
```
SAFE FOR RECOVERY:
├── origin/feature/analyze-ranger (commit f89aba0)
├── main (at commit f89aba0)
└── Any branch created from f89aba0

DANGEROUS - DO NOT USE:
└── release/dev (broken recovery process)
```

## Proven Working Recovery Pattern

Based on successful cursor agent recovery:

```bash
# 1. Clone repository
git clone https://github.com/Cerulean-Circle-GmbH/Web4Articles

# 2. Checkout to main
git checkout main

# 3. Ensure at safe commit
git checkout f89aba0

# 4. Create working branch
git checkout -b recovery/[session-name]
```

## Why This Works

1. **Commit f89aba0** contains the last known good recovery process
2. **feature/analyze-ranger** preserved the working recovery
3. **release/dev** introduced breaking changes to recovery
4. The simple, minimal recovery approach is more reliable

## Recovery Decision Tree (Updated for Safety)

```
START: Background agent needs recovery
│
├─Q: Which branch to start from?
│  │
│  ├─ release/dev?
│  │  └─→ ❌ STOP! Will cause endless hang
│  │
│  ├─ feature/analyze-ranger?
│  │  └─→ ✅ SAFE - Use this
│  │
│  ├─ main (at f89aba0)?
│  │  └─→ ✅ SAFE - Use this
│  │
│  └─ Other branch?
│     └─→ ⚠️ Check commit history first
```

## Safe Recovery Process

### Step 1: Start from Safe Branch
```bash
# Option A: From feature/analyze-ranger
git checkout origin/feature/analyze-ranger
git checkout -b recovery/[date]

# Option B: From main at safe commit
git checkout main
git checkout f89aba0
git checkout -b recovery/[date]
```

### Step 2: Use Minimal Recovery
Follow the minimal recovery process documented in:
- `design.recovery.process.md` (Mode 2)
- `design.recovery.process.v2.md` (Role-based)

### Step 3: Avoid Complex Recovery
Do NOT use the "major updated" recovery from release/dev

## Future Merge Strategy

### When Ready to Fix release/dev

#### Phase 1: Analysis
```bash
# Create analysis branch
git checkout -b fix/recovery-merge
git checkout f89aba0

# Get the diff
git diff f89aba0..release/dev -- '*recovery*' > recovery-diff.txt
```

#### Phase 2: Identify Breaking Changes
1. Review what changed in recovery process
2. Identify what causes the hang
3. Document dangerous patterns

#### Phase 3: Cherry-Pick Safe Changes
```bash
# Cherry-pick only safe commits
git cherry-pick [safe-commit-hash]

# Or apply specific changes
git checkout release/dev -- [safe-file]
```

#### Phase 4: Test Extensively
1. Test with isolated agent
2. Verify no hangs occur
3. Test all recovery modes
4. Document results

#### Phase 5: Gradual Rollout
1. Merge to feature branch first
2. Test with multiple agents
3. Only then merge to main
4. Keep rollback plan ready

## Recovery Testing Checklist

Before merging ANY recovery changes:

- [ ] Test with fresh background agent
- [ ] Verify completes in < 5 minutes
- [ ] No infinite loops or hangs
- [ ] Can create session folder
- [ ] Can write PDCA
- [ ] Can read project files
- [ ] Agent becomes productive

## Diff Analysis Plan

When analyzing release/dev changes:

### Focus Areas
1. **README.md** recovery section
2. **handover.backend.agent.md** 
3. **recovery.md** process
4. Any new recovery scripts
5. Role process files

### Red Flags to Watch For
- Complex environment checks
- Recursive file scanning
- Waiting for user input
- Network dependencies
- Large file operations
- Circular dependencies

## Temporary Branch Policy

Until release/dev is fixed:

1. **All new work** starts from feature/analyze-ranger or main@f89aba0
2. **No direct checkout** of release/dev
3. **Document branch origin** in all PRs
4. **Test recovery** before merging anywhere

## Communication Protocol

When creating PRs or branches:

```markdown
## Branch Origin
- Based on: feature/analyze-ranger (safe recovery)
- NOT based on: release/dev (broken recovery)
- Tested recovery: ✅ Working
```

## Recovery Metrics

### Working Recovery (feature/analyze-ranger)
- Time to productive: 1-5 minutes
- Success rate: 100%
- Tool requirements: Minimal

### Broken Recovery (release/dev)
- Time to productive: ∞ (hangs)
- Success rate: 0%
- Tool requirements: Unknown (never completes)

## Summary

1. **USE**: feature/analyze-ranger or main@f89aba0
2. **AVOID**: release/dev
3. **TEST**: Any recovery changes extensively
4. **DOCUMENT**: Branch origins clearly
5. **PLAN**: Careful future merge with diff analysis

This strategy ensures all agents can recover successfully while we plan the careful integration of release/dev changes.