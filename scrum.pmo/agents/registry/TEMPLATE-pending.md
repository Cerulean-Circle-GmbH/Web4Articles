# Pending Agent Identification

## Status: ⏳ Awaiting RequestID Assignment

---

## 📝 FILL THIS OUT NOW (Agent Self-Registration)

### Session Information
- **Start Time:** `PASTE UTC TIMESTAMP HERE (e.g., 2025-10-08-UTC-1601)`
- **Working Branch:** `PASTE YOUR BRANCH HERE (e.g., dev/0350)`
- **Registration Type:** Self-registered unknown agent

### Agent Declaration (What You Want To Do)
- **Intended Role:** `PASTE ROLE HERE (e.g., Developer, BackendAgent, SaveRestartAgent)`
- **Session Purpose:** `PASTE PURPOSE HERE (e.g., Update README files, Fix bug in component X)`
- **Expected Duration:** `PASTE DURATION HERE (e.g., Quick Session 1-2 hours, Half-day Session 2-4 hours)`

---

## ⏳ WAIT FOR QA (TRON Will Fill This Section)

### Required QA Action
1. ✅ Review agent declaration above
2. ✅ Generate and provide RequestID for this agent
3. ✅ Rename this file from `pending-unknown-YYYY-MM-DD-UTC-HHMM.md` to `[RequestID].md`
4. ✅ Update with complete identity information using format below

---

## 📋 REFERENCE: Final Format (After QA Assigns RequestID)

**⚠️ DO NOT EDIT THIS SECTION - This is just a reference showing what the final format will look like**

```markdown
# Agent Identity Record

## RequestID: bc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

### Identity
- **Current Name:** [Agent's chosen name]
- **Role:** [Assigned role]
- **Purpose:** [Mission statement]

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
2. Fill in the **"FILL THIS OUT NOW"** section (lines 7-15)
3. Commit and push the file
4. Wait for QA (TRON) to assign RequestID

### For QA (TRON):
1. Review agent declaration
2. Generate RequestID: `bc-$(uuidgen | tr '[:upper:]' '[:lower:]')`
3. Rename file: `mv pending-unknown-*.md bc-[UUID].md`
4. Update file with complete identity using reference format
5. Remove pending sections, keep only final format
6. Commit and push
