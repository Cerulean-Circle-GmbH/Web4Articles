/**
 * Template-Based Code Generation Tests
 * Tests behavior of 4 methods that generate code using templates
 * @pdca 2025-10-30-UTC-1245.pdca.md
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFile, mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { DefaultWeb4TSComponent } from '../../src/ts/layer2/DefaultWeb4TSComponent.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Web4 Pattern: Module-level path calculation for tests
const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const componentRoot = path.join(currentDir, '../..');
const testDataPath = path.join(componentRoot, 'test/data');

describe('Template-Based Code Generation', () => {
  let component: DefaultWeb4TSComponent;
  let testDir: string;

  beforeAll(async () => {
    // @pdca 2025-11-03-UTC-1828.pdca.md - BOTH projectRoot AND targetDirectory required
    component = new DefaultWeb4TSComponent().init({
      model: { 
        projectRoot: testDataPath,
        targetDirectory: testDataPath 
      }
    });
    
    // Create test directory in test/data (isolated project root)
    testDir = join(testDataPath, 'template-gen-test');
    if (existsSync(testDir)) {
      await rm(testDir, { recursive: true, force: true });
    }
    await mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    // Cleanup test directory
    if (existsSync(testDir)) {
      await rm(testDir, { recursive: true, force: true });
    }
  });

  describe('generateLocationResilientCLI', () => {
    it('should generate valid bash script with shebang', async () => {
      const result = await component.generateLocationResilientCLI('TestComponent', '1.0.0');
      
      // Verify bash shebang
      expect(result).toContain('#!/bin/bash');
      
      // Verify location resilience pattern
      expect(result).toContain('find_project_root');
    });

    it('should generate script with Web4 location resilience pattern', async () => {
      const result = await component.generateLocationResilientCLI('MyComp', '2.3.4');
      
      // Verify symlink resolution logic
      expect(result).toContain('BASH_SOURCE');
      expect(result).toContain('readlink');
      
      // Verify component path detection
      expect(result).toContain('COMPONENT_PATH');
    });
  });

  describe('createComponentImplementation', () => {
    it('should create file with correct TypeScript class', async () => {
      const componentDir = join(testDir, 'TestComp1');
      await mkdir(join(componentDir, 'src/ts/layer2'), { recursive: true });
      
      await component.createComponentImplementation(componentDir, 'TestComp1', '1.0.0');
      
      const filePath = join(componentDir, 'src/ts/layer2/DefaultTestComp1.ts');
      expect(existsSync(filePath)).toBe(true);
      
      const content = await readFile(filePath, 'utf-8');
      
      // Verify class export
      expect(content).toContain('export class DefaultTestComp1');
      
      // Verify interface implementation
      expect(content).toContain('implements TestComp1');
      
      // Verify Web4 pattern: empty constructor
      expect(content).toContain('constructor()');
      
      // Verify Web4 pattern: init with OPTIONAL scenario (current pattern)
      expect(content).toContain('init(scenario?: Scenario<TestComp1Model>)');
    });

    it('should create file with toScenario method', async () => {
      const componentDir = join(testDir, 'TestComp2');
      await mkdir(join(componentDir, 'src/ts/layer2'), { recursive: true });
      
      await component.createComponentImplementation(componentDir, 'TestComp2', '2.0.0');
      
      const filePath = join(componentDir, 'src/ts/layer2/DefaultTestComp2.ts');
      const content = await readFile(filePath, 'utf-8');
      
      // Verify toScenario method
      expect(content).toContain('async toScenario');
      expect(content).toContain('Promise<Scenario<TestComp2Model>>');
    });
  });

  describe('createComponentInterfaces', () => {
    it('should create component interface file', async () => {
      const componentDir = join(testDir, 'TestComp3');
      await mkdir(join(componentDir, 'src/ts/layer3'), { recursive: true });
      
      await component.createComponentInterfaces(componentDir, 'TestComp3');
      
      const interfacePath = join(componentDir, 'src/ts/layer3/TestComp3.interface.ts');
      expect(existsSync(interfacePath)).toBe(true);
      
      const content = await readFile(interfacePath, 'utf-8');
      
      // Verify interface export
      expect(content).toContain('export interface TestComp3');
      
      // Verify Web4 standard methods (interface has required parameter)
      expect(content).toContain('init(scenario: Scenario<TestComp3Model>)');
      expect(content).toContain('toScenario');
    });

    it('should create component model interface file', async () => {
      const componentDir = join(testDir, 'TestComp4');
      await mkdir(join(componentDir, 'src/ts/layer3'), { recursive: true });
      
      await component.createComponentInterfaces(componentDir, 'TestComp4');
      
      const modelPath = join(componentDir, 'src/ts/layer3/TestComp4Model.interface.ts');
      expect(existsSync(modelPath)).toBe(true);
      
      const content = await readFile(modelPath, 'utf-8');
      
      // Verify model interface export
      expect(content).toContain('export interface TestComp4Model');
      
      // Verify extends Model
      expect(content).toContain('extends Model');
    });
  });

  describe('createCLIImplementation', () => {
    it('should create CLI file with correct class', async () => {
      const componentDir = join(testDir, 'TestComp5');
      await mkdir(join(componentDir, 'src/ts/layer5'), { recursive: true });
      
      await component.createCLIImplementation(componentDir, 'TestComp5', '1.0.0');
      
      const cliPath = join(componentDir, 'src/ts/layer5/TestComp5CLI.ts');
      expect(existsSync(cliPath)).toBe(true);
      
      const content = await readFile(cliPath, 'utf-8');
      
      // Verify shebang
      expect(content).toContain('#!/usr/bin/env node');
      
      // Verify class export
      expect(content).toContain('export class TestComp5CLI');
      
      // Verify extends DefaultCLI
      expect(content).toContain('extends DefaultCLI');
    });

    it('should create CLI with Path Authority pattern', async () => {
      const componentDir = join(testDir, 'TestComp6');
      await mkdir(join(componentDir, 'src/ts/layer5'), { recursive: true });
      
      await component.createCLIImplementation(componentDir, 'TestComp6', '2.0.0');
      
      const cliPath = join(componentDir, 'src/ts/layer5/TestComp6CLI.ts');
      const content = await readFile(cliPath, 'utf-8');
      
      // Verify Path Authority: init() call
      expect(content).toContain('this.init()');
      
      // Verify Web4 Radical OOP: empty constructor
      expect(content).toContain('constructor()');
      expect(content).toContain('super()');
      
      // Verify static start method
      expect(content).toContain('static async start');
    });
  });
});

