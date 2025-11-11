/**
 * Functional Regression Tests - Benchmark 0.3.13.2
 * 
 * These tests verify that 0.3.17.1 maintains ALL functional behavior from 0.3.13.2.
 * If ANY test fails, we broke something that worked in the benchmark.
 * 
 * @baseline 0.3.13.2 (FUNCTIONAL BENCHMARK)
 * @target 0.3.17.1 (CURRENT VERSION)
 * @pdca 2025-10-31-UTC-1208.cli-model-duplication-cleanup.pdca.md
 * 
 * TEST PHILOSOPHY:
 * - These tests define "working" based on 0.3.13.2 behavior
 * - ALL tests MUST pass before and after refactoring
 * - If test fails, either fix code OR update test (document why)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Web4TSComponentCLI } from '../../src/ts/layer5/Web4TSComponentCLI.js';

describe('🟢 Functional Regression Tests (Baseline: 0.3.13.2)', () => {
  
  describe('CLI Construction and Initialization', () => {
    it('should construct CLI without errors', () => {
      expect(() => new Web4TSComponentCLI()).not.toThrow();
    });
    
    it('should have methodSignatures populated after construction', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      expect(methodSignatures).toBeDefined();
      expect(methodSignatures instanceof Map).toBe(true);
    });
    
    it('should discover methods during construction', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // 0.3.13.2 discovered methods - this MUST work!
      expect(methodSignatures.size).toBeGreaterThan(0);
    });
  });
  
  describe('Component Method Discovery (CRITICAL)', () => {
    let cli: Web4TSComponentCLI;
    
    beforeEach(() => {
      cli = new Web4TSComponentCLI();
    });
    
    /**
     * CRITICAL: These methods MUST be discoverable for CLI to function
     * These all worked in 0.3.13.2 - if ANY fail, functionality is broken
     */
    const criticalComponentMethods = [
      'create',      // Component creation
      'upgrade',     // Version upgrades
      'tree',        // Directory tree
      'links',       // Symlink management
      'test',        // Testing
      'completion',  // Tab completion
    ];
    
    criticalComponentMethods.forEach(methodName => {
      it(`should discover component method: ${methodName}`, () => {
        const methodSignatures = (cli as any).methodSignatures;
        
        expect(
          methodSignatures.has(methodName),
          `Method '${methodName}' was discoverable in 0.3.13.2 but NOT in 0.3.17.1! REGRESSION!`
        ).toBe(true);
      });
    });
    
    it('should discover at least 20 methods total', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // 0.3.13.2 had 30+ methods - if we have < 20, something is very wrong
      expect(methodSignatures.size).toBeGreaterThanOrEqual(20);
    });
  });
  
  describe('CLI Method Discovery', () => {
    let cli: Web4TSComponentCLI;
    
    beforeEach(() => {
      cli = new Web4TSComponentCLI();
    });
    
    const cliMethods = [
      'execute',
      'showUsage',
      'on',           // Context loading
    ];
    
    cliMethods.forEach(methodName => {
      it(`should discover CLI method: ${methodName}`, () => {
        const methodSignatures = (cli as any).methodSignatures;
        
        expect(
          methodSignatures.has(methodName),
          `CLI method '${methodName}' should be discovered`
        ).toBe(true);
      });
    });
  });
  
  describe('Command Execution (Integration)', () => {
    let cli: Web4TSComponentCLI;
    
    beforeEach(() => {
      cli = new Web4TSComponentCLI();
    });
    
    it('should execute getCurrentVersion command without error', async () => {
      // getCurrentVersion exists and works
      await expect(cli.execute(['getCurrentVersion'])).resolves.not.toThrow();
    });
    
    it('should reject unknown commands', async () => {
      await expect(
        cli.execute(['nonexistentcommandxyz123'])
      ).rejects.toThrow();
    });
    
    it('should show usage when no args provided', async () => {
      // Should not throw
      await expect(cli.execute([])).resolves.not.toThrow();
    });
  });
  
  describe('Method Signature Metadata', () => {
    it('should capture parameter count for methods', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // Get a method that should have parameters
      const createSig = methodSignatures.get('create');
      
      if (createSig) {
        expect(createSig.paramCount).toBeGreaterThan(0);
      } else {
        throw new Error('create method not discovered - CRITICAL REGRESSION!');
      }
    });
    
    it('should detect async methods', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // Most component methods are async in 0.3.13.2
      let hasAsyncMethod = false;
      
      for (const [name, sig] of methodSignatures) {
        if (sig.isAsync) {
          hasAsyncMethod = true;
          break;
        }
      }
      
      expect(hasAsyncMethod, 'Should detect at least one async method').toBe(true);
    });
  });
  
  describe('Component Instance Management', () => {
    it('should create component instance on demand', () => {
      const cli = new Web4TSComponentCLI();
      
      // Get component via private getter
      const getMethod = (cli as any).getOrCreateTSComponent;
      expect(typeof getMethod).toBe('function');
      
      const component = getMethod.call(cli);
      expect(component).toBeDefined();
    });
    
    it('should have component available for method execution', () => {
      const cli = new Web4TSComponentCLI();
      
      // Component should exist (or be creatable)
      const component = (cli as any).component || (cli as any).tsComponent;
      
      // At minimum, we should be able to get it
      expect(component !== undefined || typeof (cli as any).getOrCreateTSComponent === 'function').toBe(true);
    });
  });
  
  describe('Inheritance and Architecture', () => {
    it('should inherit from DefaultCLI', () => {
      const cli = new Web4TSComponentCLI();
      
      // Check for inherited methods
      expect(typeof (cli as any).execute).toBe('function');
      expect(typeof (cli as any).discoverMethods).toBe('function');
    });
    
    it('should have static start method', () => {
      expect(typeof Web4TSComponentCLI.start).toBe('function');
    });
  });
  
  describe('🚨 CRITICAL: Discovery Before Execution', () => {
    /**
     * THIS IS THE BUG WE FOUND!
     * 
     * In 0.3.13.2, methods were discovered DURING construction.
     * In broken 0.3.17.1, methods are discovered BUT component doesn't exist.
     * 
     * This test ensures discovery happens correctly.
     */
    it('should discover component methods BEFORE any execute() call', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // BEFORE calling execute, these should already be discovered
      expect(methodSignatures.has('create'), 'create should be discovered in constructor').toBe(true);
      expect(methodSignatures.has('version'), 'version should be discovered in constructor').toBe(true);
      expect(methodSignatures.has('test'), 'test should be discovered in constructor').toBe(true);
    });
    
    it('should have component reference available for discovery', () => {
      const cli = new Web4TSComponentCLI();
      
      // In 0.3.13.2: this.componentClass was set
      // In 0.3.17.1: we need this.component to be set OR discoverable
      
      const hasComponentClass = (cli as any).componentClass !== undefined;
      const hasComponent = (cli as any).component !== undefined;
      const hasTsComponent = (cli as any).tsComponent !== undefined;
      
      // At least ONE of these should be true for discovery to work
      expect(
        hasComponentClass || hasComponent || hasTsComponent,
        'CLI must have a component reference for method discovery to work!'
      ).toBe(true);
    });
  });
});

