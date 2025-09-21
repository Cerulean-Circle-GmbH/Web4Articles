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
    console.log(`
🚀 Web4TSComponent CLI - TypeScript Component Standards Enforcement & Architecture Compliance

Usage:
  web4tscomponent <command> [options]                        # Execute Web4 standard operations
  web4tscomponent generate-cli <component-name> <version>    # Generate location-resilient CLI script
  web4tscomponent validate-standard <script-path>            # Validate CLI against Web4 standard
  web4tscomponent scaffold-component <name> <version> [opts] # Create Web4-compliant component
  web4tscomponent audit-compliance <component-path>          # Audit component for Web4 compliance
  web4tscomponent generate-report <component-dir>           # Generate compliance report
  web4tscomponent show-standard                             # Display location-resilient CLI standard
  web4tscomponent show-guidelines                           # Display Web4 architecture guidelines

Commands:
  generate-cli     Generate location-resilient CLI script following Web4 standard
  validate-standard Validate existing CLI script against Web4 location-resilient standard
  scaffold-component Create complete Web4-compliant component with layered architecture
  audit-compliance  Audit existing component for Web4 architectural compliance
  generate-report   Generate comprehensive compliance report for component directory
  show-standard     Display complete location-resilient CLI implementation standard
  show-guidelines   Display Web4 architectural principles and guidelines

Parameters:
  <component-name>  Component name (e.g., Web4Example, MyNewComponent, UserManager)
  <version>         Semantic version (e.g., 0.1.0.0, 1.0.0.0, 0.2.1.3)
  <script-path>     Path to CLI script file (e.g., scripts/versions/requirement0.1.3.0)
  <component-path>  Path to component directory (e.g., components/Web4Requirement/0.1.3.0)
  <component-dir>   Directory containing components (e.g., components/, ./components)
  [options]         Scaffold options: --cli --spec --vitest --layers

Examples:
  # Location-Resilient CLI Generation
  web4tscomponent generate-cli Web4Example 0.1.0.0
  web4tscomponent generate-cli UserManager 1.2.3.4
  web4tscomponent generate-cli MyComponent 0.2.0.0

  # CLI Standard Validation
  web4tscomponent validate-standard scripts/versions/requirement0.1.3.0
  web4tscomponent validate-standard /workspace/scripts/versions/user0.1.0.0
  web4tscomponent validate-standard ./my-custom-cli.sh

  # Component Scaffolding (Web4 Architecture)
  web4tscomponent scaffold-component MyNewComponent 0.1.0.0 --cli --spec --vitest --layers
  web4tscomponent scaffold-component DataProcessor 1.0.0.0 --cli --spec
  web4tscomponent scaffold-component WebService 0.3.0.0 --layers --vitest

  # Compliance Auditing
  web4tscomponent audit-compliance components/Web4Requirement/0.1.3.0
  web4tscomponent audit-compliance components/User/0.1.0.0
  web4tscomponent audit-compliance ./my-component/

  # Compliance Reporting
  web4tscomponent generate-report components/
  web4tscomponent generate-report ./project-components/
  web4tscomponent generate-report /workspace/components

  # Documentation & Standards
  web4tscomponent show-standard
  web4tscomponent show-guidelines

Scaffold Options:
  --cli              Include location-resilient CLI script (follows Web4 standard)
  --spec             Include spec/requirements and spec/requirements.md folders
  --vitest           Include Vitest configuration (Web4 testing standard)
  --layers           Include full layer architecture (layer2, layer3, layer5)

Web4 Architecture Principles Applied:
  • Empty Constructor Principle: All generated classes use empty constructors
  • Scenario-First Development: Components support hibernation/restoration
  • IOR Architecture: Version-specific component path resolution
  • Semantic Invariants: Location-resilient operation from any directory
  • Layered Architecture: Clear separation of concerns across layers
  • Location-Resilient CLIs: All generated scripts work from any directory

Context Detection:
  • Automatically detects Web4 project root using git and package.json
  • Validates component directory structure and naming conventions
  • Supports execution from any directory within the project tree
  • Preserves original execution context after operations

Standard Compliance:
  • All generated components follow Web4 architectural principles
  • Location-resilient CLI scripts use standard project root detection
  • TypeScript configuration follows Web4 ESM-native patterns
  • Component structure follows Web4 layered architecture

Quality Assurance:
  • Validation ensures compliance with Web4 standards before creation
  • Audit functionality provides ongoing compliance monitoring
  • Reporting generates comprehensive compliance overviews
  • Standards enforcement prevents architectural drift

For detailed documentation: https://github.com/Cerulean-Circle-GmbH/Web4Articles
Web4 Architecture: Semantic invariants, location independence, universal patterns
`);
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


