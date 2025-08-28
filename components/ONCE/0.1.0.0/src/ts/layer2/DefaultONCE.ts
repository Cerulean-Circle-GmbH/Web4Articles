/**
 * DefaultONCE - Default implementation of ONCE kernel
 * Web4 pattern: Empty constructor with lazy initialization
 */

import { ONCE, EnvironmentInfo, ComponentQuery, PerformanceMetrics } from '../layer3/ONCE.js';
import { Scenario } from '../layer3/Scenario.js';
import { Component } from '../layer3/Component.js';
import { IOR } from '../layer3/IOR.js';
import { ComponentRegistry } from './ComponentRegistry.js';
import { EnvironmentDetector } from './EnvironmentDetector.js';
import { ScenarioManager } from './ScenarioManager.js';
import { PeerManager } from './PeerManager.js';
import { DefaultIOR } from './DefaultIOR.js';

/**
 * Default implementation of ONCE kernel
 * Implements Web4 empty constructor with lazy initialization pattern
 */
export class DefaultONCE implements ONCE {
    private static instance: DefaultONCE | null = null;
    private initialized: boolean = false;
    private initializationTime: number = 0;
    private scenario?: Scenario;
    
    // Lazy-initialized components
    private componentRegistry?: ComponentRegistry;
    private environmentDetector?: EnvironmentDetector;
    private scenarioManager?: ScenarioManager;
    private peerManager?: PeerManager;

    /**
     * Web4 Empty Constructor - no dependencies, no initialization
     */
    constructor() {
        // Empty constructor as per Web4 pattern
        // All initialization happens in init() method
    }

    /**
     * Get ONCE instance with lazy initialization
     * Web4 pattern: Empty constructor with lazy init on first use
     */
    static getInstance(): DefaultONCE {
        if (!DefaultONCE.instance) {
            DefaultONCE.instance = new DefaultONCE();
        }
        return DefaultONCE.instance;
    }

    /**
     * Initialize ONCE kernel with optional scenario
     */
    async init(scenario?: Scenario): Promise<ONCE> {
        const startTime = Date.now();

        if (this.initialized) {
            return this;
        }

        // Initialize from scenario if provided
        if (scenario) {
            this.scenario = scenario;
            await this.loadFromScenario(scenario);
        } else {
            // Default initialization
            await this.initializeDefaults();
        }

        this.initialized = true;
        this.initializationTime = Date.now() - startTime;

        // Ensure < 100ms initialization as per requirements
        if (this.initializationTime > 100) {
            console.warn(`ONCE initialization took ${this.initializationTime}ms (target: < 100ms)`);
        }

        return this;
    }

    /**
     * Initialize with default configuration
     */
    private async initializeDefaults(): Promise<void> {
        // Lazy initialize components
        this.componentRegistry = new ComponentRegistry();
        this.environmentDetector = new EnvironmentDetector();
        this.scenarioManager = new ScenarioManager();
        this.peerManager = new PeerManager();

        // Initialize each component
        await this.componentRegistry.init();
        await this.environmentDetector.init();
        await this.scenarioManager.init();
        await this.peerManager.init();
    }

    /**
     * Load ONCE state from scenario
     */
    private async loadFromScenario(scenario: Scenario): Promise<void> {
        // Validate scenario type
        if (scenario.objectType !== 'ONCE') {
            throw new Error(`Invalid scenario type: ${scenario.objectType}, expected: ONCE`);
        }

        // Restore state from scenario
        const state = scenario.state;

        // Initialize components with saved state
        this.componentRegistry = new ComponentRegistry();
        await this.componentRegistry.init(state.componentRegistry);

        this.environmentDetector = new EnvironmentDetector();
        await this.environmentDetector.init();

        this.scenarioManager = new ScenarioManager();
        await this.scenarioManager.init(state.scenarioManager);

        this.peerManager = new PeerManager();
        await this.peerManager.init(state.peerManager);
    }

    /**
     * Start a component
     */
    async startComponent(componentIOR: IOR, scenario?: Scenario): Promise<Component> {
        this.ensureInitialized();

        // Resolve component from IOR
        const ComponentClass = await componentIOR.resolve();
        
        // Create instance with empty constructor
        const component = new ComponentClass();
        
        // Initialize with scenario
        await component.init(scenario);

        // Register component
        await this.componentRegistry!.register(component, componentIOR);

        return component;
    }

    /**
     * Save component as scenario
     */
    async saveAsScenario(component: Component): Promise<Scenario> {
        this.ensureInitialized();
        return this.scenarioManager!.saveComponent(component);
    }

    /**
     * Load component from scenario
     */
    async loadScenario(scenario: Scenario): Promise<Component> {
        this.ensureInitialized();
        return this.scenarioManager!.loadComponent(scenario);
    }

    /**
     * Get environment information
     */
    getEnvironment(): EnvironmentInfo {
        this.ensureInitialized();
        return this.environmentDetector!.getEnvironment();
    }

    /**
     * Register component
     */
    async registerComponent(component: Component, ior: IOR): Promise<void> {
        this.ensureInitialized();
        await this.componentRegistry!.register(component, ior);
    }

    /**
     * Discover components
     */
    async discoverComponents(query?: ComponentQuery): Promise<IOR[]> {
        this.ensureInitialized();
        return this.componentRegistry!.discover(query);
    }

    /**
     * Connect to peer ONCE kernel
     */
    async connectPeer(peerIOR: IOR): Promise<void> {
        this.ensureInitialized();
        await this.peerManager!.connect(peerIOR);
    }

    /**
     * Exchange scenario with peer
     */
    async exchangeScenario(peerIOR: IOR, scenario: Scenario): Promise<void> {
        this.ensureInitialized();
        await this.peerManager!.exchangeScenario(peerIOR, scenario);
    }

    /**
     * Hibernate ONCE kernel to scenario
     */
    toScenario(): Scenario {
        this.ensureInitialized();

        return {
            uuid: this.generateUUID(),
            objectType: 'ONCE',
            version: this.getVersion(),
            state: {
                componentRegistry: this.componentRegistry!.toScenario(),
                scenarioManager: this.scenarioManager!.toScenario(),
                peerManager: this.peerManager!.toScenario()
            },
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                description: 'ONCE kernel state'
            }
        };
    }

    /**
     * Check initialization status
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Get ONCE version
     */
    getVersion(): string {
        return '0.1.0.0';
    }

    /**
     * Get performance metrics
     */
    getMetrics(): PerformanceMetrics {
        this.ensureInitialized();

        return {
            initializationTime: this.initializationTime,
            memoryUsage: this.getMemoryUsage(),
            componentsLoaded: this.componentRegistry!.getCount(),
            peersConnected: this.peerManager!.getConnectedCount(),
            scenariosExchanged: this.peerManager!.getExchangedCount()
        };
    }

    /**
     * Ensure ONCE is initialized
     */
    private ensureInitialized(): void {
        if (!this.initialized) {
            throw new Error('ONCE not initialized. Call init() first.');
        }
    }

    /**
     * Get memory usage in bytes
     */
    private getMemoryUsage(): number {
        if (typeof process !== 'undefined' && process.memoryUsage) {
            return process.memoryUsage().heapUsed;
        }
        // Browser environment - estimate
        return (performance as any).memory?.usedJSHeapSize || 0;
    }

    /**
     * Generate UUID v4
     */
    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}