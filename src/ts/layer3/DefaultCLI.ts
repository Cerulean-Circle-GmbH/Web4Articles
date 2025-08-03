// Logger class for LOG_LEVEL-aware logging
class Logger {
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

export class DefaultCLI {
  private callback: (args: string[]) => void;

  constructor(callback: (args: string[]) => void) {
    this.callback = callback;
  }

  start(): void {
    const args = process.argv.slice(2);
    Logger.log('[DefaultCLI] args: ' + JSON.stringify(args));
    (async () => {
      const [className, method, ...params] = args;
      let ClassModule, ClassRef;
      try {
        if (!className) throw new Error('No class specified');
        // Try to import from layer1, then layer2
        try {
          ClassModule = await import(`../layer1/${className}.ts`);
        } catch {
          ClassModule = await import(`../layer2/${className}.ts`);
        }
        ClassRef = ClassModule[className];
      } catch (e) {
        Logger.log(`[DefaultCLI] Could not import class: ${className}`);
        // fallback to OOSH
        const OOSHModule = await import('../layer1/OOSH.ts');
        const OOSH = OOSHModule.OOSH;
        Logger.log('[DefaultCLI] Fallback to OOSH.help()');
        OOSH.help();
        process.exit(0);
        return;
      }
      if (ClassRef && typeof ClassRef[method] === 'function') {
        Logger.log(`[DefaultCLI] Calling ${className}.${method}()`);
        ClassRef[method](...params);
        process.exit(0);
        return;
      } else if (ClassRef && typeof ClassRef['help'] === 'function') {
        Logger.log(`[DefaultCLI] Fallback to ${className}.help()`);
        ClassRef['help']();
        process.exit(0);
        return;
      } else {
        Logger.log(`[DefaultCLI] No such method: ${method} on ${className}`);
        const OOSHModule = await import('../layer1/OOSH.ts');
        const OOSH = OOSHModule.OOSH;
        OOSH.help();
        process.exit(1);
      }
    })();
  }
}
