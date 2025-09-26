/**
 * DefaultBuild - Web4-Compliant Build Component Implementation
 * 
 * Web4 principle: Implementation in layer2
 * Version 0.3.0.1: Eliminates StandaloneBuild DORY violation
 */

import { Build } from '../layer3/Build.interface.js';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Local interfaces to avoid import cycles (temporary)
interface ComponentInfo {
  path: string;
  name: string;
  version: string;
  packageJson: any;
  hasTypeScript: boolean;
  buildOrder: number;
}

export class DefaultBuild implements Build {
  private componentsCache: Map<string, ComponentInfo> = new Map();

  constructor() {
    // Web4 Pattern: Empty constructor
  }

  init(scenario: any): this {
    // Web4 Pattern: Scenario initialization
    return this;
  }

  async checkEnvironment(): Promise<any> {
    console.log('🔍 Checking build environment...');
    
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      
      const workspaceRoot = process.cwd().includes('/components/') 
        ? process.cwd().split('/components/')[0]
        : process.cwd();
        
      const componentsFound = this.discoverComponents(workspaceRoot).length;

      console.log(`✅ Node.js: ${nodeVersion}`);
      console.log(`✅ NPM: ${npmVersion}`);
      console.log(`✅ Components discovered: ${componentsFound}`);

      return { nodeVersion, npmVersion, componentsFound };
    } catch (error) {
      throw new Error(`Environment check failed: ${error}`);
    }
  }

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
        .filter(dir => /^\d+\.\d+\.\d+\.\d+$/.test(dir));

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

  private calculateBuildOrder(componentName: string): number {
    const buildOrderMap: { [key: string]: number } = {
      'Build': 0,
      'IOR': 1,
      'Scenario': 2,
      'User': 3,
      'ONCE': 4,
      'HttpServer': 5,
      'WsServer': 5,
      'P2PServer': 5,
      'Web4Requirement': 6,
      'Unit': 7
    };

    return buildOrderMap[componentName] ?? 99;
  }

  async buildSelf(): Promise<any> {
    console.log('🏗️ Build component building itself (Web4-compliant)...');
    const startTime = Date.now();
    
    try {
      const componentPath = dirname(dirname(__dirname));
      
      if (existsSync(join(componentPath, 'package.json'))) {
        console.log('📦 Installing Build component dependencies...');
        execSync('npm install', { 
          cwd: componentPath, 
          stdio: 'pipe' 
        });
      }

      if (existsSync(join(componentPath, 'tsconfig.json'))) {
        console.log('🔨 Compiling Build component TypeScript...');
        execSync('npx tsc', {
          cwd: componentPath,
          stdio: 'pipe'
        });
      }

      const duration = Date.now() - startTime;
      console.log('✅ Build component self-build successful');

      return { success: true, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      return { success: false, duration, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async buildComponent(componentName: string): Promise<any> {
    console.log(`🔨 Building ${componentName} component...`);
    
    try {
      const components = this.discoverComponents(process.cwd().split('/components/')[0]);
      // LATEST VERSION PREFERENCE: Select newest version when multiple exist
      const targetComponent = components
        .filter(c => c.name === componentName)
        .sort((a, b) => b.version.localeCompare(a.version))[0];

      if (!targetComponent) {
        throw new Error(`Component ${componentName} not found`);
      }

      console.log(`🎯 Selected ${componentName} v${targetComponent.version} (latest)`);
      
      await this.buildDependencies(targetComponent);
      const result = await this.buildSingleComponent(targetComponent);
      
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async buildAll(): Promise<any[]> {
    console.log('🏗️ Building comprehensive Web4 ecosystem...');
    
    const components = this.discoverComponents(process.cwd().split('/components/')[0]);
    const results: any[] = [];

    for (const component of components) {
      if (component.name === 'Build') continue;
      
      const result = await this.buildSingleComponent(component);
      results.push(result);

      if (!result.success) {
        console.log(`❌ Build failed for ${component.name}, stopping build chain`);
        break;
      }
    }

    return results;
  }

  private async buildSingleComponent(component: ComponentInfo): Promise<any> {
    try {
      console.log(`🔨 Building ${component.name}...`);
      
      if (component.packageJson.dependencies || component.packageJson.devDependencies) {
        execSync('npm install', { 
          cwd: component.path, 
          stdio: 'pipe' 
        });
      }

      if (component.hasTypeScript) {
        execSync('npm run build || npx tsc', { 
          cwd: component.path, 
          stdio: 'pipe' 
        });
      }

      console.log(`✅ ${component.name} built`);
      return { component: component.name, success: true };
    } catch (error) {
      console.log(`❌ ${component.name} build failed`);
      return { component: component.name, success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async buildDependencies(component: ComponentInfo): Promise<void> {
    const foundationComponents = ['IOR', 'Scenario', 'User'];
    
    for (const depName of foundationComponents) {
      const depComponent = Array.from(this.componentsCache.values())
        .find(c => c.name === depName);
        
      if (depComponent && !this.isComponentBuilt(depComponent)) {
        await this.buildSingleComponent(depComponent);
      }
    }
  }

  private isComponentBuilt(component: ComponentInfo): boolean {
    return existsSync(join(component.path, 'dist'));
  }

  async start(args: string[] = []): Promise<void> {
    await this.checkEnvironment();
    const result = await this.buildSelf();
    
    if (result.success) {
      console.log('✅ Build component ready for ecosystem orchestration');
    } else {
      console.log('❌ Build component self-build failed');
    }
  }

  async info(args: string[] = []): Promise<void> {
    console.log('📋 Build Component Information');
    console.log('Name: Web4 Build Component');
    console.log('Description: Web4-compliant build orchestration component');
    console.log('Version: 0.3.0.1');
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
    console.log('\n\x1b[90mWeb4 Build Component v0.3.0.1\x1b[0m\n');
  }
}