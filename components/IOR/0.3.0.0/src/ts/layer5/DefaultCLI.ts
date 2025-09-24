/**
 * DefaultCLI - Universal CLI implementation for all Web4 components
 * 
 * Web4 pattern: Single CLI implementation serving all components
 * Command delegation: Each CLI command calls same-named method in component
 * Following TSRanger 2.2 pattern but simplified for universal usage
 */

import { CLI } from './CLI.interface.js';
import { CLIColors } from './CLIColors.js';

export class DefaultCLI implements CLI {
  private component: any;      // Component instance with delegated methods
  private componentName: string;

  /**
   * Web4 Pattern: Empty constructor + initialization
   */
  constructor() {
    this.component = null;
    this.componentName = 'Component';
  }

  /**
   * Initialize CLI with component instance
   */
  init(component: any, componentName: string): this {
    this.component = component;
    this.componentName = componentName;
    return this;
  }

  /**
   * CLI Command Implementation - Delegation Pattern
   */

  /**
   * Start component (delegates to component.start())
   */
  async start(args: string[]): Promise<void> {
    if (!this.component) {
      throw new Error('CLI not initialized with component');
    }
    
    if (typeof this.component.start === 'function') {
      console.log(`${this.componentName}: Starting...`);
      return this.component.start(args);
    }
    
    throw new Error(`${this.componentName}: start command not implemented`);
  }

  /**
   * Stop component (delegates to component.stop())
   */
  async stop(args: string[]): Promise<void> {
    if (!this.component) {
      throw new Error('CLI not initialized with component');
    }
    
    if (typeof this.component.stop === 'function') {
      console.log(`${this.componentName}: Stopping...`);
      return this.component.stop(args);
    }
    
    throw new Error(`${this.componentName}: stop command not implemented`);
  }

  /**
   * Get component status (delegates to component.status())
   */
  async status(args: string[]): Promise<void> {
    if (!this.component) {
      throw new Error('CLI not initialized with component');
    }
    
    if (typeof this.component.status === 'function') {
      return this.component.status(args);
    }
    
    // Default status implementation using component state
    console.log(`${this.componentName}: Status functionality not implemented`);
    if (this.component.model) {
      console.log(`State: ${this.component.model.state || 'unknown'}`);
      console.log(`UUID: ${this.component.model.uuid || 'none'}`);
    }
  }

  /**
   * Get component info (delegates to component.info())
   */
  async info(args: string[]): Promise<void> {
    if (!this.component) {
      throw new Error('CLI not initialized with component');
    }
    
    if (typeof this.component.info === 'function') {
      return this.component.info(args);
    }
    
    // Default info implementation
    console.log(`${this.componentName} Component Information:`);
    if (this.component.model) {
      console.log(`Name: ${this.component.model.name || 'Unnamed'}`);
      console.log(`Description: ${this.component.model.description || 'No description'}`);
      console.log(`UUID: ${this.component.model.uuid || 'No UUID'}`);
    }
  }

  /**
   * Show component help (delegates to component.help())
   */
  async help(args: string[]): Promise<void> {
    if (this.component && typeof this.component.help === 'function') {
      return this.component.help(args);
    }
    
    // Default colorful help implementation using DRY CLIColors utility
    console.log(CLIColors.cliHeader(`Web4 ${this.componentName} CLI Tool`, 'Web4 Component Interface'));
    console.log('');
    console.log(CLIColors.bold('Usage:'));
    console.log(CLIColors.usageLine(`${this.componentName.toLowerCase()}`, 'start', 'Start component'));
    console.log(CLIColors.usageLine(`${this.componentName.toLowerCase()}`, 'stop', 'Stop component'));
    console.log(CLIColors.usageLine(`${this.componentName.toLowerCase()}`, 'status', 'Show component status'));
    console.log(CLIColors.usageLine(`${this.componentName.toLowerCase()}`, 'info', 'Show component information'));
    console.log(CLIColors.usageLine(`${this.componentName.toLowerCase()}`, 'help', 'Show this help'));
    console.log('');
    console.log(CLIColors.bold('Commands:'));
    console.log(CLIColors.commandDesc('start', 'Start component with initialization'));
    console.log(CLIColors.commandDesc('stop', 'Stop component gracefully'));
    console.log(CLIColors.commandDesc('status', 'Show current component state'));
    console.log(CLIColors.commandDesc('info', 'Show detailed component information'));
    console.log(CLIColors.commandDesc('help', 'Show this help message'));
    
    // Show component-specific commands if available
    if (this.component) {
      const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this.component))
        .filter(name => typeof this.component[name] === 'function' && 
                       !['constructor', 'init', 'start', 'stop', 'status', 'info', 'help'].includes(name));
      
      if (methods.length > 0) {
        console.log('');
        console.log(CLIColors.bold('Component-Specific Commands:'));
        for (const method of methods) {
          console.log(CLIColors.commandDesc(method, `${method} operation`));
        }
      }
    }
    
    console.log('');
    console.log(CLIColors.bold('Web4 Integration:'));
    console.log(`  ${this.componentName} follows Web4 UCP patterns with scenario-based configuration.`);
    console.log(`  Can operate standalone or as service loaded by ONCE kernel.`);
    console.log('');
  }

  /**
   * Execute component command dynamically
   */
  async execute(command: string, args: string[]): Promise<void> {
    if (!this.component) {
      throw new Error('CLI not initialized with component');
    }
    
    // First try standard CLI commands
    const standardCommands: (keyof CLI)[] = ['start', 'stop', 'status', 'info', 'help'];
    if (standardCommands.includes(command as keyof CLI)) {
      const method = this[command as keyof CLI] as Function;
      return method.call(this, args);
    }
    
    // Try dynamic delegation to component method
    if (typeof this.component[command] === 'function') {
      console.log(`${this.componentName}: Executing ${command} command...`);
      return this.component[command](args);
    }
    
    throw new Error(`${this.componentName}: Unknown command '${command}'. Use 'help' to see available commands.`);
  }

  /**
   * Static factory method for component CLI creation
   */
  static createForComponent(component: any, componentName: string): DefaultCLI {
    return new DefaultCLI().init(component, componentName);
  }
}