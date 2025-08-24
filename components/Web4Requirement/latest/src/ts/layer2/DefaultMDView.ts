import { MDView, ViewContext, ViewResult, TemplateProcessor } from '../layer3/View.ts';
import { DefaultTemplateProcessor } from './DefaultTemplateProcessor.ts';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Default Markdown View implementation
 * Maximum independence from template content - just processes templates with context
 */
export class DefaultMDView implements MDView {
  protected templateProcessor: TemplateProcessor;
  protected templatePath?: string;

  constructor(templatePath?: string) {
    this.templateProcessor = new DefaultTemplateProcessor();
    this.templatePath = templatePath;
  }

  async render(context: ViewContext): Promise<ViewResult> {
    return this.renderMD(context);
  }

  async renderMD(context: ViewContext): Promise<ViewResult> {
    try {
      if (!this.templatePath) {
        return {
          success: false,
          error: 'No template path specified for rendering'
        };
      }

      // Load template
      const template = await this.templateProcessor.loadTemplate(this.templatePath);
      
      // Process template with context
      const content = this.templateProcessor.processTemplate(template, context);
      
      // Apply markdown-specific formatting
      const formattedContent = this.formatMD(content, context);

      return {
        success: true,
        content: formattedContent,
        message: `MD rendered successfully from ${this.templatePath}`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to render MD: ${(error as Error).message}`
      };
    }
  }

  formatMD(content: string, context: ViewContext): string {
    // Default MD formatting - can be overridden by subclasses
    // Remove extra blank lines, ensure proper line endings
    return content
      .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
      .trim() + '\n';  // Ensure file ends with newline
  }

  getTemplatePath(): string | undefined {
    return this.templatePath;
  }

  setTemplatePath(path: string): void {
    this.templatePath = path;
  }

  /**
   * Helper method to resolve template paths relative to component structure
   */
  protected resolveTemplatePath(relativePath: string): string {
    return path.join(__dirname, '../../../src/views/md', relativePath);
  }
}
