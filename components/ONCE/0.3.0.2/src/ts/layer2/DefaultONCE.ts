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
import { ServiceRegistry, ServiceRegistration } from '../layer3/ServiceRegistry.interface.js';
import { DefaultServiceRegistry } from './DefaultServiceRegistry.js';
import { IOR } from '../../../../IOR/0.3.0.3/dist/ts/layer3/IOR.interface.js';
import { DefaultIOR } from '../../../../IOR/0.3.0.3/dist/ts/layer2/DefaultIOR.js';
import { Scenario } from '../../../../Scenario/0.3.0.2/dist/ts/Scenario.js';
import { DefaultUser } from '../../../../User/0.3.0.2/dist/ts/layer2/DefaultUser.js';
// Capability component types for dynamic loading (optional)
type HttpServerModel = any; // Dynamic loading - no static dependency
type WsServerModel = any;   // Dynamic loading - no static dependency
type P2PServerModel = any;  // Dynamic loading - no static dependency

export class DefaultONCE implements ONCE {
  private data: ONCEModel;
  private scenarioService: Scenario;       // ✅ DRY: Shared component composition
  private userService: DefaultUser;        // ✅ DRY: Shared component composition
  private serviceRegistry: DefaultServiceRegistry; // ✅ Service integration (42777 server)
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
    this.serviceRegistry = new DefaultServiceRegistry();
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
    if ((scenario as any).model) {
      Object.assign(this.data, (scenario as any).model);
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
    
    // 2. Start ONCE 42777 service registry server
    await this.startServiceRegistry();
    
    // 3. Load default capabilities as services based on environment
    if (environment.platform === 'node') {
      // Node.js environment - load all server capabilities as services
      await this.loadHttpServerAsService(8080);
      await this.loadWsServerAsService(42777);
      await this.loadP2PServerAsService(42778);
    } else if (environment.platform === 'browser') {
      // Browser environment - load client-side capabilities as services
      await this.loadWsServerAsService(42777); // WebSocket client capability
      await this.loadP2PServerAsService(42778); // P2P client capability
    }
    
    this.data.state = 'ready';
    this.data.updatedAt = new Date().toISOString();
    
    console.log(`ONCE Kernel: Boot complete with ${this.data.capabilities.length} capabilities loaded`);
    
    return environment;
  }

  /**
   * Start ONCE 42777 service registry server
   */
  private async startServiceRegistry(): Promise<void> {
    console.log('ONCE: Starting 42777 service registry server...');
    
    try {
      await this.serviceRegistry.startServer();
      
      // Update model with service registry state
      this.data.serviceRegistry = {
        port: 42777,
        host: '0.0.0.0',
        running: true,
        serviceCount: 0
      };
      
      console.log('✅ ONCE: Service registry started - components can register as services');
      
    } catch (error) {
      console.error(`❌ ONCE: Failed to start service registry - ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Load HttpServer as service with registration
   */
  private async loadHttpServerAsService(port: number): Promise<void> {
    console.log(`ONCE: Loading HttpServer as service on port ${port}...`);
    
    const httpServerIOR = new DefaultIOR().init({
      uuid: crypto.randomUUID(),
      component: 'HttpServer',
      version: '0.3.0.0'
    });
    
    const scenario = new Scenario().init({
      ior: httpServerIOR.toJSON(),
      owner: '',
      model: { 
        uuid: httpServerIOR.uuid, 
        name: 'HTTP Server Capability',
        description: 'HTTP server capability component',
        port: port,
        host: '0.0.0.0',
        state: 'stopped'
      } as HttpServerModel
    });
    
    // Load component and register as service
    const component = await this.loadComponent(httpServerIOR, scenario);
    await this.registerComponentAsService(component, httpServerIOR, ['http', 'web', 'api']);
  }

  /**
   * Load WsServer as service with registration
   */
  private async loadWsServerAsService(port: number): Promise<void> {
    console.log(`ONCE: Loading WsServer as service on port ${port}...`);
    
    const wsServerIOR = new DefaultIOR().init({
      uuid: crypto.randomUUID(),
      component: 'WsServer',
      version: '0.3.0.0'
    });
    
    const scenario = new Scenario().init({
      ior: wsServerIOR.toJSON(),
      owner: '',
      model: {
        uuid: wsServerIOR.uuid,
        name: 'WebSocket Server Capability', 
        description: 'WebSocket server capability component',
        port: port,
        host: '0.0.0.0',
        state: 'stopped'
      } as WsServerModel
    });
    
    const component = await this.loadComponent(wsServerIOR, scenario);
    await this.registerComponentAsService(component, wsServerIOR, ['websocket', 'realtime', 'streaming']);
  }

  /**
   * Load P2PServer as service with registration
   */
  private async loadP2PServerAsService(port: number): Promise<void> {
    console.log(`ONCE: Loading P2PServer as service on port ${port}...`);
    
    const p2pServerIOR = new DefaultIOR().init({
      uuid: crypto.randomUUID(),
      component: 'P2PServer',
      version: '0.3.0.0'
    });
    
    const scenario = new Scenario().init({
      ior: p2pServerIOR.toJSON(),
      owner: '',
      model: {
        uuid: p2pServerIOR.uuid,
        name: 'P2P Server Capability',
        description: 'Peer-to-peer server capability component', 
        port: port,
        network: 'web4',
        state: 'stopped'
      } as P2PServerModel
    });
    
    const component = await this.loadComponent(p2pServerIOR, scenario);
    await this.registerComponentAsService(component, p2pServerIOR, ['p2p', 'peer', 'network']);
  }

  /**
   * Register component as service in registry
   */
  private async registerComponentAsService(component: Component, componentIOR: IOR, capabilities: string[]): Promise<void> {
    const registration: ServiceRegistration = {
      componentIOR: componentIOR,
      serviceEndpoint: `http://localhost:42777/services/${componentIOR.uuid}`,
      capabilities: capabilities,
      status: 'registering',
      registeredAt: new Date().toISOString()
    };
    
    await this.serviceRegistry.registerService(registration);
    
    // Update service registry count in model
    if (this.data.serviceRegistry) {
      this.data.serviceRegistry.serviceCount = this.serviceRegistry.getServices().length;
    }
    
    console.log(`✅ ONCE: ${componentIOR.component} registered as service with capabilities: ${capabilities.join(', ')}`);
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
    // Server components loaded dynamically to avoid static dependencies
    try {
      switch (componentIOR.component) {
        case 'HttpServer':
          component = await this.loadServerComponentDynamically('HttpServer', scenario);
          console.log(`ONCE Kernel: Loaded HttpServer on port ${(scenario.model as any).port}`);
          break;
        
        case 'WsServer': 
          component = await this.loadServerComponentDynamically('WsServer', scenario);
          console.log(`ONCE Kernel: Loaded WsServer on port ${(scenario.model as any).port}`);
          break;
        
        case 'P2PServer':
          component = await this.loadServerComponentDynamically('P2PServer', scenario);
          console.log(`ONCE Kernel: Loaded P2PServer on port ${(scenario.model as any).port}`);
          break;
        
        default:
          throw new Error(`ONCE Kernel: Unknown component type: ${componentIOR.component}`);
      }
    } catch (error) {
      console.error(`⚠️ ONCE Kernel: Failed to load ${componentIOR.component}: ${(error as Error).message}`);
      console.log('💡 Server component may not be available - continuing without it');
      
      // Create minimal component stub for graceful degradation
      component = this.createComponentStub(componentIOR, scenario);
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
      version: '0.3.0.2'
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
      } as any
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
   * CLI Command Methods - Same names as CLI commands for delegation
   * Enhanced with service registry integration
   */

  /**
   * Start ONCE kernel with service registry (CLI delegation target)
   */
  async start(args: string[]): Promise<void> {
    console.log('ONCE: Starting kernel with service registry...');
    await this.bootEnvironment();
    console.log('ONCE: Kernel started successfully with 42777 service registry');
    
    // Show service registry status
    const registryStatus = this.serviceRegistry.getStatus();
    console.log(`✅ Service Registry: ${registryStatus.activeServices}/${registryStatus.serviceCount} services active`);
  }

  /**
   * Stop ONCE kernel and service registry (CLI delegation target) 
   */
  async stop(args: string[]): Promise<void> {
    console.log('ONCE: Stopping kernel and service registry...');
    
    // Stop service registry server
    await this.serviceRegistry.stopServer();
    
    // Stop all loaded components
    for (const [uuid, component] of this.loadedComponents) {
      if (typeof component.stop === 'function') {
        await component.stop([]);
      }
    }
    
    // Update service registry state
    if (this.data.serviceRegistry) {
      this.data.serviceRegistry.running = false;
      this.data.serviceRegistry.serviceCount = 0;
    }
    
    this.data.state = 'booting'; // Reset to initial state
    console.log('ONCE: Kernel and service registry stopped');
  }

  /**
   * Get ONCE status with service registry (CLI delegation target)
   */
  async status(args: string[]): Promise<void> {
    console.log(`ONCE Kernel Status:`);
    console.log(`  State: ${this.data.state}`);
    console.log(`  Environment: ${this.data.environment}`);
    console.log(`  Capabilities: ${this.data.capabilities.length}`);
    console.log(`  Loaded Components: ${this.data.loadedComponents.length}`);
    console.log(`  Domain: ${this.data.domain}`);
    console.log(`  Host: ${this.data.host}`);
    
    // Service registry status
    if (this.data.serviceRegistry) {
      console.log(`\nService Registry Status:`);
      console.log(`  Port: ${this.data.serviceRegistry.port}`);
      console.log(`  Running: ${this.data.serviceRegistry.running}`);
      console.log(`  Registered Services: ${this.data.serviceRegistry.serviceCount}`);
      
      const services = this.serviceRegistry.getServices();
      if (services.length > 0) {
        console.log(`\nRegistered Services:`);
        for (const service of services) {
          console.log(`  - ${service.componentIOR.component}: ${service.status} (${service.capabilities.join(', ')})`);
        }
      }
    }
  }

  /**
   * Get ONCE info (CLI delegation target)
   */
  async info(args: string[]): Promise<void> {
    console.log(`ONCE - Object Network Communication Engine`);
    console.log(`Version: 0.3.0.0`);
    console.log(`Description: ${this.data.description}`);
    console.log(`UUID: ${this.data.uuid}`);
    console.log(`Domain: ${this.data.domain}`);
    console.log(`Environment: ${this.data.environment}`);
    
    if (this.data.capabilities.length > 0) {
      console.log(`\nLoaded Capabilities:`);
      for (const capability of this.data.capabilities) {
        console.log(`  - ${capability.component}:${capability.version} (${capability.uuid})`);
      }
    }
  }

  /**
   * Show ONCE help with service integration (CLI delegation target)
   */
  async help(args: string[]): Promise<void> {
    console.log(`ONCE - Object Network Communication Engine CLI`);
    console.log(`\nCommands:`);
    console.log(`  start           - Start ONCE kernel with 42777 service registry`);
    console.log(`  stop            - Stop ONCE kernel and service registry`);
    console.log(`  status          - Show kernel and service registry status`);
    console.log(`  info            - Show kernel information`);
    console.log(`  deinstall       - Clean all Web4 components and force rebuild`);
    console.log(`  help            - Show this help`);
    console.log(`\nKernel Commands:`);
    console.log(`  boot            - Boot environment and start service registry`);
    console.log(`  load <component> - Load component by name as service`);
    console.log(`  unload <uuid>   - Unload component service by UUID`);
    console.log(`  list            - List loaded components and services`);
    console.log(`  services        - Show service registry status`);
  }

  /**
   * Show service registry status (ONCE-specific command)
   */
  async services(args: string[]): Promise<void> {
    const registryStatus = this.serviceRegistry.getStatus();
    
    console.log(`ONCE Service Registry (Port ${registryStatus.port}):`);
    console.log(`  Status: ${registryStatus.running ? 'Running' : 'Stopped'}`);
    console.log(`  Services: ${registryStatus.activeServices}/${registryStatus.serviceCount} active`);
    
    if (registryStatus.services.length > 0) {
      console.log(`\nRegistered Services:`);
      for (const service of registryStatus.services) {
        console.log(`  - ${service.componentIOR.component}:${service.componentIOR.version}`);
        console.log(`    Status: ${service.status}`);
        console.log(`    Endpoint: ${service.serviceEndpoint}`);
        console.log(`    Capabilities: ${service.capabilities.join(', ')}`);
        console.log(`    Registered: ${service.registeredAt}`);
        console.log('');
      }
    } else {
      console.log('\nNo services currently registered.');
    }
  }

  /**
   * Deinstall command - comprehensive ecosystem clean build reset
   * Following Web4 principles: TypeScript method with CLI delegation
   * Delegates to Build component for dependency-free implementation
   */
  async deinstall(args: string[] = []): Promise<void> {
    console.log('ONCE: Starting comprehensive ecosystem deinstall...');
    
    // Stop any running services first
    await this.stop([]);
    
    // Delegate to Build component for comprehensive cleaning
    await this.delegateToBuildComponent();
    
    // Clear ONCE-specific state
    this.clearONCEState();
    
    console.log('✅ ONCE: Complete ecosystem deinstall successful');
    console.log('💡 Run "once start" to rebuild and restart the ecosystem');
  }

  /**
   * Delegate deinstall to Build component (dependency-free)
   */
  private async delegateToBuildComponent(): Promise<void> {
    try {
      // Dynamic import to avoid build-time dependencies
      const { DefaultBuild } = await import('../../../Build/0.3.0.3/dist/ts/layer2/DefaultBuild.js');
      const buildComponent = new DefaultBuild();
      
      console.log('ONCE: Delegating to Build component for comprehensive cleaning...');
      await buildComponent.cleanAllComponents();
      
    } catch (error) {
      console.error(`⚠️ ONCE: Build component delegation failed: ${(error as Error).message}`);
      console.log('💡 Falling back to basic component cleaning');
      
      // Fallback to basic cleaning if Build component unavailable
      await this.basicComponentCleaning();
    }
  }

  /**
   * Clear ONCE-specific state after deinstall
   */
  private clearONCEState(): void {
    // Clear component registries
    this.loadedComponents.clear();
    this.data.loadedComponents = [];
    this.data.capabilities = [];
    
    // Reset service registry state
    if (this.data.serviceRegistry) {
      this.data.serviceRegistry.serviceCount = 0;
      this.data.serviceRegistry.running = false;
    }
    
    // Reset kernel state
    this.data.state = 'booting';
    this.data.updatedAt = new Date().toISOString();
  }

  /**
   * Basic component cleaning fallback (if Build component unavailable)
   */
  private async basicComponentCleaning(): Promise<void> {
    console.log('ONCE: Performing basic component cleaning...');
    
    try {
      // Clean loaded components
      for (const [uuid, component] of this.loadedComponents) {
        if (typeof (component as any).clean === 'function') {
          console.log(`🧹 Cleaning component: ${uuid}`);
          await (component as any).clean([]);
        }
      }
      
      console.log('✅ ONCE: Basic component cleaning completed');
      
    } catch (error) {
      console.error(`⚠️ ONCE: Basic cleaning encountered issues: ${(error as Error).message}`);
      console.log('💡 Some components may require manual cleanup');
    }
  }

  /**
   * Load server component dynamically (optional loading)
   */
  private async loadServerComponentDynamically(componentType: string, scenario: Scenario): Promise<Component> {
    try {
      const componentPath = `../../../${componentType}/0.3.0.2/dist/ts/layer2/Default${componentType}.js`;
      const module = await import(componentPath);
      const ComponentClass = module[`Default${componentType}`];
      
      if (!ComponentClass) {
        throw new Error(`Default${componentType} not exported`);
      }
      
      return new ComponentClass().init(scenario);
      
    } catch (error) {
      console.log(`⚠️ ONCE: ${componentType} not available for dynamic loading: ${(error as Error).message}`);
      throw error; // Re-throw to trigger fallback
    }
  }

  /**
   * Create component stub for graceful degradation
   */
  private createComponentStub(componentIOR: IOR, scenario: Scenario): Component {
    return {
      init: (scenario: Scenario) => this,
      toJSON: () => scenario.model || {},
      validate: () => true,
      start: async () => { console.log(`Stub: ${componentIOR.component} start`); },
      stop: async () => { console.log(`Stub: ${componentIOR.component} stop`); },
      status: async () => { console.log(`Stub: ${componentIOR.component} status`); }
    } as Component;
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