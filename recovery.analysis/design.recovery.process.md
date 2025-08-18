[Back to Recovery Analysis](./recovery-process-analysis.md)

# Recovery Process Design - Minimal & Always Successful

**Date:** 2025-08-18  
**Objective:** Design minimal recovery process that always succeeds by postponing complexity

## ⚠️ CRITICAL: Branch Safety Warning

**SAFE BRANCHES**: feature/analyze-ranger, main@f89aba0  
**DANGEROUS**: release/dev (causes endless hang)  
See [Branch Strategy](./design.recovery.branch-strategy.md) for details

## Recovery Modes Decision Tree

```
START: Agent needs to recover context
│
├─Q: Do you already know what the project does?
│  │
│  ├─YES: You worked on it before
│  │  └─→ Mode 2: Minimal Safe Recovery
│  │
│  └─NO: First time or lost context
│     │
│     ├─Q: Are you recovering as a specific role/agent?
│     │  │
│     │  ├─YES: Role-specific recovery needed
│     │  │  └─→ Mode 3: Agent-Specific Recovery
│     │  │
│     │  └─NO: General recovery needed
│     │     └─→ Mode 1: Full README Recovery
```

## Three Recovery Modes (Top-Down)

### Mode 1: Full README Recovery (Complex - Last Resort)
**When:** No project knowledge, no specific role
**Time:** ~15 minutes
**Steps:**
1. DevOps environment check (Docker, Node, etc.)
2. Read README first principles
3. Scan all markdown files
4. Generate/update indexes
5. Aggregate QA feedback
6. Check role processes
7. Summarize sprint status
8. Consistency checks
9. Update recovery.md

**Issues:** Many prerequisites, can fail at step 1

### Mode 2: Minimal Safe Recovery (Recommended Default)
**When:** Some project knowledge exists
**Time:** ~2 minutes
**Steps:**
1. Create session folder: `scrum.pmo/project.journal/YYYY-MM-DD-HHMM/`
2. Create PDCA subfolder: `scrum.pmo/project.journal/YYYY-MM-DD-HHMM/pdca/`
3. Start PDCA documentation immediately
4. Continue work, learning as you go

**Success Rate:** 100% - No prerequisites, no failures possible

### Mode 3: Agent-Specific Recovery
**When:** Recovering as specific agent (Developer, Tester, etc.)
**Time:** ~5 minutes
**Steps:**
1. Do Mode 2 first (create folders)
2. Read role-specific process.md
3. Check recent role PDCAs
4. Continue role tasks

## Mode 2: Minimal Safe Recovery - Detailed Process

### Step 1: Create Journal Session
```bash
# Get timestamp
DATE=$(date +"%Y-%m-%d-%H%M")

# Create session folder
mkdir -p scrum.pmo/project.journal/$DATE/pdca
cd scrum.pmo/project.journal/$DATE
```

### Step 2: Create Initial PDCA
Create `pdca/initial-recovery.md`:
```markdown
[Back to Session](../)

# 📋 PDCA Cycle: Initial Recovery - [TIMESTAMP]

**🗓️ Date:** [DATE]  
**🎯 Objective:** Recover context and continue work  
**👤 Role:** [Your Role]  
**🚨 Issues:** Lost context, need to recover

## ✅ Summary
**📊 QA Decisions**
- [ ] Created session folders
- [ ] Started PDCA documentation
- [ ] Identified next task

## 📋 Plan
- Create minimal structure
- Document what I'm doing
- Learn project as I work

## 🔨 Do
- Created journal session folder
- Started this PDCA
- [Current work here]

## 🔍 Check
### QA Feedback
> [User feedback will go here]

## ⚡ Act
- Continue with task
- Update PDCA as I learn

## 📝 One-Line Summary
Started minimal recovery with PDCA documentation.
```

### Step 3: Continue Working
- Document everything in PDCAs
- Learn project structure as needed
- Add complexity only when blocked

## Postponed Steps (Only When Needed)

### Environment Setup (Postpone Until Required)
- Docker: Only for devcontainer tasks
- PlantUML: Only for diagram generation
- Node modules: Only for running code

### Documentation Reading (Postpone Until Blocked)
- README: Read section when relevant
- Process docs: Check when unclear
- Sprint files: Review when taking tasks

### Indexing/Scanning (Postpone Indefinitely)
- File indexes: Generate only if searching fails
- Link checking: Do only if links break
- Status summaries: Create only for reporting

## Recovery Success Metrics

| Mode | Prerequisites | Failure Points | Success Rate | Time |
|------|---------------|----------------|--------------|------|
| Mode 1 | Docker, Node, Git | Many (env, files) | ~70% | 15min |
| Mode 2 | Filesystem only | None | 100% | 2min |
| Mode 3 | Mode 2 + role file | Role file missing | ~95% | 5min |

## Key Principles

1. **Start Minimal**: Just folders and PDCA
2. **Document Forward**: Learn by doing, not reading
3. **Postpone Complexity**: Add only when blocked
4. **Always Succeed**: Mode 2 cannot fail
5. **Build Context**: Each PDCA adds understanding

## Recommended Approach

1. **Always start with Mode 2** - It cannot fail
2. **Stay in Mode 2** unless specifically blocked
3. **Upgrade to Mode 1/3** only for specific needs
4. **Document the journey** in PDCAs

This ensures:
- ✅ Always successful recovery
- ✅ Minimal time investment
- ✅ Progressive understanding
- ✅ Documented progress
- ✅ No prerequisite failures