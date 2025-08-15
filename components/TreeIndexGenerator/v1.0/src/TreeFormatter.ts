/**
 * TreeFormatter - Converts tree nodes to formatted text lines
 */

import type { TreeNode, TreeIndexConfig } from './types.js';

export class TreeFormatter {
  private config: TreeIndexConfig;
  private lines: string[] = [];
  
  // Unicode box-drawing characters
  private readonly BRANCH = '├── ';
  private readonly LAST_BRANCH = '└── ';
  private readonly VERTICAL = '│   ';
  private readonly EMPTY = '    ';

  constructor(config: TreeIndexConfig) {
    this.config = config;
  }

  format(rootNode: TreeNode): string[] {
    this.lines = [];
    
    // Add root directory name
    this.lines.push(rootNode.name + '/');
    
    // Format children
    if (rootNode.children && rootNode.children.length > 0) {
      this.formatChildren(rootNode.children, '');
    }
    
    return this.lines;
  }

  private formatChildren(children: TreeNode[], prefix: string): void {
    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      this.formatNode(child, prefix, isLast);
    });
  }

  private formatNode(node: TreeNode, prefix: string, isLast: boolean): void {
    // Build the line
    let line = prefix;
    line += isLast ? this.LAST_BRANCH : this.BRANCH;
    line += this.formatNodeName(node);
    
    this.lines.push(line);
    
    // Format children if it's a directory
    if (node.type === 'directory' && node.children && node.children.length > 0) {
      const childPrefix = prefix + (isLast ? this.EMPTY : this.VERTICAL);
      this.formatChildren(node.children, childPrefix);
    }
  }

  private formatNodeName(node: TreeNode): string {
    let name = node.name;
    
    // Add trailing slash for directories
    if (node.type === 'directory' && !name.endsWith('/')) {
      name += '/';
    }
    
    // Add size information if configured
    if (this.config.showSizes && node.size !== undefined) {
      name += ` (${this.formatSize(node.size)})`;
    }
    
    // Add date information if configured
    if (this.config.showDates && node.modified) {
      name += ` [${this.formatDate(node.modified)}]`;
    }
    
    // Add error indicator
    if (node.error) {
      name += ' ⚠️';
    }
    
    return name;
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    // Format based on size
    if (unitIndex === 0) {
      return `${size} ${units[unitIndex]}`;
    } else {
      return `${size.toFixed(1)} ${units[unitIndex]}`;
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}