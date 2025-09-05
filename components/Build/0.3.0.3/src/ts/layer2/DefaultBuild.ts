/**
 * DefaultBuild - Dependency-free build system implementation
 * 
 * Web4 principle: Implementation in layer2
 * Version 0.3.0.3: Self-bootstrapping, no external dependencies
 */

import { Build } from '../layer3/Build.interface.js';

export class DefaultBuild implements Build {
  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Empty constructor - no dependencies
  }

  /**
   * Build a component by path
   */
  async buildComponent(componentPath: string): Promise<boolean> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { execSync } = await import('child_process');

      if (!fs.existsSync(componentPath)) {
        console.log(`❌ Component path not found: ${componentPath}`);
        return false;
      }

      const packageJsonPath = path.join(componentPath, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        console.log(`❌ No package.json found in: ${componentPath}`);
        return false;
      }

      console.log(`🏗️ Building component: ${componentPath}`);
      
      // Install dependencies if needed
      if (!fs.existsSync(path.join(componentPath, 'node_modules'))) {
        execSync('npm install', { cwd: componentPath, stdio: 'inherit' });
      }

      // Build with TypeScript
      execSync('npx tsc', { cwd: componentPath, stdio: 'inherit' });
      
      console.log(`✅ Built: ${componentPath}`);
      return true;
    } catch (error) {
      console.log(`❌ Build failed: ${componentPath} - ${error}`);
      return false;
    }
  }

  /**
   * Build ONCE component specifically
   */
  async buildONCE(): Promise<boolean> {
    const oncePath = '/workspace/components/ONCE/0.3.0.2';
    console.log('🚀 Building ONCE component...');
    return await this.buildComponent(oncePath);
  }

  /**
   * Clean component build artifacts
   */
  async cleanComponent(componentPath: string): Promise<boolean> {
    try {
      const fs = await import('fs');
      const path = await import('path');

      const distPath = path.join(componentPath, 'dist');
      const nodeModulesPath = path.join(componentPath, 'node_modules');
      const packageLockPath = path.join(componentPath, 'package-lock.json');

      if (fs.existsSync(distPath)) {
        fs.rmSync(distPath, { recursive: true });
        console.log(`🧹 Cleaned dist: ${componentPath}`);
      }

      if (fs.existsSync(nodeModulesPath)) {
        fs.rmSync(nodeModulesPath, { recursive: true });
        console.log(`🧹 Cleaned node_modules: ${componentPath}`);
      }

      if (fs.existsSync(packageLockPath)) {
        fs.unlinkSync(packageLockPath);
        console.log(`🧹 Cleaned package-lock.json: ${componentPath}`);
      }

      return true;
    } catch (error) {
      console.log(`❌ Clean failed: ${componentPath} - ${error}`);
      return false;
    }
  }

  /**
   * Resolve component dependencies (simple implementation)
   */
  async resolveDependencies(componentPath: string): Promise<string[]> {
    const dependencies: string[] = [];
    
    // For ONCE, dependencies are: IOR, Scenario, User, Server components
    if (componentPath.includes('/ONCE/')) {
      dependencies.push('/workspace/components/IOR/0.3.0.3');
      dependencies.push('/workspace/components/Scenario/0.3.0.2');
      dependencies.push('/workspace/components/User/0.3.0.2');
      dependencies.push('/workspace/components/HttpServer/0.3.0.2');
      dependencies.push('/workspace/components/WsServer/0.3.0.2');
      dependencies.push('/workspace/components/P2PServer/0.3.0.2');
    }

    return dependencies;
  }

  /**
   * Check if component needs building
   */
  needsBuild(componentPath: string): boolean {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const distPath = path.join(componentPath, 'dist');
      const srcPath = path.join(componentPath, 'src');
      
      if (!fs.existsSync(distPath)) {
        return true;
      }

      // Check if src is newer than dist
      const srcStat = fs.statSync(srcPath);
      const distStat = fs.statSync(distPath);
      
      return srcStat.mtime > distStat.mtime;
    } catch {
      return true;
    }
  }
}