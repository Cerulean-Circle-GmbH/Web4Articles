#!/usr/bin/env node

/**
 * WsServerCLI - WsServer component CLI implementation
 */

import { DefaultCLI } from '../../../../IOR/0.3.0.0/src/ts/layer5/DefaultCLI.js';
import { DefaultWsServer } from '../layer2/DefaultWsServer.js';

class WsServerCLI {
  private cli: DefaultCLI;
  private wsServer: DefaultWsServer;

  constructor() {
    this.wsServer = new DefaultWsServer();
    this.cli = DefaultCLI.createForComponent(this.wsServer, 'WsServer');
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
      console.error(`❌ WsServer CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  // Static entry point for CLI (Radical OOP pattern)
  static async start(args: string[] = []): Promise<void> {
    try {
      const cli = new WsServerCLI();
      await cli.run(args);
    } catch (error) {
      console.error(`❌ WsServer CLI Fatal Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  WsServerCLI.start(process.argv.slice(2));
}