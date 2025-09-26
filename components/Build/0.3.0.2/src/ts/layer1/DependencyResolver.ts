/**
 * DependencyResolver - Web4 component dependency resolution and build ordering
 * 
 * Web4 pattern: Infrastructure layer component for build orchestration
 * Provides intelligent dependency graph resolution with topological sorting
 */

import { IOR } from '../../../IOR/0.3.0.2/src/ts/layer3/IOR.interface.js';

export interface ComponentDependency {
  component: string;
  dependencies: string[];
  version: string;
  built: boolean;
  building: boolean;
  failed: boolean;
  error?: string;
}

export class DependencyResolver {
  private dependencyGraph: Map<string, string[]>;
  private componentStatus: Map<string, ComponentDependency>;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Complete Web4 ecosystem dependency graph
    this.dependencyGraph = new Map([
      // Foundation components (no dependencies)
      ['IOR', []],
      
      // Core components (depend on foundation)
      ['Scenario', ['IOR']],
      ['User', ['IOR', 'Scenario']],
      
      // Infrastructure components
      ['Build', ['IOR', 'Scenario', 'User']],
      
      // Capability components (depend on core)
      ['HttpServer', ['IOR', 'Scenario', 'User']],
      ['WsServer', ['IOR', 'Scenario', 'User']],
      ['P2PServer', ['IOR', 'Scenario', 'User']],
      
      // Kernel component (depends on all capabilities)
      ['ONCE', ['IOR', 'Scenario', 'User', 'HttpServer', 'WsServer', 'P2PServer']],
      
      // Legacy components (maintain compatibility)
      ['Web4Requirement', ['IOR', 'Scenario', 'User']],
      ['Unit', ['IOR', 'Scenario']]
    ]);

    this.componentStatus = new Map();
    this.initializeComponentStatus();
  }

  /**
   * Initialize component status tracking
   */
  private initializeComponentStatus(): void {
    for (const [component, dependencies] of this.dependencyGraph) {
      this.componentStatus.set(component, {
        component,
        dependencies,
        version: '0.3.0.0',
        built: false,
        building: false,
        failed: false
      });
    }
  }

  /**
   * Resolve complete build order for component using topological sort
   */
  resolveBuildOrder(targetComponent: string): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const buildOrder: string[] = [];

    const visit = (component: string): void => {
      if (visited.has(component)) return;
      
      if (visiting.has(component)) {
        throw new Error(`Circular dependency detected involving ${component}`);
      }

      visiting.add(component);

      // Visit all dependencies first
      const dependencies = this.dependencyGraph.get(component) || [];
      for (const dependency of dependencies) {
        visit(dependency);
      }

      visiting.delete(component);
      visited.add(component);
      buildOrder.push(component);
    };

    visit(targetComponent);
    return buildOrder;
  }

  /**
   * Get all components in complete build order
   */
  getCompleteBuildOrder(): string[] {
    // Build order for entire Web4 ecosystem
    return [
      'IOR',           // Foundation
      'Scenario',      // Configuration
      'User',          // Identity
      'Build',         // Infrastructure
      'Unit',          // Legacy support
      'Web4Requirement', // Legacy support
      'HttpServer',    // HTTP capability
      'WsServer',      // WebSocket capability
      'P2PServer',     // P2P capability
      'ONCE'           // Kernel (depends on all)
    ];
  }

  /**
   * Check if component is built and ready
   */
  isComponentBuilt(component: string): boolean {
    const status = this.componentStatus.get(component);
    return status?.built || false;
  }

  /**
   * Mark component as building
   */
  markBuilding(component: string): void {
    const status = this.componentStatus.get(component);
    if (status) {
      status.building = true;
      status.built = false;
      status.failed = false;
    }
  }

  /**
   * Mark component as built successfully
   */
  markBuilt(component: string): void {
    const status = this.componentStatus.get(component);
    if (status) {
      status.built = true;
      status.building = false;
      status.failed = false;
      status.error = undefined;
    }
  }

  /**
   * Mark component as failed
   */
  markFailed(component: string, error: string): void {
    const status = this.componentStatus.get(component);
    if (status) {
      status.failed = true;
      status.building = false;
      status.built = false;
      status.error = error;
    }
  }

  /**
   * Get component build status
   */
  getComponentStatus(component: string): ComponentDependency | undefined {
    return this.componentStatus.get(component);
  }

  /**
   * Get all component statuses
   */
  getAllStatuses(): ComponentDependency[] {
    return Array.from(this.componentStatus.values());
  }

  /**
   * Reset all build statuses
   */
  reset(): void {
    this.initializeComponentStatus();
  }

  /**
   * Validate dependency graph (check for cycles)
   */
  validateGraph(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Try to resolve build order for all components
      for (const component of this.dependencyGraph.keys()) {
        this.resolveBuildOrder(component);
      }
      return { valid: true, errors: [] };
    } catch (error) {
      errors.push((error as Error).message);
      return { valid: false, errors };
    }
  }

  /**
   * Create IOR for component
   */
  createComponentIOR(componentName: string): IOR {
    return {
      uuid: `${componentName.toLowerCase()}-component-uuid`,
      component: componentName,
      version: '0.3.0.0'
    };
  }
}