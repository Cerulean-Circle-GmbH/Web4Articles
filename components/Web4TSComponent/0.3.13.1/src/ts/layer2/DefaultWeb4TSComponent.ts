/**
 * DefaultWeb4TSComponent - Web4 TypeScript Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Web4TSComponent } from '../layer3/Web4TSComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { Web4TSComponentModel } from '../layer3/Web4TSComponentModel.interface.js';
import { ComponentDependency } from '../layer3/ComponentDependency.interface.js';
import * as fs from 'fs/promises';
import { existsSync, readdirSync, statSync, lstatSync } from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';

export class DefaultWeb4TSComponent implements Web4TSComponent {
  private model: Web4TSComponentModel;

  /**
   * ANSI color codes for tree output (from DefaultCLI pattern)
   */
  private colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[90m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    orange: '\x1b[38;5;208m'
  };

  constructor() {
    // Initialize with version from directory (single source of truth)
    const currentFileUrl = new URL(import.meta.url);
    const currentVersionDir = path.resolve(path.dirname(currentFileUrl.pathname), '..', '..', '..');
    const componentDirName = path.basename(currentVersionDir);
    const isVersionDir = /^\d+\.\d+\.\d+\.\d+$/.test(componentDirName);
    
    const discoveredRoot = this.findProjectRoot();
    this.model = {
      uuid: randomUUID(),
      name: '',
      origin: '',
      definition: '',
      component: 'Web4TSComponent',
      version: isVersionDir ? componentDirName : '0.0.0', // Read from directory name, fallback to 0.0.0
      projectRoot: discoveredRoot, // Discovered once, used everywhere for absolute paths
      targetDirectory: discoveredRoot // Can be overridden for test isolation
      // Note: createdAt/updatedAt removed per Web4 principle - belong in ChangeEvent
      // Note: componentStandards, validationRules, scaffoldingTemplates removed - never used
    };
  }

  /**
   * Set component dependencies that must be built before this component
   * @param dependencies Array of component dependencies
   * @cliHide
   */
  setDependencies(dependencies: ComponentDependency[]): this {
    this.model.dependencies = dependencies;
    return this;
  }

  /**
   * Build all component dependencies before building this component
   * Recursively builds dependencies in correct order
   * @param componentName Name of component whose dependencies to build
   * @cliHide
   */
  async buildDependencies(componentName: string): Promise<void> {
    const componentDir = this.resolveComponentDirectory(componentName);
    const versionDirs = readdirSync(componentDir)
      .filter(name => /^\d+\.\d+\.\d+\.\d+$/.test(name))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    
    if (versionDirs.length === 0) {
      console.log(`⚠️  No versions found for ${componentName}, skipping dependency build`);
      return;
    }
    
    // Use latest version
    const latestVersion = versionDirs[0];
    const componentVersionDir = path.join(componentDir, latestVersion);
    const packageJsonPath = path.join(componentVersionDir, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      console.log(`⚠️  No package.json in ${componentName}/${latestVersion}, skipping`);
      return;
    }
    
    console.log(`🔧 Building dependency: ${componentName}/${latestVersion}`);
    
    try {
      // Build the dependency
      const buildScript = path.join(componentVersionDir, 'src/sh/build.sh');
      if (existsSync(buildScript)) {
        execSync('./src/sh/build.sh', {
          cwd: componentVersionDir,
          stdio: 'inherit'
        });
        console.log(`✅ Dependency built: ${componentName}/${latestVersion}`);
      } else {
        console.log(`⚠️  No build.sh in ${componentName}/${latestVersion}, skipping`);
      }
    } catch (error) {
      console.error(`❌ Failed to build dependency ${componentName}/${latestVersion}: ${(error as Error).message}`);
      throw new Error(`Dependency build failed: ${componentName}/${latestVersion}`);
    }
  }

  /**
   * Load template from external file and substitute placeholders
   * @param templatePath Relative path to template file in templates directory
   * @param substitutions Key-value pairs for {{PLACEHOLDER}} substitution
   * @returns Template content with all placeholders substituted
   * @cliHide
   */
  private async loadTemplate(templatePath: string, substitutions: Record<string, string>): Promise<string> {
    // Find templates directory relative to the component root, not the compiled dist
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    // From dist/ts/layer2/ go back to component root, then to templates
    const templateFullPath = path.join(currentDir, '../../../templates', templatePath);
    
    if (!existsSync(templateFullPath)) {
      throw new Error(`Template not found: ${templateFullPath}`);
    }
    
    let template = await fs.readFile(templateFullPath, 'utf-8');
    
    // Substitute all placeholders in the format {{PLACEHOLDER}}
    for (const [key, value] of Object.entries(substitutions)) {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return template;
  }

  /**
   * Find project root from current working directory
   * @cliHide
   */
  private findProjectRoot(): string {
    return this.findProjectRootFrom(process.cwd());
  }

  /**
   * Find project root starting from a specific directory
   * Walks up the directory tree looking for project markers (package.json, .git, etc.)
   * This is the SINGLE SOURCE OF TRUTH for project root discovery.
   * 
   * Priority order:
   * 1. package.json + components/ directory (most specific - identifies test/data or project root)
   * 2. .git directory (fallback for projects without components/)
   * 
   * This ensures test/data is recognized as the project root for tests,
   * even if there's a .git directory higher up in the real project root.
   * 
   * @cliHide
   */
  private findProjectRootFrom(startDir: string): string {
    let currentDir = path.resolve(startDir);
    
    // First priority: Walk up looking for package.json + components/ directory
    // This is MORE SPECIFIC and will correctly identify test/data or project root
    while (currentDir !== path.dirname(currentDir)) { // Not at filesystem root
      if (existsSync(path.join(currentDir, 'package.json')) &&
          existsSync(path.join(currentDir, 'components'))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    
    // Fallback: Walk up looking for .git (for projects without components/ dir)
    currentDir = path.resolve(startDir);
    while (currentDir !== path.dirname(currentDir)) {
      if (existsSync(path.join(currentDir, '.git'))) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    
    // Last resort: return the start directory
    return path.resolve(startDir);
  }

  /**
   * Initialize component with scenario data (Web4 pattern)
   * @param scenario Scenario containing component model and context
   * @returns this component instance for method chaining
   * @cliHide
   */
  init(scenario: Scenario<Web4TSComponentModel>): this {
    if (scenario.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    return this;
  }

  /**
   * Transform component data (Web4 lifecycle method)
   * @param data Optional data to transform
   * @returns this component instance for method chaining
   * @cliHide
   */
  transform(data?: unknown): this {
    // Transform component data if needed
    if (data) {
      // Note: updatedAt removed - belongs in ChangeEvent tracking
    }
    return this;
  }

  /**
   * Validate component configuration (Web4 lifecycle method)
   * @param object Optional object to validate against component rules
   * @returns this component instance for method chaining
   * @cliHide
   */
  validate(object?: any): this {
    // Validate component configuration
    if (object) {
      // Note: updatedAt removed - belongs in ChangeEvent tracking
    }
    return this;
  }

  /**
   * Process component operations (Web4 lifecycle method)
   * @returns this component instance for method chaining
   * @cliHide
   */
  process(): this {
    // Process component operations
    // Note: updatedAt removed - belongs in ChangeEvent tracking
    return this;
  }

  /**
   * Convert component to scenario (Web4 pattern)
   * Essential for Web4 compliance and hibernation/restoration
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<Web4TSComponentModel>> {
    // Version is in the model (single source of truth)
    const ownerData = JSON.stringify({
      user: process.env.USER || 'system',
      hostname: process.env.HOSTNAME || 'localhost',
      uuid: this.model.uuid,
      timestamp: new Date().toISOString(),
      component: this.model.component,
      version: this.model.version
    });

      return {
      ior: {
        uuid: this.model.uuid,
        component: this.model.component,
        version: this.model.version
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Set target directory for component operations and update project root
   * Discovers project root from target directory for test isolation
   * @param directory Target directory path for component operations
   * @cliHide
   */
  setTargetDirectory(directory: string): void {
    this.model.targetDirectory = directory;
    // Discover project root from the target directory for absolute path operations
    // In production: discovers actual project root
    // In test/data: discovers test/data as the "project root" for isolation
    this.model.projectRoot = this.findProjectRootFrom(directory);
    // Note: updatedAt removed - belongs in ChangeEvent tracking
  }

  /**
   * Check if running in test environment (test/data directory)
   * Uses model state rather than global/env variables (Web4 OOP principle)
   * @returns true if targetDirectory includes '/test/data'
   * @cliHide
   */
  private isTestEnvironment(): boolean {
    // Web4 OOP principle: Use model state, not global/env variables
    return this.model.targetDirectory.includes('/test/data');
  }

  /**
   * Get test/data directory path for current component version
   * Each version tests in its own test/data folder for isolation
   * @returns Absolute path to test/data directory
   * @cliHide
   */
  private getTestDataDirectory(): string {
    // Each version tests in its own test/data folder
    // From: /workspace/components/Web4TSComponent/0.3.2.0/src/ts/layer2/DefaultWeb4TSComponent.ts
    // To:   /workspace/components/Web4TSComponent/0.3.2.0/test/data
    const currentFileUrl = new URL(import.meta.url);
    const currentVersionDir = path.resolve(path.dirname(currentFileUrl.pathname), '..', '..', '..');
    return path.join(currentVersionDir, 'test', 'data');
  }

  /**
   * Find all version directories for a component
   * @param componentDir Component directory path to scan for versions
   * @returns Array of version directory names (e.g., ['0.1.0.0', '0.2.0.0'])
   * @cliHide
   */
  private findVersionDirectories(componentDir: string): string[] {
    try {
      const entries = readdirSync(componentDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory() && /^\d+\.\d+\.\d+\.\d+$/.test(entry.name))
        .map(entry => entry.name);
    } catch {
      // Fallback: return current version from model
      return [this.model.version];
    }
  }

  /**
   * @cliHide
   * 
   * Web4 OOP principle: Use model state, not test detection.
   * Tests control environment via setTargetDirectory().
   */
  private resolveProjectRoot(): string {
    return this.model.targetDirectory;
  }

  /**
   * @cliHide
   * 
   * Web4 OOP principle: Always use model.targetDirectory (no test detection needed)
   */
  private resolveComponentPath(componentName: string, version: string): string {
    return path.join(this.model.targetDirectory, 'components', componentName, version);
  }

  /**
   * @cliHide
   * 
   * Web4 OOP principle: Always use model.targetDirectory (no test detection needed)
   */
  private resolveComponentDirectory(componentName: string): string {
    return path.join(this.model.targetDirectory, 'components', componentName);
  }

  /**
   * Scaffold complete component structure with all Web4 features
   * Creates directories, files, and symlinks for new component
   * @param options Scaffold options (componentName, version, features to include)
   * @returns Component metadata including compliance score and features
   * @cliHide
   */
  async scaffoldComponent(options: any): Promise<any> {
    const { componentName, version, includeLayerArchitecture, includeCLI, includeSpecFolder, includeVitest } = options;
    
    const componentDir = this.resolveComponentPath(componentName, version);
    
    // Create directory structure
    await fs.mkdir(componentDir, { recursive: true });
    
    // Create package.json using template
    await this.createPackageJsonFromTemplate(componentDir, componentName, version);
    
    // Create tsconfig.json using template
    await this.createTsConfigFromTemplate(componentDir);
    
    // Create vitest.config.ts using template
    if (includeVitest) {
      await this.createVitestConfigFromTemplate(componentDir);
    }
    
    // Create shell script structure (always include for DRY build system)
    await this.createShellScriptStructure(componentDir, componentName);
    
    if (includeLayerArchitecture) {
      await this.createLayerStructure(componentDir);
      await this.createComponentImplementationFromTemplate(componentDir, componentName, version);
      await this.createComponentInterfacesFromTemplate(componentDir, componentName);
      await this.createTSCompletion(componentDir);
      await this.copyDefaultCLI(componentDir);
    }
    
    if (includeCLI) {
      await this.createCLIScript(componentDir, componentName, version);
      await this.createCLIImplementationFromTemplate(componentDir, componentName, version);
    }
    
    if (includeSpecFolder) {
      await this.createSpecStructure(componentDir);
    }
    
    if (includeVitest) {
      await this.createTestStructure(componentDir);
    }
    
    // Create semantic symlinks for new component
    // Initial version is prod + latest (NOT dev - dev comes later when you start working)
    await this.updateLatestSymlink(componentName, version);
    await this.createSemanticLink(componentName, 'prod', version); // Mark as production
    await this.updateScriptsSymlinks(componentName, version);
    
    // Create base package.json for npm start ONLY principle
    await this.createBasePackageJson(componentName, version);
    
    console.log(`\n📊 Initial semantic links:`);
    console.log(`   🚀 prod:   ${version} (initial production version)`);
    console.log(`   📦 latest: ${version} (stable release)`);
    console.log(`   🚧 dev:    none (will be created on first test run)`);
    console.log(`   🧪 test:   none (will be created when dev is tested)`);
    
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
   * Create base package.json in component root for npm start ONLY principle
   * Forwards to latest version via symlink
   * @cliHide
   */
  private async createBasePackageJson(componentName: string, version: string): Promise<void> {
    const componentBaseDir = this.resolveComponentDirectory(componentName);
    const basePackageJsonPath = path.join(componentBaseDir, 'package.json');
    
    const basePackageJson = {
      "name": `@web4x/${componentName.toLowerCase()}`,
      "version": version,
      "type": "module",
      "description": `${componentName} Component - Base Entry Point`,
      "scripts": {
        "start": "cd latest && npm start",
        "test": "cd latest && npm test",
        "build": "cd latest && npm run build"
      },
      "private": true
    };
    
    await fs.writeFile(basePackageJsonPath, JSON.stringify(basePackageJson, null, 2) + '\n');
  }

  /**
   * Generate location-resilient CLI bash script for component
   * Creates self-contained script with symlink resolution and build integration
   * @param componentName Name of component for CLI script
   * @param version Version number for CLI script
   * @returns Generated bash script content as string
   * @cliHide
   */
  async generateLocationResilientCLI(componentName: string, version: string): Promise<string> {
    const cliTemplate = `#!/bin/bash

# ${componentName} CLI Tool - Location Resilient Version
# Web4 Architecture Standard - Self-Implementing Reference
# Works from any directory via symlink resolution

# Get component version directory from script location (location-resilient)
# Resolve symlinks: Follow the script file itself, not just the directory
SCRIPT_FILE="\${BASH_SOURCE[0]}"
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_FILE")" && pwd)"

# Resolve all symlinks (Web4 standard pattern - handles relative symlinks correctly)
while [ -L "$SCRIPT_FILE" ]; do
    TARGET="$(readlink "$SCRIPT_FILE")"
    # Handle relative symlinks: resolve relative to the directory containing the symlink
    if [[ "$TARGET" != /* ]]; then
        SCRIPT_FILE="$SCRIPT_DIR/$TARGET"
    else
        SCRIPT_FILE="$TARGET"
    fi
    # Update SCRIPT_DIR for next iteration
    SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_FILE")" && pwd)"
done

COMPONENT_PATH="$SCRIPT_DIR"

# Verify component exists
if [ ! -d "$COMPONENT_PATH" ]; then
    echo "❌ ${componentName} ${version} not found at $COMPONENT_PATH"
    exit 1
fi

# Change to component directory
cd "$COMPONENT_PATH" || {
    echo "❌ Failed to cd to $COMPONENT_PATH"
    exit 1
}

# Use smart build system (handles freshness, dependencies, everything)
./src/sh/build.sh

# Check if CLI is available after build
CLI_PATH="dist/ts/layer5/${componentName}CLI.js"
if [ ! -f "$CLI_PATH" ]; then
    echo "❌ ${componentName} CLI build failed"
    exit 1
fi

# Execute compiled CLI (no ts-node, no deprecation warnings)
node "$CLI_PATH" "$@"
`;
    
    return cliTemplate;
  }

  /**
   * Validate CLI script against Web4 location-resilient standard
   * Checks for project root detection, error handling, and ESM patterns
   * @param scriptPath Path to CLI script file to validate
   * @returns Validation result with compliance score and issues
   * @cliHide
   */
  async validateCLIStandard(scriptPath: string): Promise<any> {
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
   * Audit component for Web4 compliance and architecture patterns
   * Checks for layered architecture, package.json, CLI script, etc.
   * @param componentPath Path to component version directory
   * @returns Compliance metadata with score and feature flags
   * @cliHide
   */
  async auditComponentCompliance(componentPath: string): Promise<any> {
    const packageJsonPath = path.join(componentPath, 'package.json');
    const tsConfigPath = path.join(componentPath, 'tsconfig.json');
    
    let metadata: any = {
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
   * Generate compliance report for all components in a directory
   * Scans directory and audits each component version for compliance
   * @param componentDir Directory path containing components to audit
   * @returns Array of compliance metadata for all discovered components
   * @cliHide
   */
  async generateComplianceReport(componentDir: string): Promise<any[]> {
    const components: any[] = [];
    
    try {
      // Resolve componentDir relative to project root ONLY if it's a relative path
      let fullComponentDir: string;
      if (path.isAbsolute(componentDir)) {
        fullComponentDir = componentDir;
      } else {
        const projectRoot = this.resolveProjectRoot();
        fullComponentDir = path.join(projectRoot, componentDir);
      }
      
      const entries = await fs.readdir(fullComponentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const componentPath = path.join(fullComponentDir, entry.name);
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
   * Display Web4 location-resilient CLI standard information
   * Shows template structure and key requirements for Web4 CLI scripts
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
   * Display Web4 architecture guidelines and core principles
   * Shows layer structure, standards, and development patterns
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
   * Initialize or upgrade project with Web4 global configuration files
   * 
   * Creates root-level tsconfig.json and package.json for global node_modules
   * and TypeScript extends pattern (DRY principle). Safe to run multiple times.
   * 
   * @param targetDir Target directory (default: current working directory or test/data in test mode)
   * 
   * @example
   * // Initialize current project
   * await component.initProject();
   * 
   * @example
   * // Initialize specific directory
   * await component.initProject('/path/to/project');
   * 
   * @cliSyntax targetDir
   * @cliDefault targetDir §
   */
  async initProject(targetDir: string = '§'): Promise<this> {
    // Resolve target directory
    const projectRoot = targetDir === '§' 
      ? (this.isTestEnvironment() ? this.getTestDataDirectory() : this.model.projectRoot)
      : targetDir;
    
    console.log(`🚀 Initializing Web4 project at: ${projectRoot}`);
    
    // Create root directory if needed
    await fs.mkdir(projectRoot, { recursive: true });
    
    // 🛡️ SELF-HEALING: Validate and heal root tsconfig.json
    const tsConfigPath = path.join(projectRoot, 'tsconfig.json');
    let tsconfigValid = true;
    
    if (existsSync(tsConfigPath)) {
      // Validate existing tsconfig.json
      try {
        const content = await fs.readFile(tsConfigPath, 'utf-8');
        const parsed = JSON.parse(content);
        
        // Check if it has required Web4 structure
        if (!parsed.compilerOptions || !parsed.compilerOptions.module) {
          tsconfigValid = false;
          console.log(`   ⚠️  Detected corrupted tsconfig.json - backing up and resetting...`);
          
          // Create timestamped backup with milliseconds for uniqueness
          const now = new Date();
          const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/[T.]/g, '-').slice(0, -1); // YYYYMMDDHHmmssSSS
          const backupPath = path.join(projectRoot, `tsconfig.json.backup.${timestamp}`);
          await fs.writeFile(backupPath, content);
        }
      } catch (error) {
        // Invalid JSON
        tsconfigValid = false;
        console.log(`   ⚠️  Detected corrupted tsconfig.json - backing up and resetting...`);
        
        // Create timestamped backup with milliseconds for uniqueness
        const content = await fs.readFile(tsConfigPath, 'utf-8');
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/[T.]/g, '-').slice(0, -1); // YYYYMMDDHHmmssSSS
        const backupPath = path.join(projectRoot, `tsconfig.json.backup.${timestamp}`);
        await fs.writeFile(backupPath, content);
      }
    }
    
    if (!existsSync(tsConfigPath) || !tsconfigValid) {
      const tsConfigContent = await this.loadTemplate('config/root-tsconfig.json.template', {});
      await fs.writeFile(tsConfigPath, tsConfigContent);
      console.log(`   ✅ Created tsconfig.json`);
    } else {
      console.log(`   ℹ️  tsconfig.json already exists (valid)`);
    }
    
    // 🛡️ SELF-HEALING: Validate and heal root package.json
    const packageJsonPath = path.join(projectRoot, 'package.json');
    let packageValid = true;
    
    if (existsSync(packageJsonPath)) {
      // Validate existing package.json
      try {
        const content = await fs.readFile(packageJsonPath, 'utf-8');
        const parsed = JSON.parse(content);
        
        // Check if it has required fields (at minimum needs to be an object with some content)
        if (!parsed || typeof parsed !== 'object' || Object.keys(parsed).length === 0) {
          packageValid = false;
          console.log(`   ⚠️  Detected corrupted package.json - backing up and resetting...`);
          
          // Create timestamped backup with milliseconds for uniqueness
          const now = new Date();
          const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/[T.]/g, '-').slice(0, -1); // YYYYMMDDHHmmssSSS
          const backupPath = path.join(projectRoot, `package.json.backup.${timestamp}`);
          await fs.writeFile(backupPath, content);
        }
      } catch (error) {
        // Invalid JSON
        packageValid = false;
        console.log(`   ⚠️  Detected corrupted package.json - backing up and resetting...`);
        
        // Create timestamped backup with milliseconds for uniqueness
        const content = await fs.readFile(packageJsonPath, 'utf-8');
        const now = new Date();
        const timestamp = now.toISOString().replace(/[-:]/g, '').replace(/[T.]/g, '-').slice(0, -1); // YYYYMMDDHHmmssSSS
        const backupPath = path.join(projectRoot, `package.json.backup.${timestamp}`);
        await fs.writeFile(backupPath, content);
      }
    }
    
    if (!existsSync(packageJsonPath) || !packageValid) {
      const packageJsonContent = await this.loadTemplate('config/root-package.json.template', {});
      await fs.writeFile(packageJsonPath, packageJsonContent);
      console.log(`   ✅ Created package.json`);
    } else {
      console.log(`   ℹ️  package.json already exists (valid)`);
    }
    
    // Create global node_modules directory
    const nodeModulesPath = path.join(projectRoot, 'node_modules');
    await fs.mkdir(nodeModulesPath, { recursive: true });
    console.log(`   ✅ Ensured node_modules directory exists`);
    
    // 🛡️ SELF-HEALING: Create or update source.env (essential for tab completion)
    const sourceEnvPath = path.join(projectRoot, 'source.env');
    const sourceEnvContent = await this.loadTemplate('project/source.env.template', {});
    
    if (existsSync(sourceEnvPath)) {
      const existing = await fs.readFile(sourceEnvPath, 'utf-8');
      if (existing !== sourceEnvContent) {
        await fs.writeFile(sourceEnvPath, sourceEnvContent);
        await fs.chmod(sourceEnvPath, 0o755);
        console.log(`   ✅ Updated source.env (tab completion, PATH)`);
      } else {
        console.log(`   ℹ️  source.env already up to date`);
      }
    } else {
      await fs.writeFile(sourceEnvPath, sourceEnvContent);
      await fs.chmod(sourceEnvPath, 0o755);
      console.log(`   ✅ Created source.env (tab completion, PATH)`);
    }
    
    console.log(`\n✅ Project initialized successfully!`);
    console.log(`   Root configs: ${projectRoot}`);
    console.log(`   Components can now use: "extends": "../../../tsconfig.json"`);
    console.log(`   DRY principle: All components symlink to shared node_modules`);
    console.log(`   👉 Source environment: . source.env`);
    
    return this;
  }

  /**
   * Create new Web4-compliant component with auto-discovery CLI and full architecture
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
  async create(name: string, version: string = '0.1.0.0', options: string = 'all'): Promise<void> {
    // Parse options (maps from 1.0.0.0 --cli --spec --vitest --layers)
    const scaffoldOptions: any = {
      componentName: name,
      version,
      includeLayerArchitecture: options.includes('layers') || options.includes('all'),
      includeCLI: options.includes('cli') || options.includes('all'),
      includeSpecFolder: options.includes('spec') || options.includes('all'),
      includeVitest: options.includes('vitest') || options.includes('test') || options.includes('all')
    };
    
    console.log(`🏗️ Creating Web4 component: ${name} ${version}`);
    console.log(`📋 Options: ${options || 'default'}`);
    
    const metadata = await this.scaffoldComponent(scaffoldOptions);
    
    console.log(`✅ Component structure created: ${name}`);
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Location: components/${name}/${version}`);
    console.log(`   CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
    console.log(`   Layers: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    console.log(`   Spec: ${metadata.hasScenarioSupport ? '✅' : '❌'}`);
    
    // Tier 1 Improvement: Automatically initialize component integration
    // PDCA: 2025-10-10-UTC-1850-component-initialization-ux-gap.pdca.md
    console.log(`🔗 Initializing project integration...`);
    
    // Load the newly created component and verify/fix its symlinks
    const tempComponent = new DefaultWeb4TSComponent();
    // Set component context directly (Web4 pattern: modify model, not init)
    tempComponent.model.component = name;
    tempComponent.model.version = version;
    await tempComponent.verifyAndFix();
    
    // Verify component is callable
    const cliScriptName = name.toLowerCase().replace(/\./g, '');
    const cliPath = path.join(this.model.projectRoot, 'scripts', cliScriptName);
    
    if (existsSync(cliPath)) {
      console.log(`✅ Component fully initialized and ready to use!`);
      console.log(`   CLI command: ${cliScriptName}`);
      console.log(`   Try: ${cliScriptName}`);
    } else {
      console.log(`⚠️  Component created but CLI not available at expected path: ${cliPath}`);
      console.log(`   Run manually: web4tscomponent on ${name} ${version} verifyAndFix`);
    }
  }

  /**
   * Set component property or generate CLI script
   * Maps to generate-cli functionality for backward compatibility
   * 
   * @param component Component name for CLI generation
   * @param property Property to set (cli-script, etc.)
   * @param version Version for CLI script generation
   * @cliSyntax component property version
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
        validation.issues.forEach((issue: any, index: any) => {
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
   * Analyze component compliance from path
   * Maps to audit-compliance functionality for backward compatibility
   * 
   * @param componentPath Path to component directory
   * @cliSyntax componentPath
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
      metadata.issues.forEach((issue: any, index: any) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }
    
    return this;
  }

  /**
   * Discover and analyze Web4 components in directory with compliance reporting
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
   * Load component context for chaining operations (essential for workflows)
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
   * await component.on('Web4TSComponent', '0.3.2.0');
   * 
   * @cliSyntax component version
   * @cliDefault version latest
   */
  async on(component: string, version: string = 'latest'): Promise<this> {
    const componentPath = this.resolveComponentPath(component, version);
    
    if (!existsSync(componentPath)) {
      throw new Error(`Component not found: ${component} ${version} at ${componentPath}`);
    }
    
    // Set component context for chaining
    this.model.name = component;
    this.model.origin = componentPath;
    this.model.definition = `Component context: ${component} ${version}`;
    // Note: updatedAt removed - belongs in ChangeEvent tracking
    
    // Store context for chained operations
    (this.model as any).contextComponent = component;
    (this.model as any).contextVersion = version;
    (this.model as any).contextPath = componentPath;
    
    console.log(`✅ Component context loaded: ${component} ${version}`);
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
        nextVersion = this.incrementBuild(currentVersion);
        console.log(`🔧 Upgrading ${context.component} to next build: ${currentVersion} → ${nextVersion}`);
        break;
        
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
   * Display tree structure of component directory
   * WITHOUT context: Shows tree for current component (self-operation)
   * WITH context: Shows tree for target component
   * @param depth Maximum depth to traverse (default: 4)
   * @param showHidden Show hidden files and directories (default: false)
   * @cliSyntax depth showHidden
   * @cliDefault depth 4
   * @cliDefault showHidden false
   */
  async tree(depth: string = '4', showHidden: string = 'false'): Promise<this> {
    const context = this.getComponentContext();
    const maxDepth = parseInt(depth, 10) || 4;
    const includeHidden = showHidden.toLowerCase() === 'true';
    
    if (context) {
      // WITH context: Show target component's tree
      console.log(`${this.colors.cyan}${this.colors.bold}📁 Tree structure for ${context.component} ${context.version}:${this.colors.reset}`);
      console.log(`${this.colors.dim}${context.path}${this.colors.reset}`);
      await this.displayTreeStructure(context.path, '', maxDepth, 0, includeHidden);
    } else {
      // WITHOUT context: Show current component's tree (self-operation)
      const currentPath = process.cwd();
      console.log(`${this.colors.cyan}${this.colors.bold}📁 Tree structure for current component:${this.colors.reset}`);
      console.log(`${this.colors.dim}${currentPath}${this.colors.reset}`);
      await this.displayTreeStructure(currentPath, '', maxDepth, 0, includeHidden);
    }
    
    return this;
  }

  /**
   * Update latest symlink to point to specified version (requires context)
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
    const componentDir = this.resolveComponentDirectory(context.component);
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
      // Remove existing symlink if it exists (using lstat to detect broken symlinks too)
      try {
        await fs.lstat(latestSymlink);
        await fs.unlink(latestSymlink);
        console.log(`   Removed existing latest symlink`);
      } catch (err) {
        // Symlink doesn't exist, that's fine
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
   * Set development version link - version currently under development (requires context)
   * @param targetVersion Version to set as dev (default: use current context version)
   * @cliSyntax targetVersion
   * @cliDefault targetVersion current
   * @cliExample web4tscomponent on Unit 0.3.0.5 setDev
   * @cliExample web4tscomponent on Unit 0.3.0.5 setDev 0.4.0.0
   */
  async setDev(targetVersion: string = 'current'): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }

    const version = targetVersion === 'current' ? context.version : targetVersion;
    await this.createSemanticLink(context.component, 'dev', version);
    console.log(`🚧 Dev symlink updated: dev → ${version}`);
    
    return this;
  }

  /**
   * Set test version link - version ready for 100% revision testing (requires context)
   * @param targetVersion Version to set as test (default: use current context version)
   * @cliSyntax targetVersion
   * @cliDefault targetVersion current
   * @cliExample web4tscomponent on Unit 0.3.0.5 setTest
   * @cliExample web4tscomponent on Unit 0.3.0.5 setTest 0.3.2.0
   */
  async setTest(targetVersion: string = 'current'): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }

    const version = targetVersion === 'current' ? context.version : targetVersion;
    await this.createSemanticLink(context.component, 'test', version);
    console.log(`🧪 Test symlink updated: test → ${version}`);
    
    return this;
  }

  /**
   * Set production version link - version that achieved 100% testing success (requires context)
   * @param targetVersion Version to set as prod (default: use current context version)
   * @cliSyntax targetVersion
   * @cliDefault targetVersion current
   * @cliExample web4tscomponent on Unit 0.3.0.5 setProd
   * @cliExample web4tscomponent on Unit 0.3.0.5 setProd 0.3.1.0
   */
  async setProd(targetVersion: string = 'current'): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }

    const version = targetVersion === 'current' ? context.version : targetVersion;
    await this.createSemanticLink(context.component, 'prod', version);
    console.log(`🚀 Prod symlink updated: prod → ${version}`);
    
    return this;
  }

  /**
   * Display semantic version links - shows own links if no context, or target component links if context loaded
   * When no context: Show Web4TSComponent's own semantic version links
   * When context loaded: Show semantic version links for the loaded component
   * Shows development workflow status and version progression
   * @param action Optional action: 'fix' to repair all links and symlinks
   * @cliSyntax
   * @cliExample web4tscomponent links
   * @cliExample web4tscomponent links fix
   * @cliExample web4tscomponent on Unit 0.3.2.0 links
   */
  async links(action: string = ''): Promise<this> {
    const context = this.getComponentContext();
    const componentName = context?.component || 'Web4TSComponent';
    
    // If 'fix' action requested, run verifyAndFix first
    if (action === 'fix') {
      console.log(`\n🔧 Fixing all links and symlinks for ${componentName}...`);
      await this.verifyAndFix();
      
      // Also fix semantic links (dev, test, prod, latest)
      await this.fixSemanticLinks(componentName);
      console.log(`✅ All links repaired for ${componentName}\n`);
    }
    
    if (!context) {
      // No context - show Web4TSComponent's own links
      const semanticLinks = await this.getSemanticLinks('Web4TSComponent');
      const componentDir = this.resolveComponentDirectory('Web4TSComponent');
      const availableVersions = this.getAvailableVersions(componentDir);

      console.log(`🔗 Semantic Version Links for Web4TSComponent:`);
      console.log(`   📊 Available versions: ${availableVersions.length}`);
      console.log('');

      // Display semantic links with status indicators
      const linkOrder = ['prod', 'test', 'dev', 'latest'] as const;
      for (const linkType of linkOrder) {
        const target = semanticLinks[linkType];
        const icon = this.getLinkIcon(linkType);
        const status = target ? `→ ${target}` : '(not set)';
        const exists = target && availableVersions.includes(target) ? '✅' : target ? '❌' : '⚪';
        
        console.log(`   ${icon} ${linkType.padEnd(6)} ${status.padEnd(15)} ${exists}`);
      }

      console.log('');
      console.log('Legend: ✅ Valid  ❌ Broken  ⚪ Not Set');
      console.log('');
      console.log('Workflow: dev → test → prod');
      console.log('  🚧 dev:  Version under development');
      console.log('  🧪 test: Ready for 100% revision testing');
      console.log('  🚀 prod: Achieved 100% testing success');
      console.log('  📦 latest: Current stable release');

      return this;
    }

    // Context loaded - show target component links
    const semanticLinks = await this.getSemanticLinks(context.component);
    const componentDir = this.resolveComponentDirectory(context.component);
    const availableVersions = this.getAvailableVersions(componentDir);

    console.log(`\n🔗 Semantic Version Links for ${context.component}:`);
    console.log(`   📊 Available versions: ${availableVersions.length}`);
    console.log('');

    // Display semantic links with status indicators
    const linkOrder = ['prod', 'test', 'dev', 'latest'] as const;
    for (const linkType of linkOrder) {
      const target = semanticLinks[linkType];
      const icon = this.getLinkIcon(linkType);
      const status = target ? `→ ${target}` : '(not set)';
      const exists = target && availableVersions.includes(target) ? '✅' : target ? '❌' : '⚪';
      
      console.log(`   ${icon} ${linkType.padEnd(6)} ${status.padEnd(15)} ${exists}`);
    }

    console.log('');
    console.log('Legend: ✅ Valid  ❌ Broken  ⚪ Not Set');
    console.log('');
    console.log('Workflow: dev → test → prod');
    console.log('  🚧 dev:  Version under development');
    console.log('  🧪 test: Ready for 100% revision testing');
    console.log('  🚀 prod: Achieved 100% testing success');
    console.log('  📦 latest: Current stable release');

    return this;
  }

  /**
   * Fix missing or broken semantic links (dev, test, prod, latest)
   * Repairs or creates semantic symlinks to valid version targets
   * @param componentName Component name to fix semantic links for
   * @cliHide
   */
  private async fixSemanticLinks(componentName: string): Promise<void> {
    const componentDir = this.resolveComponentDirectory(componentName);
    const availableVersions = this.getAvailableVersions(componentDir);
    
    if (availableVersions.length === 0) {
      console.log(`   ⚠️  No versions available for ${componentName}`);
      return;
    }
    
    const semanticLinks = await this.getSemanticLinks(componentName);
    const fs = await import('fs/promises');
    
    // Determine what links should be
    // getAvailableVersions() sorts LOW to HIGH, so we need the LAST element for highest!
    const highestVersion = this.getHighestVersion(availableVersions);
    
    // Fix 'latest' - should always point to highest version
    if (!semanticLinks.latest || semanticLinks.latest !== highestVersion) {
      console.log(`   🔧 Fixing 'latest' link: ${semanticLinks.latest || 'missing'} → ${highestVersion}`);
      try {
        await this.createSemanticLink(componentName, 'latest', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not fix 'latest': ${(error as Error).message}`);
      }
    }
    
    // Fix 'prod' - if missing, set to latest
    if (!semanticLinks.prod) {
      console.log(`   🔧 Creating missing 'prod' link → ${highestVersion}`);
      try {
        await this.createSemanticLink(componentName, 'prod', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not create 'prod': ${(error as Error).message}`);
      }
    } else if (!availableVersions.includes(semanticLinks.prod)) {
      console.log(`   🔧 Fixing broken 'prod' link: ${semanticLinks.prod} (missing) → ${highestVersion}`);
      try {
        await this.createSemanticLink(componentName, 'prod', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not fix 'prod': ${(error as Error).message}`);
      }
    }
    
    // Fix 'dev' - should point to highest version (active development)
    const prodVersion = semanticLinks.prod || highestVersion;
    if (!semanticLinks.dev || semanticLinks.dev !== highestVersion) {
      const action = !semanticLinks.dev ? 'Creating missing' : 'Updating';
      console.log(`   🔧 ${action} 'dev' link → ${highestVersion}`);
      try {
        await this.createSemanticLink(componentName, 'dev', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not ${action.toLowerCase()} 'dev': ${(error as Error).message}`);
      }
    } else if (!availableVersions.includes(semanticLinks.dev)) {
      console.log(`   🔧 Fixing broken 'dev' link: ${semanticLinks.dev} (missing) → ${highestVersion}`);
      try {
        await this.createSemanticLink(componentName, 'dev', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not fix 'dev': ${(error as Error).message}`);
      }
    }
    
    // Fix 'test' - should point to highest version (ready for testing)
    if (!semanticLinks.test || semanticLinks.test !== highestVersion) {
      const action = !semanticLinks.test ? 'Creating missing' : 'Updating';
      console.log(`   🔧 ${action} 'test' link → ${highestVersion}`);
      try {
        await this.createSemanticLink(componentName, 'test', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not ${action.toLowerCase()} 'test': ${(error as Error).message}`);
      }
    } else if (!availableVersions.includes(semanticLinks.test)) {
      console.log(`   🔧 Fixing broken 'test' link: ${semanticLinks.test} (missing) → ${highestVersion}`);
      try {
        await this.createSemanticLink(componentName, 'test', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not fix 'test': ${(error as Error).message}`);
      }
    }
  }

  /**
   * Get icon for semantic link type
   * @cliHide
   */
  private getLinkIcon(linkType: string): string {
    const icons: Record<string, string> = {
      'dev': '🚧',
      'test': '🧪', 
      'prod': '🚀',
      'latest': '📦'
    };
    return icons[linkType] || '🔗';
  }

  /**
   * Create or update a semantic symlink (dev, test, prod, latest)
   * Replaces existing symlink and updates scripts symlinks for 'latest'
   * @param componentName Component name for semantic link
   * @param linkType Type of semantic link (dev, test, prod, latest)
   * @param targetVersion Version to point semantic link to
   * @cliHide
   */
  private async createSemanticLink(componentName: string, linkType: string, targetVersion: string): Promise<void> {
    const componentDir = this.resolveComponentDirectory(componentName);
    const linkPath = path.join(componentDir, linkType);
    const targetDir = path.join(componentDir, targetVersion);

    // Verify target version exists
    if (!existsSync(targetDir)) {
      throw new Error(`Target version ${targetVersion} does not exist at ${targetDir}`);
    }

    console.log(`🔗 Setting ${linkType} symlink for ${componentName}:`);
    console.log(`   Target: ${targetVersion}`);
    console.log(`   Symlink: ${linkPath}`);

    try {
      // Remove existing symlink if it exists
      if (existsSync(linkPath)) {
        await fs.unlink(linkPath);
        console.log(`   Removed existing ${linkType} symlink`);
      }

      // Create new symlink (relative path)
      await fs.symlink(targetVersion, linkPath);

      // Update scripts symlinks only for 'latest' to maintain backward compatibility
      if (linkType === 'latest') {
        await this.updateScriptsSymlinks(componentName, targetVersion);
      }

    } catch (error) {
      throw new Error(`Failed to update ${linkType} symlink: ${(error as Error).message}`);
    }
  }

  /**
   * Get all semantic links for a component
   * Reads dev, test, prod, and latest symlinks
   * @param componentName Component name to get semantic links for
   * @returns Object with dev, test, prod, latest versions (null if not set)
   * @cliHide
   */
  private async getSemanticLinks(componentName: string): Promise<{ dev: string | null; test: string | null; prod: string | null; latest: string | null }> {
    const componentDir = this.resolveComponentDirectory(componentName);
    const result = {
      dev: null as string | null,
      test: null as string | null,
      prod: null as string | null,
      latest: null as string | null
    };

    for (const linkType of ['dev', 'test', 'prod', 'latest'] as const) {
      const linkPath = path.join(componentDir, linkType);
      try {
        if (existsSync(linkPath)) {
          const target = await fs.readlink(linkPath);
          result[linkType] = target;
        }
      } catch (error) {
        // Leave as null
      }
    }

    return result;
  }

  /**
   * Execute test command - runs tests WITHOUT promotion
   * Use releaseTest() for version promotion workflow
   * 
   * Mode 1 (Full Suite): Run all tests (default)
   * Mode 2 (Selective): Run specific test file/describe/itCase by number
   * 
   * When no context: Run Web4TSComponent's own test suite
   * When context loaded: Run test suite for the loaded component
   * 
   * @param scope - Test scope: empty/all (full suite), 'file', 'describe', or 'itCase'
   * @param references - For selective testing: numeric references to select tests
   * @cliSyntax scope ...references
   * @cliDefault scope all
   * @cliExample web4tscomponent test
   * @cliExample web4tscomponent test all
   * @cliExample web4tscomponent test file 2
   * @cliExample web4tscomponent test describe 2 1
   * @cliExample web4tscomponent test itCase 2 1 3
   * @cliExample web4tscomponent on Unit 0.3.0.5 test
   */
  async test(scope: string = 'all', ...references: string[]): Promise<this> {
    // Detect mode: selective testing vs full suite
    const selectiveScopes = ['file', 'describe', 'itCase'];
    const isSelectiveMode = selectiveScopes.includes(scope);
    
    if (isSelectiveMode) {
      // MODE 2: Selective testing
      return await this.testSelective(scope, references);
    }
    
    // MODE 1: Full test suite (NO promotion - use releaseTest for that)
    const context = this.getComponentContext();
    
    if (!context) {
      // No context - run Web4TSComponent's own tests
      console.log(`🧪 Running Web4TSComponent tests (no promotion)...`);
      
      // 🚨 RECURSION DETECTION: Check if we're already inside vitest
      const insideTestEnvironment = !!(process.env.VITEST || process.env.VITEST_WORKER_ID);
      
      if (insideTestEnvironment) {
        console.log(`🧪 Already in test environment - skipping recursive vitest execution`);
        console.log(`✅ Test execution skipped (recursion prevented)`);
        return this;
      }
      
      // Run vitest directly
      try {
        execSync('npx vitest run', { 
          cwd: process.cwd(),
          stdio: 'inherit',
          encoding: 'utf-8'
        });
        console.log(`✅ Tests completed successfully`);
      } catch (error) {
        console.error(`❌ Tests failed`);
        throw error;
      }
      
      return this;
    }

    // Context loaded - run tests for target component
    const componentPath = this.resolveComponentPath(context.component, context.version);
    
    console.log(`🧪 Running tests for ${context.component} ${context.version} (no promotion)...`);
    
    try {
      execSync('npm test', { 
        cwd: componentPath, 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      
      console.log(`✅ Tests completed for ${context.component} ${context.version}`);
      
    } catch (error) {
      console.error(`❌ Tests failed for ${context.component} ${context.version}`);
      throw error;
    }

    return this;
  }

  /**
   * Run tests with configurable release promotion 
   * Same as test() but on 100% success promotes using specified promotion level
   * 
   * Two-stage workflow:
   * - Stage 1: dev → test (nextBuild) - same as test()
   * - Stage 2: test → prod (specified promotion) + new dev (nextBuild)
   * 
   * @param successPromotion Promotion level on test success: nextPatch, nextMinor, or nextMajor
   * @cliSyntax successPromotion
   * @cliDefault successPromotion nextPatch
   * @cliCompletion successPromotion successPromotionParameterCompletion
   * @cliExample web4tscomponent releaseTest
   * @cliExample web4tscomponent releaseTest nextMinor
   * @cliExample web4tscomponent on Unit 0.3.0.5 releaseTest nextMajor
   */
  async releaseTest(successPromotion: string = 'nextPatch'): Promise<this> {
    const context = this.getComponentContext();
    const validPromotions = ['nextPatch', 'nextMinor', 'nextMajor'];
    
    if (!validPromotions.includes(successPromotion)) {
      console.error(`❌ Invalid promotion level: ${successPromotion}`);
      console.log(`💡 Valid options: ${validPromotions.join(', ')}`);
      throw new Error(`Invalid promotion level`);
    }
    
    // WORKFLOW REMINDER: Always work on dev → test → dev cycle
    console.log(`\n🔄 RELEASE TEST WORKFLOW (${successPromotion.toUpperCase()}):`);
    console.log(`   🚧 ALWAYS work on dev version until you run releaseTest`);
    console.log(`   🧪 ALWAYS work on test version until test succeeds`);  
    console.log(`   🚀 On 100% success: Promotes using ${successPromotion}`);
    console.log(`   🚧 ALWAYS work on dev version after test success\n`);
    
    if (!context) {
      // No context - run Web4TSComponent's own tests
      const insideTestEnvironment = !!(process.env.VITEST || process.env.VITEST_WORKER_ID);
      
      if (insideTestEnvironment) {
        console.log(`🧪 Already in test environment - skipping recursive vitest execution`);
        console.log(`✅ Test execution skipped (recursion prevented)`);
      } else {
        console.log(`🧪 Running Web4TSComponent internal tests (RELEASE MODE)...`);
        
        try {
          execSync('npx vitest run', { 
            cwd: process.cwd(),
            stdio: 'inherit',
            encoding: 'utf-8'
          });
          
          console.log(`✅ Web4TSComponent internal tests completed successfully`);
          
        } catch (error) {
          console.error(`❌ Web4TSComponent internal tests failed`);
          throw error;
        }
      }
      
      // 🎯 SELF-PROMOTION: After tests complete, handle RELEASE version promotion
      console.log(`\n🔍 Checking for RELEASE promotion opportunity...`);
      const currentVersion = await this.getCurrentVersion();
      
      // Determine which promotion stage to apply
      const semanticLinks = await this.getSemanticLinks('Web4TSComponent');
      const currentTest = semanticLinks.test;
      
      if (currentVersion !== currentTest) {
        // Stage 1: This is a dev version, promote to test
        await this.handleFirstTestRun('Web4TSComponent', currentVersion);
      } else {
        // Stage 2 RELEASE: This is the test version, use specified promotion level
        await this.handleReleaseTestSuccessPromotion('Web4TSComponent', currentVersion, successPromotion);
      }
      
      return this;
    }

    // 🚨 RECURSION SAFETY CHECK
    if (context.component === 'Web4TSComponent') {
      console.log(`🚨 RECURSION SAFETY: Web4TSComponent cannot test itself via delegation`);
      throw new Error('Recursion prevented: Use without context instead.');
    }

    // Context loaded - check if dev and test are same version and do nextBuild first
    const semanticLinks = await this.getSemanticLinks(context.component);
    const devVersion = semanticLinks['dev'];
    const testVersion = semanticLinks['test'];
    
    let targetVersion = context.version;
    
    // If dev and test are the same version, do nextBuild promotion first
    if (devVersion && testVersion && devVersion === testVersion && devVersion === context.version) {
      console.log(`🔄 Dev and test are same version (${devVersion}) - creating nextBuild for testing...`);
      
      try {
        const nextBuildVersion = await this.createNextBuildVersion(context.component, context.version);
        await this.createSemanticLink(context.component, 'test', nextBuildVersion);
        console.log(`✅ Test updated: test → ${nextBuildVersion}`);
        await this.on(context.component, nextBuildVersion);
        targetVersion = nextBuildVersion;
        console.log(`🎯 Now testing new build version: ${nextBuildVersion}`);
      } catch (error) {
        console.error(`❌ Failed to create nextBuild version: ${(error as Error).message}`);
        throw error;
      }
    }

    // Run target component tests and handle RELEASE promotion
    const componentPath = this.resolveComponentPath(context.component, targetVersion);
    console.log(`🧪 Running tests for ${context.component} ${targetVersion} (RELEASE MODE)...`);
    
    try {
      execSync('npm test', { 
        cwd: componentPath, 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      
      console.log(`✅ Tests completed for ${context.component} ${targetVersion}`);
      
      // RELEASE promotion based on successPromotion level
      const semanticLinks = await this.getSemanticLinks(context.component);
      const currentTest = semanticLinks.test;
      
      if (targetVersion !== currentTest) {
        // Stage 1: This is a dev version, promote to test
        await this.handleFirstTestRun(context.component, targetVersion);
      } else {
        // Stage 2 RELEASE: This is the test version, use specified promotion level
        await this.handleReleaseTestSuccessPromotion(context.component, targetVersion, successPromotion);
      }
      
    } catch (error) {
      console.error(`❌ Tests failed for ${context.component} ${targetVersion}`);
      throw error;
    }

    return this;
  }

  /**
   * Handle release test success: promote test to prod using nextMinor (Stage 2 - Major Release)
   * Workflow Stage 2 (Release): test → prod (nextMinor) + new dev (nextBuild)
   * E.g., 0.3.4.2 (test) → 0.4.0.0 (prod) + 0.4.0.1 (dev)
   * Used by releaseTest() for major version releases
   * @cliHide
   */
  async handleReleaseTestSuccessPromotion(componentName: string, currentVersion: string, promotionLevel: string = 'nextPatch'): Promise<void> {
    console.log(`\n🎯 Analyzing release test success for version promotion...`);
    console.log(`📋 RELEASE MODE: Will use ${promotionLevel.toUpperCase()}`);
    
    // Safety check: verify this version is currently 'test'
    const semanticLinks = await this.getSemanticLinks(componentName);
    const currentTest = semanticLinks.test;
    
    if (currentTest !== currentVersion) {
      console.log(`⚠️  Skipping Stage 2: Current version (${currentVersion}) is not the test version`);
      console.log(`💡 Current test version is: ${currentTest || 'none'}`);
      console.log(`💡 Only the test version can be promoted to prod`);
      return;
    }
    
    // Safety check: verify this version hasn't already been promoted
    const currentProd = semanticLinks.prod;
    if (currentProd === currentVersion) {
      console.log(`⚠️  Version ${currentVersion} is already marked as prod - skipping promotion`);
      console.log(`💡 This prevents accidental double promotion`);
      return;
    }
    
    // Check if test result indicates 100% success
    const testSuccess = await this.verifyTestSuccess(componentName, currentVersion);
    if (!testSuccess) {
      console.log(`⚠️  Test success verification failed - skipping promotion`);
      return;
    }
    
    console.log(`🚀 100% test success confirmed! Starting Stage 2 RELEASE promotion workflow...`);
    console.log(`📋 Workflow Stage 2 (Release): test → prod (${promotionLevel}) + new dev (nextBuild)`);
    
    try {
      // Step 1: Create promotion version from current (based on promotion level)
      console.log(`\n🔧 Step 1: Creating ${promotionLevel} version from ${currentVersion}...`);
      
      let newProdVersion: string;
      switch (promotionLevel) {
        case 'nextPatch':
          newProdVersion = await this.createNextPatchVersion(componentName, currentVersion);
          break;
        case 'nextMinor':
          newProdVersion = await this.createNextMinorVersion(componentName, currentVersion);
          break;
        case 'nextMajor':
          newProdVersion = await this.createNextMinorVersion(componentName, currentVersion); // Use nextMinor for now, will add nextMajor later
          break;
        default:
          throw new Error(`Invalid promotion level: ${promotionLevel}`);
      }
      
      // Step 2: Set new version as prod
      console.log(`\n🚀 Step 2: Promoting ${newProdVersion} to prod (${promotionLevel.toUpperCase()})...`);
      await this.createSemanticLink(componentName, 'prod', newProdVersion);
      console.log(`✅ Prod updated: prod → ${newProdVersion}`);
      
      // Step 3: Update latest to new stable version
      console.log(`\n📦 Step 3: Updating latest to stable version...`);
      await this.createSemanticLink(componentName, 'latest', newProdVersion);
      console.log(`✅ Latest updated: latest → ${newProdVersion}`);
      
      // Step 4: Create nextBuild version for new development cycle
      console.log(`\n🔧 Step 4: Creating nextBuild version for development...`);
      const nextBuildVersion = await this.createNextBuildVersion(componentName, newProdVersion);
      
      // Step 5: Set nextBuild as new dev and test
      console.log(`\n🚧 Step 5: Setting up development workflow...`);
      await this.createSemanticLink(componentName, 'dev', nextBuildVersion);
      await this.createSemanticLink(componentName, 'test', nextBuildVersion);
      console.log(`✅ Dev updated: dev → ${nextBuildVersion}`);
      console.log(`✅ Test updated: test → ${nextBuildVersion}`);
      
      console.log(`\n🎉 Stage 2 RELEASE promotion workflow completed successfully!`);
      console.log(`📊 Final state:`);
      console.log(`   🚀 prod:   ${newProdVersion} (MAJOR RELEASE from ${currentVersion})`);
      console.log(`   📦 latest: ${newProdVersion} (stable release)`);
      console.log(`   🧪 test:   ${nextBuildVersion} (ready for next cycle)`);
      console.log(`   🚧 dev:    ${nextBuildVersion} (active development)`);
      
    } catch (error) {
      console.error(`❌ Stage 2 RELEASE promotion failed: ${(error as Error).message}`);
      console.log(`💡 Manual intervention may be required`);
    }
  }

  /**
   * Determine which promotion stage to apply based on current semantic links
   * Correct workflow:
   * 1. Create 0.1.0.0 → prod + latest (initial production version)
   * 2. No dev? → Create 0.1.0.1 → dev (start development)
   * 3. Testing dev? → Create 0.1.0.2 → test (start testing)
   * 4. 100% test pass? → Create 0.1.1.0 → prod + latest, Create 0.1.1.1 → dev (new cycle)
   * @cliHide
   */
  private async determinePromotionStage(
    componentName: string, 
    currentVersion: string, 
    semanticLinks: { dev: string | null; test: string | null; prod: string | null; latest: string | null }
  ): Promise<void> {
    console.log(`\n📊 Current semantic links:`);
    console.log(`   🚀 prod:   ${semanticLinks.prod || 'none'}`);
    console.log(`   🧪 test:   ${semanticLinks.test || 'none'}`);
    console.log(`   🚧 dev:    ${semanticLinks.dev || 'none'}`);
    console.log(`   📦 latest: ${semanticLinks.latest || 'none'}`);
    console.log(`   📍 Current: ${currentVersion}`);
    
    // Stage 0: No dev link exists → create first dev version
    if (!semanticLinks.dev) {
      console.log(`\n🚧 Stage 0: No dev version exists, creating first dev version...`);
      await this.handleCreateFirstDev(componentName, currentVersion);
      return;
    }
    
    // Stage 1: Current is dev → create new test version
    // Key insight: When dev === test === currentVersion, that signals this dev is ready for testing!
    // We create a FRESH test version from the current dev
    if (currentVersion === semanticLinks.dev) {
      if (semanticLinks.test === currentVersion) {
        console.log(`\n🔄 Discovery: dev and test both point to ${currentVersion} - this dev is ready for testing!`);
        console.log(`🧪 Stage 1: Creating FRESH test version from dev ${currentVersion}...`);
      } else {
        console.log(`\n🧪 Stage 1: dev → test (creating test version)...`);
      }
      await this.handleDevToTest(componentName, currentVersion);
      return;
    }
    
    // Stage 2: Current is test and 100% pass → promote to prod
    if (currentVersion === semanticLinks.test) {
      console.log(`\n🚀 Stage 2: test → prod (checking for 100% test success)...`);
      await this.handleTestSuccessPromotion(componentName, currentVersion);
      return;
    }
    
    // Unknown state
    console.log(`\n⚠️  Current version ${currentVersion} doesn't match any promotion pattern`);
    console.log(`💡 Expected:`);
    console.log(`   - If you just created the component: run test again to create dev version`);
    console.log(`   - If you're developing: make sure you're on the dev version`);
    console.log(`   - If you're testing: make sure you're on the test version`);
  }

  /**
   * Stage 0: Create first dev version from prod
   * E.g., 0.1.0.0 (prod) → 0.1.0.1 (dev)
   * @cliHide
   */
  private async handleCreateFirstDev(componentName: string, currentVersion: string): Promise<void> {
    console.log(`\n🚧 Creating first dev version from ${currentVersion}...`);
    
    try {
      // Create nextBuild version (increment build number)
      const devVersion = await this.createNextBuildVersion(componentName, currentVersion);
      
      // Set as dev
      await this.createSemanticLink(componentName, 'dev', devVersion);
      
      console.log(`\n✅ Stage 0 complete: ${currentVersion} (prod) → ${devVersion} (dev)`);
      
      // CRITICAL: Only auto-switch for Web4TSComponent's SELF-testing (no context)
      // For other components (with context), the caller controls version switching
      if (componentName === 'Web4TSComponent' && !this.getComponentContext()) {
        console.log(`🔄 Switching to ${devVersion} to continue testing...`);
        
        // Use execSync to run npm test in the new version's directory
        const componentPath = this.resolveComponentPath(componentName, devVersion);
        console.log(`🧪 Now running tests on ${devVersion} (dev version)...`);
        
        try {
          execSync('npm test', {
            cwd: componentPath,
            stdio: 'inherit',
            encoding: 'utf-8'
          });
        } catch (error) {
          // Tests failed - this is OK, will retry later
          console.log(`⚠️  Tests failed on ${devVersion} - will retry after fixes`);
        }
      } else {
        console.log(`📊 Next step: Manually switch to ${devVersion} for development`);
      }
      
    } catch (error) {
      console.error(`❌ Stage 0 failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Stage 1: Create test version from dev
   * E.g., 0.1.0.1 (dev) → 0.1.0.2 (test)
   * @cliHide
   */
  private async handleDevToTest(componentName: string, currentVersion: string): Promise<void> {
    console.log(`\n🧪 Creating test version from ${currentVersion}...`);
    
    try {
      // Create nextBuild version (increment build number)
      const testVersion = await this.createNextBuildVersion(componentName, currentVersion);
      
      // Set as test
      await this.createSemanticLink(componentName, 'test', testVersion);
      
      console.log(`\n✅ Stage 1 complete: ${currentVersion} (dev) → ${testVersion} (test)`);
      
      // CRITICAL: Only auto-switch for Web4TSComponent's SELF-testing (no context)
      // For other components (with context), the caller controls version switching
      if (componentName === 'Web4TSComponent' && !this.getComponentContext()) {
        console.log(`🔄 Switching to ${testVersion} to run tests...`);
        
        // Use execSync to run npm test in the new version's directory
        // (Can't use .on() because that would trigger recursion safety check)
        const componentPath = this.resolveComponentPath(componentName, testVersion);
        console.log(`🧪 Now running tests on ${testVersion} (test version)...`);
        
        try {
          execSync('npm test', {
            cwd: componentPath,
            stdio: 'inherit',
            encoding: 'utf-8'
          });
        } catch (error) {
          // Tests failed - this is OK, just don't promote
          console.log(`⚠️  Tests failed on ${testVersion} - will retry after fixes`);
        }
      } else {
        console.log(`📊 Next step: Manually switch to ${testVersion} and run tests for Stage 2`);
      }
      
    } catch (error) {
      console.error(`❌ Stage 1 failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Handle first test run: promote dev to test (Stage 1)
   * Workflow Stage 1: dev → test (nextBuild)
   * E.g., 0.3.4.1 (dev) → 0.3.4.2 (test)
   * @cliHide
   * @deprecated Use determinePromotionStage instead
   */
  private async handleFirstTestRun(componentName: string, currentVersion: string): Promise<void> {
    console.log(`\n🧪 First test run detected for ${componentName} ${currentVersion}`);
    console.log(`📋 Workflow Stage 1: dev → test (nextBuild)`);
    
    // Check if this version is already test
    const semanticLinks = await this.getSemanticLinks(componentName);
    if (semanticLinks.test === currentVersion) {
      console.log(`⚠️  Version ${currentVersion} is already marked as test - skipping Stage 1`);
      return;
    }
    
    try {
      // Create nextBuild version (increment build number)
      console.log(`\n🔧 Creating nextBuild version from ${currentVersion}...`);
      const nextBuildVersion = await this.createNextBuildVersion(componentName, currentVersion);
      
      // Set nextBuild as test
      console.log(`\n🧪 Setting ${nextBuildVersion} as test version...`);
      await this.createSemanticLink(componentName, 'test', nextBuildVersion);
      
      console.log(`\n✅ Stage 1 complete: ${currentVersion} (dev) → ${nextBuildVersion} (test)`);
      console.log(`📊 Next step: Work on ${nextBuildVersion} until 100% test coverage`);
      
    } catch (error) {
      console.error(`❌ Stage 1 promotion failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Handle 100% test success: promote test to prod (Stage 2)
   * Workflow Stage 2: test → prod (nextPatch) + new dev (nextBuild)
   * E.g., 0.3.4.2 (test) → 0.3.5.0 (prod) + 0.3.5.1 (dev)
   * @cliHide
   */
  async handleTestSuccessPromotion(componentName: string, currentVersion: string): Promise<void> {
    console.log(`\n🎯 Analyzing test success for version promotion...`);
    
    // Safety check: verify this version is currently 'test'
    const semanticLinks = await this.getSemanticLinks(componentName);
    const currentTest = semanticLinks.test;
    
    if (currentTest !== currentVersion) {
      console.log(`⚠️  Skipping Stage 2: Current version (${currentVersion}) is not the test version`);
      console.log(`💡 Current test version is: ${currentTest || 'none'}`);
      console.log(`💡 Only the test version can be promoted to prod`);
      return;
    }
    
    // Safety check: verify this version hasn't already been promoted
    const currentProd = semanticLinks.prod;
    if (currentProd === currentVersion) {
      console.log(`⚠️  Version ${currentVersion} is already marked as prod - skipping promotion`);
      console.log(`💡 This prevents accidental double promotion`);
      return;
    }
    
    // Check if test result indicates 100% success
    const testSuccess = await this.verifyTestSuccess(componentName, currentVersion);
    if (!testSuccess) {
      console.log(`⚠️  Test success verification failed - skipping promotion`);
      return;
    }
    
    console.log(`🚀 100% test success confirmed! Starting Stage 2 promotion workflow...`);
    console.log(`📋 Workflow Stage 2: test → prod (nextPatch) + new dev (nextBuild)`);
    
    try {
      // Step 1: Create nextPatch version from current (test becomes prod)
      console.log(`\n🔧 Step 1: Creating nextPatch version from ${currentVersion}...`);
      const nextPatchVersion = await this.createNextPatchVersion(componentName, currentVersion);
      
      // Step 2: Set nextPatch as new prod
      console.log(`\n🚀 Step 2: Promoting ${nextPatchVersion} to prod...`);
      await this.createSemanticLink(componentName, 'prod', nextPatchVersion);
      console.log(`✅ Prod updated: prod → ${nextPatchVersion}`);
      
      // Step 3: Update latest to nextPatch (the new stable)
      console.log(`\n📦 Step 3: Updating latest to stable version...`);
      await this.createSemanticLink(componentName, 'latest', nextPatchVersion);
      console.log(`✅ Latest updated: latest → ${nextPatchVersion}`);
      
      // Step 4: Create nextBuild version for new development cycle
      console.log(`\n🔧 Step 4: Creating nextBuild version for development...`);
      const nextBuildVersion = await this.createNextBuildVersion(componentName, nextPatchVersion);
      
      // Step 5: Set nextBuild as new dev and test
      console.log(`\n🚧 Step 5: Setting up development workflow...`);
      await this.createSemanticLink(componentName, 'dev', nextBuildVersion);
      await this.createSemanticLink(componentName, 'test', nextBuildVersion);
      console.log(`✅ Dev updated: dev → ${nextBuildVersion}`);
      console.log(`✅ Test updated: test → ${nextBuildVersion}`);
      
      console.log(`\n🎉 Stage 2 promotion workflow completed successfully!`);
      console.log(`📊 Final state:`);
      console.log(`   🚀 prod:   ${nextPatchVersion} (promoted from ${currentVersion})`);
      console.log(`   📦 latest: ${nextPatchVersion} (stable release)`);
      console.log(`   🧪 test:   ${nextBuildVersion} (ready for next cycle)`);
      console.log(`   🚧 dev:    ${nextBuildVersion} (active development)`);
      
    } catch (error) {
      console.error(`❌ Stage 2 promotion failed: ${(error as Error).message}`);
      console.log(`💡 Manual intervention may be required`);
    }
  }

  /**
   * Verify that tests achieved 100% success
   * @cliHide
   */
  async verifyTestSuccess(componentName: string, version: string): Promise<boolean> {
    // Read test results from vitest JSON output
    // Use component's directory, not process.cwd() (which may be different in test environments)
    const componentsDir = path.join(this.model.targetDirectory || process.cwd(), 'components');
    const componentVersionDir = path.join(componentsDir, componentName, version);
    const testResultsPath = path.join(componentVersionDir, 'test/test-results.json');
    
    if (!existsSync(testResultsPath)) {
      console.log(`⚠️  No test results file found at ${testResultsPath}`);
      console.log(`💡 Cannot verify 100% success - skipping promotion`);
      return false;
    }
    
    try {
      const resultsContent = await fs.readFile(testResultsPath, 'utf-8');
      const results = JSON.parse(resultsContent);
      
      // Check vitest results structure
      const totalTests = results.numTotalTests || 0;
      const passedTests = results.numPassedTests || 0;
      const failedTests = results.numFailedTests || 0;
      
      console.log(`📊 Test Results:`);
      console.log(`   Total:  ${totalTests}`);
      console.log(`   Passed: ${passedTests}`);
      console.log(`   Failed: ${failedTests}`);
      
      const success = failedTests === 0 && passedTests === totalTests && totalTests > 0;
      
      if (success) {
        console.log(`✅ 100% test success verified!`);
      } else {
        console.log(`⚠️  Tests did not achieve 100% success`);
        console.log(`💡 Fix failing tests before promotion`);
      }
      
      return success;
    } catch (error) {
      console.error(`❌ Error reading test results: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Compare two semantic versions FOR HIERARCHY CHECK ONLY
   * Returns: -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
   * @cliHide
   */
  private compareVersionsForHierarchy(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 4; i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    
    return 0; // Equal
  }

  /**
   * Get current version from model (single source of truth)
   * Model is initialized from directory name in constructor
   * @cliHide
   */
  private async getCurrentVersion(): Promise<string> {
    return this.model.version;
  }

  /**
   * Create nextPatch version from current version
   * nextPatch increments patch version and resets build to 0
   * e.g., 0.3.2.0 → 0.3.3.0
   * @cliHide
   */
  private async createNextPatchVersion(componentName: string, currentVersion: string): Promise<string> {
    // Use the existing upgrade method to create nextPatch (increment patch, reset build)
    const originalContext = this.getComponentContext();
    
    // Temporarily set context to current version
    await this.on(componentName, currentVersion);
    
    try {
      await this.upgrade('nextPatch'); // Use nextPatch to increment patch version
      
      // Calculate what the nextPatch version would be (increment patch, reset build)
      // This should match what upgrade('nextPatch') actually created
      const parts = currentVersion.split('.').map(Number);
      const nextPatchVersion = `${parts[0]}.${parts[1]}.${parts[2] + 1}.0`; // Increment patch, reset build to 0
      
      console.log(`✅ Created nextPatch version: ${nextPatchVersion}`);
      return nextPatchVersion;
      
    } finally {
      // Restore original context
      if (originalContext) {
        await this.on(originalContext.component, originalContext.version);
      }
    }
  }

  /**
   * Create nextBuild version from base version
   * @cliHide
   */
  private async createNextBuildVersion(componentName: string, baseVersion: string): Promise<string> {
    // Use the existing upgrade method to create nextBuild
    const originalContext = this.getComponentContext();
    
    // Temporarily set context to base version
    await this.on(componentName, baseVersion);
    
    try {
      await this.upgrade('nextBuild');
      
      // Calculate what the nextBuild version would be
      const parts = baseVersion.split('.').map(Number);
      const nextBuildVersion = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3] + 1}`;
      
      console.log(`✅ Created nextBuild version: ${nextBuildVersion}`);
      return nextBuildVersion;
      
    } finally {
      // Restore original context
      if (originalContext) {
        await this.on(originalContext.component, originalContext.version);
      }
    }
  }

  /**
   * Create nextMinor version from current version (for major releases)
   * nextMinor increments minor version and resets patch and build to 0
   * e.g., 0.3.4.2 → 0.4.0.0
   * @cliHide
   */
  private async createNextMinorVersion(componentName: string, currentVersion: string): Promise<string> {
    const originalContext = this.getComponentContext();
    
    // Temporarily set context to current version
    await this.on(componentName, currentVersion);
    
    try {
      await this.upgrade('nextMinor'); // Increment minor, reset patch and build
      
      // Calculate what the nextMinor version would be
      const parts = currentVersion.split('.').map(Number);
      const nextMinorVersion = `${parts[0]}.${parts[1] + 1}.0.0`; // Increment minor, reset others
      
      console.log(`✅ Created nextMinor version: ${nextMinorVersion}`);
      return nextMinorVersion;
      
    } finally {
      // Restore original context
      if (originalContext) {
        await this.on(originalContext.component, originalContext.version);
      }
    }
  }

  /**
   * Execute start command in loaded component context
   * Build and run the loaded component using its build system
   * @cliSyntax
   * @cliExample web4tscomponent on Unit 0.3.0.5 start
   */
  async start(): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }

    const componentPath = this.resolveComponentPath(context.component, context.version);
    
    console.log(`🚀 Starting ${context.component} ${context.version}...`);
    
    try {
      execSync('npm start', { 
        cwd: componentPath, 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      console.log(`✅ Started ${context.component} ${context.version}`);
    } catch (error) {
      console.error(`❌ Failed to start ${context.component} ${context.version}`);
      throw error;
    }

    return this;
  }

  /**
   * Execute build command - builds own component if no context, or target component if context loaded
   * When no context: Build Web4TSComponent itself using its build system
   * When context loaded: Build the loaded component using its build system
   * @cliSyntax
   * @cliExample web4tscomponent build
   * @cliExample web4tscomponent on Unit 0.3.0.5 build
   */
  async build(): Promise<this> {
    const context = this.getComponentContext();
    
    if (!context) {
      // No context - build Web4TSComponent itself
      console.log(`🔨 Building Web4TSComponent itself...`);
      
      try {
        execSync('npm run build', { 
          cwd: process.cwd(), // Current Web4TSComponent directory
          stdio: 'inherit',
          encoding: 'utf-8'
        });
        console.log(`✅ Web4TSComponent build completed successfully`);
      } catch (error) {
        console.error(`❌ Web4TSComponent build failed`);
        throw error;
      }
      
      return this;
    }

    // Context loaded - build the target component
    const componentPath = this.resolveComponentPath(context.component, context.version);
    
    console.log(`🔨 Building ${context.component} ${context.version}...`);
    
    try {
      execSync('npm run build', { 
        cwd: componentPath, 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      console.log(`✅ Build completed for ${context.component} ${context.version}`);
    } catch (error) {
      console.error(`❌ Build failed for ${context.component} ${context.version}`);
      throw error;
    }

    return this;
  }

  /**
   * Execute selective test command (called internally from test())
   * Run specific test files, describe blocks, or it cases using vitest
   * Supports numeric references with tab completion for fast test selection
   * 
   * @param scope - Type of test selection: 'file' | 'describe' | 'itCase'
   * @param references - Numeric references (1-based) for selecting tests
   * @cliHide
   */
  private async testSelective(scope: string, references: string[]): Promise<this> {
    // Import TestFileParser dynamically
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    
    const context = this.getComponentContext();
    
    // Determine test directory path
    const testDir = context
      ? path.join(this.resolveComponentPath(context.component, context.version), 'test')
      : path.join(process.cwd(), 'test');
    
    if (!existsSync(testDir)) {
      console.error(`❌ Test directory not found: ${testDir}`);
      throw new Error(`Test directory not found`);
    }
    
    // Scan available test files
    const testFiles = TestFileParser.scanTestFiles(testDir);
    
    if (testFiles.length === 0) {
      console.error(`❌ No test files found in: ${testDir}`);
      throw new Error(`No test files found`);
    }
    
    // Route based on scope
    switch (scope) {
      case 'file':
        await this.testFile(testFiles, testDir, references);
        break;
        
      case 'describe':
        await this.testDescribe(testFiles, testDir, references);
        break;
        
      case 'itCase':
        await this.testItCase(testFiles, testDir, references);
        break;
        
      default:
        console.error(`❌ Invalid scope: ${scope}`);
        console.log(`💡 Valid scopes: file, describe, itCase`);
        throw new Error(`Invalid test scope: ${scope}`);
    }
    
    return this;
  }

  /**
   * Execute test for specific file (by numeric reference)
   * @cliHide
   */
  private async testFile(
    testFiles: any[],
    testDir: string,
    references: string[]
  ): Promise<void> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    
    if (references.length === 0) {
      // No reference provided - list all files
      console.log(`\n📁 Available test files:`);
      const formatted = TestFileParser.formatFilesForCompletion(testFiles);
      formatted.forEach(f => console.log(`   ${f}`));
      console.log(`\n💡 Usage: web4tscomponent test file <number>`);
      return;
    }
    
    // Get file by number
    const fileNum = parseInt(references[0], 10);
    const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);
    
    if (!targetFile) {
      console.error(`❌ Invalid file number: ${fileNum}`);
      console.log(`💡 Valid range: 1-${testFiles.length}`);
      throw new Error(`Invalid file number`);
    }
    
    console.log(`🧪 Running tests from: ${targetFile.name}`);
    
    // Execute vitest on specific file
    const context = this.getComponentContext();
    const cwd = context
      ? this.resolveComponentPath(context.component, context.version)
      : process.cwd();
    
    try {
      execSync(`npx vitest --run ${path.join('test', targetFile.name)}`, {
        cwd,
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    } catch (error) {
      // Vitest will have already shown the error output
      throw error;
    }
  }

  /**
   * Execute test for specific describe block (by numeric references)
   * @cliHide
   */
  private async testDescribe(
    testFiles: any[],
    testDir: string,
    references: string[]
  ): Promise<void> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    
    if (references.length === 0) {
      // No reference - show hierarchical list
      const result = TestFileParser.getAllDescribesHierarchical(testDir);
      console.log(`\n📋 Available describe blocks:\n`);
      console.log(result.display.join('\n'));
      console.log(`\n💡 Usage: web4tscomponent test describe <reference>`);
      console.log(`   Example: web4tscomponent test describe 17a`);
      return;
    }
    
    // Extract token from completion string (e.g., "17a)     ..." → "17a")
    let ref = references[0];
    // Remove ANSI codes first
    ref = ref.replace(/\x1b\[\d+m/g, '');
    const tokenMatch = ref.match(/^([0-9]+[a-z])/);
    if (tokenMatch) {
      ref = tokenMatch[1];
    }
    
    // Parse compound reference (e.g., "17a")
    const result = TestFileParser.getDescribeByReference(testDir, ref);
    
    if (!result) {
      console.error(`❌ Invalid reference: ${ref}`);
      console.log(`💡 Use format: <fileNum><letter> (e.g., 5a, 17b)`);
      console.log(`   Run 'web4tscomponent test describe' to see available options`);
      throw new Error(`Invalid describe reference`);
    }
    
    const { file, describe } = result;
    
    console.log(`🧪 Running tests for describe: "${describe.name}"`);
    console.log(`   File: ${file.name}`);
    console.log(`   Reference: ${ref}`);
    
    // Execute vitest with test name pattern
    const context = this.getComponentContext();
    const cwd = context
      ? this.resolveComponentPath(context.component, context.version)
      : process.cwd();
    
    try {
      execSync(`npx vitest --run -t "${describe.name}"`, {
        cwd,
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      console.log(`✅ Test completed for: ${ref}`);
    } catch (error) {
      console.error(`❌ Test failed for: ${ref}`);
      throw error;
    }
  }

  /**
   * Execute test for specific it case (by hierarchical token like "5a1")
   * @cliHide
   */
  private async testItCase(
    testFiles: any[],
    testDir: string,
    references: string[]
  ): Promise<void> {
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    
    if (references.length === 0) {
      console.error(`❌ Missing it case reference`);
      console.log(`💡 Usage: web4tscomponent test itCase <token> (e.g., 5a1)`);
      throw new Error(`Missing references`);
    }
    
    // Parse hierarchical token (e.g., "5a1" -> file=5, describe=a, itCase=1)
    const token = references[0];
    const match = token.match(/^(\d+)([a-z])(\d+)$/);
    
    if (!match) {
      console.error(`❌ Invalid it case token: ${token}`);
      console.log(`💡 Expected format: <fileNum><describeLetter><itNum> (e.g., 5a1)`);
      throw new Error(`Invalid token format`);
    }
    
    const fileNum = parseInt(match[1], 10);
    const describeLetter = match[2];
    const itNum = parseInt(match[3], 10);
    
    // Convert letter to describe index (a=0, b=1, etc.)
    const describeIndex = describeLetter.charCodeAt(0) - 'a'.charCodeAt(0);
    
    // Get file by number
    const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);
    
    if (!targetFile) {
      console.error(`❌ Invalid file number: ${fileNum}`);
      console.log(`💡 Valid range: 1-${testFiles.length}`);
      throw new Error(`Invalid file number`);
    }
    
    // Parse describe blocks
    const describes = TestFileParser.parseDescribeBlocks(targetFile.absolutePath);
    const targetDescribe = TestFileParser.getDescribeByNumber(describes, describeIndex + 1);
    
    if (!targetDescribe) {
      console.error(`❌ Invalid describe letter: ${describeLetter}`);
      console.log(`💡 Valid range: a-${String.fromCharCode('a'.charCodeAt(0) + describes.length - 1)}`);
      throw new Error(`Invalid describe letter`);
    }
    
    // Parse it cases for the specific describe block
    const itCases = TestFileParser.parseItCases(targetFile.absolutePath, describeIndex);
    const targetIt = TestFileParser.getItCaseByNumber(itCases, itNum);
    
    if (!targetIt) {
      console.error(`❌ Invalid it case number: ${itNum}`);
      console.log(`💡 Valid range: 1-${itCases.length}`);
      throw new Error(`Invalid it case number`);
    }
    
    console.log(`🧪 Running test case: "${targetIt.name}"`);
    console.log(`   Describe: ${targetDescribe.name}`);
    console.log(`   File: ${targetFile.name}`);
    
    // Execute vitest with test name pattern
    const context = this.getComponentContext();
    const cwd = context
      ? this.resolveComponentPath(context.component, context.version)
      : process.cwd();
    
    try {
      execSync(`npx vitest --run -t "${targetIt.name}"`, {
        cwd,
        stdio: 'inherit',
        encoding: 'utf-8'
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Execute clean command
   * WITHOUT context: Clean Web4TSComponent itself (self-operation)
   * WITH context: Clean the loaded component
   * @cliSyntax
   * @cliExample web4tscomponent clean
   * @cliExample web4tscomponent on Unit 0.3.0.5 clean
   */
  async clean(): Promise<this> {
    const context = this.getComponentContext();
    
    if (!context) {
      // No context - clean Web4TSComponent itself
      console.log(`🧹 Cleaning Web4TSComponent itself...`);
      
      try {
        execSync('npm run clean', { 
          cwd: process.cwd(), // Current Web4TSComponent directory
          stdio: 'inherit',
          encoding: 'utf-8'
        });
        console.log(`✅ Cleaned Web4TSComponent`);
      } catch (error) {
        console.error(`❌ Clean failed for Web4TSComponent`);
        throw error;
      }
      
      return this;
    }

    // WITH context - clean target component
    const componentPath = this.resolveComponentPath(context.component, context.version);
    
    console.log(`🧹 Cleaning ${context.component} ${context.version}...`);
    
    try {
      execSync('npm run clean', { 
        cwd: componentPath, 
        stdio: 'inherit',
        encoding: 'utf-8'
      });
      console.log(`✅ Cleaned ${context.component} ${context.version}`);
    } catch (error) {
      console.error(`❌ Clean failed for ${context.component} ${context.version}`);
      throw error;
    }

    return this;
  }

  /**
   * Remove a specific version of a component
   * Removes the version directory and updates symlinks accordingly
   * @param componentName Component name to remove version from (uses context if not provided)
   * @param version Version to remove (uses context version if not provided)
   * @cliSyntax componentName version
   * @cliDefault componentName current
   * @cliDefault version current
   * @cliExample web4tscomponent removeVersion Unit 0.2.0.0
   * @cliExample web4tscomponent on Unit 0.2.0.0 removeVersion
   */
  async removeVersion(componentName: string = 'current', version: string = 'current'): Promise<this> {
    let targetComponent: string;
    let targetVersion: string;

    // Only check context if either parameter is 'current'
    if (componentName === 'current' || version === 'current') {
      const context = this.getComponentContext();
      if (!context) {
        throw new Error('No component context loaded and no component/version specified. Use "on <component> <version>" first or provide component and version.');
      }
      targetComponent = componentName === 'current' ? context.component : componentName;
      targetVersion = version === 'current' ? context.version : version;
    } else {
      // Both parameters explicitly provided
      targetComponent = componentName;
      targetVersion = version;
    }

    const componentDir = this.resolveComponentDirectory(targetComponent);
    const versionDir = path.join(componentDir, targetVersion);

    if (!existsSync(versionDir)) {
      throw new Error(`Version ${targetVersion} of ${targetComponent} does not exist at ${versionDir}`);
    }

    console.log(`🗑️ Removing ${targetComponent} ${targetVersion}...`);
    console.log(`   Directory: ${versionDir}`);

    // Remove the version directory
    await fs.rm(versionDir, { recursive: true, force: true });
    console.log(`✅ Removed ${targetComponent} ${targetVersion}`);

    // Clean up semantic symlinks pointing to removed version
    // ONLY repoint 'latest' automatically - other links should be managed explicitly
    const semanticLinks = ['latest', 'dev', 'test', 'prod'];
    const versions = this.getAvailableVersions(componentDir);
    const highestVersion = versions.length > 0 ? this.getHighestVersion(versions) : null;
    
    for (const linkName of semanticLinks) {
      const symlinkPath = path.join(componentDir, linkName);
      
      // Check if symlink exists using lstat (doesn't follow symlinks, works with broken links)
      try {
        const stats = lstatSync(symlinkPath);
        if (stats.isSymbolicLink()) {
          const linkTarget = await fs.readlink(symlinkPath);
          if (linkTarget === targetVersion) {
            await fs.unlink(symlinkPath);
            
            // Only auto-repoint 'latest' to highest remaining version
            // Other semantic links (dev/test/prod) should be managed explicitly via their set methods
            if (linkName === 'latest' && highestVersion) {
              await fs.symlink(highestVersion, symlinkPath);
              console.log(`🔗 Updated ${linkName}: ${targetVersion} → ${highestVersion}`);
            } else {
              console.log(`🔗 Removed ${linkName} symlink (pointed to removed version ${targetVersion})`);
              console.log(`💡 Use set${linkName.charAt(0).toUpperCase() + linkName.slice(1)}() to reassign if needed`);
            }
          }
        }
      } catch {
        // Symlink doesn't exist or can't be read - skip
      }
    }

    // Remove version-specific script symlinks
    await this.cleanupVersionScriptSymlinks(targetComponent, targetVersion);

    return this;
  }

  /**
   * Remove an entire component and all its versions
   * Removes the complete component directory and all associated symlinks
   * @param componentName Component name to remove completely (uses context if not provided)
   * @cliSyntax componentName
   * @cliDefault componentName current
   * @cliExample web4tscomponent removeComponent TestComponent
   * @cliExample web4tscomponent on TestComponent 1.0.0.0 removeComponent
   */
  async removeComponent(componentName: string = 'current'): Promise<this> {
    let targetComponent: string;

    if (componentName === 'current') {
      const context = this.getComponentContext();
      if (!context) {
        throw new Error('No component context loaded and no component specified. Use "on <component> <version>" first or provide component name.');
      }
      targetComponent = context.component;
    } else {
      targetComponent = componentName;
    }

    const componentDir = this.resolveComponentDirectory(targetComponent);

    if (!existsSync(componentDir)) {
      throw new Error(`Component ${targetComponent} does not exist at ${componentDir}`);
    }

    console.log(`🗑️ Removing entire component: ${targetComponent}...`);
    console.log(`   Directory: ${componentDir}`);

    // Get all versions before removal for cleanup
    const versions = this.getAvailableVersions(componentDir);
    
    // Remove the entire component directory
    await fs.rm(componentDir, { recursive: true, force: true });
    console.log(`✅ Removed component ${targetComponent} and all versions`);

    // Clean up all script symlinks for this component
    await this.cleanupAllComponentScriptSymlinks(targetComponent, versions);

    // Clear context if we just removed the loaded component
    const context = this.getComponentContext();
    if (context && context.component === targetComponent) {
      (this.model as any).contextComponent = null;
      (this.model as any).contextVersion = null;
      console.log(`🔧 Cleared component context`);
    }

    return this;
  }

  /**
   * Test zero config discovery functionality (development/testing only)
   * Verifies that CLI auto-discovery is working correctly
   * 
   * @param message Test message to display (default: 'Zero config discovery works!')
   * @cliSyntax message
   * @cliDefault message Zero config discovery works!
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
   * 
   * @param components Comma-separated list of "ComponentName Version" pairs
   * 
   * @example
   * // Compare multiple components
   * await component.compare('Unit 0.3.0.5, Web4TSComponent 0.3.2.0, ONCE 0.2.0.0');
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
    
    // Generate comparison content for file
    const comparisonContent = await this.generateComparisonMarkdown(componentSpecs, analyses, components);
    
    // Save to first component's version directory
    const firstSpec = componentSpecs[0];
    const firstComponentDir = this.resolveComponentDirectory(firstSpec.name);
    const firstVersionDir = path.join(firstComponentDir, firstSpec.version);
    const filename = this.generateSafeFilename(componentSpecs);
    const outputPath = path.join(firstVersionDir, filename);
    
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
   * Converts "CompA 1.0.0.0, CompB 2.0.0.0" to array of {name, version} objects
   * @param components Comma-separated component specifications
   * @returns Array of parsed component specifications
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
   * Generate safe filename from component specifications
   * Creates filesystem-safe filename for comparison markdown file
   * @param componentSpecs Array of component specifications to include in filename
   * @returns Safe filename with timestamp and component names
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
   * Generate complete markdown content for comparison report
   * Creates formatted markdown with tables and analysis
   * @param componentSpecs Array of components being compared
   * @param analyses Array of analysis results for each component
   * @param originalComponents Original input string for documentation
   * @returns Complete markdown content for comparison report
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
   * Creates package and configuration comparison table
   * @param componentSpecs Array of components being compared
   * @param analyses Array of analysis results for each component
   * @returns Array of markdown table lines
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
   * Creates file structure comparison table showing presence across components
   * @param componentSpecs Array of components being compared
   * @param analyses Array of analysis results for each component
   * @returns Array of markdown table lines
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
        const isPresent = analysis.files.has(entry) || analysis.directories.has(entry.endsWith('/') ? entry.slice(0, -1) : entry);
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
   * Generate dual link for file entry (local path only, relative to version folder)
   * @param entry File or directory entry name
   * @param componentSpecs Array of components being compared (unused, for interface consistency)
   * @param analyses Array of analysis results (unused, for interface consistency)
   * @returns Entry name as local relative path
   * @cliHide
   */
  private generateDualLinkForEntry(entry: string, componentSpecs: Array<{name: string, version: string}>, analyses: any[]): string {
    // Simply return the entry as a local relative path
    return entry;
  }

  /**
   * Analyze components for comparison
   * Loads and analyzes each component's structure, package.json, and files
   * @param componentSpecs Array of component specifications to analyze
   * @returns Array of analysis results for each component
   * @cliHide
   */
  private async analyzeComponentsForComparison(componentSpecs: Array<{name: string, version: string}>): Promise<any[]> {
    const analyses = [];
    
    for (const spec of componentSpecs) {
      const componentPath = path.join(this.model.targetDirectory, 'components', spec.name, spec.version);
      
      if (!existsSync(componentPath)) {
        throw new Error(`Component not found: ${spec.name} ${spec.version} at ${componentPath}`);
      }
      
      const analysis = await this.analyzeComponentStructure(componentPath, spec.name, spec.version);
      analyses.push(analysis);
    }
    
    return analyses;
  }

  /**
   * Analyze component structure for comparison
   * Reads package.json and recursively scans file structure
   * @param componentPath Absolute path to component version directory
   * @param name Component name
   * @param version Component version
   * @returns Analysis object with files, directories, dependencies, etc.
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
   * Scans directory and adds files/directories to analysis object
   * @param dirPath Absolute path to directory to analyze
   * @param analysis Analysis object to populate with files and directories
   * @param relativePath Current relative path from component root (for recursion)
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
   * Generate differences table in exact format (console output)
   * Displays package and configuration comparison table
   * @param componentSpecs Array of components being compared
   * @param analyses Array of analysis results for each component
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
   * Generate file comparison table in exact format (console output)
   * Displays file structure comparison table
   * @param componentSpecs Array of components being compared
   * @param analyses Array of analysis results for each component
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
        const isPresent = analysis.files.has(entry) || analysis.directories.has(entry.endsWith('/') ? entry.slice(0, -1) : entry);
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
          // Use the actual component path from analysis
          const filePath = path.join(analysis.path, file);
          
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
   * - Folders: Identical if they exist in 2+ components (content irrelevant)
   * @cliHide
   */
  private async determineSimilarity(entry: string, componentSpecs: any[], presentCount: number, totalCount: number, presencePattern: string[], analyses: any[]): Promise<string> {
    // Handle directories - identical if present in 2+ components (content doesn't matter)
    if (entry.endsWith('/')) {
      if (presentCount >= 2) {
        return '🟩 Identical';
      } else if (presentCount === 1) {
        const uniqueComponent = presencePattern[0];
        return `🟪 Unique – ${uniqueComponent}`;
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
        // Use the actual component path from analysis
        filePaths.push(path.join(analysis.path, entry));
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
      
      if (analysis.files.has(entry)) {
        // Use the actual component path from analysis
        const filePath = path.join(analysis.path, entry);
        
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
            const thisFilePath = path.join(analysis.path, cliFile);
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
      
      if (analysis.files.has(entry)) {
        // Use the actual component path from analysis
        return path.join(analysis.path, entry);
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
          // Use lstatSync to detect symlinks without following them
          const lstats = lstatSync(itemPath);
          const isSymlink = lstats.isSymbolicLink();
          const isDirectory = isSymlink ? statSync(itemPath).isDirectory() : lstats.isDirectory();
          
          let displayName = item;
          let coloredName = item;
          
          // Apply colors based on item type
          if (isDirectory) {
            displayName += '/';
            coloredName = `${this.colors.cyan}${this.colors.bold}${item}/${this.colors.reset}`;
          } else {
            // Protected files (orange warning - do not modify)
            if (item.endsWith('.interface.ts') ||
                item === 'package.json' ||
                item === 'package-lock.json' ||
                item === 'tsconfig.json' ||
                item === 'vitest.config.ts' ||
                item === '.gitignore' ||
                item === '.npmrc') {
              coloredName = `${this.colors.orange}${item}${this.colors.reset}`;
            }
            // File type specific coloring
            else if (item === 'README.md') {
              coloredName = `${this.colors.green}${this.colors.bold}${item}${this.colors.reset}`;
            } else if (item.endsWith('.test.ts')) {
              coloredName = `${this.colors.magenta}${item}${this.colors.reset}`;
            } else if (item.endsWith('.sh')) {
              coloredName = `${this.colors.blue}${item}${this.colors.reset}`;
            } else if (item.includes('.template') || dirPath.includes('/templates/')) {
              coloredName = `${this.colors.yellow}${item}${this.colors.reset}`;
            }
          }
          
          // Special handling for node_modules symlink - show on one line
          if (item === 'node_modules' && isSymlink) {
            const linkTarget = await fs.readlink(itemPath).catch(() => 'broken');
            displayName += ` → ${linkTarget}`;
            coloredName = `${this.colors.magenta}${item}/ → ${linkTarget}${this.colors.reset}`;
            console.log(prefix + connector + coloredName);
            continue; // Don't recurse into node_modules symlink
          }
          
          // Special handling for dist directory - mark as generated, don't expand
          if (item === 'dist' && isDirectory) {
            displayName += ' [generated]';
            coloredName = `${this.colors.cyan}${this.colors.bold}${item}/${this.colors.reset} ${this.colors.dim}[generated]${this.colors.reset}`;
            console.log(prefix + connector + coloredName);
            continue; // Don't recurse into dist
          }
          
          // Show symlink target for other symlinks
          if (isSymlink) {
            const linkTarget = await fs.readlink(itemPath).catch(() => 'broken');
            displayName += ` → ${linkTarget}`;
            if (isDirectory) {
              coloredName = `${this.colors.magenta}${item}/ → ${linkTarget}${this.colors.reset}`;
            } else {
              coloredName = `${this.colors.magenta}${item} → ${linkTarget}${this.colors.reset}`;
            }
          }
          
          console.log(prefix + connector + coloredName);
          
          // Recurse into directories (but not symlinks, node_modules, or dist)
          if (isDirectory && currentDepth < maxDepth - 1 && !isSymlink) {
            await this.displayTreeStructure(itemPath, nextPrefix, maxDepth, currentDepth + 1, showHidden);
          }
        } catch (error) {
          // Handle permission errors or broken symlinks
          console.log(prefix + connector + item + ` ${this.colors.red}[access denied]${this.colors.reset}`);
        }
      }
    } catch (error) {
      console.log(prefix + `${this.colors.red}[error reading directory]${this.colors.reset}`);
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
  private incrementBuild(version: string): string {
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
  private incrementPatch(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}.0`;
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
    
    // 🚨 CRITICAL: Check if target version already exists
    if (existsSync(targetPath)) {
      console.error(`❌ ERROR: Version ${toVersion} already exists!`);
      console.error(`   Path: ${targetPath}`);
      console.error(`   This would overwrite existing work - ABORTING!`);
      throw new Error(`Version ${toVersion} already exists - refusing to overwrite`);
    }
    
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
      } else if (entry.isSymbolicLink()) {
        // Handle symlinks properly - read the link target and recreate the symlink
        const linkTarget = await fs.readlink(sourcePath);
        try {
          await fs.symlink(linkTarget, targetPath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
            // Target symlink already exists - remove it first, then create new one
            await fs.unlink(targetPath);
            await fs.symlink(linkTarget, targetPath);
          } else {
            throw error;
          }
        }
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  }

  /**
   * Display comprehensive information about Web4 standards and guidelines
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
🚀 Web4TSComponent 0.3.2.0 - Auto-Discovery CLI Architecture

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
    const componentLowerCase = componentName.toLowerCase();
    const scriptPath = path.join(componentDir, componentLowerCase);
    await fs.writeFile(scriptPath, cliScript, { mode: 0o755 });
  }

  /**
   * @cliHide
   */
  private async createSpecStructure(componentDir: string): Promise<void> {
    await fs.mkdir(path.join(componentDir, 'spec'), { recursive: true });
  }

  // DEAD CODE REMOVED (2025-10-08): createVitestConfig() was replaced by createVitestConfigFromTemplate()
  // Old version had hardcoded config without reporters/outputFile for test-results.json
  // New version uses template with proper JSON reporting for promotion verification
  // Proof: grep shows 0 callers for createVitestConfig(), only createVitestConfigFromTemplate() is called at line 248

  /**
   * Create test directory structure with basic test file
   * @cliHide
   */
  private async createTestStructure(componentDir: string): Promise<void> {
    const testDir = path.join(componentDir, 'test');
    await fs.mkdir(testDir, { recursive: true });
    
    // Get component name from the componentDir path (format: components/ComponentName/version)
    const parts = componentDir.split(path.sep);
    const componentName = parts[parts.length - 2]; // Get ComponentName from path
    
    // Create basic test file from template
    const testContent = await this.loadTemplate('test/basic.test.ts.template', {
      'COMPONENT_NAME': componentName,
      'COMPONENT_LOWER': componentName.toLowerCase()
    });
    
    await fs.writeFile(path.join(testDir, `${componentName.toLowerCase()}.test.ts`), testContent);
  }

  /**
   * Verify and fix symlinks for component
   * @cliSyntax 
   */
  async verifyAndFix(): Promise<this> {
    const context = this.getComponentContext();
    const componentName = context?.component || 'Web4TSComponent';
    
    console.log(`🔍 Verifying and fixing symlinks for ${componentName}...`);
    
    // Verify and fix all symlinks
    await this.verifyAndFixSymlinks(componentName);
    
    console.log(`✅ Symlink verification and repair completed for ${componentName}`);
    return this;
  }

  /**
   * Verify and fix all symlinks for component
   * @cliHide
   */
  private async verifyAndFixSymlinks(component: string): Promise<void> {
    console.log(`🔍 Scanning ${component} symlinks...`);
    
    // Get highest version
    const componentDir = this.resolveComponentDirectory(component);
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
    
    // Verify semantic links
    await this.verifySemanticLinks(component, versions);
    
    console.log(`   ✅ Symlink verification completed`);
  }

  /**
   * Verify semantic links (dev, test, prod) are valid
   * @cliHide
   */
  private async verifySemanticLinks(component: string, availableVersions: string[]): Promise<void> {
    const semanticLinks = await this.getSemanticLinks(component);
    const semanticTypes = ['dev', 'test', 'prod'] as const; // Don't check 'latest' as it's handled separately
    
    for (const linkType of semanticTypes) {
      const target = semanticLinks[linkType];
      
      if (target) {
        if (availableVersions.includes(target)) {
          console.log(`   ✅ ${linkType} link valid: ${linkType} → ${target}`);
        } else {
          console.log(`   ❌ ${linkType} link broken: ${linkType} → ${target} (version not found)`);
          // Remove broken semantic link
          try {
            const componentDir = this.resolveComponentDirectory(component);
            const linkPath = path.join(componentDir, linkType);
            await fs.unlink(linkPath);
            console.log(`   🔧 Removed broken ${linkType} link`);
          } catch (error) {
            console.log(`   ❌ Could not remove broken ${linkType} link: ${(error as Error).message}`);
          }
        }
      } else {
        console.log(`   ⚪ ${linkType} link not set`);
      }
    }
  }

  /**
   * Verify latest symlink points to highest version
   * @cliHide
   */
  private async verifyLatestSymlink(component: string, highestVersion: string): Promise<void> {
    const componentDir = this.resolveComponentDirectory(component);
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
    const projectRoot = this.resolveProjectRoot();
    const scriptsDir = path.join(projectRoot, 'scripts');
    const versionsDir = path.join(scriptsDir, 'versions');
    const componentLower = component.toLowerCase();
    
    // Ensure scripts and versions directories exist (FIX, don't just report errors!)
    try {
      await fs.mkdir(scriptsDir, { recursive: true });
      await fs.mkdir(versionsDir, { recursive: true });
      console.log(`   🔧 Ensured directory structure: scripts/versions/`);
    } catch (error) {
      console.log(`   ❌ Could not create scripts directory structure: ${(error as Error).message}`);
      return; // Can't continue without directories
    }
    
    // Check main script symlink
    const mainScriptPath = path.join(scriptsDir, componentLower);
    const expectedTarget = `../components/${component}/latest/${componentLower}`;
    
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
    
    // Fix old wrong pattern: componentname.sh files in component directories
    // These should be renamed to just componentname (no .sh extension)
    for (const version of versions) {
      const componentDir = this.resolveComponentPath(component, version);
      const wrongShFile = path.join(componentDir, `${componentLower}.sh`);
      const correctFile = path.join(componentDir, componentLower);
      
      if (existsSync(wrongShFile)) {
        try {
          // Check if correct file already exists
          if (existsSync(correctFile)) {
            // If correct file exists and is a symlink, remove it first
            const stats = await fs.lstat(correctFile);
            if (stats.isSymbolicLink()) {
              await fs.unlink(correctFile);
            } else {
              // Correct file exists as regular file, just remove the wrong .sh file
              await fs.unlink(wrongShFile);
              console.log(`   🧹 Removed obsolete ${componentLower}.sh in ${version} (correct file already exists)`);
              continue;
            }
          }
          
          // Rename .sh file to remove extension
          await fs.rename(wrongShFile, correctFile);
          console.log(`   🔧 Fixed CLI script in ${version}: ${componentLower}.sh → ${componentLower}`);
        } catch (error) {
          console.log(`   ⚠️  Could not fix ${componentLower}.sh in ${version}: ${(error as Error).message}`);
        }
      }
    }
    
    // Verify version-specific symlinks exist
    for (const version of versions) {
      await this.verifyVersionScriptSymlink(component, version);
    }
    
    // Clean up broken/orphaned symlinks in scripts/versions
    await this.cleanupOrphanedScriptSymlinks(component, versions);
  }

  /**
   * Clean up broken/orphaned symlinks in scripts and scripts/versions
   * @cliHide
   */
  private async cleanupOrphanedScriptSymlinks(component: string, validVersions: string[]): Promise<void> {
    const projectRoot = this.resolveProjectRoot();
    const scriptsDir = path.join(projectRoot, 'scripts');
    const versionsDir = path.join(scriptsDir, 'versions');
    const componentLower = component.toLowerCase();
    
    // Check scripts/versions directory for orphaned symlinks
    try {
      const entries = await fs.readdir(versionsDir);
      const pattern = new RegExp(`^${componentLower}-v(.+)$`);
      
      for (const entry of entries) {
        const match = entry.match(pattern);
        if (match) {
          const version = match[1];
          const symlinkPath = path.join(versionsDir, entry);
          
          try {
            // Check if symlink target exists
            const target = await fs.readlink(symlinkPath);
            const targetPath = path.resolve(versionsDir, target);
            
            if (!existsSync(targetPath)) {
              // Broken symlink - target doesn't exist
              console.log(`   🧹 Removing broken symlink: ${entry} (target missing)`);
              await fs.unlink(symlinkPath);
            } else if (!validVersions.includes(version)) {
              // Orphaned symlink - version no longer exists
              console.log(`   🧹 Removing orphaned symlink: ${entry} (version ${version} removed)`);
              await fs.unlink(symlinkPath);
            }
          } catch (error) {
            // Not a symlink or can't read it - remove it
            console.log(`   🧹 Removing invalid entry: ${entry}`);
            try {
              await fs.unlink(symlinkPath);
            } catch {
              // Ignore cleanup errors
            }
          }
        }
      }
    } catch (error) {
      console.log(`   ⚠️  Could not scan scripts/versions for cleanup: ${(error as Error).message}`);
    }
    
    // Check main scripts directory for broken component symlink
    try {
      const mainScriptPath = path.join(scriptsDir, componentLower);
      
      try {
        await fs.lstat(mainScriptPath);
        // Symlink exists, check if it's broken
        const target = await fs.readlink(mainScriptPath);
        const targetPath = path.resolve(scriptsDir, target);
        
        if (!existsSync(targetPath)) {
          console.log(`   🧹 Removing broken main script symlink: ${componentLower} (target missing)`);
          await fs.unlink(mainScriptPath);
        }
      } catch {
        // Symlink doesn't exist, that's fine
      }
    } catch (error) {
      console.log(`   ⚠️  Could not check main script symlink: ${(error as Error).message}`);
    }
  }

  /**
   * Verify version-specific script symlink exists and create if missing
   * @param component Component name for symlink verification
   * @param version Component version for symlink creation
   * @cliSyntax component version  
   * @cliDefault component Web4TSComponent
   * @cliDefault version 0.3.2.0
   * @cliHide
   */
  private async verifyVersionScriptSymlink(component: string, version: string): Promise<void> {
    const projectRoot = this.resolveProjectRoot();
    const versionsDir = path.join(projectRoot, 'scripts', 'versions');
    const componentLower = component.toLowerCase();
    const scriptName = `${componentLower}-v${version}`;
    const scriptPath = path.join(versionsDir, scriptName);
    
    // Use lstat to detect symlink presence (even if broken)
    let symlinkExists = false;
    try {
      await fs.lstat(scriptPath);
      symlinkExists = true;
    } catch {
      // Symlink doesn't exist
    }
    
    if (symlinkExists) {
      try {
        // Check if symlink target exists
        const target = await fs.readlink(scriptPath);
        const targetPath = path.resolve(versionsDir, target);
        if (existsSync(targetPath)) {
          console.log(`   ✅ Version script valid: ${scriptName}`);
        } else {
          console.log(`   🔧 Fixing broken version script: ${scriptName} (target doesn't exist)`);
          await this.createVersionScriptSymlink(component, version);
        }
      } catch (error) {
        console.log(`   🔧 Fixing invalid version script: ${scriptName}`);
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
        // Skip semantic symlinks
        if (['latest', 'dev', 'test', 'prod'].includes(entry)) {
          return false;
        }
        
        const entryPath = path.join(componentDir, entry);
        try {
          // Use lstatSync to not follow symlinks, then check if it's a directory
          const stats = lstatSync(entryPath);
          return stats.isDirectory() && entry.match(/^\d+\.\d+\.\d+\.\d+$/) !== null;
        } catch {
          // Skip entries that can't be stat'd (broken symlinks, etc.)
          return false;
        }
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
   * Returns the difference for Array.sort() compatibility
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
   * Test method for README demonstration (development/testing only)
   * Shows auto-discovery CLI parameter handling
   * 
   * @param inputData Data to process  
   * @param outputFormat Format for output (json, xml, csv)
   * @cliSyntax inputData outputFormat
   * @cliDefault outputFormat json
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
    const componentDir = this.resolveComponentDirectory(component);
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
    const projectRoot = this.resolveProjectRoot(); // Respects targetDirectory via model
    const versionsDir = path.join(projectRoot, 'scripts', 'versions');
    
    // Ensure scripts/versions directory exists
    await fs.mkdir(versionsDir, { recursive: true });
    
    const componentLower = component.toLowerCase();
    const scriptName = `${componentLower}-v${version}`;
    const scriptPath = path.join(versionsDir, scriptName);
    
    // Find the CLI script in the component version
    const componentVersionDir = this.resolveComponentPath(component, version);
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
      // Remove existing symlink if it exists (use lstat to detect broken symlinks too)
      try {
        await fs.lstat(scriptPath);
        await fs.unlink(scriptPath);
      } catch {
        // Symlink doesn't exist, that's fine
      }
      
      // Create relative path from scripts/versions to component script
      const relativePath = path.relative(versionsDir, path.join(componentVersionDir, targetScript));
      await fs.symlink(relativePath, scriptPath);
    } catch (error) {
      console.log(`   ❌ Could not create version script symlink: ${(error as Error).message}`);
    }
  }

  /**
   * Update main script symlink in scripts/ to point to latest
   * @cliHide
   */
  private async updateMainScriptSymlink(component: string, version: string): Promise<void> {
    const projectRoot = this.resolveProjectRoot();
    const scriptsDir = path.join(projectRoot, 'scripts');
    const componentLower = component.toLowerCase();
    const mainScriptPath = path.join(scriptsDir, componentLower);
    
    // Target: ../components/ComponentName/latest/componentname
    const componentDir = path.join(projectRoot, 'components', component);
    const targetPath = path.relative(scriptsDir, path.join(componentDir, 'latest', componentLower));
    
    try {
      // Remove existing main script symlink if it exists
      if (existsSync(mainScriptPath)) {
        await fs.unlink(mainScriptPath);
      }
      
      // Create main script symlink pointing to latest
      await fs.symlink(targetPath, mainScriptPath);
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
      definition: ''
      // Note: createdAt/updatedAt removed per Web4 principle - belong in ChangeEvent
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
    // Note: updatedAt removed - belongs in ChangeEvent tracking
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
    // Note: updatedAt removed - belongs in ChangeEvent tracking
    return this;
  }

  /**
   * Show information about current ${componentName} state
   */
  async info(): Promise<this> {
    console.log(\`📋 ${componentName} Information:\`);
    console.log(\`   UUID: \${this.model.uuid}\`);
    console.log(\`   Name: \${this.model.name || 'Not set'}\`);
    // Note: createdAt/updatedAt removed - belong in ChangeEvent tracking
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
  // Note: createdAt/updatedAt removed per Web4 principle - belong in ChangeEvent
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
    
    // Copy TSCompletion.ts
    const tsCompletionSourcePath = path.join(currentDir, '../../../src/ts/layer4/TSCompletion.ts');
    const tsCompletionTargetPath = path.join(componentDir, 'src/ts/layer4/TSCompletion.ts');
    
    try {
      const content = await fs.readFile(tsCompletionSourcePath, 'utf-8');
      await fs.writeFile(tsCompletionTargetPath, content);
    } catch (error) {
      console.log(`   ⚠️ Could not copy TSCompletion.ts: ${(error as Error).message}`);
    }
    
    // Copy TestFileParser.ts (required by DefaultCLI)
    const testFileParserSourcePath = path.join(currentDir, '../../../src/ts/layer4/TestFileParser.ts');
    const testFileParserTargetPath = path.join(componentDir, 'src/ts/layer4/TestFileParser.ts');
    
    try {
      const testFileParserContent = await fs.readFile(testFileParserSourcePath, 'utf-8');
      await fs.writeFile(testFileParserTargetPath, testFileParserContent);
    } catch (error) {
      console.log(`   ⚠️ Could not copy TestFileParser.ts: ${(error as Error).message}`);
    }
    
    // Copy HierarchicalCompletionFilter.ts (required by DefaultCLI for DRY filtering)
    const hierarchicalFilterSourcePath = path.join(currentDir, '../../../src/ts/layer4/HierarchicalCompletionFilter.ts');
    const hierarchicalFilterTargetPath = path.join(componentDir, 'src/ts/layer4/HierarchicalCompletionFilter.ts');
    
    try {
      const hierarchicalFilterContent = await fs.readFile(hierarchicalFilterSourcePath, 'utf-8');
      await fs.writeFile(hierarchicalFilterTargetPath, hierarchicalFilterContent);
    } catch (error) {
      console.log(`   ⚠️ Could not copy HierarchicalCompletionFilter.ts: ${(error as Error).message}`);
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

  // NEW TEMPLATE-BASED METHODS

  /**
   * Create package.json from external template
   * @cliHide
   */
  private async createPackageJsonFromTemplate(componentDir: string, componentName: string, version: string): Promise<void> {
    const packageJsonContent = await this.loadTemplate('config/package.json.template', {
      'COMPONENT_NAME': componentName,
      'COMPONENT_NAME_LOWER': componentName.toLowerCase(),
      'VERSION': version
    });
    
    await fs.writeFile(path.join(componentDir, 'package.json'), packageJsonContent);
  }

  /**
   * Create tsconfig.json from external template
   * @cliHide
   */
  private async createTsConfigFromTemplate(componentDir: string): Promise<void> {
    const tsConfigContent = await this.loadTemplate('config/tsconfig.json.template', {});
    await fs.writeFile(path.join(componentDir, 'tsconfig.json'), tsConfigContent);
  }

  /**
   * Create vitest.config.ts from external template
   * @cliHide
   */
  private async createVitestConfigFromTemplate(componentDir: string): Promise<void> {
    const vitestConfigContent = await this.loadTemplate('config/vitest.config.ts.template', {});
    await fs.writeFile(path.join(componentDir, 'vitest.config.ts'), vitestConfigContent);
  }

  /**
   * Update shell script structure with latest smart build templates
   * 
   * Updates existing component build system to use the latest smart build templates
   * with freshness detection, dependency awareness, and performance optimizations.
   * Must be used after 'on' method to load component context.
   * 
   * @example
   * // Update GitScrumProject build system
   * await component.on('GitScrumProject', '0.2.0.0').updateBuildSystem();
   * 
   * @cliSyntax 
   */
  async updateBuildSystem(): Promise<this> {
    const context = this.getComponentContext();
    if (!context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }
    
    console.log(`🔧 Updating build system for ${context.component} ${context.version}...`);
    
    // Update shell scripts with latest templates
    await this.createShellScriptStructure(context.path, context.component);
    
    console.log(`✅ Build system updated with smart build templates`);
    console.log(`   Location: ${context.path}`);
    console.log(`   Features: Smart builds, dependency awareness, freshness detection`);
    
    return this;
  }

  /**
   * Create shell script structure with executable permissions
   * @cliHide
   */
  private async createShellScriptStructure(componentDir: string, componentName: string): Promise<void> {
    const shDir = path.join(componentDir, 'src/sh');
    await fs.mkdir(shDir, { recursive: true });

    const scripts = [
      'clean.sh',
      'clean-local.sh', 
      'install-deps.sh',
      'build.sh',
      'start.sh',
      'start-clean.sh',
      'test.sh'
    ];

    for (const script of scripts) {
      const scriptContent = await this.loadTemplate(`sh/${script}.template`, {
        'COMPONENT_NAME': componentName,
        'COMPONENT_LOWER': componentName.toLowerCase()
      });
      
      const scriptPath = path.join(shDir, script);
      await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 });
    }
  }

  /**
   * Create component implementation from external template
   * @cliHide
   */
  private async createComponentImplementationFromTemplate(componentDir: string, componentName: string, version: string): Promise<void> {
    const implementationContent = await this.loadTemplate('ts/DefaultComponent.ts.template', {
      'COMPONENT_NAME': componentName,
      'VERSION': version
    });
    
    const implementationPath = path.join(componentDir, 'src/ts/layer2', `Default${componentName}.ts`);
    await fs.writeFile(implementationPath, implementationContent);
  }

  /**
   * Create CLI implementation from external template
   * @cliHide
   */
  private async createCLIImplementationFromTemplate(componentDir: string, componentName: string, version: string): Promise<void> {
    const cliContent = await this.loadTemplate('ts/ComponentCLI.ts.template', {
      'COMPONENT_NAME': componentName,
      'VERSION': version
    });
    
    const cliPath = path.join(componentDir, 'src/ts/layer5', `${componentName}CLI.ts`);
    await fs.writeFile(cliPath, cliContent);
  }

  /**
   * Create component interfaces from external templates
   * @cliHide
   */
  private async createComponentInterfacesFromTemplate(componentDir: string, componentName: string): Promise<void> {
    // Main component interface
    const componentInterfaceContent = await this.loadTemplate('ts/Component.interface.ts.template', {
      'COMPONENT_NAME': componentName
    });
    
    const interfacePath = path.join(componentDir, 'src/ts/layer3', `${componentName}.interface.ts`);
    await fs.writeFile(interfacePath, componentInterfaceContent);

    // Component model interface
    const modelInterfaceContent = await this.loadTemplate('ts/ComponentModel.interface.ts.template', {
      'COMPONENT_NAME': componentName
    });
    
    const modelPath = path.join(componentDir, 'src/ts/layer3', `${componentName}Model.interface.ts`);
    await fs.writeFile(modelPath, modelInterfaceContent);

    // Copy essential interfaces from current component
    await this.copyEssentialInterfaces(componentDir);
  }

  /**
   * Cleanup version-specific script symlinks
   * @cliHide
   */
  private async cleanupVersionScriptSymlinks(componentName: string, version: string): Promise<void> {
    const projectRoot = this.resolveProjectRoot();
    const versionsDir = path.join(projectRoot, 'scripts', 'versions');
    
    if (!existsSync(versionsDir)) {
      return;
    }

    const componentLowerCase = componentName.toLowerCase();
    const versionScriptName = `${componentLowerCase}-v${version}`;
    const versionScriptPath = path.join(versionsDir, versionScriptName);

    // Remove version-specific script symlink (use lstat to detect broken symlinks)
    try {
      lstatSync(versionScriptPath);
      await fs.unlink(versionScriptPath);
      console.log(`🔗 Removed version script symlink: ${versionScriptName}`);
    } catch (error) {
      // Symlink doesn't exist - that's fine
    }

    // Check if main script points to this version, repoint if needed
    const mainScriptPath = path.join(versionsDir, componentLowerCase);
    if (existsSync(mainScriptPath)) {
      try {
        const linkTarget = await fs.readlink(mainScriptPath);
        if (linkTarget.includes(versionScriptName)) {
          // Repoint to highest remaining version
          const componentDir = this.resolveComponentDirectory(componentName);
          const versions = this.getAvailableVersions(componentDir);
          const highestVersion = versions.length > 0 ? this.getHighestVersion(versions) : null;
          
          await fs.unlink(mainScriptPath);
          
          if (highestVersion) {
            const newTarget = `${componentLowerCase}-v${highestVersion}`;
            await fs.symlink(newTarget, mainScriptPath);
            console.log(`🔗 Repointed main script: ${componentLowerCase} → ${newTarget}`);
          } else {
            console.log(`🔗 Removed main script symlink (no versions remaining): ${componentLowerCase}`);
          }
        }
      } catch {
        // Silent fail for broken symlinks or permission errors
      }
    }
  }

  /**
   * Cleanup all script symlinks for a component
   * @cliHide
   */
  private async cleanupAllComponentScriptSymlinks(componentName: string, versions: string[]): Promise<void> {
    const projectRoot = this.resolveProjectRoot();
    const scriptsDir = path.join(projectRoot, 'scripts');
    const versionsDir = path.join(scriptsDir, 'versions');
    
    if (!existsSync(versionsDir)) {
      return;
    }

    const componentLowerCase = componentName.toLowerCase();

    // Remove all version-specific symlinks
    for (const version of versions) {
      const versionScriptName = `${componentLowerCase}-v${version}`;
      const versionScriptPath = path.join(versionsDir, versionScriptName);

      try {
        // Use lstatSync to detect broken symlinks (existsSync returns false for broken symlinks)
        lstatSync(versionScriptPath);
        await fs.unlink(versionScriptPath);
        console.log(`🔗 Removed version script symlink: ${versionScriptName}`);
      } catch {
        // Doesn't exist or already removed
      }
    }

    // Remove main script symlink (it's in scripts/, not scripts/versions/)
    const mainScriptPath = path.join(scriptsDir, componentLowerCase);
    try {
      // Use lstatSync to detect broken symlinks (existsSync returns false for broken symlinks)
      lstatSync(mainScriptPath);
      await fs.unlink(mainScriptPath);
      console.log(`🔗 Removed main script symlink: ${componentLowerCase}`);
    } catch {
      // Doesn't exist or already removed
    }
  }

  /**
   * Get current component context from working directory
   * 
   * DRY: Delegates to DefaultCLI.getContext() - single source of truth!
   * Wrapper method for CLI auto-discovery.
   * 
   * Replaces shell detect_component_context() function.
   * TypeScript-first approach: NO environment variables!
   * 
   * Migration: Replaces WEB4_COMPONENT_* ENV vars.
   * See: 2025-10-10-UTC-1002.pdca.md
   * 
   * @param format Output format: 'json' (default) or 'bash'
   * @returns Component context information
   * @cliSyntax format
   * @cliDefault format json
   * @example
   *   web4tscomponent getContext
   *   web4tscomponent getContext bash
   */
  async getContext(format: string = 'json'): Promise<void> {
    // Import DefaultCLI dynamically to access static logic
    const { DefaultCLI } = await import('./DefaultCLI.js');
    const cli = new (class extends DefaultCLI {
      async execute() {} // Required by interface
      showUsage() {} // Required by interface
    })();
    
    // Delegate to DefaultCLI - single source of truth!
    await cli.getContext(format);
  }
}