/**
 * Web4Requirement Interface - Layer 3 (Interface/Contract)
 */

export interface RequirementScenario {
  uuid: string;
  name: string;
  title: string;
  description: string;
  status: RequirementStatus;
  metadata: RequirementMetadata;
  createdAt: string;
  updatedAt: string;
  implemented?: boolean;
  implementationStatus?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
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
   * Name and title accessors
   */
  get name(): string;
  set name(value: string);
  get title(): string;
  set title(value: string);

  /**
   * Set attribute value programmatically
   */
  set(attribute: string, value: string): Promise<RequirementResult>;
  
  /**
   * Regenerate requirements overview from scratch
   */
  updateOverview(): Promise<RequirementResult>;
  
  /**
   * Move requirement files to another component
   */
  moveToComponent(uuid: string, targetComponentPath: string): Promise<RequirementResult>;
  
  /**
   * Serialize requirement state to scenario
   */
  toScenario(): RequirementScenario;
  
  /**
   * Load requirement from scenario file
   */
  loadFromScenario(scenarioPath: string): Promise<RequirementResult>;
  
  /**
   * Generate MD view for requirement
   */
  generateMDView(): string;
  
  /**
   * Save MD view to file
   */
  saveMDView(outputPath?: string): Promise<RequirementResult>;
  setDirectoryContext(context: string): void;
  saveScenario(uuid: string, scenario: any): Promise<void>;
}