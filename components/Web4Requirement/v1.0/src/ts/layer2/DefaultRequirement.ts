/**
 * Layer 2: Implementation
 * Default implementation of Web4 Requirement
 */

import { 
  Requirement, 
  RequirementScenario, 
  RequirementMetadata, 
  RequirementTraceability,
  RequirementStatus,
  IOR 
} from '../layer3/Requirement';

export class DefaultRequirement implements Requirement {
  private scenario!: RequirementScenario;
  
  constructor() { // Web4 empty constructor
  }
  
  init(scenario: RequirementScenario): this {
    this.scenario = scenario;
    return this;
  }
  
  getMetadata(): RequirementMetadata {
    return { ...this.scenario.metadata };
  }
  
  updateStatus(status: RequirementStatus): void {
    this.scenario.metadata.status = status;
    this.scenario.metadata.updatedAt = new Date().toISOString();
  }
  
  addTestReference(testIOR: IOR): void {
    if (!this.scenario.traceability.testIORs) {
      this.scenario.traceability.testIORs = [];
    }
    this.scenario.traceability.testIORs.push(testIOR);
  }
  
  getTraceability(): RequirementTraceability {
    return { ...this.scenario.traceability };
  }
  
  generateMDView(): string {
    const { metadata } = this.scenario;
    const statusIcon = this.getStatusIcon(metadata.status);
    const priorityLabel = metadata.priority.toUpperCase();
    
    let mdView = `- [${statusIcon}] **${metadata.title}**  \n`;
    mdView += `  [requirement:uuid:${metadata.uuid}]\n`;
    
    if (metadata.epic) {
      mdView += `  ([${metadata.epic}](./${metadata.epic}.md))\n`;
    }
    
    mdView += `  > ${metadata.description}\n`;
    
    if (this.scenario.acceptanceCriteria.length > 0) {
      mdView += `\n  **Acceptance Criteria:**\n`;
      this.scenario.acceptanceCriteria.forEach(criteria => {
        mdView += `  - [ ] ${criteria}\n`;
      });
    }
    
    if (this.scenario.traceability.testIORs.length > 0) {
      mdView += `\n  **Test Coverage:**\n`;
      this.scenario.traceability.testIORs.forEach(testIOR => {
        mdView += `  - [test:uuid:${testIOR.uuid}](${testIOR.location})\n`;
      });
    }
    
    return mdView;
  }
  
  toScenario(): RequirementScenario {
    return JSON.parse(JSON.stringify(this.scenario));
  }
  
  private getStatusIcon(status: RequirementStatus): string {
    switch (status) {
      case RequirementStatus.COMPLETED: return 'x';
      case RequirementStatus.IN_PROGRESS: return '~';
      case RequirementStatus.CANCELLED: return '-';
      default: return ' ';
    }
  }
}
