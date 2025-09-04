/**
 * DefaultHttpServer - HTTP server capability component implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Following established radical OOP pattern from IOR and ONCE components
 * Self-managed HTTP server capability with type-safe HttpServerModel
 */

import { HttpServer } from '../layer3/HttpServer.interface.js';
import { HttpServerModel } from '../layer3/HttpServerModel.interface.js';
import { IOR, DefaultIOR, ServiceCapable } from '../../../../IOR/0.3.0.0/dist/ts/layer3/IOR.interface.js';
import { ServiceRegistration } from '../../../ONCE/0.3.0.0/src/ts/layer3/ServiceRegistry.interface.js';
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/layer2/DefaultScenario.js';
import { DefaultUser } from '../../../../User/0.1.3.0/dist/ts/DefaultUser.js';

export class DefaultHttpServer implements HttpServer {
  private data: HttpServerModel;
  private scenarioService: Scenario;     // ✅ DRY: Shared component composition
  private userService: DefaultUser;      // ✅ DRY: Shared component composition
  private serviceRegistration?: ServiceRegistration; // ✅ Service integration state
  private iorComponent: DefaultIOR;   // ✅ DRY: Shared IOR component

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with complete HTTP server data (Model interface compliance)
    this.data = {
      uuid: '',
      name: 'HTTP Server',
      description: 'HTTP Server Capability Component',
      port: 8080,
      state: 'stopped',
      routes: [],           // IOR references to route components
      connections: [],      // IOR references to connection components
      maxConnections: 100,  // ✅ Config in model (scenarios ARE configs)
      timeout: 30000,       // ✅ Config in model (scenarios ARE configs)
      keepAlive: true,      // ✅ Config in model (scenarios ARE configs)
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
  get model(): HttpServerModel { 
    return this.data; 
  }
  
  set model(value: HttpServerModel) { 
    this.data = value;
    this.onChange?.(this.data);
  }

  /**
   * Radical OOP: Class-based proxy with encapsulation
   */
  private createProxy(): DefaultHttpServer {
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
  onChange?: (data: HttpServerModel) => void;

  /**
   * HttpServer Interface Implementation
   */

  async startServer(): Promise<void> {
    this.data.state = 'starting';
    this.data.startedAt = new Date().toISOString();
    
    // HTTP server implementation would go here
    console.log(`HttpServer: Starting HTTP server on port ${this.data.port}`);
    
    this.data.state = 'running';
  }

  async stopServer(): Promise<void> {
    this.data.state = 'stopping';
    
    // HTTP server shutdown would go here
    console.log(`HttpServer: Stopping HTTP server on port ${this.data.port}`);
    
    this.data.state = 'stopped';
    this.data.stoppedAt = new Date().toISOString();
  }

  addRoute(routeIOR: IOR): void {
    // Add route component reference (Web4 principle: routes are components)
    this.data.routes.push(routeIOR);
    console.log(`HttpServer: Added route component ${routeIOR.component}:${routeIOR.uuid}`);
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
        component: 'HttpServer',
        version: '0.3.0.0'
      },
      owner: ownerData,
      model: this.data as HttpServerModel
    });

    return scenario;
  }

  /**
   * CLI Command Methods - Same names as CLI commands for delegation
   * Enhanced with hybrid operation mode support
   */

  async start(args: string[]): Promise<void> {
    console.log('HttpServer: Starting server...');
    
    // Check for service mode flag
    const serviceMode = args.includes('--service') || args.includes('-s');
    const onceServer = this.findOnceServer();
    
    if (serviceMode && onceServer) {
      // Service mode: Register with ONCE server
      await this.startAsService(onceServer);
    } else if (onceServer) {
      // Hybrid mode: Start standalone but register as available service
      await this.startStandalone();
      await this.registerAsService(onceServer);
    } else {
      // Standalone mode: Independent operation
      await this.startStandalone();
    }
    
    console.log(`HttpServer: Started successfully in ${serviceMode ? 'service' : 'standalone'} mode`);
  }

  async stop(args: string[]): Promise<void> {
    console.log('HttpServer: Stopping server...');
    this.data.state = 'stopped';
    console.log('HttpServer: Server stopped');
  }

  async status(args: string[]): Promise<void> {
    console.log(`HttpServer Status:`);
    console.log(`  State: ${this.data.state}`);
    console.log(`  Port: ${this.data.port}`);
    console.log(`  Host: ${this.data.host}`);
    console.log(`  Routes: ${this.data.routes.length}`);
    console.log(`  SSL Enabled: ${this.data.sslEnabled}`);
  }

  async info(args: string[]): Promise<void> {
    console.log(`HttpServer - HTTP Server Capability`);
    console.log(`Version: 0.3.0.0`);
    console.log(`Description: ${this.data.description}`);
    console.log(`UUID: ${this.data.uuid}`);
    console.log(`Port: ${this.data.port}`);
    console.log(`Host: ${this.data.host}`);
    console.log(`State: ${this.data.state}`);
  }

  async addRoute(args: string[]): Promise<void> {
    if (args.length < 2) {
      throw new Error('addRoute requires method and path');
    }
    const method = args[0];
    const path = args[1];
    
    console.log(`HttpServer: Added ${method} route: ${path}`);
  }

  async listRoutes(args: string[]): Promise<void> {
    console.log(`HttpServer Routes (${this.data.routes.length}):`);
    for (const route of this.data.routes) {
      console.log(`  - Reference: ${route.component}:${route.version} (${route.uuid})`);
    }
  }

  /**
   * Utility methods following IOR pattern
   */
  toJSON(): HttpServerModel {
    return { ...this.data };
  }

  validate(): boolean {
    return !!(this.data.uuid && this.data.name && this.data.description);
  }

  /**
   * ServiceCapable Interface Implementation - Hybrid Operation Support
   */

  async registerAsService(onceServerEndpoint: string = 'http://localhost:42777'): Promise<void> {
    console.log('HttpServer: Registering as service with ONCE server...');
    
    const registration: ServiceRegistration = {
      componentIOR: this.getIOR(),
      serviceEndpoint: `${onceServerEndpoint}/services/${this.data.uuid}`,
      capabilities: this.getCapabilities(),
      status: 'registering',
      registeredAt: new Date().toISOString()
    };
    
    this.serviceRegistration = registration;
    console.log('HttpServer: Service registration complete');
  }

  async unregisterFromService(): Promise<void> {
    if (this.serviceRegistration) {
      console.log('HttpServer: Unregistering from service...');
      this.serviceRegistration = undefined;
      console.log('HttpServer: Service unregistration complete');
    }
  }

  isRegisteredAsService(): boolean {
    return !!this.serviceRegistration;
  }

  getServiceRegistration(): ServiceRegistration | undefined {
    return this.serviceRegistration;
  }

  async startAsService(onceServerEndpoint: string): Promise<void> {
    console.log('HttpServer: Starting as service...');
    await this.startStandalone();
    await this.registerAsService(onceServerEndpoint);
  }

  async startStandalone(): Promise<void> {
    console.log('HttpServer: Starting in standalone mode...');
    this.data.state = 'running';
    console.log(`HttpServer: Standalone server started on port ${this.data.port}`);
  }

  findOnceServer(): string | undefined {
    // Check for ONCE server on default port 42777
    // In real implementation, this would check network connectivity
    return 'http://localhost:42777';
  }

  getCapabilities(): string[] {
    return ['http', 'web', 'api', 'rest'];
  }

  /**
   * Get component IOR for service registration
   */
  private getIOR(): IOR {
    return {
      uuid: this.data.uuid,
      component: 'HttpServer',
      version: '0.3.0.0',
      endpoint: `http://${this.data.host}:${this.data.port}`
    };
  }

  static create(uuid: string, name: string, description: string, port: number): DefaultHttpServer {
    const scenario = new Scenario().init({
      ior: { uuid, component: 'HttpServer', version: '0.3.0.0' },
      owner: '',
      model: { uuid, name, description, port } as HttpServerModel
    });
    return new DefaultHttpServer().init(scenario);
  }
}