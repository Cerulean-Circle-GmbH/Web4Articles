/**
 * Build Scenario Loader - Web4 Build Component
 * Layer 4: Controller Layer
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * BuildScenario follows ONCE Scenario format exactly
 */
export interface BuildScenario {
  uuid: string;
  objectType: string;
  version: string;
  state: {
    extends?: string;
    dependencies?: Array<{
      name: string;
      path: string;
      required: boolean;
    }>;
    scripts?: Record<string, string>;
    buildOrder?: {
      strategy: string;
      cache: boolean;
    };
    profiles?: Record<string, any>;
    component?: {
      name: string;
      version: string;
      layer5CLI?: string;
      mainExport?: string;
      cliScript?: string;
    };
  };
  metadata?: {
    created: string;
    modified: string;
    creator?: string;
    description?: string;
    tags?: string[];
  };
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
        objectType: 'BuildConfiguration',
        version: '0.1.0.0',
        state: {},
        metadata: {
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          description: 'Default build configuration'
        }
      };
    }
    
    try {
      const content = readFileSync(scenarioPath, 'utf-8');
      const scenario = JSON.parse(content) as BuildScenario;
      
      // Handle extends
      if (scenario.state?.extends) {
        const basePath = resolve(this.componentRoot, scenario.state.extends);
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
    // Follow ONCE pattern - merge states
    const merged: BuildScenario = {
      uuid: override.uuid,
      objectType: override.objectType || base.objectType,
      version: override.version || base.version,
      state: {
        ...base.state,
        ...override.state,
        // Special handling for dependencies - concatenate arrays
        dependencies: [
          ...(base.state?.dependencies || []),
          ...(override.state?.dependencies || [])
        ]
      },
      metadata: {
        created: base.metadata?.created || new Date().toISOString(),
        modified: new Date().toISOString(),
        ...base.metadata,
        ...override.metadata
      }
    };
    
    return merged;
  }

  async generateTemplate(): Promise<void> {
    const template: BuildScenario = {
      uuid: this.generateUUID(),
      objectType: "BuildConfiguration",
      version: "0.1.0.0",
      state: {
        extends: "../../../Build/0.1.0.0/scenarios/build.scenario.json",
        dependencies: [
          {
            name: "@web4/example",
            path: "../../Example/latest",
            required: true
          }
        ],
        component: {
          name: "ComponentName",
          version: "0.1.0.0",
          layer5CLI: "ComponentCLI",
          mainExport: "src/ts/layer5/ComponentCLI.ts",
          cliScript: "./component.sh"
        }
      },
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        creator: "Build Component",
        description: "Build configuration for Web4 component"
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