// TSsh.ts: TypeScript backend for tssh CLI (initially same as OOSH.ts)
import { Logger } from '../layer3/Logger';

export class TSsh {
  static start() {
    Logger.log(`[TSsh ENTRY] ${JSON.stringify(process.argv)}`);
    // For now, just print args
    console.log('TSsh called with:', process.argv.slice(2).join(' '));
  }

  static installCompletion() {
    const os = require('os');
    const fs = require('fs');
    const path = require('path');
    const home = os.homedir();
    const completionDir = path.join(home, '.local', 'share', 'bash-completion', 'completions');
    if (!fs.existsSync(completionDir)) fs.mkdirSync(completionDir, { recursive: true });
    const completionScript = `#!/bin/bash\n_tssh_completion() {\n    local cur=\"\${COMP_WORDS[COMP_CWORD]}\"\n    local args=(\"\${COMP_WORDS[@]:1}\")\n    COMPREPLY=( $(compgen -W \"$(NODE_NO_WARNINGS=1 ts-node \"$PROJECT_PATH/src/ts/level1/TSsh.ts\" \"\${args[@]}\")\" -- \"$cur\") )\n    compopt -o default\n}\ncomplete -F _tssh_completion tssh\necho \"[tssh-completion] Bash function completion installed for 'tssh'. Type 'tssh [Tab]' to test.\"`;
    const filePath = path.join(completionDir, '_tssh_completion');
    fs.writeFileSync(filePath, completionScript, { mode: 0o755 });
    console.log(`[TSsh] Completion installed at ${filePath}`);
  }
}

if (process.argv[1] && process.argv[1].endsWith('TSsh.ts')) {
  TSsh.start();
}
