/**
 * DefaultGitTextIOR - Git Text Interoperable Object Reference implementation
 * Web4 pattern: Empty constructor + scenario initialization + hibernation
 * Purpose: Handle git URL references with IOR text format: ior:git:text:giturl
 */

import { GitTextIOR, GitPositioning, GitTextIORScenario } from '../layer3/GitTextIOR.interface.js';

export class DefaultGitTextIOR implements GitTextIOR {
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

  parse(gitUrl: string): string {
    this.model.gitUrl = gitUrl;
    this.model.positioning = this.extractPositioning(gitUrl);
    this.model.iorFormat = this.format(gitUrl);
    this.model.updatedAt = new Date().toISOString();
    return this.model.iorFormat;
  }

  format(gitUrl: string): string {
    // Format: ior:git:text:giturl
    // Example: ior:git:text:http://github.com:port/user/repo/blob/branch/file.ts#L42:15-67:23
    return `ior:git:text:${gitUrl}`;
  }

  validate(gitUrl: string): boolean {
    try {
      // Validate GitHub URL format
      const githubPattern = /^https?:\/\/github\.com(:\d+)?\/[^\/]+\/[^\/]+\/blob\/[^\/]+\/.*#L\d+/;
      if (!githubPattern.test(gitUrl)) {
        return false;
      }

      // Validate positioning format
      const positioning = this.extractPositioning(gitUrl);
      if (positioning.type === 'line-column') {
        return positioning.startLine !== undefined && positioning.startColumn !== undefined;
      } else if (positioning.type === 'character') {
        return positioning.startChar !== undefined;
      }
      
      return false;
    } catch {
      return false;
    }
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

  async toScenario(): Promise<GitTextIORScenario> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'GitTextIOR',
      version: '0.3.0.4'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'GitTextIOR',
        version: '0.3.0.4'
      },
      owner: ownerData,
      model: this.model
    };
  }

  // Helper methods for git URL handling
  getIORFormat(): string {
    return this.model.iorFormat;
  }

  getGitUrl(): string {
    return this.model.gitUrl;
  }

  getPositioning(): GitPositioning {
    return this.model.positioning;
  }
}