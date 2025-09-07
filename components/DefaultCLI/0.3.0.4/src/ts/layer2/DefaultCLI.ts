/**
 * DefaultCLI - Web4 compliant dependency-free base component for CLI functionality
 * Web4 pattern: Empty constructor + scenario initialization + hibernation
 * Purpose: Foundation CLI component with terminal rendering and static start method
 */

import { CLI } from '../layer3/CLI.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { CLIModel } from '../layer3/CLIModel.interface.js';

export class DefaultCLI implements CLI {
  private model: CLIModel;
  private component: any;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      indexPath: '',
      symlinkPaths: [],
      namedLinks: [],
      componentName: '',
      componentVersion: '',
      componentDescription: '',
      terminalCapabilities: ['usage-display', 'color-coding', 'terminal-rendering'],
      cliCapabilities: ['command-routing', 'parameter-handling', 'static-start'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.component = null;
  }

  init(scenario: Scenario): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  async toScenario(): Promise<Scenario> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'DefaultCLI',
      version: '0.3.0.4'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'DefaultCLI',
        version: '0.3.0.4'
      },
      owner: ownerData,
      model: this.model
    };
  }

  setComponent(component: any): this {
    this.component = component;
    // Extract component info for usage display
    this.model.componentName = component.constructor.name.replace('Default', '');
    this.model.componentVersion = '0.3.0.4'; // Will be enhanced to read from package.json
    this.model.componentDescription = this.getComponentDescription();
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const [command, ...parameters] = args;

    // Direct method invocation - CLI method naming convention v0.1.2.2
    // Avoid TypeScript indexing issues with explicit command handling
    if (this.component && typeof this.component[command] === 'function') {
      try {
        await this.component[command](...parameters);
      } catch (error) {
        console.error(`Error executing ${command}:`, (error as Error).message);
      }
    } else {
      console.error(`Unknown command: ${command}`);
      this.showUsage();
    }
  }

  showUsage(): void {
    // Terminal rendering with color coding (foundation for DRY system)
    const colors = this.getColors();
    
    console.log(`${colors.bold}${colors.cyan}Web4 ${this.model.componentName} CLI Tool v${this.model.componentVersion}${colors.reset} ${colors.green}- ${this.model.componentDescription}${colors.reset}`);
    console.log('');
    
    console.log(`${colors.bold}Usage:${colors.reset}`);
    console.log(`  ${colors.cyan}${this.model.componentName.toLowerCase()}${colors.reset} ${colors.yellow}help${colors.reset}                                    ${colors.green}# Show this help${colors.reset}`);
    console.log('');
    
    console.log(`${colors.bold}Web4 Integration:${colors.reset}`);
    console.log(`  ${this.model.componentName} operates as Web4 component with scenario-based functionality.`);
    console.log('');
  }

  // Terminal rendering foundation (DRY system)
  protected getColors() {
    return {
      cyan: '\x1b[36m',
      yellow: '\x1b[33m',
      green: '\x1b[32m',
      red: '\x1b[31m',
      bold: '\x1b[1m',
      reset: '\x1b[0m'
    };
  }

  protected renderHeader(name: string, version: string, description: string): void {
    const colors = this.getColors();
    console.log(`${colors.bold}${colors.cyan}${name} v${version}${colors.reset} ${colors.green}- ${description}${colors.reset}`);
  }

  protected renderCommand(command: string, params: string, description: string): void {
    const colors = this.getColors();
    console.log(`  ${colors.cyan}${command}${colors.reset} ${colors.yellow}${params}${colors.reset} ${colors.green}${description}${colors.reset}`);
  }

  private getComponentDescription(): string {
    const descriptions: { [key: string]: string } = {
      'Unit': 'Atomic Execution Elements',
      'User': 'User Component Management',
      'ONCE': 'Object Network Communication Engine',
      'Requirement': 'Requirements Management System',
      'Build': 'Dependency Resolution and Build Management'
    };
    return descriptions[this.model.componentName] || 'Web4 Component';
  }

  // Static start method for radical OOP compliance
  static async start(args: string[] = []): Promise<void> {
    const cli = new DefaultCLI();
    // Initialize with empty scenario (Web4 pattern)
    const emptyScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'DefaultCLI', version: '0.3.0.4' },
      owner: '',
      model: {
        uuid: crypto.randomUUID(),
        name: '',
        origin: '',
        definition: '',
        indexPath: '',
        symlinkPaths: [],
        namedLinks: [],
        componentName: 'DefaultCLI',
        componentVersion: '0.3.0.4',
        componentDescription: 'Dependency-free base component for CLI functionality',
        terminalCapabilities: ['usage-display', 'color-coding', 'terminal-rendering'],
        cliCapabilities: ['command-routing', 'parameter-handling', 'static-start'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    cli.init(emptyScenario);
    await cli.run(args);
  }
}