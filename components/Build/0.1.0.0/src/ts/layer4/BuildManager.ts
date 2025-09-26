/**
 * Build Manager - Web4 Build Component
 * Layer 4: Controller Layer
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve } from 'path';

export interface BuildDependency {
  name: string;
  path: string;
  required: boolean;
}

export interface BuildStatus {
  built: boolean;
  message: string;
}

export class BuildManager {
  private componentRoot: string;

  constructor() {
    // Empty constructor - Web4 principle
    this.componentRoot = process.cwd();
  }

  async buildComponent(dependency: BuildDependency): Promise<void> {
    const componentPath = resolve(this.componentRoot, dependency.path);
    const distPath = resolve(componentPath, 'dist');
    
    if (!existsSync(componentPath)) {
      if (dependency.required) {
        throw new Error(`Required dependency ${dependency.name} not found at ${componentPath}`);
      }
      console.log(`⚠️  Optional dependency ${dependency.name} not found, skipping`);
      return;
    }
    
    if (existsSync(distPath)) {
      console.log(`✅ ${dependency.name} already built`);
      return;
    }
    
    console.log(`📦 Building ${dependency.name}...`);
    
    try {
      // Check for node_modules
      const nodeModulesPath = resolve(componentPath, 'node_modules');
      if (!existsSync(nodeModulesPath)) {
        console.log(`  Installing dependencies for ${dependency.name}...`);
        execSync('npm install', {
          cwd: componentPath,
          stdio: 'inherit'
        });
      }
      
      // Check if it has npm start with build check
      const packageJsonPath = resolve(componentPath, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = require(packageJsonPath);
        if (packageJson.scripts?.prestart?.includes('ensure-built')) {
          // Component has self-build capability
          console.log(`  Component has self-build capability...`);
          execSync('npm run ensure-built', {
            cwd: componentPath,
            stdio: 'inherit'
          });
        } else {
          // Traditional build
          console.log(`  Building ${dependency.name}...`);
          execSync('npm run build', {
            cwd: componentPath,
            stdio: 'inherit'
          });
        }
      }
      
      console.log(`✅ ${dependency.name} built successfully\n`);
    } catch (error: any) {
      throw new Error(`Failed to build ${dependency.name}: ${error.message}`);
    }
  }

  async isBuilt(): Promise<boolean> {
    const distPath = resolve(this.componentRoot, 'dist');
    return existsSync(distPath);
  }

  async verifyCurrentBuild(): Promise<boolean> {
    const distPath = resolve(this.componentRoot, 'dist');
    if (!existsSync(distPath)) {
      return false;
    }
    
    // Additional verification could go here
    // e.g., check for specific files, timestamps, etc.
    
    return true;
  }

  async cleanBuild(): Promise<void> {
    const distPath = resolve(this.componentRoot, 'dist');
    if (existsSync(distPath)) {
      execSync('rm -rf dist/', {
        cwd: this.componentRoot,
        stdio: 'inherit'
      });
    }
  }
}