import { createHash } from 'crypto';
import { IUser } from '../layer3/IUser';

export class DefaultUser implements IUser {
  public readonly uuid: string;
  public readonly username: string;
  public readonly hostname: string;

  constructor(username?: string, hostname?: string) {
    this.username = username || process.env.USER || 'unknown';
    this.hostname = hostname || process.env.HOSTNAME || 'localhost';
    this.uuid = this.getUserUUID(this.username);
  }

  /**
   * Generate a deterministic UUID v4 based on username
   * This ensures the same user always gets the same UUID
   */
  getUserUUID(username: string): string {
    // Create a hash of the username
    const hash = createHash('sha256').update(`user:${username}`).digest('hex');
    
    // Format as UUID v4 (but deterministic, not random)
    // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx where y is 8, 9, a, or b
    const uuid = [
      hash.substring(0, 8),
      hash.substring(8, 12),
      '4' + hash.substring(13, 16), // Version 4
      ((parseInt(hash.substring(16, 17), 16) & 0x3) | 0x8).toString(16) + hash.substring(17, 20), // Variant
      hash.substring(20, 32)
    ].join('-');
    
    return uuid;
  }

  getScenario(): any {
    const utcTimestamp = new Date().toISOString();
    
    return {
      IOR: {
        uuid: this.uuid,
        component: 'User',
        version: 'latest'
      },
      owner: Buffer.from(JSON.stringify({
        user: 'system',
        hostname: 'system',
        utcTimestamp,
        uuid: this.getUserUUID('system') // System creates user scenarios
      })).toString('base64'),
      model: {
        uuid: this.uuid,
        username: this.username,
        hostname: this.hostname
      }
    };
  }
  
  /**
   * Static method to get consistent owner object for any component
   */
  static getOwnerObject(username?: string, hostname?: string): any {
    const user = new DefaultUser(username, hostname);
    const utcTimestamp = new Date().toISOString();
    
    return {
      user: user.username,
      hostname: user.hostname,
      utcTimestamp,
      uuid: user.uuid // This will be consistent for the same username
    };
  }
}