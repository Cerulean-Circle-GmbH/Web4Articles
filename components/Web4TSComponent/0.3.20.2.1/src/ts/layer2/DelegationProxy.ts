/**
 * DelegationProxy - Dynamic method delegation using Proxy pattern
 * 
 * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
 * 
 * Eliminates DRY violation of explicit delegation methods.
 * 
 * Radical OOP Principle: If a method doesn't exist on the component,
 * automatically delegate it to Web4TSComponent with proper context.
 * 
 * Web4 Pattern: Class-based Proxy with model state, not functional helpers!
 */

import { Component } from '../layer3/Component.interface.js';
import { Model } from '../layer3/Model.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';

/**
 * DelegationProxy Model
 * Radical OOP: State lives in model, not in variables!
 */
interface DelegationProxyModel extends Model {
  target: Component;           // The component we're wrapping
  web4ts?: any;               // Lazy-loaded Web4TSComponent
  name: string;               // Model interface requirement
  origin: string;             // Model interface requirement
  definition: string;         // Model interface requirement
}

/**
 * DelegationProxy - Radical OOP Proxy implementation
 * 
 * Empty constructor + init() + model-driven delegation
 */
export class DelegationProxy<T extends Component> implements Component {
  model!: DelegationProxyModel;  // Initialized in init()
  
  /**
   * Empty constructor (Radical OOP)
   */
  constructor() {
    // Empty - all initialization in init()
  }
  
  /**
   * Initialize with scenario (Radical OOP)
   * Note: For Proxy use, call setTarget() after init()
   */
  init(scenario?: Scenario<DelegationProxyModel>): this {
    // ✅ Radical OOP: Initialize model in init(), not constructor!
    this.model = {
      uuid: crypto.randomUUID(),
      target: null as any, // Set via setTarget()
      name: 'DelegationProxy',
      origin: 'dynamic',
      definition: 'Proxy wrapper for automatic method delegation'
    };
    
    // Standard scenario initialization (if ever needed)
    if (scenario) {
      // Could extract target from scenario if provided
    }
    return this;
  }
  
  /**
   * Set target component and load Web4TSComponent for method discovery
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * CRITICAL: Must await loading for getDelegationTarget() to work immediately
   */
  async setTarget(target: T): Promise<this> {
    this.model.target = target;
    
    // Load Web4TSComponent synchronously for immediate getDelegationTarget() access
    await this.getWeb4TS();
    
    return this;
  }
  
  /**
   * Lazy-load Web4TSComponent (Radical OOP)
   */
  private async getWeb4TS(): Promise<any> {
    if (this.model.web4ts) return this.model.web4ts;
    
    this.model.web4ts = await (this.model.target as any).getWeb4TSComponent();
    return this.model.web4ts;
  }
  
  /**
   * Set delegation context in Web4TSComponent (Radical OOP)
   */
  private setDelegationContext(): void {
    const web4ts = this.model.web4ts;
    const target = this.model.target;
    const targetModel = target.model as any;
    
    // ✅ Radical OOP: Set delegation context
    web4ts.model.context = target;
    
    // ✅ Radical OOP: Set display properties (model-driven)
    web4ts.model.displayName = targetModel.component || 'Unknown';
    web4ts.model.displayVersion = targetModel.version || '0.0.0.0';
    web4ts.model.isDelegation = true;
    web4ts.model.delegationInfo = `via Web4TSComponent v${web4ts.model.version.toString()}`;
    
    // ✅ Radical OOP: Set test isolation context (model-driven)
    if (targetModel.projectRoot) {
      const match = targetModel.projectRoot.match(/components\/([^/]+)\/([^/]+)\/test\/data/);
      if (match) {
        web4ts.model.testIsolationContext = `${match[1]} v${match[2]}`;
        web4ts.model.isTestIsolation = true;
      } else {
        web4ts.model.testIsolationContext = undefined;
        web4ts.model.isTestIsolation = false;
      }
    }
  }
  
  /**
   * Delegate method call to Web4TSComponent (Radical OOP)
   */
  private async delegateMethod(methodName: string, ...args: any[]): Promise<Component> {
    const web4ts = await this.getWeb4TS();
    this.setDelegationContext();
    
    // Call delegated method
    if (typeof web4ts[methodName] === 'function') {
      await web4ts[methodName](...args);
    } else {
      throw new Error(`Method '${methodName}' not found on Web4TSComponent`);
    }
    
    // Return target for chaining (Radical OOP)
    return this.model.target;
  }
  
  /**
   * Create Proxy wrapper (Radical OOP factory method)
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   */
  toProxy(): T {
    const self = this;
    
    return new Proxy(this.model.target, {
      get(target: T, prop: string | symbol): any {
        const propName = typeof prop === 'symbol' ? prop.toString() : prop;
        
        // 0. Check for Promise-like properties (don't delegate these!)
        // This prevents `await proxy` from trying to delegate `.then()`
        if (propName === 'then' || propName === 'catch' || propName === 'finally') {
          return undefined;
        }
        
        // 1. Check DelegationProxy's own methods (metadata access)
        // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
        if (propName === 'hasDelegation' || propName === 'getDelegationTarget') {
          const value = (self as any)[propName];
          if (typeof value === 'function') {
            return value.bind(self);
          }
          return value;
        }
        
        // 2. Check Component interface methods (discovery/metadata)
        if (propName === 'listMethods' || propName === 'hasMethod' || propName === 'getMethodSignature') {
          const value = (self as any)[propName];
          if (typeof value === 'function') {
            return value.bind(self);
          }
          return value;
        }
        
        // 3. If property exists on target → use it (own methods)
        if (prop in target) {
          const value = (target as any)[prop];
          if (typeof value === 'function') {
            return value.bind(target);
          }
          return value;
        }
        
        // 4. If property doesn't exist → delegate transparently
        return async function(...args: any[]): Promise<T> {
          await self.delegateMethod(propName, ...args);
          return target;
        };
      }
    }) as T;
  }
  
  // ============================================================================
  // Component Interface Methods
  // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
  // ✅ RADICAL OOP: Return ONLY what this component knows (transparent delegation)
  // ============================================================================
  
  /**
   * Check if method exists (checks target AND delegation for execution)
   * Used by CLI to determine if command is available
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * ✅ RADICAL OOP: Check BOTH because Proxy CAN handle delegated methods at call-time
   */
  hasMethod(name: string): boolean {
    // Check target first (own methods)
    if (this.model.target.hasMethod(name)) {
      return true;
    }
    
    // Check delegation target (delegated methods ARE available via Proxy)
    if (this.model.web4ts && this.model.web4ts.hasMethod(name)) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Get method signature (check target first, then delegation)
   * Delegated methods are available via Proxy interception
   */
  getMethodSignature(name: string): any {
    // Check target first
    if (this.model.target.hasMethod(name)) {
      return this.model.target.getMethodSignature(name);
    }
    
    // Check delegation target
    if (this.model.web4ts && this.model.web4ts.hasMethod(name)) {
      return this.model.web4ts.getMethodSignature(name);
    }
    
    return undefined;
  }
  
  /**
   * List available methods (ONLY target's own methods)
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * ✅ RADICAL OOP: Component knows ONLY its own methods
   * Delegated methods discovered separately via getDelegationTarget()
   */
  listMethods(): string[] {
    // Return ONLY target's methods - NO aggregation!
    return this.model.target.listMethods();
  }
  
  /**
   * Check if this component uses delegation
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * NEW: Explicit metadata for CLI to discover delegation
   */
  hasDelegation(): boolean {
    return !!this.model.web4ts;
  }
  
  /**
   * Get the delegation target for method discovery
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * NEW: Allows CLI to query delegated methods separately
   * @returns Web4TSComponent instance if delegation exists, undefined otherwise
   */
  getDelegationTarget(): any {
    return this.model.web4ts;
  }
  
  async getWeb4TSComponent(): Promise<any> {
    return (this.model.target as any).getWeb4TSComponent();
  }
  
  toScenario(): any {
    return this.model.target.toScenario();
  }
  
  /**
   * Static start method - Web4 Radical OOP entry point
   * Creates a Proxy-wrapped component with automatic method delegation
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * 
   * @param target The component to wrap
   * @returns Proxied component with automatic delegation
   * 
   * Usage:
   * ```typescript
   * this.component = await DelegationProxy.start(new DefaultComponent().init());
   * ```
   */
  static async start<T extends Component>(target: T): Promise<T> {
    const proxy = new DelegationProxy<T>().init();
    await proxy.setTarget(target); // Must await to load Web4TSComponent
    return proxy.toProxy();
  }
}
