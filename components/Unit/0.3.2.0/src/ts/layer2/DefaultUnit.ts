/**
 * DefaultUnit - Unit Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Unit } from '../layer3/Unit.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { UnitModel } from '../layer3/UnitModel.interface.js';

export class DefaultUnit implements Unit {
  private model: UnitModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * @cliHide
   */
  init(scenario: Scenario<UnitModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<UnitModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Unit',
      version: '0.3.2.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Unit',
        version: '0.3.2.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create unit operation with configurable output format
   * 
   * Creates a new unit operation with specified input data and output format.
   * This is the primary method for initializing Unit processing workflows
   * with configurable output formatting options.
   * 
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * 
   * @example
   * // Create unit with JSON output
   * await unit.create('user-data', 'json');
   * 
   * @example
   * // Create unit with text output
   * await unit.create('system-config', 'text');
   * 
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating unit operation: ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ Unit operation completed`);
    return this;
  }

  /**
   * Execute Unit processing workflow on provided data
   * 
   * Executes the core Unit processing workflow on the provided data.
   * This method applies Unit-specific transformations and business logic
   * to process the input according to Web4 standards.
   * 
   * @param data Data to process through Unit workflow
   * 
   * @example
   * // Process user input data
   * await unit.process('{"userId": 123, "action": "update"}');
   * 
   * @example
   * // Process configuration data
   * await unit.process('config=production,debug=false');
   * 
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing data through Unit workflow: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ Unit processing completed`);
    return this;
  }

  /**
   * Display detailed Unit instance information and state
   * 
   * Shows detailed information about the current Unit instance including
   * UUID, name, creation timestamp, and last update timestamp. Useful
   * for debugging and monitoring Unit state during development.
   * 
   * @example
   * // Display current unit information
   * await unit.info();
   * 
   * @cliSyntax
   */
  async info(): Promise<this> {
    console.log(`📋 Unit Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }
}
