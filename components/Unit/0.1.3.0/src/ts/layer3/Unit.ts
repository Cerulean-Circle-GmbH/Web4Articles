/**
 * Web4 Unit Interface - Layer 3 (Interface/Contract)
 * 
 * Defines the contract for Web4 Units - the atomic executable elements within components.
 * Units represent the smallest granular business logic operations in Web4 architecture.
 */

import { IOR, Scenario } from './SimpleTypes.js';

/**
 * Unit Scenario - Contains complete unit state for hibernation/restoration
 */
export interface UnitScenario extends Scenario {
  /**
   * Unit identification and metadata
   */
  getUnitId(): string;
  getUnitName(): string;
  getUnitDescription(): string;
  getUnitVersion(): string;
  
  /**
   * Unit capabilities and interface definition
   */
  getCapabilities(): UnitCapability[];
  getInputInterface(): UnitInterface;
  getOutputInterface(): UnitInterface;
  
  /**
   * Unit relationships and dependencies
   */
  getDependencies(): IOR[];
  getCollaborators(): IOR[];
  getParentComponent(): IOR;
  
  /**
   * Unit execution context and configuration
   */
  getExecutionContext(): UnitExecutionContext;
  getBusinessLogic(): UnitBusinessLogic;
  
  /**
   * Unit state and lifecycle
   */
  getCurrentState(): UnitState;
  getLifecyclePhase(): UnitLifecyclePhase;
}

/**
 * Core Unit Interface - Web4 compliant unit contract
 */
export interface Unit {
  /**
   * Web4 empty constructor pattern - no parameters
   */
  // constructor(): void; // Interface cannot define constructor

  /**
   * Web4 scenario initialization pattern
   */
  init(scenario: UnitScenario): this;

  /**
   * Unit execution - core business logic operation
   */
  execute(input: UnitInput): Promise<UnitOutput>;

  /**
   * Unit lifecycle operations
   */
  activate(): Promise<void>;
  deactivate(): Promise<void>;
  hibernate(): Promise<UnitScenario>;
  restore(scenario: UnitScenario): Promise<void>;

  /**
   * Unit coordination and communication
   */
  coordinate(targetUnit: IOR, coordinationScenario: Scenario): Promise<CoordinationResult>;
  communicate(message: UnitMessage): Promise<UnitMessage>;

  /**
   * Unit introspection and metadata
   */
  getCapabilities(): UnitCapability[];
  getInterface(): UnitInterface;
  getMetadata(): UnitMetadata;
  
  /**
   * Web4 scenario serialization
   */
  toScenario(): UnitScenario;
}

/**
 * Unit Capability - Defines what a unit can do
 */
export interface UnitCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  dependencies: string[];
  qualityOfService: UnitQoS;
}

/**
 * Unit Interface - Input/Output contract definition  
 */
export interface UnitInterface {
  name: string;
  version: string;
  parameters: UnitParameter[];
  returnType: UnitType;
  errorTypes: UnitErrorType[];
}

/**
 * Unit Execution Context - Environment and configuration
 */
export interface UnitExecutionContext {
  environmentType: 'browser' | 'nodejs' | 'worker' | 'edge' | 'cloud';
  resourceLimits: UnitResourceLimits;
  securityContext: UnitSecurityContext;
  networkContext: UnitNetworkContext;
}

/**
 * Unit Business Logic - Core operational definition
 */
export interface UnitBusinessLogic {
  operationType: 'transform' | 'validate' | 'compute' | 'coordinate' | 'persist' | 'communicate';
  algorithmDescription: string;
  businessRules: BusinessRule[];
  validationRules: ValidationRule[];
  transformationRules: TransformationRule[];
}

/**
 * Unit State - Current operational state
 */
export enum UnitState {
  UNINITIALIZED = 'uninitialized',
  INITIALIZED = 'initialized', 
  ACTIVE = 'active',
  EXECUTING = 'executing',
  COMPLETED = 'completed',
  ERROR = 'error',
  HIBERNATED = 'hibernated'
}

/**
 * Unit Lifecycle Phase - Development/deployment phase
 */
export enum UnitLifecyclePhase {
  SPECIFICATION = 'specification',
  IMPLEMENTATION = 'implementation', 
  TESTING = 'testing',
  INTEGRATION = 'integration',
  DEPLOYMENT = 'deployment',
  PRODUCTION = 'production',
  MAINTENANCE = 'maintenance',
  DEPRECATED = 'deprecated'
}

/**
 * Unit Input/Output Types
 */
export interface UnitInput {
  data: any;
  metadata: UnitMetadata;
  context: UnitExecutionContext;
}

export interface UnitOutput {
  result: any;
  metadata: UnitMetadata;
  evidence: ExecutionEvidence;
}

/**
 * Unit Communication Types
 */
export interface UnitMessage {
  id: string;
  sender: IOR;
  receiver: IOR;
  messageType: 'request' | 'response' | 'notification' | 'coordination';
  payload: any;
  metadata: UnitMetadata;
}

export interface CoordinationResult {
  success: boolean;
  coordinationId: string;
  participantUnits: IOR[];
  coordinationOutcome: any;
  evidence: CoordinationEvidence;
}

/**
 * Unit Metadata and Quality Types
 */
export interface UnitMetadata {
  unitId: string;
  unitName: string;
  version: string;
  timestamp: string;
  executionId: string;
  traceId: string;
  tags: Record<string, string>;
}

export interface UnitQoS {
  maxExecutionTime: number;
  maxMemoryUsage: number;
  reliability: number;
  availability: number;
  consistency: 'strong' | 'eventual' | 'weak';
}

/**
 * Supporting Types
 */
export interface UnitParameter {
  name: string;
  type: UnitType;
  required: boolean;
  description: string;
  validation: ValidationRule[];
}

export interface UnitType {
  name: string;
  schema: any; // JSON Schema or similar
  constraints: TypeConstraint[];
}

export interface UnitErrorType {
  name: string;
  code: string;
  description: string;
  recoverability: 'recoverable' | 'non-recoverable' | 'partial';
}

export interface UnitResourceLimits {
  maxMemoryMB: number;
  maxExecutionTimeMs: number;
  maxNetworkCallsPerSecond: number;
  maxDiskUsageMB: number;
}

export interface UnitSecurityContext {
  permissions: string[];
  authenticatedUser?: string;
  securityLevel: 'public' | 'internal' | 'restricted' | 'confidential';
  encryptionRequired: boolean;
}

export interface UnitNetworkContext {
  allowedHosts: string[];
  networkZone: string;
  bandwidthLimitKbps?: number;
  timeoutMs: number;
}

export interface BusinessRule {
  name: string;
  condition: string;
  action: string;
  priority: number;
}

export interface ValidationRule {
  name: string;
  expression: string;
  errorMessage: string;
  severity: 'error' | 'warning' | 'info';
}

export interface TransformationRule {
  name: string;
  sourceField: string;
  targetField: string;
  transformation: string;
}

export interface ExecutionEvidence {
  executionId: string;
  startTime: string;
  endTime: string;
  inputHash: string;
  outputHash: string;
  executionTrace: ExecutionStep[];
  resourceUsage: ResourceUsage;
}

export interface CoordinationEvidence {
  coordinationId: string;
  participants: IOR[];
  coordinationProtocol: string;
  coordinationSteps: CoordinationStep[];
  finalState: any;
}

export interface ExecutionStep {
  stepId: number;
  operation: string;
  timestamp: string;
  duration: number;
  result: 'success' | 'failure' | 'partial';
}

export interface CoordinationStep {
  stepId: number;
  coordinator: IOR;
  participants: IOR[];
  action: string;
  timestamp: string;
  result: any;
}

export interface ResourceUsage {
  memoryUsedMB: number;
  executionTimeMs: number;
  networkCallsCount: number;
  diskUsedMB: number;
}

export interface TypeConstraint {
  type: 'range' | 'length' | 'pattern' | 'enum' | 'custom';
  value: any;
  message: string;
}
