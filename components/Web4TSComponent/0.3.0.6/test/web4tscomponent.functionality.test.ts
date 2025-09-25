/**
 * Web4TSComponent Functionality Tests
 * Tests for component creation and feature equivalence with 1.0.0.0
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { Web4TSComponentCLI } from '../src/ts/layer5/Web4TSComponentCLI.js';
import { existsSync } from 'fs';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

describe('Web4TSComponent Functionality', () => {
  let component: DefaultWeb4TSComponent;
  let cli: Web4TSComponentCLI;
  let testDataDir: string;

  beforeEach(async () => {
    // Setup test data directory
    testDataDir = path.join(__dirname, 'data');
    await fsPromises.mkdir(testDataDir, { recursive: true });
    
    // Initialize component and set targetDirectory to test data
    // Component remains unaware it's being tested - just gets different target
    component = new DefaultWeb4TSComponent();
    await component.init({
      name: 'Web4TSComponent',
      version: '0.3.0.6',
      targetDirectory: testDataDir  // Point to test/data instead of project root
    });
    
    cli = new Web4TSComponentCLI();
  });

  afterEach(async () => {
    // Clean up test components from test data directory
    await cleanupTestComponents();
  });

  async function cleanupTestComponents() {
    const testDataDir = path.join(__dirname, 'data');
    const testComponents = ['TestCreateComponent', 'TestUpgradeComponent', 'TestFeatureComponent'];
    
    for (const comp of testComponents) {
      try {
        const compPath = path.join(testDataDir, comp);
        if (existsSync(compPath)) {
          await fs.rm(compPath, { recursive: true, force: true });
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  }

  describe('Component Creation', () => {
    it('should create component with all features (feature equivalence to 1.0.0.0)', async () => {
      const componentName = 'TestCreateComponent';
      const version = '0.1.0.0';
      
      await component.create(componentName, version, 'all');
      
      const componentPath = path.join(testDataDir, 'components', componentName, version);
      expect(existsSync(componentPath)).toBe(true);
      
      // Verify all expected files created (same as 1.0.0.0)
      expect(existsSync(`${componentPath}/package.json`)).toBe(true);
      expect(existsSync(`${componentPath}/tsconfig.json`)).toBe(true);
      expect(existsSync(`${componentPath}/${componentName.toLowerCase()}.sh`)).toBe(true);
      expect(existsSync(`${componentPath}/vitest.config.ts`)).toBe(true);
      
      // Verify directories created
      expect(existsSync(`${componentPath}/src/ts/layer2`)).toBe(true);
      expect(existsSync(`${componentPath}/src/ts/layer3`)).toBe(true);
      expect(existsSync(`${componentPath}/src/ts/layer5`)).toBe(true);
      expect(existsSync(`${componentPath}/spec`)).toBe(true);
      expect(existsSync(`${componentPath}/test`)).toBe(true);
    });

    it('should create component with intelligent defaults', async () => {
      const componentName = 'TestCreateComponent';
      
      await component.create(componentName); // No version specified
      
      const componentPath = `components/${componentName}/0.1.0.0`; // Should default to 0.1.0.0
      expect(existsSync(componentPath)).toBe(true);
    });

    it('should handle component creation via CLI', async () => {
      const componentName = 'TestCreateComponent';
      const version = '0.1.0.0';
      
      await cli.execute(['create', componentName, version, 'all']);
      
      const componentPath = path.join(testDataDir, 'components', componentName, version);
      expect(existsSync(componentPath)).toBe(true);
    });
  });

  describe('Semantic Version Upgrades', () => {
    const baseComponent = 'TestUpgradeComponent';
    const baseVersion = '0.1.0.0';

    beforeEach(async () => {
      // Create base component for upgrade testing
      await component.create(baseComponent, baseVersion, 'all');
      await component.on(baseComponent, baseVersion);
    });

    it('should upgrade to next build (patch) version', async () => {
      await component.upgrade('nextBuild');
      
      const newVersionPath = path.join(testDataDir, 'components', baseComponent, '0.1.0.1');
      expect(existsSync(newVersionPath)).toBe(true);
      
      // Verify package.json version updated
      const packageContent = JSON.parse(
        await fs.readFile(`${newVersionPath}/package.json`, 'utf-8')
      );
      expect(packageContent.version).toBe('0.1.0.1');
    });

    it('should upgrade to next minor version', async () => {
      await component.upgrade('nextMinor');
      
      const newVersionPath = path.join(testDataDir, 'components', baseComponent, '0.1.1.0');
      expect(existsSync(newVersionPath)).toBe(true);
    });

    it('should upgrade to next major version', async () => {
      await component.upgrade('nextMajor');
      
      const newVersionPath = path.join(testDataDir, 'components', baseComponent, '0.2.0.0');
      expect(existsSync(newVersionPath)).toBe(true);
    });

    it('should upgrade to explicit version', async () => {
      await component.upgrade('0.5.0.0');
      
      const newVersionPath = path.join(testDataDir, 'components', baseComponent, '0.5.0.0');
      expect(existsSync(newVersionPath)).toBe(true);
    });

    it('should preserve all files during upgrade', async () => {
      await component.upgrade('nextBuild');
      
      const newVersionPath = `components/${baseComponent}/0.1.0.1`;
      
      // Verify all original files preserved
      expect(existsSync(`${newVersionPath}/package.json`)).toBe(true);
      expect(existsSync(`${newVersionPath}/tsconfig.json`)).toBe(true);
      expect(existsSync(`${newVersionPath}/src/ts/layer2`)).toBe(true);
      expect(existsSync(`${newVersionPath}/spec`)).toBe(true);
      expect(existsSync(`${newVersionPath}/test`)).toBe(true);
    });
  });

  describe('Command Chaining Integration', () => {
    it('should support full command chaining pattern', async () => {
      const componentName = 'TestFeatureComponent';
      
      // Test: create → on → upgrade chaining
      await component.create(componentName, '0.1.0.0', 'all');
      const result = await component
        .on(componentName, '0.1.0.0')
        .then(comp => comp.upgrade('nextBuild'));
      
      expect(result).toBe(component);
      expect(existsSync(path.join(__dirname, 'data', componentName, '0.1.0.1'))).toBe(true);
    });

    it('should maintain context through multiple operations', async () => {
      const componentName = 'TestFeatureComponent';
      
      await component.create(componentName, '0.1.0.0', 'all');
      await component.on(componentName, '0.1.0.0');
      
      // First upgrade
      await component.upgrade('nextBuild'); // 0.1.0.0 → 0.1.0.1
      
      // Context should update to new version
      const context = (component as any).getComponentContext();
      expect(context.version).toBe('0.1.0.1');
      
      // Second upgrade from new context
      await component.upgrade('nextMinor'); // 0.1.0.1 → 0.1.1.0
      
      expect(existsSync(path.join(__dirname, 'data', componentName, '0.1.1.0'))).toBe(true);
    });
  });

  describe('CLI Command Chaining', () => {
    it('should execute on method via CLI', async () => {
      const componentName = 'TestFeatureComponent';
      
      // Create component via CLI
      await cli.execute(['create', componentName, '0.1.0.0', 'all']);
      
      // Test on method via CLI
      await cli.execute(['on', componentName, '0.1.0.0']);
      
      // Should set context without errors
      const tsComponent = (cli as any).getOrCreateTSComponent();
      const context = tsComponent.getComponentContext();
      expect(context?.component).toBe(componentName);
    });

    it('should execute upgrade via CLI after on', async () => {
      const componentName = 'TestFeatureComponent';
      
      // Create and load context
      await cli.execute(['create', componentName, '0.1.0.0', 'all']);
      await cli.execute(['on', componentName, '0.1.0.0']);
      
      // Execute upgrade
      await cli.execute(['upgrade', 'nextBuild']);
      
      // Verify upgrade worked
      expect(existsSync(path.join(__dirname, 'data', componentName, '0.1.0.1'))).toBe(true);
    });
  });

  describe('English Sentence Validation', () => {
    it('should validate English sentence structure', () => {
      const commands = [
        'web4tscomponent on Unit 0.3.0.5 upgrade nextBuild',
        'web4tscomponent on DataService 0.1.0.0 upgrade nextMinor',
        'web4tscomponent on MyApp 1.0.0.0 upgrade nextMajor'
      ];
      
      commands.forEach(command => {
        const parts = command.split(' ');
        
        // Validate English sentence structure
        expect(parts[0]).toBe('web4tscomponent'); // Tool
        expect(parts[1]).toBe('on'); // Context preposition
        expect(parts[2]).toMatch(/^[A-Z]/); // Component (capitalized)
        expect(parts[3]).toMatch(/^\d+\.\d+\.\d+\.\d+$/); // Version
        expect(parts[4]).toBe('upgrade'); // Action verb
        expect(parts[5]).toMatch(/^next/); // Version type
        
        // Should read naturally
        const readable = `On ${parts[2]} version ${parts[3]}, ${parts[4]} to ${parts[5]}`;
        expect(readable).toMatch(/^On .+ version .+, upgrade to next/);
      });
    });
  });

  describe('Feature Equivalence with 1.0.0.0', () => {
    it('should create same structure as Web4TSComponent 1.0.0.0', async () => {
      const componentName = 'TestFeatureComponent';
      
      await component.create(componentName, '0.1.0.0', 'all');
      
      // Verify same file structure as 1.0.0.0 creates  
      const componentPath = path.join(testDataDir, 'components', componentName, '0.1.0.0');
      expect(existsSync(`${componentPath}/package.json`)).toBe(true);
      expect(existsSync(`${componentPath}/tsconfig.json`)).toBe(true);
      expect(existsSync(`${componentPath}/${componentName.toLowerCase()}.sh`)).toBe(true);
      expect(existsSync(`${componentPath}/vitest.config.ts`)).toBe(true);
      
      // Verify directory structure
      expect(existsSync(`${componentPath}/src/ts/layer2`)).toBe(true);
      expect(existsSync(`${componentPath}/src/ts/layer3`)).toBe(true);
      expect(existsSync(`${componentPath}/src/ts/layer5`)).toBe(true);
      expect(existsSync(`${componentPath}/spec`)).toBe(true);
      expect(existsSync(`${componentPath}/test`)).toBe(true);
    });

    it('should provide same metadata as 1.0.0.0', async () => {
      const componentName = 'TestFeatureComponent';
      
      const metadata = await component.scaffoldComponent({
        componentName,
        version: '0.1.0.0',
        includeLayerArchitecture: true,
        includeCLI: true,
        includeSpecFolder: true,
        includeVitest: true
      });
      
      // Same metadata structure as 1.0.0.0
      expect(metadata.name).toBe(componentName);
      expect(metadata.version).toBe('0.1.0.0');
      expect(metadata.hasLocationResilientCLI).toBe(true);
      expect(metadata.hasLayeredArchitecture).toBe(true);
      expect(metadata.hasEmptyConstructors).toBe(true);
      expect(metadata.hasScenarioSupport).toBe(true);
    });
  });
});