/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { ONCEDemo } from '../layer3/ONCEDemo.interface.js';

export class DefaultONCEDemo implements ONCEDemo {
  private onceComponent: any; // ONCE component reference

  constructor() {
    // Web4 Pattern: Empty constructor
  }

  init(onceComponent: any): this {
    this.onceComponent = onceComponent;
    return this;
  }

  async demo(args: string[] = []): Promise<void> {
    console.log('🎭 ONCE v0.3.0.0 Interactive Demo Starting...');
    
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
        console.log('🖥️ Starting headless demo (server-only)...');
        await this.onceComponent.start(['headless']);
      } else {
        // Test sequence (same as test command)
        await this.runTestSequence(input);
      }
    }
  }

  async test(args: string[] = []): Promise<void> {
    console.log('🧪 ONCE v0.3.0.0 Test Sequence Starting...');
    
    if (args.length === 0) {
      console.log('❌ Test command requires input sequence');
      console.log('Examples: once test "s3bq" (start, 3s wait, browser, quit)');
      return;
    }
    
    const input = args[0];
    await this.runTestSequence(input);
  }

  private async startInteractiveDemo(): Promise<void> {
    // Testing Safety: Detect test environment to prevent hanging
    const isTestEnvironment = process.env.NODE_ENV === 'test' || 
                             process.env.CI === 'true' || 
                             process.argv.includes('--test') ||
                             process.env.VITEST === 'true';
    
    if (isTestEnvironment) {
      console.log('🧪 Test environment detected - using non-interactive demo');
      await this.runNonInteractiveDemo();
      return;
    }
    
    console.log('🎭 Interactive Demo Mode');
    console.log('📱 Starting ONCE kernel with interactive capabilities...');
    
    // Start the kernel
    await this.onceComponent.start([]);
    
    console.log('🌐 Demo server available at: http://localhost:42777');
    console.log('🎮 Interactive demo ready - press Ctrl+C to exit');
    console.log('⏰ Auto-exit in 30 seconds for testing safety');
    
    // Timeout protection for testing safety (CRITICAL)
    const timeout = setTimeout(async () => {
      console.log('\n⏰ Demo timeout - auto-exiting for testing safety');
      await this.onceComponent.stop([]);
      process.exit(0);
    }, 30000); // 30 second timeout
    
    // Keep alive for interactive use with cleanup
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping interactive demo...');
      clearTimeout(timeout);
      await this.onceComponent.stop([]);
      process.exit(0);
    });
  }

  private async runNonInteractiveDemo(): Promise<void> {
    console.log('🖥️ Non-Interactive Demo Mode (Testing Safe)');
    console.log('🚀 Starting ONCE kernel...');
    await this.onceComponent.start([]);
    console.log('🌐 Demo server started at: http://localhost:42777');
    console.log('⏱️ Running for 3 seconds...');
    await this.sleep(3000);
    console.log('🛑 Stopping demo...');
    await this.onceComponent.stop([]);
    console.log('✅ Non-interactive demo completed');
  }

  showDemoHelp(): void {
    console.log('🎭 ONCE Demo Help');
    console.log('');
    console.log('📋 Demo Commands:');
    console.log('  once demo           # Interactive demo with browser');
    console.log('  once demo headless  # Server-only demo');
    console.log('  once demo help      # Show this help');
    console.log('');
    console.log('📋 Test Sequences:');
    console.log('  once test "s3bq"    # Start, 3s wait, browser, quit');
    console.log('  once test "s5"      # Start, 5s wait');
    console.log('  once test "sb"      # Start, browser');
    console.log('');
    console.log('🔤 Test Input Format:');
    console.log('  s = start server');
    console.log('  3 = wait 3 seconds');
    console.log('  b = open browser');
    console.log('  q = quit/stop');
    console.log('');
  }

  async runTestSequence(input: string): Promise<void> {
    console.log(`🧪 Running test sequence: "${input}"`);
    
    for (let i = 0; i < input.length; i++) {
      const command = input[i];
      
      switch (command) {
        case 's':
          console.log('🚀 Starting ONCE kernel...');
          await this.onceComponent.start([]);
          break;
          
        case 'b':
          console.log('🌐 Opening browser...');
          await this.openBrowser();
          break;
          
        case 'q':
          console.log('🛑 Stopping ONCE kernel...');
          await this.onceComponent.stop([]);
          break;
          
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const seconds = parseInt(command);
          console.log(`⏱️ Waiting ${seconds} seconds...`);
          await this.sleep(seconds * 1000);
          break;
          
        default:
          console.log(`⚠️ Unknown test command: ${command}`);
      }
    }
    
    console.log('✅ Test sequence completed');
  }

  async openBrowser(): Promise<void> {
    try {
      const { execSync } = await import('child_process');
      const url = 'http://localhost:42777';
      
      // Platform-specific browser opening
      const platform = process.platform;
      if (platform === 'darwin') {
        execSync(`open ${url}`);
      } else if (platform === 'win32') {
        execSync(`start ${url}`);
      } else {
        execSync(`xdg-open ${url}`);
      }
      
      console.log(`🌐 Browser opened: ${url}`);
    } catch (error) {
      console.log(`⚠️ Could not open browser: ${error}`);
      console.log('🌐 Manual access: http://localhost:42777');
    }
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}