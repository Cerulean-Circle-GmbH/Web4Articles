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

  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4 HttpServer CLI Tool${reset} ${green}- HTTP Server Capability Component${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}httpserver${reset} start                                   ${green}# Start HTTP server${reset}`);
    console.log(`  ${cyan}httpserver${reset} stop                                    ${green}# Stop HTTP server${reset}`);
    console.log(`  ${cyan}httpserver${reset} status                                  ${green}# Show server status${reset}`);
    console.log(`  ${cyan}httpserver${reset} info                                    ${green}# Show server information${reset}`);
    console.log(`  ${cyan}httpserver${reset} addRoute ${yellow}<method>${reset} ${yellow}<path>${reset}               ${green}# Add HTTP route${reset}`);
    console.log(`  ${cyan}httpserver${reset} removeRoute ${yellow}<path>${reset}                     ${green}# Remove HTTP route${reset}`);
    console.log(`  ${cyan}httpserver${reset} listRoutes                              ${green}# List all routes${reset}`);
    console.log(`  ${cyan}httpserver${reset} help                                    ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}start${reset}          Start HTTP server on configured port`);
    console.log(`  ${bold}stop${reset}           Stop HTTP server gracefully`);
    console.log(`  ${bold}status${reset}         Show current server state and connections`);
    console.log(`  ${bold}info${reset}           Show detailed server configuration`);
    console.log(`  ${bold}addRoute${reset}       Add new HTTP route handler`);
    console.log(`  ${bold}removeRoute${reset}    Remove existing HTTP route`);
    console.log(`  ${bold}listRoutes${reset}     List all configured routes`);
    console.log(`  ${bold}help${reset}           Show this help message`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<method>${reset}      HTTP method (GET, POST, PUT, DELETE, PATCH)`);
    console.log(`  ${yellow}<path>${reset}        Route path (e.g., /api/users, /health)`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}httpserver${reset} start                   ${green}# Start HTTP server${reset}`);
    console.log(`  ${cyan}httpserver${reset} addRoute GET /health    ${green}# Add health check route${reset}`);
    console.log(`  ${cyan}httpserver${reset} listRoutes              ${green}# See all routes${reset}`);
    console.log(`  ${cyan}httpserver${reset} status                  ${green}# Check server status${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  HttpServer operates as capability component, loaded by ONCE kernel.`);
    console.log(`  Routes reference other components via IOR for distributed architecture.`);
    console.log('');
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
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