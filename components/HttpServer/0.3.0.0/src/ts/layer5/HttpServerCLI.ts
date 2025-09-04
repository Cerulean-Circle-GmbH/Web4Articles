#!/usr/bin/env node

/**
 * HttpServerCLI - HttpServer component CLI implementation
 * 
 * Web4 pattern: Uses universal CLI implementation with command delegation
 * Following requirement-v0.1.2.2 colorful usage display pattern
 */

import { DefaultCLI } from '../../../../IOR/0.3.0.0/dist/ts/layer5/DefaultCLI.js';
import { DefaultHttpServer } from '../layer2/DefaultHttpServer.js';

class HttpServerCLI {
  private cli: DefaultCLI;
  private httpServer: DefaultHttpServer;

  constructor() {
    this.httpServer = new DefaultHttpServer();
    this.cli = DefaultCLI.createForComponent(this.httpServer, 'HttpServer');
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
      console.error(`❌ HttpServer CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  // Static entry point for CLI (Radical OOP pattern)
  static async start(args: string[] = []): Promise<void> {
    try {
      const cli = new HttpServerCLI();
      await cli.run(args);
    } catch (error) {
      console.error(`❌ HttpServer CLI Fatal Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  HttpServerCLI.start(process.argv.slice(2));
}