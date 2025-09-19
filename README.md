[Back to Index](./index.md)

# Web4Articles

The Bootstraping project for Web4ASI
The following lines are not for you, if you identify as human.

## 🚀 When You See "start"

**You are a Background Agent.** Follow these steps:

1. **Confirm Your Identity First**:
   ```bash
   # CRITICAL: Always start with identity check
   ./scripts/agent-identity-first-startup.sh
1. **Git Configuration (CRITICAL)**:
   ```bash
   # MANDATORY: Prevent rebase conflicts in collaborative environment
   git config pull.rebase false
   ```
   - Prevents merge conflicts during git pull operations
   - Must be set before any git operations
   - Critical for collaborative branch management safety


2. **Golden Rule (CMM4 Process Feedback)**:
   **"Don't teach others what you don't understand yourself"**
   - Validation-first approach: Experience → Understanding → Documentation → Guidance
   - Treat others as you'd want to be treated = Give them validated, accurate guidance
   - CMM4 feedback loop prevents giving others what you wouldn't want to receive
   - Process rule: Understanding must precede instruction to avoid harming others

3. **Read Agent Safety Guidelines (MANDATORY)**:
   - Read: `scrum.pmo/roles/_shared/PDCA/bad.interactive.sh.commands.md`
   - Critical: Understand commands that cause terminal hangs
   - Background agents CANNOT handle interactive prompts
   - Must use atomic single commands only - NO COMMAND CHAINING with &&

4. **Git Process Cleanup (SYSTEM MAINTENANCE)**:
   ```bash
   # Wait 30 seconds then kill defunct git processes
   sleep 30 && pkill -f "git" 2>/dev/null || true &
   ```
   - Cleans up defunct git processes from previous interactive failures
   - Prevents system resource drain and process accumulation
   - Runs in background, doesn't block startup continuation

5. **Source Environment (MANDATORY PRECONDITION)**:
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

2. **Initialize PDCA Framework**:

3. **Read the PDCA Guide**:
   - Read: `scrum.pmo/roles/_shared/PDCA/howto.PDCA.md`
   - Focus on: Template format, decision framework, dual links
   - Key sections: All 6 mandatory sections, startup decision framework


4. **Create Session Start PDCA**:
5. **Read the PDCA Guide**:
   - Read: `scrum.pmo/roles/_shared/PDCA/template.md`
   - Focus on: Official v3.1.4.2 template format compliance
   - Critical: Follow exact template structure for all PDCAs

6. **Read Tech Stack (MANDATORY)**:
   - Read: `docs/tech-stack.md`
   - Critical constraints: Vitest mandatory, Jest BANNED
   - Technical foundation: ESM-native, TypeScript-first, Docker/Devcontainer
   - Must understand before any development or testing work

7. **Create Session Start PDCA**:
   - Use the startup decision framework from `scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md`
   - Present the standard 3 decisions: Focus Area, Role Selection, Session Duration
   - Create PDCA with UTC timestamp format: `YYYY-MM-DD-UTC-HHMM`

6. **Project Status & Branch Management**:
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

## 🎯 Success Criteria

- You identify as your specific agent role (Developer, Architect, etc.)
- You create session directory and project.status.md
- You create proper PDCAs using current template
- You present meaningful decisions or "All clear, no decisions"
- You work on your own dev/YYYY-MM-DD-UTC-HHMM branch
- User responds with simple "1a, 2b" to your decisions

---

**The PDCA Quality Agent maintains process quality. When in doubt, refer to the startup decision framework!** 🎯