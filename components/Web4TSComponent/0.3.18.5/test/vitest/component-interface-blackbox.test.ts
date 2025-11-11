/**
 * Component Interface Base Methods - Black Box Tests
 * 
 * Tests the new Component interface methods added in Phase 2:
 * - hasMethod(name): Check if component has a method
 * - getMethodSignature(name): Get method signature
 * - listMethods(): List all method names
 * 
 * @pdca 2025-11-05-UTC-1223.pdca.md - Self-discovery architecture
 * @cmm CMM3 - Objective, reproducible verification
 */

import { describe, it, expect } from 'vitest';
import { Web4TSComponentCLI } from '../../src/ts/layer5/Web4TSComponentCLI.js';

describe('Component Interface - Base Methods (Black Box)', () => {
  
  describe('hasMethod() - CLI Methods', () => {
    it('should return true for existing CLI methods', () => {
      const cli = new Web4TSComponentCLI();
      
      // Test CLI-specific methods (not component methods!)
      expect(cli.hasMethod('on')).toBe(true);
      expect(cli.hasMethod('execute')).toBe(true);
      expect(cli.hasMethod('showUsage')).toBe(true);
    });
    
    it('should return false for non-existent methods', () => {
      const cli = new Web4TSComponentCLI();
      
      expect(cli.hasMethod('nonExistentMethod')).toBe(false);
      expect(cli.hasMethod('fakeCommand')).toBe(false);
    });
  });
  
  describe('hasMethod() - Component Methods', () => {
    it('should return true for component methods', () => {
      const cli = new Web4TSComponentCLI();
      const component = (cli as any).component;
      
      expect(component.hasMethod('build')).toBe(true);
      expect(component.hasMethod('tree')).toBe(true);
      expect(component.hasMethod('upgrade')).toBe(true);
    });
  });
  
  describe('getMethodSignature() - CLI Methods', () => {
    it('should return signature for existing CLI methods', () => {
      const cli = new Web4TSComponentCLI();
      
      const onSig = cli.getMethodSignature('on');
      expect(onSig).toBeDefined();
      expect(onSig?.name).toBe('on');
      expect(onSig?.paramCount).toBeGreaterThan(0);
      expect(typeof onSig?.isAsync).toBe('boolean');
      
      const executeSig = cli.getMethodSignature('execute');
      expect(executeSig).toBeDefined();
      expect(executeSig?.name).toBe('execute');
    });
    
    it('should return null for non-existent methods', () => {
      const cli = new Web4TSComponentCLI();
      
      expect(cli.getMethodSignature('nonExistentMethod')).toBeNull();
    });
  });
  
  describe('getMethodSignature() - Component Methods', () => {
    it('should return signature for component methods', () => {
      const cli = new Web4TSComponentCLI();
      const component = (cli as any).component;
      
      const buildSig = component.getMethodSignature('build');
      expect(buildSig).toBeDefined();
      expect(buildSig?.name).toBe('build');
      expect(typeof buildSig?.paramCount).toBe('number');
      expect(typeof buildSig?.isAsync).toBe('boolean');
    });
  });
  
  describe('listMethods() - CLI Methods', () => {
    it('should return array of CLI method names', () => {
      const cli = new Web4TSComponentCLI();
      
      const methods = cli.listMethods();
      
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBeGreaterThan(0);
      expect(methods).toContain('on');
      expect(methods).toContain('execute');
      expect(methods).toContain('showUsage');
    });
    
    it('should have at least 10 CLI methods', () => {
      const cli = new Web4TSComponentCLI();
      
      const methods = cli.listMethods();
      
      expect(methods.length).toBeGreaterThanOrEqual(10);
    });
  });
  
  describe('listMethods() - Component Methods', () => {
    it('should return array of component method names', () => {
      const cli = new Web4TSComponentCLI();
      const component = (cli as any).component;
      
      const methods = component.listMethods();
      
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBeGreaterThan(0);
      expect(methods).toContain('build');
      expect(methods).toContain('tree');
      expect(methods).toContain('upgrade');
    });
    
    it('should have at least 15 component methods', () => {
      const cli = new Web4TSComponentCLI();
      const component = (cli as any).component;
      
      const methods = component.listMethods();
      
      expect(methods.length).toBeGreaterThanOrEqual(15);
    });
  });
  
  describe('Self-Discovery Verification', () => {
    it('CLI should discover its own methods in constructor', () => {
      const cli = new Web4TSComponentCLI();
      
      // CLI methods should be available immediately after construction
      const methods = cli.listMethods();
      
      expect(methods).toContain('on');
      expect(methods).toContain('execute');
      expect(methods).toContain('showUsage');
    });
    
    it('Component should discover its methods in init()', () => {
      const cli = new Web4TSComponentCLI();
      const component = (cli as any).component;
      
      // Component methods should be available after init()
      const methods = component.listMethods();
      
      expect(methods).toContain('build');
      expect(methods).toContain('tree');
      expect(methods).toContain('upgrade');
      expect(methods).toContain('create');
    });
  });
  
  describe('CMM3 Compliance', () => {
    it('should be objective - methods return observable values', () => {
      const cli = new Web4TSComponentCLI();
      
      const hasMethod = cli.hasMethod('on');
      const signature = cli.getMethodSignature('on');
      const methods = cli.listMethods();
      
      expect(typeof hasMethod).toBe('boolean');
      expect(signature).not.toBeNull();
      expect(Array.isArray(methods)).toBe(true);
    });
    
    it('should be reproducible - same input produces same output', () => {
      const cli = new Web4TSComponentCLI();
      
      const result1 = cli.hasMethod('on');
      const result2 = cli.hasMethod('on');
      
      expect(result1).toBe(result2);
      
      const methods1 = cli.listMethods();
      const methods2 = cli.listMethods();
      
      expect(methods1).toEqual(methods2);
    });
    
    it('should be verifiable - pass/fail criteria are clear', () => {
      const cli = new Web4TSComponentCLI();
      
      // Clear pass criteria: has() returns boolean, get() returns signature, list() returns array
      const hasOn = cli.hasMethod('on');
      const onSig = cli.getMethodSignature('on');
      const allMethods = cli.listMethods();
      
      expect(hasOn).toBe(true);
      expect(onSig).not.toBeNull();
      expect(allMethods.length).toBeGreaterThan(0);
    });
  });
});

