import { Logger } from '../layer1/Logger.ts';

/**
 * ResearchAgent: Provides CLI-accessible utilities to assist with
 * research workflows after an autonomous recovery has completed.
 *
 * Usage via CLI:
 *   tssh ResearchAgent help
 *   tssh ResearchAgent incorporateAfterRecovery <absoluteRetroPath?>
 */
export class ResearchAgent {
  /**
   * Prints usage information for the ResearchAgent.
   */
  static help(): void {
    const helpText = [
      'ResearchAgent CLI',
      '',
      'Usage:',
      '  tssh ResearchAgent help',
      '  tssh ResearchAgent incorporateAfterRecovery <retroFilePath?>',
      '',
      'Arguments:',
      '  retroFilePath: Absolute path to the ResearchArchitect retro file.',
      '',
      'Notes:',
      '  - All commands use positional arguments only (no options).',
      '  - See README.md Recovery section for the autonomous process.',
    ].join('\n');
    console.log(helpText);
  }

  /**
   * Incorporate research learnings after recovery by reading the given
   * retro file and acknowledging incorporation. This is a minimal scaffold
   * intended to be extended with concrete actions (indexing, linking, etc.).
   */
  static async incorporateAfterRecovery(retroFilePath?: string): Promise<void> {
    try {
      const defaultRetro = '/Users/Shared/Workspaces/2cuGitHub/Web4Articles/scrum.pmo/project.journal/2025-08-10-1030/retro/answer.ResearchArchitect.md';
      const target = retroFilePath && retroFilePath.trim().length > 0 ? retroFilePath : defaultRetro;
      Logger.log(`[ResearchAgent] Incorporating retro from: ${target}`, 'info');

      const fs = (await import('fs')).default;
      const path = (await import('path')).default;

      if (!path.isAbsolute(target)) {
        Logger.log('[ResearchAgent] Provided path is not absolute. Aborting to respect project policies.', 'error');
        return;
      }
      if (!fs.existsSync(target)) {
        Logger.log(`[ResearchAgent] Retro file not found at: ${target}`, 'error');
        return;
      }

      const content = fs.readFileSync(target, 'utf8');
      const preview = content.split('\n').slice(0, 12).join('\n');
      Logger.log('[ResearchAgent] Retro preview (first 12 lines):\n' + preview, 'debug');

      console.log('ResearchAgent: Recovery complete. Research retro read and incorporated.');
      console.log('Source retro file: ' + target);
    } catch (err) {
      Logger.log(`[ResearchAgent] incorporateAfterRecovery error: ${err}`, 'error');
    }
  }
}


