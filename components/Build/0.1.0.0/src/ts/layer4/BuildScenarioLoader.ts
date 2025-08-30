/**
 * Build Scenario Loader - Web4 Build Component
 * Layer 4: Controller Layer
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface BuildScenario {
  uuid: string;
  name: string;
  description?: string;
  type: string;
  version: string;
  extends?: string;
  metadata?: Record<string, any>;
  buildDependencies?: {
    dependencies: Array<{
      name: string;
      path: string;
      required: boolean;
    }>;
  };
  buildScripts?: Record<string, string>;
  componentMetadata?: Record<string, any>;
  [key: string]: any; // Index signature for merging
}

export class BuildScenarioLoader {
  private componentRoot: string;
  private __dirname: string;

  constructor() {
    // Empty constructor - Web4 principle
    this.componentRoot = process.cwd();
    this.__dirname = dirname(fileURLToPath(import.meta.url));
  }

  async loadBuildScenario(): Promise<BuildScenario> {
    // Look for build.scenario.json in current component
    const scenarioPath = resolve(this.componentRoot, 'scenarios/build.scenario.json');
    
    if (!existsSync(scenarioPath)) {
      // Return empty scenario if not found
      return {
        uuid: 'default-build-scenario',
        name: 'Default Build Configuration',
        type: 'BuildConfiguration',
        version: '0.1.0.0'
      };
    }
    
    try {
      const content = readFileSync(scenarioPath, 'utf-8');
      const scenario = JSON.parse(content) as BuildScenario;
      
      // Handle extends
      if (scenario.extends) {
        const basePath = resolve(this.componentRoot, scenario.extends);
        if (existsSync(basePath)) {
          const baseContent = readFileSync(basePath, 'utf-8');
          const baseScenario = JSON.parse(baseContent) as BuildScenario;
          
          // Merge scenarios (component overrides base)
          return this.mergeScenarios(baseScenario, scenario);
        }
      }
      
      return scenario;
    } catch (error: any) {
      throw new Error(`Failed to load build scenario: ${error.message}`);
    }
  }

  private mergeScenarios(base: BuildScenario, override: BuildScenario): BuildScenario {
    const merged = { ...base };
    
    // Override simple properties
    Object.keys(override).forEach(key => {
      if (key === 'buildDependencies' && base.buildDependencies) {
        // Merge dependencies
        merged.buildDependencies = {
          ...base.buildDependencies,
          dependencies: [
            ...(base.buildDependencies.dependencies || []),
            ...(override.buildDependencies?.dependencies || [])
          ]
        };
      } else if (typeof override[key] === 'object' && !Array.isArray(override[key])) {
        // Merge objects
        merged[key] = { ...base[key], ...override[key] };
      } else {
        // Override
        merged[key] = override[key];
      }
    });
    
    return merged;
  }

  async generateTemplate(): Promise<void> {
    const template: BuildScenario = {
      uuid: this.generateUUID(),
      name: "Component Build Configuration",
      description: "Build configuration for Web4 component",
      type: "BuildConfiguration",
      version: "0.1.0.0",
      extends: "../../../Build/0.1.0.0/scenarios/build.scenario.json",
      metadata: {
        created: new Date().toISOString(),
        component: "ComponentName",
        componentVersion: "0.1.0.0"
      },
      buildDependencies: {
        dependencies: [
          {
            name: "@web4/example",
            path: "../../Example/latest",
            required: true
          }
        ]
      },
      componentMetadata: {
        layer5CLI: "ComponentCLI",
        mainExport: "src/ts/layer5/ComponentCLI.ts",
        cliScript: "./component.sh"
      }
    };
    
    const scenarioPath = resolve(this.componentRoot, 'scenarios/build.scenario.json');
    writeFileSync(scenarioPath, JSON.stringify(template, null, 2));
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}