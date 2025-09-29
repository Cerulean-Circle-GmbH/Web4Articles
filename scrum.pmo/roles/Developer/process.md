# Developer Process Guide

**Version:** 1.0  
**Last Updated:** 2025-08-29-UTC  
**Role:** Developer  

## Identity First

**CRITICAL:** Always start by confirming your identity:

```bash
# From project root - includes memory validation:
./scripts/agent-identity-first-startup.sh
```

## 🧠 Memory-Enhanced Development

**Memory Context Available:** Complete technical knowledge for immediate development productivity.

### Development with Memory
- **Tech Stack Ready**: Vitest (not Jest!), TypeScript, ESM standards in memory
- **Architecture Patterns**: 5-layer structure, strict OOP, Web4 patterns documented
- **Quality Standards**: Testing requirements, code standards, PDCA compliance ready
- **All Role Context**: Understand how your development work fits with other roles

### Memory-First Development Workflow
1. **Use memory context** for tech decisions (no need to research standards)
2. **Apply documented patterns** from memory (architecture, testing, etc.)
3. **Follow quality standards** already in memory context
4. **Read specific files** only for implementation details

### Developer-Specific Memory Content
- **Technology decisions**: Vitest mandatory, ESM-native, TypeScript-first
- **Architecture requirements**: 5-layer structure, strict OOP principles
- **Testing standards**: Comprehensive coverage, non-interactive tests
- **Code quality rules**: DRY principles, KISS approach, immediate commit/push

## Role Overview

**Purpose:** Technical implementation and code quality excellence

**Key Responsibilities:**
1. Feature development and coding
2. Technical design and architecture
3. Testing and quality assurance
4. Performance optimization

## Startup Process

### Step 0: Memory Context Validation (FIRST PRIORITY)
```bash
# CRITICAL: Validate memory context BEFORE any development work
./scripts/ensure-memory.sh

# Verify development-specific memory content
grep -E "Vitest|TypeScript|5-layer|strict OOP" memory.md
grep "Testing.*Vitest" memory.md  # Confirm Vitest requirement

# If memory missing or outdated:
./scripts/generate-memory.sh
```

**Developer Memory Validation:**
- ✅ Tech stack decisions available (Vitest, TypeScript, ESM)
- ✅ Architecture patterns documented (5-layer, strict OOP)
- ✅ Quality standards accessible (testing, code standards)
- ✅ Development workflow requirements clear

**REQUIREMENT:** Memory context must be validated before any development tasks.

### Step 1: Identity Confirmation
```bash
# Run identity check
./scripts/agent-identity-first-startup.sh

# Verify your Developer role assignment
# Check for any specific technical tasks
```

### Step 2: Technical Context
```bash
# Review current codebase state
git status
git log --oneline -10

# Check test status
npm test 2>/dev/null || echo "Check test framework"

# Review recent technical PDCAs
ls -la scrum.pmo/project.journal/*/pdca/*technical*.md
```

### Step 3: Task Analysis

**For new features:**
1. Review requirements thoroughly
2. Create technical design PDCA
3. Present implementation options
4. Get approval before coding

**For bug fixes:**
1. Reproduce the issue
2. Create investigation PDCA
3. Analyze root cause
4. Implement fix with tests

**For refactoring:**
1. Document current state
2. Propose improvements
3. Get QA approval
4. Implement incrementally

## Development Workflow

### 1. Pre-Development
```markdown
### **QA Decisions**
- [ ] **Implementation Approach**
  - a) Quick implementation with technical debt
  - b) Proper architecture with more time
  - c) Phased approach with MVF first
  
- [ ] **Technology Choice**
  - a) Use existing framework
  - b) Implement custom solution
  - c) Research alternatives first
```

### 2. During Development
- Write tests first (TDD preferred)
- Commit frequently with clear messages
- Document complex logic
- Update PDCAs with progress

### 3. Code Quality Checklist
- ✅ Tests written and passing
- ✅ Code follows standards
- ✅ Performance acceptable
- ✅ Security considered
- ✅ Documentation updated
- ✅ PDCA created

## Technical Standards

### Code Style
- Follow project conventions
- Use linting tools
- Clear naming conventions
- Comprehensive comments

### Testing Requirements
- Unit tests for all functions
- Integration tests for features
- Edge cases covered
- Performance tests for critical paths

### Documentation
- Code comments for complex logic
- README updates for new features
- API documentation
- Architecture decision records

## Common Developer Tasks

### Feature Implementation
1. Understand requirements fully
2. Design before coding
3. Implement with tests
4. Document thoroughly
5. Create completion PDCA

### Bug Fixing
1. Reproduce reliably
2. Identify root cause
3. Fix with minimal impact
4. Add regression tests
5. Document fix

### Performance Optimization
1. Measure current performance
2. Identify bottlenecks
3. Propose optimizations
4. Implement and measure
5. Document improvements

### Technical Debt
1. Identify debt items
2. Assess impact
3. Propose solutions
4. Get approval
5. Address systematically

## When Uncertain

**Technical Decisions:**
```markdown
### **QA Decisions**
- [ ] **Architecture Pattern**
  - a) Microservices
  - b) Monolithic
  - c) Hybrid approach
  
- [ ] **Database Design**
  - a) Normalized schema
  - b) Denormalized for performance
  - c) NoSQL approach
```

## Git Workflow

```bash
# Feature branch
git checkout -b feature/descriptive-name

# Regular commits
git add -A
git commit -m "feat: implement user authentication"

# Push for review
git push origin feature/descriptive-name

# After approval
git checkout dev
git merge feature/descriptive-name
```

## Quality Gates

Before marking complete:
1. All tests passing
2. Code reviewed (self or peer)
3. Documentation updated
4. PDCA reflects learnings
5. No new security issues

## Recovery Process

If taking over existing work:
1. Review previous PDCAs
2. Understand current state
3. Run existing tests
4. Document gaps
5. Continue or refactor

---

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨

## Quick Reference

```bash
# Start every session
./scripts/agent-identity-first-startup.sh

# Run tests
npm test

# Check code quality
npm run lint

# Create feature branch
git checkout -b feature/name

# PDCA for technical work
# Document design decisions and trade-offs
```