/**
 * DefaultCLI - Dependency-free base component for CLI functionality
 * Web4 pattern: Empty constructor + scenario initialization + direct method invocation
 * Purpose: Provide CLI functionality with direct command-to-method mapping (no mapping layer)
 */

import { CLI } from '../layer3/CLI.interface.js';

export class DefaultCLI implements CLI {
  private component: any;
  private componentName: string;
  private componentVersion: string;
  private componentDescription: string;

  constructor() {
    // Empty constructor - Web4 pattern
    this.component = null;
    this.componentName = '';
    this.componentVersion = '';
    this.componentDescription = '';
  }

  init(component: any): this {
    this.component = component;
    // Extract component info for usage display
    this.componentName = component.constructor.name.replace('Default', '');
    this.componentVersion = '0.3.0.4'; // Will be enhanced to read from package.json
    this.componentDescription = this.getComponentDescription();
    return this;
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const [command, ...parameters] = args;

    // Direct method invocation - CLI method naming convention v0.1.2.2
    if (typeof this.component[command] === 'function') {
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
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4 ${this.componentName} CLI Tool v${this.componentVersion}${reset} ${green}- ${this.componentDescription}${reset}`);
    console.log('');
    
    // Usage section will be implemented by component-specific CLI
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}${this.componentName.toLowerCase()}${reset} ${yellow}help${reset}                                    ${green}# Show this help${reset}`);
    console.log('');
    
    console.log(`${bold}Web4 Integration:${reset}`);
    console.log(`  ${this.componentName} operates as Web4 component with scenario-based functionality.`);
    console.log('');
  }

  private getComponentDescription(): string {
    const descriptions: { [key: string]: string } = {
      'Unit': 'Atomic Execution Elements',
      'User': 'User Component Management',
      'ONCE': 'Object Network Communication Engine',
      'Requirement': 'Requirements Management System'
    };
    return descriptions[this.componentName] || 'Web4 Component';
  }
}