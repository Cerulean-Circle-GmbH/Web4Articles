# Memory Validation Checklist

**Last Updated:** 2025-09-29-UTC-0725  
**Version:** 1.0  
**Purpose:** Comprehensive checklist for validating memory system functionality

---

## 🧠 Memory System Validation

### Pre-Agent Work Checklist

**CRITICAL:** Every agent must complete this checklist before starting work.

#### ✅ Step 0: Memory Context Validation

**[ ] Memory File Exists**
```bash
# Check memory file exists
ls -la memory.md
```

**[ ] Memory is Current**
```bash
# Ensure memory is current (auto-regenerates if needed)
./scripts/ensure-memory.sh
```

**[ ] Memory Content Size**
```bash
# Verify substantial content (should be 4,000+ words)
wc -w memory.md
# Expected: 4000+ words
```

**[ ] Memory Header Present**
```bash
# Confirm proper memory structure
grep "Agent Context Memory" memory.md
# Expected: Should find header
```

**[ ] Essential Sections Present**
```bash
# Verify all critical sections exist
grep -E "Project Overview|Process Framework|Agent Roles|Technology Stack" memory.md
# Expected: All sections found
```

---

## 🔧 Role-Specific Memory Validation

### For All Roles

**[ ] PDCA Requirements Available**
```bash
grep -E "PDCA.*template|6.*mandatory.*sections|UTC.*timestamp" memory.md
# Expected: PDCA methodology documented
```

**[ ] Technology Stack Documented**
```bash
grep -E "Vitest.*Jest.*BANNED|TypeScript|ESM-native" memory.md
# Expected: Tech stack decisions clear
```

**[ ] Role Definitions Present**
```bash
grep -E "BackgroundAgent|Developer|Architect|ScrumMaster|PO|Tester" memory.md
# Expected: All major roles documented
```

### Developer-Specific Validation

**[ ] Development Standards Available**
```bash
grep -E "5-layer.*structure|strict OOP|DRY principles" memory.md
# Expected: Architecture and quality standards
```

**[ ] Testing Requirements Clear**
```bash
grep -E "Vitest.*comprehensive.*coverage|non-interactive.*tests" memory.md
# Expected: Testing methodology documented
```

### Architect-Specific Validation

**[ ] Architecture Patterns Documented**
```bash
grep -E "PlantUML|CMMI Level 4|systematic.*investigation" memory.md
# Expected: Architecture process and standards
```

### ScrumMaster-Specific Validation

**[ ] Process Coordination Available**
```bash
grep -E "cross-role.*feedback|process.*improvement|traceability" memory.md
# Expected: Process management guidance
```

### PO-Specific Validation

**[ ] Requirements Framework Present**
```bash
grep -E "requirements.*validation|stakeholder.*alignment|business.*goals" memory.md
# Expected: Product ownership guidance
```

### Tester-Specific Validation

**[ ] Quality Standards Available**
```bash
grep -E "test.*automation|CLI.*manual.*QA|user.*pipeline" memory.md
# Expected: Testing and QA standards
```

---

## 🚨 Troubleshooting Memory Issues

### Memory File Missing

**Problem:** `memory.md` file not found
**Solution:**
```bash
# Generate new memory file
./scripts/generate-memory.sh

# Verify creation
ls -la memory.md
```

### Memory Content Incomplete

**Problem:** Memory file exists but missing sections
**Solution:**
```bash
# Force regeneration
./scripts/generate-memory.sh

# Verify all sections present
grep -E "Project Overview|Process Framework|Agent Roles" memory.md
```

### Memory Outdated

**Problem:** Memory contains old information
**Solution:**
```bash
# Check memory age
ls -la memory.md

# Regenerate if older than 1 day
./scripts/ensure-memory.sh
```

### Memory Validation Script Missing

**Problem:** `./scripts/ensure-memory.sh` not found
**Solution:**
```bash
# Check script exists
ls -la scripts/ensure-memory.sh

# Make executable if needed
chmod +x scripts/ensure-memory.sh

# Run directly if needed
./scripts/generate-memory.sh
```

---

## ✅ Memory System Success Indicators

### Agent Behavior Validation

**[ ] No Manual File Crawling**
- Agent doesn't need to read multiple files for basic project knowledge
- Agent references PDCA requirements without file reading
- Agent knows tech stack decisions immediately

**[ ] Consistent Understanding**
- Agent uses correct technology (Vitest, not Jest)
- Agent applies proper PDCA format
- Agent understands role relationships

**[ ] Immediate Productivity**
- Agent starts work without extensive context building
- Agent applies quality standards from memory
- Agent makes informed decisions quickly

### Memory Content Quality

**[ ] Comprehensive Coverage**
- All essential project knowledge included
- Role definitions complete and accurate
- Process requirements clearly documented

**[ ] Current Information**
- Memory reflects latest project state
- Technology decisions up to date
- Process changes incorporated

**[ ] Proper Structure**
- Memory organized logically
- Sections clearly defined
- Content easily accessible

---

## 🔄 Memory Maintenance Protocol

### Daily Validation (ScrumMaster)

```bash
# Check memory currency
./scripts/ensure-memory.sh

# Verify team compliance
# (Check that agents are using memory vs. reading files)

# Update if needed
./scripts/generate-memory.sh
```

### After Significant Changes

**Trigger Memory Update When:**
- Role processes modified (`scrum.pmo/roles/*/process.md`)
- PDCA framework updated (`scrum.pmo/roles/_shared/PDCA/`)
- Technology stack changes (`docs/tech-stack.md`)
- Project structure modifications

**Update Process:**
```bash
# Regenerate memory
./scripts/generate-memory.sh

# Validate new content
./scripts/ensure-memory.sh

# Notify team of memory update
# (Through appropriate communication channels)
```

---

## 📊 Validation Report Template

### Memory System Status Report

**Date:** _____________  
**Validator:** _____________  
**Memory File Size:** _____________ words  
**Last Updated:** _____________  

#### Validation Results
- [ ] Memory file exists and accessible
- [ ] Content size adequate (4,000+ words)
- [ ] All essential sections present
- [ ] Role-specific content validated
- [ ] Agent behavior confirms memory usage
- [ ] No manual crawling observed

#### Issues Found
- _____________
- _____________
- _____________

#### Actions Taken
- _____________
- _____________
- _____________

#### Recommendations
- _____________
- _____________
- _____________

---

**🧠 Regular use of this checklist ensures optimal memory system performance and agent productivity!**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨
