/**
 * DefaultRequirement 0.3.0.5 - Revolutionary Requirement Management with Unit 0.3.0.5 Principles
 * Web4 principles: Command chaining, TypeScript union types, JEDI MODE search, zero config CLI
 * Purpose: Revolutionary requirement management with atomic executable element architecture
 */

import { Requirement, RequirementStatus, RequirementResult, RequirementMetadata, RequirementScenario } from '../layer3/Requirement.interface.js';
import { RequirementIdentifier, isUUIDv4, isFilePath, toUUIDString } from '../layer3/RequirementIdentifier.type.js';
import { UUIDv4 } from '../layer3/UUIDv4.class.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Revolutionary DefaultRequirement Implementation with Unit 0.3.0.5 Principles
 * Web4 patterns: Empty constructor, command chaining, union types, JEDI MODE search
 * 
 * @example
 * ```typescript
 * // ✅ COMMAND CHAINING: Natural language DSL
 * const requirement = new DefaultRequirement();
 * await requirement.create("Auth Fix", "Fix authentication logic")
 *                   .set("priority", "high")
 *                   .md()
 *                   .execute();
 * 
 * // ✅ JEDI MODE: Enhanced search with precise positioning
 * await requirement.find("authentication").list().execute();
 * 
 * // ✅ UNION TYPES: Flexible parameter handling
 * await requirement.set(uuid, "implemented", "true");
 * await requirement.set("requirement.json", "status", "completed");
 * ```
 */
export class DefaultRequirement implements Requirement {
  private requirementModel: {
    uuid: string;
    name: string;
    title: string;
    description: string;
    status: RequirementStatus;
    metadata: RequirementMetadata;
    createdAt: string;
    updatedAt: string;
    origin?: string;
  } = {
    uuid: '',
    name: '',
    title: '',
    description: '',
    status: RequirementStatus.PENDING,
    metadata: {},
    createdAt: '',
    updatedAt: ''
  };

  private componentContext: {
    component?: string;
    version?: string;
    root?: string;
  } = {};

  private searchResults: Array<{
    file: string;
    line: number;
    column: number;
    match: string;
    gitTextIOR: string;
  }> = [];

  private pendingOperations: Array<() => Promise<void>> = [];

  /**
   * Web4 Empty Constructor Principle
   * Objects created empty, configured via setters and method chaining
   */
  constructor() {
    // Empty constructor - Web4 principle
  }

  /**
   * Create new requirement with title and description
   * Web4 pattern: Fluent interface with immediate property setting
   * 
   * @param title - Requirement title @cliSyntax title
   * @param description - Detailed requirement description @cliSyntax description
   * @returns Promise resolving to this for chaining
   */
  async create(title: string, description: string): Promise<this> {
    this.requirementModel.uuid = UUIDv4.generate().toString();
    this.requirementModel.name = title;
    this.requirementModel.title = title;
    this.requirementModel.description = description;
    this.requirementModel.status = RequirementStatus.CREATED;
    this.requirementModel.createdAt = new Date().toISOString();
    this.requirementModel.updatedAt = new Date().toISOString();
    this.requirementModel.origin = `ior:git:github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/req0305/components/Web4Requirement/0.3.0.5`;

    // Add to pending operations for execution
    this.pendingOperations.push(async () => {
      await this.persistRequirement();
      console.log(`✅ Requirement created: ${title}`);
      console.log(`   UUID: ${this.requirementModel.uuid}`);
      console.log(`   Origin IOR: ${this.requirementModel.origin}`);
    });

    return this;
  }

  /**
   * Set component context for subsequent operations
   * Web4 pattern: Context setting with fluent interface
   * 
   * @param component - Component name @cliSyntax component
   * @param version - Component version @cliSyntax version
   * @returns this for chaining
   */
  on(component: string, version: string): this {
    this.componentContext.component = component;
    this.componentContext.version = version;
    
    // Construct component root path
    const projectRoot = process.env.WEB4_PROJECT_ROOT || this.findProjectRoot();
    this.componentContext.root = path.join(projectRoot, 'components', component, version);
    
    console.log(`🎯 Component context set: ${component}/${version}`);
    console.log(`📁 Component root: ${this.componentContext.root}`);
    
    return this;
  }

  /**
   * Generate markdown view from requirement
   * Web4 pattern: Optional parameters with intelligent defaults
   * 
   * @param outputDirectory - Optional output directory @cliSyntax folder @cliOptional
   * @returns Promise resolving to this for chaining
   */
  async md(outputDirectory?: string): Promise<this> {
    this.pendingOperations.push(async () => {
      const mdContent = this.generateMDView();
      const filename = `${this.requirementModel.uuid}.requirement.md`;
      
      // Use provided directory or default to requirements.md
      const targetDirectory = outputDirectory || this.getRequirementsMDDirectory();
      await fs.mkdir(targetDirectory, { recursive: true });
      
      const finalPath = path.join(targetDirectory, filename);
      await fs.writeFile(finalPath, mdContent, 'utf-8');
      
      console.log(`📄 MD view generated: ${finalPath}`);
    });

    return this;
  }

  /**
   * Set requirement property value with union type support
   * Web4 pattern: Union types for flexible parameter handling
   * 
   * @param identifier - Requirement identifier @cliSyntax uuid|reqfile
   * @param property - Property name @cliSyntax property
   * @param value - Property value @cliSyntax value
   * @returns Promise resolving to this for chaining
   */
  async set(identifier: RequirementIdentifier, property: string, value: string): Promise<this> {
    this.pendingOperations.push(async () => {
      let targetUuid: string;
      
      if (isUUIDv4(identifier)) {
        targetUuid = identifier.toString();
      } else if (this.isUUID(identifier)) {
        targetUuid = identifier;
      } else {
        // Extract UUID from file path
        const match = identifier.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
        if (match) {
          targetUuid = match[1];
        } else {
          throw new Error(`Cannot extract UUID from identifier: ${identifier}`);
        }
      }

      // Load requirement if not current one
      if (targetUuid !== this.requirementModel.uuid) {
        await this.loadFromUUID(targetUuid);
      }

      // Set property value
      switch (property.toLowerCase()) {
        case 'implemented':
          this.requirementModel.metadata.implemented = value.toLowerCase() === 'true';
          if (this.requirementModel.metadata.implemented) {
            this.requirementModel.metadata.implementationStatus = 'completed';
          }
          break;
        case 'implementationstatus':
          this.requirementModel.metadata.implementationStatus = value as any;
          this.requirementModel.metadata.implemented = value === 'completed';
          break;
        case 'status':
          if (Object.values(RequirementStatus).includes(value as RequirementStatus)) {
            this.requirementModel.status = value as RequirementStatus;
          } else {
            throw new Error(`Invalid status: ${value}`);
          }
          break;
        case 'priority':
          this.requirementModel.metadata.priority = value as any;
          break;
        case 'complexity':
          this.requirementModel.metadata.complexity = value as any;
          break;
        default:
          (this.requirementModel.metadata as any)[property] = value;
          break;
      }

      this.requirementModel.updatedAt = new Date().toISOString();
      await this.persistRequirement();
      
      console.log(`✅ ${this.requirementModel.title}: ${property} set to ${value}`);
    });

    return this;
  }

  /**
   * Update requirements overview
   * Web4 pattern: Simple method with comprehensive functionality
   * 
   * @returns Promise resolving to this for chaining
   */
  async update(): Promise<this> {
    this.pendingOperations.push(async () => {
      const requirementsDir = this.getRequirementsDirectory();
      const mdDir = this.getRequirementsMDDirectory();
      
      // Ensure directories exist
      await fs.mkdir(requirementsDir, { recursive: true });
      await fs.mkdir(mdDir, { recursive: true });
      
      // Find all scenario files
      const scenarioFiles = await fs.readdir(requirementsDir);
      const scenarios = scenarioFiles.filter(file => file.endsWith('.scenario.json'));
      
      console.log(`🔄 Updating ${scenarios.length} requirement files...`);
      
      // Regenerate each requirement MD file
      for (const scenarioFile of scenarios) {
        const uuid = scenarioFile.replace('.scenario.json', '');
        const scenarioPath = path.join(requirementsDir, scenarioFile);
        
        try {
          // Load and regenerate MD
          const tempReq = new DefaultRequirement();
          await tempReq.loadFromScenario(scenarioPath);
          const mdContent = tempReq.generateMDView();
          const mdPath = path.join(mdDir, `${uuid}.requirement.md`);
          await fs.writeFile(mdPath, mdContent, 'utf-8');
          
          console.log(`✅ Updated ${uuid}.requirement.md`);
        } catch (error) {
          console.warn(`⚠️  Failed to update ${scenarioFile}: ${(error as Error).message}`);
        }
      }
      
      // Generate overview
      await this.generateOverview(mdDir);
      console.log(`✅ Requirements overview updated`);
    });

    return this;
  }

  /**
   * Move requirement to different component/version
   * Web4 pattern: Union types with comprehensive error handling
   * 
   * @param identifier - Requirement identifier @cliSyntax uuid|reqfile
   * @param component - Target component name @cliSyntax component
   * @param version - Target component version @cliSyntax version
   * @returns Promise resolving to this for chaining
   */
  async mv(identifier: RequirementIdentifier, component: string, version: string): Promise<this> {
    this.pendingOperations.push(async () => {
      let targetUuid: string;
      
      if (isUUIDv4(identifier)) {
        targetUuid = identifier.toString();
      } else if (this.isUUID(identifier)) {
        targetUuid = identifier;
      } else {
        const match = identifier.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
        if (match) {
          targetUuid = match[1];
        } else {
          throw new Error(`Cannot extract UUID from identifier: ${identifier}`);
        }
      }

      // Load requirement
      await this.loadFromUUID(targetUuid);
      
      // Move files using git mv for history preservation
      const sourceReqDir = this.getRequirementsDirectory();
      const sourceMDDir = this.getRequirementsMDDirectory();
      const sourceScenario = path.join(sourceReqDir, `${targetUuid}.scenario.json`);
      const sourceMD = path.join(sourceMDDir, `${targetUuid}.requirement.md`);
      
      const projectRoot = this.findProjectRoot();
      const targetPath = path.join(projectRoot, 'components', component, version);
      const targetReqDir = path.join(targetPath, 'spec', 'requirements');
      const targetMDDir = path.join(targetPath, 'spec', 'requirements.md');
      const targetScenario = path.join(targetReqDir, `${targetUuid}.scenario.json`);
      const targetMD = path.join(targetMDDir, `${targetUuid}.requirement.md`);
      
      // Ensure target directories exist
      await fs.mkdir(targetReqDir, { recursive: true });
      await fs.mkdir(targetMDDir, { recursive: true });
      
      // Move files
      await fs.rename(sourceScenario, targetScenario);
      try {
        await fs.rename(sourceMD, targetMD);
      } catch {
        // MD file might not exist
      }
      
      console.log(`✅ Requirement ${targetUuid} moved to ${component}/${version}`);
    });

    return this;
  }

  /**
   * Delete requirement by identifier with comprehensive cleanup
   * Web4 pattern: Union types with thorough resource cleanup
   * 
   * @param identifier - Requirement identifier @cliSyntax uuid|reqfile
   * @returns Promise resolving to this for chaining
   */
  async delete(identifier: RequirementIdentifier): Promise<this> {
    this.pendingOperations.push(async () => {
      let targetUuid: string;
      
      if (isUUIDv4(identifier)) {
        targetUuid = identifier.toString();
      } else if (this.isUUID(identifier)) {
        targetUuid = identifier;
      } else if (typeof identifier === 'string') {
        if (identifier.endsWith('.scenario.json') || identifier.endsWith('.requirement.md')) {
          const match = identifier.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
          if (match) {
            targetUuid = match[1];
          } else {
            throw new Error(`Cannot extract UUID from file: ${identifier}`);
          }
        } else {
          throw new Error(`Invalid identifier format: ${identifier}`);
        }
      } else {
        throw new Error(`Unsupported identifier type: ${typeof identifier}`);
      }

      // Delete scenario and MD files
      const reqDir = this.getRequirementsDirectory();
      const mdDir = this.getRequirementsMDDirectory();
      const scenarioPath = path.join(reqDir, `${targetUuid}.scenario.json`);
      const mdPath = path.join(mdDir, `${targetUuid}.requirement.md`);
      
      const deletedFiles: string[] = [];
      
      try {
        await fs.unlink(scenarioPath);
        deletedFiles.push(scenarioPath);
      } catch {
        // File might not exist
      }
      
      try {
        await fs.unlink(mdPath);
        deletedFiles.push(mdPath);
      } catch {
        // File might not exist
      }
      
      // Delete from central storage if exists
      try {
        await this.deleteCentralScenario(targetUuid);
        console.log(`✅ Deleted requirement ${targetUuid} (${deletedFiles.length} files)`);
      } catch (error) {
        console.warn(`⚠️  Partial deletion of ${targetUuid}: ${(error as Error).message}`);
      }
    });

    return this;
  }

  /**
   * Find requirements by search term with JEDI MODE positioning
   * Web4 pattern: Enhanced grep with precise line:column output
   * 
   * @param searchTerm - Text to search for @cliSyntax searchTerm
   * @returns Promise resolving to this for chaining
   */
  async find(searchTerm: string): Promise<this> {
    this.pendingOperations.push(async () => {
      const reqDir = this.getRequirementsDirectory();
      const mdDir = this.getRequirementsMDDirectory();
      
      // JEDI MODE: Enhanced grep with line:column positioning
      const { execSync } = await import('child_process');
      
      try {
        // Search in both scenario and MD files with precise positioning
        const grepCommand = `grep -r -n -o -H "${searchTerm}" "${reqDir}" "${mdDir}" 2>/dev/null || true`;
        const output = execSync(grepCommand, { encoding: 'utf8' });
        
        this.searchResults = [];
        const lines = output.trim().split('\n').filter(line => line.length > 0);
        
        for (const line of lines) {
          const match = line.match(/^([^:]+):(\d+):(.+)$/);
          if (match) {
            const [, filePath, lineNumber, matchText] = match;
            const column = await this.calculateColumnPosition(filePath, lineNumber, searchTerm);
            
            this.searchResults.push({
              file: filePath,
              line: parseInt(lineNumber),
              column,
              match: matchText.trim(),
              gitTextIOR: `${path.basename(filePath)}:${lineNumber},${column}`
            });
          }
        }
        
        console.log(`✅ Found ${this.searchResults.length} potential references with precise positioning:`);
        this.searchResults.slice(0, 5).forEach((result, index) => {
          console.log(`${index + 1}. ${result.gitTextIOR} → "${result.match}"`);
        });
        
        if (this.searchResults.length > 5) {
          console.log(`... and ${this.searchResults.length - 5} more. Use 'list' to browse all results.`);
        }
        
      } catch (error) {
        console.warn(`⚠️  Search failed: ${(error as Error).message}`);
        this.searchResults = [];
      }
    });

    return this;
  }

  /**
   * Display search results in interactive less viewer
   * Web4 pattern: Interactive result browsing with JEDI MODE positioning
   * 
   * @returns Promise resolving to this for chaining
   */
  async list(): Promise<this> {
    this.pendingOperations.push(async () => {
      if (this.searchResults.length === 0) {
        console.log(`ℹ️  No search results to display. Use 'find <searchTerm>' first.`);
        return;
      }

      console.log(`📄 Opening ${this.searchResults.length} references in interactive viewer...`);
      console.log(`💡 Use 'q' to quit, '/' to search, arrow keys to navigate`);
      
      // Format results for less display
      let output = `# 🔍 JEDI MODE - Requirement Search Results (${this.searchResults.length} found)\n\n`;
      
      this.searchResults.forEach((result, index) => {
        output += `## ${index + 1}. ${result.file}:${result.line},${result.column} → "${result.match}"\n\n`;
        output += `**File:** \`${result.file}\`  \n`;
        output += `**Position:** Line ${result.line}, Column ${result.column}  \n`;
        output += `**Match:** "${result.match}"  \n`;
        output += `**GitTextIOR:** \`${result.gitTextIOR}\`  \n\n`;
        output += `**Create Requirement from this position:**\n`;
        output += `\`\`\`bash\n`;
        output += `requirement from ${result.file} ${result.line},${result.column-result.match.length} ${result.line},${result.column}\n`;
        output += `\`\`\`\n\n`;
        output += `---\n\n`;
      });
      
      output += `\n# 🎯 JEDI MODE - GitTextIOR Examples\n\n`;
      output += `Use these precise positions to create requirements from specific text:\n\n`;
      this.searchResults.slice(0, 3).forEach((result, index) => {
        output += `${index + 1}. \`requirement from ${result.file} ${result.line},${result.column-result.match.length} ${result.line},${result.column}\`\n`;
      });
      
      // Write to temporary file and open with less
      const tempFile = `/tmp/requirement-search-${Date.now()}.md`;
      await fs.writeFile(tempFile, output);
      
      try {
        const { spawn } = await import('child_process');
        const less = spawn('less', ['-R', tempFile], { stdio: 'inherit' });
        
        await new Promise<void>((resolve) => {
          less.on('close', () => {
            fs.unlink(tempFile).catch(() => {}); // Cleanup
            resolve();
          });
        });
      } catch (error) {
        console.log(`📋 Search Results:\n${output}`);
        await fs.unlink(tempFile).catch(() => {});
      }
    });

    return this;
  }

  /**
   * Replace requirement pattern with dual link
   * Web4 pattern: Pattern replacement with dual link generation
   * 
   * @param pattern - Requirement pattern to replace @cliSyntax pattern
   * @param filePath - File path containing pattern @cliSyntax filePath
   * @param targetUuid - Optional target UUID @cliSyntax uuid @cliOptional
   * @returns Promise resolving to this for chaining
   */
  async replace(pattern: string, filePath: string, targetUuid?: string): Promise<this> {
    this.pendingOperations.push(async () => {
      const projectRoot = this.findProjectRoot();
      const fullPath = path.resolve(projectRoot, filePath);
      
      // Read file content
      const content = await fs.readFile(fullPath, 'utf8');
      const placeholder = `[${pattern}]`;
      
      if (!content.includes(placeholder)) {
        throw new Error(`Pattern ${placeholder} not found in file`);
      }

      let uuid = targetUuid;
      if (!uuid) {
        // Create new requirement from pattern
        const title = pattern.replace(/^requirement:uuid:/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        await this.create(title, `Requirement for ${pattern}`);
        uuid = this.requirementModel.uuid;
        await this.persistRequirement();
      }

      // Generate dual link
      const relativeDepth = filePath.split('/').length - 1;
      const relativePath = '../'.repeat(relativeDepth) + `spec/requirements.md/${uuid}.requirement.md`;
      const dualLink = `[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/req0305/spec/requirements.md/${uuid}.requirement.md) | [§/spec/requirements.md/${uuid}.requirement.md](${relativePath})]`;
      
      // Replace pattern with dual link
      const updatedContent = content.replace(placeholder, dualLink);
      await fs.writeFile(fullPath, updatedContent, 'utf8');
      
      console.log(`✅ Replaced ${placeholder} with dual link for ${uuid}`);
    });

    return this;
  }

  /**
   * Process file for requirement patterns and replace with dual links
   * Web4 pattern: Batch processing with comprehensive pattern detection
   * 
   * @param filePath - File path to process @cliSyntax filePath
   * @returns Promise resolving to this for chaining
   */
  async processFile(filePath: string): Promise<this> {
    this.pendingOperations.push(async () => {
      const projectRoot = this.findProjectRoot();
      const fullPath = path.resolve(projectRoot, filePath);
      
      const content = await fs.readFile(fullPath, 'utf8');
      const requirementPattern = /\[requirement:uuid:([^\]]+)\]/g;
      const patterns: Array<{placeholder: string, key: string, title: string, description: string}> = [];
      
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matches = [...line.matchAll(requirementPattern)];
        
        for (const reqMatch of matches) {
          const placeholder = reqMatch[0];
          const key = reqMatch[1];
          
          // Extract title and description
          const titleMatch = line.match(/\*\*(.+?)\*\*/);
          const title = titleMatch ? titleMatch[1].replace(/\[requirement:[^\]]+\]\s*/, '').trim() : 
                       `Web4 ${key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
          
          let description = `Web4 requirement for ${key}`;
          // Look for description in following lines
          for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
            const nextLine = lines[j].trim();
            if (nextLine.startsWith('- **')) {
              description += ' ' + nextLine.replace(/^- \*\*(Mainstream|Web4|Why):\*\*\s*/, '');
            } else if (nextLine.startsWith('###') || nextLine === '') {
              break;
            }
          }
          
          patterns.push({ placeholder, key, title, description: description.trim() });
        }
      }
      
      if (patterns.length === 0) {
        console.log(`ℹ️  No requirement patterns found in ${filePath}`);
        return;
      }
      
      let updatedContent = content;
      const createdRequirements: string[] = [];
      
      // Process each pattern
      for (const pattern of patterns) {
        await this.create(pattern.title, pattern.description);
        const uuid = this.requirementModel.uuid;
        await this.persistRequirement();
        createdRequirements.push(`${pattern.title} (${uuid})`);
        
        // Generate dual link
        const relativeDepth = filePath.split('/').length - 1;
        const relativePath = '../'.repeat(relativeDepth) + `spec/requirements.md/${uuid}.requirement.md`;
        const dualLink = `[[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/req0305/spec/requirements.md/${uuid}.requirement.md) | [§/spec/requirements.md/${uuid}.requirement.md](${relativePath})]`;
        
        updatedContent = updatedContent.replace(pattern.placeholder, dualLink);
        
        // Generate MD view
        await this.md();
      }
      
      // Write updated content
      await fs.writeFile(fullPath, updatedContent, 'utf8');
      
      console.log(`✅ Processed ${patterns.length} requirements: ${createdRequirements.join(', ')}`);
    });

    return this;
  }

  /**
   * Execute the complete command chain
   * Web4 pattern: Deferred execution with comprehensive error handling
   * 
   * @returns Promise resolving when all chained operations complete
   */
  async execute(): Promise<void> {
    try {
      for (const operation of this.pendingOperations) {
        await operation();
      }
      this.pendingOperations = []; // Clear after execution
    } catch (error) {
      console.error(`❌ Execution failed: ${(error as Error).message}`);
      throw error;
    }
  }

  // ✅ GETTERS: Essential requirement information access
  getUuid(): string {
    return this.requirementModel.uuid;
  }

  getTitle(): string {
    return this.requirementModel.title;
  }

  getDescription(): string {
    return this.requirementModel.description;
  }

  getStatus(): RequirementStatus {
    return this.requirementModel.status;
  }

  getMetadata(): RequirementMetadata {
    return { ...this.requirementModel.metadata };
  }

  toScenario(): RequirementScenario {
    return {
      uuid: this.requirementModel.uuid,
      name: this.requirementModel.name,
      title: this.requirementModel.title,
      description: this.requirementModel.description,
      status: this.requirementModel.status,
      metadata: this.requirementModel.metadata,
      createdAt: this.requirementModel.createdAt,
      updatedAt: this.requirementModel.updatedAt
    };
  }

  // ✅ PRIVATE METHODS: Internal implementation details

  private async persistRequirement(): Promise<void> {
    const scenario = this.createScenarioJSON();
    const requirementsDir = this.getRequirementsDirectory();
    await fs.mkdir(requirementsDir, { recursive: true });
    
    // Save scenario JSON
    const scenarioPath = path.join(requirementsDir, `${this.requirementModel.uuid}.scenario.json`);
    await fs.writeFile(scenarioPath, JSON.stringify(scenario, null, 2), 'utf-8');
    
    // Also save to central storage if available
    try {
      await this.saveToCentralStorage(scenario);
    } catch (error) {
      console.warn(`⚠️  Central storage failed: ${(error as Error).message}`);
    }
  }

  private createScenarioJSON(): any {
    const owner = this.createOwnerObject();
    
    return {
      IOR: {
        uuid: this.requirementModel.uuid,
        component: 'Web4Requirement',
        version: '0.3.0.5'
      },
      owner: Buffer.from(JSON.stringify(owner)).toString('base64'),
      model: {
        uuid: this.requirementModel.uuid,
        name: this.requirementModel.name,
        title: this.requirementModel.title,
        description: this.requirementModel.description,
        status: this.requirementModel.status,
        ...this.requirementModel.metadata,
        createdAt: this.requirementModel.createdAt,
        updatedAt: this.requirementModel.updatedAt
      }
    };
  }

  private createOwnerObject(): any {
    const user = process.env.USER || 'unknown';
    const hostname = process.env.HOSTNAME || 'localhost';
    
    return {
      user,
      hostname,
      utcTimestamp: new Date().toISOString(),
      uuid: UUIDv4.generate().toString()
    };
  }

  private generateMDView(): string {
    const implementationStatus = this.requirementModel.metadata.implementationStatus || 'pending';
    const statusCheckbox = implementationStatus === 'completed' ? 'x' : ' ';
    const ownerDetails = this.decodeOwnerDetails();
    
    return `# ${this.requirementModel.title}

## Task Status
- [${statusCheckbox}] **${this.requirementModel.title}** [requirement:uuid:${this.requirementModel.uuid}]

## Requirement Details

- **UUID:** \`${this.requirementModel.uuid}\`
- **Name:** ${this.requirementModel.title}
- **Status:** ${this.requirementModel.status}
- **Implementation:** ${implementationStatus}
- **Priority:** ${this.requirementModel.metadata.priority || 'medium'}
- **Complexity:** ${this.requirementModel.metadata.complexity || 'moderate'}

## Description

${this.requirementModel.description}

## Metadata

- **Created:** ${this.requirementModel.createdAt}
- **Updated:** ${this.requirementModel.updatedAt}

## Owner Details

- **User:** ${ownerDetails.user}
- **Hostname:** ${ownerDetails.hostname}
- **Created UTC:** ${ownerDetails.timestamp}
- **Owner UUID:** ${ownerDetails.uuid}

---

*Generated by Web4Requirement Component v0.3.0.5*`;
  }

  private decodeOwnerDetails(): { user: string, hostname: string, timestamp: string, uuid: string } {
    // Fallback values - would decode from scenario in full implementation
    return {
      user: process.env.USER || 'unknown',
      hostname: process.env.HOSTNAME || 'unknown',
      timestamp: new Date().toISOString(),
      uuid: UUIDv4.generate().toString()
    };
  }

  private findProjectRoot(): string {
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
      const scenariosPath = path.join(currentDir, 'scenarios');
      try {
        require('fs').accessSync(scenariosPath);
        return currentDir;
      } catch {
        currentDir = path.dirname(currentDir);
      }
    }
    return process.cwd();
  }

  private getRequirementsDirectory(): string {
    if (this.componentContext.root) {
      return path.join(this.componentContext.root, 'spec', 'requirements');
    }
    
    const projectRoot = this.findProjectRoot();
    return path.join(projectRoot, 'spec', 'requirements');
  }

  private getRequirementsMDDirectory(): string {
    if (this.componentContext.root) {
      return path.join(this.componentContext.root, 'spec', 'requirements.md');
    }
    
    const projectRoot = this.findProjectRoot();
    return path.join(projectRoot, 'spec', 'requirements.md');
  }

  private isUUID(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  private async calculateColumnPosition(filename: string, lineNumber: string, searchTerm: string): Promise<number> {
    try {
      const content = await fs.readFile(filename, 'utf8');
      const lines = content.split('\n');
      const targetLine = lines[parseInt(lineNumber) - 1]; // Convert to 0-based index
      
      if (targetLine) {
        const index = targetLine.indexOf(searchTerm);
        return index >= 0 ? index + 1 : 1; // Convert to 1-based column
      }
    } catch (error) {
      console.warn(`⚠️  Could not calculate column position: ${(error as Error).message}`);
    }
    return 1; // Fallback to column 1
  }

  private async loadFromUUID(uuid: string): Promise<void> {
    const scenarioPath = path.join(this.getRequirementsDirectory(), `${uuid}.scenario.json`);
    await this.loadFromScenario(scenarioPath);
  }

  private async loadFromScenario(scenarioPath: string): Promise<void> {
    const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
    const scenarioData = JSON.parse(scenarioContent);
    
    if (scenarioData.IOR && scenarioData.model) {
      this.requirementModel.uuid = scenarioData.IOR.uuid;
      this.requirementModel.name = scenarioData.model.name || scenarioData.model.title || '';
      this.requirementModel.title = scenarioData.model.title || scenarioData.model.name || '';
      this.requirementModel.description = scenarioData.model.description || '';
      this.requirementModel.status = scenarioData.model.status || RequirementStatus.CREATED;
      this.requirementModel.metadata = {
        priority: scenarioData.model.priority,
        complexity: scenarioData.model.complexity,
        implementationStatus: scenarioData.model.implementationStatus,
        implemented: scenarioData.model.implemented,
        ...scenarioData.model
      };
      this.requirementModel.createdAt = scenarioData.model.createdAt || new Date().toISOString();
      this.requirementModel.updatedAt = scenarioData.model.updatedAt || new Date().toISOString();
    } else {
      throw new Error(`Invalid scenario format in ${scenarioPath}`);
    }
  }

  private async saveToCentralStorage(scenario: any): Promise<void> {
    // Placeholder for central storage integration
    // Would integrate with UnitIndexStorage in full implementation
  }

  private async deleteCentralScenario(uuid: string): Promise<void> {
    // Placeholder for central storage deletion
    // Would integrate with UnitIndexStorage in full implementation
  }

  private async generateOverview(mdDir: string): Promise<void> {
    const files = await fs.readdir(mdDir);
    const requirementFiles = files.filter(file => 
      file.endsWith('.requirement.md') && 
      !file.startsWith('00_requirements.overview.md')
    );

    const timestamp = new Date().toISOString();
    const totalCount = requirementFiles.length;
    
    const itemsList = requirementFiles.map(filename => `- [${filename}](./${filename})`).join('\n');
    
    const overviewContent = `# Requirements Overview

**Last Updated:** ${timestamp}
**Total Requirements:** ${totalCount}

## Requirements List

${itemsList}

---

*Generated by Web4Requirement Component v0.3.0.5*`;

    const overviewPath = path.join(mdDir, '00_requirements.overview.md');
    await fs.writeFile(overviewPath, overviewContent, 'utf-8');
  }
}