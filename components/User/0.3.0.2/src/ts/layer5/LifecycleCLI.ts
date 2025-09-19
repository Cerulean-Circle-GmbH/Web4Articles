#!/usr/bin/env node

/**
 * Web4 User Component Lifecycle CLI
 * Entry point for lifecycle management commands
 */

import { EnvironmentChecker } from '../layer4/EnvironmentChecker.js';
import { DependencyChecker } from '../layer4/DependencyChecker.js';
import { ComponentDocumentationGenerator } from '../layer4/ComponentDocumentationGenerator.js';

export class LifecycleCLI {
    private command: string;
    
    constructor() {
        // Empty constructor - Web4 principle
        this.command = process.argv[2] || '';
    }

    public async run(): Promise<void> {
        try {
            switch (this.command) {
                case 'check-environment':
                    await this.checkEnvironment();
                    break;
                case 'check-dependencies':
                    await this.checkDependencies();
                    break;
                case 'generate-docs':
                    await this.generateDocs();
                    break;
                default:
                    this.showHelp();
            }
        } catch (error: any) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }
    }

    private async checkEnvironment(): Promise<void> {
        const checker = new EnvironmentChecker();
        const success = await checker.check();
        process.exit(success ? 0 : 1);
    }

    private async checkDependencies(): Promise<void> {
        const checker = new DependencyChecker();
        const success = await checker.check();
        process.exit(success ? 0 : 1);
    }

    private async generateDocs(): Promise<void> {
        const generator = new ComponentDocumentationGenerator();
        await generator.generate();
    }

    private showHelp(): void {
        console.log(`
Web4 User Component Lifecycle Management

Usage:
  lifecycle check-environment    Check environment setup
  lifecycle check-dependencies   Check component dependencies
  lifecycle generate-docs        Generate component documentation

Commands are implemented as TypeScript OOP classes in layer4.
        `);
    }
}

// Run CLI
const cli = new LifecycleCLI();
cli.run();