<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 🤖 Active Agents Registry
**Last Updated**: 2025-08-16 19:56 UTC
**Update Method**: Automated via `scripts/detect-active-agents.sh`

---

## 🌐 Background Agents (Cloud/Remote)

| Agent | Role | Branch | Status | Last Activity | Session Link |
|-------|------|--------|--------|---------------|--------------|
| **Recovery Agent** | Recovery | `feature/recovery-agent` | 🟢 Active | Today | [View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/feature/recovery-agent) |
| **THE ScrumMaster** | ScrumMaster | `release/dev` | 🟢 Active NOW | Today | [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/project.journal/2025-08-16-1854/project.state.md) [./2025-08-16-1854/project.state.md](file:///workspace/scrum.pmo/project.journal/2025-08-16-1854/project.state.md) |
| **Branch Status Agent** | DevOps | `feature/branchStatusAgent` | 🟢 Active | Yesterday | [View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/feature/branchStatusAgent) |
| **Ontology Agent** | Research | `feature/ontology-agent` | 🔵 Semi-active | 3 days ago | [View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/feature/ontology-agent) |
| **Research Agent** | Research | `feature/research-agent` | 🔵 Semi-active | 4 days ago | [View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/feature/research-agent) |
| **Article Agent** | Article | `feature/article-agent` | ⚫ Dormant | No commits | [View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/feature/article-agent) |
| **Developer Agent** | Developer | `feature/developer-agent` | ⚫ Dormant | No commits | [View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/feature/developer-agent) |
| **QA Agent** | QA | `feature/qa-agent` | ⚫ Dormant | No commits | [View Branch](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/feature/qa-agent) |

### Status Legend
- 🟢 **Active**: Currently working or very recent activity (< 24h)
- 🔵 **Semi-active**: Recent commits but not currently active (< 7 days)
- ⚫ **Dormant**: No recent activity (> 7 days)
- 🔴 **Violation**: Working on wrong branch (requires immediate action)

---

## 💻 Local Processes

| Process | Type | Count | Status |
|---------|------|-------|--------|
| Cursor Processes | Editor/Server | 29 | 🟢 Running |
| Git Operations | VCS | Active | 🟢 Running |
| Terminal Session | Shell | 1 | 🟢 Active (THE ScrumMaster) |

---

## 🔒 Branch Ownership Rules

**CRITICAL**: One Agent = One Branch Policy (See [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/release/dev/scrum.pmo/sprints/sprint-0/agent-branch-assignments.md) [./sprints/sprint-0/agent-branch-assignments.md](file:///workspace/scrum.pmo/sprints/sprint-0/agent-branch-assignments.md))

| Branch | Owner | Lock Status |
|--------|-------|-------------|
| `feature/research-agent` | Research Agent | 🔐 Assigned |
| `feature/article-agent` | Article Agent | 🔐 Assigned |
| `feature/branchStatusAgent` | Branch Status Agent | 🔐 Assigned |
| `feature/recovery-agent` | Recovery Agent | 🔐 Assigned |
| `feature/qa-agent` | QA Agent | 🔐 Assigned |
| `feature/developer-agent` | Developer Agent | 🔐 Assigned |
| `feature/ontology-agent` | Ontology Agent | 🔐 Assigned |
| `release/dev` | THE ScrumMaster | 🔒 EXCLUSIVE |
