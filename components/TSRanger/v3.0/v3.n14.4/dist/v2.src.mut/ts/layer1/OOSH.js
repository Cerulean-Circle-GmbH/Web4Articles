var _a;
// Suppress all Node.js warnings (including experimental and deprecation)
process.env.NODE_NO_WARNINGS = '1';
// OOSH.ts: Strict OOP CLI class for Web4Articles
import { Logger } from './Logger';
import { ParameterParser } from './ParameterParser';
import { DefaultCLI } from '../layer2/DefaultCLI';
export class OOSH {
    static start() {
        this.cli.start();
    }
    static dispatch(args) {
        const parser = new ParameterParser(args);
        const { command, projectName } = parser.parse();
        if (!command || command === 'help') {
            this.help();
        }
        else if (command === 'create') {
            this.create(projectName !== null && projectName !== void 0 ? projectName : '');
        }
        else {
            Logger.log('Unknown command. Use "oosh help" for usage.');
            this.help();
        }
    }
    static help() {
        Logger.log('[OOSH] help() called');
        console.log(`Web4Articles CLI Help\n\nUsage:\n  oosh OOSH help                Show this help message\n  oosh OOSH create <Project>    Create a new project as submodule\n\nAll commands use positional arguments only. No Linux-style options.\nSee README.md for first principles.`);
    }
    static create(projectName = '') {
        // Placeholder create method to expose method for completion; real behavior lives in GitScrumProject
        Logger.log(`[OOSH] create called for project: ${projectName || '<unset>'}`, 'info');
    }
}
_a = OOSH;
OOSH.cli = new DefaultCLI((args) => _a.dispatch(args));
Logger.log(`[OOSH ENTRY] ${JSON.stringify(process.argv)}`);
OOSH.start();
