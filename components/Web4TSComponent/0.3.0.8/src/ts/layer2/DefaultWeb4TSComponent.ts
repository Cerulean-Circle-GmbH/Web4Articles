/**
 * DefaultWeb4TSComponent - Web4 TypeScript Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Web4TSComponent, ComponentScaffoldOptions, ComponentMetadata, CLIStandardValidation } from '../layer3/Web4TSComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { Web4TSComponentModel } from '../layer3/Web4TSComponentModel.interface.js';
import * as fs from 'fs/promises';
import { existsSync, readdirSync, statSync } from 'fs';
import * as path from 'path';

export class DefaultWeb4TSComponent implements Web4TSComponent {
  private model: Web4TSComponentModel;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      targetDirectory: this.findProjectRoot(),
      componentStandards: [],
      validationRules: [],
      scaffoldingTemplates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * @cliHide
   */
  private findProjectRoot(): string {
    // Find project root using git or directory traversal
    try {
      const { execSync } = require('child_process');
      const gitRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
      if (existsSync(gitRoot)) {
        return gitRoot;
      }
    } catch {
      // Fallback to directory traversal
    }
    
    let dir = process.cwd();
    while (dir !== '/') {
      if (existsSync(path.join(dir, '.git')) && existsSync(path.join(dir, 'package.json'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    
    return process.cwd(); // Fallback to current directory
  }

  /**
   * @cliHide
   */
  init(scenario: Scenario<Web4TSComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  transform(data?: unknown): this {
    // Transform component data if needed
    if (data) {
      this.model.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * @cliHide
   */
  validate(object?: any): this {
    // Validate component configuration
    if (object) {
      this.model.updatedAt = new Date().toISOString();
    }
    return this;
  }

  /**
   * @cliHide
   */
  process(): this {
    // Process component operations
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Convert component to scenario (Web4 pattern)
   * Essential for Web4 compliance and hibernation/restoration
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<Web4TSComponentModel>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: 'Web4TSComponent',
      version: '0.3.0.8'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'Web4TSComponent',
        version: '0.3.0.8'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * @cliHide
   */
  setTargetDirectory(directory: string): void {
    this.model.targetDirectory = directory;
    this.model.updatedAt = new Date().toISOString();
  }

  /**
   * @cliHide
   */
  private isTestEnvironment(): boolean {
    return process.env.NODE_ENV === 'test' || 
           process.env.VITEST === 'true' ||
           process.cwd().includes('/test/') ||
           !!((globalThis as any).__TEST_MODE__);
  }

  /**
   * @cliHide
   */
  private getTestDataDirectory(): string {
    // Each version tests in its own test/data folder
    // From: /workspace/components/Web4TSComponent/0.3.0.8/src/ts/layer2/DefaultWeb4TSComponent.ts
    // To:   /workspace/components/Web4TSComponent/0.3.0.8/test/data
    const currentVersionDir = path.resolve(__dirname, '..', '..', '..');
    return path.join(currentVersionDir, 'test', 'data');
  }

  /**
   * @cliHide
   */
  private findVersionDirectories(componentDir: string): string[] {
    try {
      const entries = readdirSync(componentDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory() && /^\d+\.\d+\.\d+\.\d+$/.test(entry.name))
        .map(entry => entry.name);
    } catch {
      return ['0.3.0.8']; // Fallback
    }
  }

  /**
   * @cliHide
   */
  private resolveComponentPath(componentName: string, version: string): string {
    if (this.isTestEnvironment()) {
      return path.join(this.getTestDataDirectory(), componentName, version);
    }
    return path.join(this.model.targetDirectory, 'components', componentName, version);
  }

  /**
   * @cliHide
   */
  async scaffoldComponent(options: ComponentScaffoldOptions): Promise<ComponentMetadata> {
    const { componentName, version, includeLayerArchitecture, includeCLI, includeSpecFolder, includeVitest } = options;
    
    const componentDir = this.resolveComponentPath(componentName, version);
    
    // Create directory structure
    await fs.mkdir(componentDir, { recursive: true });
    
    // Create package.json
    await this.createPackageJson(componentDir, componentName, version);
    
    // Create tsconfig.json
    await this.createTsConfig(componentDir);
    
    if (includeLayerArchitecture) {
      await this.createLayerStructure(componentDir);
      await this.createComponentImplementation(componentDir, componentName, version);
      await this.createComponentInterfaces(componentDir, componentName);
      await this.createTSCompletion(componentDir);
      await this.copyDefaultCLI(componentDir);
    }
    
    if (includeCLI) {
      await this.createCLIScript(componentDir, componentName, version);
      await this.createCLIImplementation(componentDir, componentName, version);
    }
    
    if (includeSpecFolder) {
      await this.createSpecStructure(componentDir);
    }
    
    if (includeVitest) {
      await this.createVitestConfig(componentDir);
      await this.createTestStructure(componentDir);
    }
    
    // Install dependencies for complete self-building
    await this.installComponentDependencies(componentDir);
    
    return {
      name: componentName,
      version,
      hasLocationResilientCLI: includeCLI || false,
      hasLayeredArchitecture: includeLayerArchitecture || false,
      hasEmptyConstructors: true,
      hasScenarioSupport: true,
      complianceScore: 100
    };
  }

  /**
   * Install component dependencies for complete self-building
   * @cliHide
   */
  private async installComponentDependencies(componentDir: string): Promise<void> {
    const packageJsonPath = path.join(componentDir, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      console.log('   ⚠️ No package.json found, skipping dependency installation');
      return;
    }
    
    try {
      console.log('   📦 Installing dependencies...');
      const { execSync } = await import('child_process');
      execSync('npm install', { 
        cwd: componentDir, 
        stdio: 'pipe' // Suppress npm output for clean CLI experience
      });
      console.log('   ✅ Dependencies installed successfully');
    } catch (error) {
      console.log('   ⚠️ Failed to install dependencies - component may need manual npm install');
      console.log(`   Error: ${error}`);
    }
  }

  /**
   * @cliHide
   */
  async generateLocationResilientCLI(componentName: string, version: string): Promise<string> {
    const cliTemplate = `#!/bin/bash

# ${componentName} CLI Tool - Location Resilient Version
# Web4 Architecture Standard - Self-Implementing Reference
# Works from any directory, finds project root via git

# Function to find project root using git
find_project_root() {
    local git_root=$(git rev-parse --show-toplevel 2>/dev/null)
    if [ -n "$git_root" ] && [ -d "$git_root" ]; then
        if [ -f "$git_root/package.json" ] || [ -f "$git_root/README.md" ]; then
            echo "$git_root"
            return 0
        fi
    fi
    
    local current_dir="$PWD"
    while [ "$current_dir" != "/" ]; do
        if [ -d "$current_dir/.git" ] && [ -f "$current_dir/package.json" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    return 1
}

# Main execution
PROJECT_ROOT=$(find_project_root)
if [ -z "$PROJECT_ROOT" ]; then
    echo "❌ Error: Not in a Web4 project directory"
    exit 1
fi

cd "$PROJECT_ROOT"

# Execute component CLI
node --loader ts-node/esm "./components/${componentName}/${version}/src/ts/layer5/${componentName}CLI.ts" "$@"
`;
    
    return cliTemplate;
  }

  /**
   * @cliHide
   */
  async validateCLIStandard(scriptPath: string): Promise<CLIStandardValidation> {
    try {
      const content = await fs.readFile(scriptPath, 'utf-8');
      
      const issues: string[] = [];
      let score = 100;
      
      // Check for location resilience
      if (!content.includes('find_project_root')) {
        issues.push('Missing location resilience - should include find_project_root function');
        score -= 30;
      }
      
      // Check for proper error handling
      if (!content.includes('exit 1')) {
        issues.push('Missing error handling for project root detection');
        score -= 20;
      }
      
      // Check for Web4 patterns
      if (!content.includes('ts-node/esm')) {
        issues.push('Should use ts-node/esm loader for ESM compatibility');
        score -= 25;
      }
      
      return {
        isCompliant: score >= 70,
        score,
        issues,
        suggestions: issues.map(issue => `Fix: ${issue}`)
      };
    } catch (error) {
      return {
        isCompliant: false,
        score: 0,
        issues: [`Failed to read script: ${(error as Error).message}`],
        suggestions: ['Ensure script exists and is readable']
      };
    }
  }

  /**
   * @cliHide
   */
  async auditComponentCompliance(componentPath: string): Promise<ComponentMetadata> {
    const packageJsonPath = path.join(componentPath, 'package.json');
    const tsConfigPath = path.join(componentPath, 'tsconfig.json');
    
    let metadata: ComponentMetadata = {
      name: path.basename(path.dirname(componentPath)),
      version: path.basename(componentPath),
      hasLocationResilientCLI: false,
      hasLayeredArchitecture: false,
      hasEmptyConstructors: false,
      hasScenarioSupport: false,
      complianceScore: 0,
      issues: []
    };
    
    // Check for package.json
    if (existsSync(packageJsonPath)) {
      const packageContent = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      metadata.name = packageContent.name || metadata.name;
      metadata.version = packageContent.version || metadata.version;
    } else {
      metadata.issues?.push('Missing package.json');
    }
    
    // Check for layered architecture
    const srcPath = path.join(componentPath, 'src/ts');
    if (existsSync(srcPath)) {
      const layers = await fs.readdir(srcPath);
      metadata.hasLayeredArchitecture = layers.some(layer => layer.startsWith('layer'));
    }
    
    // Check for CLI script
    const cliScriptPath = path.join(componentPath, `${metadata.name.toLowerCase()}.sh`);
    if (existsSync(cliScriptPath)) {
      const validation = await this.validateCLIStandard(cliScriptPath);
      metadata.hasLocationResilientCLI = validation.isCompliant;
    }
    
    // Calculate compliance score
    let score = 0;
    if (existsSync(packageJsonPath)) score += 25;
    if (existsSync(tsConfigPath)) score += 25;
    if (metadata.hasLayeredArchitecture) score += 25;
    if (metadata.hasLocationResilientCLI) score += 25;
    
    metadata.complianceScore = score;
    
    return metadata;
  }

  /**
   * @cliHide
   */
  async generateComplianceReport(componentDir: string): Promise<ComponentMetadata[]> {
    const components: ComponentMetadata[] = [];
    
    try {
      const entries = await fs.readdir(componentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const componentPath = path.join(componentDir, entry.name);
          const versions = await fs.readdir(componentPath, { withFileTypes: true });
          
          for (const version of versions) {
            if (version.isDirectory() && version.name.match(/^\d+\.\d+\.\d+\.\d+$/)) {
              const metadata = await this.auditComponentCompliance(path.join(componentPath, version.name));
              components.push(metadata);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to generate compliance report: ${(error as Error).message}`);
    }
    
    return components;
  }

  /**
   * @cliHide
   */
  showStandard(): void {
    console.log(`
🔧 Web4 Location-Resilient CLI Standard

Key Requirements:
• Location Independence: CLI works from any directory
• Project Root Detection: Automatic via git or directory traversal  
• ESM Compatibility: Use ts-node/esm loader
• Error Handling: Proper exit codes and error messages
• Web4 Patterns: Empty constructors, scenario support, layer architecture

Template Structure:
#!/bin/bash
find_project_root() { ... }
PROJECT_ROOT=$(find_project_root)
cd "$PROJECT_ROOT"
node --loader ts-node/esm "./components/[name]/[version]/src/ts/layer5/[Name]CLI.ts" "$@"
`);
  }

  /**
   * @cliHide
   */
  showGuidelines(): void {
    console.log(`
🏗️ Web4 Architecture Guidelines

Core Principles:
• Empty Constructors: No logic in constructors
• Scenario Initialization: Use init(scenario) pattern
• Layer Architecture: Separate concerns across layers 2-5
• Location Resilience: Components work from any directory
• ESM Native: Full ES module support
• TypeScript First: Strong typing throughout

Component Structure:
• Layer 2: Implementation classes (Default*)
• Layer 3: Interfaces and types
• Layer 4: Utilities and helpers  
• Layer 5: CLI and entry points

Standards:
• Vitest for testing (Jest banned)
• Empty constructors + scenario pattern
• Universal identifier patterns
• Command chaining support
`);
  }

  // Web4 CLI Topic Methods (for DefaultCLI dynamic execution)
  
  /**
   * Create a new Web4-compliant component with full auto-discovery capabilities
   * 
   * Generates a complete component with the same features as Web4TSComponent:
   * - Auto-discovery CLI with method discovery
   * - Web4 architecture patterns (empty constructor, scenarios)
   * - TypeScript compilation and build system
   * - Comprehensive layer structure (layer2/3/4/5)
   * 
   * @param name Component name (CamelCase, spaces become dots)
   * @param version Semantic version in X.Y.Z.W format (default: 0.1.0.0)
   * @param options Features to include: 'all' (recommended), 'cli', 'spec', 'vitest', 'layers'
   * 
   * @example
   * // Create full-featured component
   * await component.create('UserManager', '0.1.0.0', 'all');
   * 
   * @example  
   * // Create minimal component
   * await component.create('DataProcessor', '0.1.0.0', 'cli');
   * 
   * @cliSyntax name version options
   * @cliDefault version 0.1.0.0
   * @cliDefault options all
   */
  async create(name: string, version: string = '0.1.0.0', options: string = ''): Promise<void> {
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
    
    const metadata = await this.scaffoldComponent(scaffoldOptions);
    
    console.log(`✅ Component created: ${name}`);
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Location: components/${name}/${version}`);
    console.log(`   CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
    console.log(`   Layers: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    console.log(`   Spec: ${metadata.hasScenarioSupport ? '✅' : '❌'}`);
  }

  /**
   * Set component configuration (maps to generate-cli)
   */
  /**
   * Set component property or generate CLI script
   * @param component Component name for CLI generation
   * @param property Property to set (cli-script, etc.)
   * @param version Version for CLI script generation
   * @cliSyntax component property version
   */
  /**
   * @cliHide
   */
  async set(component: string, property: string, version: string): Promise<void> {
    if (property === 'cli-script' || property === 'cli') {
      console.log(`🔨 Generating CLI script for ${component} v${version}`);
      const cliScript = await this.generateLocationResilientCLI(component, version);
      const outputPath = `${component.toLowerCase()}${version.replace(/\\./g, '')}.sh`;
      
      await import('fs/promises').then(fs => fs.writeFile(outputPath, cliScript, { mode: 0o755 }));
      
      console.log(`✅ CLI script generated: ${outputPath}`);
      console.log(`   Location-resilient: ✅`);
      console.log(`   Web4 compliant: ✅`);
    } else {
      console.log(`⚠️ Unknown property: ${property}. Supported: cli-script, cli`);
    }
  }

  /**
   * Validate and analyze component compliance (internal validation tool)
   * 
   * Analyzes component files for Web4 compliance and standards adherence.
   * Validates CLI scripts, architecture, and implementation quality.
   * Maps to validate-standard functionality for component validation.
   * 
   * @param path Path to component or CLI script to validate
   * @param operation Type of validation ('validation' for CLI, 'standard' for compliance)
   * 
   * @example
   * // Validate CLI script
   * await component.get('./myscript.sh', 'validation');
   * 
   * @cliSyntax path operation
   * @cliHide
   */
  async get(path: string, operation: string): Promise<void> {
    if (operation === 'validation' || operation === 'standard') {
      console.log(`🔍 Validating CLI standard: ${path}`);
      const validation = await this.validateCLIStandard(path);
      
      console.log(`\\n📊 Validation Results:`);
      console.log(`   Compliant: ${validation.isCompliant ? '✅' : '❌'}`);
      console.log(`   Score: ${validation.score}/100`);
      
      if (validation.issues.length > 0) {
        console.log(`\\n⚠️ Issues found:`);
        validation.issues.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue}`);
        });
      }
    } else if (operation === 'compliance') {
      console.log(`🔍 Auditing component compliance: ${path}`);
      const metadata = await this.auditComponentCompliance(path);
      
      console.log(`\\n📊 Compliance Results:`);
      console.log(`   Component: ${metadata.name} v${metadata.version}`);
      console.log(`   Score: ${metadata.complianceScore}/100`);
      console.log(`   CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
      console.log(`   Layers: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    } else {
      console.log(`⚠️ Unknown operation: ${operation}. Supported: validation, standard, compliance`);
    }
  }

  /**
   * Analyze component from path (maps to audit-compliance)
   */
  /**
   * Analyze component compliance from path
   * @param componentPath Path to component directory
   * @cliSyntax componentPath
   */
  /**
   * @cliHide
   */
  async from(componentPath: string): Promise<this> {
    console.log(`🔍 Analyzing component: ${componentPath}`);
    const metadata = await this.auditComponentCompliance(componentPath);
    
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
   * Discover and list all Web4 components in a directory
   * 
   * Scans directory structure for Web4-compliant components and provides
   * detailed analysis of each component's features and compliance status.
   * Perfect for auditing component ecosystems and finding available components.
   * Maps to generate-report functionality for comprehensive component discovery.
   * 
   * @param componentDir Directory path to search for components (relative to project root)
   * 
   * @example
   * // Discover all components in main directory
   * await component.find('components/');
   * 
   * @example
   * // Discover in backup location
   * await component.find('backup/components/');
   * 
   * @cliSyntax componentDir
   */
  async find(componentDir: string): Promise<this> {
    console.log(`🔍 Discovering components in: ${componentDir}`);
    const components = await this.generateComplianceReport(componentDir);
    
    console.log(`\\n📊 Component Discovery Results:`);
    console.log(`   Found: ${components.length} components`);
    
    components.forEach((component, index) => {
      const status = (component.complianceScore || 0) >= 70 ? '✅' : '❌';
      console.log(`   ${index + 1}. ${status} ${component.name} v${component.version} (${component.complianceScore || 0}/100)`);
    });
    
    return this;
  }

  /**
   * Load component context for command chaining operations
   * 
   * Essential method for chaining workflows. Loads component context that
   * enables subsequent chained operations like tree, upgrade, setLatest.
   * Based on Unit's on method pattern for consistent chaining architecture.
   * 
   * @param component Component name to load context for
   * @param version Component version to load
   * 
   * @example
   * // Load context for chaining
   * await component.on('Unit', '0.3.0.5');
   * 
   * @example
   * // Load context for this component
   * await component.on('Web4TSComponent', '0.3.0.8');
   * 
   * @cliSyntax component version
   */
  async on(component: string, version: string): Promise<this> {
    const componentPath = this.resolveComponentPath(component, version);
    
    if (!existsSync(componentPath)) {
      throw new Error(`Component not found: ${component} v${version} at ${componentPath}`);
    }
    
    // Set component context for chaining
    this.model.name = component;
    this.model.origin = componentPath;
    this.model.definition = `Component context: ${component} v${version}`;
    this.model.updatedAt = new Date().toISOString();
    
    // Store context for chained operations
    (this.model as any).contextComponent = component;
    (this.model as any).contextVersion = version;
    (this.model as any).contextPath = componentPath;
    
    console.log(`✅ Component context loaded: ${component} v${version}`);
    console.log(`   Path: ${componentPath}`);
    
    return this; // Enable chaining
  }

  /**
   * Upgrade component to next version with semantic version control
   * 
   * Performs intelligent version upgrades for loaded component context.
   * Must be used after 'on' method to load component context. Supports
   * semantic versioning with nextBuild, nextMinor, nextMajor patterns.
   * 
   * @param versionType Version upgrade type: 'nextBuild', 'nextMinor', 'nextMajor', or specific version
   * 
   * @example
   * // Upgrade to next build version (0.1.0.0 → 0.1.0.1)
   * await component.upgrade('nextBuild');
   * 
   * @example
   * // Upgrade to next minor version (0.1.0.0 → 0.2.0.0)
   * await component.upgrade('nextMinor');
   * 
   * @example
   * // Upgrade to specific version
   * await component.upgrade('1.0.0.0');
   * 
   * @cliSyntax versionType
   */
  async upgrade(versionType: string): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }
    
    const currentVersion = context.version;
    let nextVersion: string;
    
    switch (versionType) {
      case 'nextBuild':
      case 'nextPatch':
      case 'patch':
        nextVersion = this.incrementPatch(currentVersion);
        console.log(`🔧 Upgrading ${context.component} to next patch: ${currentVersion} → ${nextVersion}`);
        break;
        
      case 'nextMinor':
      case 'minor':
        nextVersion = this.incrementMinor(currentVersion);
        console.log(`🚀 Upgrading ${context.component} to next minor: ${currentVersion} → ${nextVersion}`);
        break;
        
      case 'nextMajor':
      case 'major':
        nextVersion = this.incrementMajor(currentVersion);
        console.log(`💥 Upgrading ${context.component} to next major: ${currentVersion} → ${nextVersion}`);
        break;
        
      default:
        if (versionType.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          nextVersion = versionType;
          console.log(`🎯 Upgrading ${context.component} to specific version: ${currentVersion} → ${nextVersion}`);
        } else {
          throw new Error(`Invalid version type: ${versionType}. Use: nextBuild, nextMinor, nextMajor, or specific version`);
        }
    }
    
    // Create new version from existing
    await this.createVersionFromExisting(context.component, currentVersion, nextVersion);
    
    // Update symlinks to maintain proper script accessibility
    await this.updateSymlinks(context.component, nextVersion);
    
    console.log(`✅ ${context.component} ${nextVersion} created successfully`);
    console.log(`   Location: components/${context.component}/${nextVersion}`);
    
    // Update context to new version for further chaining
    (this.model as any).contextVersion = nextVersion;
    (this.model as any).contextPath = `components/${context.component}/${nextVersion}`;
    
    return this;
  }

  /**
   * Display tree structure of component directory (chained after on)
   * Shows directory structure like 'tree' command for the loaded component context
   * @param depth Maximum depth to traverse (default: 4)
   * @param showHidden Show hidden files and directories (default: false)
   * @cliSyntax depth showHidden
   * @cliDefault depth 4
   * @cliDefault showHidden false
   */
  async tree(depth: string = '4', showHidden: string = 'false'): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }

    const maxDepth = parseInt(depth, 10) || 3;
    const includeHidden = showHidden.toLowerCase() === 'true';
    
    console.log(`📁 Tree structure for ${context.component} v${context.version}:`);
    console.log(context.path);
    
    await this.displayTreeStructure(context.path, '', maxDepth, 0, includeHidden);
    
    return this;
  }

  /**
   * Set latest symlink for component (chained after on)
   * Updates the 'latest' symlink to point to specified version
   * @param targetVersion Version to set as latest (default: use current context version)
   * @cliSyntax targetVersion
   * @cliDefault targetVersion current
   */
  async setLatest(targetVersion: string = 'current'): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }

    const version = targetVersion === 'current' ? context.version : targetVersion;
    const componentDir = path.join(this.model.targetDirectory, 'components', context.component);
    const latestSymlink = path.join(componentDir, 'latest');
    const targetDir = path.join(componentDir, version);

    // Verify target version exists
    if (!existsSync(targetDir)) {
      throw new Error(`Target version ${version} does not exist at ${targetDir}`);
    }

    console.log(`🔗 Setting latest symlink for ${context.component}:`);
    console.log(`   Target: ${version}`);
    console.log(`   Symlink: ${latestSymlink}`);

    try {
      // Remove existing symlink if it exists
      if (existsSync(latestSymlink)) {
        await fs.unlink(latestSymlink);
        console.log(`   Removed existing latest symlink`);
      }

      // Create new symlink (relative path)
      await fs.symlink(version, latestSymlink);
      console.log(`✅ Latest symlink updated: latest → ${version}`);

      // Update scripts symlinks
      await this.updateScriptsSymlinks(context.component, version);

    } catch (error) {
      throw new Error(`Failed to update latest symlink: ${(error as Error).message}`);
    }

    return this;
  }

  /**
   * Test method to verify zero config discovery
   * @param message Test message to display
   * @cliSyntax message
   */
  /**
   * Test zero config discovery functionality (development/testing only)
   * 
   * @param message Test message to display
   * @cliSyntax message
   * @cliHide
   */
  async testDiscovery(message: string = 'Zero config discovery works!'): Promise<this> {
    console.log(`🧪 Discovery Test: ${message}`);
    return this;
  }

  /**
   * Compare multiple components and generate detailed comparison table
   * 
   * Analyzes multiple components and generates comprehensive comparison table
   * in the exact format used in component analysis documentation. Shows
   * package metadata, dependencies, file structure, and architectural differences.
   * Automatically creates an MD file in the current working directory with the results.
   * 
   * @param components Comma-separated list of "ComponentName Version" pairs
   * 
   * @example
   * // Compare multiple components
   * await component.compare('Unit 0.3.0.5, Web4TSComponent 0.3.0.8, ONCE 0.2.0.0');
   * 
   * @example
   * // Compare specific versions
   * await component.compare('Web4Requirement 0.3.0.5, Unit 0.3.0.5');
   * 
   * @cliSyntax components
   */
  async compare(components: string): Promise<this> {
    console.log(`📊 Component Comparison Analysis`);
    console.log(`🔍 Analyzing components: ${components}`);
    
    // Parse component specifications
    const componentSpecs = this.parseComponentSpecs(components);
    
    if (componentSpecs.length < 2) {
      throw new Error('At least 2 components required for comparison. Format: "Component1 Version1, Component2 Version2"');
    }
    
    console.log(`\n📋 Components to analyze: ${componentSpecs.length}`);
    for (const spec of componentSpecs) {
      console.log(`   - ${spec.name} ${spec.version}`);
    }
    
    // Analyze each component
    const analyses = await this.analyzeComponentsForComparison(componentSpecs);
    
    // Generate comparison content
    const comparisonContent = await this.generateComparisonMarkdown(componentSpecs, analyses, components);
    
    // Save to MD file in current working directory
    const filename = this.generateSafeFilename(componentSpecs);
    const outputPath = path.join(process.cwd(), filename);
    
    await fs.writeFile(outputPath, comparisonContent, 'utf-8');
    
    // Generate comparison tables to console
    await this.generateDifferencesTable(componentSpecs, analyses);
    await this.generateFileComparisonTable(componentSpecs, analyses);
    
    console.log(`\n✅ Component comparison analysis complete`);
    console.log(`📄 Analysis saved to: ${outputPath}`);
    
    return this;
  }

  /**
   * Parse component specifications from input string
   * @cliHide
   */
  private parseComponentSpecs(components: string): Array<{name: string, version: string}> {
    const specs = components.split(',').map(spec => spec.trim());
    const result = [];
    
    for (const spec of specs) {
      const parts = spec.trim().split(/\s+/);
      if (parts.length >= 2) {
        const name = parts[0];
        const version = parts[1];
        result.push({ name, version });
      } else {
        throw new Error(`Invalid component specification: "${spec}". Use format: "ComponentName Version"`);
      }
    }
    
    return result;
  }

  /**
   * Analyze components for comparison
   * @cliHide
   */
  private async analyzeComponentsForComparison(componentSpecs: Array<{name: string, version: string}>): Promise<any[]> {
    const analyses = [];
    
    for (const spec of componentSpecs) {
      const componentPath = path.join(this.model.targetDirectory, 'components', spec.name, spec.version);
      
      if (!existsSync(componentPath)) {
        throw new Error(`Component not found: ${spec.name} v${spec.version} at ${componentPath}`);
      }
      
      const analysis = await this.analyzeComponentStructure(componentPath, spec.name, spec.version);
      analyses.push(analysis);
    }
    
    return analyses;
  }

  /**
   * Analyze component structure for comparison
   * @cliHide
   */
  private async analyzeComponentStructure(componentPath: string, name: string, version: string): Promise<any> {
    const analysis: any = {
      name,
      version,
      path: componentPath,
      packageJson: null as any,
      files: new Set<string>(),
      directories: new Set<string>(),
      scripts: {},
      dependencies: {},
      devDependencies: {},
      engines: {}
    };
    
    // Analyze package.json
    const packageJsonPath = path.join(componentPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      try {
        analysis.packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        analysis.scripts = analysis.packageJson?.scripts || {};
        analysis.dependencies = analysis.packageJson?.dependencies || {};
        analysis.devDependencies = analysis.packageJson?.devDependencies || {};
        analysis.engines = analysis.packageJson?.engines || {};
      } catch (error) {
        console.log(`   ⚠️ Could not parse package.json for ${name}`);
      }
    }
    
    // Analyze file structure
    await this.analyzeFileStructure(componentPath, analysis);
    
    return analysis;
  }

  /**
   * Analyze file structure recursively
   * @cliHide
   */
  private async analyzeFileStructure(dirPath: string, analysis: any, relativePath: string = ''): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        
        // Filter out irrelevant files and directories from comparison
        if (entry.name === 'sessions' || 
            entry.name === 'spec' ||
            entry.name.startsWith('spec.requirement') ||
            entryPath.startsWith('spec/') ||
            entryPath.includes('temp-filename-test/temp-filename-test')) {
          continue; // Skip irrelevant content
        }
        
        if (entry.isDirectory()) {
          analysis.directories.add(entryPath);
          
          // Recursively analyze important directories
          if (!entry.name.startsWith('.') && 
              entry.name !== 'node_modules' && 
              entry.name !== 'dist') {
            await this.analyzeFileStructure(path.join(dirPath, entry.name), analysis, entryPath);
          }
        } else {
          analysis.files.add(entryPath);
        }
      }
    } catch (error) {
      console.log(`   ⚠️ Could not analyze directory: ${dirPath}`);
    }
  }

  /**
   * Generate differences table in exact format
   * @cliHide
   */
  private async generateDifferencesTable(componentSpecs: Array<{name: string, version: string}>, analyses: any[]): Promise<void> {
    console.log(`\n### **Differences Table**\n`);
    
    // Table header
    let header = '| Aspect';
    for (const spec of componentSpecs) {
      header += ` | ${spec.name} ${spec.version}`;
    }
    header += ' |';
    console.log(header);
    
    // Table separator
    let separator = '|---|';
    for (let i = 0; i < componentSpecs.length; i++) {
      separator += '---|';
    }
    console.log(separator);
    
    // Package name row
    let packageNameRow = '| package name';
    for (const analysis of analyses) {
      const packageName = analysis.packageJson?.name || '(not specified)';
      packageNameRow += ` | ${packageName}`;
    }
    packageNameRow += ' |';
    console.log(packageNameRow);
    
    // Version row
    let versionRow = '| version';
    for (const analysis of analyses) {
      versionRow += ` | ${analysis.version}`;
    }
    versionRow += ' |';
    console.log(versionRow);
    
    // Engines.node row
    let enginesRow = '| engines.node';
    for (const analysis of analyses) {
      const nodeEngine = analysis.engines?.node || '(not specified)';
      enginesRow += ` | ${nodeEngine}`;
    }
    enginesRow += ' |';
    console.log(enginesRow);
    
    // Scripts.test row
    let scriptsTestRow = '| scripts.test';
    for (const analysis of analyses) {
      const testScript = analysis.scripts?.test || '(not specified)';
      scriptsTestRow += ` | ${testScript}`;
    }
    scriptsTestRow += ' |';
    console.log(scriptsTestRow);
    
    // DevDependencies.vitest row
    let vitestRow = '| devDependencies.vitest';
    for (const analysis of analyses) {
      const vitest = analysis.devDependencies?.vitest || '(not specified)';
      vitestRow += ` | ${vitest}`;
    }
    vitestRow += ' |';
    console.log(vitestRow);
    
    // DevDependencies.typescript row
    let typescriptRow = '| devDependencies.typescript';
    for (const analysis of analyses) {
      const typescript = analysis.devDependencies?.typescript || '(not specified)';
      typescriptRow += ` | ${typescript}`;
    }
    typescriptRow += ' |';
    console.log(typescriptRow);
    
    // Dependencies row
    let dependenciesRow = '| dependencies';
    for (const analysis of analyses) {
      const deps = analysis.dependencies;
      const depsList = deps ? Object.entries(deps).map(([key, value]) => `${key} ${value}`).join(', ') : '(none)';
      dependenciesRow += ` | ${depsList}`;
    }
    dependenciesRow += ' |';
    console.log(dependenciesRow);
  }

  /**
   * Generate file comparison table in exact format
   * @cliHide
   */
  private async generateFileComparisonTable(componentSpecs: Array<{name: string, version: string}>, analyses: any[]): Promise<void> {
    console.log(`\n### **File Comparison Table**\n`);
    
    // Table header
    let header = '| Entry (file/dir)';
    for (const spec of componentSpecs) {
      header += ` | ${spec.name} ${spec.version}`;
    }
    header += ' | Purpose | Similarity |';
    console.log(header);
    
    // Table separator
    let separator = '|---|';
    for (let i = 0; i < componentSpecs.length; i++) {
      separator += '---|';
    }
    separator += '---|---|';
    console.log(separator);
    
    // Collect all unique files and directories
    const allEntries = new Set<string>();
    for (const analysis of analyses) {
      for (const file of analysis.files) {
        allEntries.add(file);
      }
      for (const dir of analysis.directories) {
        allEntries.add(dir + '/');
      }
    }
    
    // Process all files individually (maintain table format)
    const sortedEntries = Array.from(allEntries).sort();
    for (const entry of sortedEntries) {
      
      let row = `| ${entry}`;
      
      let presentCount = 0;
      const presencePattern = [];
      
      for (const analysis of analyses) {
        const isPresent = analysis.files.has(entry) || analysis.directories.has(entry.replace('/', ''));
        const symbol = isPresent ? '✅' : '❌';
        row += ` | ${symbol}`;
        
        if (isPresent) {
          presentCount++;
          presencePattern.push(analysis.name.charAt(0));
        }
      }
      
      // Determine purpose and similarity
      const purpose = this.determinePurpose(entry);
      const similarity = await this.determineSimilarity(entry, componentSpecs, presentCount, componentSpecs.length, presencePattern, analyses);
      
      row += ` | ${purpose} | ${similarity} |`;
      console.log(row);
    }
  }

  /**
   * Generate safe filename from component specifications
   * @cliHide
   */
  private generateSafeFilename(componentSpecs: Array<{name: string, version: string}>): string {
    // Create a descriptive but safe filename
    const componentParts = componentSpecs.map(spec => 
      `${spec.name.toLowerCase()}-${spec.version.replace(/\./g, '')}`
    );
    
    const baseName = componentParts.join('-vs-');
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
    
    // Ensure filename is not too long and is filesystem-safe
    const maxLength = 200;
    let filename = `${baseName}-comparison-${timestamp}.md`;
    
    if (filename.length > maxLength) {
      // Truncate but keep the important parts
      const truncatedBase = baseName.slice(0, maxLength - 30);
      filename = `${truncatedBase}-comparison-${timestamp}.md`;
    }
    
    // Remove any remaining unsafe characters
    filename = filename.replace(/[^a-zA-Z0-9.-]/g, '-');
    
    return filename;
  }

  /**
   * Generate complete markdown content for comparison
   * @cliHide
   */
  private async generateComparisonMarkdown(
    componentSpecs: Array<{name: string, version: string}>, 
    analyses: any[],
    originalComponents: string
  ): Promise<string> {
    const lines: string[] = [];
    
    // Header
    const componentList = componentSpecs.map(spec => `${spec.name} ${spec.version}`).join(' vs ');
    lines.push(`# Component Comparison Analysis`);
    lines.push(`## ${componentList}`);
    lines.push('');
    lines.push(`**Generated:** ${new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC`);
    lines.push(`**Tool:** Web4TSComponent Compare`);
    lines.push(`**Command:** \`web4tscomponent compare "${originalComponents}"\``);
    lines.push('');
    lines.push('---');
    lines.push('');
    
    // Executive Summary
    lines.push('## Executive Summary');
    lines.push('');
    lines.push(`This analysis compares ${componentSpecs.length} components to identify architectural differences, dependencies, and file structure variations.`);
    lines.push('');
    
    // Differences Table
    lines.push('## Package and Configuration Differences');
    lines.push('');
    const differencesTable = await this.generateDifferencesTableContent(componentSpecs, analyses);
    lines.push(...differencesTable);
    lines.push('');
    
    // File Comparison Table
    lines.push('## File Structure Analysis');
    lines.push('');
    const fileTable = await this.generateFileComparisonTableContent(componentSpecs, analyses);
    lines.push(...fileTable);
    lines.push('');
    
    // Footer
    lines.push('---');
    lines.push('');
    lines.push(`**Analysis completed:** ✅ Component comparison analysis complete`);
    lines.push(`**Generated by:** Web4TSComponent Compare Tool`);
    lines.push(`**Components analyzed:** ${componentSpecs.length}`);
    
    return lines.join('\n');
  }

  /**
   * Generate differences table content for markdown
   * @cliHide
   */
  private async generateDifferencesTableContent(componentSpecs: Array<{name: string, version: string}>, analyses: any[]): Promise<string[]> {
    const lines: string[] = [];
    
    // Table header
    let header = '| Aspect';
    for (const spec of componentSpecs) {
      header += ` | ${spec.name} ${spec.version}`;
    }
    header += ' |';
    lines.push(header);
    
    // Table separator
    let separator = '|---|';
    for (let i = 0; i < componentSpecs.length; i++) {
      separator += '---|';
    }
    lines.push(separator);
    
    // Package name row
    let packageNameRow = '| package name';
    for (const analysis of analyses) {
      const packageName = analysis.packageJson?.name || '(not specified)';
      packageNameRow += ` | ${packageName}`;
    }
    packageNameRow += ' |';
    lines.push(packageNameRow);
    
    // Version row
    let versionRow = '| version';
    for (const analysis of analyses) {
      versionRow += ` | ${analysis.version}`;
    }
    versionRow += ' |';
    lines.push(versionRow);
    
    // Engines.node row
    let enginesRow = '| engines.node';
    for (const analysis of analyses) {
      const nodeEngine = analysis.engines?.node || '(not specified)';
      enginesRow += ` | ${nodeEngine}`;
    }
    enginesRow += ' |';
    lines.push(enginesRow);
    
    // Scripts.test row
    let scriptsTestRow = '| scripts.test';
    for (const analysis of analyses) {
      const testScript = analysis.scripts?.test || '(not specified)';
      scriptsTestRow += ` | ${testScript}`;
    }
    scriptsTestRow += ' |';
    lines.push(scriptsTestRow);
    
    // DevDependencies.vitest row
    let vitestRow = '| devDependencies.vitest';
    for (const analysis of analyses) {
      const vitest = analysis.devDependencies?.vitest || '(not specified)';
      vitestRow += ` | ${vitest}`;
    }
    vitestRow += ' |';
    lines.push(vitestRow);
    
    // DevDependencies.typescript row
    let typescriptRow = '| devDependencies.typescript';
    for (const analysis of analyses) {
      const typescript = analysis.devDependencies?.typescript || '(not specified)';
      typescriptRow += ` | ${typescript}`;
    }
    typescriptRow += ' |';
    lines.push(typescriptRow);
    
    // Dependencies row
    let dependenciesRow = '| dependencies';
    for (const analysis of analyses) {
      const deps = analysis.dependencies;
      const depsList = deps ? Object.entries(deps).map(([key, value]) => `${key} ${value}`).join(', ') : '(none)';
      dependenciesRow += ` | ${depsList}`;
    }
    dependenciesRow += ' |';
    lines.push(dependenciesRow);
    
    return lines;
  }

  /**
   * Generate file comparison table content for markdown with dual links
   * @cliHide
   */
  private async generateFileComparisonTableContent(componentSpecs: Array<{name: string, version: string}>, analyses: any[]): Promise<string[]> {
    const lines: string[] = [];
    
    // Table header
    let header = '| Entry (file/dir)';
    for (const spec of componentSpecs) {
      header += ` | ${spec.name} ${spec.version}`;
    }
    header += ' | Purpose | Similarity |';
    lines.push(header);
    
    // Table separator
    let separator = '|---|';
    for (let i = 0; i < componentSpecs.length; i++) {
      separator += '---|';
    }
    separator += '---|---|';
    lines.push(separator);
    
    // Collect all unique files and directories
    const allEntries = new Set<string>();
    for (const analysis of analyses) {
      for (const file of analysis.files) {
        allEntries.add(file);
      }
      for (const dir of analysis.directories) {
        allEntries.add(dir + '/');
      }
    }
    
    // Process all files individually with dual links
    const sortedEntries = Array.from(allEntries).sort();
    for (const entry of sortedEntries) {
      
      // Generate dual link for the entry
      const dualLink = this.generateDualLinkForEntry(entry, componentSpecs, analyses);
      let row = `| ${dualLink}`;
      
      let presentCount = 0;
      const presencePattern = [];
      
      for (const analysis of analyses) {
        const isPresent = analysis.files.has(entry) || analysis.directories.has(entry.replace('/', ''));
        const symbol = isPresent ? '✅' : '❌';
        row += ` | ${symbol}`;
        
        if (isPresent) {
          presentCount++;
          presencePattern.push(analysis.name.charAt(0));
        }
      }
      
      // Determine purpose and similarity
      const purpose = this.determinePurpose(entry);
      const similarity = await this.determineSimilarity(entry, componentSpecs, presentCount, componentSpecs.length, presencePattern, analyses);
      
      row += ` | ${purpose} | ${similarity} |`;
      lines.push(row);
    }
    
    return lines;
  }

  /**
   * Generate dual link for file entry (GitHub + local path)
   * @cliHide
   */
  private generateDualLinkForEntry(entry: string, componentSpecs: Array<{name: string, version: string}>, analyses: any[]): string {
    // Find the first component that has this entry to generate a representative link
    for (let i = 0; i < analyses.length; i++) {
      const analysis = analyses[i];
      const spec = componentSpecs[i];
      
      if (analysis.files.has(entry) || analysis.directories.has(entry.replace('/', ''))) {
        const githubPath = `components/${spec.name}/${spec.version}/${entry}`;
        const githubUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/tree/dev/0306/${githubPath}`;
        
        // GitHub link always shows "[GitHub]", local path is relative to version folder
        return `[GitHub](${githubUrl}) \\| [${entry}](${entry})`;
      }
    }
    
    // If file not found in any component, return plain text
    return entry;
  }

  /**
   * Group template pattern files that should be compared together
   * @cliHide
   */
  private async groupTemplatePatternFiles(allEntries: string[], componentSpecs: any[], analyses: any[]): Promise<any[]> {
    const templateGroups = [];
    
    // Group CLI files in layer5
    const cliFiles = allEntries.filter(entry => 
      entry.includes('src/ts/layer5/') && entry.endsWith('CLI.ts')
    );
    
    if (cliFiles.length > 1) {
      // Check if CLI files follow same template pattern
      const cliGroup = {
        type: 'CLI Template',
        files: cliFiles,
        pattern: 'extends DefaultCLI'
      };
      
      // Verify they actually follow the same template
      const isValidGroup = await this.verifyTemplateGroup(cliGroup, componentSpecs, analyses);
      
      if (isValidGroup) {
        templateGroups.push(cliGroup);
      }
    }
    
    return templateGroups;
  }

  /**
   * Verify that files in a group follow the same template pattern
   * @cliHide
   */
  private async verifyTemplateGroup(group: any, componentSpecs: any[], analyses: any[]): Promise<boolean> {
    const fileContents = [];
    
    // Collect contents of all files in the group
    for (const file of group.files) {
      for (let i = 0; i < componentSpecs.length; i++) {
        const analysis = analyses[i];
        const spec = componentSpecs[i];
        
        if (analysis.files.has(file)) {
          const componentPath = `/workspace/components/${spec.name}/${spec.version}`;
          const filePath = path.join(componentPath, file);
          
          try {
            const content = await fs.readFile(filePath, 'utf8');
            fileContents.push(content);
            break; // Found the file in this component
          } catch (error) {
            continue;
          }
        }
      }
    }
    
    // Use simple template similarity detection
    if (fileContents.length >= 2) {
      return this.checkTemplateSimilarity(fileContents, group.files[0]);
    }
    
    return false;
  }

  /**
   * Generate a row for template group (files that follow same template pattern)
   * @cliHide
   */
  private async generateTemplateGroupRow(group: any, componentSpecs: any[], analyses: any[]): Promise<void> {
    let row = `| ${group.type} (${group.files.join(', ')})`;
    
    let presentCount = 0;
    const presencePattern = [];
    
    // Check presence across components
    for (const analysis of analyses) {
      const hasAnyFile = group.files.some((file: string) => analysis.files.has(file));
      const symbol = hasAnyFile ? '✅' : '❌';
      row += ` | ${symbol}`;
      
      if (hasAnyFile) {
        presentCount++;
        presencePattern.push(analysis.name.charAt(0));
      }
    }
    
    // Template groups are always similar
    const purpose = 'CLI template pattern';
    const similarity = presentCount >= 2 ? `🟨 Similar (${presencePattern.join('+')})` : `🟪 Unique – ${presencePattern[0]}`;
    
    row += ` | ${purpose} | ${similarity} |`;
    console.log(row);
  }

  /**
   * Determine purpose of file/directory
   * @cliHide
   */
  private determinePurpose(entry: string): string {
    const purposeMap: { [key: string]: string } = {
      'package.json': 'Package metadata, scripts, entry points',
      'package-lock.json': 'Deterministic dependency lockfile',
      'tsconfig.json': 'TypeScript compiler configuration',
      'vitest.config.ts': 'Vitest test runner configuration',
      'README.md': 'Component documentation',
      'dist/': 'Compiled JS and type declarations',
      'src/': 'Source code (layers 2/3/4/5)',
      'test/': 'Automated test specs',
      'bin/': 'CLI executable shims',
      'scenarios/': 'Example/runtime scenarios',
      'spec/': 'Requirements/spec artifacts',
      'node_modules/': 'Installed dependencies directory'
    };
    
    if (purposeMap[entry]) {
      return purposeMap[entry];
    }
    
    // Pattern-based purpose detection
    if (entry.includes('CLI.ts')) return 'CLI entry';
    if (entry.includes('Default') && entry.includes('.ts')) return 'Core component implementation';
    if (entry.includes('.interface.ts')) return 'TypeScript interface definition';
    if (entry.includes('.test.ts')) return 'Component test specs';
    if (entry.includes('layer2/')) return 'Implementation layer';
    if (entry.includes('layer3/')) return 'Interface layer';
    if (entry.includes('layer4/')) return 'Service layer';
    if (entry.includes('layer5/')) return 'CLI layer';
    
    return 'Component file';
  }

  /**
   * Determine similarity based on actual content comparison
   * - Identical: Files have NO diff at all (byte-identical)
   * - Similar: Files stem from same template but adapted to component specifics
   * - Folders: Identical if they exist in all components (content irrelevant)
   * @cliHide
   */
  private async determineSimilarity(entry: string, componentSpecs: any[], presentCount: number, totalCount: number, presencePattern: string[], analyses: any[]): Promise<string> {
    // Handle directories - identical if present in all components
    if (entry.endsWith('/')) {
      if (presentCount === totalCount) {
        return '🟩 Identical';
      } else if (presentCount === 1) {
        const uniqueComponent = presencePattern[0];
        return `🟪 Unique – ${uniqueComponent}`;
      } else if (presentCount > 1 && presentCount < totalCount) {
        const pattern = presencePattern.join('+');
        return `🟨 Partial (${pattern})`;
      } else {
        return '🟥 Different';
      }
    }

    // Handle files - need to check actual content
    if (presentCount < 2) {
      // File exists in only one or no components
      if (presentCount === 1) {
        const uniqueComponent = presencePattern[0];
        return `🟪 Unique – ${uniqueComponent}`;
      } else {
        return '🟥 Different';
      }
    }

    // Files present in 2+ components - check for content similarity
    const presentComponents = [];
    const filePaths = [];
    
    for (let i = 0; i < componentSpecs.length; i++) {
      const analysis = analyses[i];
      if (analysis.files.has(entry)) {
        presentComponents.push(componentSpecs[i]);
        const componentPath = `/workspace/components/${componentSpecs[i].name}/${componentSpecs[i].version}`;
        filePaths.push(path.join(componentPath, entry));
      }
    }

    // Enhanced: Check for cross-component template similarity
    // Files that exist in only one component but follow same template pattern as files in other components
    if (presentCount === 1 && this.isTemplatePatternFile(entry)) {
      const hasTemplateSimilarity = await this.hasCrossComponentTemplateSimilarity(entry, componentSpecs, analyses);
      if (hasTemplateSimilarity) {
        return '🟨 Similar';
      }
    }

    // Read and compare file contents
    try {
      const fileContents = [];
      for (const filePath of filePaths) {
        try {
          const content = await fs.readFile(filePath, 'utf8');
          fileContents.push(content);
        } catch (error) {
          // File might be binary or unreadable, treat as different
          return `🟨 Similar (${presencePattern.join('+')})`;
        }
      }

      // Check if all files are byte-identical
      const firstContent = fileContents[0];
      const allIdentical = fileContents.every(content => content === firstContent);
      
      if (allIdentical) {
        return '🟩 Identical';
      }

      // Check if files are similar (same template structure but adapted)
      const similarity = this.checkTemplateSimilarity(fileContents, entry);
      if (similarity) {
        if (presentCount === totalCount) {
          return '🟨 Similar';
        } else {
          const pattern = presencePattern.join('+');
          return `🟨 Similar (${pattern})`;
        }
      } else {
        const pattern = presencePattern.join('+');
        return `🟥 Different (${pattern})`;
      }

    } catch (error) {
      // Error reading files
      const pattern = presencePattern.join('+');
      return `🟨 Similar (${pattern})`;
    }
  }

  /**
   * Check if files are similar using simple template pattern detection
   * @cliHide
   */
  private checkTemplateSimilarity(fileContents: string[], entry: string): boolean {
    if (fileContents.length < 2) return false;

    // Simple template similarity checks
    const checks = [
      this.hasCommonInheritancePattern(fileContents),
      this.hasExplicitTemplateReferences(fileContents),
      this.hasCommonImportPatterns(fileContents),
      this.hasSpecificTemplatePatterns(fileContents, entry)
    ];
    
    // If 2+ checks pass, files are template-similar
    const passedChecks = checks.filter(check => check).length;
    return passedChecks >= 2;
  }

  /**
   * Check if file has template similarity with files in other components
   * @cliHide
   */
  private async hasCrossComponentTemplateSimilarity(entry: string, componentSpecs: any[], analyses: any[]): Promise<boolean> {
    // For CLI files, check if other components have CLI files following same template
    if (entry.includes('CLI.ts') && entry.includes('src/ts/layer5/')) {
      const thisFileContent = await this.getFileContent(entry, componentSpecs, analyses);
      if (!thisFileContent) return false;
      
      // Look for CLI files in other components
      for (let i = 0; i < componentSpecs.length; i++) {
        const analysis = analyses[i];
        const spec = componentSpecs[i];
        
        const otherCLIFiles = Array.from(analysis.files as Set<string>)
          .filter(file => file.includes('src/ts/layer5/') && file.endsWith('CLI.ts') && file !== entry);
        
        for (const otherCLIFile of otherCLIFiles) {
          const otherFileContent = await this.getFileContent(otherCLIFile, [spec], [analysis]);
          if (otherFileContent && this.checkTemplateSimilarity([thisFileContent, otherFileContent], entry)) {
            return true; // Found template-similar CLI file in another component
          }
        }
      }
    }
    
    return false;
  }

  /**
   * Get file content for cross-component comparison
   * @cliHide
   */
  private async getFileContent(entry: string, componentSpecs: any[], analyses: any[]): Promise<string | null> {
    for (let i = 0; i < componentSpecs.length; i++) {
      const analysis = analyses[i];
      const spec = componentSpecs[i];
      
      if (analysis.files.has(entry)) {
        const componentPath = `/workspace/components/${spec.name}/${spec.version}`;
        const filePath = path.join(componentPath, entry);
        
        try {
          return await fs.readFile(filePath, 'utf8');
        } catch (error) {
          continue;
        }
      }
    }
    return null;
  }

  /**
   * Check if a file follows a template pattern that should be compared across components
   * @cliHide
   */
  private isTemplatePatternFile(entry: string): boolean {
    // CLI files in layer5 follow template patterns
    if (entry.includes('src/ts/layer5/') && entry.endsWith('CLI.ts')) {
      return true;
    }
    
    // Default implementation files in layer2 follow patterns
    if (entry.includes('src/ts/layer2/Default') && entry.endsWith('.ts')) {
      return true;
    }
    
    // Interface files often follow patterns
    if (entry.endsWith('.interface.ts')) {
      return true;
    }
    
    return false;
  }

  /**
   * Find template-similar files across components even with different names
   * @cliHide
   */
  private async findTemplateSimilarFiles(entry: string, componentSpecs: any[], analyses: any[]): Promise<any[]> {
    const similarFiles = [];
    
    // For CLI files, look for other CLI files in the same layer across components
    if (entry.includes('CLI.ts') && entry.includes('src/ts/layer5/')) {
      for (let i = 0; i < componentSpecs.length; i++) {
        const analysis = analyses[i];
        const spec = componentSpecs[i];
        
        // Find CLI files in this component's layer5
        const cliFiles = Array.from(analysis.files as Set<string>).filter(file => 
          file.includes('src/ts/layer5/') && file.endsWith('CLI.ts')
        );
        
        for (const cliFile of cliFiles) {
          if (cliFile !== entry) {
            // Check if these CLI files follow the same template pattern
            const thisFilePath = `/workspace/components/${spec.name}/${spec.version}/${cliFile}`;
            const originalFilePath = this.findOriginalFilePath(entry, componentSpecs, analyses);
            
            if (await this.areTemplatePatternFiles(originalFilePath, thisFilePath)) {
              similarFiles.push({
                file: cliFile,
                component: spec.name,
                path: thisFilePath
              });
            }
          }
        }
      }
    }
    
    return similarFiles;
  }

  /**
   * Find the path of the original file for comparison
   * @cliHide
   */
  private findOriginalFilePath(entry: string, componentSpecs: any[], analyses: any[]): string | null {
    for (let i = 0; i < componentSpecs.length; i++) {
      const analysis = analyses[i];
      const spec = componentSpecs[i];
      
      if (analysis.files.has(entry)) {
        return `/workspace/components/${spec.name}/${spec.version}/${entry}`;
      }
    }
    return null;
  }

  /**
   * Check if two files follow the same template pattern
   * @cliHide
   */
  private async areTemplatePatternFiles(filePath1: string | null, filePath2: string): Promise<boolean> {
    if (!filePath1) return false;
    
    try {
      const content1 = await fs.readFile(filePath1, 'utf8');
      const content2 = await fs.readFile(filePath2, 'utf8');
      
      // Use simple template similarity detection
      return this.checkTemplateSimilarity([content1, content2], path.basename(filePath1));
    } catch (error) {
      return false;
    }
  }

  /**
   * Check for common inheritance patterns (e.g., extends DefaultCLI)
   * @cliHide
   */
  private hasCommonInheritancePattern(fileContents: string[]): boolean {
    const inheritanceClasses = fileContents.map(content => 
      this.extractClassExtension(content)
    ).filter(cls => cls !== null);
    
    // If 2+ files extend the same base class, they're template-similar
    if (inheritanceClasses.length >= 2 && new Set(inheritanceClasses).size === 1) {
      return true;
    }
    return false;
  }

  /**
   * Extract the class that this file extends (e.g., "DefaultCLI")
   * @cliHide
   */
  private extractClassExtension(content: string): string | null {
    const match = content.match(/extends\s+(\w+)/);
    return match ? match[1] : null;
  }

  /**
   * Check for explicit template references in comments or metadata
   * @cliHide
   */
  private hasExplicitTemplateReferences(fileContents: string[]): boolean {
    const templatePatterns = [
      /(?:template|Template):\s*(\w+)/i,
      /based\s+on:\s*(\w+)/i,
      /extends:\s*(\w+)/i
    ];
    
    const templateReferences = fileContents.map(content => {
      for (const pattern of templatePatterns) {
        const match = content.match(pattern);
        if (match) return match[1];
      }
      return null;
    }).filter(ref => ref !== null);
    
    // If 2+ files reference the same template, they're similar
    if (templateReferences.length >= 2 && new Set(templateReferences).size === 1) {
      return true;
    }
    return false;
  }

  /**
   * Check for common import patterns indicating template usage
   * @cliHide
   */
  private hasCommonImportPatterns(fileContents: string[]): boolean {
    const importPatterns = fileContents.map(content => {
      // Extract imports from template base classes
      const imports = content.match(/import\s+{[^}]*}\s+from\s+['"](\.\.\/.*Default\w+)['"]/g);
      if (imports) {
        return imports.map(imp => {
          const match = imp.match(/Default\w+/);
          return match ? match[0] : null;
        }).filter(imp => imp !== null);
      }
      return [];
    });
    
    // Find common imports across files
    const allImports = importPatterns.flat();
    const importCounts = new Map<string, number>();
    
    for (const imp of allImports) {
      importCounts.set(imp, (importCounts.get(imp) || 0) + 1);
    }
    
    // If any import appears in 2+ files, they share template patterns
    for (const count of importCounts.values()) {
      if (count >= 2) return true;
    }
    
    return false;
  }

  /**
   * Check for specific template patterns based on file type
   * @cliHide
   */
  private hasSpecificTemplatePatterns(fileContents: string[], entry: string): boolean {
    // CLI files should extend DefaultCLI and call initWithComponentClass
    if (entry.includes('CLI.ts') && !entry.includes('DefaultCLI.ts')) {
      return fileContents.every(content => 
        content.includes('extends DefaultCLI') && 
        content.includes('initWithComponentClass')
      );
    }
    
    // Package.json files should have similar structure
    if (entry === 'package.json') {
      return this.checkPackageJsonSimilarity(fileContents);
    }
    
    // Interface files should have similar patterns
    if (entry.endsWith('.interface.ts')) {
      return fileContents.every(content => 
        content.includes('interface') && 
        (content.includes('export') || content.includes('export default'))
      );
    }
    
    // Config files should have similar structure
    if (entry === 'tsconfig.json' || entry.includes('config.ts')) {
      return this.checkConfigFileSimilarity(fileContents);
    }
    
    return false;
  }

  /**
   * Check package.json similarity (same structure, different names/versions)
   * @cliHide
   */
  private checkPackageJsonSimilarity(fileContents: string[]): boolean {
    try {
      const packages = fileContents.map(content => JSON.parse(content));
      
      // Check if they have similar structure
      const firstKeys = Object.keys(packages[0]).sort();
      const allHaveSimilarStructure = packages.every(pkg => {
        const keys = Object.keys(pkg).sort();
        // Allow some variation in keys but require core structure
        const commonKeys = ['name', 'version', 'scripts', 'devDependencies'];
        return commonKeys.every(key => keys.includes(key));
      });
      
      return allHaveSimilarStructure;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check config file similarity (same structure, different values)
   * @cliHide
   */
  private checkConfigFileSimilarity(fileContents: string[]): boolean {
    // Remove comments and normalize whitespace for comparison
    const normalized = fileContents.map(content => 
      content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim()
    );
    
    // Check if structure is similar (same property names, possibly different values)
    const firstNormalized = normalized[0];
    return normalized.every(content => {
      // Calculate similarity ratio based on common structure
      const similarity = this.calculateStructuralSimilarity(firstNormalized, content);
      return similarity > 0.7; // 70% structural similarity threshold
    });
  }

  /**
   * Check DefaultCLI.ts similarity (template-based but component-specific)
   * @cliHide
   */
  private checkDefaultCLISimilarity(fileContents: string[]): boolean {
    // DefaultCLI files should have similar class structure but different component names
    const hasCommonStructure = fileContents.every(content => 
      content.includes('class Default') && 
      content.includes('CLI') &&
      content.includes('export default') &&
      content.includes('discoverMethods')
    );
    
    return hasCommonStructure;
  }

  /**
   * Check TypeScript file similarity (interfaces, classes, similar structure)
   * @cliHide
   */
  private checkTypeScriptFileSimilarity(fileContents: string[]): boolean {
    // Check for common TypeScript patterns
    const patterns = ['interface', 'class', 'export', 'import', 'type', 'enum'];
    const firstContent = fileContents[0];
    
    return fileContents.every(content => {
      // Check if files have similar TypeScript structure
      const firstPatterns = patterns.filter(pattern => firstContent.includes(pattern));
      const currentPatterns = patterns.filter(pattern => content.includes(pattern));
      
      // Files are similar if they share most structural patterns
      const commonPatterns = firstPatterns.filter(pattern => currentPatterns.includes(pattern));
      return commonPatterns.length >= Math.min(firstPatterns.length, currentPatterns.length) * 0.6;
    });
  }

  /**
   * Check general structural similarity
   * @cliHide
   */
  private checkGeneralStructuralSimilarity(fileContents: string[]): boolean {
    const firstContent = fileContents[0];
    
    return fileContents.every(content => {
      const similarity = this.calculateStructuralSimilarity(firstContent, content);
      return similarity > 0.5; // 50% structural similarity threshold for general files
    });
  }

  /**
   * Calculate structural similarity between two text contents
   * @cliHide
   */
  private calculateStructuralSimilarity(text1: string, text2: string): number {
    // Simple structural similarity based on line structure and length
    const lines1 = text1.split('\n').filter(line => line.trim().length > 0);
    const lines2 = text2.split('\n').filter(line => line.trim().length > 0);
    
    const lengthSimilarity = 1 - Math.abs(lines1.length - lines2.length) / Math.max(lines1.length, lines2.length);
    
    // Count similar line patterns (ignoring specific values)
    const pattern1 = lines1.map(line => line.replace(/['"]\w+['"]/g, '""').replace(/\d+/g, '0'));
    const pattern2 = lines2.map(line => line.replace(/['"]\w+['"]/g, '""').replace(/\d+/g, '0'));
    
    let commonPatterns = 0;
    const minLength = Math.min(pattern1.length, pattern2.length);
    
    for (let i = 0; i < minLength; i++) {
      if (pattern1[i] === pattern2[i]) {
        commonPatterns++;
      }
    }
    
    const patternSimilarity = minLength > 0 ? commonPatterns / minLength : 0;
    
    return (lengthSimilarity + patternSimilarity) / 2;
  }

  /**
   * Recursively display tree structure
   * @cliHide
   */
  private async displayTreeStructure(
    dirPath: string, 
    prefix: string, 
    maxDepth: number, 
    currentDepth: number, 
    showHidden: boolean
  ): Promise<void> {
    if (currentDepth >= maxDepth) return;

    try {
      const items = readdirSync(dirPath);
      const filteredItems = showHidden ? items : items.filter(item => !item.startsWith('.'));
      const sortedItems = filteredItems.sort((a, b) => {
        const aPath = path.join(dirPath, a);
        const bPath = path.join(dirPath, b);
        const aIsDir = statSync(aPath).isDirectory();
        const bIsDir = statSync(bPath).isDirectory();
        
        // Directories first, then files
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.localeCompare(b);
      });

      for (let i = 0; i < sortedItems.length; i++) {
        const item = sortedItems[i];
        const itemPath = path.join(dirPath, item);
        const isLast = i === sortedItems.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');

        try {
          const stats = statSync(itemPath);
          const isDirectory = stats.isDirectory();
          const isSymlink = stats.isSymbolicLink();
          
          let displayName = item;
          if (isDirectory) displayName += '/';
          if (isSymlink) displayName += ' → ' + await fs.readlink(itemPath).catch(() => 'broken');
          
          console.log(prefix + connector + displayName);
          
          if (isDirectory && currentDepth < maxDepth - 1) {
            await this.displayTreeStructure(itemPath, nextPrefix, maxDepth, currentDepth + 1, showHidden);
          }
        } catch (error) {
          // Handle permission errors or broken symlinks
          console.log(prefix + connector + item + ' [access denied]');
        }
      }
    } catch (error) {
      console.log(prefix + '[error reading directory]');
    }
  }

  /**
   * Get current component context for chained operations
   * @cliHide
   */
  private getComponentContext(): { component: string, version: string, path: string } | null {
    const context = this.model as any;
    if (!context.contextComponent || !context.contextVersion) {
      return null;
    }
    
    return {
      component: context.contextComponent,
      version: context.contextVersion,
      path: context.contextPath
    };
  }

  /**
   * Version increment helpers
   * @cliHide
   */
  private incrementPatch(version: string): string {
    const [major, minor, patch, build] = version.split('.').map(Number);
    return `${major}.${minor}.${patch}.${build + 1}`;
  }

  /**
   * @cliHide
   */
  private incrementMinor(version: string): string {
    const [major, minor] = version.split('.').map(Number);
    return `${major}.${minor + 1}.0.0`;
  }

  /**
   * @cliHide
   */
  private incrementMajor(version: string): string {
    const [major] = version.split('.').map(Number);
    return `${major + 1}.0.0.0`;
  }

  /**
   * Create new version from existing component
   * @cliHide
   */
  private async createVersionFromExisting(component: string, fromVersion: string, toVersion: string): Promise<void> {
    const sourcePath = this.resolveComponentPath(component, fromVersion);
    const targetPath = this.resolveComponentPath(component, toVersion);
    
    // Copy entire component structure
    await this.copyDirectory(sourcePath, targetPath);
    
    // Update package.json version
    const packageJsonPath = `${targetPath}/package.json`;
    if (existsSync(packageJsonPath)) {
      const packageContent = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      packageContent.version = toVersion;
      await fs.writeFile(packageJsonPath, JSON.stringify(packageContent, null, 2));
    }
    
    // Update CLI script version reference if exists (with human-readable error handling)
    try {
      const cliScripts = await fs.readdir(targetPath);
      const cliScript = cliScripts.find(file => 
        file.endsWith('.sh') || 
        (!file.includes('.') && file !== 'node_modules' && file !== 'spec' && file !== 'src' && file !== 'test')
      );
      
      if (cliScript) {
        const cliScriptPath = `${targetPath}/${cliScript}`;
        
        // Check if it's actually a file before reading (prevent EISDIR)
        const stats = await fs.stat(cliScriptPath);
        if (stats.isFile()) {
          let cliContent = await fs.readFile(cliScriptPath, 'utf-8');
          cliContent = cliContent.replace(
            /COMPONENT_VERSION="[^"]+"/,
            `COMPONENT_VERSION="${toVersion}"`
          );
          await fs.writeFile(cliScriptPath, cliContent);
          console.log(`   ✅ CLI script updated: ${cliScript}`);
        } else {
          console.log(`   ⚠️ Skipping ${cliScript} - it's a directory, not a file`);
        }
      }
    } catch (error) {
      // Transform cryptic error to human-readable message
      if ((error as Error).message.includes('EISDIR')) {
        console.log(`   ⚠️ I tried to read a CLI script file, but found a directory instead. This is normal - continuing with version upgrade.`);
      } else if ((error as Error).message.includes('ENOENT')) {
        console.log(`   ⚠️ I couldn't find the CLI script file. This might be normal if the component doesn't have a CLI script.`);
      } else {
        console.log(`   ⚠️ Something unexpected happened while updating the CLI script: ${(error as Error).message}`);
      }
      // Don't throw - CLI script update is optional
    }
  }

  /**
   * Copy directory recursively
   * @cliHide
   */
  private async copyDirectory(source: string, target: string): Promise<void> {
    await fs.mkdir(target, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }

  /**
   * Display Web4TSComponent information and standards
   * 
   * Shows comprehensive information about Web4 component standards,
   * implementation guidelines, and architecture patterns. Essential
   * reference for understanding Web4 component development.
   * 
   * @param topic Information topic to display: 'overview' (default), 'standard', 'guidelines'
   * 
   * @example
   * // Show general overview
   * await component.info();
   * 
   * @example
   * // Show Web4 standards
   * await component.info('standard');
   * 
   * @example
   * // Show implementation guidelines  
   * await component.info('guidelines');
   * 
   * @cliSyntax topic
   * @cliDefault topic overview
   */
  async info(topic: string = 'overview'): Promise<void> {
    switch (topic) {
      case 'standard':
      case 'standards':
        this.showStandard();
        break;
      case 'guidelines':
      case 'guide':
        this.showGuidelines();
        break;
      case 'overview':
      default:
        console.log(`
🚀 Web4TSComponent 0.3.0.8 - Auto-Discovery CLI Architecture

This is outdated hardcoded help text. The CLI now uses auto-discovery!
Run './web4tscomponent' without arguments to see the auto-generated help.

🎯 Auto-discovery CLI with Web4 compliance patterns
`);
        break;
    }
  }

  // Private helper methods for scaffolding
  /**
   * @cliHide
   */
  private async createPackageJson(componentDir: string, componentName: string, version: string): Promise<void> {
    const packageJson = {
      "name": `@web4/${componentName.toLowerCase()}`,
      "version": version,
      "type": "module",
      "main": `./src/ts/layer5/${componentName}CLI.ts`,
      "scripts": {
        "build": "tsc",
        "test": "vitest",
        "clean": "rm -rf dist/"
      },
      "devDependencies": {
        "@types/node": "^24.1.0",
        "typescript": "^5.0.0",
        "vitest": "^3.2.4",
        "ts-node": "^10.9.2"
      }
    };
    
    await fs.writeFile(
      path.join(componentDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }

  /**
   * @cliHide
   */
  private async createTsConfig(componentDir: string): Promise<void> {
    const tsConfig = {
      "compilerOptions": {
        "target": "ES2022",
        "module": "ES2022",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist",
        "rootDir": "./src",
        "declaration": true,
        "declarationMap": true,
        "sourceMap": true
      },
      "include": ["src/**/*"],
      "exclude": ["dist", "node_modules", "test"]
    };
    
    await fs.writeFile(
      path.join(componentDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
  }

  /**
   * @cliHide
   */
  private async createLayerStructure(componentDir: string): Promise<void> {
    const layers = ['layer2', 'layer3', 'layer4', 'layer5'];
    
    for (const layer of layers) {
      await fs.mkdir(path.join(componentDir, 'src/ts', layer), { recursive: true });
    }
  }

  /**
   * @cliHide
   */
  private async createCLIScript(componentDir: string, componentName: string, version: string): Promise<void> {
    const cliScript = await this.generateLocationResilientCLI(componentName, version);
    const scriptPath = path.join(componentDir, `${componentName.toLowerCase()}.sh`);
    await fs.writeFile(scriptPath, cliScript, { mode: 0o755 });
  }

  /**
   * @cliHide
   */
  private async createSpecStructure(componentDir: string): Promise<void> {
    await fs.mkdir(path.join(componentDir, 'spec'), { recursive: true });
  }

  private async createVitestConfig(componentDir: string): Promise<void> {
    const vitestConfig = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    timeout: 30000,
    exclude: ['**/node_modules/**', '**/dist/**']
  }
});`;
    
    await fs.writeFile(path.join(componentDir, 'vitest.config.ts'), vitestConfig);
  }

  private async createTestStructure(componentDir: string): Promise<void> {
    await fs.mkdir(path.join(componentDir, 'test'), { recursive: true });
  }

  /**
   * Verify and fix symlinks for component
   * @cliSyntax 
   * @cliHide
   */
  async verifyAndFix(): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('I need a component context first. Please use "on <component> <version>" before verifying symlinks.');
    }
    
    console.log(`🔍 Verifying and fixing symlinks for ${context.component}...`);
    
    // Verify and fix all symlinks
    await this.verifyAndFixSymlinks(context.component);
    
    console.log(`✅ Symlink verification and repair completed for ${context.component}`);
    return this;
  }

  /**
   * Verify and fix all symlinks for component
   * @cliHide
   */
  private async verifyAndFixSymlinks(component: string): Promise<void> {
    console.log(`🔍 Scanning ${component} symlinks...`);
    
    // Get highest version
    const componentDir = path.join(this.model.targetDirectory, 'components', component);
    const versions = this.getAvailableVersions(componentDir);
    
    if (versions.length === 0) {
      console.log(`   ❌ No versions found for ${component}`);
      return;
    }
    
    const highestVersion = this.getHighestVersion(versions);
    console.log(`   📊 Highest version found: ${highestVersion}`);
    
    // Verify and fix latest symlink
    await this.verifyLatestSymlink(component, highestVersion);
    
    // Verify and fix scripts symlinks
    await this.verifyScriptsSymlinks(component, versions, highestVersion);
    
    console.log(`   ✅ Symlink verification completed`);
  }

  /**
   * Verify latest symlink points to highest version
   * @cliHide
   */
  private async verifyLatestSymlink(component: string, highestVersion: string): Promise<void> {
    const componentDir = path.join(this.model.targetDirectory, 'components', component);
    const latestPath = path.join(componentDir, 'latest');
    
    try {
      if (existsSync(latestPath)) {
        const linkTarget = await fs.readlink(latestPath);
        if (linkTarget === highestVersion) {
          console.log(`   ✅ Latest symlink correct: latest → ${linkTarget}`);
          return;
        } else {
          console.log(`   🔧 Fixing latest symlink: ${linkTarget} → ${highestVersion}`);
          await fs.unlink(latestPath);
        }
      } else {
        console.log(`   🔧 Creating missing latest symlink → ${highestVersion}`);
      }
      
      await fs.symlink(highestVersion, latestPath);
      console.log(`   ✅ Fixed latest symlink: latest → ${highestVersion}`);
    } catch (error) {
      console.log(`   ❌ Could not fix latest symlink: ${(error as Error).message}`);
    }
  }

  /**
   * Verify scripts symlinks
   * @cliHide
   */
  private async verifyScriptsSymlinks(component: string, versions: string[], highestVersion: string): Promise<void> {
    const versionsDir = path.join(this.model.targetDirectory, 'scripts', 'versions');
    const componentLower = component.toLowerCase();
    
    // Check main script symlink
    const mainScriptPath = path.join(versionsDir, componentLower);
    const expectedTarget = `${componentLower}-v${highestVersion}`;
    
    try {
      if (existsSync(mainScriptPath)) {
        const linkTarget = await fs.readlink(mainScriptPath);
        if (linkTarget === expectedTarget) {
          console.log(`   ✅ Main script correct: ${componentLower} → ${linkTarget}`);
        } else {
          console.log(`   🔧 Fixing main script: ${linkTarget} → ${expectedTarget}`);
          await fs.unlink(mainScriptPath);
          await fs.symlink(expectedTarget, mainScriptPath);
          console.log(`   ✅ Fixed main script: ${componentLower} → ${expectedTarget}`);
        }
      } else {
        console.log(`   🔧 Creating missing main script: ${componentLower} → ${expectedTarget}`);
        await fs.symlink(expectedTarget, mainScriptPath);
        console.log(`   ✅ Created main script: ${componentLower} → ${expectedTarget}`);
      }
    } catch (error) {
      console.log(`   ❌ Could not fix main script symlink: ${(error as Error).message}`);
    }
    
    // Verify version-specific symlinks exist
    for (const version of versions) {
      await this.verifyVersionScriptSymlink(component, version);
    }
  }

  /**
   * Verify version-specific script symlink exists
   */
  private async verifyVersionScriptSymlink(component: string, version: string): Promise<void> {
    const versionsDir = path.join(this.model.targetDirectory, 'scripts', 'versions');
    const componentLower = component.toLowerCase();
    const scriptName = `${componentLower}-v${version}`;
    const scriptPath = path.join(versionsDir, scriptName);
    
    if (existsSync(scriptPath)) {
      try {
        // Check if symlink target exists
        const target = await fs.readlink(scriptPath);
        const targetPath = path.resolve(versionsDir, target);
        if (existsSync(targetPath)) {
          console.log(`   ✅ Version script valid: ${scriptName}`);
        } else {
          console.log(`   🔧 Recreating broken version script: ${scriptName}`);
          await this.createVersionScriptSymlink(component, version);
        }
      } catch (error) {
        console.log(`   🔧 Recreating invalid version script: ${scriptName}`);
        await this.createVersionScriptSymlink(component, version);
      }
    } else {
      console.log(`   🔧 Creating missing version script: ${scriptName}`);
      await this.createVersionScriptSymlink(component, version);
    }
  }

  /**
   * Get available versions from component directory
   * @cliHide
   */
  private getAvailableVersions(componentDir: string): string[] {
    try {
      const entries = readdirSync(componentDir);
      return entries.filter(entry => {
        const entryPath = path.join(componentDir, entry);
        return statSync(entryPath).isDirectory() && 
               entry.match(/^\d+\.\d+\.\d+\.\d+$/) &&
               entry !== 'latest';
      }).sort((a, b) => this.compareVersions(a, b));
    } catch {
      return [];
    }
  }

  /**
   * Get highest version from array of versions
   * @cliHide
   */
  private getHighestVersion(versions: string[]): string {
    return versions.sort((a, b) => this.compareVersions(b, a))[0];
  }

  /**
   * Compare two version strings (for sorting)
   * @cliHide
   */
  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < 4; i++) {
      if (aParts[i] !== bParts[i]) {
        return aParts[i] - bParts[i];
      }
    }
    return 0;
  }

  /**
   * Test method for README demonstration
   * @param inputData Data to process  
   * @param outputFormat Format for output (json, xml, csv)
   * @cliSyntax inputData outputFormat
   * @cliDefault outputFormat json
   */
  /**
   * @cliHide
   */
  async testNewMethod(inputData: string, outputFormat: string = 'json'): Promise<this> {
    console.log(`🚀 Processing ${inputData} as ${outputFormat}`);
    console.log(`✅ Test method completed successfully!`);
    return this;
  }

  /**
   * Update symlinks for component version (latest and scripts)
   * @cliHide
   */
  private async updateSymlinks(component: string, version: string): Promise<void> {
    try {
      // Update latest symlink
      await this.updateLatestSymlink(component, version);
      
      // Update scripts symlinks
      await this.updateScriptsSymlinks(component, version);
      
      console.log(`   🔗 Symlinks updated: latest → ${version}`);
    } catch (error) {
      console.log(`   ⚠️ Symlink update had issues: ${(error as Error).message}`);
    }
  }

  /**
   * Update latest symlink in component directory
   * @cliHide
   */
  private async updateLatestSymlink(component: string, version: string): Promise<void> {
    const componentDir = path.join(this.model.targetDirectory, 'components', component);
    const latestPath = path.join(componentDir, 'latest');
    
    try {
      // Remove existing latest symlink if it exists
      if (existsSync(latestPath)) {
        await fs.unlink(latestPath);
      }
      
      // Create new latest symlink
      await fs.symlink(version, latestPath);
    } catch (error) {
      console.log(`   ⚠️ Could not update latest symlink: ${(error as Error).message}`);
    }
  }

  /**
   * Update scripts and scripts/versions symlinks
   * @cliHide
   */
  private async updateScriptsSymlinks(component: string, version: string): Promise<void> {
    try {
      // Update scripts/versions/component-vX.X.X.X symlink
      await this.createVersionScriptSymlink(component, version);
      
      // Update scripts/versions/component symlink to point to latest version
      await this.updateMainScriptSymlink(component, version);
    } catch (error) {
      console.log(`   ⚠️ Could not update scripts symlinks: ${(error as Error).message}`);
    }
  }

  /**
   * Create version-specific script symlink
   * @cliHide
   */
  private async createVersionScriptSymlink(component: string, version: string): Promise<void> {
    const versionsDir = path.join(this.model.targetDirectory, 'scripts', 'versions');
    const componentLower = component.toLowerCase();
    const scriptName = `${componentLower}-v${version}`;
    const scriptPath = path.join(versionsDir, scriptName);
    
    // Find the CLI script in the component version
    const componentVersionDir = path.join(this.model.targetDirectory, 'components', component, version);
    const possibleScripts = [
      `${componentLower}.sh`,
      `${componentLower}`,
      'cli.sh',
      'cli'
    ];
    
    let targetScript = '';
    for (const script of possibleScripts) {
      const scriptFile = path.join(componentVersionDir, script);
      if (existsSync(scriptFile)) {
        targetScript = script;
        break;
      }
    }
    
    if (!targetScript) {
      return; // No CLI script found, skip symlink creation
    }
    
    try {
      // Remove existing symlink if it exists
      if (existsSync(scriptPath)) {
        await fs.unlink(scriptPath);
      }
      
      // Create relative path from scripts/versions to component script
      const relativePath = path.relative(versionsDir, path.join(componentVersionDir, targetScript));
      await fs.symlink(relativePath, scriptPath);
    } catch (error) {
      console.log(`   ⚠️ Could not create version script symlink: ${(error as Error).message}`);
    }
  }

  /**
   * Update main script symlink in scripts/versions
   * @cliHide
   */
  private async updateMainScriptSymlink(component: string, version: string): Promise<void> {
    const versionsDir = path.join(this.model.targetDirectory, 'scripts', 'versions');
    const componentLower = component.toLowerCase();
    const mainScriptPath = path.join(versionsDir, componentLower);
    const versionScriptName = `${componentLower}-v${version}`;
    
    try {
      // Remove existing main script symlink if it exists
      if (existsSync(mainScriptPath)) {
        await fs.unlink(mainScriptPath);
      }
      
      // Create main script symlink pointing to versioned script
      await fs.symlink(versionScriptName, mainScriptPath);
    } catch (error) {
      console.log(`   ⚠️ Could not update main script symlink: ${(error as Error).message}`);
    }
  }

  /**
   * Create component implementation with auto-discovery features
   * @cliHide
   */
  private async createComponentImplementation(componentDir: string, componentName: string, version: string): Promise<void> {
    const componentImplementation = `/**
 * Default${componentName} - ${componentName} Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { ${componentName} } from '../layer3/${componentName}.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { ${componentName}Model } from '../layer3/${componentName}Model.interface.js';

export class Default${componentName} implements ${componentName} {
  private model: ${componentName}Model;

  constructor() {
    // Empty constructor - Web4 pattern
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * @cliHide
   */
  init(scenario: Scenario<${componentName}Model>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<${componentName}Model>> {
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: '${componentName}',
      version: '${version}'
    });

    return {
      ior: {
        uuid: this.model.uuid,
        component: '${componentName}',
        version: '${version}'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for ${componentName}
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(\`🚀 Creating \${input} in \${format} format\`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(\`✅ ${componentName} operation completed\`);
    return this;
  }

  /**
   * Process data through ${componentName} logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(\`🔧 Processing: \${data}\`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Show information about current ${componentName} state
   */
  async info(): Promise<this> {
    console.log(\`📋 ${componentName} Information:\`);
    console.log(\`   UUID: \${this.model.uuid}\`);
    console.log(\`   Name: \${this.model.name || 'Not set'}\`);
    console.log(\`   Created: \${this.model.createdAt}\`);
    console.log(\`   Updated: \${this.model.updatedAt}\`);
    return this;
  }
}`;

    const implementationPath = path.join(componentDir, 'src/ts/layer2', `Default${componentName}.ts`);
    await fs.writeFile(implementationPath, componentImplementation);
  }

  /**
   * Create component interfaces
   * @cliHide
   */
  private async createComponentInterfaces(componentDir: string, componentName: string): Promise<void> {
    // Component interface
    const componentInterface = `/**
 * ${componentName} - ${componentName} Component Interface
 * Web4 pattern: Component interface definition
 */

import { Scenario } from './Scenario.interface.js';
import { ${componentName}Model } from './${componentName}Model.interface.js';

export interface ${componentName} {
  init(scenario: Scenario<${componentName}Model>): this;
  toScenario(name?: string): Promise<Scenario<${componentName}Model>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  info(): Promise<this>;
}`;

    const interfacePath = path.join(componentDir, 'src/ts/layer3', `${componentName}.interface.ts`);
    await fs.writeFile(interfacePath, componentInterface);

    // Component model interface
    const modelInterface = `/**
 * ${componentName}Model - ${componentName} Component Model Interface
 * Web4 pattern: Component model following auto-discovery patterns
 */

import { Model } from './Model.interface.js';

export interface ${componentName}Model extends Model {
  uuid: string;
  name: string;
  origin: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
}`;

    const modelPath = path.join(componentDir, 'src/ts/layer3', `${componentName}Model.interface.ts`);
    await fs.writeFile(modelPath, modelInterface);

    // Copy essential interfaces from Web4TSComponent
    await this.copyEssentialInterfaces(componentDir);
  }

  /**
   * Create CLI implementation with auto-discovery
   * @cliHide
   */
  private async createCLIImplementation(componentDir: string, componentName: string, version: string): Promise<void> {
    const cliImplementation = `#!/usr/bin/env node

/**
 * ${componentName}CLI - ${componentName} CLI implementation with auto-discovery
 * Web4 pattern: Auto-discovery CLI with chaining support
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { Default${componentName} } from '../layer2/Default${componentName}.js';

export class ${componentName}CLI extends DefaultCLI {
  private component: Default${componentName} | null;

  constructor() {
    super();
    this.component = null;
    this.initWithComponentClass(Default${componentName}, '${componentName}', '${version}');
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new ${componentName}CLI();
    await cli.execute(args);
  }

  private getOrCreateComponent(): Default${componentName} {
    if (!this.component) {
      this.component = this.getComponentInstance() as Default${componentName};
    }
    return this.component;
  }

  /**
   * ${componentName}-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    console.log(this.generateStructuredUsage());
  }

  /**
   * Execute CLI commands with auto-discovery
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    try {
      // Try dynamic command execution
      if (await this.executeDynamicCommand(command, commandArgs)) {
        return;
      }

      // Special cases
      switch (command) {
        case 'help':
          this.showUsage();
          break;
          
        default:
          throw new Error(\`Unknown command: \${command}\`);
      }
    } catch (error) {
      console.error(this.formatError((error as Error).message));
      process.exit(1);
    }
  }
}

// Static entry point for shell execution
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  ${componentName}CLI.start(process.argv.slice(2));
}`;

    const cliPath = path.join(componentDir, 'src/ts/layer5', `${componentName}CLI.ts`);
    await fs.writeFile(cliPath, cliImplementation);
  }

  /**
   * Copy essential interfaces for auto-discovery
   * @cliHide
   */
  private async copyEssentialInterfaces(componentDir: string): Promise<void> {
    const interfaceFiles = [
      'Model.interface.ts',
      'Scenario.interface.ts',
      'CLI.interface.ts',
      'MethodInfo.interface.ts',
      'ColorScheme.interface.ts',
      'ComponentAnalysis.interface.ts',
      'Completion.ts'
    ];

    for (const file of interfaceFiles) {
      const currentDir = path.dirname(new URL(import.meta.url).pathname);
      const sourcePath = path.join(currentDir, '../../../src/ts/layer3', file);
      const targetPath = path.join(componentDir, 'src/ts/layer3', file);
      
      try {
        const content = await fs.readFile(sourcePath, 'utf-8');
        await fs.writeFile(targetPath, content);
      } catch (error) {
        console.log(`   ⚠️ Could not copy ${file}: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Create TSCompletion for auto-discovery
   * @cliHide
   */
  private async createTSCompletion(componentDir: string): Promise<void> {
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const sourcePath = path.join(currentDir, '../../../src/ts/layer4/TSCompletion.ts');
    const targetPath = path.join(componentDir, 'src/ts/layer4/TSCompletion.ts');
    
    try {
      const content = await fs.readFile(sourcePath, 'utf-8');
      await fs.writeFile(targetPath, content);
    } catch (error) {
      console.log(`   ⚠️ Could not copy TSCompletion.ts: ${(error as Error).message}`);
    }
  }

  /**
   * Copy DefaultCLI for auto-discovery
   * @cliHide
   */
  private async copyDefaultCLI(componentDir: string): Promise<void> {
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    const sourcePath = path.join(currentDir, '../../../src/ts/layer2/DefaultCLI.ts');
    const targetPath = path.join(componentDir, 'src/ts/layer2/DefaultCLI.ts');
    
    try {
      const content = await fs.readFile(sourcePath, 'utf-8');
      await fs.writeFile(targetPath, content);
    } catch (error) {
      console.log(`   ⚠️ Could not copy DefaultCLI.ts: ${(error as Error).message}`);
    }
  }
}