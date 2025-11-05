import { describe, it, expect, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';

describe('Context Method Discovery Bug Fix', () => {
  const projectRoot = execSync('git rev-parse --show-toplevel', { 
    encoding: 'utf8' 
  }).trim();
  
  // Use Web4TSComponent 0.3.17.9 with fix
  const web4Cmd = join(
    projectRoot, 
    'components/Web4TSComponent/0.3.17.9/web4tscomponent'
  );

  describe('Black-box: External behavior', () => {
    it('should execute PDCA context method info after on()', () => {
      // ARRANGE: Load PDCA 0.3.17.9 as context
      
      // ACT: Execute info command from PDCA context
      const result = execSync(
        `${web4Cmd} on PDCA 0.3.17.9 info`,
        { encoding: 'utf8', cwd: projectRoot }
      );

      // ASSERT: Should execute PDCA info method successfully
      expect(result).toContain('PDCA Information');
      expect(result).toContain('UUID');
    });

    it('should execute PDCA context method trainAI after on()', () => {
      // ARRANGE: Load PDCA 0.3.17.9 as context
      
      // ACT: Execute trainAI command from PDCA context (no topic = list topics)
      const result = execSync(
        `${web4Cmd} on PDCA 0.3.17.9 trainAI`,
        { encoding: 'utf8', cwd: projectRoot }
      );

      // ASSERT: Should execute PDCA trainAI method successfully
      expect(result).toContain('Training Topics');
      expect(result).toContain('Radical OOP');
    });
  });

});


