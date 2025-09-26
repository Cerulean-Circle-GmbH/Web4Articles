/**
 * CLIColors - DRY CLI color constants and utilities
 * 
 * Web4 principle: DRY compliance - eliminate color constant duplication
 * Shared color utility for all Web4 component CLI implementations
 * Validates requirement: d4cbb120-c2e1-4e60-8e68-5b54192f6a92
 */

export class CLIColors {
  /**
   * ANSI color constants
   */
  static readonly CYAN = '\x1b[36m';
  static readonly YELLOW = '\x1b[33m';
  static readonly GREEN = '\x1b[32m';
  static readonly RED = '\x1b[31m';
  static readonly BOLD = '\x1b[1m';
  static readonly RESET = '\x1b[0m';

  /**
   * Color utility methods for DRY compliance
   */
  static colorize(text: string, color: string): string {
    return `${color}${text}${CLIColors.RESET}`;
  }

  static cyan(text: string): string {
    return CLIColors.colorize(text, CLIColors.CYAN);
  }

  static yellow(text: string): string {
    return CLIColors.colorize(text, CLIColors.YELLOW);
  }

  static green(text: string): string {
    return CLIColors.colorize(text, CLIColors.GREEN);
  }

  static red(text: string): string {
    return CLIColors.colorize(text, CLIColors.RED);
  }

  static bold(text: string): string {
    return CLIColors.colorize(text, CLIColors.BOLD);
  }

  /**
   * Combined color methods for common CLI patterns
   */
  static cyanBold(text: string): string {
    return `${CLIColors.BOLD}${CLIColors.CYAN}${text}${CLIColors.RESET}`;
  }

  static greenComment(text: string): string {
    return CLIColors.green(`# ${text}`);
  }

  static yellowParam(text: string): string {
    return CLIColors.yellow(`<${text}>`);
  }

  /**
   * CLI header pattern following requirement-v0.1.2.2 style
   */
  static cliHeader(toolName: string, description: string): string {
    return `${CLIColors.cyanBold(toolName)} ${CLIColors.green(`- ${description}`)}`;
  }

  /**
   * Usage line pattern for consistent CLI formatting
   */
  static usageLine(command: string, args: string, comment: string): string {
    return `  ${CLIColors.cyan(command)} ${CLIColors.yellow(args)}${' '.repeat(Math.max(1, 40 - command.length - args.length))}${CLIColors.greenComment(comment)}`;
  }

  /**
   * Command description pattern
   */
  static commandDesc(command: string, description: string): string {
    return `  ${CLIColors.bold(command)}${' '.repeat(Math.max(1, 15 - command.length))}${description}`;
  }
}