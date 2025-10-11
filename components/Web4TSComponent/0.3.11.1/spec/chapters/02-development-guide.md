# Chapter 2: Development Guide

**Document:** Web4TSComponent Technical Specification  
**Chapter:** API Extension & Development  
**Focus:** How to extend and develop with Web4TSComponent

[← Back to Index](../component.spec.md)

---

## 4. API Extension Specification

### 🚨 CRITICAL: Don't Break Anything!

**New agents often try complex approaches and break everything. Here's the SIMPLE way:**

### Your Job is SIMPLE:

1. Add method to `DefaultWeb4TSComponent.ts`
2. Add 3 lines of TSDoc comments
3. That's it! CLI discovers it automatically

### Step 1: Add Method to Component (Only Place You Edit!)

Open: `src/ts/layer2/DefaultWeb4TSComponent.ts`

Add your method anywhere in the class:

```typescript
/**
 * Your new awesome feature
 * @param inputData Data to process
 * @param outputFormat Format for output (json, xml, csv)
 * @cliSyntax inputData outputFormat
 * @cliDefault outputFormat json
 */
async myAwesomeFeature(inputData: string, outputFormat: string = 'json'): Promise<this> {
  console.log(`🚀 Processing ${inputData} as ${outputFormat}`);
  
  // Your implementation here
  console.log(`✅ Awesome feature completed!`);
  
  return this; // Enable method chaining
}
```

### Step 2: Test It (Watch the Magic!)

```bash
# Just start the component (auto-build happens)
npm start

# Or use the wrapper
./web4tscomponent | grep myAwesome

# Use your method
./web4tscomponent myAwesomeFeature "test data" json
```

### Step 3: That's It! (Seriously!)

**No other files to edit:**
- ❌ Don't touch the CLI file
- ❌ Don't add switch cases
- ❌ Don't update help text
- ❌ Don't configure anything

**It's automatically discovered and available!**

---

## 🎯 TSDoc Magic (The 3 Lines That Make It Work)

### Required TSDoc Comments:

```typescript
/**
 * Human description of what the method does
 * @param paramName Description of parameter
 * @cliSyntax paramName anotherParam
 * @cliDefault paramName defaultValue
 * @cliHide  // Use this to hide internal methods
 */
```

### TSDoc Annotations Explained:

**`@cliSyntax paramName anotherParam`**
- Tells CLI what parameters to expect
- Generates: `myMethod <paramName> <anotherParam>`
- **Required for CLI discovery** - see [Tab Completion](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/01-architecture.md#3-tab-completion-architecture) | [chapters/01-architecture.md](chapters/01-architecture.md#3-tab-completion-architecture)

**`@cliDefault paramName defaultValue`**
- Sets default values for parameters
- Generates: `<paramName=defaultValue>` in help
- Makes parameters optional

**`@cliHide`**
- Hides method from CLI (for internal methods)
- Method exists but won't show in help

### Parameter Types That Work:

```typescript
// ✅ Simple parameters (recommended)
async myMethod(name: string, version: string): Promise<this>

// ✅ Optional parameters with defaults
async myMethod(name: string, options: string = 'default'): Promise<this>

// ✅ Return this for method chaining
return this; // Enables: component.method1().method2()
```

---

## ⚠️ Common New Agent Mistakes (Don't Do These!)

### ❌ Mistake 1: Editing the CLI File

```typescript
// ❌ DON'T DO THIS:
// Editing Web4TSComponentCLI.ts to add switch cases
switch (command) {
  case 'myNewMethod':  // ← DON'T ADD THESE!
    await this.myNewMethod();
    break;
}
```

**✅ CORRECT:** Just add method to DefaultWeb4TSComponent - CLI finds it automatically!

### ❌ Mistake 2: Complex Parameter Patterns

```typescript
// ❌ DON'T DO THIS:
async myMethod(options: { name: string, config: Config, flags: string[] }): Promise<void>
```

**✅ CORRECT:** Use simple parameters:
```typescript
async myMethod(name: string, config: string, flags: string): Promise<this>
```

### ❌ Mistake 3: Forgetting TSDoc

```typescript
// ❌ DON'T DO THIS:
async myMethod(param: string): Promise<void> {
  // No TSDoc comments
}
```

**✅ CORRECT:** Always add TSDoc:
```typescript
/**
 * Description of method
 * @param param Description of parameter
 * @cliSyntax param
 */
async myMethod(param: string): Promise<this>
```

### ❌ Mistake 4: Not Returning `this`

```typescript
// ❌ DON'T DO THIS:
async myMethod(): Promise<void> {
  // Can't chain methods
}
```

**✅ CORRECT:** Return this for chaining:
```typescript
async myMethod(): Promise<this> {
  return this; // Enables method chaining
}
```

---

## 🎯 Context-Aware Methods (Advanced Pattern)

### When Your Method Needs Component Context:

Some methods work on a specific component (like upgrade, optimize, analyze). Use this pattern:

```typescript
/**
 * Your context-aware method
 * @param parameter Your parameter
 * @cliSyntax parameter
 */
async myContextMethod(parameter: string): Promise<this> {
  // Get component context (set by 'on' command)
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before running this method.');
  }
  
  console.log(`🔧 Working on ${context.component} v${context.version}`);
  console.log(`   Path: ${context.path}`);
  
  // Your logic here using context.component, context.version, context.path
  
  return this;
}
```

**Usage:**
```bash
./web4tscomponent on MyComponent 0.1.0.0 myContextMethod "parameter"
```

---

## 📋 Method Addition Checklist (Copy This!)

### Before You Start:
- [ ] I understand I only edit DefaultWeb4TSComponent.ts
- [ ] I won't touch the CLI files
- [ ] I'll use simple parameters
- [ ] I'll add proper TSDoc comments

### Adding the Method:
- [ ] Open `src/ts/layer2/DefaultWeb4TSComponent.ts`
- [ ] Add method with TSDoc comments
- [ ] Use `@cliSyntax` for parameters
- [ ] Return `this` for chaining
- [ ] Keep parameters simple (strings, not objects)

### Testing:
- [ ] Run `npm start` to see method in help
- [ ] Test method: `./web4tscomponent myMethod param1 param2`
- [ ] Verify method chaining works if needed
- [ ] Check that nothing broke

### If Something Breaks:
- [ ] Check TSDoc syntax (missing @cliSyntax?)
- [ ] Check parameter types (too complex?)
- [ ] Check return type (should be Promise<this>)
- [ ] **Don't edit CLI files to "fix" it!**

---

## 🎯 Real-World Examples (Copy These Patterns!)

### Example 1: Simple Data Processing

```typescript
/**
 * Process component data with transformation
 * @param inputFile Path to input file
 * @param outputFormat Output format (json, xml, csv)
 * @cliSyntax inputFile outputFormat
 * @cliDefault outputFormat json
 */
async processData(inputFile: string, outputFormat: string = 'json'): Promise<this> {
  console.log(`🔄 Processing ${inputFile} as ${outputFormat}`);
  
  // Your processing logic here
  
  console.log(`✅ Data processing completed`);
  return this;
}
```

**Usage:** `./web4tscomponent processData myfile.txt xml`

### Example 2: Component Analysis

```typescript
/**
 * Analyze component for quality metrics
 * @param componentPath Path to component directory
 * @cliSyntax componentPath
 */
async analyzeQuality(componentPath: string): Promise<this> {
  console.log(`📊 Analyzing quality: ${componentPath}`);
  
  // Your analysis logic here
  
  console.log(`✅ Quality analysis completed`);
  return this;
}
```

**Usage:** `./web4tscomponent analyzeQuality components/MyComponent/0.1.0.0`

### Example 3: Method Chaining Support

```typescript
/**
 * Optimize component performance
 * @param level Optimization level (basic, advanced, extreme)
 * @cliSyntax level
 * @cliDefault level basic
 */
async optimize(level: string = 'basic'): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before optimizing.');
  }
  
  console.log(`⚡ Optimizing ${context.component} at ${level} level`);
  
  // Your optimization logic here
  
  console.log(`✅ Optimization completed`);
  return this;
}
```

**Usage:** `./web4tscomponent on MyComponent 0.1.0.0 optimize advanced`

### Example 4: Complete Method with Context

```typescript
/**
 * Validate component structure and dependencies
 * @param checkLevel Validation level (basic, thorough, strict)
 * @param fixIssues Whether to fix found issues automatically
 * @cliSyntax checkLevel fixIssues
 * @cliDefault checkLevel basic
 * @cliDefault fixIssues false
 */
async validateStructure(checkLevel: string = 'basic', fixIssues: string = 'false'): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before validating.');
  }
  
  console.log(`🔍 Validating ${context.component} structure at ${checkLevel} level`);
  
  // Your validation logic here
  const shouldFix = fixIssues === 'true';
  if (shouldFix) {
    console.log(`🔧 Fixing issues automatically`);
    // Fix logic here
  }
  
  console.log(`✅ Structure validation completed`);
  return this;
}
```

**Usage:**
```bash
# Basic validation
./web4tscomponent on MyComponent 0.1.0.0 validateStructure

# Thorough validation with auto-fix
./web4tscomponent on MyComponent 0.1.0.0 validateStructure thorough true

# Chain with other operations
./web4tscomponent on MyComponent 0.1.0.0 validateStructure basic false upgrade nextBuild
```

---

ponent 0.1.0.0 validateStructure basic false upgrade nextBuild
```

---

