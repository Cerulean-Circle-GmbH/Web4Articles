import { TSCompletion } from './TSCompletion.ts';
import { Logger } from '../layer1/Logger.ts';

// Model representing the current UI state for TS Ranger
class RangerModel {
  classes: string[] = [];
  methods: string[] = [];
  params: string[] = [];

  selectedColumn: 0 | 1 | 2 | 3 = 0; // 0: Classes, 1: Methods, 2: Params, 3: Preview
  selectedIndexPerColumn: number[] = [0, 0, 0, 0];

  filters: string[] = ['', '', '', ''];

  get selectedClass(): string | undefined {
    return this.filteredClasses()[this.selectedIndexPerColumn[0]];
  }

  get selectedMethod(): string | undefined {
    return this.filteredMethods()[this.selectedIndexPerColumn[1]];
  }

  get selectedParam(): string | undefined {
    return this.filteredParams()[this.selectedIndexPerColumn[2]];
  }

  filteredClasses(): string[] {
    const f = this.filters[0];
    if (!f) return this.classes;
    return this.classes.filter(c => c.toLowerCase().startsWith(f.toLowerCase()));
  }

  filteredMethods(): string[] {
    const f = this.filters[1];
    if (!f) return this.methods;
    return this.methods.filter(m => m.toLowerCase().startsWith(f.toLowerCase()));
  }

  filteredParams(): string[] {
    const f = this.filters[2];
    if (!f) return this.params;
    return this.params.filter(p => p.toLowerCase().startsWith(f.toLowerCase()));
  }

  buildCommandParts(): string[] {
    const parts: string[] = [];
    const c = this.selectedClass;
    const m = this.selectedMethod;
    if (c) parts.push(c);
    if (m) parts.push(m);
    // Params: use filter as current token if present, else selected item
    const currentParamToken = this.filters[2];
    if (c && m) {
      if (currentParamToken) {
        // Try default value completion for token
        const defaultVals = TSCompletion.getMethodParameters(c, m, currentParamToken);
        if (defaultVals.length > 0) {
          parts.push(defaultVals[0]);
        } else {
          parts.push(currentParamToken);
        }
      } else {
        const p = this.selectedParam;
        if (p) parts.push(p);
      }
    }
    return parts;
  }

  updateMethods(): void {
    const c = this.selectedClass;
    this.methods = c ? TSCompletion.getClassMethods(c) : [];
    this.selectedIndexPerColumn[1] = 0;
    this.filters[1] = '';
  }

  updateParams(): void {
    const c = this.selectedClass;
    const m = this.selectedMethod;
    this.params = c && m ? TSCompletion.getMethodParameters(c, m) : [];
    this.selectedIndexPerColumn[2] = 0;
    this.filters[2] = '';
  }
}

// Minimal view using ANSI escape codes
class RangerView {
  render(model: RangerModel): void {
    const width = process.stdout.columns || 120;
    const height = process.stdout.rows || 30;
    const colWidth = Math.max(20, Math.floor(width / 4) - 2);

    const classes = model.filteredClasses();
    const methods = model.filteredMethods();
    const params = model.filteredParams();

    const preview = model.buildCommandParts().join(' ');

    const lines: string[][] = [
      this.formatColumn('Classes', classes, model.selectedColumn === 0 ? model.selectedIndexPerColumn[0] : -1, colWidth, model.filters[0]),
      this.formatColumn('Methods', methods, model.selectedColumn === 1 ? model.selectedIndexPerColumn[1] : -1, colWidth, model.filters[1]),
      this.formatColumn('Params', params, model.selectedColumn === 2 ? model.selectedIndexPerColumn[2] : -1, colWidth, model.filters[2]),
      this.formatColumn('Preview', [preview], model.selectedColumn === 3 ? 0 : -1, colWidth, model.filters[3])
    ];

    // Clear screen and move cursor to top-left
    process.stdout.write('\x1b[2J\x1b[H');

    const maxRows = Math.max(...lines.map(col => col.length));
    for (let r = 0; r < Math.min(maxRows, height - 2); r++) {
      let row = '';
      for (let c = 0; c < 4; c++) {
        row += (lines[c][r] || '').padEnd(colWidth);
      }
      process.stdout.write(row + '\n');
    }

    const footer = '←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/exec  q/Esc: quit';
    process.stdout.write('\n' + footer.slice(0, width - 1));
  }

  private formatColumn(title: string, items: string[], selectedIndex: number, width: number, filter: string): string[] {
    const header = `[${title}] ${filter ? '(' + filter + ')' : ''}`;
    const rendered = [this.bold(header)];
    for (let i = 0; i < Math.max(items.length, 1); i++) {
      const label = items[i] ?? '';
      const line = i === selectedIndex ? this.inverse(label || ' ') : (label || ' ');
      rendered.push(line);
    }
    return rendered.map(s => s.length > width ? s.slice(0, width - 1) : s);
  }

  private bold(s: string): string { return `\x1b[1m${s}\x1b[0m`; }
  private inverse(s: string): string { return `\x1b[7m${s}\x1b[0m`; }
}

// Controller handling keyboard and execution
class RangerController {
  constructor(private model: RangerModel, private view: RangerView) {}

  async run(): Promise<void> {
    // Initialize model
    this.model.classes = TSCompletion.getClasses();
    this.model.updateMethods();
    this.model.updateParams();

    // Setup TTY
    const { stdin } = process;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const onData = async (key: string) => {
      try {
        if (key === '\u0003' /* Ctrl-C */ || key === '\u001b' /* Esc */ || key === 'q') {
          this.cleanup();
          return;
        }
        if (key === '\r') { // Enter
          await this.onEnter();
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[A') { // Up
          this.moveSelection(-1);
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[B') { // Down
          this.moveSelection(1);
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[D') { // Left
          this.changeColumn(-1);
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[C') { // Right
          this.changeColumn(1);
          this.view.render(this.model);
          return;
        }
        if (key === '\x7f') { // Backspace
          const col = this.model.selectedColumn;
          this.model.filters[col] = this.model.filters[col].slice(0, -1);
          this.onFilterChange();
          this.view.render(this.model);
          return;
        }
        if (key.length === 1 && key >= ' ' && key <= '~') { // Printable
          const col = this.model.selectedColumn;
          this.model.filters[col] += key;
          this.onFilterChange();
          this.view.render(this.model);
          return;
        }
      } catch (e: any) {
        Logger.log(`[TSRanger] Input error: ${e?.stack || e}`, 'error');
      }
    };

    stdin.on('data', onData);
    // Initial render
    this.view.render(this.model);
  }

  private onFilterChange(): void {
    const col = this.model.selectedColumn;
    if (col === 0) {
      // Classes filter; reset selection and dependents
      this.model.selectedIndexPerColumn[0] = 0;
      this.model.updateMethods();
      this.model.updateParams();
    } else if (col === 1) {
      this.model.selectedIndexPerColumn[1] = 0;
      this.model.updateParams();
    } else if (col === 2) {
      // Params filter; attempt default value mapping in preview only
      // No list mutation here
    }
  }

  private moveSelection(delta: number): void {
    const col = this.model.selectedColumn;
    const lists = [this.model.filteredClasses(), this.model.filteredMethods(), this.model.filteredParams(), [this.model.buildCommandParts().join(' ')]];
    const max = Math.max(0, lists[col].length - 1);
    const next = Math.min(max, Math.max(0, this.model.selectedIndexPerColumn[col] + delta));
    this.model.selectedIndexPerColumn[col] = next;
    if (col === 0) { this.model.updateMethods(); this.model.updateParams(); }
    if (col === 1) { this.model.updateParams(); }
  }

  private changeColumn(delta: number): void {
    const next = Math.min(3, Math.max(0, this.model.selectedColumn + delta));
    this.model.selectedColumn = next;
  }

  private async onEnter(): Promise<void> {
    const col = this.model.selectedColumn;
    if (col < 3) {
      // Drill down to next column
      this.changeColumn(1);
      return;
    }
    // Execute preview command
    const parts = this.model.buildCommandParts();
    await this.execute(parts);
  }

  private async execute(parts: string[]): Promise<void> {
    if (parts.length < 2) return; // Need class and method
    const [className, methodName, ...params] = parts;
    try {
      let ClassModule: any;
      try {
        ClassModule = await import(`../layer1/${className}.ts`);
      } catch (e1) {
        try {
          ClassModule = await import(`../layer2/${className}.ts`);
        } catch (e2) {
          throw new Error(`Class import failed for ${className}: ${e1} | ${e2}`);
        }
      }
      const ClassRef = ClassModule[className] || ClassModule[className.charAt(0).toUpperCase() + className.slice(1)];
      if (!ClassRef) throw new Error(`Class ${className} not found in module`);
      if (typeof ClassRef[methodName] === 'function') {
        const result = ClassRef[methodName](...params);
        if (result instanceof Promise) {
          await result;
        }
        Logger.log(`[TSRanger] Executed ${className}.${methodName}(${params.join(', ')})`, 'info');
      } else if (typeof ClassRef['help'] === 'function') {
        ClassRef['help']();
      } else {
        throw new Error(`Method ${methodName} not found on ${className}`);
      }
    } catch (e: any) {
      Logger.log(`[TSRanger] Execute error: ${e?.stack || e}`, 'error');
    }
  }
}

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
  TSRanger.start();
}