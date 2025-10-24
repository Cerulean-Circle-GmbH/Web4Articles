/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { DefaultONCE } from '../layer2/DefaultONCE.js';

export class ONCECLI {
  private once: DefaultONCE;

  constructor() {
    this.once = new DefaultONCE();
  }

  async run(args: string[]): Promise<void> {
    const command = args[0] || 'help';
    
    switch (command) {
      case 'start':
        await this.once.start(args.slice(1));
        break;
      case 'stop':
        await this.once.stop(args.slice(1));
        break;
      case 'status':
        await this.once.status(args.slice(1));
        break;
      case 'info':
        await this.once.info(args.slice(1));
        break;
      case 'help':
        await this.once.help(args.slice(1));
        break;
      case 'demo':
        await this.once.demo(args.slice(1));
        break;
      case 'test':
        await this.once.test(args.slice(1));
        break;
      case 'deinstall':
        await this.once.deinstall(args.slice(1));
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        await this.once.help();
    }
  }

  // Static entry point for CLI (Radical OOP pattern)
  static async start(args: string[] = []): Promise<void> {
    try {
      const cli = new ONCECLI();
      await cli.run(args);
    } catch (error) {
      console.error(`❌ ONCE CLI Fatal Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  ONCECLI.start(process.argv.slice(2));
}