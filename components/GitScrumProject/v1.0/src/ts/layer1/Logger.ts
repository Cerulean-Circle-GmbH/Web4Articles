// Logger.ts: LOG_LEVEL-aware logger for CLI and app classes
/**
 * Logger: Minimal, environment-aware logger for debugging and traceability.
 * - LOG_LEVEL=0 (default): Silent (production mode)
 * - LOG_LEVEL=1: Errors only
 * - LOG_LEVEL=2: Warnings and errors
 * - LOG_LEVEL=3: Info, warnings, errors
 * - LOG_LEVEL=4+: Debug, info, warnings, errors
 *
 * Usage: Logger.log('msg', 'debug');
 *
 * First principle: Logging must never affect production behavior or output unless explicitly enabled.
 */
export class Logger {
  static log(msg: string, level: 'debug' | 'info' | 'warn' | 'error' = 'info') {
    const envLevel = parseInt(process.env.LOG_LEVEL || '0', 10);
    const levelMap = { error: 1, warn: 2, info: 3, debug: 4 };
    if (envLevel >= (levelMap[level] || 3)) {
      // Always print errors to stderr, others to stdout
      if (level === 'error') {
        console.error(msg);
      } else {
        console.log(msg);
      }
    }
  }
}