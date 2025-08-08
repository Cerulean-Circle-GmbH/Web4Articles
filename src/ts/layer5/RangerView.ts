import { RangerModel } from '../layer2/RangerModel.ts';

export class RangerView {
  render(model: RangerModel): void {
    const width = Math.max(20, process.stdout.columns || 120);
    const height = Math.max(3, process.stdout.rows || 30);
    const colWidth = Math.max(10, Math.floor(width / 4) - 2);

    const classes = model.filteredClasses();
    const methods = model.filteredMethods();
    const params = model.filteredParams();

    const lines: string[][] = [
      this.formatColumn('Classes', classes, model.selectedColumn === 0 ? model.selectedIndexPerColumn[0] : -1, colWidth, model.filters[0]),
      this.formatColumn('Methods', methods, model.selectedColumn === 1 ? model.selectedIndexPerColumn[1] : -1, colWidth, model.filters[1]),
      this.formatColumn('Params', params, model.selectedColumn === 2 ? model.selectedIndexPerColumn[2] : -1, colWidth, model.filters[2]),
      this.formatColumn('Preview', [model.buildCommandParts().join(' ')], model.selectedColumn === 3 ? 0 : -1, colWidth, model.filters[3])
    ];

    // Clear screen and move cursor to top-left
    process.stdout.write('\x1b[2J\x1b[H');

    // Reserve last 3 lines: [preview][blank][footer]
    const contentRows = Math.max(0, height - 3);
    const maxRows = Math.max(...lines.map(col => col.length));
    for (let r = 0; r < contentRows; r++) {
      let row = '';
      for (let c = 0; c < 4; c++) {
        const cell = (lines[c][r] || '').slice(0, Math.max(0, colWidth - 1));
        row += cell.padEnd(colWidth);
      }
      process.stdout.write(row.slice(0, Math.max(0, width - 1)) + '\n');
    }

    // Colorized command preview above the blank line and footer
    const colored = this.buildColoredCommand(model);
    process.stdout.write((colored || '').slice(0, Math.max(0, width - 1)) + '\n');

    // Blank spacer line above the footer
    process.stdout.write('\n');

    // Blue background with white text footer (key usage line) on the last line
    const footerText = '←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit';
    const footer = this.footerBlueWhite(this.padVisible(footerText, Math.max(0, width - 1)));
    process.stdout.write(footer);
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
  private underline(s: string): string { return `\x1b[4m${s}\x1b[0m`; }
  private fgGreen(s: string): string { return `\x1b[32m${s}\x1b[0m`; }
  private fgCyan(s: string): string { return `\x1b[36m${s}\x1b[0m`; }
  private fgYellow(s: string): string { return `\x1b[33m${s}\x1b[0m`; }
  private fgMagenta(s: string): string { return `\x1b[35m${s}\x1b[0m`; }

  private padVisible(text: string, width: number): string {
    const visible = Math.max(0, width);
    const trimmed = (text || '').slice(0, visible);
    return trimmed.padEnd(visible);
  }

  private footerBlueWhite(text: string): string {
    // Blue background + white bold foreground for footer line
    return `\x1b[44m\x1b[1m\x1b[37m${text}\x1b[0m`;
  }
}