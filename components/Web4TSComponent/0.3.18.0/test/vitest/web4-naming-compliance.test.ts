import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const currentFileUrl = new URL(import.meta.url);
const currentDir = path.dirname(fileURLToPath(currentFileUrl));
const projectRoot = path.resolve(currentDir, '../..');

describe('🔴 Web4 Naming Compliance (CMM3 Automated)', () => {
  describe('__dirname Violations (Underscore Prohibition)', () => {
    it('should NOT have __dirname in source files', async () => {
      const files = await glob('src/**/*.ts', { cwd: projectRoot });
      const violations: string[] = [];
      
      for (const file of files) {
        const fullPath = path.join(projectRoot, file);
        const content = readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.includes('__dirname') || line.includes('__filename')) {
            violations.push(`${file}:${index + 1}: ${line.trim()}`);
          }
        });
      }
      
      expect(violations, `Found __dirname violations:\n${violations.join('\n')}`).toHaveLength(0);
    });
    
    it('should NOT have __dirname in test files', async () => {
      const files = await glob('test/**/*.ts', { cwd: projectRoot });
      const violations: string[] = [];
      
      for (const file of files) {
        // ✅ Skip: This test file itself (contains '__dirname' in strings)
        // ✅ Skip: test/data/ directory (contains test output, not our code)
        // ✅ Skip: node_modules/ (external dependencies)
        if (file.includes('web4-naming-compliance.test.ts') || 
            file.includes('test/data/') ||
            file.includes('node_modules/')) {
          continue;
        }
        
        const fullPath = path.join(projectRoot, file);
        const content = readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.includes('__dirname') || line.includes('__filename')) {
            violations.push(`${file}:${index + 1}: ${line.trim()}`);
          }
        });
      }
      
      expect(violations, `Found __dirname in tests:\n${violations.join('\n')}`).toHaveLength(0);
    });
  });
});

