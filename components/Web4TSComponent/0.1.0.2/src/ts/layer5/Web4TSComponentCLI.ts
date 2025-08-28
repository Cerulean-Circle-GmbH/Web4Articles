/**
 * Web4TSComponent CLI - Web4 Architecture Layer 5
 * Command-line interface for Web4 TypeScript component standards
 * Version 0.1.0.2 - Simplified commands with Occam's Razor applied
 */

import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { VersionManager } from '../layer2/VersionManager.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';

export class Web4TSComponentCLI {
  private component: DefaultWeb4TSComponent;
  private versionManager: VersionManager | null = null;
  private projectRoot: string | null = null;
  private isTestMode: boolean = false;

  constructor() {
    this.component = new DefaultWeb4TSComponent();
    // Find project root synchronously
    this.projectRoot = this.findProjectRoot();
    if (this.projectRoot) {
      this.component.setTargetDirectory(this.projectRoot);
      this.versionManager = new VersionManager(this.projectRoot);
    }
  }

  private findProjectRoot(): string | null {
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

    // Check if this is a test command
    if (command === 'test') {
      if (args.length < 2) {
        this.showTestUsage();
        return;
      }
      
      this.isTestMode = true;
      console.log(`🧪 [TEST MODE] Web4TSComponent CLI - Current Directory: ${process.cwd()}`);
      
      // Handle test subcommand
      await this.handleTestCommand(args.slice(1));
      return;
    }

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
        case 'version':
          await this.handleVersion(args.slice(1));
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
    console.log(`  ${cyan}web4tscomponent${reset} version next major|minor|patch|build       # Create next version`);
    console.log(`  ${cyan}web4tscomponent${reset} version latest set ${yellow}"X.X.X.X"${reset}                # Set latest version`);
    console.log(`  ${cyan}web4tscomponent${reset} version cherry-pick ${yellow}"branch"${reset} latest as ${yellow}"X.X.X.X"${reset} # Cherry-pick from branch`);
    console.log(`  ${cyan}web4tscomponent${reset} test new ${yellow}"component-name"${reset} ${yellow}"version"${reset} [options]    # Create test component in current directory`);
    console.log(`  ${cyan}web4tscomponent${reset} test version next major               # Test version management on local component`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  new          Create complete Web4-compliant component with layered architecture`);
    console.log(`  cli          Generate location-resilient CLI script following Web4 standard`);
    console.log(`  validate     Validate existing CLI script against Web4 location-resilient standard`);
    console.log(`  audit        Audit existing component for Web4 architectural compliance`);
    console.log(`  report       Generate comprehensive compliance report for component directory`);
    console.log(`  standard     Display complete location-resilient CLI implementation standard`);
    console.log(`  guide        Display Web4 architectural principles and guidelines`);
    console.log(`  version      Manage component versions (next, latest, cherry-pick)`);
    console.log(`  test         Test mode - work with components in current directory with debug output`);
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
    console.log(`  ${green}# Version management${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} version next major             ${green}# Create next major version (1.0.0.0)${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} version next minor             ${green}# Create next minor version (0.2.0.0)${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} version next patch             ${green}# Create next patch version (0.1.1.0)${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} version next build             ${green}# Create next build version (0.1.0.3)${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} version latest set ${yellow}"0.1.0.2"${reset}      ${green}# Set specific version as latest${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} version cherry-pick ${yellow}"dev/branch"${reset} latest as ${yellow}"0.1.0.4"${reset} ${green}# Cherry-pick from branch${reset}`);
    console.log('');
    console.log(`  ${green}# Test mode (current directory, verbose debug)${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test new ${yellow}"TestComponent"${reset} ${yellow}"0.1.0.0"${reset} --cli ${green}# Create test component here${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test version next major        ${green}# Test version management locally${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test version latest set ${yellow}"0.1.0.1"${reset} ${green}# Test latest management${reset}`);
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

  private async handleVersion(args: string[]): Promise<void> {
    if (!this.versionManager) {
      console.error('❌ Version manager not initialized. Make sure you are in a valid project directory.');
      return;
    }

    if (args.length === 0) {
      await this.showVersionInfo();
      return;
    }

    const subCommand = args[0];

    try {
      switch (subCommand) {
        case 'next':
          await this.handleVersionNext(args.slice(1));
          break;
        case 'latest':
          await this.handleVersionLatest(args.slice(1));
          break;
        case 'cherry-pick':
          await this.handleVersionCherryPick(args.slice(1));
          break;
        case 'info':
          await this.showVersionInfo();
          break;
        default:
          console.log(`❌ Unknown version command: ${subCommand}`);
          console.log('Available commands: next, latest, cherry-pick, info');
          break;
      }
    } catch (error) {
      console.error(`❌ Version command failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleVersionNext(args: string[]): Promise<void> {
    if (args.length === 0) {
      console.log('❌ Missing version type. Usage: web4tscomponent version next major|minor|patch|build');
      return;
    }

    const versionType = args[0];
    const info = await this.versionManager!.getVersionInfo();

    if (!info.latest) {
      console.log('❌ No existing versions found. Create an initial version first.');
      return;
    }

    let nextVersion: string;
    switch (versionType) {
      case 'major':
        nextVersion = this.versionManager!.nextMajor(info.latest);
        break;
      case 'minor':
        nextVersion = this.versionManager!.nextMinor(info.latest);
        break;
      case 'patch':
        nextVersion = this.versionManager!.nextPatch(info.latest);
        break;
      case 'build':
        nextVersion = this.versionManager!.nextBuild(info.latest);
        break;
      default:
        console.log(`❌ Invalid version type: ${versionType}. Use: major, minor, patch, or build`);
        return;
    }

    console.log(`🔄 Creating ${versionType} version: ${info.latest} → ${nextVersion}`);
    
    // Copy current latest to next version
    const result = await this.versionManager!.cherryPickFromBranch('HEAD', nextVersion);
    
    console.log(`✅ Successfully created version ${nextVersion}`);
    console.log(`📁 Location: components/Web4TSComponent/${nextVersion}/`);
  }

  private async handleVersionLatest(args: string[]): Promise<void> {
    if (args.length < 2 || args[0] !== 'set') {
      console.log('❌ Usage: web4tscomponent version latest set "X.X.X.X"');
      return;
    }

    const version = args[1];
    console.log(`🔄 Setting latest version to ${version}...`);

    const success = await this.versionManager!.setLatest(version);
    if (success) {
      console.log(`✅ Successfully set ${version} as latest`);
      console.log(`🔗 Updated symlinks: latest → ${version}`);
      console.log(`🔗 Updated main script: web4tscomponent → web4tscomponent-v${version}`);
    } else {
      console.log(`❌ Failed to set ${version} as latest`);
    }
  }

  private async handleVersionCherryPick(args: string[]): Promise<void> {
    // Expected format: cherry-pick "branch" latest as "X.X.X.X"
    if (args.length < 4 || args[1] !== 'latest' || args[2] !== 'as') {
      console.log('❌ Usage: web4tscomponent version cherry-pick "branch" latest as "X.X.X.X"');
      return;
    }

    const branch = args[0];
    const targetVersion = args[3];

    console.log(`🔄 Cherry-picking from branch ${branch} as version ${targetVersion}...`);

    try {
      const result = await this.versionManager!.cherryPickFromBranch(branch, targetVersion);
      console.log(`✅ Successfully cherry-picked from ${branch} as ${result}`);
      console.log(`📁 Location: components/Web4TSComponent/${result}/`);
      console.log(`🔗 Script: scripts/versions/web4tscomponent-v${result}`);
    } catch (error) {
      console.error(`❌ Cherry-pick failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async showVersionInfo(): Promise<void> {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';

    const info = await this.versionManager!.getVersionInfo();

    console.log(`${bold}${cyan}Web4TSComponent Version Info${reset}`);
    console.log('');
    console.log(`${bold}Current State:${reset}`);
    console.log(`  Latest Version: ${info.latest || 'None'}`);
    console.log(`  Available Versions: ${info.available.length === 0 ? 'None' : info.available.join(', ')}`);
    console.log('');

    if (info.latest) {
      console.log(`${bold}Next Available Versions:${reset}`);
      console.log(`  Next Major: ${yellow}${info.nextMajor}${reset} ${green}(resets minor, patch, build to 0)${reset}`);
      console.log(`  Next Minor: ${yellow}${info.nextMinor}${reset} ${green}(resets patch, build to 0)${reset}`);
      console.log(`  Next Patch: ${yellow}${info.nextPatch}${reset} ${green}(resets build to 0)${reset}`);
      console.log(`  Next Build: ${yellow}${info.nextBuild}${reset} ${green}(increments build)${reset}`);
      console.log('');
      console.log(`${bold}Examples:${reset}`);
      console.log(`  ${cyan}web4tscomponent${reset} version next major    ${green}# Create ${info.nextMajor}${reset}`);
      console.log(`  ${cyan}web4tscomponent${reset} version next minor    ${green}# Create ${info.nextMinor}${reset}`);
      console.log(`  ${cyan}web4tscomponent${reset} version next build    ${green}# Create ${info.nextBuild}${reset}`);
    } else {
      console.log(`${bold}Getting Started:${reset}`);
      console.log(`  Create your first version:`);
      console.log(`  ${cyan}web4tscomponent${reset} new ${yellow}"Web4TSComponent"${reset} ${yellow}"0.1.0.0"${reset} --cli --layers`);
    }
  }

  private async handleTestCommand(args: string[]): Promise<void> {
    const subCommand = args[0];
    
    console.log(`🐛 [DEBUG] Test subcommand: ${subCommand}`);
    console.log(`🐛 [DEBUG] Test args: ${args.join(' ')}`);

    try {
      switch (subCommand) {
        case 'new':
          await this.handleTestNew(args.slice(1));
          break;
        case 'version':
          await this.handleTestVersion(args.slice(1));
          break;
        case 'cli':
        case 'generate':
          await this.handleTestGenerateCLI(args.slice(1));
          break;
        case 'validate':
          await this.handleTestValidateStandard(args.slice(1));
          break;
        case 'audit':
          await this.handleTestAuditCompliance(args.slice(1));
          break;
        default:
          console.log(`❌ Unknown test command: ${subCommand}`);
          this.showTestUsage();
          break;
      }
    } catch (error) {
      console.error(`❌ Test command failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private showTestUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`${bold}${cyan}Web4TSComponent Test Mode${reset} - Development & Testing in Current Directory`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test new ${yellow}"component-name"${reset} ${yellow}"version"${reset} [options]   ${green}# Create component in current directory${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test version next major|minor|patch|build    ${green}# Test version management${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test version latest set ${yellow}"X.X.X.X"${reset}           ${green}# Test latest management${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test cli ${yellow}"component-name"${reset} ${yellow}"version"${reset}            ${green}# Generate test CLI${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test validate ${yellow}"script-path"${reset}                   ${green}# Validate test CLI${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test audit ${yellow}"component-path"${reset}                  ${green}# Audit test component${reset}`);
    console.log('');
    console.log(`${bold}Test Mode Features:${reset}`);
    console.log(`  • Works in current directory instead of project components/`);
    console.log(`  • Verbose debug output for all operations`);
    console.log(`  • Isolated test-scripts/ directory for symlinks`);
    console.log(`  • Perfect for component development and testing workflows`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${green}# Create test component and work with it${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test new ${yellow}"TestComponent"${reset} ${yellow}"0.1.0.0"${reset} --cli --layers`);
    console.log(`  ${cyan}web4tscomponent${reset} test version next build`);
    console.log(`  ${cyan}web4tscomponent${reset} test version latest set ${yellow}"0.1.0.1"${reset}`);
    console.log('');
    console.log(`  ${green}# Test specific functionality${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} test validate ./TestComponent/0.1.0.0/testcomponent.sh`);
    console.log(`  ${cyan}web4tscomponent${reset} test audit ./TestComponent/0.1.0.0/`);
  }

  private async handleTestNew(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent test new "component-name" "version" [options]`);
      return;
    }

    const componentName = args[0];
    const version = args[1];
    const options = args.slice(2);

    console.log(`🧪 [TEST MODE] Creating Web4-compliant component ${componentName} v${version} in current directory...`);
    console.log(`🐛 [DEBUG] Current directory: ${process.cwd()}`);
    console.log(`🐛 [DEBUG] Component name: ${componentName}`);
    console.log(`🐛 [DEBUG] Version: ${version}`);
    console.log(`🐛 [DEBUG] Options: ${options.join(', ')}`);

    // Parse scaffold options
    const includeSpecs = options.includes('--spec');
    const includeVitest = options.includes('--vitest');
    const includeCLI = options.includes('--cli');
    const includeLayers = options.includes('--layers');

    console.log(`🐛 [DEBUG] Include specs: ${includeSpecs}`);
    console.log(`🐛 [DEBUG] Include Vitest: ${includeVitest}`);
    console.log(`🐛 [DEBUG] Include CLI: ${includeCLI}`);
    console.log(`🐛 [DEBUG] Include layers: ${includeLayers}`);

    try {
      // Create test component in current directory
      const testTargetDir = path.join(process.cwd(), componentName, version);
      console.log(`🐛 [DEBUG] Creating component directory: ${testTargetDir}`);
      
      await fs.mkdir(testTargetDir, { recursive: true });
      
      // Set up temporary component instance for test mode
      const testComponent = new DefaultWeb4TSComponent();
      testComponent.setTargetDirectory(process.cwd());

      const metadata = await testComponent.scaffoldComponent({
        componentName,
        version,
        includeLayerArchitecture: includeLayers,
        includeCLI,
        includeSpecFolder: includeSpecs,
        includeVitest
      });
      
      console.log(`✅ Successfully created test component ${componentName} v${version}`);
      console.log(`📁 Location: ./${componentName}/${version}/`);
      
      if (includeCLI) {
        console.log(`🔗 CLI script: ${componentName.toLowerCase()}.sh`);
      }
      
      // Initialize test version manager
      this.initializeTestVersionManager(componentName);
      
    } catch (error) {
      console.error(`❌ Failed to create test component: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`🐛 [DEBUG] Error details:`, error);
    }
  }

  private async handleTestVersion(args: string[]): Promise<void> {
    console.log(`🐛 [DEBUG] Test version command args: ${args.join(' ')}`);
    
    // Find test component in current directory
    const testComponent = await this.findTestComponent();
    if (!testComponent) {
      console.log(`❌ No test component found in current directory.`);
      console.log(`💡 Create one first: web4tscomponent test new "TestComponent" "0.1.0.0" --cli`);
      return;
    }
    
    console.log(`🐛 [DEBUG] Found test component: ${testComponent}`);
    this.initializeTestVersionManager(testComponent);
    
    if (!this.versionManager) {
      console.error('❌ Version manager not initialized for test mode.');
      return;
    }

    if (args.length === 0) {
      await this.showVersionInfo();
      return;
    }

    const subCommand = args[0];
    console.log(`🐛 [DEBUG] Version subcommand: ${subCommand}`);

    try {
      switch (subCommand) {
        case 'next':
          await this.handleVersionNext(args.slice(1));
          break;
        case 'latest':
          await this.handleVersionLatest(args.slice(1));
          break;
        case 'cherry-pick':
          console.log(`🧪 [TEST MODE] Cherry-pick not available in test mode (requires git integration)`);
          break;
        case 'info':
          await this.showVersionInfo();
          break;
        default:
          console.log(`❌ Unknown version command: ${subCommand}`);
          console.log('Available commands: next, latest, info');
          break;
      }
    } catch (error) {
      console.error(`❌ Test version command failed: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`🐛 [DEBUG] Error details:`, error);
    }
  }

  private async handleTestGenerateCLI(args: string[]): Promise<void> {
    console.log(`🐛 [DEBUG] Test generate CLI args: ${args.join(' ')}`);
    
    if (args.length < 2) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent test cli "component-name" "version"`);
      return;
    }

    const componentName = args[0];
    const version = args[1];

    console.log(`🧪 [TEST MODE] Generating location-resilient CLI for ${componentName} v${version} in current directory...`);

    try {
      const testComponent = new DefaultWeb4TSComponent();
      testComponent.setTargetDirectory(process.cwd());
      
      const cliScript = await testComponent.generateLocationResilientCLI(componentName, version);
      console.log(`✅ Generated test CLI script: ${componentName.toLowerCase()}.sh`);
      console.log(`📋 Script follows Web4 location-resilient standard`);
      console.log(`🚀 Usage: ./${componentName}/${version}/${componentName.toLowerCase()}.sh [command] [options]`);
    } catch (error) {
      console.error(`❌ Failed to generate test CLI: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`🐛 [DEBUG] Error details:`, error);
    }
  }

  private async handleTestValidateStandard(args: string[]): Promise<void> {
    console.log(`🐛 [DEBUG] Test validate args: ${args.join(' ')}`);
    
    if (args.length < 1) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent test validate "script-path"`);
      return;
    }

    const scriptPath = args[0];
    console.log(`🧪 [TEST MODE] Validating CLI script: ${scriptPath}`);

    try {
      const testComponent = new DefaultWeb4TSComponent();
      testComponent.setTargetDirectory(process.cwd());
      
      const validation = await testComponent.validateLocationResilientCLI(scriptPath);
      if (validation.isCompliant) {
        console.log(`✅ Test CLI script is Web4 location-resilient compliant`);
        console.log(`📋 All required features detected`);
      } else {
        console.log(`❌ Test CLI script does not meet Web4 standards`);
        console.log(`📋 Issues found:`);
        validation.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
      }
    } catch (error) {
      console.error(`❌ Test validation failed: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`🐛 [DEBUG] Error details:`, error);
    }
  }

  private async handleTestAuditCompliance(args: string[]): Promise<void> {
    console.log(`🐛 [DEBUG] Test audit args: ${args.join(' ')}`);
    
    if (args.length < 1) {
      console.log(`❌ Missing arguments. Usage: web4tscomponent test audit "component-path"`);
      return;
    }

    const componentPath = args[0];
    console.log(`🧪 [TEST MODE] Auditing component compliance: ${componentPath}`);

    try {
      const testComponent = new DefaultWeb4TSComponent();
      testComponent.setTargetDirectory(process.cwd());
      
      const auditResult = await testComponent.auditComponentCompliance(componentPath);
      
      console.log(`📊 Test Component Metadata:`);
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
      
      console.log(`📊 Test Compliance Score: ${complianceScore}%`);
      
    } catch (error) {
      console.error(`❌ Test audit failed: ${error instanceof Error ? error.message : String(error)}`);
      console.log(`🐛 [DEBUG] Error details:`, error);
    }
  }

  private async findTestComponent(): Promise<string | null> {
    console.log(`🐛 [DEBUG] Looking for test components in: ${process.cwd()}`);
    
    try {
      const entries = await fs.readdir(process.cwd(), { withFileTypes: true });
      const componentDirs = entries.filter(entry => entry.isDirectory() && !entry.name.startsWith('.'));
      
      console.log(`🐛 [DEBUG] Found directories: ${componentDirs.map(d => d.name).join(', ')}`);
      
      for (const dir of componentDirs) {
        const dirPath = path.join(process.cwd(), dir.name);
        try {
          const versionEntries = await fs.readdir(dirPath, { withFileTypes: true });
          const hasVersions = versionEntries.some(entry => 
            entry.isDirectory() && entry.name.match(/^\d+\.\d+\.\d+\.\d+$/)
          );
          
          if (hasVersions) {
            console.log(`🐛 [DEBUG] Found test component with versions: ${dir.name}`);
            return dir.name;
          }
        } catch {
          // Ignore errors reading subdirectories
        }
      }
      
      console.log(`🐛 [DEBUG] No test components found`);
      return null;
    } catch (error) {
      console.log(`🐛 [DEBUG] Error finding test components: ${error}`);
      return null;
    }
  }

  private initializeTestVersionManager(componentName: string): void {
    console.log(`🐛 [DEBUG] Initializing test version manager for: ${componentName}`);
    
    // For test mode, always use current directory as project root
    const testProjectRoot = process.cwd();
    
    this.versionManager = new VersionManager(
      testProjectRoot, 
      componentName,
      { 
        isTestMode: true, 
        debugMode: true, 
        testComponentName: componentName 
      }
    );
    
    console.log(`🐛 [DEBUG] Test version manager initialized with root: ${testProjectRoot}`);
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
const cli = new Web4TSComponentCLI();
  cli.handleCommand(process.argv.slice(2));
}