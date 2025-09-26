import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as readline from 'readline';
import { DependencyManager } from '../layer2/DependencyManager.js';
import { ProcessLifecycleManager } from '../layer2/ProcessLifecycleManager.js';

export class OnceCLI {
  private projectRoot: string;
  private onceVersion: string = '0.1.0.2';
  private dependencyManager: DependencyManager;
  private processManager: ProcessLifecycleManager;

  constructor() {
    // Get project root from environment variable set by shell script
    this.projectRoot = process.env.PROJECT_ROOT || process.cwd();
    
    // Initialize Radical OOP managers (replaces shell scripts)
    this.dependencyManager = new DependencyManager(this.projectRoot, console);
    this.processManager = new ProcessLifecycleManager('once-demo.pid', console);
  }

  public async handleCommand(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    
    switch (command) {
      case 'demo':
        await this.runDemo(args.slice(1));
        break;
      case 'test':
        // test command is identical to demo command
        await this.runDemo(args.slice(1));
        break;
      case 'launch':
        await this.runLaunch(args.slice(1));
        break;
      case 'dependencies':
      case 'deps':
        await this.runDependencies(args.slice(1));
        break;
      case 'start':
        await this.runStart(args.slice(1));
        break;
      case 'stop':
        await this.runStop(args.slice(1));
        break;
      case 'help':
      case '--help':
      case '-h':
        this.showUsage();
        break;
      case 'version':
      case '--version':
      case '-v':
        this.showVersion();
        break;
      default:
        this.showError(`Unknown command: ${command}`);
        process.exit(1);
    }
  }

  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${bold}${cyan}ONCE CLI Tool${reset} ${green}- Web4 Universal P2P Communication Engine${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}once${reset} demo                    ${green}# Start interactive demo with browser auto-opening${reset}`);
        console.log(`  ${cyan}once${reset} demo ${yellow}<input>${reset}           ${green}# Run demo test sequence (e.g., "s3bq")${reset}`);
        console.log(`  ${cyan}once${reset} demo ${yellow}headless${reset}           ${green}# Start demo without browser (same as start headless)${reset}`);
    console.log(`  ${cyan}once${reset} demo ${yellow}help${reset}               ${green}# Show demo-specific help${reset}`);
        console.log(`  ${cyan}once${reset} test ${yellow}<input>${reset}            ${green}# Run test sequence (identical to demo <input>)${reset}`);
    console.log(`  ${cyan}once${reset} start                   ${green}# Start npm server interactively (quit with ${yellow}q${reset}${green})${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}headless${reset}          ${green}# Start npm server without interaction${reset}`);
    console.log(`  ${cyan}once${reset} stop                    ${green}# Stop running npm server gracefully${reset}`);
        console.log(`  ${cyan}once${reset} launch ${yellow}<type>${reset}           ${green}# Launch demo (interactive|v2|stop) - replaces .sh scripts${reset}`);
        console.log(`  ${cyan}once${reset} deps                    ${green}# Check and install dependencies${reset}`);
    console.log(`  ${cyan}once${reset} help                    ${green}# Show this help message${reset}`);
    console.log(`  ${cyan}once${reset} version                 ${green}# Show ONCE version information${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${bold}demo${reset}         Start interactive demo or run test sequences`);
    console.log(`  ${bold}test${reset}         Run test sequences (identical to demo <input>)`);
    console.log(`  ${bold}start${reset}        Start npm server interactively or headless`);
    console.log(`  ${bold}stop${reset}         Stop running npm server gracefully`);
        console.log(`  ${bold}launch${reset}       Launch demo components (replaces shell scripts)`);
        console.log(`  ${bold}deps${reset}         Check and install dependencies`);
    console.log(`  ${bold}help${reset}         Show this help message`);
    console.log(`  ${bold}version${reset}      Show ONCE version information`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<input>${reset}       Test sequence string (e.g., "s3bcd2e1q")`);
    console.log(`  ${yellow}headless${reset}      Run without interactive controls or browser`);
    console.log(`  ${yellow}help${reset}          Show command-specific help information`);
    console.log(`  ${yellow}q${reset}             Quit interactive server (press during start)`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
        console.log(`  ${green}# Demo usage${reset}`);
    console.log(`  ${cyan}once${reset} demo                    ${green}# Launch full interactive demo${reset}`);
        console.log(`  ${cyan}once${reset} demo ${yellow}"s3bq"${reset}              ${green}# Run test sequence: start server, wait 3s, browser, quit${reset}`);
        console.log(`  ${cyan}once${reset} demo ${yellow}headless${reset}           ${green}# Server-only mode (same as start headless)${reset}`);
        console.log('');
        console.log(`  ${green}# Test sequences${reset}`);
        console.log(`  ${cyan}once${reset} test ${yellow}"s3bcd2e1q"${reset}         ${green}# Full demo sequence with clients${reset}`);
        console.log(`  ${cyan}once${reset} test ${yellow}"s1bbbccc1d1k2q"${reset}     ${green}# Stress test with multiple clients${reset}`);
    console.log('');
    console.log(`  ${green}# Server management${reset}`);
    console.log(`  ${cyan}once${reset} start                   ${green}# Start npm server with interactive control${reset}`);
    console.log(`  ${cyan}once${reset} start ${yellow}headless${reset}          ${green}# Start npm server non-interactively${reset}`);
    console.log(`  ${cyan}once${reset} stop                    ${green}# Stop the running npm server${reset}`);
        console.log('');
        console.log(`  ${green}# Radical OOP Demo Management (replaces .sh scripts)${reset}`);
        console.log(`  ${cyan}once${reset} launch ${yellow}interactive${reset}      ${green}# Launch interactive demo (was launch-interactive.sh)${reset}`);
        console.log(`  ${cyan}once${reset} launch ${yellow}v2${reset}               ${green}# Launch v2 demo (was launch-demo-v2.sh)${reset}`);
        console.log(`  ${cyan}once${reset} launch ${yellow}stop${reset}             ${green}# Stop all demos (was stop-demo.sh)${reset}`);
        console.log(`  ${cyan}once${reset} deps                    ${green}# Check dependencies (was embedded in .sh files)${reset}`);
    console.log('');
    console.log(`${bold}ONCE Features:${reset}`);
    console.log(`  ${green}• Cross-platform browser auto-opening${reset}`);
    console.log(`  ${green}• Web4 Message component integration${reset}`);
    console.log(`  ${green}• P2P scenario acknowledgments${reset}`);
    console.log(`  ${green}• Interactive demo controls${reset}`);
    console.log(`  ${green}• TTY-aware keyboard input${reset}`);
    console.log(`  ${green}• Graceful server lifecycle management${reset}`);
    console.log(`  ${green}• Radical OOP TypeScript architecture (no shell scripts!)${reset}`);
    console.log('');
    console.log(`${bold}For more information, visit:${reset} ${cyan}https://github.com/Cerulean-Circle-GmbH/Web4Articles${reset}`);
  }

  // ... existing methods remain the same until we add new ones ...

  /**
   * Handle launch command (replaces shell scripts)
   */
  private async runLaunch(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('❌ Launch type required. Use: interactive, v2, or stop');
      console.log('Examples:');
      console.log('  once launch interactive  # Replaces launch-interactive.sh');
      console.log('  once launch v2          # Replaces launch-demo-v2.sh');
      console.log('  once launch stop        # Replaces stop-demo.sh');
      return;
    }

    const launchType = args[0];

    switch (launchType) {
      case 'interactive':
        await this.launchInteractive();
        break;
      case 'v2':
        await this.launchDemoV2();
        break;
      case 'stop':
        await this.stopDemo();
        break;
      default:
        console.log(`❌ Unknown launch type: ${launchType}`);
        console.log('Available types: interactive, v2, stop');
    }
  }

  /**
   * Launch interactive demo (replaces launch-interactive.sh)
   */
  private async launchInteractive(): Promise<void> {
    console.log('🚀 ONCE Interactive Demo Launcher');
    console.log('================================');
    console.log('');

    const demoPath = path.join(this.projectRoot, 'components', 'ONCE', this.onceVersion, 'examples');

    // Check and install dependencies using Radical OOP
    const success = await this.dependencyManager.ensureAllDependencies(['chalk', 'ws'], demoPath);
    if (!success) {
      console.log('❌ Failed to install dependencies');
      return;
    }

    console.log('');
    console.log('🎮 Starting ONCE Interactive Demo...');
    console.log('──────────────────────────────────');
    console.log('');
    console.log('This demo features:');
    console.log("  • Keyboard controls (press 'h' for help)");
    console.log('  • Graceful lifecycle management');
    console.log('  • No zombie processes');
    console.log('  • Real IP address usage');
    console.log('');
    console.log('Starting in 2 seconds...');

    await this.sleep(2000);

    try {
      const demoScript = path.join(demoPath, 'multi-env-demo', 'interactive-demo-web4.mjs');
      const pid = await this.processManager.startProcess('node', [demoScript], { cwd: demoPath });
      
      console.log('');
      console.log(`✅ Interactive demo started (PID: ${pid})`);
      console.log('');
      console.log('Press Ctrl+C to exit cleanly');
      console.log('');

      // Wait for process to complete
      await this.waitForProcess(pid);
    } catch (error) {
      console.log('❌ Failed to start interactive demo:', (error as Error).message);
    }
  }

  /**
   * Launch demo v2 (replaces launch-demo-v2.sh)
   */
  private async launchDemoV2(): Promise<void> {
    console.log('🚀 ONCE Demo V2 Launcher');
    console.log('========================');
    console.log('');

    // This would implement the v2 demo logic
    console.log('🔧 Demo V2 functionality coming soon...');
    console.log('💡 This replaces the launch-demo-v2.sh script with pure TypeScript');
  }

  /**
   * Stop demo (replaces stop-demo.sh)
   */
  private async stopDemo(): Promise<void> {
    console.log('🛑 ONCE Demo Shutdown');
    console.log('=====================');
    console.log('');

    await this.processManager.cleanup();
    console.log('✅ All demo processes stopped');
  }

  /**
   * Handle dependencies command (replaces shell script dependency logic)
   */
  private async runDependencies(args: string[]): Promise<void> {
    console.log('📦 ONCE Dependencies Check');
    console.log('==========================');
    console.log('');

    const demoPath = path.join(this.projectRoot, 'components', 'ONCE', this.onceVersion, 'examples');
    const requiredPackages = ['chalk', 'ws'];

    console.log('Required packages:', requiredPackages.join(', '));
    console.log('');

    const success = await this.dependencyManager.ensureAllDependencies(requiredPackages, demoPath);
    
    if (success) {
      console.log('');
      console.log('✅ All dependencies are ready!');
    } else {
    console.log('');
      console.log('❌ Some dependencies failed to install');
      process.exit(1);
    }
  }

  /**
   * Utility method to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait for a process to complete
   */
  private async waitForProcess(pid: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkInterval = 1000;
      
      const check = () => {
        if (!this.processManager.isProcessRunning(pid)) {
          resolve();
        return;
        }
        setTimeout(check, checkInterval);
      };
      
      check();
    });
  }

  private showVersion(): void {
    const yellow = '\x1b[33m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${bold}ONCE CLI Tool${reset} ${yellow}v${this.onceVersion}${reset}`);
    console.log(`${bold}Web4 Universal P2P Communication Engine${reset}`);
    console.log(`${bold}Path:${reset} ${yellow}${this.projectRoot}/scripts/versions/once-v${this.onceVersion}${reset}`);
  }

  private showError(message: string): void {
    const white = '\x1b[37m';
    const cyan = '\x1b[36m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${bold}❌ Unknown command:${reset} ${white}${message}${reset}`);
    console.log(`Run '${cyan}once${reset} ${white}help${reset}' for usage information`);
  }

  private async runDemo(args: string[]): Promise<void> {
    const demoPath = path.join(this.projectRoot, 'components', 'ONCE', this.onceVersion, 'examples', 'multi-env-demo');
    const demoScript = path.join(demoPath, 'interactive-demo-web4.mjs');

    // Check if demo script exists
    try {
      await import('fs').then(fs => fs.promises.access(demoScript));
    } catch (error) {
      console.log(`❌ ONCE Demo not found at: ${demoScript}`);
      console.log(`📁 Expected path: components/ONCE/${this.onceVersion}/examples/multi-env-demo/`);
      console.log(`💡 Looking for: interactive-demo-web4.mjs (Web4 TypeScript refactored version)`);
      process.exit(1);
    }

    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const magenta = '\x1b[35m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    // Handle demo arguments
    const isHeadless = args.includes('headless');
    const showHelp = args.includes('help');

    if (showHelp) {
      this.showDemoHelp();
      return;
    }

    if (isHeadless) {
      console.log(`${cyan}🎭 Starting ONCE Demo ${yellow}v${this.onceVersion}${reset} ${magenta}(headless mode)${reset}${cyan}...${reset}`);
      console.log(`${bold}📁 Demo path:${reset} ${yellow}${demoPath}${reset}`);
      console.log(`${magenta}🖥️  Server-only mode (no browser auto-opening)${reset}`);
    } else {
      console.log(`${cyan}🎭 Starting ONCE Interactive Demo ${yellow}v${this.onceVersion}${reset}${cyan}...${reset}`);
      console.log(`${bold}📁 Demo path:${reset} ${yellow}${demoPath}${reset}`);
      console.log(`${cyan}🌐 Browser auto-opening enabled${reset}`);
    }

    // Direct TypeScript execution - no shell scripts
    try {
      const { main: demoMain } = await import('./InteractiveDemoController.js');
      await demoMain(args);
    } catch (error) {
      console.log(`❌ Failed to start demo: ${(error as Error).message}`);
    }
  }

  private showDemoHelp(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${bold}${cyan}ONCE Demo Help${reset}`);
    console.log('');
    console.log(`${bold}Interactive Controls:${reset}`);
    console.log(`  ${yellow}b${reset}       Launch browser client`);
    console.log(`  ${yellow}c${reset}       Launch Node.js client`);
    console.log(`  ${yellow}w${reset}       Launch Web Worker client`);
    console.log(`  ${yellow}[backspace]${reset} / ${yellow}l${reset}  Clear screen`);
    console.log(`  ${yellow}h${reset}       Show help`);
    console.log(`  ${yellow}q${reset}       Quit demo`);
    console.log('');
    console.log(`${green}Test sequence format: "s3bq" = start server, wait 3s, browser, quit${reset}`);
  }

  private async runStart(args: string[]): Promise<void> {
    const isHeadless = args.includes('headless');
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${cyan}🚀 Starting ONCE Server ${yellow}v${this.onceVersion}${reset}${cyan}...${reset}`);
    
    if (isHeadless) {
      console.log(`${green}🖥️  Headless mode (no interactive controls)${reset}`);
    } else {
      console.log(`${bold}💡 Press 'q' to quit${reset}`);
    }

    try {
      const serverPath = path.join(this.projectRoot, 'components', 'ONCE', this.onceVersion, 'examples', 'node-server', 'server.mjs');
      const pid = await this.processManager.startProcess('node', [serverPath]);
      
      if (!isHeadless) {
        // Setup interactive controls
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        console.log(`${green}✅ Server started (PID: ${pid})${reset}`);
        console.log(`${bold}Press 'q' + Enter to quit gracefully${reset}`);

        rl.on('line', async (input) => {
          if (input.trim().toLowerCase() === 'q') {
            console.log(`${yellow}🛑 Shutting down server...${reset}`);
            rl.close();
            await this.processManager.stopProcess(pid);
            process.exit(0);
          }
        });
      } else {
        console.log(`${green}✅ Server started in headless mode (PID: ${pid})${reset}`);
        await this.waitForProcess(pid);
      }
    } catch (error) {
      console.log(`❌ Failed to start server: ${(error as Error).message}`);
    }
  }

  private async runStop(args: string[]): Promise<void> {
    const cyan = '\x1b[36m';
    const green = '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(`${cyan}🛑 Stopping ONCE processes...${reset}`);
    
    await this.processManager.cleanup();
    
    console.log(`${green}✅ All ONCE processes stopped${reset}`);
  }
}