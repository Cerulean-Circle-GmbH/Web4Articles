/**
 * Layer 5: UX/UI - ChangeRequest Overview View
 * Generates overview views for collections of changeRequests
 */

import { DefaultMDView } from '../layer2/DefaultMDView.js';
import { ViewContext, ViewResult } from '../layer3/View.js';
import { ChangeRequestScenario } from '../layer3/ChangeRequest.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ChangeRequest Overview View - extends DefaultMDView for template-based rendering
 * Generates overview markdown files for changeRequest collections
 */
export class ChangeRequestOverview extends DefaultMDView {
  private changeRequests: ChangeRequestScenario[] = [];
  private overviewTitle: string = 'ChangeRequests Overview';
  
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
   * Add changeRequest to the overview
   */
  addChangeRequest(changeRequest: ChangeRequestScenario): void {
    this.changeRequests.push(changeRequest);
  }
  
  /**
   * Set changeRequests collection
   */
  setChangeRequests(changeRequests: ChangeRequestScenario[]): void {
    this.changeRequests = changeRequests;
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
    const totalCount = this.changeRequests.length;
    const timestamp = new Date().toISOString();
    
    // Generate items list using item template
    const sortedChangeRequests = this.changeRequests
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()); // Newest first
    
    const itemsListPromises = sortedChangeRequests.map(req => this.generateItemEntry(req));
    const itemsListArray = await Promise.all(itemsListPromises);
    const itemsList = itemsListArray.join('\n');
    
    return {
      title: this.overviewTitle,
      timestamp,
      totalCount,
      itemsList,
      changeRequests: this.changeRequests
    };
  }
  
  /**
   * Generate single item entry using item template
   */
  private async generateItemEntry(changeRequest: ChangeRequestScenario): Promise<string> {
    try {
      const itemTemplatePath = this.resolveTemplatePath('item.view.md');
      const fs = await import('fs/promises');
      const itemTemplate = await fs.readFile(itemTemplatePath, 'utf-8');
      
      const filename = `${changeRequest.uuid}.changeRequest.md`;
      const implementationStatus = this.getImplementationStatus(changeRequest);
      const statusCheckbox = implementationStatus === 'completed' ? 'x' : ' ';
      
      return itemTemplate
        .replace(/{{title}}/g, changeRequest.title || changeRequest.name || 'Untitled')
        .replace(/{{filename}}/g, filename)
        .replace(/{{uuid}}/g, changeRequest.uuid || '')
        .replace(/{{statusCheckbox}}/g, statusCheckbox)
        .replace(/{{implementationStatus}}/g, implementationStatus);
        
    } catch (error) {
      // Fallback format if template fails
      const title = changeRequest.title || changeRequest.name || 'Untitled';
      const uuid = changeRequest.uuid || '';
      const filename = `${uuid}.changeRequest.md`;
      const statusCheckbox = changeRequest.implemented ? 'x' : ' ';
      
      return `- [${statusCheckbox}] ${title} [changeRequest:uuid:${uuid}] ${filename}`;
    }
  }

  /**
   * Get implementation status from changeRequest
   */
  private getImplementationStatus(changeRequest: ChangeRequestScenario): string {
    // Use explicit implementationStatus if available
    if (changeRequest.implementationStatus) {
      return changeRequest.implementationStatus;
    }
    
    // Map status to implementation status
    const status = changeRequest.status?.toString().toLowerCase();
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
    const total = this.changeRequests.length;
    const completed = this.changeRequests.filter(req => {
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
        message: `ChangeRequests overview saved to: ${outputPath}`
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
