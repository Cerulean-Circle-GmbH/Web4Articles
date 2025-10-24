/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { Build } from '../layer3/Build.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { BuildModel } from '../layer3/BuildModel.interface.js';

export class DefaultBuild implements Build {
  private model: BuildModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      indexPath: '',
      symlinkPaths: [],
      namedLinks: [],
      buildCapabilities: ['component', 'resolve', 'validate', 'clean'],
      dependencyCapabilities: ['npm-install', 'typescript-build', 'dependency-validation'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  init(scenario: Scenario): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  async toScenario(): Promise<Scenario> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Build',
      version: '0.3.0.4'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Build',
        version: '0.3.0.4'
      },
      owner: ownerData,
      model: this.model
    };
  }

  // CLI Commands (Direct method naming convention v0.1.2.2)
  async component(componentPath: string): Promise<boolean> {
    try {
      console.log(`🏗️ Building component: ${componentPath}`);
      
      const fs = await import('fs');
      const path = await import('path');
      const { execSync } = await import('child_process');

      // Resolve component path from project root (compiled at dist/ts/layer2/DefaultBuild.js)
      const currentDir = path.dirname(new URL(import.meta.url).pathname);
      const projectRoot = path.resolve(currentDir, '../../../../../..');
      const fullComponentPath = path.resolve(projectRoot, componentPath);

      if (!fs.existsSync(fullComponentPath)) {
        console.log(`❌ Component path not found: ${fullComponentPath}`);
        return false;
      }

      const packageJsonPath = path.join(fullComponentPath, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        console.log(`❌ No package.json found in: ${fullComponentPath}`);
        return false;
      }

      // Resolve dependencies first
      await this.resolve(fullComponentPath);

      // Build with TypeScript
      execSync('npx tsc', { cwd: fullComponentPath, stdio: 'inherit' });
      
      console.log(`✅ Component built successfully: ${componentPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to build component: ${(error as Error).message}`);
      return false;
    }
  }

  async resolve(componentPath: string): Promise<boolean> {
    try {
      console.log(`🔧 Resolving dependencies: ${componentPath}`);
      
      const fs = await import('fs');
      const path = await import('path');
      const { execSync } = await import('child_process');

      // Install dependencies if needed
      if (!fs.existsSync(path.join(componentPath, 'node_modules'))) {
        console.log('📦 Installing dependencies...');
        execSync('npm install', { cwd: componentPath, stdio: 'inherit' });
      }

      console.log(`✅ Dependencies resolved: ${componentPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to resolve dependencies: ${(error as Error).message}`);
      return false;
    }
  }

  async validate(componentPath: string): Promise<boolean> {
    try {
      console.log(`🔍 Validating component: ${componentPath}`);
      
      const fs = await import('fs');
      const path = await import('path');

      // Check if component is built
      const distPath = path.join(componentPath, 'dist');
      if (!fs.existsSync(distPath)) {
        console.log(`❌ Component not built: ${componentPath}`);
        return false;
      }

      // Check if main file exists
      const packageJson = JSON.parse(fs.readFileSync(path.join(componentPath, 'package.json'), 'utf-8'));
      const mainFile = path.join(componentPath, packageJson.main || 'dist/index.js');
      
      if (!fs.existsSync(mainFile)) {
        console.log(`❌ Main file not found: ${mainFile}`);
        return false;
      }

      console.log(`✅ Component validated: ${componentPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to validate component: ${(error as Error).message}`);
      return false;
    }
  }

  async clean(componentPath: string): Promise<boolean> {
    try {
      console.log(`🧹 Cleaning component: ${componentPath}`);
      
      const fs = await import('fs');
      const path = await import('path');

      // Remove dist directory
      const distPath = path.join(componentPath, 'dist');
      if (fs.existsSync(distPath)) {
        await fs.promises.rm(distPath, { recursive: true, force: true });
      }

      // Remove node_modules if requested
      const nodeModulesPath = path.join(componentPath, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        await fs.promises.rm(nodeModulesPath, { recursive: true, force: true });
      }

      console.log(`✅ Component cleaned: ${componentPath}`);
      return true;
    } catch (error) {
      console.error(`Failed to clean component: ${(error as Error).message}`);
      return false;
    }
  }

  async info(): Promise<void> {
    console.log(`Build System Information:`);
    console.log(`  Name: ${this.model.name || 'Web4 Build System'}`);
    console.log(`  UUID: ${this.model.uuid}`);
    console.log(`  Version: 0.3.0.4`);
    console.log(`  Build Capabilities: ${this.model.buildCapabilities.join(', ')}`);
    console.log(`  Dependency Capabilities: ${this.model.dependencyCapabilities.join(', ')}`);
    console.log(`  Created: ${this.model.createdAt}`);
    console.log(`  Updated: ${this.model.updatedAt}`);
  }

  help(): void {
    // Will be implemented by BuildCLI using DefaultCLI pattern
    console.log('Build help - implemented by CLI layer');
  }

  // Helper methods
  getModel(): BuildModel {
    return this.model;
  }
}