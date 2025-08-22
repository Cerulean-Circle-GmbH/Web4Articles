import { Requirement, RequirementScenario, RequirementResult, RequirementStatus, RequirementMetadata } from '../layer3/Requirement.js';

export class DefaultRequirement implements Requirement {
  private scenario!: RequirementScenario;
  private uuid: string = '';
  private title: string = '';
  private description: string = '';
  private status: RequirementStatus = RequirementStatus.PENDING;
  
  constructor() { // Web4 empty constructor
  }
  
  init(scenario: RequirementScenario): this {
    this.scenario = scenario;
    return this;
  }

  async create(title: string, description: string): Promise<RequirementResult> {
    this.uuid = this.generateUUID();
    this.title = title;
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
    return this.title;
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
        description: this.description
      }
    };
  }
}