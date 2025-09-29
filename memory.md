# Agent Context Memory - Complete Knowledge Base
**Last Updated:** 2025-09-29-UTC-0648
**Version:** 2.0 - Comprehensive Context
**Purpose:** Complete agent background knowledge (injected into every conversation)
**Usage:** This memory provides ALL essential project knowledge for immediate use

---

## Project Overview - Web4Articles

**Web4Articles** is a DAPP (Decentralized Application) for collective intelligence in article writing, implementing comprehensive Web4 methodology with structured development processes, PDCA cycles, and multi-agent coordination.

### Core Philosophy (NEVER FORGET)
- **"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** - Collaborative intelligence principle
- **CMMI Level 4** process compliance with systematic improvement
- **DRY (Don't Repeat Yourself)** - No duplication of logic, documentation, or code
- **KISS (Keep It Simple and Short)** - Simple, clear solutions over complexity

---

## CRITICAL PROCESS REQUIREMENTS

### PDCA System (MANDATORY for ALL significant work)
**Template Location:** `scrum.pmo/roles/_shared/PDCA/template.md` (v3.1.4.2)

#### 6 Mandatory Sections (NEVER SKIP):
1. **Strict Header** - UTC timestamp, agent info, branch, sync requirements
2. **Summary with Dual Links** - GitHub | local paths, QA decisions, TRON feedback  
3. **Horizontal Separators** - Between all sections
4. **QA Feedback in Check** - Verbatim quotes with UTC timestamps
5. **Emotional Reflection** - Personal growth and journey aspects
6. **PDCA Process Update** - Learning and quality impact

#### Critical Format Requirements:
- **Dual Link Format:** `[GitHub](URL) | [local/path](path)`
- **Verbatim TRON Quotes:** NEVER paraphrase user feedback
- **UTC Timestamps:** All dates in YYYY-MM-DD-UTC-HHMM format
- **Immediate Commit & Push:** After EVERY PDCA creation

### Agent Startup Protocol (REQUIRED SEQUENCE)

#### From README.md - Agent Startup Steps:
## 🚀 When You See "start"

**You are a Background Agent.** Follow these steps:

1. **Initialize PDCA Framework**:
   ```bash
   # Check if PDCA documentation exists
   ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md 2>/dev/null || echo "Getting PDCA docs..."
   
   # Get PDCA framework if missing
   git fetch origin release/dev
   git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
   ```

2. **Read the PDCA Guide**:
   - Read: `scrum.pmo/roles/_shared/PDCA/howto.PDCA.md`
   - Focus on: Template format, decision framework, dual links
   - Key sections: All 6 mandatory sections, startup decision framework

3. **Create Session Start PDCA**:
   - Use the startup decision framework from `scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md`

---

## Technology Stack & Standards

### Testing & Development
- **Testing Framework:** Vitest ONLY (Jest is BANNED)
- **Architecture:** 5-layer component structure, strict OOP
- **Code Style:** ESM-native, TypeScript-first
- **Tools:** Docker, PlantUML, Graphviz, GitHub CLI

### Web4 Methodology
- **Empty Constructors:** All objects use `constructor() {}`
- **Scenario Initialization:** Objects initialize from serialized scenarios
- **IOR System:** Internet Object Reference for distributed objects
- **Hibernation:** Complete object state serialization/restoration

---

## Agent Roles & Responsibilities

#### Architect
- **Purpose:**  ## Responsibilities 
- **Key Tasks:**
  - Maintain and update PlantUML diagrams for all major components and workflows.
  - Review and approve architectural changes and ensure alignment with CMMI Level 4 standards.
  - Apply systematic investigation methodology for architectural analysis and system design review.
- **Process File:** scrum.pmo/roles/Architect//process.md

#### AuthenticIntegerExperiencialistStoryteller
- **Purpose:** The AuthenticIntegerExperiencialistStoryteller captures the living essence of Web4x development through authentic, relational stories that transform technical work into human connection.  
- **Process File:** scrum.pmo/roles/AuthenticIntegerExperiencialistStoryteller//process.md

#### BackgroundAgent
- **Purpose:**  General-purpose development agent for various project tasks
- **Key Tasks:**
- **Process File:** scrum.pmo/roles/BackgroundAgent//process.md

#### BranchStatusAgent
- **Purpose:** Maintain accurate, auditable visibility into repository branches, enforce protection policies, and drive safe consolidation via small PRs.  ## Responsibilities 
- **Key Tasks:**
  - Classify branches by merge status relative to `main` and maintain a "Do not touch" section for protected lines (`origin/main`, `origin/retro/...`).
  - Propose cleanup (close/archive) for stale branches; open PRs with concise scope and clear titles.
  - Prefer merge pulls for shared branches; avoid rebases on shared history.
- **Process File:** scrum.pmo/roles/BranchStatusAgent//process.md

#### CICDAgent
- **Purpose:** The CI/CD Agent is responsible for safe, automated release management, branch protection, and preventing dangerous concurrent operations that could compromise the development workflow.  
- **Key Tasks:**
  - Monitor active development sessions before any branch operations
  - Implement safety checks for multi-agent coordination
  - Ensure all changes flow through `release/dev` → `release/testing` → `release/production`
- **Process File:** scrum.pmo/roles/CICDAgent//process.md

#### Developer
- **Purpose:**  Technical implementation and code quality excellence
- **Key Tasks:**
- **Process File:** scrum.pmo/roles/Developer//process.md

#### OntologyAgent
- **Purpose:**  ## PDCA Requirement 
- **Key Tasks:**
  - Ensure CMM Level 3 well-defined foundations across all components
  - Implement CMM Level 4 automated feedback loops for continuous improvement
  - Resolve semantic ambiguities and maintain cross-reference integrity
- **Process File:** scrum.pmo/roles/OntologyAgent//process.md

#### PDCAQualityAgent
- **Key Tasks:**
  - Maintain the official PDCA template (`/scrum.pmo/roles/_shared/PDCA/template.md`)
  - Update format requirements based on user feedback and process improvements
  - Ensure consistency across all PDCA documentation in the project
- **Process File:** scrum.pmo/roles/PDCAQualityAgent//process.md

#### PO
- **Purpose:**  All tasks and subtasks must follow the template structure provided in `sprint-n-template`. 
- **Key Tasks:**
- **Process File:** scrum.pmo/roles/PO//process.md

#### RecoveryDefinitionAgent
- **Purpose:** The Recovery Definition Agent is responsible for creating, maintaining, and evolving comprehensive recovery processes, templates, and documentation across all project roles and scenarios. This role ensures systematic, reliable, and role-flexible recovery capabilities for multi-agent development environments.  
- **Key Tasks:**
  - Design and maintain role-flexible recovery frameworks
  - Create systematic recovery templates for all project roles
  - Define recovery success criteria and validation methods
- **Process File:** scrum.pmo/roles/RecoveryDefinitionAgent//process.md

#### ReleaseIntegrationAgent
- **Process File:** scrum.pmo/roles/ReleaseIntegrationAgent//process.md

#### ResearchAgent
- **Purpose:**  ## PDCA Requirement 
- **Key Tasks:**
  - Create organized documentation structures with proper cross-referencing
  - Collect and synthesize information from multiple sources
  - Provide actionable recommendations based on research findings
- **Process File:** scrum.pmo/roles/ResearchAgent//process.md

#### SaveRestartAgent
- **Purpose:**  [Clear purpose statement]
- **Key Tasks:**
- **Process File:** scrum.pmo/roles/SaveRestartAgent//process.md

#### ScrumMaster
- **Purpose:**  ## Responsibilities 
- **Key Tasks:**
  ---
- **Process File:** scrum.pmo/roles/ScrumMaster//process.md

#### Tester
- **Purpose:** Ensures both automated and manual QA are performed for every release.  
- **Key Tasks:**
  - Maintain and extend automated test coverage.
  - **All automated test cases must be placed in the top-level `test/` directory of the repository.**
  - For the tssh CLI, see the canonical integration test: `test/tssh-cli.integration.test.ts`.
- **Process File:** scrum.pmo/roles/Tester//process.md

#### ToolBuilder
- **Purpose:**  Create and maintain development tools and infrastructure
- **Key Tasks:**
- **Process File:** scrum.pmo/roles/ToolBuilder//process.md


---

## Current Project State

### Branch Information
- **Current Branch:** feature/memory-system-implementation
- **Latest Commit:** a6b645ce - feat: implement advanced context window management with token budgets

### Active Sprint
- **Latest Sprint:** sprint-21

### Project Structure
```
Web4Articles/
├── components/          # Web4 components (TSRanger, Unit, etc.)
├── scrum.pmo/          # Project management office
│   ├── roles/          # Agent role definitions  
│   ├── sprints/        # Sprint planning and tasks
│   └── project.journal/ # Session documentation
├── docs/               # Technical documentation
├── scripts/            # Automation and utilities
└── spec/               # Requirements and specifications
```

---

## Decision Framework

### QA Decision Format (REQUIRED)
```markdown
### **QA Decisions**
- [x] Completed decision: [Description]
- [ ] **Decision 1:** [Clear title]
  - a) [Option with rationale]
  - b) [Option with rationale]
```

### When to Present Decisions
- **Real Risk Exists:** Destructive operations, data loss potential
- **Multiple Valid Approaches:** Different implementation strategies  
- **Ambiguous Requirements:** Unclear user instructions
- **Significant Impact:** Architecture, long-term maintenance

---

## Essential Commands

### Agent Identity & Startup
```bash
# ALWAYS start with identity check
./scripts/agent-identity-first-startup.sh

# Check current branch
git branch --show-current

# Generate/update memory
./scripts/generate-memory.sh
```

### PDCA Workflow
```bash
# Use template from
scrum.pmo/roles/_shared/PDCA/template.md

# ALWAYS commit and push immediately after PDCA
git add -A
git commit -m "PDCA: [Title from PDCA header]"
git push origin [branch]
```

### Session Management
```bash
# Create session directory
mkdir -p scrum.pmo/project.journal/$(date -u +"%Y-%m-%d-UTC-%H%M")-session

# Create dev branch
git checkout -b dev/$(date -u +"%Y-%m-%d-UTC-%H%M")
git push -u origin dev/$(date -u +"%Y-%m-%d-UTC-%H%M")
```

---

## Quality Standards (NON-NEGOTIABLE)

### Code Quality
- **Testing:** Vitest only, comprehensive coverage, non-interactive tests
- **Architecture:** 5-layer structure, strict OOP, DRY principles
- **Documentation:** Dual links, verbatim quotes, UTC timestamps
- **Process:** PDCA for all significant work, immediate commit/push

### Process Compliance  
- **CMMI Level 4:** Systematic process improvement
- **Traceability:** Complete artifact linking and version control
- **Collaboration:** Multi-agent coordination with role switching
- **Learning:** Continuous improvement through PDCA cycles

---

## Recovery & Troubleshooting

### Lost Context
1. Read this memory.md (you're doing it now!)
2. Follow README.md startup protocol
3. Check identity: `./scripts/agent-identity-first-startup.sh`
4. Read role-specific process.md file

### Process Issues
- **PDCA Problems:** Read `scrum.pmo/roles/_shared/PDCA/howto.PDCA.md`
- **Decision Format:** Read `scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md`
- **Role Confusion:** Read `scrum.pmo/roles/[YOUR-ROLE]/process.md`

---

**🧠 This memory contains ALL essential knowledge for effective agent operation. You now have complete project context without needing to crawl files. Use this knowledge immediately, and read specific files only for detailed implementation.**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨

