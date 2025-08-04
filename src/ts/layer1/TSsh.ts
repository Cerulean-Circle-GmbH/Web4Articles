
process.env.NODE_NO_WARNINGS = '1';

// TSsh.ts: TypeScript backend for tssh CLI (initially same as OOSH.ts)
import { Logger } from './Logger.ts';

export class TSsh {
  static start() {
    Logger.log(`[TSsh ENTRY] ${JSON.stringify(process.argv)}`);
    const args = process.argv.slice(2);
    // Only allow positional invocation for installCompletion
    // Dynamically get all public static methods except 'start' and 'installCompletion'
    const completions = Object.getOwnPropertyNames(TSsh)
      .filter(m => typeof (TSsh as any)[m] === 'function' && !['start', 'installCompletion', 'length', 'prototype', 'name'].includes(m));
    completions.push('installCompletion'); // Always include installCompletion

    if (args.length === 2 && args[0] === 'TSsh' && args[1] === 'installCompletion') {
      // Only print logs for installCompletion
      console.log('args:', ...args);
      if (process.env.TSSH_PROJECT_ROOT) {
        console.log('Project Root:', process.env.TSSH_PROJECT_ROOT);
      }
      if (process.env.TSSH_UNIT_PATH) {
        console.log('Unit Path:', process.env.TSSH_UNIT_PATH);
      }
      TSsh.installCompletion();
    } else if (args.length === 2 && args[0] === 'TSsh') {
      // Completion: if partial second arg, suggest valid completions
      const partial = args[1];
      const matches = completions.filter(c => c.startsWith(partial));
      if (matches.length > 0) {
        process.stdout.write(matches.join('\t'));
      }
      // No output otherwise
    } else if (args.length === 1 && args[0] === 'TSsh') {
      // If only 'TSsh' is given, suggest all valid completions
      process.stdout.write(completions.join('\t'));
    }
    // For all other cases, do nothing (silent for completion)
  }

  static installCompletion() {
    const os = require('os');
    const fs = require('fs');
    const path = require('path');
    const home = os.homedir();
    const completionDir = path.join(home, '.local', 'share', 'bash-comple    NODE_NO_WARNINGS=1 npx ts-node --esm src/ts/layer1/TSsh.ts TSsh inns');
    if (!fs.existsSync(completionDir)) fs.mkdirSync(completionDir, { recursive: true });
    // Read the completion script from a separate file
    const completionScriptPath = path.resolve(__dirname, '../../sh/tssh-completion.sh');
    const completionScript = fs.readFileSync(completionScriptPath, 'utf8');
    const filePath = path.join(completionDir, '_tssh_completion');
    fs.writeFileSync(filePath, completionScript, { mode: 0o755 });
    console.log(`[TSsh] Completion installed at ${filePath}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('TSsh.ts')) {
  TSsh.start();
}
