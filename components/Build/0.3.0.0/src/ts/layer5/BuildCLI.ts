#!/usr/bin/env node

/**
 * BuildCLI - Build component CLI implementation
 * 
 * Web4 pattern: Uses universal CLI implementation with command delegation
 * Following requirement-v0.1.2.2 colorful usage display pattern
 */

import { DefaultCLI } from '../../../../IOR/0.3.0.0/src/ts/layer5/DefaultCLI.js';
import { DefaultBuild } from '../layer2/DefaultBuild.js';

class BuildCLI {
  private cli: DefaultCLI;
  private build: DefaultBuild;

  constructor() {
    this.build = new DefaultBuild();
    this.cli = DefaultCLI.createForComponent(this.build, 'Build');
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
    
    console.log(`${bold}${cyan}Web4 Build CLI Tool${reset} ${green}- Component Build and Dependency Management${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}build${reset} checkEnvironment                              ${green}# Check node/npm availability${reset}`);
    console.log(`  ${cyan}build${reset} installEnvironment                           ${green}# Install missing tools${reset}`);
    console.log(`  ${cyan}build${reset} buildComponent ${yellow}<component>${reset}                  ${green}# Build single component${reset}`);
    console.log(`  ${cyan}build${reset} buildAll                                     ${green}# Build all components${reset}`);
    console.log(`  ${cyan}build${reset} resolveDependencies ${yellow}<component>${reset}             ${green}# Show component dependencies${reset}`);
    console.log(`  ${cyan}build${reset} status                                       ${green}# Show build status${reset}`);
    console.log(`  ${cyan}build${reset} info                                         ${green}# Show build information${reset}`);
    console.log(`  ${cyan}build${reset} help                                         ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}checkEnvironment${reset}     Check if node and npm are available`);
    console.log(`  ${bold}installEnvironment${reset}   Install missing node/npm (worst case)`);
    console.log(`  ${bold}buildComponent${reset}       Build specific component with dependencies`);
    console.log(`  ${bold}buildAll${reset}             Build all components in correct order`);
    console.log(`  ${bold}resolveDependencies${reset}  Show component dependency tree`);
    console.log(`  ${bold}status${reset}               Show current build state`);
    console.log(`  ${bold}info${reset}                 Show build manager information`);
    console.log(`  ${bold}help${reset}                 Show this help message`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<component>${reset}   Component name (e.g., ONCE, HttpServer, WsServer)`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}build${reset} checkEnvironment          ${green}# Verify build environment${reset}`);
    console.log(`  ${cyan}build${reset} buildComponent ONCE      ${green}# Build ONCE component${reset}`);
    console.log(`  ${cyan}build${reset} buildAll                 ${green}# Build entire ecosystem${reset}`);
    console.log(`  ${cyan}build${reset} status                   ${green}# Check build progress${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  Build component manages dependency resolution and environment setup for Web4 ecosystem.`);
    console.log(`  Provides foundation for component development with automated build orchestration.`);
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
      console.error(`❌ Build CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  // Static entry point for CLI (Radical OOP pattern)
  static async start(args: string[] = []): Promise<void> {
    try {
      const cli = new BuildCLI();
      await cli.run(args);
    } catch (error) {
      console.error(`❌ Build CLI Fatal Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  BuildCLI.start(process.argv.slice(2));
}