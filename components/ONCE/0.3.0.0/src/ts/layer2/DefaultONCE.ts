/**
 * DefaultONCE - Object Network Communication Engine implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Following established IOR component radical OOP pattern exactly
 * Radically simplified yet resilient self-managed component
 */

import { ONCE, ONCEModel } from '../layer3/ONCE.interface.js';
import { DefaultModel, IOR, DefaultIOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';
import { DefaultUser } from '../../../../User/0.1.3.0/src/ts/DefaultUser.js';
import { P2PCoordinator } from '../layer4/P2PCoordinator.js';
import { P2PProtocol } from '../layer1/P2PProtocol.js';

export class DefaultONCE implements ONCE {
  private data: ONCEModel;
  private scenarioService: Scenario;     // ✅ DRY: Shared component composition (Decision 1a)
  private userService: DefaultUser;      // ✅ DRY: Shared component composition (Decision 2b+d)
  private iorComponent: DefaultIOR;      // ✅ DRY: Shared IOR component (Decision 4a+d)
  private p2pCoordinator: P2PCoordinator; // ✅ DRY: Layer4 P2P coordination (Decision 3d)
  private p2pProtocol: P2PProtocol;      // ✅ DRY: Layer1 P2P protocols (Decision 3d)

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
    
    // ✅ DRY: Compose shared services, never duplicate (Decisions 4a+d)
    this.scenarioService = new Scenario();
    this.userService = new User();
    this.p2pCoordinator = new P2PCoordinator(); // ✅ DRY: Layer4 coordination composition
    
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
    // ✅ DRY: Delegate hibernation to shared Scenario component (Decision 1a)
    // ✅ Hybrid: Local state + Scenario persistence (Decision 1c)
    const scenarioData = {
      ior: {
        uuid: this.data.uuid,
        component: 'ONCE',
        version: '0.3.0.0'
      },
      owner: await this.getOwnerData(), // ✅ DRY: Delegate to User service (Decision 2b+d)
      model: this.data // ✅ Hybrid: Local state management + shared persistence
    };
    
    // ✅ DRY: Use shared Scenario component for persistence
    return this.scenarioService.init(scenarioData);
  }

  /**
   * Get owner data using shared User component (Decisions 2b+d)
   * NEVER environment variables - always delegate to shared services
   */
  private async getOwnerData(): Promise<string> {
    // ✅ DRY: Delegate owner generation to shared User component
    // ✅ NEVER environment variables (explicit NEVER a decision)
    return this.userService.generateOwnerData?.(this.data.uuid) || '';
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
    // ✅ DRY: P2P split implementation (Decision 3d)
    // Layer1: Protocol handling, Layer2: Connection management, Layer4: Coordination
    console.log(`ONCE: Connecting to peer ${peerLocation} using DRY P2P layer distribution`);
    // TODO: Implement using Layer1 protocols + Layer2 management + Layer4 coordination
  }

  async exchangeScenario(peer: string, scenario: any): Promise<void> {
    // ✅ DRY: Use shared Scenario component for exchange (Decision 1a)
    const scenarioToSend = await this.scenarioService.init(scenario);
    console.log(`ONCE: Exchanging scenario with peer ${peer} via shared Scenario component`);
    // TODO: Implement using shared Scenario component for serialization/exchange
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