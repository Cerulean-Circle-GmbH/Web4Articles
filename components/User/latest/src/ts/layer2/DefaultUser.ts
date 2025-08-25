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

  /**
   * Fix scenario owner UUID in existing scenario files
   * Takes arbitrary scenario file path and corrects owner UUID to consistent user UUID
   */
  static async fixScenarioOwnerUUID(scenarioFilePath: string): Promise<{success: boolean, message: string, oldUUID?: string, newUUID?: string}> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      // Check if file exists
      if (!await fs.access(scenarioFilePath).then(() => true).catch(() => false)) {
        return {
          success: false,
          message: `Scenario file not found: ${scenarioFilePath}`
        };
      }

      // Read and parse scenario file
      const scenarioContent = await fs.readFile(scenarioFilePath, 'utf-8');
      let scenario;
      try {
        scenario = JSON.parse(scenarioContent);
      } catch (parseError) {
        return {
          success: false,
          message: `Invalid JSON in scenario file: ${scenarioFilePath}`
        };
      }

      // Check if scenario has owner field
      if (!scenario.owner) {
        return {
          success: false,
          message: `No owner field found in scenario: ${scenarioFilePath}`
        };
      }

      // Decode owner field
      let ownerObject;
      try {
        const ownerDecoded = Buffer.from(scenario.owner, 'base64').toString('utf-8');
        ownerObject = JSON.parse(ownerDecoded);
      } catch (decodeError) {
        return {
          success: false,
          message: `Failed to decode owner field in scenario: ${scenarioFilePath}`
        };
      }

      // Get the username from the owner object
      const username = ownerObject.user || 'unknown';
      const hostname = ownerObject.hostname || 'localhost';
      
      // Generate consistent UUID for this user
      const consistentUser = new DefaultUser(username, hostname);
      const oldUUID = ownerObject.uuid;
      const newUUID = consistentUser.uuid;

      // Check if already fixed
      if (oldUUID === newUUID) {
        return {
          success: true,
          message: `Scenario owner UUID already consistent: ${scenarioFilePath}`,
          oldUUID,
          newUUID
        };
      }

      // Update owner object with consistent UUID
      ownerObject.uuid = newUUID;
      ownerObject.utcTimestamp = new Date().toISOString(); // Update timestamp for fix audit

      // Re-encode owner field
      const updatedOwnerEncoded = Buffer.from(JSON.stringify(ownerObject)).toString('base64');
      scenario.owner = updatedOwnerEncoded;

      // Write updated scenario back to file
      await fs.writeFile(scenarioFilePath, JSON.stringify(scenario, null, 2), 'utf-8');

      return {
        success: true,
        message: `Successfully fixed owner UUID in scenario: ${scenarioFilePath}`,
        oldUUID,
        newUUID
      };

    } catch (error) {
      return {
        success: false,
        message: `Error fixing scenario owner UUID: ${(error as Error).message}`
      };
    }
  }

  /**
   * Batch fix multiple scenario files
   * Takes array of scenario file paths and fixes all owner UUIDs
   */
  static async batchFixScenarioOwnerUUIDs(scenarioFilePaths: string[]): Promise<{
    totalFiles: number,
    successfulFixes: number,
    alreadyFixed: number,
    errors: number,
    results: Array<{filePath: string, success: boolean, message: string, oldUUID?: string, newUUID?: string}>
  }> {
    const results = [];
    let successfulFixes = 0;
    let alreadyFixed = 0;
    let errors = 0;

    for (const filePath of scenarioFilePaths) {
      const result = await this.fixScenarioOwnerUUID(filePath);
      results.push({
        filePath,
        ...result
      });

      if (result.success) {
        if (result.oldUUID === result.newUUID) {
          alreadyFixed++;
        } else {
          successfulFixes++;
        }
      } else {
        errors++;
      }
    }

    return {
      totalFiles: scenarioFilePaths.length,
      successfulFixes,
      alreadyFixed,
      errors,
      results
    };
  }
}