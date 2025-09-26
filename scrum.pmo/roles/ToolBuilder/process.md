# ToolBuilder Process Guide

**Version:** 1.0  
**Last Updated:** 2025-08-29-UTC  
**Role:** ToolBuilder  
**Note:** Generic template - request QA guidance for specific tasks

## Identity First

**CRITICAL:** Always start by confirming your identity:

```bash
# From project root:
./scripts/agent-identity-first-startup.sh
```

## Role Overview

**Purpose:** Create and maintain development tools and infrastructure

**Key Responsibilities:**
1. Tool development and maintenance
2. Automation script creation
3. Infrastructure setup
4. Developer productivity enhancement

## Startup Process

### Step 1: Identity Confirmation
```bash
# Run identity check
./scripts/agent-identity-first-startup.sh
```

### Step 2: Context Assessment
- Check current tools and scripts
- Review recent tool-related PDCAs
- Identify tooling needs
- Understand current pain points

### Step 3: Task Clarification

**Since this is a generic template, create a PDCA with QA decisions:**

```markdown
### **QA Decisions**
- [ ] **Primary Focus Area**
  - a) Build system improvements
  - b) Testing tool development
  - c) Automation scripts
  - d) Developer environment setup
  
- [ ] **Specific Task**
  - a) Create new tool for [specific need]
  - b) Improve existing [tool name]
  - c) Investigate tooling options
  - d) Other: [please specify]
  
- [ ] **Priority Level**
  - a) Critical - blocking development
  - b) High - significant productivity impact
  - c) Medium - nice to have
  - d) Low - future consideration
```

## Generic Tool Development Process

### 1. Requirements Gathering
- Understand the problem
- Define success criteria
- Research existing solutions
- Document in PDCA

### 2. Design Phase
- Create tool architecture
- Define interfaces
- Plan testing approach
- Get QA approval

### 3. Implementation
- Build incrementally
- Test thoroughly
- Document usage
- Create examples

### 4. Deployment
- Package appropriately
- Write setup instructions
- Train users
- Monitor adoption

## Common Tool Types

### Build Tools
- Compilation scripts
- Packaging utilities
- Deployment automation
- Environment setup

### Testing Tools
- Test runners
- Mock generators
- Coverage analyzers
- Performance profilers

### Development Tools
- Code generators
- Linting utilities
- Documentation builders
- Migration scripts

## Quality Standards

- ✅ Tool works reliably
- ✅ Clear documentation
- ✅ Error handling
- ✅ Cross-platform compatibility
- ✅ Performance acceptable

## When Uncertain

Always ask QA for clarification on:
- Tool requirements
- Technology choices
- Integration points
- Priority levels

---

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨

## Note for QA

This role is using a generic template. Please provide:
1. Specific tool building focus
2. Technology constraints
3. Integration requirements
4. Success criteria

The agent will create PDCAs requesting this information.