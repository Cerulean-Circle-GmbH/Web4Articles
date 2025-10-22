# OOP Completion Architecture Specification

**Version:** 1.0.0  
**Date:** 2025-10-22 UTC 10:33  
**Purpose:** Radical OOP model-driven completion architecture

---

## Core Principle

**DefaultCLI must be AWARE of completion context through its model**

- What command is being completed
- Are we completing methods or parameters
- What's the "on" context (component loaded?)
- What parameters are already provided
- Is this chained completion
- What are valid values for current parameter

---

## Architecture Requirements

### 1. CompletionContext Model

CLI needs a model to track completion state:

```typescript
interface CompletionContext {
  // From bash environment
  cliName: string;           // e.g., "web4tscomponent"
  compWords: string[];       // Full COMP_WORDS array
  compCword: number;         // Current word index
  
  // Derived state
  command: string | null;    // Command being executed (null if completing method name)
  commandIndex: number;      // Where command starts in compWords
  parameters: string[];      // Parameters provided so far
  currentWord: string;       // Word being completed
  previousWord: string;      // Previous word
  
  // Context awareness
  onContext: ComponentContext | null;  // "on" context if loaded
  chainedCommands: string[];           // Commands in chain
  
  // Completion state
  completingMethod: boolean;   // True if COMP_CWORD points to method name
  completingParameter: boolean; // True if COMP_CWORD points to parameter
  parameterIndex: number;      // Which parameter (0-based)
}
```

### 2. CLI Model Extension

DefaultCLI should have:

```typescript
class DefaultCLI {
  protected componentClass: any;
  protected componentName: string;
  protected componentVersion: string;
  protected methodSignatures: Map<string, MethodSignature>;
  
  // NEW: Completion context
  protected completionContext: CompletionContext | null = null;
  
  // NEW: Set context from bash
  setCompletionContext(context: CompletionContext): void {
    this.completionContext = context;
  }
  
  // NEW: Get valid values for current parameter
  getValidParameterValues(): string[] {
    if (!this.completionContext) return [];
    
    const { command, parameterIndex } = this.completionContext;
    if (!command) return this.getAllMethodNames();
    
    const callback = this.getParameterCallback(command, parameterIndex);
    if (!callback) return [];
    
    return this.executeCallback(callback);
  }
  
  // NEW: Execute callback through existing completeParameter
  private executeCallback(callbackName: string): string[] {
    // Use existing completeParameter method, capture output
    // Don't duplicate logic!
  }
}
```

### 3. Bash Integration

`source.env` passes context to TypeScript:

```bash
_web4_generic_completion() {
  # ... existing setup ...
  
  # Pass completion context as JSON
  local context=$(cat <<EOF
{
  "cliName": "$cli",
  "compWords": ["${COMP_WORDS[@]}"],
  "compCword": $COMP_CWORD
}
EOF
)
  
  # Call TypeScript with context
  result=$(echo "$context" | "$cli" __complete 2>>"$logfile" || true)
  
  # ... process result ...
}
```

### 4. TypeScript Entry Point

New `__complete` command (hidden from users):

```typescript
async __complete(): Promise<void> {
  // Read context from stdin
  const contextJson = await this.readStdin();
  const context = this.parseCompletionContext(contextJson);
  
  // Set context in model
  this.setCompletionContext(context);
  
  // Get valid values based on context
  const values = this.getValidParameterValues();
  
  // Format output with DISPLAY/WORD protocol
  this.formatCompletionOutput(values);
}
```

---

## Benefits of OOP Approach

### 1. Model-Driven

- Context is in the model, not scattered in functions
- All completion logic queries the model
- Model provides single source of truth

### 2. DRY

- No duplicate callback execution
- Reuse existing `completeParameter` method
- One place to get valid values

### 3. Context Awareness

- Model knows about "on" context
- Model knows about chaining
- Model knows current completion state

### 4. Testable

- Mock CompletionContext for testing
- Test model logic independently
- No bash dependency for unit tests

---

## Migration Path

1. **Add CompletionContext interface** to `layer3/`
2. **Extend DefaultCLI** with context property and methods
3. **Add `__complete` command** to Web4TSComponentCLI
4. **Update `source.env`** to pass context as JSON
5. **Remove functional garbage** (`getCallbackValues`, validation loop)
6. **Use model** for all completion decisions

---

## Key Insights from TRON

> "default cli should ALWAYS be AWARE of the current command in the shell (by getting it through the completion function)"

**Translation:** CLI needs CompletionContext model set from bash

> "OOP like use the DefaultCLI model to know wht is will complete in that exact moment"

**Translation:** Model-driven: query model.completionContext to know state

> "a method or a parameter, or an optional parameter, which might be skipped and it a method that comes in"

**Translation:** Model tracks parameterIndex, knows if optional, detects chaining

> "it alwaus need to respect the 'on' context and always needs to respect that there is chaining"

**Translation:** CompletionContext includes onContext and chainedCommands

---

## Anti-Patterns to Avoid

### ❌ Functional Patches

```typescript
// BAD: Adding utility function
private getCallbackValues(callback: string): string[] {
  // Duplicate logic
}
```

### ✅ Model-Driven

```typescript
// GOOD: Query model
const values = this.model.completionContext.getValidValues();
```

### ❌ Manual Validation Loops

```typescript
// BAD: Loop checking each parameter
for (let i = 0; i < args.length; i++) {
  const callback = getCallback(i);
  const values = getValues(callback);
  if (!values.includes(args[i])) { ... }
}
```

### ✅ Model Query

```typescript
// GOOD: Model knows if current parameter is valid
if (!this.model.completionContext.isCurrentParameterValid()) {
  return this.model.completionContext.getValidValues();
}
```

---

## Success Criteria

1. ✅ CompletionContext model exists
2. ✅ DefaultCLI has completionContext property
3. ✅ All completion logic queries model
4. ✅ No duplicate callback execution
5. ✅ Respect "on" context in model
6. ✅ Respect chaining in model
7. ✅ Functional garbage removed
8. ✅ All tests pass

---

**Radical OOP. Model-Driven. DRY. Context-Aware.**

