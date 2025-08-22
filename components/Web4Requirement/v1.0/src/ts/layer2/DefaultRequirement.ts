import { Requirement, RequirementScenario, RequirementResult, RequirementStatus, RequirementMetadata } from '../layer3/Requirement.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DefaultRequirement implements Requirement {
  private scenario!: RequirementScenario;
  private uuid: string = '';
  private _name: string = '';
  private description: string = '';
  private status: RequirementStatus = RequirementStatus.PENDING;
  private directoryContext: string = '';
  private contextType: 'component' | 'arbitrary' = 'arbitrary';
  private contextPath: string = '';
  
  constructor() { // Web4 empty constructor
  }
  
  init(scenario: RequirementScenario): this {
    this.scenario = scenario;
    return this;
  }

  async create(title: string, description: string): Promise<RequirementResult> {
    this.uuid = this.generateUUID();
    this._name = title;
    this.description = description;
    this.status = RequirementStatus.CREATED;

    const scenario = this.createScenarioJSON();
    
    return {
      success: true,
      requirementId: this.uuid,
      scenario: scenario,
      message: 'Requirement created successfully'
    };
  }

  getUuid(): string {
    return this.uuid;
  }

  getTitle(): string {
    return this._name;
  }

  getDescription(): string {
    return this.description;
  }
  
  getMetadata(): RequirementMetadata {
    return { ...this.scenario.metadata };
  }
  
  async process(): Promise<RequirementResult> {
    return {
      success: true,
      message: 'Requirement processed successfully',
      requirementId: this.uuid
    };
  }
  
  getStatus(): RequirementStatus {
    return this.status;
  }
  
  toScenario(): RequirementScenario {
    return this.scenario;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private createScenarioJSON(): any {
    const hostname = process.env.HOSTNAME || 'localhost';
    const user = process.env.USER || 'unknown';
    const utcTimestamp = new Date().toISOString();
    const ownerUuid = this.generateUUID();

    const owner = {
      user,
      hostname,
      utcTimestamp,
      uuid: ownerUuid
    };

    return {
      IOR: {
        uuid: this.uuid,
        component: 'Web4Requirement',
        version: 'v1.0'
      },
      owner: Buffer.from(JSON.stringify(owner)).toString('base64'),
      model: {
        uuid: this.uuid,
        name: this._name,
        title: this._name,
        description: this.description
      }
    };
  }

  // Name and title accessors
  get name(): string {
    return this._name;
  }
  
  set name(value: string) {
    this._name = value;
  }
  
    get title(): string {
    return this._name; // Title is an alias for name
  }

  set title(value: string) {
    this._name = value; // Setting title updates name
  }

  // Directory context management
  setDirectoryContext(context: string): void {
    this.directoryContext = context;
    const [type, path] = context.split(':', 2);
    this.contextType = (type === 'component') ? 'component' : 'arbitrary';
    this.contextPath = path;
  }

  private getRequirementsDirectory(): string {
    const cwd = process.cwd();
    // If already in spec/requirements directory, use it directly
    if (cwd.endsWith(path.join('spec', 'requirements'))) {
      return cwd;
    }
    // Otherwise add spec/requirements structure
    return path.join(cwd, 'spec', 'requirements');
  }

  async moveToComponent(uuid: string, targetComponentPath: string): Promise<RequirementResult> {
    try {
      const fs = await import('fs');
      const { execSync } = await import('child_process');
      
      // Source paths (current directory context)
      const sourceRequirementsDir = this.getRequirementsDirectory();
      const sourceMDDir = this.getRequirementsMDDirectory();
      const sourceScenarioFile = path.join(sourceRequirementsDir, `${uuid}.scenario.json`);
      const sourceMDFile = path.join(sourceMDDir, `${uuid}.requirement.md`);
      
      // Target paths (resolve relative to project root)
      let resolvedTargetPath = targetComponentPath;
      if (!path.isAbsolute(targetComponentPath)) {
        // Find project root by looking for a components directory in parent dirs
        let projectRoot = process.cwd();
        while (!await fs.promises.access(path.join(projectRoot, 'components')).then(() => true).catch(() => false)) {
          const parent = path.dirname(projectRoot);
          if (parent === projectRoot) break; // reached filesystem root
          projectRoot = parent;
        }
        // Use absolute path from project root
        resolvedTargetPath = path.join(projectRoot, targetComponentPath);
      }
      
      const targetRequirementsDir = path.join(resolvedTargetPath, 'spec', 'requirements');
      const targetMDDir = path.join(resolvedTargetPath, 'spec', 'requirements.md');
      const targetScenarioFile = path.join(targetRequirementsDir, `${uuid}.scenario.json`);
      const targetMDFile = path.join(targetMDDir, `${uuid}.requirement.md`);
      
      // Ensure target directories exist
      await fs.promises.mkdir(targetRequirementsDir, { recursive: true });
      await fs.promises.mkdir(targetMDDir, { recursive: true });
      
      // Check if files exist before moving
      const scenarioExists = await fs.promises.access(sourceScenarioFile).then(() => true).catch(() => false);
      const mdExists = await fs.promises.access(sourceMDFile).then(() => true).catch(() => false);
      
      if (!scenarioExists) {
        return {
          success: false,
          message: `Scenario file not found: ${sourceScenarioFile}`,
          issues: [`File ${uuid}.scenario.json does not exist in source location`]
        };
      }
      
      // Use git mv to move files (preserves history)
      try {
        execSync(`git mv "${sourceScenarioFile}" "${targetScenarioFile}"`, { stdio: 'pipe' });
        
        if (mdExists) {
          execSync(`git mv "${sourceMDFile}" "${targetMDFile}"`, { stdio: 'pipe' });
        }
      } catch (gitError) {
        return {
          success: false,
          message: `Git mv failed: ${(gitError as Error).message}`,
          issues: [`Failed to move files with git mv`]
        };
      }
      
      // Update both overviews
      try {
        // Update source overview (current location)
        await this.updateOverview();
        
        // Update target overview by setting DIRECTORY_CONTEXT
        const originalContext = process.env.DIRECTORY_CONTEXT;
        process.env.DIRECTORY_CONTEXT = targetComponentPath;
        
        const targetRequirement = new DefaultRequirement();
        await targetRequirement.updateOverview();
        
        // Restore original context
        if (originalContext) {
          process.env.DIRECTORY_CONTEXT = originalContext;
        } else {
          delete process.env.DIRECTORY_CONTEXT;
        }
        
      } catch (overviewError) {
        console.warn(`Failed to update overviews: ${(overviewError as Error).message}`);
      }
      
      return {
        success: true,
        message: `Requirement ${uuid} moved successfully to ${targetComponentPath}`,
        requirementId: uuid
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to move requirement: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  private getRequirementsMDDirectory(): string {
    const cwd = process.cwd();
    // If in spec/requirements, go up and add requirements.md
    if (cwd.endsWith(path.join('spec', 'requirements'))) {
      return path.join(path.dirname(cwd), 'requirements.md');
    }
    // Otherwise add spec/requirements.md structure
    return path.join(cwd, 'spec', 'requirements.md');
  }

  async loadFromScenario(scenarioPath: string): Promise<RequirementResult> {
    try {
      const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
      const scenarioData = JSON.parse(scenarioContent);
      
      // Load from IOR-based scenario structure
      if (scenarioData.IOR && scenarioData.model) {
        this.uuid = scenarioData.IOR.uuid;
        this._name = scenarioData.model.name || scenarioData.model.title || '';
        this.description = scenarioData.model.description || '';
        this.status = RequirementStatus.CREATED; // Assume loaded requirements are created
        
        // Reconstruct minimal scenario for compatibility
        this.scenario = {
          uuid: this.uuid,
          name: this._name,
          title: this._name,
          description: this.description,
          status: this.status,
          metadata: { priority: 'medium', complexity: 'moderate', tags: [] },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return {
          success: true,
          message: `Requirement loaded from scenario: ${scenarioPath}`,
          requirementId: this.uuid
        };
      } else {
        return {
          success: false,
          message: `Invalid scenario format in ${scenarioPath}`,
          issues: ['Missing IOR or model structure']
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to load scenario: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  async set(attribute: string, value: string): Promise<RequirementResult> {
    try {
      switch (attribute.toLowerCase()) {
        case 'implemented':
          const implemented = value.toLowerCase() === 'true';
          await this.updateScenarioAttribute('implemented', implemented);
          if (implemented) {
            await this.updateScenarioAttribute('implementationStatus', 'completed');
          }
          break;
          
        case 'implementationstatus':
          await this.updateScenarioAttribute('implementationStatus', value);
          await this.updateScenarioAttribute('implemented', value === 'completed');
          break;
          
        case 'status':
          if (Object.values(RequirementStatus).includes(value as RequirementStatus)) {
            this.status = value as RequirementStatus;
            await this.updateScenarioAttribute('status', value);
          } else {
            throw new Error(`Invalid status value: ${value}. Must be one of: ${Object.values(RequirementStatus).join(', ')}`);
          }
          break;
          
        case 'title':
        case 'name':
          this._name = value;
          await this.updateScenarioAttribute('title', value);
          await this.updateScenarioAttribute('name', value);
          break;
          
        case 'description':
          this.description = value;
          await this.updateScenarioAttribute('description', value);
          break;
          
        default:
          await this.updateScenarioAttribute(attribute, value);
          break;
      }
      
      await this.saveMDView();
      
      return {
        success: true,
        message: `Requirement ${this.uuid}: ${attribute} set to ${value}`,
        requirementId: this.uuid
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to set ${attribute}: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  async updateOverview(): Promise<RequirementResult> {
    try {
      // Use the same directory context detection as the main component
      const requirementsDir = this.getRequirementsMDDirectory();
      const overviewPath = path.join(requirementsDir, '00_requirements.overview.md');
      
      // Ensure the requirements.md directory exists
      await fs.mkdir(requirementsDir, { recursive: true });
      
      // Get requirement files from the requirements.md directory
      const requirementFiles = await this.getRequirementFiles(requirementsDir);
      
      // Generate new overview content
      const overviewContent = await this.generateRequirementsOverview(requirementFiles, requirementsDir);
      
      // Write the overview file
      await fs.writeFile(overviewPath, overviewContent, 'utf-8');
      
      return {
        success: true,
        message: `Requirements overview regenerated successfully at ${overviewPath}`,
        requirementId: 'overview'
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to update overview: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  private async getRequirementFiles(requirementsDir: string): Promise<string[]> {
    try {
      const files = await fs.readdir(requirementsDir);
      return files.filter(file => 
        file.endsWith('.requirement.md') && 
        !file.startsWith('00_requirements.overview.md')
      );
    } catch (error) {
      console.warn(`Could not read requirements directory ${requirementsDir}: ${(error as Error).message}`);
      return [];
    }
  }

  private async updateScenarioAttribute(attribute: string, value: any): Promise<void> {
    try {
      const scenarioPath = path.join(this.getRequirementsDirectory(), `${this.uuid}.scenario.json`);
      const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
      const scenario = JSON.parse(scenarioContent);
      
      if (!scenario.model) {
        scenario.model = {};
      }
      
      scenario.model[attribute] = value;
      scenario.model.updatedAt = new Date().toISOString();
      
      await fs.writeFile(scenarioPath, JSON.stringify(scenario, null, 2), 'utf-8');
      
    } catch (error) {
      throw new Error(`Failed to update scenario attribute ${attribute}: ${(error as Error).message}`);
    }
  }

  async saveScenario(uuid: string, scenario: any): Promise<void> {
    // Ensure spec/requirements directory exists
    const requirementsDir = this.getRequirementsDirectory();
    await fs.mkdir(requirementsDir, { recursive: true });
    
    const filename = path.join(requirementsDir, `${uuid}.scenario.json`);
    const scenarioJSON = JSON.stringify(scenario, null, 2);
    
    try {
      await fs.writeFile(filename, scenarioJSON, 'utf-8');
      console.log(`📁 Directory: ${requirementsDir}`);
    } catch (error) {
      console.error(`Failed to save scenario file: ${(error as Error).message}`);
      throw error;
    }
  }

  generateMDView(): string {
    const templatePath = path.join(__dirname, '../../../src/views/md/default.view.md');
    
    try {
      const template = require('fs').readFileSync(templatePath, 'utf-8');
      const implementationStatus = this.getImplementationStatus();
      const statusCheckbox = implementationStatus === 'completed' ? 'x' : ' ';
      
      return template
        .replace(/{{name}}/g, this._name)
        .replace(/{{uuid}}/g, this.uuid)
        .replace(/{{title}}/g, this._name)
        .replace(/{{status}}/g, this.status)
        .replace(/{{description}}/g, this.description)
        .replace(/{{createdAt}}/g, new Date().toISOString())
        .replace(/{{updatedAt}}/g, new Date().toISOString())
        .replace(/{{implementationStatus}}/g, implementationStatus)
        .replace(/{{statusCheckbox}}/g, statusCheckbox);
    } catch (error) {
      // Fallback to hardcoded template if file read fails
      const implementationStatus = this.getImplementationStatus();
      const statusCheckbox = implementationStatus === 'completed' ? 'x' : ' ';
      
      return `# ${this._name}\n\n## Task Status\n- [${statusCheckbox}] **${this._name}** [requirement:uuid:${this.uuid}]\n\n## Requirement Details\n\n- **UUID:** \`${this.uuid}\`\n- **Name:** ${this._name}\n- **Status:** ${this.status}\n- **Implementation:** ${implementationStatus}\n\n## Description\n\n${this.description}\n\n---\n\n*Generated by Web4Requirement Component v1.0*`;
    }
  }

  private getImplementationStatus(): string {
    // Map requirement status to implementation status
    switch (this.status) {
      case RequirementStatus.COMPLETED:
        return 'completed';
      case RequirementStatus.IN_PROGRESS:
        return 'in-progress';
      case RequirementStatus.CANCELLED:
        return 'cancelled';
      case RequirementStatus.PENDING:
      case RequirementStatus.CREATED:
      default:
        return 'pending';
    }
  }

  async saveMDView(outputPath?: string): Promise<RequirementResult> {
    try {
      const mdContent = this.generateMDView();
      const filename = `${this.uuid}.requirement.md`;
      
      // Use spec/requirements.md directory structure
      const mdDirectory = this.getRequirementsMDDirectory();
      await fs.mkdir(mdDirectory, { recursive: true });
      
      const finalOutputPath = path.join(mdDirectory, filename);
      await fs.writeFile(finalOutputPath, mdContent, 'utf-8');
      
      // Always update requirements overview in spec structure
      await this.updateRequirementsOverview(mdDirectory);
      
      return { 
        success: true, 
        message: `MD view saved: ${finalOutputPath}`,
        requirementId: this.uuid
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to save MD view: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  private async updateRequirementsOverview(outputPath: string): Promise<void> {
    try {
      const overviewPath = path.join(outputPath, '00_requirements.overview.md');
      
      // Read all existing requirement MD files
      const files = await fs.readdir(outputPath);
      const requirementFiles = files
        .filter(file => file.endsWith('.requirement.md'))
        .sort((a, b) => {
          // Sort by creation time (newest first) - extract timestamp from UUID
          try {
            const statsA = require('fs').statSync(path.join(outputPath, a));
            const statsB = require('fs').statSync(path.join(outputPath, b));
            return statsB.mtime.getTime() - statsA.mtime.getTime();
          } catch {
            return b.localeCompare(a); // Fallback to alphabetical if stats fail
          }
        });

      // Generate overview content
      const overviewContent = await this.generateRequirementsOverview(requirementFiles, outputPath);
      
      // Write overview file
      await fs.writeFile(overviewPath, overviewContent, 'utf-8');
    } catch (error) {
      console.warn(`Failed to update requirements overview: ${(error as Error).message}`);
    }
  }

  private async generateRequirementsOverview(requirementFiles: string[], outputPath: string): Promise<string> {
    try {
      // Use new RequirementOverview from layer5 for proper architectural layering
      const { RequirementOverview } = await import('../layer5/RequirementOverview.js');
      
      const requirementOverview = new RequirementOverview();
      requirementOverview.init(); // Initialize with default template
      
      // Load requirement scenarios from files
      const requirements = await this.loadRequirementsFromFiles(requirementFiles, outputPath);
      requirementOverview.setRequirements(requirements);
      
      // Generate overview using the layer5 view component
      const result = await requirementOverview.generateOverview();
      
      if (result.success && result.content) {
        return result.content;
      } else {
        throw new Error(result.error || 'Failed to generate overview');
      }
    } catch (error) {
      // Fallback to simple overview if layer5 component fails
      return this.generateSimpleOverview(requirementFiles);
    }
  }

  private async loadRequirementsFromFiles(requirementFiles: string[], outputPath: string): Promise<any[]> {
    const requirements = [];
    
    for (const filename of requirementFiles) {
      try {
        const filePath = path.join(outputPath, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Extract title from markdown content
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename.replace('.requirement.md', '');
        
        // Extract UUID from filename
        const uuid = filename.replace('.requirement.md', '');
        
        // Try to load implementation status from scenario JSON file
        let implemented = false;
        let implementationStatus = 'pending';
        
        try {
          const scenarioPath = path.join(this.getRequirementsDirectory(), `${uuid}.scenario.json`);
          const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
          const scenario = JSON.parse(scenarioContent);
          
          if (scenario.model) {
            implemented = scenario.model.implemented || false;
            implementationStatus = scenario.model.implementationStatus || 'pending';
          }
        } catch (scenarioError) {
          // Fall back to extracting from MD content if scenario read fails
          const implementedMatch = content.match(/\*\*Implementation:\*\*\s+(.+)$/m);
          implementationStatus = implementedMatch ? implementedMatch[1].toLowerCase() : 'pending';
          implemented = implementationStatus === 'completed';
        }

        // Create requirement scenario object
        requirements.push({
          uuid,
          title,
          name: title,
          filename,
          createdAt: new Date().toISOString(), // Fallback timestamp
          implemented,
          implementationStatus
        });
      } catch (error) {
        console.warn(`Failed to load requirement ${filename}: ${error}`);
      }
    }
    
    return requirements;
  }

  private generateSimpleOverview(requirementFiles: string[]): string {
    const timestamp = new Date().toISOString();
    const totalCount = requirementFiles.length;
    
    const itemsList = requirementFiles.map(filename => `- [${filename}](./${filename})`).join('\n');
    
    return `# Requirements Overview

**Last Updated:** ${timestamp}
**Total Requirements:** ${totalCount}

## Requirements List

${itemsList}

---

*Generated by Web4Requirement Component v1.0*`;
  }

  // Legacy method for backwards compatibility - now redirects to new implementation
  private async generateRequirementsOverviewLegacy(requirementFiles: string[], outputPath: string): Promise<string> {
    try {
      // Use new MDOverview for maximum template independence
      const { MDOverview } = require('./MDOverview.js');
      
      const overviewTemplatePath = path.join(__dirname, '../../../src/views/md/over.view.md');
      const itemTemplatePath = path.join(__dirname, '../../../src/views/md/item.view.md');
      
      const mdOverview = new MDOverview(overviewTemplatePath, itemTemplatePath);
      
      const context = {
        requirementFiles,
        outputPath,
        timestamp: new Date().toISOString(),
        totalCount: requirementFiles.length
      };
      
      const result = await mdOverview.renderMD(context);
      
      if (result.success && result.content) {
        return result.content;
      } else {
        throw new Error(result.error || 'Overview rendering failed');
      }
        
    } catch (error) {
      // Log template loading error for debugging
      console.error(`Overview generation failed: ${(error as Error).message}`);
      
      // Fallback to simple overview if new architecture fails
      const timestamp = new Date().toISOString();
      return `# Requirements Overview\n\n**Last Updated:** ${timestamp}\n**Total Requirements:** ${requirementFiles.length}\n\n## Requirements List\n\n${requirementFiles.map(f => `- [${f}](./${f})`).join('\n')}\n\n---\n\n*Generated by Web4Requirement Component v1.0*`;
    }
  }
}