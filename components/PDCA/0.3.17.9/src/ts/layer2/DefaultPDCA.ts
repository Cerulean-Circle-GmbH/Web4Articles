/**
 * DefaultPDCA - PDCA Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { PDCA } from '../layer3/PDCA.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { PDCAModel } from '../layer3/PDCAModel.interface.js';
import { User } from '../layer3/User.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// Use latest version for delegation (always available)
import { DefaultWeb4TSComponent } from '../../../../../Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js';

// Radical OOP Training Module
import { DefaultTrainingModule } from '../layer4/DefaultTrainingModule.js';

// Radical OOP CMM3 Check Module
import { DefaultCMM3CheckModule } from '../layer4/DefaultCMM3CheckModule.js';

export class DefaultPDCA implements PDCA {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model: PDCAModel;
  private web4ts?: DefaultWeb4TSComponent; // Lazy-initialized Web4TSComponent for delegation
  private user?: User; // Optional User service (lazy initialization) - @pdca 2025-11-03-1135.pdca.md

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
      component: 'PDCA',  // For CLI display
      version: '0.3.17.9'             // Component version
    };
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

    // Find project root (where components/ directory is)
    const projectRoot = componentRoot.split('/components/')[0];

    // Import Web4TSComponent and SemanticVersion dynamically
    const web4tscomponentModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js`
    );
    const semanticVersionModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/SemanticVersion.js`
    );
    const { DefaultWeb4TSComponent } = web4tscomponentModule;
    const { SemanticVersion } = semanticVersionModule;

    // ✅ CRITICAL: Initialize Web4TSComponent with THIS component's identity for delegation
    // @pdca 2025-11-03-UTC-1237.pdca.md - Full delegation initialization
    // @pdca 2025-11-04-UTC-1630.pdca.md - Added projectRoot for version display fix
    this.web4ts = new DefaultWeb4TSComponent().init({
      model: {
        component: this.model.component,           // THIS component's name
        version: await SemanticVersion.fromString(this.model.version || '0.0.0.0'), // THIS component's version
        componentRoot: componentRoot,              // THIS component's root directory
        projectRoot: projectRoot,                  // Project root for Path Authority (version display needs this)
        targetDirectory: projectRoot               // Project root for path authority
      }
    });

    return this.web4ts;
  }

  /**
   * DRY helper for delegating methods to Web4TSComponent with correct context
   * Sets context ONCE so Web4TSComponent operates on THIS component's data
   * @pdca 2025-11-03-UTC-1200.pdca.md - DRY OOP pattern for context delegation
   * @cliHide
   */
  private async delegateToWeb4TS<T extends (...args: any[]) => any>(
    method: string,
    ...args: Parameters<T>
  ): Promise<this> {
    const web4ts = await this.getWeb4TSComponent();
    web4ts.model.context = this;  // ← Set context ONCE in ONE place
    await (web4ts as any)[method](...args);
    return this;
  }

  /**
   * @cliHide
   */
  init(scenario?: Scenario<PDCAModel>): this {
    if (scenario?.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    
    // ✅ DECLARE DEPENDENCIES: PDCA 0.3.17.9 depends on PDCA 0.3.5.2 for trainAILegacy
    // @pdca 2025-11-05-UTC-0230-component-dependencies.pdca.md
    this.model.dependencies = [
      {
        component: 'PDCA',
        version: '0.3.5.2',
        path: undefined // Use default path resolution
      }
    ];
    
    return this;
  }

  /**
   * @cliHide
   * @pdca 2025-11-03-1135.pdca.md - Use User service with fallback pattern
   */
  async toScenario(name?: string): Promise<Scenario<PDCAModel>> {
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
          component: 'PDCA',
          version: '0.3.17.9'
        }
      });
      ownerData = Buffer.from(fallbackJson).toString('base64');
    }

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'PDCA',
        version: '0.3.17.9'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for PDCA
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ PDCA operation completed`);
    return this;
  }

  /**
   * Process data through PDCA logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current PDCA state
   */
  async info(): Promise<this> {
    console.log(`📋 PDCA Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }

  /**
   * Train AI agents on specific topics with CMM3-defined, reproducible learning paths
   * 
   * RADICAL OOP: Delegates to TrainingModule (DRY principle)
   * TrainingModule is 100% model-driven, zero functional parameters
   * This is my legacy: Teaching by BEING, not just by saying
   * 
   * @param topic Training topic identifier or number
   * @cliSyntax topic
   * @cliDefault topic ""
   * @cliValues topic radical-oop functional-vs-oop cmm3-verification test-first bash-completion output-filtering error-handling 1 2 3 4 5 6 7
   */
  async trainAI(topic: string = ''): Promise<this> {
    console.log(`\n🎓 AI Training Module - Web4TSComponent 0.3.17.8 Journey\n`);
    
    // Radical OOP: Delegate to TrainingModule
    const trainingModule = new DefaultTrainingModule().init();
    
    if (!topic || topic.trim() === '') {
      trainingModule.listTopics();
    } else {
      trainingModule.showTopic(topic);
    }
    
    return this;
  }

  /**
   * Train AI with legacy topics from PDCA 0.3.5.2
   * 
   * RADICAL OOP: Delegates to the stable production version
   * This maintains access to the comprehensive CMM3 training library:
   * - start, pdca, cmm, dual-links, ensure-links
   * - component-upgrade, merge, component
   * - feature-development, web4-vs-nodejs, tech-stack
   * - test-workflow, test-without-versioning, test-first
   * - interpret-instructions, collaborate, chat-response
   * - report, license-headers, decide
   * 
   * @param topic Training topic identifier or number (20 topics available)
   * @cliSyntax topic
   * @cliDefault topic ""
   */
  async trainAILegacy(topic: string = ''): Promise<this> {
    // Delegate to PDCA 0.3.5.2 for legacy training topics
    // This maintains access to the comprehensive CMM3 training library
    // while we build the new Radical OOP training system
    
    // Dynamic import from the stable production version
    const legacyPath = '/Users/Shared/Workspaces/temp/Web4Articles/components/PDCA/0.3.5.2/dist/ts/layer2/DefaultPDCA.js';
    const { DefaultPDCA: LegacyPDCA } = await import(legacyPath);
    const legacyPDCA = new LegacyPDCA();
    
    // Create a minimal scenario for the legacy PDCA
    const legacyScenario = {
      ior: {
        uuid: 'trainAILegacy-delegation',
        component: 'PDCA',
        version: '0.3.5.2'
      },
      owner: 'PDCA-0.3.17.9',
      model: {}
    };
    
    // Initialize the legacy PDCA with the scenario
    legacyPDCA.init(legacyScenario);
    
    await legacyPDCA.trainAI(topic);
    return this;
  }

  /**
   * Check a single PDCA file for CMM3 compliance violations
   * 
   * RADICAL OOP: Delegates to CMM3CheckModule (DRY principle)
   * CMM3CheckModule manages functional complexity through OOP structure
   * 
   * @param pdcaFile Path to PDCA file to check
   * @cliSyntax pdcaFile
   */
  async cmm3check(pdcaFile: string): Promise<this> {
    // Radical OOP: Delegate to CMM3CheckModule
    const checkModule = new DefaultCMM3CheckModule().init();
    await checkModule.checkFile(pdcaFile);
    return this;
  }

  /**
   * Check all PDCA files in a session directory for CMM3 compliance violations
   * 
   * RADICAL OOP: Delegates to CMM3CheckModule (DRY principle)
   * CMM3CheckModule manages functional complexity through OOP structure
   * 
   * @param sessionPath Path to session directory (defaults to 'session')
   * @cliSyntax sessionPath
   * @cliDefault sessionPath session
   */
  async cmm3checkSession(sessionPath?: string): Promise<this> {
    // Radical OOP: Delegate to CMM3CheckModule
    const checkModule = new DefaultCMM3CheckModule().init();
    await checkModule.checkSession(sessionPath);
    return this;
  }

  /**
   * Run component tests with hierarchical selection or full suite with auto-promotion
   * 
   * DRY PRINCIPLE: Delegates ALL testing to Web4TSComponent to avoid code duplication.
   * Web4TSComponent handles:
   * - Hierarchical testing (file/describe/itCase)
   * - Full suite execution with vitest
   * - Auto-promotion workflow (dev → test → prod)
   * - Test result verification
   * - Recursion detection
   * 
   * Context delegation ensures Web4TSComponent operates on THIS component's data.
   * 
   * @param scope Test scope: 'all' (full suite with promotion) or 'file'/'describe'/'itCase' (selective, no promotion)
   * @param references Test references for selective testing (e.g., file number, describe reference, itCase token)
   * @cliSyntax scope references
   * @cliDefault scope all
   * @cliExample {{COMPONENT_LOWER}} test
   * @cliExample {{COMPONENT_LOWER}} test file
   * @cliExample {{COMPONENT_LOWER}} test file 1
   * @cliExample {{COMPONENT_LOWER}} test describe 3b
   * @cliExample {{COMPONENT_LOWER}} test itCase 1a1
   * @pdca 2025-11-03-UTC-1200.pdca.md - Replaced 178-line implementation with 1-line delegation
   */
  async test(scope: string = 'all', ...references: string[]): Promise<this> {
    return this.delegateToWeb4TS('test', scope, ...references);
  }

  /**
   * Build component (TypeScript compilation)
   * Delegates to Web4TSComponent for DRY architecture
   * @cliHide
   */
  async build(): Promise<this> {
    return this.delegateToWeb4TS('build');
  }

  /**
   * Clean component build artifacts
   * Delegates to Web4TSComponent for DRY architecture
   * @cliHide
   */
  async clean(): Promise<this> {
    return this.delegateToWeb4TS('clean');
  }

  /**
   * Show component directory tree structure
   * Delegates to Web4TSComponent for DRY architecture
   * @param depth Maximum depth to show (default: 4)
   * @param showHidden Whether to show hidden files (default: false)
   * @cliHide
   */
  async tree(depth: string = '4', showHidden: string = 'false'): Promise<this> {
    return this.delegateToWeb4TS('tree', depth, showHidden);
  }

  /**
   * Show semantic version links (dev, test, prod, latest)
   * Delegates to Web4TSComponent for DRY architecture
   * @param action Optional action (e.g., 'repair' to fix broken links)
   * @cliHide
   */
  async links(action: string = ''): Promise<this> {
    return this.delegateToWeb4TS('links', action);
  }

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
    const { PDCACLI } = await import('../layer5/PDCACLI.js');
    const cli = new PDCACLI();
    
    if (!context) {
      // No context - test completions on PDCA itself
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on PDCA${filter ? ` (filter: ${filter})` : ''}`);
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
