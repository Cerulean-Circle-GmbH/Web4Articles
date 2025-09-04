/**
 * Build Chain Comprehensive Testing Suite
 * 
 * Tests dependency resolution, automated building, and build orchestration
 * Validates comprehensive build chain requirement (b8c851d0-5c90-4c17-8465-26c765fb1a13)
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { DependencyResolver } from '../../components/Build/0.3.0.0/src/ts/layer1/DependencyResolver.js';
import { DefaultBuild } from '../../components/Build/0.3.0.0/src/ts/layer2/DefaultBuild.js';

describe('Build Chain Comprehensive Testing', () => {
  let dependencyResolver: DependencyResolver;
  let build: DefaultBuild;

  beforeEach(() => {
    dependencyResolver = new DependencyResolver();
    build = new DefaultBuild();
  });

  describe('Dependency Resolution', () => {
    test('resolves correct build order for ONCE component', () => {
      const onceOrder = dependencyResolver.resolveBuildOrder('ONCE');
      
      expect(onceOrder).toEqual([
        'IOR', 'Scenario', 'User', 'HttpServer', 'WsServer', 'P2PServer', 'ONCE'
      ]);
    });

    test('resolves correct build order for HttpServer component', () => {
      const httpServerOrder = dependencyResolver.resolveBuildOrder('HttpServer');
      
      expect(httpServerOrder).toEqual([
        'IOR', 'Scenario', 'User', 'HttpServer'
      ]);
    });

    test('handles foundation components correctly', () => {
      const iorOrder = dependencyResolver.resolveBuildOrder('IOR');
      expect(iorOrder).toEqual(['IOR']);

      const scenarioOrder = dependencyResolver.resolveBuildOrder('Scenario');
      expect(scenarioOrder).toEqual(['IOR', 'Scenario']);
    });

    test('gets complete Web4 ecosystem build order', () => {
      const completeBuildOrder = dependencyResolver.getCompleteBuildOrder();
      
      expect(completeBuildOrder).toContain('IOR');
      expect(completeBuildOrder).toContain('ONCE');
      expect(completeBuildOrder.indexOf('IOR')).toBeLessThan(completeBuildOrder.indexOf('ONCE'));
      expect(completeBuildOrder.indexOf('Scenario')).toBeLessThan(completeBuildOrder.indexOf('ONCE'));
    });

    test('validates dependency graph has no cycles', () => {
      const validation = dependencyResolver.validateGraph();
      
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('Build Status Tracking', () => {
    test('tracks component build status correctly', () => {
      expect(dependencyResolver.isComponentBuilt('IOR')).toBe(false);
      
      dependencyResolver.markBuilding('IOR');
      expect(dependencyResolver.getComponentStatus('IOR')?.building).toBe(true);
      
      dependencyResolver.markBuilt('IOR');
      expect(dependencyResolver.isComponentBuilt('IOR')).toBe(true);
    });

    test('handles build failures correctly', () => {
      dependencyResolver.markFailed('TestComponent', 'Test error');
      
      const status = dependencyResolver.getComponentStatus('TestComponent');
      expect(status?.failed).toBe(true);
      expect(status?.error).toBe('Test error');
    });

    test('resets build status correctly', () => {
      dependencyResolver.markBuilt('IOR');
      dependencyResolver.reset();
      
      expect(dependencyResolver.isComponentBuilt('IOR')).toBe(false);
    });
  });

  describe('Build Orchestration', () => {
    test('Build component initializes with correct default configuration', () => {
      const buildData = build.toJSON();
      
      expect(buildData.name).toBe('Build Manager');
      expect(buildData.environment).toBe('node');
      expect(buildData.npmInstall).toBe(true);
      expect(buildData.typeScriptBuild).toBe(true);
      expect(buildData.buildState).toBe('pending');
    });

    test('Environment check detects node and npm correctly', async () => {
      const envCheck = await build.checkEnvironment();
      
      expect(envCheck.node.available).toBe(true);
      expect(envCheck.npm.available).toBe(true);
      expect(envCheck.ready).toBe(true);
      expect(envCheck.platform).toBeDefined();
    });

    test('Build state tracking provides comprehensive information', () => {
      const buildState = build.getBuildState();
      
      expect(buildState.state).toBeDefined();
      expect(buildState.progress).toBeGreaterThanOrEqual(0);
      expect(buildState.environmentReady).toBeDefined();
      expect(Array.isArray(buildState.completedBuilds)).toBe(true);
      expect(Array.isArray(buildState.failedBuilds)).toBe(true);
    });
  });

  describe('Component Path Resolution', () => {
    test('resolves component paths correctly', () => {
      // Test private method via build component functionality
      const iorIOR = { uuid: 'test', component: 'IOR', version: '0.3.0.0' };
      const onceIOR = { uuid: 'test', component: 'ONCE', version: '0.3.0.0' };
      
      // These should not throw errors when building
      expect(() => build.resolveDependencies(iorIOR)).not.toThrow();
      expect(() => build.resolveDependencies(onceIOR)).not.toThrow();
    });
  });
});