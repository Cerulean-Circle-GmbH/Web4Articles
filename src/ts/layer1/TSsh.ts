
process.env.NODE_NO_WARNINGS = '1';
import { Logger } from './Logger.ts';
Logger.log('[TSsh ENTRY] ' + JSON.stringify(process.argv), 'debug');
// TSsh.ts: Strict OOP CLI class for tssh, matching OOSH.ts
import { ParameterParser } from './ParameterParser.ts';
import { DefaultCLI } from '../layer2/DefaultCLI.ts';

export class TSsh {
  private static cli = new DefaultCLI((args: string[]) => {
    Logger.log('[TSsh] dispatch called with: ' + JSON.stringify(args), 'debug');
    return this.dispatch(args);
  });

  static start(): void {
    this.cli.start();
  }

  private static dispatch(args: string[]): void {
    Logger.log('[TSsh] dispatch executing', 'debug');
    const parser = new ParameterParser(args);
    const { command } = parser.parse();
    Logger.log('[TSsh] parsed command: ' + command, 'debug');
    if (!command || command === 'help') {
      this.help();
    } else if (typeof (this as any)[command] === 'function') {
      Logger.log('[TSsh] calling method: ' + command, 'debug');
      (this as any)[command]();
    } else {
      Logger.log('Unknown command. Use "tssh help" for usage.', 'warn');
      this.help();
    }
  }

  static help(): void {
    Logger.log('[TSsh] help() called', 'info');
    console.log(`tssh CLI Help\n\nUsage:\n  tssh TSsh help                Show this help message\n  tssh TSsh installCompletion   Install bash completion script\n\nAll commands use positional arguments only. No Linux-style options.\nSee README.md for first principles.`);
  }

  static async installCompletion(): Promise<void> {
    try {
      const os = (await import('os')).default;
      const fs = (await import('fs')).default;
      const path = (await import('path')).default;
      const home = os.homedir();
      const completionDir = path.join(home, '.local', 'share', 'bash-completion', 'completions');
      Logger.log(`[TSsh] completionDir: ${completionDir}`, 'debug');
      if (!fs.existsSync(completionDir)) fs.mkdirSync(completionDir, { recursive: true });
      // Robustly resolve project root (where package.json and src/ts exist)
      let dir = process.cwd();
      let projectRoot = '';
      while (dir !== '/') {
        if (fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'src', 'ts'))) {
          projectRoot = dir;
          break;
        }
        dir = path.dirname(dir);
      }
      if (!projectRoot) throw new Error('Could not find project root');
      Logger.log(`[TSsh] projectRoot: ${projectRoot}`, 'debug');
      const completionScriptPath = path.join(projectRoot, 'src', 'sh', 'tssh-completion.sh');
      Logger.log(`[TSsh] completionScriptPath: ${completionScriptPath}`, 'debug');
      const completionScript = fs.readFileSync(completionScriptPath, 'utf8');
      const filePath = path.join(completionDir, '_tssh_completion');
      Logger.log(`[TSsh] filePath: ${filePath}`, 'debug');
      fs.writeFileSync(filePath, completionScript, { mode: 0o755 });
      Logger.log(`[TSsh] Completion installed at ${filePath}`, 'info');
    } catch (err) {
      Logger.log('[TSsh] installCompletion error: ' + err, 'error');
    }
  }
}

Logger.log(`[TSsh ENTRY] ${JSON.stringify(process.argv)}`);
TSsh.start();
