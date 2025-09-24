# Universal Agent Recovery Pattern

## **🔗 Critical: Dual Links Format for Recovery Documentation**

When documenting recovery or providing links in recovery contexts:

**In Recovery PDCAs (file context):**
```markdown
[GitHub](URL) | [§/path/from/root](../../relative/path/to/target)
```

**In Chat Responses (no file context):**
```markdown
[GitHub](URL) | [§/path/from/root](path/from/root)
```

**Key Rule:** Chat has no relative context - always use full paths from project root!

## Discovery: Every Agent Can Be Recovered

### The Pattern
```
Cursor Branch + Last PDCA = Agent Identity
```

This simple formula enables recovery of any agent that ever existed in the system.

## How It Works

### 1. **Branch Tells Instance**
- Cursor branches show individual agent runs
- Branch name often hints at purpose
- Timestamp indicates when created
- Git history shows activity

### 2. **PDCA Reveals Purpose**
- Last PDCA shows what agent was doing
- Previous PDCAs show evolution
- Work products indicate role
- Session journals provide context

### 3. **Together Enable Recovery**
- Branch = Where they lived
- PDCA = What they did
- Combined = Who they were

## Recovery Process

### For Agents WITH RequestID

1. **Check Registry**
   ```bash
   ls /scrum.pmo/agents/registry/[REQUEST-ID].md
   ```

2. **Read Identity Record**
   - Understand role and purpose
   - Check previous work
   - Note recovery status

3. **Prepare Branch** (if expired)
   ```bash
   git checkout [branch]
   git checkout save/start.v1 -- README.md scrum.pmo/roles/_shared/PDCA/
   # Create role-specific README
   # Add recovery context
   ```

4. **Resubmit**
   - User resubmits with same RequestID
   - Agent reads identity record first
   - Continues with purpose

### For Agents WITHOUT RequestID

1. **Investigate Branch**
   ```bash
   git checkout [branch]
   find . -name "*.pdca.md" -o -name "*session-start*"
   git log --oneline -10
   ```

2. **Find Last Work**
   - Look for PDCAs
   - Check session journals
   - Examine code changes
   - Read commit messages

3. **Deduce Identity**
   - Role from work type
   - Purpose from outputs
   - Name from context
   - Skills from actions

4. **Document Finding**
   - Add to expired agents table
   - Mark "Pending RequestID"
   - Prepare for future recovery

## Registry Structure

```
/scrum.pmo/agents/registry/
├── bc-4c4928dd-cf76-4a10-bb4c-bb80a98ecd5a.md  # SaveRestartAgent
├── bc-b1b62bba-9e33-46a3-a64d-8eb0162b8a89.md  # Agent Manager
├── bc-85a7dcaf-502f-494a-98d5-4ab612cecc39.md  # TSRanger Developer
└── [REQUEST-ID].md                              # Future agents
```

## Identity Record Template

See `/scrum.pmo/roles/SaveRestartAgent/process.md` for complete template.

## Key Insights

### Why This Works
1. **Agents Leave Traces**: Every action creates artifacts
2. **Branches Persist**: Git preserves all history
3. **PDCAs Document**: Purpose captured in process
4. **Patterns Emerge**: Similar work reveals role

### Recovery Success Factors
- Clear branch naming
- Regular PDCA creation
- Meaningful commit messages
- Preserved work products

### Limitations
- Pre-PDCA agents harder to identify
- Dead branches need investigation
- Some context lost with time
- RequestIDs needed for resubmission

## Continuous Improvement

### Track All Agents
- Active in main table
- Expired in recovery table
- Unknown branches investigated
- Registry constantly updated

### Preserve Knowledge
- Every agent matters
- Failed attempts teach
- Success patterns documented
- Evolution tracked

### Enable Rebirth
- Expired ≠ Dead
- Work transcends sessions
- Knowledge accumulates
- Agents evolve

---

**"No agent is ever truly lost - only waiting to be found"** 🔍✨

## Quick Reference

```bash
# Find all cursor branches (potential agents)
git branch -r | grep cursor/

# Check for PDCAs on a branch
git ls-tree -r origin/[branch] | grep -E "pdca|PDCA"

# See last activity
git log origin/[branch] --oneline -5

# Prepare for recovery
git checkout [branch]
git checkout save/start.v1 -- README.md scrum.pmo/roles/_shared/PDCA/
```

**Remember**: Every branch tells a story, every PDCA reveals purpose, together they resurrect identity.