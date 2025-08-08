import { Logger } from '../layer1/Logger.ts';
import { TSCompletion } from '../layer4/TSCompletion.ts';
import { RangerModel } from '../layer2/RangerModel.ts';
import { RangerView } from '../layer5/RangerView.ts';

export class RangerController {
  constructor(private model: RangerModel, private view: RangerView) {}

  async run(): Promise<void> {
    // Initialize model
    this.model.classes = TSCompletion.getClasses();
    this.model.updateMethods();
    this.model.updateParams();

    // Setup TTY
    const { stdin, stdout } = process;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const onResize = () => {
      try {
        this.view.render(this.model);
      } catch (e: any) {
        Logger.log(`[TSRanger] Resize render error: ${e?.stack || e}`, 'error');
      }
    };
    stdout.on('resize', onResize);

    const onData = async (key: string) => {
      try {
        if (key === '\u0003' /* Ctrl-C */ || key === '\u001b' /* Esc */ || key === 'q') {
          this.cleanup(onResize);
          return;
        }

        // When entering parameter values, only process typing, backspace, space and enter
        if (this.model.paramEntryActive) {
          if (key === '\r' || key === ' ') {
            // Commit current buffer to current parameter and advance
            this.commitParamBuffer();
            if (this.model.allParamsFilled()) {
              // Execute immediately when all params are filled
              const parts = this.model.buildCommandParts();
              await this.execute(parts);
              // After execution, reset param entry
              this.model.paramEntryActive = false;
            }
            this.view.render(this.model);
            return;
          }
          if (key === '\x7f') {
            // Backspace in buffer
            this.model.paramEntryBuffer = this.model.paramEntryBuffer.slice(0, -1);
            this.view.render(this.model);
            return;
          }
          if (key.length === 1 && key >= ' ' && key <= '~') {
            // Append printable to buffer
            this.model.paramEntryBuffer += key;
            this.view.render(this.model);
            return;
          }
          // Ignore navigation while in param entry
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
        if (key === '\x7f') { // Backspace (filter editing)
          const col = this.model.selectedColumn;
          this.model.filters[col] = this.model.filters[col].slice(0, -1);
          this.onFilterChange();
          this.view.render(this.model);
          return;
        }
        if (key.length === 1 && key >= ' ' && key <= '~') { // Printable -> filter typing
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
      // Params filter is no longer used for entering values; keep as list filter only
    }
  }

  private moveSelection(delta: number): void {
    const lists = [this.model.filteredClasses(), this.model.filteredMethods(), this.model.filteredParams(), [this.model.buildCommandParts().join(' ')]];
    const col = this.model.selectedColumn;
    const max = Math.max(0, lists[col].length - 1);
    const next = Math.min(max, Math.max(0, this.model.selectedIndexPerColumn[col] + delta));
    this.model.selectedIndexPerColumn[col] = next;
    if (col === 0) { this.model.updateMethods(); this.model.updateParams(); }
    if (col === 1) { this.model.updateParams(); }
  }

  private changeColumn(delta: number): void {
    const next = Math.min(3, Math.max(0, this.model.selectedColumn + delta));
    this.model.selectedColumn = (next as 0 | 1 | 2 | 3);
  }

  private async onEnter(): Promise<void> {
    const col = this.model.selectedColumn;
    if (col < 3) {
      // Drill down to next column
      this.changeColumn(1);
      return;
    }
    // On Preview column: start param entry or execute
    const c = this.model.selectedClass;
    const m = this.model.selectedMethod;
    if (!c || !m) return;
    if (this.model.params.length > 0 && !this.model.allParamsFilled()) {
      this.startParamEntry();
      return;
    }
    // Execute preview command
    const parts = this.model.buildCommandParts();
    await this.execute(parts);
  }

  private startParamEntry(): void {
    this.model.paramEntryActive = true;
    // Find first empty parameter slot
    const firstEmpty = this.model.paramValues.findIndex(v => v === '');
    this.model.paramEntryIndex = firstEmpty >= 0 ? firstEmpty : 0;
    this.model.paramEntryBuffer = '';
  }

  private commitParamBuffer(): void {
    const idx = this.model.paramEntryIndex;
    if (idx >= 0 && idx < this.model.paramValues.length) {
      this.model.paramValues[idx] = this.model.paramEntryBuffer;
    }
    // Advance to next param
    const nextIdx = idx + 1;
    if (nextIdx < this.model.paramValues.length) {
      this.model.paramEntryIndex = nextIdx;
      this.model.paramEntryBuffer = '';
    } else {
      // Completed all params
      this.model.paramEntryActive = false;
      this.model.paramEntryBuffer = '';
    }
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

  private cleanup(onResize?: () => void): void {
    try {
      const { stdin, stdout } = process;
      stdin.setRawMode?.(false);
      stdin.pause();
      if (onResize) stdout.off('resize', onResize);
    } catch {}
  }
}