/**
 * Layer 3: Interface Definition
 * FileRenamer interface contract for Web4 file renaming operations
 */

export interface FileRenameOperation {
  originalPath: string;
  newPath: string;
  creationTime: string;
  description: string;
}

export interface FileRenameResult {
  success: boolean;
  operations: FileRenameOperation[];
  errors: string[];
  gitOperations: string[];
}

export interface FileRenamer {
  /**
   * Web4 scenario initialization
   */
  init(scenario: FileRenameScenario): this;
  
  /**
   * Execute file renaming operations
   */
  execute(): Promise<FileRenameResult>;
  
  /**
   * Preview operations without executing
   */
  preview(): Promise<FileRenameOperation[]>;
  
  /**
   * Serialize component state to scenario
   */
  toScenario(): FileRenameScenario;
}

export interface FileRenameScenario {
  sourceDirectory: string;
  filePattern: string;
  utcTimestampFormat: string;
  useGitMv: boolean;
  dryRun: boolean;
}
