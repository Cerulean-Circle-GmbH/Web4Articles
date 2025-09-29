[Back to Index](./index.md)

# Web4Articles

A DAPP for collective intelligence in article writing.

## 🧠 Agent Memory System

**IMPORTANT:** Agents now have comprehensive project memory! Before crawling files manually, your complete project context is available in `memory.md`.

### Auto-Injection Startup Process
1. **Auto-Load Memory Context**: `memory.md` contains ALL essential project knowledge (22,600+ tokens)
2. **Instant Knowledge**: PDCA requirements, roles, tech stack, commands - everything auto-injected
3. **Zero Essential Reading**: All basic project knowledge loaded automatically in Step 1

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

1. **Auto-Load Complete Memory Context (FIRST PRIORITY)**:
   ```bash
   # CRITICAL: Ensure memory is current and automatically load content
   ./scripts/ensure-memory.sh
   
   # Auto-inject memory content into agent context
   echo "🧠 LOADING COMPLETE PROJECT CONTEXT..."
   echo "📊 Memory contains: $(wc -w < memory.md) words of comprehensive knowledge"
   echo "🎯 Auto-injecting memory.md content for instant agent context..."
   
   # AUTOMATIC MEMORY INJECTION - No manual reading required
   cat memory.md
   ```

2. **Validate Memory Context Loading**:
   ```bash
   # Verify memory content is now available in conversation context
   echo "✅ Memory validation complete"
   echo "🧠 Agent now has complete project knowledge including:"
   echo "   - All PDCA requirements and templates"
   echo "   - All agent roles and responsibilities" 
   echo "   - Complete technology stack (Vitest, TypeScript, etc.)"
   echo "   - Project philosophy and decision frameworks"
   echo "   - Recovery and troubleshooting procedures"
   echo "🎯 Ready for immediate productive work!"
   ```

3. **Initialize PDCA Framework (if needed)**:
   ```bash
   # Check if PDCA documentation exists (usually not needed due to memory)
   ls -la scrum.pmo/roles/_shared/PDCA/howto.PDCA.md 2>/dev/null || echo "Getting PDCA docs..."
   
   # Get PDCA framework if missing (fallback only)
   git fetch origin release/dev
   git checkout origin/release/dev -- scrum.pmo/roles/_shared/PDCA/
   ```

4. **Work Immediately with Memory Context**:
   - ✅ **Complete PDCA knowledge**: Template format, decision framework, dual links (loaded in Step 1)
   - ✅ **All 6 mandatory sections**: Documented and accessible from memory context
   - ✅ **No file reading required**: All essential information now in conversation context
   - ✅ **Template version**: v3.1.4.2 and all requirements available from memory

5. **Create Session Start PDCA Using Memory**:
   - 🧠 **Use loaded memory knowledge**: Decision framework and format now in context
   - 🎯 **Standard 3 decisions**: Focus Area, Role Selection, Session Duration (from memory)
   - ⏰ **PDCA format**: UTC timestamp format `YYYY-MM-DD-UTC-HHMM` (from memory)
   - 🚀 **Instant productivity**: All requirements accessible without additional file reading

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

### Auto-Injection Memory Workflow
- **Step 1 auto-loads memory** - Complete project context automatically injected
- **Instant knowledge access** - PDCA, tech stack, roles immediately available in conversation
- **Zero manual reading** - All essential information loaded via `cat memory.md`
- **Selective file access only** - Read specific files only for detailed implementation
- **Update when needed** - Run `./scripts/generate-memory.sh` after major changes

### Process Requirements  
- **Use newest PDCA template** - Template version and requirements in memory.md
- **Apply startup decision framework** - Decision format documented in memory.md
- **Create proper PDCAs** for all significant work
- **Use numbered decisions** (1a, 1b format) when real choices exist
- **Provide dual links** (GitHub | local) - Format specified in memory.md
- **Keep chat minimal** - details go in PDCA files
- **Commit and push** immediately after PDCA creation

## 🎯 Success Criteria

### Auto-Injection Memory Success
- **Memory auto-loaded in Step 1** - Complete project knowledge immediately accessible
- **Instant knowledge demonstration** - Reference PDCA, tech stack, roles from loaded context
- **Ultra-fast startup** - Work immediately with 22,600 tokens of context vs. file crawling
- **Zero essential file reading** - All basic project knowledge pre-loaded in conversation

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

### Auto-Injection Agent Workflow
1. **Run startup Step 1** → Auto-loads complete project context (22,600+ tokens)
2. **Work immediately** → Use injected memory for PDCA, roles, standards, everything
3. **Skip basic file reading** → All essential knowledge already in conversation context
4. **Read specific files only** → For detailed implementation when absolutely needed
5. **Update memory** → When making significant project changes

---

**The PDCA Quality Agent maintains process quality. For complete context, start with memory.md! When in doubt, refer to the startup decision framework documented in your memory context.** 🧠🎯