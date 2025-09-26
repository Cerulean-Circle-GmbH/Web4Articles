/**
 * Web4TSComponent CLI - Web4 Architecture Layer 5
 * Command-line interface for Web4 TypeScript component standards
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
        case 'generate-cli':
          await this.handleGenerateCLI(args.slice(1));
          break;
        case 'validate-standard':
          await this.handleValidateStandard(args.slice(1));
          break;
        case 'scaffold-component':
          await this.handleScaffoldComponent(args.slice(1));
          break;
        case 'audit-compliance':
          await this.handleAuditCompliance(args.slice(1));
          break;
        case 'generate-report':
          await this.handleGenerateReport(args.slice(1));
          break;
        case 'show-standard':
          await this.handleShowStandard();
          break;
        case 'show-guidelines':
          await this.handleShowGuidelines();
          break;
        default:
          console.error(`❌ Unknown command: ${command}`);
          this.showUsage();
      }
    } catch (error) {
      console.error(`❌ Error: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  private showUsage(): void {
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const green = '\x1b[32m';
    const bold = '\x1b[1m';
    const reset = '\x1b[0m';
    
    console.log(`🚀 ${bold}${cyan}Web4TSComponent CLI${reset} ${green}- TypeScript Component Standards Enforcement & Architecture Compliance${reset}`);
    console.log('');
    console.log(`${bold}Usage:${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} ${yellow}<command>${reset} ${yellow}[options]${reset}                        ${green}# Execute Web4 standard operations${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-cli ${yellow}<component-name>${reset} ${yellow}<version>${reset}    ${green}# Generate location-resilient CLI script${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} validate-standard ${yellow}<script-path>${reset}            ${green}# Validate CLI against Web4 standard${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} scaffold-component ${yellow}<name>${reset} ${yellow}<version>${reset} ${yellow}[opts]${reset} ${green}# Create Web4-compliant component${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} audit-compliance ${yellow}<component-path>${reset}          ${green}# Audit component for Web4 compliance${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-report ${yellow}<component-dir>${reset}           ${green}# Generate compliance report${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} show-standard                             ${green}# Display location-resilient CLI standard${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} show-guidelines                           ${green}# Display Web4 architecture guidelines${reset}`);
    console.log('');
    console.log(`${bold}Commands:${reset}`);
    console.log(`  ${cyan}generate-cli${reset}     Generate location-resilient CLI script following Web4 standard`);
    console.log(`  ${cyan}validate-standard${reset} Validate existing CLI script against Web4 location-resilient standard`);
    console.log(`  ${cyan}scaffold-component${reset} Create complete Web4-compliant component with layered architecture`);
    console.log(`  ${cyan}audit-compliance${reset}  Audit existing component for Web4 architectural compliance`);
    console.log(`  ${cyan}generate-report${reset}   Generate comprehensive compliance report for component directory`);
    console.log(`  ${cyan}show-standard${reset}     Display complete location-resilient CLI implementation standard`);
    console.log(`  ${cyan}show-guidelines${reset}   Display Web4 architectural principles and guidelines`);
    console.log('');
    console.log(`${bold}Parameters:${reset}`);
    console.log(`  ${yellow}<component-name>${reset}  Component name (e.g., ${yellow}Web4Example${reset}, ${yellow}MyNewComponent${reset}, ${yellow}UserManager${reset})`);
    console.log(`  ${yellow}<version>${reset}         Semantic version (e.g., ${yellow}0.1.0.0${reset}, ${yellow}1.0.0.0${reset}, ${yellow}0.2.1.3${reset})`);
    console.log(`  ${yellow}<script-path>${reset}     Path to CLI script file (e.g., ${yellow}scripts/versions/requirement0.1.3.0${reset})`);
    console.log(`  ${yellow}<component-path>${reset}  Path to component directory (e.g., ${yellow}components/Web4Requirement/0.1.3.0${reset})`);
    console.log(`  ${yellow}<component-dir>${reset}   Directory containing components (e.g., ${yellow}components/${reset}, ${yellow}./components${reset})`);
    console.log(`  ${yellow}[options]${reset}         Scaffold options: ${yellow}--cli${reset} ${yellow}--spec${reset} ${yellow}--vitest${reset} ${yellow}--layers${reset}`);
    console.log('');
    console.log(`${bold}Examples:${reset}`);
    console.log(`  ${green}# Location-Resilient CLI Generation${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-cli ${yellow}Web4Example${reset} ${yellow}0.1.0.0${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-cli ${yellow}UserManager${reset} ${yellow}1.2.3.4${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-cli ${yellow}MyComponent${reset} ${yellow}0.2.0.0${reset}`);
    console.log('');
    console.log(`  ${green}# CLI Standard Validation${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} validate-standard ${yellow}scripts/versions/requirement0.1.3.0${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} validate-standard ${yellow}/workspace/scripts/versions/user0.1.0.0${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} validate-standard ${yellow}./my-custom-cli.sh${reset}`);
    console.log('');
    console.log(`  ${green}# Component Scaffolding (Web4 Architecture)${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} scaffold-component ${yellow}MyNewComponent${reset} ${yellow}0.1.0.0${reset} ${yellow}--cli${reset} ${yellow}--spec${reset} ${yellow}--vitest${reset} ${yellow}--layers${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} scaffold-component ${yellow}DataProcessor${reset} ${yellow}1.0.0.0${reset} ${yellow}--cli${reset} ${yellow}--spec${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} scaffold-component ${yellow}WebService${reset} ${yellow}0.3.0.0${reset} ${yellow}--layers${reset} ${yellow}--vitest${reset}`);
    console.log('');
    console.log(`  ${green}# Compliance Auditing${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} audit-compliance ${yellow}components/Web4Requirement/0.1.3.0${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} audit-compliance ${yellow}components/User/0.1.0.0${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} audit-compliance ${yellow}./my-component/${reset}`);
    console.log('');
    console.log(`  ${green}# Compliance Reporting${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-report ${yellow}components/${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-report ${yellow}./project-components/${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} generate-report ${yellow}/workspace/components${reset}`);
    console.log('');
    console.log(`  ${green}# Documentation & Standards${reset}`);
    console.log(`  ${cyan}web4tscomponent${reset} show-standard`);
    console.log(`  ${cyan}web4tscomponent${reset} show-guidelines`);
    console.log('');
    console.log(`${bold}Scaffold Options:${reset}`);
    console.log(`  ${yellow}--cli${reset}              Include location-resilient CLI script (follows Web4 standard)`);
    console.log(`  ${yellow}--spec${reset}             Include spec/requirements and spec/requirements.md folders`);
    console.log(`  ${yellow}--vitest${reset}           Include Vitest configuration (Web4 testing standard)`);
    console.log(`  ${yellow}--layers${reset}           Include full layer architecture (layer2, layer3, layer5)`);
    console.log('');
    console.log(`${bold}Web4 Architecture Principles Applied:${reset}`);
    console.log(`  ${green}•${reset} Empty Constructor Principle: All generated classes use empty constructors`);
    console.log(`  ${green}•${reset} Scenario-First Development: Components support hibernation/restoration`);
    console.log(`  ${green}•${reset} IOR Architecture: Version-specific component path resolution`);
    console.log(`  ${green}•${reset} Semantic Invariants: Location-resilient operation from any directory`);
    console.log(`  ${green}•${reset} Layered Architecture: Clear separation of concerns across layers`);
    console.log(`  ${green}•${reset} Location-Resilient CLIs: All generated scripts work from any directory`);
    console.log('');
    console.log(`${bold}Context Detection:${reset}`);
    console.log(`  ${green}•${reset} Automatically detects Web4 project root using git and package.json`);
    console.log(`  ${green}•${reset} Validates component directory structure and naming conventions`);
    console.log(`  ${green}•${reset} Supports execution from any directory within the project tree`);
    console.log(`  ${green}•${reset} Preserves original execution context after operations`);
    console.log('');
    console.log(`${bold}Standard Compliance:${reset}`);
    console.log(`  ${green}•${reset} All generated components follow Web4 architectural principles`);
    console.log(`  ${green}•${reset} Location-resilient CLI scripts use standard project root detection`);
    console.log(`  ${green}•${reset} TypeScript configuration follows Web4 ESM-native patterns`);
    console.log(`  ${green}•${reset} Component structure follows Web4 layered architecture`);
    console.log('');
    console.log(`${bold}Quality Assurance:${reset}`);
    console.log(`  ${green}•${reset} Validation ensures compliance with Web4 standards before creation`);
    console.log(`  ${green}•${reset} Audit functionality provides ongoing compliance monitoring`);
    console.log(`  ${green}•${reset} Reporting generates comprehensive compliance overviews`);
    console.log(`  ${green}•${reset} Standards enforcement prevents architectural drift`);
    console.log('');
    console.log(`For detailed documentation: ${cyan}https://github.com/Cerulean-Circle-GmbH/Web4Articles${reset}`);
    console.log(`${bold}Web4 Architecture:${reset} ${green}Semantic invariants, location independence, universal patterns${reset}`);
  }

  private async handleGenerateCLI(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ Usage: generate-cli <component-name> <version>');
      return;
    }

    const [componentName, version] = args;
    console.log(`🔨 Generating location-resilient CLI for ${componentName} v${version}...`);

    const cliScript = await this.component.generateLocationResilientCLI(componentName, version);
    const outputPath = `${componentName.toLowerCase()}${version.replace(/\\./g, '')}.sh`;

    await fs.writeFile(outputPath, cliScript, { mode: 0o755 });
    
    console.log(`✅ Generated CLI script: ${outputPath}`);
    console.log(`📋 Script follows Web4 location-resilient standard`);
    console.log(`🚀 Usage: ./${outputPath} [command] [options]`);
  }

  private async handleValidateStandard(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: validate-standard <script-path>');
      return;
    }

    const scriptPath = args[0];
    console.log(`🔍 Validating CLI standard compliance: ${scriptPath}`);

    const validation = await this.component.validateLocationResilientCLI(scriptPath);

    console.log(`\\n📊 Validation Results:`);
    console.log(`Overall Compliance: ${validation.isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
    console.log(`Project Root Detection: ${validation.hasProjectRootDetection ? '✅' : '❌'}`);
    console.log(`Auto-Build Integration: ${validation.hasAutoBuilder ? '✅' : '❌'}`);
    console.log(`Context Preservation: ${validation.hasContextPreservation ? '✅' : '❌'}`);
    console.log(`Version Resolution: ${validation.hasVersionResolution ? '✅' : '❌'}`);

    if (validation.issues.length > 0) {
      console.log(`\\n🚨 Issues Found:`);
      validation.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    if (!validation.isCompliant) {
      console.log(`\\n💡 To fix: Use 'web4tscomponent generate-cli' to create compliant script`);
      process.exit(1);
    }
  }

  private async handleScaffoldComponent(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ Usage: scaffold-component <name> <version> [options]');
      return;
    }

    const [componentName, version, ...options] = args;
    
    const scaffoldOptions = {
      componentName,
      version,
      includeLayerArchitecture: options.includes('--layers'),
      includeCLI: options.includes('--cli'),
      includeSpecFolder: options.includes('--spec'),
      includeVitest: options.includes('--vitest')
    };

    console.log(`🏗️  Scaffolding Web4 component: ${componentName} v${version}`);
    console.log(`📋 Options: ${JSON.stringify(scaffoldOptions, null, 2)}`);

    const projectRoot = await this.findProjectRoot();
    if (!projectRoot) {
      throw new Error('Not in a Web4 project directory. Please run from project root.');
    }

    this.component.setTargetDirectory(projectRoot);
    const metadata = await this.component.scaffoldComponent(scaffoldOptions);

    console.log(`\\n✅ Component scaffolded successfully!`);
    console.log(`📁 Location: ${path.join(projectRoot, 'components', componentName, version)}`);
    console.log(`📋 Metadata:`);
    console.log(`  - Name: ${metadata.name}`);
    console.log(`  - Version: ${metadata.version}`);
    console.log(`  - Location-Resilient CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
    console.log(`  - Layered Architecture: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    console.log(`  - Empty Constructors: ${metadata.hasEmptyConstructors ? '✅' : '❌'}`);
    console.log(`  - Scenario Support: ${metadata.hasScenarioSupport ? '✅' : '❌'}`);

    console.log(`\\n🚀 Next steps:`);
    console.log(`  1. cd components/${componentName}/${version}`);
    console.log(`  2. npm install`);
    console.log(`  3. npm run build`);
  }

  private async handleAuditCompliance(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: audit-compliance <component-path>');
      return;
    }

    const componentPath = args[0];
    console.log(`🔍 Auditing Web4 compliance: ${componentPath}`);

    const metadata = await this.component.auditComponentCompliance(componentPath);

    console.log(`\\n📊 Compliance Results:`);
    console.log(`Component: ${metadata.name} v${metadata.version}`);
    console.log(`Location-Resilient CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
    console.log(`Layered Architecture: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    console.log(`Empty Constructors: ${metadata.hasEmptyConstructors ? '✅' : '⚠️ (Not verified)'}`);
    console.log(`Scenario Support: ${metadata.hasScenarioSupport ? '✅' : '⚠️ (Not verified)'}`);
  }

  private async handleGenerateReport(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: generate-report <component-directory>');
      return;
    }

    const componentDir = args[0];
    console.log(`📊 Generating compliance report for: ${componentDir}`);

    // Find all components
    const components: string[] = [];
    const entries = await fs.readdir(componentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const componentPath = path.join(componentDir, entry.name);
        const versions = await fs.readdir(componentPath, { withFileTypes: true });
        
        for (const version of versions) {
          if (version.isDirectory() && version.name.match(/^\\d+\\.\\d+\\.\\d+\\.\\d+$/)) {
            components.push(path.join(componentPath, version.name));
          }
        }
      }
    }

    const report = await this.component.generateComplianceReport(components);
    const reportPath = 'web4-compliance-report.md';
    
    await fs.writeFile(reportPath, report);
    
    console.log(`✅ Compliance report generated: ${reportPath}`);
    console.log(`📋 Audited ${components.length} components`);
  }

  private async handleShowStandard(): Promise<void> {
    const standard = this.component.getLocationResilientCLIStandard();
    console.log(standard);
  }

  private async handleShowGuidelines(): Promise<void> {
    const guidelines = this.component.getWeb4ArchitectureGuidelines();
    console.log(guidelines);
  }
}

// CLI entry point
const cli = new Web4TSComponentCLI();
const args = process.argv.slice(2);
cli.handleCommand(args).catch(console.error);


