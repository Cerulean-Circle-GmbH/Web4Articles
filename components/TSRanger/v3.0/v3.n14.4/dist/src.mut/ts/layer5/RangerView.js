import os from 'node:os';
import path from 'node:path';
export class RangerView {
    render(model) {
        var _a;
        const width = process.stdout.columns || 120;
        const height = process.stdout.rows || 30;
        const colWidth = Math.max(16, Math.floor(width / 4));
        const classes = model.filteredClasses();
        const methods = model.filteredMethods();
        const params = model.filteredParams();
        const docsText = this.wrapText(model.getSelectedDocs(), colWidth);
        const gridColumns = [
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
                const cell = (_a = gridColumns[c][r]) !== null && _a !== void 0 ? _a : this.makeCell('', colWidth);
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
        process.stdout.write(colored + '\n');
        // One empty line between preview and footer
        process.stdout.write('\n');
        // Blue background with white text footer (key usage line)
        const footerText = '←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit';
        const footer = this.bgBlue(this.whiteBoldPadded(footerText, Math.max(0, width - 1)));
        process.stdout.write(footer);
    }
    buildPlainPreview(model) {
        return model.buildCommandParts().join(' ');
    }
    buildColoredCommand(model) {
        const tokens = [];
        // Prompt
        tokens.push(this.prompt());
        // Suggestion-aware rendering for prompt buffer
        let buffer = model.promptBuffer || '';
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
        else if (tokenIdx === 1) {
            // For method token, suggest selected method name if any
            const selectedMethod = model.selectedMethod || '';
            // When suppressing method filter (navigation/completion), show the full selected method
            const forceSuggestion = model.suppressMethodFilter === true;
            const typedRaw = parts[1] || '';
            const typed = forceSuggestion ? '' : typedRaw;
            if (selectedMethod) {
                const before = parts[0] ? parts[0] + ' ' : '';
                const combined = typed.length > 0
                    ? typed + selectedMethod.slice(typed.length)
                    : selectedMethod;
                display = before + combined;
                buffer = display;
            }
        }
        // Recompute cursor position when suggesting method so it lands on the next letter after typed prefix
        let effectiveCursor = cursor;
        if (tokenIdx === 1) {
            const cls = model.selectedClass || '';
            const typedRaw = (parts[1] || '');
            const typedLen = model.suppressMethodFilter ? 0 : typedRaw.length;
            const methodStart = (cls ? cls.length + 1 : 0);
            effectiveCursor = methodStart + typedLen;
        }
        const before = display.slice(0, effectiveCursor);
        const after = display.slice(effectiveCursor);
        const renderedCursor = this.style(after.length > 0 ? after.charAt(0) : ' ', { inverse: true });
        tokens.push(`${before}${renderedCursor}${(after.length > 0 ? after.slice(1) : '')}`);
        return tokens.join(' ');
    }
    prompt() {
        // Prefer $PS1 if present; support common \h, \u, \w escapes
        const ps1 = process.env.PS1 || '';
        if (ps1) {
            const host = this.safeHostname();
            const user = this.safeUsername();
            // Abbreviate working directory to its basename to keep command tokens visible
            const pwd = path.basename(process.cwd() || '.');
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
    safeHostname() {
        try {
            return os.hostname();
        }
        catch (_a) {
            return 'host';
        }
    }
    safeUsername() {
        var _a;
        try {
            return ((_a = os.userInfo) === null || _a === void 0 ? void 0 : _a.call(os).username) || process.env.USER || 'user';
        }
        catch (_b) {
            return 'user';
        }
    }
    // Footer helpers
    whiteBoldPadded(text, width) {
        const padded = (text || '').slice(0, Math.max(0, width)).padEnd(Math.max(0, width));
        return padded;
    }
    bgBlue(text) {
        // Blue background + white bold foreground for footer
        return `\x1b[44m\x1b[1m\x1b[37m${text}\x1b[0m`;
    }
    formatColumn(title, items, selectedIndex, width, filter) {
        var _a;
        const headerRaw = `[${title}]${filter ? ' (' + filter + ')' : ''}`;
        const colorCode = this.colorCodeForTitle(title);
        const rendered = [];
        // Header cell: size first, then style entire cell
        rendered.push(this.style(this.makeCell(headerRaw, width), { bold: true, colorCode }));
        const rows = Math.max(items.length, 1);
        for (let i = 0; i < rows; i++) {
            const label = (_a = items[i]) !== null && _a !== void 0 ? _a : '';
            const isSelected = i === selectedIndex;
            const cell = this.makeCell(label, width);
            const styled = this.style(cell, { colorCode, inverse: isSelected });
            rendered.push(styled);
        }
        return rendered;
    }
    makeCell(text, width) {
        const raw = (text !== null && text !== void 0 ? text : '').slice(0, Math.max(0, width));
        return raw.padEnd(Math.max(0, width), ' ');
    }
    colorCodeForTitle(title) {
        switch (title) {
            case 'Classes': return 36; // cyan
            case 'Methods': return 33; // yellow
            case 'Params': return 35; // magenta
            case 'Docs': return 34; // blue
            default: return undefined;
        }
    }
    style(text, opts) {
        let open = '';
        if (opts.inverse)
            open += '\x1b[7m';
        if (opts.bold)
            open += '\x1b[1m';
        if (typeof opts.colorCode === 'number')
            open += `\x1b[${opts.colorCode}m`;
        const close = '\x1b[0m';
        return `${open}${text}${close}`;
    }
    wrapText(text, width) {
        const lines = [];
        const words = (text || '').split(/\s+/);
        let current = '';
        for (const w of words) {
            if (!w)
                continue;
            if ((current + (current ? ' ' : '') + w).length <= width) {
                current = current ? current + ' ' + w : w;
            }
            else {
                if (current)
                    lines.push(current);
                // If a single word exceeds width, hard-slice
                if (w.length > width) {
                    for (let i = 0; i < w.length; i += width) {
                        lines.push(w.slice(i, i + width));
                    }
                    current = '';
                }
                else {
                    current = w;
                }
            }
        }
        if (current)
            lines.push(current);
        return lines.length > 0 ? lines : [''];
    }
}
