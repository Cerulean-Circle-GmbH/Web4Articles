
console.log('[DEBUG] TSsh.ts loaded');
// TSsh.ts: TypeScript backend for tssh CLI (initially same as OOSH.ts)
import { Logger } from './Logger.js';

export class TSsh {
  static start() {
    Logger.log(`[TSsh ENTRY] ${JSON.stringify(process.argv)}`);
    const args = process.argv.slice(2);
    // Always print received arguments, project root, and unit path for any invocation
    console.log('args:', ...args);
    if (process.env.TSSH_PROJECT_ROOT) {
      console.log('Project Root:', process.env.TSSH_PROJECT_ROOT);
    }
    if (process.env.TSSH_UNIT_PATH) {
      console.log('Unit Path:', process.env.TSSH_UNIT_PATH);
    }
    // Only allow positional invocation for installCompletion
    if (args.length === 2 && args[0] === 'TSsh' && args[1] === 'installCompletion') {
      TSsh.installCompletion();
    } else if (args.some(a => a.startsWith('--'))) {
      const msg = 'error: shell-style options are not supported. Use positional arguments.';
      console.error(msg);
      console.log(msg);
    } else if (args.length > 0) {
      const msg = 'error: invalid or unknown command.';
      console.error(msg);
      console.log(msg);
    }
  }

  static installCompletion() {
    const os = require('os');
    const fs = require('fs');
    const path = require('path');
    const home = os.homedir();
    const completionDir = path.join(home, '.local', 'share', 'bash-completion', 'completions');
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
