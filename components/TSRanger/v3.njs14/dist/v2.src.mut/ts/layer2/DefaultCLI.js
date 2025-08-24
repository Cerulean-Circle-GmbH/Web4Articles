var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Logger } from '../layer1/Logger';
export class DefaultCLI {
    constructor(callback) {
        this.callback = callback;
    }
    start() {
        const args = process.argv.slice(2);
        Logger.log('[DefaultCLI] args: ' + JSON.stringify(args), 'debug');
        (() => __awaiter(this, void 0, void 0, function* () {
            const [className, method, ...params] = args;
            let ClassModule, ClassRef;
            try {
                Logger.log(`[DefaultCLI] CLI dispatch: class=${className}, method=${method}, params=${JSON.stringify(params)}`, 'debug');
                if (!className)
                    throw new Error('No class specified');
                Logger.log(`[DefaultCLI] Import attempt: ../layer1/${className}.ts`, 'debug');
                try {
                    Logger.log(`[DefaultCLI] Trying import: ../layer1/${className}.ts`, 'debug');
                    ClassModule = yield import(`../layer1/${className}.ts`);
                }
                catch (e1) {
                    try {
                        Logger.log(`[DefaultCLI] Trying import: ../layer2/${className}.ts`, 'debug');
                        ClassModule = yield import(`../layer2/${className}.ts`);
                    }
                    catch (e2) {
                        Logger.log(`[DefaultCLI] Import failed for both layer1 and layer2: ${e1} | ${e2}`, 'warn');
                        throw e2;
                    }
                }
                // Try both exact and capitalized class name
                ClassRef = ClassModule[className] || ClassModule[className.charAt(0).toUpperCase() + className.slice(1)];
                Logger.log(`[DefaultCLI] ClassRef resolved: ${!!ClassRef}`, 'debug');
            }
            catch (e) {
                Logger.log(`[DefaultCLI] Could not import class: ${className} (${e})`, 'error');
                // fallback to OOSH
                const OOSHModule = yield import('../layer1/OOSH');
                const OOSH = OOSHModule.OOSH;
                Logger.log('[DefaultCLI] Fallback to OOSH.help()', 'warn');
                OOSH.help();
                process.exit(0);
                return;
            }
            if (ClassRef && typeof ClassRef[method] === 'function') {
                Logger.log(`[DefaultCLI] Calling ${className}.${method}()`, 'info');
                const result = ClassRef[method](...params);
                if (result instanceof Promise) {
                    yield result;
                }
                process.exit(0);
                return;
            }
            else if (ClassRef && typeof ClassRef['help'] === 'function') {
                Logger.log(`[DefaultCLI] Fallback to ${className}.help()`, 'warn');
                ClassRef['help']();
                process.exit(0);
                return;
            }
            else {
                Logger.log(`[DefaultCLI] No such method: ${method} on ${className}`, 'error');
                const OOSHModule = yield import('../layer1/OOSH');
                const OOSH = OOSHModule.OOSH;
                OOSH.help();
                process.exit(1);
            }
        }))();
    }
}
