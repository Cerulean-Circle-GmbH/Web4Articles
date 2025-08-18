[Back to Recovery Analysis](./recovery-process-analysis.md)

# Recovery Process Design V2 - Role-Based Minimal Recovery

**Date:** 2025-08-18  
**Version:** 2.0  
**Objective:** Design role-specific recovery paths that postpone hard steps until actually needed

## ⚠️ CRITICAL: Branch Safety Warning

**SAFE BRANCHES**: feature/analyze-ranger, main@f89aba0  
**DANGEROUS**: release/dev (causes endless hang)  
See [Branch Strategy](./design.recovery.branch-strategy.md) for details

## Core Principle: Just-In-Time Environment Setup

Only setup what you need, when you need it. Most roles can start working immediately with just markdown files.

## Role-Based Recovery Decision Tree

```
START: Agent needs to recover context
│
├─Q: What role are you recovering as?
│  │
│  ├─ Product Owner (PO)
│  │  └─→ Minimal Recovery (Markdown only)
│  │
│  ├─ ScrumMaster
│  │  └─→ Minimal Recovery (Markdown only)
│  │
│  ├─ Architect
│  │  └─→ Minimal + PlantUML (when needed)
│  │
│  ├─ Developer
│  │  └─→ Minimal + Node.js + Devcontainer (when coding)
│  │
│  ├─ Tester
│  │  └─→ Minimal + Node.js + Devcontainer (when testing)
│  │
│  └─ DevOps
│     └─→ Full Environment (Docker, Node.js, PlantUML, etc.)
```

## Role-Specific Recovery Paths

### 1. Product Owner (PO) - Lightest Recovery

**Environment Needs:** None (just filesystem)  
**Tools:** Text editor only  
**Recovery Time:** ~1 minute

#### Steps:
1. Create session folder: `scrum.pmo/project.journal/YYYY-MM-DD-HHMM/`
2. Create PDCA folder: `pdca/`
3. Start working on tasks/requirements in markdown

#### What PO Does:
- Write and refine requirements
- Create and prioritize tasks
- Review sprint planning
- Document in markdown

**No need for:** Docker, Node.js, PlantUML, or any development tools

---

### 2. ScrumMaster - Light Recovery

**Environment Needs:** None (just filesystem)  
**Tools:** Text editor only  
**Recovery Time:** ~2 minutes

#### Steps:
1. Create session folder structure
2. Read recent sprint status
3. Check for impediments in tasks
4. Start PDCA documentation

#### What ScrumMaster Does:
- Facilitate sprint planning
- Remove impediments
- Manage task dependencies
- Document process improvements

**No need for:** Technical environment setup

---

### 3. Architect - Medium Recovery

**Environment Needs:** PlantUML only when creating diagrams  
**Tools:** Text editor + PlantUML (deferred)  
**Recovery Time:** ~3 minutes (without PlantUML), ~10 minutes (with PlantUML)

#### Initial Steps (No PlantUML):
1. Create session folder structure
2. Read architecture docs in `docs/architecture/`
3. Review existing PUML source files
4. Start specification writing

#### When PlantUML Needed:
```bash
# macOS
brew install plantuml graphviz

# Linux
sudo apt-get install plantuml graphviz

# Verify
plantuml -version
```

#### Postpone PlantUML Until:
- Actually need to render diagrams
- Need to validate PUML syntax
- Ready to commit diagram changes

**Can work without PlantUML for:**
- Reading existing architecture
- Writing specifications
- Reviewing code structure
- Planning architectural changes

---

### 4. Developer - Heavy Recovery (Deferred)

**Environment Needs:** Node.js immediately, Docker when running  
**Tools:** Text editor, Node.js, Git, Docker (deferred)  
**Recovery Time:** ~5 minutes (Node only), ~15 minutes (full devcontainer)

#### Initial Steps (No Docker):
1. Create session folder structure
2. Verify Node.js: `node --version` (need v18+)
3. Install dependencies: `npm ci`
4. Read code without running

#### When Docker/Devcontainer Needed:
```bash
# Check Docker
docker version

# Build devcontainer
# (Only when actually need to run code)
```

#### Postpone Docker Until:
- Need to run the application
- Need consistent environment
- Ready for integration testing

**Can work without Docker for:**
- Reading and understanding code
- Writing new code (not running)
- Code reviews
- Documentation

---

### 5. Tester - Heavy Recovery (Deferred)

**Environment Needs:** Same as Developer  
**Tools:** Text editor, Node.js, Docker (for running tests)  
**Recovery Time:** ~5 minutes (test planning), ~15 minutes (running tests)

#### Initial Steps (No Environment):
1. Create session folder structure
2. Read test specifications
3. Write test cases in markdown
4. Plan test scenarios

#### When Environment Needed:
- Same as Developer setup
- Plus test runner: `npm test`

#### Postpone Environment Until:
- Ready to run automated tests
- Need to validate implementations
- Performing integration testing

**Can work without environment for:**
- Test planning
- Writing test cases
- Reviewing specifications
- Manual test documentation

---

### 6. DevOps - Full Recovery

**Environment Needs:** Everything from the start  
**Tools:** Docker, Node.js, PlantUML, Git, GitHub CLI  
**Recovery Time:** ~20 minutes

#### Required Steps:
1. Full environment verification (all tools)
2. Docker and devcontainer setup
3. CI/CD pipeline understanding
4. Repository structure validation

**DevOps cannot postpone** because they:
- Maintain the environment others use
- Need to verify all tools work
- Set up automation and pipelines

---

## Recovery Optimization Strategy

### Phase 1: Universal Minimal Start (All Roles)
```bash
# 1. Create session
DATE=$(date +"%Y-%m-%d-%H%M")
mkdir -p scrum.pmo/project.journal/$DATE/pdca

# 2. Create initial PDCA
cat > scrum.pmo/project.journal/$DATE/pdca/initial.md << 'EOF'
[Back to Session](../)

# PDCA: Role Recovery - [DATE]

**Role:** [Your Role]
**Objective:** Recover context and continue work

## Plan
- Start minimal
- Add tools as needed

## Do
- Created session structure
- [Current work]

## Check
- [Results]

## Act
- [Next steps]
EOF

# 3. Start working
```

### Phase 2: Add Tools When Blocked

| If you need to... | Then install... | Time to add |
|-------------------|-----------------|-------------|
| Read code | Nothing | 0 min |
| Write markdown | Nothing | 0 min |
| Write code (not run) | Text editor | 0 min |
| Run Node.js code | Node.js + npm | 5 min |
| Render PUML | PlantUML + Graphviz | 7 min |
| Run in container | Docker + devcontainer | 10 min |
| GitHub automation | gh CLI | 3 min |

### Phase 3: Document Tool Additions

When you add a tool, document in your PDCA:
- Why it was needed
- What was blocking progress
- Time spent on setup
- Whether it could have been postponed further

## Success Metrics by Role

| Role | Minimal Time | Full Time | Postponable % |
|------|--------------|-----------|---------------|
| PO | 1 min | 1 min | 100% |
| ScrumMaster | 2 min | 2 min | 100% |
| Architect | 3 min | 10 min | 70% |
| Developer | 5 min | 15 min | 66% |
| Tester | 5 min | 15 min | 66% |
| DevOps | 20 min | 20 min | 0% |

## Key Insights

1. **PO and ScrumMaster** never need technical tools
2. **Architect** only needs PlantUML for rendering (not reading)
3. **Developer/Tester** can plan/read without environment
4. **DevOps** must have everything (they maintain it for others)

## Recovery Command Reference

### Check What You Have
```bash
# Minimal check (all roles)
ls -la
pwd

# Node check (Dev/Test)
node --version
npm --version

# Docker check (Dev/Test/DevOps)
docker version

# PlantUML check (Architect/DevOps)
plantuml -version

# Git check (all technical roles)
git status
git branch
```

### Install Only When Needed
```bash
# Node.js (when blocked)
# - macOS: brew install node
# - Linux: Use nvm or package manager

# PlantUML (when rendering)
# - macOS: brew install plantuml graphviz
# - Linux: apt-get install plantuml graphviz

# Docker (when running containers)
# - Follow Docker docs for your OS

# GitHub CLI (when automating)
# - macOS: brew install gh
# - Linux: Check GitHub CLI docs
```

## Summary

Start with the absolute minimum (folder + PDCA), then add tools only when you're actually blocked. This approach:

- ✅ Gets you productive in 1-5 minutes
- ✅ Avoids unnecessary setup
- ✅ Reduces failure points
- ✅ Focuses on actual work
- ✅ Documents what's truly needed

Remember: You can read, write, plan, and think without any tools. Tools are only needed for execution.