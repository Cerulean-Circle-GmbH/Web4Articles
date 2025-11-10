/**
 * Test suite for IdealMinimalComponent migration to DRY helper template
 * 
 * Verifies that IdealMinimalComponent:
 * 1. Exists and can be removed/recreated
 * 2. Builds successfully with new template
 * 3. Shows correct component data in links (NOT Web4TSComponent data)
 * 4. Uses DRY helper for all delegations
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('IdealMinimalComponent Migration to DRY Helper', () => {
  const projectRoot = process.cwd().split('/components/')[0];
  const componentRoot = join(projectRoot, 'components', 'IdealMinimalComponent', '0.1.0.0');
  const componentPath = join(componentRoot, 'src', 'ts', 'layer2', 'DefaultIdealMinimalComponent.ts');

  describe('Phase 1: Pre-Migration Status', () => {
    it('should have IdealMinimalComponent at 0.1.0.0', () => {
      expect(existsSync(componentRoot)).toBe(true);
    });

    it('should have CLI script in scripts/', () => {
      const cliPath = join(projectRoot, 'scripts', 'idealminimalcomponent');
      expect(existsSync(cliPath)).toBe(true);
    });
  });

  describe('Phase 2: Component Removal', () => {
    it('should successfully remove IdealMinimalComponent', () => {
      const output = execSync(
        'cd ' + projectRoot + ' && ./components/Web4TSComponent/latest/web4tscomponent removeComponent IdealMinimalComponent',
        { encoding: 'utf-8' }
      );
      
      expect(output).toContain('✅ Removed component IdealMinimalComponent');
      expect(existsSync(componentRoot)).toBe(false);
    });
  });

  describe('Phase 3: Component Recreation with New Template', () => {
    beforeAll(() => {
      // Recreate component
      execSync(
        'cd ' + projectRoot + ' && ./components/Web4TSComponent/latest/web4tscomponent create IdealMinimalComponent 0.1.0.0 all',
        { encoding: 'utf-8' }
      );
    });

    it('should successfully create IdealMinimalComponent 0.1.0.0', () => {
      expect(existsSync(componentRoot)).toBe(true);
      expect(existsSync(componentPath)).toBe(true);
    });

    it('should have delegateToWeb4TS helper method in template', () => {
      const content = readFileSync(componentPath, 'utf-8');
      
      expect(content).toContain('private async delegateToWeb4TS');
      expect(content).toContain('web4ts.model.context = this');
      expect(content).toContain('await (web4ts as any)[method](...args)');
    });

    it('should use DRY helper in links() method', () => {
      const content = readFileSync(componentPath, 'utf-8');
      
      // Should use helper
      expect(content).toMatch(/async links\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]links['"][^)]*\)/s);
      
      // Should NOT have manual delegation
      const linksMatch = content.match(/async links\([^)]*\)[^{]*{([^}]+)}/s);
      if (linksMatch) {
        const linksBody = linksMatch[1];
        expect(linksBody).not.toContain('const web4ts = await this.getWeb4TSComponent()');
      }
    });

    it('should use DRY helper in test() method', () => {
      const content = readFileSync(componentPath, 'utf-8');
      
      // Should use helper
      expect(content).toMatch(/async test\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]test['"][^)]*\)/s);
      
      // Should NOT have 178-line implementation
      const testMatch = content.match(/async test\([^)]*\)[^{]*{([^}]+)}/s);
      if (testMatch) {
        const testBody = testMatch[1];
        const lineCount = testBody.split('\n').length;
        expect(lineCount).toBeLessThan(10); // Should be ~3 lines, not 178
      }
    });

    it('should use DRY helper in build(), clean(), tree() methods', () => {
      const content = readFileSync(componentPath, 'utf-8');
      
      expect(content).toMatch(/async build\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]build['"][^)]*\)/s);
      expect(content).toMatch(/async clean\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]clean['"][^)]*\)/s);
      expect(content).toMatch(/async tree\([^)]*\)[^{]*{[^}]*return this\.delegateToWeb4TS\(['"]tree['"][^)]*\)/s);
    });

    it('should set context only ONCE in helper (DRY principle)', () => {
      const content = readFileSync(componentPath, 'utf-8');
      
      const contextMatches = content.match(/web4ts\.model\.context\s*=\s*this/g);
      expect(contextMatches).not.toBeNull();
      expect(contextMatches!.length).toBe(1); // Only in helper
    });
  });

  describe('Phase 4: Build Verification', () => {
    it('should build successfully without TypeScript errors', () => {
      const output = execSync(
        'cd ' + componentRoot + ' && npm run build',
        { encoding: 'utf-8' }
      );
      
      // Should not contain error messages
      expect(output).not.toContain('error TS');
      expect(output).not.toContain('❌');
    });
  });

  describe('Phase 5: CLI Functionality Verification', () => {
    it('should show IdealMinimalComponent data in links (NOT Web4TSComponent)', () => {
      const output = execSync(
        'cd ' + componentRoot + ' && ./idealminimalcomponent links',
        { encoding: 'utf-8' }
      );
      
      // Should show IdealMinimalComponent
      expect(output).toContain('IdealMinimalComponent');
      
      // Should NOT show Web4TSComponent
      expect(output).not.toContain('Web4 Web4TSComponent CLI Tool');
      
      // Should show correct path
      expect(output).toContain('/IdealMinimalComponent/0.1.0.0');
    });

    it('should show correct CLI name and version', () => {
      const output = execSync(
        'cd ' + componentRoot + ' && ./idealminimalcomponent',
        { encoding: 'utf-8' }
      );
      
      // Should show correct CLI name
      expect(output).toContain('Web4 IdealMinimalComponent CLI Tool');
      expect(output).toContain('v0.1.0.0');
      
      // Should NOT show generic CLI
      expect(output).not.toContain('Web4 CLI CLI Tool');
      expect(output).not.toContain('v0.0.0.0');
    });
  });
});

