/**
 * Web4 DefaultUnit - Radically Simplified Implementation
 * 
 * Uses single model attribute pattern with generic Scenario
 */

// @ts-ignore - Cross-component import
import { Scenario } from '../../../../Scenario/0.1.3.0/dist/ts/Scenario.js';
import { Unit } from './Unit.interface.js';
import { UnitModel, UnitInput, UnitOutput, ExecutionRecord } from './UnitModel.interface.js';

export class DefaultUnit implements Unit {
  private model: UnitModel = {
    uuid: '',
    name: '',
    description: '',
    state: 'uninitialized',
    capabilities: [],
    executionHistory: []
  };

  constructor() {
    // Empty constructor - Web4 pattern
  }

  /**
   * Initialize from scenario
   */
  init(scenario: Scenario): this {
    if (!scenario.validate()) {
      throw new Error('Invalid scenario');
    }
    
    // Restore complete model from scenario
    this.model = { ...scenario.model };
    this.model.state = 'initialized';
    
    return this;
  }

  /**
   * Execute unit logic
   */
  async execute(input: UnitInput): Promise<UnitOutput> {
    if (this.model.state === 'uninitialized') {
      throw new Error('Unit not initialized');
    }

    // Record execution
    const execution: ExecutionRecord = {
      timestamp: new Date().toISOString(),
      input: input,
      output: null as unknown,
      status: 'success' as const
    };

    try {
      // Simple echo logic for now
      execution.output = {
        unitName: this.model.name,
        processed: input,
        timestamp: execution.timestamp
      };

      this.model.executionHistory.push(execution);
      this.model.state = 'executed';

      return execution.output;
    } catch (error) {
      execution.status = 'failed';
      execution.output = { error: (error as Error).message };
      this.model.executionHistory.push(execution);
      throw error;
    }
  }

  /**
   * Convert to scenario for hibernation
   */
  toScenario(): Scenario {
    return Scenario.from({
      IOR: {
        uuid: this.model.uuid || crypto.randomUUID(),
        component: 'Unit',
        version: '0.1.3.0'
      },
      owner: this.model.owner || '',
      model: { ...this.model }
    });
  }

  /**
   * Helper methods for common operations
   */
  
  setName(name: string): this {
    this.model.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.model.description = description;
    return this;
  }

  addCapability(capability: string): this {
    if (!this.model.capabilities.includes(capability)) {
      this.model.capabilities.push(capability);
    }
    return this;
  }

  getState(): string {
    return this.model.state;
  }

  getExecutionHistory(): ExecutionRecord[] {
    return [...this.model.executionHistory];
  }
}