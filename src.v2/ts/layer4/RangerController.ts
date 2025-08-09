import { Logger } from '../../../src/ts/layer1/Logger.ts';
import { TSCompletion } from '../../../src/ts/layer4/TSCompletion.ts';
import { RangerModel } from '../layer2/RangerModel.ts';
import { RangerView } from '../layer5/RangerView.ts';
import type { TerminalIO } from '../io/TerminalIO.ts';

export class RangerController {
  constructor(private model: RangerModel, private view: RangerView, private io: TerminalIO) {}

  async run(): Promise<void> {
    // Initialize model
    this.model.classes = TSCompletion.getClasses();
    this.model.updateMethods();
    this.model.updateParams();

    const onData = async (key: string) => {
      try {
        if (key === '\u0003' || key === '\u001b' || key === 'q') return; // exit in wrapper

        if (this.model.paramEntryActive) {
          if (key === '\r' || key === ' ') {
            this.commitParamBuffer();
            if (this.model.allParamsFilled()) {
              const parts = this.model.buildCommandParts();
              await this.execute(parts);
              this.model.paramEntryActive = false;
            }
            this.view.render(this.model, this.io);
            return;
          }
          if (key === '\x7f') { this.model.paramEntryBuffer = this.model.paramEntryBuffer.slice(0, -1); this.view.render(this.model, this.io); return; }
          if (key.length === 1 && key >= ' ' && key <= '~') { this.model.paramEntryBuffer += key; this.view.render(this.model, this.io); return; }
          return;
        }

        if (key === '\r') { await this.onEnter(); this.view.render(this.model, this.io); return; }
        if (key === '\u001b[A') { this.moveSelection(-1); this.syncPromptOnMethodNav(); this.view.render(this.model, this.io); return; }
        if (key === '\u001b[B') { this.moveSelection(1); this.syncPromptOnMethodNav(); this.view.render(this.model, this.io); return; }
        if (key === '\u001b[D') { this.changeColumn(-1); this.view.render(this.model, this.io); return; }
        if ((key === '\u001b[C' || key === '\t') && !this.model.promptEditActive) { this.changeColumn(1); this.view.render(this.model, this.io); return; }
        if (key === '\x7f' && !this.model.promptEditActive) { const col = this.model.selectedColumn; this.model.filters[col] = this.model.filters[col].slice(0, -1); this.onFilterChange(); this.view.render(this.model, this.io); return; }

        if (key === '\u001b[D') { if (this.model.promptCursorIndex > 0) { this.model.promptCursorIndex--; this.view.render(this.model, this.io); } return; }
        if (key === '\u001b[B' || key === '\u001b[A') { return; }
        if (key === '\x7f') {
          const cursor = this.model.promptCursorIndex;
          if (cursor > 0) {
            const prevChar = this.model.promptBuffer.charAt(cursor - 1);
            if (prevChar === ' ') {
              if (cursor < this.model.promptBuffer.length) {
                this.model.promptBuffer = this.model.promptBuffer.slice(0, cursor) + this.model.promptBuffer.slice(cursor + 1);
              } else {
                this.model.promptBuffer = this.model.promptBuffer.slice(0, cursor - 1) + this.model.promptBuffer.slice(cursor);
                this.model.promptCursorIndex--;
              }
            } else {
              this.model.promptBuffer = this.model.promptBuffer.slice(0, cursor - 1) + this.model.promptBuffer.slice(cursor);
              this.model.promptCursorIndex--;
            }
            this.model.suppressMethodFilter = false;
            this.model.deriveFiltersFromPrompt();
            this.view.render(this.model, this.io);
          }
          return;
        }

        if (key === '\u001b[C' && this.model.promptEditActive) {
          const tokenIdx = this.model.getCurrentPromptTokenIndex();
          const tokens = this.model.promptBuffer.split(/\s+/);
          const current = tokens[tokenIdx] ?? '';
          if (current.trim().length === 0) { this.changeColumn(1); this.view.render(this.model, this.io); return; }
        }
        if (key === '\t' || key === '\u001b[C') {
          const tokenIdx = this.model.getCurrentPromptTokenIndex();
          const tokens = this.model.promptBuffer.split(/\s+/);
          const current = tokens[tokenIdx] ?? '';
          if (current.trim().length === 0) { this.changeColumn(1); this.view.render(this.model, this.io); return; }
          if (tokenIdx === 0) {
            const classes = TSCompletion.getClasses().filter(c => c.toLowerCase().startsWith(current.toLowerCase()));
            if (classes.length > 0) {
              const chosenClass = classes[0];
              tokens[0] = chosenClass;
              const methods = TSCompletion.getClassMethods(chosenClass);
              if (methods.includes('start')) {
                tokens[1] = 'start';
                this.model.promptBuffer = tokens.join(' ').trim();
                this.model.promptCursorIndex = chosenClass.length + 1;
                this.model.selectedColumn = 1;
                this.model.suppressMethodFilter = true;
              } else {
                // Insert a space to begin method token typing at the correct position
                this.model.promptBuffer = (tokens[0] || '') + ' ';
                this.model.promptCursorIndex = this.model.promptBuffer.length;
                this.model.selectedColumn = 1;
                this.model.suppressMethodFilter = false;
              }
              this.model.deriveFiltersFromPrompt();
              this.view.render(this.model, this.io);
              return;
            }
          } else if (tokenIdx === 1) {
            const cls = this.model.filteredClasses()[this.model.selectedIndexPerColumn[0]];
            if (cls) {
              const methods = TSCompletion.getClassMethods(cls).filter(m => m.toLowerCase().startsWith(current.toLowerCase()));
              if (methods.length > 0) {
                tokens[tokenIdx] = methods[0];
                this.model.promptBuffer = tokens.join(' ').trim();
                this.model.promptCursorIndex = cls.length + 1;
                this.model.selectedColumn = 2;
                this.model.suppressMethodFilter = true;
                this.model.deriveFiltersFromPrompt();
                this.view.render(this.model, this.io);
                return;
              }
            }
          }
          this.model.suppressMethodFilter = false;
          this.view.render(this.model, this.io);
          return;
        }
        if (key.length === 1 && key >= ' ' && key <= '~') {
          const tokenIdx = this.model.getCurrentPromptTokenIndex();
          const tokens = this.model.promptBuffer.split(/\s+/);
          const classToken = tokens[0] ?? '';
          const methodStartIndex = classToken.length + (classToken.length > 0 ? 1 : 0);
          if (tokenIdx === 1 && this.model.promptCursorIndex === methodStartIndex) {
            tokens[1] = key;
            this.model.promptBuffer = (tokens[0] ? tokens[0] + ' ' : '') + (tokens[1] || '');
            this.model.promptCursorIndex = methodStartIndex + 1;
          } else {
            this.model.promptBuffer = this.model.promptBuffer.slice(0, this.model.promptCursorIndex) + key + this.model.promptBuffer.slice(this.model.promptCursorIndex);
            this.model.promptCursorIndex++;
          }
          this.model.suppressMethodFilter = false;
          if (tokenIdx === 1) {
            const parts = this.model.promptBuffer.split(/\s+/);
            const methodTok = parts[1] || '';
            this.model.filters[1] = methodTok;
          }
          this.model.deriveFiltersFromPrompt();
          this.view.render(this.model, this.io);
          return;
        }
      } catch (e: any) {
        Logger.log(`[TSRanger v2] Input error: ${e?.stack || e}`, 'error');
      }
    };

    // Non-interactive test path
    this.view.render(this.model, this.io);
    if ((process.env.TSRANGER_TEST_MODE || '').toLowerCase() === '1' || (process.env.TSRANGER_TEST_INPUT || '').length > 0) {
      const script = process.env.TSRANGER_TEST_INPUT || '';
      const keys = this.parseTestScript(script);
      for (const k of keys) { await onData(k); }
      return;
    }
  }

  private parseTestScript(script: string): string[] {
    const result: string[] = [];
    let i = 0;
    while (i < script.length) {
      if (script[i] === '[') {
        const j = script.indexOf(']', i + 1);
        if (j > i) {
          const token = script.slice(i + 1, j).toLowerCase();
          switch (token) {
            case 'up': result.push('\u001b[A'); break;
            case 'down': result.push('\u001b[B'); break;
            case 'left': result.push('\u001b[D'); break;
            case 'right': result.push('\u001b[C'); break;
            case 'tab': result.push('\t'); break;
            case 'enter': result.push('\r'); break;
            case 'space': result.push(' '); break;
            case 'backspace': result.push('\x7f'); break;
            case 'esc': result.push('\u001b'); break;
            case 'q': result.push('q'); break;
            default: result.push(script.slice(i, j + 1));
          }
          i = j + 1; continue;
        }
      }
      result.push(script[i]); i++;
    }
    return result;
  }

  private onFilterChange(): void {
    const col = this.model.selectedColumn;
    if (col === 0) { this.model.selectedIndexPerColumn[0] = 0; this.model.updateMethods(); this.model.updateParams(); }
    else if (col === 1) { this.model.selectedIndexPerColumn[1] = 0; this.model.updateParams(); }
  }
  private moveSelection(delta: number): void {
    const lists = [this.model.filteredClasses(), this.model.filteredMethods(), this.model.filteredParams(), [this.model.getSelectedDocs()]];
    const col = this.model.selectedColumn;
    const max = Math.max(0, lists[col].length - 1);
    const next = Math.min(max, Math.max(0, this.model.selectedIndexPerColumn[col] + delta));
    this.model.selectedIndexPerColumn[col] = next;
    if (col === 0) { this.model.updateMethods(); this.model.updateParams(); }
    if (col === 1) { this.model.updateParams(); }
  }
  private changeColumn(delta: number): void { const next = Math.min(3, Math.max(0, this.model.selectedColumn + delta)); this.model.selectedColumn = (next as 0 | 1 | 2 | 3); }

  private async onEnter(): Promise<void> {
    const col = this.model.selectedColumn;
    if (col < 3) { this.changeColumn(1); return; }
    const c = this.model.selectedClass; const m = this.model.selectedMethod; if (!c || !m) return;
    if (this.model.params.length > 0 && !this.model.allParamsFilled()) { this.startParamEntry(); return; }
    const parts = this.model.buildCommandParts(); await this.execute(parts);
  }
  private startParamEntry(): void { this.model.paramEntryActive = true; const firstEmpty = this.model.paramValues.findIndex(v => v === ''); this.model.paramEntryIndex = firstEmpty >= 0 ? firstEmpty : 0; this.model.paramEntryBuffer = ''; }
  private commitParamBuffer(): void { const idx = this.model.paramEntryIndex; if (idx >= 0 && idx < this.model.paramValues.length) { this.model.paramValues[idx] = this.model.paramEntryBuffer; } const nextIdx = idx + 1; if (nextIdx < this.model.paramValues.length) { this.model.paramEntryIndex = nextIdx; this.model.paramEntryBuffer = ''; } else { this.model.paramEntryActive = false; this.model.paramEntryBuffer = ''; } }

  private syncPromptOnMethodNav(): void {
    if (this.model.promptEditActive && this.model.selectedColumn === 1) {
      const cls = this.model.selectedClass || '';
      const m = this.model.selectedMethod || '';
      const tokens = this.model.promptBuffer.split(/\s+/);
      tokens[0] = cls; tokens[1] = m;
      this.model.promptBuffer = (cls + (m ? ' ' + m : '')).trim();
      this.model.promptCursorIndex = Math.min(this.model.promptBuffer.length, cls.length + 1);
      this.model.suppressMethodFilter = true; this.model.filters[1] = '';
    }
  }

  private async execute(parts: string[]): Promise<void> {
    if (parts.length < 2) return;
    const [className, methodName, ...params] = parts;
    try {
      let ClassModule: any;
      try { ClassModule = await import(`../../../src/ts/layer1/${className}.ts`); }
      catch (e1) { try { ClassModule = await import(`../../../src/ts/layer2/${className}.ts`); } catch (e2) { throw new Error(`Class import failed for ${className}: ${e1} | ${e2}`); } }
      const ClassRef = ClassModule[className] || ClassModule[className.charAt(0).toUpperCase() + className.slice(1)];
      if (!ClassRef) throw new Error(`Class ${className} not found in module`);
      if (typeof ClassRef[methodName] === 'function') {
        const result = ClassRef[methodName](...params);
        if (result instanceof Promise) { await result; }
        Logger.log(`[TSRanger v2] Executed ${className}.${methodName}(${params.join(', ')})`, 'info');
      } else if (typeof ClassRef['help'] === 'function') {
        ClassRef['help']();
      } else {
        throw new Error(`Method ${methodName} not found on ${className}`);
      }
    } catch (e: any) {
      Logger.log(`[TSRanger v2] Execute error: ${e?.stack || e}`, 'error');
    }
  }
}