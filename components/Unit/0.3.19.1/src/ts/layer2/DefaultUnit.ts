/**
 * DefaultUnit - Unit Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Unit } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { User } from '../layer3/User.interface.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import * as path from 'path'; // @pdca 2025-11-11-UTC-0003 - For updateModelPaths()

export class DefaultUnit implements Unit {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model: UnitModel;
  private cli?: any; // CLI back-reference for path authority - @pdca 2025-11-11-UTC-0003
  private web4ts?: any; // Lazy-initialized Web4TSComponent for delegation (dynamic import, no static dependency)
  private user?: User; // Optional User service (lazy initialization) - @pdca 2025-11-03-1135.pdca.md
  private methods: Map<string, MethodSignature> = new Map(); // @pdca 2025-11-05-UTC-2301 - Match Web4TSComponent type

  constructor() {
    // Empty constructor - Web4 pattern
    // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Initialize with component name for CLI display
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      component: 'Unit',  // For CLI display
      version: '0.3.19.1'             // Component version
    };
  }

  /**
   * Check if method exists (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  hasMethod(name: string): boolean {
    return this.methods.has(name);
  }
  
  /**
   * Get method signature (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  getMethodSignature(name: string): MethodSignature | null {
    return this.methods.get(name) || null;
  }
  
  /**
   * List all method names (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  listMethods(): string[] {
    return Array.from(this.methods.keys());
  }

  /**
   * Discover public methods for CLI completion
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  private discoverMethods(): void {
    const prototype = Object.getPrototypeOf(this);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter((name) => typeof prototype[name] === "function")
      .filter((name) => !name.startsWith("_") && name !== "constructor")
      .filter((name) => !["init", "toScenario", "hasMethod", "getMethodSignature", "listMethods", "discoverMethods"].includes(name));

    for (const methodName of methodNames) {
      const method = prototype[methodName];
      this.methods.set(methodName, {
        name: methodName,
        paramCount: method.length,
        isAsync: method.constructor.name === "AsyncFunction",
      });
    }
  }

  /**
   * Get CLI back-reference for path authority
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md - CLI back-reference pattern
   * @cliHide
   */
  getCLI(): any {
    if (!this.cli) {
      throw new Error('Unit: CLI back-reference not set. Call setCLI() from UnitCLI.');
    }
    return this.cli;
  }

  /**
   * Set CLI back-reference for path authority
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md - CLI back-reference pattern
   * @cliHide
   */
  setCLI(cli: any): this {
    this.cli = cli;
    return this;
  }

  /**
   * Get the target unit instance for operations
   * Single source of truth for context resolution (Radical OOP principle)
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
   * @pdca 2025-11-10-UTC-1010.pdca.md - Pattern from Web4TSComponent 0.3.19.1
   * @cliHide
   */
  protected getTarget(): DefaultUnit {
    return (this.model.context as DefaultUnit) || this;
  }

  /**
   * Update model paths after context/scenario loading
   * Path Authority: CLI is sole authority for path calculations
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
   * @pdca 2025-11-07-UTC-0000 - Pattern from Web4TSComponent 0.3.19.1
   * @cliHide
   */
  private updateModelPaths(): void {
    // ✅ Copy context data to THIS model if in delegation mode
    if (this.model.context) {
      this.model.component = this.model.context.model.component;
      this.model.version = this.model.context.model.version;
    }
    
    const cli = this.getCLI();
    
    // Calculate projectRoot from componentRoot if not set
    if (!this.model.projectRoot && this.model.componentRoot) {
      this.model.projectRoot = path.dirname(path.dirname(path.dirname(this.model.componentRoot)));
    }
    if (!this.model.targetDirectory && this.model.projectRoot) {
      this.model.targetDirectory = this.model.projectRoot;
    }
    if (!this.model.componentsDirectory && this.model.targetDirectory) {
      this.model.componentsDirectory = path.join(this.model.targetDirectory, 'components');
    }
    
    // Calculate TARGET component root using CLI's path authority
    if (this.model.component && this.model.version && cli.model.componentsDirectory) {
      this.model.targetComponentRoot = path.join(
        cli.model.componentsDirectory,
        this.model.component,
        this.model.version
      );
    }
  }

  /**
   * Lazy initialization of User service for owner data generation
   * NOT a build dependency - warns if unavailable, continues with fallback
   * @pdca 2025-11-03-1135.pdca.md - User service integration pattern
   * @cliHide
   */
  private async getUser(): Promise<User> {
    if (this.user) return this.user;
    
    try {
      // Dynamic ESM import - fails gracefully if User not available
      // @ts-ignore - Optional dependency, path resolved at runtime
      const userModule = await import('../../User/latest/dist/ts/layer2/DefaultUser.js');
      const { DefaultUser } = userModule;
      
      // Initialize User with empty constructor (uses system/localhost defaults)
      this.user = new DefaultUser();
      
      return this.user!; // Non-null assertion: we just assigned it
    } catch (error) {
      // User service not available - throw for caller to handle fallback
      throw new Error('User service not available');
    }
  }

  /**
   * Lazy initialization of Web4TSComponent for delegation (DRY principle)
   * Dynamic imports resolve paths at runtime, enabling location-independent operation
   * @cliHide
   */
  private async getWeb4TSComponent(): Promise<any> {
    if (this.web4ts) return this.web4ts;

    const path = await import('path');
    const url = new URL(import.meta.url);
    const __filename = url.pathname;
    const componentRoot = path.resolve(path.dirname(__filename), '../../..');

    // @pdca 2025-11-10-UTC-1230.test-isolation-path-pollution-analysis.pdca.md
    // Web4 Principle: Detect project root correctly for test isolation
    // Component path: .../test/data/components/ComponentName/0.1.0.0
    // OR: .../components/ComponentName/0.1.0.0
    // Project root is 2 levels up from component directory
    // (ComponentName/ and components/)
    const componentsDir = path.dirname(path.dirname(componentRoot)); // Go up 2: version → component → components
    const projectRoot = path.dirname(componentsDir); // Go up 1 more: components → project root
    
    // @pdca 2025-11-10-UTC-1230.test-isolation-path-pollution-analysis.pdca.md
    // Web4 Principle: Detect test isolation from model paths, NOT environment variables
    // Test isolation: projectRoot contains '/test/data'
    const isTestIsolation = projectRoot.includes('/test/data');
    
    // @pdca 2025-11-10-UTC-1010.pdca.md - Set THIS component's paths for delegation
    // When Web4TSComponent reads context, it needs to know THIS component's paths
    this.model.componentRoot = componentRoot;
    this.model.projectRoot = projectRoot;
    this.model.targetDirectory = projectRoot;
    this.model.targetComponentRoot = componentRoot;
    this.model.isTestIsolation = isTestIsolation;

    // Import Web4TSComponent and SemanticVersion dynamically
    const web4tscomponentModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js`
    );
    const semanticVersionModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/SemanticVersion.js`
    );
    const { DefaultWeb4TSComponent } = web4tscomponentModule;
    const { SemanticVersion } = semanticVersionModule;

    // ✅ CRITICAL: Initialize Web4TSComponent for delegation
    // @pdca 2025-11-03-UTC-1237.pdca.md - Full delegation initialization
    // @pdca 2025-11-04-UTC-1630.pdca.md - Added projectRoot for version display fix
    // @pdca 2025-11-10-UTC-1010.pdca.md - DO NOT override component identity!
    // Web4TSComponent must retain its own identity ('Web4TSComponent')
    // The delegating component's identity will be set via context in delegateToWeb4TS()
    this.web4ts = new DefaultWeb4TSComponent().init({
      model: {
        // DO NOT set 'component' here - let Web4TSComponent keep its own identity
        version: await SemanticVersion.fromString(this.model.version || '0.0.0.0'), // THIS component's version
        componentRoot: componentRoot,              // THIS component's root directory
        projectRoot: projectRoot,                  // Project root for Path Authority (version display needs this)
        targetDirectory: projectRoot               // Project root for path authority
      }
    });

    return this.web4ts;
  }

  /**
   * ✅ REMOVED: delegateToWeb4TS() helper method
   * 
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
   * 
   * This method is NO LONGER NEEDED! DelegationProxy automatically intercepts
   * missing method calls and delegates them to Web4TSComponent with proper context.
   * 
   * The old pattern was:
   *   private async delegateToWeb4TS(method, ...args) { ... }
   * 
   * The new pattern is:
   *   DelegationProxy.start(component) wraps the component in a Proxy
   *   that automatically delegates missing methods.
   * 
   * Benefits:
   *   - Zero boilerplate in generated components
   *   - Automatic delegation of ALL Web4TSComponent methods
   *   - DRY: delegation logic is in ONE place (DelegationProxy)
   */

  /**
   * @cliHide
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * ✅ RADICAL OOP: Component knows ONLY its own methods
   */
  async init(scenario?: Scenario<UnitModel>): Promise<this> {
    if (scenario?.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    
    // Discover OWN methods only (Radical OOP)
    this.discoverMethods();
    
    // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
    // ❌ REMOVED: Component should NOT discover delegated methods
    // ✅ RADICAL OOP: CLI discovers delegated methods separately via getDelegationTarget()
    // Component knows ONLY its own methods (create, process, completion)
    
    // ✅ Path Authority: Calculate all paths after initialization
    // @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
    this.updateModelPaths();
    
    return this;
  }

  /**
   * @cliHide
   * @pdca 2025-11-03-1135.pdca.md - Use User service with fallback pattern
   */
  async toScenario(name?: string): Promise<Scenario<UnitModel>> {
    // ✅ RADICAL OOP: Generate owner data using User.toScenario() (Web4 component interface)
    let ownerData: string;
    try {
      // Try to use User service if available (NOT a build dependency)
      const user = await this.getUser();
      
      // ✅ Use User component's toScenario() - universal Web4 interface
      const userScenario = await user.toScenario();
      
      // ✅ Owner data IS the entire User scenario serialized
      const ownerJson = JSON.stringify(userScenario);
      
      ownerData = Buffer.from(ownerJson).toString('base64');
    } catch (error) {
      // ✅ Fallback: Generate minimal User-like scenario without User service
      const fallbackJson = JSON.stringify({
        ior: {
          uuid: this.model.uuid,
          component: 'User',
          version: '0.0.0.0',
          timestamp: new Date().toISOString()
        },
        owner: '',  // No nested owner in fallback
        model: {
          user: process.env.USER || 'system',
          hostname: process.env.HOSTNAME || 'localhost',
          uuid: this.model.uuid,
          component: 'Unit',
          version: '0.3.19.1'
        }
      });
      ownerData = Buffer.from(fallbackJson).toString('base64');
    }

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Unit',
        version: '0.3.19.1'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Get current scenario (Radical OOP getter pattern)
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
   * @cliHide
   */
  async getScenario(name?: string): Promise<Scenario<UnitModel>> {
    return this.toScenario(name);
  }

  /**
   * Validate Unit model structure
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
   * @cliHide
   */
  async validateModel(): Promise<this> {
    // Comprehensive UnitModel validation
    try {
      // Required string properties
      if (!this.model.uuid || typeof this.model.uuid !== 'string') throw new Error('Invalid uuid');
      if (!this.model.name || typeof this.model.name !== 'string') throw new Error('Invalid name');
      if (!this.model.origin || typeof this.model.origin !== 'string') throw new Error('Invalid origin');
      if (!this.model.definition || typeof this.model.definition !== 'string') throw new Error('Invalid definition');
      
      // Timestamp validation
      if (!this.model.createdAt || isNaN(Date.parse(this.model.createdAt))) throw new Error('Invalid createdAt');
      if (!this.model.updatedAt || isNaN(Date.parse(this.model.updatedAt))) throw new Error('Invalid updatedAt');
      
      return this; // ✅ Method chaining
    } catch (error) {
      throw new Error(`Unit model validation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get model (testing/debugging helper)
   * @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
   * @cliHide
   */
  getModel(): UnitModel {
    return this.model;
  }

  /**
   * Create example operation for Unit
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ Unit operation completed`);
    return this;
  }

  /**
   * Process data through Unit logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * ✅ REMOVED: Explicit delegation methods (info, test, build, clean, tree, links)
   * 
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
   * 
   * These methods are now automatically delegated via DelegationProxy.
   * No need for explicit boilerplate!
   * 
   * Proxy pattern intercepts missing methods and delegates them to Web4TSComponent
   * with proper context, display properties, and test isolation awareness.
   * 
   * Methods automatically delegated:
   * - info(topic)           - Show component information
   * - test(scope, ...refs)  - Run tests with auto-promotion
   * - build()               - Build component
   * - clean()               - Clean build artifacts
   * - tree(depth, hidden)   - Show directory structure
   * - links(action)         - Show/manage version links
   * - upgrade(version)      - Upgrade component version
   * - ... and any future Web4TSComponent methods!
   */

  /**
   * Test and discover tab completions for debugging and development
   * @param what Type of completion to test: "method" or "parameter"
   * @param filter Optional prefix to filter results (e.g., "v" shows only validate*, verify*, etc.)
   * @cliSyntax what filter
   * @cliDefault filter ""
   */
  async completion(what: string, filter?: string): Promise<this> {
    const context = this.getComponentContext();
    
    // OOP: Instantiate own CLI and call completeParameter directly (no shell!)
    const { UnitCLI } = await import('../layer5/UnitCLI.js');
    const cli = new UnitCLI();
    
    if (!context) {
      // No context - test completions on Unit itself
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on Unit${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
      // Call completeParameter directly via OOP (completeParameter is on DefaultCLI)
      await cli.completeParameter('completionNameParameterCompletion', 'completion', what, filter || '');
    } else {
      // Context loaded - delegate to web4tscomponent for target component discovery
      const web4ts = await this.getWeb4TSComponent();
      await web4ts.completion(what, filter);
    }
    
    return this;
  }

  /**
   * @cliHide
   */
  protected getComponentContext(): { component: string; version: string; path: string } | null {
    const context = this.model as any;
    if (context.contextComponent && context.contextVersion && context.contextPath) {
      return {
        component: context.contextComponent,
        version: context.contextVersion,
        path: context.contextPath
      };
    }
    return null;
  }
}
