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
    // Always create spec/requirements structure
    return path.join(process.cwd(), 'spec', 'requirements');
  }

  private getRequirementsMDDirectory(): string {
    // Always create spec/requirements.md structure  
    return path.join(process.cwd(), 'spec', 'requirements.md');
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
    const templatePath = path.join(__dirname, '../../../views/md/default.view.md');
    
    try {
      const template = require('fs').readFileSync(templatePath, 'utf-8');
      
      return template
        .replace(/{{name}}/g, this._name)
        .replace(/{{uuid}}/g, this.uuid)
        .replace(/{{title}}/g, this._name)
        .replace(/{{status}}/g, this.status)
        .replace(/{{description}}/g, this.description)
        .replace(/{{createdAt}}/g, new Date().toISOString())
        .replace(/{{updatedAt}}/g, new Date().toISOString());
    } catch (error) {
      // Fallback to hardcoded template if file read fails
      return `# ${this._name}\n\n## Requirement Details\n\n- **UUID:** \`${this.uuid}\`\n- **Name:** ${this._name}\n- **Status:** ${this.status}\n\n## Description\n\n${this.description}\n\n---\n\n*Generated by Web4Requirement Component v1.0*`;
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
    const timestamp = new Date().toISOString();
    
    try {
      // Load templates
      const overviewTemplatePath = path.join(__dirname, '../../../views/md/over.view.md');
      const itemTemplatePath = path.join(__dirname, '../../../views/md/item.view.md');
      
      const overviewTemplate = require('fs').readFileSync(overviewTemplatePath, 'utf-8');
      const itemTemplate = require('fs').readFileSync(itemTemplatePath, 'utf-8');
      
      // Generate items list
      let itemsList = '';
      for (const filename of requirementFiles) {
        try {
          const filePath = path.join(outputPath, filename);
          const content = await fs.readFile(filePath, 'utf-8');
          
          // Extract title from MD content (first # heading)
          const titleMatch = content.match(/^# (.+)$/m);
          const title = titleMatch ? titleMatch[1] : filename.replace('.requirement.md', '');
          
          // Extract UUID from filename
          const uuid = filename.replace('.requirement.md', '');
          
          // Extract creation date if available
          const dateMatch = content.match(/\*\*Created:\*\* (.+)$/m);
          const createdDate = dateMatch ? new Date(dateMatch[1]).toLocaleDateString() : 'Unknown';
          
          // Apply item template
          const item = itemTemplate
            .replace(/{{title}}/g, title)
            .replace(/{{filename}}/g, filename)
            .replace(/{{uuid}}/g, uuid)
            .replace(/{{createdDate}}/g, createdDate);
          
          itemsList += item + '\n';
        } catch (error) {
          // If we can't read a file, still include it in the list
          const uuid = filename.replace('.requirement.md', '');
          const item = itemTemplate
            .replace(/{{title}}/g, filename)
            .replace(/{{filename}}/g, filename)
            .replace(/{{uuid}}/g, uuid)
            .replace(/{{createdDate}}/g, 'Unknown');
          
          itemsList += item + '\n';
        }
      }
      
      // Apply overview template
      return overviewTemplate
        .replace(/{{timestamp}}/g, timestamp)
        .replace(/{{totalCount}}/g, requirementFiles.length.toString())
        .replace(/{{itemsList}}/g, itemsList);
        
    } catch (error) {
      // Fallback to simple overview if template loading fails
      return `# Requirements Overview\n\n**Last Updated:** ${timestamp}\n**Total Requirements:** ${requirementFiles.length}\n\n## Requirements List\n\n${requirementFiles.map(f => `- [${f}](./${f})`).join('\n')}\n\n---\n\n*Generated by Web4Requirement Component v1.0*`;
    }
  }
}