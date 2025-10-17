import { describe, it, expect, beforeAll } from 'vitest';
import { execSync, spawn } from 'child_process';
import { join } from 'path';

describe('🎯 Tab Completion Output Format Tests', () => {
  const projectRoot = join(__dirname, '..');
  const cliPath = join(projectRoot, 'web4tscomponent');

  beforeAll(async () => {
    // CRITICAL: Ensure component builds without errors before testing completion
    try {
      console.log('🔧 Building component before completion tests...');
      execSync('npm run build', { 
        cwd: projectRoot, 
        stdio: 'inherit',
        timeout: 60000 
      });
      console.log('✅ Component build successful');
    } catch (error) {
      console.error('❌ Component build failed:', error);
      throw new Error('Component must build successfully before testing completion functionality');
    }
  });

  describe('Simple Option Completion (Single-Word Mode)', () => {
    it('should output releaseTest options without trailing newline for bash compgen filtering', () => {
      // Test the exact case user reported: releaseTest n
      const command = `${cliPath} completeParameter successPromotionParameterCompletion releaseTest n`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });
      
      // Should be space-separated options without trailing newline
      expect(output).toBe('nextPatch nextMinor nextMajor');
      expect(output).not.toMatch(/\n$/); // No trailing newline - CRITICAL for compgen
      expect(output).toMatch(/^[a-zA-Z\s]+$/); // Only letters and spaces
    });

    it('should filter releaseTest nextPa to nextPatch only', () => {
      // Test the specific case: nextPa should filter to nextPatch
      const command = `${cliPath} completeParameter successPromotionParameterCompletion releaseTest nextPa`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });
      
      expect(output).toBe('nextPatch');
      expect(output).not.toMatch(/\n$/); // No trailing newline
    });

    it('should show all options for empty prefix', () => {
      const command = `${cliPath} completeParameter successPromotionParameterCompletion releaseTest`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });
      
      expect(output).toBe('nextPatch nextMinor nextMajor');
      expect(output).not.toMatch(/\n$/);
    });
  });

  describe('Hierarchical Completion (Multi-Line Mode)', () => {
    it('should output test file 3 with trailing newline for OOSH display', () => {
      // Test the case that NEEDS newline: test file 3
      const command = `${cliPath} completeParameter referencesParameterCompletion test file 3`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });
      
      // Should contain ANSI colors and end with newline for OOSH
      expect(output).toMatch(/\x1b\[36m/); // Contains ANSI color codes
      expect(output).toMatch(/\n$/); // MUST have trailing newline for OOSH
      expect(output).toMatch(/3:/); // Contains file number 3
    });

    it('should filter hierarchical results correctly', () => {
      const command = `${cliPath} completeParameter referencesParameterCompletion test file 3`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });
      
      // Should show only the filtered file
      expect(output).toMatch(/3:/); // Contains file number 3
      expect(output).toMatch(/\.test\.ts/); // Contains test file
    });
  });

  describe('Critical Build and Runtime Verification', () => {
    it('should build component successfully without TypeScript errors', () => {
      // Verify the component actually compiles
      expect(() => {
        execSync('npm run build', { 
          cwd: projectRoot, 
          stdio: 'pipe',
          timeout: 30000 
        });
      }).not.toThrow();
    });

    it('should execute CLI without runtime errors', () => {
      // Verify the CLI actually runs
      expect(() => {
        execSync(`${cliPath}`, { 
          cwd: projectRoot, 
          stdio: 'pipe',
          timeout: 30000 
        });
      }).not.toThrow();
    });

    it('should handle completion callbacks without crashing', () => {
      // Verify completion system doesn't crash
      expect(() => {
        execSync(`${cliPath} completeParameter successPromotionParameterCompletion releaseTest`, { 
          cwd: projectRoot, 
          stdio: 'pipe',
          timeout: 30000 
        });
      }).not.toThrow();
    });
  });

  describe('Bash Integration Verification', () => {
    it('should produce output compatible with bash compgen for simple options', () => {
      const command = `${cliPath} completeParameter successPromotionParameterCompletion releaseTest n`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });
      
      // Verify format is exactly what bash compgen expects
      expect(output).not.toMatch(/\n/); // No newlines anywhere
      expect(output.split(' ')).toHaveLength(3); // Three space-separated options
      expect(output.split(' ')).toEqual(['nextPatch', 'nextMinor', 'nextMajor']);
    });

    it('should produce output compatible with OOSH display for hierarchical', () => {
      const command = `${cliPath} completeParameter referencesParameterCompletion test file 3`;
      const output = execSync(command, { encoding: 'utf8', cwd: projectRoot });
      
      // Verify format triggers OOSH multi-line mode
      expect(output).toMatch(/\n$/); // Must have trailing newline
      expect(output).toMatch(/\x1b\[/); // Must contain ANSI escape sequences
      expect(output).toMatch(/(\x1b\[\d+m)?\d+:/); // Must contain numbered reference (with optional ANSI codes)
    });
  });
});
