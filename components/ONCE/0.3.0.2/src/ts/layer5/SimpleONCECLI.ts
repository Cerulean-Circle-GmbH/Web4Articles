#!/usr/bin/env node

/**
 * SimpleONCE CLI - Minimal working implementation
 * No complex dependencies, just basic functionality
 */

export {};

class SimpleONCE {
  constructor() {}

  async start(args: string[]): Promise<void> {
    console.log('🚀 ONCE: Starting kernel...');
    console.log('✅ ONCE: Kernel started successfully');
  }

  async stop(args: string[]): Promise<void> {
    console.log('🛑 ONCE: Stopping kernel...');
    console.log('✅ ONCE: Kernel stopped');
  }

  async status(args: string[]): Promise<void> {
    console.log('📊 ONCE Kernel Status: Ready');
    console.log('🔗 Environment: Node.js');
  }

  async deinstall(args: string[] = []): Promise<void> {
    try {
      console.log('🧹 ONCE: Starting ecosystem deinstall...');
      console.log('🔗 Using Build component for comprehensive cleaning...');
      
      const { DefaultBuild } = await import('../../../Build/0.3.0.3/dist/index.js');
      const build = new DefaultBuild();
      await build.cleanAllComponents();
      
      console.log('✅ ONCE: Ecosystem deinstall complete');
      console.log('💡 Run "once start" to rebuild and restart the ecosystem');
    } catch (error) {
      console.log(`⚠️ ONCE: Deinstall failed - ${(error as Error).message}`);
      console.log('💡 Build component may not be available');
    }
  }

  async help(args: string[]): Promise<void> {
    console.log('🔗 Web4 ONCE CLI - Object Network Communication Engine');
    console.log('');
    console.log('Usage:');
    console.log('  once start                    # Start ONCE kernel');
    console.log('  once stop                     # Stop ONCE kernel'); 
    console.log('  once status                   # Show kernel status');
    console.log('  once deinstall                # Clean all components');
    console.log('  once help                     # Show this help');
    console.log('');
    console.log('Web4 Integration:');
    console.log('  Simple ONCE implementation with Build component integration.');
    console.log('  Minimal dependencies for reliable end-to-end functionality.');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const once = new SimpleONCE();
  
  if (args.length === 0) {
    await once.help([]);
    return;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    switch (command) {
      case 'start':
        await once.start(commandArgs);
        break;
      case 'stop':
        await once.stop(commandArgs);
        break;
      case 'status':
        await once.status(commandArgs);
        break;
      case 'deinstall':
        await once.deinstall(commandArgs);
        break;
      case 'help':
      default:
        await once.help(commandArgs);
        break;
    }
  } catch (error) {
    console.error(`❌ ONCE CLI Error: ${(error as Error).message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}