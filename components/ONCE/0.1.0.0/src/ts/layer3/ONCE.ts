/**
 * ONCE - Object Network Communication Engine
 * The universal Web4ORB kernel for P2P distributed object communication
 * "ONCE and FOR ALL" - Universal kernel for all Web4 components
 */

import { Scenario } from './Scenario.js';
import { Component } from './Component.js';
import { IOR } from './IOR.js';

/**
 * ONCE interface - Universal Object Network Communication Engine
 * Implements Web4 patterns: empty constructor, scenario initialization, IOR references
 */
export interface ONCE {
    /**
     * Initialize ONCE kernel with scenario
     * Web4 pattern: Objects initialize from scenarios, not constructors
     */
    init(scenario?: Scenario): Promise<ONCE>;

    /**
     * Start a component by loading and initializing it
     * @param componentIOR - Internet Object Reference to component
     * @param scenario - Initial scenario for component
     */
    startComponent(componentIOR: IOR, scenario?: Scenario): Promise<Component>;

    /**
     * Save component state as scenario
     * @param component - Component to hibernate
     * @returns Scenario containing complete component state
     */
    saveAsScenario(component: Component): Promise<Scenario>;

    /**
     * Load component from scenario
     * @param scenario - Scenario containing component state
     * @returns Restored component instance
     */
    loadScenario(scenario: Scenario): Promise<Component>;

    /**
     * Get current environment information
     * Detects: Browser, Node.js, Worker, ServiceWorker, PWA, iframe
     */
    getEnvironment(): EnvironmentInfo;

    /**
     * Register component for discovery
     * @param component - Component to register
     * @param ior - Internet Object Reference for component
     */
    registerComponent(component: Component, ior: IOR): Promise<void>;

    /**
     * Discover components in the network
     * @param query - Discovery query parameters
     */
    discoverComponents(query?: ComponentQuery): Promise<IOR[]>;

    /**
     * Enable P2P communication with other ONCE kernels
     * @param peerIOR - IOR of peer ONCE kernel
     */
    connectPeer(peerIOR: IOR): Promise<void>;

    /**
     * Exchange scenarios with peer
     * @param peerIOR - Target peer
     * @param scenario - Scenario to send
     */
    exchangeScenario(peerIOR: IOR, scenario: Scenario): Promise<void>;

    /**
     * Hibernate ONCE kernel state
     * @returns Complete kernel state as scenario
     */
    toScenario(): Scenario;

    /**
     * Check if ONCE is initialized
     */
    isInitialized(): boolean;

    /**
     * Get ONCE kernel version
     */
    getVersion(): string;

    /**
     * Get performance metrics
     */
    getMetrics(): PerformanceMetrics;
}

/**
 * Environment information for platform detection
 */
export interface EnvironmentInfo {
    platform: 'browser' | 'node' | 'worker' | 'service-worker' | 'pwa' | 'iframe';
    version: string;
    capabilities: string[];
    isOnline: boolean;
}

/**
 * Component discovery query
 */
export interface ComponentQuery {
    name?: string;
    version?: string;
    type?: string;
    capabilities?: string[];
}

/**
 * Performance metrics for ONCE kernel
 */
export interface PerformanceMetrics {
    initializationTime: number;
    memoryUsage: number;
    componentsLoaded: number;
    peersConnected: number;
    scenariosExchanged: number;
}