[Back to Index](./index.md)

# Web4Articles

A DAPP for collective intelligence in article writing.

## 🧠 Agent Memory System

**IMPORTANT:** Agents now have comprehensive project memory! Before crawling files manually, your complete project context is available in `memory.md`.

### Memory-Enhanced Startup Process
1. **Read Memory Context**: `memory.md` contains ALL essential project knowledge (6,355+ tokens)
2. **Instant Knowledge**: PDCA requirements, roles, tech stack, commands - everything in one file
3. **Selective Reading**: Only read specific files for detailed implementation

**Memory Benefits:**
- ✅ **No context rebuilding** - Complete knowledge instantly available
- ✅ **Consistent understanding** - Same knowledge base for all agents  
- ✅ **Faster startup** - Essential info without crawling 52+ files
- ✅ **MCP-style context** - Comprehensive background knowledge injection

### When to Update Memory
```bash
# Update memory when:
# - New files added to project
# - PDCA processes updated  
# - Agent roles modified
# - Technical standards changed
./scripts/generate-memory.sh
```

---

## 🚀 When You See "start"

**You are a Background Agent.** Follow these memory-enhanced steps:

1. **Ensure Memory Context is Current**:
   ```bash
   # Validate and ensure memory.md is current and comprehensive
   ./scripts/ensure-memory.sh
   ```

2. **Initialize PDCA Framework**:
   ```bash
   # Check if PDCA documentation exists
   ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md 2>/dev/null || echo "Getting PDCA docs..."
   
   # Get PDCA framework if missing
   git fetch origin release/dev
   git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
   ```

3. **Read Memory Context First**:
   ```bash
   # Your comprehensive project context is now ready
   echo "🧠 Reading comprehensive memory context..."
   echo "📊 Memory contains: $(wc -w < memory.md) words of complete project knowledge"
   # Review memory.md - it contains PDCA requirements, roles, tech stack, everything!
   ```

4. **Verify PDCA Knowledge from Memory**:
   - **Memory contains**: Complete PDCA template format, decision framework, dual links
   - **All 6 mandatory sections** documented in memory.md
   - **No need to read** `howto.PDCA.md` unless implementing specific details
   - **Template version** and requirements already in memory context

5. **Create Session Start PDCA**:
   - **Use memory knowledge**: Decision framework format documented in memory.md
   - **Standard 3 decisions**: Focus Area, Role Selection, Session Duration (from memory)
   - **PDCA format**: UTC timestamp format `YYYY-MM-DD-UTC-HHMM` (from memory)
   - **No file reading needed**: All requirements in memory context

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

### Memory-First Workflow
- **Start with memory.md** - Complete project context before any work
- **Use memory knowledge** - PDCA requirements, tech stack, standards all included
- **Read specific files only** - For detailed implementation after memory context
- **Update memory when needed** - Run `./scripts/generate-memory.sh` after major changes

### Process Requirements  
- **Use newest PDCA template** - Template version and requirements in memory.md
- **Apply startup decision framework** - Decision format documented in memory.md
- **Create proper PDCAs** for all significant work
- **Use numbered decisions** (1a, 1b format) when real choices exist
- **Provide dual links** (GitHub | local) - Format specified in memory.md
- **Keep chat minimal** - details go in PDCA files
- **Commit and push** immediately after PDCA creation

## 🎯 Success Criteria

### Memory-Enhanced Agent Success
- **Use memory.md context** - Start with comprehensive project knowledge
- **Demonstrate memory knowledge** - Reference PDCA requirements, tech stack, roles without reading files
- **Efficient startup** - Work immediately using memory context vs. extensive crawling
- **Selective file reading** - Only read specific files for implementation details

### Traditional Success Criteria
- You identify as your specific agent role (Developer, Architect, etc.)
- You create session directory and project.status.md  
- You create proper PDCAs using current template (format in memory.md)
- You present meaningful decisions or "All clear, no decisions"
- You work on your own dev/YYYY-MM-DD-UTC-HHMM branch
- User responds with simple "1a, 2b" to your decisions

---

## 🔧 Quick Reference

### Essential Commands
```bash
# Ensure memory is current (run this first!)
./scripts/ensure-memory.sh

# View comprehensive memory context
cat memory.md

# Force update memory after changes
./scripts/generate-memory.sh

# Check agent identity  
./scripts/agent-identity-first-startup.sh

# Current branch status
git branch --show-current
```

### Memory-First Agent Workflow
1. **Read memory.md** → Get complete project context (6,355+ tokens)
2. **Start work immediately** → Use memory knowledge for PDCA, roles, standards
3. **Read specific files** → Only for detailed implementation when needed
4. **Update memory** → When making significant project changes

---

**The PDCA Quality Agent maintains process quality. For complete context, start with memory.md! When in doubt, refer to the startup decision framework documented in your memory context.** 🧠🎯