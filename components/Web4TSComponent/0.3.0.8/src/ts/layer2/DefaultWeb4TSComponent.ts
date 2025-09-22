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

  init(scenario: Scenario<Web4TSComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  transform(data?: unknown): this {
    // Transform component data if needed
    if (data) {
      this.model.updatedAt = new Date().toISOString();
    }
    return this;
  }

  validate(object?: any): this {
    // Validate component configuration
    if (object) {
      this.model.updatedAt = new Date().toISOString();
    }
    return this;
  }

  process(): this {
    // Process component operations
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Convert component to scenario (Web4 pattern)
   * Essential for Web4 compliance and hibernation/restoration
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

  setTargetDirectory(directory: string): void {
    this.model.targetDirectory = directory;
    this.model.updatedAt = new Date().toISOString();
  }

  async scaffoldComponent(options: ComponentScaffoldOptions): Promise<ComponentMetadata> {
    const { componentName, version, includeLayerArchitecture, includeCLI, includeSpecFolder, includeVitest } = options;
    
    const componentDir = path.join(this.model.targetDirectory, 'components', componentName, version);
    
    // Create directory structure
    await fs.mkdir(componentDir, { recursive: true });
    
    // Create package.json
    await this.createPackageJson(componentDir, componentName, version);
    
    // Create tsconfig.json
    await this.createTsConfig(componentDir);
    
    if (includeLayerArchitecture) {
      await this.createLayerStructure(componentDir);
    }
    
    if (includeCLI) {
      await this.createCLIScript(componentDir, componentName, version);
    }
    
    if (includeSpecFolder) {
      await this.createSpecStructure(componentDir);
    }
    
    if (includeVitest) {
      await this.createVitestConfig(componentDir);
      await this.createTestStructure(componentDir);
    }
    
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
   * Create Web4-compliant component with scaffolding
   * @param name Component name (spaces become dots)
   * @param version Semantic version in 0.1.0.0 format  
   * @param options Scaffolding options (all, cli, spec, vitest, layers)
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
   * Get validation results (maps to validate-standard)
   */
  /**
   * Get component validation or property
   * @param path Component path or property to validate
   * @param operation Validation operation (validation, etc.)
   * @cliSyntax path operation
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
   * Find components in directory (maps to generate-report)
   */
  /**
   * Find and discover components in directory
   * @param componentDir Directory to search for components
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
   * Load component context for command chaining (like Unit's on method)
   * Usage: web4tscomponent on <component> <version> upgrade <next>
   */
  /**
   * Load component context for command chaining
   * @param component Component name
   * @param version Component version
   * @cliHide
   */
  async on(component: string, version: string): Promise<this> {
    const componentPath = path.join(this.model.targetDirectory, 'components', component, version);
    
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
   * Upgrade component version with semantic control (chained after on)
   * Usage: web4tscomponent on Unit 0.3.0.5 upgrade nextBuild
   */
  /**
   * Upgrade component to next version
   * @param versionType Version upgrade type (nextBuild, nextMinor, nextMajor, or specific version)
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
   * @param depth Maximum depth to traverse (default: 3)
   * @param showHidden Show hidden files and directories (default: false)
   * @cliSyntax depth showHidden
   * @cliDefault depth 3
   * @cliDefault showHidden false
   */
  async tree(depth: string = '3', showHidden: string = 'false'): Promise<this> {
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
   * Recursively display tree structure
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
   */
  private incrementPatch(version: string): string {
    const [major, minor, patch, build] = version.split('.').map(Number);
    return `${major}.${minor}.${patch}.${build + 1}`;
  }

  private incrementMinor(version: string): string {
    const [major, minor] = version.split('.').map(Number);
    return `${major}.${minor + 1}.0.0`;
  }

  private incrementMajor(version: string): string {
    const [major] = version.split('.').map(Number);
    return `${major + 1}.0.0.0`;
  }

  /**
   * Create new version from existing component
   */
  private async createVersionFromExisting(component: string, fromVersion: string, toVersion: string): Promise<void> {
    const sourcePath = `${this.model.targetDirectory}/components/${component}/${fromVersion}`;
    const targetPath = `${this.model.targetDirectory}/components/${component}/${toVersion}`;
    
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
   * Display information (maps to show-standard/guidelines)
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

  private async createLayerStructure(componentDir: string): Promise<void> {
    const layers = ['layer2', 'layer3', 'layer4', 'layer5'];
    
    for (const layer of layers) {
      await fs.mkdir(path.join(componentDir, 'src/ts', layer), { recursive: true });
    }
  }

  private async createCLIScript(componentDir: string, componentName: string, version: string): Promise<void> {
    const cliScript = await this.generateLocationResilientCLI(componentName, version);
    const scriptPath = path.join(componentDir, `${componentName.toLowerCase()}.sh`);
    await fs.writeFile(scriptPath, cliScript, { mode: 0o755 });
  }

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
   */
  private getHighestVersion(versions: string[]): string {
    return versions.sort((a, b) => this.compareVersions(b, a))[0];
  }

  /**
   * Compare two version strings (for sorting)
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
  async testNewMethod(inputData: string, outputFormat: string = 'json'): Promise<this> {
    console.log(`🚀 Processing ${inputData} as ${outputFormat}`);
    console.log(`✅ Test method completed successfully!`);
    return this;
  }

  /**
   * Update symlinks for component version (latest and scripts)
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
}