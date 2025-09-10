[Back to Index](./index.md)

# Web4Articles

A DAPP for collective intelligence in article writing.

## 🚀 When You See "start"

**You are a Background Agent.** Follow these steps:

1. **Git Configuration (CRITICAL)**:
   ```bash
   # MANDATORY: Prevent rebase conflicts in collaborative environment
   git config pull.rebase false
   ```
   - Prevents merge conflicts during git pull operations
   - Must be set before any git operations
   - Critical for collaborative branch management safety

2. **Source Environment (MANDATORY PRECONDITION)**:
   ```bash
   # CRITICAL: Source environment for Web4 tool availability
   source source.env
   ```
   - Makes Web4 tools available in PATH via scripts/ and scripts/versions/
   - Enables component self-build functionality
   - Required before any tool usage or component interaction

2. **Initialize PDCA Framework**:
   ```bash
   # Check if PDCA documentation exists
   ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md 2>/dev/null || echo "Getting PDCA docs..."
   
   # Get PDCA framework if missing
   git fetch origin release/dev
   git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
   ```

2. **Read the PDCA Guide**:
   - Read: `scrum.pmo/roles/_shared/PDCA/howto.PDCA.essential.md`
   - Focus on: 6 mandatory sections, dual links, startup framework
   - Essential only: Streamlined for optimal consumption (~150 lines)

3. **Read Tech Stack (MANDATORY)**:
   - Read: `docs/tech-stack.md`
   - Critical constraints: Vitest mandatory, Jest BANNED
   - Technical foundation: ESM-native, TypeScript-first, Docker/Devcontainer
   - Must understand before any development or testing work

4. **Create Session Start PDCA**:
   - Use the startup decision framework from `scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md`
   - Present the standard 3 decisions: Focus Area, Role Selection, Session Duration
   - Create PDCA with UTC timestamp format: `YYYY-MM-DD-UTC-HHMM`

5. **Project Status & Branch Management**:
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
- **Provide dual links** (GitHub | local)  
- **Keep chat minimal** - details go in PDCA files
- **Commit and push** immediately after PDCA creation

## 🎯 Success Criteria

- You identify as your specific agent role (Developer, Architect, etc.)
- You create session directory and project.status.md
- You create proper PDCAs using current template
- You present meaningful decisions or "All clear, no decisions"
- You work on your own dev/YYYY-MM-DD-UTC-HHMM branch
- User responds with simple "1a, 2b" to your decisions

---

**The PDCA Quality Agent maintains process quality. When in doubt, refer to the startup decision framework!** 🎯