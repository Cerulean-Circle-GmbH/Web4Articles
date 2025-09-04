/**
 * ONCE Deinstall & Rebuild Cycle Test
 * 
 * Tests the complete deinstall → rebuild → execution cycle
 * Validates comprehensive ecosystem reset and rebuild capability
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

describe('ONCE Deinstall & Rebuild Cycle', () => {
  
  test('once deinstall cleans all component build artifacts', async () => {
    console.log('🧪 Testing ONCE deinstall comprehensive cleaning');
    
    try {
      // Execute deinstall command
      const result = execSync('./scripts/once deinstall', { 
        encoding: 'utf8',
        timeout: 60000,
        cwd: '/workspace',
        stdio: 'pipe'
      });
      
      console.log('✅ ONCE deinstall executed successfully');
      
      // Verify deinstall output
      expect(result).toContain('ONCE: Starting comprehensive ecosystem deinstall');
      expect(result).toContain('🧹 Cleaning all Web4 component build artifacts');
      expect(result).toContain('✅ All Web4 components cleaned');
      expect(result).toContain('✅ ONCE: Complete ecosystem deinstall successful');
      
      // Verify component dist directories are removed
      const componentPaths = [
        '/workspace/components/IOR/0.3.0.0/dist',
        '/workspace/components/Scenario/0.1.3.0/dist',
        '/workspace/components/User/0.1.3.0/dist',
        '/workspace/components/ONCE/0.3.0.0/dist'
      ];
      
      for (const distPath of componentPaths) {
        expect(existsSync(distPath)).toBe(false);
      }
      
      console.log('✅ All component dist directories cleaned');
      
    } catch (error) {
      console.error('❌ ONCE deinstall failed');
      throw error;
    }
  });

  test('once start rebuilds ecosystem after deinstall', async () => {
    console.log('🧪 Testing ONCE rebuild after deinstall');
    
    try {
      // First deinstall
      execSync('./scripts/once deinstall', { 
        encoding: 'utf8',
        timeout: 60000,
        cwd: '/workspace',
        stdio: 'pipe'
      });
      
      // Then start (should rebuild)
      const result = execSync('./scripts/once start', { 
        encoding: 'utf8',
        timeout: 120000, // Allow time for complete rebuild
        cwd: '/workspace',
        stdio: 'pipe'
      });
      
      console.log('✅ ONCE start after deinstall successful');
      
      // Verify rebuild occurred
      expect(result).toContain('🔨 Building foundation component: IOR');
      expect(result).toContain('✅ IOR built');
      expect(result).toContain('🔧 Building Web4CompliantONCE directly');
      expect(result).toContain('✅ ONCE: Kernel started with service registry');
      
      // Verify component dist directories are recreated
      const componentPaths = [
        '/workspace/components/IOR/0.3.0.0/dist',
        '/workspace/components/Scenario/0.1.3.0/dist',
        '/workspace/components/User/0.1.3.0/dist'
      ];
      
      for (const distPath of componentPaths) {
        expect(existsSync(distPath)).toBe(true);
      }
      
      console.log('✅ Complete deinstall → rebuild cycle successful');
      
    } catch (error) {
      console.error('❌ ONCE deinstall → rebuild cycle failed');
      throw error;
    }
  });

  test('deinstall command appears in usage display', async () => {
    console.log('🧪 Testing deinstall command in usage display');
    
    try {
      const result = execSync('./scripts/once help', { 
        encoding: 'utf8',
        timeout: 30000,
        cwd: '/workspace',
        stdio: 'pipe'
      });
      
      // Verify deinstall command is documented
      expect(result).toContain('deinstall');
      expect(result).toContain('Clean all components');
      expect(result).toContain('Clean all Web4 components and force rebuild');
      
      console.log('✅ Deinstall command properly documented in usage');
      
    } catch (error) {
      console.error('❌ Deinstall usage display test failed');
      throw error;
    }
  });
});