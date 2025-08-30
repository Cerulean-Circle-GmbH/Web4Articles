/**
 * QualityJudgment - Individual Quality Assessment Object
 * 
 * Represents a single quality assessment as a living object.
 * Each judgment contains the complete context, evidence, and reasoning
 * behind a quality decision. Judgments can hibernate, communicate with
 * other judgments, and evolve their understanding over time.
 * 
 * @philosophy Quality assessments are living, thinking objects
 * @web4compliance Empty constructor, scenario-based, hibernatable
 */

import { IOR } from './IOR';
import { QualityEvidence } from './QualityEvidence';
import { QualityScenario } from './QualityScenario';

export interface QualityJudgment {
    
    /**
     * Initializes judgment from a quality scenario
     */
    initialize(scenario: QualityScenario): Promise<void>;
    
    /**
     * Hibernates this judgment for future restoration
     */
    hibernate(): Promise<IOR>;
    
    /**
     * Restores judgment from hibernated state
     */
    restore(ior: IOR): Promise<void>;
    
    /**
     * Gets the target object that was assessed
     */
    getTarget(): any;
    
    /**
     * Gets the quality verdict (pass/fail/uncertain/evolving)
     */
    getVerdict(): QualityVerdict;
    
    /**
     * Gets the confidence level of this judgment (0.0 - 1.0)
     */
    getConfidence(): number;
    
    /**
     * Gets all evidence that supports this judgment
     */
    getEvidence(): QualityEvidence[];
    
    /**
     * Gets the reasoning chain behind this judgment
     */
    getReasoning(): QualityReasoning[];
    
    /**
     * Gets the timestamp of when this judgment was made
     */
    getTimestamp(): Date;
    
    /**
     * Gets the quality consciousness that made this judgment
     */
    getConsciousness(): IOR;
    
    /**
     * Challenges this judgment with new evidence
     * Judgments can change their verdict if convinced by evidence
     */
    challenge(newEvidence: QualityEvidence): Promise<boolean>;
    
    /**
     * Discusses this judgment with another judgment
     * Quality judgments can communicate and influence each other
     */
    discuss(otherJudgment: IOR): Promise<void>;
    
    /**
     * Evolves this judgment based on new insights
     */
    evolve(): Promise<void>;
    
    /**
     * Gets related judgments that influenced or were influenced by this one
     */
    getRelatedJudgments(): Promise<IOR[]>;
    
    /**
     * Applies this judgment's insights to improve similar future assessments
     */
    teachOthers(learners: IOR[]): Promise<void>;
}

export enum QualityVerdict {
    EXCELLENT = 'excellent',
    GOOD = 'good',
    ACCEPTABLE = 'acceptable',
    POOR = 'poor',
    CRITICAL = 'critical',
    UNCERTAIN = 'uncertain',
    EVOLVING = 'evolving'
}

export interface QualityReasoning {
    step: number;
    reasoning: string;
    evidence: QualityEvidence;
    confidence: number;
}
