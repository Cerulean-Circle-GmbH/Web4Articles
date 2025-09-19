/**
 * DefaultUnit - Simple unit implementation with storage integration
 * Web4 pattern: Empty constructor + scenario initialization + UnitIndexStorage
 */

import { Unit } from '../layer3/Unit.interface.js';
import { Upgrade } from '../layer3/Upgrade.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';
import { UnitReference, SyncStatus } from '../layer3/UnitReference.interface.js';
import { UnitIdentifier, isUUIDv4, isFilePath } from '../layer3/UnitIdentifier.type.js';
import { UUIDv4 } from '../layer3/UUIDv4.class.js';
import { TypeM3 } from '../layer3/TypeM3.enum.js';
import { Model } from '../layer3/Model.interface.js';
import { DefaultStorage } from './DefaultStorage.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { webcrypto as crypto } from 'crypto';

export class DefaultUnit implements Unit, Upgrade {
  private model: UnitModel;
  private storage: DefaultStorage;
  private contextUnit: DefaultUnit | null = null;

  // Getter for CLI access to model
  get unitModel(): UnitModel {
    return this.model;
  }

  // Getter for originName - filesystem entity name
  get originName(): string {
    if (!this.model) return '';
    return (this.model as any).originName || this.extractOriginName();
  }

  private extractOriginName(): string {
    if (!this.model.origin) return '';
    
    const filePath = this.extractFilePathFromIOR(this.model.origin);
    if (!filePath) return '';
    
    // For folders ending with /, return folder name
    if (filePath.endsWith('/')) {
      const folderPath = filePath.slice(0, -1);
      return path.basename(folderPath);
    }
    
    // For files, return filename
    return path.basename(filePath);
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
      references: [],                      // ✅ Enhanced: Unified reference tracking
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
    
    // ✅ FIX: Only show warning after operations if identity still missing
    // Removed automatic warning - will check after scenario operations
    
    // Initialize storage with scenario - Web4 pattern
    const storageScenario = {
      ior: { uuid: crypto.randomUUID(), component: 'Storage', version: '0.3.0.4' },
      owner: '',
      model: { uuid: crypto.randomUUID(), projectRoot: '', indexBaseDir: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    };
    this.storage.init(storageScenario);
    return this;
  }

  /**
   * Transform input data with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param data - Input data for transformation @cliSyntax json @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @example
   * ```typescript
   * await unit.from('data.json').transform(rules).validate(schema).execute();
   * ```
   */
  transform(data?: unknown): this {
    this.model.updatedAt = new Date().toISOString();
    
    // Store transformation result in unit for chaining
    (this.model as any).lastTransformation = {
      transformed: data,
      by: this.model.uuid,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Data transformed by unit: ${this.model.name || this.model.uuid}`);
    
    // ✅ COMMAND CHAINING: Return this for fluent interface
    return this;
  }

  /**
   * Validate object with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param object - Object to validate @cliSyntax json @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @example
   * ```typescript
   * await unit.from('data.json').transform(rules).validate(schema).execute();
   * ```
   */
  validate(object?: any): this {
    this.model.updatedAt = new Date().toISOString();
    
    const isValid = object !== null && object !== undefined;
    
    // Store validation result in unit for chaining
    (this.model as any).lastValidation = {
      isValid: isValid,
      validatedObject: object,
      by: this.model.uuid,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ Object ${isValid ? 'validated' : 'validation failed'} by unit: ${this.model.name || this.model.uuid}`);
    
    // ✅ COMMAND CHAINING: Return this for fluent interface
    return this;
  }

  /**
   * Process data with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @returns this - Enables command chaining for fluent interface
   */
  process(): this {
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ Unit processed: ${this.model.name || this.model.uuid}`);
    
    // ✅ COMMAND CHAINING: Return this for fluent interface
    return this;
  }

  /**
   * Load unit context for subsequent operations - eliminates repetitive identifiers
   * Web4 pattern: Context loading for workflow optimization and Occam's razor efficiency
   */
  async on(identifier: UnitIdentifier): Promise<this> {
    // Load target unit and set as current context
    this.contextUnit = await this.loadUnitFromIdentifier(identifier);
    
    console.log(`🎯 Unit context loaded: ${this.contextUnit.model.name || 'Unit'}`);
    console.log(`   UUID: ${this.contextUnit.model.uuid}`);
    console.log(`   Origin: ${this.contextUnit.model.origin || '(not set)'}`);
    console.log(`   Status: ${(this.contextUnit.model as any).syncStatus || '(not set)'}`);
    
    return this;
  }

  /**
   * Set sophisticated definition from file text reference with GitTextIOR
   * Web4 pattern: Sophisticated text reference capability with precise positioning
   */
  async definition(identifier: UnitIdentifier, file: string, startPos: string, endPos: string): Promise<this>;
  async definition(file: string, startPos: string, endPos: string): Promise<this>;
  async definition(identifierOrFile: UnitIdentifier | string, fileOrStartPos?: string, startPosOrEndPos?: string, endPos?: string): Promise<this> {
    let targetUnit: DefaultUnit;
    let file: string;
    let startPos: string;
    let endPosValue: string;

    if (endPos !== undefined) {
      // 4 parameters: identifier, file, startPos, endPos
      targetUnit = await this.loadUnitFromIdentifier(identifierOrFile as UnitIdentifier);
      file = fileOrStartPos!;
      startPos = startPosOrEndPos!;
      endPosValue = endPos;
    } else {
      // 3 parameters: file, startPos, endPos (use context)
      if (!this.contextUnit) {
        throw new Error('No unit context loaded. Use "unit on <uuid|lnfile>" first or provide identifier parameter.');
      }
      targetUnit = this.contextUnit;
      file = identifierOrFile as string;
      startPos = fileOrStartPos!;
      endPosValue = startPosOrEndPos!;
    }

    // Create GitTextIOR from file position
    const gitTextIOR = await this.createGitTextIOR(file, startPos, endPosValue);
    
    // Set definition as GitTextIOR reference
    targetUnit.model.definition = gitTextIOR;
    targetUnit.model.updatedAt = new Date().toISOString();
    
    // Save updated scenario
    const scenario = await targetUnit.toScenario();
    await targetUnit.storage.saveScenario(targetUnit.model.uuid, scenario, []);
    
    console.log(`✅ ${targetUnit.model.name || 'Unit'}: definition set from ${file}:${startPos}-${endPosValue}`);
    console.log(`   GitTextIOR: ${gitTextIOR}`);
    
    return this;
  }

  /**
   * Set model attribute value with universal identifier pattern or using loaded context
   * Web4 pattern: Universal <uuid|lnfile> parameter with context-aware overloading
   */
  async set(identifier: UnitIdentifier, attribute: string, value: string): Promise<this>;
  async set(attribute: string, value: string): Promise<this>;
  async set(identifierOrAttribute: UnitIdentifier | string, attributeOrValue?: string, value?: string): Promise<this> {
    let targetUnit: DefaultUnit;
    let attribute: string;
    let attributeValue: string;

    if (value !== undefined) {
      // 3 parameters: identifier, attribute, value
      targetUnit = await this.loadUnitFromIdentifier(identifierOrAttribute as UnitIdentifier);
      attribute = attributeOrValue!;
      attributeValue = value;
    } else {
      // 2 parameters: attribute, value (use context)
      if (!this.contextUnit) {
        throw new Error('No unit context loaded. Use "unit on <uuid|lnfile>" first or provide identifier parameter.');
      }
      targetUnit = this.contextUnit;
      attribute = identifierOrAttribute as string;
      attributeValue = attributeOrValue!;
    }

    // Set model attribute with type conversion
    (targetUnit.model as any)[attribute] = this.convertValue(attributeValue);
    
    // Update timestamp
    targetUnit.model.updatedAt = new Date().toISOString();
    
    // Save updated scenario
    const scenario = await targetUnit.toScenario();
    await targetUnit.storage.saveScenario(targetUnit.model.uuid, scenario, []);
    
    console.log(`✅ ${targetUnit.model.name || 'Unit'}: ${attribute} set to ${attributeValue}`);
    
    return this;
  }

  /**
   * Get model attribute value with universal identifier pattern or using loaded context
   * Web4 pattern: Universal <uuid|lnfile> parameter with context-aware overloading
   */
  async get(identifier: UnitIdentifier, attribute: string): Promise<this>;
  async get(attribute: string): Promise<this>;
  async get(identifierOrAttribute: UnitIdentifier | string, attribute?: string): Promise<this> {
    let targetUnit: DefaultUnit;
    let attributeName: string;

    if (attribute !== undefined) {
      // 2 parameters: identifier, attribute
      targetUnit = await this.loadUnitFromIdentifier(identifierOrAttribute as UnitIdentifier);
      attributeName = attribute;
    } else {
      // 1 parameter: attribute (use context)
      if (!this.contextUnit) {
        throw new Error('No unit context loaded. Use "unit on <uuid|lnfile>" first or provide identifier parameter.');
      }
      targetUnit = this.contextUnit;
      attributeName = identifierOrAttribute as string;
    }

    // Get model attribute value
    const value = (targetUnit.model as any)[attributeName];
    
    console.log(`📋 ${targetUnit.model.name || 'Unit'}.${attributeName}: ${value || '(not set)'}`);
    
    return this;
  }

  /**
   * Move unit link to target folder with correct relative path calculation
   * Web4 pattern: Unit link movement with automatic relative path recalculation
   */
  async move(lnfile: string, targetFolder: string): Promise<this> {
    const projectRoot = this.findProjectRoot();
    const sourcePath = path.isAbsolute(lnfile) ? lnfile : path.join(projectRoot, lnfile);
    const targetPath = path.isAbsolute(targetFolder) ? targetFolder : path.join(projectRoot, targetFolder);
    
    try {
      // 1. Read current symlink to get scenario path
      const currentTarget = await fs.readlink(sourcePath);
      const absoluteScenarioPath = path.isAbsolute(currentTarget) ? 
        currentTarget : 
        path.resolve(path.dirname(sourcePath), currentTarget);
      
      // 2. Ensure target directory exists
      await fs.mkdir(targetPath, { recursive: true });
      
      // 3. Calculate new filename and target path
      const filename = path.basename(sourcePath);
      const newLinkPath = path.join(targetPath, filename);
      
      // 4. Calculate correct relative path from new location to scenario
      const newRelativePath = path.relative(path.dirname(newLinkPath), absoluteScenarioPath);
      
      // 5. Remove old symlink
      await fs.unlink(sourcePath);
      
      // 6. Create new symlink with correct relative path
      await fs.symlink(newRelativePath, newLinkPath);
      
      console.log(`✅ Unit link moved: ${path.relative(projectRoot, sourcePath)} → ${path.relative(projectRoot, newLinkPath)}`);
      console.log(`   New relative path: ${newRelativePath}`);
      
      // 7. Update unit model references if this unit tracks the moved link
      await this.updateMovedLinkReferences(sourcePath, newLinkPath);
      
    } catch (error) {
      throw new Error(`Failed to move unit link: ${(error as Error).message}`);
    }
    
    return this;
  }

  /**
   * Discover files with same name and add as references with comprehensive metadata
   * Web4 pattern: Automatic copy detection with git hash IOR and sync status management
   */
  async discover(identifier: UnitIdentifier): Promise<this> {
    // 1. Load target unit
    const targetUnit = await this.loadUnitFromIdentifier(identifier);
    
    // 2. Extract filename from unit's origin
    const filename = this.extractFilenameFromOrigin(targetUnit.model.origin);
    if (!filename) {
      throw new Error('Cannot extract filename from unit origin for discovery');
    }
    
    console.log(`🔍 Discovering copies of: ${filename}`);
    console.log(`📁 Original unit: ${targetUnit.model.name || 'Unit'} (${targetUnit.model.uuid})`);
    console.log(`📍 Origin: ${targetUnit.model.origin}`);
    console.log('');
    
    // 3. Search entire project for files with same name
    const discoveredFiles = await this.findFilesByName(filename);
    
    // 4. Analyze each discovered file
    const analysisResults = [];
    for (const filePath of discoveredFiles) {
      const analysis = await this.analyzeDiscoveredFile(filePath, targetUnit);
      analysisResults.push(analysis);
      
      // Add as reference with comprehensive metadata
      if (!targetUnit.model.references) {
        targetUnit.model.references = [];
      }
      
      // Check if reference already exists
      const existingRef = targetUnit.model.references.find(ref => 
        ref.linkLocation.includes(filePath)
      );
      
      if (!existingRef) {
        (targetUnit.model.references as any[]).push({
          linkLocation: `ior:local:file://${filePath}`,
          linkTarget: `ior:unit:uuid:${targetUnit.model.uuid}`,
          syncStatus: SyncStatus.TO_BE_CHECKED,
          gitHashIOR: analysis.gitHashIOR,
          fileSize: analysis.fileSize,
          lastModified: analysis.lastModified,
          diffStatus: analysis.diffStatus
        });
      }
    }
    
    // 5. Generate detailed report
    this.generateDiscoveryReport(targetUnit, analysisResults);
    
    // 6. Save updated scenario
    const scenario = await targetUnit.toScenario();
    await targetUnit.storage.saveScenario(targetUnit.model.uuid, scenario, []);
    
    console.log(`✅ Discovery completed: ${analysisResults.length} copies analyzed and tracked`);
    
    return this;
  }

  /**
   * Copy unit's origin file to target location with automatic .unit LD link creation
   * Web4 pattern: Universal <uuid|lnfile> parameter pattern with scenario loading
   * 
   * @param identifier - Unit identifier (UUID or .unit file) @cliSyntax uuid|lnfile
   * @param targetFolder - Target directory for copy @cliSyntax targetFolder
   * @returns Promise resolving to this for chaining
   * @example
   * ```typescript
   * // Copy unit by UUID to directory - creates filename.ext and filename.ext.unit
   * await unit.copyInto('44443290-015c-4720-be80-c42caf842252', 'components/NewComponent/src/layer4/').execute();
   * 
   * // Copy unit by .unit file to directory
   * await unit.copyInto('TSCompletion.ts.unit', 'components/NewComponent/src/layer4/').execute();
   * ```
   */
  async copyInto(identifier: UnitIdentifier, targetFolder: string): Promise<this> {
    // 1. Load scenario from identifier (universal pattern)
    const targetUnit = await this.loadUnitFromIdentifier(identifier);
    
    // 2. Validate target unit has file origin
    if (!targetUnit.model.origin || !targetUnit.model.origin.startsWith('ior:git:')) {
      throw new Error('Target unit must have file origin for copyInto operation');
    }
    
    // 3. Extract source file path from target unit's origin IOR
    const sourceFilePath = this.extractFilePathFromIOR(targetUnit.model.origin);
    if (!sourceFilePath) {
      throw new Error('Cannot extract file path from target unit origin IOR');
    }
    
    // 4. Ensure source file exists
    const projectRoot = this.findProjectRoot();
    const fullSourcePath = path.join(projectRoot, sourceFilePath);
    
    try {
      await fs.access(fullSourcePath);
    } catch {
      throw new Error(`Source file not found: ${fullSourcePath}`);
    }
    
    // 5. Determine target file path (always directory for copyInto)
    const fullTargetPath = path.isAbsolute(targetFolder) ? 
      targetFolder : 
      path.join(projectRoot, targetFolder);
    
    // Use original filename in target directory
    const filename = path.basename(sourceFilePath);
    const targetFilePath = path.join(fullTargetPath, filename);
    
    // 6. Ensure target directory exists
    await fs.mkdir(fullTargetPath, { recursive: true });
    
    // 7. Copy the source file to target location
    await fs.copyFile(fullSourcePath, targetFilePath);
    console.log(`📄 Copied: ${sourceFilePath} → ${path.relative(projectRoot, targetFilePath)}`);
    
    // 8. Create .unit LD link next to copied file
    const unitLinkPath = `${targetFilePath}.unit`;
    const targetScenarioPath = await targetUnit.getScenarioPath();
    
    // Create relative symlink to target unit's scenario
    const relativePath = path.relative(path.dirname(unitLinkPath), targetScenarioPath);
    
    // Remove existing symlink if it exists
    try {
      await fs.unlink(unitLinkPath);
    } catch {
      // Ignore if file doesn't exist
    }
    
    await fs.symlink(relativePath, unitLinkPath);
    console.log(`🔗 Created LD link: ${path.basename(unitLinkPath)} → ${relativePath}`);
    
    // 9. Update target unit model with copy reference
    if (!targetUnit.model.references) {
      targetUnit.model.references = [];
    }
    
    targetUnit.model.references.push({
      linkLocation: `ior:local:ln:file://${path.relative(projectRoot, unitLinkPath)}`,
      linkTarget: `ior:unit:uuid:${targetUnit.model.uuid}`,
      syncStatus: SyncStatus.SYNCED
    });
    
    // 10. Save updated target unit scenario
    const targetScenario = await targetUnit.toScenario();
    await targetUnit.storage.saveScenario(targetUnit.model.uuid, targetScenario, [unitLinkPath]);
    
    console.log(`✅ CopyInto completed: ${filename} with .unit LD link`);
    
    return this;
  }

  /**
   * Execute the complete command chain and finalize operations
   * Web4 pattern: Final execution method for command chaining completion
   * 
   * @returns Promise<void> - Resolves when all chained operations complete
   * @example
   * ```typescript
   * await unit.from('component.ts').linkInto('backup/').transform(rules).validate(schema).execute();
   * ```
   */
  async execute(): Promise<void> {
    try {
      const extendedModel = this.model as any;
      
      // ✅ SAFE INTERACTIVE: Handle pending interactive browsing if requested
      if (extendedModel.pendingInteractiveBrowsing) {
        const browsing = extendedModel.pendingInteractiveBrowsing;
        console.log(`\n🔍 Interactive browsing: ${browsing.references.length} references for "${browsing.searchTerm}"`);
        console.log(`   💡 Background agent safe mode - showing summary instead of interactive less`);
        
        // Show safe summary instead of interactive less
        browsing.references.slice(0, 20).forEach((file: string, index: number) => {
          console.log(`   ${index + 1}. ${file}`);
        });
        
        if (browsing.references.length > 20) {
          console.log(`   ... and ${browsing.references.length - 20} more files`);
        }
        
        console.log(`\n   💡 Use 'unit link <uuid|lnfile> <file>' to track specific references`);
        
        // Clear pending browsing
        delete extendedModel.pendingInteractiveBrowsing;
      }
      
      // Save final unit state after all chained operations
      const scenario = await this.toScenario();
      await this.storage.saveScenario(this.model.uuid, scenario, []);
      
      console.log(`🎯 Command chain executed successfully!`);
      console.log(`   Unit: ${this.model.name || 'Unnamed'} (${this.model.uuid})`);
      console.log(`   Operations completed: ${this.getExecutedOperations()}`);
      console.log(`   Final state saved to: ${this.model.indexPath}`);
      
    } catch (error) {
      console.error(`❌ Failed to execute command chain: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Get list of executed operations in the command chain
   * @cliHide
   */
  private getExecutedOperations(): string {
    const operations: string[] = [];
    
    const extendedModel = this.model as any;
    if (extendedModel.lastTransformation) operations.push('transform');
    if (extendedModel.lastValidation) operations.push('validate');
    if (this.model.references?.length > 0) operations.push('link');
    
    return operations.join(' → ') || 'initialization';
  }

  /**
   * Find potential references to unit name in filesystem using grep
   * Web4 pattern: Filesystem reference discovery with command chaining support
   * 
   * @param name - Name to search for in filesystem @cliSyntax name
   * @returns this - Enables command chaining for fluent interface
   * @throws Error when search fails or name invalid
   * @example
   * ```typescript
   * await unit.find('TSCompletion').link('discovered-file.ts').execute();
   * ```
   */
  async find(name: string): Promise<this> {
    try {
      const { spawn } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(spawn);
      
      console.log(`🔍 Searching filesystem for references to: "${name}"`);
      
      // Use grep to search for name in project files
      const searchDirs = [
        'components',
        'scenarios', 
        'scrum.pmo',
        'docs',
        'scripts'
      ];
      
      const foundReferences: any[] = [];
      
      for (const dir of searchDirs) {
        try {
          // ✅ JEDI MODE: Enhanced grep with line and column positions for GitTextIOR
          const grepCommand = `grep -r -n -o -H "${name}" ${dir}/ 2>/dev/null || true`;
          const { exec } = await import('child_process');
          const execPromise = promisify(exec);
          
          const result = await execPromise(grepCommand);
          if (result.stdout) {
            const matches = result.stdout.trim().split('\n').filter(f => f.length > 0);
            
            // Parse grep output: filename:line:match
            for (const match of matches) {
              const parts = match.split(':');
              if (parts.length >= 3) {
                const filename = parts[0];
                const lineNumber = parts[1];
                const matchText = parts.slice(2).join(':');
                
                // Calculate column position
                const columnPosition = await this.calculateColumnPosition(filename, lineNumber, name);
                
                const referenceInfo = {
                  file: filename,
                  line: lineNumber,
                  column: columnPosition,
                  match: matchText,
                  gitTextIOR: `${filename}:${lineNumber},${columnPosition}`
                };
                
                foundReferences.push(referenceInfo);
              }
            }
          }
        } catch (error) {
          // Continue searching other directories
          console.log(`   Skipped ${dir}/ (${error instanceof Error ? error.message : 'inaccessible'})`);
        }
      }
      
      // ✅ FIX: Store found references in persistent location for cross-command access
      const { promises: fs } = await import('fs');
      const { tmpdir } = await import('os');
      const path = await import('path');
      
      // Store in temporary file for persistence across command invocations
      const tempFile = path.join(tmpdir(), 'unit-found-references.json');
      const foundReferencesData = {
        searchTerm: name,
        files: foundReferences,
        timestamp: new Date().toISOString(),
        count: foundReferences.length
      };
      
      await fs.writeFile(tempFile, JSON.stringify(foundReferencesData, null, 2), 'utf-8');
      
      // Also store in unit model for chaining support
      const extendedModel = this.model as any;
      extendedModel.foundReferences = foundReferencesData;
      
      console.log(`✅ Filesystem search completed for: "${name}"`);
      console.log(`   Found ${foundReferences.length} potential references with precise positioning:`);
      
      if (foundReferences.length > 0) {
        // ✅ JEDI MODE: Show GitTextIOR-ready references with line:column positions
        foundReferences.slice(0, 10).forEach((ref, index) => {
          if (typeof ref === 'object' && ref.gitTextIOR) {
            console.log(`   ${index + 1}. ${ref.file}:${ref.line},${ref.column} → "${ref.match}"`);
          } else {
            console.log(`   ${index + 1}. ${ref}`);
          }
        });
        
        if (foundReferences.length > 10) {
          console.log(`   ... and ${foundReferences.length - 10} more files`);
        }
        
        console.log(`\n   💡 Use 'unit link <uuid|lnfile> <file>' to track specific references`);
        console.log(`   💡 Chain commands: unit.find('${name}').list().execute() for interactive browsing`);
        console.log(`   💡 Use 'unit references <uuid|lnfile>' to show existing unit references`);
      } else {
        console.log(`   No references found in project directories`);
      }
      
      // ✅ COMMAND CHAINING: Return this for fluent interface
      return this;
      
    } catch (error) {
      console.error(`❌ Failed to search filesystem: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Check if this is a standalone find operation (no chaining)
   * @cliHide
   */
  private isStandaloneFindOperation(): boolean {
    // ✅ SAFE: Never show interactive for background agents - require chaining
    // Interactive less is dangerous for background agents
    return false;
  }

  /**
   * Calculate column position of match in file line
   * Web4 pattern: Precise positioning for GitTextIOR creation
   * @cliHide
   */
  private async calculateColumnPosition(filename: string, lineNumber: string, searchTerm: string): Promise<string> {
    try {
      const { promises: fs } = await import('fs');
      const fileContent = await fs.readFile(filename, 'utf-8');
      const lines = fileContent.split('\n');
      const lineIndex = parseInt(lineNumber) - 1; // Convert to 0-based index
      
      if (lineIndex >= 0 && lineIndex < lines.length) {
        const line = lines[lineIndex];
        const columnIndex = line.indexOf(searchTerm);
        if (columnIndex !== -1) {
          return (columnIndex + 1).toString(); // Convert to 1-based column
        }
      }
      
      return '1'; // Default to column 1 if not found
    } catch (error) {
      return '1'; // Default to column 1 on error
    }
  }

  /**
   * Show interactive find results using less for browsing
   * Web4 pattern: Interactive result browsing for large result sets
   * @cliHide
   */
  private async showInteractiveFindResults(foundReferences: string[], searchTerm: string): Promise<void> {
    try {
      // ✅ INTERACTIVE: Use less for large result sets
      if (foundReferences.length > 20) {
        console.log(`\n   📄 Opening ${foundReferences.length} results in interactive viewer...`);
        console.log(`   💡 Use 'q' to quit, '/' to search within results`);
        
        // Create temporary file with results
        const { promises: fs } = await import('fs');
        const { tmpdir } = await import('os');
        const path = await import('path');
        
        const tempFile = path.join(tmpdir(), `unit-find-${searchTerm}-${Date.now()}.txt`);
        
        const content = [
          `🔍 Filesystem Search Results for: "${searchTerm}"`,
          `📊 Found ${foundReferences.length} potential references`,
          `⏰ Search completed: ${new Date().toISOString()}`,
          '',
          '📁 Files containing references:',
          '=' .repeat(50),
          ...foundReferences.map((file, index) => `${(index + 1).toString().padStart(3)}: ${file}`),
          '',
          '💡 Usage Instructions:',
          '=' .repeat(50),
          `   unit link <uuid|lnfile> <file>              # Track specific reference`,
          `   unit find('${searchTerm}').link('file.ts').execute()  # Chain commands`,
          '',
          '🔗 Example Commands:',
          `   unit link 44443290-015c-4720-be80-c42caf842252 ${foundReferences[0] || 'file.ts'}`,
          `   unit linkInto TSCompletion.ts.unit backup/`,
          ''
        ].join('\n');
        
        await fs.writeFile(tempFile, content, 'utf-8');
        
        // Open in less
        const { spawn } = await import('child_process');
        const less = spawn('less', ['+G', tempFile], { stdio: 'inherit' });
        
        await new Promise((resolve) => {
          less.on('close', () => {
            // Clean up temp file
            fs.unlink(tempFile).catch(() => {});
            resolve(void 0);
          });
        });
        
      } else {
        // ✅ SIMPLE: Show all results for smaller sets
        foundReferences.forEach((file, index) => {
          console.log(`   ${index + 1}. ${file}`);
        });
        
        console.log(`\n   💡 Use 'unit link <uuid|lnfile> <file>' to track specific references`);
        console.log(`   💡 Chain commands: unit.find('${searchTerm}').link('file.ts').execute()`);
      }
      
    } catch (error) {
      // Fallback to simple display
      console.log(`   📄 Interactive display failed, showing simple list:`);
      foundReferences.slice(0, 20).forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
    }
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
      
      // TypeM3 validation (optional field)
      if (this.model.typeM3 && !Object.values(TypeM3).includes(this.model.typeM3)) return false;
      
      // Array properties
      if (!Array.isArray(this.model.references)) return false;
      
      // Timestamp validation
      if (!this.model.createdAt || isNaN(Date.parse(this.model.createdAt))) return false;
      if (!this.model.updatedAt || isNaN(Date.parse(this.model.updatedAt))) return false;
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async toScenario(name?: string): Promise<Scenario<UnitModel>> {
    // ✅ DYNAMIC VERSION: Use getComponentVersion() instead of hardcoded
    const componentVersion = await this.getComponentVersion();
    const componentName = await this.getComponentName();
    
    // Generate proper owner data
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: componentName,
      version: componentVersion
    });

    const scenario: Scenario = {
      ior: {
        uuid: this.model.uuid,
        component: componentName,
        version: componentVersion
      },
      owner: ownerData, // Modern TypeScript - no Web2 btoa() shit
      model: this.model
    };

    // Save to central storage with LD links - create named link in current directory
    const currentDir = process.cwd();
    const linkFilename = name ? `${name}.unit` : `unit-${this.model.uuid.slice(0, 8)}`;
    const namedLink = `${currentDir}/${linkFilename}`;
    
    await this.storage.saveScenario(this.model.uuid, scenario, [namedLink]);
    
    // ✅ AUTOMATIC LINKING: Create ontology and M3 typeM3 links
    await this.createAutomaticLinks();
    
    // Add to namedLinks array if name provided - location should be relative path from link to scenario
    if (name) {
      // Get the actual relative path that was used to create the symlink
      const { relative, dirname } = await import('path');
      const { readlinkSync } = await import('fs');
      
      try {
        const relativePath = readlinkSync(namedLink);
        // ✅ SAFETY: Ensure references array exists
        if (!this.model.references) {
          this.model.references = [];
        }
        this.model.references.push({
          linkLocation: `ior:local:ln:file:${namedLink}`,
          linkTarget: `ior:unit:${this.model.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      } catch (error) {
        console.error('Failed to read symlink for namedLinks:', (error as Error).message);
      }
    }
    
    // Load the saved scenario to get the updated model with correct storage paths
    try {
      const savedScenario = await this.storage.loadScenario(this.model.uuid);
      const originalReferences = this.model.references; // Save references before overwriting
      this.model = savedScenario.model as any; // Update our model with storage-corrected paths
      
      // Restore references if we had them
      if (originalReferences && originalReferences.length > 0) {
        this.model.references = originalReferences;
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
    // Note: executionCapabilities removed in 0.3.0.5 (Occam's Razor)
    console.log(`Note: Execution capability '${capability}' noted (capabilities removed in 0.3.0.5)`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Testing helper method
  getModel(): UnitModel {
    return this.model;
  }

  /**
   * Extract UUID from scenario path
   * @cliHide
   */
  private extractUuidFromPath(scenarioPath: string): string {
    // Extract UUID from path like ../scenarios/index/a/b/c/d/e/uuid.scenario.json
    const pathParts = scenarioPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    return filename.replace('.scenario.json', '');
  }

  /**
   * Calculate relative path between directories
   * @cliHide
   */
  private async calculateRelativePath(fromPath: string, toPath: string): Promise<string> {
    const { relative } = await import('path');
    return relative(fromPath, toPath);
  }

  // Advanced CLI Commands (Task 19) - Direct method naming convention v0.1.2.2
  /**
   * Create initial link to existing component with unified parameter support
   * Web4 pattern: Union type interface supporting both UUIDv4 and file path parameters
   * 
   * @param identifier - Unit identifier (UUIDv4 instance or UUID string)
   * @param filename - File path for link creation (relative to project root)
   * @returns Promise<void> - Resolves when link creation completes
   * @throws Error when UUID invalid or filename inaccessible
   * @example
   * ```typescript
   * await unit.link(UUIDv4.from('44443290-015c-4720-be80-c42caf842252'), 'auth-validator.unit');
   * await unit.link('44443290-015c-4720-be80-c42caf842252', 'auth-validator.unit');
   * ```
   */
  async link(identifier: UnitIdentifier, filename: string): Promise<void> {
    try {
      // ✅ NEW: Extract UUID from union type parameter
      let uuid: string;
      if (isUUIDv4(identifier)) {
        uuid = identifier.toString();
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        uuid = identifier;
      } else {
        throw new Error(`Invalid UUID identifier: ${identifier}`);
      }
      
      // Convert multi-word filenames (spaces → single dots) for consistency
      const convertedFilename = filename.replace(/\s+/g, '.');
      
      // Create new LD link to existing unit in different location
      const currentDir = process.cwd();
      const linkPath = `${currentDir}/${convertedFilename}.unit`;
      
      // Load existing unit scenario
      const existingScenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Update scenario with new link
      existingScenario.model.references.push({
        linkLocation: `ior:local:ln:file:${linkPath}`,
        linkTarget: `ior:unit:${uuid}`,
        syncStatus: SyncStatus.SYNCED
      });
      
      // Create new LD link pointing to existing scenario
      const scenarioPath = existingScenario.model.indexPath;
      await this.storage.saveScenario(uuid, existingScenario, [linkPath]);
      
      console.log(`✅ Link created: ${convertedFilename}.unit → ${uuid}`);
      console.log(`   Target: ${scenarioPath}`);
    } catch (error) {
      console.error(`Failed to create link: ${(error as Error).message}`);
    }
  }

  /**
   * Create link to unit in target folder with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param unit - Unit reference (UUID or .unit file) @cliSyntax uuid|lnfile
   * @param folder - Target directory (relative to project root) @cliSyntax folder
   * @param originalUnit - Optional original unit reference for copy tracking @cliSyntax uuid|lnfile @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @throws Error when unit invalid or folder inaccessible
   * @example
   * ```typescript
   * await unit.linkInto('44443290-015c-4720-be80-c42caf842252', 'backup/').transform(data).execute();
   * await unit.linkInto('TSCompletion.ts.unit', 'backup/').validate(rules).execute();
   * ```
   */
  async linkInto(unit: UnitIdentifier, folder: string, originalUnit?: UnitIdentifier): Promise<this> {
    try {
      const { promises: fs } = await import('fs');
      const { resolve, basename } = await import('path');
      
      let uuid: string;
      let linkFilename: string;
      
      // ✅ UNIFIED: Extract UUID from unit parameter
      if (isUUIDv4(unit)) {
        uuid = unit.toString();
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        linkFilename = this.convertNameToFilename(scenario.model.name) + '.unit';
      } else if (typeof unit === 'string' && this.isUUID(unit)) {
        uuid = unit;
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        linkFilename = this.convertNameToFilename(scenario.model.name) + '.unit';
      } else if (typeof unit === 'string') {
        // File path - extract UUID and preserve filename
        const { readlinkSync } = await import('fs');
        const currentDir = process.cwd();
        const existingLinkPath = resolve(currentDir, unit);
        
        const scenarioPath = readlinkSync(existingLinkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
        linkFilename = basename(unit);
      } else {
        throw new Error(`Invalid unit identifier: ${unit}`);
      }
      
      // Load unit scenario
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Create new link in target folder
      const targetPath = resolve(folder);
      const newLinkPath = `${targetPath}/${linkFilename}`;
      
      // Create directory if it doesn't exist
      await fs.mkdir(targetPath, { recursive: true });
      
      // Create symbolic link to scenario
      const relativePath = await this.calculateRelativePath(targetPath, scenario.model.indexPath);
      await fs.symlink(relativePath, newLinkPath);
      
      // Update scenario model with new link reference
      // ✅ SAFETY: Ensure references array exists
      if (!scenario.model.references) {
        scenario.model.references = [];
      }
      scenario.model.references.push({
        linkLocation: `ior:local:ln:file:${newLinkPath}`,
        linkTarget: `ior:unit:${uuid}`,
        syncStatus: SyncStatus.SYNCED
      });
      scenario.model.updatedAt = new Date().toISOString();
      
      // ✅ UNIFIED: Handle optional copy tracking
      if (originalUnit) {
        // Copy tracking logic
        let originalUUID: string;
        
        if (isUUIDv4(originalUnit)) {
          originalUUID = originalUnit.toString();
        } else if (typeof originalUnit === 'string' && this.isUUID(originalUnit)) {
          originalUUID = originalUnit;
        } else if (typeof originalUnit === 'string') {
          // Extract UUID from original unit file
          const { readlinkSync } = await import('fs');
          const currentDir = process.cwd();
          const originalLinkPath = resolve(currentDir, originalUnit);
          const originalScenarioPath = readlinkSync(originalLinkPath);
          originalUUID = this.extractUuidFromPath(originalScenarioPath);
        } else {
          throw new Error(`Invalid original unit identifier: ${originalUnit}`);
        }
        
        // Add copy reference to original unit
        const copyIOR = await this.generateSimpleIOR(newLinkPath);
        const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
        
        originalScenario.model.references.push({
          linkLocation: copyIOR,
          linkTarget: `ior:unit:${originalUUID}`,
          syncStatus: SyncStatus.SYNCED
        });
        originalScenario.model.updatedAt = new Date().toISOString();
        
        await this.storage.saveScenario(originalUUID, originalScenario, []);
        
        console.log(`✅ Copy reference added to original unit: ${originalUUID}`);
      }
      
      // Save updated scenario
      await this.storage.saveScenario(uuid, scenario, []);
      
      console.log(`✅ Link created in target folder: ${linkFilename}`);
      console.log(`   Unit: ${scenario.model.name} (${uuid})`);
      console.log(`   Target: ${newLinkPath}`);
      console.log(`   Copy tracking: ${originalUnit ? 'enabled' : 'disabled'}`);
      console.log(`   References: ${scenario.model.references.length}`);
      
      // ✅ COMMAND CHAINING: Return this for fluent interface
      return this;
    } catch (error) {
      console.error(`❌ Failed to create link: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }


  /**
   * Delete specific link file with unified parameter support
   * Web4 pattern: Union type interface supporting both UUID and file path parameters
   * 
   * @param identifier - Unit identifier (UUID string) or link file path
   * @returns Promise<void> - Resolves when link deletion completes
   * @throws Error when identifier invalid or link not found
   * @example
   * ```typescript
   * await unit.deleteLink('44443290-015c-4720-be80-c42caf842252');
   * await unit.deleteLink('TSCompletion.ts.unit');
   * ```
   */
  async deleteLink(identifier: UnitIdentifier): Promise<void> {
    try {
      // ✅ NEW: Handle unified parameter types
      let uuid: string;
      let linkPath: string;
      
      if (isUUIDv4(identifier)) {
        // UUIDv4 instance - find link by UUID
        uuid = identifier.toString();
        // Need to find the link file for this UUID (implementation needed)
        throw new Error('UUID-based link deletion not yet implemented');
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        // UUID string - find link by UUID
        uuid = identifier;
        // Need to find the link file for this UUID (implementation needed)
        throw new Error('UUID-based link deletion not yet implemented');
      } else if (typeof identifier === 'string') {
        // File path - use as link file
        const { readlinkSync, unlinkSync } = await import('fs');
        const currentDir = process.cwd();
        // Check if identifier is already a full path or relative path
        linkPath = identifier.startsWith('/') ? identifier : `${currentDir}/${identifier}`;
        
        // Read the symlink to get scenario path
        const scenarioPath = readlinkSync(linkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
        
        // Load unit scenario
        const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
        
        // Remove from references
        const referenceIndex = scenario.model.references.findIndex(
          ref => ref.linkLocation.includes(identifier)
        );
        if (referenceIndex > -1) {
          scenario.model.references.splice(referenceIndex, 1);
        }
        
        // Update scenario in storage
        await this.storage.saveScenario(uuid, scenario, []);
        
        // Remove the actual link file
        unlinkSync(linkPath);
        
        // Check if parent directory is empty and remove it if so
        await this.cleanupEmptyDirectories(path.dirname(linkPath));
        
        console.log(`✅ Link deleted: ${identifier}`);
      } else {
        throw new Error(`Invalid identifier for deletion: ${identifier}`);
      }
      console.log(`   Unit ${uuid} preserved in central storage`);
      console.log(`   Remaining links: ${[].length}`);
    } catch (error) {
      console.error(`Failed to delete link: ${(error as Error).message}`);
    }
  }

  async deleteUnit(linkFilename: string): Promise<void> {
    try {
      // Resolve link file to get target UUID
      const { readlinkSync, unlinkSync } = await import('fs');
      const { unlink } = await import('fs/promises');
      const currentDir = process.cwd();
      const linkPath = `${currentDir}/${linkFilename}`;
      
      // Read the symlink to get scenario path
      const scenarioPath = readlinkSync(linkPath);
      const uuid = this.extractUuidFromPath(scenarioPath);
      
      // Load unit scenario to get all links
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      // Delete all LD link files
      let deletedLinks = 0;
      for (const symlinkPath of []) {
        try {
          unlinkSync(symlinkPath);
          deletedLinks++;
          console.log(`   Deleted link: ${symlinkPath}`);
        } catch (error) {
          console.warn(`   Warning: Could not delete link ${symlinkPath}: ${(error as Error).message}`);
        }
      }
      
      // Delete the unit scenario from central storage
      const scenarioFullPath = scenario.model.indexPath;
      await unlink(scenarioFullPath);
      
      console.log(`✅ Unit deleted completely: ${uuid}`);
      console.log(`   Scenario removed: ${scenarioFullPath}`);
      console.log(`   Links deleted: ${deletedLinks}/${[].length}`);
      console.log(`   References removed: ${scenario.model.references.length}`);
    } catch (error) {
      console.error(`Failed to delete unit: ${(error as Error).message}`);
    }
  }

  /**
   * Show all references for unit (renamed from list for clarity)
   * Web4 pattern: Union type interface supporting both UUID and file path parameters
   * 
   * @param identifier - Unit identifier (UUID string) or link file path @cliSyntax uuid|lnfile
   * @returns Promise<void> - Resolves when reference listing completes
   * @throws Error when identifier invalid or unit not found
   * @example
   * ```typescript
   * await unit.references('44443290-015c-4720-be80-c42caf842252');
   * await unit.references('TSCompletion.ts.unit');
   * ```
   */
  async references(identifier: UnitIdentifier): Promise<void> {
    try {
      // ✅ NEW: Extract UUID from unified parameter
      let uuid: string;
      
      if (isUUIDv4(identifier)) {
        uuid = identifier.toString();
      } else if (typeof identifier === 'string' && this.isUUID(identifier)) {
        uuid = identifier;
      } else if (typeof identifier === 'string') {
        // File path - extract UUID from link
        const { readlinkSync } = await import('fs');
        const { resolve } = await import('path');
        const currentDir = process.cwd();
        const linkPath = resolve(currentDir, identifier);
        const scenarioPath = readlinkSync(linkPath);
        uuid = this.extractUuidFromPath(scenarioPath);
      } else {
        throw new Error(`Invalid identifier for listing: ${identifier}`);
      }
      
      // Load unit scenario and list all LD links
      const scenario = await this.storage.loadScenario(uuid) as Scenario<UnitModel>;
      
      console.log(`LD Links for Unit ${uuid}:`);
      // Note: Legacy symlinkPaths display removed in 0.3.0.5 (pure references array)
      
      if (scenario.model.references && scenario.model.references.length > 0) {
        console.log(`References:`);
        scenario.model.references.forEach((ref: any) => {
          const filename = ref.linkLocation.split('/').pop() || 'unknown';
          console.log(`  - ${filename} → ${ref.linkTarget} (${ref.syncStatus})`);
        });
      }
    } catch (error) {
      console.error(`Failed to show references: ${(error as Error).message}`);
    }
  }

  /**
   * List found references with safe browsing for background agents
   * Web4 pattern: Safe reference browsing without hanging interactive commands
   * 
   * @returns Promise<void> - Resolves when listing completes
   * @throws Error when no found references available
   * @example
   * ```typescript
   * await unit.find('TSCompletion'); // Discover references
   * await unit.list();               // Browse found references safely
   * ```
   */
  async list(): Promise<void> {
    try {
      // ✅ FIX: Try to load found references from persistent storage first
      const { promises: fs } = await import('fs');
      const { tmpdir } = await import('os');
      const path = await import('path');
      
      const tempFile = path.join(tmpdir(), 'unit-found-references.json');
      let foundRefs: any = null;
      
      try {
        const data = await fs.readFile(tempFile, 'utf-8');
        foundRefs = JSON.parse(data);
      } catch {
        // Fallback to unit model
        const extendedModel = this.model as any;
        foundRefs = extendedModel.foundReferences;
      }
      
      if (!foundRefs || !foundRefs.files || foundRefs.files.length === 0) {
        console.log(`❌ No found references available`);
        console.log(`   💡 Use 'unit find <name>' first to discover references`);
        return;
      }
      
      console.log(`\n📄 Browsing ${foundRefs.count} found references for: "${foundRefs.searchTerm}"`);
      console.log(`   💡 Background agent safe mode - showing detailed list\n`);
      
      // ✅ SAFE: Show detailed list without interactive less
      foundRefs.files.forEach((file: string, index: number) => {
        const displayIndex = (index + 1).toString().padStart(4);
        console.log(`   ${displayIndex}: ${file}`);
      });
      
      console.log(`\n✅ Listed ${foundRefs.count} references for "${foundRefs.searchTerm}"`);
      console.log(`   💡 Use 'unit link <uuid|lnfile> <file>' to track specific references`);
      console.log(`   💡 Use 'unit references <uuid|lnfile>' to show existing unit references`);
      
    } catch (error) {
      console.error(`❌ Failed to list found references: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  // Method overloads for different parameter sets (Decision 5b)
  /**
   * Create unit from file with command chaining support
   * Web4 pattern: Fluent interface enabling natural command chaining
   * 
   * @param filename - Source file path @cliSyntax file
   * @param startPos - Start position for word-in-file @cliSyntax position @cliOptional
   * @param endPos - End position for word-in-file @cliSyntax position @cliOptional
   * @returns this - Enables command chaining for fluent interface
   * @example
   * ```typescript
   * await unit.from('component.ts').linkInto('backup/').transform(data).execute();
   * await unit.from('file.ts', '1,1', '10,20').validate(rules).execute();
   * ```
   */
  async from(filename: string): Promise<this>;
  async from(filename: string, startPos: string, endPos: string): Promise<this>;
  async from(pathInput: string, startPos?: string, endPos?: string): Promise<this> {
    try {
      const projectRoot = this.findProjectRoot();
      const fullPath = path.isAbsolute(pathInput) ? pathInput : path.join(projectRoot, pathInput);
      
      // Check if path is folder or file
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        // ✅ REVOLUTIONARY: Create folder atomic element
        await this.createFromFolder(pathInput);
      } else {
        // ✅ EXISTING: File functionality
        if (startPos && endPos) {
          // Word-in-file mode: GitTextIOR with positions
          await this.createFromWordInFile(pathInput, startPos, endPos);
        } else {
          // Complete file mode: Simple ior:url reference
          await this.createFromCompleteFile(pathInput);
        }
      }
      
      // ✅ COMMAND CHAINING: Return this for fluent interface
      return this;
    } catch (error) {
      console.error(`Failed to create unit from file: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Create unit from word-in-file with GitTextIOR (precise positioning)
   */
  private async createFromWordInFile(filename: string, startPos: string, endPos: string): Promise<void> {
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
    
    console.log(`✅ Unit created from word-in-file: ${unitName}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin GitTextIOR: ${originIOR}`);
    console.log(`   Extracted from: ${filename} (${startPos}-${endPos})`);
  }

  /**
   * Create unit from complete file with simple ior:url reference
   */
  private async createFromCompleteFile(filename: string): Promise<void> {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    // Generate simple IOR from file (Decision 4a)
    const originIOR = await this.generateSimpleIOR(filename);
    
    // Extract file name for unit name
    const fileName = path.basename(filename, path.extname(filename));
    
    // Analyze file type for TypeM3 classification
    const extension = path.extname(filename);
    if (extension === '.ts' || extension === '.js') {
      this.model.typeM3 = TypeM3.CLASS;
    } else if (extension === '.md' || extension === '.txt') {
      this.model.typeM3 = TypeM3.ATTRIBUTE;
    } else {
      this.model.typeM3 = TypeM3.ATTRIBUTE;
    }
    
    // Update unit model
    this.model.name = fileName;
    this.model.origin = originIOR;
    this.model.definition = originIOR; // Same as origin for complete files
    this.model.updatedAt = new Date().toISOString();
    
    // Store unit
    const scenario = await this.toScenario();
    await this.storage.saveScenario(this.model.uuid, scenario, []);
    
    console.log(`✅ Unit created from complete file: ${fileName}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin IOR: ${originIOR}`);
    console.log(`   File: ${filename}`);
    console.log(`   TypeM3: ${this.model.typeM3}`);
  }


  /**
   * Generate simple IOR format: ior:giturlFromFile
   */
  private async generateSimpleIOR(filePath: string): Promise<string> {
    // Simple IOR format as requested
    const projectRoot = this.findProjectRoot();
    const path = await import('path');
    const relativePath = path.relative(projectRoot, filePath);
    
    return `ior:git:github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/${relativePath}`;
  }

  /**
   * Check if origin has changed and sync is needed
   */
  private async checkOriginSync(): Promise<{ needsSync: boolean; changes: string[] }> {
    try {
      const { promises: fs } = await import('fs');
      
      if (!this.model.origin) {
        return { needsSync: false, changes: [] };
      }
      
      // Extract file path from IOR
      const filePath = this.extractFilePathFromIOR(this.model.origin);
      if (!filePath) {
        return { needsSync: false, changes: ['Cannot extract file path from IOR'] };
      }
      
      // Check if file exists and get modification time
      const stats = await fs.stat(filePath);
      const fileModTime = stats.mtime;
      const unitModTime = new Date(this.model.updatedAt);
      
      const needsSync = fileModTime > unitModTime;
      const changes = needsSync ? [`File modified: ${fileModTime.toISOString()} > Unit: ${unitModTime.toISOString()}`] : [];
      
      return { needsSync, changes };
      
    } catch (error) {
      return { needsSync: false, changes: [`Error checking sync: ${(error as Error).message}`] };
    }
  }

  /**
   * Extract file path from IOR format
   */
  private extractFilePathFromIOR(ior: string): string | null {
    // Parse ior:git:github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/once0304/path
    const match = ior.match(/ior:git:github\.com\/Cerulean-Circle-GmbH\/Web4Articles\/blob\/dev\/once0304\/(.+)/);
    return match ? match[1] : null;
  }


  /**
   * @cliHide - Obsolete: Use unit get <uuid|lnfile> origin instead
   */
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

  /**
   * Show terminal identity warning only when appropriate
   * Web4 pattern: Conditional warning based on context and completeness
   * @cliHide
   */
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

  /**
   * Check terminal identity and warn only if unit is being saved/persisted
   * Web4 pattern: Context-aware warning for terminal identity completeness
   * @cliHide
   */
  private checkTerminalIdentityBeforePersistence(): void {
    // Only warn if unit is being saved and identity is incomplete
    const validation = this.validateTerminalIdentity();
    if (!validation.isComplete && this.model.name && this.model.definition) {
      // Unit has been used but still missing some identity - warn
      this.showTerminalIdentityWarning();
    }
  }

  addStorageCapability(capability: string): this {
    // Note: storageCapabilities removed in 0.3.0.5 (Occam's Razor)
    console.log(`Note: Storage capability '${capability}' noted (capabilities removed in 0.3.0.5)`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  // Speaking name resolution methods (Decision 2a - in DefaultUnit)
  private async resolveSpeakingName(speakingName: string): Promise<string | null> {
    try {
      // ✅ IMPLEMENTED: Speaking name to UUID resolution using ontology links
      const projectRoot = this.findProjectRoot();
      const ontologyDir = path.join(projectRoot, 'scenarios', 'ontology');
      const unitFileName = `${speakingName.replace(/\s+/g, '.')}.unit`;
      const unitLinkPath = path.join(ontologyDir, unitFileName);
      
      // Check if the speaking name exists as a unit link
      try {
        await fs.access(unitLinkPath);
        const scenarioPath = await fs.readlink(unitLinkPath);
        // Extract UUID from scenario path (last part before .scenario.json)
        const uuidMatch = scenarioPath.match(/([a-f0-9-]{36})\.scenario\.json$/);
        if (uuidMatch) {
          return uuidMatch[1];
        }
      } catch {
        // Unit link doesn't exist, continue to search
      }
      
      // Fallback: Search through all units for matching names
      const indexDir = path.join(projectRoot, 'scenarios', 'index');
      const allScenarios = await this.findAllScenarios(indexDir);
      
      for (const scenarioPath of allScenarios) {
        try {
          const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
          const scenario = JSON.parse(scenarioContent);
          if (scenario.model?.name === speakingName) {
            return scenario.ior.uuid;
          }
        } catch {
          // Skip invalid scenarios
        }
      }
      
      return null;
    } catch (error) {
      console.warn(`Failed to resolve speaking name ${speakingName}: ${(error as Error).message}`);
      return null;
    }
  }

  /**
   * Find all scenario files in the index directory
   * Web4 pattern: Recursive scenario discovery for speaking name resolution
   */
  private async findAllScenarios(indexDir: string): Promise<string[]> {
    const scenarios: string[] = [];
    
    async function scanDirectory(dir: string): Promise<void> {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await scanDirectory(fullPath);
          } else if (entry.name.endsWith('.scenario.json')) {
            scenarios.push(fullPath);
          }
        }
      } catch {
        // Skip directories that can't be read
      }
    }
    
    await scanDirectory(indexDir);
    return scenarios;
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

  /**
   * Upgrade unit model to target version
   * Radical OOP: Method implementation of Upgrade interface
   * Modern TypeScript: ESM imports, type safety, class-based pattern
   */
  async upgrade(targetVersion: string): Promise<boolean> {
    try {
      if (targetVersion === '0.3.0.5') {
        return await this.upgradeToVersion035();
      }
      
      throw new Error(`Unsupported upgrade target version: ${targetVersion}`);
    } catch (error) {
      console.error(`Upgrade failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Upgrade from 0.3.0.4 to 0.3.0.5 model
   * Transforms symlinkPaths + namedLinks to unified references array
   * Keeps existing IOR string format for compatibility
   */
  private async upgradeToVersion035(): Promise<boolean> {
    const currentModel = this.model as any; // Cast for 0.3.0.4 compatibility
    
    // Transform to enhanced 0.3.0.5 model
    const enhancedModel: UnitModel = {
      uuid: currentModel.uuid,
      name: currentModel.name,
      origin: currentModel.origin || '',           // ✅ UNCHANGED: IOR string format
      definition: currentModel.definition || '',   // ✅ UNCHANGED: IOR string format
      typeM3: currentModel.typeM3,
      indexPath: currentModel.indexPath,
      
      // ✅ ENHANCED: Transform arrays to unified references
      references: this.transformArraysToReferences(currentModel),
      
      createdAt: currentModel.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Update internal model
    this.model = enhancedModel;
    
    // Save enhanced scenario with version update
    const scenario = await this.toScenario();
    scenario.ior.version = '0.3.0.5';
    await this.storage.saveScenario(this.model.uuid, scenario, []);
    
    console.log(`✅ Unit upgraded to 0.3.0.5: ${this.model.uuid}`);
    return true;
  }

  /**
   * Transform old arrays to unified references (0.3.0.4 → 0.3.0.5)
   * Uses existing IOR string format for compatibility
   */
  private transformArraysToReferences(currentModel: any): UnitReference[] {
    const references: UnitReference[] = [];
    
    // Convert symlinkPaths to references
    if (currentModel.symlinkPaths) {
      for (const path of currentModel.symlinkPaths) {
        references.push({
          linkLocation: `ior:local:ln:file:${path}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    // Convert namedLinks to references
    if (currentModel.namedLinks) {
      for (const link of currentModel.namedLinks) {
        const absolutePath = this.resolveLinkPath(link.location, link.filename);
        references.push({
          linkLocation: `ior:local:ln:file:${absolutePath}`,
          linkTarget: `ior:unit:${currentModel.uuid}`,
          syncStatus: SyncStatus.SYNCED
        });
      }
    }
    
    return references;
  }

  // ❌ REMOVED: Legacy symlinks compatibility methods (migration successful)

  /**
   * Resolve link path from location and filename (0.3.0.4 compatibility)
   */
  private resolveLinkPath(location: string, filename: string): string {
    const baseDir = location.replace('../scenarios/', '/workspace/scenarios/');
    return `${dirname(baseDir)}/${filename}`;
  }

  /**
   * Rename a unit link file and update all references in the unit model
   * Web4 pattern: IOR-based reference updating with file system synchronization
   * 
   * @param oldLinkPath - Current link file path (relative to project root)
   * @param newLinkPath - New link file path (relative to project root)
   * @returns Promise<void> - Resolves when link rename and reference updates complete
   * @throws Error when old link doesn't exist or new link path is invalid
   * @example
   * ```typescript
   * await unit.renameLink('TSCompletion.unit', 'TSCompletion.ts.unit');
   * ```
   */
  async renameLink(oldLinkPath: string, newLinkPath: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      // Resolve absolute paths
      const projectRoot = this.findProjectRoot();
      const oldAbsolutePath = path.resolve(projectRoot, oldLinkPath);
      const newAbsolutePath = path.resolve(projectRoot, newLinkPath);
      
      // Check if old link exists
      if (!existsSync(oldAbsolutePath)) {
        throw new Error(`Link file not found: ${oldLinkPath}`);
      }
      
      // Rename the physical file
      await fs.rename(oldAbsolutePath, newAbsolutePath);
      
      // Update references in unit model
      if (this.model.references) {
        for (const reference of this.model.references) {
          // Update linkLocation if it matches the old path
          if (reference.linkLocation.includes(oldLinkPath)) {
            reference.linkLocation = reference.linkLocation.replace(oldLinkPath, newLinkPath);
          }
        }
      }
      
      // Update model timestamp
      this.model.updatedAt = new Date().toISOString();
      
      // Save updated model
      const scenario = await this.toScenario();
      await this.storage.saveScenario(this.model.uuid, scenario, []);
      
      console.log(`✅ Link renamed: ${oldLinkPath} → ${newLinkPath}`);
      console.log(`   References updated in unit model: ${this.model.uuid}`);
      
    } catch (error) {
      console.error(`❌ Failed to rename link: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Rename the unit and update all associated file references and paths
   * Web4 pattern: Comprehensive name change with IOR reference updating
   * Updates unit name, file paths, link names, and all references containing the old name
   * 
   * @param newName - New name for the unit (kebab-case preferred)
   * @returns Promise<void> - Resolves when unit rename and all reference updates complete
   * @throws Error when new name is invalid or conflicts exist
   * @example
   * ```typescript
   * await unit.rename('ts-completion-enhanced');
   * ```
   */
  async rename(newName: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      if (!newName || newName.trim().length === 0) {
        throw new Error('New name cannot be empty');
      }
      
      const oldName = this.model.name;
      const projectRoot = this.findProjectRoot();
      
      // Update unit model name
      this.model.name = newName.trim();
      this.model.updatedAt = new Date().toISOString();
      
      // Update references that contain the old name
      if (this.model.references) {
        for (const reference of this.model.references) {
          // Update linkLocation paths that contain old name
          if (reference.linkLocation.includes(oldName)) {
            reference.linkLocation = reference.linkLocation.replace(
              new RegExp(oldName, 'g'), 
              newName
            );
          }
        }
      }
      
      // Update origin and definition IORs if they contain the old name
      if (this.model.origin && this.model.origin.includes(oldName)) {
        this.model.origin = this.model.origin.replace(
          new RegExp(oldName, 'g'), 
          newName
        );
      }
      
      if (this.model.definition && this.model.definition.includes(oldName)) {
        this.model.definition = this.model.definition.replace(
          new RegExp(oldName, 'g'), 
          newName
        );
      }
      
      // Find and rename associated files that include the old name
      const potentialFiles = [
        `${oldName}.unit`,
        `${oldName}.ts.unit`,
        `${oldName}.link`,
        `${oldName}.ts`,
        `${oldName}.js`
      ];
      
      // Search for files in the project that might need renaming
      const filesToRename: Array<{oldPath: string, newPath: string}> = [];
      
      // Check common locations for unit-related files
      const searchDirs = [
        'components',
        'scenarios',
        'scrum.pmo',
        'docs'
      ];
      
      for (const dir of searchDirs) {
        const dirPath = path.resolve(projectRoot, dir);
        if (existsSync(dirPath)) {
          await this.findFilesToRename(dirPath, oldName, newName, filesToRename);
        }
      }
      
      // Rename found files
      for (const {oldPath, newPath} of filesToRename) {
        try {
          await fs.rename(oldPath, newPath);
          console.log(`✅ File renamed: ${path.relative(projectRoot, oldPath)} → ${path.relative(projectRoot, newPath)}`);
        } catch (error) {
          console.warn(`⚠️  Could not rename file: ${oldPath} (${error instanceof Error ? error.message : error})`);
        }
      }
      
      // Save updated model
      const scenario = await this.toScenario();
      await this.storage.saveScenario(this.model.uuid, scenario, []);
      
      console.log(`✅ Unit renamed: "${oldName}" → "${newName}"`);
      console.log(`   UUID: ${this.model.uuid}`);
      console.log(`   References updated: ${this.model.references?.length || 0}`);
      
    } catch (error) {
      console.error(`❌ Failed to rename unit: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Recursively find files that contain the old name and should be renamed
   * Helper method for comprehensive unit renaming
   * @cliHide
   */
  private async findFilesToRename(
    dirPath: string, 
    oldName: string, 
    newName: string, 
    filesToRename: Array<{oldPath: string, newPath: string}>
  ): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively search subdirectories
          await this.findFilesToRename(fullPath, oldName, newName, filesToRename);
        } else if (entry.isFile()) {
          // Check if filename contains old name
          if (entry.name.includes(oldName)) {
            const newFileName = entry.name.replace(new RegExp(oldName, 'g'), newName);
            const newPath = path.join(dirPath, newFileName);
            filesToRename.push({
              oldPath: fullPath,
              newPath: newPath
            });
          }
        }
      }
    } catch (error) {
      // Continue search even if some directories are inaccessible
      console.warn(`⚠️  Could not search directory: ${dirPath}`);
    }
  }

  /**
   * Check if string is a valid UUID format
   * Helper method for parameter type detection
   */
  private isUUID(str: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  /**
   * Convert unit name to filename with 0.3.0.4 perfected standards
   * Web4 pattern: Spaces to dots, preserve capitalization, safe filename characters
   * 
   * @param name - Unit name to convert
   * @returns Filename-safe string with spaces converted to dots (0.3.0.4 standard)
   * @example
   * ```typescript
   * convertNameToFilename("UUID Indexing") // returns "UUID.Indexing"
   * convertNameToFilename("Async Method Signature Update") // returns "Async.Method.Signature.Update"
   * convertNameToFilename("TSCompletion") // returns "TSCompletion"
   * ```
   */
  private convertNameToFilename(name: string): string {
    if (!name) return 'unnamed';
    
    return name
      .replace(/\s+/g, '.')            // ✅ CORRECT: Replace spaces with dots
      .replace(/[^A-Za-z0-9.-]/g, '')  // ✅ CORRECT: Keep uppercase letters (0.3.0.4 standard)
      .replace(/\.+/g, '.')            // ✅ CORRECT: Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, '');      // ✅ CORRECT: Remove leading/trailing dots
  }

  /**
   * Detect changes in copy files and notify origin units
   * Web4 pattern: Bidirectional sync architecture with change propagation
   * 
   * @param copyPath - Path to copy file to check for changes
   * @param originalUUID - UUID of original unit to notify
   * @returns Promise<ChangeStatus> - Status of change detection
   * @example
   * ```typescript
   * const status = await unit.detectCopyChanges('components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts', 'original-uuid');
   * ```
   */
  async detectCopyChanges(copyPath: string, originalUUID: string): Promise<string> {
    try {
      const { promises: fs } = await import('fs');
      
      // Get copy file stats
      const copyStats = await fs.stat(copyPath);
      
      // Load original unit to compare
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      const originalPath = this.extractFilePathFromIOR(originalScenario.model.origin);
      
      if (!originalPath) {
        return 'NO_ORIGIN';
      }
      
      // Get original file stats
      const originalStats = await fs.stat(originalPath);
      
      // Compare modification times
      if (copyStats.mtime > originalStats.mtime) {
        // Copy is newer - notify origin
        await this.notifyOriginOfCopyChange(originalUUID, copyPath, 'COPY_NEWER');
        return 'COPY_NEWER';
      } else if (originalStats.mtime > copyStats.mtime) {
        // Origin is newer - recommend sync
        console.log(`📢 Copy sync recommended: ${copyPath}`);
        console.log(`   Origin is newer: ${originalPath}`);
        return 'ORIGIN_NEWER';
      }
      
      return 'SYNCHRONIZED';
      
    } catch (error) {
      console.error(`❌ Failed to detect copy changes: ${error instanceof Error ? error.message : error}`);
      return 'ERROR';
    }
  }

  /**
   * Notify origin unit of copy changes
   * Web4 pattern: Origin notification with sync recommendations
   * 
   * @param originalUUID - UUID of original unit to notify
   * @param copyPath - Path to modified copy file
   * @param changeType - Type of change detected
   * @returns Promise<void> - Resolves when notification completes
   */
  async notifyOriginOfCopyChange(originalUUID: string, copyPath: string, changeType: string): Promise<void> {
    try {
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      
      // Find copy reference in original unit
      const copyReference = originalScenario.model.references.find(ref => 
        ref.linkLocation.includes(copyPath) || ref.linkLocation.includes(copyPath.replace(/.*\//, ''))
      );
      
      if (copyReference) {
        // Update sync status to indicate change
        copyReference.syncStatus = SyncStatus.MODIFIED;
        
        // Add notification metadata to model (extend with any for flexibility)
        const extendedModel = originalScenario.model as any;
        if (!extendedModel.notifications) {
          extendedModel.notifications = [];
        }
        
        extendedModel.notifications.push({
          type: 'COPY_CHANGE',
          copyPath: copyPath,
          changeType: changeType,
          timestamp: new Date().toISOString(),
          syncRecommended: true
        });
        
        originalScenario.model.updatedAt = new Date().toISOString();
        
        // Save updated original unit
        await this.storage.saveScenario(originalUUID, originalScenario, []);
        
        console.log(`📢 Origin notified of copy change: ${originalUUID}`);
        console.log(`   Copy: ${copyPath}`);
        console.log(`   Change: ${changeType}`);
        console.log(`   Sync recommended: Use 'unit syncFromCopy' to update origin`);
      }
      
    } catch (error) {
      console.error(`❌ Failed to notify origin: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Sync origin from modified copy file
   * Web4 pattern: Bidirectional sync with copy-to-origin propagation
   * 
   * @param copyPath - Path to modified copy file
   * @param originalUUID - UUID of original unit to update
   * @returns Promise<void> - Resolves when sync completes
   * @throws Error when sync fails or conflicts detected
   * @example
   * ```typescript
   * await unit.syncFromCopy('components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts', 'original-uuid');
   * ```
   */
  async syncFromCopy(copyPath: string, originalUUID: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      
      // Load original unit
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      const originalPath = this.extractFilePathFromIOR(originalScenario.model.origin);
      
      if (!originalPath) {
        throw new Error('Original file path not found in origin IOR');
      }
      
      // Copy the modified file back to origin
      await fs.copyFile(copyPath, originalPath);
      
      // Update sync status in references
      const copyReference = originalScenario.model.references.find(ref => 
        ref.linkLocation.includes(copyPath)
      );
      
      if (copyReference) {
        copyReference.syncStatus = SyncStatus.SYNCED;
      }
      
      // Clear notifications
      const extendedModel = originalScenario.model as any;
      if (extendedModel.notifications) {
        extendedModel.notifications = extendedModel.notifications.filter((n: any) => 
          n.type !== 'COPY_CHANGE' || !n.copyPath.includes(copyPath)
        );
      }
      
      originalScenario.model.updatedAt = new Date().toISOString();
      
      // Save updated original unit
      await this.storage.saveScenario(originalUUID, originalScenario, []);
      
      console.log(`✅ Origin synced from copy: ${originalUUID}`);
      console.log(`   Copy: ${copyPath}`);
      console.log(`   Origin: ${originalPath}`);
      console.log(`   Status: SYNCED`);
      
    } catch (error) {
      console.error(`❌ Failed to sync from copy: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Sync copy from updated origin file
   * Web4 pattern: Bidirectional sync with origin-to-copy propagation
   * 
   * @param copyPath - Path to copy file to update
   * @param originalUUID - UUID of original unit to sync from
   * @returns Promise<void> - Resolves when sync completes
   * @throws Error when sync fails or conflicts detected
   * @example
   * ```typescript
   * await unit.syncToCopy('components/Unit/0.3.0.5/src/ts/layer4/TSCompletion.ts', 'original-uuid');
   * ```
   */
  async syncToCopy(copyPath: string, originalUUID: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      
      // Load original unit
      const originalScenario = await this.storage.loadScenario(originalUUID) as Scenario<UnitModel>;
      const originalPath = this.extractFilePathFromIOR(originalScenario.model.origin);
      
      if (!originalPath) {
        throw new Error('Original file path not found in origin IOR');
      }
      
      // Copy the original file to copy location
      await fs.copyFile(originalPath, copyPath);
      
      // Update sync status in references
      const copyReference = originalScenario.model.references.find(ref => 
        ref.linkLocation.includes(copyPath)
      );
      
      if (copyReference) {
        copyReference.syncStatus = SyncStatus.SYNCED;
      }
      
      originalScenario.model.updatedAt = new Date().toISOString();
      
      // Save updated original unit
      await this.storage.saveScenario(originalUUID, originalScenario, []);
      
      console.log(`✅ Copy synced from origin: ${originalUUID}`);
      console.log(`   Origin: ${originalPath}`);
      console.log(`   Copy: ${copyPath}`);
      console.log(`   Status: SYNCED`);
      
    } catch (error) {
      console.error(`❌ Failed to sync to copy: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }


  /**
   * Check if path is a directory
   * Web4 pattern: Path type detection with fallback logic
   */
  private async isDirectory(targetPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(targetPath);
      return stats.isDirectory();
    } catch {
      // If path doesn't exist, check if it ends with common file extensions
      return !targetPath.match(/\.[a-zA-Z0-9]+$/);
    }
  }

  /**
   * Get scenario file path for current unit
   * Web4 pattern: Scenario path resolution for LD links
   */
  private async getScenarioPath(): Promise<string> {
    const projectRoot = this.findProjectRoot();
    const uuid = this.model.uuid;
    const indexPath = this.buildIndexPath(uuid);
    return path.join(projectRoot, 'scenarios', 'index', indexPath, `${uuid}.scenario.json`);
  }

  /**
   * Build index path from UUID
   * Web4 pattern: Consistent UUID-based directory structure
   */
  private buildIndexPath(uuid: string): string {
    return path.join(uuid[0], uuid[1], uuid[2], uuid[3], uuid[4]);
  }

  /**
   * Convert string value to appropriate type
   * Web4 pattern: Type-safe value conversion for model attributes
   */
  private convertValue(value: string): any {
    // Boolean conversion
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Number conversion
    if (!isNaN(Number(value)) && value.trim() !== '') return Number(value);
    
    // Date conversion (keep ISO date strings as strings)
    if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      return value;
    }
    
    // Default: string value
    return value;
  }

  /**
   * Create GitTextIOR from file position
   * Web4 pattern: Sophisticated text reference with precise positioning
   */
  private async createGitTextIOR(file: string, startPos: string, endPos: string): Promise<string> {
    const projectRoot = this.findProjectRoot();
    const fullPath = path.isAbsolute(file) ? file : path.join(projectRoot, file);
    
    try {
      // Verify file exists
      await fs.access(fullPath);
      
      // Create GitTextIOR format
      const relativePath = path.relative(projectRoot, fullPath);
      const gitTextIOR = `ior:git:text:https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/req0305/${relativePath}#L${startPos}-${endPos}`;
      
      return gitTextIOR;
    } catch (error) {
      throw new Error(`Failed to create GitTextIOR for ${file}: ${(error as Error).message}`);
    }
  }

  /**
   * Extract filename from origin IOR - Enhanced for folders
   * Web4 pattern: Filename/foldername extraction for discovery operations
   */
  private extractFilenameFromOrigin(origin: string | undefined): string | null {
    if (!origin) return null;
    
    // Extract path from IOR format
    const extractedPath = this.extractFilePathFromIOR(origin);
    if (!extractedPath) return null;
    
    // For folders ending with /, return folder name
    if (extractedPath.endsWith('/')) {
      const folderPath = extractedPath.slice(0, -1); // Remove trailing /
      return path.basename(folderPath);
    }
    
    // For files, return filename
    return path.basename(extractedPath);
  }

  /**
   * Find all files/folders with same name across project
   * Web4 pattern: Project-wide file and folder discovery
   */
  private async findFilesByName(name: string): Promise<string[]> {
    const projectRoot = this.findProjectRoot();
    const { execSync } = await import('child_process');
    
    try {
      // Use find command to locate all files AND folders with same name
      const findCommand = `find "${projectRoot}" -name "${name}" 2>/dev/null`;
      const output = execSync(findCommand, { encoding: 'utf8' });
      
      return output.trim().split('\n')
        .filter(line => line.length > 0)
        .map(line => path.relative(projectRoot, line))
        .filter(relativePath => relativePath.length > 0);
    } catch (error) {
      console.warn(`⚠️  Discovery failed: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Analyze discovered file with comprehensive metadata
   * Web4 pattern: File analysis with git hash and diff detection
   */
  private async analyzeDiscoveredFile(filePath: string, targetUnit: DefaultUnit): Promise<any> {
    const projectRoot = this.findProjectRoot();
    const fullPath = path.join(projectRoot, filePath);
    
    try {
      // Get file stats
      const stats = await fs.stat(fullPath);
      
      // Calculate git hash
      const content = await fs.readFile(fullPath);
      const gitHash = await this.calculateGitHash(content);
      
      // Create git hash IOR
      const gitHashIOR = `ior:git:hash:${gitHash}`;
      
      // Compare with original if possible
      const diffStatus = await this.determineDiffStatus(filePath, targetUnit, content);
      
      return {
        filePath,
        fileSize: stats.size,
        lastModified: stats.mtime.toISOString(),
        gitHashIOR,
        diffStatus,
        content
      };
    } catch (error) {
      return {
        filePath,
        fileSize: 0,
        lastModified: new Date().toISOString(),
        gitHashIOR: 'ior:git:hash:error',
        diffStatus: 'UNKNOWN',
        error: (error as Error).message
      };
    }
  }

  /**
   * Calculate git hash for file content
   * Web4 pattern: Git-compatible SHA256 hash calculation
   */
  private async calculateGitHash(content: Buffer): Promise<string> {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Determine diff status by comparing file content
   * Web4 pattern: Intelligent diff analysis
   */
  private async determineDiffStatus(filePath: string, targetUnit: DefaultUnit, content: Buffer): Promise<string> {
    try {
      // Try to read original file for comparison
      const originalPath = this.extractFilePathFromIOR(targetUnit.model.origin);
      if (!originalPath) return 'UNKNOWN';
      
      const projectRoot = this.findProjectRoot();
      const originalFullPath = path.join(projectRoot, originalPath);
      
      try {
        const originalContent = await fs.readFile(originalFullPath);
        
        if (content.equals(originalContent)) {
          return 'IDENTICAL';
        } else if (content.length > originalContent.length) {
          return 'NEWER';
        } else if (content.length < originalContent.length) {
          return 'OLDER';
        } else {
          return 'MODIFIED';
        }
      } catch {
        return 'UNKNOWN';
      }
    } catch (error) {
      return 'UNKNOWN';
    }
  }

  /**
   * Generate detailed discovery report
   * Web4 pattern: Comprehensive copy analysis reporting
   */
  private generateDiscoveryReport(targetUnit: DefaultUnit, analysisResults: any[]): void {
    console.log(`📊 Discovery Report for ${targetUnit.model.name || 'Unit'}`);
    console.log(`🎯 Original: ${this.extractFilePathFromIOR(targetUnit.model.origin)}`);
    console.log('');
    
    analysisResults.forEach((result, index) => {
      const statusIcon = this.getDiffStatusIcon(result.diffStatus);
      const sizeInfo = result.fileSize > 0 ? `${result.fileSize} bytes` : 'unknown';
      
      console.log(`${index + 1}. ${statusIcon} ${result.filePath}`);
      console.log(`   Size: ${sizeInfo} | Hash: ${result.gitHashIOR.slice(-8)}... | Status: ${result.diffStatus}`);
      
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      }
      
      console.log('');
    });
    
    // Summary
    const identical = analysisResults.filter(r => r.diffStatus === 'IDENTICAL').length;
    const modified = analysisResults.filter(r => r.diffStatus === 'MODIFIED').length;
    const newer = analysisResults.filter(r => r.diffStatus === 'NEWER').length;
    const unknown = analysisResults.filter(r => r.diffStatus === 'UNKNOWN').length;
    
    console.log(`📈 Summary: ${analysisResults.length} files discovered`);
    console.log(`   ✅ Identical: ${identical} | 🔄 Modified: ${modified} | ⬆️  Newer: ${newer} | ❓ Unknown: ${unknown}`);
  }

  /**
   * Get diff status icon for reporting
   * Web4 pattern: Visual status indication
   */
  private getDiffStatusIcon(diffStatus: string): string {
    switch (diffStatus) {
      case 'IDENTICAL': return '✅';
      case 'MODIFIED': return '🔄';
      case 'NEWER': return '⬆️ ';
      case 'OLDER': return '⬇️ ';
      case 'UNKNOWN': return '❓';
      default: return '📄';
    }
  }

  /**
   * Create unit from folder - Revolutionary 2002 vision implementation
   * Web4 pattern: Folder atomic elements with °folder.unit tracking
   */
  private async createFromFolder(folderPath: string): Promise<void> {
    const projectRoot = this.findProjectRoot();
    const fullPath = path.isAbsolute(folderPath) ? folderPath : path.join(projectRoot, folderPath);
    
    // Analyze folder structure
    const folderAnalysis = await this.analyzeFolderStructure(fullPath);
    
    // Set up folder unit model with proper MOF classification
    this.model.uuid = UUIDv4.generate().toString();
    this.model.name = "Folder";  // M3 class name
    this.model.origin = `ior:git:github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/req0305/${folderPath}`;
    this.model.definition = `M1 folder instance: ${folderPath}`;
    this.model.typeM3 = TypeM3.CLASS;  // Proper M3 classification
    this.model.createdAt = new Date().toISOString();
    this.model.updatedAt = new Date().toISOString();
    this.model.indexPath = '';
    
    // Add originName for filesystem folder name
    (this.model as any).originName = path.basename(folderPath);
    
    // Add folder-specific metadata
    (this.model as any).folderPath = folderPath;
    (this.model as any).fileCount = folderAnalysis.fileCount;
    (this.model as any).subfolderCount = folderAnalysis.subfolderCount;
    (this.model as any).totalSize = folderAnalysis.totalSize;
    (this.model as any).folderHash = folderAnalysis.folderHash;
    (this.model as any).lastScanned = new Date().toISOString();
    
    // Check for git repository
    const gitStatus = await this.checkGitStatus(fullPath);
    if (gitStatus) {
      (this.model as any).gitStatus = gitStatus;
    }
    
    // Save scenario first to get scenario path
    const scenario = await this.toScenario();
    await this.storage.saveScenario(this.model.uuid, scenario, []);
    
    // Create °folder.unit in the tracked folder
    const folderUnitPath = path.join(fullPath, '°folder.unit');
    const scenarioPath = await this.getScenarioPath();
    const relativePath = path.relative(path.dirname(folderUnitPath), scenarioPath);
    
    // Remove existing °folder.unit if it exists
    try {
      await fs.unlink(folderUnitPath);
    } catch {
      // Ignore if file doesn't exist
    }
    
    await fs.symlink(relativePath, folderUnitPath);
    
    console.log(`✅ Folder unit created: ${this.model.name}`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Origin: ${this.model.origin}`);
    console.log(`   Files: ${folderAnalysis.fileCount} | Subfolders: ${folderAnalysis.subfolderCount}`);
    console.log(`   Size: ${folderAnalysis.totalSize} bytes | Hash: ${folderAnalysis.folderHash.slice(0, 8)}...`);
    console.log(`   Folder Unit: ${path.relative(projectRoot, folderUnitPath)}`);
    
    if (gitStatus) {
      console.log(`   Git: ${gitStatus}`);
    }
  }

  /**
   * Analyze folder structure for atomic element metadata
   * Web4 pattern: Comprehensive folder analysis for atomic elements
   */
  private async analyzeFolderStructure(folderPath: string): Promise<any> {
    let fileCount = 0;
    let subfolderCount = 0;
    let totalSize = 0;
    const fileHashes: string[] = [];
    
    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      
      for (const entry of entries) {
        // Skip °folder.unit files in analysis
        if (entry.name === '°folder.unit') continue;
        
        const entryPath = path.join(folderPath, entry.name);
        
        if (entry.isDirectory()) {
          subfolderCount++;
          // Add subfolder to hash calculation
          fileHashes.push(`DIR:${entry.name}`);
        } else if (entry.isFile()) {
          fileCount++;
          const stats = await fs.stat(entryPath);
          totalSize += stats.size;
          
          // Calculate file hash for folder hash
          const content = await fs.readFile(entryPath);
          const fileHash = await this.calculateGitHash(content);
          fileHashes.push(`FILE:${entry.name}:${fileHash.slice(0, 8)}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Folder analysis failed: ${(error as Error).message}`);
    }
    
    // Calculate folder hash from all file hashes and structure
    const crypto = await import('crypto');
    const folderHash = crypto.createHash('sha256')
      .update(fileHashes.sort().join('|'))
      .digest('hex');
    
    return {
      fileCount,
      subfolderCount,
      totalSize,
      folderHash
    };
  }

  /**
   * Check git status for folder
   * Web4 pattern: Git repository detection and status
   */
  private async checkGitStatus(folderPath: string): Promise<string | null> {
    try {
      const { execSync } = await import('child_process');
      
      // Check if folder is a git repository
      const gitDir = path.join(folderPath, '.git');
      try {
        await fs.access(gitDir);
        
        // Get git status
        const output = execSync('git status --porcelain', { 
          cwd: folderPath, 
          encoding: 'utf8',
          timeout: 5000
        });
        
        if (output.trim().length === 0) {
          return 'clean';
        } else {
          const lines = output.trim().split('\n');
          return `${lines.length} changes`;
        }
      } catch {
        return null; // Not a git repository
      }
    } catch (error) {
      return null; // Git command failed
    }
  }

  /**
   * Copy unit's origin file to target location with automatic .unit LD link creation
   * Web4 pattern: Universal <uuid|lnfile> parameter pattern with scenario loading

  /**
   * Load unit from identifier (universal pattern)
   * Web4 pattern: Universal scenario loading from UnitIdentifier
   */
  private async loadUnitFromIdentifier(identifier: UnitIdentifier): Promise<DefaultUnit> {
    const targetUnit = new DefaultUnit();
    targetUnit.storage = this.storage; // Share storage instance
    
    if (isUUIDv4(identifier)) {
      const uuid = identifier.toString();
      await targetUnit.loadFromUUIDString(uuid);
    } else if (this.isUUID(identifier)) {
      await targetUnit.loadFromUUIDString(identifier);
    } else {
      // Load from .unit file
      await targetUnit.loadFromUnitFile(identifier);
    }
    
    return targetUnit;
  }

  /**
   * Load unit from UUID string
   * Web4 pattern: UUID-based scenario loading
   */
  private async loadFromUUIDString(uuid: string): Promise<void> {
    // Use existing pattern from other methods - load scenario JSON directly
    const projectRoot = this.findProjectRoot();
    const indexPath = this.buildIndexPath(uuid);
    const scenarioPath = path.join(projectRoot, 'scenarios', 'index', indexPath, `${uuid}.scenario.json`);
    
    try {
      const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
      const scenario = JSON.parse(scenarioContent);
      
      if (scenario.model) {
        this.model = scenario.model;
      } else {
        throw new Error(`Invalid scenario format for UUID: ${uuid}`);
      }
    } catch (error) {
      throw new Error(`Failed to load scenario for UUID ${uuid}: ${(error as Error).message}`);
    }
  }

  /**
   * Load unit from .unit file
   * Web4 pattern: File-based scenario loading
   */
  private async loadFromUnitFile(unitFile: string): Promise<void> {
    const projectRoot = this.findProjectRoot();
    const fullPath = path.isAbsolute(unitFile) ? unitFile : path.join(projectRoot, unitFile);
    
    try {
      // Read symlink target to get scenario path
      const scenarioPath = await fs.readlink(fullPath);
      const fullScenarioPath = path.isAbsolute(scenarioPath) ? 
        scenarioPath : 
        path.resolve(path.dirname(fullPath), scenarioPath);
      
      const scenarioContent = await fs.readFile(fullScenarioPath, 'utf-8');
      const scenario = JSON.parse(scenarioContent);
      
      if (scenario.model) {
        this.model = scenario.model;
      } else {
        throw new Error(`Invalid scenario format in unit file: ${unitFile}`);
      }
    } catch (error) {
      throw new Error(`Failed to load unit from file ${unitFile}: ${(error as Error).message}`);
    }
  }

  /**
   * Update moved link references in unit model
   * Web4 pattern: Reference tracking update for moved links
   */
  private async updateMovedLinkReferences(oldPath: string, newPath: string): Promise<void> {
    try {
      // This would update any unit models that reference the moved link
      // For now, just log the move for reference tracking
      console.log(`📝 Reference update: ${oldPath} → ${newPath}`);
    } catch (error) {
      console.warn(`⚠️  Could not update moved link references: ${(error as Error).message}`);
    }
  }

  /**
   * Create automatic links in ontology and M3 typeM3 folders
   * Web4 pattern: DRY compliant using existing linkInto method
   */
  private async createAutomaticLinks(): Promise<void> {
    try {
      const projectRoot = this.findProjectRoot();
      
      // Ensure directories exist
      const ontologyDir = path.join(projectRoot, 'scenarios', 'ontology');
      await fs.mkdir(ontologyDir, { recursive: true });
      
      const typeM3 = this.model.typeM3 || TypeM3.CLASS;
      const m3Dir = path.join(projectRoot, 'MDAv4', 'M3', typeM3);
      await fs.mkdir(m3Dir, { recursive: true });
      
      // ✅ DRY COMPLIANT: Use existing linkInto method
      await this.linkInto(this.model.uuid, ontologyDir);
      await this.linkInto(this.model.uuid, m3Dir);
      
      // Create M3 folder unit on-demand (also using existing methods)
      const m3FolderUnitPath = path.join(m3Dir, '°folder.unit');
      try {
        await fs.access(m3FolderUnitPath);
      } catch {
        const tempUnit = new DefaultUnit();
        const unitFromFolder = await tempUnit.from(`MDAv4/M3/${typeM3}/`);
        await unitFromFolder.execute();
      }
      
      console.log(`🔗 Automatic links created using linkInto:`);
      console.log(`   Ontology: scenarios/ontology/${this.convertNameToFilename(this.model.name)}.unit`);
      console.log(`   M3 ${typeM3}: MDAv4/M3/${typeM3}/${this.convertNameToFilename(this.model.name)}.unit`);
      
    } catch (error) {
      console.warn(`⚠️  Could not create automatic links: ${(error as Error).message}`);
    }
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
      return packageJson.version || '0.3.0.5';
    } catch (error) {
      return '0.3.0.5'; // Fallback version
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
      return packageJson.name?.split('/').pop()?.replace('@web4/', '') || 'Unit';
    } catch (error) {
      return 'Unit'; // Fallback name
    }
  }

  /**
   * Clean up empty directories after link deletion
   * Recursively removes empty directories up to project root
   * 
   * @param dirPath - Directory path to check and potentially remove
   * @returns Promise<void>
   */
  private async cleanupEmptyDirectories(dirPath: string): Promise<void> {
    try {
      const { rmdir } = await import('fs/promises');
      const { readdir } = await import('fs/promises');
      
      // Check if directory exists and is empty
      if (existsSync(dirPath)) {
        const files = await readdir(dirPath);
        
        // If directory is empty, remove it and check parent
        if (files.length === 0) {
          await rmdir(dirPath);
          console.log(`🗑️  Removed empty directory: ${dirPath}`);
          
          // Recursively check parent directory
          const parentDir = path.dirname(dirPath);
          if (parentDir !== dirPath) { // Prevent infinite recursion
            await this.cleanupEmptyDirectories(parentDir);
          }
        }
      }
    } catch (error) {
      // Silently ignore errors (directory might not be empty or might not exist)
      // This prevents the cleanup from failing the main operation
    }
  }
}