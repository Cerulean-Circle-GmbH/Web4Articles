var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RangerModel } from '../layer2/RangerModel';
import { RangerView } from '../layer5/RangerView';
import { RangerController } from './RangerController';
export class TSRanger {
    static start() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new RangerModel();
            const view = new RangerView();
            const controller = new RangerController(model, view);
            yield controller.run();
        });
    }
}
// CLI entry point
if (import.meta.url === `file://${process.argv[1]}` || (process.argv[1] && process.argv[1].endsWith('TSRanger.ts'))) {
    // Ensure any async errors are surfaced clearly rather than as opaque ESM loader objects
    TSRanger.start().catch((error) => {
        const message = error instanceof Error ? error.stack || error.message : String(error);
        console.error(`[TSRanger] Fatal error: ${message}`);
        process.exitCode = 1;
    });
}
