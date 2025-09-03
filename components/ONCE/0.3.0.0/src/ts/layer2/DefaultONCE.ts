/**
 * DefaultONCE - Object Network Communication Engine Kernel Implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * ONCE Role: Environment kernel that loads components from IORs
 * NOT a server implementation - delegates to capability components
 */

import { ONCE } from '../layer3/ONCE.interface.js';
import { ONCEModel } from '../layer3/ONCEModel.interface.js';
import { ONCEScenario } from '../layer3/ONCEScenario.interface.js';
import { ComponentScenario } from '../layer3/ComponentScenario.interface.js';
import { EnvironmentInfo } from '../layer3/EnvironmentInfo.interface.js';
import { Component } from '../layer3/Component.interface.js';
import { IOR, DefaultIOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';
import { DefaultUser } from '../../../../User/0.1.3.0/src/ts/DefaultUser.js';

export class DefaultONCE implements ONCE {
  private data: ONCEModel;
  private scenarioService: Scenario;       // ✅ DRY: Shared component composition
  private userService: DefaultUser;        // ✅ DRY: Shared component composition  
  private loadedComponents: Map<string, Component>; // Component registry for kernel

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal kernel data (not server data)
    this.data = {
      uuid: '',
      name: 'ONCE Kernel',
      description: 'Object Network Communication Engine - Environment Kernel',
      state: 'booting',
      environment: 'node', // Will be detected during boot
      domain: 'local.once',
      host: 'localhost',
      capabilities: [], // IOR references to capability components
      loadedComponents: [], // IOR references to loaded components
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // ✅ Web4 DRY: Compose with shared components
    this.scenarioService = new Scenario();
    this.userService = new DefaultUser();
    this.loadedComponents = new Map();
    
    // Radical OOP: Return proxy-wrapped class instance
    return this.createProxy();
  }

  /**
   * Model getter/setter for proxy management (Following IOR pattern)
   */
  get model(): ONCEModel { 
    return this.data; 
  }
  
  set model(value: ONCEModel) { 
    this.data = value;
    this.onChange?.(this.data);
  }

  /**
   * Radical OOP: Class-based proxy with encapsulation
   */
  private createProxy(): DefaultONCE {
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
   * Initialize from ONCE scenario (NEVER 'any' type)
   */
  init(scenario: ONCEScenario): this {
    if (scenario.model) {
      Object.assign(this.data, scenario.model);
    }
    return this;
  }

  /**
   * Optional onChange callback for controller integration
   */
  onChange?: (data: ONCEModel) => void;

  /**
   * ONCE Kernel Interface Implementation
   */

  /**
   * Boot environment and prepare for component loading
   * ONCE main feature: Boot in any environment
   */
  async bootEnvironment(): Promise<EnvironmentInfo> {
    this.data.state = 'ready';
    this.data.updatedAt = new Date().toISOString();
    
    // Detect current environment
    const environment = this.detectEnvironment();
    this.data.environment = environment.platform;
    
    return environment;
  }

  /**
   * Load component from IOR and scenario
   * ONCE main feature: Choose components to load from IORs and scenarios
   */
  async loadComponent(componentIOR: IOR, scenario: ComponentScenario): Promise<Component> {
    this.data.state = 'loading';
    
    // QUESTION: How should ONCE actually load a component from IOR?
    // Should it use dynamic import? Component registry? Factory pattern?
    
    // For now, placeholder implementation
    console.log(`ONCE Kernel: Loading component ${componentIOR.component}:${componentIOR.version}`);
    
    // Add to loaded components
    this.data.loadedComponents.push(componentIOR);
    this.data.updatedAt = new Date().toISOString();
    
    // Return mock component - QUESTION: How should this work?
    return {} as Component;
  }

  /**
   * Unload component by IOR reference
   */
  async unloadComponent(componentIOR: IOR): Promise<void> {
    // Remove from loaded components
    this.data.loadedComponents = this.data.loadedComponents.filter(
      ior => ior.uuid !== componentIOR.uuid
    );
    
    // Remove from registry
    this.loadedComponents.delete(componentIOR.uuid);
    
    this.data.updatedAt = new Date().toISOString();
  }

  /**
   * Get currently loaded components
   */
  getLoadedComponents(): IOR[] {
    return [...this.data.loadedComponents];
  }

  /**
   * Get current environment information
   */
  getEnvironment(): EnvironmentInfo {
    return this.detectEnvironment();
  }

  /**
   * Exchange scenarios with peer ONCE kernel
   */
  async exchangeScenarios(peerONCE: IOR, scenarios: ComponentScenario[]): Promise<void> {
    // QUESTION: Should this delegate to a P2P component or implement directly?
    console.log(`ONCE Kernel: Exchanging ${scenarios.length} scenarios with peer ${peerONCE.uuid}`);
  }

  /**
   * Save kernel state as scenario
   */
  async saveAsScenario(): Promise<ONCEScenario> {
    // Delegate hibernation to Scenario component (Decision 1a)
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: this.data.host,
      uuid: this.data.uuid
    });

    const scenarioData = {
      ior: {
        uuid: this.data.uuid,
        component: 'ONCE',
        version: '0.3.0.0'
      },
      owner: ownerData,
      model: this.data
    };

    return this.scenarioService.init(scenarioData).toJSON() as ONCEScenario;
  }

  /**
   * Private helper methods
   */
  private detectEnvironment(): EnvironmentInfo {
    // QUESTION: Should this delegate to an EnvironmentDetector component?
    return {
      platform: 'node',
      version: process.version || 'unknown',
      capabilities: ['server', 'filesystem', 'network'],
      isOnline: true,
      hostname: this.data.host,
      ip: '127.0.0.1'
    };
  }

  /**
   * Utility methods following IOR pattern
   */
  toJSON(): ONCEModel {
    return { ...this.data };
  }

  validate(): boolean {
    return !!(this.data.uuid && this.data.name && this.data.description);
  }

  static create(uuid: string, name: string, description: string): DefaultONCE {
    return new DefaultONCE().init({ 
      ior: { uuid, component: 'ONCE', version: '0.3.0.0' },
      owner: '',
      model: { uuid, name, description }
    } as ONCEScenario);
  }
}