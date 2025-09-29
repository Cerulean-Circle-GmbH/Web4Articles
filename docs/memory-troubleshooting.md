# Memory System Troubleshooting Guide

**Last Updated:** 2025-09-29-UTC-0730  
**Version:** 1.0  
**Purpose:** Comprehensive troubleshooting for Web4Articles memory system issues

---

## 🧠 Memory System Quick Diagnostics

### Immediate Health Check
```bash
# Quick system status
./scripts/ensure-memory.sh

# If that fails, try manual checks:
ls -la memory.md                    # File exists?
wc -w memory.md                     # Adequate size?
grep "Agent Context Memory" memory.md  # Proper header?
```

**Expected Results:**
- ✅ Memory file exists and is readable
- ✅ Contains 4,000+ words
- ✅ Has proper "Agent Context Memory" header
- ✅ ensure-memory.sh completes without errors

---

## 🚨 Common Issues and Solutions

### Issue 1: Memory File Missing

**Symptoms:**
- `memory.md` file not found
- Agents ask to read multiple files for basic project info
- ensure-memory.sh reports file missing

**Diagnosis:**
```bash
ls -la memory.md  # File not found
pwd  # Verify you're in project root
```

**Solution:**
```bash
# Generate new memory file
./scripts/generate-memory.sh

# Verify creation
ls -la memory.md
wc -w memory.md  # Should be 4,000+ words

# Test with agent to ensure memory context works
```

**Prevention:**
- Ensure memory generation is part of agent startup
- Add memory.md to .gitignore exceptions if needed
- Regular backup of memory.md

---

### Issue 2: Memory Content Incomplete or Corrupted

**Symptoms:**
- Memory file exists but agents still read multiple files
- Memory missing expected sections
- Agents don't know basic project information

**Diagnosis:**
```bash
# Check memory content structure
grep -E "Project Overview|Process Framework|Agent Roles" memory.md

# Check for truncation
tail -10 memory.md

# Verify all sections present
cat memory.md | grep "^##" | wc -l  # Should be 10+ sections
```

**Solution:**
```bash
# Force regeneration with verbose output
./scripts/generate-memory.sh

# Verify all sections present
grep -E "Project Overview|Process Framework|Agent Roles|Technology Stack|Decision Framework" memory.md

# Check word count
wc -w memory.md  # Should be 4,000+ words

# Test specific content
grep -E "Vitest|PDCA.*template|BackgroundAgent" memory.md
```

**Prevention:**
- Regular validation with memory-validation-checklist.md
- Monitor memory generation logs for errors
- Verify source files are accessible

---

### Issue 3: Memory Generation Script Fails

**Symptoms:**
- `./scripts/generate-memory.sh` exits with error
- Script hangs or takes excessive time
- Generated memory is empty or incomplete

**Diagnosis:**
```bash
# Check script permissions
ls -la scripts/generate-memory.sh

# Test script components
python3 -c "import json; print('Python OK')"
which python3
ls -la scripts/memory-crawl-rules.json

# Check for missing dependencies
./scripts/generate-memory.sh 2>&1 | head -20
```

**Solution:**
```bash
# Fix permissions
chmod +x scripts/generate-memory.sh

# Verify configuration file
python3 -c "import json; json.load(open('scripts/memory-crawl-rules.json'))"

# Check Python availability
python3 --version

# Manual generation with debugging
bash -x scripts/generate-memory.sh 2>&1 | tee memory-debug.log

# If still failing, use backup method
cp memory.md memory.md.backup
# Manually recreate critical sections
```

**Prevention:**
- Regular testing of memory generation script
- Keep backup of working memory.md
- Monitor script execution time

---

### Issue 4: Memory Validation Script Issues

**Symptoms:**
- `./scripts/ensure-memory.sh` reports errors
- Script says memory is outdated when it's not
- Validation checks fail unexpectedly

**Diagnosis:**
```bash
# Check validation script
ls -la scripts/ensure-memory.sh
chmod +x scripts/ensure-memory.sh

# Manual validation
ls -la memory.md
find memory.md -mtime +1  # Should be empty if current

# Check file content
head -5 memory.md
wc -w memory.md
```

**Solution:**
```bash
# Fix script permissions
chmod +x scripts/ensure-memory.sh

# Update memory if genuinely outdated
./scripts/generate-memory.sh

# Verify memory content manually
grep "Agent Context Memory" memory.md
wc -w memory.md  # Should be 4,000+

# Test validation logic
ls -la memory.md  # Check timestamp
```

**Prevention:**
- Regular testing of validation script
- Monitor for false positives in validation
- Keep validation script updated

---

### Issue 5: Agents Not Using Memory Context

**Symptoms:**
- Agents read multiple files for basic project info
- Agents ask about PDCA format, tech stack, etc.
- Agents don't demonstrate memory knowledge

**Diagnosis:**
```bash
# Verify memory is current and complete
./scripts/ensure-memory.sh

# Check memory content quality
grep -E "Vitest|PDCA.*template|BackgroundAgent" memory.md

# Test specific knowledge
grep "Testing.*Vitest" memory.md
grep "6.*mandatory.*sections" memory.md
```

**Solution:**
```bash
# Regenerate memory
./scripts/generate-memory.sh

# Verify Cursor rules are applied
cat .cursor/rules/web4articles.mdc

# Test agent with specific questions:
# "What testing framework do we use?" (should answer Vitest)
# "What is the PDCA format?" (should know from memory)

# Check if memory.md is pinned/accessible in IDE
```

**Prevention:**
- Ensure Cursor rules are properly configured
- Verify memory.md is pinned in agent conversations
- Regular agent behavior monitoring

---

### Issue 6: Memory Too Large or Performance Issues

**Symptoms:**
- Memory generation takes excessive time (>30 seconds)
- Memory file is unusually large
- Agent conversations slow due to large context

**Diagnosis:**
```bash
# Check memory size
ls -lh memory.md
wc -w memory.md

# Monitor generation time
time ./scripts/generate-memory.sh

# Check for unusual content
grep -E "TODO|FIXME|DEBUG" memory.md
```

**Solution:**
```bash
# Review configuration for unnecessary files
cat scripts/memory-crawl-rules.json

# Check for duplicate content
sort memory.md | uniq -d

# Optimize configuration
# Edit scripts/memory-crawl-rules.json to exclude unnecessary patterns

# Regenerate with optimized config
./scripts/generate-memory.sh

# Verify size reduction
wc -w memory.md
```

**Prevention:**
- Regular monitoring of memory file size
- Periodic review of crawl configuration
- Remove obsolete or temporary content

---

### Issue 7: Configuration File Problems

**Symptoms:**
- Memory generation fails with JSON errors
- Scripts can't find configuration
- Missing or corrupted memory-crawl-rules.json

**Diagnosis:**
```bash
# Check configuration file
ls -la scripts/memory-crawl-rules.json

# Validate JSON syntax
python3 -c "import json; json.load(open('scripts/memory-crawl-rules.json'))"

# Check file permissions
ls -la scripts/
```

**Solution:**
```bash
# Validate and fix JSON
python3 -m json.tool scripts/memory-crawl-rules.json

# If corrupted, restore from git
git checkout scripts/memory-crawl-rules.json

# Or recreate with known good configuration
# (See memory-user-rules.md for reference configuration)

# Test after fix
./scripts/generate-memory.sh
```

**Prevention:**
- Backup configuration before changes
- Validate JSON syntax after edits
- Version control all configuration changes

---

## 🔧 Advanced Troubleshooting

### Memory System Performance Analysis

```bash
# Detailed performance profiling
time ./scripts/generate-memory.sh

# Check file system performance
time find . -name "*.md" | wc -l

# Monitor memory usage during generation
top -p $(pgrep -f generate-memory.sh)

# Check for file system issues
df -h .
ls -la scripts/
```

### Deep Content Analysis

```bash
# Analyze memory content distribution
grep "^##" memory.md | wc -l  # Section count
grep "###" memory.md | wc -l   # Subsection count

# Check for missing critical content
grep -c "BackgroundAgent\|Developer\|Architect" memory.md  # Should be 3+
grep -c "PDCA\|template\|mandatory" memory.md             # Should be 5+
grep -c "Vitest\|TypeScript\|ESM" memory.md               # Should be 3+

# Verify proper structure
awk '/^#/ {print NR ": " $0}' memory.md | head -20
```

### System Integration Testing

```bash
# Test complete memory workflow
./scripts/ensure-memory.sh
./scripts/generate-memory.sh
./scripts/ensure-memory.sh

# Test with actual agent startup
./scripts/agent-identity-first-startup.sh

# Verify memory validation checklist
# Follow docs/memory-validation-checklist.md

# Test Cursor integration
# Verify .cursor/rules/web4articles.mdc is working
```

---

## 📞 Escalation Procedures

### Level 1: Self-Service (< 15 minutes)
1. Run quick diagnostics
2. Try standard solutions
3. Check common issues section

### Level 2: ScrumMaster (15-60 minutes)
1. Review with team lead
2. Check team procedures
3. Coordinate team-wide fixes

### Level 3: Technical Team (> 1 hour)
1. Deep system analysis
2. Script debugging and enhancement
3. System architecture review

---

## 📊 Diagnostic Report Template

### Memory System Issue Report

**Date:** _____________  
**Reporter:** _____________  
**Severity:** [ ] Low [ ] Medium [ ] High [ ] Critical  

#### Issue Description
- _____________
- _____________

#### Symptoms Observed
- [ ] Memory file missing
- [ ] Memory content incomplete
- [ ] Script failures
- [ ] Agent behavior issues
- [ ] Performance problems
- [ ] Other: _____________

#### Diagnostic Results
```bash
# Commands run and results
ls -la memory.md
wc -w memory.md
./scripts/ensure-memory.sh
# (Include actual output)
```

#### Actions Taken
- _____________
- _____________

#### Resolution
- [ ] Issue resolved
- [ ] Temporary workaround applied
- [ ] Escalated to: _____________

#### Prevention Measures
- _____________
- _____________

---

## 🔗 Related Resources

- [Memory Maintenance Guide](./memory-maintenance-guide.md) - Regular maintenance procedures
- [Memory Validation Checklist](./memory-validation-checklist.md) - Quality assurance
- [Memory User Rules](./memory-user-rules.md) - Implementation guidance
- [Cursor Memory Rule](./cursor-memory-rule.md) - IDE integration

---

**🧠 Regular use of this troubleshooting guide ensures rapid resolution of memory system issues!**

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨
