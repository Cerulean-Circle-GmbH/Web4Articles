/**
 * QualityScenario - Quality Context and Configuration Object
 * 
 * Defines the scenario context for quality consciousness operations.
 * Every quality object is initialized from a scenario, following
 * Web4's scenario-first development principle.
 * 
 * @philosophy Quality scenarios define quality reality contexts
 * @web4compliance Scenario-based initialization, hibernatable
 */

import { IOR } from './IOR';

export interface QualityScenario {
    
    /**
     * Gets the unique scenario identifier
     */
    getScenarioId(): string;
    
    /**
     * Gets the scenario name/title
     */
    getName(): string;
    
    /**
     * Gets the quality context this scenario establishes
     */
    getQualityContext(): QualityContext;
    
    /**
     * Gets the quality standards for this scenario
     */
    getQualityStandards(): QualityStandard[];
    
    /**
     * Gets the expected quality outcomes
     */
    getExpectedOutcomes(): QualityExpectation[];
    
    /**
     * Gets the quality assessment criteria
     */
    getAssessmentCriteria(): QualityCriteria[];
    
    /**
     * Gets the evidence collection configuration
     */
    getEvidenceConfiguration(): EvidenceConfiguration;
    
    /**
     * Gets the quality consciousness configuration
     */
    getConsciousnessConfiguration(): ConsciousnessConfiguration;
    
    /**
     * Hibernates this scenario
     */
    hibernate(): Promise<IOR>;
    
    /**
     * Restores from hibernated state
     */
    restore(ior: IOR): Promise<void>;
}

export interface QualityContext {
    domain: string;
    environment: string;
    stakeholders: string[];
    constraints: string[];
    objectives: string[];
    riskLevel: RiskLevel;
}

export interface QualityStandard {
    name: string;
    description: string;
    criteria: QualityCriteria[];
    weight: number;
    mandatory: boolean;
}

export interface QualityExpectation {
    aspect: string;
    expected: any;
    tolerance: number;
    priority: Priority;
}

export interface QualityCriteria {
    name: string;
    description: string;
    evaluationMethod: string;
    thresholds: QualityThreshold[];
    weight: number;
}

export interface QualityThreshold {
    level: QualityLevel;
    value: number;
    condition: string;
}

export interface EvidenceConfiguration {
    types: EvidenceTypeConfig[];
    retention: RetentionPolicy;
    privacy: PrivacyPolicy;
    storage: StoragePolicy;
}

export interface ConsciousnessConfiguration {
    intelligenceLevel: number;
    learningRate: number;
    adaptationSpeed: number;
    networkParticipation: boolean;
    evolutionEnabled: boolean;
}

export interface EvidenceTypeConfig {
    type: string;
    enabled: boolean;
    detail: DetailLevel;
    frequency: CollectionFrequency;
}

export interface RetentionPolicy {
    duration: number;
    archiveAfter: number;
    deleteAfter: number;
    compressionLevel: number;
}

export interface PrivacyPolicy {
    anonymize: boolean;
    encrypt: boolean;
    accessControl: AccessLevel[];
}

export interface StoragePolicy {
    location: StorageLocation;
    redundancy: number;
    compression: boolean;
    indexing: boolean;
}

export enum RiskLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum QualityLevel {
    POOR = 'poor',
    ACCEPTABLE = 'acceptable',
    GOOD = 'good',
    EXCELLENT = 'excellent'
}

export enum DetailLevel {
    MINIMAL = 'minimal',
    BASIC = 'basic',
    DETAILED = 'detailed',
    COMPREHENSIVE = 'comprehensive'
}

export enum CollectionFrequency {
    NEVER = 'never',
    ON_DEMAND = 'on_demand',
    PERIODIC = 'periodic',
    CONTINUOUS = 'continuous'
}

export enum AccessLevel {
    PUBLIC = 'public',
    INTERNAL = 'internal',
    RESTRICTED = 'restricted',
    CONFIDENTIAL = 'confidential'
}

export enum StorageLocation {
    LOCAL = 'local',
    DISTRIBUTED = 'distributed',
    CLOUD = 'cloud',
    HYBRID = 'hybrid'
}

