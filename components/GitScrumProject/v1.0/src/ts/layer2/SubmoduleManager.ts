import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import { Logger } from '../layer1/Logger.ts';

export interface SubmoduleConfig {
  name: string;
  path: string;
  url: string;
  branch?: string;
}

export class SubmoduleManager {
  private workingDir: string;

  constructor() {
    // Empty constructor following Web4 principles
    this.workingDir = process.cwd();
  }

  /**
   * Initialize with working directory
   */
  init(workingDir: string): this {
    this.workingDir = workingDir;
    return this;
  }

  /**
   * Add a Git submodule to the repository
   */
  addSubmodule(config: SubmoduleConfig): void {
    const { name, path: submodulePath, url, branch } = config;
    
    try {
      Logger.log(`[SubmoduleManager] Adding submodule: ${name} at ${submodulePath}`, 'info');
      
      // Ensure parent directory exists
      const parentDir = path.dirname(path.resolve(this.workingDir, submodulePath));
      fs.mkdirSync(parentDir, { recursive: true });
      
      // Add submodule
      let cmd = `git submodule add ${url} ${submodulePath}`;
      if (branch) {
        cmd += ` --branch ${branch}`;
      }
      
      execSync(cmd, { cwd: this.workingDir, stdio: 'inherit' });
      
      Logger.log(`[SubmoduleManager] Submodule ${name} added successfully`, 'info');
    } catch (error) {
      Logger.log(`[SubmoduleManager] Failed to add submodule ${name}: ${error}`, 'error');
      throw new Error(`Failed to add submodule ${name}: ${error}`);
    }
  }

  /**
   * Initialize and update submodules
   */
  initializeSubmodules(): void {
    try {
      Logger.log('[SubmoduleManager] Initializing submodules', 'info');
      execSync('git submodule init', { cwd: this.workingDir, stdio: 'inherit' });
      execSync('git submodule update --remote --recursive', { cwd: this.workingDir, stdio: 'inherit' });
      Logger.log('[SubmoduleManager] Submodules initialized successfully', 'info');
    } catch (error) {
      Logger.log(`[SubmoduleManager] Failed to initialize submodules: ${error}`, 'error');
      throw new Error(`Failed to initialize submodules: ${error}`);
    }
  }

  /**
   * Check if submodule exists at path
   */
  submoduleExists(submodulePath: string): boolean {
    const gitmodulesPath = path.join(this.workingDir, '.gitmodules');
    if (!fs.existsSync(gitmodulesPath)) {
      return false;
    }
    
    try {
      const gitmodules = fs.readFileSync(gitmodulesPath, 'utf8');
      return gitmodules.includes(`path = ${submodulePath}`);
    } catch {
      return false;
    }
  }

  /**
   * Remove a submodule (cleanup utility)
   */
  removeSubmodule(submodulePath: string): void {
    try {
      Logger.log(`[SubmoduleManager] Removing submodule: ${submodulePath}`, 'info');
      
      // Remove submodule using modern Git command
      execSync(`git submodule deinit -f ${submodulePath}`, { cwd: this.workingDir, stdio: 'inherit' });
      execSync(`git rm -f ${submodulePath}`, { cwd: this.workingDir, stdio: 'inherit' });
      
      // Clean up .git/modules directory
      const modulesPath = path.join(this.workingDir, '.git', 'modules', submodulePath);
      if (fs.existsSync(modulesPath)) {
        fs.rmSync(modulesPath, { recursive: true, force: true });
      }
      
      Logger.log(`[SubmoduleManager] Submodule ${submodulePath} removed successfully`, 'info');
    } catch (error) {
      Logger.log(`[SubmoduleManager] Failed to remove submodule ${submodulePath}: ${error}`, 'error');
      throw new Error(`Failed to remove submodule ${submodulePath}: ${error}`);
    }
  }
}