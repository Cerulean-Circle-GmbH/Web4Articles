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
          if (this.model.promptEditActive && this.model.selectedColumn === 0) {
            // Navigation in Classes column: clear prompt to exit filter mode
            this.model.promptBuffer = '';
            this.model.promptCursorIndex = 0;
            this.model.promptEditActive = false;
            this.clearClassFilter();
          } else if (this.model.promptEditActive && this.model.selectedColumn === 1) {
            // Sync prompt with selection when navigating Methods column
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
            this.clearMethodFilter();
          }
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[B') { // Down
          this.moveSelection(1);
          if (this.model.promptEditActive && this.model.selectedColumn === 0) {
            // Navigation in Classes column: clear prompt to exit filter mode
            this.model.promptBuffer = '';
            this.model.promptCursorIndex = 0;
            this.model.promptEditActive = false;
            this.clearClassFilter();
          } else if (this.model.promptEditActive && this.model.selectedColumn === 1) {
            const cls = this.model.selectedClass || '';
            const m = this.model.selectedMethod || '';
            const tokens = this.model.promptBuffer.split(/\s+/);
            tokens[0] = cls;
            tokens[1] = m;
            this.model.promptBuffer = (cls + (m ? ' ' + m : '')).trim();
            this.model.promptCursorIndex = Math.min(this.model.promptBuffer.length, cls.length + 1);
            this.model.suppressMethodFilter = true;
            this.clearMethodFilter();
          }
          this.view.render(this.model);
          return;
        }
        if (key === '\u001b[D' && !this.model.promptEditActive) { // Left - column navigation only when not editing prompt
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
          this.handleBackspaceFilter();
          return;
        }
        // Prompt-line editing model (Task 7)
        if (key === '\u001b[D' || key === '\u001b[Z') {
          // DRY PRINCIPLE: Both [left] and [ShiftTab] use same retreat method
          this.handleLeftShiftTabRetreat();
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
        if (key === '\t' || key === '\u001b[C') {
          // DRY PRINCIPLE: Both Tab and Right use same advancement method  
          this.handleTabRightAdvancement();
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
            this.setMethodFilter(methodTok);
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
    const currentColumn = this.model.selectedColumn;
    const next = Math.min(3, Math.max(0, currentColumn + delta));
    
    // Clear Classes filter when moving left from Methods to Classes
    if (currentColumn === 1 && next === 0 && delta < 0) {
      this.clearClassFilter();
    }
    
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

  /**
   * RADICAL OOP: Simple shared advancement method for [tab] and [right] keys
   * DRY PRINCIPLE: Both keys use identical logic
   * User requirement: Logger → Logger log with cursor at [l]og
   */
  private handleTabRightAdvancement(): void {
    const tokenIdx = this.model.getCurrentPromptTokenIndex();
    const tokens = this.model.promptBuffer.split(/\s+/);
    const current = tokens[tokenIdx] ?? '';

    // SIMPLE ADVANCEMENT: If no text typed and we have a selected class, add first method
    if (current.trim().length === 0 && tokenIdx === 0 && this.model.selectedClass) {
      const selectedClass = this.model.selectedClass;
      const methods = TSCompletion.getClassMethods(selectedClass);
      
      if (methods.length > 0) {
        const firstMethod = methods[0];
        
        // Create "Logger log" format
        this.model.promptBuffer = `${selectedClass} ${firstMethod}`;
        
        // Position cursor at first character of method: Logger [l]og
        this.model.promptCursorIndex = selectedClass.length + 1;
        
        // Update model state
        this.model.selectedColumn = 1; // Move to Methods column  
        this.model.suppressMethodFilter = true;
        this.model.deriveFiltersFromPrompt();
        this.view.render(this.model);
        return;
      }
    }
    
    // FALLBACK: Use existing advancement behavior (move to next column)
    this.changeColumn(1);
    this.view.render(this.model);
  }

  /**
   * RADICAL OOP: Shared retreat method for [left] and [ShiftTab] keys
   * DRY PRINCIPLE: Both keys use identical logic for retreat operations
   * 
   * Handles retreat from class+method back to class-only:
   * Logger log → Logger (with cursor at [L]ogger)
   */
  private handleLeftShiftTabRetreat(): void {
    const tokenIdx = this.model.getCurrentPromptTokenIndex();
    
    // RETREAT FROM METHOD: If we're at method position, remove method and go back to class
    if (tokenIdx === 1) {
      const tokens = this.model.promptBuffer.split(/\s+/);
      if (tokens.length >= 2 && tokens[0] && tokens[1]) {
        // Remove method, keep only class: "Logger log" → "Logger"
        this.model.promptBuffer = tokens[0];
        
        // Position cursor at first character of class: [L]ogger
        this.model.promptCursorIndex = 0;
        
        // Update model state
        this.model.selectedColumn = 0; // Move back to Classes column
        this.model.suppressMethodFilter = false;
        this.model.deriveFiltersFromPrompt();
        this.view.render(this.model);
        return;
      }
    }
    
    // COLUMN NAVIGATION RETREAT: If we're in Methods column, move back to Classes and clear filter
    if (this.model.selectedColumn === 1) {
      this.model.selectedColumn = 0; // Move back to Classes column
      this.clearClassFilter();
      this.view.render(this.model);
      return;
    }
    
    // FALLBACK: Move cursor left in prompt (normal cursor movement)
    if (this.model.promptCursorIndex > 0) {
      this.model.promptCursorIndex--;
      this.view.render(this.model);
    }
  }

  /**
   * RADICAL OOP: Filter clearing methods - centralized filter management
   * DRY PRINCIPLE: Eliminates repeated filter manipulation patterns
   */

  /**
   * Clear Classes filter and trigger appropriate updates
   * DRY: Consolidates `filters[0] = ''; onFilterChange();` pattern
   */
  private clearClassFilter(): void {
    this.model.filters[0] = '';
    this.onFilterChange();
  }

  /**
   * Clear Methods filter without triggering full filter change processing
   * DRY: Consolidates `filters[1] = '';` pattern used during navigation
   */
  private clearMethodFilter(): void {
    this.model.filters[1] = '';
  }

  /**
   * Set Methods filter to specific value
   * DRY: Consolidates `filters[1] = value;` pattern
   */
  private setMethodFilter(value: string): void {
    this.model.filters[1] = value;
  }

  /**
   * Clear filter for specific column and trigger updates
   * DRY: Consolidates column-specific filter clearing logic
   */
  private clearColumnFilter(columnIndex: number): void {
    this.model.filters[columnIndex] = '';
    this.onFilterChange();
  }

  /**
   * Handle backspace filter editing - reduces current column filter by one character
   * DRY: Consolidates backspace filter editing pattern
   */
  private handleBackspaceFilter(): void {
    const col = this.model.selectedColumn;
    this.model.filters[col] = this.model.filters[col].slice(0, -1);
    this.onFilterChange();
    this.view.render(this.model);
  }
}