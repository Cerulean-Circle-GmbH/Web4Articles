/**
 * Layer 5: UX/UI - Requirement Overview View
 * Generates overview views for collections of requirements
 */

import { DefaultMDView } from '../layer2/DefaultMDView.js';
import { ViewContext, ViewResult } from '../layer3/View.js';
import { RequirementScenario } from '../layer3/Requirement.js';
import { DefaultRequirement } from '../layer2/DefaultRequirement.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Requirement Overview View - extends DefaultMDView for template-based rendering
 * Generates overview markdown files for requirement collections
 */
export class RequirementOverview extends DefaultMDView {
  private requirements: RequirementScenario[] = [];
  private overviewTitle: string = 'Requirements Overview';
  
  constructor() {
    super(); // Web4 empty constructor pattern
  }
  
  /**
   * Initialize with overview template path
   */
  init(templatePath?: string): this {
    // Use default overview template if none provided
    const defaultTemplate = templatePath || this.resolveTemplatePath('over.view.md');
    this.setTemplatePath(defaultTemplate);
    return this;
  }
  
  /**
   * Add requirement to the overview
   */
  addRequirement(requirement: RequirementScenario): void {
    this.requirements.push(requirement);
  }
  
  /**
   * Set requirements collection
   */
  setRequirements(requirements: RequirementScenario[]): void {
    this.requirements = requirements;
  }
  
  /**
   * Set overview title
   */
  setTitle(title: string): void {
    this.overviewTitle = title;
  }
  
  /**
   * Generate overview markdown content
   */
  async generateOverview(): Promise<ViewResult> {
    const context = await this.buildOverviewContext();
    return await this.renderMD(context);
  }
  
  /**
   * Build context for overview template
   */
  private async buildOverviewContext(): Promise<ViewContext> {
    const totalCount = this.requirements.length;
    const timestamp = new Date().toISOString();
    
    // Generate items list using item template
    const sortedRequirements = this.requirements
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()); // Newest first
    
    const itemsListPromises = sortedRequirements.map(req => this.generateItemEntry(req));
    const itemsListArray = await Promise.all(itemsListPromises);
    const itemsList = itemsListArray.join('\n');
    
    return {
      title: this.overviewTitle,
      timestamp,
      totalCount,
      itemsList,
      requirements: this.requirements
    };
  }
  
  /**
   * Generate single item entry using item template
   */
  private async generateItemEntry(requirement: RequirementScenario): Promise<string> {
    try {
      const itemTemplatePath = this.resolveTemplatePath('item.view.md');
      const fs = await import('fs/promises');
      const itemTemplate = await fs.readFile(itemTemplatePath, 'utf-8');
      
      const filename = `${requirement.uuid}.requirement.md`;
      const implementationStatus = this.getImplementationStatus(requirement);
      const statusCheckbox = implementationStatus === 'completed' ? 'x' : ' ';
      
      // Decode owner details using shared utility method (DRY principle)
      const ownerDetails = DefaultRequirement.decodeOwnerDetailsFromScenario(requirement);
      
      let processedTemplate = itemTemplate
        .replace(/{{title}}/g, requirement.title || requirement.name || 'Untitled')
        .replace(/{{filename}}/g, filename)
        .replace(/{{uuid}}/g, requirement.uuid || '')
        .replace(/{{statusCheckbox}}/g, statusCheckbox)
        .replace(/{{implementationStatus}}/g, implementationStatus);
      
      // Apply owner template replacements using shared utility method (DRY principle)
      processedTemplate = DefaultRequirement.applyOwnerTemplateReplacements(processedTemplate, ownerDetails);
      
      return processedTemplate;
        
    } catch (error) {
      // Fallback format if template fails  
      const title = requirement.title || requirement.name || 'Untitled';
      const uuid = requirement.uuid || '';
      const filename = `${uuid}.requirement.md`;
      const statusCheckbox = requirement.implemented ? 'x' : ' ';
      
      // For fallback, try to include ownerTimestamp if available
      const ownerDetails = DefaultRequirement.decodeOwnerDetailsFromScenario(requirement);
      const ownerTimestamp = ownerDetails.timestamp !== 'unknown' ? ` ${ownerDetails.timestamp}` : '';
      
      return `- [${statusCheckbox}]${ownerTimestamp} ${title} [requirement:uuid:${uuid}] ${filename}`;
    }
  }

  /**
   * Get implementation status from requirement
   */
  private getImplementationStatus(requirement: RequirementScenario): string {
    // Use explicit implementationStatus if available
    if (requirement.implementationStatus) {
      return requirement.implementationStatus;
    }
    
    // Map status to implementation status
    const status = requirement.status?.toString().toLowerCase();
    switch (status) {
      case 'completed':
        return 'completed';
      case 'in-progress':
      case 'in_progress':
        return 'in-progress';
      case 'cancelled':
        return 'cancelled';
      case 'pending':
      case 'created':
      default:
        return 'pending';
    }
  }
  
  /**
   * Get completion statistics
   */
  getCompletionStats(): {
    total: number;
    completed: number;
    pending: number;
    percentage: number;
  } {
    const total = this.requirements.length;
    const completed = this.requirements.filter(req => {
      // Handle both enum and string status values
      const status = req.status?.toString().toLowerCase();
      return status === 'completed' || status === 'done';
    }).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, pending, percentage };
  }
  
  /**
   * Apply overview-specific markdown formatting
   */
  formatMD(content: string, context: ViewContext): string {
    // Apply base formatting first
    let formatted = super.formatMD(content, context);
    
    // Overview-specific formatting
    // Ensure proper spacing around sections
    formatted = formatted.replace(/##\s*/g, '\n## ');
    formatted = formatted.replace(/###\s*/g, '\n### ');
    
    // Clean up any multiple newlines from template processing
    formatted = formatted.replace(/\n{4,}/g, '\n\n\n');
    
    return formatted.trim() + '\n';
  }
  
  /**
   * Generate and save overview to file
   */
  async saveOverview(outputPath: string): Promise<ViewResult> {
    try {
      const result = await this.generateOverview();
      
      if (!result.success || !result.content) {
        return result;
      }
      
      // Ensure directory exists
      const fs = await import('fs/promises');
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });
      
      // Write overview file
      await fs.writeFile(outputPath, result.content, 'utf-8');
      
      return {
        success: true,
        content: result.content,
        message: `Requirements overview saved to: ${outputPath}`
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Failed to save overview: ${(error as Error).message}`
      };
    }
  }
  
  /**
   * Helper to resolve template paths relative to views directory
   */
  protected resolveTemplatePath(relativePath: string): string {
    return path.join(__dirname, '../../../src/views/md', relativePath);
  }
}
