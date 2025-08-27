# 📋 **PDCA Decision-Making Guide - How to Present QA Decisions**

**🗓️ Date:** 2025-08-26-UTC-2105  
**🎯 Objective:** Comprehensive guide for creating and presenting QA decisions in PDCAs  
**👤 Role:** Process Documentation → Decision Framework Enhancement  
**📋 Status:** Official guidance for PDCA decision-making processes  
**🔗 Related:** [howto.PDCA.md](./howto.PDCA.md) | [PDCA.understanding.CMMI.md](./PDCA.understanding.CMMI.md)

---

## **🎯 DECISION SECTION PHILOSOPHY**

### **Core Principle**
**CRITICAL:** The QA Decisions section is for USER decisions, not agent decisions!

### **The 42 Rule: When in Doubt, ASK!**
- If you encounter ambiguity → ASK the user for clarification
- If you're unsure about terminology → Check official wiki/documentation
- If multiple valid interpretations exist → Present them as a decision
- **Remember:** 42 - The answer to everything is often another question

---

## **📊 QA DECISIONS FORMAT**

### **Standard Format in PDCA Summary Section**
```markdown
### **QA Decisions**
- [x] Completed decision: [Description of what was already decided]
- [ ] **Decision 1:** [Clear decision title]
  - a) [First option with rationale]
  - b) [Second option with rationale]
  - c) [Third option if applicable]
- [ ] **Decision 2:** [Another decision title]
  - a) [Option A with consequences]
  - b) [Option B with consequences]
```

### **When No Decisions Required**
```markdown
### **QA Decisions**
**All clear, no decisions to make** - [Brief explanation why]
```

---

## **🔍 WHEN TO PRESENT DECISIONS**

### **✅ Present Decisions When:**

1. **Real Risk Exists**
   - Operation could cause data loss
   - Changes might break existing functionality
   - Destructive operations (force push, delete, overwrite)
   - Example: "Force merge will DELETE all content in release/dev"

2. **Multiple Valid Approaches**
   - Different implementation strategies available
   - Trade-offs between approaches
   - No clear "best" option
   - Example: "Integration approach: Direct merge vs PR review"

3. **Ambiguous Requirements**
   - User instruction can be interpreted multiple ways
   - Terminology unclear (e.g., CMM vs CMMI)
   - Scope not fully defined
   - Example: "Cherry-pick 'tools' - which specific directories?"

4. **Significant Impact**
   - Decision affects project architecture
   - Long-term maintenance implications
   - Performance or security considerations
   - Example: "Authentication method: OAuth vs API keys"

### **❌ DON'T Present Decisions When:**

1. **User Already Decided**
   - Clear, unambiguous instruction given
   - Specific command or approach requested
   - Example: User says "cherry-pick X" - just do it

2. **No Real Risk**
   - Read-only operations
   - Standard procedures
   - Reversible changes
   - Example: "Read and analyze files"

3. **Only One Sensible Option**
   - Industry standard approach exists
   - Project conventions established
   - Technical constraints limit options
   - Example: "Use PDCA format" - follow the template

4. **Fake Opposites**
   - "Do it" vs "Don't do it"
   - Artificially created alternatives
   - No meaningful difference in outcomes
   - Example: Bad: "a) Create PDCA b) Don't create PDCA"

---

## **🔧 DECISION VERIFICATION PROCESS**

### **Before Creating a Decision:**

1. **Check Official Documentation**
   ```
   When unsure about terminology:
   - Semantic Versioning → Check semver.org
   - CMMI → Check official CMMI documentation
   - Git commands → Check git documentation
   - Project terms → Check project glossary
   ```

2. **Search Project Context**
   ```bash
   # Search for existing usage
   grep -r "term" /workspace
   
   # Check similar decisions
   grep -r "Decision.*similar" /workspace/scrum.pmo
   ```

3. **Identify Real Choices**
   - What are the actual alternatives?
   - What are the consequences of each?
   - Is this really the user's decision to make?

### **Decision Quality Checklist:**
- [ ] Is this a real decision with multiple valid options?
- [ ] Are the options clearly different with distinct outcomes?
- [ ] Have I checked official sources for terminology?
- [ ] Is this the user's decision (not mine) to make?
- [ ] Are consequences/rationale provided for each option?

---

## **💡 EXAMPLES OF GOOD VS BAD DECISIONS**

### **✅ GOOD Decision Examples:**

**Decision 1: Force Merge Strategy**
```markdown
**Decision 1: Handle 819 commits behind in release/dev**
- a) Force merge save/start → release/dev (WARNING: Will delete 819 commits)
- b) Create PR for manual review and selective merge
- c) Cherry-pick only newer files using timestamp comparison
```

**Decision 2: Ambiguous Instruction**
```markdown
**Decision 2: Interpretation of "tools" for cherry-pick**
- a) Cherry-pick all directories: components/, scenarios/, scripts/, tools/
- b) Cherry-pick only scripts/ directory
- c) Cherry-pick based on source.env dependencies
```

### **❌ BAD Decision Examples:**

**Bad: Fake Opposite**
```markdown
**Decision 1: Create PDCA Documentation**
- a) Create PDCA as requested ✅
- b) Don't create PDCA ❌
```

**Bad: Already Decided**
```markdown
**Decision 1: Cherry-pick method**
- a) Use git cherry-pick command
- b) Manually copy files
[User already said "cherry pick" - no decision needed]
```

---

## **🚨 CRITICAL WARNINGS**

### **Destructive Operations REQUIRE Warnings**

**Template for Destructive Warnings:**
```markdown
**Decision 1: [Operation] will [CONSEQUENCE]**
⚠️ **WARNING:** This will [SPECIFIC DESTRUCTION] and cannot be undone!
- a) Proceed with [operation] (DESTRUCTIVE)
- b) Use safer alternative: [describe]
- c) Abort operation
```

**Examples:**
- `git push --force` → "Will overwrite remote history"
- `git reset --hard` → "Will delete all uncommitted changes"
- `rm -rf` → "Will permanently delete files"
- Branch overwrites → "Will lose unique commits"

---

## **📋 CHAT REPORTING OF DECISIONS**

### **Critical Rule: EXACT COPY**
**NEVER CREATE DIFFERENT QA DECISIONS IN CHAT!**

1. **Copy Exactly from PDCA**
   - Use the EXACT same wording
   - Include ALL options
   - Maintain the same numbering

2. **Format for Chat:**
   ```markdown
   ### **QA Decisions Required:**
   
   **Decision 1: [Exact title from PDCA]**
   - a) [Exact option from PDCA]
   - b) [Exact option from PDCA]
   ```

3. **If No Decisions:**
   ```markdown
   ### **QA Decisions**
   **All clear, no decisions to make** - [Same explanation from PDCA]
   ```

---

## **🔄 DECISION LIFECYCLE**

### **1. Discovery Phase**
- Identify ambiguity or risk
- Research official sources
- Check project precedents

### **2. Formulation Phase**
- Create clear, distinct options
- Add rationale/consequences
- Number for easy reference

### **3. Presentation Phase**
- Include in PDCA Summary section
- Copy exactly to chat report
- Wait for user response

### **4. Implementation Phase**
- User responds with "1a, 2b" format
- Implement chosen options
- Mark decisions as completed [x]

---

## **🎯 THE 42 PRINCIPLE**

### **When to Ask Questions:**

1. **Terminology Ambiguity**
   ```markdown
   **Clarification Needed:** You mentioned "CMM" - do you mean:
   - CMM (Capability Maturity Model - original 1991 version)
   - CMMI (Capability Maturity Model Integration - current version)
   ```

2. **Scope Uncertainty**
   ```markdown
   **Clarification Needed:** "Update the components" could mean:
   - Update all components in components/ directory
   - Update only the components mentioned in source.env
   - Update component documentation
   Which did you intend?
   ```

3. **Missing Information**
   ```markdown
   **Clarification Needed:** To proceed with deployment:
   - Which environment? (dev/test/prod)
   - Which version tag?
   - Include database migrations?
   ```

---

## **📚 REFERENCE EXAMPLES FROM PROJECT**

### **From recovery/start-command.md:**
- Only present decisions with real risk
- Don't create "do it" vs "don't do it" options
- Warn before destructive operations

### **From howto.PDCA.md:**
- Use checkbox format in Summary section
- Number decisions for easy reference
- Include rationale with each option

### **From Real PDCAs:**
- "All clear, no decisions to make" when straightforward
- Numbered decisions when choices exist
- Completed checkboxes [x] for resolved decisions

---

## **✅ DECISION-MAKING CHECKLIST**

Before finalizing any PDCA:

1. **Decision Necessity**
   - [ ] Is this really a decision point?
   - [ ] Are there multiple valid options?
   - [ ] Is this the user's choice to make?

2. **Decision Quality**
   - [ ] Clear, descriptive title?
   - [ ] All options have rationale?
   - [ ] Consequences explained?
   - [ ] Checked official sources?

3. **Decision Presentation**
   - [ ] Formatted with checkboxes?
   - [ ] Numbered for reference?
   - [ ] Copied exactly to chat?

4. **Special Checks**
   - [ ] Destructive operations have warnings?
   - [ ] Ambiguous terms clarified?
   - [ ] Asked when unsure (42)?

---

**🎯 Remember: Good decisions empower users, bad decisions waste time!** 🤝✨

**"The only stupid question is the one not asked when clarity is needed."** 🤔💡