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

  /**
   * Deinstall component - comprehensive ecosystem clean build reset
   * Dependency-free implementation for Web4 compliance
   */
  async deinstall(componentPath?: string): Promise<void> {
    console.log('Build: Starting comprehensive component deinstall...');
    
    if (componentPath) {
      // Clean specific component
      await this.cleanComponent(componentPath);
      console.log(`✅ Build: Component deinstalled: ${componentPath}`);
    } else {
      // Clean all Web4 components
      await this.cleanAllComponents();
      console.log('✅ Build: Complete ecosystem deinstall successful');
    }
    
    console.log('💡 Run build commands to rebuild components as needed');
  }

  /**
   * Clean all Web4 components - comprehensive ecosystem reset
   * Dependency-free implementation using only filesystem operations
   */
  async cleanAllComponents(rootPath?: string): Promise<void> {
    console.log('Build: Cleaning all Web4 components...');
    
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const workspaceRoot = rootPath || '/workspace';
      const componentsPath = path.join(workspaceRoot, 'components');
      
      if (!fs.existsSync(componentsPath)) {
        console.log('⚠️ Build: Components directory not found');
        return;
      }
      
      // Discover all component directories
      const componentDirs = fs.readdirSync(componentsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      console.log(`Build: Found ${componentDirs.length} component directories`);
      
      // Clean each component directory
      for (const componentDir of componentDirs) {
        const componentPath = path.join(componentsPath, componentDir);
        
        // Find version directories or direct component structure
        const entries = fs.readdirSync(componentPath, { withFileTypes: true });
        const versionDirs = entries.filter(entry => 
          entry.isDirectory() && 
          (entry.name.match(/^\d+\.\d+\.\d+/) || entry.name === 'latest')
        );
        
        if (versionDirs.length > 0) {
          // Component has version directories
          for (const versionDir of versionDirs) {
            if (versionDir.name !== 'latest') { // Skip symlinks
              const versionPath = path.join(componentPath, versionDir.name);
              await this.cleanComponentDirectory(versionPath);
            }
          }
        } else {
          // Direct component structure
          await this.cleanComponentDirectory(componentPath);
        }
      }
      
      console.log('✅ Build: All Web4 components cleaned successfully');
      
    } catch (error) {
      console.error(`⚠️ Build: Component cleaning encountered issues: ${(error as Error).message}`);
      console.log('💡 Some components may require manual cleanup');
    }
  }

  /**
   * Clean individual component directory (dependency-free helper)
   */
  private async cleanComponentDirectory(componentPath: string): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      // Check if this looks like a component directory
      const packageJsonPath = path.join(componentPath, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        return; // Not a component directory
      }
      
      console.log(`🧹 Cleaning component: ${path.basename(componentPath)}`);
      
      // Clean standard build artifacts
      const artifactPaths = [
        path.join(componentPath, 'dist'),
        path.join(componentPath, 'node_modules'),
        path.join(componentPath, 'package-lock.json'),
        path.join(componentPath, '.tsbuildinfo')
      ];
      
      for (const artifactPath of artifactPaths) {
        if (fs.existsSync(artifactPath)) {
          const stat = fs.statSync(artifactPath);
          if (stat.isDirectory()) {
            fs.rmSync(artifactPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(artifactPath);
          }
        }
      }
      
    } catch (error) {
      console.error(`⚠️ Build: Failed to clean ${componentPath}: ${(error as Error).message}`);
    }
  }
}