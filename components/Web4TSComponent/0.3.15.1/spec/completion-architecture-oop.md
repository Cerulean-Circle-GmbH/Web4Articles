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
   * Called by complete command with parsed bash environment
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
   scenario=$("$cli" getCompletionScenario)
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
   result=$(echo "$updated_scenario" | "$cli" complete 2>>"$logfile" || true)
   ```

5. **Instance UUID ensures correct CLI instance receives update**

### Complete bash Implementation

```bash
_web4_generic_completion() {
  # ... existing setup ...
  
  local cli="${COMP_WORDS[0]}"
  
  # 1. Ask CLI for default Scenario with complete CLIModel
  local scenario=$("$cli" getCompletionScenario 2>>"$logfile")
  
  if [ -z "$scenario" ]; then
    echo "Failed to get completion scenario" >> "$logfile"
    return 1
  fi
  
  # 2. Bash modifies ONLY its 2 fields: completionCompWords and completionCompCword
  local updated_scenario=$(echo "$scenario" | jq \
    --argjson words "[$(printf '"%s",' "${COMP_WORDS[@]}" | sed 's/,$//')]" \
    --arg cword "$COMP_CWORD" \
    '.model.completionCompWords = $words | .model.completionCompCword = ($cword | tonumber)')
  
  # 3. Send updated Scenario to CLI via parameter (NOT stdin!)
  # ✅ Web4 pattern: Pass data as method parameters
  result=$("$cli" complete "$updated_scenario" 2>>"$logfile" || true)
  
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

## User Service Integration (Optional, No Build Dependency)

**Principle:** Use User service for owner data generation when available, fallback to manual generation.

**Location:** `DefaultWeb4TSComponent` (NOT `DefaultCLI`)

**Pattern Reference:** `components/User/0.3.0.4/src/ts/layer2/DefaultUser.ts`

### Implementation in DefaultWeb4TSComponent

```typescript
// src/ts/layer2/DefaultWeb4TSComponent.ts

// Copy User interface to prevent build dependency
// Source: components/User/0.3.0.4/src/ts/layer3/User.interface.ts
interface User {
  init(scenario: Scenario): this;
  generateOwnerData(params: OwnerParams): Promise<string>;
  toScenario(): Promise<Scenario>;
}

interface OwnerParams {
  user: string;
  hostname: string;
  uuid?: string;
}

export class DefaultWeb4TSComponent implements Web4TSComponent {
  private model: Web4TSComponentModel;
  private user?: User; // ✅ Proper typing, NOT any!
  
  constructor() {
    // ... existing constructor code ...
  }
  
  /**
   * Lazy initialization of User service for owner data generation
   * NOT a build dependency - warns if unavailable, continues with fallback
   * @cliHide
   */
  private async getUser(): Promise<User> {
    if (this.user) return this.user;
    
    try {
      // Dynamic ESM import - fails gracefully if User not available
      const userModule = await import('../../User/latest/dist/ts/layer2/DefaultUser.js');
      const { DefaultUser } = userModule;
      
      // Initialize User with empty constructor (uses system/localhost defaults)
      this.user = new DefaultUser();
      
      return this.user!; // Non-null assertion: we just assigned it
    } catch (error) {
      // User service not available - throw for caller to handle fallback
      throw new Error('User service not available');
    }
  }
  
  // ... rest of class ...
}
```

### Usage in getCompletionScenario

See section "TypeScript CLI Commands → 1. getCompletionScenario" for complete usage example with try/catch fallback.

**Key Points:**
- ✅ Optional service: NOT a build dependency
- ✅ Lazy initialization: Only loads when needed
- ✅ Graceful degradation: Falls back to manual owner generation
- ✅ Warning message: Informs developer User service unavailable
- ✅ Zero impact: Works with or without User component

---

## TypeScript CLI Commands

### 1. `getCompletionScenario` - Provide Default Scenario

```typescript
/**
 * Get default completion Scenario for bash
 * Bash calls this first to get complete CLIModel structure
 * @cliHide
 */
async getCompletionScenario(): Promise<void> {
  // ✅ Use existing Web4 patterns for IOR creation
  // Pattern from Unit/0.3.0.5/src/ts/layer2/DefaultUnit.ts:882-906
  const componentVersion = await this.getComponentVersion();
  const componentName = await this.getComponentName();
  
  // ✅ Generate owner data using User service (optional, warns if unavailable)
  // Pattern: DefaultWeb4TSComponent has lazy User initialization
  // Location: components/User/0.3.0.4/src/ts/layer2/DefaultUser.ts
  let ownerData: string;
  try {
    // Try to use User service if available (NOT a build dependency)
    const user = this.getUser();  // Lazy initialization in DefaultWeb4TSComponent
    ownerData = await user.generateOwnerData({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid
    });
  } catch (error) {
    // Fallback: Manual owner generation if User service unavailable
    console.warn('⚠️  User service unavailable, using manual owner generation');
    ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: componentName,
      version: componentVersion
    });
  }
  
  // Create default CLIModel with instance UUID (from constructor)
  const scenario: Scenario<CLIModel> = {
    ior: {
      uuid: this.model.uuid,  // ← UUID created in constructor (crypto.randomUUID())
      component: componentName,  // ← Dynamic component name
      version: componentVersion  // ← Dynamic version
    },
    owner: ownerData,  // ← From User service or fallback
    model: {
      uuid: this.model.uuid,  // ← Same UUID as IOR
      name: `${componentName}-cli-completion`,
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

### 2. `complete` - Receive Updated Scenario, Execute Completion

**Legacy Protocol (Backward Compatibility):**

```typescript
/**
 * Complete bash completion with updated Scenario from bash
 * Bash has modified completionCompWords and completionCompCword
 * @cliHide
 */
async complete(scenarioJson: string): Promise<void> {
  // ✅ Use method parameter (NOT stdin!)
  // Web4 pattern: components receive data via method parameters or init(scenario)
  const scenario: Scenario<CLIModel> = JSON.parse(scenarioJson);
  
  // ✅ Use existing init() pattern to merge scenario
  // Pattern from DefaultWeb4TSComponent.ts:183-188
  this.init(scenario);
  
  // Compute derived fields from bash-provided data
  this.computeDerivedCompletionFields(this.model);
  
  // Get valid completion values from model
  const values = this.getValidCompletionValues();
  
  // Format with DISPLAY/WORD protocol
  this.formatCompletionOutput(values);
}
```

### 3. `shCompletion` - Direct Parameter API (Simplexity!)

**New Protocol (Recommended):**

```typescript
/**
 * Shell completion with direct parameter passing
 * Simplexity: The highest art of complexity is simplicity
 * 
 * Web4 Pattern:
 * - Model already exists (created in constructor via createEmptyModel)
 * - Just update 2 fields, reuse existing DRY methods
 * - No JSON serialization, no Scenario dance
 * 
 * @param cword - COMP_CWORD from bash
 * @param words - COMP_WORDS from bash
 * @cliHide
 */
async shCompletion(cword: string, ...words: string[]): Promise<void> {
  // Update model directly (2 fields only!)
  this.model.completionCompCword = parseInt(cword, 10);
  this.model.completionCompWords = words;
  
  // Derive all other fields (DRY - reuse existing method!)
  this.computeDerivedCompletionFields(this.model);
  
  // Get and output completions (DRY - reuse existing methods!)
  const values = await this.getCompletionValues();
  this.formatCompletionOutput(values);
}
```

**Simplexity Comparison:**

| **Aspect** | **Legacy (complete)** | **New (shCompletion)** |
|------------|----------------------|------------------------|
| **Bash Calls** | 2 (getScenario + complete) | 1 (shCompletion) |
| **JSON Operations** | 4 (TS→JSON→Bash→JSON→TS) | 0 |
| **Parameter Passing** | JSON string (complex) | Primitives (simple) |
| **Model Update** | Parse JSON, call init() | Direct assignment |
| **IPC Overhead** | 80-150ms | 50-100ms |
| **Bash LOC** | ~80 lines (sed/awk logic) | ~10 lines |
| **Error Vectors** | 3 (JSON parse, sed regex, escape) | 1 (parseInt) |

**Why shCompletion embodies Simplexity:**
1. Model already exists → No need to create Scenario
2. Just update 2 fields → No JSON dance
3. Reuse existing methods → DRY, no duplication
4. Bash stays dumb → Only passes primitives
5. TypeScript stays smart → Owns all logic

**When complexity appears, look for the DRY violation hiding underneath.**


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

4. **Add `complete` command** to Web4TSComponentCLI (with `@cliHide` annotation)

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
  ior: { 
    uuid: this.model.uuid,  // From constructor
    component: await this.getComponentName(), 
    version: await this.getComponentVersion() 
  },
  owner: JSON.stringify({
    user: process.env.USER || 'system',
    hostname: process.env.HOSTNAME || 'localhost',
    uuid: this.model.uuid,
    timestamp: new Date().toISOString(),
    component: await this.getComponentName(),
    version: await this.getComponentVersion()
  }),
  model: {
    uuid: this.model.uuid,
    name: "web4tscomponent-cli",
    origin: "bash-completion",
    definition: "CLI for Web4TSComponent",
    componentName: "Web4TSComponent",
    componentVersion: "0.3.14.3",
    // Completion context fields (FLAT, no nested object!)
    completionCompWords: [],
    completionCompCword: 0,
    // ... other flat fields
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

## TSCompletion Integration

### Current Collaboration Pattern

DefaultCLI and TSCompletion have **clear separation of concerns**:

| Layer | Responsibility | Methods |
|-------|----------------|---------|
| **TSCompletion** | Static AST parsing utility | `getEnhancedMethodParameters()`<br>`getMethodDoc()`<br>`getParameterCallback()`<br>`isMethodHidden()` |
| **DefaultCLI** | Business logic + output formatting | `formatCompletionOutput()`<br>`completeParameter()`<br>`completionNameParameterCompletion()` |

### Current Integration Points

```
┌──────────────────────────────────────────────────┐
│ Bash Completion                                   │
│ - Sets: COMP_WORDS, COMP_CWORD, WEB4_CLI_NAME   │
│ - Calls: cli completion method <filter>          │
│ - Or: cli completeParameter callback args        │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────┐
│ DefaultCLI (Business Logic + Formatting)         │
│                                                   │
│ ┌───────────────────────────────────────────┐   │
│ │ completeParameter(callback, ...args)       │   │
│ │ • Executes: this[callback](args)           │   │
│ │ • Formats: formatCompletionOutput()        │   │
│ └───────────────────────────────────────────┘   │
│                                                   │
│ ┌───────────────────────────────────────────┐   │
│ │ completionNameParameterCompletion(args)    │   │
│ │ • Method listing: this.methodSignatures    │   │
│ │ • Parameter info: TSCompletion.getEnhanced...│   │
│ │ • Documentation: TSCompletion.getMethodDoc()│   │
│ └───────────────────────────────────────────┘   │
│                                                   │
│ ┌───────────────────────────────────────────┐   │
│ │ formatCompletionOutput(values, context)    │   │
│ │ • DISPLAY: lines with ANSI colors          │   │
│ │ • WORD: lines with clean completion values │   │
│ │ • Prompt: colored echo (if WEB4_CLI_NAME)  │   │
│ └───────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────┐
│ TSCompletion (Static AST Utility)                │
│                                                   │
│ • getEnhancedMethodParameters(class, method)     │
│   └─> {name, type, required, default, doc}      │
│                                                   │
│ • getMethodDoc(class, method)                    │
│   └─> JSDoc main comment text                   │
│                                                   │
│ • getParameterCallback(class, method, index)     │
│   └─> "{paramName}ParameterCompletion" or null  │
│                                                   │
│ • isMethodHidden(class, method)                  │
│   └─> boolean (@cliHide check)                  │
└───────────────────────────────────────────────────┘
```

### What Works Well ✅

1. **Clear separation:** TSCompletion handles AST complexity, DefaultCLI handles presentation
2. **DRY achieved:** `formatCompletionOutput()` is the **ONE** place for DISPLAY/WORD protocol
3. **Static utility pattern:** TSCompletion requires no state, can be called from anywhere
4. **Callback discovery:** `getParameterCallback()` enables dynamic parameter completion without hardcoding

### Future Optimizations (Low Priority)

**A) TSCompletion AST Caching** (Medium Priority)
- **Issue:** Every call re-parses AST (~200 methods per completion)
- **Benefit:** 10x+ speed improvement for large method lists
- **Decision:** MEASURE first (is it actually slow?), then optimize

**B) Unified Method Source** (Low Priority)
- **Issue:** Methods discovered via runtime reflection (`discoverMethods()`) AND AST parsing (`TSCompletion.getClassMethods()`)
- **Decision:** DEFER - dual approach handles edge cases (compiled vs source) well

### OOP Migration Integration

**Key Insight:** TSCompletion remains a static utility. No changes needed.

DefaultCLI will use TSCompletion to **populate CLIModel** in the new Scenario-based architecture:

```typescript
/**
 * Get default completion Scenario for bash
 * @cliHide
 */
async getCompletionScenario(): Promise<void> {
  // Use TSCompletion to discover all method metadata upfront
  const className = this.componentClass.name;
  const methodNames = Array.from(this.methodSignatures.keys());
  
  // Build method info array using TSCompletion
  const methodInfo = methodNames.map(methodName => ({
    name: methodName,
    doc: TSCompletion.getMethodDoc(className, methodName),
    params: TSCompletion.getEnhancedMethodParameters(className, methodName),
    hidden: TSCompletion.isMethodHidden(className, methodName)
  }));
  
  // Create complete CLIModel with all metadata
  const scenario: Scenario<CLIModel> = {
    ior: {
      uuid: randomUUID(),
      component: "CLI",
      version: this.componentVersion
    },
    model: {
      // Completion context (bash will modify these 2 fields)
      completionCompWords: [],
      completionCompCword: 0,
      
      // Metadata (TypeScript populates, bash consumes)
      completionAvailableMethods: methodInfo,
      completionCurrentCommand: '',
      completionCurrentArgs: [],
      // ... other CLIModel fields
    }
  };
  
  // Output complete Scenario JSON
  console.log(JSON.stringify(scenario, null, 2));
}
```

**Benefits:**
- TSCompletion called **once** per completion session (not per method!)
- All method metadata cached in CLIModel
- Bash decoupled from TypeScript internals (only knows about JSON)
- TypeScript can derive all completion logic from model

---

**Radical OOP. Scenario Pattern. Model-Driven. DRY. Context-Aware.**

