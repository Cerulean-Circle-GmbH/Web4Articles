/**
 * ONCE CLI v0.1.0.0 - Web4 Universal P2P Communication Engine
 * Layer 5: Command Line Interface
 */

import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as readline from 'readline';

export class OnceCLI {
  private projectRoot: string;
  private onceVersion: string = '0.1.0.0';

  constructor() {
    // Get project root from environment variable set by shell script
    this.projectRoot = process.env.PROJECT_ROOT || process.cwd();
  }

  async handleCommand(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    
    switch (command) {
      case 'demo':
        await this.runDemo(args.slice(1));
        break;
      case 'star':
        await this.runStar(args.slice(1));
        break;
      case 'help':
      case '--help':
      case '-h':
        this.showHelp();
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
    const white = '\x1b[37m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log('');
    console.log(`${cyan}${bold}🎭 ONCE Interactive Demo${reset} - Web4 Universal P2P Communication Engine`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset}                    # Start interactive demo with browser auto-opening`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset} ${yellow}--headless${reset}         # Start demo without browser (server only)`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset} ${yellow}--help${reset}             # Show demo-specific help`);
    console.log(`  ${cyan}once${reset} ${white}star${reset}                    # Start npm server interactively (quit with ${yellow}q${reset})`);
    console.log(`  ${cyan}once${reset} ${white}help${reset}                    # Show this help message`);
    console.log(`  ${cyan}once${reset} ${white}version${reset}                 # Show ONCE version information`);
    console.log('');
    console.log(`${bold}Demo Features:${reset}`);
    console.log(`  ${green}•${reset} Cross-platform browser auto-opening`);
    console.log(`  ${green}•${reset} Web4 Message component integration`);
    console.log(`  ${green}•${reset} P2P scenario acknowledgments`);
    console.log(`  ${green}•${reset} Interactive demo controls`);
    console.log(`  ${green}•${reset} TTY-aware keyboard input`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset}                    # Launch full interactive demo`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset} ${yellow}--headless${reset}         # Server-only mode for testing`);
    console.log(`  ${cyan}once${reset} ${white}star${reset}                    # Start npm server with interactive control`);
    console.log('');
    console.log(`${bold}Location:${reset} Latest version (${yellow}v${this.onceVersion}${reset})`);
    console.log(`${bold}Path:${reset} ${yellow}scripts/versions/once${this.onceVersion}${reset}`);
  }

  private showHelp(): void {
    const cyan = '\x1b[36m';
    const white = '\x1b[37m';
    const yellow = '\x1b[33m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log('');
    console.log(`${cyan}${bold}🎭 ONCE Interactive Demo${reset} - Web4 Universal P2P Communication Engine`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset}                    # Start interactive demo`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset} ${yellow}--headless${reset}         # Start demo without browser`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset} ${yellow}--help${reset}             # Show demo help`);
    console.log(`  ${cyan}once${reset} ${white}star${reset}                    # Start npm server interactively`);
    console.log(`  ${cyan}once${reset} ${white}help${reset}                    # Show this help`);
    console.log(`  ${cyan}once${reset} ${white}version${reset}                 # Show version info`);
    console.log('');
  }

  private showVersion(): void {
    const yellow = '\x1b[33m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log(`${bold}ONCE Interactive Demo${reset} ${yellow}v${this.onceVersion}${reset}`);
    console.log(`${bold}Web4 Universal P2P Communication Engine${reset}`);
    console.log(`${bold}Path:${reset} ${yellow}${this.projectRoot}/scripts/versions/once${this.onceVersion}${reset}`);
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
    const demoScript = path.join(demoPath, 'interactive-demo.js');

    // Check if demo script exists
    try {
      await import('fs').then(fs => fs.promises.access(demoScript));
    } catch (error) {
      console.log(`❌ ONCE Demo not found at: ${demoScript}`);
      console.log(`📁 Expected path: components/ONCE/${this.onceVersion}/examples/multi-env-demo/`);
      process.exit(1);
    }

    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const magenta = '\x1b[35m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    // Handle demo arguments
    const isHeadless = args.includes('--headless');
    const showHelp = args.includes('--help') || args.includes('help');

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

    // Launch the interactive demo
    const child = spawn('node', [demoScript, ...args], {
      cwd: demoPath,
      stdio: 'inherit'
    });

    child.on('error', (error) => {
      console.error(`❌ Failed to start demo: ${error.message}`);
      process.exit(1);
    });

    child.on('close', (code) => {
      process.exit(code || 0);
    });
  }

  private showDemoHelp(): void {
    const cyan = '\x1b[36m';
    const white = '\x1b[37m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    console.log('');
    console.log(`${cyan}${bold}🎭 ONCE Interactive Demo${reset} ${yellow}v${this.onceVersion}${reset}`);
    console.log(`${bold}Web4 Universal P2P Communication Engine${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset}                    # Start interactive demo with browser`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset} ${yellow}--headless${reset}         # Start demo without browser`);
    console.log(`  ${cyan}once${reset} ${white}demo${reset} ${yellow}--help${reset}             # Show this help`);
    console.log('');
    console.log(`${bold}Demo Controls (interactive mode):${reset}`);
    console.log(`  ${yellow}[s]${reset} Start/Stop ONCE server`);
    console.log(`  ${yellow}[1]${reset} Launch Browser Client`);
    console.log(`  ${yellow}[2]${reset} Launch Node.js Client`);
    console.log(`  ${yellow}[3]${reset} Launch Web Worker Client`);
    console.log(`  ${yellow}[d]${reset} Discover peers`);
    console.log(`  ${yellow}[e]${reset} Exchange scenarios`);
    console.log(`  ${yellow}[q]${reset} Quit demo`);
    console.log('');
    console.log(`${bold}Features:${reset}`);
    console.log(`  ${green}•${reset} Cross-platform browser auto-opening`);
    console.log(`  ${green}•${reset} Web4 Message component integration`);
    console.log(`  ${green}•${reset} P2P scenario acknowledgments`);
    console.log(`  ${green}•${reset} Interactive demo controls`);
    console.log('');
  }

  private async runStar(args: string[]): Promise<void> {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const magenta = '\x1b[35m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    // Find the ONCE component directory
    const oncePath = path.join(this.projectRoot, 'components', 'ONCE', this.onceVersion);
    
    console.log(`${cyan}⭐ Starting ONCE npm server ${yellow}v${this.onceVersion}${reset}${cyan}...${reset}`);
    console.log(`${bold}📁 Server path:${reset} ${yellow}${oncePath}${reset}`);
    console.log(`${magenta}🎮 Press ${yellow}q${reset}${magenta} to quit${reset}`);
    console.log('');

    // Check if package.json exists
    const packageJsonPath = path.join(oncePath, 'package.json');
    try {
      await import('fs').then(fs => fs.promises.access(packageJsonPath));
    } catch (error) {
      console.log(`❌ package.json not found at: ${packageJsonPath}`);
      console.log(`📁 Expected ONCE component at: ${oncePath}`);
      process.exit(1);
    }

    // Start npm start in the ONCE directory
    console.log(`${cyan}🚀 Launching: ${yellow}npm start${reset}`);
    const npmProcess: ChildProcess = spawn('npm', ['start'], {
      cwd: oncePath,
      stdio: ['pipe', 'inherit', 'inherit']
    });

    // Handle npm process errors
    npmProcess.on('error', (error) => {
      console.error(`❌ Failed to start npm server: ${error.message}`);
      process.exit(1);
    });

    // Handle npm process exit
    npmProcess.on('close', (code) => {
      console.log(`${magenta}⭐ npm server stopped${reset}`);
      process.exit(code || 0);
    });

    // Setup keyboard input handling
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      
      process.stdin.on('data', (key: string) => {
        // Handle 'q' to quit
        if (key === 'q' || key === 'Q') {
          console.log(`\n${cyan}🛑 Stopping npm server...${reset}`);
          npmProcess.kill('SIGTERM');
          
          // Ensure cleanup after a timeout
          setTimeout(() => {
            npmProcess.kill('SIGKILL');
            process.exit(0);
          }, 2000);
        }
        
        // Handle Ctrl+C
        if (key === '\u0003') {
          console.log(`\n${cyan}🛑 Interrupted by Ctrl+C${reset}`);
          npmProcess.kill('SIGTERM');
          setTimeout(() => {
            npmProcess.kill('SIGKILL');
            process.exit(0);
          }, 2000);
        }
      });
    }

    // Handle process termination signals
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.on(signal, () => {
        console.log(`\n${cyan}🛑 Received ${signal}, stopping server...${reset}`);
        npmProcess.kill('SIGTERM');
        setTimeout(() => {
          npmProcess.kill('SIGKILL');
          process.exit(0);
        }, 2000);
      });
    });
  }
}

// Main execution
async function main() {
  const cli = new OnceCLI();
  const args = process.argv.slice(2);
  
  try {
    await cli.handleCommand(args);
  } catch (error) {
    console.error(`❌ CLI Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Run CLI if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };