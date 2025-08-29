#!/usr/bin/env node
/**
 * ONCE CLI - Command Line Interface for ONCE kernel
 * Web4 pattern: Location-resilient CLI with empty constructor
 */

import { DefaultONCE } from '../layer2/DefaultONCE.js';
import { DefaultIOR, DefaultNetworkLocation } from '../layer2/DefaultIOR.js';
import { LifecycleEventType } from '../layer3/LifecycleEvents.js';

export class ONCECLI {
    private once?: DefaultONCE;

    constructor() {
        // Empty constructor - Web4 pattern
    }

    async init(): Promise<void> {
        // Get ONCE instance
        this.once = DefaultONCE.getInstance();
        
        // Initialize ONCE kernel
        await this.once.init();

        // Register CLI event handlers
        this.registerEventHandlers();
    }

    private registerEventHandlers(): void {
        // Log lifecycle events
        this.once!.on(LifecycleEventType.AFTER_INIT, async (event) => {
            console.log(`✅ Component initialized: ${event.component?.getName()}`);
        });

        this.once!.on(LifecycleEventType.AFTER_START, async (event) => {
            console.log(`🚀 Component started: ${event.component?.getName()}`);
        });

        this.once!.on(LifecycleEventType.ERROR, async (event) => {
            console.error(`❌ Error: ${event.error?.message}`);
        });
    }

    async run(args: string[]): Promise<void> {
        const command = args[0] || 'help';

        try {
            switch (command) {
                case 'info':
                    await this.showInfo();
                    break;
                
                case 'env':
                    await this.showEnvironment();
                    break;
                
                case 'metrics':
                    await this.showMetrics();
                    break;
                
                case 'start':
                    await this.startComponent(args.slice(1));
                    break;
                
                case 'discover':
                    await this.discoverComponents(args.slice(1));
                    break;
                
                case 'connect':
                    await this.connectPeer(args.slice(1));
                    break;
                
                case 'help':
                default:
                    this.showHelp();
                    break;
            }
        } catch (error) {
            console.error('❌ Error:', error);
            process.exit(1);
        }
    }

    private async showInfo(): Promise<void> {
        console.log('🌟 ONCE - Object Network Communication Engine');
        console.log('Version:', this.once!.getVersion());
        console.log('Status:', this.once!.isInitialized() ? 'Initialized' : 'Not initialized');
    }

    private async showEnvironment(): Promise<void> {
        const env = this.once!.getEnvironment();
        console.log('🌍 Environment Information:');
        console.log('Platform:', env.platform);
        console.log('Version:', env.version);
        console.log('Capabilities:', env.capabilities.join(', '));
        console.log('Online:', env.isOnline ? 'Yes' : 'No');
    }

    private async showMetrics(): Promise<void> {
        const metrics = this.once!.getMetrics();
        console.log('📊 Performance Metrics:');
        console.log('Initialization Time:', `${metrics.initializationTime}ms`);
        console.log('Memory Usage:', `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
        console.log('Components Loaded:', metrics.componentsLoaded);
        console.log('Peers Connected:', metrics.peersConnected);
        console.log('Scenarios Exchanged:', metrics.scenariosExchanged);
    }

    private async startComponent(args: string[]): Promise<void> {
        if (args.length < 2) {
            console.error('Usage: once start <component-type> <uuid> [host] [port]');
            return;
        }

        const objectType = args[0];
        const uuid = args[1];
        const host = args[2] || 'localhost';
        const port = args[3] ? parseInt(args[3]) : undefined;

        // Create IOR
        const location = DefaultNetworkLocation.create('web4', host, port);
        const ior = DefaultIOR.create(objectType, uuid, location);

        console.log(`🔄 Starting component: ${ior.toURL()}`);
        
        try {
            const component = await this.once!.startComponent(ior);
            console.log(`✅ Component started: ${component.getName()} v${component.getVersion()}`);
        } catch (error) {
            console.error(`❌ Failed to start component: ${error}`);
        }
    }

    private async discoverComponents(args: string[]): Promise<void> {
        console.log('🔍 Discovering components...');
        
        const query = args.length > 0 ? { name: args[0] } : undefined;
        const iors = await this.once!.discoverComponents(query);

        if (iors.length === 0) {
            console.log('No components found');
        } else {
            console.log(`Found ${iors.length} component(s):`);
            for (const ior of iors) {
                console.log(`  - ${ior.toURL()}`);
            }
        }
    }

    private async connectPeer(args: string[]): Promise<void> {
        if (args.length < 1) {
            console.error('Usage: once connect <peer-ior-url>');
            return;
        }

        const iorString = args[0];
        const ior = new DefaultIOR().parse(iorString);

        console.log(`🔗 Connecting to peer: ${ior.toURL()}`);
        
        try {
            await this.once!.connectPeer(ior);
            console.log('✅ Connected to peer');
        } catch (error) {
            console.error(`❌ Failed to connect: ${error}`);
        }
    }

    private showHelp(): void {
        console.log(`
🌟 ONCE CLI - Object Network Communication Engine

Usage: once <command> [options]

Commands:
  info                Show ONCE kernel information
  env                 Show environment capabilities
  metrics             Show performance metrics
  start <type> <uuid> Start a component
  discover [name]     Discover available components
  connect <ior>       Connect to peer ONCE kernel
  help                Show this help message

Examples:
  once info
  once env
  once metrics
  once start MyComponent 123e4567-e89b-12d3-a456-426614174000
  once discover
  once connect web4://peer.example.com:8080/once/456e7890-a12b-34c5-d678-901234567890

Web4 Architecture:
  - Empty constructors with scenario initialization
  - Internet Object References (IOR) for distributed objects
  - P2P scenario exchange between ONCE kernels
  - Multi-platform deployment (browser, node, worker, pwa)

"ONCE and FOR ALL" - Universal kernel for all Web4 components
        `);
    }
}

// Main entry point
if (import.meta.url === `file://${process.argv[1]}`) {
    const cli = new ONCECLI();
    cli.init().then(() => {
        cli.run(process.argv.slice(2));
    }).catch(error => {
        console.error('Failed to initialize ONCE CLI:', error);
        process.exit(1);
    });
}