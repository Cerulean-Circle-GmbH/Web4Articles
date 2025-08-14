export interface TerminalIO {
  readonly columns: number;
  readonly rows: number;
  onResize(handler: () => void): void;
  write(text: string): void;
  clear(): void;
}

export class NodeProcessIO implements TerminalIO {
  private resizeHandlers: Array<() => void> = [];
  constructor(private out: NodeJS.WriteStream = process.stdout) {
    this.out.on('resize', () => {
      for (const h of this.resizeHandlers) {
        try { h(); } catch {}
      }
    });
  }
  get columns(): number { return this.out.columns || 120; }
  get rows(): number { return this.out.rows || 30; }
  onResize(handler: () => void): void { this.resizeHandlers.push(handler); }
  write(text: string): void { this.out.write(text); }
  clear(): void { this.out.write('\x1b[2J\x1b[H'); }
}

export class DeterministicTestIO implements TerminalIO {
  private buffer: string[] = [];
  private cols: number;
  private rws: number;
  constructor(columns?: number, rows?: number) {
    const envCols = Number(process.env.TSRANGER_TEST_COLUMNS || process.env.COLUMNS || 240);
    const envRows = Number(process.env.TSRANGER_TEST_ROWS || process.env.LINES || 30);
    this.cols = columns || envCols;
    this.rws = rows || envRows;
  }
  get columns(): number { return this.cols; }
  get rows(): number { return this.rws; }
  onResize(): void { /* no-op for tests */ }
  write(text: string): void { this.buffer.push(text); }
  clear(): void {
    const finalOnly = (process.env.TS_RANGER_TEST_FINAL_ONLY || '').toLowerCase() === '1';
    if (finalOnly) {
      this.buffer = [];
    } else {
      this.buffer.push('\x1b[2J\x1b[H');
    }
  }
  toString(): string { return this.buffer.join(''); }
}