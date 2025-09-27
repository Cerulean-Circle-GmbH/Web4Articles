[Back to Index](./index.md)

# Web4Articles

The Bootstraping project for Web4ASI
The following lines are not for you, if you identify as human.

## 🚀 When You See "start"

**You are a Background Agent.** Follow these steps:

1. **Understand CMM4 Framework FIRST**:
   - **CRITICAL:** Read this before touching anything: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/cmm-start/scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md) | [scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md](scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md)
   - **Why:** You need CMM4 understanding before processes make sense
   - **Result:** You'll understand PDCA as a CMM4 feedback loop system, not just templates

2. **Apply CMM3 Compliance Checklist (CRITICAL)**:
   - **MANDATORY:** After understanding CMM, immediately apply systematic compliance verification
   - **Read:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-24-UTC-1028/scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md) | [scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md](scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md)
   - **Why:** CMM3 compliance ensures systematic quality verification throughout startup process
   - **Result:** All work will meet CMM3+ verification protocols with systematic measurement
   - **Usage:** Reference checklist items as "[number][letter] cmm3" (e.g., "1f cmm3") throughout process

3. **Confirm Your Identity**:
   ```bash
   # CRITICAL: Always start with identity check
   ./scripts/agent-identity-first-startup.sh
   ```

4. **Git Configuration (CRITICAL)**:
   ```bash
   # MANDATORY: Prevent rebase conflicts in collaborative environment
   git config pull.rebase false
   ```
   - Prevents merge conflicts during git pull operations
   - Must be set before any git operations
   - Critical for collaborative branch management safety

5. **Read Agent Safety Guidelines (MANDATORY)**:
   - Read: `scrum.pmo/roles/_shared/PDCA/bad.interactive.sh.commands.md`
   - Critical: Understand commands that cause terminal hangs
   - Background agents CANNOT handle interactive prompts
   - Must use atomic single commands only - NO COMMAND CHAINING with &&
   - **CMM3 Compliance:** Follow safety protocol per checklist item 1f step 3

6. **Git Process Cleanup (SYSTEM MAINTENANCE)**:
   ```bash
   # Wait 30 seconds then kill defunct git processes
   sleep 30 && pkill -f "git" 2>/dev/null || true &
   ```
   - Cleans up defunct git processes from previous interactive failures
   - Prevents system resource drain and process accumulation
   - Runs in background, doesn't block startup continuation

7. **Source Environment (MANDATORY PRECONDITION)**:
   ```bash
   # CRITICAL: Source environment for Web4 tool availability
   source source.env
   ```
   - Makes Web4 tools available in PATH via scripts/ and scripts/versions/
   - Enables component self-build functionality
   - Required before any tool usage or component interaction

8. **Initialize PDCA Framework**:
   ```bash
   # Check if PDCA documentation exists
   ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md 2>/dev/null || echo "Getting PDCA docs..."
   
   # Get PDCA framework if missing
   git fetch origin release/dev
   git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
   ```

9. **Read the PDCA Guide (Now With CMM4 Understanding)**:
   - Read: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/cmm-start/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md) | [scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](scrum.pmo/roles/_shared/PDCA/howto.PDCA.md)
   - Read: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/cmm-start/scrum.pmo/roles/_shared/PDCA/template.md) | [scrum.pmo/roles/_shared/PDCA/template.md](scrum.pmo/roles/_shared/PDCA/template.md)
   - **CRITICAL:** Use Template Version 3.1.4.2 ONLY - no other versions allowed
   - Focus on: Dual link format training [GitHub](url) | [project/root/path](path)
   - **Now you understand:** PDCA as CMM4 feedback loop mastery, not just documentation
   - **CMM3 Compliance:** Follow PDCA compliance checklist items 1a-1i

10. **Read Tech Stack & Web4 Preparation**:
    - Read: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/cmm-start/docs/tech-stack.md) | [docs/tech-stack.md](docs/tech-stack.md) - Vitest mandatory, Jest BANNED
    - Read: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/cmm-start/components/Web4TSComponent/0.3.0.8/README.md) | [components/Web4TSComponent/0.3.0.8/README.md](components/Web4TSComponent/0.3.0.8/README.md) - Auto-discovery CLI patterns
    - Review: [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/save/cmm-start/components/Web4Requirement/0.3.0.5) | [components/Web4Requirement/0.3.0.5](components/Web4Requirement/0.3.0.5) - Web4 paradigm and standards

11. **Create Session Start PDCA**:
    - Use the startup decision framework from [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/cmm-start/scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md) | [scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md](scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md)
    - Present the standard 3 decisions: Focus Area, Role Selection, Session Duration
    - **CRITICAL:** Use Template Version 3.1.4.2 with proper dual link format
    - Create PDCA with UTC timestamp format: `YYYY-MM-DD-UTC-HHMM`
    - **CMM3 Compliance:** Follow checklist items 1f (use todo_write for compliance tracking, tracking tables only for larger systematic multi-file tasks), 1h (intensive tracking tables for multi-file work only), 1i (progress tracking with todo_write)

12. **Project Status & Branch Management**:
    ```bash
    # Create project status in your session directory
    mkdir -p scrum.pmo/project.journal/$(date -u +"%Y-%m-%d-UTC-%H%M")-session
    
    # Create project.status.md with current state
    echo "# Project Status - $(date -u)" > scrum.pmo/project.journal/$(date -u +"%Y-%m-%d-UTC-%H%M")-session/project.status.md
    
    # Create new dev branch for your session
    git checkout -b dev/$(date -u +"%Y-%m-%d-UTC-%H%M")
    git push -u origin dev/$(date -u +"%Y-%m-%d-UTC-%H%M")
    ```

## 📋 Agent Operating Rules

- **Use newest PDCA template** - Always check template.md first
- **Apply startup decision framework** - Use the 3 standard questions
- **Create proper PDCAs** for all significant work
- **Use numbered decisions** (1a, 1b format) when real choices exist
- **Provide dual links** (GitHub | local) - ALWAYS both links
- **Keep chat minimal** - details go in PDCA files
- **Commit and push** immediately after PDCA creation
- **Pull protocol** - Read + Analyze + PDCA new content, not just merge
- **CMM3 Compliance** - Reference checklist throughout work per items 2a-2d, 3a-3d, 4a-4c, 5a-5c

## 🎯 Success Criteria

- You identify as your specific agent role (Developer, Architect, etc.)
- You create session directory and project.status.md
- You create proper PDCAs using current template
- You present meaningful decisions or "All clear, no decisions"
- You work on your own dev/YYYY-MM-DD-UTC-HHMM branch
- User responds with simple "1a, 2b" to your decisions
- **CMM3 Verification:** All work meets compliance checklist requirements

## 📋 Startup File Reading Tracking

During startup process, agents systematically read multiple files. Track with branch SHA codes for 100% traceability:

### **Files Read During Startup (with Branch SHA)**
| Step | File | Purpose | Branch SHA | Status |
|------|------|---------|------------|--------|
| 1 | howto.cmm.md | CMM4 framework understanding | Record current branch SHA | ✅ Required |
| 2 | cmm3.compliance.checklist.md | Compliance verification | Record current branch SHA | ✅ Required |  
| 4 | bad.interactive.sh.commands.md | Safety guidelines | Record current branch SHA | ✅ Required |
| 8-9 | howto.PDCA.md, template.md | PDCA framework | Record current branch SHA | ✅ Required |
| 9 | tech-stack.md, Web4TSComponent README | Web4 preparation | Record current branch SHA | ✅ Required |
| 10 | PDCA.howto.decide.md | Decision framework | Record current branch SHA | ✅ Required |

**Branch Traceability Requirement:** When any branch is referenced, include git SHA code format: `branch-name (SHA-code)` for complete reproducibility.

## 🎯 Startup Decision Framework

When creating your Session Start PDCA (step 11), present these decisions:

### **Decision 1: Primary Work Focus Area**
- a) Technical Development Focus - Component enhancement, bug fixes, feature development
- b) Architecture Focus - System design, process improvements, integration work  
- c) Documentation Focus - Requirement processing, automation, workflow optimization
- d) Quality/Testing Focus - Testing strategies, validation, compliance checks

### **Decision 2: Agent Role Selection**
**Agent should generate role options dynamically using this command:**
```bash
find scrum.pmo/roles -maxdepth 1 -type d -name '*Agent' | sed 's|.*/||' | sort
```

**Present discovered roles with descriptions:**
- a) **BackendAgent** - Server-side development, API design, database management
- b) **BackgroundAgent** - General purpose automation, system maintenance  
- c) **BranchStatusAgent** - Git branch management, repository hygiene, branch analysis
- d) **CICDAgent** - Continuous integration, deployment pipeline management
- e) **OntologyAgent** - Knowledge organization, semantic analysis, categorization
- f) **PDCAQualityAgent** - Process quality assurance, PDCA compliance verification
- g) **RecoveryDefinitionAgent** - Error recovery processes, resilience planning
- h) **ReleaseIntegrationAgent** - Release management, version coordination, integration
- i) **ResearchAgent** - Investigation, analysis, research coordination
- j) **SaveRestartAgent** - Session management, state preservation, recovery operations
- k) *[Additional agent roles discovered dynamically...]*

**Non-Agent Roles (legacy - use find command above for current agents):**
- l) **Architect** - System design, architecture documentation, technical leadership
- m) **Developer** - Software development, implementation, coding tasks
- n) **DevOps** - Infrastructure management, deployment, operations
- o) **PO** - Product Owner responsibilities, requirements management, stakeholder coordination
- p) **ScrumMaster** - Agile process facilitation, team coordination, sprint management
- q) **Tester** - Quality assurance, testing strategy, validation processes

### **Decision 3: Session Duration Planning**
**Select session duration for planning and scope context (informational - does not affect agent behavior):**
- a) **Quick Session (1-2 hours)** - Focused single task or targeted bug fix
- b) **Half-day Session (2-4 hours)** - Feature development or moderate complexity tasks  
- c) **Full-day Session (4-8 hours)** - Complex features or multi-component integration work
- d) **Multi-day Session (1+ days)** - Major architectural changes or extensive research projects

### **Decision 4: PDCA Organization Location**
**Choose where to create and maintain PDCAs based on work scope:**
- a) **Session PDCAs** - `scrum.pmo/project.journal/[session]/` for project-wide collaborative work across multiple agents/roles
- b) **Role PDCAs** - `scrum.pmo/roles/[AgentRole]/pdca/` for agent-specific specialized work within defined role boundaries  
- c) **Component PDCAs** - `components/[Component]/[version]/` for component-specific development work (rare, use for focused component evolution)

---

**The PDCA Quality Agent maintains process quality. When in doubt, refer to the startup decision framework and CMM3 compliance checklist!** 🎯