/**
 * Layer 2: Implementation
 * Default implementation of Web4 TestCase
 */

import { 
  TestCase, 
  TestCaseScenario, 
  TestCaseMetadata,
  TestResultScenario,
  TestStatus,
  TestEvidence,
  IOR 
} from '../layer3/Test';

export class DefaultTestCase implements TestCase {
  private scenario!: TestCaseScenario;
  
  constructor() { // Web4 empty constructor
  }
  
  init(scenario: TestCaseScenario): this {
    this.scenario = scenario;
    return this;
  }
  
  async execute(): Promise<TestResultScenario> {
    const executionId = this.generateExecutionId();
    const startTime = new Date().toISOString();
    
    try {
      // Setup phase
      await this.setup();
      
      // Execute test logic  
      const evidence = await this.executeTestLogic();
      
      // Evaluate assertions
      const assertionResults = await this.evaluateAssertions(evidence);
      const allPassed = assertionResults.every(result => result.passed);
      
      const endTime = new Date().toISOString();
      const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
      
      // Teardown phase
      await this.teardown();
      
      return {
        testCaseUUID: this.scenario.metadata.uuid,
        executionId,
        status: allPassed ? TestStatus.PASSED : TestStatus.FAILED,
        startTime,
        endTime, 
        duration,
        evidence: {
          ...evidence,
          assertions: assertionResults
        },
        hibernatedAt: new Date().toISOString()
      };
      
    } catch (error: any) {
      const endTime = new Date().toISOString();
      const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
      
      await this.teardown();
      
      return {
        testCaseUUID: this.scenario.metadata.uuid,
        executionId,
        status: TestStatus.ERROR,
        startTime,
        endTime,
        duration,
        evidence: {
          input: null,
          expectedOutput: null,
          actualOutput: null,
          assertions: [],
          executionSteps: [],
          errorDetails: {
            message: error.message,
            stack: error.stack,
            line: error.line
          }
        },
        hibernatedAt: new Date().toISOString()
      };
    }
  }
  
  getMetadata(): TestCaseMetadata {
    return { ...this.scenario.metadata };
  }
  
  addRequirementReference(requirementIOR: IOR): void {
    this.scenario.metadata.requirementIORs.push(requirementIOR);
  }
  
  async setup(): Promise<void> {
    if (!this.scenario.setup) return;
    
    // Execute setup actions
    for (const action of this.scenario.setup.actions) {
      await this.executeAction(action);
    }
  }
  
  async teardown(): Promise<void> {
    if (!this.scenario.teardown) return;
    
    // Execute teardown actions
    for (const action of this.scenario.teardown.actions) {
      await this.executeAction(action);
    }
  }
  
  toScenario(): TestCaseScenario {
    return JSON.parse(JSON.stringify(this.scenario));
  }
  
  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async executeTestLogic(): Promise<TestEvidence> {
    const startTime = new Date().toISOString();
    const executionSteps = [];
    
    try {
      // Execute the test logic based on type
      let actualOutput;
      
      switch (this.scenario.testLogic.type) {
        case 'function':
          actualOutput = await this.executeFunctionLogic();
          break;
        case 'class':
          actualOutput = await this.executeClassLogic();
          break;
        case 'scenario':
          actualOutput = await this.executeScenarioLogic();
          break;
        default:
          throw new Error(`Unsupported test logic type: ${this.scenario.testLogic.type}`);
      }
      
      executionSteps.push({
        step: 1,
        action: 'execute_test_logic',
        timestamp: new Date().toISOString(),
        result: actualOutput
      });
      
      return {
        input: this.scenario.testLogic.parameters,
        expectedOutput: this.extractExpectedOutput(),
        actualOutput,
        assertions: [], // Will be filled by evaluateAssertions
        executionSteps
      };
      
    } catch (error: any) {
      executionSteps.push({
        step: 1,
        action: 'execute_test_logic',
        timestamp: new Date().toISOString(), 
        result: { error: error.message }
      });
      
      throw error;
    }
  }
  
  private async executeFunctionLogic(): Promise<any> {
    // Evaluate function implementation string
    const func = eval(`(${this.scenario.testLogic.implementation})`);
    return func(...this.scenario.testLogic.parameters);
  }
  
  private async executeClassLogic(): Promise<any> {
    // Create class instance and execute
    const ClassConstructor = eval(`(${this.scenario.testLogic.implementation})`);
    const instance = new ClassConstructor();
    
    // If parameters include method name, call it
    if (this.scenario.testLogic.parameters.length > 0) {
      const [methodName, ...args] = this.scenario.testLogic.parameters;
      return instance[methodName](...args);
    }
    
    return instance;
  }
  
  private async executeScenarioLogic(): Promise<any> {
    // Execute scenario-based test logic
    const scenarioSteps = JSON.parse(this.scenario.testLogic.implementation);
    const results = [];
    
    for (const step of scenarioSteps) {
      const result = await this.executeScenarioStep(step);
      results.push(result);
    }
    
    return results;
  }
  
  private async executeScenarioStep(step: any): Promise<any> {
    // Execute individual scenario step
    switch (step.type) {
      case 'call':
        return this.callMethod(step.target, step.method, step.args);
      case 'assert':
        return this.evaluateAssertion(step.assertion);
      case 'wait':
        return new Promise(resolve => setTimeout(resolve, step.duration));
      default:
        throw new Error(`Unknown scenario step type: ${step.type}`);
    }
  }
  
  private async callMethod(target: string, method: string, args: any[]): Promise<any> {
    // Dynamic method calling logic
    const targetObj = eval(target);
    return targetObj[method](...args);
  }
  
  private async evaluateAssertions(evidence: TestEvidence): Promise<any[]> {
    const results = [];
    
    for (const assertion of this.scenario.assertions) {
      try {
        const result = await this.evaluateAssertion(assertion);
        results.push(result);
      } catch (error: any) {
        results.push({
          description: assertion.description,
          expected: 'no_error',
          actual: error.message,
          passed: false,
          message: `Assertion evaluation failed: ${error.message}`
        });
      }
    }
    
    return results;
  }
  
  private async evaluateAssertion(assertion: any): Promise<any> {
    // Evaluate assertion based on type
    switch (assertion.type) {
      case 'equals':
        return this.evaluateEqualsAssertion(assertion);
      case 'contains':
        return this.evaluateContainsAssertion(assertion);
      case 'throws':
        return this.evaluateThrowsAssertion(assertion);
      case 'custom':
        return this.evaluateCustomAssertion(assertion);
      default:
        throw new Error(`Unknown assertion type: ${assertion.type}`);
    }
  }
  
  private evaluateEqualsAssertion(assertion: any): any {
    const actual = eval(assertion.expression);
    const expected = assertion.expected;
    const passed = actual === expected;
    
    return {
      description: assertion.description,
      expected,
      actual,
      passed,
      message: passed ? 'Assertion passed' : `Expected ${expected}, got ${actual}`
    };
  }
  
  private evaluateContainsAssertion(assertion: any): any {
    const actual = eval(assertion.expression);
    const expected = assertion.expected;
    const passed = actual.includes && actual.includes(expected);
    
    return {
      description: assertion.description,
      expected: `contains ${expected}`,
      actual,
      passed,
      message: passed ? 'Assertion passed' : `Expected to contain ${expected}`
    };
  }
  
  private evaluateThrowsAssertion(assertion: any): any {
    try {
      eval(assertion.expression);
      return {
        description: assertion.description,
        expected: 'throws error',
        actual: 'no error',
        passed: false,
        message: 'Expected expression to throw error but it did not'
      };
    } catch (error: any) {
      const expected = assertion.expected;
      const passed = !expected || error.message.includes(expected);
      
      return {
        description: assertion.description,
        expected: expected || 'any error',
        actual: error.message,
        passed,
        message: passed ? 'Assertion passed' : `Expected error containing '${expected}'`
      };
    }
  }
  
  private evaluateCustomAssertion(assertion: any): any {
    const customEval = eval(`(${assertion.implementation})`);
    return customEval(assertion);
  }
  
  private extractExpectedOutput(): any {
    // Extract expected output from assertions
    const expectationAssertion = this.scenario.assertions.find(a => a.type === 'equals');
    return expectationAssertion ? expectationAssertion.expected : null;
  }
  
  private async executeAction(action: string): Promise<void> {
    // Execute setup/teardown action
    eval(action);
  }
}
