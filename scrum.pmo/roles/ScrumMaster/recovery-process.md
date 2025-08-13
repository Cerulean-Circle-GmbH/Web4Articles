[Back to ScrumMaster Role](../)

# Recovery from README Process

## Overview
This document defines the canonical recovery process for AI agents when context is lost or when explicitly asked to "recover". The process ensures consistency, completeness, and proper branch management.

## Project Status Reporting Requirements (Canonical)
- This document is the canonical source for the structure and content of project status/journal entries.
- Follow "Phase 3: Journal Entry Creation" and "Phase 4: Project Status Report" below for the required sections, including the GitHub Quick Links and verification checklist.

## Critical Requirements

### 1. Always Start from release/dev
- **MANDATORY**: Recovery MUST begin by checking out the `release/dev` branch
- This ensures all latest changes and integrations are present
- Never start recovery from `main` or any other branch

### 2. Create Background Agent Branch
- After checking out `release/dev`, create a new background agent branch:
  - Pattern: `cursor/recovery-YYYY-MM-DD-HHMM`
  - Example: `cursor/recovery-2025-08-11-1745`

### 3. Complete Recovery Before Implementation
- Recovery ends with a project status report
- NO implementation or testing during recovery
- Only after recovery is complete should any new work begin

## Recovery Process Steps

### Phase 1: Environment Setup
```bash
# 1. Ensure on release/dev
git fetch origin
git checkout release/dev
git pull origin release/dev

# 2. Create recovery branch
TIMESTAMP=$(date -u +"%Y-%m-%d-%H%M")
BRANCH_NAME="cursor/recovery-${TIMESTAMP}"
git checkout -b "$BRANCH_NAME"

# 3. Verify environment
docker version
node --version
npm --version
```

### Phase 2: Context Recovery
1. **Read Core Documents**
   - `/workspace/README.md` - Project overview and principles
   - `/workspace/wiki/Ontology.md` - Key terminology
   - `/workspace/scrum.pmo/project.journal/*/project.state.md` - Latest state


2. **Check Role Processes**
   - Review all `/workspace/scrum.pmo/roles/*/process.md`
   - Note role-specific recovery steps
   - Identify active roles and responsibilities

3. **Sprint & Task Status**
   - Review `/workspace/scrum.pmo/sprints/*`
   - Identify current sprint and active tasks
   - Check task completion status

### Phase 3: Journal Entry Creation
```bash
# Create new journal entry
JOURNAL_DIR="/workspace/scrum.pmo/project.journal/${TIMESTAMP}"
mkdir -p "$JOURNAL_DIR"

# Create project.state.md from canonical template
TEMPLATE="/workspace/scrum.pmo/templates/project.state.template.md"
sed "s/{{TIMESTAMP}}/${TIMESTAMP} UTC/g" "$TEMPLATE" > "$JOURNAL_DIR/project.state.md"

# Commit journal entry
git add "$JOURNAL_DIR/project.state.md"
git commit -m "docs: Create recovery journal entry ${TIMESTAMP}"
git push origin "$BRANCH_NAME"
```

### Phase 4: Project Status Report
Before ANY implementation work, create and deliver the status report using the canonical journal template and example:

- Canonical template: [`scrum.pmo/templates/project.state.template.md`](../templates/project.state.template.md)
- Recent example: [`scrum.pmo/project.journal/2025-08-12-0900/project.state.md`](../project.journal/2025-08-12-0900/project.state.md)

Ensure the journal includes GitHub Quick Links and navigation-friendly markdown links throughout.

## Post-Recovery Actions

Only AFTER the status report is delivered:
1. Implementation work can begin
2. Create feature branches as needed
3. Follow normal development workflow

## Common Issues

### Missing release/dev
If `release/dev` doesn't exist locally:
```bash
git fetch origin release/dev:release/dev
git checkout release/dev
```

### Uncommitted Changes
Before switching branches:
```bash
git stash push -m "Pre-recovery work"
# After recovery:
git stash list  # Note stash reference
```

### Environment Issues
Document in journal but continue recovery:
- Missing tools
- Version mismatches
- Configuration problems

## Verification Checklist

- [ ] Started from release/dev branch
- [ ] Created background agent branch
- [ ] Read all core documents
- [ ] Created journal entry with GitHub repo/branch/PR links
- [ ] Pushed recovery branch
- [ ] Delivered status report
- [ ] NO implementation during recovery
- [ ] NO testing during recovery

## References
- README.md recovery section
- CMMI Level 4 requirements
- Project journal standards