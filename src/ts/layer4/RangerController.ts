/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

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

    // Normal interactive setup (tests may use non-interactive path below)

    const exitOnAltQ = (process.env.TSRANGER_ALTQ_EXIT || '').toLowerCase() === '1' ||
      (process.env.TSRANGER_ALTQ_EXIT || '').toLowerCase() === 'true';

    const onData = async (key: string) => {
      try {
        if (exitOnAltQ && (key === '\u001bq' || key === '\u001bQ')) { // Alt+Q often arrives as ESC + 'q'
          this.cleanup();
          process.exit(0);
          return;
        }
        if (key === '\u0003' /* Ctrl-C */ || key === '\u001b' /* Esc */ || key === 'q') {
          this.cleanup();
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
          // Sync prompt with selection when navigating Methods column
          if (this.model.promptEditActive && this.model.selectedColumn === 1) {
            const cls = this.model.selectedClass || '';
            const m = this.model.selectedMethod || '';
            const tokens = this.model.promptBuffer.split(/\s+/);
            tokens[0] = cls;
            tokens[1] = m;
            this.model.promptBuffer = (cls + (m ? ' ' + m : '')).trim();
            // While navigating methods, keep cursor at the beginning of the method token
            this.model.promptCursorIndex = Math.min(this.model.promptBuffer.length, cls.length + 1);
            // Keep method filter suppressed during navigation; do not re-derive to avoid resetting selection
            this.model.suppressMethodFilter = true;
            this.model.filters[1] = '';
          }
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[B') { // Down
          this.moveSelection(1);
          if (this.model.promptEditActive && this.model.selectedColumn === 1) {
            const cls = this.model.selectedClass || '';
            const m = this.model.selectedMethod || '';
            const tokens = this.model.promptBuffer.split(/\s+/);
            tokens[0] = cls;
            tokens[1] = m;
            this.model.promptBuffer = (cls + (m ? ' ' + m : '')).trim();
            this.model.promptCursorIndex = Math.min(this.model.promptBuffer.length, cls.length + 1);
            this.model.suppressMethodFilter = true;
            this.model.filters[1] = '';
          }
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[D') { // Left
          this.changeColumn(-1);
          this.view.render(this.model);
          return;
        }
        if ((key === '\u001b[C' || key === '\t') && !this.model.promptEditActive) { // Right or Tab when not editing prompt
          this.changeColumn(1);
          this.view.render(this.model);
          return;
        }
        if (key === '\x7f' && !this.model.promptEditActive) { // Backspace (filter editing when not in prompt)
          const col = this.model.selectedColumn;
          this.model.filters[col] = this.model.filters[col].slice(0, -1);
          this.onFilterChange();
          this.view.render(this.model);
          return;
        }
        // Prompt-line editing model (Task 7)
        if (key === '\u001b[D') {
          // Move cursor left in prompt
          if (this.model.promptCursorIndex > 0) {
            this.model.promptCursorIndex--;
            this.view.render(this.model);
          }
          return;
        }
        if (key === '\u001b[B' || key === '\u001b[A') {
          // ignore vertical arrows in prompt edit
          return;
        }
        if (key === '\x7f') { // Backspace in prompt
          const cursor = this.model.promptCursorIndex;
          if (cursor > 0) {
            const prevChar = this.model.promptBuffer.charAt(cursor - 1);
            if (prevChar === ' ') {
              // At token boundary: delete current char instead of space to avoid merging tokens
              if (cursor < this.model.promptBuffer.length) {
                this.model.promptBuffer = this.model.promptBuffer.slice(0, cursor) + this.model.promptBuffer.slice(cursor + 1);
                // Cursor stays at same logical position
              } else {
                // No char to delete after; fallback to normal backspace
                this.model.promptBuffer = this.model.promptBuffer.slice(0, cursor - 1) + this.model.promptBuffer.slice(cursor);
                this.model.promptCursorIndex--;
              }
            } else {
              // Normal backspace: remove char before cursor
              this.model.promptBuffer = this.model.promptBuffer.slice(0, cursor - 1) + this.model.promptBuffer.slice(cursor);
              this.model.promptCursorIndex--;
            }
            // User edited; allow method filter to reflect current token
            this.model.suppressMethodFilter = false;
            this.model.deriveFiltersFromPrompt();
            this.view.render(this.model);
          }
          return;
        }
        // In prompt editing, Right arrow should move to next column when current token is empty
        if (key === '\u001b[C' && this.model.promptEditActive) {
          const tokenIdx = this.model.getCurrentPromptTokenIndex();
          const tokens = this.model.promptBuffer.split(/\s+/);
          const current = tokens[tokenIdx] ?? '';
          if (current.trim().length === 0) {
            this.changeColumn(1);
            this.view.render(this.model);
            return;
          }
        }
        if (key === '\t' || key === '\u001b[C') {
          // Shell-like completion for current token
          const tokenIdx = this.model.getCurrentPromptTokenIndex();
          const tokens = this.model.promptBuffer.split(/\s+/);
          const current = tokens[tokenIdx] ?? '';
          if (current.trim().length === 0) {
            // For empty token, treat Tab/Right as navigation to next column
            this.changeColumn(1);
            this.view.render(this.model);
            return;
          }
          if (tokenIdx === 0) {
            const classes = TSCompletion.getClasses().filter(c => c.toLowerCase().startsWith(current.toLowerCase()));
            if (classes.length > 0) {
              const chosenClass = classes[0];
              tokens[0] = chosenClass;
              // Auto-suggest default method 'start' if it exists
              const methods = TSCompletion.getClassMethods(chosenClass);
              if (methods.includes('start')) {
                tokens[1] = 'start';
                // Cursor positioned at 's' of start
                this.model.promptBuffer = tokens.join(' ').trim();
                this.model.promptCursorIndex = chosenClass.length + 1; // space after class
                // Move selection context to Methods column
                this.model.selectedColumn = 1;
                // Do not set method filter yet; allow user to choose alternatives
                this.model.suppressMethodFilter = true;
              } else {
                this.model.promptBuffer = tokens.join(' ').trim();
                this.model.promptCursorIndex = this.model.promptBuffer.length;
                this.model.selectedColumn = 1;
                this.model.suppressMethodFilter = false;
              }
              this.model.deriveFiltersFromPrompt();
              this.view.render(this.model);
              return;
            }
          } else if (tokenIdx === 1) {
            const cls = this.model.filteredClasses()[this.model.selectedIndexPerColumn[0]];
            if (cls) {
              const methods = TSCompletion.getClassMethods(cls).filter(m => m.toLowerCase().startsWith(current.toLowerCase()));
              if (methods.length > 0) {
                tokens[tokenIdx] = methods[0];
                this.model.promptBuffer = tokens.join(' ').trim();
                // Cursor at start of method token
                this.model.promptCursorIndex = cls.length + 1; // position at start of method token
                // Move selection context to Params column after method completion
                this.model.selectedColumn = 2;
                // Keep method filter suppressed while user may navigate
                this.model.suppressMethodFilter = true;
                this.model.deriveFiltersFromPrompt();
                this.view.render(this.model);
                return;
              }
            }
          }
          // If no completion, fall through to column advance behavior handled above
          this.model.suppressMethodFilter = false;
          this.view.render(this.model);
          return;
        }
        if (key.length === 1 && key >= ' ' && key <= '~') {
          // Insert printable at cursor into prompt buffer with special handling for method token start
          const tokenIdx = this.model.getCurrentPromptTokenIndex();
          const tokens = this.model.promptBuffer.split(/\s+/);
          // Detect start position of current token
          const classToken = tokens[0] ?? '';
          const methodStartIndex = classToken.length + (classToken.length > 0 ? 1 : 0);
          if (tokenIdx === 1 && this.model.promptCursorIndex === methodStartIndex) {
            // Replace existing method token with the typed character to avoid prefix like 'cstart'
            tokens[1] = key;
            // Preserve any tokens beyond method
            this.model.promptBuffer = (tokens[0] ? tokens[0] + ' ' : '') + (tokens[1] || '');
            this.model.promptCursorIndex = methodStartIndex + 1;
          } else {
            this.model.promptBuffer = this.model.promptBuffer.slice(0, this.model.promptCursorIndex) + key + this.model.promptBuffer.slice(this.model.promptCursorIndex);
            this.model.promptCursorIndex++;
          }
          this.model.suppressMethodFilter = false;
          // Explicitly reflect typed method prefix into Methods filter when editing method token
          if (tokenIdx === 1) {
            const parts = this.model.promptBuffer.split(/\s+/);
            const methodTok = parts[1] || '';
            this.model.filters[1] = methodTok;
          }
          this.model.deriveFiltersFromPrompt();
          this.view.render(this.model);
          return;
        }
      } catch (e: any) {
        Logger.log(`[TSRanger] Input error: ${e?.stack || e}`, 'error');
      }
    };

    // Non-interactive test mode: feed scripted keys and exit without attaching listeners
    if ((process.env.TSRANGER_TEST_MODE || '').toLowerCase() === '1' || (process.env.TSRANGER_TEST_INPUT || '').length > 0) {
      // Initial render
      this.view.render(this.model);
      const script = process.env.TSRANGER_TEST_INPUT || '';
      const keys = this.parseTestScript(script);
      for (const k of keys) {
        await onData(k);
      }
      this.cleanup();
      return;
    }

    // Interactive TTY setup
    const { stdin } = process;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    stdin.on('data', onData);
    // On terminal resize, re-render to respect new dimensions
    const onResize = () => {
      try { this.view.render(this.model); } catch {}
    };
    process.stdout.on('resize', onResize);
    // Initial render
    this.view.render(this.model);

    // Optional test mode: feed scripted keys then exit keeping screen
    if ((process.env.TSRANGER_TEST_MODE || '').toLowerCase() === '1') {
      const script = process.env.TSRANGER_TEST_INPUT || '';
      const keys = this.parseTestScript(script);
      for (const k of keys) {
        await onData(k);
      }
      if ((process.env.TS_RANGER_TEST_FINAL_ONLY || '').toLowerCase() === '1') {
        // Leave final frame only; rely on current screen
      }
      this.cleanup();
      process.exit(0);
    }
  }

  private parseTestScript(script: string): string[] {
    // Tokens like [down][right][tab]abc[left][q]
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
            default:
              // treat unknown as literal sequence
              result.push(script.slice(i, j + 1));
          }
          i = j + 1;
          continue;
        }
      }
      // literal characters until next bracket
      result.push(script[i]);
      i++;
    }
    return result;
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
    const lists = [this.model.filteredClasses(), this.model.filteredMethods(), this.model.filteredParams(), [this.model.getSelectedDocs()]];
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

  private cleanup(): void {
    try {
      const { stdin } = process;
      stdin.setRawMode?.(false);
      stdin.pause();
      try { process.stdout.removeAllListeners('resize'); } catch {}
    } catch {}
  }
}