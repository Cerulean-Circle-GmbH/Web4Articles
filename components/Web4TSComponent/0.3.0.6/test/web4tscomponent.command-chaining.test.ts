/**
 * Web4TSComponent Command Chaining Tests
 * Tests for "on" method and semantic versioning functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { Web4TSComponentCLI } from '../src/ts/layer5/Web4TSComponentCLI.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

describe('Web4TSComponent Command Chaining', () => {
  let component: DefaultWeb4TSComponent;
  let cli: Web4TSComponentCLI;
  const testComponentName = 'TestChainComponent';
  const testVersion = '0.1.0.0';

  beforeEach(async () => {
    // Enable test mode for environment-aware path resolution
    (globalThis as any).__TEST_MODE__ = true;
    
    // Ensure test data directory exists
    const testDataDir = path.join(__dirname, 'data');
    await fs.mkdir(testDataDir, { recursive: true });
    
    component = new DefaultWeb4TSComponent();
    cli = new Web4TSComponentCLI();
    
    // Clean up any existing test components
    await cleanupTestComponent();
  });

  afterEach(async () => {
    // Clean up test components
    await cleanupTestComponent();
    delete (globalThis as any).__TEST_MODE__;
  });

  async function cleanupTestComponent() {
    try {
      const testDataDir = path.join(__dirname, 'data');
      const compPath = path.join(testDataDir, testComponentName);
      if (existsSync(compPath)) {
        await fs.rm(compPath, { recursive: true, force: true });
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  describe('On Method Context Loading', () => {
    it('should load component context like Unit on method', async () => {
      // First create a component to load
      await component.create(testComponentName, testVersion, 'all');
      
      // Test on method context loading
      const result = await component.on(testComponentName, testVersion);
      
      expect(result).toBe(component); // Should return this for chaining
      expect(component.model.name).toBe(testComponentName);
      expect((component.model as any).contextComponent).toBe(testComponentName);
      expect((component.model as any).contextVersion).toBe(testVersion);
    });

    it('should throw error for non-existent component', async () => {
      await expect(
        component.on('NonExistentComponent', '0.1.0.0')
      ).rejects.toThrow('Component not found');
    });

    it('should enable command chaining after context loading', async () => {
      // Create test component
      await component.create(testComponentName, testVersion, 'all');
      
      // Test chaining
      const result = await component.on(testComponentName, testVersion);
      expect(typeof result.upgrade).toBe('function');
    });
  });

  describe('Semantic Version Control', () => {
    beforeEach(async () => {
      // Create base component for version testing
      await component.create(testComponentName, testVersion, 'all');
      await component.on(testComponentName, testVersion);
    });

    it('should increment patch version (nextBuild)', async () => {
      const result = await component.upgrade('nextBuild');
      
      expect(result).toBe(component); // Should return this for chaining
      
      // Verify new version directory created
      const newVersionPath = `components/${testComponentName}/0.1.0.1`;
      expect(existsSync(newVersionPath)).toBe(true);
      
      // Verify package.json version updated
      const packageJsonPath = `${newVersionPath}/package.json`;
      if (existsSync(packageJsonPath)) {
        const packageContent = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        expect(packageContent.version).toBe('0.1.0.1');
      }
    });

    it('should increment minor version (nextMinor)', async () => {
      await component.upgrade('nextMinor');
      
      const newVersionPath = `components/${testComponentName}/0.1.1.0`;
      expect(existsSync(newVersionPath)).toBe(true);
    });

    it('should increment major version (nextMajor)', async () => {
      await component.upgrade('nextMajor');
      
      const newVersionPath = `components/${testComponentName}/0.2.0.0`;
      expect(existsSync(newVersionPath)).toBe(true);
    });

    it('should handle explicit version specification', async () => {
      await component.upgrade('0.5.0.0');
      
      const newVersionPath = `components/${testComponentName}/0.5.0.0`;
      expect(existsSync(newVersionPath)).toBe(true);
    });

    it('should throw error for invalid version type', async () => {
      await expect(
        component.upgrade('invalidVersion')
      ).rejects.toThrow('Invalid version type');
    });
  });

  describe('Command Chaining Integration', () => {
    it('should support full command chaining pattern', async () => {
      // Create base component
      await component.create(testComponentName, testVersion, 'all');
      
      // Test full chaining: on → upgrade
      const result = await component
        .on(testComponentName, testVersion)
        .then(comp => comp.upgrade('nextBuild'));
      
      expect(result).toBe(component);
      expect(existsSync(`components/${testComponentName}/0.1.0.1`)).toBe(true);
    });

    it('should maintain context through chaining', async () => {
      await component.create(testComponentName, testVersion, 'all');
      
      await component.on(testComponentName, testVersion);
      const context = (component as any).getComponentContext();
      
      expect(context.component).toBe(testComponentName);
      expect(context.version).toBe(testVersion);
      
      await component.upgrade('nextBuild');
      const updatedContext = (component as any).getComponentContext();
      
      expect(updatedContext.version).toBe('0.1.0.1'); // Should update to new version
    });
  });

  describe('CLI Integration Tests', () => {
    it('should execute on method through CLI', async () => {
      // Create test component first
      await cli.execute(['create', testComponentName, testVersion, 'all']);
      
      // Test on method via CLI
      await cli.execute(['on', testComponentName, testVersion]);
      
      // Should not throw and should set context
      const context = (cli as any).getOrCreateTSComponent().getComponentContext();
      expect(context?.component).toBe(testComponentName);
    });

    it('should execute upgrade through CLI chaining', async () => {
      // Create base component
      await cli.execute(['create', testComponentName, testVersion, 'all']);
      
      // Test chained upgrade
      await cli.execute(['on', testComponentName, testVersion]);
      await cli.execute(['upgrade', 'nextBuild']);
      
      // Verify new version created
      expect(existsSync(`components/${testComponentName}/0.1.0.1`)).toBe(true);
    });
  });

  describe('English Sentence Readability', () => {
    it('should read like natural English sentences', () => {
      const commands = [
        'web4tscomponent on Unit 0.3.0.5 upgrade nextBuild',
        'web4tscomponent on DataService 0.1.0.0 upgrade nextMinor',
        'web4tscomponent on MyApp 1.0.0.0 upgrade nextMajor'
      ];
      
      commands.forEach(command => {
        // Test that commands can be read as natural language
        const words = command.split(' ');
        expect(words[0]).toBe('web4tscomponent'); // Tool name
        expect(words[1]).toBe('on'); // Context loading
        expect(words[2]).toMatch(/^[A-Z]/); // Component name (capitalized)
        expect(words[3]).toMatch(/^\d+\.\d+\.\d+\.\d+$/); // Version format
        expect(words[4]).toBe('upgrade'); // Action verb
        expect(words[5]).toMatch(/^next/); // Version type
      });
    });
  });
});