# Pending Agent Identification

## Status: ⏳ Awaiting RequestID Assignment

---

## 📝 AGENT FILLS THIS AUTOMATICALLY

### Session Information (Agent Auto-Fills)
- **Start Time:** `$(date -u +"%Y-%m-%d-UTC-%H%M")`  ← Agent runs this command
- **Working Branch:** `$(git branch --show-current)`  ← Agent runs this command
- **Registration Type:** Self-registered unknown agent

---

## 👤 USER MUST DECIDE THIS (Agent Asks User)

### Agent Declaration (What You Want To Do)
- **Intended Role:** `USER DECIDES (e.g., Developer, BackendAgent, SaveRestartAgent)`
- **Session Purpose:** `USER DECIDES (e.g., Update README files, Fix bug in component X)`
- **Expected Duration:** `USER DECIDES (e.g., Quick Session 1-2 hours, Half-day Session 2-4 hours)`
- **Suggested Name (Optional):** `USER CAN SUGGEST (e.g., "readme-updater", "bug-fix-agent") - QA will finalize`

---

## ⏳ WAIT FOR QA (TRON Assigns These - Agent/User Cannot Know)

### QA Will Assign:
- **RequestID:** `bc-[UUID]` ← QA generates using uuidgen
- **Official Agent Name:** ← QA finalizes based on role/purpose
- **File Rename:** From `pending-unknown-*.md` to `bc-[UUID].md`

### Required QA Action
1. ✅ Review agent declaration above
2. ✅ Generate RequestID: `bc-$(uuidgen | tr '[:upper:]' '[:lower:]')`
3. ✅ Assign official agent name based on role and purpose
4. ✅ Rename file from `pending-unknown-YYYY-MM-DD-UTC-HHMM.md` to `bc-[UUID].md`
5. ✅ Replace entire file content with complete identity format below

---

## 📋 REFERENCE: Final Format (After QA Assigns RequestID)

**⚠️ DO NOT EDIT THIS SECTION - This is just a reference showing what the final format will look like**

```markdown
# Agent Identity Record

## RequestID: bc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  ← QA assigns this

### Identity
- **Current Name:** [QA assigns official name]
- **Role:** [QA confirms role from user decision]
- **Purpose:** [QA documents from user's session purpose]

### Current Status
- **Status:** ✅ Active
- **Branch:** dev/YYYY-MM-DD-UTC-HHMM
- **Session:** scrum.pmo/project.journal/YYYY-MM-DD-UTC-HHMM-session

### Core Responsibilities
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Additional responsibilities...]

### Integration Points
- **Reports To:** [Role/Person]
- **Collaborates With:** [Other agents/roles]
- **Output Location:** [Where work is stored]
```

---

**"Every agent deserves an identity"** 🆔

---

## 🎯 Quick Start Instructions

### For New Agents (You):
1. Copy this template to create: `pending-unknown-YYYY-MM-DD-UTC-HHMM.md`
2. **Auto-fill** Session Information using commands shown (timestamp, branch)
3. **Ask USER** for Agent Declaration (role, purpose, duration, optional name suggestion)
4. Fill in user's answers to the 4 questions above
5. Commit and push the file
6. Wait for QA (TRON) to assign RequestID and official name
7. **NOTE:** Agent cannot know RequestID or official name - only QA assigns these

### For QA (TRON):
1. Review agent declaration (role, purpose, duration, suggested name)
2. Generate RequestID: `bc-$(uuidgen | tr '[:upper:]' '[:lower:]')`
3. Assign official agent name based on role/purpose/suggestion
4. Rename file: `mv pending-unknown-YYYY-MM-DD-UTC-HHMM.md bc-[UUID].md`
5. Replace entire content with complete identity format (see reference above)
6. Fill in: RequestID, official name, role, purpose, status, branch, session
7. Remove all pending/template sections
8. Commit and push the finalized agent identity
