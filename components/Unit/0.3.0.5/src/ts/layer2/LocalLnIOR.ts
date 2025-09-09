/**
 * LocalLnIOR - Local filesystem symbolic link IOR implementation
 * Web4 principle: Single class per file, implements IOR interface
 * Purpose: Local filesystem IOR for symbolic link references
 */

import { IOR } from '../layer3/IOR.interface.js';

export class LocalLnIOR implements IOR {
  readonly profile = {
    tag: 'local:ln',
    protocol: 'local',
    transport: 'symlink',
    addressing: 'filesystem'
  };

  constructor(private filePath: string) {}

  getUrl(): string {
    return `ior:local:ln:file:${this.filePath}`;
  }

  getType(): string {
    return 'local:ln';
  }

  getPath(): string {
    return this.filePath.replace('file:', '');
  }

  async isSymbolicLink(): Promise<boolean> {
    try {
      const { lstat } = await import('fs/promises');
      const stats = await lstat(this.getPath());
      return stats.isSymbolicLink();
    } catch {
      return false;
    }
  }

  async exists(): Promise<boolean> {
    try {
      const { access } = await import('fs/promises');
      await access(this.getPath());
      return true;
    } catch {
      return false;
    }
  }

  async getTargetPath(): Promise<string | null> {
    try {
      const { readlink } = await import('fs/promises');
      return await readlink(this.getPath());
    } catch {
      return null;
    }
  }
}