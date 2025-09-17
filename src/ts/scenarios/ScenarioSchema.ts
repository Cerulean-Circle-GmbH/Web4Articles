/**
 * Schema definition and validation for Web4Articles scenario files
 * Developer role with Quality/Testing focus - Extended session
 */

export interface ScenarioFile {
  IOR: {
    uuid: string;
    component: string;
    version: string;
  };
  owner: string; // Base64 encoded owner information
  model: {
    uuid: string;
    name: string;
    title: string;
    description: string;
  };
  unitIndex: {
    uuid: string;
    indexPath: string;
    symlinkPaths: string[];
    createdAt: string; // ISO 8601 timestamp
    updatedAt: string; // ISO 8601 timestamp
  };
}

export interface OwnerData {
  user: string;
  hostname: string;
  utcTimestamp: string;
  uuid: string;
}

export class ScenarioValidator {
  private static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private static isValidISOTimestamp(timestamp: string): boolean {
    try {
      const date = new Date(timestamp);
      return date.toISOString() === timestamp;
    } catch {
      return false;
    }
  }

  private static decodeOwner(encodedOwner: string): OwnerData | null {
    try {
      const decoded = Buffer.from(encodedOwner, 'base64').toString('utf-8');
      const ownerData = JSON.parse(decoded) as OwnerData;
      return ownerData;
    } catch {
      return null;
    }
  }

  public static validateScenario(scenario: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required top-level properties
    const requiredTopLevel = ['IOR', 'owner', 'model', 'unitIndex'];
    for (const prop of requiredTopLevel) {
      if (!scenario[prop]) {
        errors.push(`Missing required property: ${prop}`);
      }
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    // Validate IOR section
    const { IOR } = scenario;
    if (!this.isValidUUID(IOR.uuid)) {
      errors.push(`Invalid IOR.uuid format: ${IOR.uuid}`);
    }
    if (!IOR.component || typeof IOR.component !== 'string') {
      errors.push('IOR.component must be a non-empty string');
    }
    if (!IOR.version || typeof IOR.version !== 'string') {
      errors.push('IOR.version must be a non-empty string');
    }

    // Validate owner (base64 encoded JSON)
    const ownerData = this.decodeOwner(scenario.owner);
    if (!ownerData) {
      errors.push('Invalid owner data - must be valid base64 encoded JSON');
    } else {
      if (!ownerData.user || !ownerData.hostname || !ownerData.utcTimestamp || !ownerData.uuid) {
        errors.push('Owner data missing required fields: user, hostname, utcTimestamp, uuid');
      }
      if (!this.isValidUUID(ownerData.uuid)) {
        errors.push(`Invalid owner.uuid format: ${ownerData.uuid}`);
      }
    }

    // Validate model section
    const { model } = scenario;
    if (!this.isValidUUID(model.uuid)) {
      errors.push(`Invalid model.uuid format: ${model.uuid}`);
    }
    if (!model.name || typeof model.name !== 'string') {
      errors.push('model.name must be a non-empty string');
    }
    if (!model.title || typeof model.title !== 'string') {
      errors.push('model.title must be a non-empty string');
    }
    if (!model.description || typeof model.description !== 'string') {
      errors.push('model.description must be a non-empty string');
    }

    // UUID consistency check
    if (IOR.uuid !== model.uuid) {
      errors.push(`UUID mismatch: IOR.uuid (${IOR.uuid}) !== model.uuid (${model.uuid})`);
    }

    // Validate unitIndex section
    const { unitIndex } = scenario;
    if (!this.isValidUUID(unitIndex.uuid)) {
      errors.push(`Invalid unitIndex.uuid format: ${unitIndex.uuid}`);
    }
    if (!unitIndex.indexPath || typeof unitIndex.indexPath !== 'string') {
      errors.push('unitIndex.indexPath must be a non-empty string');
    }
    if (!Array.isArray(unitIndex.symlinkPaths)) {
      errors.push('unitIndex.symlinkPaths must be an array');
    }
    if (!this.isValidISOTimestamp(unitIndex.createdAt)) {
      errors.push(`Invalid unitIndex.createdAt timestamp: ${unitIndex.createdAt}`);
    }
    if (!this.isValidISOTimestamp(unitIndex.updatedAt)) {
      errors.push(`Invalid unitIndex.updatedAt timestamp: ${unitIndex.updatedAt}`);
    }

    // Triple UUID consistency check
    if (IOR.uuid !== unitIndex.uuid) {
      errors.push(`UUID mismatch: IOR.uuid (${IOR.uuid}) !== unitIndex.uuid (${unitIndex.uuid})`);
    }

    // Path consistency check
    if (unitIndex.indexPath && !unitIndex.indexPath.includes(unitIndex.uuid)) {
      errors.push(`Index path doesn't contain UUID: ${unitIndex.indexPath} missing ${unitIndex.uuid}`);
    }

    return { valid: errors.length === 0, errors };
  }

  public static validateAllScenarios(scenarioFiles: { path: string; content: any }[]): {
    totalFiles: number;
    validFiles: number;
    invalidFiles: { path: string; errors: string[] }[];
    summary: string;
  } {
    const invalidFiles: { path: string; errors: string[] }[] = [];
    let validFiles = 0;

    for (const file of scenarioFiles) {
      const validation = this.validateScenario(file.content);
      if (validation.valid) {
        validFiles++;
      } else {
        invalidFiles.push({ path: file.path, errors: validation.errors });
      }
    }

    const summary = `${validFiles}/${scenarioFiles.length} scenario files valid. ${invalidFiles.length} files have errors.`;
    
    return {
      totalFiles: scenarioFiles.length,
      validFiles,
      invalidFiles,
      summary
    };
  }
}