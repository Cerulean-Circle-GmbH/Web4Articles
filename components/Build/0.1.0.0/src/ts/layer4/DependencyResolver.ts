/**
 * Dependency Resolver - Web4 Build Component
 * Layer 4: Controller Layer
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import { BuildScenario } from './BuildScenarioLoader.js';
import { BuildDependency, BuildStatus } from './BuildManager.js';

export class DependencyResolver {
  private componentRoot: string;
  private resolvedOrder: BuildDependency[] = [];
  private visited: Set<string> = new Set();

  constructor() {
    // Empty constructor - Web4 principle
    this.componentRoot = process.cwd();
  }

  async resolveBuildOrder(scenario: BuildScenario): Promise<BuildDependency[]> {
    this.resolvedOrder = [];
    this.visited = new Set();
    
    const dependencies = scenario.buildDependencies?.dependencies || [];
    
    // Topological sort for dependency resolution
    for (const dep of dependencies) {
      await this.visitDependency(dep);
    }
    
    return this.resolvedOrder;
  }

  private async visitDependency(dep: BuildDependency): Promise<void> {
    if (this.visited.has(dep.name)) {
      return; // Already processed
    }
    
    this.visited.add(dep.name);
    
    // Check if this dependency has its own dependencies
    const depPath = resolve(this.componentRoot, dep.path);
    const depScenarioPath = resolve(depPath, 'scenarios/build.scenario.json');
    
    if (existsSync(depScenarioPath)) {
      try {
        const { BuildScenarioLoader } = await import('./BuildScenarioLoader.js');
        const loader = new BuildScenarioLoader();
        
        // Temporarily change directory context
        const originalCwd = process.cwd();
        process.chdir(depPath);
        
        const depScenario = await loader.loadBuildScenario();
        
        // Restore directory
        process.chdir(originalCwd);
        
        // Recursively resolve subdependencies
        if (depScenario.buildDependencies?.dependencies) {
          for (const subDep of depScenario.buildDependencies.dependencies) {
            // Adjust path relative to current component
            const adjustedDep = {
              ...subDep,
              path: resolve(dep.path, subDep.path)
            };
            await this.visitDependency(adjustedDep);
          }
        }
      } catch (error) {
        console.warn(`⚠️  Could not load dependencies for ${dep.name}`);
      }
    }
    
    // Add to resolved order after dependencies
    this.resolvedOrder.push(dep);
  }

  async checkDependencyStatus(scenario: BuildScenario): Promise<Record<string, BuildStatus>> {
    const report: Record<string, BuildStatus> = {};
    const dependencies = scenario.buildDependencies?.dependencies || [];
    
    for (const dep of dependencies) {
      const depPath = resolve(this.componentRoot, dep.path);
      const distPath = resolve(depPath, 'dist');
      
      if (!existsSync(depPath)) {
        report[dep.name] = {
          built: false,
          message: `Component not found at ${dep.path}`
        };
      } else if (!existsSync(distPath)) {
        report[dep.name] = {
          built: false,
          message: 'Not built (dist/ missing)'
        };
      } else {
        report[dep.name] = {
          built: true,
          message: 'Built and ready'
        };
      }
    }
    
    return report;
  }
}