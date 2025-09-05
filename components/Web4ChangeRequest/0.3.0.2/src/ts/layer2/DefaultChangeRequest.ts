import { Requirement as ChangeRequest, RequirementScenario as ChangeRequestScenario, RequirementResult as ChangeRequestResult, RequirementStatus as ChangeRequestStatus, RequirementMetadata as ChangeRequestMetadata } from '../layer3/Requirement.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { UnitIndexStorage } from '../../../../../Unit/0.3.0.2/dist/ts/layer2/UnitIndexStorage.js';
import { DefaultUser } from '../../../../../User/0.3.0.2/dist/layer2/DefaultUser.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DefaultChangeRequest implements ChangeRequest {
  private scenario!: ChangeRequestScenario;
  private uuid: string = '';
  private _name: string = '';
  private description: string = '';
  private status: ChangeRequestStatus = ChangeRequestStatus.PENDING;
  private directoryContext: string = '';
  private contextType: 'component' | 'arbitrary' = 'arbitrary';
  private contextPath: string = '';
  
  constructor() { // Web4 empty constructor
  }

  /**
   * Find project root by looking for scenarios directory
   */
  private findProjectRoot(): string {
    let currentDir = process.cwd();
    while (currentDir !== path.dirname(currentDir)) {
      const scenariosPath = path.join(currentDir, 'scenarios');
      try {
        // Check if scenarios directory exists (sync check for simplicity)
        require('fs').accessSync(scenariosPath);
        return currentDir;
      } catch {
        currentDir = path.dirname(currentDir);
      }
    }
    // Fallback to current working directory if not found
    return process.cwd();
  }
  
  init(scenario: ChangeRequestScenario): this {
    this.scenario = scenario;
    return this;
  }

  async create(title: string, description: string): Promise<ChangeRequestResult> {
    this.uuid = this.generateUUID();
    this._name = title;
    this.description = description;
    this.status = ChangeRequestStatus.CREATED;

    const scenario = this.createScenarioJSON();
    
    return {
      success: true,
      changeRequestId: this.uuid,
      scenario: scenario,
      message: 'ChangeRequest created successfully'
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
  
  getMetadata(): ChangeRequestMetadata {
    return { ...this.scenario.metadata };
  }
  
  async process(): Promise<ChangeRequestResult> {
    return {
      success: true,
      message: 'ChangeRequest processed successfully',
      changeRequestId: this.uuid
    };
  }
  
  getStatus(): ChangeRequestStatus {
    return this.status;
  }
  
  toScenario(): ChangeRequestScenario {
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
    // FIXED: Use consistent User UUID instead of random UUID for owner
    const user = process.env.USER || 'unknown';
    const hostname = process.env.HOSTNAME || 'localhost';
    const owner = DefaultUser.getOwnerObject(user, hostname);

    return {
      IOR: {
        uuid: this.uuid,
        component: 'Web4ChangeRequest',
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

  private getChangeRequestsDirectory(): string {
    const cwd = process.cwd();
    // If already in spec/changeRequests directory, use it directly
    if (cwd.endsWith(path.join('spec', 'changeRequests'))) {
      return cwd;
    }
    // Otherwise add spec/changeRequests structure
    return path.join(cwd, 'spec', 'changeRequests');
  }

  async moveToComponent(uuid: string, targetComponentPath: string): Promise<ChangeRequestResult> {
    try {
      const fs = await import('fs');
      const { execSync } = await import('child_process');
      
      // Source paths (current directory context)
      const sourceChangeRequestsDir = this.getChangeRequestsDirectory();
      const sourceMDDir = this.getChangeRequestsMDDirectory();
      const sourceScenarioFile = path.join(sourceChangeRequestsDir, `${uuid}.scenario.json`);
      const sourceMDFile = path.join(sourceMDDir, `${uuid}.changeRequest.md`);
      
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
      
      const targetChangeRequestsDir = path.join(resolvedTargetPath, 'spec', 'changeRequests');
      const targetMDDir = path.join(resolvedTargetPath, 'spec', 'changeRequests.md');
      const targetScenarioFile = path.join(targetChangeRequestsDir, `${uuid}.scenario.json`);
      const targetMDFile = path.join(targetMDDir, `${uuid}.changeRequest.md`);
      
      // Ensure target directories exist
      await fs.promises.mkdir(targetChangeRequestsDir, { recursive: true });
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
        
        const targetChangeRequest = new DefaultChangeRequest();
        await targetChangeRequest.updateOverview();
        
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
        message: `ChangeRequest ${uuid} moved successfully to ${targetComponentPath}`,
        changeRequestId: uuid
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to move changeRequest: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  private getChangeRequestsMDDirectory(): string {
    const cwd = process.cwd();
    // If in spec/changeRequests, go up and add changeRequests.md
    if (cwd.endsWith(path.join('spec', 'changeRequests'))) {
      return path.join(path.dirname(cwd), 'changeRequests.md');
    }
    // Otherwise add spec/changeRequests.md structure
    return path.join(cwd, 'spec', 'changeRequests.md');
  }

  async loadFromScenario(scenarioPath: string): Promise<ChangeRequestResult> {
    try {
      const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
      const scenarioData = JSON.parse(scenarioContent);
      
      // Load from IOR-based scenario structure
      if (scenarioData.IOR && scenarioData.model) {
        this.uuid = scenarioData.IOR.uuid;
        this._name = scenarioData.model.name || scenarioData.model.title || '';
        this.description = scenarioData.model.description || '';
        this.status = ChangeRequestStatus.CREATED; // Assume loaded changeRequests are created
        
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
          message: `ChangeRequest loaded from scenario: ${scenarioPath}`,
          changeRequestId: this.uuid
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

  async set(attribute: string, value: string): Promise<ChangeRequestResult> {
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
          if (Object.values(ChangeRequestStatus).includes(value as ChangeRequestStatus)) {
            this.status = value as ChangeRequestStatus;
            await this.updateScenarioAttribute('status', value);
          } else {
            throw new Error(`Invalid status value: ${value}. Must be one of: ${Object.values(ChangeRequestStatus).join(', ')}`);
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
        message: `ChangeRequest ${this.uuid}: ${attribute} set to ${value}`,
        changeRequestId: this.uuid
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to set ${attribute}: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  async updateOverview(): Promise<ChangeRequestResult> {
    try {
      // Get scenario files from the changeRequests directory  
      const scenarioDir = this.getChangeRequestsDirectory();
      const mdDir = this.getChangeRequestsMDDirectory();
      
      // Ensure both directories exist
      await fs.mkdir(scenarioDir, { recursive: true });
      await fs.mkdir(mdDir, { recursive: true });
      
      // Find all scenario files
      const scenarioFiles = await fs.readdir(scenarioDir);
      const scenarios = scenarioFiles.filter(file => file.endsWith('.scenario.json'));
      
      console.log(`🔄 Regenerating ${scenarios.length} changeRequest files...`);
      
      // Regenerate each changeRequest MD file from its scenario
      for (const scenarioFile of scenarios) {
        const uuid = scenarioFile.replace('.scenario.json', '');
        const scenarioPath = path.join(scenarioDir, scenarioFile);
        
        try {
          // Load scenario and create temporary changeRequest instance
          const scenarioContent = await fs.readFile(scenarioPath, 'utf-8');
          const scenarioData = JSON.parse(scenarioContent);
          
          // Create a temporary changeRequest instance for this UUID
          const tempReq = new DefaultChangeRequest();
          await tempReq.loadFromScenario(scenarioPath);
          
          // Generate MD view and save it
          const mdContent = tempReq.generateMDView();
          const mdPath = path.join(mdDir, `${uuid}.changeRequest.md`);
          await fs.writeFile(mdPath, mdContent, 'utf-8');
          
          console.log(`✅ Generated ${uuid}.changeRequest.md`);
          
        } catch (error) {
          console.warn(`⚠️  Failed to regenerate ${scenarioFile}: ${(error as Error).message}`);
        }
      }
      
      // Get all changeRequest files (now freshly regenerated)
      const changeRequestFiles = await this.getChangeRequestFiles(mdDir);
      
      // Generate new overview content
      const overviewContent = await this.generateChangeRequestsOverview(changeRequestFiles, mdDir);
      
      // Write the overview file
      const overviewPath = path.join(mdDir, '00_changeRequests.overview.md');
      await fs.writeFile(overviewPath, overviewContent, 'utf-8');
      
      return {
        success: true,
        message: `Regenerated ${scenarios.length} changeRequest files and overview at ${overviewPath}`,
        changeRequestId: 'overview'
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Failed to update overview: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  private async getChangeRequestFiles(changeRequestsDir: string): Promise<string[]> {
    try {
      const files = await fs.readdir(changeRequestsDir);
      return files.filter(file => 
        file.endsWith('.changeRequest.md') && 
        !file.startsWith('00_changeRequests.overview.md')
      );
    } catch (error) {
      console.warn(`Could not read changeRequests directory ${changeRequestsDir}: ${(error as Error).message}`);
      return [];
    }
  }

  private async updateScenarioAttribute(attribute: string, value: any): Promise<void> {
    try {
      const scenarioPath = path.join(this.getChangeRequestsDirectory(), `${this.uuid}.scenario.json`);
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
    // NEW: Use Unit Index Storage instead of direct file operations
    const projectRoot = this.findProjectRoot();
    const unitStorage = new UnitIndexStorage().init(projectRoot);
    
    // Create symbolic link at Web4ChangeRequest spec location
    const changeRequestsDir = this.getChangeRequestsDirectory();
    await fs.mkdir(changeRequestsDir, { recursive: true });
    const symlinkPath = path.join(changeRequestsDir, `${uuid}.scenario.json`);
    
    try {
      // Save via Unit storage with symbolic link
      const saveResult = await unitStorage.saveScenario(uuid, scenario, [symlinkPath]);
      if (!saveResult.success) {
        throw new Error(`Unit storage failed: ${saveResult.message}`);
      }
      console.log(`📁 Directory: ${changeRequestsDir}`);
      console.log(`🔗 Central Index: ${saveResult.scenarioPath}`);
    } catch (error) {
      console.error(`Failed to save scenario via Unit storage: ${(error as Error).message}`);
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
      
      return `# ${this._name}\n\n## Task Status\n- [${statusCheckbox}] **${this._name}** [changeRequest:uuid:${this.uuid}]\n\n## ChangeRequest Details\n\n- **UUID:** \`${this.uuid}\`\n- **Name:** ${this._name}\n- **Status:** ${this.status}\n- **Implementation:** ${implementationStatus}\n\n## Description\n\n${this.description}\n\n---\n\n*Generated by Web4ChangeRequest Component v1.0*`;
    }
  }

  private getImplementationStatus(): string {
    // Map changeRequest status to implementation status
    switch (this.status) {
      case ChangeRequestStatus.COMPLETED:
        return 'completed';
      case ChangeRequestStatus.IN_PROGRESS:
        return 'in-progress';
      case ChangeRequestStatus.CANCELLED:
        return 'cancelled';
      case ChangeRequestStatus.PENDING:
      case ChangeRequestStatus.CREATED:
      default:
        return 'pending';
    }
  }

  async saveMDView(outputPath?: string): Promise<ChangeRequestResult> {
    try {
      const mdContent = this.generateMDView();
      const filename = `${this.uuid}.changeRequest.md`;
      
      // Use spec/changeRequests.md directory structure
      const mdDirectory = this.getChangeRequestsMDDirectory();
      await fs.mkdir(mdDirectory, { recursive: true });
      
      const finalOutputPath = path.join(mdDirectory, filename);
      await fs.writeFile(finalOutputPath, mdContent, 'utf-8');
      
      // Always update changeRequests overview in spec structure
      await this.updateChangeRequestsOverview(mdDirectory);
      
      return { 
        success: true, 
        message: `MD view saved: ${finalOutputPath}`,
        changeRequestId: this.uuid
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to save MD view: ${(error as Error).message}`,
        issues: [(error as Error).message]
      };
    }
  }

  private async updateChangeRequestsOverview(outputPath: string): Promise<void> {
    try {
      const overviewPath = path.join(outputPath, '00_changeRequests.overview.md');
      
      // Read all existing changeRequest MD files
      const files = await fs.readdir(outputPath);
      const changeRequestFiles = files
        .filter(file => file.endsWith('.changeRequest.md'))
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
      const overviewContent = await this.generateChangeRequestsOverview(changeRequestFiles, outputPath);
      
      // Write overview file
      await fs.writeFile(overviewPath, overviewContent, 'utf-8');
    } catch (error) {
      console.warn(`Failed to update changeRequests overview: ${(error as Error).message}`);
    }
  }

  private async generateChangeRequestsOverview(changeRequestFiles: string[], outputPath: string): Promise<string> {
    try {
      // Use new ChangeRequestOverview from layer5 for proper architectural layering
      const { RequirementOverview: ChangeRequestOverview } = await import('../layer5/RequirementOverview.js');
      
      const changeRequestOverview = new ChangeRequestOverview();
      changeRequestOverview.init(); // Initialize with default template
      
      // Load changeRequest scenarios from files
      const changeRequests = await this.loadChangeRequestsFromFiles(changeRequestFiles, outputPath);
      changeRequestOverview.setChangeRequests(changeRequests);
      
      // Generate overview using the layer5 view component
      const result = await changeRequestOverview.generateOverview();
      
      if (result.success && result.content) {
        return result.content;
      } else {
        throw new Error(result.error || 'Failed to generate overview');
      }
    } catch (error) {
      // Fallback to simple overview if layer5 component fails
      return this.generateSimpleOverview(changeRequestFiles);
    }
  }

  private async loadChangeRequestsFromFiles(changeRequestFiles: string[], outputPath: string): Promise<any[]> {
    const changeRequests = [];
    
    for (const filename of changeRequestFiles) {
      try {
        const filePath = path.join(outputPath, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Extract title from markdown content
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filename.replace('.changeRequest.md', '');
        
        // Extract UUID from filename
        const uuid = filename.replace('.changeRequest.md', '');
        
        // Try to load implementation status from scenario JSON file
        let implemented = false;
        let implementationStatus = 'pending';
        
        try {
          const scenarioPath = path.join(this.getChangeRequestsDirectory(), `${uuid}.scenario.json`);
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

        // Create changeRequest scenario object
        changeRequests.push({
          uuid,
          title,
          name: title,
          filename,
          createdAt: new Date().toISOString(), // Fallback timestamp
          implemented,
          implementationStatus
        });
      } catch (error) {
        console.warn(`Failed to load changeRequest ${filename}: ${error}`);
      }
    }
    
    return changeRequests;
  }

  private generateSimpleOverview(changeRequestFiles: string[]): string {
    const timestamp = new Date().toISOString();
    const totalCount = changeRequestFiles.length;
    
    const itemsList = changeRequestFiles.map(filename => `- [${filename}](./${filename})`).join('\n');
    
    return `# ChangeRequests Overview

**Last Updated:** ${timestamp}
**Total ChangeRequests:** ${totalCount}

## ChangeRequests List

${itemsList}

---

*Generated by Web4ChangeRequest Component v1.0*`;
  }

  // Legacy method for backwards compatibility - now redirects to new implementation
  private async generateChangeRequestsOverviewLegacy(changeRequestFiles: string[], outputPath: string): Promise<string> {
    try {
      // Use new MDOverview for maximum template independence
      const { MDOverview } = require('./MDOverview.js');
      
      const overviewTemplatePath = path.join(__dirname, '../../../src/views/md/over.view.md');
      const itemTemplatePath = path.join(__dirname, '../../../src/views/md/item.view.md');
      
      const mdOverview = new MDOverview(overviewTemplatePath, itemTemplatePath);
      
      const context = {
        changeRequestFiles,
        outputPath,
        timestamp: new Date().toISOString(),
        totalCount: changeRequestFiles.length
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
      return `# ChangeRequests Overview\n\n**Last Updated:** ${timestamp}\n**Total ChangeRequests:** ${changeRequestFiles.length}\n\n## ChangeRequests List\n\n${changeRequestFiles.map(f => `- [${f}](./${f})`).join('\n')}\n\n---\n\n*Generated by Web4ChangeRequest Component v1.0*`;
    }
  }
}