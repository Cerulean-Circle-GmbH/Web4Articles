# EXECUTION PLAN: Implement cliSignature API (100% Radical OOP)

## OBJECTIVE
Create new `cliSignature()` entry point that eliminates fake context injection and adds diagnostic output, using 100% Radical OOP (all methods parameterless, use `this.model`).

## TARGET VERSION
0.3.17.5 (keep 0.3.17.4 stable)

## RADICAL OOP PRINCIPLE
**EVERY completion helper method MUST be parameterless and use `this.model` state!**
- ❌ BAD: `highlightParameter(signature, paramIndex)` - functional anti-pattern
- ✅ GOOD: `highlightParameter()` - reads from `this.model.completionCommand` and `this.model.completionParameterIndex`

## ARCHITECTURE ANALYSIS

### Current Working Architecture (0.3.17.4)
1. **Entry:** `shCompletion(cword, ...words)`
   - Sets `this.model.completionCompWords`, `this.model.completionCompCword`
   - Calls `computeDerivedCompletionFields(this.model)` to derive all other fields
   
2. **Method Completion:** 
   - Detects: `this.model.completionIsCompletingMethod === true`
   - Uses: `completionNameParameterCompletion()` (parameterless!)
   - Hack: Injects fake context into model temporarily (lines 1964-1974)
   
3. **Parameter Completion:**
   - Detects: `this.model.completionIsCompletingParameter === true`
   - Gets callback name: `TSCompletion.getParameterCallback(componentClassName, command, paramIndex)`
   - Calls: `completeParameter(callbackName, ...contextArgs)` 
   - Note: `completeParameter` ignores `contextArgs`, calls parameterless method directly!
   
4. **Output:** `formatCompletionOutput(values)` - uses model for prompt

### What Works (KEEP THIS!)
- ✅ Model-driven state: `this.model.completionCompWords`, `this.model.completionCompCword`
- ✅ Derived fields: `this.model.completionCommand`, `this.model.completionParameterIndex`
- ✅ Parameterless `*ParameterCompletion()` methods
- ✅ `formatCompletionOutput()` uses model for prompts

### What's Broken (FIX THIS!)
- ❌ Fake context injection for method completion (lines 1964-1974)
- ❌ No diagnostic output showing which methods are used
- ❌ No signature display with highlighted parameter
- ❌ `completeParameter(callback, ...contextArgs)` has unused `contextArgs` parameter

## IMPLEMENTATION PLAN

### Step 1: Create 0.3.17.5 from 0.3.17.4
```bash
cd /Users/Shared/Workspaces/temp/Web4Articles
web4tscomponent upgrade § Web4TSComponent § 0.3.17.4 § 0.3.17.5
cd components/Web4TSComponent
ln -sfn 0.3.17.5 latest
```

### Step 2: Add New Parameterless Helper Methods

#### 2.1: `getMethodSignature(): Promise<string>`
**Purpose:** Get full signature for `this.model.completionCommand`
**OOP:** Reads `this.model.completionCommand`, NO parameters!
```typescript
private async getMethodSignature(): Promise<string> {
  const methodName = this.model.completionCommand;
  if (!methodName) return "";
  
  // Get all method signatures from completionNameParameterCompletion
  const allMethods = await this.getAllMethodSignatures();
  
  // Find signature for this method
  const sig = allMethods.find(s => s.includes(methodName + " ") || s.includes(methodName + "<"));
  
  // Strip ANSI codes
  return sig ? sig.replace(/\x1b\[[0-9;]*m/g, "") : methodName;
}
```

#### 2.2: `getAllMethodSignatures(): Promise<string[]>`
**Purpose:** Get all method signatures for current CLI
**OOP:** Uses `this.model.completionCliName`, NO parameters!
**Note:** This may need the temporary context injection (document as TODO)

#### 2.3: `highlightParameter(): Promise<string>`
**Purpose:** Get signature with highlighted parameter
**OOP:** Reads `this.model.completionCommand` and `this.model.completionParameterIndex`, NO parameters!
```typescript
private async highlightParameter(): Promise<string> {
  const signature = await this.getMethodSignature();
  if (!signature) return "";
  
  const params = signature.match(/<[^>]+>/g) || [];
  const paramIndex = this.model.completionParameterIndex;
  
  if (paramIndex < params.length) {
    const param = params[paramIndex];
    return signature.replace(param, `\x1b[1;43;30m${param}\x1b[0m`);
  }
  return signature;
}
```

#### 2.4: `completeMethodName(): Promise<void>`
**Purpose:** Handle method name completion with diagnostics
**OOP:** Uses `this.model.completionCurrentWord`, NO parameters!
```typescript
private async completeMethodName(): Promise<void> {
  const filter = this.model.completionCurrentWord || "";
  
  // Diagnostic output
  console.log(`DISPLAY: 📊 Completing: METHOD`);
  console.log(`DISPLAY: 🔧 Using: completionNameParameterCompletion()`);
  
  const values = await this.getAllMethodSignatures();
  this.formatCompletionOutput(values);
}
```

#### 2.5: `completeCommandParameter(): Promise<void>`
**Purpose:** Handle parameter completion with diagnostics and signature display
**OOP:** Uses `this.model.completionCommand` and `this.model.completionParameterIndex`, NO parameters!
```typescript
private async completeCommandParameter(): Promise<void> {
  const command = this.model.completionCommand!;
  const paramIndex = this.model.completionParameterIndex;
  
  // Get callback name
  const componentClassName = this.getComponentClass()?.name || "DefaultCLI";
  const callbackName = TSCompletion.getParameterCallback(
    componentClassName,
    command,
    paramIndex
  );
  
  // Get and show signature with highlighting
  const highlighted = await this.highlightParameter();
  
  // Diagnostic output
  console.log(`DISPLAY: 📊 Completing: PARAMETER ${paramIndex}`);
  console.log(`DISPLAY: 📝 Signature: ${highlighted}`);
  console.log(`DISPLAY: 🔧 Using: ${callbackName || "(no completion)"}`);
  
  if (callbackName && typeof (this as any)[callbackName] === "function") {
    // Call parameterless method directly
    const values = await (this as any)[callbackName]();
    this.formatCompletionOutput(values);
  } else {
    // No completion available
    console.log("DISPLAY: (no completions available)");
    this.outputPrompt();
    console.log("WORD: ");
  }
}
```

### Step 3: Create New Entry Point `cliSignature()`
**Purpose:** Clean, natural API for completion
**OOP:** Sets model state, delegates to parameterless helpers
```typescript
async cliSignature(cword: string, ...words: string[]): Promise<void> {
  // Set model state (same as old shCompletion)
  this.model.completionCompCword = parseInt(cword, 10);
  this.model.completionCompWords = words;
  this.model.completionCliName = words[0] || "cli";
  
  // Compute derived fields
  this.computeDerivedCompletionFields(this.model);
  
  // Route to appropriate handler (both are parameterless!)
  if (this.model.completionIsCompletingMethod) {
    await this.completeMethodName();
  } else if (this.model.completionIsCompletingParameter) {
    await this.completeCommandParameter();
  }
}
```

### Step 4: Deprecate Old `shCompletion()`
```typescript
/**
 * @deprecated Use cliSignature() instead - this uses fake context injection
 * @param cword - COMP_CWORD from bash (current word index)
 * @param words - COMP_WORDS from bash (all words in command line)
 * @cliHide
 */
async shCompletion(cword: string, ...words: string[]): Promise<void> {
  // Delegate to new API
  return this.cliSignature(cword, ...words);
}
```

### Step 5: Test
1. Build: `web4tscomponent build`
2. Test method completion: `web4tscomponent cliSignature 1 web4tscomponent ""`
3. Test parameter completion: `web4tscomponent cliSignature 2 web4tscomponent setCICDVersion ""`
4. Run tests: `web4tscomponent test file completion-model-driven.test.ts`

### Step 6: Update PDCAs
- Update `2025-11-04-UTC-1244.pdca.md` with results
- Update `2025-11-04-UTC-1450.pdca.md` with execution details

## CRITICAL: RADICAL OOP CHECKLIST
Before committing, verify EVERY helper method:
- [ ] `getMethodSignature()` - parameterless, uses `this.model.completionCommand`
- [ ] `getAllMethodSignatures()` - parameterless, uses `this.model`
- [ ] `highlightParameter()` - parameterless, uses `this.model`
- [ ] `completeMethodName()` - parameterless, uses `this.model`
- [ ] `completeCommandParameter()` - parameterless, uses `this.model`
- [ ] `cliSignature()` - only sets model, delegates to parameterless methods

## SUCCESS CRITERIA
1. ✅ Method completion works with diagnostics
2. ✅ Parameter completion works with signature display
3. ✅ All helpers are parameterless (Radical OOP)
4. ✅ No fake context injection needed
5. ✅ Old `shCompletion()` deprecated but still works
6. ✅ All tests pass

