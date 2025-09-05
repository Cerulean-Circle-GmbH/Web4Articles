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

  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4 WsServer CLI Tool${reset} ${green}- WebSocket Server Capability Component${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}wsserver${reset} start                                     ${green}# Start WebSocket server${reset}`);
    console.log(`  ${cyan}wsserver${reset} stop                                      ${green}# Stop WebSocket server${reset}`);
    console.log(`  ${cyan}wsserver${reset} status                                    ${green}# Show server status${reset}`);
    console.log(`  ${cyan}wsserver${reset} info                                      ${green}# Show server information${reset}`);
    console.log(`  ${cyan}wsserver${reset} listConnections                          ${green}# List active connections${reset}`);
    console.log(`  ${cyan}wsserver${reset} broadcast ${yellow}<message>${reset}                      ${green}# Broadcast to all clients${reset}`);
    console.log(`  ${cyan}wsserver${reset} help                                      ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}start${reset}            Start WebSocket server on configured port`);
    console.log(`  ${bold}stop${reset}             Stop WebSocket server gracefully`);
    console.log(`  ${bold}status${reset}           Show current server state and connections`);
    console.log(`  ${bold}info${reset}             Show detailed server configuration`);
    console.log(`  ${bold}listConnections${reset}  Show all active WebSocket connections`);
    console.log(`  ${bold}broadcast${reset}        Send message to all connected clients`);
    console.log(`  ${bold}help${reset}             Show this help message`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<message>${reset}     Message to broadcast to all clients`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}wsserver${reset} start                     ${green}# Start WebSocket server${reset}`);
    console.log(`  ${cyan}wsserver${reset} listConnections           ${green}# See active connections${reset}`);
    console.log(`  ${cyan}wsserver${reset} broadcast "Hello clients" ${green}# Send message to all${reset}`);
    console.log(`  ${cyan}wsserver${reset} status                    ${green}# Check server status${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  WsServer operates as capability component, loaded by ONCE kernel.`);
    console.log(`  Provides real-time WebSocket communication for Web4 component ecosystem.`);
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
      console.error(`❌ WsServer CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

async function main() {
  try {
    const cli = new WsServerCLI();
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ WsServer CLI Fatal Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}