/**
 * Requirement Interface - Web4 Revolutionary Requirement Management
 * Web4 principle: Interface-driven architecture with command chaining
 * Purpose: Define comprehensive requirement management interface with Unit 0.3.0.5 principles
 */

import { RequirementIdentifier } from './RequirementIdentifier.type.js';

/**
 * Requirement status enumeration
 * Web4 pattern: Comprehensive status tracking
 */
export enum RequirementStatus {
  PENDING = 'pending',
  CREATED = 'created',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Requirement result interface for operation feedback
 * Web4 pattern: Comprehensive operation result with success/error details
 */
export interface RequirementResult {
  success: boolean;
  message: string;
  requirementId?: string;
  issues?: string[];
  deletedFiles?: string[];
  scenario?: any;
  content?: string;
  error?: string;
}

/**
 * Requirement metadata interface
 * Web4 pattern: Rich metadata for comprehensive requirement tracking
 */
export interface RequirementMetadata {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  complexity?: 'simple' | 'moderate' | 'complex' | 'epic';
  tags?: string[];
  component?: string;
  version?: string;
  implementationStatus?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  implemented?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Requirement scenario interface for persistence
 * Web4 pattern: Scenario-first development with hibernatable objects
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
}

/**
 * Revolutionary Requirement Interface with Unit 0.3.0.5 Principles
 * Web4 patterns: Command chaining, union types, JEDI MODE search, zero config CLI
 * 
 * @example
 * ```typescript
 * // ✅ COMMAND CHAINING: Natural language DSL
 * await requirement.create("Auth Fix", "Fix authentication logic")
 *                   .set("priority", "high")
 *                   .set("status", "active")
 *                   .md()
 *                   .execute();
 * 
 * // ✅ JEDI MODE: Precise requirement discovery
 * await requirement.find("authentication").list().execute();
 * 
 * // ✅ UNION TYPES: Flexible parameter handling
 * await requirement.set(uuid, "implemented", "true");
 * await requirement.set("requirement.json", "status", "completed");
 * ```
 */
export interface Requirement {
  /**
   * Create new requirement with title and description
   * @param title - Requirement title
   * @param description - Detailed requirement description
   * @cliSyntax title description
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.create("User Authentication", "Implement secure user login system");
   * ```
   */
  create(title: string, description: string): Promise<this>;

  /**
   * Set component context for subsequent operations
   * @param component - Component name (e.g., "Unit", "User")
   * @param version - Component version (e.g., "0.3.0.5", "latest")
   * @cliSyntax component version
   * @returns this for chaining
   * 
   * @example
   * ```typescript
   * requirement.on("Unit", "0.3.0.5").create("Unit Enhancement", "Add new features");
   * ```
   */
  on(component: string, version: string): this;

  /**
   * Generate markdown view from requirement
   * @param outputDirectory - Optional output directory for MD file
   * @cliSyntax folder @cliOptional
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.md("./output");
   * ```
   */
  md(outputDirectory?: string): Promise<this>;

  /**
   * Set requirement property value
   * @param identifier - Requirement identifier (UUID or file path) @cliSyntax uuid|reqfile
   * @param property - Property name (e.g., "status", "priority", "implemented")
   * @param value - Property value
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.set("44443290-015c-4720-be80-c42caf842252", "implemented", "true");
   * await requirement.set("requirement.json", "priority", "high");
   * ```
   */
  set(identifier: RequirementIdentifier, property: string, value: string): Promise<this>;

  /**
   * Update requirements overview
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.update();
   * ```
   */
  update(): Promise<this>;

  /**
   * Move requirement to different component/version
   * @param identifier - Requirement identifier (UUID or file path) @cliSyntax uuid|reqfile
   * @param component - Target component name
   * @param version - Target component version
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.mv("44443290-015c-4720-be80-c42caf842252", "User", "latest");
   * ```
   */
  mv(identifier: RequirementIdentifier, component: string, version: string): Promise<this>;

  /**
   * Delete requirement by identifier
   * @param identifier - Requirement identifier (UUID, scenario file, or MD file) @cliSyntax uuid|reqfile
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.delete("44443290-015c-4720-be80-c42caf842252");
   * await requirement.delete("requirement.scenario.json");
   * await requirement.delete("requirement.md");
   * ```
   */
  delete(identifier: RequirementIdentifier): Promise<this>;

  /**
   * Find requirements by search term with JEDI MODE positioning
   * @param searchTerm - Text to search for in requirements
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // ✅ JEDI MODE: Enhanced search with precise positioning
   * await requirement.find("authentication");
   * ```
   */
  find(searchTerm: string): Promise<this>;

  /**
   * Display search results in interactive less viewer
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * // ✅ INTERACTIVE: Browse search results with less
   * await requirement.find("authentication").list();
   * ```
   */
  list(): Promise<this>;

  /**
   * Replace requirement pattern with dual link
   * @param pattern - Requirement pattern to replace
   * @param filePath - File path containing the pattern
   * @param targetUuid - Optional target UUID for replacement @cliSyntax uuid @cliOptional
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.replace("requirement:uuid:auth-fix", "docs/requirements.md");
   * await requirement.replace("requirement:uuid:auth-fix", "44443290-015c-4720-be80-c42caf842252", "docs/requirements.md");
   * ```
   */
  replace(pattern: string, filePath: string, targetUuid?: string): Promise<this>;

  /**
   * Process file for requirement patterns and replace with dual links
   * @param filePath - File path to process for requirement patterns
   * @returns Promise resolving to this for chaining
   * 
   * @example
   * ```typescript
   * await requirement.processFile("docs/sprint-requirements.md");
   * ```
   */
  processFile(filePath: string): Promise<this>;

  /**
   * Execute the complete command chain
   * @returns Promise resolving when all chained operations complete
   * 
   * @example
   * ```typescript
   * await requirement.create("Auth Fix", "Fix authentication")
   *                   .set("priority", "high")
   *                   .md()
   *                   .execute();
   * ```
   */
  execute(): Promise<void>;

  // ✅ GETTERS: Essential requirement information access
  getUuid(): string;
  getTitle(): string;
  getDescription(): string;
  getStatus(): RequirementStatus;
  getMetadata(): RequirementMetadata;
  
  // ✅ SCENARIO: Web4 scenario-first development
  toScenario(): RequirementScenario;
}