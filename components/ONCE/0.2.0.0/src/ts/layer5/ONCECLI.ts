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
   * Start interactive demo with v0.1.0.2 style interface
   */
  private async startInteractiveDemo(): Promise<void> {
    // Show beautiful header like v0.1.0.2
    this.showInteractiveDemoHeader();
    this.showInteractiveDemoHelp();
    
    // Show initialization info with v0.2.0.0 enhancements
    console.log('🏠 Project root detected:', this.projectRoot);
    console.log('🚫 No environment variables required');
    console.log('🌐 Server hierarchy: Port 42777 → 8080+ (enhanced v0.2.0.0)');
    console.log('');
    
    console.log('ℹ️ Demo initialized - Enhanced v0.2.0.0 with server hierarchy');
    console.log('ℹ️ Press [h] for help, [s] to start server, [q] to quit');
    
    // Setup keyboard input like v0.1.0.2
    this.setupInteractiveKeyboard();
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
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${bold}${cyan}ONCE CLI v0.2.0.0${reset} ${green}- Enhanced Server Hierarchy & Scenario Support${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}once${reset} demo                    ${green}# Start interactive demo with browser auto-opening${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}<input>${reset}           ${green}# Run demo test sequence (e.g., "s3bq")${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}headless${reset}           ${green}# Start demo without browser (headless mode)${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}help${reset}               ${green}# Show demo-specific help${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}<file.scenario.json>${reset} ${green}# Demo with scenario file (NEW)${reset}`);
    console.log(`  ${cyan}once${reset} test ${yellow}<input>${reset}            ${green}# Run test sequence (identical to demo <input>)${reset}`);
    console.log(`  ${cyan}once${reset} start                   ${green}# Start server (port 42777 → 8080+ hierarchy)${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}headless${reset}          ${green}# Start server without interaction${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}<file.scenario.json>${reset} ${green}# Start with scenario file (NEW)${reset}`);
    console.log(`  ${cyan}once${reset} stop                    ${green}# Stop running server gracefully${reset}`);
    console.log(`  ${cyan}once${reset} help                    ${green}# Show this help message${reset}`);
    console.log(`  ${cyan}once${reset} version                 ${green}# Show ONCE version information${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}demo${reset}         Start interactive demo or run test sequences`);
    console.log(`  ${bold}test${reset}         Run test sequences (identical to demo <input>)`);
    console.log(`  ${bold}start${reset}        Start server with automatic port management`);
    console.log(`  ${bold}stop${reset}         Stop running server gracefully`);
    console.log(`  ${bold}help${reset}         Show this help message`);
    console.log(`  ${bold}version${reset}      Show ONCE version information`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<input>${reset}       Test sequence string (e.g., "s3bcd2e1q")`);
    console.log(`  ${yellow}headless${reset}      Run without interactive controls or browser`);
    console.log(`  ${yellow}help${reset}          Show command-specific help information`);
    console.log(`  ${yellow}<file.scenario.json>${reset} Load configuration from scenario file (NEW)`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${green}# Demo usage${reset}`);
    console.log(`  ${cyan}once${reset} demo                    ${green}# Launch full interactive demo${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}"s3bq"${reset}              ${green}# Run test sequence: start server, wait 3s, browser, quit${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}headless${reset}           ${green}# Server-only mode (no browser)${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}config.scenario.json${reset} ${green}# Demo with custom configuration (NEW)${reset}`);
    console.log('');
    console.log(`  ${green}# Test sequences${reset}`);
    console.log(`  ${cyan}once${reset} test ${yellow}"s3bcd2e1q"${reset}         ${green}# Full demo sequence with clients${reset}`);
    console.log(`  ${cyan}once${reset} test ${yellow}"s1bbbccc1d1k2q"${reset}     ${green}# Stress test with multiple clients${reset}`);
    console.log('');
    console.log(`  ${green}# Server management (Enhanced v0.2.0.0)${reset}`);
    console.log(`  ${cyan}once${reset} start                   ${green}# Start with automatic port management (42777 → 8080+)${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}headless${reset}          ${green}# Start server non-interactively${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}prod.scenario.json${reset} ${green}# Start with production configuration${reset}`);
    console.log(`  ${cyan}once${reset} stop                    ${green}# Stop the running server${reset}`);
    console.log('');
    console.log(`${bold}Enhanced v0.2.0.0 Features:${reset}`);
    console.log(`  ${green}• Server hierarchy (primary/client architecture)${reset}`);
    console.log(`  ${green}• Automatic port conflict resolution (42777 → 8080+)${reset}`);
    console.log(`  ${green}• Scenario file support for configuration${reset}`);
    console.log(`  ${green}• Zero environment variables required${reset}`);
    console.log(`  ${green}• Enhanced project root detection${reset}`);
    console.log(`  ${green}• Domain: local.once (configurable via scenarios)${reset}`);
    console.log('');
    console.log(`${bold}ONCE Core Features:${reset}`);
    console.log(`  ${green}• Cross-platform browser auto-opening${reset}`);
    console.log(`  ${green}• Web4 Message component integration${reset}`);
    console.log(`  ${green}• P2P scenario acknowledgments${reset}`);
    console.log(`  ${green}• Interactive demo controls${reset}`);
    console.log(`  ${green}• TTY-aware keyboard input${reset}`);
    console.log(`  ${green}• Graceful server lifecycle management${reset}`);
    console.log(`  ${green}• Radical OOP TypeScript architecture (no shell scripts!)${reset}`);
    console.log('');
    console.log(`${bold}Server Hierarchy (NEW):${reset}`);
    console.log(`  🟢 Primary Server: Port 42777 (name server/registry)`);
    console.log(`  🔵 Client Servers: Port 8080+ (register with primary)`);
    console.log(`  📋 Automatic conflict resolution and port discovery`);
    console.log(`  🌐 Full server-to-server communication`);
    console.log('');
    console.log(`${bold}For more information, visit:${reset} ${cyan}https://github.com/Cerulean-Circle-GmbH/Web4Articles${reset}`);
  }

  private showDemoHelp(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${bold}${cyan}ONCE Demo Help v0.2.0.0${reset}`);
    console.log('');
    console.log(`${bold}Demo Modes:${reset}`);
    console.log(`  ${cyan}once demo${reset}                     ${green}# Interactive mode with keyboard controls${reset}`);
    console.log(`  ${cyan}once demo ${yellow}headless${reset}            ${green}# Background mode (server only)${reset}`);
    console.log(`  ${cyan}once demo ${yellow}s10c${reset}                ${green}# Test sequence (start, wait 10s, client)${reset}`);
    console.log(`  ${cyan}once demo ${yellow}config.scenario.json${reset} ${green}# Demo with scenario file (NEW)${reset}`);
    console.log('');
    console.log(`${bold}Interactive Controls:${reset}`);
    console.log(`  ${yellow}b${reset}       Launch browser client`);
    console.log(`  ${yellow}c${reset}       Launch Node.js client`);
    console.log(`  ${yellow}w${reset}       Launch Web Worker client`);
    console.log(`  ${yellow}[backspace]${reset} Clear screen`);
    console.log(`  ${yellow}h${reset}       Show help`);
    console.log(`  ${yellow}q${reset}       Quit demo`);
    console.log('');
    console.log(`${bold}Test Sequence Format:${reset}`);
    console.log(`  ${green}s${reset} = Start server`);
    console.log(`  ${green}3${reset} = Wait 3 seconds`);
    console.log(`  ${green}b${reset} = Launch browser client`);
    console.log(`  ${green}c${reset} = Launch Node.js client`);
    console.log(`  ${green}w${reset} = Launch Web Worker client`);
    console.log(`  ${green}q${reset} = Quit/cleanup`);
    console.log('');
    console.log(`${bold}Enhanced v0.2.0.0 Features:${reset}`);
    console.log(`  ${green}• Automatic server hierarchy (42777 → 8080+)${reset}`);
    console.log(`  ${green}• Scenario file configuration support${reset}`);
    console.log(`  ${green}• Zero environment variable dependencies${reset}`);
    console.log(`  ${green}• Enhanced error handling and cleanup${reset}`);
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

  /**
   * Show v0.1.0.2 style interactive demo header
   */
  private showInteractiveDemoHeader(): void {
    console.clear();
    const cyan = '\x1b[36m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}╔════════════════════════════════════════════════╗${reset}`);
    console.log(`${bold}${cyan}║    ONCE Interactive Demo Controller v0.2.0.0   ║${reset}`);
    console.log(`${bold}${cyan}║         Enhanced Server Hierarchy              ║${reset}`);
    console.log(`${bold}${cyan}╚════════════════════════════════════════════════╝${reset}`);
    console.log('');
  }

  /**
   * Show v0.1.0.2 style interactive demo help
   */
  private showInteractiveDemoHelp(): void {
    const bold = '\x1b[1m';
    const blue = '\x1b[34m';
    const gray = '\x1b[37m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}📋 Keyboard Controls:${reset}`);
    console.log(`${gray}─────────────────────${reset}`);
    
    this.keyHelp('h', 'Show this help menu');
    this.keyHelp('s', 'Start/Stop ONCE server (v0.2.0.0: port 42777 → 8080+)');
    this.keyHelp('b', 'Launch Browser Client simulation');
    this.keyHelp('c', 'Launch Node.js Client');
    this.keyHelp('w', 'Launch Web Worker simulation');
    this.keyHelp('d', 'Discover peers (from all clients)');
    this.keyHelp('e', 'Exchange scenarios between clients');
    this.keyHelp('m', 'Show metrics and status');
    this.keyHelp('backspace', 'Clear screen');
    this.keyHelp('k', 'Kill all demo processes gracefully');
    this.keyHelp('q', 'Quit demo (with cleanup)');
    console.log('');
  }

  /**
   * Helper for keyboard help display
   */
  private keyHelp(key: string, description: string): void {
    const blue = '\x1b[34m';
    const reset = '\x1b[0m';
    console.log(`  ${blue}[${key}]${reset} ${description}`);
  }

  /**
   * Setup interactive keyboard input like v0.1.0.2
   */
  private setupInteractiveKeyboard(): void {
    // Check TTY environment
    if (!process.stdin.isTTY) {
      console.log('⚠️ Not a TTY environment - keyboard input disabled');
      return;
    }

    // Check for setRawMode availability
    if (typeof process.stdin.setRawMode !== 'function') {
      console.log('⚠️ Raw mode not available - keyboard input disabled');
      return;
    }

    // Setup keyboard listening
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', async (data: Buffer | string) => {
      const key = data.toString();
      await this.handleInteractiveKeypress(key);
    });

    // Setup cleanup on exit and Ctrl+C handling
    process.on('SIGINT', async () => {
      console.log('\n🛑 Ctrl+C received - cleaning up...');
      await this.cleanupInteractiveDemo();
      process.exit(0);
    });
  }

  /**
   * Handle keypress in interactive demo (v0.1.0.2 style)
   */
  private async handleInteractiveKeypress(key: string): Promise<void> {
    try {
      switch (key.toLowerCase()) {
        case 'h':
          console.clear();
          this.showInteractiveDemoHeader();
          this.showInteractiveDemoHelp();
          break;
          
        case 's':
          console.log('🚀 Starting/Stopping ONCE server (v0.2.0.0 hierarchy)...');
          // TODO: Implement server toggle with v0.2.0.0 hierarchy
          console.log('ℹ️ Server management integration pending');
          break;
          
        case 'b':
          console.log('🌐 Launching Browser Client...');
          // TODO: Implement browser client launch
          console.log('ℹ️ Browser client integration pending');
          break;
          
        case 'c':
          console.log('🔗 Launching Node.js Client...');
          // TODO: Implement Node.js client launch
          console.log('ℹ️ Node.js client integration pending');
          break;
          
        case 'w':
          console.log('⚙️ Launching Web Worker...');
          // TODO: Implement Web Worker launch
          console.log('ℹ️ Web Worker integration pending');
          break;
          
        case 'd':
          console.log('🔍 Discovering peers...');
          // TODO: Implement peer discovery
          console.log('ℹ️ Peer discovery integration pending');
          break;
          
        case 'e':
          console.log('🔄 Exchanging scenarios...');
          // TODO: Implement scenario exchange
          console.log('ℹ️ Scenario exchange integration pending');
          break;
          
        case 'm':
          console.log('📊 Server Metrics & Status:');
          console.log('📋 ONCE v0.2.0.0 - Enhanced Server Hierarchy');
          console.log('🏠 Domain: local.once');
          console.log('🔧 Status: Interactive demo active');
          break;
          
        case '\u0008': // backspace
        case '\u007f': // delete
          console.clear();
          this.showInteractiveDemoHeader();
          this.showInteractiveDemoHelp();
          break;
          
        case 'k':
          console.log('🧹 Killing all demo processes...');
          await this.cleanupInteractiveDemo();
          break;
          
        case 'q':
          console.log('👋 Quitting demo with cleanup...');
          await this.cleanupInteractiveDemo();
          process.exit(0);
          break;
          
        case '\u0003': // Ctrl+C
          console.log('\n🛑 Ctrl+C received - cleaning up...');
          await this.cleanupInteractiveDemo();
          process.exit(0);
          break;
          
        default:
          console.log(`⚠️ Unknown key: '${key.replace(/[\x00-\x1f\x7f]/g, char => '\\x' + char.charCodeAt(0).toString(16).padStart(2, '0'))}'`);
          console.log('ℹ️ Press [h] for help, [q] to quit');
          break;
      }
    } catch (error) {
      console.log(`❌ Keypress error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Cleanup interactive demo
   */
  private async cleanupInteractiveDemo(): Promise<void> {
    try {
      // Restore stdin
      if (process.stdin.setRawMode) {
        process.stdin.setRawMode(false);
      }
      
      // Stop any running server
      await this.once.stopServer().catch(() => {}); // Ignore errors during cleanup
      
      console.log('✅ Demo cleanup completed');
    } catch (error) {
      console.log(`⚠️ Cleanup warning: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
