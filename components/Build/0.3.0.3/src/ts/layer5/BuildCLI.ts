/**
 * BuildCLI - Dependency-free build system CLI
 * 
 * Web4 principle: CLI in layer5
 * Version 0.3.0.3: Self-bootstrapping CLI
 */

import { DefaultBuild } from '../layer2/DefaultBuild.js';

export class BuildCLI {
  private build: DefaultBuild;

  constructor() {
    this.build = new DefaultBuild();
  }

  /**
   * Radical OOP: Static start method
   */
  static async start(args: string[] = []): Promise<void> {
    const cli = new BuildCLI();
    await cli.handleCommand(args);
  }

  async handleCommand(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];

    switch (command) {
      case 'once':
        await this.build.buildONCE();
        break;
      case 'component':
        if (args[1]) {
          await this.build.buildComponent(args[1]);
        } else {
          console.log('❌ Component path required');
        }
        break;
      case 'clean':
        if (args[1]) {
          await this.build.cleanComponent(args[1]);
        } else {
          console.log('❌ Component path required');
        }
        break;
      default:
        this.showUsage();
    }
  }

  private showUsage(): void {
    console.log(`
🏗️ Web4 Build Component v0.3.0.3 - Dependency-free build system

📋 Commands:
  once              Build ONCE component
  component <path>  Build specific component
  clean <path>      Clean component build artifacts

📋 Examples:
  build once
  build component /workspace/components/ONCE/0.3.0.2
  build clean /workspace/components/ONCE/0.3.0.2
`);
  }
}

// Radical OOP: Static start method only