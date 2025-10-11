# Chapter 5: Troubleshooting & Quick Reference

**Document:** Web4TSComponent Technical Specification  
**Chapter:** Problem Solving & Quick Guides  
**Focus:** Fix issues and get quick answers

[← Back to Index](../component.spec.md)

---

## 5. Troubleshooting Reference

### Method Not Appearing in CLI?

```typescript
// Check these:
// 1. Method is public (not private)
// 2. Has @cliSyntax annotation
// 3. Proper TypeScript syntax
// 4. Component compiles without errors

// Common fix:
/**
 * @cliSyntax param1 param2  // ← Add this if missing
 */
async myMethod(param1: string, param2: string): Promise<this>
```

### Method Throws Errors?

```typescript
// Check these:
// 1. Parameter count matches @cliSyntax
// 2. Default values match @cliDefault
// 3. Return type is Promise<this>
// 4. Human-readable error messages

// Common fix:
async myMethod(param: string = 'default'): Promise<this> {  // ← Add default
  return this;  // ← Add return
}
```

### Method Chaining Not Working?

```typescript
// Check these:
// 1. Method returns Promise<this>
// 2. Uses getComponentContext() for context-aware operations
// 3. Loads context with 'on' command first

// Common fix:
const context = this.getComponentContext();
if (!context) {
  throw new Error('I need a component context first. Please use "on <component> <version>" before this method.');
}
```

**Related:** See [Context-Aware Methods](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/02-development-guide.md#-context-aware-methods-advanced-pattern) | [chapters/02-development-guide.md](chapters/02-development-guide.md#-context-aware-methods-advanced-pattern) for pattern details

### Component Won't Build?

```bash
# Force rebuild with clean
npm run clean
npm run build

# Or use force build flag
./src/sh/build.sh force
```

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

1. **CLI scans DefaultWeb4TSComponent** using TypeScript reflection
2. **Finds all public methods** automatically
3. **Reads TSDoc comments** for parameter information
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

## 💡 For New Agents

**First Time with Web4TSComponent?**

### Start Here:

1. **Just run `npm start`** - Everything else is automatic
2. Read the **Auto-Discovery CLI** section above
3. Try adding a simple method to see the magic
4. Read the **CMM Understanding** document for context
5. Run `npm test` to see systematic verification

### Key Concepts:

- **One Command:** `npm start` handles everything
- **Auto-Discovery:** Add method → appears in CLI automatically
- **Method Chaining:** Return `this` from every method
- **TSDoc Magic:** 3 lines of comments make methods discoverable
- **DRY Compliance:** Symlinks, never duplicate node_modules
- **Systematic Process:** CMM4 feedback loops, not ad-hoc hacking

### Remember:

- This is a CMM4 system, not CMM1 chaos
- Tests define success objectively
- Automation prevents human error
- Systematic processes beat ad-hoc hacking
- **Components created work the same way!**

---

## 🎉 Success Criteria

Web4TSComponent 0.3.3.2 is successful when:

- ✅ All 12 test suites pass at 100%
- ✅ DRY compliance tests detect violations
- ✅ Automatic version promotion executes correctly
- ✅ No real node_modules directories in components
- ✅ Tests remain isolated from production
- ✅ Build process is efficient (smart rebuilds only)
- ✅ `npm start` works perfectly every time
- ✅ Created components work the same way

---

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🤝✨

