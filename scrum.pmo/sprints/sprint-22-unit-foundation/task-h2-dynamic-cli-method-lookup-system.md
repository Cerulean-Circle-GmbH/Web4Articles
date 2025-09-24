[Back to Planning Sprint 22](./planning.md)

# Task H2: Dynamic CLI Method Lookup System with TSRanger 2.2 Pattern

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md` (e.g., `task-h2.1-developer-method-discovery.md`)
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- Source: UnitCLI Repetitive Pattern Analysis and TSRanger 2.2 Inspiration
- **Up:**
  - [Symlinks Removal and Dynamic CLI Analysis PDCA](../../project.journal/2025-09-05-UTC-1300-branch-switch-session/pdca/role/developer/2025-09-07-UTC-0310-symlinks-removal-dynamic-cli-analysis.pdca.md)
- **Down:**
  - [ ] [Task H2.1: Developer - Method Discovery Implementation](./task-h2.1-developer-method-discovery.md)
  - [ ] [Task H2.2: Developer - Dynamic Invocation System](./task-h2.2-developer-dynamic-invocation.md)
  - [ ] [Task H2.3: Developer - Automatic Usage Generation](./task-h2.3-developer-automatic-usage-generation.md)
  - [ ] [Task H2.4: Developer - Dynamic CLI Integration Testing](./task-h2.4-developer-dynamic-cli-testing.md)

## Task Description
Implement dynamic CLI method lookup system for Unit component eliminating repetitive case statements through TSRanger 2.2 inspired method discovery and automatic command-to-method mapping. Achieve 85% code reduction while enabling zero-maintenance command availability for new DefaultUnit methods.

## Context
Current UnitCLI has ~200 lines of highly repetitive case statements where each DefaultUnit method requires explicit case handling. TSRanger 2.2 method discovery patterns can eliminate this repetition through dynamic method lookup and automatic command-to-method mapping.

## Intention
Create dynamic CLI architecture that automatically discovers DefaultUnit methods and maps commands to methods without explicit case statements. Enable zero-maintenance CLI where new DefaultUnit methods become immediately available without CLI code changes.

## Current Repetitive Pattern (DRY Violation)

### Repetitive Case Statements
```typescript
// Current UnitCLI.run() - HIGHLY REPETITIVE (~200 lines)
switch (command) {
  case 'create':
    if (commandArgs.length < 1) {
      throw new Error('Name required for create command');
    }
    await this.getOrCreateUnit().create(commandArgs[0], commandArgs[1]);
    break;

  case 'link':
    if (commandArgs.length < 2) {
      throw new Error('UUID and filename required for link command');
    }
    await this.getOrCreateUnit().link(commandArgs[0], commandArgs[1]);
    break;

  case 'list':
    if (commandArgs.length < 1) {
      throw new Error('UUID required for list command');
    }
    await this.getOrCreateUnit().list(commandArgs[0]);
    break;

  // ... 15+ more identical patterns
}
```

### Repetition Analysis
- **Pattern:** `case 'method': validate args → call unit.method(args) → break`
- **Repetition Count:** 15+ identical case statements
- **Code Bloat:** ~200 lines of repetitive case handling
- **Maintenance Burden:** Every new DefaultUnit method requires new case statement

## Dynamic CLI Method Lookup Design (TSRanger 2.2 Inspired)

### Method Discovery System
```typescript
// File: DynamicUnitCLI.ts
export class DynamicUnitCLI {
  private unit: DefaultUnit | null = null;
  private methodSignatures: Map<string, MethodSignature> = new Map();

  constructor() {
    this.unit = null;
    this.discoverMethods();  // TSRanger 2.2 pattern
  }

  /**
   * Discover DefaultUnit methods dynamically (TSRanger 2.2 pattern)
   */
  private discoverMethods(): void {
    const unit = new DefaultUnit();
    const prototype = Object.getPrototypeOf(unit);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter(name => typeof unit[name as keyof DefaultUnit] === 'function')
      .filter(name => !name.startsWith('_') && name !== 'constructor')
      .filter(name => !['init', 'toScenario', 'validateModel'].includes(name)); // Exclude internal methods

    for (const methodName of methodNames) {
      const method = unit[methodName as keyof DefaultUnit] as Function;
      this.methodSignatures.set(methodName, {
        name: methodName,
        paramCount: method.length,
        isAsync: method.constructor.name === 'AsyncFunction'
      });
    }
  }
}

interface MethodSignature {
  name: string;
  paramCount: number;
  isAsync: boolean;
}
```

### Dynamic Command Execution
```typescript
/**
 * Dynamic command execution (Occam's Razor - eliminates all case statements)
 */
async run(args: string[]): Promise<void> {
  if (args.length === 0) {
    this.showUsage();
    return;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  // Dynamic method lookup (eliminates all case statements)
  if (this.methodSignatures.has(command)) {
    const signature = this.methodSignatures.get(command)!;
    
    // Dynamic argument validation
    if (commandArgs.length < signature.paramCount) {
      throw new Error(`${signature.paramCount} arguments required for ${command} command`);
    }

    // Dynamic method invocation
    const unit = this.getOrCreateUnit();
    const method = unit[command as keyof DefaultUnit] as Function;
    
    if (signature.isAsync) {
      await method.apply(unit, commandArgs);
    } else {
      method.apply(unit, commandArgs);
    }
    
    return;
  }

  // Special cases (non-DefaultUnit methods)
  switch (command) {
    case 'help':
      this.showUsage();
      break;
    case 'info':
      await this.showInfo();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}
```

### Automatic Usage Generation
```typescript
/**
 * Dynamic usage generation (TSRanger 2.2 completion pattern)
 */
private showUsage(): void {
  console.log('Web4 Unit CLI Tool v0.3.0.5 - Dynamic Method Discovery');
  console.log('');
  console.log('Usage:');
  
  // Dynamic usage generation from discovered methods
  for (const [methodName, signature] of this.methodSignatures) {
    const params = Array(signature.paramCount).fill(0)
      .map((_, i) => `<arg${i + 1}>`)
      .join(' ');
    console.log(`  unit ${methodName} ${params}`);
  }
  
  console.log('  unit help                                       # Show this help');
  console.log('  unit info                                       # Show unit info');
  console.log('');
  console.log('Commands automatically discovered from DefaultUnit methods');
  console.log('Add new methods to DefaultUnit and they become available immediately');
}
```

## Code Reduction Analysis (Occam's Razor)

### Before vs After Comparison
```
BEFORE (Repetitive Pattern):
├── switch statement: ~200 lines
├── case 'create': 8 lines
├── case 'link': 8 lines  
├── case 'list': 8 lines
├── case 'from': 8 lines
├── case 'definition': 8 lines
├── case 'upgrade': 8 lines
├── case 'linkInto': 8 lines
├── case 'deleteLink': 8 lines
├── case 'deleteUnit': 8 lines
├── case 'origin': 8 lines
└── ... 15+ methods = 120+ lines of repetition

AFTER (Dynamic Lookup):
├── Method discovery: 15 lines
├── Dynamic execution: 15 lines
├── Special cases: 10 lines
└── Total: ~40 lines (85% reduction)
```

### Benefits Analysis
- **Code Reduction:** 85% reduction (200 → 40 lines)
- **Maintenance Elimination:** Zero CLI changes for new DefaultUnit methods
- **Type Safety:** TypeScript reflection with proper typing
- **Automatic Discovery:** Methods immediately available without CLI updates
- **TSRanger 2.2 Pattern:** Proven method discovery and completion patterns

## Acceptance Criteria
- [ ] Dynamic method discovery system implemented using TypeScript reflection
- [ ] All current DefaultUnit methods automatically discovered and available
- [ ] Dynamic command execution eliminates repetitive case statements
- [ ] Argument validation works dynamically based on method signatures
- [ ] Automatic usage generation from discovered methods
- [ ] Zero maintenance for new DefaultUnit methods
- [ ] 85% code reduction achieved in CLI implementation
- [ ] TSRanger 2.2 patterns properly applied
- [ ] All existing functionality preserved with dynamic architecture
- [ ] Integration tests pass with dynamic CLI system

## Dependencies
- Builds on Unit 0.3.0.5 enhanced model and DefaultUnit implementation
- Requires TypeScript reflection capabilities for method discovery
- Uses TSRanger 2.2 patterns for method enumeration and completion
- Integrates with existing Unit CLI functionality and commands

## Definition of Done
- [ ] Dynamic CLI method lookup system fully implemented
- [ ] All DefaultUnit methods automatically available as commands
- [ ] Repetitive case statements eliminated (85% code reduction)
- [ ] Automatic usage generation functional
- [ ] Zero maintenance for new methods validated
- [ ] TSRanger 2.2 patterns properly integrated
- [ ] Performance benchmarks meet requirements
- [ ] Integration with Unit 0.3.0.5 validated
- [ ] Documentation complete with dynamic CLI usage patterns

## Benefits
- **Massive Code Reduction:** 85% reduction through dynamic lookup
- **Zero Maintenance:** New methods automatically available
- **Type Safety:** TypeScript reflection with proper typing
- **TSRanger 2.2 Integration:** Proven method discovery patterns
- **Automatic Discovery:** Methods enumerated and mapped dynamically
- **Occam's Razor:** Ultimate simplification of CLI architecture

---

*Sprint 22 - Dynamic CLI Architecture*  
*Epic H: Build System and CLI Enhancement*  
*Priority: Medium - Code Quality and Maintenance Improvement*