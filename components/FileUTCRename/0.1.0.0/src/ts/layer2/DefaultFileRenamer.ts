/**
 * Layer 2: Implementation
 * Default implementation of FileRenamer interface
 */

import { FileRenamer, FileRenameScenario, FileRenameResult, FileRenameOperation } from '../layer3/FileRenamer';
import { GitFileOperations } from '../layer1/GitFileOperations';
import { glob } from 'glob';
import { basename, dirname, join } from 'path';

export class DefaultFileRenamer implements FileRenamer {
  private scenario!: FileRenameScenario;
  private gitOps: GitFileOperations;
  
  constructor() { // Web4 empty constructor
    this.gitOps = new GitFileOperations();
  }
  
  init(scenario: FileRenameScenario): this {
    this.scenario = scenario;
    return this;
  }
  
  async preview(): Promise<FileRenameOperation[]> {
    const files = await this.findFiles();
    const operations: FileRenameOperation[] = [];
    
    for (const filePath of files) {
      const operation = await this.createRenameOperation(filePath);
      operations.push(operation);
    }
    
    return operations;
  }
  
  async execute(): Promise<FileRenameResult> {
    const operations = await this.preview();
    const gitOperations: string[] = [];
    const errors: string[] = [];
    
    if (this.scenario.dryRun) {
      return {
        success: true,
        operations,
        errors: [],
        gitOperations: operations.map(op => `DRY RUN: git mv "${op.originalPath}" "${op.newPath}"`)
      };
    }
    
    for (const operation of operations) {
      try {
        if (this.scenario.useGitMv) {
          const isTracked = await this.gitOps.isGitTracked(operation.originalPath);
          if (isTracked) {
            const gitCmd = await this.gitOps.gitMoveFile(operation.originalPath, operation.newPath);
            gitOperations.push(gitCmd);
          } else {
            errors.push(`File not tracked by git: ${operation.originalPath}`);
          }
        }
      } catch (error) {
        errors.push(`Failed to rename ${operation.originalPath}: ${error}`);
      }
    }
    
    return {
      success: errors.length === 0,
      operations,
      errors,
      gitOperations
    };
  }
  
  toScenario(): FileRenameScenario {
    return { ...this.scenario };
  }
  
  private async findFiles(): Promise<string[]> {
    // Go up to project root from components/FileUTCRename/v1.0
    const projectRoot = join(process.cwd(), '../../..');
    const absolutePattern = join(projectRoot, this.scenario.sourceDirectory, this.scenario.filePattern);
    console.log(`🔍 Current working directory: ${process.cwd()}`);
    console.log(`🔍 Project root: ${projectRoot}`);
    console.log(`🔍 Searching for files with pattern: ${absolutePattern}`);
    const files = await glob(absolutePattern);
    console.log(`📁 Found ${files.length} files: ${files.join(', ')}`);
    return files;
  }
  
  private async createRenameOperation(filePath: string): Promise<FileRenameOperation> {
    const creationTimeUTC = await this.gitOps.getFileCreationTimeUTC(filePath);
    const fileName = basename(filePath);
    const directory = dirname(filePath);
    
    // Only rename files with the hallucinated 1552 timestamp
    if (!fileName.startsWith('2025-08-20-1552-')) {
      console.log(`⏭️  Skipping file (not 1552 pattern): ${fileName}`);
      return {
        originalPath: filePath,
        newPath: filePath, // No change
        creationTime: creationTimeUTC,
        description: 'skipped - not matching pattern'
      };
    }
    
    // Extract description from current filename
    // Expected format: 2025-08-20-1552-description.md
    const match = fileName.match(/^2025-08-20-1552-(.+)\.md$/);
    const description = match ? match[1] : fileName.replace('.md', '');
    
    const newFileName = `${creationTimeUTC}-${description}.md`;
    const newPath = join(directory, newFileName);
    
    return {
      originalPath: filePath,
      newPath,
      creationTime: creationTimeUTC,
      description
    };
  }
}
