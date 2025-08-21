/**
 * Layer 3: Interface Definition
 * Web4 Requirement interface contracts
 */

export enum RequirementStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress', 
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum RequirementPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface RequirementMetadata {
  uuid: string;
  title: string;
  description: string;
  status: RequirementStatus;
  priority: RequirementPriority;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  epic?: string;
  sprint?: string;
}

export interface RequirementTraceability {
  testIORs: IOR[];
  featureIORs: IOR[];
  componentIORs: IOR[];
  versionIORs: IOR[];
  unitIORs: IOR[];
  dependencyIORs: IOR[];
}

export interface RequirementScenario {
  metadata: RequirementMetadata;
  traceability: RequirementTraceability;
  acceptanceCriteria: string[];
  businessRules: string[];
  constraints: string[];
  assumptions: string[];
}

export interface RequirementOverview {
  requirements: RequirementMetadata[];
  completionStats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    percentage: number;
  };
  priorityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface Requirement {
  /**
   * Web4 scenario initialization
   */
  init(scenario: RequirementScenario): this;
  
  /**
   * Get requirement metadata
   */
  getMetadata(): RequirementMetadata;
  
  /**
   * Update requirement status
   */
  updateStatus(status: RequirementStatus): void;
  
  /**
   * Add test traceability
   */
  addTestReference(testIOR: IOR): void;
  
  /**
   * Get all traceability references
   */
  getTraceability(): RequirementTraceability;
  
  /**
   * Generate MDView representation
   */
  generateMDView(): string;
  
  /**
   * Serialize component state to scenario
   */
  toScenario(): RequirementScenario;
}

export interface RequirementOverviewGenerator {
  /**
   * Web4 scenario initialization
   */
  init(scenario: RequirementOverviewScenario): this;
  
  /**
   * Add requirement to overview
   */
  addRequirement(requirement: Requirement): void;
  
  /**
   * Generate complete requirements.md overview
   */
  generateOverviewMD(): string;
  
  /**
   * Get overview statistics
   */
  getOverview(): RequirementOverview;
  
  /**
   * Serialize component state to scenario
   */
  toScenario(): RequirementOverviewScenario;
}

export interface RequirementOverviewScenario {
  title: string;
  description: string;
  requirementIORs: IOR[];
  template: string;
  formatOptions: {
    includeCheckboxes: boolean;
    includeUUIDs: boolean;
    includePriority: boolean;
    includeStatus: boolean;
  };
}

export interface IOR {
  uuid: string;
  type: string;
  location: string;
  resolve(): Promise<any>;
}
