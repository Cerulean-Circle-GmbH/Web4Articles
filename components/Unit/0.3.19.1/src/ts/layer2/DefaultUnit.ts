/**
 * DefaultUnit - Unit Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Unit } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { UnitReference, SyncStatus } from '../layer3/UnitReference.interface.js';

import { User } from '../layer3/User.interface.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { DefaultStorage } from './DefaultStorage.js'; // @pdca 2025-11-11-UTC-0003 - Storage Service pattern
import { UnitIdentifier, isUUIDv4, isFilePath } from '../layer3/UnitIdentifier.type.js'; // @pdca 2025-11-11-UTC-0003
import * as fs from 'fs/promises';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import * as path from 'path'; // @pdca 2025-11-11-UTC-0003 - For updateModelPaths()

export class DefaultUnit implements Unit {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model: UnitModel;
  private cli?: any; // CLI back-reference for path authority - @pdca 2025-11-11-UTC-0003
  private storage!: DefaultStorage; // @pdca 2025-11-11-UTC-0003 - Storage Service (initialized in init)
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
      indexPath: '',              // Will be set when stored
      references: [],             // Unified reference tracking
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      component: 'Unit',          // For CLI display
      version: '0.3.19.1'         // Component version
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
    
    // ✅ RADICAL OOP: Initialize storage in init(), not constructor
    // @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
    this.storage = new DefaultStorage();
    // Create storage scenario with its own model
    const storageScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Storage', version: '0.3.19.1' },
      owner: '',
      model: { 
        uuid: crypto.randomUUID(), 
        projectRoot: this.model.projectRoot || '', 
        indexBaseDir: '', 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      }
    };
    this.storage.init(storageScenario);
    
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
   * @TODO added manually
   * Display comprehensive unit information with auto-upgrade support
   * Web4 pattern: Auto-discovery CLI method with file loading capability
   * 
   * @param unitFile Optional unit file to load and analyze
   * @cliSyntax unitFile
   * @cliDefault unitFile ""
   * @returns this - Enables command chaining for fluent interface
   * @example
   * ```bash
   * unit info °folder.unit
   * unit on MyComponent 0.1.0.0 info
   * ```
   */
  async info(unitFile?: string): Promise<this> {
    // If unit file specified, load it first (includes auto-upgrade)
    if (unitFile) {
      await this.loadFromUnitFile(unitFile);
    }
    
    const scenario = await this.toScenario();
    
    console.log(`${'\x1b[36m'}═══ Unit Information ═══${'\x1b[0m'}`);
    console.log('');
    
    // Key Information (Highlighted)
    console.log(`${'\x1b[1m'}Name:${'\x1b[0m'}       ${scenario.model.name || '\x1b[90m(not specified)\x1b[0m'}`);
    console.log(`${'\x1b[1m'}TypeM3:${'\x1b[0m'}     ${scenario.model.typeM3 || '\x1b[90m(not classified)\x1b[0m'}`);
    console.log('');
    console.log(`${'\x1b[1m'}Definition:${'\x1b[0m'}`);
    if (scenario.model.definition) {
      console.log(`${scenario.model.definition}`);
    } else {
      console.log(`${'\x1b[90m'}(not specified)${'\x1b[0m'}`);
    }
    console.log('');
    console.log(`${'\x1b[1m'}Origin:${'\x1b[0m'}     ${scenario.model.origin || '\x1b[90m(not specified)\x1b[0m'}`);
    console.log('');
    console.log(`${'\x1b[1m'}References:${'\x1b[0m'} ${scenario.model.references?.length || 0} links`);
    if (scenario.model.references && scenario.model.references.length > 0) {
      scenario.model.references.forEach((ref: any, index: number) => {
        const filename = ref.linkLocation.split('/').pop()?.replace('ior:local:ln:file:', '') || 'unknown';
        const status = ref.syncStatus === 'SYNCED' ? '\x1b[32m●\x1b[0m' : '\x1b[31m●\x1b[0m';
        console.log(`  ${index + 1}. ${status} ${filename} → ${ref.linkTarget}`);
      });
    } else {
      console.log(`    ${'\x1b[90m'}(no references)${'\x1b[0m'}`);
    }
    console.log('');
    
    // Technical Details
    console.log(`${'\x1b[90m'}Technical Details:${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  UUID:       ${scenario.model.uuid}${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  Index Path: ${scenario.model.indexPath || '(not indexed)'}${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  Created:    ${scenario.model.createdAt}${'\x1b[0m'}`);
    console.log(`${'\x1b[90m'}  Updated:    ${scenario.model.updatedAt}${'\x1b[0m'}`);
    
    return this;
  }

  /**
   * @TODO added manually
   * Load unit from .unit file
   * Web4 pattern: File-based scenario loading
   */
  private async loadFromUnitFile(unitFile: string): Promise<void> {
    const cli = this.getCLI();
    // ✅ RADICAL OOP: Use CLI's projectRoot (Path Authority)
    const projectRoot = cli.model.projectRoot || this.model.projectRoot || '';

    const fullPath = path.isAbsolute(unitFile) ? unitFile : path.join(projectRoot, unitFile);
    
    try {
      // Read symlink target to get scenario path
      const scenarioPath = await fs.readlink(fullPath);
      const fullScenarioPath = path.isAbsolute(scenarioPath) ? 
        scenarioPath : 
        path.resolve(path.dirname(fullPath), scenarioPath);
      
      const scenarioContent = await fs.readFile(fullScenarioPath, 'utf-8');
      const scenario = JSON.parse(scenarioContent);
      
      if (scenario.model) {
        this.model = scenario.model;
        
        // Check for version mismatch and auto-upgrade
        const fileVersion = scenario.ior?.version;
        const currentVersion = '0.3.0.5'; // CLI version
        
        if (fileVersion && fileVersion !== currentVersion) {
          console.log(`📈 Auto-upgrading from ${fileVersion} to ${currentVersion}...`);
          if (await this.upgrade(currentVersion)) {
            console.log(`✅ Upgrade successful`);
            // Save upgraded scenario
            const upgradedScenario = await this.toScenario();
            await this.storage.saveScenario(this.model.uuid, upgradedScenario, []);
          } else {
            console.log(`⚠️ Upgrade failed, continuing with original data`);
          }
        }
      } else {
        throw new Error(`Invalid scenario format in unit file: ${unitFile}`);
      }
    } catch (error) {
      throw new Error(`Failed to load unit from file ${unitFile}: ${(error as Error).message}`);
    }
  }

  /**
   * @TODO added manually
   * Upgrade unit model to target version
   * Radical OOP: Method implementation of Upgrade interface
   * Modern TypeScript: ESM imports, type safety, class-based pattern
   */
  async upgrade(targetVersion: string): Promise<boolean> {
    try {
      if (targetVersion === '0.3.0.5') {
        return await this.upgradeToVersion035();
      }
      
      throw new Error(`Unsupported upgrade target version: ${targetVersion}`);
    } catch (error) {
      console.error(`Upgrade failed: ${(error as Error).message}`);
      return false;
    }
  }


  /**
   * @TODO added manually
   * Upgrade from 0.3.0.4 to 0.3.0.5 model
   * Transforms symlinkPaths + namedLinks to unified references array
   * Keeps existing IOR string format for compatibility
   */
  private async upgradeToVersion035(): Promise<boolean> {
    const currentModel = this.model as any; // Cast for 0.3.0.4 compatibility
    
    // Transform to enhanced 0.3.0.5 model
    const enhancedModel: UnitModel = {
      uuid: currentModel.uuid,
      name: currentModel.name,
      origin: currentModel.origin || '',           // ✅ UNCHANGED: IOR string format
      definition: currentModel.definition || '',   // ✅ UNCHANGED: IOR string format
      typeM3: currentModel.typeM3,
      indexPath: currentModel.indexPath,
      
      // ✅ ENHANCED: Transform arrays to unified references
      references: this.transformArraysToReferences(currentModel),
      
      createdAt: currentModel.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Update internal model
    this.model = enhancedModel;
    
    // Save enhanced scenario with version update
    const scenario = await this.toScenario();
    scenario.ior.version = '0.3.0.5';
    await this.storage.saveScenario(this.model.uuid, scenario, []);
    
    console.log(`✅ Unit upgraded to 0.3.0.5: ${this.model.uuid}`);
    return true;
  }  

  /**
   * @TODO added manually
   * Transform old arrays to unified references (0.3.0.4 → 0.3.0.5)
   * Uses existing IOR string format for compatibility
   */
  private transformArraysToReferences(currentModel: any): UnitReference[] {
    const references: UnitReference[] = [];
    
    // Convert symlinkPaths to references
    if (currentModel.symlinkPaths) {
      for (const path of currentModel.symlinkPaths) {
        references.push({
          linkLocation: `ior:local:ln:file:${path}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    // Convert namedLinks to references
    if (currentModel.namedLinks) {
      for (const link of currentModel.namedLinks) {
        const absolutePath = this.resolveLinkPath(link.location, link.filename);
        references.push({
          linkLocation: `ior:local:ln:file:${absolutePath}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    return references;
  }

  /**
   * @TODO added manually
   * Resolve link path from location and filename (0.3.0.4 compatibility)
   */
  private resolveLinkPath(location: string, filename: string): string {
    const baseDir = location.replace('../scenarios/', '/workspace/scenarios/');
    return `${dirname(baseDir)}/${filename}`;
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

  // ==================== BUSINESS LOGIC METHODS ====================
  // @pdca 2025-11-11-UTC-0003.migrate-unit-to-storage-service.pdca.md
  // Phase 4b: Critical CLI Commands Migration

  /**
   * Create unit from source file or directory
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (CLI path authority, method chaining)
   * @cliSyntax filename <?startPos> <?endPos>
   */
  async from(filename: string): Promise<this>;
  async from(filename: string, startPos: string, endPos: string): Promise<this>;
  async from(pathInput: string, startPos?: string, endPos?: string): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    try {
      const cli = this.getCLI();
      // ✅ RADICAL OOP: Use CLI's projectRoot (Path Authority)
      const projectRoot = cli.model.projectRoot || this.model.projectRoot || '';
      const fullPath = path.isAbsolute(pathInput) ? pathInput : path.join(projectRoot, pathInput);
      
      // Check if path is folder or file
      const { promises: fs } = await import('fs');
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        // Create folder atomic element
        await this.createFromFolder(pathInput);
      } else {
        // File functionality
        if (startPos && endPos) {
          // Word-in-file mode: GitTextIOR with positions
          await this.createFromWordInFile(pathInput, startPos, endPos);
        } else {
          // Complete file mode: Simple ior:url reference
          await this.createFromCompleteFile(pathInput);
        }
      }
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      console.error(`Failed to create unit from file: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create unit from word-in-file with GitTextIOR (precise positioning)
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP
   * @cliHide
   */
  private async createFromWordInFile(filename: string, startPos: string, endPos: string): Promise<void> {
    const { promises: fs } = await import('fs');
    const { GitTextIOR } = await import('./GitTextIOR.js');
    
    // Read file content
    const fileContent = await fs.readFile(filename, 'utf-8');
    const lines = fileContent.split('\n');
    
    // Parse positions (line:column format)
    const [startLine, startCol] = startPos.split(':').map(Number);
    const [endLine, endCol] = endPos.split(':').map(Number);
    
    // Extract text from specified range
    let extractedText = '';
    for (let i = startLine - 1; i <= endLine - 1; i++) {
      if (i === startLine - 1 && i === endLine - 1) {
        // Same line
        extractedText = lines[i].substring(startCol - 1, endCol);
      } else if (i === startLine - 1) {
        // Start line
        extractedText += lines[i].substring(startCol - 1) + '\n';
      } else if (i === endLine - 1) {
        // End line
        extractedText += lines[i].substring(0, endCol);
      } else {
        // Middle lines
        extractedText += lines[i] + '\n';
      }
    }
    
    // Extract unit name from text (first word or identifier)
    const nameMatch = extractedText.match(/\b[A-Za-z][A-Za-z0-9_]*\b/);
    const unitName = nameMatch ? nameMatch[0] : 'ExtractedUnit';
    
    // Create GitTextIOR for origin with absolute path
    const gitIOR = new GitTextIOR();
    const absolutePath = path.resolve(filename);
    const relativePath = absolutePath.replace('/workspace/', '');
    const gitUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}#L${startPos}-${endPos}`;
    const originIOR = gitIOR.parse(gitUrl);
    
    // Set terminal identity
    this.setTerminalIdentity(unitName, originIOR, '');
    
    console.log(`✅ Unit created from word-in-file: ${unitName}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin GitTextIOR: ${originIOR}`);
    console.log(`   Extracted from: ${filename} (${startPos}-${endPos})`);
  }

  /**
   * Create unit from complete file with simple ior:url reference
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP
   * @cliHide
   */
  private async createFromCompleteFile(filename: string): Promise<void> {
    const { promises: fs } = await import('fs');
    const { TypeM3 } = await import('../layer3/TypeM3.enum.js');
    
    // Generate simple IOR from file
    const originIOR = await this.generateSimpleIOR(filename);
    
    // Extract file name for unit name
    const fileName = path.basename(filename, path.extname(filename));
    
    // Analyze file type for TypeM3 classification
    const extension = path.extname(filename);
    if (extension === '.ts' || extension === '.js') {
      this.model.typeM3 = TypeM3.CLASS;
    } else if (extension === '.md' || extension === '.txt') {
      this.model.typeM3 = TypeM3.ATTRIBUTE;
    } else {
      this.model.typeM3 = TypeM3.ATTRIBUTE;
    }
    
    // Update unit model
    this.model.name = fileName;
    this.model.origin = originIOR;
    this.model.definition = originIOR; // Same as origin for complete files
    this.model.updatedAt = new Date().toISOString();
    
    // Store unit
    const scenario = await this.toScenario();
    await this.storage.saveScenario(this.model.uuid, scenario, []);
    
    console.log(`✅ Unit created from complete file: ${fileName}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin IOR: ${originIOR}`);
    console.log(`   File: ${filename}`);
    console.log(`   TypeM3: ${this.model.typeM3}`);
  }

  /**
   * Create unit from folder (atomic element)
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP
   * @cliHide
   */
  private async createFromFolder(folderPath: string): Promise<void> {
    const cli = this.getCLI();
    // ✅ RADICAL OOP: Use CLI's projectRoot (Path Authority)
    const projectRoot = cli.model.projectRoot || this.model.projectRoot || '';
    const fullPath = path.isAbsolute(folderPath) ? folderPath : path.join(projectRoot, folderPath);
    
    // Generate simple IOR from folder
    const originIOR = await this.generateSimpleIOR(fullPath);
    
    // Extract folder name for unit name
    const folderName = path.basename(fullPath);
    
    // Update unit model
    this.model.name = folderName;
    this.model.origin = originIOR;
    this.model.definition = originIOR;
    this.model.typeM3 = (await import('../layer3/TypeM3.enum.js')).TypeM3.ATTRIBUTE;
    this.model.updatedAt = new Date().toISOString();
    
    // Store unit
    const scenario = await this.toScenario();
    await this.storage.saveScenario(this.model.uuid, scenario, []);
    
    console.log(`✅ Unit created from folder: ${folderName}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin IOR: ${originIOR}`);
    console.log(`   Folder: ${fullPath}`);
  }

  /**
   * Generate simple IOR format: ior:giturlFromFile
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (CLI path authority)
   * @cliHide
   */
  private async generateSimpleIOR(filePath: string): Promise<string> {
    const cli = this.getCLI();
    // ✅ RADICAL OOP: Use CLI's projectRoot (Path Authority)
    const projectRoot = cli.model.projectRoot || this.model.projectRoot || '';
    const relativePath = path.relative(projectRoot, filePath);
    
    return `ior:git:github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}`;
  }

  /**
   * Set terminal identity (name, origin, definition)
   * @pdca 2025-11-11-UTC-0003 - Migrated, already has method chaining
   * @cliHide
   */
  setTerminalIdentity(name: string, origin: string, definition: string): this {
    this.model.name = name;
    this.model.origin = origin;
    this.model.definition = definition;
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Create LD link to existing unit
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (CLI path authority, method chaining)
   * @cliSyntax identifier filename
   */
  async link(identifier: UnitIdentifier, filename: string): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    try {
      const { promises: fs } = await import('fs');
      
      // Extract UUID from union type parameter
      let uuid: string;
      if (isUUIDv4(identifier)) {
        uuid = identifier.toString();
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        uuid = identifier;
      } else {
        throw new Error(`Invalid UUID identifier: ${identifier}`);
      }
      
      // Convert multi-word filenames (spaces → single dots) for consistency
      const convertedFilename = filename.replace(/\s+/g, '.');
      
      // ✅ RADICAL OOP: Use CLI's targetDirectory (Path Authority)
      const cli = this.getCLI();
      const currentDir = cli.model.targetDirectory || this.model.targetDirectory || '';
      const linkPath = path.join(currentDir, `${convertedFilename}.unit`);
      
      // Load existing unit scenario
      const existingScenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Update scenario with new link
      const { SyncStatus } = await import('../layer3/UnitReference.interface.js');
      existingScenario.model.references.push({
        linkLocation: `ior:local:ln:file:${linkPath}`,
        linkTarget: `ior:unit:${uuid}`,
        syncStatus: SyncStatus.SYNCED
      });
      
      // Create new LD link pointing to existing scenario
      const scenarioPath = existingScenario.model.indexPath;
      
      // Create actual filesystem symlink
      const relativePath = path.relative(currentDir, scenarioPath);
      await fs.symlink(relativePath, linkPath);
      
      await this.storage.saveScenario(uuid, existingScenario, [linkPath]);
      
      console.log(`✅ Link created: ${convertedFilename}.unit → ${uuid}`);
      console.log(`   Target: ${scenarioPath}`);
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      console.error(`Failed to create link: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create additional link to same unit in different location
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (CLI path authority, method chaining)
   * @cliSyntax unit folder <?originalUnit>
   */
  async linkInto(unit: UnitIdentifier, folder: string, originalUnit?: UnitIdentifier): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    try {
      const { promises: fs } = await import('fs');
      
      let uuid: string;
      let linkFilename: string;
      
      // Extract UUID from unit parameter
      if (isUUIDv4(unit)) {
        uuid = unit.toString();
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        linkFilename = this.convertNameToFilename(scenario.model.name) + '.unit';
      } else if (typeof unit === 'string' && this.isUUID(unit)) {
        uuid = unit;
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        linkFilename = this.convertNameToFilename(scenario.model.name) + '.unit';
      } else if (typeof unit === 'string') {
        // File path - extract UUID and preserve filename
        const { readlinkSync } = await import('fs');
        const cli = this.getCLI();
        const currentDir = cli.model.targetDirectory || this.model.targetDirectory || '';
        const existingLinkPath = path.resolve(currentDir, unit);
        
        const scenarioPath = readlinkSync(existingLinkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
        linkFilename = path.basename(unit);
      } else {
        throw new Error(`Invalid unit identifier: ${unit}`);
      }
      
      // Load unit scenario
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // ✅ RADICAL OOP: Use CLI's projectRoot for folder resolution
      const cli = this.getCLI();
      const projectRoot = cli.model.projectRoot || this.model.projectRoot || '';
      const targetPath = path.resolve(projectRoot, folder);
      const newLinkPath = path.join(targetPath, linkFilename);
      
      // Create directory if it doesn't exist
      await fs.mkdir(targetPath, { recursive: true });
      
      // Create symbolic link to scenario
      const relativePath = path.relative(targetPath, scenario.model.indexPath);
      await fs.symlink(relativePath, newLinkPath);
      
      // Update scenario model with new link reference
      const { SyncStatus } = await import('../layer3/UnitReference.interface.js');
      if (!scenario.model.references) {
        scenario.model.references = [];
      }
      scenario.model.references.push({
        linkLocation: `ior:local:ln:file:${newLinkPath}`,
        linkTarget: `ior:unit:${uuid}`,
        syncStatus: SyncStatus.SYNCED
      });
      scenario.model.updatedAt = new Date().toISOString();
      
      // Handle copy tracking if originalUnit provided
      if (originalUnit) {
        let originalUUID: string;
        if (isUUIDv4(originalUnit)) {
          originalUUID = originalUnit.toString();
        } else if (typeof originalUnit === 'string' && this.isUUID(originalUnit)) {
          originalUUID = originalUnit;
        } else if (typeof originalUnit === 'string') {
          const originalLinkPath = path.resolve(projectRoot, originalUnit);
          const originalScenarioPath = readlinkSync(originalLinkPath);
          originalUUID = this.extractUuidFromPath(originalScenarioPath);
        } else {
          throw new Error(`Invalid original unit identifier: ${originalUnit}`);
        }
        
        // Add copy IOR to track relationship
        const copyIOR = await this.generateSimpleIOR(newLinkPath);
        const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
        
        originalScenario.model.references.push({
          linkLocation: copyIOR,
          linkTarget: `ior:unit:${uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
        
        await this.storage.saveScenario(originalUUID, originalScenario, []);
      }
      
      await this.storage.saveScenario(uuid, scenario, [newLinkPath]);
      
      console.log(`✅ Link created: ${linkFilename} → ${folder}`);
      console.log(`   Target: ${scenario.model.indexPath}`);
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      console.error(`Failed to create link into folder: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Helper: Check if string is valid UUID
   * @pdca 2025-11-11-UTC-0003 - Migrated
   * @cliHide
   */
  private isUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  /**
   * Helper: Convert name to filename (spaces → dots)
   * @pdca 2025-11-11-UTC-0003 - Migrated
   * @cliHide
   */
  private convertNameToFilename(name: string): string {
    return name.replace(/\s+/g, '.');
  }

  /**
   * Helper: Extract UUID from scenario path
   * @pdca 2025-11-11-UTC-0003 - Migrated
   * @cliHide
   */
  private extractUuidFromPath(scenarioPath: string): string {
    const match = scenarioPath.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.scenario\.json/i);
    if (!match) {
      throw new Error(`Could not extract UUID from path: ${scenarioPath}`);
    }
    return match[1];
  }

  /**
   * Set unit definition from source file with GitTextIOR
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (method chaining)
   * @cliSyntax identifier file startPos endPos
   */
  async definition(identifier: UnitIdentifier, file: string, startPos: string, endPos: string): Promise<this>;
  async definition(file: string, startPos: string, endPos: string): Promise<this>;
  async definition(identifierOrFile: UnitIdentifier | string, fileOrStartPos?: string, startPosOrEndPos?: string, endPos?: string): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    let targetUnit: DefaultUnit;
    let file: string;
    let startPos: string;
    let endPosValue: string;

    if (endPos !== undefined) {
      // 4 parameters: identifier, file, startPos, endPos
      targetUnit = await this.loadUnitFromIdentifier(identifierOrFile as UnitIdentifier);
      file = fileOrStartPos!;
      startPos = startPosOrEndPos!;
      endPosValue = endPos;
    } else {
      // 3 parameters: file, startPos, endPos (use context)
      const target = this.getTarget();
      if (target === this) {
        throw new Error('No unit context loaded. Use "unit on <uuid|lnfile>" first or provide identifier parameter.');
      }
      targetUnit = target;
      file = identifierOrFile as string;
      startPos = fileOrStartPos!;
      endPosValue = startPosOrEndPos!;
    }

    // Create GitTextIOR from file position
    const gitTextIOR = await this.createGitTextIOR(file, startPos, endPosValue);
    
    // Set definition as GitTextIOR reference
    targetUnit.model.definition = gitTextIOR;
    targetUnit.model.updatedAt = new Date().toISOString();
    
    // Save updated scenario
    const scenario = await targetUnit.toScenario();
    await targetUnit.storage.saveScenario(targetUnit.model.uuid, scenario, []);
    
    console.log(`✅ ${targetUnit.model.name || 'Unit'}: definition set from ${file}:${startPos}-${endPosValue}`);
    console.log(`   GitTextIOR: ${gitTextIOR}`);
    
    // ✅ RADICAL OOP: Return this for method chaining
    return this;
  }

  /**
   * Display unit origin and definition references
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (method chaining)
   * @cliSyntax uuid
   */
  async origin(uuid: string): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    try {
      // Display dual links to origin and definition as clickable URLs
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      console.log(`Unit ${scenario.model.name || uuid} Source References:`);
      console.log('');
      
      if (scenario.model.origin) {
        const originUrl = scenario.model.origin.replace('ior:git:text:', '');
        console.log(`Origin: ${originUrl}`);
        console.log(`Local: scenarios/index/${uuid.slice(0, 5).split('').join('/')}/${uuid}.scenario.json`);
      } else {
        console.log('Origin: not specified');
      }
      
      console.log('');
      
      if (scenario.model.definition) {
        const definitionUrl = scenario.model.definition.replace('ior:git:text:', '');
        console.log(`Definition: ${definitionUrl}`);
        console.log(`Local: scenarios/index/${uuid.slice(0, 5).split('').join('/')}/${uuid}.scenario.json`);
      } else {
        console.log('Definition: not specified');
      }
      
      console.log('');
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      console.error(`Failed to show origin: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete a unit link (symlink file)
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (CLI path authority, method chaining)
   * @cliSyntax identifier
   */
  async deleteLink(identifier: UnitIdentifier): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    try {
      let uuid: string;
      let linkPath: string;
      
      if (isUUIDv4(identifier)) {
        // UUIDv4 instance - find link by UUID
        uuid = identifier.toString();
        throw new Error('UUID-based link deletion not yet implemented');
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        // UUID string - find link by UUID
        uuid = identifier;
        throw new Error('UUID-based link deletion not yet implemented');
      } else if (typeof identifier === 'string') {
        // File path - use as link file
        const { readlinkSync, unlinkSync } = await import('fs');
        const cli = this.getCLI();
        // ✅ RADICAL OOP: Use CLI's targetDirectory (Path Authority)
        const currentDir = cli.model.targetDirectory || this.model.targetDirectory || '';
        linkPath = identifier.startsWith('/') ? identifier : path.join(currentDir, identifier);
        
        // Read the symlink to get scenario path
        const scenarioPath = readlinkSync(linkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
        
        // Load unit scenario
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        
        // Remove from references
        const referenceIndex = scenario.model.references.findIndex(
          ref => ref.linkLocation.includes(identifier)
        );
        if (referenceIndex > -1) {
          scenario.model.references.splice(referenceIndex, 1);
        }
        
        // Update scenario in storage
        await this.storage.saveScenario(uuid, scenario, []);
        
        // Delete the actual symlink file
        unlinkSync(linkPath);
        
        console.log(`✅ Link deleted: ${identifier}`);
        console.log(`   UUID: ${uuid}`);
      } else {
        throw new Error(`Invalid identifier type: ${typeof identifier}`);
      }
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      console.error(`Failed to delete link: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete a unit completely (all links + scenario)
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (CLI path authority, method chaining)
   * @cliSyntax linkFilename
   */
  async deleteUnit(linkFilename: string): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    try {
      const { readlinkSync, unlinkSync } = await import('fs');
      const { unlink } = await import('fs/promises');
      const cli = this.getCLI();
      // ✅ RADICAL OOP: Use CLI's targetDirectory (Path Authority)
      const currentDir = cli.model.targetDirectory || this.model.targetDirectory || '';
      const linkPath = path.join(currentDir, linkFilename);
      
      // Read the symlink to get scenario path
      const scenarioPath = readlinkSync(linkPath);
      const uuid = this.extractUuidFromPath(scenarioPath);
      
      // Load unit scenario to get all links
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Delete all LD link files
      let deletedLinks = 0;
      for (const ref of scenario.model.references) {
        try {
          const refPath = ref.linkLocation.replace('ior:local:ln:file:', '');
          unlinkSync(refPath);
          deletedLinks++;
          console.log(`   Deleted link: ${refPath}`);
        } catch (error) {
          console.warn(`   Warning: Could not delete link ${ref.linkLocation}: ${(error as Error).message}`);
        }
      }
      
      // Delete the unit scenario from central storage
      const scenarioFullPath = scenario.model.indexPath;
      await unlink(scenarioFullPath);
      
      console.log(`✅ Unit deleted completely: ${uuid}`);
      console.log(`   Scenario removed: ${scenarioFullPath}`);
      console.log(`   Links deleted: ${deletedLinks}/${scenario.model.references.length}`);
      console.log(`   References removed: ${scenario.model.references.length}`);
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      console.error(`Failed to delete unit: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Validate terminal identity completeness
   * @pdca 2025-11-11-UTC-0003 - Migrated
   * @cliHide
   */
  validateTerminalIdentity(): { isComplete: boolean; missing: string[] } {
    const missing: string[] = [];
    
    if (!this.model.name || this.model.name.trim() === '') {
      missing.push('name');
    }
    if (!this.model.origin || this.model.origin.trim() === '') {
      missing.push('origin');
    }
    if (!this.model.definition || this.model.definition.trim() === '') {
      missing.push('definition');
    }

    return {
      isComplete: missing.length === 0,
      missing
    };
  }

  /**
   * Show terminal identity warning if incomplete
   * @pdca 2025-11-11-UTC-0003 - Migrated
   * @cliHide
   */
  showTerminalIdentityWarning(): void {
    const validation = this.validateTerminalIdentity();
    if (!validation.isComplete) {
      console.warn(`⚠️  Warning: Unit '${this.model.uuid}' missing terminal identity information:`);
      validation.missing.forEach(field => {
        console.warn(`   - ${field}: not specified`);
      });
      console.warn('');
      console.warn('   Next build version will require migration method for missing model info.');
      console.warn('   Please update unit with complete terminal identity (uni-t) attributes.');
    }
  }

  /**
   * Helper: Load unit from identifier (UUID, UUIDv4, or file path)
   * @pdca 2025-11-11-UTC-0003 - Migrated
   * @cliHide
   */
  private async loadUnitFromIdentifier(identifier: UnitIdentifier): Promise<DefaultUnit> {
    let uuid: string;
    
    if (isUUIDv4(identifier)) {
      uuid = identifier.toString();
    } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
      uuid = identifier;
    } else if (typeof identifier === 'string') {
      // File path - read symlink to get UUID
      const { readlinkSync } = await import('fs');
      const cli = this.getCLI();
      const currentDir = cli.model.targetDirectory || this.model.targetDirectory || '';
      const linkPath = path.resolve(currentDir, identifier);
      const scenarioPath = readlinkSync(linkPath);
      uuid = this.extractUuidFromPath(scenarioPath);
    } else {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    
    // Load scenario and create unit instance
    const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
    const unit = new DefaultUnit();
    unit.setCLI(this.getCLI());
    await unit.init(scenario);
    return unit;
  }

  /**
   * Helper: Create GitTextIOR from file position
   * @pdca 2025-11-11-UTC-0003 - Migrated with CLI path authority
   * @cliHide
   */
  private async createGitTextIOR(file: string, startPos: string, endPos: string): Promise<string> {
    const { GitTextIOR } = await import('./GitTextIOR.js');
    const cli = this.getCLI();
    const projectRoot = cli.model.projectRoot || this.model.projectRoot || '';
    
    const absolutePath = path.isAbsolute(file) ? file : path.join(projectRoot, file);
    const relativePath = path.relative(projectRoot, absolutePath);
    const gitUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}#L${startPos}-${endPos}`;
    
    const gitIOR = new GitTextIOR();
    return gitIOR.parse(gitUrl);
  }

  /**
   * List found references from previous search
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (method chaining)
   * @cliSyntax
   */
  async list(): Promise<this> {
    // Print quick header for immediate UX feedback
    await (await this.getWeb4TSComponent()).printQuickHeader();
    
    try {
      // Try to load found references from persistent storage first
      const { promises: fs } = await import('fs');
      const { tmpdir } = await import('os');
      
      const tempFile = path.join(tmpdir(), 'unit-found-references.json');
      let foundRefs: any = null;
      
      try {
        const data = await fs.readFile(tempFile, 'utf-8');
        foundRefs = JSON.parse(data);
      } catch {
        // Fallback to unit model
        const extendedModel = this.model as any;
        foundRefs = extendedModel.foundReferences;
      }
      
      if (!foundRefs || !foundRefs.files || foundRefs.files.length === 0) {
        console.log(`❌ No found references available`);
        console.log(`   💡 Use 'unit find <name>' first to discover references`);
        return this;
      }
      
      console.log(`\n📄 Browsing ${foundRefs.count} found references for: "${foundRefs.searchTerm}"`);
      console.log(`   💡 Background agent safe mode - showing detailed list\n`);
      
      // Show detailed list without interactive less
      foundRefs.files.forEach((file: string, index: number) => {
        const displayIndex = (index + 1).toString().padStart(4);
        console.log(`${displayIndex}. ${file}`);
      });
      
      console.log(`\n✅ Listed ${foundRefs.files.length} references`);
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      console.error(`Failed to list references: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Add storage capability (deprecated in 0.3.19.1)
   * @pdca 2025-11-11-UTC-0003 - Migrated (kept for compatibility)
   * @cliHide
   */
  addStorageCapability(capability: string): this {
    // Note: storageCapabilities removed per Occam's Razor
    console.log(`Note: Storage capability '${capability}' noted (capabilities removed in 0.3.19.1)`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Resolve speaking name to UUID
   * @pdca 2025-11-11-UTC-0003 - Migrated with CLI path authority
   * @cliHide
   */
  private async resolveSpeakingName(speakingName: string): Promise<string | null> {
    try {
      const cli = this.getCLI();
      // ✅ RADICAL OOP: Use CLI's projectRoot (Path Authority)
      const projectRoot = cli.model.projectRoot || this.model.projectRoot || '';
      const ontologyDir = path.join(projectRoot, 'scenarios', 'ontology');
      const unitFileName = `${speakingName.replace(/\s+/g, '.')}.unit`;
      const unitLinkPath = path.join(ontologyDir, unitFileName);
      
      // Check if the speaking name exists as a unit link
      const { promises: fs } = await import('fs');
      try {
        await fs.access(unitLinkPath);
        const scenarioPath = await fs.readlink(unitLinkPath);
        // Extract UUID from scenario path
        const uuidMatch = scenarioPath.match(/([a-f0-9-]{36})\.scenario\.json$/);
        if (uuidMatch) {
          return uuidMatch[1];
        }
      } catch {
        // Unit link doesn't exist, continue to search
      }
      
      // Fallback: Search through all units for matching names
      const indexDir = path.join(projectRoot, 'scenarios', 'index');
      const allScenarios = await this.findAllScenarios(indexDir);
      
      for (const scenarioPath of allScenarios) {
        try {
          const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
          const scenario = JSON.parse(scenarioContent);
          if (scenario.model?.name === speakingName) {
            return scenario.ior.uuid;
          }
        } catch {
          // Skip invalid scenarios
        }
      }
      
      return null;
    } catch (error) {
      console.warn(`Failed to resolve speaking name ${speakingName}: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Find all scenario files in the index directory
   * @pdca 2025-11-11-UTC-0003 - Migrated
   * @cliHide
   */
  private async findAllScenarios(indexDir: string): Promise<string[]> {
    const scenarios: string[] = [];
    const { promises: fs } = await import('fs');
    
    async function scanDirectory(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await scanDirectory(fullPath);
          } else if (entry.name.endsWith('.scenario.json')) {
            scenarios.push(fullPath);
          }
        }
      } catch {
        // Skip directories that can't be read
      }
    }
    
    await scanDirectory(indexDir);
    return scenarios;
  }

  /**
   * Add speaking name link for this unit
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (method chaining)
   * @cliSyntax speakingName
   */
  async addSpeakingName(speakingName: string): Promise<this> {
    try {
      // Add speaking name link for this unit
      console.log(`✅ Speaking name to add: ${speakingName} -> ${this.model.uuid}`);
      // TODO: Implementation when storage methods are fully migrated
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      throw new Error(`Failed to add speaking name: ${(error as Error).message}`);
    }
  }

  /**
   * Remove speaking name link for this unit
   * @pdca 2025-11-11-UTC-0003 - Migrated with Radical OOP (method chaining)
   * @cliSyntax speakingName
   */
  async removeSpeakingName(speakingName: string): Promise<this> {
    try {
      // Remove speaking name link for this unit
      console.log(`✅ Speaking name to remove: ${speakingName}`);
      // TODO: Implementation when storage methods are fully migrated
      
      // ✅ RADICAL OOP: Return this for method chaining
      return this;
    } catch (error) {
      throw new Error(`Failed to remove speaking name: ${(error as Error).message}`);
    }
  }
}




