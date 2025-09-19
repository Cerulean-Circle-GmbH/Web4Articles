/**
 * DefaultIOR - Simple IOR Implementation
 * 
 * Web4 principle: Implementation in layer2
 * Version 0.3.0.3: Dependency-free, no environment knowledge
 */

import { IOR } from '../layer3/IOR.interface.js';

export class DefaultIOR implements IOR {
  uuid: string = '';
  component: string = '';
  version: string = '';
  location?: string;
  endpoint?: string;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Empty constructor - no dependencies
  }

  /**
   * Web4 Pattern: Scenario initialization
   */
  init(data: Partial<IOR>): this {
    Object.assign(this, data);
    return this;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): IOR {
    return {
      uuid: this.uuid,
      component: this.component,
      version: this.version,
      location: this.location,
      endpoint: this.endpoint
    };
  }

  /**
   * Validate IOR completeness
   */
  isValid(): boolean {
    return !!(this.uuid && this.component && this.version);
  }
}