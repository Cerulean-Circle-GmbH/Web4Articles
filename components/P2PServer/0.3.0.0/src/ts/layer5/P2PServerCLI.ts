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

  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4 P2PServer CLI Tool${reset} ${green}- Peer-to-Peer Network Capability Component${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}p2pserver${reset} start                                   ${green}# Start P2P server${reset}`);
    console.log(`  ${cyan}p2pserver${reset} stop                                    ${green}# Stop P2P server${reset}`);
    console.log(`  ${cyan}p2pserver${reset} status                                  ${green}# Show server status${reset}`);
    console.log(`  ${cyan}p2pserver${reset} info                                    ${green}# Show server information${reset}`);
    console.log(`  ${cyan}p2pserver${reset} connectPeer ${yellow}<peer-address>${reset}              ${green}# Connect to peer${reset}`);
    console.log(`  ${cyan}p2pserver${reset} disconnectPeer ${yellow}<peer-id>${reset}                ${green}# Disconnect from peer${reset}`);
    console.log(`  ${cyan}p2pserver${reset} listPeers                               ${green}# List connected peers${reset}`);
    console.log(`  ${cyan}p2pserver${reset} sendMessage ${yellow}<peer-id>${reset} ${yellow}<message>${reset}        ${green}# Send message to peer${reset}`);
    console.log(`  ${cyan}p2pserver${reset} help                                    ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}start${reset}            Start P2P server and begin peer discovery`);
    console.log(`  ${bold}stop${reset}             Stop P2P server and disconnect all peers`);
    console.log(`  ${bold}status${reset}           Show current server state and peer connections`);
    console.log(`  ${bold}info${reset}             Show detailed server configuration`);
    console.log(`  ${bold}connectPeer${reset}      Establish connection to remote peer`);
    console.log(`  ${bold}disconnectPeer${reset}   Disconnect from specific peer`);
    console.log(`  ${bold}listPeers${reset}        Show all connected peers`);
    console.log(`  ${bold}sendMessage${reset}      Send message to specific peer`);
    console.log(`  ${bold}help${reset}             Show this help message`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<peer-address>${reset}  Peer network address (e.g., 192.168.1.100:8080)`);
    console.log(`  ${yellow}<peer-id>${reset}       UUID of connected peer`);
    console.log(`  ${yellow}<message>${reset}       Message text to send`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}p2pserver${reset} start                              ${green}# Start P2P server${reset}`);
    console.log(`  ${cyan}p2pserver${reset} connectPeer 192.168.1.100:8080     ${green}# Connect to peer${reset}`);
    console.log(`  ${cyan}p2pserver${reset} listPeers                           ${green}# See connected peers${reset}`);
    console.log(`  ${cyan}p2pserver${reset} sendMessage abc-123 "Hello peer"   ${green}# Send message${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  P2PServer operates as capability component, loaded by ONCE kernel.`);
    console.log(`  Provides peer-to-peer networking for distributed Web4 component communication.`);
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