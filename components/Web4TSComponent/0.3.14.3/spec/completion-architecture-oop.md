# OOP Completion Architecture Specification

**Version:** 1.0.0  
**Date:** 2025-10-22 UTC 10:33  
**Purpose:** Radical OOP model-driven completion architecture following Web4 Scenario pattern

---

## Core Principle

**DefaultCLI must be AWARE of completion context through its CLIModel Scenario**

Web4 Pattern: **Everything is a Scenario with a Model**

---

## Architecture: CLIModel as Scenario

### 1. CLIModel Interface (extends Model)

**Web4 Principle: Self-sufficient, FLAT model - no relationships, no nested objects**

```typescript
// layer3/CLIModel.interface.ts
import { Model } from './Model.interface.js';

export interface CLIModel extends Model {
  // uuid, name, origin, definition inherited from Model
  
  // Component context
  componentClass: any | null;
  componentName: string;
  componentVersion: string;
  componentInstance: any | null;
  
  // Completion context - FLAT in model (no CompletionContext relationship!)
  // From bash environment
  completionCliName: string;           // e.g., "web4tscomponent"
  completionCompWords: string[];       // Full COMP_WORDS array from bash
  completionCompCword: number;         // Current word index from bash
  
  // Derived completion state
  completionCurrentWord: string;       // compWords[compCword]
  completionPreviousWord: string;      // compWords[compCword-1]
  completionCommand: string | null;    // Detected command (null if completing method)
  completionParameters: string[];      // Parameters provided so far
  completionParameterIndex: number;    // Which parameter (0-based)
  
  // "on" context (flat)
  completionOnComponent: string | null;   // Component from "on ComponentName version"
  completionOnVersion: string | null;     // Version from "on ComponentName version"
  
  // Chaining context
  completionChainedCommands: string[]; // Commands in chain
  
  // Completion state flags
  completionIsCompletingMethod: boolean;    // True if completing method name
  completionIsCompletingParameter: boolean; // True if completing parameter
}
```

### 3. CLI Interface with init(scenario)

```typescript
// layer3/CLI.interface.ts
import { Scenario } from './Scenario.interface.js';
import { CLIModel } from './CLIModel.interface.js';

export interface CLI {
  /**
   * Initialize CLI with scenario
   * Web4 pattern: Components ALWAYS init with Scenario
   */
  init(scenario: Scenario<CLIModel>): this;
  
  /**
   * Execute CLI commands
   */
  execute(args: string[]): Promise<void>;
  
  /**
   * Show usage information
   */
  showUsage(): void;
}
```

### 4. DefaultCLI with Model Property

```typescript
// layer2/DefaultCLI.ts
export abstract class DefaultCLI implements CLI {
  protected model: CLIModel;
  protected methodSignatures: Map<string, MethodSignature>;
  protected colors: Colors;
  
  constructor() {
    // Initialize with empty model (will be set via init)
    this.model = this.createEmptyModel();
  }
  
  /**
   * Initialize CLI with scenario (Web4 pattern)
   */
  init(scenario: Scenario<CLIModel>): this {
    this.model = scenario.model;
    return this;
  }
  
  /**
   * Set completion context from bash
   * Called by __complete command with parsed bash environment
   */
  setCompletionContext(context: CompletionContext): this {
    this.model.completionContext = context;
    return this;
  }
  
  /**
   * Get valid values for current completion position
   * Model-driven: queries model.completionContext
   */
  getValidCompletionValues(): string[] {
    const ctx = this.model.completionContext;
    if (!ctx) return [];
    
    // Completing method name
    if (ctx.isCompletingMethod) {
      return this.getAllMethodNames();
    }
    
    // Completing parameter
    if (ctx.isCompletingParameter) {
      const callback = this.getParameterCallback(
        ctx.command!, 
        ctx.parameterIndex
      );
      if (callback) {
        return this.executeCallback(callback, ctx.parameters);
      }
    }
    
    return [];
  }
  
  /**
   * Execute callback through existing completeParameter
   * DRY: Reuse existing method, don't duplicate
   */
  private executeCallback(callbackName: string, context: string[]): string[] {
    // Capture output from existing completeParameter method
    // Return as array for filtering
  }
}
```

---

## Bash Integration (source.env)

**Principle:** Bash has NO knowledge of CLIModel structure. Decoupled via Scenario exchange.

**Bash responsibility:** Only `completionCompWords` and `completionCompCword` (2 fields)

### Architecture

1. **Bash asks CLI for default Scenario:**
   ```bash
   # Get default completion Scenario from CLI
   scenario=$("$cli" __getCompletionScenario)
   ```

2. **CLI returns complete Scenario with instance UUID**

3. **Bash modifies ONLY its 2 fields:**
   ```bash
   # Parse scenario, update only bash fields using jq
   updated_scenario=$(echo "$scenario" | jq \
     --argjson words "[$(printf '"%s",' "${COMP_WORDS[@]}" | sed 's/,$//')]" \
     --arg cword "$COMP_CWORD" \
     '.model.completionCompWords = $words | .model.completionCompCword = ($cword | tonumber)')
   ```

4. **Send updated Scenario back via stdin:**
   ```bash
   result=$(echo "$updated_scenario" | "$cli" __complete 2>>"$logfile" || true)
   ```

5. **Instance UUID ensures correct CLI instance receives update**

### Complete bash Implementation

```bash
_web4_generic_completion() {
  # ... existing setup ...
  
  local cli="${COMP_WORDS[0]}"
  
  # 1. Ask CLI for default Scenario with complete CLIModel
  local scenario=$("$cli" __getCompletionScenario 2>>"$logfile")
  
  if [ -z "$scenario" ]; then
    echo "Failed to get completion scenario" >> "$logfile"
    return 1
  fi
  
  # 2. Bash modifies ONLY its 2 fields: completionCompWords and completionCompCword
  local updated_scenario=$(echo "$scenario" | jq \
    --argjson words "[$(printf '"%s",' "${COMP_WORDS[@]}" | sed 's/,$//')]" \
    --arg cword "$COMP_CWORD" \
    '.model.completionCompWords = $words | .model.completionCompCword = ($cword | tonumber)')
  
  # 3. Send updated Scenario to CLI (instance UUID routes to correct instance)
  result=$(echo "$updated_scenario" | "$cli" __complete 2>>"$logfile" || true)
  
  # ... process DISPLAY/WORD output ...
}
```

**Benefits:**
- ✅ Bash knows NOTHING about CLIModel structure
- ✅ When CLIModel changes, bash doesn't break
- ✅ Bash owns only 2 fields (its responsibility)
- ✅ CLI owns entire model (its responsibility)
- ✅ Instance UUID ensures correct routing
- ✅ Zero coupling between bash and TypeScript model

---

## TypeScript CLI Commands

### 1. `__getCompletionScenario` - Provide Default Scenario

```typescript
/**
 * Get default completion Scenario for bash
 * Bash calls this first to get complete CLIModel structure
 * @cliHide
 */
async __getCompletionScenario(): Promise<void> {
  // Create default CLIModel with instance UUID
  const scenario: Scenario<CLIModel> = {
    ior: {
      uuid: randomUUID(),
      component: "CLI",
      version: "1.0.0"
    },
    owner: "bash-completion",
    model: {
      uuid: this.model?.uuid || randomUUID(), // Preserve instance if exists
      name: `${this.componentName}-cli-completion`,
      origin: "bash-completion",
      definition: "CLI completion context",
      
      // Component context (from current CLI instance)
      componentClass: null, // Can't serialize class
      componentName: this.componentName,
      componentVersion: this.componentVersion,
      componentInstance: null, // Can't serialize instance
      
      // Completion context - defaults (bash will update its 2 fields)
      completionCliName: this.componentName.toLowerCase(),
      completionCompWords: [], // Bash updates this
      completionCompCword: 0,   // Bash updates this
      
      // Derived fields (computed after bash update)
      completionCurrentWord: "",
      completionPreviousWord: "",
      completionCommand: null,
      completionParameters: [],
      completionParameterIndex: 0,
      
      // Context detection (computed after bash update)
      completionOnComponent: null,
      completionOnVersion: null,
      
      // Chaining (computed after bash update)
      completionChainedCommands: [],
      
      // State flags (computed after bash update)
      completionIsCompletingMethod: false,
      completionIsCompletingParameter: false
    }
  };
  
  // Output as JSON for bash
  console.log(JSON.stringify(scenario, null, 2));
}
```

### 2. `__complete` - Receive Updated Scenario, Execute Completion

```typescript
/**
 * Complete bash completion with updated Scenario from bash
 * Bash has modified completionCompWords and completionCompCword
 * @cliHide
 */
async __complete(): Promise<void> {
  // Read updated Scenario from stdin (bash modified its 2 fields)
  const scenarioJson = await this.readStdin();
  const scenario: Scenario<CLIModel> = JSON.parse(scenarioJson);
  
  // Compute derived fields from bash-provided data
  this.computeDerivedCompletionFields(scenario.model);
  
  // Initialize CLI with updated Scenario
  this.init(scenario);
  
  // Get valid completion values from model
  const values = this.getValidCompletionValues();
  
  // Format with DISPLAY/WORD protocol
  this.formatCompletionOutput(values);
}

/**
 * Compute derived completion fields from bash-provided compWords/compCword
 */
private computeDerivedCompletionFields(model: CLIModel): void {
  const words = model.completionCompWords;
  const cword = model.completionCompCword;
  
  // Derived from bash data
  model.completionCurrentWord = words[cword] || "";
  model.completionPreviousWord = words[cword - 1] || "";
  
  // Parse command (word at index 1 if exists)
  model.completionCommand = cword > 0 && words[1] ? words[1] : null;
  
  // Parse parameters (words from index 2 to cword-1)
  model.completionParameters = cword > 2 ? words.slice(2, cword) : [];
  model.completionParameterIndex = Math.max(0, cword - 2);
  
  // Detect "on" context
  const onIndex = words.indexOf("on");
  if (onIndex >= 0 && onIndex + 2 < words.length) {
    model.completionOnComponent = words[onIndex + 1];
    model.completionOnVersion = words[onIndex + 2];
  }
  
  // Detect chained commands (TODO: implement chaining detection)
  model.completionChainedCommands = [];
  
  // Set state flags
  model.completionIsCompletingMethod = cword === 1;
  model.completionIsCompletingParameter = cword > 1;
}
```

**Separation of Concerns:**
- **Bash:** Provides `COMP_WORDS` and `COMP_CWORD` (2 fields)
- **TypeScript:** Computes all derived fields, owns model logic
- **No coupling:** Bash doesn't know CLIModel structure

---

## Benefits of Scenario Pattern

### 1. Pure Web4 Architecture

- **Scenario-based:** CLI initialized with `init(scenario)`
- **Model-driven:** All state in `model.completionContext`
- **Single source of truth:** Model contains complete state

### 2. DRY

- No duplicate callback execution
- Reuse existing `completeParameter` method
- One method to get valid values: `getValidCompletionValues()`

### 3. Context Awareness

- Model knows "on" context: `model.completionContext.onContext`
- Model knows chaining: `model.completionContext.chainedCommands`
- Model knows completion state: `model.completionContext.isCompletingMethod`

### 4. Testable

- Mock Scenario for testing
- Test model logic independently
- No bash dependency

---

## Migration Path

1. **Create interfaces** in `layer3/`:
   - `CLIModel.interface.ts` (extends Model)
   - `CompletionContext.interface.ts`

2. **Update CLI.interface.ts**:
   - Add `init(scenario: Scenario<CLIModel>): this`

3. **Update DefaultCLI**:
   - Add `protected model: CLIModel`
   - Implement `init(scenario)` 
   - Add `setCompletionContext(context)`
   - Add `getValidCompletionValues()`
   - Remove functional garbage

4. **Add `__complete` command** to Web4TSComponentCLI

5. **Update `source.env`** to pass CompletionContext JSON

6. **Remove functional patches**:
   - Delete `getCallbackValues()` method
   - Delete parameter validation loop
   - Use `getValidCompletionValues()` instead

---

## Key Web4 Patterns Applied

### Pattern 1: Everything is a Scenario

```typescript
// ❌ BAD: Plain object
const cli = new DefaultCLI();
cli.componentName = "Web4TSComponent";

// ✅ GOOD: Scenario pattern
const scenario: Scenario<CLIModel> = {
  ior: { uuid, component: "CLI", version: "1.0.0" },
  owner: "bash",
  model: {
    uuid,
    name: "web4tscomponent-cli",
    origin: "bash-completion",
    definition: "CLI for Web4TSComponent",
    componentName: "Web4TSComponent",
    componentVersion: "0.3.14.3",
    completionContext: { ... }
  }
};
cli.init(scenario);
```

### Pattern 2: Model-Driven Logic

```typescript
// ❌ BAD: Functional
function getValidValues(command: string, index: number) {
  const callback = findCallback(command, index);
  return executeCallback(callback);
}

// ✅ GOOD: Model-driven
getValidCompletionValues(): string[] {
  return this.model.completionContext.isCompletingMethod
    ? this.getAllMethodNames()
    : this.getParameterValues();
}
```

### Pattern 3: init(scenario) Lifecycle

```typescript
// Web4 pattern: Component lifecycle
const cli = new Web4TSComponentCLI();
cli.init(scenario);           // Initialize with Scenario
await cli.execute(args);      // Execute
const state = await cli.toScenario();  // Export state
```

---

## Success Criteria

1. ✅ CLIModel interface extends Model
2. ✅ CompletionContext interface defined
3. ✅ CLI.init(scenario) implemented
4. ✅ DefaultCLI has `model: CLIModel` property
5. ✅ All completion logic queries model
6. ✅ No duplicate callback execution
7. ✅ Respect "on" context in model
8. ✅ Respect chaining in model
9. ✅ Functional garbage removed
10. ✅ All tests pass

---

**Radical OOP. Scenario Pattern. Model-Driven. DRY. Context-Aware.**

