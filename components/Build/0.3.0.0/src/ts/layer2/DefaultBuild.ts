/**
 * DefaultBuild - Web4 build and dependency management implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Following established radical OOP pattern from IOR and ONCE components
 * Self-managed build system with type-safe BuildModel
 */

import { Build } from '../layer3/Build.interface.js';
import { BuildModel } from '../layer3/BuildModel.interface.js';
import { EnvironmentCheckResult } from '../layer3/EnvironmentCheckResult.interface.js';
import { BuildResult } from '../layer3/BuildResult.interface.js';
import { BuildState } from '../layer3/BuildState.interface.js';
import { IOR, DefaultIOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';
import { DefaultUser } from '../../../../User/0.1.3.0/src/ts/DefaultUser.js';
import { DependencyResolver, ComponentDependency } from '../layer1/DependencyResolver.js';

export class DefaultBuild implements Build {
  private data: BuildModel;
  private scenarioService: Scenario;     // ✅ DRY: Shared component composition
  private userService: DefaultUser;      // ✅ DRY: Shared component composition
  private iorComponent: DefaultIOR;      // ✅ DRY: Shared IOR component
  private dependencyResolver: DependencyResolver; // ✅ Comprehensive dependency resolution

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal build data
    this.data = {
      uuid: '',
      name: 'Build Manager',
      description: 'Web4 Component Build and Dependency Management',
      environment: 'node',
      dependencies: [],
      buildOrder: ['IOR', 'Scenario', 'Build', 'ONCE'],  // Default build order
      npmInstall: true,      // ✅ Config in model (scenarios ARE configs)
      typeScriptBuild: true, // ✅ Config in model (scenarios ARE configs)
      dependencyCheck: true, // ✅ Config in model (scenarios ARE configs)
      forceReinstall: false, // ✅ Config in model (scenarios ARE configs)
      buildState: 'pending',
      artifacts: []
    };
    
    // ✅ Web4 DRY: Compose with shared components
    this.scenarioService = new Scenario();
    this.userService = new DefaultUser();
    this.iorComponent = new DefaultIOR();
    this.dependencyResolver = new DependencyResolver();
    
    // Radical OOP: Return proxy-wrapped class instance
    return this.createProxy();
  }

  /**
   * Model getter/setter for proxy management (Following IOR pattern)
   */
  get model(): BuildModel { 
    return this.data; 
  }
  
  set model(value: BuildModel) { 
    this.data = value;
    this.onChange?.(this.data);
  }

  /**
   * Radical OOP: Class-based proxy with encapsulation
   */
  private createProxy(): DefaultBuild {
    return new Proxy(this, {
      set: (target, prop, value) => this.handlePropertySet(prop, value),
      get: (target, prop) => this.handlePropertyGet(prop)
    });
  }

  private handlePropertySet(prop: string | symbol, value: any): boolean {
    if (prop in this.data) {
      (this.data as any)[prop] = value;
      this.onChange?.(this.data);
      return true;
    }
    if (prop in this) {
      (this as any)[prop] = value;
      return true;
    }
    return false;
  }

  private handlePropertyGet(prop: string | symbol): any {
    if (prop in this.data) {
      return (this.data as any)[prop];
    }
    return (this as any)[prop];
  }

  /**
   * Initialize from scenario (scenarios ARE configs)
   */
  init(scenario: Scenario): this {
    if (scenario.model) {
      Object.assign(this.data, scenario.model);
    }
    return this;
  }

  /**
   * Optional onChange callback for controller integration
   */
  onChange?: (data: BuildModel) => void;

  /**
   * Build Interface Implementation
   */

  /**
   * Check environment (node, npm) and validate availability
   */
  async checkEnvironment(): Promise<EnvironmentCheckResult> {
    console.log('Build: Checking environment for node and npm...');
    
    // Check Node.js
    const nodeCheck = await this.checkNodeAvailability();
    
    // Check NPM
    const npmCheck = await this.checkNpmAvailability();
    
    const result: EnvironmentCheckResult = {
      node: nodeCheck,
      npm: npmCheck,
      ready: nodeCheck.available && npmCheck.available,
      platform: process.platform as any,
      arch: process.arch,
      checkedAt: new Date().toISOString()
    };
    
    console.log(`Build: Environment check complete - Ready: ${result.ready}`);
    return result;
  }

  /**
   * Install node/npm if missing (worst case scenario handling)
   */
  async installEnvironment(): Promise<void> {
    console.log('Build: Installing missing environment components...');
    
    const envCheck = await this.checkEnvironment();
    
    if (!envCheck.node.available) {
      console.log('Build: Installing Node.js...');
      // Platform-specific Node.js installation would go here
      throw new Error('Node.js installation not implemented - please install manually');
    }
    
    if (!envCheck.npm.available) {
      console.log('Build: Installing NPM...');
      // NPM installation would go here
      throw new Error('NPM installation not implemented - please install manually');
    }
    
    console.log('Build: Environment installation complete');
  }

  /**
   * Build single component with comprehensive dependency resolution
   */
  async buildComponent(componentIOR: IOR): Promise<BuildResult> {
    console.log(`🏗️ Build: Starting comprehensive build chain for ${componentIOR.component}:${componentIOR.version}`);
    
    // Get complete build order including all dependencies
    const buildOrder = this.dependencyResolver.resolveBuildOrder(componentIOR.component);
    console.log(`📋 Build: Resolved build order: ${buildOrder.join(' → ')}`);
    
    const results: BuildResult[] = [];
    
    for (const componentName of buildOrder) {
      // Skip if already built successfully
      if (this.dependencyResolver.isComponentBuilt(componentName)) {
        console.log(`⏭️ Build: ${componentName} already built, skipping...`);
        continue;
      }
      
      console.log(`🔨 Build: Building ${componentName}...`);
      this.dependencyResolver.markBuilding(componentName);
      
      try {
        const componentIORForBuild = this.dependencyResolver.createComponentIOR(componentName);
        const result = await this.performComponentBuild(componentIORForBuild);
        
        this.dependencyResolver.markBuilt(componentName);
        results.push(result);
        
        console.log(`✅ Build: ${componentName} built successfully`);
        
      } catch (error) {
        const errorMessage = (error as Error).message;
        this.dependencyResolver.markFailed(componentName, errorMessage);
        console.log(`❌ Build: ${componentName} failed - ${errorMessage}`);
        
        throw new Error(`Build chain failed at ${componentName}: ${errorMessage}`);
      }
    }
    
    console.log(`🎉 Build: Complete build chain successful for ${componentIOR.component}`);
    
    // Return result for the target component
    return results.find(r => r.componentIOR.component === componentIOR.component) || results[results.length - 1];
  }

  /**
   * Build all components in comprehensive dependency order
   */
  async buildAll(): Promise<BuildResult[]> {
    console.log('🏗️ Build: Starting comprehensive Web4 ecosystem build...');
    
    // Get complete Web4 ecosystem build order
    const completeBuildOrder = this.dependencyResolver.getCompleteBuildOrder();
    console.log(`📋 Build: Complete ecosystem build order: ${completeBuildOrder.join(' → ')}`);
    
    const results: BuildResult[] = [];
    
    for (const componentName of completeBuildOrder) {
      // Skip if already built
      if (this.dependencyResolver.isComponentBuilt(componentName)) {
        console.log(`⏭️ Build: ${componentName} already built, skipping...`);
        continue;
      }
      
      console.log(`🔨 Build: Building ${componentName}...`);
      this.dependencyResolver.markBuilding(componentName);
      
      try {
        const componentIOR = this.dependencyResolver.createComponentIOR(componentName);
        const result = await this.performComponentBuild(componentIOR);
        
        this.dependencyResolver.markBuilt(componentName);
        results.push(result);
        
        console.log(`✅ Build: ${componentName} built successfully`);
        
      } catch (error) {
        const errorMessage = (error as Error).message;
        this.dependencyResolver.markFailed(componentName, errorMessage);
        console.log(`❌ Build: ${componentName} failed - ${errorMessage}`);
        
        // Continue with other components but log failure
        console.log(`⚠️ Build: Continuing with remaining components despite ${componentName} failure...`);
      }
    }
    
    console.log(`🎉 Build: Comprehensive Web4 ecosystem build complete - ${results.length} components built`);
    return results;
  }

  /**
   * Resolve component dependencies using comprehensive dependency resolver
   */
  async resolveDependencies(componentIOR: IOR): Promise<IOR[]> {
    console.log(`🔍 Build: Resolving dependencies for ${componentIOR.component}...`);
    
    // Use dependency resolver for comprehensive resolution
    const buildOrder = this.dependencyResolver.resolveBuildOrder(componentIOR.component);
    
    // Convert to IOR array (exclude the target component itself)
    const dependencies = buildOrder
      .filter(componentName => componentName !== componentIOR.component)
      .map(componentName => this.dependencyResolver.createComponentIOR(componentName));
    
    console.log(`📋 Build: Dependencies for ${componentIOR.component}: ${dependencies.map(d => d.component).join(', ')}`);
    
    return dependencies;
  }

  /**
   * Get comprehensive build state information
   */
  getBuildState(): BuildState {
    const allStatuses = this.dependencyResolver.getAllStatuses();
    const completed = allStatuses.filter(s => s.built);
    const failed = allStatuses.filter(s => s.failed);
    const building = allStatuses.filter(s => s.building);
    const pending = allStatuses.filter(s => !s.built && !s.failed && !s.building);
    
    return {
      state: this.data.buildState,
      currentlyBuilding: building.length > 0 ? this.dependencyResolver.createComponentIOR(building[0].component) : undefined,
      completedBuilds: completed.map(s => this.dependencyResolver.createComponentIOR(s.component)),
      failedBuilds: failed.map(s => this.dependencyResolver.createComponentIOR(s.component)),
      buildQueue: pending.map(s => this.dependencyResolver.createComponentIOR(s.component)),
      progress: Math.round((completed.length / allStatuses.length) * 100),
      environmentReady: true,
      lastBuildAt: this.data.buildCompleted
    };
  }

  /**
   * Save build configuration and state as scenario
   */
  async saveAsScenario(): Promise<Scenario> {
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: 'localhost',
      uuid: this.data.uuid
    });

    const scenario = new Scenario().init({
      ior: {
        uuid: this.data.uuid,
        component: 'Build',
        version: '0.3.0.0'
      },
      owner: ownerData,
      model: this.data as BuildModel
    });

    return scenario;
  }

  /**
   * Private helper methods
   */
  
  private async checkNodeAvailability(): Promise<{ available: boolean; version?: string; path?: string }> {
    try {
      const version = process.version;
      return {
        available: true,
        version: version,
        path: process.execPath
      };
    } catch {
      return { available: false };
    }
  }

  private async checkNpmAvailability(): Promise<{ available: boolean; version?: string; path?: string }> {
    try {
      // Check if npm is available (simplified check)
      const { execSync } = require('child_process');
      const version = execSync('npm --version', { encoding: 'utf8' }).trim();
      const path = execSync('which npm', { encoding: 'utf8' }).trim();
      
      return {
        available: true,
        version: version,
        path: path
      };
    } catch {
      return { available: false };
    }
  }

  private async performComponentBuild(componentIOR: IOR): Promise<BuildResult> {
    const startTime = new Date();
    
    try {
      console.log(`🔨 Build: Performing comprehensive build for ${componentIOR.component}`);
      
      // Real component build implementation
      const componentPath = this.getComponentPath(componentIOR);
      
      if (!componentPath) {
        throw new Error(`Component path not found for ${componentIOR.component}`);
      }
      
      console.log(`📂 Build: Component path: ${componentPath}`);
      
      // 1. Check if component exists
      const { existsSync } = require('fs');
      if (!existsSync(componentPath)) {
        throw new Error(`Component directory not found: ${componentPath}`);
      }
      
      // 2. Install npm dependencies (if configured and package.json exists)
      if (this.data.npmInstall && existsSync(`${componentPath}/package.json`)) {
        console.log(`📦 Build: Installing NPM dependencies for ${componentIOR.component}...`);
        await this.runCommand('npm install', componentPath);
      }
      
      // 3. Build TypeScript (if configured and tsconfig.json exists)
      if (this.data.typeScriptBuild && existsSync(`${componentPath}/tsconfig.json`)) {
        console.log(`📝 Build: Building TypeScript for ${componentIOR.component}...`);
        await this.runCommand('npm run build', componentPath);
      }
      
      const endTime = new Date();
      
      return {
        componentIOR,
        success: true,
        artifacts: [`${componentPath}/dist`],
        duration: endTime.getTime() - startTime.getTime(),
        startedAt: startTime.toISOString(),
        completedAt: endTime.toISOString(),
        logs: {
          stdout: `Build completed for ${componentIOR.component}`,
          stderr: ''
        },
        builtDependencies: []
      };
      
    } catch (error) {
      const endTime = new Date();
      
      return {
        componentIOR,
        success: false,
        artifacts: [],
        duration: endTime.getTime() - startTime.getTime(),
        startedAt: startTime.toISOString(),
        completedAt: endTime.toISOString(),
        error: {
          message: (error as Error).message,
          stack: (error as Error).stack
        },
        logs: {
          stdout: '',
          stderr: (error as Error).message
        },
        builtDependencies: []
      };
    }
  }

  /**
   * Get component directory path
   */
  private getComponentPath(componentIOR: IOR): string | null {
    // Map component names to their directory paths
    const componentPaths = {
      'IOR': '/workspace/components/IOR/0.3.0.0',
      'Scenario': '/workspace/components/Scenario/0.1.3.0',
      'User': '/workspace/components/User/0.1.3.0',
      'Build': '/workspace/components/Build/0.3.0.0',
      'HttpServer': '/workspace/components/HttpServer/0.3.0.0',
      'WsServer': '/workspace/components/WsServer/0.3.0.0',
      'P2PServer': '/workspace/components/P2PServer/0.3.0.0',
      'ONCE': '/workspace/components/ONCE/0.3.0.0',
      'Web4Requirement': '/workspace/components/Web4Requirement/0.1.2.2',
      'Unit': '/workspace/components/Unit/0.1.3.0'
    };
    
    return componentPaths[componentIOR.component as keyof typeof componentPaths] || null;
  }

  /**
   * Run shell command in specific directory
   */
  private async runCommand(command: string, workingDir: string): Promise<void> {
    const { execSync } = require('child_process');
    
    try {
      execSync(command, {
        cwd: workingDir,
        stdio: 'inherit'
      });
    } catch (error) {
      throw new Error(`Command failed: ${command} in ${workingDir} - ${(error as Error).message}`);
    }
  }

  private createComponentIOR(componentName: string): IOR {
    return new DefaultIOR().init({
      uuid: `${componentName.toLowerCase()}-component-uuid`,
      component: componentName,
      version: '0.3.0.0'
    }).toJSON();
  }

  /**
   * CLI Command Methods - Same names as CLI commands for delegation
   */

  async start(args: string[]): Promise<void> {
    console.log('Build: Starting build manager...');
    await this.checkEnvironment();
    console.log('Build: Manager started successfully');
  }

  async stop(args: string[]): Promise<void> {
    console.log('Build: Stopping build manager...');
    this.data.buildState = 'pending';
    console.log('Build: Manager stopped');
  }

  async status(args: string[]): Promise<void> {
    const state = this.getBuildState();
    console.log(`Build Manager Status:`);
    console.log(`  State: ${state.state}`);
    console.log(`  Environment Ready: ${state.environmentReady}`);
    console.log(`  Progress: ${state.progress}%`);
    console.log(`  Completed: ${state.completedBuilds.length}`);
    console.log(`  Failed: ${state.failedBuilds.length}`);
    console.log(`  Queue: ${state.buildQueue.length}`);
  }

  async info(args: string[]): Promise<void> {
    console.log(`Build - Component Build and Dependency Manager`);
    console.log(`Version: 0.3.0.0`);
    console.log(`Description: ${this.data.description}`);
    console.log(`UUID: ${this.data.uuid}`);
    console.log(`Environment: ${this.data.environment}`);
    console.log(`Dependencies: ${this.data.dependencies.length}`);
  }

  /**
   * Utility methods following IOR pattern
   */
  toJSON(): BuildModel {
    return { ...this.data };
  }

  validate(): boolean {
    return !!(this.data.uuid && this.data.name && this.data.description);
  }

  static create(uuid: string, name: string, description: string): DefaultBuild {
    const scenario = new Scenario().init({
      ior: { uuid, component: 'Build', version: '0.3.0.0' },
      owner: '',
      model: { uuid, name, description } as BuildModel
    });
    return new DefaultBuild().init(scenario);
  }
}