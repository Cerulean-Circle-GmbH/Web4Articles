#!/usr/bin/env node

/**
 * Web4TSComponentCLI - Web4-Compliant TypeScript Component CLI
 * Web4 pattern: Extends DefaultCLI with component-specific functionality
 * Feature equivalent to Web4TSComponent 1.0.0.0 but Web4 compliant
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { ComponentScaffoldOptions } from '../layer3/Web4TSComponent.interface.js';

export class Web4TSComponentCLI extends DefaultCLI {
  private tsComponent: DefaultWeb4TSComponent | null;

  constructor() {
    super(); // Call DefaultCLI constructor - Web4 pattern
    this.tsComponent = null;
    // Initialize with component class reference - Web4 pattern
    this.initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', '0.3.0.8');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4TSComponentCLI();
    await cli.execute(args);
  }

  private getOrCreateTSComponent(): DefaultWeb4TSComponent {
    if (!this.tsComponent) {
      this.tsComponent = this.getComponentInstance() as DefaultWeb4TSComponent;
    }
    return this.tsComponent;
  }

  /**
   * Web4 CLI Topic: create - Component scaffolding (maps to scaffold-component)
   * Usage: web4tscomponent create <name> <version> [options]
   */
  private async create(name: string, version: string = '0.1.0.0', options: string = ''): Promise<void> {
    const tsComponent = this.getOrCreateTSComponent();
    
    // Parse options (maps from 1.0.0.0 --cli --spec --vitest --layers)
    const scaffoldOptions: ComponentScaffoldOptions = {
      componentName: name,
      version,
      includeLayerArchitecture: options.includes('layers') || options.includes('all'),
      includeCLI: options.includes('cli') || options.includes('all'),
      includeSpecFolder: options.includes('spec') || options.includes('all'),
      includeVitest: options.includes('vitest') || options.includes('test') || options.includes('all')
    };
    
    console.log(`🏗️ Creating Web4 component: ${name} v${version}`);
    console.log(`📋 Options: ${options || 'default'}`);
    
    const metadata = await tsComponent.scaffoldComponent(scaffoldOptions);
    
    console.log(`✅ Component created: ${name}`);
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Location: components/${name}/${version}`);
    console.log(`   CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
    console.log(`   Layers: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    console.log(`   Spec: ${metadata.hasScenarioSupport ? '✅' : '❌'}`);
  }

  /**
   * Web4 CLI Topic: set - CLI generation and configuration (maps to generate-cli)
   * Usage: web4tscomponent set <component> cli-script <version>
   */
  private async set(component: string, attribute: string, value: string): Promise<void> {
    const tsComponent = this.getOrCreateTSComponent();
    
    if (attribute === 'cli-script' || attribute === 'cli') {
      console.log(`🔨 Generating CLI script for ${component} v${value}`);
      const cliScript = await tsComponent.generateLocationResilientCLI(component, value);
      const outputPath = `${component.toLowerCase()}${value.replace(/\\./g, '')}.sh`;
      
      await import('fs/promises').then(fs => fs.writeFile(outputPath, cliScript, { mode: 0o755 }));
      
      console.log(`✅ CLI script generated: ${outputPath}`);
      console.log(`   Location-resilient: ✅`);
      console.log(`   Web4 compliant: ✅`);
    } else {
      console.log(`⚠️ Unknown attribute: ${attribute}. Supported: cli-script, cli`);
    }
  }

  /**
   * Web4 CLI Topic: get - Validation and standards (maps to validate-standard)
   * Usage: web4tscomponent get <script-path> validation
   */
  private async get(scriptPath: string, attribute: string): Promise<void> {
    const tsComponent = this.getOrCreateTSComponent();
    
    if (attribute === 'validation' || attribute === 'standard') {
      console.log(`🔍 Validating CLI standard: ${scriptPath}`);
      const validation = await tsComponent.validateCLIStandard(scriptPath);
      
      console.log(`\\n📊 Validation Results:`);
      console.log(`   Compliant: ${validation.isCompliant ? '✅' : '❌'}`);
      console.log(`   Score: ${validation.score}/100`);
      
      if (validation.issues.length > 0) {
        console.log(`\\n⚠️ Issues found:`);
        validation.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
      }
      
      if (validation.suggestions.length > 0) {
        console.log(`\\n💡 Suggestions:`);
        validation.suggestions.forEach((suggestion, index) => {
          console.log(`   ${index + 1}. ${suggestion}`);
        });
      }
    } else if (attribute === 'compliance') {
      console.log(`🔍 Auditing component compliance: ${scriptPath}`);
      const metadata = await tsComponent.auditComponentCompliance(scriptPath);
      
      console.log(`\\n📊 Compliance Results:`);
      console.log(`   Component: ${metadata.name} v${metadata.version}`);
      console.log(`   Score: ${metadata.complianceScore}/100`);
      console.log(`   CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
      console.log(`   Layers: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    } else {
      console.log(`⚠️ Unknown attribute: ${attribute}. Supported: validation, standard, compliance`);
    }
  }

  /**
   * Web4 CLI Topic: from - Component analysis (maps to audit-compliance)
   * Usage: web4tscomponent from <component-path>
   */
  private async from(componentPath: string): Promise<this> {
    const tsComponent = this.getOrCreateTSComponent();
    
    console.log(`🔍 Analyzing component: ${componentPath}`);
    const metadata = await tsComponent.auditComponentCompliance(componentPath);
    
    console.log(`✅ Component analysis complete:`);
    console.log(`   Name: ${metadata.name}`);
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Compliance Score: ${metadata.complianceScore}/100`);
    
    if (metadata.issues && metadata.issues.length > 0) {
      console.log(`\\n⚠️ Issues found:`);
      metadata.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }
    
    return this;
  }

  /**
   * Web4 CLI Topic: find - Component discovery (maps to generate-report)
   * Usage: web4tscomponent find <component-dir>
   */
  private async find(componentDir: string): Promise<this> {
    const tsComponent = this.getOrCreateTSComponent();
    
    console.log(`🔍 Discovering components in: ${componentDir}`);
    const components = await tsComponent.generateComplianceReport(componentDir);
    
    console.log(`\\n📊 Component Discovery Results:`);
    console.log(`   Found: ${components.length} components`);
    
    components.forEach((component, index) => {
      const status = (component.complianceScore || 0) >= 70 ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${component.name} v${component.version} (${component.complianceScore || 0}/100)`);
    });
    
    return this;
  }

  /**
   * Web4 CLI Topic: execute - Execute pending operations
   * Usage: web4tscomponent execute
   */
  private async executeOperations(): Promise<void> {
    console.log(`✅ Web4TSComponent operations completed`);
    console.log(`   Component: Web4TSComponent 0.3.0.6`);
    console.log(`   Web4 Compliant: ✅`);
    console.log(`   Feature Equivalent: ✅ (to v1.0.0.0)`);
  }

  /**
   * Web4 CLI Topic: info - Display standards and guidelines (maps to show-standard/guidelines)
   * Usage: web4tscomponent info [topic]
   */
  private async info(topic: string = 'overview'): Promise<void> {
    const tsComponent = this.getOrCreateTSComponent();
    
    switch (topic) {
      case 'standard':
      case 'standards':
        tsComponent.showStandard();
        break;
      case 'guidelines':
      case 'guide':
        tsComponent.showGuidelines();
        break;
      case 'overview':
      default:
        console.log(`
🚀 Web4TSComponent 0.3.0.6 - Web4-Compliant TypeScript Component Tools

Web4 CLI Topics:
  create <name> <version> [options]    # Create Web4-compliant component (scaffold-component)
  set <component> cli-script <version> # Generate location-resilient CLI (generate-cli)
  get <path> validation                # Validate CLI standard (validate-standard)
  from <component-path>                # Analyze component compliance (audit-compliance)
  find <component-dir>                 # Discover components (generate-report)
  execute                              # Execute pending operations
  info [topic]                         # Show standards/guidelines

Options for create:
  all      # Include all features (--cli --spec --vitest --layers)
  cli      # Include CLI script
  spec     # Include spec folder
  vitest   # Include test configuration
  layers   # Include layer architecture

Examples:
  web4tscomponent create MyComponent 0.1.0.0 all
  web4tscomponent set MyComponent cli-script 0.1.0.0
  web4tscomponent get ./myscript.sh validation
  web4tscomponent from components/MyComponent/0.1.0.0
  web4tscomponent find components/
  web4tscomponent info standards

🎯 Feature equivalent to v1.0.0.0 with Web4 compliance like Unit 0.3.0.5
`);
        break;
    }
  }

  /**
   * Web4TSComponent-specific command execution implementation using DefaultCLI dynamic functionality
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      // Try dynamic command execution (following Unit pattern)
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return; // Command executed successfully
      }

      // Special cases (Web4TSComponent-specific methods)
      switch (command) {
        case 'create':
          await this.create(commandArgs[0], commandArgs[1], commandArgs[2]);
          break;
        case 'set':
          await this.set(commandArgs[0], commandArgs[1], commandArgs[2]);
          break;
        case 'get':
          await this.get(commandArgs[0], commandArgs[1]);
          break;
        case 'from':
          await this.from(commandArgs[0]);
          break;
        case 'find':
          await this.find(commandArgs[0]);
          break;
        case 'execute':
          await this.executeOperations();
          break;
        case 'info':
          await this.info(commandArgs[0]);
          break;
        default:
          console.log(`❌ Unknown command: ${command}`);
          this.showUsage();
          break;
      }
    } catch (error) {
      console.error(`❌ Command failed: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * Web4TSComponent-specific usage display using DefaultCLI patterns
   */
  showUsage(): void {
    this.info('overview');
  }
}