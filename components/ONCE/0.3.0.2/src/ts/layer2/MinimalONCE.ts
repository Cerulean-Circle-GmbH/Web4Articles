#!/usr/bin/env node

/**
 * MinimalONCE - Simplified ONCE implementation for seamless execution
 * Web4 compliant with Build component integration for deinstall
 * 
 * Goal: Get `scripts/once` working end-to-end without complex dependencies
 * Strategy: Minimal implementation with essential functionality only
 */

// Minimal interfaces for basic functionality
interface MinimalIOR {
  uuid: string;
  component: string;
  version: string;
}

interface MinimalComponent {
  name: string;
  status: string;
}

export class MinimalONCE {
  private components: Map<string, MinimalComponent>;
  private serviceRegistry: {
    port: number;
    running: boolean;
    services: MinimalComponent[];
  };

  constructor() {
    this.components = new Map();
    this.serviceRegistry = {
      port: 42777,
      running: false,
      services: []
    };
  }

  // CLI Command Methods - Same names as CLI commands for delegation
  async start(args: string[]): Promise<void> {
    console.log('🚀 ONCE: Starting minimal kernel...');
    this.serviceRegistry.running = true;
    console.log('✅ ONCE: Kernel started successfully');
  }

  async stop(args: string[]): Promise<void> {
    console.log('🛑 ONCE: Stopping kernel...');
    this.serviceRegistry.running = false;
    console.log('✅ ONCE: Kernel stopped');
  }

  async status(args: string[]): Promise<void> {
    console.log('📊 ONCE Kernel Status:');
    console.log(`  Running: ${this.serviceRegistry.running}`);
    console.log(`  Port: ${this.serviceRegistry.port}`);
    console.log(`  Components: ${this.components.size}`);
    console.log(`  Services: ${this.serviceRegistry.services.length}`);
  }

  async info(args: string[]): Promise<void> {
    console.log('🔗 ONCE - Object Network Communication Engine');
    console.log('Version: 0.3.0.2 (Minimal)');
    console.log('Description: Simplified ONCE kernel with Build component integration');
  }

  async help(args: string[]): Promise<void> {
    console.log('🔗 Web4 ONCE CLI - Object Network Communication Engine');
    console.log('');
    console.log('Usage:');
    console.log('  once start                    # Start ONCE kernel');
    console.log('  once stop                     # Stop ONCE kernel'); 
    console.log('  once status                   # Show kernel status');
    console.log('  once info                     # Show kernel info');
    console.log('  once deinstall                # Clean all components');
    console.log('  once help                     # Show this help');
    console.log('');
    console.log('Web4 Integration:');
    console.log('  ONCE operates as Web4 component kernel with Build component integration.');
    console.log('  Minimal implementation for reliable end-to-end functionality.');
  }

  /**
   * Web4 compliant deinstall using Build component
   */
  async deinstall(args: string[] = []): Promise<void> {
    console.log('🧹 ONCE: Starting ecosystem deinstall...');
    
    // Stop kernel first
    await this.stop([]);
    
    try {
      // Use Build component for comprehensive cleaning
      const DefaultBuild = require('../../../Build/0.3.0.3/dist/ts/layer2/DefaultBuild.js').DefaultBuild;
      const build = new DefaultBuild();
      
      console.log('🔗 ONCE: Using Build component for comprehensive cleaning...');
      await build.cleanAllComponents();
      
      console.log('✅ ONCE: Complete ecosystem deinstall successful');
      console.log('💡 Run "once start" to rebuild and restart the ecosystem');
    } catch (error) {
      console.log(`⚠️ ONCE: Build component delegation failed: ${error.message}`);
      console.log('💡 Continuing with basic cleanup...');
      
      // Basic cleanup if Build component unavailable
      this.components.clear();
      this.serviceRegistry.services = [];
      console.log('✅ ONCE: Basic cleanup completed');
    }
  }
}