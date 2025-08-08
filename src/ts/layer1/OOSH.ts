// Suppress all Node.js warnings (including experimental and deprecation)
process.env.NODE_NO_WARNINGS = '1';
// OOSH.ts: Strict OOP CLI class for Web4Articles

import { Logger } from './Logger.ts';
import { ParameterParser } from './ParameterParser.ts';
import { DefaultCLI } from '../layer2/DefaultCLI.ts';

export class OOSH {
  private static cli = new DefaultCLI((args: string[]) => this.dispatch(args));

  static start(): void {
    this.cli.start();
  }

  private static dispatch(args: string[]): void {
    const parser = new ParameterParser(args);
    const { command, projectName } = parser.parse();
    if (!command || command === 'help') {
      this.help();
    } else if (command === 'create') {
      this.create(projectName ?? '');
    } else {
      Logger.log('Unknown command. Use "oosh help" for usage.');
      this.help();
    }
  }

  static help(): void {
    Logger.log('[OOSH] help() called');
    console.log(`Web4Articles CLI Help\n\nUsage:\n  oosh OOSH help                Show this help message\n  oosh OOSH create <Project>    Create a new project as submodule\n\nAll commands use positional arguments only. No Linux-style options.\nSee README.md for first principles.`);
  }

  static create(projectName: string = ''): void {
    // Placeholder create method to expose method for completion; real behavior lives in GitScrumProject
    Logger.log(`[OOSH] create called for project: ${projectName || '<unset>'}`, 'info');
  }

}
Logger.log(`[OOSH ENTRY] ${JSON.stringify(process.argv)}`);
OOSH.start();
