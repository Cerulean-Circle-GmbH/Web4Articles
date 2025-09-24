#!/usr/bin/env node

/**
 * P2PServerCLI - P2PServer component CLI implementation
 */

import { DefaultCLI } from '../../../../IOR/0.3.0.0/src/ts/layer5/DefaultCLI.js';
import { DefaultP2PServer } from '../layer2/DefaultP2PServer.js';

class P2PServerCLI {
  private cli: DefaultCLI;
  private p2pServer: DefaultP2PServer;

  constructor() {
    this.p2pServer = new DefaultP2PServer();
    this.cli = DefaultCLI.createForComponent(this.p2pServer, 'P2PServer');
  }

  // Removed: Custom showUsage() method - using DefaultCLI.help() instead  
  // Decision 2a: Direct replacement with DefaultCLI methods for DRY compliance

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      // Decision 2a: Use DefaultCLI.help() instead of custom showUsage()
      await this.cli.help([]);
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      await this.cli.execute(command, commandArgs);
    } catch (error) {
      console.error(`❌ P2PServer CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  // Static entry point for CLI (Radical OOP pattern)
  static async start(args: string[] = []): Promise<void> {
    try {
      const cli = new P2PServerCLI();
      await cli.run(args);
    } catch (error) {
      console.error(`❌ P2PServer CLI Fatal Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  P2PServerCLI.start(process.argv.slice(2));
}