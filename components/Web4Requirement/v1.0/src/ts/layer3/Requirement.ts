/**
 * Web4Requirement Interface - Layer 3 (Interface/Contract)
 */

export interface RequirementScenario {
  uuid: string;
  title: string;
  description: string;
  status: RequirementStatus;
  metadata: RequirementMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface RequirementMetadata {
  priority: 'high' | 'medium' | 'low';
  complexity: 'simple' | 'moderate' | 'complex';
  tags: string[];
}

export interface RequirementResult {
  success: boolean;
  message: string;
  requirementId?: string;
  scenario?: any;
  issues?: string[];
}

export enum RequirementStatus {
  PENDING = 'pending',
  CREATED = 'created', 
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Requirement {
  /**
   * Web4 scenario initialization
   */
  init(scenario: RequirementScenario): this;

  /**
   * Create new requirement from title and description
   */
  create(title: string, description: string): Promise<RequirementResult>;

  /**
   * Execute requirement processing
   */
  process(): Promise<RequirementResult>;

  /**
   * Get requirement status
   */
  getStatus(): RequirementStatus;

  /**
   * Get requirement attributes
   */
  getUuid(): string;
  getTitle(): string;
  getDescription(): string;

  /**
   * Serialize requirement state to scenario
   */
  toScenario(): RequirementScenario;
}