/**
 * DefaultModel - Unified model implementation with reactive controller integration
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Extends Proxy for onChange controller interaction
 * Occam's razor: Single model class for all components
 */

import { Model } from '../layer3/Model.interface.js';

export class DefaultModel implements Model {
  private data: Model;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal required data
    this.data = {
      uuid: '',
      name: '',
      description: ''
    };
    
    // Radical OOP: Return proxy-wrapped class instance
    return this.createProxy();
  }

  /**
   * Model getter/setter for proxy management (Decision 2a)
   */
  get model(): Model { 
    return this.data; 
  }
  
  set model(value: Model) { 
    this.data = value;
    this.onChange?.(this.data);
  }

  /**
   * Radical OOP: Class-based proxy with encapsulation (Decision 4c)
   */
  private createProxy(): DefaultModel {
    return new Proxy(this, {
      set: (target, prop, value) => this.handlePropertySet(prop, value),
      get: (target, prop) => this.handlePropertyGet(prop)
    });
  }

  /**
   * Radical OOP: Class method handles property setting
   */
  private handlePropertySet(prop: string | symbol, value: any): boolean {
    if (prop in this.data) {
      (this.data as any)[prop] = value;
      this.onChange?.(this.data);
      return true;
    }
    if (prop in this) {
      (this as any)[prop] = value;
      return true;
    }
    return false;
  }

  /**
   * Radical OOP: Class method handles property getting
   */
  private handlePropertyGet(prop: string | symbol): any {
    if (prop in this.data) {
      return (this.data as any)[prop];
    }
    return (this as any)[prop];
  }

  /**
   * Initialize from scenario model data
   * Web4 Pattern: Scenario-based initialization
   */
  init(modelData: Partial<Model>): this {
    // Copy all properties from scenario model
    Object.assign(this.data, modelData);
    return this;
  }

  /**
   * Get model properties (required interface compliance)
   */
  get uuid(): string { return this.data.uuid; }
  set uuid(value: string) { this.data.uuid = value; }

  get name(): string { return this.data.name; }
  set name(value: string) { this.data.name = value; }

  get description(): string { return this.data.description; }
  set description(value: string) { this.data.description = value; }

  /**
   * Optional onChange callback for controller integration
   * Radical OOP: Called with entire data object when changes occur
   */
  onChange?: (data: Model) => void;

  /**
   * Convert to plain object for scenario serialization
   */
  toJSON(): Model {
    return { ...this.data };
  }

  /**
   * Validate model has required properties
   */
  validate(): boolean {
    return !!(this.uuid && this.name && this.description);
  }

  /**
   * Static factory method for convenience
   */
  static create(uuid: string, name: string, description: string, extra?: Record<string, any>): DefaultModel {
    const model = new DefaultModel().init({ uuid, name, description, ...extra });
    return model;
  }
}