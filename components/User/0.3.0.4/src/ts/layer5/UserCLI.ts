#!/usr/bin/env node

/**
 * UserCLI - User component CLI implementation
 * 
 * Web4 pattern: Dependency-free CLI with scenario save/load
 * Following ONCECLI pattern but simplified for User component
 */

import { DefaultUser } from '../layer2/DefaultUser.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { promises as fs } from 'fs';
import { join } from 'path';

class UserCLI {
  private user: DefaultUser;

  /**
   * Web4 Pattern: Empty constructor + initialization
   */
  constructor() {
    this.user = new DefaultUser();
  }

  /**
   * Show colorful usage display following ONCECLI pattern
   */
  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4 User CLI Tool${reset} ${green}- User Component Management${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}user${reset} create ${yellow}<username>${reset} [hostname]                ${green}# Create user scenario${reset}`);
    console.log(`  ${cyan}user${reset} save ${yellow}<filename>${reset}                             ${green}# Save current user scenario${reset}`);
    console.log(`  ${cyan}user${reset} load ${yellow}<filename>${reset}                             ${green}# Load user scenario${reset}`);
    console.log(`  ${cyan}user${reset} info                                        ${green}# Show current user info${reset}`);
    console.log(`  ${cyan}user${reset} help                                        ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}create${reset}       Create new user with username and optional hostname`);
    console.log(`  ${bold}save${reset}         Save current user scenario to JSON file`);
    console.log(`  ${bold}load${reset}         Load user scenario from JSON file`);
    console.log(`  ${bold}info${reset}         Display current user information and scenario`);
    console.log(`  ${bold}help${reset}         Show this help message`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<username>${reset}    Username for the user (required for create)`);
    console.log(`  ${yellow}<hostname>${reset}    Hostname (optional, defaults to localhost)`);
    console.log(`  ${yellow}<filename>${reset}    JSON file path for save/load operations`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}user${reset} create john                    ${green}# Create user 'john' on localhost${reset}`);
    console.log(`  ${cyan}user${reset} create alice server.com        ${green}# Create user 'alice' on server.com${reset}`);
    console.log(`  ${cyan}user${reset} save user-scenario.json        ${green}# Save to file${reset}`);
    console.log(`  ${cyan}user${reset} load user-scenario.json        ${green}# Load from file${reset}`);
    console.log(`  ${cyan}user${reset} info                           ${green}# Show current user details${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  User operates as Web4 component with scenario-based hibernation.`);
    console.log(`  All scenarios follow Web4 IOR pattern with owner audit trail.`);
    console.log('');
  }

  /**
   * Create new user scenario
   */
  private async createUser(username: string, hostname: string = 'localhost'): Promise<void> {
    // Update user data
    const userData = {
      uuid: crypto.randomUUID(),
      username,
      hostname,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create scenario with proper owner
    const ownerData = await this.user.generateOwnerData({
      user: username,
      hostname,
      uuid: userData.uuid
    });

    const scenario: Scenario = {
      ior: {
        uuid: userData.uuid,
        component: 'User',
        version: '0.3.0.4'
      },
      owner: ownerData,
      model: userData
    };

    // Initialize user with scenario
    this.user.init(scenario);

    console.log(`✅ User created: ${username}@${hostname}`);
    console.log(`   UUID: ${userData.uuid}`);
    console.log(`   Created: ${userData.createdAt}`);
  }

  /**
   * Save current user scenario to file
   */
  private async saveScenario(filename: string): Promise<void> {
    try {
      const scenario = await this.user.toScenario();
      const scenarioJson = JSON.stringify(scenario, null, 2);
      
      await fs.writeFile(filename, scenarioJson, 'utf8');
      console.log(`✅ User scenario saved to: ${filename}`);
      console.log(`   User: ${scenario.model.username}@${scenario.model.hostname}`);
      console.log(`   UUID: ${scenario.ior.uuid}`);
    } catch (error) {
      throw new Error(`Failed to save scenario: ${(error as Error).message}`);
    }
  }

  /**
   * Load user scenario from file
   */
  private async loadScenario(filename: string): Promise<void> {
    try {
      const scenarioJson = await fs.readFile(filename, 'utf8');
      const scenario: Scenario = JSON.parse(scenarioJson);
      
      this.user.init(scenario);
      console.log(`✅ User scenario loaded from: ${filename}`);
      console.log(`   User: ${scenario.model.username}@${scenario.model.hostname}`);
      console.log(`   UUID: ${scenario.ior.uuid}`);
      console.log(`   Created: ${scenario.model.createdAt}`);
    } catch (error) {
      throw new Error(`Failed to load scenario: ${(error as Error).message}`);
    }
  }

  /**
   * Show current user information
   */
  private async showInfo(): Promise<void> {
    const scenario = await this.user.toScenario();
    
    console.log(`${'\x1b[36m'}Current User Information:${'\x1b[0m'}`);
    console.log(`  Username: ${scenario.model.username}`);
    console.log(`  Hostname: ${scenario.model.hostname}`);
    console.log(`  UUID: ${scenario.ior.uuid}`);
    console.log(`  Component: ${scenario.ior.component} v${scenario.ior.version}`);
    console.log(`  Created: ${scenario.model.createdAt}`);
    console.log(`  Updated: ${scenario.model.updatedAt}`);
    
    if (scenario.owner) {
      console.log(`  Owner: ${scenario.owner.slice(0, 100)}...`);
    }
  }

  /**
   * Run CLI with command line arguments
   */
  async run(args: string[]): Promise<void> {
    // Show usage if no arguments provided
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      switch (command) {
        case 'create':
          if (commandArgs.length === 0) {
            throw new Error('Username required for create command');
          }
          await this.createUser(commandArgs[0], commandArgs[1]);
          break;

        case 'save':
          if (commandArgs.length === 0) {
            throw new Error('Filename required for save command');
          }
          await this.saveScenario(commandArgs[0]);
          break;

        case 'load':
          if (commandArgs.length === 0) {
            throw new Error('Filename required for load command');
          }
          await this.loadScenario(commandArgs[0]);
          break;

        case 'info':
          await this.showInfo();
          break;

        case 'help':
          this.showUsage();
          break;

        default:
          throw new Error(`Unknown command: ${command}`);
      }
    } catch (error) {
      console.error(`❌ User CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// CLI entry point
async function main() {
  try {
    const cli = new UserCLI();
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ User CLI Fatal Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}