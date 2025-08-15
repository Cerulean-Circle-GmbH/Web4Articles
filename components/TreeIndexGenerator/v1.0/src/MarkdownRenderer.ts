/**
 * MarkdownRenderer - Generates markdown output for tree index
 */

import type { TreeMetadata, TreeIndexConfig } from './types.js';

export class MarkdownRenderer {
  render(treeLines: string[], metadata: TreeMetadata, config: TreeIndexConfig): string {
    const sections: string[] = [];
    
    // Add format version comment
    sections.push('<!-- tree-index-format: 1.0 -->');
    sections.push('');
    
    // Header
    sections.push(this.renderHeader(metadata));
    sections.push('');
    
    // Configuration section (if not minimal format)
    if (config.format !== 'minimal') {
      sections.push(this.renderConfiguration(config));
      sections.push('');
    }
    
    // Structure section
    sections.push(this.renderStructure(treeLines));
    sections.push('');
    
    // Summary section (if not minimal format)
    if (config.format !== 'minimal') {
      sections.push(this.renderSummary(metadata));
      sections.push('');
    }
    
    // Errors section (if any)
    if (metadata.errors && metadata.errors.length > 0) {
      sections.push(this.renderErrors(metadata.errors));
      sections.push('');
    }
    
    return sections.join('\n').trim() + '\n';
  }

  private renderHeader(metadata: TreeMetadata): string {
    const timestamp = this.formatTimestamp(metadata.generatedAt);
    return `# Tree Index - Generated ${timestamp}\n\n## Directory: ${metadata.directory}`;
  }

  private renderConfiguration(config: TreeIndexConfig): string {
    const lines: string[] = ['## Configuration'];
    
    lines.push(`- Max Depth: ${config.maxDepth}`);
    lines.push(`- Exclude Patterns: ${config.excludePatterns.join(', ')}`);
    lines.push(`- Include Files: ${config.includeFiles}`);
    lines.push(`- Sort By: ${config.sortBy}`);
    
    return lines.join('\n');
  }

  private renderStructure(treeLines: string[]): string {
    const lines: string[] = ['## Structure', '```'];
    
    // Escape any backticks in the tree content
    const escapedLines = treeLines.map(line => 
      line.replace(/`/g, '\\`')
    );
    
    lines.push(...escapedLines);
    lines.push('```');
    
    return lines.join('\n');
  }

  private renderSummary(metadata: TreeMetadata): string {
    const lines: string[] = ['## Summary'];
    
    lines.push(`- Total Files: ${metadata.totalFiles}`);
    lines.push(`- Total Directories: ${metadata.totalDirectories}`);
    
    if (metadata.totalSize > 0) {
      lines.push(`- Total Size: ${this.formatSize(metadata.totalSize)}`);
    }
    
    lines.push(`- Generated: ${this.formatTimestamp(metadata.generatedAt)}`);
    
    return lines.join('\n');
  }

  private renderErrors(errors: string[]): string {
    const lines: string[] = ['## Errors and Warnings'];
    
    errors.forEach(error => {
      lines.push(`- ${this.escapeMarkdown(error)}`);
    });
    
    return lines.join('\n');
  }

  private formatTimestamp(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    if (unitIndex === 0) {
      return `${size} ${units[unitIndex]}`;
    } else {
      return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
  }

  private escapeMarkdown(text: string): string {
    // Escape common markdown characters
    return text
      .replace(/\*/g, '\\*')
      .replace(/_/g, '\\_')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}