var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
process.env.NODE_NO_WARNINGS = '1';
import { Logger } from './Logger';
Logger.log('[TSsh ENTRY] ' + JSON.stringify(process.argv), 'debug');
// TSsh.ts: Strict OOP CLI class for tssh, matching OOSH.ts
import { ParameterParser } from './ParameterParser';
import { DefaultCLI } from '../layer2/DefaultCLI';
export class TSsh {
    static start() {
        this.cli.start();
    }
    static dispatch(args) {
        Logger.log('[TSsh] dispatch executing', 'debug');
        const parser = new ParameterParser(args);
        const { command } = parser.parse();
        Logger.log('[TSsh] parsed command: ' + command, 'debug');
        if (!command || command === 'help') {
            this.help();
        }
        else if (typeof this[command] === 'function') {
            Logger.log('[TSsh] calling method: ' + command, 'debug');
            this[command]();
        }
        else {
            Logger.log('Unknown command. Use "tssh help" for usage.', 'warn');
            this.help();
        }
    }
    static help() {
        Logger.log('[TSsh] help() called', 'info');
        console.log(`tssh CLI Help\n\nUsage:\n  tssh TSsh help                Show this help message\n  tssh TSsh installCompletion   Install bash completion script\n\nAll commands use positional arguments only. No Linux-style options.\nSee README.md for first principles.`);
    }
    static installCompletion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const os = (yield import('os')).default;
                const fs = (yield import('fs')).default;
                const path = (yield import('path')).default;
                const home = os.homedir();
                const completionDir = path.join(home, '.local', 'share', 'bash-completion', 'completions');
                Logger.log(`[TSsh] completionDir: ${completionDir}`, 'debug');
                if (!fs.existsSync(completionDir))
                    fs.mkdirSync(completionDir, { recursive: true });
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
                if (!projectRoot)
                    throw new Error('Could not find project root');
                Logger.log(`[TSsh] projectRoot: ${projectRoot}`, 'debug');
                const completionScriptPath = path.join(projectRoot, 'src', 'sh', 'tssh-completion.sh');
                Logger.log(`[TSsh] completionScriptPath: ${completionScriptPath}`, 'debug');
                const completionScript = fs.readFileSync(completionScriptPath, 'utf8');
                const completionFile = ['_tssh', 'completion'].join('_');
                const filePath = path.join(completionDir, completionFile);
                Logger.log(`[TSsh] filePath: ${filePath}`, 'debug');
                fs.writeFileSync(filePath, completionScript, { mode: 0o755 });
                Logger.log(`[TSsh] Completion installed at ${filePath}`, 'info');
            }
            catch (err) {
                Logger.log('[TSsh] installCompletion error: ' + err, 'error');
            }
        });
    }
}
_a = TSsh;
TSsh.cli = new DefaultCLI((args) => {
    Logger.log('[TSsh] dispatch called with: ' + JSON.stringify(args), 'debug');
    return _a.dispatch(args);
});
Logger.log(`[TSsh ENTRY] ${JSON.stringify(process.argv)}`);
TSsh.start();
