/**
 * StandaloneBuild - Dependency-Free Bootstrap Build Component
 * 
 * Bootstrap Principle: Build component must build itself first,
 * then orchestrate all other component builds in correct dependency order
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Self-contained interfaces (no external dependencies)
interface BuildIOR {
  uuid: string;
  component: string;
  version: string;
  location?: string;
}

interface BuildModel {
  uuid: string;
  name: string;
  description: string;
  environment: string;
  dependencies: string[];
  buildOrder: number;
  buildState: 'pending' | 'building' | 'success' | 'failed';
  npmInstall: boolean;
  typescript: boolean;
  testRunner: string;
}

interface ComponentInfo {
  path: string;
  name: string;
  version: string;
  packageJson: any;
  dependencies: string[];
  hasTypeScript: boolean;
  buildOrder: number;
}

interface EnvironmentCheckResult {
  nodeVersion: string;
  npmVersion: string;
  typescriptAvailable: boolean;
  workspaceRoot: string;
  componentsFound: number;
}

interface BuildResult {
  component: string;
  success: boolean;
  duration: number;
  errors: string[];
  warnings: string[];
}

export class StandaloneBuild {
  private data: BuildModel;
  private componentsCache: Map<string, ComponentInfo> = new Map();

  constructor() {
    this.data = {
      uuid: 'build-bootstrap-' + Date.now(),
      name: 'Build Component Bootstrap',
      description: 'Dependency-free Build component for Web4 ecosystem bootstrap',
      environment: 'node',
      dependencies: [], // CRITICAL: No external dependencies for bootstrap
      buildOrder: 0, // Build component is always first
      buildState: 'pending',
      npmInstall: true,
      typescript: true,
      testRunner: 'vitest'
    };
  }

  // Environment checking without external dependencies
  async checkEnvironment(): Promise<EnvironmentCheckResult> {
    console.log('🔍 Checking build environment...');
    
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      
      let typescriptAvailable = false;
      try {
        execSync('npx tsc --version', { stdio: 'pipe' });
        typescriptAvailable = true;
      } catch {
        // TypeScript not available globally, will use npx
      }

      const workspaceRoot = process.cwd().includes('/components/') 
        ? process.cwd().split('/components/')[0]
        : process.cwd();
        
      const componentsFound = this.discoverComponents(workspaceRoot).length;

      const result: EnvironmentCheckResult = {
        nodeVersion,
        npmVersion,
        typescriptAvailable,
        workspaceRoot,
        componentsFound
      };

      console.log(`✅ Node.js: ${nodeVersion}`);
      console.log(`✅ NPM: ${npmVersion}`);
      console.log(`✅ Components discovered: ${componentsFound}`);

      return result;
    } catch (error) {
      throw new Error(`Environment check failed: ${error}`);
    }
  }

  // Component discovery without external dependencies
  discoverComponents(workspaceRoot: string): ComponentInfo[] {
    const componentsDir = join(workspaceRoot, 'components');
    const components: ComponentInfo[] = [];

    if (!existsSync(componentsDir)) {
      return components;
    }

    const componentDirs = readdirSync(componentsDir)
      .filter(dir => statSync(join(componentsDir, dir)).isDirectory());

    for (const componentDir of componentDirs) {
      const componentPath = join(componentsDir, componentDir);
      const versionDirs = readdirSync(componentPath)
        .filter(dir => statSync(join(componentPath, dir)).isDirectory())
        .filter(dir => /^\d+\.\d+\.\d+\.\d+$/.test(dir)); // Version pattern

      for (const versionDir of versionDirs) {
        const versionPath = join(componentPath, versionDir);
        const packageJsonPath = join(versionPath, 'package.json');

        if (existsSync(packageJsonPath)) {
          try {
            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
            const hasTypeScript = existsSync(join(versionPath, 'tsconfig.json')) || 
                                 existsSync(join(versionPath, 'src'));

            const component: ComponentInfo = {
              path: versionPath,
              name: componentDir,
              version: versionDir,
              packageJson,
              dependencies: this.extractDependencies(packageJson),
              hasTypeScript,
              buildOrder: this.calculateBuildOrder(componentDir)
            };

            components.push(component);
            this.componentsCache.set(`${componentDir}/${versionDir}`, component);
          } catch (error) {
            console.log(`⚠️ Skipping invalid component: ${componentDir}/${versionDir}`);
          }
        }
      }
    }

    return components.sort((a, b) => a.buildOrder - b.buildOrder);
  }

  // Dependency extraction without external imports
  private extractDependencies(packageJson: any): string[] {
    const deps = [];
    
    // Extract from dependencies and devDependencies
    if (packageJson.dependencies) {
      deps.push(...Object.keys(packageJson.dependencies));
    }
    if (packageJson.devDependencies) {
      deps.push(...Object.keys(packageJson.devDependencies));
    }

    // Filter for Web4 components (simplistic approach)
    return deps.filter(dep => dep.includes('web4') || dep.includes('Web4'));
  }

  // Build order calculation without external dependencies
  private calculateBuildOrder(componentName: string): number {
    const buildOrderMap: { [key: string]: number } = {
      'Build': 0,        // Bootstrap first
      'IOR': 1,          // Foundation interfaces
      'Scenario': 2,     // Configuration management
      'User': 3,         // User management
      'ONCE': 4,         // Kernel (depends on foundation)
      'HttpServer': 5,   // Capability components
      'WsServer': 5,     // Capability components  
      'P2PServer': 5,    // Capability components
      'Web4Requirement': 6, // Utility components
      'Unit': 7          // Higher-level components
    };

    return buildOrderMap[componentName] ?? 99; // Unknown components last
  }

  // Self-building without external dependencies
  async buildSelf(): Promise<BuildResult> {
    console.log('🏗️ Build component building itself (bootstrap)...');
    const startTime = Date.now();
    
    try {
      const componentPath = dirname(dirname(__dirname)); // Go up from src/ts/
      
      // Install dependencies if needed
      if (existsSync(join(componentPath, 'package.json'))) {
        console.log('📦 Installing Build component dependencies...');
        execSync('npm install', { 
          cwd: componentPath, 
          stdio: 'pipe' 
        });
      }

      // Build TypeScript if tsconfig exists
      if (existsSync(join(componentPath, 'tsconfig.json'))) {
        console.log('🔨 Compiling Build component TypeScript...');
        // Use only this source file to avoid import cycles
        const sourceFile = join(componentPath, 'src/ts/StandaloneBuild.ts');
        execSync(`npx tsc ${sourceFile} --outDir dist/ts --module ES2022 --target ES2022 --moduleResolution node`, {
          cwd: componentPath,
          stdio: 'pipe'
        });
      }

      const duration = Date.now() - startTime;
      console.log('✅ Build component self-build successful');

      return {
        component: 'Build',
        success: true,
        duration,
        errors: [],
        warnings: []
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        component: 'Build',
        success: false,
        duration,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }

  // Build other components after self-building
  async buildComponent(componentName: string): Promise<BuildResult> {
    console.log(`🔨 Building ${componentName} component...`);
    const startTime = Date.now();

    try {
      const components = this.discoverComponents(process.cwd().split('/components/')[0]);
      const targetComponent = components.find(c => c.name === componentName);

      if (!targetComponent) {
        throw new Error(`Component ${componentName} not found`);
      }

      // Build dependencies first
      await this.buildDependencies(targetComponent);

      // Build the component itself
      const result = await this.buildSingleComponent(targetComponent);
      
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        component: componentName,
        success: false,
        duration,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }

  // Build all components in dependency order
  async buildAll(): Promise<BuildResult[]> {
    console.log('🏗️ Building comprehensive Web4 ecosystem...');
    
    const components = this.discoverComponents(process.cwd().split('/components/')[0]);
    const results: BuildResult[] = [];

    for (const component of components) {
      if (component.name === 'Build') continue; // Skip self (already built)
      
      const result = await this.buildSingleComponent(component);
      results.push(result);

      if (!result.success) {
        console.log(`❌ Build failed for ${component.name}, stopping build chain`);
        break;
      }
    }

    return results;
  }

  // Build single component without external dependencies
  private async buildSingleComponent(component: ComponentInfo): Promise<BuildResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔨 Building ${component.name}...`);
      
      // Install dependencies
      if (component.packageJson.dependencies || component.packageJson.devDependencies) {
        execSync('npm install', { 
          cwd: component.path, 
          stdio: 'pipe' 
        });
      }

      // Build TypeScript if available
      if (component.hasTypeScript) {
        execSync('npm run build || npx tsc', { 
          cwd: component.path, 
          stdio: 'pipe' 
        });
      }

      const duration = Date.now() - startTime;
      console.log(`✅ ${component.name} built`);

      return {
        component: component.name,
        success: true,
        duration,
        errors: [],
        warnings: []
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`❌ ${component.name} build failed`);

      return {
        component: component.name,
        success: false,
        duration,
        errors: [error instanceof Error ? error.message : String(error)],
        warnings: []
      };
    }
  }

  // Build dependencies recursively
  private async buildDependencies(component: ComponentInfo): Promise<void> {
    // Simple dependency building - can be enhanced later
    const foundationComponents = ['IOR', 'Scenario', 'User'];
    
    for (const depName of foundationComponents) {
      const depComponent = Array.from(this.componentsCache.values())
        .find(c => c.name === depName);
        
      if (depComponent && !this.isComponentBuilt(depComponent)) {
        await this.buildSingleComponent(depComponent);
      }
    }
  }

  // Check if component is already built
  private isComponentBuilt(component: ComponentInfo): boolean {
    return existsSync(join(component.path, 'dist')) || 
           existsSync(join(component.path, 'build'));
  }

  // CLI commands
  async start(args: string[] = []): Promise<void> {
    await this.checkEnvironment();
    const result = await this.buildSelf();
    
    if (result.success) {
      console.log('✅ Build component ready for ecosystem orchestration');
    } else {
      console.log('❌ Build component self-build failed');
      console.log('Errors:', result.errors.join(', '));
    }
  }

  async info(args: string[] = []): Promise<void> {
    console.log('📋 Build Component Information');
    console.log(`Name: ${this.data.name}`);
    console.log(`Description: ${this.data.description}`);
    console.log(`UUID: ${this.data.uuid}`);
    console.log(`Version: 0.3.0.0`);
    console.log(`Build State: ${this.data.buildState}`);
  }

  async help(args: string[] = []): Promise<void> {
    console.log('\n🏗️ \x1b[36mWeb4 Build CLI Tool\x1b[0m');
    console.log('\n\x1b[33mUsage:\x1b[0m build <command> [options]');
    console.log('\n\x1b[32mCommands:\x1b[0m');
    console.log('  \x1b[36mstart\x1b[0m        Bootstrap build component');
    console.log('  \x1b[36mbuildComponent\x1b[0m Build specific component');
    console.log('  \x1b[36mbuildAll\x1b[0m     Build entire ecosystem');
    console.log('  \x1b[36minfo\x1b[0m         Show build component information');
    console.log('  \x1b[36mhelp\x1b[0m         Show this help message');
    console.log('\n\x1b[32mExamples:\x1b[0m');
    console.log('  build start           # Bootstrap build component');
    console.log('  build buildComponent ONCE # Build ONCE component');
    console.log('  build buildAll        # Build entire Web4 ecosystem');
    console.log('\n\x1b[90mWeb4 Build Component v0.3.0.0\x1b[0m\n');
  }

  // Static entry point for CLI
  static async start(args: string[] = []): Promise<void> {
    const build = new StandaloneBuild();
    const command = args[0] || 'help';
    
    switch (command) {
      case 'start':
        await build.start(args.slice(1));
        break;
      case 'buildComponent':
        if (args[1]) {
          const result = await build.buildComponent(args[1]);
          if (!result.success) {
            console.log(`❌ Build failed for ${args[1]}`);
            process.exit(1);
          }
        } else {
          console.log('❌ buildComponent requires component name');
          await build.help();
        }
        break;
      case 'buildAll':
        const results = await build.buildAll();
        const failed = results.filter(r => !r.success);
        if (failed.length > 0) {
          console.log(`❌ ${failed.length} components failed to build`);
          process.exit(1);
        }
        console.log('✅ All components built successfully');
        break;
      case 'info':
        await build.info(args.slice(1));
        break;
      case 'help':
        await build.help(args.slice(1));
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        await build.help();
    }
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  StandaloneBuild.start(process.argv.slice(2));
}