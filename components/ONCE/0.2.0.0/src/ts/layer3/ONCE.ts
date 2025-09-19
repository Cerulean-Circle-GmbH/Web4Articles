/**
 * ONCE v0.2.0.0 - Object Network Communication Engine
 * Enhanced from 0.1.0.2 with server hierarchy and scenario-based configuration
 */

import { Scenario } from './Scenario.js';
import { Component } from './Component.js';
import { IOR } from './IOR.js';
import { LifecycleEventType, LifecycleEventHandler, LifecycleHooks } from './LifecycleEvents.js';
import { ONCEServerModel } from './ONCEServerModel.js';

/**
 * ONCE interface - Universal Object Network Communication Engine v0.2.0.0
 * Enhanced with server hierarchy and scenario-based configuration
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

    /**
     * Register lifecycle event handler
     * @param eventType - Type of lifecycle event
     * @param handler - Event handler function
     */
    on(eventType: LifecycleEventType, handler: LifecycleEventHandler): void;

    /**
     * Remove lifecycle event handler
     * @param eventType - Type of lifecycle event
     * @param handler - Event handler function to remove
     */
    off(eventType: LifecycleEventType, handler: LifecycleEventHandler): void;

    /**
     * Register lifecycle hooks for a component
     * @param component - Component to register hooks for
     * @param hooks - Lifecycle hooks
     */
    registerLifecycleHooks(component: Component, hooks: LifecycleHooks): void;

    /**
     * Pause a running component
     * @param component - Component to pause
     */
    pauseComponent(component: Component): Promise<void>;

    /**
     * Resume a paused component
     * @param component - Component to resume
     */
    resumeComponent(component: Component): Promise<void>;

    /**
     * Stop a component
     * @param component - Component to stop
     */
    stopComponent(component: Component): Promise<void>;

    // New in v0.2.0.0: Server hierarchy methods

    /**
     * Get current server model with all server instance information
     */
    getServerModel(): ONCEServerModel;

    /**
     * Start server with automatic port management (42777 → 8080+)
     */
    startServer(scenario?: Scenario): Promise<void>;

    /**
     * Register with primary server if this is a client server
     */
    registerWithPrimaryServer(): Promise<void>;

    /**
     * Check if this instance is the primary server (port 42777)
     */
    isPrimaryServer(): boolean;

    /**
     * Get all registered server instances (only available on primary server)
     */
    getRegisteredServers(): ONCEServerModel[];
}

/**
 * Environment information for platform detection
 */
export interface EnvironmentInfo {
    platform: 'browser' | 'node' | 'worker' | 'service-worker' | 'pwa' | 'iframe';
    version: string;
    capabilities: string[];
    isOnline: boolean;
    hostname?: string;  // New in v0.2.0.0
    ip?: string;       // New in v0.2.0.0
}

/**
 * Component discovery query
 */
export interface ComponentQuery {
    name?: string;
    version?: string;
    type?: string;
    capabilities?: string[];
    domain?: string;    // New in v0.2.0.0
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
    serversRegistered?: number;  // New in v0.2.0.0
}
