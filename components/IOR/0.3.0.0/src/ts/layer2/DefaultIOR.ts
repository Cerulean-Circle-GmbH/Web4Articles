/**
 * DefaultIOR - Radically simplified yet resilient IOR implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Extends Proxy for reactive controller integration
 * Follows Occam's razor principle while maintaining essential functionality
 */

import { IOR } from '../layer3/IOR.interface.js';

export class DefaultIOR extends Proxy implements IOR {
  private _data: IOR;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal data
    const initialData: IOR = {
      uuid: '',
      component: '',
      version: ''
    };

    // Proxy handler for reactive updates
    const handler = {
      set: (target: IOR, property: string | symbol, value: any) => {
        // Trigger onChange when IOR properties change
        const result = Reflect.set(target, property, value);
        this.onChange?.(property as keyof IOR, value);
        return result;
      },
      get: (target: IOR, property: string | symbol) => {
        return Reflect.get(target, property);
      }
    };

    super(target => handler, initialData);
    this._data = new Proxy(initialData, handler);
    
    // Return proxy instead of this for transparent property access
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          return (target as any)[prop];
        }
        return this._data[prop as keyof IOR];
      },
      set: (target, prop, value) => {
        if (prop in this._data) {
          this._data[prop as keyof IOR] = value;
          return true;
        }
        (target as any)[prop] = value;
        return true;
      }
    });
  }

  /**
   * Initialize from scenario data
   * Web4 Pattern: Scenario-based initialization
   */
  init(iorData: Partial<IOR>): this {
    this._data.uuid = iorData.uuid || '';
    this._data.component = iorData.component || '';
    this._data.version = iorData.version || '';
    this._data.location = iorData.location;
    this._data.endpoint = iorData.endpoint;
    return this;
  }

  /**
   * Get IOR properties (for IOR interface compliance)
   */
  get uuid(): string { return this._data.uuid; }
  set uuid(value: string) { this._data.uuid = value; }

  get component(): string { return this._data.component; }
  set component(value: string) { this._data.component = value; }

  get version(): string { return this._data.version; }
  set version(value: string) { this._data.version = value; }

  get location(): string | undefined { return this._data.location; }
  set location(value: string | undefined) { this._data.location = value; }

  get endpoint(): string | undefined { return this._data.endpoint; }
  set endpoint(value: string | undefined) { this._data.endpoint = value; }

  /**
   * Optional onChange callback for controller integration
   * Called when any IOR property changes
   */
  onChange?: (property: keyof IOR, value: any) => void;

  /**
   * Convert to URL string (simplified from complex implementations)
   * QUESTION: Should this use web4:// protocol or be configurable?
   */
  toURL(): string {
    const base = this.location || 'localhost';
    const path = this.endpoint || `/components/${this.component}/${this.uuid}`;
    return `web4://${base}${path}`;
  }

  /**
   * Validate IOR has required properties
   */
  validate(): boolean {
    return !!(this.uuid && this.component && this.version);
  }

  /**
   * Serialize to JSON for scenario storage
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
   * Static factory method for convenience
   */
  static create(uuid: string, component: string, version: string, location?: string): DefaultIOR {
    return new DefaultIOR().init({ uuid, component, version, location });
  }
}