#!/usr/bin/env node

/**
 * MinimalONCECLI - Simplified CLI for immediate functionality
 * Web4 compliant with minimal dependencies
 */

// Dynamic import for ESM compatibility
const { MinimalONCE } = await import('../layer2/MinimalONCE.js');

class MinimalONCECLI {
  private once: MinimalONCE;

  constructor() {
    this.once = new MinimalONCE();
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0) {
      await this.once.help([]);
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      switch (command) {
        case 'start':
          await this.once.start(commandArgs);
          break;
        case 'stop':
          await this.once.stop(commandArgs);
          break;
        case 'status':
          await this.once.status(commandArgs);
          break;
        case 'info':
          await this.once.info(commandArgs);
          break;
        case 'deinstall':
          await this.once.deinstall(commandArgs);
          break;
        case 'help':
        default:
          await this.once.help(commandArgs);
          break;
      }
    } catch (error) {
      console.error(`❌ ONCE CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// CLI entry point
async function main() {
  try {
    const cli = new MinimalONCECLI();
    await cli.run(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ ONCE CLI Fatal Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main();
}