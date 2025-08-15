/**
 * DirectoryTraverser - Handles file system traversal with filtering
 */

import { promises as fs } from 'fs';
import { join, basename, resolve } from 'path';
import { minimatch } from 'minimatch';
import type { TreeNode, TreeIndexConfig, TraverseOptions } from './types.js';
import { Logger } from './Logger.js';

export class DirectoryTraverser {
  private config: TreeIndexConfig;
  private logger: Logger;
  private errors: string[] = [];
  private fileCount = 0;

  constructor(config: TreeIndexConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async traverse(path: string, options?: Partial<TraverseOptions>): Promise<TreeNode> {
    const opts: TraverseOptions = {
      currentDepth: options?.currentDepth ?? 0,
      visitedPaths: options?.visitedPaths ?? new Set<string>()
    };

    const resolvedPath = resolve(path);
    const name = basename(resolvedPath) || resolvedPath;

    // Check for circular references
    if (opts.visitedPaths.has(resolvedPath)) {
      this.logger.warn(`Circular reference detected: ${resolvedPath}`);
      return {
        name,
        path: resolvedPath,
        type: 'symlink',
        error: 'Circular reference'
      };
    }

    opts.visitedPaths.add(resolvedPath);

    try {
      const stats = await fs.lstat(resolvedPath);

      if (stats.isSymbolicLink() && !this.config.followSymlinks) {
        return {
          name: name + ' → ...',
          path: resolvedPath,
          type: 'symlink'
        };
      }

      if (stats.isFile()) {
        this.fileCount++;
        return {
          name,
          path: resolvedPath,
          type: 'file',
          size: stats.size,
          modified: stats.mtime
        };
      }

      if (stats.isDirectory()) {
        const node: TreeNode = {
          name,
          path: resolvedPath,
          type: 'directory',
          children: []
        };

        // Check depth limit
        if (opts.currentDepth >= this.config.maxDepth) {
          node.children = [{
            name: '...',
            path: join(resolvedPath, '...'),
            type: 'directory'
          }];
          return node;
        }

        // Read directory contents
        const entries = await fs.readdir(resolvedPath);
        const children: TreeNode[] = [];

        for (const entry of entries) {
          const entryPath = join(resolvedPath, entry);
          
          // Apply filters
          if (this.shouldExclude(entry, entryPath)) {
            continue;
          }

          // Check file limit
          if (this.config.maxFiles && this.fileCount >= this.config.maxFiles) {
            this.logger.warn(`File limit reached (${this.config.maxFiles})`);
            children.push({
              name: '... (file limit reached)',
              path: entryPath,
              type: 'file'
            });
            break;
          }

          try {
            const childNode = await this.traverse(entryPath, {
              currentDepth: opts.currentDepth + 1,
              visitedPaths: opts.visitedPaths
            });
            children.push(childNode);
          } catch (error) {
            this.logger.debug(`Error traversing ${entryPath}: ${error}`);
            children.push({
              name: entry + ' (error)',
              path: entryPath,
              type: 'file',
              error: String(error)
            });
          }
        }

        // Sort children
        node.children = this.sortNodes(children);
        return node;
      }

      // Unknown type
      return {
        name,
        path: resolvedPath,
        type: 'file'
      };

    } catch (error) {
      const errorMsg = `Failed to traverse ${resolvedPath}: ${error}`;
      this.errors.push(errorMsg);
      this.logger.error(errorMsg);
      
      return {
        name: name + ' (error)',
        path: resolvedPath,
        type: 'file',
        error: String(error)
      };
    }
  }

  private shouldExclude(name: string, path: string): boolean {
    // Check include patterns first (they override excludes)
    for (const pattern of this.config.includePatterns) {
      if (minimatch(name, pattern)) {
        return false;
      }
    }

    // Check exclude patterns
    for (const pattern of this.config.excludePatterns) {
      if (minimatch(name, pattern)) {
        return true;
      }
    }

    return false;
  }

  private sortNodes(nodes: TreeNode[]): TreeNode[] {
    const sorted = [...nodes];
    
    sorted.sort((a, b) => {
      // Directories first
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;

      // Then by selected criteria
      let comparison = 0;
      
      switch (this.config.sortBy) {
        case 'size':
          comparison = (a.size ?? 0) - (b.size ?? 0);
          break;
        case 'date':
          comparison = (a.modified?.getTime() ?? 0) - (b.modified?.getTime() ?? 0);
          break;
        case 'name':
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return this.config.sortReverse ? -comparison : comparison;
    });

    return sorted;
  }

  getErrors(): string[] {
    return this.errors;
  }
}