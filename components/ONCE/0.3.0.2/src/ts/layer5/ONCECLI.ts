#!/usr/bin/env node

/**
 * ONCECLI - ONCE component CLI implementation
 * 
 * Web4 pattern: Uses universal CLI implementation with command delegation
 * Commands delegate to same-named methods in DefaultONCE implementation
 * Following TSRanger 2.2 pattern but simplified
 */

import { CLI } from '../../../../IOR/0.3.0.3/dist/ts/layer3/CLI.interface.js';
import { DefaultCLI } from '../../../../IOR/0.3.0.3/dist/ts/layer5/DefaultCLI.js';
import { DefaultONCE } from '../layer2/DefaultONCE.js';

class ONCECLI {
  private cli: DefaultCLI;
  private once: DefaultONCE;

  /**
   * Web4 Pattern: Empty constructor + initialization
   */
  constructor() {
    this.once = new DefaultONCE();
    this.cli = DefaultCLI.createForComponent(this.once, 'ONCE');
  }

  /**
   * Show colorful usage display following requirement-v0.1.2.2 pattern
   */
  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4 ONCE CLI Tool${reset} ${green}- Object Network Communication Engine${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}once${reset} start                                        ${green}# Start ONCE kernel${reset}`);
    console.log(`  ${cyan}once${reset} stop                                         ${green}# Stop ONCE kernel${reset}`);
    console.log(`  ${cyan}once${reset} status                                       ${green}# Show kernel status${reset}`);
    console.log(`  ${cyan}once${reset} info                                         ${green}# Show kernel information${reset}`);
    console.log(`  ${cyan}once${reset} deinstall                                    ${green}# Clean all components${reset}`);
    console.log(`  ${cyan}once${reset} boot                                         ${green}# Boot environment${reset}`);
    console.log(`  ${cyan}once${reset} load ${yellow}<component>${reset}                            ${green}# Load component by name${reset}`);
    console.log(`  ${cyan}once${reset} unload ${yellow}<uuid>${reset}                               ${green}# Unload component by UUID${reset}`);
    console.log(`  ${cyan}once${reset} list                                         ${green}# List loaded components${reset}`);
    console.log(`  ${cyan}once${reset} help                                         ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}start${reset}        Start ONCE kernel and boot environment`);
    console.log(`  ${bold}stop${reset}         Stop ONCE kernel and all loaded components`);
    console.log(`  ${bold}status${reset}       Display current kernel state and loaded components`);
    console.log(`  ${bold}info${reset}         Show detailed ONCE kernel information`);
    console.log(`  ${bold}deinstall${reset}    Clean all Web4 components and force rebuild`);
    console.log(`  ${bold}boot${reset}         Boot environment and detect capabilities`);
    console.log(`  ${bold}load${reset}         Load and initialize component by name`);
    console.log(`  ${bold}unload${reset}       Unload component by UUID`);
    console.log(`  ${bold}list${reset}         List all currently loaded components`);
    console.log(`  ${bold}help${reset}         Show this help message`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<component>${reset}   Component name (e.g., HttpServer, WsServer, P2PServer)`);
    console.log(`  ${yellow}<uuid>${reset}        36-character UUID of loaded component`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}once${reset} start                    ${green}# Start ONCE kernel${reset}`);
    console.log(`  ${cyan}once${reset} load HttpServer          ${green}# Load HTTP server capability${reset}`);
    console.log(`  ${cyan}once${reset} load WsServer            ${green}# Load WebSocket server capability${reset}`);
    console.log(`  ${cyan}once${reset} list                     ${green}# See all loaded components${reset}`);
    console.log(`  ${cyan}once${reset} status                   ${green}# Check kernel status${reset}`);
    console.log(`  ${cyan}once${reset} deinstall                ${green}# Clean all components and reset${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  ONCE operates as Web4 component kernel, loading capability components as services.`);
    console.log(`  All components follow Web4 UCP patterns with scenario configuration.`);
    console.log('');
  }

  /**
   * Run CLI with command line arguments
   */
  async run(args: string[]): Promise<void> {
    // Show usage if no arguments provided (following requirement-v0.1.2.2 pattern)
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      await this.cli.execute(command, commandArgs);
    } catch (error) {
      console.error(`❌ ONCE CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// CLI entry point
async function main() {
  try {
    const cli = new ONCECLI();
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ ONCE CLI Fatal Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Execute if called directly
// Radical OOP: Static start method only