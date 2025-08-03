
import { Logger } from '../layer1/Logger.js';

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
        // Try to import from layer1, then layer2, always with .ts extension
        try {
          Logger.log(`[DefaultCLI] Trying import: ../layer1/${className}.ts`);
          ClassModule = await import(`../layer1/${className}.ts`);
        } catch (e1) {
          try {
            Logger.log(`[DefaultCLI] Trying import: ../layer2/${className}.ts`);
            ClassModule = await import(`../layer2/${className}.ts`);
          } catch (e2) {
            Logger.log(`[DefaultCLI] Import failed for both layer1 and layer2: ${e1} | ${e2}`);
            throw e2;
          }
        }
        // Try both exact and capitalized class name
        ClassRef = ClassModule[className] || ClassModule[className.charAt(0).toUpperCase() + className.slice(1)];
      } catch (e) {
        Logger.log(`[DefaultCLI] Could not import class: ${className} (${e})`);
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
