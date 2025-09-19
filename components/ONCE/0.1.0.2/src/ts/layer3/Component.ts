/**
 * Component - Web4 component interface
 * All Web4 components implement this interface
 */

import { Scenario } from './Scenario.js';

/**
 * Base interface for all Web4 components
 * Implements hibernation/restoration pattern
 */
export interface Component {
    /**
     * Component name
     */
    getName(): string;

    /**
     * Component version
     */
    getVersion(): string;

    /**
     * Initialize component from scenario
     * Web4 pattern: empty constructor + scenario initialization
     */
    init(scenario?: Scenario): Promise<Component>;

    /**
     * Hibernate component state to scenario
     */
    toScenario(): Scenario;

    /**
     * Check if component is initialized
     */
    isInitialized(): boolean;

    /**
     * Get component capabilities
     */
    getCapabilities(): string[];

    /**
     * Shutdown component cleanly
     */
    shutdown(): Promise<void>;
}