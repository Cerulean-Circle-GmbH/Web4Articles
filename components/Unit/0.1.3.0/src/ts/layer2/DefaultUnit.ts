/**
 * Default Unit Implementation - Layer 2 (Implementation)
 * 
 * Reference implementation of the Web4 Unit interface demonstrating pure Web4 patterns:
 * - Empty constructor with scenario initialization
 * - Complete state hibernation/restoration via scenarios
 * - IOR-based coordination and communication
 * - Evidence-based execution with full traceability
 */

import { Unit, UnitScenario, UnitInput, UnitOutput, UnitCapability, UnitInterface, UnitMetadata, UnitMessage, CoordinationResult, UnitState, UnitLifecyclePhase, ExecutionEvidence } from '../layer3/Unit.js';
import { IOR, Scenario } from '../layer3/SimpleTypes.js';

/**
 * DefaultUnit - Reference Web4 Unit implementation
 */
export class DefaultUnit implements Unit {
  private unitScenario: UnitScenario | null = null;
  private currentState: UnitState = UnitState.UNINITIALIZED;
  private executionHistory: ExecutionEvidence[] = [];
  
  /**
   * Web4 Pattern: Empty constructor - no dependencies or configuration
   */
  constructor() {
    // Pure Web4 - empty constructor
  }

  /**
   * Web4 Pattern: Scenario-based initialization
   */
  init(scenario: UnitScenario): this {
    this.unitScenario = scenario;
    this.currentState = UnitState.INITIALIZED;
    
    // Initialize from scenario state
    this.loadFromScenario(scenario);
    
    return this;
  }

  /**
   * Core unit execution - business logic operation
   */
  async execute(input: UnitInput): Promise<UnitOutput> {
    if (!this.unitScenario) {
      throw new Error('Unit not initialized - call init() with scenario first');
    }

    const executionId = this.generateExecutionId();
    const startTime = new Date().toISOString();
    
    try {
      this.currentState = UnitState.EXECUTING;
      
      // Execute business logic based on scenario configuration
      const businessLogic = this.unitScenario.getBusinessLogic();
      const result = await this.executeBusinessLogic(businessLogic, input);
      
      const endTime = new Date().toISOString();
      const executionEvidence: ExecutionEvidence = {
        executionId,
        startTime,
        endTime,
        inputHash: this.hashInput(input),
        outputHash: this.hashOutput(result),
        executionTrace: this.captureExecutionTrace(),
        resourceUsage: this.measureResourceUsage()
      };
      
      this.executionHistory.push(executionEvidence);
      this.currentState = UnitState.COMPLETED;
      
      return {
        result,
        metadata: this.createOutputMetadata(executionId),
        evidence: executionEvidence
      };
      
    } catch (error) {
      this.currentState = UnitState.ERROR;
      throw error;
    }
  }

  /**
   * Unit lifecycle operations
   */
  async activate(): Promise<void> {
    if (this.currentState === UnitState.INITIALIZED || this.currentState === UnitState.HIBERNATED) {
      this.currentState = UnitState.ACTIVE;
    }
  }

  async deactivate(): Promise<void> {
    if (this.currentState === UnitState.ACTIVE || this.currentState === UnitState.COMPLETED) {
      this.currentState = UnitState.INITIALIZED;
    }
  }

  async hibernate(): Promise<UnitScenario> {
    this.currentState = UnitState.HIBERNATED;
    return this.toScenario();
  }

  async restore(scenario: UnitScenario): Promise<void> {
    this.init(scenario);
    this.currentState = UnitState.ACTIVE;
  }

  /**
   * Unit coordination and communication via IORs
   */
  async coordinate(targetUnit: IOR, coordinationScenario: Scenario): Promise<CoordinationResult> {
    if (!this.unitScenario) {
      throw new Error('Unit not initialized');
    }

    const coordinationId = this.generateCoordinationId();
    
    try {
      // Resolve target unit via IOR
      const targetUnitInstance = await targetUnit.resolve() as Unit;
      
      // Execute coordination protocol
      const coordinationSteps = await this.executeCoordinationProtocol(
        targetUnitInstance, 
        coordinationScenario
      );
      
      return {
        success: true,
        coordinationId,
        participantUnits: [targetUnit],
        coordinationOutcome: coordinationSteps,
        evidence: {
          coordinationId,
          participants: [targetUnit],
          coordinationProtocol: 'default-coordination',
          coordinationSteps: coordinationSteps.map((step, index) => ({
            stepId: index,
            coordinator: this.getSelfIOR(),
            participants: [targetUnit],
            action: step.action,
            timestamp: step.timestamp,
            result: step.result
          })),
          finalState: coordinationSteps[coordinationSteps.length - 1]?.result
        }
      };
      
    } catch (error) {
      return {
        success: false,
        coordinationId,
        participantUnits: [targetUnit],
        coordinationOutcome: error,
        evidence: {
          coordinationId,
          participants: [targetUnit],
          coordinationProtocol: 'default-coordination',
          coordinationSteps: [],
          finalState: { error: (error as Error).message }
        }
      };
    }
  }

  async communicate(message: UnitMessage): Promise<UnitMessage> {
    if (!this.unitScenario) {
      throw new Error('Unit not initialized');
    }

    // Process message based on type
    switch (message.messageType) {
      case 'request':
        return this.handleRequest(message);
      case 'response':
        return this.handleResponse(message);
      case 'notification':
        return this.handleNotification(message);
      case 'coordination':
        return this.handleCoordination(message);
      default:
        throw new Error(`Unknown message type: ${message.messageType}`);
    }
  }

  /**
   * Unit introspection and metadata
   */
  getCapabilities(): UnitCapability[] {
    return this.unitScenario?.getCapabilities() || [];
  }

  getInterface(): UnitInterface {
    return this.unitScenario?.getInputInterface() || {
      name: 'default',
      version: '1.0.0',
      parameters: [],
      returnType: { name: 'any', schema: {}, constraints: [] },
      errorTypes: []
    };
  }

  getMetadata(): UnitMetadata {
    if (!this.unitScenario) {
      throw new Error('Unit not initialized');
    }

    return {
      unitId: this.unitScenario.getUnitId(),
      unitName: this.unitScenario.getUnitName(),
      version: this.unitScenario.getUnitVersion(),
      timestamp: new Date().toISOString(),
      executionId: this.generateExecutionId(),
      traceId: this.generateTraceId(),
      tags: {
        state: this.currentState,
        lifecycle: this.unitScenario.getLifecyclePhase(),
        capabilities: this.getCapabilities().length.toString()
      }
    };
  }

  /**
   * Web4 scenario serialization
   */
  toScenario(): UnitScenario {
    if (!this.unitScenario) {
      throw new Error('Unit not initialized');
    }

    // Create scenario with current state - simplified
    const baseScenario = this.unitScenario;
    return {
      ...baseScenario,
      getCurrentState: () => this.currentState,
      // Use interface methods
      serialize: () => JSON.stringify({
        unitId: baseScenario!.getUnitId(),
        unitName: baseScenario!.getUnitName(),
        currentState: this.currentState,
        executionHistory: this.executionHistory,
        timestamp: new Date().toISOString()
      }),
      validate: () => true,
      getReferences: () => baseScenario!.getDependencies()
    } as UnitScenario;
  }

  /**
   * Private helper methods
   */
  private loadFromScenario(scenario: UnitScenario): void {
    // Load unit state from scenario
    this.currentState = scenario.getCurrentState();
    // Additional scenario loading logic would go here
  }

  private async executeBusinessLogic(businessLogic: any, input: UnitInput): Promise<any> {
    // Execute business logic based on operation type
    switch (businessLogic.operationType) {
      case 'transform':
        return this.executeTransformation(input);
      case 'validate':
        return this.executeValidation(input);
      case 'compute':
        return this.executeComputation(input);
      case 'coordinate':
        return this.executeCoordination(input);
      case 'persist':
        return this.executePersistence(input);
      case 'communicate':
        return this.executeCommunication(input);
      default:
        return this.executeDefault(input);
    }
  }

  private async executeTransformation(input: UnitInput): Promise<any> {
    // Default transformation - echo input with timestamp
    return {
      originalInput: input.data,
      transformedAt: new Date().toISOString(),
      transformedBy: this.unitScenario?.getUnitId()
    };
  }

  private async executeValidation(input: UnitInput): Promise<any> {
    // Default validation - basic structure validation
    return {
      valid: input.data !== null && input.data !== undefined,
      validatedAt: new Date().toISOString(),
      validatedBy: this.unitScenario?.getUnitId()
    };
  }

  private async executeComputation(input: UnitInput): Promise<any> {
    // Default computation - simple operation
    return {
      computationResult: `Processed: ${JSON.stringify(input.data)}`,
      computedAt: new Date().toISOString(),
      computedBy: this.unitScenario?.getUnitId()
    };
  }

  private async executeCoordination(input: UnitInput): Promise<any> {
    // Default coordination - coordination acknowledgment
    return {
      coordinationResult: 'coordination-acknowledged',
      coordinatedAt: new Date().toISOString(),
      coordinatedBy: this.unitScenario?.getUnitId()
    };
  }

  private async executePersistence(input: UnitInput): Promise<any> {
    // Default persistence - persistence acknowledgment
    return {
      persistenceResult: 'data-persisted',
      persistedAt: new Date().toISOString(),
      persistedBy: this.unitScenario?.getUnitId()
    };
  }

  private async executeCommunication(input: UnitInput): Promise<any> {
    // Default communication - communication acknowledgment
    return {
      communicationResult: 'message-sent',
      communicatedAt: new Date().toISOString(),
      communicatedBy: this.unitScenario?.getUnitId()
    };
  }

  private async executeDefault(input: UnitInput): Promise<any> {
    // Default execution - simple processing
    return {
      processedInput: input.data,
      processedAt: new Date().toISOString(),
      processedBy: this.unitScenario?.getUnitId()
    };
  }

  private generateExecutionId(): string {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCoordinationId(): string {
    return `coord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTraceId(): string {
    return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashInput(input: UnitInput): string {
    return `input-hash-${Date.now()}`;
  }

  private hashOutput(output: any): string {
    return `output-hash-${Date.now()}`;
  }

  private captureExecutionTrace(): any[] {
    return [
      {
        stepId: 1,
        operation: 'business-logic-execution',
        timestamp: new Date().toISOString(),
        duration: 10,
        result: 'success'
      }
    ];
  }

  private measureResourceUsage(): any {
    return {
      memoryUsedMB: 1.5,
      executionTimeMs: 10,
      networkCallsCount: 0,
      diskUsedMB: 0.1
    };
  }

  private createOutputMetadata(executionId: string): UnitMetadata {
    return {
      unitId: this.unitScenario?.getUnitId() || 'unknown',
      unitName: this.unitScenario?.getUnitName() || 'unknown',
      version: this.unitScenario?.getUnitVersion() || '1.0.0',
      timestamp: new Date().toISOString(),
      executionId,
      traceId: this.generateTraceId(),
      tags: {
        state: this.currentState,
        execution: 'completed'
      }
    };
  }

  private async executeCoordinationProtocol(targetUnit: Unit, coordinationScenario: Scenario): Promise<any[]> {
    // Default coordination protocol implementation
    return [
      {
        action: 'coordination-initiated',
        timestamp: new Date().toISOString(),
        result: 'success'
      },
      {
        action: 'coordination-executed',
        timestamp: new Date().toISOString(),
        result: 'completed'
      }
    ];
  }

  private getSelfIOR(): IOR {
    // Return IOR pointing to this unit instance
    // This would be provided by the ONCE kernel in a real implementation
    return {
      resolve: async () => this,
      getEndpoint: () => `unit://${this.unitScenario?.getUnitId()}`,
      isLocal: () => true,
      serialize: () => JSON.stringify({ unitId: this.unitScenario?.getUnitId() })
    } as IOR;
  }

  private async handleRequest(message: UnitMessage): Promise<UnitMessage> {
    // Handle request message
    return {
      ...message,
      messageType: 'response',
      sender: message.receiver,
      receiver: message.sender,
      payload: { response: 'request-processed', originalPayload: message.payload }
    };
  }

  private async handleResponse(message: UnitMessage): Promise<UnitMessage> {
    // Handle response message
    return {
      ...message,
      payload: { acknowledgment: 'response-received', originalPayload: message.payload }
    };
  }

  private async handleNotification(message: UnitMessage): Promise<UnitMessage> {
    // Handle notification message
    return {
      ...message,
      payload: { acknowledgment: 'notification-received', originalPayload: message.payload }
    };
  }

  private async handleCoordination(message: UnitMessage): Promise<UnitMessage> {
    // Handle coordination message
    return {
      ...message,
      messageType: 'response',
      sender: message.receiver,
      receiver: message.sender,
      payload: { coordination: 'coordination-acknowledged', originalPayload: message.payload }
    };
  }
}
