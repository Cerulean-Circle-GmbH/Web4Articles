/**
 * Web4 Scenario - Universal hibernation container
 * 
 * The simplest possible structure for object state persistence.
 * All Web4 components use this for hibernation/resurrection.
 * Scenarios are themselves Units that can be executed.
 */

import { ObjectIdentifier } from '../layer3/ObjectIdentifier.interface.js';
import { ScenarioData } from '../layer3/ScenarioData.interface.js';
import { ScenarioModel } from '../layer3/Model.interface.js';
// @ts-ignore - Cross-component import
import { Unit, UnitInput, UnitOutput } from '../../../../../Unit/0.1.3.0/dist/ts/index.js';

// For backward compatibility
export type IOR = ObjectIdentifier;

export class Scenario implements Unit {
  public ior: IOR;  // lowercase attribute, uppercase type
  public owner: string;
  public model: ScenarioModel;

  constructor() {
    // Empty constructor - minimal initialization
    this.ior = { uuid: '', component: 'Scenario', version: '0.1.3.0' };
    this.owner = '';
    this.model = {};
  }

  /**
   * Initialize from scenario data
   */
  init(scenario: Scenario | ScenarioData): this {
    // Initialize from scenario or data
    this.ior = scenario.ior || { uuid: '', component: 'Scenario', version: '0.1.3.0' };
    this.owner = scenario.owner || '';
    this.model = scenario.model || {};
    
    // No special processing - IORs in model are just references
    
    return this;
  }

  /**
   * Execute scenario - validates and returns state
   */
  async execute(input: UnitInput): Promise<UnitOutput> {
    const validation = this.validate();
    
    return {
      valid: validation,
      ior: this.ior,
      owner: this.owner,
      modelKeys: Object.keys(this.model),
      input: input
    };
  }

  /**
   * Convert to scenario (self-reference as scenarios are scenarios)
   */
  toScenario(): Scenario {
    return this;
  }

  /**
   * Static factory method for backward compatibility
   */
  static from(data?: Partial<ScenarioData>): Scenario {
    const scenario = new Scenario();
    if (data) {
      scenario.ior = data.ior || scenario.ior;
      scenario.owner = data.owner || scenario.owner;
      scenario.model = data.model || scenario.model;
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
   * Get scenario as plain object
   */
  toObject(): ScenarioData {
    return {
      ior: this.ior,
      owner: this.owner,
      model: this.model
    };
  }

  /**
   * Clone scenario with optional model updates
   */
  clone(modelUpdates?: Partial<ScenarioModel>): Scenario {
    const cloned = new Scenario();
    cloned.init({
      ior: { ...this.ior },
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
      this.ior && 
      this.ior.uuid && 
      this.ior.component && 
      this.ior.version &&
      this.owner
    );
  }

  /**
   * Get scenario summary for debugging
   */
  toString(): string {
    return `Scenario(${this.ior.component}:${this.ior.version}:${this.ior.uuid})`;
  }
}