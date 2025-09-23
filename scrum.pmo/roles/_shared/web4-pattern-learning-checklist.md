# 🎯 **Web4 Pattern Learning Checklist for Agents**

**Version:** 1.0.0  
**Created:** 2025-09-23-UTC-1340  
**Purpose:** Systematic Web4 pattern understanding before component modifications  
**Compliance:** CMM4 feedback loop mastery requirement  

---

## **🚨 MANDATORY Pre-Modification Checklist**

### **Before ANY Component CLI Changes:**

- [ ] **Read Component README First**
  - Location: `components/[ComponentName]/[Version]/README.md`
  - Understanding: Auto-discovery architecture, CLI patterns, method addition examples
  - Verification: Can explain how CLI discovers methods without switch cases

- [ ] **Understand Auto-Discovery Pattern**
  - CLI scans component class using TypeScript reflection
  - Finds all public methods automatically
  - Reads TSDoc comments for parameter information
  - Generates help text from method documentation
  - Routes commands to methods via `executeDynamicCommand`

- [ ] **Check Existing CLI Implementation**
  - File: `src/ts/layer5/[Component]CLI.ts`
  - Look for: `executeDynamicCommand` method
  - Understand: How dynamic method routing works
  - Verify: Switch cases are for special non-component methods only

---

## **📋 Web4 Auto-Discovery Method Addition Pattern**

### **Step 1: Component Method Addition (ONLY File to Edit)**
```typescript
/**
 * [Human description of what the method does]
 * Web4 pattern: [Pattern description e.g., Auto-discovery CLI method]
 * 
 * @param paramName [Description of parameter]
 * @cliSyntax paramName anotherParam
 * @cliDefault paramName defaultValue
 * @returns this - Enables command chaining for fluent interface
 * @example
 * ```bash
 * component methodName param1 param2
 * component on Context 0.1.0.0 methodName param1
 * ```
 */
async methodName(paramName?: string): Promise<this> {
  // Method implementation
  return this;
}
```

### **Step 2: Required TSDoc Annotations**
- **`@cliSyntax paramName anotherParam`** - Tells CLI what parameters to expect
- **`@cliDefault paramName defaultValue`** - Sets default values for optional parameters  
- **`@cliHide`** - Hides internal methods from CLI help
- **`@param`** - Parameter descriptions for documentation
- **`@returns this`** - Enable method chaining
- **`@example`** - Usage examples in bash

### **Step 3: Web4 Compliance Requirements**
- **Empty Constructor:** No parameters in constructor
- **Return `this`:** Enable method chaining with `Promise<this>`
- **Human Errors:** User-friendly error messages, not technical codes
- **Scenario Support:** All components must have `init()` and `toScenario()`

---

## **❌ ANTI-PATTERNS (Never Do These)**

### **CLI File Modifications**
```typescript
// ❌ NEVER ADD SWITCH CASES:
case 'myNewMethod':
  await this.myNewMethod();
  break;

// ❌ NEVER EDIT CLI FILES:
// - [Component]CLI.ts
// - DefaultCLI.ts
```

### **Complex Parameter Patterns**
```typescript
// ❌ DON'T USE OBJECTS:
async method(config: {name: string, options: string[]}): Promise<void>

// ✅ USE SIMPLE PARAMETERS:
async method(name: string, options: string): Promise<this>
```

### **Missing TSDoc**
```typescript
// ❌ NO TSDoc COMMENTS:
async method(param: string): Promise<void> {
  // Auto-discovery won't work
}

// ✅ PROPER TSDoc:
/**
 * @param param Description
 * @cliSyntax param
 */
async method(param: string): Promise<this>
```

---

## **🔧 Verification Steps**

### **Method Discovery Test**
```bash
# 1. Build component
cd components/[Component]/[Version]
npm run build

# 2. Check method appears in help
./[component] | grep methodName

# 3. Test method execution
./[component] methodName param1 param2

# 4. Test method chaining (if context-aware)
./[component] on TestComponent 0.1.0.0 methodName param1
```

### **Auto-Discovery Confirmation**
- [ ] Method appears in CLI help automatically
- [ ] No switch case additions needed
- [ ] Parameters parsed correctly from TSDoc
- [ ] Method chaining works
- [ ] Error messages are human-readable

---

## **🎯 Context-Aware Method Pattern**

### **For Methods Requiring Component Context:**
```typescript
/**
 * [Method description - works on loaded component]
 * @param parameter Your parameter
 * @cliSyntax parameter
 */
async contextMethod(parameter: string): Promise<this> {
  const context = this.getComponentContext();
  if (!context) {
    throw new Error('I need a component context first. Please use "on <component> <version>" before this method.');
  }
  
  console.log(`🔧 Working on ${context.component} v${context.version}`);
  // Method logic using context
  
  return this;
}
```

### **Usage Pattern:**
```bash
# Load context first, then use method
./component on MyComponent 0.1.0.0 contextMethod "parameter"
```

---

## **📚 CMM4 Learning Requirements**

### **System Understanding Before Modification**
1. **Whitebox Analysis:** Understand how auto-discovery works internally
2. **Pattern Recognition:** Identify existing method patterns in component
3. **Impact Assessment:** Consider how new method affects overall architecture
4. **Test Strategy:** Plan verification approach before implementation

### **Feedback Loop Integration**
1. **Plan:** Design method with proper TSDoc and Web4 compliance
2. **Do:** Add method to component class only (no CLI changes)
3. **Check:** Verify auto-discovery finds method and parameters work
4. **Act:** Fix any issues with TSDoc or method signature

---

## **🚨 Git Protocol Integration**

### **After Method Addition:**
```bash
# 1. Build and test
npm run build
./component | grep newMethod

# 2. Commit with PDCA name
git add .
git commit -m "PDCA: [Method name] - [Brief description]"

# 3. MANDATORY: Push immediately
git push origin [branch]
```

### **PDCA Documentation Required**
- Document method addition with proper PDCA format
- Include verification results and testing
- Explain Web4 pattern compliance
- Add dual links to modified files

---

## **✅ Success Criteria**

### **Method Successfully Added When:**
- [ ] Appears in CLI help automatically
- [ ] Executes correctly with parameters
- [ ] Returns `this` for method chaining
- [ ] Has proper TSDoc annotations
- [ ] No CLI file modifications needed
- [ ] Follows Web4 compliance patterns
- [ ] Documented in PDCA with verification

### **Auto-Discovery Working When:**
- [ ] `executeDynamicCommand` finds the method
- [ ] Parameters parsed from `@cliSyntax`
- [ ] Defaults applied from `@cliDefault`
- [ ] Help text generated from TSDoc
- [ ] No "Unknown command" errors

---

## **🎯 Quick Reference**

**Files to Edit:** Component class only (`src/ts/layer2/Default[Component].ts`)  
**Files to NOT Edit:** CLI files (`src/ts/layer5/[Component]CLI.ts`)  
**Required Annotations:** `@cliSyntax`, optional `@cliDefault`  
**Return Type:** `Promise<this>` for chaining  
**Error Messages:** Human-readable, not technical codes  
**Testing:** Build, help check, parameter test, chaining test  
**Git Protocol:** Commit and push immediately after verification  

---

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO) - systematic understanding before modification.** 🔧📊
