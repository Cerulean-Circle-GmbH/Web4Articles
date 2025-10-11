# Web4TSComponent

**Version:** 0.3.11.1  
**Purpose:** Create TypeScript components that work automatically

---

## For Users

### One Command

```bash
npm start
```

That's it. The component builds itself, installs dependencies, and runs.

**Every component created by Web4TSComponent works exactly the same way.**

---

## For Programmers

### Add a Method in Three Steps

**1. Open the component file:**
```bash
src/ts/layer2/DefaultWeb4TSComponent.ts
```

**2. Add your method:**
```typescript
/**
 * Your method description
 * @param input Your parameter description
 * @cliSyntax input
 */
async myMethod(input: string): Promise<this> {
  console.log(`Processing ${input}`);
  return this;
}
```

**3. Done.**

The method appears in the CLI automatically. No configuration needed.

### Four Things Not To Do

1. ❌ Don't edit CLI files (it auto-discovers)
2. ❌ Don't use complex parameters (use strings)
3. ❌ Don't forget `@cliSyntax` (required for discovery)
4. ❌ Don't forget `return this` (enables chaining)

---

## For Testers

### One Test Command

```bash
npm test
```

Tests run automatically. Output logs to `test/logs/`. 

100% test success triggers automatic version promotion.

---

## For Everyone

### Read the Complete Specification

This README gives you the minimum you need. For complete details:

**→ Read: [spec/component.spec.md](spec/component.spec.md)**

The specification contains:
- Complete tab completion architecture (3 layers)
- API extension guide with examples
- Testing workflows and promotion process
- Architecture details and layering
- Web4 compliance requirements
- CMM4 implementation details
- Troubleshooting reference

---

## The Simplexity Principle

**Complex:** Auto-discovery CLI, TypeScript reflection, inheritance chain discovery, multi-parameter completion, context-aware chaining, automatic promotion workflows.

**Simple:** `npm start` to use it. Add method + TSDoc to extend it. `npm test` to verify it.

**Cannot be simpler:** We removed every unnecessary step. What remains is essential.

- No configuration files (auto-discovery)
- No manual CLI updates (reflection)
- No dependency duplication (DRY symlinks)
- No manual initialization (automatic)
- No version management (promotion workflow)

Each complexity solves a real problem. Each simplicity is the minimum possible.

**That's simplexity.**

---

**Web4TSComponent** - Complex enough to solve the problem, simple enough to use immediately 🚀

**For technical details:** [spec/component.spec.md](spec/component.spec.md)
