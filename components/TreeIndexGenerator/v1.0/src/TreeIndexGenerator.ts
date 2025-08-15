/**
 * TreeIndexGenerator - Main orchestrator for generating tree.index.md files
 * Following strict TypeScript ESM and radical OOP principles
 */

import { promises as fs } from 'fs';
import { join, relative, basename } from 'path';
import { DirectoryTraverser } from './DirectoryTraverser.js';
import { TreeFormatter } from './TreeFormatter.js';
import { MarkdownRenderer } from './MarkdownRenderer.js';
import { Logger } from './Logger.js';
import type { TreeIndexConfig, TreeNode, TreeMetadata } from './types.js';

export class TreeIndexGenerator {
  private config: TreeIndexConfig;
  private traverser: DirectoryTraverser;
  private formatter: TreeFormatter;
  private renderer: MarkdownRenderer;
  private logger: Logger;

  constructor(config: Partial<TreeIndexConfig> = {}) {
    this.config = this.mergeWithDefaults(config);
    this.logger = new Logger('TreeIndexGenerator');
    this.traverser = new DirectoryTraverser(this.config, this.logger);
    this.formatter = new TreeFormatter(this.config);
    this.renderer = new MarkdownRenderer();
  }

  /**
   * Generate tree index for a directory and return as string
   */
  async generate(targetPath: string): Promise<string> {
    this.logger.info(`Generating tree index for: ${targetPath}`);
    
    try {
      // Verify path exists
      const stats = await fs.stat(targetPath);
      if (!stats.isDirectory()) {
        throw new Error(`Path is not a directory: ${targetPath}`);
      }

      // Traverse directory structure
      const startTime = Date.now();
      const rootNode = await this.traverser.traverse(targetPath);
      const traversalTime = Date.now() - startTime;
      this.logger.debug(`Traversal completed in ${traversalTime}ms`);

      // Format tree structure
      const treeLines = this.formatter.format(rootNode);

      // Generate metadata
      const metadata = this.generateMetadata(rootNode, targetPath);

      // Render markdown
      const markdown = this.renderer.render(treeLines, metadata, this.config);
      
      this.logger.info(`Tree index generated successfully`);
      return markdown;
    } catch (error) {
      this.logger.error(`Failed to generate tree index: ${error}`);
      throw error;
    }
  }

  /**
   * Generate tree index and write to file
   */
  async generateToFile(targetPath: string, outputPath?: string): Promise<void> {
    const markdown = await this.generate(targetPath);
    
    // Default output path is tree.index.md in target directory
    const finalOutputPath = outputPath || join(targetPath, 'tree.index.md');
    
    try {
      await fs.writeFile(finalOutputPath, markdown, 'utf8');
      this.logger.info(`Tree index written to: ${finalOutputPath}`);
    } catch (error) {
      this.logger.error(`Failed to write tree index file: ${error}`);
      throw error;
    }
  }

  /**
   * Static method for CLI entry point
   */
  static async start(args: string[] = []): Promise<void> {
    console.log('TreeIndexGenerator CLI started');
    console.log('Arguments:', args);
    
    // Parse arguments (simplified for now)
    const targetPath = args[0] || process.cwd();
    console.log('Target path:', targetPath);
    
    const generator = new TreeIndexGenerator();
    
    try {
      await generator.generateToFile(targetPath);
      console.log('Tree index generation completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  }

  private mergeWithDefaults(config: Partial<TreeIndexConfig>): TreeIndexConfig {
    return {
      maxDepth: config.maxDepth ?? 4,
      includeFiles: config.includeFiles ?? true,
      followSymlinks: config.followSymlinks ?? false,
      excludePatterns: config.excludePatterns ?? [
        'node_modules',
        '.git',
        '.DS_Store',
        'Thumbs.db',
        '*.log',
        '.env*',
        'dist',
        'build',
        'coverage'
      ],
      includePatterns: config.includePatterns ?? [],
      useGitignore: config.useGitignore ?? true,
      showSizes: config.showSizes ?? true,
      showDates: config.showDates ?? false,
      sortBy: config.sortBy ?? 'name',
      sortReverse: config.sortReverse ?? false,
      format: config.format ?? 'standard',
      encoding: config.encoding ?? 'utf8',
      maxFiles: config.maxFiles ?? 10000,
      timeout: config.timeout ?? 30000
    };
  }

  private generateMetadata(rootNode: TreeNode, targetPath: string): TreeMetadata {
    const stats = this.calculateStats(rootNode);
    
    return {
      generatedAt: new Date(),
      directory: relative(process.cwd(), targetPath) || '.',
      totalFiles: stats.files,
      totalDirectories: stats.directories,
      totalSize: stats.size,
      errors: this.traverser.getErrors()
    };
  }

  private calculateStats(node: TreeNode, stats = { files: 0, directories: 0, size: 0 }): { files: number; directories: number; size: number } {
    if (node.type === 'file') {
      stats.files++;
      stats.size += node.size || 0;
    } else if (node.type === 'directory') {
      stats.directories++;
      if (node.children) {
        for (const child of node.children) {
          this.calculateStats(child, stats);
        }
      }
    }
    
    return stats;
  }
}