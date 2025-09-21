#!/usr/bin/env node

/**
 * SessionSummaryCLI - SessionSummary component CLI implementation
 * Web4 pattern: Dependency-free CLI with session analysis and TRON extraction
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultSessionSummary } from '../layer2/DefaultSessionSummary.js';
import { basename } from 'path';

export class SessionSummaryCLI extends DefaultCLI {
  private sessionSummary: DefaultSessionSummary | null;

  constructor() {
    super(); // Call DefaultCLI constructor
    // Don't instantiate sessionSummary for usage display - command-based instantiation only
    this.sessionSummary = null;
    // Initialize with component class reference (NOT instance) - no garbage creation
    this.initWithComponentClass(DefaultSessionSummary, 'SessionSummary', '0.3.0.5');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new SessionSummaryCLI();
    await cli.execute(args);
  }

  private getOrCreateSessionSummary(): DefaultSessionSummary {
    if (!this.sessionSummary) {
      // Use lazy instantiation from DefaultCLI - only when method actually called
      this.sessionSummary = this.getComponentInstance() as DefaultSessionSummary;
    }
    return this.sessionSummary;
  }

  /**
   * SessionSummary-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    // Use new structured usage generation like requirement-v0.1.2.2
    console.log(this.generateStructuredUsage());
  }

  private async generateSessionSummary(sessionPath: string, outputFile?: string, enhanced: boolean = true): Promise<void> {
    try {
      // Get or create sessionSummary instance (command-based instantiation)
      const sessionSummary = this.getOrCreateSessionSummary();
      
      console.log(`🔍 Analyzing session: ${sessionPath}`);
      
      const result = sessionSummary.generateSummary({
        sessionPath,
        outputFile,
        includeDecisions: enhanced,
        format: 'table',
        branch: 'dev/2025-09-19-UTC-1657'
      });
      
      console.log(`✅ Session summary generated: ${result.generatedPath}`);
      console.log(`📊 Analyzed ${result.totalPDCAs} PDCA files`);
      
      if (enhanced) {
        console.log(`🔧 Enhanced format with QA Decisions column`);
      }
      
    } catch (error) {
      console.error(`❌ Error generating session summary: ${error}`);
      throw error;
    }
  }

  private async analyzeSession(sessionPath: string): Promise<void> {
    try {
      const sessionSummary = this.getOrCreateSessionSummary();
      const files = sessionSummary.findPDCAFiles(sessionPath);
      
      console.log(`📋 Session Analysis: ${basename(sessionPath)}`);
      console.log(`📁 Session Path: ${sessionPath}`);
      console.log(`📊 PDCA Files Found: ${files.length}`);
      
      for (const file of files.slice(0, 5)) { // Show first 5 files
        const analysis = sessionSummary.analyzePDCA(file);
        if (analysis) {
          console.log(`   ${analysis.utcTime} - ${analysis.filename} (${analysis.sha})`);
        }
      }
      
      if (files.length > 5) {
        console.log(`   ... and ${files.length - 5} more files`);
      }
      
    } catch (error) {
      console.error(`❌ Error analyzing session: ${error}`);
      throw error;
    }
  }

  /**
   * Execute method - required by DefaultCLI
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      await this.handleCommand(command, commandArgs);
    } catch (error) {
      console.error(`❌ Error executing command: ${error}`);
    }
  }

  /**
   * Enhanced command handling following Unit CLI pattern
   */
  async handleCommand(command: string, args: string[]): Promise<void> {
    switch (command) {
      case 'generate':
      case 'summary':
        if (args.length < 1) {
          console.error('❌ Error: Session path required');
          console.log('💡 Usage: sessionSummary generate <sessionPath> [outputFile]');
          return;
        }
        await this.generateSessionSummary(args[0], args[1], true);
        break;
        
      case 'basic':
        if (args.length < 1) {
          console.error('❌ Error: Session path required');
          console.log('💡 Usage: sessionSummary basic <sessionPath> [outputFile]');
          return;
        }
        await this.generateSessionSummary(args[0], args[1], false);
        break;
        
      case 'analyze':
        if (args.length < 1) {
          console.error('❌ Error: Session path required');
          console.log('💡 Usage: sessionSummary analyze <sessionPath>');
          return;
        }
        await this.analyzeSession(args[0]);
        break;
        
      case 'help':
      case '--help':
      case '-h':
        this.showUsage();
        break;
        
      default:
        // Default behavior: generate enhanced summary
        if (command) {
          await this.generateSessionSummary(command, args[0], true);
        } else {
          this.showUsage();
        }
        break;
    }
  }
}

// Web4 Radical OOP entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  SessionSummaryCLI.start(process.argv.slice(2));
}