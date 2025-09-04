/**
 * Service Integration Testing Suite
 * 
 * Tests ONCE 42777 service registry, component registration, and hybrid operation modes
 * Validates service integration requirement (9990416c-77ec-4a83-b24c-b23825cbefa0)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { DefaultONCE } from '../../components/ONCE/0.3.0.0/src/ts/layer2/DefaultONCE.js';
import { DefaultServiceRegistry } from '../../components/ONCE/0.3.0.0/src/ts/layer2/DefaultServiceRegistry.js';
import { DefaultHttpServer } from '../../components/HttpServer/0.3.0.0/src/ts/layer2/DefaultHttpServer.js';
import { DefaultWsServer } from '../../components/WsServer/0.3.0.0/src/ts/layer2/DefaultWsServer.js';
import { DefaultP2PServer } from '../../components/P2PServer/0.3.0.0/src/ts/layer2/DefaultP2PServer.js';

describe('ONCE Service Integration Testing', () => {
  let once: DefaultONCE;
  let serviceRegistry: DefaultServiceRegistry;

  beforeEach(() => {
    once = new DefaultONCE();
    serviceRegistry = new DefaultServiceRegistry();
  });

  afterEach(async () => {
    // Cleanup: Stop any running services
    try {
      await once.stop([]);
      await serviceRegistry.stopServer();
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('Service Registry Server', () => {
    test('ONCE 42777 service registry starts successfully', async () => {
      await serviceRegistry.startServer();
      
      const status = serviceRegistry.getStatus();
      expect(status.running).toBe(true);
      expect(status.port).toBe(42777);
      expect(status.serviceCount).toBe(0);
    });

    test('Service registry stops gracefully', async () => {
      await serviceRegistry.startServer();
      await serviceRegistry.stopServer();
      
      const status = serviceRegistry.getStatus();
      expect(status.running).toBe(false);
    });

    test('Service registry handles multiple start/stop cycles', async () => {
      // Start
      await serviceRegistry.startServer();
      expect(serviceRegistry.getStatus().running).toBe(true);
      
      // Stop
      await serviceRegistry.stopServer();
      expect(serviceRegistry.getStatus().running).toBe(false);
      
      // Start again
      await serviceRegistry.startServer();
      expect(serviceRegistry.getStatus().running).toBe(true);
    });
  });

  describe('Component Service Registration', () => {
    test('HttpServer registers as service correctly', async () => {
      const httpServer = new DefaultHttpServer();
      await httpServer.registerAsService('http://localhost:42777');
      
      expect(httpServer.isRegisteredAsService()).toBe(true);
      
      const registration = httpServer.getServiceRegistration();
      expect(registration?.componentIOR.component).toBe('HttpServer');
      expect(registration?.capabilities).toContain('http');
      expect(registration?.status).toBe('registering');
    });

    test('WsServer registers with correct capabilities', async () => {
      const wsServer = new DefaultWsServer();
      await wsServer.registerAsService();
      
      const registration = wsServer.getServiceRegistration();
      expect(registration?.capabilities).toContain('websocket');
      expect(registration?.capabilities).toContain('realtime');
    });

    test('P2PServer registers with P2P capabilities', async () => {
      const p2pServer = new DefaultP2PServer();
      await p2pServer.registerAsService();
      
      const registration = p2pServer.getServiceRegistration();
      expect(registration?.capabilities).toContain('p2p');
      expect(registration?.capabilities).toContain('peer');
    });

    test('Components unregister from service correctly', async () => {
      const httpServer = new DefaultHttpServer();
      
      await httpServer.registerAsService();
      expect(httpServer.isRegisteredAsService()).toBe(true);
      
      await httpServer.unregisterFromService();
      expect(httpServer.isRegisteredAsService()).toBe(false);
    });
  });

  describe('ONCE Kernel Service Integration', () => {
    test('ONCE boots environment with service registry', async () => {
      const environment = await once.bootEnvironment();
      
      expect(environment.platform).toBeDefined();
      
      // Check if service registry is running
      const onceData = once.toJSON();
      expect(onceData.serviceRegistry?.running).toBe(true);
      expect(onceData.serviceRegistry?.port).toBe(42777);
    });

    test('ONCE loads components as services', async () => {
      await once.bootEnvironment();
      
      // Load HttpServer component
      await once.load(['HttpServer']);
      
      const loadedComponents = once.getLoadedComponents();
      expect(loadedComponents.length).toBeGreaterThan(0);
      expect(loadedComponents.some(c => c.component === 'HttpServer')).toBe(true);
    });

    test('ONCE service registry tracks registered services', async () => {
      await once.bootEnvironment();
      
      // Boot should auto-load capability components as services
      const onceData = once.toJSON();
      expect(onceData.serviceRegistry?.serviceCount).toBeGreaterThan(0);
    });
  });

  describe('Hybrid Operation Modes', () => {
    test('Component starts in standalone mode by default', async () => {
      const httpServer = new DefaultHttpServer();
      await httpServer.startStandalone();
      
      const serverData = httpServer.toJSON();
      expect(serverData.state).toBe('running');
    });

    test('Component starts as service when explicitly requested', async () => {
      const httpServer = new DefaultHttpServer();
      await httpServer.startAsService('http://localhost:42777');
      
      expect(httpServer.isRegisteredAsService()).toBe(true);
      
      const serverData = httpServer.toJSON();
      expect(serverData.state).toBe('running');
    });

    test('Component finds ONCE server for hybrid operation', () => {
      const httpServer = new DefaultHttpServer();
      const onceServer = httpServer.findOnceServer();
      
      expect(onceServer).toBe('http://localhost:42777');
    });

    test('Component capabilities are correctly defined', () => {
      const httpServer = new DefaultHttpServer();
      const wsServer = new DefaultWsServer();
      const p2pServer = new DefaultP2PServer();
      
      expect(httpServer.getCapabilities()).toContain('http');
      expect(wsServer.getCapabilities()).toContain('websocket');
      expect(p2pServer.getCapabilities()).toContain('p2p');
    });
  });

  describe('Service Discovery', () => {
    test('Service registry finds services by capability', async () => {
      await serviceRegistry.startServer();
      
      // Register HttpServer
      const httpServer = new DefaultHttpServer();
      await httpServer.registerAsService();
      
      if (httpServer.getServiceRegistration()) {
        await serviceRegistry.registerService(httpServer.getServiceRegistration()!);
      }
      
      // Find HTTP services
      const httpServices = serviceRegistry.findServicesByCapability('http');
      expect(httpServices.length).toBe(1);
      expect(httpServices[0].componentIOR.component).toBe('HttpServer');
    });

    test('Service registry manages multiple services', async () => {
      await serviceRegistry.startServer();
      
      // Register multiple services
      const httpServer = new DefaultHttpServer();
      const wsServer = new DefaultWsServer();
      
      await httpServer.registerAsService();
      await wsServer.registerAsService();
      
      if (httpServer.getServiceRegistration()) {
        await serviceRegistry.registerService(httpServer.getServiceRegistration()!);
      }
      if (wsServer.getServiceRegistration()) {
        await serviceRegistry.registerService(wsServer.getServiceRegistration()!);
      }
      
      const allServices = serviceRegistry.getServices();
      expect(allServices.length).toBe(2);
    });
  });
});