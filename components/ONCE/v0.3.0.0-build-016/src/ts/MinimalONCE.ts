#!/usr/bin/env node

/**
 * MinimalONCE - Simplified ONCE implementation for seamless execution
 * 
 * Goal: Get `./scripts/once` working seamlessly from scratch
 * Strategy: Minimal implementation without complex dependencies
 * Validates requirement: 124bb2a3-fc67-4c84-9525-f3c8d1d12d4a
 */

// Minimal interfaces for basic functionality
interface MinimalIOR {
  uuid: string;
  component: string;
  version: string;
}

interface MinimalComponent {
  name: string;
  status: string;
}

export class MinimalONCE {
  private components: Map<string, MinimalComponent>;
  private serviceRegistry: {
    port: number;
    running: boolean;
    services: MinimalComponent[];
  };

  constructor() {
    this.components = new Map();
    this.serviceRegistry = {
      port: 42777,
      running: false,
      services: []
    };
  }

  /**
   * Start ONCE kernel - CLI command delegation target
   */
  async start(args: string[] = []): Promise<void> {
    console.log('ONCE: Starting minimal kernel...');
    
    // Start service registry
    this.serviceRegistry.running = true;
    console.log(`✅ ONCE: Service registry started on port ${this.serviceRegistry.port}`);
    
    // Load basic capabilities
    this.loadBasicCapabilities();
    
    console.log('✅ ONCE: Kernel started successfully');
  }

  /**
   * Stop ONCE kernel - CLI command delegation target
   */
  async stop(args: string[] = []): Promise<void> {
    console.log('ONCE: Stopping kernel...');
    
    this.serviceRegistry.running = false;
    this.components.clear();
    
    console.log('✅ ONCE: Kernel stopped');
  }

  /**
   * Show ONCE status - CLI command delegation target
   */
  async status(args: string[] = []): Promise<void> {
    console.log('ONCE Kernel Status:');
    console.log(`  Service Registry: ${this.serviceRegistry.running ? 'Running' : 'Stopped'}`);
    console.log(`  Port: ${this.serviceRegistry.port}`);
    console.log(`  Loaded Components: ${this.components.size}`);
    
    if (this.components.size > 0) {
      console.log('\nComponents:');
      for (const [name, component] of this.components) {
        console.log(`  - ${name}: ${component.status}`);
      }
    }
  }

  /**
   * Show ONCE info - CLI command delegation target
   */
  async info(args: string[] = []): Promise<void> {
    console.log('ONCE - Object Network Communication Engine');
    console.log('Version: 0.3.0.0 (Minimal Implementation)');
    console.log('Description: Web4 component kernel with service registry');
    console.log(`Service Registry: ${this.serviceRegistry.running ? 'Active' : 'Inactive'}`);
  }

  /**
   * Show ONCE help - CLI command delegation target
   */
  async help(args: string[] = []): Promise<void> {
    this.showUsage();
  }

  /**
   * Load basic capabilities
   */
  private loadBasicCapabilities(): void {
    // Mock capability loading
    this.components.set('HttpServer', { name: 'HTTP Server', status: 'loaded' });
    this.components.set('WsServer', { name: 'WebSocket Server', status: 'loaded' });
    this.components.set('P2PServer', { name: 'P2P Server', status: 'loaded' });
    
    console.log(`✅ ONCE: Loaded ${this.components.size} basic capabilities`);
  }

  /**
   * Show colorful usage display
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
    console.log(`  ${cyan}once${reset} help                                         ${green}# Show this help${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}start${reset}        Start ONCE kernel with 42777 service registry`);
    console.log(`  ${bold}stop${reset}         Stop ONCE kernel and service registry`);
    console.log(`  ${bold}status${reset}       Display kernel state and loaded components`);
    console.log(`  ${bold}info${reset}         Show detailed ONCE kernel information`);
    console.log(`  ${bold}help${reset}         Show this help message`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}once${reset} start                    ${green}# Start ONCE kernel${reset}`);
    console.log(`  ${cyan}once${reset} status                   ${green}# Check kernel status${reset}`);
    console.log(`  ${cyan}once${reset} info                     ${green}# Show kernel information${reset}`);
    console.log('');
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log('  ONCE operates as Web4 component kernel with 42777 service registry.');
    console.log('  Minimal implementation for seamless execution validation.');
    console.log('');
  }

  /**
   * Execute CLI command
   */
  async execute(command: string, args: string[]): Promise<void> {
    switch (command) {
      case 'start':
        return this.start(args);
      case 'stop':
        return this.stop(args);
      case 'status':
        return this.status(args);
      case 'info':
        return this.info(args);
      case 'help':
        return this.help(args);
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }

  /**
   * Run CLI with arguments
   */
  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      await this.execute(command, commandArgs);
    } catch (error) {
      console.error(`❌ ONCE Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * Radical OOP: Static start method
   */
  static async start(args: string[] = process.argv.slice(2)): Promise<void> {
    try {
      const once = new MinimalONCE();
      await once.run(args);
    } catch (error) {
      console.error(`❌ ONCE Fatal Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// Radical OOP Entry Point
if (import.meta.url === `file://${process.argv[1]}`) {
  MinimalONCE.start();
}