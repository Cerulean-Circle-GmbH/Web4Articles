/**
 * Tab Completion Tests
 * 
 * Tests the intelligent tab completion mechanism:
 * - TSCompletion inheritance chain discovery
 * - Multi-parameter completion with context passing
 * - Method completion, 1st parameter, 2nd parameter, chaining
 * - Callback mechanism for dynamic completions
 * 
 * Architecture:
 * - Layer 1: Bash (simulated via direct TSCompletion calls)
 * - Layer 2: TSCompletion (AST parsing and completion logic)
 * - Layer 3: Completion methods (componentParameterCompletion, versionParameterCompletion)
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import * as path from 'path';
import { TSCompletion } from '../src/ts/layer4/TSCompletion.js';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { Web4TSComponentCLI } from '../src/ts/layer5/Web4TSComponentCLI.js';

describe('🎨 Tab Completion Architecture', () => {
  const testDataDir = path.join(__dirname, '..', 'test', 'data');
  
  beforeEach(() => {
    // Create isolated test environment
    if (existsSync(testDataDir)) {
      rmSync(testDataDir, { recursive: true, force: true });
    }
    mkdirSync(testDataDir, { recursive: true });
    
    // Create mock project structure
    const componentsDir = path.join(testDataDir, 'components');
    mkdirSync(componentsDir, { recursive: true });
    
    // Create mock components for testing
    const mockComponents = ['Unit', 'Web4TSComponent', 'Build'];
    for (const comp of mockComponents) {
      const compDir = path.join(componentsDir, comp);
      mkdirSync(compDir, { recursive: true });
      
      // Create mock versions
      const versions = ['0.1.0.0', '0.2.0.0', '0.3.0.0'];
      for (const ver of versions) {
        mkdirSync(path.join(compDir, ver), { recursive: true });
      }
      
      // Create semantic links (as directories for testing)
      mkdirSync(path.join(compDir, 'latest'), { recursive: true });
      mkdirSync(path.join(compDir, 'dev'), { recursive: true });
      mkdirSync(path.join(compDir, 'test'), { recursive: true });
      mkdirSync(path.join(compDir, 'prod'), { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test data
    if (existsSync(testDataDir)) {
      rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  describe('🏗️ Layer 2: TSCompletion - Inheritance Chain Discovery', () => {
    it('should discover methods from Web4TSComponentCLI', () => {
      const methods = TSCompletion.getClassMethods('Web4TSComponentCLI');
      
      // Should find methods from Web4TSComponentCLI
      expect(methods.length).toBeGreaterThan(0);
      expect(methods).toContain('getMethodMaxArguments');
    });

    it('should discover inherited methods from DefaultCLI', () => {
      const methods = TSCompletion.getClassMethods('Web4TSComponentCLI');
      
      // Should find methods inherited from DefaultCLI (via extends)
      expect(methods).toContain('completeParameter');
      expect(methods).toContain('componentParameterCompletion');
      expect(methods).toContain('versionParameterCompletion');
    });

    it('should discover methods from DefaultWeb4TSComponent', () => {
      const methods = TSCompletion.getClassMethods('DefaultWeb4TSComponent');
      
      // Should find component methods
      expect(methods).toContain('create');
      expect(methods).toContain('on');
      expect(methods).toContain('tree');
      expect(methods).toContain('build');
    });

    it('should support comma-separated class names', () => {
      const methods = TSCompletion.getClassMethods('Web4TSComponentCLI,DefaultWeb4TSComponent');
      
      // Should find methods from BOTH classes
      expect(methods).toContain('completeParameter'); // from CLI
      expect(methods).toContain('create'); // from Component
      expect(methods).toContain('on'); // from Component
      
      // Verify we got a combined list
      expect(methods.length).toBeGreaterThan(30);
    });
  });

  describe('🎯 Scenario 1: Method Completion', () => {
    it('should complete method names starting with prefix', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'tr']);
      
      // Should return methods starting with 'tr'
      expect(results).toContain('tree');
      expect(results.length).toBeGreaterThanOrEqual(1);
    });

    it('should return all methods when prefix is empty', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', '']);
      
      // Should return all methods
      expect(results).toContain('create');
      expect(results).toContain('tree');
      expect(results).toContain('build');
      expect(results).toContain('on');
      expect(results.length).toBeGreaterThan(30);
    });

    it('should return parameters for exact method match', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'tree']);
      
      // Exact match with no space returns parameter completion or callback
      // Should return __CALLBACK__:depthParameterCompletion or parameter names
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].includes('depth') || results[0].includes('CALLBACK')).toBe(true);
    });
  });

  describe('🎯 Scenario 2: First Parameter Completion', () => {
    it('should return callback for component parameter of on command', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', '']);
      
      // Should detect componentParameterCompletion exists and return callback
      expect(results).toHaveLength(1);
      expect(results[0]).toBe('__CALLBACK__:componentParameterCompletion');
    });

    it('should return callback for depth parameter of tree command', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'tree', '']);
      
      // Should detect depthParameterCompletion exists and return callback
      expect(results).toHaveLength(1);
      expect(results[0]).toBe('__CALLBACK__:depthParameterCompletion');
    });

    it('should return parameter names if no completion method exists', () => {
      const completion = new TSCompletion();
      // Use a method that has parameters but no completion method
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'find', '']);
      
      // Should return parameter names as fallback
      // find method has parameters: componentDir
      expect(results).toContain('componentDir');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('🎯 Scenario 3: Second Parameter Completion', () => {
    it('should return callback for version parameter of on command', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', '']);
      
      // Args: [className, method, param1, param2]
      // Should detect we're completing 2nd parameter (version)
      expect(results).toHaveLength(1);
      expect(results[0]).toBe('__CALLBACK__:versionParameterCompletion');
    });

    it('should handle partial second parameter', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', 'lat']);
      
      // Should still return callback for version parameter
      expect(results).toHaveLength(1);
      expect(results[0]).toBe('__CALLBACK__:versionParameterCompletion');
    });
  });

  describe('🎯 Scenario 4: Chained Method Completion', () => {
    it('should complete chained methods after all parameters provided', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', '0.3.0.0', 'tre']);
      
      // Args: [className, method, param1, param2, chainedMethodPrefix]
      // All parameters of 'on' provided (component, version)
      // Should complete next chained method
      expect(results).toContain('tree');
    });

    it('should return all methods when chaining with empty prefix', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', 'latest', '']);
      
      // Should return all methods for chaining
      expect(results).toContain('tree');
      expect(results).toContain('build');
      expect(results).toContain('create');
      expect(results.length).toBeGreaterThan(30);
    });

    it('should filter chained methods by prefix', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', '0.3.0.0', 'b']);
      
      // Should return only methods starting with 'b'
      expect(results).toContain('build');
      expect(results.every(m => m.startsWith('b'))).toBe(true);
    });
  });

  describe('🎭 Layer 3: Completion Methods - Context Passing', () => {
    let cli: Web4TSComponentCLI;
    
    beforeEach(() => {
      cli = new Web4TSComponentCLI();
      // Set the component's target directory to our test data
      const component = (cli as any).getOrCreateTSComponent() as DefaultWeb4TSComponent;
      component.setTargetDirectory(testDataDir);
    });

    it('should list all components for componentParameterCompletion', async () => {
      // Simulate bash calling: completeParameter componentParameterCompletion on
      const contextArgs = ['on'];
      
      // Get the completion method directly
      const results = await (cli as any).componentParameterCompletion(contextArgs);
      
      // Should return all components (may include project components + mock components)
      // Verify at least some expected components are present
      expect(results).toContain('Unit');
      expect(results).toContain('Web4TSComponent');
      expect(results.length).toBeGreaterThan(0);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should list versions for specific component in versionParameterCompletion', async () => {
      // Simulate bash calling: completeParameter versionParameterCompletion on Unit
      const contextArgs = ['on', 'Unit'];
      
      // Get the completion method directly
      const results = await (cli as any).versionParameterCompletion(contextArgs);
      
      // Should return semantic links + actual versions for Unit
      // Will return actual project Unit versions, not mock ones
      expect(results).toContain('latest');
      expect(results).toContain('dev');
      expect(results).toContain('test');
      expect(results).toContain('prod');
      
      // Should have at least the 4 semantic links
      expect(results.length).toBeGreaterThanOrEqual(4);
      
      // Verify sorting: semantic links first, then versions descending
      const semanticIdx = results.indexOf('latest');
      expect(semanticIdx).toBeGreaterThanOrEqual(0);
      
      // If there are version directories, verify they come after semantic links
      const versionPattern = /^\d+\.\d+\.\d+\.\d+$/;
      const firstVersionIdx = results.findIndex(r => versionPattern.test(r));
      if (firstVersionIdx >= 0) {
        expect(firstVersionIdx).toBeGreaterThan(semanticIdx);
      }
    });

    it('should return only semantic links when no component specified', async () => {
      // Simulate bash calling: completeParameter versionParameterCompletion on
      const contextArgs = ['on'];
      
      const results = await (cli as any).versionParameterCompletion(contextArgs);
      
      // Should return only semantic links as fallback
      expect(results).toContain('latest');
      expect(results).toContain('dev');
      expect(results).toContain('test');
      expect(results).toContain('prod');
      expect(results).toHaveLength(4);
    });
  });

  describe('🔗 End-to-End Completion Flow', () => {
    it('should complete full user scenario: on Unit <Tab>', () => {
      const completion = new TSCompletion();
      
      // Step 1: User types "web4tscomponent o<Tab>"
      const methodResults = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'o']);
      expect(methodResults).toContain('on');
      
      // Step 2: User types "web4tscomponent on <Tab>"
      const param1Results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', '']);
      expect(param1Results[0]).toBe('__CALLBACK__:componentParameterCompletion');
      
      // Step 3: Bash calls completeParameter (simulated by checking method exists)
      const methods = TSCompletion.getClassMethods('Web4TSComponentCLI,DefaultWeb4TSComponent');
      expect(methods).toContain('componentParameterCompletion');
      
      // Step 4: User selects "Unit" and types "web4tscomponent on Unit <Tab>"
      const param2Results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', '']);
      expect(param2Results[0]).toBe('__CALLBACK__:versionParameterCompletion');
      
      // Step 5: User selects "0.3.0.0" and types "web4tscomponent on Unit 0.3.0.0 <Tab>"
      const chainResults = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'on', 'Unit', '0.3.0.0', '']);
      expect(chainResults).toContain('tree');
      expect(chainResults).toContain('build');
    });

    it('should complete tree depth parameter', () => {
      const completion = new TSCompletion();
      
      // User types "web4tscomponent tree <Tab>"
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'tree', '']);
      
      // Should return callback for depth parameter
      expect(results[0]).toBe('__CALLBACK__:depthParameterCompletion');
      
      // Verify depthParameterCompletion exists
      const methods = TSCompletion.getClassMethods('Web4TSComponentCLI,DefaultWeb4TSComponent');
      expect(methods).toContain('depthParameterCompletion');
    });

    it('should handle create command parameters', () => {
      const completion = new TSCompletion();
      
      // User types "web4tscomponent create <Tab>"
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'create', '']);
      
      // Should return callback for name parameter (now has completion)
      // create method has completion methods for all parameters
      expect(results).toHaveLength(1);
      expect(results[0]).toBe('__CALLBACK__:nameParameterCompletion');
    });
  });

  describe('🛡️ Edge Cases and Error Handling', () => {
    it('should handle non-existent method gracefully', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'nonExistentMethod', '']);
      
      // Should return empty array, not throw
      expect(results).toEqual([]);
    });

    it('should handle empty class name', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['', 'tree']);
      
      // Should handle gracefully
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle single class name (not comma-separated)', () => {
      const methods = TSCompletion.getClassMethods('DefaultWeb4TSComponent');
      
      // Should still work with single class
      expect(methods).toContain('create');
      expect(methods).toContain('tree');
    });

    it('should handle method with no parameters', () => {
      const completion = new TSCompletion();
      const results = completion.complete(['Web4TSComponentCLI,DefaultWeb4TSComponent', 'version', '']);
      
      // Method with no parameters should return empty or minimal results
      expect(Array.isArray(results)).toBe(true);
    });
  });

});

