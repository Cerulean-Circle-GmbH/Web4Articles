#!/usr/bin/env node
/**
 * WODAAnalyzerCLI - Command Line Interface for WODA Analyzer
 * Web4 pattern: CLI wrapper for component execution
 * Usage: wodaanalyzer [options]
 */

import { DefaultWODAAnalyzer } from '../layer2/DefaultWODAAnalyzer.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { WODAAnalyzerModel } from '../layer3/WODAAnalyzerModel.interface.js';

async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const config: Partial<WODAAnalyzerModel> = {
    projectRoot: process.cwd(),
    outputPath: 'scrum.pmo/roles/PDCAQualityAgent/pdca/woda-analysis-automated.md'
  };
  
  // Simple argument parsing
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--root':
      case '-r':
        config.projectRoot = args[++i];
        break;
      case '--output':
      case '-o':
        config.outputPath = args[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
      case '--version':
      case '-v':
        console.log('WODAAnalyzer v0.1.0.0');
        process.exit(0);
    }
  }
  
  // Create scenario
  const scenario: Scenario<WODAAnalyzerModel> = {
    model: config as WODAAnalyzerModel
  };
  
  // Initialize and run component
  const analyzer = new DefaultWODAAnalyzer();
  analyzer.init(scenario);
  
  try {
    await analyzer.process();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during analysis:', (error as Error).message);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
🎯 WODAAnalyzer - Git Branch Analysis & WODA Document Generator

USAGE:
  wodaanalyzer [options]

OPTIONS:
  -r, --root <path>     Project root directory (default: current directory)
  -o, --output <path>   Output file path (default: scrum.pmo/roles/PDCAQualityAgent/pdca/woda-analysis-automated.md)
  -h, --help            Show this help message
  -v, --version         Show version

EXAMPLES:
  # Analyze current project
  wodaanalyzer

  # Specify project root
  wodaanalyzer --root /path/to/project

  # Custom output path
  wodaanalyzer --output my-analysis.md

  # Full example
  wodaanalyzer --root /var/dev/Workspaces/2cuGitHub/Web4Articles --output analysis.md

WHAT IT DOES:
  1. Finds all Git branches not in release/dev or dev/0400
  2. Analyzes each branch (commits, files, age)
  3. Generates consistent WODA format (What, Overview, Details, Action)
  4. Writes complete markdown document

OUTPUT FORMAT:
  - Executive Summary
  - Priority categorization (CRITICAL/HIGH/MEDIUM/LOW)
  - Individual WODA section for each branch
  - GitHub links and metadata
  - Recommendations and questions

COMPONENT INFO:
  - Component: WODAAnalyzer
  - Version: 0.1.0.0
  - Architecture: Web4TSComponent
  - Layers: 5-layer architecture
`);
}

// Run CLI
main();

