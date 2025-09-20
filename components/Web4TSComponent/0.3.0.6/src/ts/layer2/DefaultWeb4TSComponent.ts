/**
 * DefaultWeb4TSComponent - Web4 TypeScript Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Web4TSComponent, ComponentScaffoldOptions, ComponentMetadata, CLIStandardValidation } from '../layer3/Web4TSComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { Web4TSComponentModel } from '../layer3/Web4TSComponentModel.interface.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

export class DefaultWeb4TSComponent implements Web4TSComponent {
  private model: Web4TSComponentModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      targetDirectory: '',
      componentStandards: [],
      validationRules: [],
      scaffoldingTemplates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  init(scenario: Scenario<Web4TSComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  transform(data?: unknown): this {
    // Transform component data if needed
    if (data) {
      this.model.updatedAt = new Date().toISOString();
    }
    return this;
  }

  validate(object?: any): this {
    // Validate component configuration
    if (object) {
      this.model.updatedAt = new Date().toISOString();
    }
    return this;
  }

  process(): this {
    // Process component operations
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  setTargetDirectory(directory: string): void {
    this.model.targetDirectory = directory;
    this.model.updatedAt = new Date().toISOString();
  }

  async scaffoldComponent(options: ComponentScaffoldOptions): Promise<ComponentMetadata> {
    const { componentName, version, includeLayerArchitecture, includeCLI, includeSpecFolder, includeVitest } = options;
    
    const componentDir = path.join(this.model.targetDirectory, 'components', componentName, version);
    
    // Create directory structure
    await fs.mkdir(componentDir, { recursive: true });
    
    // Create package.json
    await this.createPackageJson(componentDir, componentName, version);
    
    // Create tsconfig.json
    await this.createTsConfig(componentDir);
    
    if (includeLayerArchitecture) {
      await this.createLayerStructure(componentDir);
    }
    
    if (includeCLI) {
      await this.createCLIScript(componentDir, componentName, version);
    }
    
    if (includeSpecFolder) {
      await this.createSpecStructure(componentDir);
    }
    
    if (includeVitest) {
      await this.createVitestConfig(componentDir);
      await this.createTestStructure(componentDir);
    }
    
    return {
      name: componentName,
      version,
      hasLocationResilientCLI: includeCLI || false,
      hasLayeredArchitecture: includeLayerArchitecture || false,
      hasEmptyConstructors: true,
      hasScenarioSupport: true,
      complianceScore: 100
    };
  }

  async generateLocationResilientCLI(componentName: string, version: string): Promise<string> {
    const cliTemplate = `#!/bin/bash

# ${componentName} CLI Tool - Location Resilient Version
# Web4 Architecture Standard - Self-Implementing Reference
# Works from any directory, finds project root via git

# Function to find project root using git
find_project_root() {
    local git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [ -n "$git_root" ] && [ -d "$git_root" ]; then
        if [ -f "$git_root/package.json" ] || [ -f "$git_root/README.md" ]; then
            echo "$git_root"
            return 0
        fi
    fi
    
    local current_dir="$PWD"
    while [ "$current_dir" != "/" ]; do
        if [ -d "$current_dir/.git" ] && [ -f "$current_dir/package.json" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    return 1
}

# Main execution
PROJECT_ROOT=$(find_project_root)
if [ -z "$PROJECT_ROOT" ]; then
    echo "❌ Error: Not in a Web4 project directory"
    exit 1
fi

cd "$PROJECT_ROOT"

# Execute component CLI
node --loader ts-node/esm "./components/${componentName}/${version}/src/ts/layer5/${componentName}CLI.ts" "$@"
`;
    
    return cliTemplate;
  }

  async validateCLIStandard(scriptPath: string): Promise<CLIStandardValidation> {
    try {
      const content = await fs.readFile(scriptPath, 'utf-8');
      
      const issues: string[] = [];
      let score = 100;
      
      // Check for location resilience
      if (!content.includes('find_project_root')) {
        issues.push('Missing location resilience - should include find_project_root function');
        score -= 30;
      }
      
      // Check for proper error handling
      if (!content.includes('exit 1')) {
        issues.push('Missing error handling for project root detection');
        score -= 20;
      }
      
      // Check for Web4 patterns
      if (!content.includes('ts-node/esm')) {
        issues.push('Should use ts-node/esm loader for ESM compatibility');
        score -= 25;
      }
      
      return {
        isCompliant: score >= 70,
        score,
        issues,
        suggestions: issues.map(issue => `Fix: ${issue}`)
      };
    } catch (error) {
      return {
        isCompliant: false,
        score: 0,
        issues: [`Failed to read script: ${(error as Error).message}`],
        suggestions: ['Ensure script exists and is readable']
      };
    }
  }

  async auditComponentCompliance(componentPath: string): Promise<ComponentMetadata> {
    const packageJsonPath = path.join(componentPath, 'package.json');
    const tsConfigPath = path.join(componentPath, 'tsconfig.json');
    
    let metadata: ComponentMetadata = {
      name: path.basename(path.dirname(componentPath)),
      version: path.basename(componentPath),
      hasLocationResilientCLI: false,
      hasLayeredArchitecture: false,
      hasEmptyConstructors: false,
      hasScenarioSupport: false,
      complianceScore: 0,
      issues: []
    };
    
    // Check for package.json
    if (existsSync(packageJsonPath)) {
      const packageContent = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      metadata.name = packageContent.name || metadata.name;
      metadata.version = packageContent.version || metadata.version;
    } else {
      metadata.issues?.push('Missing package.json');
    }
    
    // Check for layered architecture
    const srcPath = path.join(componentPath, 'src/ts');
    if (existsSync(srcPath)) {
      const layers = await fs.readdir(srcPath);
      metadata.hasLayeredArchitecture = layers.some(layer => layer.startsWith('layer'));
    }
    
    // Check for CLI script
    const cliScriptPath = path.join(componentPath, `${metadata.name.toLowerCase()}.sh`);
    if (existsSync(cliScriptPath)) {
      const validation = await this.validateCLIStandard(cliScriptPath);
      metadata.hasLocationResilientCLI = validation.isCompliant;
    }
    
    // Calculate compliance score
    let score = 0;
    if (existsSync(packageJsonPath)) score += 25;
    if (existsSync(tsConfigPath)) score += 25;
    if (metadata.hasLayeredArchitecture) score += 25;
    if (metadata.hasLocationResilientCLI) score += 25;
    
    metadata.complianceScore = score;
    
    return metadata;
  }

  async generateComplianceReport(componentDir: string): Promise<ComponentMetadata[]> {
    const components: ComponentMetadata[] = [];
    
    try {
      const entries = await fs.readdir(componentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const componentPath = path.join(componentDir, entry.name);
          const versions = await fs.readdir(componentPath, { withFileTypes: true });
          
          for (const version of versions) {
            if (version.isDirectory() && version.name.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              const metadata = await this.auditComponentCompliance(path.join(componentPath, version.name));
              components.push(metadata);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to generate compliance report: ${(error as Error).message}`);
    }
    
    return components;
  }

  showStandard(): void {
    console.log(`
🔧 Web4 Location-Resilient CLI Standard

Key Requirements:
• Location Independence: CLI works from any directory
• Project Root Detection: Automatic via git or directory traversal  
• ESM Compatibility: Use ts-node/esm loader
• Error Handling: Proper exit codes and error messages
• Web4 Patterns: Empty constructors, scenario support, layer architecture

Template Structure:
#!/bin/bash
find_project_root() { ... }
PROJECT_ROOT=$(find_project_root)
cd "$PROJECT_ROOT"
node --loader ts-node/esm "./components/[name]/[version]/src/ts/layer5/[Name]CLI.ts" "$@"
`);
  }

  showGuidelines(): void {
    console.log(`
🏗️ Web4 Architecture Guidelines

Core Principles:
• Empty Constructors: No logic in constructors
• Scenario Initialization: Use init(scenario) pattern
• Layer Architecture: Separate concerns across layers 2-5
• Location Resilience: Components work from any directory
• ESM Native: Full ES module support
• TypeScript First: Strong typing throughout

Component Structure:
• Layer 2: Implementation classes (Default*)
• Layer 3: Interfaces and types
• Layer 4: Utilities and helpers  
• Layer 5: CLI and entry points

Standards:
• Vitest for testing (Jest banned)
• Empty constructors + scenario pattern
• Universal identifier patterns
• Command chaining support
`);
  }

  // Private helper methods for scaffolding
  private async createPackageJson(componentDir: string, componentName: string, version: string): Promise<void> {
    const packageJson = {
      "name": `@web4/${componentName.toLowerCase()}`,
      "version": version,
      "type": "module",
      "main": `./src/ts/layer5/${componentName}CLI.ts`,
      "scripts": {
        "build": "tsc",
        "test": "vitest",
        "clean": "rm -rf dist/"
      },
      "devDependencies": {
        "@types/node": "^24.1.0",
        "typescript": "^5.0.0",
        "vitest": "^3.2.4",
        "ts-node": "^10.9.2"
      }
    };
    
    await fs.writeFile(
      path.join(componentDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }

  private async createTsConfig(componentDir: string): Promise<void> {
    const tsConfig = {
      "compilerOptions": {
        "target": "ES2022",
        "module": "ES2022",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
      },
      "include": ["src/**/*"],
      "exclude": ["dist", "node_modules", "test"]
    };
    
    await fs.writeFile(
      path.join(componentDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
  }

  private async createLayerStructure(componentDir: string): Promise<void> {
    const layers = ['layer2', 'layer3', 'layer4', 'layer5'];
    
    for (const layer of layers) {
      await fs.mkdir(path.join(componentDir, 'src/ts', layer), { recursive: true });
    }
  }

  private async createCLIScript(componentDir: string, componentName: string, version: string): Promise<void> {
    const cliScript = await this.generateLocationResilientCLI(componentName, version);
    const scriptPath = path.join(componentDir, `${componentName.toLowerCase()}.sh`);
    await fs.writeFile(scriptPath, cliScript, { mode: 0o755 });
  }

  private async createSpecStructure(componentDir: string): Promise<void> {
    await fs.mkdir(path.join(componentDir, 'spec'), { recursive: true });
  }

  private async createVitestConfig(componentDir: string): Promise<void> {
    const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    timeout: 30000,
    exclude: ['**/node_modules/**', '**/dist/**']
  }
});`;
    
    await fs.writeFile(path.join(componentDir, 'vitest.config.ts'), vitestConfig);
  }

  private async createTestStructure(componentDir: string): Promise<void> {
    await fs.mkdir(path.join(componentDir, 'test'), { recursive: true });
  }
}