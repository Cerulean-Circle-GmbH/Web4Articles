// Logger.ts: LOG_LEVEL-aware logger for CLI and app classes
export class Logger {
  static getLevel(): number {
    const lvl = Number(process.env.LOG_LEVEL);
    return isNaN(lvl) ? 0 : lvl;
  }
  static log(msg: string, level = 4) {
    if (Logger.getLevel() >= level) {
      console.log(msg);
    }
  }
}
