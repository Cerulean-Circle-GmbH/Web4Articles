# 🎯 **Web4 Pattern Learning Checklist for Future Agent Work**

**🗓️ Created:** 2025-09-23-UTC-1340  
**🎯 Purpose:** Systematic Web4 pattern understanding before component modifications  
**📋 Version:** 1.0.0  
**🔄 Based on:** CMM1 violation analysis and Web4TSComponent auto-discovery research  

---

## **🚨 MANDATORY PRE-MODIFICATION CHECKLIST**

### **📖 Phase 1: Read Component Documentation (ALWAYS FIRST)**

- [ ] **Read component README.md completely**
  - Location: `components/[Component]/[Version]/README.md`
  - Focus: Auto-discovery patterns, CLI architecture, method addition guidelines
  - Key search terms: "auto-discovery", "switch cases", "TSDoc", "@cliSyntax"

- [ ] **Understand component architecture**
  - Identify: Is this a Web4 auto-discovery component?
  - Check: Does CLI use `executeDynamicCommand` pattern?
  - Verify: Are methods added via TSDoc annotations?

- [ ] **Review existing method patterns**
  - Examine: How are current methods documented?
  - Pattern: Look for `@cliSyntax`, `@cliDefault`, `@cliHide` annotations
  - Returns: Do methods return `this` for chaining?

### **📋 Phase 2: CLI Pattern Identification**

- [ ] **Check for auto-discovery infrastructure**
  - File: `src/ts/layer5/[Component]CLI.ts`
  - Look for: `executeDynamicCommand` method calls
  - Pattern: `if (await this.executeDynamicCommand(command, commandArgs))`

- [ ] **Identify switch case usage**
  - ✅ **Acceptable:** Legacy commands (create, classify, help)
  - ❌ **Forbidden:** New method implementations in switch cases
  - Rule: Only add switch cases for non-component methods

- [ ] **Understand parameter routing**
  - Auto-discovery: Parameters passed directly to component methods
  - TSDoc driven: Method signatures must match `@cliSyntax` annotations
  - Type safety: Use simple types (string, number), avoid complex objects

### **🔧 Phase 3: Implementation Strategy Verification**

- [ ] **Choose correct implementation approach**
  - ✅ **Auto-discovery:** Add method to DefaultComponent with TSDoc
  - ❌ **Switch case:** Only for non-discoverable functionality
  - ❌ **CLI modification:** Never modify CLI files for component methods

- [ ] **Verify TSDoc requirements**
  - `@cliSyntax paramName anotherParam` - Parameter definition
  - `@cliDefault paramName defaultValue` - Default value specification  
  - `@cliHide` - Hide method from CLI discovery
  - Return type: `Promise<this>` for method chaining

- [ ] **Plan method implementation**
  - Location: `src/ts/layer2/Default[Component].ts`
  - Pattern: Add method anywhere in class
  - Documentation: Complete TSDoc with examples
  - Testing: Plan verification approach

---

## **⚡ WEB4 AUTO-DISCOVERY PRINCIPLES**

### **🎯 Core Understanding:**

**Zero Configuration Magic:**
```typescript
// ✅ CORRECT: Add method to component
/**
 * Your new awesome feature
 * @param inputData Data to process
 * @param outputFormat Format for output
 * @cliSyntax inputData outputFormat
 * @cliDefault outputFormat json
 */
async myAwesomeFeature(inputData: string, outputFormat: string = 'json'): Promise<this> {
  // Implementation here
  return this;
}

// ❌ WRONG: Add switch case to CLI
case 'myAwesomeFeature':
  await this.myAwesomeFeature();
  break;
```

**Auto-Discovery Flow:**
1. CLI scans component class using TypeScript reflection
2. Finds all public methods automatically
3. Reads TSDoc comments for parameter information
4. Generates help text from documentation
5. Routes commands to methods via `executeDynamicCommand`

### **🔒 Never Edit These Files:**

- ❌ `src/ts/layer5/[Component]CLI.ts` - Auto-discovery handles routing
- ❌ `src/ts/layer2/DefaultCLI.ts` - Base CLI infrastructure
- ❌ Help text files - Generated automatically from TSDoc

### **✅ Always Edit This File:**

- ✅ `src/ts/layer2/Default[Component].ts` - Component implementation
- ✅ Add methods with proper TSDoc annotations
- ✅ Return `this` for method chaining support

---

## **📝 METHOD ADDITION TEMPLATE**

### **Standard Method Pattern:**

```typescript
/**
 * [Human description of what the method does]
 * Web4 pattern: [Pattern description - auto-discovery, context-aware, etc.]
 * 
 * @param paramName Description of parameter
 * @param optionalParam Description of optional parameter
 * @cliSyntax paramName optionalParam
 * @cliDefault optionalParam defaultValue
 * @returns this - Enables command chaining for fluent interface
 * @example
 * ```bash
 * component methodName "parameter value" optionalValue
 * component on Context 0.1.0.0 methodName "parameter"
 * ```
 */
async methodName(paramName: string, optionalParam: string = 'defaultValue'): Promise<this> {
  // Context check for context-aware methods
  const context = this.getComponentContext?.();
  if (needsContext && !context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before this method.');
  }
  
  console.log(`🔧 Processing ${paramName} with ${optionalParam}`);
  
  // Your implementation here
  
  console.log(`✅ Method completed successfully`);
  return this; // CRITICAL: Enable method chaining
}
```

### **Context-Aware Method Pattern:**

```typescript
/**
 * [Description] - requires component context
 * Web4 pattern: Context-aware method with component loading
 * 
 * @param parameter Your parameter description
 * @cliSyntax parameter
 */
async contextMethod(parameter: string): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before this method.');
  }
  
  console.log(`🔧 Working on ${context.component} v${context.version}`);
  // Use context.component, context.version, context.path
  
  return this;
}
```

---

## **🧪 TESTING VERIFICATION CHECKLIST**

### **Before Implementation:**

- [ ] **Component builds without errors**
  - `npm run build --prefix components/[Component]/[Version]`

- [ ] **Existing functionality still works**
  - Test existing commands work
  - Verify no regressions introduced

### **After Implementation:**

- [ ] **Method appears in help automatically**
  - `./[component] | grep methodName`
  - Verify auto-generated documentation

- [ ] **Method executes correctly**
  - `./[component] methodName param1 param2`
  - Test with various parameter combinations

- [ ] **Method chaining works (if applicable)**
  - `./[component] on Component 0.1.0.0 methodName param1`
  - Verify context-aware operations

- [ ] **Error handling works**
  - Test missing parameters
  - Test invalid parameters
  - Verify human-readable error messages

### **Integration Testing:**

- [ ] **Auto-discovery integration**
  - Method found via `executeDynamicCommand`
  - No switch case needed
  - Help text generated automatically

- [ ] **Parameter handling**
  - TSDoc annotations work correctly
  - Default values applied properly
  - Type conversion handled

- [ ] **Component compilation**
  - TypeScript builds without errors
  - No type safety violations
  - Runtime execution successful

---

## **🚨 RED FLAGS - STOP AND RECONSIDER**

### **❌ Immediate CMM1 Violation Indicators:**

- **Adding switch cases** for component methods
- **Modifying CLI files** instead of component files
- **Hardcoding help text** instead of using TSDoc
- **Complex parameter objects** instead of simple types
- **Not returning `this`** for method chaining
- **Forgetting TSDoc annotations** completely

### **❌ Architecture Violation Signs:**

- **Bypassing auto-discovery** infrastructure
- **Duplicating existing patterns** incorrectly
- **Breaking method chaining** capability
- **Ignoring context requirements** for context-aware methods
- **Using non-Web4 error patterns** (technical vs human-readable)

### **❌ Process Violation Warnings:**

- **Skipping README research** before modification
- **Not testing auto-discovery** integration
- **Failing to verify compilation** before commit
- **Forgetting git push** after commits

---

## **📋 DECISION MATRIX**

### **When to Use Auto-Discovery Pattern:**

✅ **Always use for:**
- Component functionality methods
- Data processing operations  
- Analysis and validation methods
- Context-aware operations
- Method chaining workflows

### **When to Use Switch Cases:**

✅ **Only use for:**
- Meta-operations (create, help, version)
- CLI infrastructure commands
- Non-component functionality
- Legacy compatibility requirements

### **When to Modify CLI Files:**

❌ **Never modify for:**
- Adding component methods
- Parameter handling
- Help text generation
- Method routing

✅ **Only modify for:**
- Infrastructure improvements
- CLI framework enhancements
- Meta-command additions
- Error handling improvements

---

## **🎯 COMPLIANCE VERIFICATION**

### **Pre-Commit Checklist:**

- [ ] Component README read and understood
- [ ] Auto-discovery pattern confirmed
- [ ] Method added to component (not CLI)
- [ ] TSDoc annotations complete and correct
- [ ] Method returns `this` for chaining
- [ ] Component builds successfully
- [ ] Auto-discovery integration tested
- [ ] Method appears in help automatically
- [ ] Functionality works as expected
- [ ] No switch cases added for component methods

### **CMM4 Verification:**

- [ ] **System Understanding:** Architecture comprehended before modification
- [ ] **Pattern Compliance:** Web4 auto-discovery principles followed
- [ ] **Whitebox Analysis:** Component internals understood
- [ ] **Systematic Implementation:** Checklist followed completely
- [ ] **Quality Verification:** All tests pass, no regressions

---

## **📚 REFERENCE DOCUMENTATION**

### **Essential Reading:**

- **Web4TSComponent README:** Complete auto-discovery guide with examples
- **Component-specific README:** Architecture and patterns for target component  
- **PDCA howto.PDCA.md:** Git protocols and commit requirements
- **CMM howto.cmm.md:** Maturity model understanding

### **Pattern Examples:**

- **DefaultWeb4TSComponent.ts:** Gold standard auto-discovery implementation
- **DefaultUnit.ts:** Context-aware method patterns
- **Component CLI files:** Auto-discovery infrastructure examples

### **Anti-Patterns Documentation:**

- **CMM1 violation analysis:** What not to do and why
- **Switch case additions:** Why they break auto-discovery
- **CLI file modifications:** Architecture violations

---

**🎯 This checklist ensures CMM4 systematic understanding before any component modifications - preventing CMM1 reactive approaches that bypass Web4 auto-discovery architecture.** 📋✅

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO) - systematic pattern understanding enables elegant auto-discovery compliance."** 🔧📊
