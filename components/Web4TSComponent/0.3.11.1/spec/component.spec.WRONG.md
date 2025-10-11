# Web4TSComponent - Technical Specification

**Version:** 0.3.11.1  
**Document Type:** Component Specification  
**Audience:** Developers, Architects, System Integrators  
**Status:** Active Development  

---

## Specification Overview

**Component Classification:** Meta-Component (Component Generator)  
**Architecture Pattern:** Auto-Discovery CLI with TypeScript Reflection  
**Maturity Level:** CMM4 (Quantitatively Managed)  
**Purpose:** TypeScript component standards enforcement and automatic lifecycle management

**For quick start guide, see:** [README.md](../README.md)

---

## 1. Quick Start Reference

```bash
npm start
```

**That's it.** Seriously. The component handles its entire lifecycle automatically:

- ✅ Checks if build is needed → **builds automatically**
- ✅ Checks dependencies → **installs automatically**
- ✅ Creates symlinks → **handles automatically**
- ✅ Runs itself → **works immediately**

**Every component created by Web4TSComponent works exactly the same way.** Just `npm start` and you're done.

---

## 1.1. CLI Command Reference (Version 0.3.11.1)

### Complete CLI Output

```
Web4 Web4TSComponent CLI Tool v0.3.11.1 - Dynamic Method Discovery with Structured Documentation

Commands:
  web4tscomponent initProject <?targetDir:'.'>
    Initialize or upgrade project with Web4 global configuration files

  web4tscomponent create <name> <?version:'0.1.0.0'> <?options:'all'>
    Create new Web4-compliant component with auto-discovery CLI and full architecture

  web4tscomponent find <componentDir>
    Discover and analyze Web4 components in directory with compliance reporting

  web4tscomponent on <component> <?version:'latest'>
    Load component context for chaining operations (essential for workflows)

  web4tscomponent upgrade <versionType>
    Upgrade component to next version with semantic version control

  web4tscomponent tree <?depth:'4'> <?showHidden:'false'>
    Display tree structure of component directory

  web4tscomponent setLatest <?targetVersion:'current'>
    Update latest symlink to point to specified version (requires context)

  web4tscomponent setDev <?targetVersion:'current'>
    Set development version link - version currently under development (requires context)

  web4tscomponent setTest <?targetVersion:'current'>
    Set test version link - version ready for 100% revision testing (requires context)

  web4tscomponent setProd <?targetVersion:'current'>
    Set production version link - version that achieved 100% testing success (requires context)

  web4tscomponent links <?action>
    Display semantic version links - shows own links if no context, or target component links if context loaded

  web4tscomponent test <?skipPromotion:'false'>
    Execute test command - runs own tests if no context, or target component tests if context loaded

  web4tscomponent releaseTest <?skipPromotion:'false'>
    Run tests with major release promotion (nextMinor instead of nextPatch)

  web4tscomponent start
    Execute start command in loaded component context

  web4tscomponent build
    Execute build command - builds own component if no context, or target component if context loaded

  web4tscomponent clean
    Execute clean command

  web4tscomponent removeVersion <?componentName:'current'> <?version:'current'>
    Remove a specific version of a component

  web4tscomponent removeComponent <?componentName:'current'>
    Remove an entire component and all its versions

  web4tscomponent compare <components>
    Compare multiple components and generate detailed comparison table

  web4tscomponent info <?topic:'overview'>
    Display comprehensive information about Web4 standards and guidelines

  web4tscomponent verifyAndFix
    Verify and fix symlinks for component

  web4tscomponent updateBuildSystem
    Update shell script structure with latest smart build templates

  web4tscomponent getContext <?format:'json'>
    Get current component context from working directory

Examples:
  # Method chaining in single command (common pattern - use often!)
  web4tscomponent on Unit 0.3.0.5 tree 2                    # Load context + show structure
  web4tscomponent on Web4TSComponent 0.3.2.0 upgrade nextBuild     # Load + upgrade component
  web4tscomponent on MyComponent 0.1.0.0 verifyAndFix              # Load + fix symlinks

  # Alternative: Separate commands (also works)
  web4tscomponent on Unit 0.3.0.5                        # 1. Load component context
  web4tscomponent tree 2                                 # 2. Show directory structure

  # Create operations
  web4tscomponent create Auth.Validator 0.1.0.0 all # Create new Web4-compliant component

  # Modify operations
  web4tscomponent upgrade nextBuild       # Upgrade component to next version
  web4tscomponent setLatest 0.3.11.1   # Update latest symlink

  # Query operations
  web4tscomponent find components/         # Discover and analyze Web4 components
  web4tscomponent info overview                # Display Web4 standards info
```

### Core Use Cases

#### 1. **Component Creation & Project Initialization**

**Use Case:** Bootstrap new Web4 component with complete architecture

```bash
# Initialize Web4 project structure (DRY setup)
web4tscomponent initProject

# Create new component with auto-discovery CLI
web4tscomponent create MyComponent 0.1.0.0 all
```

**What Happens:**
- **initProject:** Creates root `tsconfig.json`, `package.json`, global `node_modules` (DRY principle)
- **create:** Generates component with layered architecture, TypeScript, Vitest, auto-discovery CLI, build scripts, templates
- **Result:** Fully functional component that works exactly like Web4TSComponent itself

**When to Use:** Starting new project or adding new component to existing project

---

#### 2. **Context-Aware Operations (Method Chaining)**

**Use Case:** Load component context and perform operations on it

```bash
# Single command with chaining (recommended)
web4tscomponent on MyComponent 0.1.0.0 tree 3

# Or separate commands (context persists in working directory)
web4tscomponent on MyComponent 0.1.0.0
web4tscomponent tree 3
web4tscomponent build
web4tscomponent test
```

**What Happens:**
- **on:** Loads component metadata into context (path, version, name)
- **Subsequent commands:** Operate on loaded component instead of self
- **Chaining:** Multiple operations in single command (recommended for scripting)

**When to Use:** Any operation targeting a specific component version

---

#### 3. **Development Workflow (Semantic Version Links)**

**Use Case:** Systematic development with dev → test → prod progression

```bash
# Setup: Mark version under development
web4tscomponent on MyComponent 0.1.0.0 setDev

# Development cycle
web4tscomponent on MyComponent dev build
web4tscomponent on MyComponent dev test

# After 100% test success:
# - test → promoted to prod (0.1.1.0 created)
# - latest → updated to 0.1.1.0
# - dev → updated to 0.1.1.1 (next build)
# - Automatic version promotion workflow

# Check semantic links
web4tscomponent on MyComponent latest links
```

**What Happens:**
- **dev:** Version currently under development (work here)
- **test:** Version ready for testing (100% revision testing target)
- **prod:** Version that achieved 100% testing success
- **latest:** Stable release (same as prod)
- **Automatic Promotion:** On 100% test success, systematic version progression

**When to Use:** All development - this is the systematic Web4 workflow

---

#### 4. **Version Management & Upgrades**

**Use Case:** Semantic versioning with intelligent promotion

```bash
# Load component context
web4tscomponent on MyComponent 0.1.5.3

# Upgrade options
web4tscomponent upgrade nextBuild    # 0.1.5.3 → 0.1.5.4 (bug fix)
web4tscomponent upgrade nextPatch    # 0.1.5.3 → 0.1.6.0 (feature)
web4tscomponent upgrade nextMinor    # 0.1.5.3 → 0.2.0.0 (breaking)
web4tscomponent upgrade nextMajor    # 0.1.5.3 → 1.0.0.0 (major release)
```

**What Happens:**
- **nextBuild (W):** Build number increment (0.0.0.W) - bug fixes, small changes
- **nextPatch (Z):** Patch version increment (0.0.Z.0) - new features, enhancements
- **nextMinor (Y):** Minor version increment (0.Y.0.0) - significant features, API changes
- **nextMajor (X):** Major version increment (X.0.0.0) - breaking changes, major release
- **Copies entire version directory** with updated metadata

**When to Use:** Creating new version after completing development cycle

---

#### 5. **Testing & Quality Assurance**

**Use Case:** Run tests with automatic promotion on success

```bash
# Standard testing (promotes to nextPatch on 100% success)
web4tscomponent on MyComponent test test

# Release testing (promotes to nextMinor on 100% success)
web4tscomponent on MyComponent test releaseTest

# Development testing (no promotion)
web4tscomponent on MyComponent test test true  # skipPromotion=true
```

**What Happens:**
- **test:** Runs test suite, logs to `test/logs/`, checks for 100% success
- **100% Success Triggers:** Automatic promotion workflow (see Use Case 3)
- **< 100% Success:** No promotion, stay on test version, fix issues
- **releaseTest:** Uses nextMinor instead of nextPatch for major releases

**When to Use:** 
- **test:** Regular development cycle validation
- **releaseTest:** Before major releases
- **skipPromotion:** During development/debugging

---

#### 6. **Component Discovery & Analysis**

**Use Case:** Find and analyze Web4 components in project

```bash
# Discover components in directory
web4tscomponent find components/

# Get context of current directory
web4tscomponent getContext json

# Compare multiple components
web4tscomponent compare "Component1 0.1.0.0,Component2 0.2.0.0"

# Display Web4 standards info
web4tscomponent info overview
```

**What Happens:**
- **find:** Scans directory, identifies Web4 components, reports compliance
- **getContext:** Extracts component metadata from working directory
- **compare:** Generates detailed comparison table of multiple components
- **info:** Shows Web4 architectural principles and guidelines

**When to Use:** Project analysis, compliance verification, understanding project structure

### What `npm start` Actually Does:

```bash
# When you run: npm start
# The component automatically:
1. Runs smart build check (only rebuilds if needed)
2. Installs dependencies if missing (with DRY-compliant symlinks)
3. Compiles TypeScript to JavaScript
4. Starts the CLI ready for commands
5. Shows help with all auto-discovered methods
```

### Quick Start Example:

```bash
cd /Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.3.2

# Start the component (it handles everything automatically)
npm start

# Or use the component wrapper directly (it also auto-builds)
./web4tscomponent

# Create a new component (it will work the same way!)
./web4tscomponent create MyAwesomeComponent 0.1.0.0 all

# Test your new component (same pattern!)
cd ../../MyAwesomeComponent/0.1.0.0
npm start  # ← Same magic, fully automatic
```

---

## 2. Component Definition

**Web4TSComponent** is a meta-component that enforces TypeScript component standards and manages the complete component lifecycle through auto-discovery CLI patterns.

### Core Capabilities:

1. **Creates versioned TypeScript components** with standardized architecture
2. **Enforces Web4 architectural principles** (empty constructors, scenario support, layered architecture)
3. **Auto-discovers CLI commands** from TypeScript methods (no manual CLI configuration)
4. **Manages automatic version promotion workflows** after successful testing
5. **Enforces DRY principle** (symlinked node_modules, no duplication)
6. **Provides comprehensive test suites** with isolated test environments
7. **Handles lifecycle automatically** (build, dependencies, execution)

### Key Features:

- ✅ **Auto-Discovery CLI** - Add methods to component, they appear in CLI automatically
- ✅ **Automatic Lifecycle** - `npm start` handles everything (build, deps, execution)
- ✅ **Project Initialization** - `initProject` bootstraps any project with Web4 standards
- ✅ **Version Management** - Semantic versioning with intelligent promotion workflow
- ✅ **DRY Compliance** - Detects and prevents node_modules duplication
- ✅ **Test Isolation** - ProjectRootMocker ensures tests don't affect production
- ✅ **Method Chaining** - Fluent API with context-aware operations
- ✅ **CMM3+ Compliance** - Objective, reproducible, automated verification
- ✅ **Self-Replicating** - Components created work the same way

---


---

## Detailed Documentation Chapters

This specification follows the **Overview → Details → Actionable Consequences** principle:

### 📖 Part 1: Understanding (Read First)

**[Chapter 1: Architecture](chapters/01-architecture.md)** - How the system works  
Deep dive into:
- Automatic project initialization & DRY principle
- Auto-discovery CLI mechanism
- Tab completion architecture (3-layer system)
- TypeScript AST parsing & reflection
- Context-aware completion flows

*Read this to understand HOW Web4TSComponent achieves zero-configuration operation.*

---

### 🛠️ Part 2: Doing (Actionable Guides)

**[Chapter 2: Development Guide](chapters/02-development-guide.md)** - How to extend & develop  
Practical guides for:
- API extension specification
- Adding methods (the safe way)
- TSDoc magic & annotations
- Context-aware method patterns
- Real-world examples & checklists
- Common mistakes to avoid

*Read this to ADD FEATURES to Web4TSComponent or components it creates.*

---

**[Chapter 3: Testing & Quality Assurance](chapters/03-testing-and-quality.md)** - How to test & validate  
Testing workflows:
- Testing specification & commands
- 100% test success workflows
- Automatic version promotion
- Development workflow (dev → test → prod)
- Comprehensive test suite overview
- DRY compliance validation

*Read this to TEST components and understand the QUALITY PROCESS.*

---

**[Chapter 5: Troubleshooting & Quick Reference](chapters/05-troubleshooting.md)** - How to fix issues  
Problem solving:
- Troubleshooting common issues
- Quick reference commands
- Why this works (Web4 magic explained)
- Success criteria & validation
- Guidance for new agents

*Read this when THINGS DON'T WORK or you need QUICK ANSWERS.*

---

### 📋 Part 3: Requirements (Reference)

**[Chapter 4: Compliance & Standards](chapters/04-compliance-and-standards.md)** - Requirements & verification  
Standards reference:
- Web4 compliance principles
- CMM4 implementation specification
- Version history & migration paths
- Related documentation
- Capability maturity model details

*Read this to understand REQUIREMENTS and verify COMPLIANCE.*

---

## Navigation Guide

### If you want to...

**Understand how it works:**
1. Read the CLI Command Reference above (section 1.1)
2. Read [Chapter 1: Architecture](chapters/01-architecture.md)

**Add a new method:**
1. Read [Chapter 2: Development Guide](chapters/02-development-guide.md) § API Extension
2. Follow the 3-step process (TSDoc + method + return this)

**Test a component:**
1. Read [Chapter 3: Testing & Quality](chapters/03-testing-and-quality.md) § Testing Specification
2. Run: `npm test` or `web4tscomponent on ComponentName version test`

**Fix a problem:**
1. Read [Chapter 5: Troubleshooting](chapters/05-troubleshooting.md)
2. Check the specific issue section

**Verify compliance:**
1. Read [Chapter 4: Compliance & Standards](chapters/04-compliance-and-standards.md)
2. Check Web4 principles and CMM4 requirements

---

## Document Organization Principle

This specification is organized following the **"What/Why → How → Do"** flow:

1. **Overview (This Page):** What Web4TSComponent is, why it matters, how to use it immediately
2. **Architecture (Chapter 1):** How the internal mechanisms work (details)
3. **Development (Chapter 2):** How to extend it (actionable)
4. **Testing (Chapter 3):** How to validate it (actionable)
5. **Troubleshooting (Chapter 5):** How to fix it (actionable)
6. **Compliance (Chapter 4):** What's required (reference)

**Start at the top, read chapters as needed, return to this index for navigation.**

---

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨
