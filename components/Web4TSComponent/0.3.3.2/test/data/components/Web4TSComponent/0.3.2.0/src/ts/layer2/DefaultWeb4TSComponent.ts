/**
 * DefaultWeb4TSComponent - Web4TSComponent Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Web4TSComponent } from '../layer3/Web4TSComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { Web4TSComponentModel } from '../layer3/Web4TSComponentModel.interface.js';

export class DefaultWeb4TSComponent implements Web4TSComponent {
  private model: Web4TSComponentModel;

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
  init(scenario: Scenario<Web4TSComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<Web4TSComponentModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Web4TSComponent',
      version: '0.3.2.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Web4TSComponent',
        version: '0.3.2.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for Web4TSComponent
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ Web4TSComponent operation completed`);
    return this;
  }

  /**
   * Process data through Web4TSComponent logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current Web4TSComponent state
   */
  async info(): Promise<this> {
    console.log(`📋 Web4TSComponent Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }

  /**
   * Execute component tests using Web4TSComponent test infrastructure
   * Delegates to web4tscomponent for comprehensive testing and version promotion workflow
   * @cliSyntax
   * @cliExample testpatterncomponent test
   */
  async test(): Promise<this> {
    console.log(`🧪 Running Web4TSComponent tests via Web4TSComponent infrastructure...`);
    
    try {
      // Call web4tscomponent on Web4TSComponent dev test to use the promotion workflow
      const { execSync } = await import('child_process');
      execSync('web4tscomponent on Web4TSComponent dev test', { 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      console.log(`✅ Web4TSComponent tests completed successfully`);
    } catch (error) {
      console.error(`❌ Web4TSComponent tests failed`);
      throw error;
    }
    
    return this;
  }
}
