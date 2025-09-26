/**
 * DefaultWeb4Requirement - Web4 requirement implementation
 * Layer 2: Requirement tracking implementation following Web4 principles
 */

import { Web4Requirement, RequirementStatus } from '../layer3/Web4Requirement';
import { RequirementScenario, TraceabilityLink } from '../layer3/TestScenario';

/**
 * DefaultWeb4Requirement - Web4 requirement implementation
 * Tracks requirements with test traceability and status management
 */
export class DefaultWeb4Requirement implements Web4Requirement {
  private scenario?: RequirementScenario;

  /**
   * Web4 empty constructor principle
   */
  constructor() {}

  /**
   * Initialize requirement from scenario
   */
  init(scenario: RequirementScenario): Web4Requirement {
    this.scenario = scenario;
    return this;
  }

  /**
   * Update requirement status
   */
  updateStatus(status: RequirementStatus, reason?: string): void {
    if (!this.scenario) {
      throw new Error('Requirement not initialized - call init(scenario) first');
    }

    this.scenario.status = status;
    this.scenario.modifiedAt = new Date().toISOString();

    // Add traceability link for status change
    if (reason) {
      this.addTraceabilityLink({
        sourceIOR: this.scenario.uuid,
        targetIOR: `status-change:${Date.now()}`,
        relationType: 'uses',
        createdAt: new Date().toISOString()
      });
    }
  }

  /**
   * Add test case that validates this requirement
   */
  addTestCase(testCaseIOR: string): void {
    if (!this.scenario) {
      throw new Error('Requirement not initialized - call init(scenario) first');
    }

    if (!this.scenario.testCaseIORs.includes(testCaseIOR)) {
      this.scenario.testCaseIORs.push(testCaseIOR);
      this.scenario.modifiedAt = new Date().toISOString();

      // Add traceability link
      this.addTraceabilityLink({
        sourceIOR: this.scenario.uuid,
        targetIOR: testCaseIOR,
        relationType: 'tests',
        createdAt: new Date().toISOString()
      });
    }
  }

  /**
   * Remove test case from requirement
   */
  removeTestCase(testCaseIOR: string): void {
    if (!this.scenario) {
      throw new Error('Requirement not initialized - call init(scenario) first');
    }

    const index = this.scenario.testCaseIORs.indexOf(testCaseIOR);
    if (index > -1) {
      this.scenario.testCaseIORs.splice(index, 1);
      this.scenario.modifiedAt = new Date().toISOString();

      // Remove corresponding traceability link
      this.scenario.traceabilityChain = this.scenario.traceabilityChain.filter(
        link => !(link.sourceIOR === this.scenario!.uuid && link.targetIOR === testCaseIOR && link.relationType === 'tests')
      );
    }
  }

  /**
   * Add traceability link to another object
   */
  addTraceabilityLink(link: TraceabilityLink): void {
    if (!this.scenario) {
      throw new Error('Requirement not initialized - call init(scenario) first');
    }

    // Avoid duplicate links
    const exists = this.scenario.traceabilityChain.some(
      existing => 
        existing.sourceIOR === link.sourceIOR &&
        existing.targetIOR === link.targetIOR &&
        existing.relationType === link.relationType
    );

    if (!exists) {
      this.scenario.traceabilityChain.push(link);
      this.scenario.modifiedAt = new Date().toISOString();
    }
  }

  /**
   * Get requirement completion percentage based on test results
   */
  async getCompletionPercentage(): Promise<number> {
    if (!this.scenario || this.scenario.testCaseIORs.length === 0) {
      return this.scenario?.status === 'completed' ? 100 : 0;
    }

    // For now, return percentage based on status
    // In real implementation, this would check actual test results
    switch (this.scenario.status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 50;
      case 'cancelled':
        return 0;
      case 'pending':
      default:
        return 0;
    }
  }

  /**
   * Convert requirement to hibernatable scenario
   */
  toScenario(): RequirementScenario {
    if (!this.scenario) {
      throw new Error('Requirement not initialized - call init(scenario) first');
    }
    
    return {
      ...this.scenario,
      modifiedAt: new Date().toISOString()
    };
  }

  /**
   * Get requirement UUID
   */
  getUUID(): string {
    if (!this.scenario) {
      throw new Error('Requirement not initialized - call init(scenario) first');
    }
    return this.scenario.uuid;
  }

  /**
   * Get requirement status
   */
  getStatus(): RequirementStatus {
    return this.scenario?.status || 'pending';
  }

  /**
   * Get all test case IORs for this requirement
   */
  getTestCaseIORs(): string[] {
    return this.scenario?.testCaseIORs || [];
  }

  /**
   * Get traceability chain (7-stage)
   */
  getTraceabilityChain(): TraceabilityLink[] {
    return this.scenario?.traceabilityChain || [];
  }

  /**
   * Generate markdown view of requirement for documentation
   */
  generateMDView(): string {
    if (!this.scenario) {
      throw new Error('Requirement not initialized - call init(scenario) first');
    }

    const statusIcon = this.getStatusIcon();
    const completionPercent = this.scenario.status === 'completed' ? 100 : 
                             this.scenario.status === 'in-progress' ? 50 : 0;

    let md = `## ${statusIcon} ${this.scenario.name}\n\n`;
    md += `**UUID:** \`${this.scenario.uuid}\`\n`;
    md += `**Status:** ${this.scenario.status} (${completionPercent}% complete)\n`;
    md += `**Description:** ${this.scenario.description}\n\n`;

    if (this.scenario.acceptance_criteria.length > 0) {
      md += `### Acceptance Criteria\n\n`;
      this.scenario.acceptance_criteria.forEach((criteria, index) => {
        const checked = this.scenario!.status === 'completed' ? 'x' : ' ';
        md += `- [${checked}] ${criteria}\n`;
      });
      md += '\n';
    }

    if (this.scenario.testCaseIORs.length > 0) {
      md += `### Test Cases\n\n`;
      this.scenario.testCaseIORs.forEach(ior => {
        md += `- [${ior}](${this.convertIORToPath(ior)})\n`;
      });
      md += '\n';
    }

    if (this.scenario.traceabilityChain.length > 0) {
      md += `### Traceability Links\n\n`;
      this.scenario.traceabilityChain.forEach(link => {
        md += `- **${link.relationType}**: [${link.targetIOR}](${this.convertIORToPath(link.targetIOR)})\n`;
      });
      md += '\n';
    }

    md += `**Created:** ${this.scenario.createdAt}\n`;
    md += `**Modified:** ${this.scenario.modifiedAt}\n\n`;
    md += `---\n\n`;

    return md;
  }

  /**
   * Validate requirement configuration
   */
  validate(): boolean {
    return !!(
      this.scenario &&
      this.scenario.uuid &&
      this.scenario.name &&
      this.scenario.description
    );
  }

  /**
   * Get status icon for markdown display
   */
  private getStatusIcon(): string {
    switch (this.scenario?.status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'cancelled':
        return '❌';
      case 'pending':
      default:
        return '📋';
    }
  }

  /**
   * Convert IOR to relative file path for markdown links
   */
  private convertIORToPath(ior: string): string {
    const parts = ior.split(':');
    if (parts.length >= 3) {
      const objectType = parts[0];
      const uuid = parts[2];
      
      // Generate relative paths based on object type
      switch (objectType) {
        case 'test':
          return `../test/${uuid}.test.md`;
        case 'requirement':
          return `../requirements/${uuid}.requirement.md`;
        case 'component':
          return `../components/${parts[1]}/${parts[2] || 'latest'}/README.md`;
        default:
          return `#${uuid}`;
      }
    }
    
    return `#${ior}`;
  }
}
