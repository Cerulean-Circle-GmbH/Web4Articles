# Chapter 4: Compliance & Standards

**Document:** Web4TSComponent Technical Specification  
**Chapter:** Web4 Compliance & CMM4 Standards  
**Focus:** Requirements and compliance verification

[← Back to Index](../component.spec.md)

---

## 🛡️ Web4 Compliance Principles

Web4TSComponent enforces these architectural principles:

### 1. Empty Constructor Principle

```typescript
// ✅ CORRECT
constructor() {
  this.model = { /* defaults */ };
}

// ❌ WRONG
constructor(config: Config) { }
```

### 2. Scenario Support

```typescript
// ✅ REQUIRED for all components
init(scenario: Scenario<Model>): this
async toScenario(): Promise<Scenario<Model>>
```

### 3. Human-Readable Errors

```typescript
// ✅ CORRECT
throw new Error('I couldn\'t find the component. Please check the name and version.');

// ❌ WRONG
throw new Error('ENOENT: no such file or directory');
```

### 4. Method Chaining

```typescript
// ✅ CORRECT - Return this for chaining
async myMethod(): Promise<this> {
  return this;
}
```

### 5. DRY Principle

```typescript
// ✅ CORRECT - Symlinked dependencies
ln -sf ../../../node_modules node_modules

// ❌ WRONG - Real directories duplicate dependencies
npm install  # without proper symlink setup
```

**Related:** See [Automatic Project Initialization](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/01-architecture.md#-automatic-project-initialization) | [chapters/01-architecture.md](chapters/01-architecture.md#-automatic-project-initialization) for how DRY is enforced

### 5a. The `--help` Exception (Educational Tool)

**The ONLY flag in Web4:**

```bash
# ✅ THE ONLY SUPPORTED FLAG (educational exception)
web4tscomponent --help

# Shows philosophy preamble explaining:
# • Why flags broke Unix/Linux OOP in the 1980s-1990s
# • How Web4 restores method-based design
# • Then shows normal help output
```

**Why this exception exists:**

The `--help` flag is so ingrained in CLI culture that we support it as an **educational tool**. When users run `--help`, they see a detailed explanation of why Web4 forbids flags, how flags broke the original OOP intent of Unix, and how Web4 restores that vision.

**This is the ONLY flag ever supported in Web4.** All other flags (`--version`, `--verbose`, `-v`, `-h`, etc.) are strictly forbidden.

**Philosophy:**
- Flags are configuration, not behavior
- Flags destroyed Unix's method-based simplicity
- Web4 uses methods: `info` instead of `--version`, `verbose` instead of `--verbose`
- Tab completion and auto-discovery replace flag documentation
- Method chaining replaces flag combinations

### 6. Flat Model Principle (Scenarios)

**Core Principle:** Models MUST be flat (primitives + IORs only) for serialization and hibernation.

```typescript
// ✅ CORRECT - Flat model with IORs
interface Web4TSComponentModel {
  uuid: string;
  component: string;
  version: {  // ← IOR (Interoperable Object Reference)
    uuid: string;
    component: string;
    version: string;
  };
  projectRoot: string;
}

// ❌ WRONG - Object references in model
interface Web4TSComponentModel {
  uuid: string;
  component: string;
  version: SemanticVersion;     // ← Object instance (NOT serializable)
  context: Web4TSComponent;     // ← Object reference (causes circular JSON)
}

// ✅ CORRECT - Object references as private attributes
class DefaultWeb4TSComponent {
  private context?: Web4TSComponent;  // ← Private, not in model
  model: Web4TSComponentModel;        // ← Flat, serializable
}
```

**Why Models Must Be Flat:**
1. ✅ **Serializable** - Can convert to JSON for scenarios
2. ✅ **Hibernation** - Universal format for persisting object state
3. ✅ **No Circular References** - IORs are identifiers, not object references
4. ✅ **Interoperable** - Can be shared across components/processes/networks

**What Belongs in Model:**
- ✅ Primitives: `string`, `number`, `boolean`, `null`
- ✅ Arrays: `string[]`, `number[]`
- ✅ Plain objects: `{ key: value }`
- ✅ IORs: `{ uuid: string, component: string, version: string }`
- ✅ Nested scenarios: Full scenario objects from `component.toScenario()`

**What NEVER Belongs in Model:**
- ❌ Object references: `this.context`, `this.web4ts`
- ❌ Class instances: `new SomeClass()`
- ❌ Functions/callbacks: `() => {}`
- ❌ Circular references: `{ parent: this }`

**Implementation Pattern:**
```typescript
async toScenario(): Promise<Scenario<Web4TSComponentModel>> {
  // ✅ Filter out object references before serialization
  const { context, version, ...cleanModel } = this.model;
  
  // ✅ Convert nested components to their scenarios
  const versionScenario = await this.model.version.toScenario();
  
  return {
    ior: {
      uuid: this.model.uuid,
      component: this.model.component,
      version: this.model.version.toString()
    },
    owner: ownerData,
    model: {
      ...cleanModel,
      version: versionScenario  // ← Full scenario, not object
    }
  };
}
```

**Reference:** [2025-11-11-UTC-2012.refactor-create-scenario-generation-radical-oop.pdca.md](../../session/2025-11-11-UTC-2012.refactor-create-scenario-generation-radical-oop.pdca.md)

### 7. Nested Scenarios Pattern

**Each component creates its own scenario** - scenarios compose hierarchically.

```typescript
// ✅ Component calls toScenario() on nested components
const web4tsScenario = await web4ts.toScenario();
// → Internally calls SemanticVersion.toScenario() for version
//   → Which calls User.toScenario() for owner
//   → Result: Fully nested, serializable scenario tree
```

**Scenario Structure Example:**
```json
{
  "ior": { "uuid": "...", "component": "Web4TSComponent", "version": "0.3.20.2" },
  "owner": "base64encodedUserScenario...",
  "model": {
    "uuid": "...",
    "component": "Web4TSComponent",
    "version": {
      "ior": { "uuid": "...", "component": "SemanticVersion", "version": "0.3.20.2" },
      "owner": "base64encodedUserScenario...",
      "model": { "major": 0, "minor": 3, "patch": 20, "revision": 2 }
    }
  }
}
```

**Key Properties:**
- ✅ **Self-Contained** - Each scenario includes all data needed to restore that component
- ✅ **Composable** - Scenarios nest naturally without circular references
- ✅ **Traceable** - Each nested component has its own IOR (identity)
- ✅ **Auditable** - Owner field tracks who created each component instance

**Reference:** [2025-11-11-UTC-2012.refactor-create-scenario-generation-radical-oop.pdca.md](../../session/2025-11-11-UTC-2012.refactor-create-scenario-generation-radical-oop.pdca.md)

---

## 🚀 Quick Reference

### The Only Command You Really Need:

```bash
npm start  # Handles everything automatically
```

### Other Useful Commands (But npm start handles them):

```bash
# These happen automatically, but you can run them manually:
npm test       # Test the component
npm run build  # Build manually
npm run clean  # Clean and rebuild

# Direct CLI usage (after build):
./web4tscomponent                              # Show help
./web4tscomponent create MyComponent 0.1.0.0 all  # Create component
./web4tscomponent on MyComponent 0.1.0.0 test  # Load context and test
./web4tscomponent on MyComponent 0.1.0.0 upgrade nextBuild test  # Chain operations
```

### Semantic Version Links:

- **dev** - Active development version (work here)
- **test** - Version ready for testing (test here)
- **prod** - Production-ready version (100% tested)
- **latest** - Latest stable release (same as prod)

---

## 🎯 Why This Works (The Web4 Magic)

### Auto-Discovery Architecture:

1. **CLI scans DefaultWeb4TSComponent** using TypeScript reflection - see [Architecture](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/01-architecture.md#-how-auto-discovery-cli-works-the-magic-explained) | [chapters/01-architecture.md](chapters/01-architecture.md#-how-auto-discovery-cli-works-the-magic-explained)
2. **Finds all public methods** automatically
3. **Reads TSDoc comments** for parameter information - see [TSDoc Magic](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/02-development-guide.md#-tsdoc-magic-the-3-lines-that-make-it-work) | [chapters/02-development-guide.md](chapters/02-development-guide.md#-tsdoc-magic-the-3-lines-that-make-it-work)
4. **Generates help text** from your comments
5. **Routes commands** to your methods automatically

### Zero Configuration:

- No CLI configuration files
- No method registration arrays
- No hardcoded command lists
- **Just add method + TSDoc = CLI command!**

### DRY Principle:

- Write method once → available everywhere
- TSDoc comments → automatic documentation
- Method signature → automatic parameter handling
- Symlinked dependencies → no duplication
- **No repetitive code anywhere!**

### Automatic Lifecycle:

- `npm start` → builds automatically
- Dependencies → install automatically
- Symlinks → create automatically
- CLI → starts automatically
- Components created → work the same way

---

## 9. CMM4 Implementation Specification

Web4TSComponent implements **CMM4 (Capability Maturity Model Level 4)**:

### CMM3 Foundation:
- ✅ **Objective Definitions** - Tests provide reproducible verification
- ✅ **Automated Execution** - No manual steps required
- ✅ **Scientific Reproducibility** - Same input → same output always

### CMM4 Achievement:
- ✅ **Feedback Loop Mastery** - PDCA cycle with automatic promotion
- ✅ **Whitebox Understanding** - Tests document system behavior
- ✅ **Systematic Improvement** - Each cycle refines the process
- ✅ **Quantitative Management** - Test metrics drive decisions

### Not CMM5:
- ❌ **Not 100% perfection** - Targets 80/20 efficiency (SpaceX model)
- ✅ **Economic viability** - Balances quality with practicality
- ✅ **Continuous improvement** - Better over time, not perfect immediately

---

## 📊 Version History & Migration Path

### Version Progression:

- **0.3.0.x** - Initial auto-discovery CLI implementation
- **0.3.1.x** - Enhanced version management
- **0.3.2.x** - Test isolation and promotion workflow
- **0.3.3.0** - Comprehensive test suites
- **0.3.3.1** - Bug fixes and stability
- **0.3.3.2** - **DRY compliance enforcement + Automatic lifecycle (current)**

### Migration from Earlier Versions:

If migrating from earlier versions:

1. Check for real node_modules directories
2. Run DRY compliance tests to identify violations
3. Remove real directories and create symlinks
4. Verify with: `npm test`
5. Use `npm start` for everything

---

## 🔗 Related Documentation

- **CMM Understanding:** `/scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md`
- **PDCA Process:** `/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md`
- **Tech Stack:** `/docs/tech-stack.md`
- **Unit Component:** Similar auto-discovery CLI pattern

---

