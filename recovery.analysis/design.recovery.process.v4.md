# Recovery Process Design V4 - Comprehensive Role-Based Tree

## 🚨 **CRITICAL: PDCA FORMAT REQUIREMENTS - READ FIRST**

**MANDATORY:** All recovery processes MUST embed: [PDCA Format Requirements](./pdca-format-requirements-mandatory.md)

**NEVER FORGET:** Every role recovery MUST apply PDCA format requirements to ALL PDCAs created during recovery.

---

**Date:** 2025-08-18  
**Version:** 4.0  
**Objective:** Complete recovery decision tree with all role paths and deferred prerequisites

## ✅ Always Start Here

**ALWAYS USE**: `git checkout origin/feature/analyze-ranger`  
**THEN**: Create your branch and merge what you need  
See [Branch Strategy](./design.recovery.branch-strategy.md) for simple steps

## Recovery Decision Tree

```
START: Agent Recovery
│
├─[step:uuid:core-001-branch-001] Checkout Safe Branch
│  └─ git checkout origin/feature/analyze-ranger
│
├─[step:uuid:core-002-session-001] Create Session
│  └─ mkdir -p scrum.pmo/project.journal/$(date +%Y-%m-%d-%H%M)/pdca
│
└─[step:uuid:core-003-mode-001] Choose Recovery Mode
   │
   ├─ MODE 1: Full Recovery (Unknown Project)
   │  └─ Read README.md → Complex 45+ min process
   │
   ├─ MODE 2: Minimal Safe Recovery ⭐ RECOMMENDED
   │  ├─[step:uuid:mode2-001-folder-001] Create folders (30s)
   │  ├─[step:uuid:mode2-002-pdca-001] Create PDCA (2m)
   │  └─[step:uuid:mode2-003-context-001] Find context (2m)
   │     Total: ~5 minutes
   │
   └─ MODE 3: Role-Specific Recovery
      └─[step:uuid:mode3-001-role-001] Determine Role
         │
         ├─ DEVELOPER PATH
         │  ├─[step:uuid:dev-000-role-001] Confirm Role (30s)
         │  │  └─ cat scrum.pmo/roles/Developer/process.md
         │  │
         │  ├─[step:uuid:dev-001-env-001] Check Git ✅ (5s)
         │  │  └─ git --version
         │  │
         │  ├─[step:uuid:dev-001-env-002] Check Node.js ⚠️ DEFER (5s)
         │  │  └─ node --version → Skip if just reading code
         │  │
         │  ├─[step:uuid:dev-001-env-003] Check Docker ⚠️ DEFER (5s)
         │  │  └─ docker --version → Skip until devcontainer needed
         │  │
         │  ├─[step:uuid:dev-002-read-001] Read Principles (1m)
         │  │  └─ grep -A20 "First Principles" scrum.pmo/roles/Developer/process.md
         │  │
         │  ├─[step:uuid:dev-003-code-001] Explore Source (30s)
         │  │  └─ tree src/ts -L 2 || ls -la src/ts/
         │  │
         │  ├─[step:uuid:dev-004-task-001] Find Tasks (1m)
         │  │  └─ grep -r "Developer" scrum.pmo/sprints/sprint-8/
         │  │
         │  ├─[step:uuid:dev-005-setup-001] Install Dependencies ⚠️ DEFER
         │  │  └─ npm ci → Only when implementing
         │  │
         │  └─[step:uuid:dev-007-pdca-001] Start Work (2m)
         │     └─ Create PDCA and begin coding
         │     Total: ~6 minutes (without npm/docker)
         │
         ├─ SCRUMMASTER PATH
         │  ├─[step:uuid:sm-000-role-001] Confirm Role (30s)
         │  │  └─ cat scrum.pmo/roles/ScrumMaster/process.md
         │  │
         │  ├─[step:uuid:sm-001-env-001] Check Git ✅ (5s)
         │  │  └─ git --version → Only tool needed!
         │  │
         │  ├─[step:uuid:sm-002-read-001] AI Protocol (1m)
         │  │  └─ grep -A10 "AI Task Creation" scrum.pmo/roles/ScrumMaster/process.md
         │  │
         │  ├─[step:uuid:sm-003-sprint-001] Check Sprints (30s)
         │  │  ├─ ls -la scrum.pmo/sprints/
         │  │  └─ cat scrum.pmo/sprints/sprint-8/planning.md
         │  │
         │  ├─[step:uuid:sm-004-block-001] Find Impediments (1m)
         │  │  └─ grep -r "blocked\|impediment\|waiting" scrum.pmo/sprints/sprint-8/
         │  │
         │  ├─[step:uuid:sm-005-team-001] Team Activity (30s)
         │  │  └─ ls -lat scrum.pmo/project.journal/*/pdca/*.md | head -10
         │  │
         │  └─[step:uuid:sm-007-pdca-001] Start Facilitation (2m)
         │     └─ Create PDCA and remove impediments
         │     Total: ~5 minutes (minimal setup!)
         │
         ├─ PRODUCT OWNER PATH
         │  ├─[step:uuid:po-000-role-001] Confirm Role (30s)
         │  │  └─ cat scrum.pmo/roles/PO/process.md
         │  │
         │  ├─[step:uuid:po-001-env-001] Check Tools ✅ (5s)
         │  │  └─ echo "No special tools needed"
         │  │
         │  ├─[step:uuid:po-002-read-001] Read Responsibilities (1m)
         │  │  └─ grep -A15 "Responsibilities" scrum.pmo/roles/PO/process.md
         │  │
         │  ├─[step:uuid:po-003-backlog-001] Find Backlog (30s)
         │  │  └─ find . -name "requirements.md" -o -name "backlog.md" 2>/dev/null
         │  │
         │  ├─[step:uuid:po-004-sprint-001] Current Goals (30s)
         │  │  └─ cat scrum.pmo/sprints/sprint-8/planning.md
         │  │
         │  ├─[step:uuid:po-006-stories-001] Find Stories (1m)
         │  │  └─ grep -r "As a\|User story\|Acceptance" scrum.pmo/ | head -20
         │  │
         │  └─[step:uuid:po-007-pdca-001] Write Requirements (2m)
         │     └─ Create PDCA and define features
         │     Total: ~5 minutes (no tools!)
         │
         ├─ ARCHITECT PATH
         │  ├─[step:uuid:arch-000-role-001] Confirm Role (30s)
         │  │  └─ cat scrum.pmo/roles/Architect/process.md
         │  │
         │  ├─[step:uuid:arch-001-env-001] Check PlantUML ⚠️ DEFER (5s)
         │  │  └─ plantuml -version → Skip until rendering
         │  │
         │  ├─[step:uuid:arch-002-read-001] Design Patterns (1m)
         │  │  └─ grep -A20 "Role Definition" scrum.pmo/roles/Architect/process.md
         │  │
         │  ├─[step:uuid:arch-003-docs-001] Find Architecture (30s)
         │  │  └─ ls -la docs/architecture/
         │  │
         │  ├─[step:uuid:arch-004-puml-001] Check Diagrams (30s)
         │  │  └─ ls -la docs/puml/*.puml
         │  │
         │  ├─[step:uuid:arch-005-task-001] Current Design Tasks (1m)
         │  │  └─ grep -r "Architect" scrum.pmo/sprints/sprint-8/
         │  │
         │  ├─[step:uuid:arch-006-setup-001] PlantUML Setup ⚠️ DEFER
         │  │  └─ brew install plantuml graphviz → Only when rendering
         │  │
         │  └─[step:uuid:arch-007-pdca-001] Design Work (2m)
         │     └─ Create PDCA and specifications
         │     Total: ~6 minutes (without PlantUML)
         │
         ├─ TESTER PATH
         │  ├─[step:uuid:test-000-role-001] Confirm Role (30s)
         │  │  └─ cat scrum.pmo/roles/Tester/process.md
         │  │
         │  ├─[step:uuid:test-001-env-001] Check Node.js ⚠️ DEFER (5s)
         │  │  └─ node --version → Skip if planning tests
         │  │
         │  ├─[step:uuid:test-002-read-001] Test Framework (1m)
         │  │  └─ grep -A15 "Test Framework" scrum.pmo/roles/Tester/process.md
         │  │
         │  ├─[step:uuid:test-003-struct-001] Test Structure (30s)
         │  │  └─ ls -la test/
         │  │
         │  ├─[step:uuid:test-004-pattern-001] Test Examples (1m)
         │  │  └─ find test/ -name "*.test.ts" -exec head -20 {} \; | head -100
         │  │
         │  ├─[step:uuid:test-005-spec-001] Find Specifications (30s)
         │  │  └─ find docs/ -name "*spec*.md" -o -name "*behavior*.md"
         │  │
         │  ├─[step:uuid:test-006-plan-001] Plan Tests (2m)
         │  │  └─ Write test cases in markdown
         │  │
         │  └─[step:uuid:test-007-pdca-001] QA Work (1m)
         │     └─ Create PDCA for testing
         │     Total: ~6 minutes (planning phase)
         │
         └─ DEVOPS PATH
            ├─[step:uuid:dops-000-role-001] Confirm Role (30s)
            │  └─ cat scrum.pmo/roles/DevOps/process.md
            │
            ├─[step:uuid:dops-001-env-001] Check Docker ❌ REQUIRED (5s)
            │  └─ docker --version → Must install
            │
            ├─[step:uuid:dops-001-env-002] Check Node.js ❌ REQUIRED (5s)
            │  └─ node --version → Must have v18+
            │
            ├─[step:uuid:dops-001-env-003] Check PlantUML ❌ REQUIRED (5s)
            │  └─ plantuml -version → Must install
            │
            ├─[step:uuid:dops-005-setup-001] Install All Tools (10m)
            │  └─ brew install docker node plantuml graphviz
            │
            ├─[step:uuid:dops-003-infra-001] Check Config (30s)
            │  └─ cat .devcontainer/devcontainer.json
            │
            ├─[step:uuid:dops-004-cicd-001] Review CI/CD (1m)
            │  └─ ls -la .github/workflows/
            │
            ├─[step:uuid:dops-006-build-001] Build Container (5m)
            │  └─ docker build -t web4articles-dev .devcontainer/
            │
            └─[step:uuid:dops-007-pdca-001] Infrastructure Work (2m)
               └─ Create PDCA for environment
               Total: ~20 minutes (heavy setup)
```

## Recovery Time Summary

| Role | Minimal Time | With Prerequisites | Deferred Items |
|------|--------------|-------------------|----------------|
| **ScrumMaster** | 5 min ⭐ | 5 min | None - Git only |
| **Product Owner** | 5 min ⭐ | 5 min | None - No tools |
| **Developer** | 6 min | 15 min | Node.js, Docker, npm |
| **Architect** | 6 min | 12 min | PlantUML, Graphviz |
| **Tester** | 6 min | 10 min | Node.js, npm |
| **DevOps** | 20 min ❌ | 20 min | Nothing - all required |

## Deferral Strategy

### Always Defer Until Needed
1. **Docker**: Only when running devcontainer
2. **Node.js**: Only when running code/tests
3. **PlantUML**: Only when rendering diagrams
4. **npm install**: Only when executing code
5. **Tool installations**: Only when using the tool

### Never Defer (Core Requirements)
1. **Git**: Required for all roles
2. **Text editor**: Basic requirement
3. **File system access**: Fundamental need

### Role-Specific Deferrals

**Developer**
- Defer: Docker, npm install
- Until: Actually writing/running code
- Can do: Read code, understand structure, plan changes

**Architect**
- Defer: PlantUML installation
- Until: Need to render diagrams
- Can do: Write PUML source, design in text

**Tester**
- Defer: Node.js, test execution
- Until: Running actual tests
- Can do: Write test plans, review specs

**DevOps**
- Defer: Nothing - all tools needed
- Reason: Infrastructure role requires full setup

## Quick Recovery Paths

### Fastest Path (3 minutes)
1. `git checkout origin/feature/analyze-ranger`
2. `mkdir -p scrum.pmo/project.journal/$(date +%Y-%m-%d-%H%M)/pdca`
3. `echo "Ready to work"`

### Smart Path by Role (5-6 minutes)
1. Identify role from context
2. Skip all deferrables
3. Read only essential docs
4. Start working immediately

### Full Setup Path (20-45 minutes)
1. Complete environment setup
2. Install all tools
3. Run full verification
4. Not recommended unless required

## Error Recovery

If any step fails:
1. Check if it's deferrable → Skip it
2. Check if it's role-specific → Switch roles
3. Check if it's critical → Fall back to Mode 2
4. Always can do: Create PDCA and document

## Key Principles

1. **Time is precious**: Every minute counts
2. **Defer complexity**: Install only when needed
3. **Start working fast**: PDCA first, setup later
4. **Role flexibility**: PO/SM need minimal setup
5. **Graceful degradation**: Can always fall back

---

**Remember**: The goal is to get productive in under 10 minutes. Choose the minimal path that gets you working!