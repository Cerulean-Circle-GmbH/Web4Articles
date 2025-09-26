/**
 * BuildCLI - Web4-Compliant Build Component CLI
 * 
 * Web4 principle: CLI in layer5
 * Version 0.3.0.1: Eliminates StandaloneBuild DORY violation
 */

import { DefaultBuild } from '../layer2/DefaultBuild.js';

export class BuildCLI {
  private build: DefaultBuild;

  constructor() {
    this.build = new DefaultBuild();
  }

  async run(args: string[]): Promise<void> {
    const command = args[0] || 'help';
    
    switch (command) {
      case 'start':
        await this.build.start(args.slice(1));
        break;
      case 'buildComponent':
        if (args[1]) {
          const result = await this.build.buildComponent(args[1]);
          if (!result.success) {
            console.log(`❌ Build failed for ${args[1]}`);
            process.exit(1);
          }
        } else {
          console.log('❌ buildComponent requires component name');
          await this.build.help();
        }
        break;
      case 'buildAll':
        const results = await this.build.buildAll();
        const failed = results.filter(r => !r.success);
        if (failed.length > 0) {
          console.log(`❌ ${failed.length} components failed to build`);
          process.exit(1);
        }
        console.log('✅ All components built successfully');
        break;
      case 'info':
        await this.build.info(args.slice(1));
        break;
      case 'help':
        await this.build.help(args.slice(1));
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        await this.build.help();
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

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  BuildCLI.start(process.argv.slice(2));
}