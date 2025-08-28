/**
 * Web4TSComponent CLI - Web4 Architecture Layer 5
 * Command-line interface for Web4 TypeScript component standards
 * Version 0.1.0.2 - Simplified commands with Occam's Razor applied
 */

import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

export class Web4TSComponentCLI {
  private component: DefaultWeb4TSComponent;

  constructor() {
    this.component = new DefaultWeb4TSComponent();
    // Find project root automatically
    this.findProjectRoot().then(root => {
      if (root) {
        this.component.setTargetDirectory(root);
      }
    });
  }

  private async findProjectRoot(): Promise<string | null> {
    let dir = process.cwd();
    while (dir !== '/') {
      if (existsSync(path.join(dir, '.git')) && existsSync(path.join(dir, 'package.json'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    return null;
  }

  async handleCommand(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];

    try {
      switch (command) {
        case 'new':
          await this.handleNew(args.slice(1));
          break;
        case 'cli':
        case 'generate':
          await this.handleGenerateCLI(args.slice(1));
          break;
        case 'validate':
          await this.handleValidateStandard(args.slice(1));
          break;
        case 'audit':
          await this.handleAuditCompliance(args.slice(1));
          break;
        case 'report':
          await this.handleGenerateReport(args.slice(1));
          break;
        case 'standard':
          this.handleShowStandard();
          break;
        case 'guide':
        case 'guidelines':
          this.handleShowGuidelines();
          break;
        default:
          console.log(`❌ Unknown command: ${command}`);
          this.showUsage();
          break;
      }
    } catch (error) {
      console.error(`❌ Error executing command: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private showUsage(): void {
    // Match requirement-v0.1.2.2 clean styling - minimal colors, focus on clarity
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${cyan}Web4TSComponent CLI${reset} - TypeScript Component Standards & Architecture Compliance`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} new "component-name" "version" [options]    # Create Web4-compliant component`);
    console.log(`  ${cyan}web4tscomponent${reset} cli "component-name" "version"             # Generate location-resilient CLI`);
    console.log(`  ${cyan}web4tscomponent${reset} validate "script-path"                     # Validate CLI against Web4 standard`);
    console.log(`  ${cyan}web4tscomponent${reset} audit "component-path"                     # Audit component for Web4 compliance`);
    console.log(`  ${cyan}web4tscomponent${reset} report "component-dir"                     # Generate compliance report`);
    console.log(`  ${cyan}web4tscomponent${reset} standard                                   # Display location-resilient CLI standard`);
    console.log(`  ${cyan}web4tscomponent${reset} guide                                      # Display Web4 architecture guidelines`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  new          Create complete Web4-compliant component with layered architecture`);
    console.log(`  cli          Generate location-resilient CLI script following Web4 standard`);
    console.log(`  validate     Validate existing CLI script against Web4 location-resilient standard`);
    console.log(`  audit        Audit existing component for Web4 architectural compliance`);
    console.log(`  report       Generate comprehensive compliance report for component directory`);
    console.log(`  standard     Display complete location-resilient CLI implementation standard`);
    console.log(`  guide        Display Web4 architectural principles and guidelines`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}"component-name"${reset}  Component name (e.g., "Web4Example", "MyNewComponent", "UserManager")`);
    console.log(`  ${yellow}"version"${reset}         Semantic version (e.g., "0.1.0.0", "1.0.0.0", "0.2.1.3")`);
    console.log(`  ${yellow}"script-path"${reset}     Path to CLI script file (e.g., "scripts/versions/requirement0.1.3.0")`);
    console.log(`  ${yellow}"component-path"${reset}  Path to component directory (e.g., "components/Web4Requirement/0.1.3.0")`);
    console.log(`  ${yellow}"component-dir"${reset}   Directory containing components (e.g., "components/", "./components")`);
    console.log(`  ${yellow}[options]${reset}         Scaffold options: --cli --spec --vitest --layers`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${green}# Create new Web4-compliant component${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} new ${yellow}"MyNewComponent"${reset} ${yellow}"0.1.0.0"${reset} --cli --spec --layers`);
    console.log(`  ${cyan}web4tscomponent${reset} new ${yellow}"DataProcessor"${reset} ${yellow}"1.0.0.0"${reset} --cli --spec`);
    console.log(`  ${cyan}web4tscomponent${reset} new ${yellow}"WebService"${reset} ${yellow}"0.3.0.0"${reset} --layers --vitest`);
    console.log('');
    console.log(`  ${green}# Generate location-resilient CLI${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} cli ${yellow}"Web4Example"${reset} ${yellow}"0.1.0.0"${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} cli ${yellow}"UserManager"${reset} ${yellow}"1.2.3.4"${reset}`);
    console.log('');
    console.log(`  ${green}# Validate and audit${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} validate ${yellow}"scripts/versions/requirement0.1.3.0"${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} audit ${yellow}"components/Web4Requirement/0.1.3.0"${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} report ${yellow}"components/"${reset}`);
    console.log('');
    console.log(`  ${green}# Documentation${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} standard`);
    console.log(`  ${cyan}web4tscomponent${reset} guide`);
    console.log('');
    console.log(`${bold}Scaffold Options:${reset}`);
    console.log(`  --cli              Include location-resilient CLI script (follows Web4 standard)`);
    console.log(`  --spec             Include spec/requirements and spec/requirements.md folders`);
    console.log(`  --vitest           Include Vitest configuration (Web4 testing standard)`);
    console.log(`  --layers           Include full layer architecture (layer2, layer3, layer5)`);
    console.log('');
    console.log(`${bold}Web4 Architecture Principles:${reset}`);
    console.log(`  • Empty Constructor Principle: All generated classes use empty constructors`);
    console.log(`  • Scenario-First Development: Components support hibernation/restoration`);
    console.log(`  • IOR Architecture: Version-specific component path resolution`);
    console.log(`  • Semantic Invariants: Location-resilient operation from any directory`);
    console.log(`  • Layered Architecture: Clear separation of concerns across layers`);
    console.log(`  • Location-Resilient CLIs: All generated scripts work from any directory`);
    console.log('');
    console.log(`For detailed documentation: ${cyan}https://github.com/Cerulean-Circle-GmbH/Web4Articles${reset}`);
    console.log(`${bold}Web4 Architecture:${reset} ${green}Semantic invariants, location independence, universal patterns${reset}`);
  }
  
  private async handleNew(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent new "component-name" "version" [options]`);
      return;
    }

    const componentName = args[0];
    const version = args[1];
    const options = args.slice(2);

    console.log(`🔨 Creating Web4-compliant component ${componentName} v${version}...`);

    // Parse scaffold options
    const includeSpecs = options.includes('--spec');
    const includeVitest = options.includes('--vitest');
    const includeCLI = options.includes('--cli');
    const includeLayers = options.includes('--layers');

    try {
      const metadata = await this.component.scaffoldComponent({
        componentName,
        version,
        includeLayerArchitecture: includeLayers,
        includeCLI,
        includeSpecFolder: includeSpecs,
        includeVitest
      });
      console.log(`✅ Successfully created ${componentName} v${version}`);
      console.log(`📁 Location: components/${componentName}/${version}/`);
      if (includeCLI) {
        console.log(`🔗 CLI script: ${componentName.toLowerCase()}${version}.sh`);
      }
    } catch (error) {
      console.error(`❌ Failed to create component: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleGenerateCLI(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent cli "component-name" "version"`);
      return;
    }

    const componentName = args[0];
    const version = args[1];

    console.log(`🔨 Generating location-resilient CLI for ${componentName} v${version}...`);

    try {
    const cliScript = await this.component.generateLocationResilientCLI(componentName, version);
      console.log(`✅ Generated CLI script: ${componentName.toLowerCase()}${version}.sh`);
    console.log(`📋 Script follows Web4 location-resilient standard`);
      console.log(`🚀 Usage: ./${componentName.toLowerCase()}${version}.sh [command] [options]`);
    } catch (error) {
      console.error(`❌ Failed to generate CLI: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleValidateStandard(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent validate "script-path"`);
      return;
    }

    const scriptPath = args[0];
    console.log(`🔍 Validating CLI script: ${scriptPath}`);

    try {
    const validation = await this.component.validateLocationResilientCLI(scriptPath);
      if (validation.isCompliant) {
        console.log(`✅ CLI script is Web4 location-resilient compliant`);
        console.log(`📋 All required features detected`);
      } else {
        console.log(`❌ CLI script does not meet Web4 standards`);
        console.log(`📋 Issues found:`);
        validation.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
        console.log(`📋 Review the standard with: web4tscomponent standard`);
      }
    } catch (error) {
      console.error(`❌ Validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleAuditCompliance(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent audit "component-path"`);
      return;
    }

    const componentPath = args[0];
    console.log(`🔍 Auditing component compliance: ${componentPath}`);

    try {
      const auditResult = await this.component.auditComponentCompliance(componentPath);
      
      console.log(`📊 Component Metadata:`);
      console.log(`   Name: ${auditResult.name}`);
      console.log(`   Version: ${auditResult.version}`);
      console.log(`   Type: ${auditResult.type}`);
      console.log(`   Location-Resilient CLI: ${auditResult.hasLocationResilientCLI ? '✅' : '❌'}`);
      console.log(`   Empty Constructors: ${auditResult.hasEmptyConstructors ? '✅' : '❌'}`);
      console.log(`   Scenario Support: ${auditResult.hasScenarioSupport ? '✅' : '❌'}`);
      console.log(`   Layered Architecture: ${auditResult.hasLayeredArchitecture ? '✅' : '❌'}`);
      
      const compliantFeatures = [
        auditResult.hasLocationResilientCLI,
        auditResult.hasEmptyConstructors,
        auditResult.hasScenarioSupport,
        auditResult.hasLayeredArchitecture
      ].filter(Boolean).length;
      
      const totalFeatures = 4;
      const complianceScore = Math.round((compliantFeatures / totalFeatures) * 100);
      
      console.log(`📊 Compliance Score: ${complianceScore}%`);
      
      if (complianceScore === 100) {
        console.log(`✅ Component is fully Web4 compliant`);
      } else {
        console.log(`⚠️  Component needs improvements for full Web4 compliance`);
      }
    } catch (error) {
      console.error(`❌ Audit failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleGenerateReport(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent report "component-dir"`);
      return;
    }

    const componentDir = args[0];
    console.log(`📊 Generating compliance report for: ${componentDir}`);

    try {
      // generateComplianceReport expects an array of component paths
      const componentPaths = await this.getComponentPaths(componentDir);
      const report = await this.component.generateComplianceReport(componentPaths);
      
      console.log(`✅ Report generated successfully`);
      console.log(`📁 Report saved: compliance-report.md`);
      console.log(`📊 Components scanned: ${componentPaths.length}`);
      console.log(`📋 Report content:`);
      console.log(report);
    } catch (error) {
      console.error(`❌ Report generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private async getComponentPaths(componentDir: string): Promise<string[]> {
    const paths: string[] = [];
    try {
    const entries = await fs.readdir(componentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const componentPath = path.join(componentDir, entry.name);
          // Check if it has version subdirectories
          const versionEntries = await fs.readdir(componentPath, { withFileTypes: true });
          for (const versionEntry of versionEntries) {
            if (versionEntry.isDirectory() && versionEntry.name.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              paths.push(path.join(componentPath, versionEntry.name));
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan ${componentDir}: ${error instanceof Error ? error.message : String(error)}`);
    }
    return paths;
  }

  private handleShowStandard(): void {
    try {
    const standard = this.component.getLocationResilientCLIStandard();
    console.log(standard);
    } catch (error) {
      console.error(`❌ Failed to display standard: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private handleShowGuidelines(): void {
    try {
    const guidelines = this.component.getWeb4ArchitectureGuidelines();
    console.log(guidelines);
    } catch (error) {
      console.error(`❌ Failed to display guidelines: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
const cli = new Web4TSComponentCLI();
  cli.handleCommand(process.argv.slice(2));
}