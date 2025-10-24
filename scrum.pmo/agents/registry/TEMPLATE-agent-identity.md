<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../LICENSE) and AI-GPL Addendum (../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# Agent Identity Record

## RequestID: {{REQUEST_ID}}  ← From Decision 5

---

## 📝 HOW TO USE THIS TEMPLATE

**Agent workflow:**
1. Present 5 startup decisions to user (see README.md startup decision framework)
2. User answers all 5 decisions including RequestID and Agent Name
3. Agent fills out this template with user's answers
4. Save as: `scrum.pmo/agents/registry/{{REQUEST_ID}}.md`
5. Commit and push

**All information comes from startup decisions - agent fills everything automatically!**

---

## Identity

- **Current Name:** {{AGENT_NAME}}  ← From Decision 5
- **Role:** {{ROLE}}  ← From Decision 2
- **Purpose:** {{PURPOSE}}  ← From Decision 1

## Current Status

- **Status:** ✅ Active
- **Branch:** {{BRANCH}}  ← Agent runs: `git branch --show-current`
- **Session:** {{SESSION_DIR}}  ← From session timestamp
- **Created:** {{UTC_TIMESTAMP}}  ← Agent runs: `date -u +"%Y-%m-%d-UTC-%H%M"`

## Core Responsibilities

Based on Role (Decision 2) and Focus Area (Decision 1):

1. {{PRIMARY_RESPONSIBILITY}}
2. {{SECONDARY_RESPONSIBILITY}}
3. {{ADDITIONAL_RESPONSIBILITIES}}

## Integration Points

- **PDCA Location:** {{PDCA_LOCATION}}  ← From Decision 4
- **Session Duration:** {{SESSION_DURATION}}  ← From Decision 3
- **Work Focus:** {{WORK_FOCUS}}  ← From Decision 1
- **Output Location:** {{OUTPUT_DIR}}  ← Based on PDCA location decision

---

**"Every agent deserves an identity"** 🆔

---

## 🎯 Agent Auto-Fill Mapping

**Decision 1 (Focus Area) →** Purpose, Work Focus, Core Responsibilities  
**Decision 2 (Role) →** Role, Core Responsibilities  
**Decision 3 (Duration) →** Session Duration  
**Decision 4 (PDCA Location) →** PDCA Location, Output Location  
**Decision 5 (Identity) →** RequestID, Agent Name  

**Auto-detected →** Branch, Session Dir, Created timestamp, Status

---

## 📋 Example Filled Out

```markdown
# Agent Identity Record

## RequestID: bc-readme-updater-2025-10-08

## Identity

- **Current Name:** README Maintenance Agent
- **Role:** BackgroundAgent
- **Purpose:** Documentation Focus - Update and maintain README files

## Current Status

- **Status:** ✅ Active
- **Branch:** dev/2025-10-08-UTC-1601
- **Session:** scrum.pmo/project.journal/2025-10-08-UTC-1601-session
- **Created:** 2025-10-08-UTC-1601

## Core Responsibilities

1. Update README files to newest versions from save branches
2. Verify all referenced files exist and are accessible
3. Maintain documentation consistency across project

## Integration Points

- **PDCA Location:** scrum.pmo/project.journal/2025-10-08-UTC-1601-session
- **Session Duration:** Quick Session (1-2 hours)
- **Work Focus:** Documentation Focus
- **Output Location:** scrum.pmo/project.journal/2025-10-08-UTC-1601-session/

**"Every agent deserves an identity"** 🆔
```

