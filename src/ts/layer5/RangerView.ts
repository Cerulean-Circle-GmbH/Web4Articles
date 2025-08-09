import os from 'node:os';
import { RangerModel } from '../layer2/RangerModel.ts';

export class RangerView {
  render(model: RangerModel): void {
    const width = process.stdout.columns || 120;
    const height = process.stdout.rows || 30;
    const colWidth = Math.max(16, Math.floor(width / 4));

    const classes = model.filteredClasses();
    const methods = model.filteredMethods();
    const params = model.filteredParams();

    const docsText = this.wrapText(model.getSelectedDocs(), colWidth);
    const gridColumns: string[][] = [
      this.formatColumn('Classes', classes, model.selectedColumn === 0 ? model.selectedIndexPerColumn[0] : -1, colWidth, model.filters[0]),
      this.formatColumn('Methods', methods, model.selectedColumn === 1 ? model.selectedIndexPerColumn[1] : -1, colWidth, model.filters[1]),
      this.formatColumn('Params', params, model.selectedColumn === 2 ? model.selectedIndexPerColumn[2] : -1, colWidth, model.filters[2]),
      this.formatColumn('Docs', docsText, model.selectedColumn === 3 ? 0 : -1, colWidth, model.filters[3])
    ];

    // Clear screen and move cursor to top-left
    process.stdout.write('\x1b[2J\x1b[H');

    // Compute grid rows: reserve 3 lines (blank, command, blank) + 1 footer = 4
    const maxRows = Math.max(...gridColumns.map(col => col.length));
    const gridRows = Math.min(maxRows, Math.max(0, height - 4));
    for (let r = 0; r < gridRows; r++) {
      let row = '';
      for (let c = 0; c < 4; c++) {
        const cell = gridColumns[c][r] ?? this.makeCell('', colWidth);
        row += cell;
      }
      process.stdout.write(row + '\n');
    }

    // Top padding to keep footer at last line while preserving exactly one blank line above preview
    const topPad = Math.max(0, (height - 4) - gridRows);
    if (topPad > 0) {
      process.stdout.write('\n'.repeat(topPad));
    }

    // One empty line above preview
    process.stdout.write('\n');

    // Colorized command preview above the footer, prefixed by prompt
    const colored = this.buildColoredCommand(model);
    process.stdout.write(colored.slice(0, width - 1) + '\n');

    // One empty line between preview and footer
    process.stdout.write('\n');

    // Blue background with white text footer (key usage line)
    const footerText = '←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit';
    const footer = this.bgBlue(this.whiteBoldPadded(footerText, Math.max(0, width - 1)));
    process.stdout.write(footer);
  }

  private buildPlainPreview(model: RangerModel): string {
    return model.buildCommandParts().join(' ');
  }

  private buildColoredCommand(model: RangerModel): string {
    const tokens: string[] = [];
    // Prompt
    tokens.push(this.prompt());

    // Suggestion-aware rendering for prompt buffer
    const buffer = model.promptBuffer || '';
    const cursor = Math.max(0, Math.min(buffer.length, model.promptCursorIndex || 0));
    const parts = buffer.split(/\s+/);
    const tokenIdx = (buffer.slice(0, cursor).split(/\s+/).length - 1);

    let display = buffer;
    if (tokenIdx === 0) {
      const prefix = parts[0] || '';
      const suggestion = (model.filteredClasses()[0] || '');
      if (suggestion && prefix && suggestion.toLowerCase().startsWith(prefix.toLowerCase())) {
        display = suggestion + (parts.length > 1 ? (' ' + parts.slice(1).join(' ')) : '');
      }
    }

    const before = display.slice(0, cursor);
    const after = display.slice(cursor);
    const renderedCursor = this.style(after.length > 0 ? after.charAt(0) : ' ', { inverse: true });
    tokens.push(`${before}${renderedCursor}${(after.length > 0 ? after.slice(1) : '')}`);

    return tokens.join(' ');
  }

  private prompt(): string {
    // Prefer $PS1 if present; support common \h, \u, \w escapes
    const ps1 = process.env.PS1 || '';
    if (ps1) {
      const host = this.safeHostname();
      const user = this.safeUsername();
      const pwd = process.cwd();
      const isRoot = (typeof process.getuid === 'function' && process.getuid() === 0) || user === 'root';
      const userColored = this.style(user, { colorCode: isRoot ? 31 : 36 }); // red if root else cyan
      const pwdColored = this.style(pwd, { colorCode: 33 }); // yellow
      const replaced = ps1
        .replace(/\\h/g, host)
        .replace(/\\u/g, userColored)
        .replace(/\\w/g, pwdColored)
        .replace(/\n/g, '')
        .replace(/\r/g, '');
      return replaced.trim();
    }
    // Fallback to explicit format
    const host = this.safeHostname();
    const user = this.safeUsername();
    const pwd = process.cwd();
    const isRoot = (typeof process.getuid === 'function' && process.getuid() === 0) || user === 'root';
    const userColored = this.style(user, { colorCode: isRoot ? 31 : 36 });
    const pwdColored = this.style(pwd, { colorCode: 33 });
    return `[${host}] ${userColored}@${pwdColored}`;
  }

  private safeHostname(): string {
    try { return os.hostname(); } catch { return 'host'; }
  }
  private safeUsername(): string {
    try { return (os.userInfo?.().username) || process.env.USER || 'user'; } catch { return 'user'; }
  }

  // Footer helpers
  private whiteBoldPadded(text: string, width: number): string {
    const padded = (text || '').slice(0, Math.max(0, width)).padEnd(Math.max(0, width));
    return padded;
  }

  private bgBlue(text: string): string {
    // Blue background + white bold foreground for footer
    return `\x1b[44m\x1b[1m\x1b[37m${text}\x1b[0m`;
  }

  private formatColumn(title: string, items: string[], selectedIndex: number, width: number, filter: string): string[] {
    const headerRaw = `[${title}]${filter ? ' (' + filter + ')' : ''}`;
    const colorCode = this.colorCodeForTitle(title);
    const rendered: string[] = [];
    // Header cell: size first, then style entire cell
    rendered.push(this.style(this.makeCell(headerRaw, width), { bold: true, colorCode }));
    const rows = Math.max(items.length, 1);
    for (let i = 0; i < rows; i++) {
      const label = items[i] ?? '';
      const isSelected = i === selectedIndex;
      const cell = this.makeCell(label, width);
      const styled = this.style(cell, { colorCode, inverse: isSelected });
      rendered.push(styled);
    }
    return rendered;
  }

  private makeCell(text: string, width: number): string {
    const raw = (text ?? '').slice(0, Math.max(0, width));
    return raw.padEnd(Math.max(0, width), ' ');
  }

  private colorCodeForTitle(title: string): number | undefined {
    switch (title) {
      case 'Classes': return 36; // cyan
      case 'Methods': return 33; // yellow
      case 'Params': return 35; // magenta
      case 'Docs': return 34; // blue
      default: return undefined;
    }
  }

  private style(text: string, opts: { colorCode?: number; bold?: boolean; inverse?: boolean }): string {
    let open = '';
    if (opts.inverse) open += '\x1b[7m';
    if (opts.bold) open += '\x1b[1m';
    if (typeof opts.colorCode === 'number') open += `\x1b[${opts.colorCode}m`;
    const close = '\x1b[0m';
    return `${open}${text}${close}`;
  }

  private wrapText(text: string, width: number): string[] {
    const lines: string[] = [];
    const words = (text || '').split(/\s+/);
    let current = '';
    for (const w of words) {
      if (!w) continue;
      if ((current + (current ? ' ' : '') + w).length <= width) {
        current = current ? current + ' ' + w : w;
      } else {
        if (current) lines.push(current);
        // If a single word exceeds width, hard-slice
        if (w.length > width) {
          for (let i = 0; i < w.length; i += width) {
            lines.push(w.slice(i, i + width));
          }
          current = '';
        } else {
          current = w;
        }
      }
    }
    if (current) lines.push(current);
    return lines.length > 0 ? lines : [''];
  }

  // buildPrompt was unused; prompt() handles PS1/fallback
}