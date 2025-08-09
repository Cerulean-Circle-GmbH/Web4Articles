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

    const gridColumns: string[][] = [
      this.formatColumn('Classes', classes, model.selectedColumn === 0 ? model.selectedIndexPerColumn[0] : -1, colWidth, model.filters[0]),
      this.formatColumn('Methods', methods, model.selectedColumn === 1 ? model.selectedIndexPerColumn[1] : -1, colWidth, model.filters[1]),
      this.formatColumn('Params', params, model.selectedColumn === 2 ? model.selectedIndexPerColumn[2] : -1, colWidth, model.filters[2]),
      this.formatColumn('Preview', [this.buildPlainPreview(model)], model.selectedColumn === 3 ? 0 : -1, colWidth, model.filters[3])
    ];

    // Clear screen and move cursor to top-left
    process.stdout.write('\x1b[2J\x1b[H');

    const maxRows = Math.max(...lines.map(col => col.length));
    for (let r = 0; r < Math.min(maxRows, height - 4); r++) {
      let row = '';
      for (let c = 0; c < 4; c++) {
        const cell = gridColumns[c][r] ?? this.makeCell('', colWidth);
        row += cell;
      }
      process.stdout.write(row + '\n');
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
    const parts = model.buildCommandParts();
    const [cls, method, ...params] = parts;

    const prompt = this.buildPrompt();

    const tokens: string[] = [];
    if (prompt) tokens.push(prompt);
    // tssh in green
    tokens.push(this.style('tssh', { bold: true, colorCode: 32 }));
    if (cls) tokens.push(this.style(cls, { bold: true, colorCode: this.colorCodeForTitle('Classes') }));
    if (method) tokens.push(this.style(method, { bold: true, colorCode: this.colorCodeForTitle('Methods') }));
    for (let i = 0; i < params.length; i++) {
      const inverse = model.paramEntryActive && i === model.paramEntryIndex;
      tokens.push(this.style(params[i], { colorCode: this.colorCodeForTitle('Params'), inverse }));
    }
    return tokens.join(' ');
  }

  private prompt(): string {
    // Prefer $PS1 if present; support common \h, \u, \w escapes
    const ps1 = process.env.PS1 || '';
    if (ps1) {
      const host = this.safeHostname();
      const user = this.safeUsername();
      const pwd = process.cwd();
      const replaced = ps1
        .replace(/\\h/g, host)
        .replace(/\\u/g, user)
        .replace(/\\w/g, pwd)
        .replace(/\n/g, '')
        .replace(/\r/g, '');
      return replaced.trim();
    }
    // Fallback to explicit format
    const host = this.safeHostname();
    const user = this.safeUsername();
    const pwd = process.cwd();
    return `[${host}] ${user}@${pwd}`;
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

  private buildPrompt(): string {
    const ps1 = process.env.PS1 || '';
    if (ps1.trim()) {
      const oneLine = ps1.replace(/\n|\r/g, ' ');
      const stripBracketed = oneLine.replace(/\[[^\]]*\]/g, '');
      const stripAnsi = stripBracketed.replace(/\x1B\[[0-9;]*m/g, '');
      const compact = stripAnsi.replace(/\s+/g, ' ').trim();
      return compact;
    }
    const host = os.hostname();
    const user = (() => { try { return os.userInfo().username; } catch { return 'user'; } })();
    const pwdParts = (process.cwd() || '').split(/[\\/]/);
    const pwdBase = pwdParts[pwdParts.length - 1] || '/';
    return `[${host}] ${user}@${pwdBase}$`;
  }
}