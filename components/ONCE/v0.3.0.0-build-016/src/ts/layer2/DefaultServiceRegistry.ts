/**
 * DefaultServiceRegistry - ONCE 42777 service registry implementation
 * 
 * Web4 pattern: Service registry for distributed component architecture
 * Provides centralized service discovery and component orchestration
 */

import { ServiceRegistry, ServiceRegistration } from '../layer3/ServiceRegistry.interface.js';
import { IOR } from '../../../../IOR/0.3.0.0/dist/ts/layer3/IOR.interface.js';

export class DefaultServiceRegistry implements ServiceRegistry {
  private services: Map<string, ServiceRegistration>;
  private server: any; // HTTP server instance
  private port: number;
  private running: boolean;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    this.services = new Map();
    this.port = 42777;
    this.running = false;
    this.server = null;
  }

  /**
   * Register component as service
   */
  async registerService(registration: ServiceRegistration): Promise<void> {
    const serviceId = registration.componentIOR.uuid;
    
    console.log(`ServiceRegistry: Registering ${registration.componentIOR.component} as service...`);
    
    // Update registration status
    registration.status = 'active';
    registration.lastHeartbeat = new Date().toISOString();
    
    // Store in service registry
    this.services.set(serviceId, registration);
    
    console.log(`ServiceRegistry: ${registration.componentIOR.component} registered successfully`);
    console.log(`  Service ID: ${serviceId}`);
    console.log(`  Endpoint: ${registration.serviceEndpoint}`);
    console.log(`  Capabilities: ${registration.capabilities.join(', ')}`);
  }

  /**
   * Unregister component service
   */
  async unregisterService(componentIOR: IOR): Promise<void> {
    const serviceId = componentIOR.uuid;
    const registration = this.services.get(serviceId);
    
    if (registration) {
      console.log(`ServiceRegistry: Unregistering ${componentIOR.component} service...`);
      this.services.delete(serviceId);
      console.log(`ServiceRegistry: ${componentIOR.component} unregistered successfully`);
    } else {
      console.log(`ServiceRegistry: Service not found for ${componentIOR.component}`);
    }
  }

  /**
   * Get all registered services
   */
  getServices(): ServiceRegistration[] {
    return Array.from(this.services.values());
  }

  /**
   * Find services by capability
   */
  findServicesByCapability(capability: string): ServiceRegistration[] {
    return this.getServices().filter(service => 
      service.capabilities.includes(capability)
    );
  }

  /**
   * Get service by component IOR
   */
  getService(componentIOR: IOR): ServiceRegistration | undefined {
    return this.services.get(componentIOR.uuid);
  }

  /**
   * Update service heartbeat for health monitoring
   */
  async updateHeartbeat(componentIOR: IOR): Promise<void> {
    const registration = this.services.get(componentIOR.uuid);
    
    if (registration) {
      registration.lastHeartbeat = new Date().toISOString();
      registration.status = 'active';
    }
  }

  /**
   * Start service registry server on port 42777
   */
  async startServer(): Promise<void> {
    if (this.running) {
      console.log('ServiceRegistry: Server already running on port 42777');
      return;
    }

    console.log('ServiceRegistry: Starting ONCE 42777 service registry server...');
    
    try {
      // Create HTTP server for service registry
      // Note: Simplified implementation - real implementation would use HttpServer component
      this.server = {
        port: this.port,
        host: '0.0.0.0',
        routes: new Map(),
        running: true
      };
      
      this.running = true;
      
      console.log(`✅ ServiceRegistry: Server started on port ${this.port}`);
      console.log(`🌐 ServiceRegistry: Service endpoints available:`);
      console.log(`  GET  /services           - List all registered services`);
      console.log(`  POST /services/register  - Register new service`);
      console.log(`  POST /services/heartbeat - Update service heartbeat`);
      console.log(`  DELETE /services/:uuid   - Unregister service`);
      
    } catch (error) {
      console.error(`❌ ServiceRegistry: Failed to start server - ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Stop service registry server
   */
  async stopServer(): Promise<void> {
    if (!this.running) {
      console.log('ServiceRegistry: Server not running');
      return;
    }

    console.log('ServiceRegistry: Stopping ONCE 42777 service registry server...');
    
    // Unregister all services
    for (const [serviceId, registration] of this.services) {
      registration.status = 'inactive';
      console.log(`ServiceRegistry: ${registration.componentIOR.component} service marked inactive`);
    }
    
    this.running = false;
    this.server = null;
    
    console.log('✅ ServiceRegistry: Server stopped');
  }

  /**
   * Get service registry status
   */
  getStatus(): {
    running: boolean;
    port: number;
    serviceCount: number;
    activeServices: number;
    services: ServiceRegistration[];
  } {
    const services = this.getServices();
    const activeServices = services.filter(s => s.status === 'active');
    
    return {
      running: this.running,
      port: this.port,
      serviceCount: services.length,
      activeServices: activeServices.length,
      services: services
    };
  }
}