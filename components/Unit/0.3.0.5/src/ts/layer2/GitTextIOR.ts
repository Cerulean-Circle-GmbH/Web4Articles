/**
 * GitTextIOR - Specialized IOR implementation for git text references
 * Web4 pattern: Empty constructor + scenario initialization + hibernation
 * Architecture: Extends IOR for specialized git text reference handling
 * Purpose: Handle git URL references with IOR text format: ior:git:text:giturl
 */

import { BaseIOR } from '../layer3/BaseIOR.interface.js';
import { GitPositioning } from '../layer3/GitPositioning.interface.js';
import { GitTextIORScenario } from '../layer3/GitTextIORScenario.interface.js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { promises as fs } from 'fs';
import { webcrypto as crypto } from 'crypto';

export class GitTextIOR implements BaseIOR {
  private model: {
    uuid: string;
    gitUrl: string;
    iorFormat: string;
    positioning: GitPositioning;
    createdAt: string;
    updatedAt: string;
  };

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      gitUrl: '',
      iorFormat: '',
      positioning: { type: 'line-column' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  init(scenario: GitTextIORScenario): this {
    if (scenario.model) {
      this.model = scenario.model;
    }
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  async toScenario(): Promise<GitTextIORScenario> {
    // ✅ DYNAMIC VERSION: Use getComponentVersion() instead of hardcoded
    const componentVersion = await this.getComponentVersion();
    const componentName = await this.getComponentName();
    
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: componentName,
      version: componentVersion
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: componentName,
        version: componentVersion
      },
      owner: ownerData,
      model: this.model
    };
  }

  validate(): boolean {
    try {
      // Validate GitHub URL format
      const githubPattern = /^https?:\/\/github\.com(:\d+)?\/[^\/]+\/[^\/]+\/blob\/[^\/]+\/.*#L\d+/;
      if (!githubPattern.test(this.model.gitUrl)) {
        return false;
      }

      // Validate positioning format
      if (this.model.positioning.type === 'line-column') {
        return this.model.positioning.startLine !== undefined && this.model.positioning.startColumn !== undefined;
      } else if (this.model.positioning.type === 'character') {
        return this.model.positioning.startChar !== undefined;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  toString(): string {
    return this.model.iorFormat;
  }

  // GitTextIOR specific methods
  parse(gitUrl: string): string {
    this.model.gitUrl = gitUrl;
    this.model.positioning = this.extractPositioning(gitUrl);
    this.model.iorFormat = this.format(gitUrl);
    this.model.updatedAt = new Date().toISOString();
    return this.model.iorFormat;
  }

  format(gitUrl: string): string {
    // Format: ior:git:text:giturl
    return `ior:git:text:${gitUrl}`;
  }

  extractPositioning(gitUrl: string): GitPositioning {
    try {
      // Extract positioning from URL fragment (after #L)
      const fragmentMatch = gitUrl.match(/#L(.+)$/);
      if (!fragmentMatch) {
        return { type: 'line-column' };
      }

      const fragment = fragmentMatch[1];

      // Check for line:column format (e.g., L42:15-67:23)
      const lineColumnMatch = fragment.match(/^(\d+):(\d+)-(\d+):(\d+)$/);
      if (lineColumnMatch) {
        return {
          type: 'line-column',
          startLine: parseInt(lineColumnMatch[1]),
          startColumn: parseInt(lineColumnMatch[2]),
          endLine: parseInt(lineColumnMatch[3]),
          endColumn: parseInt(lineColumnMatch[4])
        };
      }

      // Check for character range format (e.g., L1250-1890)
      const charRangeMatch = fragment.match(/^(\d+)-(\d+)$/);
      if (charRangeMatch) {
        return {
          type: 'character',
          startChar: parseInt(charRangeMatch[1]),
          endChar: parseInt(charRangeMatch[2])
        };
      }

      // Single line format (e.g., L42)
      const singleLineMatch = fragment.match(/^(\d+)$/);
      if (singleLineMatch) {
        return {
          type: 'line-column',
          startLine: parseInt(singleLineMatch[1]),
          startColumn: 1
        };
      }

      return { type: 'line-column' };
    } catch {
      return { type: 'line-column' };
    }
  }

  // Helper methods
  getGitUrl(): string {
    return this.model.gitUrl;
  }

  getPositioning(): GitPositioning {
    return this.model.positioning;
  }

  /**
   * Get component version dynamically from package.json
   * Web4 pattern: Dynamic version detection eliminates hardcoded versions
   */
  private async getComponentVersion(): Promise<string> {
    try {
      const currentDir = path.dirname(fileURLToPath(import.meta.url));
      const packageJsonPath = path.resolve(currentDir, '../../../package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return packageJson.version || '0.3.0.5';
    } catch (error) {
      return '0.3.0.5'; // Fallback version
    }
  }

  /**
   * Get component name dynamically from package.json
   * Web4 pattern: Dynamic component detection
   */
  private async getComponentName(): Promise<string> {
    try {
      const currentDir = path.dirname(fileURLToPath(import.meta.url));
      const packageJsonPath = path.resolve(currentDir, '../../../package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return packageJson.name?.split('/').pop()?.replace('@web4/', '') || 'GitTextIOR';
    } catch (error) {
      return 'GitTextIOR'; // Fallback name
    }
  }
}