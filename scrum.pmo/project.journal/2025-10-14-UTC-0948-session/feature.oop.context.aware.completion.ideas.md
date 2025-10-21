# Feature: OOP Context-Aware Completion - Design Philosophy

**Created:** 2025-10-21 UTC  
**Context:** CLI parsing revealed deeper architectural deterioration  
**Related:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.cli.parsing.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.cli.parsing.md](feature.cli.parsing.md)

---

## 🚨 The Deterioration Problem

### What Was Originally Designed

**TypeScript OOP with Native Features:**
```typescript
class Web4TSComponent {
  async setCICDVersion(
    targetVersion: string,
    version: string = 'current'  // ← TypeScript native default
  ): Promise<this> {
    // METHOD IS CONTEXT-AWARE
    const context = this.getComponentContext();
    
    // Knows where it is, what component it's operating on
    // Uses 'current' intelligently based on loaded context
    // Can resolve 'latest' by reading actual symlinks in THIS component
  }
}
```

**Key OOP Principles:**
1. **Context Awareness:** Method knows `this.context` (which component is loaded)
2. **State Management:** Maintains component state across method calls
3. **Native Defaults:** TypeScript `= 'current'` is the single source of truth
4. **Semantic Intelligence:** 'current' means "the version in current context"
5. **Chaining:** Methods return `this` for fluent API pattern

### What Agents Introduced (DETERIORATION)

**Functional Shitty Annotations:**
```typescript
/**
 * @cliDefault version current    // ← WTF? TypeScript already has = 'current'!
 * @cliValues targetVersion dev latest prod test  // ← Why not enum type?
 * @cliSyntax targetVersion version  // ← TypeScript signature already defines this!
 */
async setCICDVersion(
  targetVersion: string,  // ← Should be enum or union type!
  version: string = 'current'
): Promise<this>
```

**What's Wrong:**
1. **Duplication:** `@cliDefault version current` duplicates TypeScript's `= 'current'`
2. **Loss of Type Safety:** `string` instead of `'dev' | 'latest' | 'prod' | 'test'`
3. **Context Blindness:** Annotations are stateless metadata, not context-aware code
4. **No Single Source of Truth:** Now have to maintain TWO places (TS signature + JSDoc)
5. **Functional Mindset:** Treating method as stateless function instead of OOP operation

---

## 🎯 The Real OOP Design

### Context-Aware Parameter Resolution

**Principle:** Parameters should resolve DIFFERENTLY based on component context!

```typescript
class Web4TSComponent {
  private context: {
    component: string;
    version: string;
    path: string;
  } | null = null;

  async setCICDVersion(
    targetVersion: 'dev' | 'latest' | 'prod' | 'test',  // ← Union type, not string!
    version: string = 'current'  // ← Native TS default
  ): Promise<this> {
    // CONTEXT-AWARE RESOLUTION
    const actualVersion = this.resolveVersion(version);
    
    // 'current' means DIFFERENT things in different contexts!
    // - With context: Uses context.version
    // - Without context: Uses cwd version
    // - In test: Uses test/data mock version
    
    return this;
  }
  
  private resolveVersion(semanticVersion: string): string {
    // CONTEXT-AWARE HELPER
    if (semanticVersion === 'current') {
      return this.context?.version || this.inferVersionFromCwd();
    }
    
    if (['dev', 'latest', 'prod', 'test'].includes(semanticVersion)) {
      const component = this.context?.component || this.inferComponentFromCwd();
      return this.resolveSymlink(component, semanticVersion);
    }
    
    return semanticVersion;  // Literal version number
  }
}
```

**Why This is Better:**
1. **TypeScript native types** (`'dev' | 'latest'` union) provide compile-time safety
2. **Single source of truth** (TS signature, no duplicate JSDoc)
3. **Context awareness** (method behavior adapts to component state)
4. **OOP encapsulation** (resolution logic inside the object, not scattered)

---

## 🏗️ TSCompletion Should Mirror OOP Intelligence

### Current Problem: Dumb Translation

```
TypeScript Signature → TSCompletion → Shell Syntax
       ↓                    ↓              ↓
   OOP Smart          Loses Context    Dumb Strings
```

**Example:**
```typescript
// TypeScript (SMART)
async setCICDVersion(
  targetVersion: 'dev' | 'latest' | 'prod' | 'test',
  version: string = 'current'
)

// Shell Translation (DUMB)
web4tscomponent setCICDVersion <targetVersion> <version>
                                ↑              ↑
                          Just strings!   What is 'current'?
```

**Lost Intelligence:**
- Union type `'dev' | 'latest' | 'prod' | 'test'` → generic `<targetVersion>`
- Default `= 'current'` meaning is lost (current WHAT? Current context version!)
- No awareness that 'latest' is a symlink that needs resolution

### OOP-Aware TSCompletion Design

```typescript
class TSCompletion {
  /**
   * Extract NATIVE TypeScript features, not duplicate them in JSDoc!
   */
  static getEnhancedMethodParameters(className: string, methodName: string): ParameterInfo[] {
    const params = this.parseMethodSignature(className, methodName);
    
    return params.map(param => ({
      name: param.name,
      type: param.type,  // ← Parse actual TS type!
      
      // NATIVE TS: Extract union types from signature
      unionTypes: this.extractUnionTypes(param.type),  
      // e.g., 'dev' | 'latest' | 'prod' | 'test'
      
      // NATIVE TS: Extract default from signature
      default: this.extractDefaultValue(param),
      // e.g., = 'current'
      
      // CONTEXT SEMANTICS: Understand what default MEANS
      defaultResolution: this.analyzeDefaultSemantics(param.default, className, methodName),
      // e.g., 'current' → 'Resolves to context.version if context exists, else cwd version'
      
      // NATIVE TS: Required = no default value
      required: !param.hasDefault,
      
      // OOP CONTEXT: Method's context requirements
      contextRequirements: this.analyzeContextDependencies(className, methodName),
      // e.g., { needsContext: false, canInferFromCwd: true }
    }));
  }
  
  /**
   * NEW: Extract union types from TypeScript AST
   */
  private static extractUnionTypes(typeNode: ts.TypeNode): string[] {
    if (ts.isUnionTypeNode(typeNode)) {
      return typeNode.types.map(t => {
        if (ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal)) {
          return t.literal.text;  // e.g., 'dev', 'latest', 'prod', 'test'
        }
        return this.getTypeText(t);
      });
    }
    return [this.getTypeText(typeNode)];
  }
  
  /**
   * NEW: Analyze what a default value MEANS in context
   */
  private static analyzeDefaultSemantics(
    defaultValue: string,
    className: string,
    methodName: string
  ): string {
    if (defaultValue === 'current') {
      // Check if method calls getComponentContext()
      const usesContext = this.methodUsesContext(className, methodName);
      if (usesContext) {
        return 'Resolves to loaded component context version, or infers from cwd';
      }
    }
    
    if (['dev', 'latest', 'prod', 'test'].includes(defaultValue)) {
      return `Resolves symlink '${defaultValue}' to actual version number`;
    }
    
    return `Literal value: ${defaultValue}`;
  }
  
  /**
   * NEW: Detect if method is context-aware
   */
  private static methodUsesContext(className: string, methodName: string): boolean {
    const methodBody = this.getMethodBody(className, methodName);
    
    // Look for patterns:
    // - this.getComponentContext()
    // - this.context
    // - this.resolveActualVersion()
    
    return methodBody.includes('getComponentContext()') ||
           methodBody.includes('this.context');
  }
}
```

---

## 💡 Context-Aware Completion Ideas

### Idea 1: Shell Completion Reflects OOP State

**Current (Dumb):**
```bash
$ web4tscomponent setCICDVersion <TAB>
dev  latest  prod  test
```

**OOP-Aware (Smart):**
```bash
# WITHOUT context loaded:
$ web4tscomponent setCICDVersion <TAB>
dev     → 0.3.13.1 (from Web4TSComponent/dev symlink)
latest  → 0.3.13.3 (from Web4TSComponent/latest symlink)
prod    → 0.3.13.0 (from Web4TSComponent/prod symlink)
test    → 0.3.13.2 (from Web4TSComponent/test symlink)

# WITH context loaded:
$ web4tscomponent on MyComponent 0.1.0.0 setCICDVersion <TAB>
dev     → 0.1.1.2 (from MyComponent/dev symlink)
latest  → 0.1.0.5 (from MyComponent/latest symlink)
prod    → 0.1.0.0 (from MyComponent/prod symlink)
test    → 0.1.1.1 (from MyComponent/test symlink)
```

**Implementation:**
```typescript
class DefaultCLI {
  // Completion method gets access to component instance!
  completeParameter(paramName: string, methodName: string, partialValue: string): string[] {
    const component = this.getOrCreateTSComponent();  // OOP instance!
    
    if (methodName === 'setCICDVersion' && paramName === 'targetVersion') {
      // Component knows its context!
      const targetComponent = component.context?.component || this.inferComponent();
      
      // Resolve semantic links to actual versions
      return ['dev', 'latest', 'prod', 'test'].map(link => {
        const version = component.resolveSymlink(targetComponent, link);
        return `${link}\t→ ${version}`;  // Tab completion with hint!
      });
    }
  }
}
```

### Idea 2: Context-Sensitive Default Values

**Problem:** `version: string = 'current'` is meaningless without context!

**Solution:** Default should KNOW its context
```typescript
class Web4TSComponent {
  async setCICDVersion(
    targetVersion: 'dev' | 'latest' | 'prod' | 'test',
    version: string = this.getDefaultVersion()  // ← Context-aware default!
  ): Promise<this> {
    // ...
  }
  
  private getDefaultVersion(): string {
    // Default is SMART, not static string!
    if (this.context) {
      return this.context.version;  // 'current' = loaded context
    }
    
    const cwdVersion = this.inferVersionFromCwd();
    if (cwdVersion) {
      return cwdVersion;  // 'current' = cwd inferred
    }
    
    return 'latest';  // Fallback
  }
}
```

**But Wait:** TypeScript doesn't allow method calls in default parameters!

**Real Solution:** Optional parameter + smart resolution
```typescript
async setCICDVersion(
  targetVersion: 'dev' | 'latest' | 'prod' | 'test',
  version?: string  // ← Optional, not default string
): Promise<this> {
  // Context-aware resolution at method start
  const resolvedVersion = version ?? this.getSmartDefault();
  
  // Now use resolvedVersion
}
```

### Idea 3: Type System Drives Completion

**Current (Functional):**
```typescript
/**
 * @cliValues targetVersion dev latest prod test  // ← Manual duplication!
 */
async setCICDVersion(targetVersion: string, ...)
```

**OOP-Aware (TypeScript Native):**
```typescript
// Define semantic types
type SemanticLink = 'dev' | 'latest' | 'prod' | 'test';
type SemanticVersion = 'current' | SemanticLink;
type VersionSpecifier = SemanticVersion | `${number}.${number}.${number}.${number}`;

async setCICDVersion(
  targetVersion: SemanticLink,  // ← Type IS the documentation!
  version?: VersionSpecifier     // ← All valid values encoded in type!
): Promise<this>
```

**TSCompletion automatically:**
1. Extracts `SemanticLink` union → ['dev', 'latest', 'prod', 'test']
2. Extracts `VersionSpecifier` union → ['current', 'dev', 'latest', 'prod', 'test', or version pattern]
3. NO manual `@cliValues` needed!
4. Single source of truth (TypeScript type system)

### Idea 4: Context Stack (Advanced OOP)

**Problem:** Simple boolean `context | null` loses richness

**Solution:** Context stack for nested operations
```typescript
interface ComponentContext {
  component: string;
  version: string;
  path: string;
  operation?: string;  // What are we doing?
  parent?: ComponentContext;  // Nested contexts
}

class Web4TSComponent {
  private contextStack: ComponentContext[] = [];
  
  async on(component: string, version: string): Promise<this> {
    // PUSH context
    const newContext: ComponentContext = {
      component,
      version: this.resolveActualVersion(component, version),
      path: this.resolveComponentPath(component, version),
      operation: 'on'
    };
    
    this.contextStack.push(newContext);
    return this;
  }
  
  async setCICDVersion(targetVersion: SemanticLink, version?: VersionSpecifier): Promise<this> {
    // ACCESS current context
    const currentContext = this.contextStack[this.contextStack.length - 1];
    
    if (!currentContext) {
      // Infer from cwd
      const inferred = this.inferContextFromCwd();
      this.contextStack.push(inferred);
    }
    
    const context = this.contextStack[this.contextStack.length - 1];
    
    // version defaults to current context's version
    const resolvedVersion = version ?? context.version;
    
    // ...
  }
  
  private popContext(): void {
    this.contextStack.pop();
  }
}
```

**Benefits:**
- **Nested operations:** `web4tscomponent on A 1.0 (on B 2.0 upgrade) tree`
- **Context inheritance:** Inner operation inherits outer context
- **Traceability:** Know the call stack of operations

### Idea 5: Smart Parameter Validation

**Current (Post-hoc checking):**
```typescript
async setCICDVersion(targetVersion: string, version: string = 'current'): Promise<this> {
  // Validate after the fact
  const validLinks = ['dev', 'latest', 'prod', 'test'];
  if (!validLinks.includes(targetVersion)) {
    throw new Error(`Invalid targetVersion`);
  }
}
```

**OOP-Aware (Pre-flight validation):**
```typescript
class ParameterValidator {
  static validateSemanticLink(value: string, context: ComponentContext | null): string {
    const validLinks: SemanticLink[] = ['dev', 'latest', 'prod', 'test'];
    
    if (!validLinks.includes(value as SemanticLink)) {
      throw new Error(`Invalid semantic link: ${value}. Valid: ${validLinks.join(', ')}`);
    }
    
    // Check if link exists in target component
    if (context) {
      const linkPath = path.join(this.resolveComponentDir(context.component), value);
      if (!existsSync(linkPath)) {
        throw new Error(`Semantic link '${value}' does not exist in ${context.component}`);
      }
    }
    
    return value;
  }
}

// Use in method signature (decorator pattern)
async setCICDVersion(
  @Validate(ParameterValidator.validateSemanticLink)
  targetVersion: SemanticLink,
  version?: VersionSpecifier
): Promise<this>
```

---

## 🧬 The TypeScript Native Pattern

### What TypeScript ALREADY Gives Us

```typescript
// 1. Union Types (enum-like values)
type SemanticLink = 'dev' | 'latest' | 'prod' | 'test';

// 2. Template Literal Types (pattern matching)
type Version = `${number}.${number}.${number}.${number}`;

// 3. Conditional Types (context-aware)
type VersionOrCurrent<T extends boolean> = 
  T extends true ? Version : 'current' | Version;

// 4. Method Overloading (different signatures for different contexts)
class Web4TSComponent {
  // Overload 1: With context, version defaults to context.version
  setCICDVersion(targetVersion: SemanticLink): Promise<this>;
  
  // Overload 2: Without context, version must be explicit
  setCICDVersion(targetVersion: SemanticLink, version: Version): Promise<this>;
  
  // Implementation
  async setCICDVersion(
    targetVersion: SemanticLink, 
    version?: Version
  ): Promise<this> {
    if (!version && !this.context) {
      throw new Error('version required when no context loaded');
    }
    
    const resolvedVersion = version ?? this.context!.version;
    // ...
  }
}
```

### TSCompletion Should Extract These

**Not:**
```typescript
/**
 * @cliValues targetVersion dev latest prod test  // ← Manual
 * @cliDefault version current                    // ← Duplicate
 */
```

**But:**
```typescript
// TSCompletion.ts
static extractParameterConstraints(param: ts.ParameterDeclaration): Constraints {
  return {
    // FROM TS TYPE: 'dev' | 'latest' | 'prod' | 'test'
    allowedValues: this.extractUnionLiterals(param.type),
    
    // FROM TS DEFAULT: = 'current'
    defaultValue: this.extractDefaultExpression(param.initializer),
    
    // FROM TS TYPE: string extends `${number}.${number}.${number}.${number}`
    pattern: this.extractTemplatePattern(param.type),
    
    // FROM TS OPTIONAL: version?: string
    required: !param.questionToken && !param.initializer
  };
}
```

---

## 🎯 Concrete Refactoring Plan

### Phase 1: Stop the Bleeding (Remove Duplication)

**Current:**
```typescript
/**
 * @cliDefault version current    // ← DELETE
 * @cliValues targetVersion dev latest prod test  // ← DELETE
 */
async setCICDVersion(
  targetVersion: string,
  version: string = 'current'
)
```

**After Phase 1:**
```typescript
async setCICDVersion(
  targetVersion: 'dev' | 'latest' | 'prod' | 'test',  // ← Type is documentation
  version: string = 'current'  // ← Single source of truth
)
```

**TSCompletion learns to read union types:**
```typescript
// In TSCompletion.ts
if (ts.isUnionTypeNode(param.type)) {
  const literals = param.type.types
    .filter(ts.isLiteralTypeNode)
    .map(t => t.literal.text);
  
  return literals;  // ['dev', 'latest', 'prod', 'test']
}
```

### Phase 2: Context-Aware Resolution

**Add OOP helper:**
```typescript
class Web4TSComponent {
  /**
   * Context-aware version resolution
   * SINGLE place for all semantic version logic
   */
  private resolveVersionParameter(version: string | undefined): string {
    // undefined → use context
    if (version === undefined) {
      return this.context?.version ?? this.inferVersionFromCwd();
    }
    
    // 'current' → use context
    if (version === 'current') {
      return this.context?.version ?? this.inferVersionFromCwd();
    }
    
    // Semantic link → resolve symlink
    if (['dev', 'latest', 'prod', 'test'].includes(version)) {
      const component = this.context?.component ?? this.inferComponentFromCwd();
      return this.resolveSymlink(component, version);
    }
    
    // Literal version → use as-is
    return version;
  }
}
```

**Use consistently:**
```typescript
async setCICDVersion(
  targetVersion: 'dev' | 'latest' | 'prod' | 'test',
  version?: string
): Promise<this> {
  const resolvedVersion = this.resolveVersionParameter(version);
  // ...
}

async on(component: string, version?: string): Promise<this> {
  const resolvedVersion = this.resolveVersionParameter(version);
  // ...
}

async upgrade(versionPromotion?: string): Promise<this> {
  // Already has context awareness!
  const currentVersion = this.context?.version ?? this.inferVersionFromCwd();
  // ...
}
```

### Phase 3: Shell Completion Context Awareness

**Enhance source.env completion function:**
```bash
_web4_tscompletion() {
  local cmd="${COMP_WORDS[0]}"
  local current="${COMP_WORDS[COMP_CWORD]}"
  local previous="${COMP_WORDS[COMP_CWORD-1]}"
  
  # NEW: Build context from previous commands
  local context_component=""
  local context_version=""
  
  # Scan COMP_WORDS for 'on Component Version' pattern
  for ((i=1; i<COMP_CWORD; i++)); do
    if [[ "${COMP_WORDS[i]}" == "on" ]] && ((i+2 < COMP_CWORD)); then
      context_component="${COMP_WORDS[i+1]}"
      context_version="${COMP_WORDS[i+2]}"
    fi
  done
  
  # Pass context to completion
  local completion_result
  if [[ -n "$context_component" ]]; then
    completion_result=$("$cmd" completeParameter \
      --context-component "$context_component" \
      --context-version "$context_version" \
      "$@")
  else
    completion_result=$("$cmd" completeParameter "$@")
  fi
  
  COMPREPLY=($(compgen -W "$completion_result" -- "$current"))
}
```

**CLI receives context:**
```typescript
class DefaultCLI {
  completeParameter(
    paramName: string,
    methodName: string,
    partialValue: string,
    contextComponent?: string,
    contextVersion?: string
  ): string[] {
    const component = this.getOrCreateTSComponent();
    
    // INJECT shell-level context into component
    if (contextComponent && contextVersion) {
      component.setContext({
        component: contextComponent,
        version: contextVersion,
        path: component.resolveComponentPath(contextComponent, contextVersion)
      });
    }
    
    // Now completion is CONTEXT-AWARE!
    if (methodName === 'setCICDVersion' && paramName === 'targetVersion') {
      const targetComponent = component.context?.component || component.inferComponentFromCwd();
      
      return ['dev', 'latest', 'prod', 'test'].map(link => {
        const actualVersion = component.resolveSymlink(targetComponent, link);
        return `${link}\t(→ ${actualVersion})`;
      });
    }
  }
}
```

---

## 📊 Before vs After Comparison

### Parameter Definition

| Aspect | Before (Functional) | After (OOP) |
|--------|---------------------|-------------|
| Type Definition | `targetVersion: string` | `targetVersion: 'dev' \| 'latest' \| 'prod' \| 'test'` |
| Allowed Values | `@cliValues targetVersion dev latest prod test` | Extracted from union type |
| Default Value | `@cliDefault version current` | Extracted from `= 'current'` |
| Validation | Manual `if (!validLinks.includes(...))` | TypeScript compile-time |
| Single Source | ❌ (TS + JSDoc) | ✅ (TS only) |
| Context Aware | ❌ (static string) | ✅ (resolves based on context) |

### Completion Behavior

| Scenario | Before | After |
|----------|--------|-------|
| No context | Shows generic `<targetVersion>` | Shows `dev → 0.3.13.1` with actual versions |
| With context | Same generic output | Shows versions from TARGET component |
| Wrong method name | `test` interpreted as method | `test` recognized as valid parameter value |
| Type safety | ❌ Runtime error only | ✅ TypeScript compile error |

### Code Maintenance

| Task | Before | After |
|------|--------|-------|
| Add new semantic link | Update @cliValues annotation | Add to union type (compile-time checked) |
| Change default | Update @cliDefault annotation | Update default parameter |
| Refactor method | Fix signature AND annotations | Fix signature only |
| Test parameter values | Mock strings | Use type system |

---

## 🎓 OOP Principles Restored

### Encapsulation
**Before:** Logic scattered between JSDoc, TSCompletion, CLI parser, method body  
**After:** Logic centralized in OOP method, TSCompletion reads native TS features

### Single Responsibility
**Before:** Method validates, TSCompletion validates, CLI validates  
**After:** TypeScript validates at compile time, method focuses on business logic

### DRY (Don't Repeat Yourself)
**Before:** Type info in 3 places (TS signature, @cliValues, validation code)  
**After:** Type info in 1 place (TS signature), everything else derives from it

### Context Awareness (MOST IMPORTANT!)
**Before:** Parameters are dumb strings, meaning determined post-hoc  
**After:** Parameters are smart objects, meaning determined by object state

---

## 🚀 Implementation Priority

### P0 (Critical - Stop Duplication)
1. Remove all `@cliDefault` annotations (use TS native defaults)
2. Convert string parameters to union types where applicable
3. Teach TSCompletion to extract union types

### P1 (High - Fix Bugs)
1. Fix method chaining vs parameter value conflict (feature.cli.parsing.md)
2. Ensure `@cliValues` extraction respects union types
3. Test all semantic links (dev, latest, prod, test)

### P2 (Medium - Add Intelligence)
1. Context-aware completion (show actual resolved versions)
2. Parameter validation using type system
3. Smart default resolution (`resolveVersionParameter`)

### P3 (Low - Advanced Features)
1. Context stack for nested operations
2. Shell completion with context injection
3. Method overloading for different context states

---

## 🔗 Related Documents

- **CLI Parsing Issue:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.cli.parsing.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.cli.parsing.md](feature.cli.parsing.md)
- **Completion Flow:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.completion.analysis.md) | [§/scrum.pmo/project.journal/2025-10-14-UTC-0948-session/feature.completion.analysis.md](feature.completion.analysis.md)
- **Component Spec:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0400/components/Web4TSComponent/0.3.13.2/README.md) | [§/components/Web4TSComponent/0.3.13.2/README.md](../../../../../components/Web4TSComponent/0.3.13.2/README.md)

---

**Never 2 1 (TO ONE). Always 4 2 (FOR TWO).** 🤝✨

