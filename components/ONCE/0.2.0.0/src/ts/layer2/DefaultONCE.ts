/**
 * DefaultONCE v0.2.0.0 - Enhanced ONCE implementation with server hierarchy
 * Eliminates environment variable dependencies (requirement 6707a628-bf3b-4dd4-a750-562f9f0c5fa4)
 */

import { ONCE, EnvironmentInfo, ComponentQuery, PerformanceMetrics } from '../layer3/ONCE.js';
import { Scenario } from '../layer3/Scenario.js';
import { Component } from '../layer3/Component.js';
import { IOR } from '../layer3/IOR.js';
import { LifecycleEventType, LifecycleEventHandler, LifecycleHooks, LifecycleState } from '../layer3/LifecycleEvents.js';
import { ONCEServerModel } from '../layer3/ONCEServerModel.js';
import { ServerHierarchyManager } from './ServerHierarchyManager.js';
import { ScenarioManager } from './ScenarioManager.js';

/**
 * DefaultONCE v0.2.0.0 - No environment variables, scenario-driven configuration
 */
export class DefaultONCE implements ONCE {
    private static instance: DefaultONCE | null = null;
    private initialized: boolean = false;
    private initializationTime: number = 0;
    private scenario?: Scenario;
    
    // Enhanced managers for v0.2.0.0
    private serverHierarchyManager: ServerHierarchyManager;
    private scenarioManager: ScenarioManager;
    private eventHandlers: Map<LifecycleEventType, LifecycleEventHandler[]> = new Map();

    /**
     * Web4 Empty Constructor - no dependencies, no initialization
     * No environment variables used
     */
    constructor(projectRoot?: string) {
        // Empty constructor as per Web4 pattern
        // All initialization happens in init() method
        this.serverHierarchyManager = new ServerHierarchyManager();
        this.scenarioManager = new ScenarioManager(projectRoot);
    }

    /**
     * Get ONCE instance with lazy initialization
     */
    static getInstance(projectRoot?: string): DefaultONCE {
        if (!DefaultONCE.instance) {
            DefaultONCE.instance = new DefaultONCE(projectRoot);
        }
        return DefaultONCE.instance;
    }

    /**
     * Initialize ONCE kernel with optional scenario
     * No environment variables - pure scenario-based initialization
     */
    async init(scenario?: Scenario): Promise<ONCE> {
        const startTime = Date.now();

        if (this.initialized) {
            return this;
        }

        console.log('🚀 Initializing ONCE v0.2.0.0...');

        try {
            // Initialize from scenario if provided
            if (scenario) {
                console.log(`📂 Loading from scenario: ${scenario.uuid}`);
                this.scenario = scenario;
                await this.loadFromScenario(scenario);
            } else {
                // Default initialization - no environment variables
                console.log('🔧 Default initialization (no environment variables)');
                await this.initializeDefaults();
            }

            this.initialized = true;
            this.initializationTime = Date.now() - startTime;

            // Emit after-init event
            await this.emitEvent(LifecycleEventType.AFTER_INIT, {
                initializationTime: this.initializationTime
            });

            console.log(`✅ ONCE v0.2.0.0 initialized in ${this.initializationTime}ms`);

            return this;
        } catch (error) {
            console.error('❌ ONCE initialization failed:', error);
            await this.emitEvent(LifecycleEventType.ERROR, { error });
            throw error;
        }
    }

    /**
     * Initialize with default configuration (no environment variables)
     */
    private async initializeDefaults(): Promise<void> {
        // No environment variables - all defaults are hardcoded or detected
        console.log('🏗️ Setting up default ONCE configuration');
    }

    /**
     * Load ONCE from scenario
     */
    private async loadFromScenario(scenario: Scenario): Promise<void> {
        if (scenario.objectType !== 'ONCE') {
            throw new Error(`Invalid scenario type: ${scenario.objectType}`);
        }

        // Load server model from scenario
        const serverModel = this.scenarioManager.createServerModelFromScenario(scenario);
        console.log(`🔄 Loaded server model from scenario: ${serverModel.uuid}`);
    }

    /**
     * Start server with automatic port management
     */
    async startServer(scenario?: Scenario): Promise<void> {
        console.log('🚀 Starting ONCE server...');
        
        await this.emitEvent(LifecycleEventType.BEFORE_START);
        
        try {
            // Initialize if not already initialized
            if (!this.initialized) {
                await this.init(scenario);
            }

            // Start server hierarchy
            await this.serverHierarchyManager.startServer();
            
            // Save current state as scenario
            const currentScenario = this.createCurrentScenario();
            await this.scenarioManager.saveScenario(currentScenario);
            
            await this.emitEvent(LifecycleEventType.AFTER_START);
            
        } catch (error) {
            await this.emitEvent(LifecycleEventType.ERROR, { error });
            throw error;
        }
    }

    /**
     * Register with primary server if this is a client server
     */
    async registerWithPrimaryServer(): Promise<void> {
        // Handled by ServerHierarchyManager
        console.log('📋 Registration handled by ServerHierarchyManager');
    }

    /**
     * Check if this instance is the primary server
     */
    isPrimaryServer(): boolean {
        return this.serverHierarchyManager.isPrimaryServer();
    }

    /**
     * Get all registered server instances
     */
    getRegisteredServers(): ONCEServerModel[] {
        return this.serverHierarchyManager.getRegisteredServers();
    }

    /**
     * Get current server model
     */
    getServerModel(): ONCEServerModel {
        return this.serverHierarchyManager.getServerModel();
    }

    /**
     * Create scenario from current state
     */
    private createCurrentScenario(): Scenario {
        const serverModel = this.serverHierarchyManager.getServerModel();
        return this.scenarioManager.createScenarioFromServerModel(serverModel);
    }

    /**
     * Emit lifecycle event
     */
    private async emitEvent(eventType: LifecycleEventType, data?: any): Promise<void> {
        const handlers = this.eventHandlers.get(eventType) || [];
        const event = {
            type: eventType,
            timestamp: new Date().toISOString(),
            data
        };

        for (const handler of handlers) {
            try {
                await handler(event);
            } catch (error) {
                console.error(`❌ Event handler error for ${eventType}:`, error);
            }
        }
    }

    // Placeholder implementations for ONCE interface methods

    async startComponent(componentIOR: IOR, scenario?: Scenario): Promise<Component> {
        throw new Error('startComponent not implemented in v0.2.0.0');
    }

    async saveAsScenario(component: Component): Promise<Scenario> {
        throw new Error('saveAsScenario not implemented in v0.2.0.0');
    }

    async loadScenario(scenario: Scenario): Promise<Component> {
        throw new Error('loadScenario not implemented in v0.2.0.0');
    }

    getEnvironment(): EnvironmentInfo {
        return {
            platform: 'node',
            version: process.version,
            capabilities: ['server', 'websocket', 'p2p'],
            isOnline: true,
            hostname: this.detectHostname(),
            ip: '127.0.0.1'
        };
    }

    async registerComponent(component: Component, ior: IOR): Promise<void> {
        console.log(`📋 Component registration: ${component.uuid}`);
    }

    async discoverComponents(query?: ComponentQuery): Promise<IOR[]> {
        return [];
    }

    async connectPeer(peerIOR: IOR): Promise<void> {
        console.log(`🤝 Peer connection: ${peerIOR.uuid}`);
    }

    async exchangeScenario(peerIOR: IOR, scenario: Scenario): Promise<void> {
        console.log(`🔄 Scenario exchange with ${peerIOR.uuid}`);
    }

    toScenario(): Scenario {
        return this.createCurrentScenario();
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    getVersion(): string {
        return '0.2.0.0';
    }

    getMetrics(): PerformanceMetrics {
        return {
            initializationTime: this.initializationTime,
            memoryUsage: process.memoryUsage().heapUsed,
            componentsLoaded: 0,
            peersConnected: 0,
            scenariosExchanged: 0,
            serversRegistered: this.getRegisteredServers().length
        };
    }

    on(eventType: LifecycleEventType, handler: LifecycleEventHandler): void {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType)!.push(handler);
    }

    off(eventType: LifecycleEventType, handler: LifecycleEventHandler): void {
        const handlers = this.eventHandlers.get(eventType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    registerLifecycleHooks(component: Component, hooks: LifecycleHooks): void {
        console.log(`🎣 Lifecycle hooks registered for ${component.uuid}`);
    }

    async pauseComponent(component: Component): Promise<void> {
        console.log(`⏸️ Pausing component: ${component.uuid}`);
    }

    async resumeComponent(component: Component): Promise<void> {
        console.log(`▶️ Resuming component: ${component.uuid}`);
    }

    async stopComponent(component: Component): Promise<void> {
        console.log(`⏹️ Stopping component: ${component.uuid}`);
    }

    /**
     * Stop server gracefully
     */
    async stopServer(): Promise<void> {
        await this.emitEvent(LifecycleEventType.BEFORE_STOP);
        
        await this.serverHierarchyManager.stopServer();
        
        await this.emitEvent(LifecycleEventType.AFTER_STOP);
    }

    /**
     * Detect hostname without environment variables
     */
    private detectHostname(): string {
        try {
            const os = require('os');
            return os.hostname();
        } catch {
            return 'localhost';
        }
    }
}
