# 🚀 **How to Use Web4 Components - Complete Usage Guide for New Agents**

**🗓️ Created:** 2025-09-28-UTC-1112  
**👤 Purpose:** Systematic Web4 component usage preventing confusion cycles  
**🎯 For:** New agents learning Web4 ecosystem and component integration  
**📋 Status:** CMM3 Badge Acceleration Documentation  

---

## **🎯 Web4 Component Usage Protocol**

### **Step 1: Check scripts/ Folder for Existing Tools**
```bash
# Always check scripts directory first
ls -la scripts/
find scripts/ -name "*" -type f -executable
grep -r "component\|tool" scripts/
```

**What You'll Find:**
- Pre-built automation scripts
- Component management tools
- Build and deployment utilities
- Environment setup helpers

### **Step 2: Source source.env for Environment Setup**
```bash
# Essential environment configuration
cat source.env
. source.env  # Source the environment file
echo $WORKSPACE_PATH  # Verify environment loaded
```

**Environment Variables:**
- WORKSPACE_PATH: Project root directory
- Component paths and tool locations
- Build configuration settings
- Web4 ecosystem configuration

### **Step 3: Compile TypeScript with npm install typescript**
```bash
# Standard Web4 component compilation
cd components/ComponentName/latest
npm install typescript --save-dev
npx tsc --outDir dist

# Verify compilation
ls -la dist/
```

**Compilation Requirements:**
- TypeScript must be installed locally
- Use --outDir dist for organized output
- Check tsconfig.json for project-specific settings
- Verify all dependencies are installed

### **Step 4: Use Proper Web4 Patterns**

#### **Empty Constructor Pattern**
```typescript
// ✅ CORRECT: Web4 requires empty constructors
const component = new DefaultComponent();

// ❌ WRONG: Never use constructor parameters
const component = new DefaultComponent(config); // FORBIDDEN
```

#### **Scenario Pattern**
```typescript
// ✅ CORRECT: Initialize with scenarios
const component = new DefaultComponent();
component.init(scenario); // Load from scenario if needed

// ✅ CORRECT: Serialize to scenarios
const scenario = await component.toScenario();
```

#### **Method Chaining Pattern**
```typescript
// ✅ CORRECT: Web4 components support chaining
await component.method1().method2().method3();

// Return this in your methods for chaining
async myMethod(): Promise<this> {
  // Implementation
  return this;
}
```

---

## **🔧 Component Execution Methods**

### **Method 1: Direct TypeScript Usage**
```typescript
import { DefaultComponent } from './dist/ts/layer2/DefaultComponent.js';

const component = new DefaultComponent();
const result = await component.methodName(parameters);
```

### **Method 2: CLI Usage (if available)**
```bash
cd components/ComponentName/latest
./componentname --help  # Check if CLI exists
./componentname methodName parameters
```

### **Method 3: Node.js Execution**
```javascript
// Create temporary .mjs file for ES modules
import { DefaultComponent } from './dist/ts/layer2/DefaultComponent.js';

const component = new DefaultComponent();
await component.execute();
```

---

## **🎯 Web4 Component Architecture Understanding**

### **Layer Structure**
```
components/ComponentName/version/
├── src/ts/
│   ├── layer2/          # Core implementation (DefaultComponent.ts)
│   ├── layer3/          # Interfaces and types
│   ├── layer4/          # Utilities and helpers
│   └── layer5/          # CLI and user interaction
├── test/                # Vitest tests (examples!)
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

### **Auto-Discovery CLI Pattern**
```typescript
// Web4 components use auto-discovery CLI
// Methods with @cliSyntax annotations become CLI commands automatically
/**
 * Method description
 * @param param1 Parameter description
 * @cliSyntax param1 param2
 * @cliDefault param1 defaultValue
 */
async methodName(param1: string, param2: string = 'default'): Promise<this>
```

### **Component Context Pattern**
```typescript
// Many components support context loading
await component.on('ComponentName', '0.1.0.0'); // Load context
await component.methodName(); // Use context-aware method
```

---

## **🛡️ Safety Protocols**

### **Before Using Any Component:**
```checklist
- [ ] Read component README.md thoroughly
- [ ] Check test files for usage examples
- [ ] Verify component compiles successfully
- [ ] Test basic functionality before complex usage
- [ ] Check for CLI executable or TypeScript API
```

### **Component Instantiation Safety:**
```typescript
// ✅ SAFE: Empty constructor always works
const component = new DefaultComponent();

// ✅ SAFE: Check if methods exist before calling
if (typeof component.methodName === 'function') {
  await component.methodName();
}

// ✅ SAFE: Handle errors gracefully
try {
  const result = await component.execute();
} catch (error) {
  console.log(`Component execution failed: ${error.message}`);
}
```

---

## **📊 Common Component Usage Patterns**

### **SessionSummary Component**
```typescript
import { DefaultSessionSummary } from './dist/ts/layer2/DefaultSessionSummary.js';

const summary = new DefaultSessionSummary();
const result = await summary.generateSummary({
  sessionPath: '/workspace/path/to/session',
  outputFile: '/workspace/output.md',
  includeDecisions: true,
  branch: 'branchName'
});
```

### **Web4TSComponent**
```bash
cd components/Web4TSComponent/latest
./web4tscomponent create MyComponent 0.1.0.0 all
./web4tscomponent on MyComponent 0.1.0.0 upgrade nextBuild
```

### **Unit Component**
```bash
cd components/Unit/latest
./unit create MyUnit all
./unit on MyUnit upgrade
```

---

## **🚨 Critical Reminders**

### **Environment Setup**
```bash
# ALWAYS source environment first
. source.env

# Check workspace path
echo $WORKSPACE_PATH
```

### **TypeScript Compilation**
```bash
# ALWAYS install typescript locally
npm install typescript --save-dev

# Use proper output directory
npx tsc --outDir dist
```

### **Web4 Compliance**
```typescript
// ALWAYS use empty constructors
// ALWAYS implement init() and toScenario() if Web4 compliant
// ALWAYS return this for method chaining
// ALWAYS use human-readable error messages
```

---

## **🎯 Quick Reference**

**Before Using Component:**
1. `ls -la components/ComponentName/`
2. `cat components/ComponentName/latest/README.md`
3. `. source.env`
4. `cd components/ComponentName/latest && npm install typescript --save-dev`

**Component Execution:**
1. `npx tsc --outDir dist` (if TypeScript)
2. Create .mjs file with proper imports
3. `node execution-script.mjs`
4. Clean up temporary files

**When Stuck:**
1. Check test files for examples
2. Research scripts/ directory
3. Ask TRON with QA Decision

---

**🎯 Web4 component mastery through systematic research and proper usage patterns!** 🚀✅

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** 🤝✨