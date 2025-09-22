# 🚀 **Web4TSComponent 0.3.0.8** - Auto-Discovery CLI for New Agents

**Version:** 0.3.0.8  
**For:** New agents who have never seen Web4 components or auto-discovery CLI  
**Goal:** Learn the simple, compliant way to add methods without breaking anything  
**Architecture:** Unit-pattern CLI with automatic method discovery (it's easier than you think!)  

---

## **🎯 For New Agents: The Simple Truth**

### **💡 What You Need to Know (Don't Overthink It!)**

**Web4TSComponent has MAGIC:** 
- Add a method to the component → it automatically appears in the CLI
- No CLI configuration needed
- No switch cases to update  
- No hardcoded help text to maintain
- **It just works automatically!**

**Your Job is SIMPLE:**
1. Add method to `DefaultWeb4TSComponent.ts`
2. Add 3 lines of TSDoc comments
3. That's it! CLI discovers it automatically

---

## **📋 Quick Start (Test This First!)**

```bash
# Navigate to component directory
cd components/Web4TSComponent/0.3.0.8

# Show help - see ALL methods auto-discovered
./web4tscomponent

# Create a component (watch it work!)
./web4tscomponent create MyTestComponent 0.1.0.0 all

# Test method chaining (this works too!)
./web4tscomponent on MyTestComponent 0.1.0.0 upgrade nextBuild
```

**What you'll see:** The CLI shows dozens of methods automatically. You didn't configure any of them - they're discovered from the TypeScript code!

---

## **🎯 How Auto-Discovery CLI Works (The Magic Explained)**

### **The Beautiful Simplicity:**

```typescript
// When you run: ./web4tscomponent create MyComponent 0.1.0.0 all
// The CLI automatically:
// 1. Finds the 'create' method on DefaultWeb4TSComponent
// 2. Calls: component.create('MyComponent', '0.1.0.0', 'all')
// 3. That's it! No configuration needed.
```

**How does it know?**
- CLI scans `DefaultWeb4TSComponent` class
- Finds all public methods automatically  
- Reads TSDoc comments for parameter info
- Generates help text automatically
- **Zero configuration required!**

---

## **📚 Adding Your First Method (The Safe Way)**

### **🚨 CRITICAL: Don't Break Anything!**

**New agents often try complex approaches and break everything. Here's the SIMPLE way:**

### **Step 1: Add Method to Component (Only Place You Edit!)**

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

### **Step 2: Test It (Watch the Magic!)**

```bash
# Rebuild (auto-happens when you run CLI)
cd components/Web4TSComponent/0.3.0.8

# Check help - your method is automatically there!
./web4tscomponent | grep myAwesome

# Use your method
./web4tscomponent myAwesomeFeature "test data" json
```

### **Step 3: That's It! (Seriously!)**

**No other files to edit:**
- ❌ Don't touch the CLI file
- ❌ Don't add switch cases  
- ❌ Don't update help text
- ❌ Don't configure anything

**It's automatically discovered and available!**

---

## **🎯 TSDoc Magic (The 3 Lines That Make It Work)**

### **Required TSDoc Comments:**

```typescript
/**
 * Human description of what the method does
 * @param paramName Description of parameter
 * @cliSyntax paramName anotherParam
 * @cliDefault paramName defaultValue
 * @cliHide  // Use this to hide internal methods
 */
```

### **TSDoc Annotations Explained:**

**`@cliSyntax paramName anotherParam`**
- Tells CLI what parameters to expect
- Generates: `myMethod <paramName> <anotherParam>`
- **Required for CLI discovery**

**`@cliDefault paramName defaultValue`**  
- Sets default values for parameters
- Generates: `<paramName=defaultValue>` in help
- Makes parameters optional

**`@cliHide`**
- Hides method from CLI (for internal methods)
- Method exists but won't show in help

### **Parameter Types That Work:**

```typescript
// ✅ Simple parameters (recommended)
async myMethod(name: string, version: string): Promise<this>

// ✅ Optional parameters with defaults
async myMethod(name: string, options: string = 'default'): Promise<this>

// ✅ Return this for method chaining
return this; // Enables: component.method1().method2()
```

---

## **⚠️ Common New Agent Mistakes (Don't Do These!)**

### **❌ Mistake 1: Editing the CLI File**
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

### **❌ Mistake 2: Complex Parameter Patterns**
```typescript
// ❌ DON'T DO THIS:
async myMethod(options: { name: string, config: Config, flags: string[] }): Promise<void>
```

**✅ CORRECT:** Use simple parameters:
```typescript
async myMethod(name: string, config: string, flags: string): Promise<this>
```

### **❌ Mistake 3: Forgetting TSDoc**
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

### **❌ Mistake 4: Not Returning `this`**
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

## **🔧 Method Addition Checklist (Copy This!)**

### **Before You Start:**
- [ ] I understand I only edit DefaultWeb4TSComponent.ts
- [ ] I won't touch the CLI files
- [ ] I'll use simple parameters
- [ ] I'll add proper TSDoc comments

### **Adding the Method:**
- [ ] Open `src/ts/layer2/DefaultWeb4TSComponent.ts`
- [ ] Add method with TSDoc comments
- [ ] Use `@cliSyntax` for parameters
- [ ] Return `this` for chaining
- [ ] Keep parameters simple (strings, not objects)

### **Testing:**
- [ ] Run `./web4tscomponent` to see method in help
- [ ] Test method: `./web4tscomponent myMethod param1 param2`
- [ ] Verify method chaining works if needed
- [ ] Check that nothing broke

### **If Something Breaks:**
- [ ] Check TSDoc syntax (missing @cliSyntax?)
- [ ] Check parameter types (too complex?)
- [ ] Check return type (should be Promise<this>)
- [ ] **Don't edit CLI files to "fix" it!**

---

## **🎯 Real Examples (Copy These Patterns!)**

### **Example 1: Simple Data Processing**
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

### **Example 2: Component Analysis**
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

### **Example 3: Method Chaining Support**
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

---

## **🛡️ Web4 Compliance Rules (Follow These Always!)**

### **1. Empty Constructor Principle**
```typescript
// ✅ CORRECT: Empty constructor
constructor() {
  this.model = {
    // Initialize with defaults
  };
}

// ❌ WRONG: Constructor with parameters
constructor(config: Config) { // DON'T DO THIS!
}
```

### **2. Scenario Support (Required for Web4)**
```typescript
// ✅ EVERY component must have these methods:
init(scenario: Scenario<Web4TSComponentModel>): this {
  // Initialize from scenario
}

async toScenario(): Promise<Scenario<Web4TSComponentModel>> {
  // Convert to scenario for hibernation
}
```

### **3. Human-Readable Errors**
```typescript
// ✅ CORRECT: Speak like a human
throw new Error('I couldn\'t find the component. Please check the name and version.');

// ❌ WRONG: Technical error codes
throw new Error('ENOENT: no such file or directory');
```

### **4. Return `this` for Chaining**
```typescript
// ✅ CORRECT: Enable method chaining
async myMethod(): Promise<this> {
  // Do work
  return this; // Enables: component.method1().method2()
}

// ❌ WRONG: Can't chain
async myMethod(): Promise<void> {
  // Can't chain methods
}
```

---

## **🎯 Advanced: Context-Aware Methods**

### **When Your Method Needs Component Context:**

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

## **🧪 Testing Your New Method**

### **Quick Test Checklist:**

```bash
# 1. Check method appears in help
./web4tscomponent | grep myMethod

# 2. Test basic usage
./web4tscomponent myMethod param1 param2

# 3. Test with context if needed
./web4tscomponent on TestComponent 0.1.0.0 myMethod param1

# 4. Test method chaining
./web4tscomponent on TestComponent 0.1.0.0 myMethod param1 upgrade nextBuild

# 5. Verify nothing broke
./web4tscomponent create TestVerify 0.1.0.0 all
```

---

## **📋 Complete Example: Adding a New Method**

### **Scenario:** You want to add a method that validates component structure

### **Step 1: Add to DefaultWeb4TSComponent.ts**
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

### **Step 2: Test It**
```bash
# Method automatically appears in CLI:
./web4tscomponent | grep validateStructure

# Use it:
./web4tscomponent on MyComponent 0.1.0.0 validateStructure thorough true

# Chain it:
./web4tscomponent on MyComponent 0.1.0.0 validateStructure basic false upgrade nextBuild
```

### **Step 3: Done!**
Your method is now part of the CLI permanently. No other files to edit!

---

## **🚨 What NOT to Do (Save Yourself Hours of Debugging!)**

### **❌ Don't Edit CLI Files**
```typescript
// ❌ NEVER EDIT: Web4TSComponentCLI.ts
// ❌ NEVER EDIT: DefaultCLI.ts
// The CLI auto-discovers methods - don't "help" it!
```

### **❌ Don't Add Switch Cases**
```typescript
// ❌ DON'T ADD THESE:
switch (command) {
  case 'myNewMethod':  // ← This breaks the auto-discovery!
    await this.myNewMethod();
    break;
}
```

### **❌ Don't Update Help Text**
```typescript
// ❌ DON'T ADD HARDCODED HELP:
console.log('myNewMethod - does something cool');
// The CLI generates help automatically from TSDoc!
```

### **❌ Don't Use Complex Parameters**
```typescript
// ❌ DON'T USE OBJECTS:
async myMethod(config: { name: string, options: string[] }): Promise<void>

// ✅ USE SIMPLE PARAMETERS:
async myMethod(name: string, options: string): Promise<this>
```

---

## **🎯 Why This Works (The Web4 Magic)**

### **Auto-Discovery Architecture:**
1. **CLI scans DefaultWeb4TSComponent** using TypeScript reflection
2. **Finds all public methods** automatically
3. **Reads TSDoc comments** for parameter information  
4. **Generates help text** from your comments
5. **Routes commands** to your methods automatically

### **Zero Configuration:**
- No CLI configuration files
- No method registration arrays
- No hardcoded command lists
- **Just add method + TSDoc = CLI command!**

### **DRY Principle:**
- Write method once → available everywhere
- TSDoc comments → automatic documentation
- Method signature → automatic parameter handling
- **No repetitive code anywhere!**

---

## **🔧 Troubleshooting (When Things Don't Work)**

### **Method Not Appearing in CLI?**
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

### **Method Throws Errors?**
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

### **Method Chaining Not Working?**
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

---

## **🎯 Advanced Patterns (Once You're Comfortable)**

### **File Operations:**
```typescript
/**
 * Process files in component directory
 * @param pattern File pattern to match
 * @cliSyntax pattern
 */
async processFiles(pattern: string): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before processing files.');
  }
  
  // Use fs for file operations
  const files = await fs.readdir(context.path);
  // Process files matching pattern
  
  return this;
}
```

### **External Tool Integration:**
```typescript
/**
 * Run external validation tool
 * @param toolName Name of validation tool
 * @cliSyntax toolName
 */
async runValidator(toolName: string): Promise<this> {
  console.log(`🔧 Running ${toolName} validator`);
  
  // Use child_process for external tools
  const { execSync } = require('child_process');
  try {
    const result = execSync(`${toolName} --version`, { encoding: 'utf-8' });
    console.log(`✅ ${toolName} available: ${result.trim()}`);
  } catch (error) {
    throw new Error(`I couldn't find ${toolName}. Please install it first.`);
  }
  
  return this;
}
```

---

## **🚀 You're Ready! (It's Really This Simple)**

### **Remember:**
1. **Add method to DefaultWeb4TSComponent.ts**
2. **Add TSDoc with @cliSyntax**  
3. **Return this for chaining**
4. **Test it works**
5. **That's it!**

### **The CLI Magic:**
- Automatically discovers your method
- Generates help text from your TSDoc
- Routes commands to your method
- Handles parameters automatically
- **Zero configuration required!**

### **When You Need Help:**
- Look at existing methods in DefaultWeb4TSComponent.ts
- Copy their TSDoc pattern
- Keep parameters simple
- Test frequently

**Welcome to Web4 auto-discovery CLI - it's simpler and more powerful than you think!** 🚀⚡

---

## **📚 Related Documentation**

- **Original Patterns:** Copy from existing methods in DefaultWeb4TSComponent.ts
- **Unit Reference:** See Unit component for more auto-discovery examples
- **Web4 Principles:** Empty constructors, scenarios, human-readable errors
- **Testing:** Use Vitest for component testing (Jest is banned)

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🤝✨