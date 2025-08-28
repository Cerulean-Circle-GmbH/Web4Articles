/**
 * SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum
 * Copyright (c) 2025 The Web4Articles Authors
 * Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)
 * Backlinks: /LICENSE , /AI-GPL.md
 * Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.
 */

import fs from 'fs';
import path from 'path';

export class LicenseTool {
  static help(): void {
    console.log(`LicenseTool CLI

Usage:
  tssh LicenseTool help                 Show help
  tssh LicenseTool check                Check headers (non-zero exit if missing)
  tssh LicenseTool apply                Apply/update headers in-place

Notes:
  - Supports comment-aware headers for: ts, tsx, js, jsx, md, puml, plantuml, sh, bash, yml, yaml
  - Skips binary and non-commentable formats (e.g., json)
  - Backlinks to ./LICENSE (AGPLv3) and ./AI-GPL.md
`);
  }

  static async check(): Promise<void> {
    const projectRoot = this.resolveProjectRoot();
    const files = this.findTargetFiles(projectRoot);
    const missing: string[] = [];
    for (const file of files) {
      const rel = path.relative(projectRoot, file);
      const content = fs.readFileSync(file, 'utf8');
      const style = this.getCommentStyle(file);
      if (!style) continue;
      if (!this.hasLicenseHeader(content, style)) {
        missing.push(rel);
      }
    }
    if (missing.length > 0) {
      console.error('[LicenseTool] Missing/invalid headers in:');
      for (const m of missing) console.error(' - ' + m);
      process.exitCode = 2;
    } else {
      console.log('[LicenseTool] All checked files have headers.');
    }
  }

  static async apply(): Promise<void> {
    const projectRoot = this.resolveProjectRoot();
    const files = this.findTargetFiles(projectRoot);
    let updated = 0;
    for (const file of files) {
      const style = this.getCommentStyle(file);
      if (!style) continue;
      const original = fs.readFileSync(file, 'utf8');
      const withHeader = this.ensureHeader(original, style, path.sep + 'AI-GPL.md', path.sep + 'LICENSE');
      if (withHeader !== original) {
        fs.writeFileSync(file, withHeader, 'utf8');
        updated++;
      }
    }
    console.log(`[LicenseTool] Updated ${updated} files.`);
  }

  private static resolveProjectRoot(): string {
    let dir = process.cwd();
    while (dir !== path.dirname(dir)) {
      if (fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'src', 'ts'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    return process.cwd();
  }

  private static findTargetFiles(root: string): string[] {
    const results: string[] = [];
    const ignoreDirs = new Set<string>(['.git', 'node_modules', 'dist', 'build', '.turbo', '.next', 'coverage']);
    const visit = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.DS_Store')) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (ignoreDirs.has(entry.name)) continue;
          visit(full);
        } else if (entry.isFile()) {
          if (this.isTargetFile(full)) results.push(full);
        }
      }
    };
    visit(root);
    return results;
  }

  private static isTargetFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    if (!ext) return false;
    const supported = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.puml', '.plantuml', '.sh', '.bash', '.yml', '.yaml']);
    if (!supported.has(ext)) return false;
    // Skip lockfiles and generated artifacts
    const base = path.basename(filePath);
    if (base === 'package-lock.json') return false;
    return true;
  }

  private static getCommentStyle(filePath: string): { kind: 'block' | 'line' | 'md'; line: string; open?: string; close?: string } | null {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx') {
      return { kind: 'block', line: ' * ', open: '/**', close: ' */' };
    }
    if (ext === '.md') {
      return { kind: 'md', line: '', open: '<!--', close: '-->' };
    }
    if (ext === '.puml' || ext === '.plantuml') {
      return { kind: 'line', line: "' " };
    }
    if (ext === '.sh' || ext === '.bash' || ext === '.yml' || ext === '.yaml') {
      return { kind: 'line', line: '# ' };
    }
    return null;
  }

  private static buildHeader(style: { kind: 'block' | 'line' | 'md'; line: string; open?: string; close?: string }, relAIGPL: string, relAGPL: string): string {
    const year = new Date().getUTCFullYear();
    const lines = [
      `SPDX-License-Identifier: AGPL-3.0-only + AI-GPL-Addendum`,
      `Copyright (c) ${year} The Web4Articles Authors`,
      `Copyleft: See AGPLv3 (./LICENSE) and AI-GPL Addendum (./AI-GPL.md)`,
      `Backlinks: ${relAGPL} , ${relAIGPL}`,
      'Use of `scrum.pmo` roles/process docs with AI is subject to AI-GPL copyleft unless dual-licensed.',
    ];
    if (style.kind === 'block') {
      return `${style.open}\n${lines.map(l => style.line + l).join('\n')}\n${style.close}\n\n`;
    }
    if (style.kind === 'line') {
      return `${lines.map(l => style.line + l).join('\n')}\n\n`;
    }
    // md: prefer visible header since markdown supports HTML comments; keep it non-rendering
    return `${style.open}\n${lines.join('\n')}\n${style.close}\n\n`;
  }

  private static hasLicenseHeader(content: string, style: { kind: 'block' | 'line' | 'md'; line: string; open?: string; close?: string }): boolean {
    const marker1 = 'SPDX-License-Identifier:';
    const marker2 = 'AI-GPL';
    // Only check first 30 lines
    const head = content.split(/\r?\n/).slice(0, 30).join('\n');
    return head.includes(marker1) && head.includes(marker2);
  }

  private static ensureHeader(content: string, style: { kind: 'block' | 'line' | 'md'; line: string; open?: string; close?: string }, relAIGPL: string, relAGPL: string): string {
    const header = this.buildHeader(style, relAIGPL, relAGPL);
    if (this.hasLicenseHeader(content, style)) {
      // Replace existing header block if present at top
      const updated = content.replace(this.headerRegex(style), header.trimEnd() + '\n');
      if (updated !== content) return updated;
      return content; // Already ok
    }
    return header + content;
  }

  private static headerRegex(style: { kind: 'block' | 'line' | 'md'; line: string; open?: string; close?: string }): RegExp {
    if (style.kind === 'block') {
      // /** ... */ followed by optional blank lines
      return /^\s*\/\*\*[\s\S]*?\*\/\s*\n?/;
    }
    if (style.kind === 'md') {
      return /^\s*<!--[\s\S]*?-->\s*\n?/;
    }
    // line comments until blank line
    return /^(?:[ \t]*[^\S\r\n]*[#'] .*\n)+\n?/;
  }
}