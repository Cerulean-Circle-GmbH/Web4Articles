import { RangerModel } from '../layer2/RangerModel.ts';

export class RangerView {
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
    for (let r = 0; r < Math.min(maxRows, height - 3); r++) {
      let row = '';
      for (let c = 0; c < 4; c++) {
        row += (lines[c][r] || '').padEnd(colWidth);
      }
      process.stdout.write(row + '\n');
    }

    // Colorized command preview above the footer
    const colored = this.buildColoredCommand(model);
    process.stdout.write(colored.slice(0, width - 1) + '\n');

    // Blue background with white text footer (key usage line)
    const footerText = '←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit';
    const footer = this.bgBlue(this.whiteBoldPadded(footerText, width - 1));
    process.stdout.write(footer);
  }

  private buildColoredCommand(model: RangerModel): string {
    const parts = model.buildCommandParts();
    if (parts.length === 0) return '';
    const [cls, method, ...params] = parts;
    const tokens: string[] = [];
    if (cls) tokens.push(this.style(cls, { bold: true, colorCode: this.colorCodeForTitle('Classes') }));
    if (method) tokens.push(this.style(method, { bold: true, colorCode: this.colorCodeForTitle('Methods') }));
    for (let i = 0; i < params.length; i++) {
      const inverse = model.paramEntryActive && i === model.paramEntryIndex;
      tokens.push(this.style(params[i], { colorCode: this.colorCodeForTitle('Params'), inverse }));
    }
    return tokens.join(' ');
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
    const header = `[${title}] ${filter ? '(' + filter + ')' : ''}`;
    const rendered = [this.bold(header)];
    for (let i = 0; i < Math.max(items.length, 1); i++) {
      const label = items[i] ?? '';
      const line = i === selectedIndex ? this.inverse(label || ' ') : (label || ' ');
      rendered.push(line);
    }
    return rendered.map(s => s.length > width ? s.slice(0, width - 1) : s);
  }

  private buildColoredCommand(model: RangerModel): string {
    const parts: string[] = [];
    // Command token (shell-like)
    parts.push(this.fgGreen('tssh'));

    const cls = model.selectedClass || '';
    const mth = model.selectedMethod || '';
    if (cls) parts.push(this.fgCyan(cls));
    if (mth) parts.push(this.fgYellow(mth));

    // Already entered parameter values
    for (let i = 0; i < model.paramValues.length; i++) {
      const val = model.paramValues[i];
      if (val && val.length > 0) parts.push(this.fgMagenta(val));
      else break;
    }
    // Current buffer while entering a parameter
    if (model.paramEntryActive && model.paramEntryBuffer.length > 0) {
      parts.push(this.fgMagenta(this.underline(model.paramEntryBuffer)));
    }

    return parts.join(' ');
  }

  private bold(s: string): string { return `\x1b[1m${s}\x1b[0m`; }
  private inverse(s: string): string { return `\x1b[7m${s}\x1b[0m`; }
  private underline(s: string): string { return `\x1b[4m${s}\x1b[0m`; }
  private fgGreen(s: string): string { return `\x1b[32m${s}\x1b[0m`; }
  private fgCyan(s: string): string { return `\x1b[36m${s}\x1b[0m`; }
  private fgYellow(s: string): string { return `\x1b[33m${s}\x1b[0m`; }
  private fgMagenta(s: string): string { return `\x1b[35m${s}\x1b[0m`; }
  private fgWhite(s: string): string { return `\x1b[37m${s}\x1b[0m`; }
  private bgBlue(s: string): string { return `\x1b[44m${s}\x1b[0m`; }
  private whiteBoldPadded(s: string, width: number): string {
    const text = `\x1b[1m\x1b[37m${s}\x1b[0m`;
    // Pad/truncate without breaking color reset
    const visible = s.length;
    const padding = Math.max(0, width - visible);
    const pad = ' '.repeat(padding);
    return `\x1b[1m\x1b[37m${s}${pad}\x1b[0m`;
  }
}