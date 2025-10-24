/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

#!/usr/bin/env node
/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */


/**
 * Web4TSComponentCLI - Web4TSComponent CLI implementation with auto-discovery
 * Web4 pattern: Auto-discovery CLI with chaining support
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';

export class Web4TSComponentCLI extends DefaultCLI {
  private component: DefaultWeb4TSComponent | null;

  constructor() {
    super();
    this.component = null;
    this.initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', '0.3.2.0');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4TSComponentCLI();
    await cli.execute(args);
  }

  private getOrCreateComponent(): DefaultWeb4TSComponent {
    if (!this.component) {
      this.component = this.getComponentInstance() as DefaultWeb4TSComponent;
    }
    return this.component;
  }

  /**
   * Web4TSComponent-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    console.log(this.generateStructuredUsage());
  }

  /**
   * Execute CLI commands with auto-discovery
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      // Try dynamic command execution
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return;
      }

      // Special cases
      switch (command) {
        case 'help':
          this.showUsage();
          break;
          
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(this.formatError((error as Error).message));
      process.exit(1);
    }
  }
}

// Static entry point for shell execution
if (import.meta.url === `file://${process.argv[1]}`) {
  Web4TSComponentCLI.start(process.argv.slice(2));
}
