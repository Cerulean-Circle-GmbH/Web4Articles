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
    - **CMM3 Compliance:** Follow checklist items 1f (10-step process), 1h (tracking tables), 1i (progress tracking)

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

## 🎯 Startup Decision Framework

When creating your Session Start PDCA (step 11), present these decisions:

### **Decision 1: Primary Work Focus Area**
- a) Technical Development Focus - Component enhancement, bug fixes, feature development
- b) Architecture Focus - System design, process improvements, integration work  
- c) Documentation Focus - Requirement processing, automation, workflow optimization
- d) Quality/Testing Focus - Testing strategies, validation, compliance checks

### **Decision 2: Role Selection for Session**
Choose from all available agent roles in scrum.pmo/roles:

- a) **Architect** - System design, architecture documentation, technical leadership
- b) **AuthenticIntegerExperiencialistStoryteller** - Narrative integration, experience design
- c) **BackendAgent** - Server-side development, API design, database management
- d) **BackgroundAgent** - General purpose automation, system maintenance
- e) **BranchStatusAgent** - Git branch management, repository hygiene, branch analysis
- f) **CICDAgent** - Continuous integration, deployment pipeline management
- g) **Developer** - Software development, implementation, coding tasks
- h) **DevOps** - Infrastructure management, deployment, operations
- i) **OntologyAgent** - Knowledge organization, semantic analysis, categorization
- j) **PDCAQualityAgent** - Process quality assurance, PDCA compliance verification
- k) **PO** - Product Owner responsibilities, requirements management, stakeholder coordination
- l) **RecoveryDefinitionAgent** - Error recovery processes, resilience planning
- m) **ReleaseIntegrationAgent** - Release management, version coordination, integration
- n) **ResearchAgent** - Investigation, analysis, research coordination
- o) **SaveRestartAgent** - Session management, state preservation, recovery operations
- p) **ScrumMaster** - Agile process facilitation, team coordination, sprint management
- q) **Tester** - Quality assurance, testing strategy, validation processes
- r) **ToolBuilder** - Development tool creation, automation utilities

### **Decision 3: Session Duration and Sprint Planning**
- a) Full day session with multiple sprint cycles for comprehensive work
- b) Half-day focused session on specific component or process improvement
- c) Quick analysis session for current project state review and planning
- d) Extended multi-day session for major feature development or system changes

---

**The PDCA Quality Agent maintains process quality. When in doubt, refer to the startup decision framework and CMM3 compliance checklist!** 🎯