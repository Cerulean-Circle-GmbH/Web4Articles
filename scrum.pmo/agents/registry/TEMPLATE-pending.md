<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# ⚠️ DEPRECATED - USE NEW WORKFLOW

## This Template is Obsolete

**Old workflow:** Agent creates pending file, waits for QA to assign RequestID  
**New workflow:** User provides RequestID in startup Decision 5, agent creates complete identity immediately

---

## ✅ NEW WORKFLOW (Use This Instead)

### For New Agents:

1. **Present 5 startup decisions to user** (see README.md § Startup Decision Framework):
   - Decision 1: Primary Work Focus Area
   - Decision 2: Agent Role Selection
   - Decision 3: Session Duration Planning
   - Decision 4: PDCA Organization Location
   - **Decision 5: Agent Identity** (RequestID and Agent Name)

2. **User provides:**
   - RequestID (e.g., `bc-readme-updater` or `bc-$(uuidgen | tr '[:upper:]' '[:lower:]')`)
   - Agent Name (e.g., "README Maintenance Agent")

3. **Agent creates complete identity file:**
   - Use template: `TEMPLATE-agent-identity.md`
   - Fill in all fields from user's 5 decisions
   - Save as: `scrum.pmo/agents/registry/[RequestID].md`
   - Commit and push

4. **Done!** No waiting for QA, no pending status, complete identity from the start.

---

## 📋 Template Reference

**Use this template instead:**  
→ [scrum.pmo/agents/registry/TEMPLATE-agent-identity.md](TEMPLATE-agent-identity.md)

**Startup decision framework:**  
→ [README.md § Startup Decision Framework](../../README.md#-startup-decision-framework)

---

## 🔄 Migration Note

All existing `pending-unknown-*.md` files should be:
1. Reviewed for user's original intent
2. User provides RequestID and Name (Decision 5)
3. Converted to complete identity using new template
4. Renamed from `pending-unknown-*.md` to `[RequestID].md`

---

**"Every agent gets immediate identity"** ⚡🆔
