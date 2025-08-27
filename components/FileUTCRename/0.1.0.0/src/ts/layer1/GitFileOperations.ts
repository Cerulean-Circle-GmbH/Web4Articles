/**
 * Layer 1: Infrastructure
 * Git file operations for Web4 file management
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { stat } from 'fs/promises';

const execAsync = promisify(exec);

export class GitFileOperations {
  constructor() {} // Web4 empty constructor
  
  /**
   * Get file creation time in UTC format
   */
  async getFileCreationTimeUTC(filePath: string): Promise<string> {
    try {
      const stats = await stat(filePath);
      const creationTime = stats.birthtime;
      
      // Format as YYYY-MM-DD-UTC-HHMM
      const year = creationTime.getUTCFullYear();
      const month = String(creationTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(creationTime.getUTCDate()).padStart(2, '0');
      const hours = String(creationTime.getUTCHours()).padStart(2, '0');
      const minutes = String(creationTime.getUTCMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}-UTC-${hours}${minutes}`;
    } catch (error) {
      throw new Error(`Failed to get creation time for ${filePath}: ${error}`);
    }
  }
  
  /**
   * Execute git mv command
   */
  async gitMoveFile(oldPath: string, newPath: string): Promise<string> {
    try {
      const { stdout, stderr } = await execAsync(`git mv "${oldPath}" "${newPath}"`);
      if (stderr) {
        console.warn(`Git mv warning for ${oldPath}: ${stderr}`);
      }
      return `git mv "${oldPath}" "${newPath}"`;
    } catch (error) {
      throw new Error(`Git mv failed for ${oldPath} -> ${newPath}: ${error}`);
    }
  }
  
  /**
   * Check if file is tracked by git
   */
  async isGitTracked(filePath: string): Promise<boolean> {
    try {
      await execAsync(`git ls-files --error-unmatch "${filePath}"`);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Get git status for verification
   */
  async getGitStatus(): Promise<string> {
    try {
      const { stdout } = await execAsync('git status --porcelain');
      return stdout;
    } catch (error) {
      throw new Error(`Failed to get git status: ${error}`);
    }
  }
}
