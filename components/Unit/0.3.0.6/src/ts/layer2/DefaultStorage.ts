/**
 * DefaultStorage - Web4 compliant UUID index system with LD links
 * Web4 pattern: Empty constructor + scenario initialization + hibernation
 * Purpose: Store scenarios in scenarios/index/ with 5-level UUID structure and symbolic links
 */

import { Storage } from '../layer3/Storage.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { StorageScenario } from '../layer3/StorageScenario.interface.js';
import { StorageModel } from '../layer3/StorageModel.interface.js';
import { promises as fs } from 'fs';
import { join, dirname, relative } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { webcrypto as crypto } from 'crypto';

export class DefaultStorage implements Storage {
  private model: StorageModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      projectRoot: '',
      indexBaseDir: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  init(scenario: StorageScenario): this {
    if (scenario.model) {
      this.model = scenario.model;
    }
    // Set up storage paths
    this.model.projectRoot = this.findProjectRoot();
    this.model.indexBaseDir = join(this.model.projectRoot, 'scenarios', 'index');
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  async toScenario(): Promise<StorageScenario> {
    // ✅ DYNAMIC VERSION: Use getComponentVersion() instead of hardcoded
    const componentVersion = await this.getComponentVersion();
    const componentName = await this.getComponentName();
    
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: componentName,
      version: componentVersion
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: componentName, 
        version: componentVersion
      },
      owner: ownerData,
      model: this.model
    };
  }

  async saveScenario(uuid: string, scenario: Scenario, symlinkPaths: string[]): Promise<void> {
    // Create UUID folder structure (5 levels deep)
    const folderPath = this.generateUUIDFolderPath(uuid);
    await fs.mkdir(folderPath, { recursive: true });

    // Create scenario file path
    const scenarioPath = join(folderPath, `${uuid}.scenario.json`);

    // Update scenario model with storage data - model IS the unitIndex
    const scenarioWithStorage = {
      ...scenario,
      model: {
        ...scenario.model,
        indexPath: scenarioPath,
        symlinkPaths,
        updatedAt: new Date().toISOString()
      }
    };

    // Save scenario to index
    await fs.writeFile(scenarioPath, JSON.stringify(scenarioWithStorage, null, 2), 'utf-8');

    // Create symbolic links
    for (const linkPath of symlinkPaths) {
      await this.createSymbolicLink(scenarioPath, linkPath);
    }
  }

  async loadScenario(uuid: string): Promise<Scenario> {
    const scenarioPath = this.getScenarioIndexPath(uuid);
    const content = await fs.readFile(scenarioPath, 'utf-8');
    return JSON.parse(content);
  }

  private generateUUIDFolderPath(uuid: string): string {
    // 5-level deep: scenarios/index/a/b/c/d/e/
    const cleanUuid = uuid.replace(/-/g, '');
    const folderStructure = cleanUuid.substring(0, 5).split('');
    return join(this.model.indexBaseDir, ...folderStructure);
  }

  private getScenarioIndexPath(uuid: string): string {
    const folderPath = this.generateUUIDFolderPath(uuid);
    return join(folderPath, `${uuid}.scenario.json`);
  }

  private async createSymbolicLink(indexPath: string, symlinkPath: string): Promise<void> {
    // Ensure target directory exists
    await fs.mkdir(dirname(symlinkPath), { recursive: true });
    
    // Remove existing symlink if it exists
    try {
      await fs.unlink(symlinkPath);
    } catch {
      // Ignore if file doesn't exist
    }

    // Create relative path for symbolic link
    const relativePath = relative(dirname(symlinkPath), indexPath);
    
    // Create symbolic link
    await fs.symlink(relativePath, symlinkPath);
  }

  private findProjectRoot(): string {
    let currentDir = process.cwd();
    
    while (currentDir !== '/') {
      if (existsSync(join(currentDir, 'scenarios'))) {
        return currentDir;
      }
      currentDir = dirname(currentDir);
    }
    return process.cwd();
  }

  /**
   * Get component version dynamically from package.json
   * Web4 pattern: Dynamic version detection eliminates hardcoded versions
   */
  private async getComponentVersion(): Promise<string> {
    try {
      const currentDir = path.dirname(fileURLToPath(import.meta.url));
      const packageJsonPath = path.resolve(currentDir, '../../../package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return packageJson.version || '0.3.0.6';
    } catch (error) {
      return '0.3.0.6'; // Fallback version
    }
  }

  /**
   * Get component name dynamically from package.json
   * Web4 pattern: Dynamic component detection
   */
  private async getComponentName(): Promise<string> {
    try {
      const currentDir = path.dirname(fileURLToPath(import.meta.url));
      const packageJsonPath = path.resolve(currentDir, '../../../package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return packageJson.name?.split('/').pop()?.replace('@web4/', '') || 'Storage';
    } catch (error) {
      return 'Storage'; // Fallback name
    }
  }
}