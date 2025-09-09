/**
 * GitTextIOR - Git text protocol IOR implementation
 * Web4 principle: Single class per file, implements IOR interface
 * Purpose: Git-specific IOR for repository file references with position support
 */

import { IOR } from '../layer3/IOR.interface.js';

export class GitTextIOR implements IOR {
  readonly profile = {
    tag: 'git:text',
    protocol: 'git',
    transport: 'https',
    addressing: 'github'
  };

  constructor(
    private gitUrl: string,
    private startPos?: string,
    private endPos?: string
  ) {}

  getUrl(): string {
    return `ior:git:text:${this.gitUrl}`;
  }

  getType(): string {
    return 'git:text';
  }

  getFilename(): string {
    const match = this.gitUrl.match(/\/([^\/]+\.(?:ts|js|md|json))(?:#|$)/);
    return match?.[1] || 'unknown';
  }

  getRepository(): string {
    const match = this.gitUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
    return match?.[1] || 'unknown';
  }

  getCommitHash(): string | undefined {
    const match = this.gitUrl.match(/\/blob\/([a-f0-9]{7,40})\//);
    return match?.[1];
  }

  getBranch(): string {
    const match = this.gitUrl.match(/\/blob\/([^\/]+)\//);
    return match?.[1] || 'unknown';
  }

  getMasterFilePath(uuid: string): string {
    const uuidPath = uuid.split('').slice(0, 10).join('/').match(/.{1,2}/g)?.slice(0, 5).join('/') || '';
    return `/workspace/scenarios/index/${uuidPath}/${uuid}.master.file`;
  }

  getStartPos(): string | undefined {
    return this.startPos;
  }

  getEndPos(): string | undefined {
    return this.endPos;
  }
}