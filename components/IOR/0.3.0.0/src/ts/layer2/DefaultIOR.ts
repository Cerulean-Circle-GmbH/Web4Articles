/**
 * DefaultIOR - Radically simplified yet resilient IOR implementation
 * 
 * Web4 pattern: Empty constructor + scenario initialization
 * Extends Proxy for reactive controller integration
 * Follows Occam's razor principle while maintaining essential functionality
 */

import { IOR } from '../layer3/IOR.interface.js';

export class DefaultIOR implements IOR {
  private data: IOR;

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // Initialize with minimal data
    this.data = {
      uuid: '',
      component: '',
      version: ''
    };
    
    // Radical OOP: Return proxy-wrapped class instance
    return this.createProxy();
  }

  /**
   * Model getter/setter for proxy management (Decision 2a)
   */
  get model(): IOR { 
    return this.data; 
  }
  
  set model(value: IOR) { 
    this.data = value;
    this.onChange?.(this.data);
  }

  /**
   * Radical OOP: Class-based proxy with encapsulation (Decision 4c)
   */
  private createProxy(): DefaultIOR {
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
      this.data[prop as keyof IOR] = value;
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
      return this.data[prop as keyof IOR];
    }
    return (this as any)[prop];
  }

  /**
   * Initialize from scenario data
   * Web4 Pattern: Scenario-based initialization
   */
  init(iorData: Partial<IOR>): this {
    this.data.uuid = iorData.uuid || '';
    this.data.component = iorData.component || '';
    this.data.version = iorData.version || '';
    this.data.location = iorData.location;
    this.data.endpoint = iorData.endpoint;
    return this;
  }

  /**
   * Get IOR properties (for IOR interface compliance)
   */
  get uuid(): string { return this.data.uuid; }
  set uuid(value: string) { this.data.uuid = value; }

  get component(): string { return this.data.component; }
  set component(value: string) { this.data.component = value; }

  get version(): string { return this.data.version; }
  set version(value: string) { this.data.version = value; }

  get location(): string | undefined { return this.data.location; }
  set location(value: string | undefined) { this.data.location = value; }

  get endpoint(): string | undefined { return this.data.endpoint; }
  set endpoint(value: string | undefined) { this.data.endpoint = value; }

  /**
   * Optional onChange callback for controller integration
   * Radical OOP: Called with entire data object when changes occur
   */
  onChange?: (data: IOR) => void;

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
    return { ...this.data };
  }

  /**
   * Static factory method for convenience
   */
  static create(uuid: string, component: string, version: string, location?: string): DefaultIOR {
    return new DefaultIOR().init({ uuid, component, version, location });
  }
}