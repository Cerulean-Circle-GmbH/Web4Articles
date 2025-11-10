/**
 * DefaultCLI - Base CLI implementation with auto-discovery and common utilities
 * Web4 pattern: Abstract base class implementing CLI interface with static start
 * Purpose: Foundation CLI class with auto-discovery, common utilities and Web4 radical OOP patterns
 */

import { CLI } from "../layer3/CLI.interface.js";
import { CLIModel } from "../layer3/CLIModel.interface.js";
import { Scenario } from "../layer3/Scenario.interface.js";
import { MethodInfo } from "../layer3/MethodInfo.interface.js";
import { MethodSignature } from "../layer3/MethodSignature.interface.js";
import { Component } from "../layer3/Component.interface.js";
import { Colors } from "../layer3/Colors.interface.js";
import { User } from "../layer3/User.interface.js";
// @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Removed DefaultWeb4TSComponent import for true generic base class
import { TSCompletion } from "../layer4/TSCompletion.js";
import { DefaultColors } from "../layer4/DefaultColors.js";
import { execSync } from 'child_process';  // ← Add this for ESM compatibility
import {
  readFileSync,
  existsSync,
  readdirSync,
  writeFileSync,
  appendFileSync,
  lstatSync,
  readlinkSync,
  mkdirSync,
} from "fs";
import { join, basename } from "path";
import * as ts from "typescript";
import { webcrypto as crypto } from "crypto";

export abstract class DefaultCLI implements CLI, Component<CLIModel> {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model!: CLIModel; // Definite assignment - initialized in init()
  protected methodSignatures: Map<string, MethodSignature> = new Map();
  protected colors: Colors = DefaultColors.getInstance();
  
  // ✅ Instances belong HERE, not in model!
  // Models = DATA ONLY (serializable)
  // Instances = BEHAVIOR (belong in class)
  // @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Use Component interface with model property
  protected component?: Component;  // Own component instance
  protected context?: Component;    // Loaded via on() for delegation
  protected user?: User;            // User service instance


  /**
   * Static start method - Web4 radical OOP pattern
   * Entry point for all CLI operations
   */
  static async start(args: string[]): Promise<void> {
    const cli = new (this as any)();
    await cli.execute(args);
  }
  
  /**
   * Empty constructor (Web4 radical OOP pattern)
   * All initialization happens in init()
   * @pdca 2025-10-28-UTC-0934.pdca.md:597 - Phase 1: Init Pattern
   */
  constructor() {
    // Empty - initialization moved to init()
  }

  /**
   * Initialize CLI with Scenario (Web4 radical OOP pattern)
   * @pdca 2025-10-28-UTC-1822.phase1-2-completion.pdca.md - Phase 1: Inline createEmptyModel
   * @test test/ts/layer2/PhaseCompletion.test.ts:createEmptyModelDeleted
   * @test test/ts/layer2/DefaultCLI.test.ts:initWithEmptyScenario
   * @test test/ts/layer2/DefaultCLI.test.ts:initWithProvidedScenario
   */
  init(scenario?: Scenario<CLIModel>): this {
    if (!this.model) {
      // ✅ Path Authority: Calculate ALL paths ONCE and store in model
      // INHERITANCE: This runs for ALL CLIs (Web4TSComponent, TestIsolatedComponent, PDCA, Unit, etc.)
      // @pdca 2025-10-30-UTC-1011.pdca.md - Implementing Path Authority
      const projectRoot = this.calculateProjectRootInternal();
      
      this.model = {
        uuid: crypto.randomUUID(),
        name: "cli",
        origin: "system",
        definition: "CLI model",
        
        // ✅ Path Authority fields (calculated ONCE, inherited by ALL CLIs)
        projectRoot: projectRoot,
        componentsDir: join(projectRoot, 'components'),
        scriptsDir: join(projectRoot, 'scripts'),
        scriptsVersionDir: join(projectRoot, 'scripts', 'versions'),
        testDataDir: join(projectRoot, 'test', 'data'),
        
        // Completion context - initialized empty
        completionCliName: "",
        completionCompWords: [],
        completionCompCword: 0,
        // Derived fields
        completionCurrentWord: "",
        completionPreviousWord: "",
        completionCommand: null,
        completionParameters: [],
        completionParameterIndex: 0,
        // Chaining
        completionChainedCommands: [],
        // State flags
        completionIsCompletingMethod: false,
        completionIsCompletingParameter: false,
      };
    }
    
    if (scenario?.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    
    return this;
  }

  /**
   * Calculate project root - SINGLE SOURCE OF TRUTH for all path calculations
   * Detects test isolation (test/data) vs production
   * 
   * Priority Order:
   * 1. Test isolation detection (highest priority for test context)
   * 2. WEB4_PROJECT_ROOT environment variable
   * 3. Git repository root (git rev-parse --show-toplevel)
   * 4. Directory traversal (package.json with Web4 markers)
   * 5. Fallback: process.cwd()
   * 
   * CRITICAL: Test isolation check MUST be first to ensure tests
   * running from test/data/components/TestIsolatedComponent/0.1.0.0
   * correctly identify test/data as project root
   * 
   * @pdca 2025-10-30-UTC-1011.pdca.md - Path Authority implementation
   * @pdca 2025-10-28-UTC-0934.pdca.md:244-271 - Original design
   * @cliHide
   * @returns Absolute path to project root
   */
  private calculateProjectRootInternal(): string {
    const cwd = process.cwd();
    
    // 1. Check for test isolation FIRST (highest priority for test context)
    // CRITICAL: Works for both Web4TSComponent tests AND generated component tests
    // Example: /Users/.../Web4Articles/components/Web4TSComponent/0.3.17.1/test/data/components/TestIsolatedComponent/0.1.0.0
    // Result: /Users/.../Web4Articles/components/Web4TSComponent/0.3.17.1/test/data
    if (cwd.includes('/test/data')) {
      // Find test/data directory by walking up from cwd
      const parts = cwd.split('/');
      const testIndex = parts.indexOf('test');
      if (testIndex !== -1 && testIndex + 1 < parts.length && parts[testIndex + 1] === 'data') {
        // Return path UP TO AND INCLUDING test/data
        return parts.slice(0, testIndex + 2).join('/');
      }
    }
    
    // 2. Use git root (NOT environment variable - filesystem detection only)
    // @pdca 2025-11-03-UTC-1430.pdca.md - Removed process.env.WEB4_PROJECT_ROOT check
    // @pdca 2025-11-03-UTC-1828.pdca.md - Fixed ESM compatibility: use top-level import instead of require()
    try {
      const gitRoot = execSync('git rev-parse --show-toplevel', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']  // Suppress stderr
      }).trim();
      if (existsSync(gitRoot)) {
        return gitRoot;
      }
    } catch {
      // Git not available or not in git repo - continue to next method
    }
    
    // 4. Directory traversal looking for package.json with Web4 markers
    let current = cwd;
    const root = '/';
    
    while (current !== root) {
      const packageJsonPath = join(current, 'package.json');
      if (existsSync(packageJsonPath)) {
        try {
          const content = readFileSync(packageJsonPath, 'utf-8');
          const pkg = JSON.parse(content);
          
          // Check for Web4 markers
          if (pkg.name?.includes('web4') || 
              pkg.dependencies?.['@web4x/web4tscomponent'] ||
              existsSync(join(current, 'components'))) {
            return current;
          }
        } catch {
          // Invalid JSON, continue searching
        }
      }
      
      // Move up one directory
      const parent = join(current, '..');
      if (parent === current) break;  // Reached root
      current = parent;
    }
    
    // 5. Fallback: Use cwd
    return cwd;
  }

  /**
   * Load component context for delegation (universal across ALL components)
   * Works for Web4TSComponent, PDCA, Unit, TestIsolatedComponent - ANY generated component!
   * 
   * INHERITANCE: This method is inherited by ALL CLIs:
   * - Web4TSComponentCLI extends DefaultCLI → inherits on()
   * - TestIsolatedComponentCLI extends DefaultCLI → inherits on()
   * - PDCACLI extends DefaultCLI → inherits on()
   * 
   * @pdca 2025-10-30-UTC-1011.pdca.md - Moved from DefaultWeb4TSComponent to DefaultCLI
   * @pdca 2025-10-28-UTC-0934.pdca.md:3057 - Context INSTANCE pattern
   * 
   * @param component Component name to load
   * @param version Component version (default: 'latest')
   * 
   * @example web4tscomponent on PDCA 0.3.5.1 links
   * @example testisolatedcomponent on Unit 0.3.0.5 tree
   * @example pdca on Web4TSComponent 0.3.17.1 test
   * 
   * @cliSyntax component version
   * @cliDefault version latest
   */
  async on(component: string, version: string = 'latest'): Promise<this> {
    // ✅ Direct access to component (OOP pattern - Phase 3)
    // ✅ CLI calculates paths - Path Authority principle
    
    // Resolve 'latest' symlink to actual version
    let actualVersion = version;
    if (version === 'latest' || version === 'dev' || version === 'prod' || version === 'test') {
      const symlinkPath = join(this.model.componentsDir, component, version);
      if (existsSync(symlinkPath)) {
        const stats = lstatSync(symlinkPath);
        if (stats.isSymbolicLink()) {
          actualVersion = basename(readlinkSync(symlinkPath));
        }
      }
    }
    
    // ✅ CLI calculates ALL paths (Path Authority)
    const componentPath = join(this.model.componentsDir, component, actualVersion);
    
    if (!existsSync(componentPath)) {
      throw new Error(`Component not found: ${component} ${version} at ${componentPath}`);
    }
    
    // ✅ Dynamically load target component class (already initialized with componentPath)
    const targetComponent = await this.loadComponent(component, actualVersion, componentPath);
    
    // ✅ Store INSTANCE in CLI context (not component context!)
    this.context = targetComponent;
    
    // ✅ CRITICAL: Also set context in CLI's component so delegated commands work!
    // When commands like 'test itCase' are delegated to this.component, 
    // the component needs to know about the loaded context (targetComponent)
    (this.component!.model as any).context = targetComponent;
    
    if (actualVersion !== version) {
      console.log(`✅ Component context loaded: ${component} ${version} → ${actualVersion}`);
    } else {
      console.log(`✅ Component context loaded: ${component} ${actualVersion}`);
    }
    console.log(`   Path: ${componentPath}`);
    
    return this;  // Enable chaining
  }

  /**
   * Dynamically load any component class (Web4TSComponent, PDCA, Unit, etc.)
   * 
   * DYNAMIC LOADING: Enables on() to work with ANY component type:
   * - on('Web4TSComponent', '0.3.17.1') → loads DefaultWeb4TSComponent
   * - on('PDCA', '0.3.5.1') → loads DefaultPDCA
   * - on('Unit', '0.3.0.5') → loads DefaultUnit
   * - on('TestIsolatedComponent', '0.1.0.0') → loads DefaultTestIsolatedComponent
   * 
   * @pdca 2025-10-30-UTC-1011.pdca.md - Universal component loading
   * @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Return Component interface
   * @cliHide
   * @param componentName Name of component to load
   * @param version Version of component to load
   * @param componentPath Absolute path to component (from Path Authority)
   * @returns Component instance ready for delegation
   */
  private async loadComponent(
    componentName: string, 
    version: string,
    componentPath: string
  ): Promise<Component> {
    const modulePath = join(componentPath, 'dist', 'ts', 'layer2', `Default${componentName}.js`);
    
    if (!existsSync(modulePath)) {
      throw new Error(`Component module not found: ${modulePath}`);
    }
    
    // ✅ Dynamic import (works for ANY component type!)
    const module = await import(modulePath);
    const ComponentClass = module[`Default${componentName}`];
    
    if (!ComponentClass) {
      throw new Error(`Component class not found: Default${componentName} in ${modulePath}`);
    }
    
    // ✅ CLI is Path Authority - provide ALL paths to component (OOP!)
    // @pdca 2025-10-31-UTC-2000.on-context-path-initialization.pdca.md
    const instance = new ComponentClass().init({
      model: {
        // Component-specific paths
        componentRoot: componentPath,           // Component's own root directory
        targetDirectory: this.model.projectRoot, // Where to create new components
        
        // ✅ Path Authority: CLI provides ALL calculated paths to loaded component
        // This ensures the loaded component can execute commands (like test) using correct paths
        projectRoot: this.model.projectRoot,
        componentsDir: this.model.componentsDir,
        scriptsDir: this.model.scriptsDir,
        scriptsVersionDir: this.model.scriptsVersionDir,
        testDataDir: join(componentPath, 'test', 'data'), // Component-specific test isolation
        
        // ✅ CRITICAL: For old versions (0.3.13.2 and earlier) that use getComponentContext()
        // These versions look for contextComponent, contextVersion, contextPath in model
        // This makes on() work with legacy code that hasn't migrated to this.model.context
        contextComponent: componentName,
        contextVersion: version,
        contextPath: componentPath,
      }
    });
    
    return instance;
  }

  /**
   * Convert CLI state to scenario for persistence
   * Implements Component interface requirement
   * @pdca 2025-10-28-UTC-2015.user-scenario-antipattern.pdca.md - Use User.toScenario()
   * @test test/ts/layer2/UserScenarioPattern.test.ts - Scenario pattern verification
   * @returns Scenario representation of current CLI state
   */
  async toScenario(name?: string): Promise<Scenario<CLIModel>> {
    const componentName = (this.component?.model as any)?.component || 'CLI';
    const componentVersion = (this.component?.model as any)?.version?.toString() || '0.0.0.0';
    
    // ✅ RADICAL OOP: Use User.toScenario() for owner data (Web4 component interface)
    let ownerJson: string;
    
    if (this.user) {
      // ✅ Use User component's toScenario() - universal Web4 interface
      const userScenario = await this.user.toScenario();
      
      // ✅ Owner data IS the entire User scenario serialized
      ownerJson = JSON.stringify(userScenario);
    } else {
      // @pdca 2025-11-03-UTC-1430.pdca.md - Single Source of Truth: User component required
      // Fallback with minimal data (NO environment variable access)
      ownerJson = JSON.stringify({
        ior: {
          uuid: this.model.uuid,
          component: 'User',
          version: '0.1.0.0',
          timestamp: new Date().toISOString()
        },
        owner: '',  // No nested owner in fallback
        model: {
          user: process.env.USER || 'system',
          hostname: process.env.HOSTNAME || 'localhost',
          uuid: this.model.uuid,
          component: componentName,
          version: componentVersion
        }
      });
    }
    
    // ✅ Base64 encode once (DRY - mock-up for encryption)
    const ownerData = Buffer.from(ownerJson).toString('base64');

    return {
      ior: {
        uuid: this.model.uuid,
        component: componentName,
        version: componentVersion
      },
      owner: ownerData,
      model: this.model
    };
  }



  /**
   * Get component class from instance (for TSCompletion queries)
   * @pdca 2025-10-28-UTC-1822.phase1-2-completion.pdca.md - Phase 2: Helper method
   */
  protected getComponentClass(): any {
    if (!this.component) {
      return null;
    }
    return Object.getPrototypeOf(this.component).constructor;
  }

  /**
   * Get component name from model
   * @pdca 2025-10-28-UTC-1822.phase1-2-completion.pdca.md - Phase 2: Helper method
   */
  protected getComponentName(): string {
    return (this.component?.model as any)?.component || 'CLI';
  }

  /**
   * Get component version from model
   * @pdca 2025-10-28-UTC-1822.phase1-2-completion.pdca.md - Phase 2: Helper method
   */
  protected getComponentVersion(): string {
    return (this.component?.model as any)?.version?.toString() || '0.0.0.0';
  }

  /**
   * Get User service delegate
   * @pdca 2025-10-28-UTC-0934.pdca.md:1210 - Phase 2: Delegation
   */
  protected getUser(): User | undefined {
    return this.user;
  }


  /**
   * Compute derived completion fields from bash-provided compWords/compCword
   * Web4 pattern: TypeScript owns all model logic, bash only provides raw data
   * Pattern: completion-architecture-oop.md:426-456
   * @cliHide
   */
  protected computeDerivedCompletionFields(model: CLIModel): void {
    const words = model.completionCompWords;
    const cword = model.completionCompCword;

    // Derived from bash data
    model.completionCurrentWord = words[cword] || "";
    model.completionPreviousWord = words[cword - 1] || "";

    // Parse command (word at index 1 if cword > 1, meaning we're past the command)
    model.completionCommand = cword > 1 && words[1] ? words[1] : null;

    // Parse parameters (words from index 2 to cword-1)
    model.completionParameters = cword > 2 ? words.slice(2, cword) : [];
    model.completionParameterIndex = Math.max(0, cword - 2);

    // Detect chained commands (TODO: implement chaining detection)
    model.completionChainedCommands = [];

    // Set state flags
    model.completionIsCompletingMethod = cword === 1;
    model.completionIsCompletingParameter = cword > 1;
  }

  /**
   * Get valid completion values based on model state
   * Web4 pattern: Model-driven logic replaces functional callbacks
   * DRY: Single method to get values, no duplicate callback execution
   * Pattern: completion-architecture-oop.md:570-574
   * @cliHide
   */
  protected async getValidCompletionValues(): Promise<string[]> {
    if (this.model.completionIsCompletingMethod) {
      // Completing method name - use completionNameParameterCompletion for consistent formatting
      // This provides numbered list, color coding, and parameter signatures
      // Model state already has completionCompWords set properly by caller
      return await this.completionNameParameterCompletion();
    } else if (this.model.completionIsCompletingParameter) {
      // Completing parameter - use TSCompletion as source of truth for callback discovery
      // this.model provides context (command, paramIndex, currentWord) to TSCompletion

      const callback = TSCompletion.getParameterCallback(
        "DefaultWeb4TSComponent",
        this.model.completionCommand!,
        this.model.completionParameterIndex
      );

      if (callback) {
        // TSCompletion discovers callback on DefaultWeb4TSComponent (where method is defined)
        // But execute callback on CLI instance (where parameter completion methods exist)
        if (typeof (this as any)[callback] === "function") {
          const values = await (this as any)[callback]([
            this.model.completionCommand!,
            this.model.completionCurrentWord || "",
          ]);
          return values; // Return values for formatCompletionOutput in shCompletion
        }
      }

      // No callback found - return empty (no completions available)
      return [];
    }
    return [];
  }

  /**
   * Get component file path for TSCompletion
   * @cliHide
   */
  protected getComponentFilePath(): string | null {
    try {
      // ✅ Direct access to component (OOP pattern - Phase 3)
      // Use context if available (from on() command), otherwise use main component
      const targetComponent = this.context || this.component!;
      
      return join(
        (targetComponent.model as any).componentRoot,
        "src/ts/layer2",
        `Default${(targetComponent.model as any).component}.ts`
      );
    } catch (error) {
      // Fallback: try to find component file in current directory structure
    }

    return null;
  }

  /**
   * Abstract method for component-specific execution
   */
  abstract execute(args: string[]): Promise<void>;

  /**
   * Abstract method for component-specific usage
   */
  abstract showUsage(): void;

  /**
   * Common CLI utilities for argument validation
   */
  protected validateArgs(
    args: string[],
    minCount: number,
    errorMessage: string
  ): void {
    if (args.length < minCount) {
      throw new Error(errorMessage);
    }
  }

  /**
   * Common error formatting
   */
  protected formatError(message: string): string {
    return `❌ CLI Error: ${message}`;
  }

  /**
   * Common success formatting
   */
  protected formatSuccess(message: string): string {
    return `✅ ${message}`;
  }

  /**
   * Common warning formatting
   */
  protected formatWarning(message: string): string {
    return `⚠️ ${message}`;
  }

  /**
   * Common info formatting
   */
  protected formatInfo(message: string): string {
    return `ℹ️ ${message}`;
  }


  /**
   * Get test directory path (DRY helper)
   * ✅ Path Authority: Read from model (calculated ONCE in init())
   * 
   * INHERITANCE: This method is inherited and works correctly for:
   * - Web4TSComponentCLI (returns Web4TSComponent/0.3.17.1/test)
   * - TestIsolatedComponentCLI (returns TestIsolatedComponent/0.1.0.0/test)
   * - PDCACLI (returns PDCA/0.3.5.1/test)
   * - ALL generated component CLIs (returns their component/version/test)
   * 
   * @pdca 2025-10-30-UTC-1011.pdca.md - Simplified to use stored path
   * @pdca 2025-10-28-UTC-0934.pdca.md:298-304 - Original design
   * @cliHide
   * @returns Absolute path to component test directory
   */
  protected getTestDir(): string {
    // ✅ RADICAL DRY: Path calculated ONCE in init(), stored in model
    // ✅ Direct access to component (OOP pattern - Phase 3)
    // ✅ OOP Context Resolution: Use `on` context if set, otherwise use CLI's component
    // Component's componentRoot is its version directory (e.g., .../Web4TSComponent/0.3.17.2)
    const targetComponent = this.context || this.component;
    return join((targetComponent!.model as any).componentRoot, 'test');
  }

  /**
   * TSRanger 2.2 method discovery pattern
   * Discovers methods from entire CLI inheritance chain (DefaultCLI and subclasses)
   */
  protected discoverMethods(): void {
    // Walk up the prototype chain to discover ALL CLI methods
    let currentPrototype = Object.getPrototypeOf(this);
    while (currentPrototype && currentPrototype !== Object.prototype) {
      const methodNames = Object.getOwnPropertyNames(currentPrototype)
        .filter((name) => typeof currentPrototype[name] === "function")
        .filter((name) => !name.startsWith("_") && name !== "constructor")
        .filter(
          (name) =>
            !["init", "toScenario", "validateModel", "getModel"].includes(name)
        );

      for (const methodName of methodNames) {
        // Don't overwrite if already discovered (subclass takes precedence)
        if (!this.methodSignatures.has(methodName)) {
          const method = currentPrototype[methodName];
          this.methodSignatures.set(methodName, {
            name: methodName,
            paramCount: method.length,
            isAsync: method.constructor.name === "AsyncFunction",
          });
        }
      }

      // Move up the chain
      currentPrototype = Object.getPrototypeOf(currentPrototype);
    }

    // Also discover component methods if component instance is set
    if (this.component) {
      const prototype = Object.getPrototypeOf(this.component);
      const methodNames = Object.getOwnPropertyNames(prototype)
        .filter((name) => typeof prototype[name] === "function")
        .filter((name) => !name.startsWith("_") && name !== "constructor")
        .filter(
          (name) =>
            !["init", "toScenario", "validateModel", "getModel"].includes(name)
        );

      for (const methodName of methodNames) {
        const method = prototype[methodName];
        this.methodSignatures.set(methodName, {
          name: methodName,
          paramCount: method.length,
          isAsync: method.constructor.name === "AsyncFunction",
        });
      }
    }
  }

  /**
   * Dynamic command execution (TSRanger 2.2 pattern)
   */
  protected async executeDynamicCommand(
    command: string,
    args: string[]
  ): Promise<boolean> {
    if (!this.methodSignatures.has(command)) {
      return false; // Command not found
    }

    const signature = this.methodSignatures.get(command)!;

    // Dynamic argument validation with overload support
    const minArgs = this.getMinimumArguments(command);
    if (args.length < minArgs) {
      // Before failing, check if TSCompletion has a callback for the first missing parameter
      // This enables tab completion to work: web4tscomponent completion <TAB>
      const paramIndex = args.length; // Index of first missing parameter

      // Debug: log what we're checking
      console.error(
        `DEBUG: Checking callback for command="${command}" paramIndex=${paramIndex}`
      );

      // Check DefaultCLI first (where most completion callbacks live), then component class
      let callback = TSCompletion.getParameterCallback(
        "DefaultCLI",
        command,
        paramIndex
      );
      console.error(`DEBUG: DefaultCLI callback="${callback}"`);

      if (!callback) {
        callback = TSCompletion.getParameterCallback(
          this.getComponentClass().name,
          command,
          paramIndex
        );
        console.error(
          `DEBUG: ${this.getComponentClass()?.name} callback="${callback}"`
        );
      }

      if (callback) {
        // Return callback marker for bash completion to trigger
        console.log(`WORD: __CALLBACK__:${callback}`);
        return true;
      }

      // No callback available - validation fails
      throw new Error(
        `At least ${minArgs} arguments required for ${command} command`
      );
    }

    // Check if method exists on CLI (this) or component
    // Priority order:
    // 1. CLI methods (e.g., completeParameter, actionParameterCompletion, on)
    // 2. Loaded context via on() (if set)
    // 3. CLI's own component (fallback)
    
    if (typeof (this as any)[command] === "function") {
      // Execute on CLI instance (DefaultCLI or Web4TSComponentCLI)
      const method = (this as any)[command];
      if (signature.isAsync) {
        await method.apply(this, args);
      } else {
        method.apply(this, args);
      }
    } else {
      // ✅ OOP Context Resolution: Use loaded context if available (from on() command)
      // This enables: web4tscomponent on Web4TSComponent 0.3.13.2 test itCase
      // to execute test on 0.3.13.2, not on the CLI's own component (0.3.17.2)
      const componentInstance = this.context || this.component!;
      const method = (componentInstance as any)[command];

      if (signature.isAsync) {
        await method.apply(componentInstance, args);
      } else {
        method.apply(componentInstance, args);
      }
    }

    return true;
  }

  /**
   * TSCompletion color-coded usage generation
   */
  protected generateDynamicUsage(toolName: string, version: string): void {
    console.log(
      `${this.colors.cyan}${toolName} CLI Tool v${version} - Dynamic Method Discovery${this.colors.reset}`
    );
    console.log("");
    console.log(`${this.colors.bold}Usage:${this.colors.reset}`);

    // Dynamic usage generation from discovered methods
    for (const [methodName, signature] of this.methodSignatures) {
      const params = Array(signature.paramCount)
        .fill(0)
        .map((_, i) => `${this.colors.yellow}<arg${i + 1}>${this.colors.reset}`)
        .join(" ");
      console.log(
        `  ${this.colors.green}${toolName} ${methodName}${this.colors.reset} ${params}`
      );
    }

    console.log(
      `  ${this.colors.green}${toolName} help${this.colors.reset}                    # Show this help`
    );
    console.log(
      `  ${this.colors.green}${toolName} info${this.colors.reset}                    # Show component info`
    );
    console.log("");
    console.log(
      `${this.colors.dim}Commands automatically discovered from component methods${this.colors.reset}`
    );
    console.log(
      `${this.colors.dim}Add new methods to component and they become available immediately${this.colors.reset}`
    );
  }

  /**
   * Analyze component methods for dynamic documentation generation using class reference
   */
  protected analyzeComponentMethods(): MethodInfo[] {
    if (!this.getComponentClass()) return [];

    const methods: MethodInfo[] = [];
    const prototype = this.getComponentClass()?.prototype;
    const methodNames = Object.getOwnPropertyNames(prototype);

    // Whitelist for internal CLI methods that start with __ (hidden but executable)
    const internalCLIMethods = ["__completeParameter"];

    for (const name of methodNames) {
      // Skip constructor and private methods (except whitelisted internal CLI methods)
      if (name === "constructor") continue;
      if (name.startsWith("_") && !internalCLIMethods.includes(name)) continue;

      // ✅ ZERO CONFIG: Check @cliHide annotation with enhanced processing
      const cliAnnotations = TSCompletion.extractCliAnnotations(
        this.getComponentClass().name,
        name
      );
      if (cliAnnotations.hide) {
        continue;
      }

      const method = prototype[name];
      if (typeof method === "function") {
        methods.push({
          name: name,
          parameters: this.extractParameterInfoFromTSCompletion(name),
          description: this.extractMethodDescriptionFromTSDoc(name),
          examples: this.extractExamplesFromTSDoc(name),
          returnType: "any",
          isPublic: !name.startsWith("_"),
          category: this.categorizeMethod(name),
        });
      }
    }

    return methods;
  }

  /**
   * Extract method description from TSDoc annotations
   */
  private extractMethodDescriptionFromTSDoc(methodName: string): string {
    try {
      // Try to extract description from TSCompletion
      const componentInstance = this.component!;
      if (componentInstance) {
        const componentClassName = componentInstance.constructor.name;
        // Get full method documentation using TSCompletion
        const fullMethodDoc = TSCompletion.getMethodDoc(
          componentClassName,
          methodName
        );

        if (fullMethodDoc) {
          // Extract first meaningful line from TSDoc
          const lines = fullMethodDoc.split("\n");
          for (const line of lines) {
            const cleaned = line.replace(/^\s*\*\s*/, "").trim();
            if (
              cleaned &&
              !cleaned.startsWith("@") &&
              cleaned !== "/**" &&
              cleaned !== "*/"
            ) {
              return cleaned;
            }
          }
        }
      }
    } catch (error) {
      // Continue to fallback
    }

    // If TSDoc extraction failed, return method name only (no fallback descriptions)
    return methodName;
  }

  /**
   * Extract examples from TSDoc @example annotations
   */
  private extractExamplesFromTSDoc(methodName: string): string[] {
    try {
      const componentInstance = this.component!;
      if (componentInstance) {
        const componentClassName = componentInstance.constructor.name;

        // Get full method documentation using TSCompletion
        const fullMethodDoc = TSCompletion.getMethodDoc(
          componentClassName,
          methodName
        );

        if (fullMethodDoc) {
          const examples: string[] = [];
          const lines = fullMethodDoc.split("\n");
          let inExampleSection = false;

          for (const line of lines) {
            const cleaned = line.replace(/^\s*\*\s*/, "").trim();

            if (cleaned.startsWith("@example")) {
              inExampleSection = true;
              const exampleText = cleaned.replace("@example", "").trim();
              if (exampleText) {
                examples.push(exampleText);
              }
            } else if (
              inExampleSection &&
              cleaned &&
              !cleaned.startsWith("@")
            ) {
              examples.push(cleaned);
            } else if (
              cleaned.startsWith("@") &&
              !cleaned.startsWith("@example")
            ) {
              inExampleSection = false;
            }
          }

          if (examples.length > 0) {
            return examples;
          }
        }
      }
    } catch (error) {
      // Continue to fallback
    }

    // If no TSDoc examples found, return method name only
    return [methodName];
  }

  /**
   * Get TypeScript files for JSDoc extraction
   */
  private getTypeScriptFiles(): string[] {
    const files = [];

    try {
      // Look for TypeScript files in src/ts/layer directories
      const srcDir = join(process.cwd(), "src", "ts");
      for (let layer = 2; layer <= 5; layer++) {
        const layerDir = join(srcDir, `layer${layer}`);
        if (existsSync(layerDir)) {
          const layerFiles = readdirSync(layerDir)
            .filter((file: string) => file.endsWith(".ts"))
            .map((file: string) => join(layerDir, file));
          files.push(...layerFiles);
        }
      }
    } catch (error) {
      // Continue with empty files array
    }

    return files;
  }

  /**
   * Extract JSDoc text for a specific method
   */
  private extractJsDocForMethod(
    methodName: string,
    componentClassName?: string
  ): string {
    try {
      // Get TypeScript files for JSDoc extraction
      const files = this.getTypeScriptFiles();
      const classNameToFind = componentClassName || this.getComponentClass()?.name;

      for (const file of files) {
        const src = readFileSync(file, "utf8");
        const sourceFile = ts.createSourceFile(
          file,
          src,
          ts.ScriptTarget.Latest,
          true
        );

        const jsDoc = this.findMethodJsDoc(
          sourceFile,
          classNameToFind,
          methodName
        );
        if (jsDoc) {
          return jsDoc;
        }
      }
    } catch (error) {
      // Fallback to default descriptions
    }

    return "";
  }

  /**
   * Find JSDoc for specific method in source file
   */
  private findMethodJsDoc(
    sourceFile: any,
    className: string,
    methodName: string
  ): string {
    let jsDocText = "";

    ts.forEachChild(sourceFile, (node: any) => {
      if (
        ts.isClassDeclaration(node) &&
        node.name &&
        node.name.text === className
      ) {
        for (const member of node.members) {
          if (
            ts.isMethodDeclaration(member) &&
            member.name &&
            ts.isIdentifier(member.name) &&
            member.name.text === methodName
          ) {
            // Get JSDoc comments
            const jsDocComments = ts.getJSDocCommentsAndTags(member);
            for (const comment of jsDocComments) {
              if (ts.isJSDoc(comment)) {
                jsDocText += comment.getFullText();
              }
            }
            break;
          }
        }
      }
    });

    return jsDocText;
  }

  /**
   * Get minimum arguments for overloaded methods
   */
  protected getMinimumArguments(command: string): number {
    // Handle overloaded methods with different minimum arguments
    const overloadedMethods: { [key: string]: number } = {
      from: 1, // Can be called with 1 (file) or 3 (file, start, end) arguments
    };

    return (
      overloadedMethods[command] ||
      this.methodSignatures.get(command)?.paramCount ||
      0
    );
  }


  /**
   * Extract parameter information using TSCompletion from TSRanger 2.2
   */
  private extractParameterInfoFromTSCompletion(methodName: string): any[] {
    try {
      // Use TSCompletion static methods to get parameter information from TypeScript source

      // Try to extract parameters using enhanced TSCompletion static methods
      if (typeof TSCompletion.getEnhancedMethodParameters === "function") {
        const paramInfo = TSCompletion.getEnhancedMethodParameters(
          this.getComponentClass().name,
          methodName
        );

        // ✅ FIX: If TSCompletion found no parameters but method exists, use fallback
        // This happens for private methods, methods without CLI annotations, etc.
        if (paramInfo.length === 0) {
          return this.extractParameterInfoFallback(methodName);
        }

        return paramInfo.map((param: any, index: number) => {
          const paramName =
            param.name ||
            this.generateIntelligentParameterName(methodName, index);
          const paramType = param.type || "any";

          return {
            name: paramName,
            type: paramType,
            required: param.required !== false,
            description:
              param.description ||
              this.generateParameterDescription(methodName, paramName, index),
            examples: this.generateParameterExamples(paramName),
            validation: [],
            default: param.default, // ✅ FIX: Pass through default value for yellow coloring
            // ✅ NEW: Union type detection for CLI syntax generation
            isUnionType: this.isUnionType(paramType),
            unionTypes: this.extractUnionTypes(paramType),
          };
        });
      }

      // Fallback to intelligent parameter extraction
      return this.extractParameterInfoFallback(methodName);
    } catch (error) {
      // Fallback to reflection-based approach
      return this.extractParameterInfoFallback(methodName);
    }
  }

  /**
   * Fallback parameter extraction using reflection
   */
  private extractParameterInfoFallback(methodName: string): any[] {
    const method = this.getComponentClass()?.prototype[methodName];
    if (!method) return [];

    const paramCount = method.length;
    const params = [];

    for (let i = 0; i < paramCount; i++) {
      const paramName = this.generateIntelligentParameterName(methodName, i);
      params.push({
        name: paramName,
        type: this.inferParameterType(methodName, paramName),
        required: this.isParameterRequired(methodName, i),
        description: this.generateParameterDescription(
          methodName,
          paramName,
          i
        ),
        examples: this.generateParameterExamples(paramName),
        validation: [],
      });
    }

    return params;
  }

  /**
   * Extract parameter information from method with intelligent naming (legacy)
   */
  private extractParameterInfo(method: Function): any[] {
    const paramCount = method.length;
    const params = [];
    const methodName = method.name;

    for (let i = 0; i < paramCount; i++) {
      const paramName = this.generateIntelligentParameterName(methodName, i);
      const paramDesc = this.generateParameterDescription(
        methodName,
        paramName,
        i
      );

      params.push({
        name: paramName,
        type: this.inferParameterType(methodName, paramName),
        required: this.isParameterRequired(methodName, i),
        description: paramDesc,
        examples: this.generateParameterExamples(paramName),
        validation: [],
      });
    }

    return params;
  }

  /**
   * Generate parameter names from TSDoc with zero mapping code
   * Web4 pattern: Pure convention-driven parameter name extraction
   */
  private generateIntelligentParameterName(
    methodName: string,
    index: number
  ): string {
    // ✅ ZERO MAPPING: Extract directly from TypeScript AST via TSCompletion
    try {
      const paramInfo = TSCompletion.getEnhancedMethodParameters(
        this.getComponentClass().name,
        methodName
      );
      if (paramInfo && paramInfo[index]) {
        return paramInfo[index].name; // ✅ Direct from TypeScript source
      }
    } catch (error) {
      // Fallback only if TSCompletion fails
    }

    // ✅ WEB4 CONVENTION: Generic parameter naming based on position
    const genericPatterns = ["identifier", "target", "data", "options"];
    return genericPatterns[index] || `param${index + 1}`;
  }

  /**
   * Generate parameter description based on name and context
   */
  /**
   * Generate parameter description from pure TSDoc with zero mapping code
   * Web4 pattern: Pure convention-driven description extraction
   */
  private generateParameterDescription(
    methodName: string,
    paramName: string,
    index: number
  ): string {
    // ✅ ZERO MAPPING: Extract directly from TSDoc via TSCompletion
    try {
      const paramInfo = TSCompletion.getEnhancedMethodParameters(
        this.getComponentClass().name,
        methodName
      );
      const param = paramInfo.find((p: any) => p.name === paramName);
      if (param && param.description) {
        return param.description; // ✅ Direct from TSDoc
      }
    } catch (error) {
      // Continue to fallback
    }

    // ✅ WEB4 CONVENTION: Minimal fallback for missing TSDoc
    return `${
      paramName.charAt(0).toUpperCase() + paramName.slice(1)
    } parameter (add TSDoc description)`;
  }

  /**
   * Infer parameter type based on name patterns
   */
  private inferParameterType(methodName: string, paramName: string): string {
    const typeMap: { [key: string]: string } = {
      uuid: "string (UUID format)",
      name: "string",
      description: "string",
      typeM3: "TypeM3 enum",
      filename: "string (file path)",
      input: "JSON object",
      "search-term": "string",
      pattern: "string (regex pattern)",
      "file-path": "string (relative path)",
      key: "string",
      value: "any",
      component: "string",
      version: "string",
    };

    return typeMap[paramName] || "any";
  }

  /**
   * Determine if parameter is required based on method and position
   */
  private isParameterRequired(methodName: string, index: number): boolean {
    // First parameters are usually required, later ones optional
    if (index === 0) return true;
    if (methodName === "create" && index <= 1) return true;
    if (methodName.includes("delete") || methodName.includes("find"))
      return true;
    return index < 2; // Default: first 2 parameters required
  }

  /**
   * Generate parameter examples from pure TSDoc with zero mapping code
   * Web4 pattern: Pure convention-driven example extraction from @example tags
   */
  private generateParameterExamples(paramName: string): string[] {
    // ✅ ZERO MAPPING: Extract examples from TSDoc @example tags
    try {
      // This would extract from @example sections in JSDoc
      // For now, use convention-based generation until TSDoc example extraction is implemented
      return this.deriveExamplesFromConventions(paramName);
    } catch (error) {
      return [`${paramName}-example`];
    }
  }

  /**
   * Derive examples from Web4 parameter naming conventions
   * Web4 pattern: Convention-driven example generation with zero configuration
   * ✅ ENHANCED: Returns "Possible Values" for parameters with @cliValues TSDoc annotation
   */
  private deriveExamplesFromConventions(paramName: string): string[] {
    // ✅ ZERO HARDCODING: Extract from @cliValues TSDoc annotation
    const enumValues = this.enumParameterCompletion(paramName);

    if (enumValues && enumValues.length > 0) {
      // Format: Show all values with proper formatting
      // Values will be colored in assembleParameterSection (default=yellow, others=green)
      const valuesStr = enumValues.map((v) => `'${v}'`).join(", ");
      return [`Possible Values: ${valuesStr}`];
    }

    // ✅ FALLBACK: If no @cliValues, try calling actual completion method
    const completionMethodName = `${paramName}ParameterCompletion`;
    if (typeof (this as any)[completionMethodName] === "function") {
      // Show command to discover values dynamically (will be colored in assembleParameterSection)
      return [
        `Discovery Command: web4tscomponent completion parameter ${paramName}`,
      ];
    }

    // ✅ WEB4 CONVENTION: Derive examples from parameter name patterns

    // Unit reference convention
    if (paramName.includes("unit") || paramName === "identifier") {
      return ["44443290-015c-4720-be80-c42caf842252", "TSCompletion.ts.unit"];
    }

    // Folder convention
    if (
      paramName.toLowerCase().includes("folder") ||
      paramName.toLowerCase().includes("directory")
    ) {
      return ["backup/", "temp/", "components/"];
    }

    // File convention
    if (paramName.toLowerCase().includes("file") || paramName === "filename") {
      return ["component.ts", "auth-validator.unit", "data.json"];
    }

    // Name convention
    if (paramName === "name") {
      return ["Auth.Validator", "User.Manager", "Data.Processor"];
    }

    // Description convention
    if (paramName === "description") {
      return ['"Component description"', '"Authentication validation"'];
    }

    // Position convention
    if (paramName.includes("Pos") || paramName.includes("position")) {
      return ["1,1", "5,10", "12,5"];
    }

    // Default: parameter name example
    return [`${paramName}-example`];
  }

  /**
   * Categorize method based on name patterns
   */
  private categorizeMethod(
    name: string
  ): "create" | "modify" | "query" | "delete" | "utility" | "context" {
    if (name === "on") return "context"; // Special category for context loading
    if (name.includes("create") || name.includes("add")) return "create";
    if (
      name.includes("update") ||
      name.includes("set") ||
      name.includes("upgrade")
    )
      return "modify";
    if (
      name.includes("get") ||
      name.includes("find") ||
      name.includes("list") ||
      name.includes("info")
    )
      return "query";
    if (name.includes("delete") || name.includes("remove")) return "delete";
    return "utility";
  }

  /**
   * Assemble command section with color coding
   */
  protected assembleCommandSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.colors;

    let output = `${colors.sections}Commands:${colors.reset}\n`;

    // Calculate max command name length for alignment
    const maxCommandLength = Math.max(...methods.map((m) => m.name.length));

    for (const method of methods) {
      const padding = " ".repeat(maxCommandLength - method.name.length + 3);
      output += `  ${colors.commands}${method.name}${colors.reset}${padding}${colors.descriptions}${method.description}${colors.reset}\n`;
    }

    return output;
  }

  /**
   * Assemble parameter section with radical elimination of redundant parameters
   * Web4 pattern: Occam's Razor parameter documentation with value-based filtering
   */
  protected assembleParameterSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.colors;
    const allParams = new Map<string, any>();

    // Collect all parameters
    for (const method of methods) {
      for (const param of method.parameters) {
        if (!allParams.has(param.name)) {
          allParams.set(param.name, param);
        } else {
          // ✅ FIX: If we already have this parameter, prefer the one WITH a default value
          const existing = allParams.get(param.name);
          if (param.default && !existing.default) {
            allParams.set(param.name, param);
          }
        }
      }
    }

    // ✅ ZERO CONFIG: Group parameters by @cliSyntax annotation
    const parameterGroups = this.groupParametersBySyntax(allParams);

    let output = `${colors.sections}Parameters:${colors.reset}\n`;

    // Generate documentation for unique parameter syntax types only
    for (const [syntaxType, param] of parameterGroups) {
      // ✅ ENHANCED: Use enhanced optional formatting
      const syntax = this.generateParameterSyntax(param, "linkInto"); // Use a method name for annotation access

      // Line 1: Parameter syntax
      output += `  ${colors.parameters}${syntax}${colors.reset}\n`;

      // Line 2: Description (from TSDoc or convention)
      const description =
        param.description || this.getConventionDescription(syntaxType);
      output += `    ${colors.descriptions}${description}${colors.reset}\n`;

      // Line 3: Intelligent value documentation (Possible Values or Examples)
      const examples = this.generateParameterExamples(param.name);

      if (examples.length > 0) {
        for (let i = 0; i < Math.min(2, examples.length); i++) {
          const example = examples[i];

          // Check if this is a "Possible Values" line (from completion callback)
          if (example.startsWith("Possible Values:")) {
            // Show possible values with colored formatting
            // Default value in yellow, others in green
            const valuesText = example.replace("Possible Values: ", "");

            // Extract default value from param
            const defaultValue = param.default;

            // Color each value: default=yellow, others=green
            let coloredValues = valuesText;
            if (defaultValue) {
              // Regex to find and color values
              coloredValues = valuesText.replace(
                /'([^']+)'/g,
                (match, value) => {
                  if (value === defaultValue) {
                    return `'${colors.parameters}${value}${colors.reset}'`; // Yellow for default
                  } else {
                    return `'${colors.descriptions}${value}${colors.reset}'`; // Green for others
                  }
                }
              );
            } else {
              // No default - all values in green
              coloredValues = valuesText.replace(
                /'([^']+)'/g,
                `'${colors.descriptions}$1${colors.reset}'`
              );
            }

            output += `    ${colors.descriptions}Possible Values:${colors.reset} ${coloredValues}\n`;
          } else if (example.startsWith("Discovery Command:")) {
            // Show discovery command with proper colors
            const commandText = example.replace("Discovery Command: ", "");
            // Color: web4tscomponent (GREEN) + completion (WHITE) + parameter X (YELLOW)
            const coloredCommand = commandText.replace(
              /^(web4tscomponent)\s+(completion)\s+(parameter\s+.+)$/,
              `${colors.toolName}$1${colors.reset} ${colors.commands}$2${colors.reset} ${colors.parameters}$3${colors.reset}`
            );
            output += `    ${colors.descriptions}Possible Values:${colors.reset} ${coloredCommand}\n`;
          }
          // Else: Skip useless examples
        }
      } else if (param.default) {
        // ✅ FIX: No enum values, but has default → show default in yellow
        output += `    ${colors.descriptions}Default: ${colors.parameters}${param.default}${colors.reset}\n`;
      }

      // ✅ NEW: Line 4: Used By (which commands use this parameter)
      const usedByCommands = this.getCommandsUsingParameter(
        param.name,
        methods
      );
      if (usedByCommands.length > 0) {
        output += `    ${colors.descriptions}Used By: ${
          colors.commands
        }${usedByCommands.join(", ")}${colors.reset}\n`;
      }

      output += "\n"; // Empty line between parameters
    }

    return output;
  }

  /**
   * Get list of commands that use a specific parameter
   * Web4 pattern: Cross-reference parameter usage across all methods
   */
  private getCommandsUsingParameter(
    parameterName: string,
    methods: any[]
  ): string[] {
    const commandsUsingParam: string[] = [];

    for (const method of methods) {
      // Check if this method has a parameter with the given name
      const hasParameter = method.parameters.some(
        (param: any) => param.name === parameterName
      );
      if (hasParameter) {
        commandsUsingParam.push(method.name);
      }
    }

    return commandsUsingParam.sort(); // Sort alphabetically for consistency
  }

  /**
   * Group parameters by CLI syntax type with zero config through @cliSyntax annotations
   * Web4 pattern: Pure TSDoc annotation-driven parameter grouping
   */
  private groupParametersBySyntax(
    allParams: Map<string, any>
  ): Map<string, any> {
    const syntaxGroups = new Map<string, any>();

    // ✅ ZERO CONFIG: Group parameters by their @cliSyntax annotations
    for (const [paramName, param] of allParams) {
      // Get CLI syntax from @cliSyntax annotation or derive from conventions
      let syntaxType = this.getParameterSyntaxType(param, paramName);

      // Only add first occurrence of each syntax type
      if (!syntaxGroups.has(syntaxType)) {
        syntaxGroups.set(syntaxType, {
          ...param,
          syntaxType: syntaxType,
        });
      }
    }

    return syntaxGroups;
  }

  /**
   * Get parameter syntax type from @cliSyntax annotation or conventions
   * Web4 pattern: Zero config syntax type detection
   */
  private getParameterSyntaxType(param: any, paramName: string): string {
    // ✅ ZERO CONFIG: Check @cliSyntax annotation in parameter description
    const description = param.description || "";
    const syntaxMatch = description.match(/@cliSyntax\s+([^\s\n]+)/);
    if (syntaxMatch) {
      return syntaxMatch[1]; // Direct from @cliSyntax annotation
    }

    // ✅ FALLBACK: Convention-based detection
    if (
      (description.includes("UUID") || description.includes("uuid")) &&
      (description.includes("file") || description.includes("path"))
    ) {
      return "uuid|lnfile";
    }

    if (description.toLowerCase().includes("directory")) {
      return "folder";
    }

    if (description.toLowerCase().includes("file")) {
      return "file";
    }

    // Default: parameter name
    return paramName;
  }

  /**
   * Get convention-based description for syntax types
   * Web4 pattern: Convention-driven parameter descriptions
   */
  private getConventionDescription(syntaxType: string): string {
    const descriptions: { [key: string]: string } = {
      "uuid|lnfile": "Unit reference (UUID or .unit file)",
      folder: "Directory (relative to project root)",
      file: "File path (relative to project root)",
      position: "Position (line,column format)",
      name: "Component name (spaces become dots)",
      json: "Data (JSON format)",
      boolean: "Boolean flag (true/false)",
    };

    return descriptions[syntaxType] || `${syntaxType} parameter`;
  }

  /**
   * Assemble example section with usage examples highlighting 'on' method chaining
   */
  protected assembleExampleSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.colors;
    const componentName = this.getComponentName().toLowerCase();

    let output = `${colors.sections}Examples:${colors.reset}\n`;

    // ✅ HIGHLIGHT: Real chaining syntax (most common usage - works in single command!)
    output += `  ${colors.descriptions}# Method chaining in single command (common pattern - use often!)${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Unit 0.3.0.5${colors.reset} ${colors.commands}tree${colors.reset} ${colors.parameters}2${colors.reset}                    ${colors.descriptions}# Load context + show structure${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Web4TSComponent 0.3.2.0${colors.reset} ${colors.commands}upgrade${colors.reset} ${colors.parameters}nextBuild${colors.reset}     ${colors.descriptions}# Load + upgrade component${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}MyComponent 0.1.0.0${colors.reset} ${colors.commands}links${colors.reset} ${colors.parameters}fix${colors.reset}              ${colors.descriptions}# Load + fix symlinks${colors.reset}\n`;
    output += "\n";
    output += `  ${colors.descriptions}# Alternative: Separate commands (also works)${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}on${colors.reset} ${colors.parameters}Unit 0.3.0.5${colors.reset}                        ${colors.descriptions}# 1. Load component context${colors.reset}\n`;
    output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}tree${colors.reset} ${colors.parameters}2${colors.reset}                                 ${colors.descriptions}# 2. Show directory structure${colors.reset}\n`;
    output += "\n";

    // Standard categorized examples
    const categories = ["create", "modify", "query", "delete", "utility"];

    for (const category of categories) {
      const categoryMethods = methods.filter(
        (m) => m.category === category && m.name !== "on"
      );
      if (categoryMethods.length > 0) {
        output += `  ${colors.descriptions}# ${
          category.charAt(0).toUpperCase() + category.slice(1)
        } operations${colors.reset}\n`;

        for (const method of categoryMethods.slice(0, 2)) {
          const exampleParams = method.parameters
            .map((p) => {
              const examples = this.generateParameterExamples(p.name);
              // Skip useless examples and "Possible Values" lines
              if (
                examples[0] &&
                !examples[0].startsWith("Possible Values:") &&
                examples[0] !== `${p.name}-example`
              ) {
                return examples[0];
              } else {
                // Use parameter name placeholder when no good example exists
                return `<${p.name}>`;
              }
            })
            .join(" ");

          const exampleCommand = `${componentName} ${method.name} ${exampleParams}`;
          const padding = " ".repeat(Math.max(1, 50 - exampleCommand.length));

          output += `  ${colors.toolName}${componentName}${colors.reset} ${colors.commands}${method.name}${colors.reset} ${colors.parameters}${exampleParams}${colors.reset}${padding}${colors.descriptions}# ${method.description}${colors.reset}\n`;
        }
        output += "\n";
      }
    }

    return output;
  }

  /**
   * Check if parameter type is a union type
   * Web4 pattern: Union type detection for CLI syntax generation
   */
  private isUnionType(paramType: string): boolean {
    // Detect TypeScript union types (e.g., "UUIDv4 | string", "string | number")
    return paramType.includes(" | ") || paramType.includes("|");
  }

  /**
   * Extract individual types from union type
   * Web4 pattern: Union type parsing for CLI documentation
   */
  private extractUnionTypes(paramType: string): string[] {
    if (!this.isUnionType(paramType)) {
      return [paramType];
    }

    // Split union type and clean up whitespace
    return paramType.split("|").map((type) => type.trim());
  }

  /**
   * Generate CLI parameter syntax with enhanced optional formatting
   * Web4 pattern: Clear optional parameter syntax with default values
   * Notation: <?param:'defaultValue'> for optional parameters
   */
  private generateParameterSyntax(param: any, methodName?: string): string {
    // Get base syntax from @cliSyntax annotation or conventions
    let baseSyntax = this.getBaseSyntax(param, methodName);

    // ✅ ENHANCED: Apply Web4 notation for optional parameters first
    let finalSyntax: string;
    if (param.required) {
      finalSyntax = `<${baseSyntax}>`;
    } else {
      // Check for default value in TypeScript or TSDoc
      const defaultValue = this.extractDefaultValue(param, methodName);

      // ✅ NOTE: Syntax shows ONLY the default value, not all union values
      // "Possible Values" documentation will show all values with default highlighted

      if (defaultValue) {
        finalSyntax = `<?${baseSyntax}:'${defaultValue}'>`; // ✅ Web4 notation: <?parameter:'defaultValue'>
      } else {
        finalSyntax = `<?${baseSyntax}>`; // ✅ Web4 notation: <?parameter> (no default available)
      }
    }

    // ✅ NEW: Check if parameter has completion method and add ! prefix to entire syntax if not
    const hasCompletion = this.hasParameterCompletion(param.name);
    if (!hasCompletion) {
      finalSyntax = `!${finalSyntax}`;
    }

    return finalSyntax;
  }

  /**
   * Check if a parameter has a completion method
   * Web4 pattern: Parameters with completion methods get intelligent tab completion
   */
  private hasParameterCompletion(parameterName: string): boolean {
    const completionMethodName = `${parameterName}ParameterCompletion`;

    // Check if the completion method exists on this class instance
    return typeof (this as any)[completionMethodName] === "function";
  }

  /**
   * Generic enum parameter completion based on @cliValues TSDoc annotation
   * Web4 pattern: Convention-based enum completion with zero hardcoding
   *
   * ALL enum parameters should use this method via convention:
   * - Parameter: versionPromotion
   * - Completion: async versionPromotionParameterCompletion(args) { return this.enumParameterCompletion('versionPromotion'); }
   * - TSDoc: @cliValues nextPatch nextMinor nextMajor nextBuild
   *
   * @param paramName Parameter name to get enum values for
   * @returns Array of possible enum values from @cliValues annotation
   */
  protected enumParameterCompletion(paramName: string): string[] {
    // ✅ PERFORMANCE: Direct TSCompletion query without method analysis overhead
    // Try to extract @cliValues from any method that has this parameter

    try {
      // Quick extraction: search for @cliValues in source files directly
      const values = TSCompletion.extractCliValues(
        this.getComponentClass().name,
        "", // Empty method name = search all methods
        paramName
      );

      if (values && values.length > 0) {
        return values;
      }
    } catch (error) {
      // Fallback: return empty array
    }

    return [];
  }

  /**
   * Get union values for parameters with known completion values
   * Web4 pattern: Show finite value sets directly in syntax via @cliValues TSDoc annotation
   * @returns Array of possible values, or null if not applicable
   */
  private getParameterUnionValues(paramName: string): string[] | null {
    // ✅ ZERO HARDCODING: Extract from @cliValues TSDoc annotation
    const values = this.enumParameterCompletion(paramName);
    return values.length > 0 ? values : null;
  }

  /**
   * Get base syntax - ALWAYS use actual TypeScript parameter name
   * Web4 pattern: Zero config, zero convention, zero magic - just the truth!
   *
   * CRITICAL: NO convention detection here! The parameter name IS the syntax.
   * User expectation: "showHidden" parameter should show as "<?showHidden:'false'>"
   * NOT as "<?file:'false'>" just because description mentions "files"!
   */
  private getBaseSyntax(param: any, methodName?: string): string {
    // ALWAYS return actual TypeScript parameter name - NOTHING ELSE!
    // This is what the user types in the command: web4tscomponent tree 4 false
    // The parameter names ARE: depth, showHidden (not depth, file!)
    return param.name;
  }

  /**
   * Extract default value from TypeScript parameter or TSDoc
   * Web4 pattern: Default value detection for enhanced optional syntax
   */
  private extractDefaultValue(param: any, methodName?: string): string | null {
    // ✅ PRIORITY 1: Check TypeScript signature default (already extracted by TSCompletion)
    // This is the ONLY source for explicit defaults - TypeScript native syntax
    if (param.default !== undefined && param.default !== null) {
      return param.default;
    }

    // ✅ PRIORITY 2: Convention-based defaults for common parameter types
    const description = param.description || "";

    if (description.includes("boolean")) {
      return "false";
    }

    if (
      description.includes("copy tracking") ||
      description.includes("optional")
    ) {
      return null; // Show as <?optional> rather than default
    }

    // No default value detected
    return null;
  }

  /**
   * Check if union types represent UnitIdentifier (UUIDv4 | string)
   */
  private isUnitIdentifierType(unionTypes: string[]): boolean {
    const hasUUID = unionTypes.some(
      (type) => type.includes("UUID") || type.includes("uuid")
    );
    const hasString = unionTypes.some(
      (type) => type.includes("string") || type.includes("String")
    );
    return hasUUID && hasString;
  }

  /**
   * Simplify TypeScript type names for CLI display
   */
  private simplifyTypeName(typeName: string): string {
    // Map TypeScript types to CLI-friendly names
    const typeMap: { [key: string]: string } = {
      UUIDv4: "uuid",
      string: "lnfile",
      number: "num",
      boolean: "bool",
    };

    // Extract base type name (remove import paths, generics, etc.)
    const baseType = typeName.replace(/.*\./, "").replace(/<.*>/, "");
    return typeMap[baseType] || baseType.toLowerCase();
  }

  /**
   * Generate structured usage output with unified Commands section
   * STREAMING: Output sections immediately instead of buffering
   */
  public generateStructuredUsage(): string {
    const colors = this.colors;
    const componentName = this.getComponentName();
    const version = this.getComponentVersion();

    // Header section - output immediately
    console.log(
      `${colors.toolName}Web4 ${componentName} CLI Tool${colors.reset} v${colors.version}${version}${colors.reset} - Dynamic Method Discovery with Structured Documentation\n`
    );

    // Commands section - output immediately
    console.log(this.assembleUnifiedCommandsSection());

    // Parameters section - output immediately
    console.log(this.assembleParameterSection());

    // Examples section - output immediately
    console.log(this.assembleExampleSection());

    // Integration section - output immediately
    console.log(`${colors.sections}Web4 Integration:${colors.reset}`);
    console.log(
      `  ${colors.descriptions}${componentName} operates as atomic Web4 element with dynamic CLI documentation.${colors.reset}`
    );
    console.log(
      `  ${colors.descriptions}Commands automatically discovered from component methods with structured formatting.${colors.reset}`
    );
    console.log(
      `  ${colors.descriptions}TSCompletion color coding and professional documentation generation.${colors.reset}`
    );

    // Return empty string since we've already output everything
    return "";
  }

  /**
   * Assemble unified Commands section with two-line format and union type support
   */
  protected assembleUnifiedCommandsSection(): string {
    const methods = this.analyzeComponentMethods();
    const colors = this.colors;
    const componentName = this.getComponentName();

    let output = `${colors.sections}Commands:${colors.reset}\n`;

    // Generate two-line command format: command line + description line
    for (const method of methods) {
      // ✅ ZERO CONFIG: Generate parameter syntax with @cliSyntax annotation support
      const paramList = method.parameters
        .map((p: any) => {
          return this.generateParameterSyntax(p, method.name);
        })
        .join(" ");

      // Line 1: Command with parameters (enhanced with union type syntax)
      output += `  ${colors.toolName}${componentName.toLowerCase()}${
        colors.reset
      } ${colors.commands}${method.name}${colors.reset} ${
        colors.parameters
      }${paramList}${colors.reset}\n`;

      // Line 2: Description indented for better readability
      output += `    ${colors.descriptions}${method.description}${colors.reset}\n`;
      output += "\n"; // Empty line between commands for better separation
    }

    return output;
  }

  /**
   * Minimal parameter completion for 'action' parameter
   * First iteration: Static list, no dynamic logic
   *
   * Future: Will be auto-discovered via naming convention
   * See: 2025-10-10-UTC-0340-tscompletion-oop-modernization.pdca.md
   *
   * @param currentArgs Current argument values (unused in minimal version)
   * @returns Array of action completions (no empty string to avoid spacing issues)
   */
  async actionParameterCompletion(): Promise<string[]> {
    return [
      "fix", // Fix/repair
      "verify", // Verify/check
      "show", // Display/show
      "list", // List items
    ];
  }


  /**
   * Shell completion with direct parameter passing
   * Simplexity: The highest art of complexity is simplicity
   *
   * Web4 Pattern:
   * - Model already exists (created in constructor via createEmptyModel)
   * - Just update fields, reuse existing DRY methods
   * - No JSON serialization, no Scenario dance, no ENV vars!
   *
   * @param cword - COMP_CWORD from bash (current word index)
   * @param words - COMP_WORDS from bash (all words in command line)
   * @cliHide
   */
  async shCompletion(cword: string, ...words: string[]): Promise<void> {
    // DEBUG: Write entry to file FIRST - use try/catch to see if there's an error
    try {
      writeFileSync(
        "/tmp/debug-completion.log",
        `DEBUG: shCompletion ENTRY: cword=${cword}, words=[${words.join(
          ", "
        )}]\n`
      );
    } catch (error) {
      console.log(`DEBUG ERROR: ${(error as Error).message}`);
    }

    // Update model directly (MODEL-DRIVEN!)
    this.model.completionCompCword = parseInt(cword, 10);
    this.model.completionCompWords = words;
    this.model.completionCliName = words[0] || "cli"; // First word is CLI name

    // Derive all other fields (DRY - reuse existing method!)
    this.computeDerivedCompletionFields(this.model);

    // DEBUG: Write state to file
    appendFileSync(
      "/tmp/debug-completion.log",
      `DEBUG: completionIsCompletingMethod=${this.model.completionIsCompletingMethod}\n` +
        `DEBUG: completionIsCompletingParameter=${this.model.completionIsCompletingParameter}\n` +
        `DEBUG: completionCommand=${this.model.completionCommand}\n` +
        `DEBUG: completionParameterIndex=${this.model.completionParameterIndex}\n`
    );

    // DRY: Use existing sophisticated completion system, don't reinvent!
    if (this.model.completionIsCompletingMethod) {
      // Method completion - use existing completionNameParameterCompletion
      appendFileSync(
        "/tmp/debug-completion.log",
        "DEBUG: Taking METHOD completion branch\n"
      );
      const filter = this.model.completionCurrentWord || "";
      
      // RADICAL OOP FIX: Inject fake context into model for completionNameParameterCompletion
      // completionNameParameterCompletion expects: ['cli', 'completion', 'method', filter]
      // But when completing method names, we have: ['cli', ''] 
      // So we temporarily inject the 'completion method' context
      const originalCompWords = this.model.completionCompWords;
      this.model.completionCompWords = [originalCompWords[0], "completion", "method", filter];
      
      const values = await this.completionNameParameterCompletion();
      
      // Restore original model state
      this.model.completionCompWords = originalCompWords;
      
      this.formatCompletionOutput(values);
    } else if (this.model.completionIsCompletingParameter) {
      // Parameter completion - use existing completeParameter (outputs directly!)
      appendFileSync(
        "/tmp/debug-completion.log",
        "DEBUG: Taking PARAMETER completion branch\n"
      );
      
      // RADICAL OOP: Use getComponentClass() instead of hardcoded component name
      const componentClassName = this.getComponentClass()?.name || "DefaultCLI";
      const callback = TSCompletion.getParameterCallback(
        componentClassName,
        this.model.completionCommand!,
        this.model.completionParameterIndex
      );

      // DEBUG: Write to file since console.error is suppressed
      appendFileSync(
        "/tmp/debug-completion.log",
        `DEBUG: Parameter completion for command="${this.model.completionCommand}" paramIndex=${this.model.completionParameterIndex}\n` +
          `DEBUG: Component class="${componentClassName}"\n` +
          `DEBUG: Found callback="${callback}"\n` +
          `DEBUG: contextArgs=[${this.model.completionCompWords
            .slice(1)
            .join(", ")}]\n`
      );

      if (callback) {
        // DRY: Use existing completeParameter method (outputs directly, no return needed)
        // Pass full command context, not just command name and current word
        const contextArgs = this.model.completionCompWords.slice(1); // Remove CLI name, keep command + params
        await this.completeParameter(callback, ...contextArgs);
      } else {
        // UX: Always provide feedback when no completions are available
        console.log("DISPLAY: (no completions available)");
        
        // Add the "your web4 command >" prompt so user can continue typing
        if (
          this.model.completionCliName &&
          this.model.completionCompWords.length > 0
        ) {
          // Prompt colors: "your web4 command >"
          const promptWhite = "\x1b[37m";
          const promptCyan = "\x1b[36m";
          const reset = "\x1b[0m";

          // TSCompletion colors for command parts
          const toolName = "\x1b[1;36m"; // Cyan bold for CLI name
          const commands = "\x1b[0;37m"; // White for method names
          const parameters = "\x1b[1;33m"; // Yellow bold for parameters

          // Build colored command from MODEL (DRY!)
          let coloredCommand = `${toolName}${this.model.completionCliName}${reset}`;

          // Add method and parameters from completionCompWords
          for (let i = 1; i < this.model.completionCompWords.length; i++) {
            const word = this.model.completionCompWords[i];
            if (word) {
              // First word after CLI name is method, rest are parameters
              if (i === 1) {
                coloredCommand += ` ${commands}${word}${reset}`;
              } else {
                // Use yellow for parameters
                const params = this.model.completionCompWords.slice(i).filter(w => w).join(" ");
                coloredCommand += ` ${parameters}${params}${reset}`;
                break; // Already added all remaining parameters
              }
            }
          }

          // Format: "your web4 command >" with colored command
          const prompt = `${promptWhite}your ${promptCyan}web4${promptWhite} command >${reset} ${coloredCommand}`;
          console.log(`DISPLAY: ${prompt}`);
        }
        
        console.log("WORD: ");
      }
    } else {
      appendFileSync(
        "/tmp/debug-completion.log",
        "DEBUG: Taking NEITHER branch - no completion detected\n"
      );
    }
  }

  /**
   * Format completion values with DISPLAY/WORD protocol
   * Handles both simple arrays and complex formatted output
   * DRY helper used by completeParameter and future completion methods
   * @param values Array of completion values/lines
   * @cliHide
   */
  protected formatCompletionOutput(values: string[]): void {
    // UX: Always provide feedback when no completions are available
    if (!values || values.length === 0) {
      console.log("DISPLAY: (no completions available)");
      
      // Add the "your web4 command >" prompt so user can continue typing
      if (
        this.model.completionCliName &&
        this.model.completionCompWords.length > 0
      ) {
        // Prompt colors: "your web4 command >"
        const promptWhite = "\x1b[37m";
        const promptCyan = "\x1b[36m";
        const reset = "\x1b[0m";

        // TSCompletion colors for command parts
        const toolName = "\x1b[1;36m"; // Cyan bold for CLI name
        const commands = "\x1b[0;37m"; // White for method names
        const parameters = "\x1b[1;33m"; // Yellow bold for parameters

        // Build colored command from MODEL (DRY!)
        let coloredCommand = `${toolName}${this.model.completionCliName}${reset}`;

        // Add method and parameters from completionCompWords
        for (let i = 1; i < this.model.completionCompWords.length; i++) {
          const word = this.model.completionCompWords[i];
          if (word) {
            // First word after CLI name is method, rest are parameters
            if (i === 1) {
              coloredCommand += ` ${commands}${word}${reset}`;
            } else {
              // Use yellow for parameters
              const params = this.model.completionCompWords.slice(i).filter(w => w).join(" ");
              coloredCommand += ` ${parameters}${params}${reset}`;
              break; // Already added all remaining parameters
            }
          }
        }

        // Format: "your web4 command >" with colored command
        const prompt = `${promptWhite}your ${promptCyan}web4${promptWhite} command >${reset} ${coloredCommand}`;
        console.log(`DISPLAY: ${prompt}`);
      }
      
      console.log("WORD: ");
      return;
    }

    // DEBUG: Log that formatCompletionOutput is being called
    try {
      writeFileSync(
        "/tmp/debug-format.log",
        `DEBUG: formatCompletionOutput called with ${values.length} values\n` +
          `DEBUG: First few values: ${values.slice(0, 3).join(", ")}\n`
      );
    } catch (error) {
      console.log(`DEBUG FORMAT ERROR: ${(error as Error).message}`);
    }

    const lines: string[] = [];

    // Detect complex format (numbered lines like "1: methodName <params>")
    const hasNumberedRefs = values.some((v: string) => v.match(/^\d+:/));
    const hasSpaces = values.some((v: string) => v.includes(" "));

    if (hasNumberedRefs || hasSpaces) {
      // Complex format: numbered method list or formatted text
      // Add DISPLAY lines (user-visible formatted output with ANSI colors)
      // Split on embedded \n first (for multi-line documentation)
      values.forEach((value: string) => {
        value.split("\n").forEach((line: string) => {
          lines.push(`DISPLAY: ${line}`);
        });
      });

      // Add colored prompt echo using MODEL data (Simplexity!)
      if (
        this.model.completionCliName &&
        this.model.completionCompWords.length > 0
      ) {
        // Prompt colors: "your web4 command >"
        const promptWhite = "\x1b[37m";
        const promptCyan = "\x1b[36m";
        const reset = "\x1b[0m";

        // TSCompletion colors for command parts
        const toolName = "\x1b[1;36m"; // Cyan bold for CLI name
        const commands = "\x1b[0;37m"; // White for method names
        const parameters = "\x1b[1;33m"; // Yellow bold for parameters

        // Build colored command from MODEL (DRY!)
        const words = this.model.completionCompWords;
        let coloredCommand = "";

        if (words.length > 0) {
          // First word: CLI name (cyan bold)
          coloredCommand = `${toolName}${words[0]}${reset}`;

          if (words.length > 1) {
            // Second word: method name (white)
            coloredCommand += ` ${commands}${words[1]}${reset}`;

            // Remaining words: parameters (yellow bold)
            if (words.length > 2) {
              const params = words.slice(2).join(" ");
              coloredCommand += ` ${parameters}${params}${reset}`;
            }
          }
        }

        // Format: "your web4 command >" with colored command (single DISPLAY line to avoid extra newline)
        const prompt = `${promptWhite}your ${promptCyan}web4${promptWhite} command >${reset} ${coloredCommand}`;
        lines.push(`DISPLAY: ${prompt}`);
      }

      // Extract method names/words and add WORD lines (for bash compgen)
      // CRITICAL: Strip ANSI codes before extracting words!
      values.forEach((line: string) => {
        // Strip ANSI escape codes: \x1b[...m
        const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, "");

        // Extract word: "1: methodName <params>" -> "methodName" OR "1: <?action>" -> "action"
        const match = cleanLine.match(/^\d+:\s*(\S+)/);
        let word = match ? match[1] : cleanLine.split(" ")[0];

        // Strip parameter syntax if present: <?action> -> action, <what> -> what
        const paramMatch = word.match(/^<\??([^>:'"]+)/);
        if (paramMatch) {
          word = paramMatch[1];
        }

        lines.push(`WORD: ${word}`);
      });
    } else {
      // Simple format: plain words like ['dev', 'latest', 'prod'] OR parameter syntax like ['<?action>', '<what>']

      // Add colored prompt echo using MODEL data (same as complex format!)
      if (
        this.model.completionCliName &&
        this.model.completionCompWords.length > 0
      ) {
        // Prompt colors: "your web4 command >"
        const promptWhite = "\x1b[37m";
        const promptCyan = "\x1b[36m";
        const reset = "\x1b[0m";

        // TSCompletion colors for command parts
        const toolName = "\x1b[1;36m"; // Cyan bold for CLI name
        const commands = "\x1b[0;37m"; // White for method names
        const parameters = "\x1b[1;33m"; // Yellow bold for parameters

        // Build colored command from MODEL (DRY!)
        const words = this.model.completionCompWords;
        let coloredCommand = "";

        if (words.length > 0) {
          // First word: CLI name (cyan bold)
          coloredCommand = `${toolName}${words[0]}${reset}`;

          if (words.length > 1) {
            // Second word: method name (white)
            coloredCommand += ` ${commands}${words[1]}${reset}`;

            // Remaining words: parameters (yellow bold)
            if (words.length > 2) {
              const params = words.slice(2).join(" ");
              coloredCommand += ` ${parameters}${params}${reset}`;
            }
          }
        }

        // Format: "your web4 command >" with colored command (single DISPLAY line to avoid extra newline)
        const prompt = `${promptWhite}your ${promptCyan}web4${promptWhite} command >${reset} ${coloredCommand}`;
        lines.push(`DISPLAY: ${prompt}`);
      }

      // Extract naked names for WORD lines
      values.forEach((value: string) => {
        // Strip parameter syntax: <?action:'default'> -> action, <what> -> what
        const cleanValue = value.replace(/\x1b\[[0-9;]*m/g, ""); // Strip ANSI first
        // Match: <word>, <?word>, <?word:'default'>, <?word:"default">
        const paramMatch = cleanValue.match(/^<\??([^>:'"]+)/);
        const word = paramMatch ? paramMatch[1] : cleanValue;
        lines.push(`WORD: ${word}`);
      });
    }

    // ONE console.log for entire block (efficient!)
    console.log(lines.join("\n"));
  }

  /**
   * Execute parameter completion callback for dynamic tab completion
   * Called by bash completion when TSCompletion returns __CALLBACK__:methodName
   * Web4 pattern: Hidden via @cliHide, not via naming convention
   * 
   * RADICAL OOP: Completion methods are parameterless - they use this.model state
   * 
   * @cliHide
   */
  async completeParameter(
    callbackName: string,
    ...contextArgs: string[]
  ): Promise<void> {
    // Check if callback method exists on this instance
    if (typeof (this as any)[callbackName] === "function") {
      // Call parameterless completion method (uses this.model for all context)
      const values = await (this as any)[callbackName]();

      // Use DRY helper to format output with DISPLAY/WORD protocol
      // Model already has completion context from bash (via shCompletion)
      // formatCompletionOutput handles empty arrays with UX feedback
      this.formatCompletionOutput(values);
    } else {
      // UX: Callback not found - provide feedback instead of silent failure
      console.log("DISPLAY: (no completions available)");
      console.log("WORD: ");
    }
  }

  /**
   * Fundamental parameter completion: depth (tree depth, integer values)
   * Used by: tree, and any method with depth parameter
   * @cliHide
   */
  async depthParameterCompletion(): Promise<string[]> {
    return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  }

  /**
   * Fundamental parameter completion: showHidden (boolean flag)
   * Used by: tree, and any method with showHidden parameter
   * @cliHide
   */
  async showHiddenParameterCompletion(): Promise<string[]> {
    return ["true", "false"];
  }

  /**
   * Fundamental parameter completion: skipPromotion (boolean flag)
   * Used by: test, and any method with skipPromotion parameter
   * @cliHide
   */
  async skipPromotionParameterCompletion(): Promise<string[]> {
    return ["true", "false"];
  }

  /**
   * Fundamental parameter completion: format (output format)
   * Used by: getContext, and any method with format parameter
   * @cliHide
   */
  async formatParameterCompletion(): Promise<string[]> {
    return ["json", "bash", "text", "xml", "csv"];
  }

  /**
   * Fundamental parameter completion: what (completion type)
   * Used by: completion method for testing tab completions
   * @cliHide
   */
  async whatParameterCompletion(): Promise<string[]> {
    return ["method", "parameter"];
  }

  /**
   * Fundamental parameter completion: filter (prefix for filtering completions)
   * Used by: completion method for testing tab completions
   * Delegates to completionNameParameterCompletion for shared logic
   * 
   * RADICAL OOP: Now parameterless - relies on model state
   * 
   * @cliHide
   */
  async filterParameterCompletion(): Promise<string[]> {
    // TSCompletion expects {parameterName}ParameterCompletion naming convention
    // Delegate to shared logic in completionNameParameterCompletion
    return this.completionNameParameterCompletion();
  }

  /**
   * Check if a method has CLI annotations (@cli* tags in JSDoc)
   * Used by: completion method to visually distinguish CLI-exposed methods
   * @cliHide
   */
  private hasCliAnnotations(methodName: string): boolean {
    try {
      // CRITICAL: Check @cliHide FIRST using TSCompletion (source analysis)
      // Method.toString() doesn't have TSDoc comments (stripped in compilation)
      if (TSCompletion.isMethodHidden(this.getComponentClass()?.name || 'CLI', methodName)) {
        return false;
      }

      // Check if method exists on component class
      const method = this.getComponentClass()?.prototype?.[methodName];
      if (!method) return false;

      // Check method source for @cli annotations
      const methodStr = method.toString();

      // Check for CLI-exposing annotations in method source (for runtime-added methods)
      if (
        methodStr.includes("@cliSyntax") ||
        methodStr.includes("@cliExample") ||
        methodStr.includes("@cliDefault")
      ) {
        return true;
      }

      // Fallback: check if TSCompletion found parameters
      // (TSCompletion only extracts parameters from methods with proper TSDoc)
      const paramInfo = TSCompletion.getEnhancedMethodParameters(
        this.getComponentClass().name,
        methodName
      );
      if (paramInfo.length > 0) {
        // Method has TSDoc-documented parameters - likely a CLI method
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Dynamic parameter completion: completionName (depends on 'what' value)
   * Returns method names if what=method, parameter completion names if what=parameter
   * Uses multiline format with full signatures for methods
   * Shared by: filterParameterCompletion (via delegation)
   * @cliHide
   */
  async completionNameParameterCompletion(): Promise<string[]> {
    // Extract values from model state  
    // Format: ['web4tscomponent', 'completion', 'method'|'parameter', 'prefix', ...]
    const what = this.model.completionCompWords[2]; // 'method' or 'parameter'
    const filterPrefix = this.model.completionCompWords[3] || ""; // Optional prefix

    if (!what || (what !== "method" && what !== "parameter")) {
      // No valid 'what' value yet - return empty
      return [];
    }

    // ANSI color codes (use centralized Colors instance)
    const BRIGHT_CYAN = this.colors.toolName; // Numbers
    const BRIGHT_YELLOW = this.colors.parameters; // Parameters
    const BRIGHT_WHITE_BOLD = this.colors.sections; // CLI methods (user-facing commands)
    const RESET = this.colors.reset;

    if (what === "parameter") {
      // Return parameter names in Web4 notation with defaults (matching method signatures)
      const allMethods = Array.from(this.methodSignatures.keys());
      let filtered = allMethods
        .filter((name) => name.endsWith("ParameterCompletion"))
        .sort();

      // Apply prefix filtering if provided
      if (filterPrefix) {
        filtered = filtered.filter((name) => name.startsWith(filterPrefix));
      }

      // ✅ EXACT MATCH: Execute the completion callback to discover parameter values
      // Example: "versionPromotion" → execute versionPromotionParameterCompletion
      if (filtered.length === 1) {
        const callbackName = filtered[0];
        const paramName = callbackName.replace(/ParameterCompletion$/, "");

        // Check if filter exactly matches the parameter name (discovery mode)
        if (filterPrefix === paramName) {
          // Execute the completion callback to show available values
          const callback = (this as any)[callbackName];
          if (callback && typeof callback === "function") {
            try {
              // Call the completion callback with empty args (discovery mode)
              const results = await callback.call(this, []);
              const resultArray = Array.isArray(results) ? results : [results];

              // ✅ POST-PROCESSING: Format values for better UX
              // 1. Color values bright cyan (matching shell completion style)
              // 2. Add double newline for clean separation from prompt
              const BRIGHT_CYAN = this.colors.toolName;
              const RESET = this.colors.reset;

              if (resultArray.length > 0) {
                // Color each result bright cyan
                const coloredResults = resultArray.map(
                  (val) => `${BRIGHT_CYAN}${val}${RESET}`
                );

                // Add double newline to last element for clean spacing
                const lastIndex = coloredResults.length - 1;
                coloredResults[lastIndex] = coloredResults[lastIndex] + "\n\n";

                return coloredResults;
              }

              return resultArray;
            } catch (error) {
              // If callback fails, return parameter name
              return [paramName];
            }
          }
        }

        // Otherwise return plain name for bash completion
        return [paramName];
      }

      // ✅ DRY FIX: Extract parameters from ALL methods ONCE (not once per parameter!)
      // Cache results to avoid O(parameters × methods) complexity
      const allMethodNames = Array.from(this.methodSignatures.keys()).filter(
        (m) => !m.endsWith("ParameterCompletion")
      );

      // Extract parameters from all methods ONCE (DRY principle)
      // Also cache CLI annotation checks to avoid repeated calls during sort
      const allMethodParams = new Map<string, any[]>();
      const cliMethodsSet = new Set<string>();

      for (const methodName of allMethodNames) {
        const params = this.extractParameterInfoFromTSCompletion(methodName);
        allMethodParams.set(methodName, params);

        // Cache CLI annotation check: method with TSDoc parameters from TSCompletion = CLI method
        // This avoids calling hasCliAnnotations which would re-call getEnhancedMethodParameters
        if (params.length > 0) {
          cliMethodsSet.add(methodName);
        }
      }

      // Sort methods: CLI methods first (they have better metadata)
      const methodNames = allMethodNames.sort((a, b) => {
        const aIsCLI = cliMethodsSet.has(a);
        const bIsCLI = cliMethodsSet.has(b);
        if (aIsCLI && !bIsCLI) return -1;
        if (!aIsCLI && bIsCLI) return 1;
        return a.localeCompare(b);
      });

      // Transform: versionParameterCompletion → <?version:'0.1.0.0'>
      // Now use cached parameter data for each parameter
      return filtered.map((callbackName, index) => {
        const paramName = callbackName.replace(/ParameterCompletion$/, "");

        let paramSyntax = `<${paramName}>`; // Default: required parameter
        let bestParam: any = null;

        // Search cached method parameters (no repeated extraction!)
        // Prefer optional parameters with defaults over required ones
        for (const methodName of methodNames) {
          const params = allMethodParams.get(methodName)!; // Cached lookup
          const param = params.find((p) => p.name === paramName);

          if (param) {
            if (!bestParam) {
              bestParam = { param, methodName };
            }
            // If we found an optional parameter with default, prefer it
            if (!param.required && param.default) {
              bestParam = { param, methodName };
              break; // Found ideal match - optional with default
            }
          }
        }

        if (bestParam) {
          paramSyntax = this.generateParameterSyntax(
            bestParam.param,
            bestParam.methodName
          );
        }

        return `${BRIGHT_CYAN}${
          index + 1
        }:${RESET} ${BRIGHT_YELLOW}${paramSyntax}${RESET}`;
      });
    } else {
      // what === 'method' - Use methodSignatures for ALL methods (including @cliHide)
      // Discovery tool should show hidden methods for debugging/development
      const allMethodNames = Array.from(this.methodSignatures.keys());
      let filtered = allMethodNames
        .filter((name) => !name.endsWith("ParameterCompletion"))
        .filter((name) => name !== "completeParameter")
        .filter((name) => name !== "execute")
        .filter((name) => name !== "start")
        .sort();

      // Apply prefix filtering if provided
      if (filterPrefix) {
        filtered = filtered.filter((name) => name.startsWith(filterPrefix));
      }

      // ✅ SINGLE MATCH: Auto-complete if only one method matches
      // Standard shell behavior: one match = complete it, multiple = show list
      if (filtered.length === 1) {
        const methodName = filtered[0];

        // ✅ SHOW DOCUMENTATION: Display TSDoc for discovered method
        // Get method documentation from TSCompletion
        const componentClassName = this.getComponentClass()?.name;
        const fullMethodDoc = TSCompletion.getMethodDoc(
          componentClassName,
          methodName
        );

        if (fullMethodDoc) {
          // Format documentation with full signature and green TSDoc
          const BRIGHT_CYAN = this.colors.toolName;
          const BRIGHT_WHITE_BOLD = this.colors.sections;
          const BRIGHT_YELLOW = this.colors.parameters;
          const GREEN = this.colors.descriptions;
          const RESET = this.colors.reset;

          // Extract parameters for full signature
          const parameters =
            this.extractParameterInfoFromTSCompletion(methodName);

          // Build full colored signature (method name + parameters)
          const isCLIMethod = this.hasCliAnnotations(methodName);
          const methodColor = isCLIMethod ? BRIGHT_WHITE_BOLD : "";

          let signature = `${methodColor}${methodName}${RESET}`;
          if (parameters && parameters.length > 0) {
            const paramList = parameters
              .map((p: any) => {
                return this.generateParameterSyntax(p, methodName);
              })
              .join(" ");
            signature = `${methodColor}${methodName}${RESET} ${BRIGHT_YELLOW}${paramList}${RESET}`;
          }

          // Return: ONE string with embedded newlines for semantic structure
          // formatCompletionOutput adds DISPLAY: prefix, bash printf handles \n
          const separator = `${BRIGHT_CYAN}${"─".repeat(60)}${RESET}`;
          const header = `${BRIGHT_WHITE_BOLD}📖 Documentation:${RESET}`;
          const greenDoc = `${GREEN}${fullMethodDoc}${RESET}`;

          // Single string with \n - preserves semantic structure without artificial array splits
          return [`${signature}\n${separator}\n${header}\n${greenDoc}\n`];
        }

        return [methodName]; // Plain method name for bash completion
      }

      // Generate full CLI signatures using extractParameterInfoFromTSCompletion (with color coding)
      return filtered.map((methodName, index) => {
        // Extract parameters for this method
        const parameters =
          this.extractParameterInfoFromTSCompletion(methodName);

        // Check if method has CLI annotations for visual distinction
        const isCLIMethod = this.hasCliAnnotations(methodName);
        const methodColor = isCLIMethod ? BRIGHT_WHITE_BOLD : ""; // CLI methods: bright white bold, internal: plain

        // ✅ SEARCH HIGHLIGHTING: Highlight filter prefix in red
        const RED = this.colors.red;
        let displayName = methodName;
        if (
          filterPrefix &&
          methodName.toLowerCase().startsWith(filterPrefix.toLowerCase())
        ) {
          // Split: prefix (red) + rest (normal method color)
          const prefix = methodName.substring(0, filterPrefix.length);
          const rest = methodName.substring(filterPrefix.length);
          displayName = `${RED}${prefix}${RESET}${methodColor}${rest}${RESET}`;
        } else {
          displayName = `${methodColor}${methodName}${RESET}`;
        }

        if (parameters && parameters.length > 0) {
          // Build parameter list using auto-discovery
          const paramList = parameters
            .map((p: any) => {
              return this.generateParameterSyntax(p, methodName);
            })
            .join(" ");
          // Color scheme: number (bright cyan), search term (red), method name (bright white bold for CLI, plain for internal), parameters (bright yellow)
          return `${BRIGHT_CYAN}${
            index + 1
          }:${RESET} ${displayName} ${BRIGHT_YELLOW}${paramList}${RESET}`;
        }
        // No parameters - just method name
        return `${BRIGHT_CYAN}${index + 1}:${RESET} ${displayName}`;
      });
    }
  }

  /**
   * Find project root using git (Web4 standard pattern)
   * Fallback to directory traversal if not in git repo
   * 
   * CRITICAL: Must distinguish between:
   * - Project root: has .git + package.json + components/ directory
   * - Component directory: has package.json but is INSIDE components/
   * 
   * @pdca 2025-10-31-UTC-2000.on-context-path-initialization.pdca.md
   * @private
   */
  private findProjectRoot(): string {
    // @pdca 2025-11-03-UTC-1430.pdca.md - Zero Knowledge, Zero Config, Just Scenarios and Models
    // Web4 Principle: NEVER rely on environment variables (use filesystem detection only)
    
    // Traverse up looking for .git, package.json, AND components/ directory
    // This distinguishes project root from component directory
    let current = process.cwd();
    while (current !== "/") {
      if (
        existsSync(join(current, ".git")) &&
        existsSync(join(current, "package.json")) &&
        existsSync(join(current, "components"))  // ← CRITICAL: Project root has components/
      ) {
        return current;
      }
      current = join(current, "..");
    }

    // Last resort: current working directory
    return process.cwd();
  }

  /**
   * Get current component context from working directory
   *
   * Replaces shell detect_component_context() function.
   * TypeScript-first approach: NO environment variables!
   *
   * Migration: Replaces WEB4_COMPONENT_* ENV vars.
   * See: 2025-10-10-UTC-1002.pdca.md
   *
   * @param format Output format: 'json' (default) or 'bash'
   * @returns Component context information
   * @example
   *   web4tscomponent getContext
   *   web4tscomponent getContext bash
   */
  async getContext(format: string = "json"): Promise<void> {
    const cwd = process.cwd();
    const projectRoot = this.findProjectRoot();

    // Check if in component directory
    const componentsDir = join(projectRoot, "components");
    if (!cwd.startsWith(componentsDir)) {
      if (format === "bash") {
        console.log('export WEB4_COMPONENT_CONTEXT="false"');
      } else {
        console.log(
          JSON.stringify(
            {
              context: false,
              message: "Not in component directory",
              cwd,
              projectRoot,
            },
            null,
            2
          )
        );
      }
      return;
    }

    // Parse component path: .../components/ComponentName/version
    const relative = cwd.replace(componentsDir + "/", "");
    const parts = relative.split("/");

    if (parts.length < 2) {
      if (format === "bash") {
        console.log('export WEB4_COMPONENT_CONTEXT="false"');
      } else {
        console.log(
          JSON.stringify(
            {
              context: false,
              message: "Invalid component path (need ComponentName/version)",
              cwd,
              projectRoot,
            },
            null,
            2
          )
        );
      }
      return;
    }

    const [componentName, version, ...rest] = parts;
    const componentRoot = join(componentsDir, componentName, version);

    if (format === "bash") {
      // Legacy bash export format (for backwards compat if needed)
      console.log(`export WEB4_COMPONENT_CONTEXT="true"`);
      console.log(`export WEB4_COMPONENT_NAME="${componentName}"`);
      console.log(`export WEB4_COMPONENT_VERSION="${version}"`);
      console.log(`export WEB4_COMPONENT_ROOT="${componentRoot}"`);
    } else {
      // Modern JSON format (default)
      console.log(
        JSON.stringify(
          {
            context: true,
            componentName,
            version,
            componentRoot,
            projectRoot,
            subdirectory: rest.length > 0 ? rest.join("/") : null,
          },
          null,
          2
        )
      );
    }
  }

  /**
   * Tab completion for component parameter of 'on' command
   * NOTE: Implemented in base CLI for all Web4 components
   * @cliHide
   */
  async componentParameterCompletion(): Promise<string[]> {
    // Use model-driven project root (CLI calculated it already!)
    const projectRoot = this.model.projectRoot;
    const { readdirSync, lstatSync, existsSync } = await import("fs");
    const { join } = await import("path");

    try {
      const componentsDir = join(projectRoot, "components");
      const entries = readdirSync(componentsDir);
      const components: string[] = [];

      for (const entry of entries) {
        const entryPath = join(componentsDir, entry);
        try {
          const stats = lstatSync(entryPath);
          if (stats.isDirectory()) {
            components.push(entry);
          }
        } catch {
          // Skip entries we can't stat
        }
      }

      return components.sort();
    } catch {
      return [];
    }
  }

  /**
   * Tab completion for version parameter of 'on' command
   * NOTE: Implemented in base CLI for all Web4 components
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   * 
   * @cliHide
   */
  async versionParameterCompletion(): Promise<string[]> {
    // Extract component name from model state
    // Format: ['web4tscomponent', 'on', 'ComponentName', '']
    const componentName = this.model.completionCompWords[2];

    if (!componentName) {
      return ["latest", "dev", "test", "prod"];
    }

    // Use model-driven project root (CLI calculated it already!)
    const projectRoot = this.model.projectRoot;
    const { readdirSync, existsSync } = await import("fs");
    const { join } = await import("path");

    try {
      const componentDir = join(projectRoot, "components", componentName);
      const entries = readdirSync(componentDir);
      const versions: string[] = ["latest", "dev", "test", "prod"];

      for (const entry of entries) {
        // Add semantic version directories
        if (entry.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          versions.push(entry);
        }
      }

      // Simple sort: semantic links first, then versions descending
      return versions.sort((a, b) => {
        const semanticOrder = ["latest", "prod", "test", "dev"];
        const aIdx = semanticOrder.indexOf(a);
        const bIdx = semanticOrder.indexOf(b);

        if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
        if (aIdx >= 0) return -1;
        if (bIdx >= 0) return 1;

        // Both are versions - sort descending
        return b.localeCompare(a, undefined, { numeric: true });
      });
    } catch {
      return ["latest", "dev", "test", "prod"];
    }
  }

  /**
   * Tab completion for scope parameter of 'test' command
   * Returns available test scopes: file, describe, itCase
   * Note: 'all' is the default (runs full suite), not needed in tab completion
   *
   * ENHANCED: When command is 'test', also output one-line documentation
   * like the 'links' command does, to help users understand test command
   *
   * RADICAL OOP: Uses this.model.completionCommand, NOT passed parameters
   *
   * @cliHide
   */
  async scopeParameterCompletion(): Promise<string[]> {
    const scopes = ["file", "describe", "itCase"];

    // Check if we're completing for the 'test' command (from model state!)
    if (this.model.completionCommand === "test") {
      // Output ONE LINE documentation BEFORE the parameter options
      // This helps users understand what 'test' does while seeing parameter options
      const GREEN = this.colors.descriptions;
      const YELLOW = this.colors.parameters;
      const RESET = this.colors.reset;

      // MUST use process.stdout.write (not console.log) because bash completion
      // filters stderr - only stdout is captured and displayed
      process.stdout.write(
        `${GREEN}1: test <?scope:'all'> <references> - Execute test command - runs tests WITHOUT promotion${RESET}\n`
      );
      process.stdout.write(
        `${GREEN}   Use releaseTest() for version promotion workflow${RESET}\n`
      );
      process.stdout.write(
        `${GREEN}   Modes: all (full suite), file (specific file), describe (describe block), itCase (specific test)${RESET}\n\n`
      );
      process.stdout.write(`${YELLOW}<?scope:'all'>${RESET}\n`);
    }

    return scopes;
  }

  /**
   * Completion for targetDir parameter
   * Returns: resolved project root path (from §) and test/data (for test isolation)
   * @cliHide
   */
  async targetDirParameterCompletion(): Promise<string[]> {
    // Get enum values from @cliValues annotation (§ and test/data)
    const values = this.enumParameterCompletion("targetDir");

    // Resolve § to actual project root path for tab completion
    return values.map((value) => {
      if (value === "§") {
        return this.findProjectRoot();
      }
      return value;
    });
  }

  /**
   * Tab completion for targetVersion parameter of 'setCICDVersion' command
   * Returns available semantic links: dev, latest, prod, test
   * @cliHide
   */
  async targetVersionParameterCompletion(): Promise<string[]> {
    return ["dev", "latest", "prod", "test"];
  }

  /**
   * Tab completion for versionPromotion parameter
   * Provides semantic version increment options
   * Used by: upgrade, releaseTest
   * @cliHide
   */
  async versionPromotionParameterCompletion(): Promise<string[]> {
    return ["nextBuild", "nextMinor", "nextMajor", "nextPatch"];
  }

  /**
   * Tab completion for references parameter of 'test' command (file scope)
   * Returns numbered list of test files when scope is 'file'
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   * 
   * @cliHide
   */
  async referencesParameterCompletion(): Promise<string[]> {
    // Extract scope from model state (CLI already parsed it into completionCompWords)
    // Format: ['web4tscomponent', 'test', 'file|describe|itCase', '']
    const scope = this.model.completionCompWords[2];

    if (scope === "file") {
      return this.getTestFileReferences();
    } else if (scope === "describe") {
      return this.getTestDescribeReferences();
    } else if (scope === "itCase") {
      return this.getTestItCaseReferences();
    }

    return [];
  }

  /**
   * Get test file references for completion
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   * 
   * @cliHide
   */
  private async getTestFileReferences(): Promise<string[]> {
    const { TestFileParser } = await import("../layer4/TestFileParser.js");
    const { HierarchicalCompletionFilter } = await import(
      "../layer4/HierarchicalCompletionFilter.js"
    );
    const { existsSync } = await import("fs");

    // Use DRY helper to get test directory
    const testDir = this.getTestDir();

    if (!existsSync(testDir)) {
      return [];
    }

    // Get all files in hierarchical format with tokens
    const result = TestFileParser.getAllFilesHierarchical(testDir);

    // Apply DRY Web4 filtering pattern (extract filter prefix from model)
    // Format: ['web4tscomponent', 'test', 'file', '']
    const filterPrefix = this.model.completionCompWords[3] || "";
    const fileTokenPattern = /^(\d+):/; // Pattern to match file tokens in display like "1:", "17:"

    return HierarchicalCompletionFilter.applyPrefixFilter(
      result,
      filterPrefix,
      fileTokenPattern
    );
  }

  /**
   * Get test describe references for completion
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   * 
   * @cliHide
   */
  private async getTestDescribeReferences(): Promise<string[]> {
    const { TestFileParser } = await import("../layer4/TestFileParser.js");
    const { existsSync } = await import("fs");

    // Use DRY helper to get test directory
    const testDir = this.getTestDir();

    if (!existsSync(testDir)) {
      return [];
    }

    // Get all describes in hierarchical format with tokens
    const result = TestFileParser.getAllDescribesHierarchical(testDir);

    // Check if there's a filter prefix from model (e.g., '1a' from 'test describe 1a')
    // Format: ['web4tscomponent', 'test', 'describe', '1a']
    const filterPrefix = this.model.completionCompWords[3] || "";

    if (filterPrefix) {
      // Filter tokens that start with the prefix
      const filteredTokens = result.tokens.filter((token) =>
        token.startsWith(filterPrefix)
      );

      if (filteredTokens.length === 0) {
        // No matches - return empty
        return [];
      }

      // Filter the display lines to show only matching entries
      const filteredDisplay: string[] = [];
      const displayLines = result.display;

      for (let i = 0; i < displayLines.length; i++) {
        const line = displayLines[i];

        // Find file context for this line
        const fileContext = this.findFileContext(displayLines, i);

        // Strip ANSI escape codes for pattern matching
        const cleanLine = line.replace(/\x1B\[[0-9;]*m/g, "");

        // Check if this line represents a describe block
        const describeMatch = cleanLine.match(/^\s+([a-z])\)/);
        if (describeMatch && fileContext) {
          const fullToken = `${fileContext}${describeMatch[1]}`;

          if (filteredTokens.includes(fullToken)) {
            // Add file header if not already added
            const fileHeaderPattern = new RegExp(`^${fileContext}:\\s`);
            const fileHeaderIndex = displayLines.findIndex((l) => {
              const cleanL = l.replace(/\x1B\[[0-9;]*m/g, "");
              return fileHeaderPattern.test(cleanL);
            });
            if (
              fileHeaderIndex !== -1 &&
              !filteredDisplay.includes(displayLines[fileHeaderIndex])
            ) {
              filteredDisplay.push(displayLines[fileHeaderIndex]);
            }

            // Add the matching describe line
            filteredDisplay.push(line);
          }
        }
      }

      return [filteredDisplay.join("\n")];
    }

    // OOSH Pattern: Return hierarchical display for bash printf + token extraction
    return result.display;
  }

  /**
   * Find the file number context for a describe line
   */
  private findFileContext(
    displayLines: string[],
    currentIndex: number
  ): string | null {
    // Look backwards for the most recent file header
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = displayLines[i];
      const cleanLine = line.replace(/\x1B\[[0-9;]*m/g, "");
      const fileMatch = cleanLine.match(/^(\d+):/);
      if (fileMatch) {
        return fileMatch[1];
      }
    }
    return null;
  }

  /**
   * Get test it case references for completion
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   * 
   * @cliHide
   */
  private async getTestItCaseReferences(): Promise<string[]> {
    const { TestFileParser } = await import("../layer4/TestFileParser.js");
    const { HierarchicalCompletionFilter } = await import(
      "../layer4/HierarchicalCompletionFilter.js"
    );
    const { existsSync } = await import("fs");

    // Use DRY helper to get test directory
    const testDir = this.getTestDir();

    if (!existsSync(testDir)) {
      return [];
    }

    // Get all it cases in hierarchical format with tokens
    const result = TestFileParser.getAllItCasesHierarchical(testDir);

    // Apply DRY Web4 filtering pattern (extract filter prefix from model)
    // Format: ['web4tscomponent', 'test', 'itCase', '1a1']
    const filterPrefix = this.model.completionCompWords[3] || "";
    const itCaseTokenPattern = /(\d+[a-z]\d+)\)/; // Pattern to match it case tokens like "1a1)", "17b2)"

    return HierarchicalCompletionFilter.applyPrefixFilter(
      result,
      filterPrefix,
      itCaseTokenPattern
    );
  }

  /**
   * Tab completion for describe reference parameter of 'test' command
   * Returns numbered list of describe blocks from selected test file
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   * 
   * @cliHide
   */
  async testDescribeReferenceParameterCompletion(): Promise<string[]> {
    const { TestFileParser } = await import("../layer4/TestFileParser.js");
    const { existsSync } = await import("fs");

    // Extract file number from model: ['web4tscomponent', 'test', 'describe', '2', ...]
    const scope = this.model.completionCompWords[2];
    const fileNumStr = this.model.completionCompWords[3];

    if (!fileNumStr || scope !== "describe") {
      return [];
    }

    const fileNum = parseInt(fileNumStr, 10);
    if (isNaN(fileNum)) {
      return [];
    }

    // Use DRY helper to get test directory
    const testDir = this.getTestDir();

    if (!existsSync(testDir)) {
      return [];
    }

    // Get test files and target file
    const testFiles = TestFileParser.scanTestFiles(testDir);
    const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);

    if (!targetFile) {
      return [];
    }

    // Parse describe blocks
    const describes = TestFileParser.parseDescribeBlocks(
      targetFile.absolutePath
    );
    return TestFileParser.formatDescribesForCompletion(describes);
  }

  /**
   * Tab completion for it case reference parameter of 'test' command
   * Returns numbered list of it cases from selected describe block
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   * 
   * @cliHide
   */
  async testItCaseReferenceParameterCompletion(): Promise<string[]> {
    const { TestFileParser } = await import("../layer4/TestFileParser.js");
    const { existsSync } = await import("fs");

    // Extract file and describe numbers from model: ['web4tscomponent', 'test', 'itCase', '2', '1', ...]
    const scope = this.model.completionCompWords[2];
    const fileNumStr = this.model.completionCompWords[3];
    const describeNumStr = this.model.completionCompWords[4];

    if (!fileNumStr || !describeNumStr || scope !== "itCase") {
      return [];
    }

    const fileNum = parseInt(fileNumStr, 10);
    const describeNum = parseInt(describeNumStr, 10);

    if (isNaN(fileNum) || isNaN(describeNum)) {
      return [];
    }

    // Use DRY helper to get test directory
    const testDir = this.getTestDir();

    if (!existsSync(testDir)) {
      return [];
    }

    // Get test files and target file
    const testFiles = TestFileParser.scanTestFiles(testDir);
    const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);

    if (!targetFile) {
      return [];
    }

    // Parse it cases for the specific describe block
    const itCases = TestFileParser.parseItCases(
      targetFile.absolutePath,
      describeNum - 1
    );
    return TestFileParser.formatItCasesForCompletion(itCases);
  }

  /**
   * Complete component names for create command
   * Provides suggestions for new component names based on common patterns
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   */
  async nameParameterCompletion(): Promise<string[]> {
    // Suggest common component name patterns
    const suggestions = [
      "UserManager",
      "DataProcessor",
      "FileHandler",
      "ConfigManager",
      "ServiceClient",
      "EventHandler",
      "ApiConnector",
      "DatabaseManager",
      "CacheManager",
      "LoggingService",
    ];

    // Extract filter prefix from model: ['web4tscomponent', 'create', 'User', ...]
    const filterPrefix = this.model.completionCompWords[2] || "";
    if (filterPrefix) {
      const filtered = suggestions.filter((name) =>
        name.toLowerCase().startsWith(filterPrefix.toLowerCase())
      );
      return filtered.length > 0 ? filtered : suggestions;
    }

    return suggestions;
  }

  /**
   * Complete options parameter for create command
   * Provides feature option suggestions
   * 
   * RADICAL OOP: Uses this.model.completionCompWords, NOT passed parameters
   */
  async optionsParameterCompletion(): Promise<string[]> {
    const allOptions = [
      "all", // All features (recommended)
      "cli", // CLI only
      "spec", // Specification folder
      "vitest", // Testing framework
      "layers", // Layer architecture
      "cli layers", // CLI + layers
      "cli spec", // CLI + spec
      "cli vitest", // CLI + vitest
      "spec vitest", // Spec + vitest
      "layers vitest", // Layers + vitest
      "cli spec vitest", // CLI + spec + vitest
      "layers spec vitest", // Layers + spec + vitest
    ];

    // Extract filter from model - could be at different positions depending on command context
    // Format: ['web4tscomponent', 'create', 'ComponentName', 'all', ...]
    const filterPrefix = this.model.completionCompWords[4] || this.model.completionCompWords[3] || this.model.completionCompWords[2] || "";
    if (filterPrefix) {
      const filtered = allOptions.filter(
        (option) =>
          option.toLowerCase().includes(filterPrefix.toLowerCase()) ||
          option.startsWith(filterPrefix)
      );
      return filtered.length > 0 ? filtered : allOptions;
    }

    return allOptions;
  }
}

// MethodSignature interface moved to layer3/MethodSignature.interface.ts (imported above)
