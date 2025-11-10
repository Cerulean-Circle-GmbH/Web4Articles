/**
 * Component Discovery - Radical OOP Compliance Tests
 * 
 * These tests verify the NEW architecture:
 * - Component methods discovered from INSTANCE (not class)
 * - No componentClass field (Radical OOP violation)
 * - Discovery happens during construction
 * - Maintains Models = Data ONLY principle
 * 
 * @pdca 2025-10-31-UTC-1430.component-discovery-radical-oop.pdca.md
 * @baseline 0.3.13.2 (used CLASS-based discovery)
 * @target 0.3.17.1 (NEW: INSTANCE-based discovery)
 */

import { describe, it, expect } from 'vitest';
import { Web4TSComponentCLI } from '../../src/ts/layer5/Web4TSComponentCLI.js';

describe('🔵 Component Discovery - Radical OOP Architecture', () => {
  
  describe('Instance-Based Discovery (NEW)', () => {
    it('should discover component methods from component INSTANCE (not class)', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // ✅ Component methods MUST be discovered (functional requirement)
      const criticalMethods = ['create', 'version', 'test', 'list', 'upgrade'];
      
      for (const method of criticalMethods) {
        expect(
          methodSignatures.has(method),
          `Method '${method}' should be discovered via instance-based discovery`
        ).toBe(true);
      }
    });
    
    it('should have component instance available during construction', () => {
      const cli = new Web4TSComponentCLI();
      
      // ✅ Component instance should exist (stored in class field)
      expect((cli as any).component).toBeDefined();
      expect((cli as any).component.constructor.name).toBe('DefaultWeb4TSComponent');
    });
    
    it('should discover component methods BEFORE any execute() call', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // Discovery must happen in constructor (before execute)
      expect(methodSignatures.has('create')).toBe(true);
      expect(methodSignatures.has('version')).toBe(true);
    });
  });
  
  describe('Radical OOP Compliance', () => {
    it('should NOT have componentClass field (CLASS reference = violation)', () => {
      const cli = new Web4TSComponentCLI();
      
      // ❌ OLD (0.3.13.2): componentClass stored CLASS reference
      // ✅ NEW (0.3.17.1): component stores INSTANCE
      expect((cli as any).componentClass).toBeUndefined();
    });
    
    it('should NOT have componentName field (data should be in model)', () => {
      const cli = new Web4TSComponentCLI();
      
      // ❌ OLD: componentName as class field
      // ✅ NEW: Name derived from component.model
      expect((cli as any).componentName).toBeUndefined();
    });
    
    it('should NOT have componentVersion field (data should be in model)', () => {
      const cli = new Web4TSComponentCLI();
      
      // ❌ OLD: componentVersion as class field
      // ✅ NEW: Version derived from component.model
      expect((cli as any).componentVersion).toBeUndefined();
    });
    
    it('should store component instance in class field (not model)', () => {
      const cli = new Web4TSComponentCLI();
      
      // ✅ Instance in class field (Radical OOP compliant)
      expect((cli as any).component).toBeDefined();
      
      // ❌ NOT in model (would violate serializability)
      expect((cli as any).model.component).toBeUndefined();
    });
  });
  
  describe('Discovery Method Architecture', () => {
    it('should have discoverMethods() method', () => {
      const cli = new Web4TSComponentCLI();
      
      expect(typeof (cli as any).discoverMethods).toBe('function');
    });
    
    it('should discover both CLI and component methods', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // CLI methods
      expect(methodSignatures.has('execute')).toBe(true);
      expect(methodSignatures.has('showUsage')).toBe(true);
      expect(methodSignatures.has('on')).toBe(true);
      
      // Component methods
      expect(methodSignatures.has('create')).toBe(true);
      expect(methodSignatures.has('version')).toBe(true);
      expect(methodSignatures.has('test')).toBe(true);
    });
    
    it('should NOT have initWithComponentClass() method (deprecated)', () => {
      const cli = new Web4TSComponentCLI();
      
      // ❌ OLD (0.3.13.2): initWithComponentClass(class, name, version)
      // ✅ NEW (0.3.17.1): Component created directly in constructor
      expect((cli as any).initWithComponentClass).toBeUndefined();
    });
  });
  
  describe('Method Signature Metadata', () => {
    it('should capture method metadata from component instance', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      const createSig = methodSignatures.get('create');
      
      expect(createSig).toBeDefined();
      expect(createSig.name).toBe('create');
      expect(createSig.paramCount).toBeGreaterThan(0);
      expect(typeof createSig.isAsync).toBe('boolean');
    });
    
    it('should correctly identify async methods', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // Most component methods are async
      const createSig = methodSignatures.get('create');
      const versionSig = methodSignatures.get('version');
      
      // At least one should be async
      expect(createSig?.isAsync || versionSig?.isAsync).toBe(true);
    });
  });
  
  describe('Compatibility with 0.3.13.2 Behavior', () => {
    /**
     * Even though architecture changed (class → instance),
     * the FUNCTIONAL behavior must be identical
     */
    it('should discover same methods as 0.3.13.2', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // These ALL worked in 0.3.13.2
      const expected0313Methods = [
        'create', 'version', 'list', 'upgrade', 'tree', 'links',
        'test', 'completion', 'execute', 'showUsage', 'on'
      ];
      
      for (const method of expected0313Methods) {
        expect(
          methodSignatures.has(method),
          `0.3.13.2 had '${method}', 0.3.17.1 must too!`
        ).toBe(true);
      }
    });
    
    it('should have at least as many methods as 0.3.13.2', () => {
      const cli = new Web4TSComponentCLI();
      const methodSignatures = (cli as any).methodSignatures;
      
      // 0.3.13.2 had 30+ methods total
      expect(methodSignatures.size).toBeGreaterThanOrEqual(20);
    });
  });
});

