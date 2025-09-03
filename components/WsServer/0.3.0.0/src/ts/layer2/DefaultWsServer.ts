/**
 * DefaultWsServer - WebSocket server capability component implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Following established radical OOP pattern from IOR and ONCE components
 * Self-managed WebSocket server capability with type-safe WsServerModel
 */

import { WsServer } from '../layer3/WsServer.interface.js';
import { WsServerModel } from '../layer3/WsServerModel.interface.js';
import { IOR, DefaultIOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';
import { DefaultUser } from '../../../../User/0.1.3.0/src/ts/DefaultUser.js';

export class DefaultWsServer implements WsServer {
  private data: WsServerModel;
  private scenarioService: Scenario;  // ✅ DRY: Shared component composition
  private userService: DefaultUser;   // ✅ DRY: Shared component composition
  private iorComponent: DefaultIOR;   // ✅ DRY: Shared IOR component

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal WebSocket server data
    this.data = {
      uuid: '',
      name: 'WebSocket Server',
      description: 'WebSocket Server Capability Component',
      port: 42777,
      state: 'stopped',
      connections: [],         // IOR references to connection components
      protocol: 'ws',
      maxConnections: 100,     // ✅ Config in model (scenarios ARE configs)
      heartbeatInterval: 30000, // ✅ Config in model (scenarios ARE configs)
      compression: true,       // ✅ Config in model (scenarios ARE configs)
      startedAt: undefined,
      stoppedAt: undefined
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
  get model(): WsServerModel { 
    return this.data; 
  }
  
  set model(value: WsServerModel) { 
    this.data = value;
    this.onChange?.(this.data);
  }

  /**
   * Radical OOP: Class-based proxy with encapsulation
   */
  private createProxy(): DefaultWsServer {
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
  onChange?: (data: WsServerModel) => void;

  /**
   * WsServer Interface Implementation
   */

  async startServer(): Promise<void> {
    this.data.state = 'starting';
    this.data.startedAt = new Date().toISOString();
    
    // WebSocket server implementation would go here
    console.log(`WsServer: Starting WebSocket server on port ${this.data.port}`);
    
    this.data.state = 'running';
  }

  async stopServer(): Promise<void> {
    this.data.state = 'stopping';
    
    // WebSocket server shutdown would go here
    console.log(`WsServer: Stopping WebSocket server on port ${this.data.port}`);
    
    this.data.state = 'stopped';
    this.data.stoppedAt = new Date().toISOString();
  }

  addConnection(connectionIOR: IOR): void {
    // Add connection component reference (Web4 principle: connections are components)
    this.data.connections.push(connectionIOR);
    console.log(`WsServer: Added connection component ${connectionIOR.component}:${connectionIOR.uuid}`);
  }

  removeConnection(connectionIOR: IOR): void {
    // Remove connection component reference
    this.data.connections = this.data.connections.filter(
      conn => conn.uuid !== connectionIOR.uuid
    );
    console.log(`WsServer: Removed connection component ${connectionIOR.uuid}`);
  }

  getPort(): number {
    return this.data.port;
  }

  isRunning(): boolean {
    return this.data.state === 'running';
  }

  async saveAsScenario(): Promise<Scenario> {
    // Delegate hibernation to Scenario component
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: 'localhost',
      uuid: this.data.uuid
    });

    const scenario = new Scenario().init({
      ior: {
        uuid: this.data.uuid,
        component: 'WsServer',
        version: '0.3.0.0'
      },
      owner: ownerData,
      model: this.data as WsServerModel
    });

    return scenario;
  }

  /**
   * Utility methods following IOR pattern
   */
  toJSON(): WsServerModel {
    return { ...this.data };
  }

  validate(): boolean {
    return !!(this.data.uuid && this.data.name && this.data.description);
  }

  static create(uuid: string, name: string, description: string, port: number): DefaultWsServer {
    const scenario = new Scenario().init({
      ior: { uuid, component: 'WsServer', version: '0.3.0.0' },
      owner: '',
      model: { uuid, name, description, port } as WsServerModel
    });
    return new DefaultWsServer().init(scenario);
  }
}