/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from './DefaultWeb4TSComponent.js';
import { ComponentDependency, ComponentScaffoldOptions } from '../layer3/Web4TSComponent.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Web4TSComponent Dependency System', () => {
  let component: DefaultWeb4TSComponent;
  let testDirectory: string;

  beforeEach(async () => {
    component = new DefaultWeb4TSComponent();
    testDirectory = path.join(__dirname, '../../../../test-output');
    
    // Clean up and create test directory
    try {
      await fs.rm(testDirectory, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
    await fs.mkdir(testDirectory, { recursive: true });
    
    component.setTargetDirectory(testDirectory);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDirectory, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('ComponentDependency Interface', () => {
    it('should create valid ComponentDependency objects', () => {
      const dependency: ComponentDependency = {
        component: 'IOR',
        version: '0.3.0.3',
        path: '/custom/path'
      };

      expect(dependency.component).toBe('IOR');
      expect(dependency.version).toBe('0.3.0.3');
      expect(dependency.path).toBe('/custom/path');
    });

    it('should create ComponentDependency without optional path', () => {
      const dependency: ComponentDependency = {
        component: 'Scenario',
        version: '0.3.0.2'
      };

      expect(dependency.component).toBe('Scenario');
      expect(dependency.version).toBe('0.3.0.2');
      expect(dependency.path).toBeUndefined();
    });
  });

  describe('Dependency Configuration', () => {
    it('should set and get dependencies', () => {
      const dependencies: ComponentDependency[] = [
        { component: 'IOR', version: '0.3.0.3' },
        { component: 'Scenario', version: '0.3.0.2' },
        { component: 'User', version: '0.3.0.2' }
      ];

      component.setDependencies(dependencies);
      
      const scenario = component.toScenario();
      expect(scenario.model.dependencies).toEqual(dependencies);
    });

    it('should serialize and deserialize dependencies in scenarios', () => {
      const dependencies: ComponentDependency[] = [
        { component: 'IOR', version: '0.3.0.3' },
        { component: 'Scenario', version: '0.3.0.2' }
      ];

      component.setComponentName('TestComponent');
      component.setVersion('1.0.0');
      component.setDependencies(dependencies);

      const scenario = component.toScenario();
      
      const newComponent = new DefaultWeb4TSComponent();
      newComponent.fromScenario(scenario);
      
      const newScenario = newComponent.toScenario();
      expect(newScenario.model.dependencies).toEqual(dependencies);
      expect(newScenario.model.componentName).toBe('TestComponent');
      expect(newScenario.model.version).toBe('1.0.0');
    });
  });

  describe('Build Script Generation', () => {
    it('should generate install-deps.sh script with dependencies', async () => {
      const dependencies: ComponentDependency[] = [
        { component: 'IOR', version: '0.3.0.3' },
        { component: 'Scenario', version: '0.3.0.2' }
      ];

      const script = await component.generateInstallDepsScript('ONCE', '0.3.1.0', dependencies);

      expect(script).toContain('ONCE@0.3.1.0');
      expect(script).toContain('IOR@0.3.0.3');
      expect(script).toContain('Scenario@0.3.0.2');
      expect(script).toContain('Building dependency: IOR@0.3.0.3');
      expect(script).toContain('Building dependency: Scenario@0.3.0.2');
      expect(script).toContain('npm install');
      expect(script).toContain('npm run build');
    });

    it('should generate build.sh script with dependency verification', async () => {
      const dependencies: ComponentDependency[] = [
        { component: 'IOR', version: '0.3.0.3' },
        { component: 'User', version: '0.3.0.2' }
      ];

      const script = await component.generateBuildScript('ONCE', '0.3.1.0', dependencies);

      expect(script).toContain('ONCE@0.3.1.0');
      expect(script).toContain('Verifying component dependencies');
      expect(script).toContain('Verified IOR@0.3.0.3');
      expect(script).toContain('Verified User@0.3.0.2');
      expect(script).toContain('Dependency not built');
    });

    it('should handle empty dependencies gracefully', async () => {
      const installScript = await component.generateInstallDepsScript('TestComponent', '1.0.0', []);
      const buildScript = await component.generateBuildScript('TestComponent', '1.0.0', []);

      expect(installScript).toContain('No dependencies to build');
      expect(buildScript).toContain('No dependencies to verify');
    });
  });

  describe('Component Scaffolding with Dependencies', () => {
    it('should scaffold component with dependency-aware build scripts', async () => {
      const dependencies: ComponentDependency[] = [
        { component: 'IOR', version: '0.3.0.3' },
        { component: 'Scenario', version: '0.3.0.2' }
      ];

      const options: ComponentScaffoldOptions = {
        componentName: 'TestONCE',
        version: '0.3.1.0',
        includeLayerArchitecture: true,
        includeCLI: true,
        includeSpecFolder: true,
        includeVitest: true,
        dependencies
      };

      const metadata = await component.scaffoldComponent(options);

      expect(metadata.name).toBe('TestONCE');
      expect(metadata.version).toBe('0.3.1.0');
      expect(metadata.dependencies).toEqual(dependencies);

      // Check that dependency build scripts were created
      const componentPath = path.join(testDirectory, 'components', 'TestONCE', '0.3.1.0');
      
      const installDepsExists = await fs.access(path.join(componentPath, 'install-deps.sh')).then(() => true).catch(() => false);
      const buildScriptExists = await fs.access(path.join(componentPath, 'build.sh')).then(() => true).catch(() => false);
      
      expect(installDepsExists).toBe(true);
      expect(buildScriptExists).toBe(true);

      // Verify script content
      const installScript = await fs.readFile(path.join(componentPath, 'install-deps.sh'), 'utf-8');
      const buildScript = await fs.readFile(path.join(componentPath, 'build.sh'), 'utf-8');

      expect(installScript).toContain('IOR@0.3.0.3');
      expect(installScript).toContain('Scenario@0.3.0.2');
      expect(buildScript).toContain('Verifying component dependencies');
    });

    it('should not create dependency scripts when no dependencies specified', async () => {
      const options: ComponentScaffoldOptions = {
        componentName: 'SimpleComponent',
        version: '1.0.0',
        includeLayerArchitecture: true,
        includeCLI: false,
        includeSpecFolder: false,
        includeVitest: false
      };

      await component.scaffoldComponent(options);

      const componentPath = path.join(testDirectory, 'components', 'SimpleComponent', '1.0.0');
      
      const installDepsExists = await fs.access(path.join(componentPath, 'install-deps.sh')).then(() => true).catch(() => false);
      const buildScriptExists = await fs.access(path.join(componentPath, 'build.sh')).then(() => true).catch(() => false);
      
      expect(installDepsExists).toBe(false);
      expect(buildScriptExists).toBe(false);
    });
  });

  describe('Dependency Build Section Generation', () => {
    it('should generate proper bash code for building dependencies', () => {
      const dependencies: ComponentDependency[] = [
        { component: 'IOR', version: '0.3.0.3' },
        { component: 'Scenario', version: '0.3.0.2' }
      ];

      const section = component.generateDependenciesBuildSection(dependencies);

      expect(section).toContain('Build component dependencies first');
      expect(section).toContain('DEP_PATH="$PROJECT_ROOT/components/IOR/0.3.0.3"');
      expect(section).toContain('DEP_PATH="$PROJECT_ROOT/components/Scenario/0.3.0.2"');
      expect(section).toContain('if [ ! -d "$DEP_PATH" ]; then');
      expect(section).toContain('npm install');
      expect(section).toContain('npm run build');
    });

    it('should generate proper bash code for verifying dependencies', () => {
      const dependencies: ComponentDependency[] = [
        { component: 'User', version: '0.3.0.2' }
      ];

      const section = component.generateDependenciesVerifySection(dependencies);

      expect(section).toContain('Verify all dependencies are built');
      expect(section).toContain('DEP_PATH="$PROJECT_ROOT/components/User/0.3.0.2"');
      expect(section).toContain('if [ ! -d "$DEP_PATH/dist" ]; then');
      expect(section).toContain('Dependency not built: User@0.3.0.2');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing template files gracefully', async () => {
      // Temporarily move template to cause error
      const templatePath = path.join(__dirname, '../../../templates/sh/install-deps.sh.template');
      const backupPath = templatePath + '.backup';
      
      try {
        await fs.rename(templatePath, backupPath);
      } catch {
        // Template might not exist, skip this test
        return;
      }

      await expect(component.generateInstallDepsScript('Test', '1.0.0', [])).rejects.toThrow();

      // Restore template
      try {
        await fs.rename(backupPath, templatePath);
      } catch {
        // Ignore restore errors
      }
    });
  });

  describe('Integration with Component Metadata', () => {
    it('should include dependencies in component metadata during audit', async () => {
      const dependencies: ComponentDependency[] = [
        { component: 'IOR', version: '0.3.0.3' }
      ];

      const options: ComponentScaffoldOptions = {
        componentName: 'TestComponent',
        version: '1.0.0',
        includeLayerArchitecture: true,
        includeCLI: false,
        includeSpecFolder: false,
        includeVitest: false,
        dependencies
      };

      const metadata = await component.scaffoldComponent(options);
      
      expect(metadata.dependencies).toBeDefined();
      expect(metadata.dependencies).toHaveLength(1);
      expect(metadata.dependencies![0].component).toBe('IOR');
      expect(metadata.dependencies![0].version).toBe('0.3.0.3');
    });
  });
});