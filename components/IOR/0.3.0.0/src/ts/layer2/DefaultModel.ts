/**
 * DefaultModel - Unified model implementation with reactive controller integration
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Extends Proxy for onChange controller interaction
 * Occam's razor: Single model class for all components
 */

import { Model } from '../layer3/Model.interface.js';

export class DefaultModel extends Proxy implements Model {
  private _data: Model;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal required data
    const initialData: Model = {
      uuid: '',
      name: '',
      description: ''
    };

    // Proxy handler for reactive controller onChange
    const handler = {
      set: (target: Model, property: string | symbol, value: any) => {
        // Update the target
        const result = Reflect.set(target, property, value);
        
        // Trigger onChange callback if controller is connected
        this.onChange?.(property as string, value, target);
        
        return result;
      },
      get: (target: Model, property: string | symbol) => {
        return Reflect.get(target, property);
      }
    };

    super(target => handler, initialData);
    this._data = new Proxy(initialData, handler);

    // Return proxy for transparent property access
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          return (target as any)[prop];
        }
        return this._data[prop as keyof Model];
      },
      set: (target, prop, value) => {
        if (prop in this._data || typeof prop === 'string') {
          (this._data as any)[prop] = value;
          return true;
        }
        (target as any)[prop] = value;
        return true;
      }
    });
  }

  /**
   * Initialize from scenario model data
   * Web4 Pattern: Scenario-based initialization
   */
  init(modelData: Partial<Model>): this {
    // Copy all properties from scenario model
    Object.assign(this._data, modelData);
    return this;
  }

  /**
   * Get model properties (required interface compliance)
   */
  get uuid(): string { return this._data.uuid; }
  set uuid(value: string) { this._data.uuid = value; }

  get name(): string { return this._data.name; }
  set name(value: string) { this._data.name = value; }

  get description(): string { return this._data.description; }
  set description(value: string) { this._data.description = value; }

  /**
   * Optional onChange callback for controller integration
   * Called when any model property changes
   */
  onChange?: (property: string, value: any, model: Model) => void;

  /**
   * Convert to plain object for scenario serialization
   */
  toJSON(): Model {
    return { ...this._data };
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