/**
 * DefaultONCE - Object Network Communication Engine implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Following established IOR component radical OOP pattern exactly
 * Radically simplified yet resilient self-managed component
 */

import { ONCE, ONCEModel } from '../layer3/ONCE.interface.js';
import { DefaultModel } from '../../../../IOR/0.3.0.0/src/ts/layer2/DefaultModel.js';

export class DefaultONCE implements ONCE {
  private data: ONCEModel;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal data
    this.data = {
      uuid: '',
      name: 'ONCE Server',
      description: 'Object Network Communication Engine',
      state: 'stopped',
      domain: 'local.once',
      host: 'localhost',
      port: 42777,
      capabilities: ['httpPort', 'wsPort'],
      platform: 'node',
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
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
   * Radical OOP: Class-based proxy with encapsulation (Following IOR pattern)
   */
  private createProxy(): DefaultONCE {
    return new Proxy(this, {
      set: (target, prop, value) => this.handlePropertySet(prop, value),
      get: (target, prop) => this.handlePropertyGet(prop)
    });
  }

  /**
   * Radical OOP: Class method handles property setting
   */
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

  /**
   * Radical OOP: Class method handles property getting  
   */
  private handlePropertyGet(prop: string | symbol): any {
    if (prop in this.data) {
      return (this.data as any)[prop];
    }
    return (this as any)[prop];
  }

  /**
   * Initialize from scenario data
   * Web4 Pattern: Scenario-based initialization
   */
  init(scenario: any): this {
    if (scenario.model) {
      Object.assign(this.data, scenario.model);
    }
    return this;
  }

  /**
   * Optional onChange callback for controller integration
   * Following IOR pattern exactly
   */
  onChange?: (data: ONCEModel) => void;

  /**
   * ONCE Interface Implementation - Core Features
   */

  async startComponent(scenario: any): Promise<any> {
    this.data.state = 'running';
    this.data.updatedAt = new Date().toISOString();
    
    // QUESTION: Should this delegate to scenario component for hibernation?
    return { started: true, scenario };
  }

  async stopComponent(): Promise<void> {
    this.data.state = 'stopped';
    this.data.updatedAt = new Date().toISOString();
  }

  async pauseComponent(): Promise<void> {
    this.data.state = 'paused';
    this.data.updatedAt = new Date().toISOString();
  }

  async resumeComponent(): Promise<void> {
    this.data.state = 'running';
    this.data.updatedAt = new Date().toISOString();
  }

  async saveAsScenario(): Promise<any> {
    // QUESTION: Should this use shared Scenario component or implement locally?
    return {
      ior: {
        uuid: this.data.uuid,
        component: 'ONCE',
        version: '0.3.0.0'
      },
      owner: '', // QUESTION: How to get proper owner data?
      model: this.data
    };
  }

  getEnvironment(): any {
    return {
      platform: this.data.platform,
      host: this.data.host,
      port: this.data.port,
      capabilities: this.data.capabilities
    };
  }

  async connectPeer(peerLocation: string): Promise<void> {
    // QUESTION: Should P2P features be in Layer1, Layer2, or Layer4?
    console.log(`Connecting to peer: ${peerLocation}`);
  }

  async exchangeScenario(peer: string, scenario: any): Promise<void> {
    // QUESTION: Should scenario exchange use shared Scenario component?
    console.log(`Exchanging scenario with peer: ${peer}`);
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
      model: { uuid, name, description } 
    });
  }
}