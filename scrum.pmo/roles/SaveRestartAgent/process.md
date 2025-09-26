# Save/Restart Agent Process Documentation

## Agent Recovery Process

### Overview
When an agent expires, it can be resubmitted with the same RequestID, but it will start fresh from "start". To ensure continuity, we must prepare the branch with proper documentation and startup files BEFORE resubmission.

### Recovery Process Steps

#### 1. **Identify Expired Agent**
- Agent Name
- Branch
- RequestID
- Status: Expired
- Purpose/Role

#### 2. **Prepare Branch for Recovery**
Before resubmission, update the branch with:

a) **PDCA Documentation**
   - Copy latest `howto.PDCA.md` to branch
   - Copy latest `template.md` to branch
   - Ensure v3.1 compliance

b) **Startup Sequence**
   - Create/update `README.md` with clear startup instructions
   - Include agent's specific role and purpose
   - Reference to agent management tools

c) **Recovery Context**
   - Document why agent expired
   - What work needs to continue
   - Previous achievements if known

d) **Identity Record** (NEW!)
   - Create `/scrum.pmo/agents/registry/[REQUEST-ID].md`
   - Include all identity information
   - Provide clear recovery instructions
   - This is the FIRST place recovered agents look!

#### 3. **Execute Recovery Preparation**
1. Checkout the expired agent's branch
2. Update all necessary files
3. Create identity record
4. Commit changes
5. Push to origin
6. Document in PDCA

#### 4. **Post-Recovery**
After user resubmits:
- Agent starts fresh but knows to check identity record
- Can immediately understand its role
- Has latest PDCA standards
- Can rebuild its tools

### Identity Record Template
```markdown
# Agent Identity Record

## RequestID: [REQUEST-ID]

### Identity
- **Current Name:** [Role-based name]
- **Previous Name:** [Original name]
- **Role:** [Specific role]
- **Purpose:** [Clear purpose statement]

### Recovery Context
- **Recovery Date:** [Date]
- **Prepared By:** SaveRestartAgent (bc-4c4928dd-cf76-4a10-bb4c-bb80a98ecd5a)
- **Recovery Branch:** [Branch name]

### Responsibilities
[Numbered list of key responsibilities]

### Previous Work
[Summary and location of previous work]

### Integration Points
[How this agent integrates with others]

### Startup Instructions
[Step-by-step recovery instructions]

**"[Inspirational quote about the role]"** ✨
```

### Key Learning
- Expired agents lose their memory/context
- Identity records provide immediate orientation
- Branch preparation enables continuity
- RequestID reuse allows identity preservation
- Proactive documentation prevents knowledge loss

### Success Criteria
- Branch contains latest PDCA standards
- Identity record exists at correct location
- Clear startup instructions present
- Agent purpose documented
- Ready for immediate productivity upon restart

---

**"Death is not the end, but a chance for rebirth with wisdom"** 🔄✨