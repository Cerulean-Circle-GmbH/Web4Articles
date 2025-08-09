import { RangerModel } from '../layer2/RangerModel.ts';
import { RangerView } from '../layer5/RangerView.ts';
import { RangerController } from './RangerController.ts';
import { NodeProcessIO, DeterministicTestIO } from '../io/TerminalIO.ts';

export class TSRanger {
  static async start(): Promise<void> {
    if ((process.env.TSRANGER_V2_LOG || '').toLowerCase() === '1') {
      console.error('[TSRanger v2] active');
    }
    const isTest = (process.env.TSRANGER_TEST_MODE || '').toLowerCase() === '1';
    const io = isTest ? new DeterministicTestIO() : new NodeProcessIO();
    const model = new RangerModel();
    const view = new RangerView();
    const controller = new RangerController(model, view, io);
    await controller.run();
    if (isTest && io instanceof DeterministicTestIO) {
      process.stdout.write(io.toString());
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}` || (process.argv[1] && process.argv[1].endsWith('TSRanger.ts'))) {
  TSRanger.start().catch((error: unknown) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error(`[TSRanger v2] Fatal error: ${message}`);
    process.exitCode = 1;
  });
}