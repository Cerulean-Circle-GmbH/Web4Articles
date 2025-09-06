#!/usr/bin/env node

/**
 * BuildCLI - Web4 compliant build system CLI
 * Web4 pattern: DefaultCLI integration with dependency resolution before usage
 * Purpose: Build system CLI with proper dependency resolution and no bypasses
 */

import { DefaultBuild } from '../layer2/DefaultBuild.js';

class BuildCLI {
  private build: DefaultBuild;

  constructor() {
    this.build = new DefaultBuild();
    // Initialize build with empty scenario (Web4 pattern)
    const emptyScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Build', version: '0.3.0.4' },
      owner: '',
      model: {
        uuid: crypto.randomUUID(),
        name: '',
        origin: '',
        definition: '',
        indexPath: '',
        symlinkPaths: [],
        namedLinks: [],
        buildCapabilities: ['component', 'resolve', 'validate', 'clean'],
        dependencyCapabilities: ['npm-install', 'typescript-build', 'dependency-validation'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    this.build.init(emptyScenario);
  }

  private async resolveSelfDependencies(): Promise<boolean> {
    try {
      // Build component must resolve its own dependencies before showing usage
      console.log('🔧 Build System: Resolving self dependencies...');
      
      // Validate DefaultCLI is available
      const fs = await import('fs');
      const defaultCLIPath = '../../../DefaultCLI/0.3.0.4/dist';
      if (!fs.existsSync(defaultCLIPath)) {
        console.log('📦 Building DefaultCLI dependency...');
        await this.build.component('../../../DefaultCLI/0.3.0.4');
      }

      console.log('✅ Build System: Self dependencies resolved');
      return true;
    } catch (error) {
      console.error(`❌ Build System: Failed to resolve self dependencies: ${(error as Error).message}`);
      return false;
    }
  }

  private showUsage(): void {
    console.log('Web4 Build CLI Tool v0.3.0.4 - Dependency Resolution and Build Management');
    console.log('');
    console.log('Usage:');
    console.log('  build component <path>                          # Build component');
    console.log('  build resolve <path>                            # Resolve component dependencies');
    console.log('  build validate <path>                           # Validate component build state');
    console.log('  build clean <path>                              # Clean component build artifacts');
    console.log('  build info                                      # Show build system info');
    console.log('  build help                                      # Show this help');
    console.log('');
    console.log('Commands:');
    console.log('  component    Build component with dependency resolution');
    console.log('  resolve      Resolve and install component dependencies');
    console.log('  validate     Validate component is properly built and functional');
    console.log('  clean        Clean build artifacts and reset component state');
    console.log('  info         Display build system information and capabilities');
    console.log('  help         Show this help message');
    console.log('');
    console.log('Parameters:');
    console.log('  <path>        Component path for build operations');
    console.log('');
    console.log('Examples:');
    console.log('  build component components/Unit/0.3.0.4         # Build Unit component');
    console.log('  build resolve components/Unit/0.3.0.4           # Resolve Unit dependencies');
    console.log('  build validate components/Unit/0.3.0.4          # Validate Unit build');
    console.log('  build clean components/Unit/0.3.0.4             # Clean Unit build');
    console.log('  build info                                      # Show build info');
    console.log('');
    console.log('Web4 Integration:');
    console.log('  Build operates as Web4 component with dependency resolution before usage.');
    console.log('  All build operations follow Web4 compliance without bypasses or shortcuts.');
    console.log('  Dependency resolution validates working state before usage display.');
    console.log('');
  }

  async run(): Promise<void> {
    try {
      // Web4 Compliance: Resolve dependencies before showing usage (no bypasses)
      const selfResolved = await this.resolveSelfDependencies();
      if (!selfResolved) {
        console.error('❌ Build System: Cannot proceed - self dependencies not resolved');
        process.exit(1);
      }

      const args = process.argv.slice(2);
      
      if (args.length === 0) {
        this.showUsage();
        return;
      }

      const [command, ...commandArgs] = args;

      // Direct method invocation - CLI method naming convention v0.1.2.2
      switch (command) {
        case 'component':
          if (commandArgs.length < 1) {
            throw new Error('Component path required for component command');
          }
          await this.build.component(commandArgs[0]);
          break;

        case 'resolve':
          if (commandArgs.length < 1) {
            throw new Error('Component path required for resolve command');
          }
          await this.build.resolve(commandArgs[0]);
          break;

        case 'validate':
          if (commandArgs.length < 1) {
            throw new Error('Component path required for validate command');
          }
          await this.build.validate(commandArgs[0]);
          break;

        case 'clean':
          if (commandArgs.length < 1) {
            throw new Error('Component path required for clean command');
          }
          await this.build.clean(commandArgs[0]);
          break;

        case 'info':
          await this.build.info();
          break;

        case 'help':
          this.showUsage();
          break;

        default:
          console.error(`Unknown command: ${command}`);
          this.showUsage();
      }
    } catch (error) {
      console.error(`❌ Build CLI Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }
}

// Web4 pattern: Direct execution
const cli = new BuildCLI();
cli.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});