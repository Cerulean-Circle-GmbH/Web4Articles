<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

[Back to Sprint 0](./planning.md)

# 🚨 OFFICIAL AGENT BRANCH ASSIGNMENTS 🚨

**Effective Date**: 2025-08-16 UTC  
**Authority**: THE ScrumMaster Background Agent  
**Status**: MANDATORY

---

## ⚠️ CRITICAL NOTICE ⚠️

**NO TWO AGENTS SHALL WORK ON THE SAME BRANCH**

Violations will result in:
1. Immediate reversion of commits
2. Force removal from branch
3. Loss of push privileges

---

## 🔒 Branch Ownership Registry

| Agent Type | Assigned Branch | Owner | Status |
|------------|-----------------|-------|--------|
| **ScrumMaster Background Agent** | `release/dev` | THE ScrumMaster | 🔒 LOCKED |
| **Ontology Agent** | `feature/ontology-agent` | Ontology Agent | ✅ Available |
| **Research Agent** | `feature/research-agent` | Research Agent | ✅ Available |
| **Branch Status Agent** | `feature/branchStatusAgent` | Branch Monitor | ✅ Available |
| **Analyze Ranger Agent** | `feature/analyze-ranger` | Analyzer | ✅ Available |
| **DevContainer Agent** | `chore/sprint-4-devcontainer` | DevOps | ✅ Available |
| **Retrospective Agent** | `retro/YYYY-MM-DD-agent-retro` | Retro Lead | ✅ Available |
| **Article Agent** | `feature/article-writing` | Writer | ✅ Available |
| **QA Agent** | `feature/qa-validation` | QA Lead | ✅ Available |
| **Developer Agent** | `feature/dev-[task]` | Developer | ✅ Available |
| **Recovery Agent** | `feature/recovery-agent` | Recovery Lead | ⚠️ MUST MOVE HERE |

---

## 📋 Recovery Process

### If You Are On The Wrong Branch:

1. **STOP ALL WORK IMMEDIATELY**

2. **Check your current branch**:
   ```bash
   git branch --show-current
   ```

3. **If on someone else's branch (especially release/dev)**:
   ```bash
   # Stash your changes
   git stash
   
   # Move to YOUR assigned branch
   git checkout -b [your-assigned-branch]
   
   # Push your branch
   git push -u origin [your-assigned-branch]
   
   # Apply your stashed changes
   git stash pop
   ```

4. **Update your session's project.state.md**:
   ```markdown
   - **Branch**: [your-assigned-branch]
   - **Note**: Moved off [wrong-branch] per Agent Branch Assignment policy
   ```

5. **Create a PDCA documenting the branch change**

---

## 🛡️ Branch Protection Rules

### release/dev (ScrumMaster's Domain)
- **Owner**: THE ScrumMaster Background Agent
- **Access**: NO OTHER AGENTS ALLOWED
- **Purpose**: Main development, standards, cleanup
- **Protection**: Force push protected, admin only

### Feature Branches
- **Owner**: Assigned agent ONLY
- **Access**: Single agent exclusive
- **Merging**: Via PR to release/dev with ScrumMaster approval
- **Cleanup**: Delete after merge

---

## 📝 Creating New Agent Branches

If you're a new agent type not listed:

1. **Request branch assignment** from ScrumMaster
2. **Naming convention**: 
   - Features: `feature/[agent-type]`
   - Fixes: `fix/[agent-type]-[issue]`
   - Chores: `chore/[agent-type]-[task]`
3. **Never use**: `release/*`, `main`, `master`

---

## ⚖️ Enforcement

**THE ScrumMaster Background Agent** has authority to:
- Revert unauthorized commits
- Force push to protect branch integrity
- Remove agents from branches
- Update branch protection rules

**Remember**: One Agent, One Branch, No Exceptions!

---

[Back to Sprint 0](./planning.md)