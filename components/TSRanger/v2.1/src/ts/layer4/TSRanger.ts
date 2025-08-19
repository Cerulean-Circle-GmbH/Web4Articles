import { RangerModel } from '../layer2/RangerModel.ts';
import { RangerView } from '../layer5/RangerView.ts';
import { RangerController } from './RangerController.ts';

export class TSRanger {
  static async start(): Promise<void> {
    // Handle EPIPE errors gracefully in test mode
    if (process.env.TSRANGER_TEST_MODE === '1') {
      process.stdout.on('error', (error: any) => {
        if (error.code === 'EPIPE') {
          // Silently exit on EPIPE during testing
          process.exit(0);
        }
        console.error('TSRanger stdout error:', error);
      });
      
      process.on('uncaughtException', (error: any) => {
        if (error.code === 'EPIPE') {
          // Silently exit on EPIPE during testing
          process.exit(0);
        }
        console.error('TSRanger uncaught exception:', error);
        process.exit(1);
      });
    }
    
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