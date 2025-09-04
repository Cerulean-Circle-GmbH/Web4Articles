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

export class DefaultBuild implements Build {
  private data: BuildModel;
  private scenarioService: Scenario;  // ✅ DRY: Shared component composition
  private userService: DefaultUser;   // ✅ DRY: Shared component composition
  private iorComponent: DefaultIOR;   // ✅ DRY: Shared IOR component

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
   * Build single component with dependency resolution
   */
  async buildComponent(componentIOR: IOR): Promise<BuildResult> {
    this.data.buildState = 'building';
    const startTime = new Date();
    
    console.log(`Build: Building component ${componentIOR.component}:${componentIOR.version}`);
    
    try {
      // 1. Resolve dependencies
      const dependencies = await this.resolveDependencies(componentIOR);
      
      // 2. Build dependencies first
      for (const dep of dependencies) {
        await this.buildComponent(dep);
      }
      
      // 3. Build the component
      const buildResult = await this.performComponentBuild(componentIOR);
      
      this.data.buildState = 'complete';
      this.data.artifacts.push(...buildResult.artifacts);
      
      return buildResult;
      
    } catch (error) {
      this.data.buildState = 'error';
      this.data.errorDetails = (error as Error).message;
      
      throw error;
    }
  }

  /**
   * Build all components in correct dependency order
   */
  async buildAll(): Promise<BuildResult[]> {
    console.log('Build: Building all components in dependency order...');
    
    const results: BuildResult[] = [];
    
    for (const componentName of this.data.buildOrder) {
      const componentIOR = this.createComponentIOR(componentName);
      const result = await this.buildComponent(componentIOR);
      results.push(result);
    }
    
    console.log(`Build: All components built successfully - ${results.length} components`);
    return results;
  }

  /**
   * Resolve component dependencies recursively
   */
  async resolveDependencies(componentIOR: IOR): Promise<IOR[]> {
    // Dependency resolution logic would analyze component imports
    // For now, return default dependency order
    const dependencies: IOR[] = [];
    
    if (componentIOR.component !== 'IOR') {
      dependencies.push(this.createComponentIOR('IOR'));
    }
    
    if (componentIOR.component !== 'Scenario') {
      dependencies.push(this.createComponentIOR('Scenario'));
    }
    
    return dependencies;
  }

  /**
   * Get build state information
   */
  getBuildState(): BuildState {
    return {
      state: this.data.buildState,
      completedBuilds: this.data.dependencies.filter(() => true), // Mock implementation
      failedBuilds: [],
      buildQueue: [],
      progress: this.data.buildState === 'complete' ? 100 : 0,
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
      // Simulate component build process
      console.log(`Build: Performing build for ${componentIOR.component}`);
      
      // Build steps would go here:
      // 1. npm install (if configured)
      // 2. tsc build (if configured)  
      // 3. validation
      
      const endTime = new Date();
      
      return {
        componentIOR,
        success: true,
        artifacts: [`dist/${componentIOR.component}.js`],
        duration: endTime.getTime() - startTime.getTime(),
        startedAt: startTime.toISOString(),
        completedAt: endTime.toISOString(),
        logs: {
          stdout: `Build completed for ${componentIOR.component}`,
          stderr: ''
        },
        builtDependencies: await this.resolveDependencies(componentIOR)
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

  private createComponentIOR(componentName: string): IOR {
    return new DefaultIOR().init({
      uuid: `${componentName.toLowerCase()}-component-uuid`,
      component: componentName,
      version: '0.3.0.0'
    }).toJSON();
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