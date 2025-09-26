import { ViewContext, ViewResult } from '../layer3/View.js';
import { DefaultMDView } from './DefaultMDView.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Specialized MD Overview View - extends DefaultMDView only for specific overview needs
 * Handles multiple items and item template processing
 */
export class MDOverview extends DefaultMDView {
  private itemTemplatePath?: string;

  constructor(overviewTemplatePath?: string, itemTemplatePath?: string) {
    super(overviewTemplatePath);
    this.itemTemplatePath = itemTemplatePath;
  }

  async renderMD(context: ViewContext): Promise<ViewResult> {
    try {
      // Ensure we have both templates for overview
      if (!this.templatePath || !this.itemTemplatePath) {
        return {
          success: false,
          error: 'Both overview and item template paths required for overview rendering'
        };
      }

      // Load both templates
      const overviewTemplate = await this.templateProcessor.loadTemplate(this.templatePath);
      const itemTemplate = await this.templateProcessor.loadTemplate(this.itemTemplatePath);

      // Process items if provided
      const itemsList = await this.processItems(itemTemplate, context);
      
      // Create final context with processed items
      const finalContext = {
        ...context,
        itemsList,
        timestamp: new Date().toISOString(),
        totalCount: this.getItemCount(context)
      };

      // Process overview template
      const content = this.templateProcessor.processTemplate(overviewTemplate, finalContext);
      const formattedContent = this.formatMD(content, finalContext);

      return {
        success: true,
        content: formattedContent,
        message: `Overview rendered with ${finalContext.totalCount} items`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to render overview: ${(error as Error).message}`
      };
    }
  }

  private async processItems(itemTemplate: string, context: ViewContext): Promise<string> {
    const items = context.items || context.requirementFiles || [];
    let itemsList = '';

    for (const item of items) {
      // Handle different item formats
      let itemContext: ViewContext;
      
      if (typeof item === 'string') {
        // If item is a filename, extract basic info
        itemContext = await this.extractItemContextFromFilename(item, context);
      } else if (typeof item === 'object') {
        // If item is already an object, use directly
        itemContext = item;
      } else {
        continue; // Skip invalid items
      }

      // Process item template
      const processedItem = this.templateProcessor.processTemplate(itemTemplate, itemContext);
      itemsList += processedItem + '\n';
    }

    return itemsList.trim();
  }

  private async extractItemContextFromFilename(filename: string, context: ViewContext): Promise<ViewContext> {
    const uuid = filename.replace('.requirement.md', '');
    let title = filename;
    let createdDate = 'Unknown';

    // Try to extract title from file content if outputPath is provided
    if (context.outputPath) {
      try {
        const filePath = path.join(context.outputPath, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Extract title from MD content (first # heading)
        const titleMatch = content.match(/^# (.+)$/m);
        if (titleMatch) {
          title = titleMatch[1];
        }
        
        // Extract creation date if available
        const dateMatch = content.match(/\*\*Created:\*\* (.+)$/m);
        if (dateMatch) {
          createdDate = new Date(dateMatch[1]).toLocaleDateString();
        }
      } catch (error) {
        // File reading failed, use filename as title
      }
    }

    return {
      title,
      filename,
      uuid,
      createdDate
    };
  }

  private getItemCount(context: ViewContext): number {
    const items = context.items || context.requirementFiles || [];
    return Array.isArray(items) ? items.length : 0;
  }

  setItemTemplatePath(path: string): void {
    this.itemTemplatePath = path;
  }

  getItemTemplatePath(): string | undefined {
    return this.itemTemplatePath;
  }
}
