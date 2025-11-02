# Chapter 1: Architecture

**Document:** Web4TSComponent Technical Specification  
**Chapter:** Architecture Details  
**Focus:** How the system works internally

[← Back to Index](../component.spec.md)

---

## 🚀 Automatic Project Initialization

**You don't need to do anything!** Web4TSComponent automatically initializes your project structure on first run.

### What Happens Automatically:

1. **Creates Root `tsconfig.json`**
   - Provides base TypeScript configuration
   - All component tsconfig files `extend` from this root
   - Ensures consistent TypeScript settings across all components

2. **Creates Root `package.json`**
   - Defines global dependencies (TypeScript, Vitest, etc.)
   - Enables the DRY principle (Don't Repeat Yourself)
   - All components symlink to the global `node_modules`

3. **Creates Global `node_modules` Directory**
   - Single source of truth for all dependencies
   - Components symlink here instead of duplicating packages
   - Saves disk space and ensures version consistency

### Why This Matters (DRY Principle):

**WITHOUT initProject:**
```
❌ project/
   ├── Component1/0.1.0.0/node_modules/  (100MB)
   ├── Component2/0.1.0.0/node_modules/  (100MB)
   └── Component3/0.1.0.0/node_modules/  (100MB)
Total: 300MB of duplicated dependencies
```

**WITH initProject:**
```
✅ project/
   ├── tsconfig.json          (root config)
   ├── package.json           (root dependencies)
   ├── node_modules/          (100MB - single copy)
   ├── Component1/0.1.0.0/
   │   └── node_modules → ../../../node_modules  (symlink)
   ├── Component2/0.1.0.0/
   │   └── node_modules → ../../../node_modules  (symlink)
   └── Component3/0.1.0.0/
       └── node_modules → ../../../node_modules  (symlink)
Total: 100MB (67% space savings)
```

### When Does This Happen?

Automatic initialization triggers when you run:
- ✅ `npm start` (first time)
- ✅ `npm run build` (first time)
- ✅ `npm test` (first time)
- ✅ Any component creation

**The philosophy:** You should **never** have to manually initialize anything. Just `npm start` and everything works.

### Self-Healing Configuration

The system is **resilient** and automatically fixes corrupted configs:

- ✅ **Detects** broken or invalid JSON in `tsconfig.json` or `package.json`
- ✅ **Backs up** the corrupted file (timestamped: `*.backup.20251006-153000`)
- ✅ **Regenerates** a fresh, working configuration
- ✅ **Continues** without manual intervention

**Example:** If someone accidentally breaks `tsconfig.json`:
```bash
# Next npm start automatically:
⚠️  Detected corrupted tsconfig.json - backing up and resetting...
   Creating root tsconfig.json...
   ✅ Web4 project initialized
```

**What gets validated:**
- JSON syntax must be valid
- `tsconfig.json` must have `compilerOptions.module` (critical for ES modules)
- `package.json` must be parseable by Node.js

**What is preserved:**
- If configs are **valid but customized**, they are **NOT overwritten**
- Only **broken/corrupted** files trigger regeneration
- User customizations are safe as long as they're valid JSON

**Note:** If you really need to manually initialize (e.g., CI/CD pre-setup), you can still call:
```bash
./web4tscomponent initProject
```

---

## 🎯 How Auto-Discovery CLI Works (The Magic Explained)

### The Beautiful Simplicity:

```typescript
// When you run: ./web4tscomponent create MyComponent 0.1.0.0 all
// The CLI automatically:
// 1. Finds the 'create' method on DefaultWeb4TSComponent
// 2. Calls: component.create('MyComponent', '0.1.0.0', 'all')
// 3. That's it! No configuration needed.
```

**Related:** See [API Extension](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/02-development-guide.md#4-api-extension-specification) | [chapters/02-development-guide.md](chapters/02-development-guide.md#4-api-extension-specification) for how to add your own methods

### How Does It Know?

**Web4TSComponent has MAGIC:**
- Add a method to the component → it automatically appears in the CLI
- No CLI configuration needed
- No switch cases to update
- No hardcoded help text to maintain
- **It just works automatically!**

**Auto-Discovery Process:**
1. CLI scans `DefaultWeb4TSComponent` class using TypeScript reflection
2. Finds all public methods automatically
3. Reads TSDoc comments for parameter information
4. Generates help text from your comments
5. Routes commands to your methods automatically
6. **Zero configuration required!**

### What You'll See:

```bash
./web4tscomponent

# Output shows dozens of methods automatically:
# - create, upgrade, test, build, clean
# - on (context loading), version, list
# - And many more...
# You didn't configure ANY of them - they're discovered from TypeScript!
```

---

## 3. Tab Completion Architecture

**Design Principle:** Intelligent, context-aware auto-discovery using TypeScript AST analysis

### 3.1 Architecture Characteristics

1. **Zero Configuration** - No completion scripts to write or maintain
2. **Auto-Discovery** - Finds all methods and parameters from TypeScript AST
3. **Inheritance Aware** - Follows `extends` chains automatically
4. **Context Passing** - Completions know what you've already typed
5. **Multi-Parameter Support** - Completes 1st, 2nd, 3rd... parameters intelligently
6. **Command Chaining** - Seamlessly switches between parameters and chained methods

### 3.2 The Complete Architecture Map (Overview)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER TYPES IN BASH                       │
│              web4tscomponent on Unit 0.3.2.0 tre<Tab>          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              BASH COMPLETION (source.env)                       │
│  • Captures: COMP_WORDS=[web4tscomponent, on, Unit, 0.3.2.0, tre]│
│  • Extracts: args=[on, Unit, 0.3.2.0, tre]                     │
│  • Injects: className=Web4TSComponentCLI,DefaultWeb4TSComponent│
│  • Calls: TSCompletion with [className, ...args]               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│            TSCOMPLETION (TypeScript AST Parser)                 │
│  • Receives: [Web4TSComponentCLI,DefaultWeb4TSComponent,        │
│               on, Unit, 0.3.2.0, tre]                          │
│  • Scans: Web4TSComponentCLI.ts → finds 'extends DefaultCLI'   │
│  • Discovers: DefaultCLI methods (componentParameterCompletion,│
│               versionParameterCompletion, etc.)                 │
│  • Analyzes: args.length=5, method 'on' has 2 params           │
│  • Determines: paramIndex=2 >= params.length → CHAINING!       │
│  • Returns: ['tree', 'test', 'transform', ...] (methods        │
│             starting with 'tre')                                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BASH DISPLAYS RESULTS                        │
│                      tree                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 🎪 Alternative Flow: Callback Path

```
USER: web4tscomponent on <Tab>
  ↓
BASH: calls TSCompletion with [Web4TSComponentCLI,DefaultWeb4TSComponent, on, '']
  ↓
TSCOMPLETION: 
  • args.length=3 → completing 1st parameter
  • Gets params=['component', 'version']
  • Checks: componentParameterCompletion exists? YES!
  • Returns: __CALLBACK__:componentParameterCompletion
  ↓
BASH: detects __CALLBACK__:componentParameterCompletion
      calls: web4tscomponent completeParameter componentParameterCompletion on
  ↓
DEFAULTCLI.completeParameter():
  • Receives: callbackName='componentParameterCompletion', contextArgs=['on']
  • Calls: this.componentParameterCompletion(['on'])
  ↓
DEFAULTCLI.componentParameterCompletion():
  • Context: ['on'] (could extract if needed)
  • Lists: all directories in components/
  • Returns: ['Build', 'DefaultCLI', 'Unit', 'Web4TSComponent', ...]
  ↓
BASH: displays all components for user to choose
```

### 💎 Why This Is Beautiful

1. **Zero Maintenance** - Add a method to your class, it's automatically in tab completion
2. **Inheritance Just Works** - Common completions in DefaultCLI, component-specific in YourComponentCLI
3. **Context-Aware** - Version completion knows which component you selected
4. **Seamless Chaining** - Switches automatically between parameters and methods
5. **TypeScript-First** - Everything derived from actual TypeScript code, not config files
6. **Location Resilient** - Works from any directory in the project
7. **DRY Compliant** - Single source of truth: your TypeScript class definitions

### 🎓 Key Takeaways

- **Never hardcode completion lists** - Use TSCompletion to discover from AST
- **Parameter name = completion method** - `depth` → `depthParameterCompletion`
- **Use @cliHide** - Hide completion methods from CLI help
- **Context passing works** - Completion methods receive all previous args
- **Inheritance is automatic** - `Web4TSComponentCLI extends DefaultCLI` = all methods inherited
- **Multi-parameter support** - 1st, 2nd, 3rd, nth parameters all work
- **Chaining is seamless** - After last parameter, methods complete again

**This is what CMM4 looks like. This is simplexity. This is Web4.** 🎯

**Related Topics:**
- [TSDoc Annotations](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/02-development-guide.md#-tsdoc-magic-the-3-lines-that-make-it-work) | [chapters/02-development-guide.md](chapters/02-development-guide.md#-tsdoc-magic-the-3-lines-that-make-it-work) - How to make methods discoverable
- [Method Chaining](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-10-UTC-0124/components/Web4TSComponent/0.3.11.1/spec/chapters/04-compliance-and-standards.md#-web4-compliance-principles) | [chapters/04-compliance-and-standards.md](chapters/04-compliance-and-standards.md#-web4-compliance-principles) - Web4 compliance requirement

---
### 3.2 Completion Flow Specification

#### 3.2.1 Method Completion (Initial Command)
```bash
web4tscomponent tr<Tab>
# Output: tree

web4tscomponent <Tab><Tab>
# Output: ALL methods from CLI + Component classes
# build, clean, create, links, on, tree, upgrade, verify, version...
```

**What happens:**
- Bash calls TSCompletion with: `['Web4TSComponentCLI,DefaultWeb4TSComponent', 'tr']`
- TSCompletion.getClassMethods() scans BOTH classes + inheritance chain
- Returns all methods starting with 'tr'

#### 3.2.2 First Parameter Completion
```bash
web4tscomponent on <Tab><Tab>
# Output: ALL components in your project
# Build  DefaultCLI  Unit  Web4TSComponent  ...

web4tscomponent tree <Tab>
# Output: (completion callback for depth parameter)
```

**What happens:**
- Bash calls TSCompletion with: `['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', '']`
- TSCompletion checks if method 'on' exists
- Gets first parameter name: 'component'
- Checks if `componentParameterCompletion` method exists
- Returns: `__CALLBACK__:componentParameterCompletion`
- Bash calls: `web4tscomponent completeParameter componentParameterCompletion on`
- Completion method lists all directories in components/

#### 3.2.3 Second Parameter Completion
```bash
web4tscomponent on Unit <Tab><Tab>
# Output: ALL versions for Unit component
# latest  prod  test  dev  0.3.2.0  0.3.0.6  0.3.0.5  ...
```

**What happens:**
- Bash calls TSCompletion with: `['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', '']`
- TSCompletion: args.length=4, so we're completing 2nd parameter
- paramIndex = 1 (0-based), method has 2 params: ['component', 'version']
- Gets second parameter name: 'version'
- Checks if `versionParameterCompletion` method exists
- Returns: `__CALLBACK__:versionParameterCompletion`
- Bash calls: `web4tscomponent completeParameter versionParameterCompletion on Unit`
- Completion method receives context `['on', 'Unit']`, extracts component from args[1]
- Lists all versions for that specific component

#### 3.2.4 Chained Method Completion
```bash
web4tscomponent on Unit 0.3.2.0 <Tab><Tab>
# Output: ALL methods again (chaining!)
# build, clean, tree, verify, ...

web4tscomponent on Unit 0.3.2.0 tre<Tab>
# Output: tree
```

**What happens:**
- Bash calls TSCompletion with: `['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', '0.3.2.0', 'tre']`
- TSCompletion: args.length=5, method 'on' has 2 params
- paramIndex = 2, which is >= params.length (all params provided!)
- Switches to chained method completion
- Returns all methods starting with 'tre'

### 3.4 Three-Layer Architecture

#### 3.4.1 Layer 1: Bash Completion Interface
```bash
# Injected by source.env when you load the environment
_web4_tscompletion() {
    local component="Web4TSComponent" cli="web4tscomponent"
    local cur="${COMP_WORDS[COMP_CWORD]}" args=("${COMP_WORDS[@]:1}")
    
    # Inject class names for TSCompletion to scan
    local className="${component}CLI,Default${component}"
    # Result: Web4TSComponentCLI,DefaultWeb4TSComponent
    
    # Call TypeScript for intelligent completion
    out=$(node --input-type=module -e "import('$tsc').then(m => 
        m.TSCompletion.start())" -- "$className" "${args[@]}")
    
    # Check if TSCompletion returned a callback
    if [[ "$out" == __CALLBACK__:* ]]; then
        local callback="${out#__CALLBACK__:}"
        # Execute the completion method with full context
        out=$($cli completeParameter "$callback" "${args[@]}")
    fi
    
    # Return results to bash
    COMPREPLY=($(compgen -W "$out" -- "$cur"))
}

# Register completion
complete -F _web4_tscompletion web4tscomponent
```

**Key Innovation:**
- `className="${component}CLI,Default${component}"` (NOT hardcoded with DefaultCLI!)
- TSCompletion automatically discovers inheritance: `Web4TSComponentCLI extends DefaultCLI`
- Context passing: `"${args[@]}"` passes ALL args to completion methods

#### 3.3.2 Layer 2: TSCompletion (TypeScript AST Parser)
```typescript
// src/ts/layer4/TSCompletion.ts

static getClassMethods(className: string): string[] {
  // Support comma-separated: "Web4TSComponentCLI,DefaultWeb4TSComponent"
  if (className.includes(',')) {
    const classes = className.split(',');
    const allMethods = new Set<string>();
    classes.forEach(cls => {
      const methods = this.getClassMethods(cls.trim());
      methods.forEach(m => allMethods.add(m));
    });
    return Array.from(allMethods);
  }
  
  // Single class: Discover inheritance chain automatically!
  const files = TSCompletion.getProjectSourceFiles(); // Scans layer1-5
  const allMethods = new Set<string>();
  let baseClassName: string | null = null;
  
  for (const file of files) {
    const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    
    ts.forEachChild(sourceFile, node => {
      if (ts.isClassDeclaration(node) && node.name?.text === className) {
        // Get methods from this class
        node.members
          .filter(m => ts.isMethodDeclaration(m))
          .forEach(m => allMethods.add((m.name as ts.Identifier).text));
        
        // 🎯 THE MAGIC: Parse extends clause!
        if (node.heritageClauses) {
          for (const clause of node.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
              const extendsType = clause.types[0];
              baseClassName = extendsType.expression.text; // "DefaultCLI"
            }
          }
        }
      }
    });
  }
  
  // Recursively get base class methods
  if (baseClassName) {
    const baseMethods = this.getClassMethods(baseClassName);
    baseMethods.forEach(m => allMethods.add(m));
  }
  
  return Array.from(allMethods);
}

complete(args: string[]): string[] {
  // 2 args: [className, methodPrefix] → complete method names
  if (args.length === 2) {
    const methods = TSCompletion.getClassMethods(args[0]);
    return methods.filter(m => m.startsWith(args[1]));
  }
  
  // 3 args: [className, method, param1] → complete 1st parameter
  if (args.length === 3) {
    const params = TSCompletion.getMethodParameters(args[0], args[1]);
    if (params.length > 0) {
      const completionMethod = `${params[0]}ParameterCompletion`;
      const methods = TSCompletion.getClassMethods(args[0]);
      if (methods.includes(completionMethod)) {
        return [`__CALLBACK__:${params[0]}ParameterCompletion`];
      }
    }
    return params; // Return parameter names if no completion method
  }
  
  // 4+ args: [className, method, param1, param2, ...] → complete 2nd+ parameter OR chain
  if (args.length >= 4) {
    const [className, methodName, ...providedParams] = args;
    const paramIndex = providedParams.length - 1;
    
    const params = TSCompletion.getMethodParameters(className, methodName);
    
    if (paramIndex < params.length) {
      // Still completing parameters
      const completionMethod = `${params[paramIndex]}ParameterCompletion`;
      const methods = TSCompletion.getClassMethods(className);
      if (methods.includes(completionMethod)) {
        return [`__CALLBACK__:${params[paramIndex]}ParameterCompletion`];
      }
      return [];
    } else {
      // All params done → complete chained method
      const currentWord = providedParams[providedParams.length - 1];
      const methods = TSCompletion.getClassMethods(className);
      return methods.filter(m => m.startsWith(currentWord));
    }
  }
  
  return [];
}
```

**Key Innovation:**
- Parses `extends` clause from AST using `ts.SyntaxKind.ExtendsKeyword`
- Recursively merges methods from entire inheritance chain
- Supports multi-parameter completion (2nd, 3rd, nth parameter)
- Seamlessly switches from parameter completion to method chaining

#### 3.3.3 Layer 3: Completion Methods Implementation
```typescript
// src/ts/layer2/DefaultCLI.ts - Common completions for ALL components

/**
 * Tab completion for component parameter of 'on' command
 * @cliHide
 */
async componentParameterCompletion(currentArgs: string[]): Promise<string[]> {
  // Find project root
  let projectRoot = process.cwd();
  while (!existsSync(join(projectRoot, 'components'))) {
    const parent = join(projectRoot, '..');
    if (parent === projectRoot) break;
    projectRoot = parent;
  }
  
  // List all component directories
  const componentsDir = join(projectRoot, 'components');
  const entries = readdirSync(componentsDir);
  const components: string[] = [];
  
  for (const entry of entries) {
    const stats = lstatSync(join(componentsDir, entry));
    if (stats.isDirectory()) {
      components.push(entry);
    }
  }
  
  return components.sort();
}

/**
 * Tab completion for version parameter of 'on' command
 * @cliHide
 */
async versionParameterCompletion(currentArgs: string[]): Promise<string[]> {
  // 🎯 THE MAGIC: Extract component from context!
  // currentArgs: ['on', 'Unit', ...] (passed from bash)
  const componentName = currentArgs[1];
  
  if (!componentName) {
    return ['latest', 'dev', 'test', 'prod'];
  }
  
  // Find project root (same as above)
  let projectRoot = process.cwd();
  while (!existsSync(join(projectRoot, 'components'))) {
    const parent = join(projectRoot, '..');
    if (parent === projectRoot) break;
    projectRoot = parent;
  }
  
  // List versions for this specific component
  const componentDir = join(projectRoot, 'components', componentName);
  const entries = readdirSync(componentDir);
  const versions: string[] = ['latest', 'dev', 'test', 'prod'];
  
  for (const entry of entries) {
    if (entry.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      versions.push(entry);
    }
  }
  
  // Sort: semantic links first, then versions descending
  return versions.sort((a, b) => {
    const semanticOrder = ['latest', 'prod', 'test', 'dev'];
    const aIdx = semanticOrder.indexOf(a);
    const bIdx = semanticOrder.indexOf(b);
    
    if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
    if (aIdx >= 0) return -1;
    if (bIdx >= 0) return 1;
    
    return b.localeCompare(a, undefined, { numeric: true });
  });
}
```

**Key Innovation:**
- Methods defined in **DefaultCLI** are inherited by all component CLIs
- Context args passed from bash: `['on', 'Unit']`
- Extract component from `currentArgs[1]` to provide context-aware completions
- Location-resilient: finds project root automatically

### 🎯 Adding Your Own Completions

#### **For Common Parameters (All Components):**
Add to `DefaultCLI.ts`:
```typescript
/**
 * Tab completion for format parameter
 * @cliHide
 */
async formatParameterCompletion(currentArgs: string[]): Promise<string[]> {
  return ['json', 'yaml', 'table', 'tree'];
}
```

#### **For Component-Specific Parameters:**
Add to `YourComponentCLI.ts`:
```typescript
/**
 * Tab completion for action parameter of 'links' command
 * @cliHide
 */
async actionParameterCompletion(currentArgs: string[]): Promise<string[]> {
  return ['fix', 'verify', 'list'];
}
```

**Naming Convention (CRITICAL):**
- Parameter name: `depth` → Completion method: `depthParameterCompletion`
- Parameter name: `component` → Completion method: `componentParameterCompletion`
- Parameter name: `myCustomParam` → Completion method: `myCustomParamParameterCompletion`


