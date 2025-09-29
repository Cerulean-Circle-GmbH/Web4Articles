# Cursor Rule for Memory System Integration

## 🎯 Memory Context Rule for Cursor

### **Perfect Rule (Recommended)**

Add this simple, effective rule to your Cursor user rules:

```
Always include the contents of memory.md in every response context. 
- Treat it as pinned project knowledge.
- Check if memory.md is actually being injected into context (This would be visible in the conversation context)
```

**Why this rule is perfect:**
- ✅ **Simple and clear** - No complexity or confusion
- ✅ **Comprehensive** - Covers every response context
- ✅ **Persistent** - Treats memory as pinned knowledge
- ✅ **Effective** - Ensures agents always have complete project context

### Alternative Complex Examples (Not Recommended)

<details>
<summary>Click to see verbose alternatives (not needed)</summary>

**JSON Configuration** (overly complex):
```json
{
  "rules": [
    {
      "name": "Web4Articles Memory Context",
      "description": "Always include comprehensive project memory for agent context",
      "trigger": "onAgentStart",
      "action": "includeFile",
      "file": "memory.md",
      "priority": "high",
      "persistent": true
    }
  ]
}
```

**Verbose Rule** (unnecessarily complex):
```markdown
## Memory-First Agent Context

**CRITICAL**: Always include memory.md for complete project context.

- **File**: memory.md  
- **Purpose**: Comprehensive project knowledge (4,237+ words)
- **Contains**: PDCA requirements, all roles, tech stack, standards, current state
- **Benefit**: Instant productivity without manual crawling

**Rule**: Include memory.md in every agent conversation for optimal context and performance.
```

</details>

---

## 🎯 **Project Rules for Memory System**

Add this to your Cursor Project Rules:

```markdown
# Web4Articles Memory System - Project Rules

## Memory Context (CRITICAL)
Always include the contents of memory.md in every response context. 
Treat it as pinned project knowledge containing complete project context.

## Memory System Guidelines
- memory.md contains 4,237+ words of comprehensive project knowledge
- Includes: PDCA requirements, all agent roles, tech stack, quality standards
- NO manual crawling needed for basic project information
- Use specific file reading only for implementation details

## Agent Startup Protocol
1. Memory validation runs automatically during agent startup
2. All agents must reference memory context before file reading
3. Use ./scripts/ensure-memory.sh to validate memory currency
4. Update memory with ./scripts/generate-memory.sh after significant changes

## Technology Stack (from memory.md)
- Testing: Vitest (Jest is BANNED)
- Architecture: 5-layer structure, strict OOP
- Code Style: ESM-native, TypeScript-first
- Quality: DRY principles, KISS approach

## Process Requirements (from memory.md)
- PDCA methodology for all significant work
- UTC timestamps: YYYY-MM-DD-UTC-HHMM format
- Dual links: [GitHub](URL) | [local/path](path)
- Immediate commit/push after PDCA creation

## Memory Update Triggers
Update memory when:
- Role processes change (scrum.pmo/roles/*/process.md)
- PDCA framework updates
- Documentation changes
- Technology stack decisions
- Project structure modifications

## Success Indicators
✅ Agents reference project knowledge without reading files
✅ Consistent understanding across all agent sessions
✅ Immediate productivity with complete context
✅ No manual crawling for basic project information
```

### **Why This Project Rule Works:**

1. **🧠 Memory Integration** - Ensures memory.md is always used
2. **📋 Complete Guidelines** - All memory system aspects covered
3. **🔧 Operational Rules** - Clear procedures and commands
4. **🎯 Quality Standards** - Tech stack and process requirements
5. **🚀 Success Metrics** - Clear validation criteria

### **Project vs User Rules:**

- **Project Rules**: Apply to this workspace only, shared with team
- **User Rules**: Apply to all your Cursor workspaces globally

---

## 🔧 Implementation Steps

1. **Add User Rule**: Add the simple rule to Cursor user rules
2. **Add Project Rule**: Add the comprehensive rule to Cursor project rules
3. **Verify**: Check that memory.md appears in agent context
4. **Test**: Start an agent conversation and confirm memory context is available
5. **Validate**: Agent should reference project knowledge without file reading

## ✅ Verification

Test the rules are working by asking an agent:
- "What is the PDCA template format?" (should know from memory)
- "What testing framework do we use?" (should answer "Vitest" from memory)  
- "What are the agent roles available?" (should list all roles from memory)

If agents need to read files for basic project knowledge, the rules aren't working properly.

---

**🧠 These rules ensure agents always have complete project context for optimal performance!**
