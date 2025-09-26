import { TemplateProcessor, ViewContext } from '../layer3/View.js';
import * as fs from 'fs/promises';

/**
 * Default template processor - maximum independence from template content
 */
export class DefaultTemplateProcessor implements TemplateProcessor {
  
  processTemplate(template: string, context: ViewContext): string {
    let result = template;
    
    // Process all context variables with {{variable}} syntax
    for (const [key, value] of Object.entries(context)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      const stringValue = this.convertToString(value);
      result = result.replace(placeholder, stringValue);
    }
    
    return result;
  }

  async loadTemplate(templatePath: string): Promise<string> {
    try {
      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to load template from ${templatePath}: ${(error as Error).message}`);
    }
  }

  private convertToString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }
}
