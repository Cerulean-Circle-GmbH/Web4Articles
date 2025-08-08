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