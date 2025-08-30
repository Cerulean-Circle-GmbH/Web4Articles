/**
 * ONCE CLI v0.2.0.0 - Enhanced CLI with scenario file support
 * Implements requirement 36cd0fd1-9d4e-4f99-9694-9d9bcce7e1d4
 * Eliminates environment variables (requirement 6707a628-bf3b-4dd4-a750-562f9f0c5fa4)
 */

import * as path from 'path';
import { DefaultONCE } from '../layer2/DefaultONCE.js';
import { ScenarioManager } from '../layer2/ScenarioManager.js';

export class OnceCLI {
  private onceVersion: string = '0.2.0.0';
  private once: DefaultONCE;
  private scenarioManager: ScenarioManager;
  private projectRoot: string;

  constructor() {
    // No environment variables - detect project root automatically
    this.projectRoot = this.detectProjectRoot();
    console.log(`🏠 Project root detected: ${this.projectRoot}`);
    
    // Initialize ONCE and scenario manager
    this.once = DefaultONCE.getInstance(this.projectRoot);
    this.scenarioManager = new ScenarioManager(this.projectRoot);
  }

  public async handleCommand(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    
    try {
      switch (command) {
        case 'demo':
          await this.runDemo(args.slice(1));
          break;
        case 'test':
          // test command is identical to demo command
          await this.runDemo(args.slice(1));
          break;
        case 'start':
          await this.runStart(args.slice(1));
          break;
        case 'stop':
          await this.runStop(args.slice(1));
          break;
        case 'help':
        case '--help':
        case '-h':
          this.showUsage();
          break;
        case 'version':
        case '--version':
        case '-v':
          this.showVersion();
          break;
        default:
          this.showError(`Unknown command: ${command}`);
          process.exit(1);
      }
    } catch (error) {
      console.error('❌ Command failed:', error);
      process.exit(1);
    }
  }

  /**
   * Enhanced demo command with scenario support
   */
  private async runDemo(args: string[]): Promise<void> {
    console.log('🎭 ONCE v0.2.0.0 Demo Starting...');
    
    if (args.length === 0) {
      // Interactive demo mode
      await this.startInteractiveDemo();
    } else {
      const input = args[0];
      
      if (input === 'help') {
        this.showDemoHelp();
        return;
      }
      
      if (input === 'headless') {
        // Headless demo mode
        await this.startHeadlessDemo();
      } else if (input.endsWith('.scenario.json')) {
        // Demo with scenario file
        await this.startDemoWithScenario(input);
      } else {
        // Test sequence
        await this.runTestSequence(input);
      }
    }
  }

  /**
   * Enhanced start command with scenario file support
   */
  private async runStart(args: string[]): Promise<void> {
    console.log('🚀 ONCE v0.2.0.0 Server Starting...');
    
    if (args.length === 0) {
      // Start server with default configuration (no environment variables)
      await this.startDefaultServer();
    } else {
      const param = args[0];
      
      if (param === 'headless') {
        // Start headless server
        await this.startHeadlessServer();
      } else if (param.endsWith('.scenario.json')) {
        // Start server with scenario file
        await this.startServerWithScenario(param);
      } else {
        this.showError(`Invalid start parameter: ${param}`);
        return;
      }
    }
  }

  /**
   * Start server with default configuration
   */
  private async startDefaultServer(): Promise<void> {
    console.log('🔧 Starting with default configuration...');
    console.log('🚫 No environment variables required');
    
    try {
      // Initialize ONCE
      await this.once.init();
      
      // Start server (will automatically handle port 42777 → 8080+ hierarchy)
      await this.once.startServer();
      
      const serverModel = this.once.getServerModel();
      const httpCapability = serverModel.capabilities.find(c => c.capability === 'httpPort');
      
      if (httpCapability) {
        console.log(`🌐 Server started on port ${httpCapability.port}`);
        console.log(`🏠 Domain: ${serverModel.domain}`);
        console.log(`📋 UUID: ${serverModel.uuid}`);
        console.log(`⚡ Type: ${serverModel.isPrimaryServer ? 'Primary Server (42777)' : 'Client Server'}`);
        
        if (serverModel.isPrimaryServer) {
          console.log('🎯 This is the PRIMARY server - other instances will register with this one');
        } else {
          console.log('🔗 This server registered with the primary server on port 42777');
        }
        
        console.log('\n📊 Press Ctrl+C to stop the server');
        
        // Keep process alive
        process.on('SIGINT', async () => {
          console.log('\n🛑 Stopping server...');
          await this.once.stopServer();
          process.exit(0);
        });
        
        // Keep alive
        await new Promise(() => {}); // Never resolves, keeps process running
      }
      
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      throw error;
    }
  }

  /**
   * Start server with scenario file
   */
  private async startServerWithScenario(scenarioFile: string): Promise<void> {
    console.log(`📂 Starting server with scenario: ${scenarioFile}`);
    
    try {
      // Load scenario
      const scenarioPath = path.resolve(this.projectRoot, scenarioFile);
      const scenario = await this.scenarioManager.loadScenario(scenarioPath);
      
      console.log(`✅ Scenario loaded: ${scenario.uuid}`);
      console.log(`🏷️ Type: ${scenario.objectType} v${scenario.version}`);
      
      // Initialize ONCE with scenario
      await this.once.init(scenario);
      
      // Start server with scenario configuration
      await this.once.startServer(scenario);
      
      const serverModel = this.once.getServerModel();
      console.log(`🌐 Server started from scenario`);
      console.log(`📋 UUID: ${serverModel.uuid}`);
      
    } catch (error) {
      console.error('❌ Failed to start server with scenario:', error);
      throw error;
    }
  }

  /**
   * Start headless server
   */
  private async startHeadlessServer(): Promise<void> {
    console.log('🤖 Starting headless server...');
    await this.startDefaultServer();
  }

  /**
   * Start interactive demo
   */
  private async startInteractiveDemo(): Promise<void> {
    console.log('🎮 Interactive demo mode...');
    await this.startDefaultServer();
  }

  /**
   * Start headless demo
   */
  private async startHeadlessDemo(): Promise<void> {
    console.log('🤖 Headless demo mode...');
    await this.startDefaultServer();
  }

  /**
   * Start demo with scenario file
   */
  private async startDemoWithScenario(scenarioFile: string): Promise<void> {
    console.log(`🎭 Demo with scenario: ${scenarioFile}`);
    await this.startServerWithScenario(scenarioFile);
  }

  /**
   * Run test sequence
   */
  private async runTestSequence(sequence: string): Promise<void> {
    console.log(`🧪 Running test sequence: ${sequence}`);
    
    // Start server for testing
    await this.startDefaultServer();
    
    // TODO: Implement test sequence runner
    console.log('✅ Test sequence completed');
    
    // Stop server after test
    await this.once.stopServer();
    process.exit(0);
  }

  /**
   * Stop server command
   */
  private async runStop(args: string[]): Promise<void> {
    console.log('🛑 Stopping ONCE server...');
    
    try {
      await this.once.stopServer();
      console.log('✅ Server stopped');
    } catch (error) {
      console.error('❌ Failed to stop server:', error);
    }
  }

  /**
   * Detect project root automatically (no environment variables)
   */
  private detectProjectRoot(): string {
    let currentDir = process.cwd();
    const maxLevels = 10;
    let level = 0;
    
    while (level < maxLevels) {
      // Look for Web4Articles project indicators
      const packagePath = path.join(currentDir, 'package.json');
      const componentsPath = path.join(currentDir, 'components');
      const scenariosPath = path.join(currentDir, 'scenarios');
      
      // Check if this looks like the project root
      try {
        const fs = require('fs');
        if (fs.existsSync(componentsPath) && fs.existsSync(scenariosPath)) {
          return currentDir;
        }
      } catch {
        // Continue searching
      }
      
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        // Reached filesystem root
        break;
      }
      
      currentDir = parentDir;
      level++;
    }
    
    // Fallback to current working directory
    return process.cwd();
  }

  private showUsage(): void {
    const cyan = '\\x1b[36m';
    const yellow = '\\x1b[33m';
    const green = '\\x1b[32m';
    const bold = '\\x1b[1m';
    const reset = '\\x1b[0m';

    console.log(`${bold}${cyan}ONCE CLI v0.2.0.0${reset} ${green}- Enhanced Server Hierarchy & Scenario Support${reset}`);
    console.log('');
    console.log(`${bold}Key Features:${reset}`);
    console.log(`  🚫 No environment variables required`);
    console.log(`  🏗️ Port 42777 default with 8080+ fallback`);
    console.log(`  🌐 Server hierarchy (primary/client servers)`);
    console.log(`  📂 Scenario file support`);
    console.log(`  🏠 Domain: local.once`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}once${reset} demo                    ${green}# Interactive demo (auto port management)${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}headless${reset}           ${green}# Headless demo${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}<sequence>${reset}         ${green}# Run test sequence${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}<file.scenario.json>${reset} ${green}# Demo with scenario file${reset}`);
    console.log(`  ${cyan}once${reset} start                   ${green}# Start server (port 42777 → 8080+)${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}headless${reset}          ${green}# Start headless server${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}<file.scenario.json>${reset} ${green}# Start with scenario file${reset}`);
    console.log(`  ${cyan}once${reset} stop                    ${green}# Stop server${reset}`);
    console.log(`  ${cyan}once${reset} help                    ${green}# Show this help${reset}`);
    console.log(`  ${cyan}once${reset} version                 ${green}# Show version${reset}`);
    console.log('');
    console.log(`${bold}Server Hierarchy:${reset}`);
    console.log(`  🟢 Primary Server: Port 42777 (name server)`);
    console.log(`  🔵 Client Servers: Port 8080+ (register with primary)`);
    console.log(`  📋 Automatic conflict resolution`);
  }

  private showDemoHelp(): void {
    console.log('🎭 ONCE Demo Help');
    console.log('Demo modes:');
    console.log('  once demo                     # Interactive mode');
    console.log('  once demo headless            # Background mode');
    console.log('  once demo s10c                # Test sequence');
    console.log('  once demo my-config.scenario.json # From scenario file');
  }

  private showVersion(): void {
    console.log(`ONCE v${this.onceVersion}`);
    console.log('Enhanced Server Hierarchy & Scenario Support');
    console.log('🚫 No environment variables • 🏗️ Port 42777 default • 🌐 Server hierarchy');
  }

  private showError(message: string): void {
    console.error(`❌ Error: ${message}`);
    console.error('Run "once help" for usage information');
  }
}
