/**
 * DefaultONCE - Object Network Communication Engine Kernel Implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * ONCE Role: Environment kernel that loads components from IORs
 * NOT a server implementation - delegates to capability components
 */

import { ONCE } from '../layer3/ONCE.interface.js';
import { ONCEModel } from '../layer3/ONCEModel.interface.js';
import { EnvironmentInfo } from '../layer3/EnvironmentInfo.interface.js';
import { Component } from '../layer3/Component.interface.js';
import { IOR, DefaultIOR } from '../../../../IOR/0.3.0.0/src/ts/layer3/IOR.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/src/ts/layer2/DefaultScenario.js';
import { DefaultUser } from '../../../../User/0.1.3.0/src/ts/DefaultUser.js';
// Capability component imports for kernel integration
import { DefaultHttpServer } from '../../../HttpServer/0.3.0.0/src/ts/layer2/DefaultHttpServer.js';
import { DefaultWsServer } from '../../../WsServer/0.3.0.0/src/ts/layer2/DefaultWsServer.js';
import { DefaultP2PServer } from '../../../P2PServer/0.3.0.0/src/ts/layer2/DefaultP2PServer.js';
import { HttpServerModel } from '../../../HttpServer/0.3.0.0/src/ts/layer3/HttpServerModel.interface.js';
import { WsServerModel } from '../../../WsServer/0.3.0.0/src/ts/layer3/WsServerModel.interface.js';
import { P2PServerModel } from '../../../P2PServer/0.3.0.0/src/ts/layer3/P2PServerModel.interface.js';

export class DefaultONCE implements ONCE {
  private data: ONCEModel;
  private scenarioService: Scenario;       // ✅ DRY: Shared component composition
  private userService: DefaultUser;        // ✅ DRY: Shared component composition  
  private loadedComponents: Map<string, Component>; // Component registry for kernel

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal kernel data (type-safe ONCEModel)
    this.data = {
      uuid: '',
      name: 'ONCE Kernel',
      description: 'Object Network Communication Engine - Environment Kernel',
      state: 'booting',      // ✅ Type-safe: 'booting' | 'ready' | 'loading' | 'error'
      environment: 'node',   // ✅ Type-safe: 'node' | 'browser' | 'worker' | 'pwa' | 'iframe'
      domain: 'local.once',
      host: 'localhost',
      capabilities: [],      // ✅ Type-safe: IOR[] for capability components
      loadedComponents: [],  // ✅ Type-safe: IOR[] for loaded components  
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
   * Initialize from unified scenario (DRY compliance - use Scenario component)
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
  onChange?: (data: ONCEModel) => void;

  /**
   * ONCE Kernel Interface Implementation
   */

  /**
   * Boot environment and prepare for component loading
   * ONCE main feature: Boot in any environment
   */
  async bootEnvironment(): Promise<EnvironmentInfo> {
    this.data.state = 'booting';
    
    // 1. Detect current environment
    const environment = this.detectEnvironment();
    this.data.environment = environment.platform;
    
    console.log(`ONCE Kernel: Booting in ${environment.platform} environment`);
    
    // 2. Load default capabilities based on environment
    if (environment.platform === 'node') {
      // Node.js environment - load all server capabilities
      await this.loadHttpServer(8080);
      await this.loadWsServer(42777);
      await this.loadP2PServer(42778);
    } else if (environment.platform === 'browser') {
      // Browser environment - load client-side capabilities
      await this.loadWsServer(42777); // WebSocket client capability
      await this.loadP2PServer(42778); // P2P client capability
    }
    
    this.data.state = 'ready';
    this.data.updatedAt = new Date().toISOString();
    
    console.log(`ONCE Kernel: Boot complete with ${this.data.capabilities.length} capabilities loaded`);
    
    return environment;
  }

  /**
   * Load component from IOR and scenario
   * ONCE main feature: Choose components to load from IORs and scenarios  
   * Uses unified Scenario component (DRY compliance)
   */
  async loadComponent(componentIOR: IOR, scenario: Scenario): Promise<Component> {
    this.data.state = 'loading';
    
    let component: Component;
    
    // ✅ Dynamic component loading based on IOR.component (Web4 kernel pattern)
    switch (componentIOR.component) {
      case 'HttpServer':
        component = new DefaultHttpServer().init(scenario);
        console.log(`ONCE Kernel: Loaded HttpServer on port ${(scenario.model as HttpServerModel).port}`);
        break;
      
      case 'WsServer': 
        component = new DefaultWsServer().init(scenario);
        console.log(`ONCE Kernel: Loaded WsServer on port ${(scenario.model as WsServerModel).port}`);
        break;
      
      case 'P2PServer':
        component = new DefaultP2PServer().init(scenario);
        console.log(`ONCE Kernel: Loaded P2PServer on port ${(scenario.model as P2PServerModel).port}`);
        break;
      
      default:
        throw new Error(`ONCE Kernel: Unknown component type: ${componentIOR.component}`);
    }
    
    // Register loaded component in kernel registry
    this.loadedComponents.set(componentIOR.uuid, component);
    this.data.loadedComponents.push(componentIOR);
    this.data.capabilities.push(componentIOR);
    
    this.data.state = 'ready';
    this.data.updatedAt = new Date().toISOString();
    
    return component;
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
   * Uses unified Scenario component (DRY compliance)
   */
  async exchangeScenarios(peerONCE: IOR, scenarios: Scenario[]): Promise<void> {
    // QUESTION: Should this delegate to a P2P component or implement directly?
    console.log(`ONCE Kernel: Exchanging ${scenarios.length} scenarios with peer ${peerONCE.uuid}`);
  }

  /**
   * Save kernel state as scenario
   * Returns actual Scenario component instance (not data)
   */
  async saveAsScenario(): Promise<Scenario> {
    // Delegate hibernation to Scenario component (Decision 1a)
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: this.data.host,
      uuid: this.data.uuid
    });

    // ✅ Create actual Scenario component instance with type-safe model
    const scenario = new Scenario().init({
      ior: {
        uuid: this.data.uuid,
        component: 'ONCE',
        version: '0.3.0.0'
      },
      owner: ownerData,
      model: this.data as ONCEModel  // ✅ Type-safe model
    });

    return scenario;  // ✅ Return actual component, not data
  }

  /**
   * Capability loading convenience methods
   */
  
  async loadHttpServer(port: number = 8080): Promise<Component> {
    const httpServerIOR = new DefaultIOR().init({
      uuid: crypto.randomUUID(),
      component: 'HttpServer',
      version: '0.3.0.0'
    });
    
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: this.data.host,
      uuid: httpServerIOR.uuid
    });
    
    const scenario = new Scenario().init({
      ior: httpServerIOR.toJSON(),
      owner: ownerData,
      model: {
        uuid: httpServerIOR.uuid,
        name: 'HTTP Server Capability',
        description: 'HTTP server managed by ONCE kernel',
        port: port,
        state: 'stopped',
        routes: [],
        connections: [],
        maxConnections: 100,
        timeout: 30000,
        keepAlive: true
      } as HttpServerModel
    });
    
    return this.loadComponent(httpServerIOR, scenario);
  }

  async loadWsServer(port: number = 42777): Promise<Component> {
    const wsServerIOR = new DefaultIOR().init({
      uuid: crypto.randomUUID(),
      component: 'WsServer',
      version: '0.3.0.0'
    });
    
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: this.data.host,
      uuid: wsServerIOR.uuid
    });
    
    const scenario = new Scenario().init({
      ior: wsServerIOR.toJSON(),
      owner: ownerData,
      model: {
        uuid: wsServerIOR.uuid,
        name: 'WebSocket Server Capability',
        description: 'WebSocket server managed by ONCE kernel',
        port: port,
        state: 'stopped',
        connections: [],
        protocol: 'ws',
        maxConnections: 100,
        heartbeatInterval: 30000,
        compression: true
      } as WsServerModel
    });
    
    return this.loadComponent(wsServerIOR, scenario);
  }

  async loadP2PServer(port: number = 42778): Promise<Component> {
    const p2pServerIOR = new DefaultIOR().init({
      uuid: crypto.randomUUID(),
      component: 'P2PServer',
      version: '0.3.0.0'
    });
    
    const ownerData = await this.userService.generateOwnerData({
      user: 'system',
      hostname: this.data.host,
      uuid: p2pServerIOR.uuid
    });
    
    const scenario = new Scenario().init({
      ior: p2pServerIOR.toJSON(),
      owner: ownerData,
      model: {
        uuid: p2pServerIOR.uuid,
        name: 'P2P Server Capability',
        description: 'P2P server managed by ONCE kernel',
        port: port,
        state: 'stopped',
        peers: [],
        role: 'peer',
        networkId: `once-network-${this.data.uuid}`,
        webrtc: true,
        signaling: true,
        encryption: true,
        maxPeers: 50
      } as P2PServerModel
    });
    
    return this.loadComponent(p2pServerIOR, scenario);
  }

  /**
   * Private helper methods
   */
  private detectEnvironment(): EnvironmentInfo {
    // Detect actual environment (not just assume Node.js)
    if (typeof window !== 'undefined') {
      return {
        platform: 'browser',
        version: navigator.userAgent,
        capabilities: ['websocket', 'p2p', 'dom'],
        isOnline: navigator.onLine,
        hostname: window.location.hostname,
        ip: 'browser-detected'
      };
    } else if (typeof importScripts !== 'undefined') {
      return {
        platform: 'worker',
        version: 'web-worker',
        capabilities: ['websocket', 'p2p'],
        isOnline: true,
        hostname: 'worker-context',
        ip: 'worker-detected'
      };
    } else {
      return {
        platform: 'node',
        version: process.version || 'unknown',
        capabilities: ['server', 'filesystem', 'network', 'websocket', 'p2p'],
        isOnline: true,
        hostname: this.data.host,
        ip: '127.0.0.1'
      };
    }
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
    // ✅ Create actual Scenario component instance (not data interface)
    const scenario = new Scenario().init({
      ior: { uuid, component: 'ONCE', version: '0.3.0.0' },
      owner: '',
      model: { uuid, name, description } as ONCEModel
    });
    return new DefaultONCE().init(scenario);
  }
}