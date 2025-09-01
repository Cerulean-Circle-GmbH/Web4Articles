/**
 * QualityEvidence - Living Evidence Objects
 * 
 * Evidence is not just data - it's a living object that preserves
 * complete execution context, can be replayed, analyzed, and even
 * testifies in quality disputes. Evidence objects are the foundation
 * of quality archaeology and time travel debugging.
 * 
 * @philosophy Evidence as living, self-aware objects
 * @web4compliance Empty constructor, scenario-based, hibernatable
 */

import { IOR } from './IOR';
import { QualityScenario } from './QualityScenario';

export interface QualityEvidence {
    
    /**
     * Initializes evidence from a quality scenario
     */
    initialize(scenario: QualityScenario): Promise<void>;
    
    /**
     * Hibernates evidence for long-term preservation
     */
    hibernate(): Promise<IOR>;
    
    /**
     * Restores evidence from hibernated state
     */
    restore(ior: IOR): Promise<void>;
    
    /**
     * Gets the unique evidence identifier
     */
    getEvidenceId(): string;
    
    /**
     * Gets the type of evidence (execution, state, behavior, etc.)
     */
    getEvidenceType(): EvidenceType;
    
    /**
     * Gets the complete execution context when evidence was captured
     */
    getExecutionContext(): ExecutionContext;
    
    /**
     * Gets the raw evidence data
     */
    getData(): any;
    
    /**
     * Gets metadata about how this evidence was collected
     */
    getMetadata(): EvidenceMetadata;
    
    /**
     * Gets the timestamp when evidence was captured
     */
    getTimestamp(): Date;
    
    /**
     * Gets the quality consciousness that collected this evidence
     */
    getCollector(): IOR;
    
    /**
     * Replays the execution that created this evidence
     * This is the quality time travel capability
     */
    replay(): Promise<any>;
    
    /**
     * Analyzes this evidence to extract quality insights
     */
    analyze(): Promise<QualityInsight[]>;
    
    /**
     * Compares this evidence with other evidence for patterns
     */
    compare(otherEvidence: IOR[]): Promise<QualityPattern[]>;
    
    /**
     * Validates that this evidence is authentic and untampered
     */
    validate(): Promise<boolean>;
    
    /**
     * Testifies about what this evidence proves in quality disputes
     */
    testify(): Promise<QualityTestimony>;
    
    /**
     * Links to related evidence that supports or contradicts this evidence
     */
    getRelatedEvidence(): Promise<IOR[]>;
    
    /**
     * Gets the chain of evidence that led to this evidence
     */
    getEvidenceChain(): Promise<IOR[]>;
}

export enum EvidenceType {
    EXECUTION_TRACE = 'execution_trace',
    STATE_SNAPSHOT = 'state_snapshot',
    BEHAVIOR_RECORDING = 'behavior_recording',
    PERFORMANCE_METRICS = 'performance_metrics',
    ERROR_CONTEXT = 'error_context',
    SUCCESS_CONTEXT = 'success_context',
    ENVIRONMENT_STATE = 'environment_state',
    COMMUNICATION_LOG = 'communication_log'
}

export interface ExecutionContext {
    timestamp: Date;
    environment: EnvironmentSnapshot;
    callStack: CallStackFrame[];
    variables: { [key: string]: any };
    systemState: SystemState;
    networkContext: NetworkContext;
}

export interface EvidenceMetadata {
    collectionMethod: string;
    collectionTool: string;
    accuracy: number;
    completeness: number;
    reliability: number;
    tags: string[];
}

export interface QualityInsight {
    insight: string;
    confidence: number;
    category: string;
    implications: string[];
}

export interface QualityPattern {
    pattern: string;
    frequency: number;
    significance: number;
    examples: IOR[];
}

export interface QualityTestimony {
    statement: string;
    facts: string[];
    confidence: number;
    limitations: string[];
}

export interface EnvironmentSnapshot {
    os: string;
    nodeVersion: string;
    dependencies: { [key: string]: string };
    environmentVariables: { [key: string]: string };
}

export interface CallStackFrame {
    function: string;
    file: string;
    line: number;
    column: number;
}

export interface SystemState {
    memory: MemoryUsage;
    cpu: CpuUsage;
    disk: DiskUsage;
    network: NetworkUsage;
}

export interface NetworkContext {
    connections: NetworkConnection[];
    traffic: NetworkTraffic[];
}

export interface MemoryUsage {
    used: number;
    available: number;
    total: number;
}

export interface CpuUsage {
    percentage: number;
    cores: number[];
}

export interface DiskUsage {
    used: number;
    available: number;
    total: number;
}

export interface NetworkUsage {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
}

export interface NetworkConnection {
    protocol: string;
    localAddress: string;
    remoteAddress: string;
    state: string;
}

export interface NetworkTraffic {
    timestamp: Date;
    direction: 'in' | 'out';
    size: number;
    protocol: string;
}

