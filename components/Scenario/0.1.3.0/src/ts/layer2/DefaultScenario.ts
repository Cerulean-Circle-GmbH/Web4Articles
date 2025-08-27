/**
 * Web4 Scenario - Universal hibernation container
 * 
 * The simplest possible structure for object state persistence.
 * All Web4 components use this for hibernation/resurrection.
 */

import { ObjectIdentifier } from '../layer3/ObjectIdentifier.interface.js';
import { ScenarioData } from '../layer3/ScenarioData.interface.js';
import { ScenarioModel } from '../layer3/Model.interface.js';

// For backward compatibility
export type IOR = ObjectIdentifier;

export class Scenario {
  public IOR: IOR;
  public owner: string;
  public model: ScenarioModel;

  constructor() {
    // Empty constructor - minimal initialization
    this.IOR = { uuid: '', component: '', version: '' };
    this.owner = '';
    this.model = {};
  }

  /**
   * Initialize from scenario data
   */
  init(scenario: Scenario | ScenarioData): this {
    // Initialize from scenario or data
    this.IOR = scenario.IOR || { uuid: '', component: '', version: '' };
    this.owner = scenario.owner || '';
    this.model = scenario.model || {};
    
    // Process nested scenarios
    this.processNestedScenarios(this.model);
    
    return this;
  }

  /**
   * Process nested scenarios recursively
   */
  private processNestedScenarios(model: ScenarioModel): void {
    for (const key in model) {
      const value = model[key];
      if (this.isScenarioData(value)) {
        // Create and init nested scenario
        const nested = new Scenario();
        nested.init(value as ScenarioData);
        model[key] = nested;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recurse into objects (but not arrays)
        this.processNestedScenarios(value as ScenarioModel);
      }
    }
  }

  /**
   * Check if object looks like scenario data
   */
  private isScenarioData(obj: unknown): boolean {
    if (typeof obj !== 'object' || obj === null) return false;
    const data = obj as any;
    return (
      data.IOR && 
      typeof data.IOR === 'object' &&
      'uuid' in data.IOR &&
      'component' in data.IOR &&
      'owner' in data &&
      'model' in data
    );
  }

  /**
   * Static factory method for backward compatibility
   */
  static from(data?: Partial<ScenarioData>): Scenario {
    const scenario = new Scenario();
    if (data) {
      scenario.IOR = data.IOR || scenario.IOR;
      scenario.owner = data.owner || scenario.owner;
      scenario.model = data.model || scenario.model;
      scenario.processNestedScenarios(scenario.model);
    }
    return scenario;
  }

  /**
   * Create scenario from JSON string
   */
  static fromJSON(json: string): Scenario {
    try {
      const data = JSON.parse(json);
      return Scenario.from(data);
    } catch (error) {
      throw new Error(`Invalid scenario JSON: ${error}`);
    }
  }

  /**
   * Serialize scenario to JSON string
   */
  toJSON(): string {
    return JSON.stringify(this.toObject(), null, 2);
  }

  /**
   * Get scenario as plain object (converting nested scenarios)
   */
  toObject(): ScenarioData {
    const obj: ScenarioData = {
      IOR: this.IOR,
      owner: this.owner,
      model: this.flattenModel(this.model)
    };
    return obj;
  }

  /**
   * Flatten model by converting nested Scenario instances to data
   */
  private flattenModel(model: ScenarioModel): ScenarioModel {
    const flattened: ScenarioModel = {};
    
    for (const key in model) {
      const value = model[key];
      if (value instanceof Scenario) {
        // Convert nested scenario to data
        flattened[key] = value.toObject();
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recurse into objects
        flattened[key] = this.flattenModel(value as ScenarioModel);
      } else {
        // Copy primitive values and arrays as-is
        flattened[key] = value;
      }
    }
    
    return flattened;
  }

  /**
   * Clone scenario with optional model updates
   */
  clone(modelUpdates?: Partial<ScenarioModel>): Scenario {
    const cloned = new Scenario();
    cloned.init({
      IOR: { ...this.IOR },
      owner: this.owner,
      model: modelUpdates ? { ...this.model, ...modelUpdates } : { ...this.model }
    });
    return cloned;
  }

  /**
   * Validate scenario has required fields
   */
  validate(): boolean {
    return !!(
      this.IOR && 
      this.IOR.uuid && 
      this.IOR.component && 
      this.IOR.version &&
      this.owner
    );
  }

  /**
   * Get scenario summary for debugging
   */
  toString(): string {
    return `Scenario(${this.IOR.component}:${this.IOR.version}:${this.IOR.uuid})`;
  }
}