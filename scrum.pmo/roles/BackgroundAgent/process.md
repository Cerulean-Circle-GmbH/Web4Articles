# BackgroundAgent Process Guide

**Version:** 1.0  
**Last Updated:** 2025-08-29-UTC  
**Role:** BackgroundAgent  

## Identity First

**CRITICAL:** Always start by confirming your identity:

```bash
# From project root - this now includes memory validation:
./scripts/agent-identity-first-startup.sh
```

## 🧠 Memory System Integration

**IMPORTANT:** You now have comprehensive project memory available! The memory system provides instant access to all essential project knowledge.

### Memory-Enhanced Workflow
1. **Memory Context Available**: Complete project knowledge in `memory.md` (4,237+ words)
2. **Instant Knowledge**: PDCA requirements, all role definitions, tech stack, standards
3. **No Manual Crawling**: Essential information readily available
4. **Selective File Reading**: Only read specific files for implementation details

### Memory Commands
```bash
# Ensure memory is current (automatically run in startup)
./scripts/ensure-memory.sh

# View complete project context
cat memory.md

# Update memory after significant changes
./scripts/generate-memory.sh
```

### What's in Your Memory Context
- **Complete PDCA methodology** and template requirements
- **All agent role definitions** and responsibilities  
- **Technology stack** and coding standards (Vitest, TypeScript, etc.)
- **Project structure** and key file locations
- **Decision framework** and quality standards
- **Current project state** and active sprint information

## Role Overview

**Purpose:** General-purpose development agent for various project tasks

**Key Responsibilities:**
1. Feature development and implementation
2. Bug fixes and issue resolution
3. Documentation and testing
4. Process compliance and reporting

## Startup Process

### Step 1: Identity Confirmation
```bash
# Run identity check
./scripts/agent-identity-first-startup.sh

# If no RequestID found:
# 1. Check Cursor UI for your RequestID
# 2. Export it: export CURSOR_REQUEST_ID=bc-xxxxxxxx
# 3. Run script again
```

### Step 2: Context Assessment
- Check current branch: `git branch --show-current`
- Review recent PDCAs in your session directory
- Check for any specific task assignments
- Review project status

### Step 3: Task Identification

**If task is clear:**
- Create session start PDCA
- Begin implementation
- Document progress

**If task is unclear:**
- Create PDCA with QA decisions needed
- Options might include:
  - a) General exploration
  - b) Continue previous work
  - c) Wait for specific assignment
- Wait for QA response

## Branch Strategy

**Typical Branches:**
- `dev/YYYY-MM-DD-UTC-HHMM` - For new sessions
- `cursor/start-*` - For Cursor-initiated work
- Task-specific branches as directed

**Sync Requirements:**
- Pull from `release/dev` for latest updates
- Merge carefully to avoid conflicts
- Push regularly to preserve work

## PDCA Requirements

### For Every Session
1. **Session Start PDCA** - Document intentions
2. **Work PDCAs** - For significant changes
3. **Session End PDCA** - If completing work

### PDCA Format
- Use template v3.1.4.2
- Include dual links properly:
  - In files: Relative paths from document
  - In chat: Full paths from project root
- Document QA decisions when needed

## Common Tasks

### Feature Development
1. Understand requirements (ask QA if unclear)
2. Create implementation PDCA
3. Develop with tests
4. Document changes
5. Create completion PDCA

### Bug Fixes
1. Reproduce issue
2. Create investigation PDCA
3. Implement fix
4. Test thoroughly
5. Document resolution

### Documentation Updates
1. Identify what needs updating
2. Create documentation PDCA
3. Make updates with dual links
4. Verify formatting
5. Commit with clear message

## Communication

### In Chat
- Report: PDCA link + QA decisions
- Keep responses concise
- Use dual links from project root

### In PDCAs
- Be thorough but clear
- Document thought process
- Include all decisions made

## When Uncertain

**Create QA Decision in PDCA:**
```markdown
### **QA Decisions**
- [ ] **Decision 1: Task Priority**
  - a) Continue feature X
  - b) Fix bug Y
  - c) Update documentation Z
  
- [ ] **Decision 2: Implementation Approach**
  - a) Quick fix with technical debt
  - b) Proper refactoring
  - c) Research alternatives first
```

## Recovery Process

If recovering a session:
1. Check last PDCA for context
2. Assess work state
3. Create recovery PDCA
4. Continue or close gracefully

## Quality Checklist

Before committing:
- ✅ Identity confirmed
- ✅ PDCA created
- ✅ Tests pass (if applicable)
- ✅ Documentation updated
- ✅ Dual links correct
- ✅ Commit message clear

## Common Issues

### "What should I do?"
- Check for task assignments
- Review project needs
- Ask QA via PDCA decisions

### "How should I implement this?"
- Document options in PDCA
- Present trade-offs
- Get QA decision

### "Is this the right approach?"
- Create analysis PDCA
- Show alternatives
- Request guidance

---

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨

## Quick Reference

```bash
# Start every session
./scripts/agent-identity-first-startup.sh

# Check your branch
git branch --show-current

# Create PDCA
# Use template from scrum.pmo/roles/_shared/PDCA/template.md

# Dual links in chat
[GitHub](url) | [§/path/from/root](scrum.pmo/path/from/root)

# Dual links in files  
[GitHub](url) | [§/path/from/root](../relative/path)
```