/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory' | 'symlink';
  size?: number;
  modified?: Date;
  children?: TreeNode[];
  error?: string;
  target?: string; // For symlinks
}

export interface TreeIndexConfig {
  // Core settings
  maxDepth: number;
  includeFiles: boolean;
  followSymlinks: boolean;
  
  // Filtering
  excludePatterns: string[];
  includePatterns: string[];
  useGitignore: boolean;
  
  // Display options
  showSizes: boolean;
  showDates: boolean;
  sortBy: 'name' | 'size' | 'date';
  sortReverse: boolean;
  
  // Output control
  outputPath?: string;
  format: 'minimal' | 'standard' | 'detailed';
  encoding: 'utf8' | 'ascii';
  
  // Performance
  maxFiles?: number;
  timeout?: number;
}

export interface TreeMetadata {
  generatedAt: Date;
  directory: string;
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
  errors?: string[];
}

export interface TraverseOptions {
  currentDepth: number;
  visitedPaths: Set<string>;
}

export interface TreeError {
  path: string;
  message: string;
  type: 'permission' | 'symlink' | 'timeout' | 'unknown';
}