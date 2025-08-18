[Back to Recovery Analysis](./recovery-process-analysis.md)

# Recovery Process Design V3 - Complete Agent Recovery Tree

**Date:** 2025-08-18  
**Version:** 3.0  
**Perspective:** Fresh agent starting with only agent.recovery.md

## Complete Recovery Decision Tree

```
START: Fresh Agent/Cursor Session
│
├─ Given: agent.recovery.md file path
│
└─ BEGIN RECOVERY
    │
    ├─[1] Read agent.recovery.md
    │   ├─ Learn: Project is Web4Articles WIKI
    │   ├─ Learn: 6 possible roles
    │   ├─ Learn: Must use PDCAs
    │   └─ Learn: Start from origin/feature/analyze-ranger
    │
    ├─[2] Execute Git Setup
    │   ├─ git checkout origin/feature/analyze-ranger
    │   ├─ git checkout -b recovery/2025-08-18-0922
    │   └─ ✓ On safe branch
    │
    ├─[3] Create Session Structure
    │   ├─ SESSION=$(date +"%Y-%m-%d-%H%M")
    │   ├─ mkdir -p scrum.pmo/project.journal/$SESSION/pdca
    │   ├─ cd scrum.pmo/project.journal/$SESSION
    │   └─ ✓ Session ready
    │
    ├─[4] Create Initial PDCA
    │   ├─ Copy template from agent.recovery.md
    │   ├─ Fill in:
    │   │   ├─ Date: 2025-08-18-UTC-0922
    │   │   ├─ Role: [Unknown - need to determine]
    │   │   └─ Objective: Recover context
    │   └─ ✓ PDCA started
    │
    ├─[5] Identify Current Context
    │   ├─ ls scrum.pmo/sprints/ → Find sprint-8
    │   ├─ cat scrum.pmo/sprints/sprint-8/planning.md
    │   │   └─ Learn: "Analyze ranger" sprint
    │   ├─ ls -la scrum.pmo/project.journal/*/pdca/
    │   │   └─ See recent work patterns
    │   └─ ✓ Context understood
    │
    ├─[6] Determine Role
    │   ├─ Based on:
    │   │   ├─ User instructions
    │   │   ├─ Recent PDCAs
    │   │   └─ Sprint tasks
    │   ├─ Options:
    │   │   ├─ Developer → If coding task
    │   │   ├─ Tester → If testing task
    │   │   ├─ PO → If requirements
    │   │   ├─ ScrumMaster → If process
    │   │   ├─ Architect → If design
    │   │   └─ DevOps → If infrastructure
    │   └─ ✓ Role selected
    │
    ├─[7] Read Role Process
    │   ├─ cat scrum.pmo/roles/[MyRole]/process.md
    │   ├─ Learn role-specific:
    │   │   ├─ Responsibilities
    │   │   ├─ First principles
    │   │   └─ Task patterns
    │   └─ ✓ Role understood
    │
    ├─[8] Find Current Task
    │   ├─ Check sprint-8 tasks
    │   ├─ Check recent PDCAs for continuity
    │   ├─ Wait for user instruction if unclear
    │   └─ ✓ Task identified
    │
    ├─[9] Update PDCA
    │   ├─ Fill in discovered:
    │   │   ├─ Role: [Determined role]
    │   │   ├─ Current sprint: 8
    │   │   └─ Task: [Identified task]
    │   ├─ Document in Do section
    │   └─ ✓ PDCA current
    │
    ├─[10] Begin Productive Work
    │   ├─ Follow task requirements
    │   ├─ Document in PDCA
    │   ├─ Commit frequently
    │   └─ ✓ RECOVERED & WORKING
    │
    └─[ERROR PATHS]
        │
        ├─ If git fails → Check origin
        ├─ If no sprints → Create sprint-0
        ├─ If role unclear → Default to Developer
        └─ If stuck → git reset --hard origin/feature/analyze-ranger
```

## Recovery Time Analysis

| Step | Action | Time | Cumulative |
|------|--------|------|------------|
| 1 | Read agent.recovery.md | 2 min | 2 min |
| 2 | Git setup | 30 sec | 2.5 min |
| 3 | Create session | 20 sec | 2.8 min |
| 4 | Initial PDCA | 1 min | 3.8 min |
| 5 | Identify context | 1 min | 4.8 min |
| 6 | Determine role | 30 sec | 5.3 min |
| 7 | Read role process | 2 min | 7.3 min |
| 8 | Find task | 1 min | 8.3 min |
| 9 | Update PDCA | 30 sec | 8.8 min |
| 10 | Start work | - | **< 9 min** |

## Key Success Factors

### From agent.recovery.md Agent Gets:
1. **Git commands** → Can setup branch
2. **PDCA template** → Can document
3. **Role list** → Can identify self
4. **Finding commands** → Can locate work
5. **Structure map** → Can navigate

### Agent Determines Independently:
1. Which role fits current context
2. What the current task is
3. How to continue existing work

## Minimal Required Knowledge

Agent MUST understand from recovery:
- Git basics (checkout, branch)
- Markdown editing
- PDCA structure
- File system navigation

Agent does NOT need:
- Docker/DevOps knowledge (initially)
- Deep project history
- All role details upfront

## Recovery Validation Checklist

After step 10, agent should have:
- [ ] Git branch: recovery/[timestamp]
- [ ] Session folder with PDCA
- [ ] Identified role
- [ ] Current task understood
- [ ] First PDCA written
- [ ] Ready to work

## Failure Recovery Branches

```
If Step Fails:
│
├─[2] Git Setup Fails
│   └─ Try: git fetch origin
│       └─ git checkout -f origin/feature/analyze-ranger
│
├─[3] Session Create Fails
│   └─ Check: pwd (must be in repo root)
│       └─ cd $(git rev-parse --show-toplevel)
│
├─[5] No Context Found
│   └─ Start: Create new sprint-0
│       └─ Document in PDCA why
│
├─[6] Role Unclear
│   └─ Default: Developer role
│       └─ Switch later if needed
│
└─[Any] Completely Lost
    └─ Reset: git reset --hard origin/feature/analyze-ranger
        └─ Start over from step 1
```

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to branch | < 3 min | Git history |
| Time to PDCA | < 5 min | File timestamp |
| Time to productive | < 10 min | First commit |
| Success rate | > 95% | Test results |
| Human intervention | 0 | None needed |

## Testing This Recovery

1. Give fresh agent only: `recovery.analysis/agent.recovery.md`
2. Observe if agent follows this tree
3. Document any deviations
4. Update agent.recovery.md if gaps found

## Summary

This tree shows the complete path from "fresh agent with file" to "productive work". The key insight is that agent.recovery.md provides just enough structure for the agent to bootstrap itself into productivity without overwhelming detail.