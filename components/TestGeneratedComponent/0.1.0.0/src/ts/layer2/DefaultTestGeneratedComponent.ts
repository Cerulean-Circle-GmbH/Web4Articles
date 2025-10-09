/**
 * DefaultTestGeneratedComponent - TestGeneratedComponent Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { TestGeneratedComponent } from '../layer3/TestGeneratedComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { TestGeneratedComponentModel } from '../layer3/TestGeneratedComponentModel.interface.js';

export class DefaultTestGeneratedComponent implements TestGeneratedComponent {
  private model: TestGeneratedComponentModel;

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
  init(scenario: Scenario<TestGeneratedComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<TestGeneratedComponentModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'TestGeneratedComponent',
      version: '0.1.0.0'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'TestGeneratedComponent',
        version: '0.1.0.0'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for TestGeneratedComponent
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ TestGeneratedComponent operation completed`);
    return this;
  }

  /**
   * Process data through TestGeneratedComponent logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current TestGeneratedComponent state
   */
  async info(): Promise<this> {
    console.log(`📋 TestGeneratedComponent Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }

  /**
   * Execute component tests with Web4TSComponent promotion workflow
   * Delegates to web4tscomponent for version management
   * @cliSyntax
   * @cliExample {{COMPONENT_LOWER}} test
   */
  async test(): Promise<this> {
    // 🚨 RECURSION DETECTION: Check if we're already inside vitest
    const insideTestEnvironment = !!(process.env.VITEST || process.env.VITEST_WORKER_ID);
    
    if (insideTestEnvironment) {
      // Already in test environment - just run vitest, no delegation
      console.log(`🧪 Running TestGeneratedComponent tests (in test environment)...`);
      
      try {
        const { execSync } = await import('child_process');
        execSync('npx vitest run', { 
          stdio: 'inherit',
          encoding: 'utf-8',
          cwd: process.cwd()
        });
        console.log(`✅ TestGeneratedComponent tests completed successfully`);
      } catch (error) {
        console.error(`❌ TestGeneratedComponent tests failed`);
        throw error;
      }
    } else {
      // Not in test environment - delegate to web4tscomponent for promotion workflow
      console.log(`🧪 Running TestGeneratedComponent tests via Web4TSComponent infrastructure...`);
      
      try {
        const { execSync } = await import('child_process');
        execSync('web4tscomponent on TestGeneratedComponent dev test', { 
          stdio: 'inherit',
          encoding: 'utf-8'
        });
        console.log(`✅ TestGeneratedComponent tests completed successfully`);
      } catch (error) {
        console.error(`❌ TestGeneratedComponent tests failed`);
        throw error;
      }
    }
    
    return this;
  }
}
