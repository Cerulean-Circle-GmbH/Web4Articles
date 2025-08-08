import { RangerModel } from '../layer2/RangerModel.ts';
import { RangerView } from '../layer5/RangerView.ts';
import { RangerController } from './RangerController.ts';

export class TSRanger {
  static async start(): Promise<void> {
    const model = new RangerModel();
    const view = new RangerView();
    const controller = new RangerController(model, view);
    await controller.run();
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}` || (process.argv[1] && process.argv[1].endsWith('TSRanger.ts'))) {
  // Ensure any async errors are surfaced clearly rather than as opaque ESM loader objects
  TSRanger.start().catch((error: unknown) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error(`[TSRanger] Fatal error: ${message}`);
    process.exitCode = 1;
  });
}