/**
 * DefaultUnit - Simple unit implementation with storage integration
 * Web4 pattern: Empty constructor + scenario initialization + UnitIndexStorage
 */

import { Unit } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { TypeM3 } from '../layer3/TypeM3.enum.js';
import { Model } from '../layer3/Model.interface.js';
import { DefaultStorage } from './DefaultStorage.js';
import { existsSync } from 'fs';
import { dirname } from 'path';

export class DefaultUnit implements Unit {
  private model: UnitModel;
  private storage: DefaultStorage;

  // Getter for CLI access to model
  get unitModel(): UnitModel {
    return this.model;
  }

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),           // UUIDv4 using crypto.randomUUID() (Decision 1a)
      name: '',                            // Unit name for terminal identification (uni-t)
      origin: '',                          // GitTextIOR format with line/column positions
      definition: '',                      // GitTextIOR format with character positions
      typeM3: TypeM3.CLASS,                // Default MOF classification (can be changed)
      indexPath: '',                       // Will be set when stored
      symlinkPaths: [],                    // LD links tracking
      namedLinks: [],                      // Named links with location and filename
      executionCapabilities: ['transform', 'validate', 'process'],
      storageCapabilities: ['scenarios', 'ld-links'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.storage = new DefaultStorage();
    // Storage will be initialized with scenario in init() method
  }

  init(scenario: Scenario<UnitModel>): this {
    if (scenario.model) {
      this.model = scenario.model;
      // No state in UnitIndex model - state is requirement-like attribute
    }
    
    // Check for missing terminal identity and show warnings (backward compatibility)
    this.showTerminalIdentityWarning();
    
    // Initialize storage with scenario - Web4 pattern
    const storageScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Storage', version: '0.3.0.4' },
      owner: '',
      model: { uuid: crypto.randomUUID(), projectRoot: '', indexBaseDir: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    };
    this.storage.init(storageScenario);
    return this;
  }

  // Protocol-less radical OOP methods - no Input/Output constructs
  transform(data: unknown): unknown {
    this.model.updatedAt = new Date().toISOString();
    return {
      transformed: data,
      by: this.model.uuid,
      timestamp: new Date().toISOString()
    };
  }

  validate(object: any): boolean {
    this.model.updatedAt = new Date().toISOString();
    return object !== null && object !== undefined;
  }

  process(): void {
    this.model.updatedAt = new Date().toISOString();
    console.log(`Unit ${this.model.uuid} processed`);
  }

  async validateModel(): Promise<boolean> {
    // Comprehensive UnitModel validation
    try {
      // Required string properties
      if (!this.model.uuid || typeof this.model.uuid !== 'string') return false;
      if (!this.model.name || typeof this.model.name !== 'string') return false;
      if (!this.model.origin || typeof this.model.origin !== 'string') return false;
      if (!this.model.definition || typeof this.model.definition !== 'string') return false;
      if (!this.model.indexPath || typeof this.model.indexPath !== 'string') return false;
      
      // TypeM3 validation
      if (!Object.values(TypeM3).includes(this.model.typeM3)) return false;
      
      // Array properties
      if (!Array.isArray(this.model.symlinkPaths)) return false;
      if (!Array.isArray(this.model.namedLinks)) return false;
      if (!Array.isArray(this.model.executionCapabilities)) return false;
      if (!Array.isArray(this.model.storageCapabilities)) return false;
      
      // Timestamp validation
      if (!this.model.createdAt || isNaN(Date.parse(this.model.createdAt))) return false;
      if (!this.model.updatedAt || isNaN(Date.parse(this.model.updatedAt))) return false;
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async toScenario(name?: string): Promise<Scenario<UnitModel>> {
    // Generate proper owner data
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Unit',
      version: '0.3.0.4'
    });

    const scenario: Scenario = {
      ior: {
        uuid: this.model.uuid,
        component: 'Unit',
        version: '0.3.0.4'
      },
      owner: ownerData, // Modern TypeScript - no Web2 btoa() shit
      model: this.model
    };

    // Save to central storage with LD links - create named link in current directory
    const currentDir = process.cwd();
    const linkFilename = name ? `${name}.unit` : `unit-${this.model.uuid.slice(0, 8)}`;
    const namedLink = `${currentDir}/${linkFilename}`;
    
    await this.storage.saveScenario(this.model.uuid, scenario, [namedLink]);
    
    // Add to namedLinks array if name provided - location should be relative path from link to scenario
    if (name) {
      // Get the actual relative path that was used to create the symlink
      const { relative, dirname } = await import('path');
      const { readlinkSync } = await import('fs');
      
      try {
        const relativePath = readlinkSync(namedLink);
        this.model.namedLinks.push({
          location: relativePath,
          filename: linkFilename
        });
      } catch (error) {
        console.error('Failed to read symlink for namedLinks:', (error as Error).message);
      }
    }
    
    // Load the saved scenario to get the updated model with correct storage paths
    try {
      const savedScenario = await this.storage.loadScenario(this.model.uuid);
      const originalNamedLinks = this.model.namedLinks; // Save namedLinks before overwriting
      this.model = savedScenario.model as any; // Update our model with storage-corrected paths
      
      // Restore namedLinks if we had them
      if (originalNamedLinks && originalNamedLinks.length > 0) {
        this.model.namedLinks = originalNamedLinks;
        savedScenario.model = this.model;
        // Save the updated scenario with correct namedLinks
        await this.storage.saveScenario(this.model.uuid, savedScenario, [namedLink]);
        // Load again to get the final updated scenario
        const finalScenario = await this.storage.loadScenario(this.model.uuid) as Scenario<UnitModel>;
        this.model = finalScenario.model;
        return finalScenario;
      }
      
      return savedScenario as Scenario<UnitModel>; // Return the complete saved scenario with correct paths
    } catch (error) {
      console.error('Failed to load saved scenario:', (error as Error).message);
      return scenario as Scenario<UnitModel>; // Fallback to original scenario
    }
  }

  // Helper methods for Unit model management
  addExecutionCapability(capability: string): this {
    if (!this.model.executionCapabilities.includes(capability)) {
      this.model.executionCapabilities.push(capability);
    }
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Testing helper method
  getModel(): UnitModel {
    return this.model;
  }

  // Advanced CLI Commands (Task 19) - Direct method naming convention v0.1.2.2
  async link(uuid: string, filename: string): Promise<void> {
    try {
      // Create new LD link to existing unit in different location
      const currentDir = process.cwd();
      const linkPath = `${currentDir}/${filename}.unit`;
      
      // Load existing unit scenario
      const existingScenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Create new LD link pointing to existing scenario
      const scenarioPath = existingScenario.model.indexPath;
      await this.storage.saveScenario(uuid, existingScenario, [linkPath]);
      
      console.log(`✅ Link created: ${filename}.unit → ${uuid}`);
      console.log(`   Target: ${scenarioPath}`);
    } catch (error) {
      console.error(`Failed to create link: ${(error as Error).message}`);
    }
  }

  async list(uuid: string): Promise<void> {
    try {
      // Load unit scenario and list all LD links
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      console.log(`LD Links for Unit ${uuid}:`);
      if (scenario.model.symlinkPaths && scenario.model.symlinkPaths.length > 0) {
        scenario.model.symlinkPaths.forEach((linkPath: string) => {
          console.log(`  - ${linkPath}`);
        });
      } else {
        console.log('  No LD links found');
      }
      
      if (scenario.model.namedLinks && scenario.model.namedLinks.length > 0) {
        console.log(`Named Links:`);
        scenario.model.namedLinks.forEach((namedLink: any) => {
          console.log(`  - ${namedLink.filename} (${namedLink.location})`);
        });
      }
    } catch (error) {
      console.error(`Failed to list links: ${(error as Error).message}`);
    }
  }

  async from(filename: string, startPos: string, endPos: string): Promise<void> {
    try {
      // Create unit from file text with extracted name and origin
      const { promises: fs } = await import('fs');
      const { GitTextIOR } = await import('./GitTextIOR.js');
      
      // Read file content
      const fileContent = await fs.readFile(filename, 'utf-8');
      const lines = fileContent.split('\n');
      
      // Parse positions (line:column format)
      const [startLine, startCol] = startPos.split(':').map(Number);
      const [endLine, endCol] = endPos.split(':').map(Number);
      
      // Extract text from specified range
      let extractedText = '';
      for (let i = startLine - 1; i <= endLine - 1; i++) {
        if (i === startLine - 1 && i === endLine - 1) {
          // Same line
          extractedText = lines[i].substring(startCol - 1, endCol);
        } else if (i === startLine - 1) {
          // Start line
          extractedText += lines[i].substring(startCol - 1) + '\n';
        } else if (i === endLine - 1) {
          // End line
          extractedText += lines[i].substring(0, endCol);
        } else {
          // Middle lines
          extractedText += lines[i] + '\n';
        }
      }
      
      // Extract unit name from text (first word or identifier)
      const nameMatch = extractedText.match(/\b[A-Za-z][A-Za-z0-9_]*\b/);
      const unitName = nameMatch ? nameMatch[0] : 'ExtractedUnit';
      
      // Create GitTextIOR for origin with absolute path
      const gitIOR = new GitTextIOR();
      const { resolve } = await import('path');
      const absolutePath = resolve(filename);
      const relativePath = absolutePath.replace('/workspace/', '');
      const gitUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}#L${startPos}-${endPos}`;
      const originIOR = gitIOR.parse(gitUrl);
      
      // Set terminal identity
      this.setTerminalIdentity(unitName, originIOR, '');
      
      // Create unit scenario
      const scenario = await this.toScenario(unitName);
      
      console.log(`✅ Unit created from source: ${unitName}`);
      console.log(`   UUID: ${scenario.ior.uuid}`);
      console.log(`   Origin: ${originIOR}`);
      console.log(`   Extracted from: ${filename} (${startPos}-${endPos})`);
    } catch (error) {
      console.error(`Failed to create unit from source: ${(error as Error).message}`);
    }
  }

  async definition(uuid: string, filename: string, startPos: string, endPos: string): Promise<void> {
    try {
      // Add definition source reference to existing unit
      const { GitTextIOR } = await import('./GitTextIOR.js');
      
      // Create GitTextIOR for definition with absolute path
      const gitIOR = new GitTextIOR();
      const { resolve } = await import('path');
      const absolutePath = resolve(filename);
      const relativePath = absolutePath.replace('/workspace/', '');
      const gitUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}#L${startPos}-${endPos}`;
      const definitionIOR = gitIOR.parse(gitUrl);
      
      // Load existing unit
      const existingScenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Update definition
      existingScenario.model.definition = definitionIOR;
      
      // Save updated scenario
      await this.storage.saveScenario(uuid, existingScenario, existingScenario.model.symlinkPaths);
      
      console.log(`✅ Definition added to unit: ${uuid}`);
      console.log(`   Definition: ${definitionIOR}`);
      console.log(`   Source: ${filename} (${startPos}-${endPos})`);
    } catch (error) {
      console.error(`Failed to add definition: ${(error as Error).message}`);
    }
  }

  async origin(uuid: string): Promise<void> {
    try {
      // Display dual links to origin and definition as clickable URLs
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      console.log(`Unit ${scenario.model.name || uuid} Source References:`);
      console.log('');
      
      if (scenario.model.origin) {
        const originUrl = scenario.model.origin.replace('ior:git:text:', '');
        console.log(`Origin: ${originUrl}`);
        console.log(`Local: scenarios/index/${uuid.slice(0, 5).split('').join('/')}/${uuid}.scenario.json`);
      } else {
        console.log('Origin: not specified');
      }
      
      console.log('');
      
      if (scenario.model.definition) {
        const definitionUrl = scenario.model.definition.replace('ior:git:text:', '');
        console.log(`Definition: ${definitionUrl}`);
        console.log(`Local: scenarios/index/${uuid.slice(0, 5).split('').join('/')}/${uuid}.scenario.json`);
      } else {
        console.log('Definition: not specified');
      }
      
      console.log('');
    } catch (error) {
      console.error(`Failed to show origin: ${(error as Error).message}`);
    }
  }

  // Terminal Identity (uni-t) methods
  setTerminalIdentity(name: string, origin: string, definition: string): this {
    this.model.name = name;
    this.model.origin = origin;
    this.model.definition = definition;
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  validateTerminalIdentity(): { isComplete: boolean; missing: string[] } {
    const missing: string[] = [];
    
    if (!this.model.name || this.model.name.trim() === '') {
      missing.push('name');
    }
    if (!this.model.origin || this.model.origin.trim() === '') {
      missing.push('origin');
    }
    if (!this.model.definition || this.model.definition.trim() === '') {
      missing.push('definition');
    }

    return {
      isComplete: missing.length === 0,
      missing
    };
  }

  showTerminalIdentityWarning(): void {
    const validation = this.validateTerminalIdentity();
    if (!validation.isComplete) {
      console.warn(`⚠️  Warning: Unit '${this.model.uuid}' missing terminal identity information:`);
      validation.missing.forEach(field => {
        console.warn(`   - ${field}: not specified`);
      });
      console.warn('');
      console.warn('   Next build version will require migration method for missing model info.');
      console.warn('   Please update unit with complete terminal identity (uni-t) attributes.');
    }
  }

  addStorageCapability(capability: string): this {
    if (!this.model.storageCapabilities.includes(capability)) {
      this.model.storageCapabilities.push(capability);
    }
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Speaking name resolution methods (Decision 2a - in DefaultUnit)
  async resolveSpeakingName(speakingName: string): Promise<string | null> {
    try {
      // TODO: Implement speaking name to UUID resolution
      // For now, return null - will be implemented with LD links system
      return null;
    } catch (error) {
      console.warn(`Failed to resolve speaking name ${speakingName}: ${(error as Error).message}`);
      return null;
    }
  }

  async addSpeakingName(speakingName: string): Promise<void> {
    try {
      // Add speaking name link for this unit - will be implemented when storage methods are Web4 compliant
      console.log(`✅ Speaking name to add: ${speakingName} -> ${this.model.uuid}`);
    } catch (error) {
      throw new Error(`Failed to add speaking name: ${(error as Error).message}`);
    }
  }

  async removeSpeakingName(speakingName: string): Promise<void> {
    try {
      // Remove speaking name link for this unit - will be implemented when storage methods are Web4 compliant
      console.log(`✅ Speaking name to remove: ${speakingName}`);
    } catch (error) {
      throw new Error(`Failed to remove speaking name: ${(error as Error).message}`);
    }
  }

  private findProjectRoot(): string {
    let currentDir = process.cwd();
    
    while (currentDir !== '/') {
      try {
        // Modern ESM approach - use existsSync from fs import
        if (existsSync(`${currentDir}/scenarios`)) {
          return currentDir;
        }
        currentDir = dirname(currentDir);
      } catch {
        currentDir = dirname(currentDir);
      }
    }
    return process.cwd();
  }
}