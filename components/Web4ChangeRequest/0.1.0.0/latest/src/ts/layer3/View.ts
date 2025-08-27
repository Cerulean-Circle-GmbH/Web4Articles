/**
 * Web4 View Layer Interfaces
 * Maximum independence between template logic and template content
 */

export interface ViewContext {
  [key: string]: any;
}

export interface ViewResult {
  success: boolean;
  content?: string;
  message?: string;
  error?: string;
}

/**
 * Base View interface - format-agnostic rendering
 */
export interface View {
  /**
   * Render content using provided context
   */
  render(context: ViewContext): Promise<ViewResult>;
  
  /**
   * Get template path (if template-based)
   */
  getTemplatePath?(): string | undefined;
  
  /**
   * Set template path (if template-based)
   */
  setTemplatePath?(path: string): void;
}

/**
 * Markdown-specific view interface
 */
export interface MDView extends View {
  /**
   * Render markdown content
   */
  renderMD(context: ViewContext): Promise<ViewResult>;
  
  /**
   * Apply markdown-specific formatting
   */
  formatMD(content: string, context: ViewContext): string;
}

/**
 * Template processing interface
 */
export interface TemplateProcessor {
  /**
   * Process template with context variables
   */
  processTemplate(template: string, context: ViewContext): string;
  
  /**
   * Load template from file
   */
  loadTemplate(templatePath: string): Promise<string>;
}
