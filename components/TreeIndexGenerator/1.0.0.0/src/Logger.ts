/**
 * Logger - Simple logging class for TreeIndexGenerator
 */

export class Logger {
  private context: string;
  private isDebugEnabled: boolean;

  constructor(context: string) {
    this.context = context;
    this.isDebugEnabled = process.env.DEBUG === 'true' || process.env.DEBUG === '1';
  }

  debug(message: string): void {
    if (this.isDebugEnabled) {
      console.log(`[DEBUG] [${this.context}] ${message}`);
    }
  }

  info(message: string): void {
    console.log(`[INFO] [${this.context}] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] [${this.context}] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] [${this.context}] ${message}`);
  }
}