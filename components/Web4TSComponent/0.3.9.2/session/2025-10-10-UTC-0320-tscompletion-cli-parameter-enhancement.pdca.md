<!--
SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
Copyright (c) 2025 Cerulean Circle GmbH
Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
Backlinks: /LICENSE, /AI-GPL.md
-->

# 📋 **PDCA Cycle: TSCompletion Integration for CLI Parameter Auto-Discovery**

**🗓️ Date:** 2025-10-10-UTC-0320  
**🎯 Objective:** Leverage TSCompletion system for CLI parameter specification and tab completion enhancement  
**🎯 Template Version:** 3.2.4.2  

**👤 Agent Name:** Claude (Sonnet 4.5) → Pair Programming Assistant  
**👤 Agent Role:** Developer → CLI Architecture Research & Enhancement  
**👤 Branch:** dev/0350 → TSCompletion Integration  
**🔗 Sync:** In Sync  
**🔗 Project Journal:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0350/scrum.pmo/project.journal) | [§/scrum.pmo/project.journal](../../../../../scrum.pmo/project.journal)  
**🔗 Sprint:** Current Development Sprint  
**🔗 Task:** CLI Parameter Enhancement via TSCompletion  
**🚨 Issues:** None  
**🔗 Previous Commit:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/commit/bc39c8c3) | [§](.)  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/components/Web4TSComponent/0.3.9.1/session/2025-10-10-UTC-0310-cli-optional-parameter-specification.pdca.md) | [§/components/Web4TSComponent/0.3.9.1/session/2025-10-10-UTC-0310-cli-optional-parameter-specification.pdca.md](./2025-10-10-UTC-0310-cli-optional-parameter-specification.pdca.md)

**CMM Badge:** 🎖️ CMM4 (Architecture Research & Integration)  
**Badge Type:** Technical Research Excellence  
**Badge Earned:** 2025-10-10-UTC-0320  

---

## **📊 SUMMARY**

### **Artifact Links**
- **TSCompletion:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/components/Web4TSComponent/0.3.9.1/src/ts/layer4/TSCompletion.ts) | [§/components/Web4TSComponent/0.3.9.1/src/ts/layer4/TSCompletion.ts](../../src/ts/layer4/TSCompletion.ts)
- **DefaultCLI:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/components/Web4TSComponent/0.3.9.1/src/ts/layer2/DefaultCLI.ts) | [§/components/Web4TSComponent/0.3.9.1/src/ts/layer2/DefaultCLI.ts](../../src/ts/layer2/DefaultCLI.ts)
- **TSRanger obash:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/components/TSRanger/v1.0/src/sh/obash) | [§/components/TSRanger/v1.0/src/sh/obash](../../../../TSRanger/v1.0/src/sh/obash)
- **Completion Interface:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/components/Web4TSComponent/0.3.9.1/src/ts/layer3/Completion.ts) | [§/components/Web4TSComponent/0.3.9.1/src/ts/layer3/Completion.ts](../../src/ts/layer3/Completion.ts)

### **QA Decisions Required**
None - This is research and analysis to inform the parameter specification PDCA.

### **TRON Feedback (2025-10-10-UTC-0320)**
```quote
start researching bout the tssh component in the project, that is triggered in the shell on pressing [Tab] in the cli that originally invented the TSCompletion that we use for CLI autodiscover.

get yourself a whitebox understanding and check how you chan leverage it on our CLI upgrade.
prite a seperate pdca about this and reference the othe hevily with dual links.
```

---

## **📋 PLAN**

### **Research Objectives**

1. **Whitebox Understanding:** Understand TSCompletion architecture end-to-end
2. **Shell Integration:** How bash tab completion triggers TSCompletion
3. **Parameter Discovery:** How TSCompletion extracts method parameters from TypeScript AST
4. **Leveraging Opportunity:** How to apply TSCompletion intelligence to our CLI parameter problem

### **TSCompletion System Overview**

**Origin:** Created for `tssh` (TypeScript Shell) component in TSRanger project  
**Purpose:** Zero-config bash tab completion via TypeScript AST parsing  
**Architecture:** Shell → Bash Completion Function → TSCompletion.ts → TypeScript AST → Completions

### **Key Code Locations**

1. **TSCompletion Backend:** `TSCompletion.ts` (Layer 4)
   - Parses TypeScript AST
   - Extracts classes, methods, parameters
   - Returns completion suggestions

2. **Shell Integration:** `obash` script
   - Sets up bash completion functions
   - Triggers TSCompletion on Tab press

3. **Completion Interface:** `Completion.ts` (Layer 3)
   - Defines `complete(args: string[]): string[]` contract

---

## **🔧 DO**

### **Step 1: TSCompletion Architecture Analysis**

**File:** [TSCompletion.ts Lines 1-543](../../src/ts/layer4/TSCompletion.ts)

**Core Capability: TypeScript AST Parsing**

```typescript
// Line 66-79: Extract all classes from TypeScript source
static getClasses(): string[] {
  const files = TSCompletion.getProjectSourceFiles();
  const classNames: Set<string> = new Set();
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    ts.forEachChild(sourceFile, node => {
      if (ts.isClassDeclaration(node) && node.name) {
        classNames.add(node.name.text);
      }
    });
  }
  return Array.from(classNames);
}
```

**Key Insight:** TSCompletion uses TypeScript Compiler API to parse source files - same AST available for parameter extraction!

**Method Parameter Extraction:**

```typescript
// Line 99-175: Extract method parameters with default values
static getMethodParameters(className: string, methodName: string, paramName?: string): any[] {
  // ... (parses TypeScript AST)
  let params: string[] = [];
  let defaultValues: Record<string, string> = {};
  
  // Extracts:
  // 1. Parameter names
  // 2. Default values (from initializer expressions)
  // 3. Parameter documentation from JSDoc @param tags
  
  return params;
}
```

**🎯 CRITICAL DISCOVERY:** TSCompletion ALREADY extracts default values from TypeScript signatures!

**Enhanced Parameter Extraction (Lines 333-371):**

```typescript
static getEnhancedMethodParameters(className: string, methodName: string): any[] {
  // ✅ NEW: Enhanced parameter extraction with union type support
  for (let i = 0; i < m.parameters.length; i++) {
    const param = m.parameters[i];
    const paramName = param.name.getText();
    const paramType = param.type ? param.type.getText() : 'any';
    
    parameterInfo.push({
      name: paramName,
      type: paramType,
      required: !param.questionToken, // Optional if has ? token
      description: description || `${paramName} parameter`,
      isUnionType: TSCompletion.isUnionType(paramType),
      unionTypes: TSCompletion.extractUnionTypes(paramType)
    });
  }
  
  return parameterInfo;
}
```

**🎯 GOLDEN NUGGET:** 
- Line 357: `required: !param.questionToken` - detects optional parameters via `?` token!
- This is EXACTLY what we need for `<parameter>` vs `<?parameter>` notation!

### **Step 2: CLI Annotation Parsing**

**File:** [TSCompletion.ts Lines 394-522](../../src/ts/layer4/TSCompletion.ts)

**Zero-Config Annotation Extraction:**

```typescript
// Line 397-417: Extract CLI annotations from JSDoc
static extractCliAnnotations(className: string, methodName: string, paramName?: string): any {
  const files = TSCompletion.getAllTypeScriptFiles();
  
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true);
    
    const result = TSCompletion.searchClassForAnnotations(sourceFile, className, methodName, paramName);
    if (result) {
      return result;
    }
  }
  
  return {};
}
```

**Annotation Parsing Logic:**

```typescript
// Line 504-512: Parse CLI annotations from JSDoc text
private static parseCliAnnotations(jsDocText: string): any {
  return {
    hide: jsDocText.includes('@cliHide'),
    syntax: TSCompletion.extractAnnotationValue(jsDocText, 'cliSyntax'),  // 🎯 HERE!
    optional: jsDocText.includes('@cliOptional'),
    group: TSCompletion.extractAnnotationValue(jsDocText, 'cliGroup'),
    alias: TSCompletion.extractAnnotationValue(jsDocText, 'cliAlias'),
    default: TSCompletion.extractAnnotationValue(jsDocText, 'cliDefault')   // 🎯 AND HERE!
  };
}
```

**🎯 REVELATION:** TSCompletion ALREADY parses `@cliSyntax` and `@cliDefault` annotations!

### **Step 3: Shell Integration (Tab Completion)**

**File:** [obash Lines 43-55](../../../../TSRanger/v1.0/src/sh/obash)

**Bash Completion Function:**

```bash
# Line 43-54: Robust tssh completion using TSCompletion backend
_tssh_completion() {
  local cur
  cur="${COMP_WORDS[COMP_CWORD]}"
  # Pass all words except the command itself to the backend
  local args=("${COMP_WORDS[@]:1}")
  local out
  out=$(NODE_NO_WARNINGS=1 node --loader ts-node/esm "$PROJECT_ROOT/src/ts/layer4/TSCompletion.ts" "${args[@]}" 2>/dev/null || true)
  COMPREPLY=( $(compgen -W "$out" -- "$cur") )
  # Allow default completion fallback when backend returns nothing
  compopt -o default 2>/dev/null || true
}
complete -F _tssh_completion tssh
```

**Flow:**
1. User types: `tssh ClassName methodName <Tab>`
2. Bash calls `_tssh_completion` function
3. Function extracts `args = ["ClassName", "methodName"]`
4. Calls `TSCompletion.ts` with args
5. TSCompletion returns method parameters
6. Bash shows completions

**🎯 KEY INSIGHT:** TSCompletion is invoked EXTERNALLY by bash, NOT from within TypeScript!

### **Step 4: Completion Logic (Args → Suggestions)**

**File:** [TSCompletion.ts Lines 244-327](../../src/ts/layer4/TSCompletion.ts)

**Argument Parsing State Machine:**

```typescript
// Line 244-327: complete() method - the brain of tab completion
complete(args: string[]): string[] {
  // args.length === 0 or 1: Complete class names
  if (args.length === 0) {
    return TSCompletion.getClasses();
  }
  
  // args.length === 1: Complete to methods if class found
  if (args.length === 1) {
    const prefix = args[0];
    const classes = TSCompletion.getClasses();
    if (classes.includes(prefix)) {
      return TSCompletion.getClassMethods(prefix);  // Complete methods!
    }
    // ... else complete class names matching prefix
  }
  
  // args.length === 2: Complete method parameters
  if (args.length === 2) {
    const [className, methodPrefix] = args;
    const methods = TSCompletion.getClassMethods(className);
    const subMethods = methods.filter(m => m.startsWith(methodPrefix));
    
    if (subMethods.length === 1 && subMethods[0] === methodPrefix) {
      return TSCompletion.getMethodParameters(className, methodPrefix);  // Complete parameters!
    }
    // ... else complete method names
  }
  
  // args.length === 3: Complete parameter values (from defaults)
  if (args.length === 3) {
    const [className, methodPrefix, subMethodOrParam] = args;
    const values = TSCompletion.getMethodParameters(className, methodPrefix, subMethodOrParam);
    if (values.length > 0) {
      return values;  // Return default value for parameter!
    }
  }
  
  return [];
}
```

**🎯 BRILLIANT:** TSCompletion's `complete()` already implements positional parameter completion!

---

## **✅ CHECK**

### **TSCompletion Capabilities vs Our CLI Needs**

**What TSCompletion CAN Do:**

| Capability | TSCompletion | Our CLI Need | Leverage? |
|------------|--------------|--------------|-----------|
| Extract class names | ✅ Yes | ✅ Need | ✅ Already using |
| Extract method names | ✅ Yes | ✅ Need | ✅ Already using |
| Extract parameter names | ✅ Yes | ✅ Need | ✅ Can use |
| Detect optional parameters (`?`) | ✅ Yes (Line 357) | ✅ Need | ✅ **GOLDEN!** |
| Extract default values | ✅ Yes (Line 102, 141) | ✅ Need | ✅ **GOLDEN!** |
| Parse `@cliSyntax` | ✅ Yes (Line 507) | ✅ Need | ✅ **GOLDEN!** |
| Parse `@cliDefault` | ✅ Yes (Line 511) | ✅ Need | ✅ **GOLDEN!** |
| Parse union types | ✅ Yes (Lines 377-391) | ⚪ Nice-to-have | ✅ Bonus! |
| Parse JSDoc `@param` | ✅ Yes (Lines 26-45) | ⚪ Nice-to-have | ✅ Bonus! |

**What TSCompletion CANNOT Do:**

| Need | TSCompletion | Solution |
|------|--------------|----------|
| Disambiguate parameter vs chained method | ❌ No | Need explicit `@cliSyntax` |
| Support `<parameter:defaultValue>` notation | ❌ No (only parses, doesn't apply) | Enhance `parseCliSyntax()` |
| Run-time parameter validation | ❌ No (completion only) | Add to DefaultCLI |

### **Integration Strategy**

**Current Architecture:**
```
CLI Invocation → DefaultCLI.ts → Method Execution
                     ↓
              (No TSCompletion)
```

**TSCompletion Architecture:**
```
Bash Tab → TSCompletion.ts → TypeScript AST → Completions
```

**🎯 INSIGHT:** TSCompletion and DefaultCLI are PARALLEL systems, not integrated!

**Opportunity:**
```
CLI Invocation → DefaultCLI.ts → TSCompletion (for metadata) → Method Execution
                                        ↓
                                  • Parameter specs
                                  • Optional detection
                                  • Default values
```

### **Concrete Leveraging Points**

**1. Use `getEnhancedMethodParameters()` in DefaultCLI:**

```typescript
// In DefaultCLI.ts - when parsing method invocation
const parameterInfo = TSCompletion.getEnhancedMethodParameters(className, methodName);

for (const param of parameterInfo) {
  console.log(`Parameter: ${param.name}`);
  console.log(`  Type: ${param.type}`);
  console.log(`  Required: ${param.required}`);  // ✅ From questionToken!
  console.log(`  Description: ${param.description}`);
}
```

**2. Use `extractCliAnnotations()` for @cliSyntax:**

```typescript
// In DefaultCLI.ts - enhance method metadata
const annotations = TSCompletion.extractCliAnnotations(className, methodName);

if (annotations.syntax) {
  // Parse: <?action> or <depth> <?file>
  const paramSpecs = parseCliSyntax(annotations.syntax);
  // Use specs to validate argument count and extract parameters
}
```

**3. Reuse Default Value Extraction:**

```typescript
// TSCompletion already extracts default values from:
// async method(param: string = 'default') { ... }
//                              ^^^^^^^^^^

const params = TSCompletion.getMethodParameters(className, methodName);
// params will include 'default' value!
```

---

## **🎯 ACT**

### **Recommended Integration Approach**

**Phase 1: Share TSCompletion Utilities (SAFE)**

Create `TSCompletionAdapter` in DefaultCLI:

```typescript
// New file: src/ts/layer2/TSCompletionAdapter.ts
import { TSCompletion } from '../layer4/TSCompletion.js';

export class TSCompletionAdapter {
  /**
   * Get parameter specifications for CLI parameter parsing
   */
  static getParameterSpecs(className: string, methodName: string): ParameterSpec[] {
    const params = TSCompletion.getEnhancedMethodParameters(className, methodName);
    
    return params.map(p => ({
      name: p.name,
      required: p.required,        // ✅ From questionToken
      type: p.type,
      description: p.description,
      unionTypes: p.unionTypes
    }));
  }
  
  /**
   * Get CLI syntax declaration from @cliSyntax annotation
   */
  static getCliSyntax(className: string, methodName: string): string | null {
    const annotations = TSCompletion.extractCliAnnotations(className, methodName);
    return annotations.syntax;
  }
  
  /**
   * Check if method should be hidden from CLI
   */
  static isCliHidden(className: string, methodName: string): boolean {
    const annotations = TSCompletion.extractCliAnnotations(className, methodName);
    return annotations.hide === true;
  }
}
```

**Phase 2: Enhance Parameter Parsing (MODERATE RISK)**

Use TSCompletion metadata to validate and parse arguments:

```typescript
// In DefaultCLI.ts - existing parseAndExecute() method
async function parseAndExecute(args: string[]) {
  const [className, methodName, ...methodArgs] = args;
  
  // ✅ NEW: Get parameter specs from TSCompletion
  const paramSpecs = TSCompletionAdapter.getParameterSpecs(className, methodName);
  
  // ✅ NEW: Get @cliSyntax if declared
  const cliSyntax = TSCompletionAdapter.getCliSyntax(className, methodName);
  
  if (cliSyntax) {
    // Use explicit syntax declaration
    const { parameters, remainingArgs } = parseWithSyntax(methodArgs, cliSyntax, paramSpecs);
    await invokeMethod(instance, methodName, parameters);
    // Chain remaining args as methods
    await chainMethods(instance, remainingArgs);
  } else {
    // Fallback: Use parameter count from specs
    const { parameters, remainingArgs } = parseByCount(methodArgs, paramSpecs);
    await invokeMethod(instance, methodName, parameters);
    await chainMethods(instance, remainingArgs);
  }
}
```

**Phase 3: Enhanced Error Messages (POLISH)**

Use TSCompletion metadata for helpful errors:

```typescript
// Instead of: "At least 1 arguments required"
// Say: "Method 'links' expects optional parameter 'action' (fix|<empty>)"

const paramSpecs = TSCompletionAdapter.getParameterSpecs(className, methodName);
const requiredCount = paramSpecs.filter(p => p.required).length;
const optionalCount = paramSpecs.length - requiredCount;

if (methodArgs.length < requiredCount) {
  const paramList = paramSpecs.map(p => 
    p.required ? `<${p.name}>` : `<?${p.name}>`
  ).join(' ');
  
  throw new Error(
    `Method '${methodName}' requires ${requiredCount} parameter(s), received ${methodArgs.length}.\n` +
    `Expected: ${methodName} ${paramList}`
  );
}
```

### **Notation Enhancement**

**Current Notation (from previous PDCA):**
- `<parameter>` - required
- `<?parameter>` - optional
- `<?parameter:default>` - optional with default

**TSCompletion-Enhanced Notation:**
```typescript
// Method signature:
async links(action: string = ''): Promise<this> { ... }

// TSCompletion extracts:
// - name: 'action'
// - required: true (no ? token)
// - default: '' (from initializer)

// @cliSyntax should be:
@cliSyntax <?action:''>

// Or simpler (TSCompletion infers default from signature):
@cliSyntax <?action>

// CLI displays as:
web4tscomponent links <?action>
```

### **Backward Compatibility**

**CRITICAL:** Must not break existing commands without `@cliSyntax`:

```typescript
// Fallback logic:
if (cliSyntax) {
  // New: Use explicit syntax
  parseWithSyntax(methodArgs, cliSyntax, paramSpecs);
} else {
  // Old: Count required parameters from signature
  const requiredCount = paramSpecs.filter(p => p.required).length;
  if (methodArgs.length < requiredCount) {
    throw new Error(`Missing required parameters`);
  }
  // Map args by position
  invokeMethod(instance, methodName, methodArgs.slice(0, paramSpecs.length));
}
```

---

## **💫 EMOTIONAL REFLECTION**

### **Discovery Excitement:**
TREMENDOUS - TSCompletion is a **hidden gem** in the codebase! It already:
- Parses TypeScript AST
- Extracts optional parameters (`?` token)
- Extracts default values
- Parses `@cliSyntax` annotations
- Supports union types
- Extracts JSDoc documentation

This is **99% of what we need** for the CLI parameter problem!

### **Architecture Appreciation:**
The TSCompletion system demonstrates **elegant zero-config design**:
- No configuration files
- Pure TypeScript AST parsing
- Bash completion "just works"
- CLI auto-discovery "just works"

### **Integration Insight:**
The key realization: TSCompletion and DefaultCLI are **parallel systems** that can be **unified**. Both need the same metadata (parameters, types, defaults), but currently extract it separately.

**Unified Vision:**
```
TypeScript Source → TSCompletion (AST Parser) → Metadata
                                                    ↓
                        ┌───────────────────────────┴────────────────────────┐
                        ↓                                                    ↓
                 Bash Tab Completion                                DefaultCLI Runtime
                 (suggest parameters)                            (validate & execute)
```

---

## **🎯 PDCA PROCESS UPDATE**

**Process Learning:**
- ✅ **TSCompletion Goldmine:** Existing component contains 90% of needed CLI enhancement functionality
- ✅ **AST Parsing Power:** TypeScript Compiler API provides rich metadata (optional params, defaults, types, JSDoc)
- ✅ **Zero-Config Pattern:** TSCompletion demonstrates Web4 principle: "Convention over configuration"
- ✅ **Reuse Over Rewrite:** Leverage existing, battle-tested code rather than reimplementing
- ✅ **Unified Metadata:** Single source of truth (TypeScript AST) for both completion and execution

**Quality Impact:**
By leveraging TSCompletion, we gain:
1. **Robustness:** TSCompletion is already used and tested in TSRanger
2. **Consistency:** Same metadata for tab completion and runtime validation
3. **Maintainability:** Single place to enhance parameter parsing logic
4. **Web4 Alignment:** Zero-config, convention-driven architecture

**Next Actions:**
1. Review both PDCAs together with dual link cross-references
2. Decide on integration approach (Phase 1/2/3)
3. Start with Phase 1 (TSCompletionAdapter) - SAFE
4. Test integration with `links <?action>` example
5. Extend to all methods with optional parameters

---

**🔗 Related PDCAs:**
- **Parameter Specification PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/components/Web4TSComponent/0.3.9.1/session/2025-10-10-UTC-0310-cli-optional-parameter-specification.pdca.md) | [§/components/Web4TSComponent/0.3.9.1/session/2025-10-10-UTC-0310-cli-optional-parameter-specification.pdca.md](./2025-10-10-UTC-0310-cli-optional-parameter-specification.pdca.md) - Defines the parameter notation problem
- **TSRanger Sprint Task:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0350/scrum.pmo/sprints/sprint-1/task-1.3-developer-tssh-completion.md) | [§/scrum.pmo/sprints/sprint-1/task-1.3-developer-tssh-completion.md](../../../../../scrum.pmo/sprints/sprint-1/task-1.3-developer-tssh-completion.md) - Original TSCompletion implementation

**📝 Status:** Research Complete - Ready for Integration Planning

