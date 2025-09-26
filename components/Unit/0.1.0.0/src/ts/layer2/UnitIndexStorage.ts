/**
 * Unit Index Storage - Layer 2 (Implementation)
 * 
 * Implements UUID-based storage system for Unit scenarios with symbolic link management
 * Storage pattern: scenarios/index/1/a/1/2/3/uuid.scenario.json (5 levels deep)
 * Symbolic links track all locations where units are referenced
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

export interface UnitStorageResult {
  success: boolean;
  message: string;
  scenarioPath?: string;
  symlinkPaths?: string[];
  issues?: string[];
}

export interface UnitBacklinkInfo {
  uuid: string;
  indexPath: string;
  symlinkPaths: string[];
  createdAt: string;
  updatedAt: string;
}

export class UnitIndexStorage {
  private projectRoot: string = '';
  private indexBaseDir: string = '';

  constructor() {
    // Empty constructor - Web4 pattern
  }

  /**
   * Initialize with project root path
   */
  init(projectRoot: string): this {
    this.projectRoot = projectRoot;
    this.indexBaseDir = path.join(projectRoot, 'scenarios', 'index');
    return this;
  }

  /**
   * Generate UUID-based folder path (5 levels deep)
   * Example: 1a123c8b-e76f-4c2b-b6b2-375620179ce6 -> scenarios/index/1/a/1/2/3/
   */
  private generateUUIDFolderPath(uuid: string): string {
    // Clean UUID - remove hyphens and take first 5 characters
    const cleanUuid = uuid.replace(/-/g, '');
    const folderStructure = cleanUuid.substring(0, 5).split('');
    
    return path.join(this.indexBaseDir, ...folderStructure);
  }

  /**
   * Get the full scenario file path in the index
   */
  private getScenarioIndexPath(uuid: string): string {
    const folderPath = this.generateUUIDFolderPath(uuid);
    return path.join(folderPath, `${uuid}.scenario.json`);
  }

  /**
   * Create UUID folder structure if it doesn't exist
   */
  private async ensureUUIDFolders(uuid: string): Promise<void> {
    const folderPath = this.generateUUIDFolderPath(uuid);
    await fs.mkdir(folderPath, { recursive: true });
  }

  /**
   * Save scenario to UUID index location
   */
  async saveScenario(uuid: string, scenario: any, symlinkLocations: string[] = []): Promise<UnitStorageResult> {
    try {
      if (!this.projectRoot) {
        throw new Error('UnitIndexStorage not initialized - call init(projectRoot) first');
      }

      // Ensure UUID folder structure exists
      await this.ensureUUIDFolders(uuid);

      // Get index path for scenario
      const scenarioIndexPath = this.getScenarioIndexPath(uuid);
      
      // Add backlink tracking to scenario
      const scenarioWithBacklinks = {
        ...scenario,
        unitIndex: {
          uuid,
          indexPath: scenarioIndexPath,
          symlinkPaths: symlinkLocations,
          createdAt: scenario.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      // Save scenario to index
      const scenarioJSON = JSON.stringify(scenarioWithBacklinks, null, 2);
      await fs.writeFile(scenarioIndexPath, scenarioJSON, 'utf-8');

      // Create symbolic links if locations specified
      const createdSymlinks: string[] = [];
      for (const linkLocation of symlinkLocations) {
        try {
          await this.createSymbolicLink(scenarioIndexPath, linkLocation);
          createdSymlinks.push(linkLocation);
        } catch (linkError) {
          console.warn(`Failed to create symbolic link at ${linkLocation}: ${linkError}`);
        }
      }

      return {
        success: true,
        message: `Scenario saved to UUID index at ${scenarioIndexPath}`,
        scenarioPath: scenarioIndexPath,
        symlinkPaths: createdSymlinks
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to save scenario: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  /**
   * Load scenario from UUID index
   */
  async loadScenario(uuid: string): Promise<{ success: boolean; scenario?: any; message: string }> {
    try {
      if (!this.projectRoot) {
        throw new Error('UnitIndexStorage not initialized');
      }

      const scenarioIndexPath = this.getScenarioIndexPath(uuid);
      
      // Check if scenario exists in index
      await fs.access(scenarioIndexPath);
      
      // Load scenario content
      const scenarioContent = await fs.readFile(scenarioIndexPath, 'utf-8');
      const scenario = JSON.parse(scenarioContent);

      return {
        success: true,
        scenario,
        message: `Scenario loaded from UUID index: ${scenarioIndexPath}`
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to load scenario ${uuid}: ${(error as Error).message}`
      };
    }
  }

  /**
   * Create symbolic link to scenario
   */
  private async createSymbolicLink(indexPath: string, symlinkPath: string): Promise<void> {
    // Ensure target directory exists
    await fs.mkdir(path.dirname(symlinkPath), { recursive: true });
    
    // Remove existing symlink if it exists
    try {
      await fs.unlink(symlinkPath);
    } catch {
      // Ignore if file doesn't exist
    }

    // Create relative path for symbolic link
    const relativePath = path.relative(path.dirname(symlinkPath), indexPath);
    
    // Create symbolic link
    await fs.symlink(relativePath, symlinkPath);
  }

  /**
   * Add symbolic link to existing scenario
   */
  async addSymbolicLink(uuid: string, symlinkPath: string): Promise<UnitStorageResult> {
    try {
      // Load existing scenario
      const result = await this.loadScenario(uuid);
      if (!result.success || !result.scenario) {
        return {
          success: false,
          message: `Cannot add symlink - scenario ${uuid} not found in index`,
          issues: [result.message]
        };
      }

      const scenario = result.scenario;
      const scenarioIndexPath = this.getScenarioIndexPath(uuid);

      // Create symbolic link
      await this.createSymbolicLink(scenarioIndexPath, symlinkPath);

      // Update backlink tracking
      const unitIndex = scenario.unitIndex || {};
      const symlinkPaths = unitIndex.symlinkPaths || [];
      if (!symlinkPaths.includes(symlinkPath)) {
        symlinkPaths.push(symlinkPath);
      }

      scenario.unitIndex = {
        ...unitIndex,
        symlinkPaths,
        updatedAt: new Date().toISOString()
      };

      // Save updated scenario
      const scenarioJSON = JSON.stringify(scenario, null, 2);
      await fs.writeFile(scenarioIndexPath, scenarioJSON, 'utf-8');

      return {
        success: true,
        message: `Symbolic link added: ${symlinkPath} -> ${scenarioIndexPath}`,
        scenarioPath: scenarioIndexPath,
        symlinkPaths: [symlinkPath]
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to add symbolic link: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  /**
   * Remove symbolic link and update backlink tracking
   */
  async removeSymbolicLink(uuid: string, symlinkPath: string): Promise<UnitStorageResult> {
    try {
      // Load existing scenario
      const result = await this.loadScenario(uuid);
      if (!result.success || !result.scenario) {
        return {
          success: false,
          message: `Cannot remove symlink - scenario ${uuid} not found in index`,
          issues: [result.message]
        };
      }

      const scenario = result.scenario;
      const scenarioIndexPath = this.getScenarioIndexPath(uuid);

      // Remove symbolic link file
      try {
        await fs.unlink(symlinkPath);
      } catch {
        // Ignore if symlink doesn't exist
      }

      // Update backlink tracking
      const unitIndex = scenario.unitIndex || {};
      const symlinkPaths = (unitIndex.symlinkPaths || []).filter((p: string) => p !== symlinkPath);

      scenario.unitIndex = {
        ...unitIndex,
        symlinkPaths,
        updatedAt: new Date().toISOString()
      };

      // Save updated scenario
      const scenarioJSON = JSON.stringify(scenario, null, 2);
      await fs.writeFile(scenarioIndexPath, scenarioJSON, 'utf-8');

      return {
        success: true,
        message: `Symbolic link removed: ${symlinkPath}`,
        scenarioPath: scenarioIndexPath,
        symlinkPaths: symlinkPaths
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to remove symbolic link: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  /**
   * Get backlink information for a unit
   */
  async getBacklinkInfo(uuid: string): Promise<UnitBacklinkInfo | null> {
    try {
      const result = await this.loadScenario(uuid);
      if (!result.success || !result.scenario) {
        return null;
      }

      const unitIndex = result.scenario.unitIndex || {};
      return {
        uuid,
        indexPath: this.getScenarioIndexPath(uuid),
        symlinkPaths: unitIndex.symlinkPaths || [],
        createdAt: unitIndex.createdAt || 'unknown',
        updatedAt: unitIndex.updatedAt || 'unknown'
      };

    } catch (error) {
      return null;
    }
  }

  /**
   * Move scenario and update all symbolic links
   */
  async moveScenario(uuid: string, newSymlinkLocations: string[]): Promise<UnitStorageResult> {
    try {
      // Get current backlink info
      const backlinkInfo = await this.getBacklinkInfo(uuid);
      if (!backlinkInfo) {
        return {
          success: false,
          message: `Cannot move scenario - ${uuid} not found in index`
        };
      }

      // Remove old symbolic links
      const removeResults: string[] = [];
      for (const oldSymlinkPath of backlinkInfo.symlinkPaths) {
        const removeResult = await this.removeSymbolicLink(uuid, oldSymlinkPath);
        if (removeResult.success) {
          removeResults.push(`Removed: ${oldSymlinkPath}`);
        }
      }

      // Add new symbolic links
      const addResults: string[] = [];
      for (const newSymlinkPath of newSymlinkLocations) {
        const addResult = await this.addSymbolicLink(uuid, newSymlinkPath);
        if (addResult.success) {
          addResults.push(`Added: ${newSymlinkPath}`);
        }
      }

      return {
        success: true,
        message: `Scenario ${uuid} moved successfully`,
        scenarioPath: backlinkInfo.indexPath,
        symlinkPaths: newSymlinkLocations,
        issues: [...removeResults, ...addResults]
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to move scenario: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  /**
   * List all scenarios in index
   */
  async listScenarios(): Promise<{ uuids: string[]; count: number }> {
    try {
      if (!this.projectRoot) {
        throw new Error('UnitIndexStorage not initialized');
      }

      const uuids: string[] = [];
      
      // Walk through UUID folder structure
      await this.walkIndexFolders(this.indexBaseDir, uuids);
      
      return { uuids, count: uuids.length };

    } catch (error) {
      return { uuids: [], count: 0 };
    }
  }

  private async walkIndexFolders(dir: string, uuids: string[]): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Recurse into subdirectories
          await this.walkIndexFolders(fullPath, uuids);
        } else if (entry.isFile() && entry.name.endsWith('.scenario.json')) {
          // Extract UUID from filename
          const uuid = entry.name.replace('.scenario.json', '');
          if (this.isValidUUID(uuid)) {
            uuids.push(uuid);
          }
        }
      }
    } catch {
      // Ignore directory read errors
    }
  }

  private isValidUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }
}
