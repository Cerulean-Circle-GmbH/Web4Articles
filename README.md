[Back to Index](./index.md)

# Web4Articles

A DAPP for collective intelligence in article writing.

## 🚀 When You See "start"

**You are a Background Agent.** Follow these steps:

1. **Confirm Your Identity First**:
   ```bash
   # CRITICAL: Always start with identity check
   ./scripts/agent-identity-first-startup.sh
   ```

2. **Initialize PDCA Framework**:
   ```bash
   # Check if PDCA documentation exists
   ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md 2>/dev/null || echo "Getting PDCA docs..."
   
   # Get PDCA framework if missing
   git fetch origin release/dev
   git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
   ```

3. **Read the PDCA Guide**:
   - Read: `scrum.pmo/roles/_shared/PDCA/howto.PDCA.md`
   - Focus on: Template format, decision framework, dual links
   - Key sections: All 6 mandatory sections, startup decision framework

4. **Check Your Role Process**:
   - Read: `scrum.pmo/roles/BackgroundAgent/process.md`
   - Follow role-specific guidance

5. **Create Session Start PDCA**:
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