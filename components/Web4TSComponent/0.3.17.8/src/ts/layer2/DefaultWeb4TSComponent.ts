/**
 * DefaultWeb4TSComponent - Web4 TypeScript Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { Web4TSComponent } from '../layer3/Web4TSComponent.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { Web4TSComponentModel } from '../layer3/Web4TSComponentModel.interface.js';
import { ComponentDependency } from '../layer3/ComponentDependency.interface.js';
import { Colors } from '../layer3/Colors.interface.js';
import { DefaultColors } from '../layer4/DefaultColors.js';
import { SemanticVersion } from './SemanticVersion.js';
import * as fs from 'fs/promises';
import { existsSync, readdirSync, statSync, lstatSync, readlinkSync } from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { User } from '../layer3/User.interface.js';

export class DefaultWeb4TSComponent implements Web4TSComponent {
  public model!: Web4TSComponentModel; // Definite assignment - initialized in init() - public for CLI/external access
  private colors: Colors = DefaultColors.getInstance();
  private user?: User; // Optional User service (lazy initialization)

  /**
   * Empty constructor (Web4 radical OOP pattern)
   * All initialization happens in init()
   * @pdca 2025-10-28-UTC-0934.pdca.md:597 - Phase 1: Init Pattern
   */
  constructor() {
    // Empty - initialization moved to init()
  }


  /**
   * Initialize component with Scenario (Web4 radical OOP pattern)
   * Discovers version from import.meta.url if no scenario provided
   * @pdca 2025-10-28-UTC-0934.pdca.md:627 - Phase 1: Init Pattern
   * @test test/ts/layer2/DefaultWeb4TSComponent.test.ts:initDiscoversVersion
   * @test test/ts/layer2/DefaultWeb4TSComponent.test.ts:initMergesScenario
   * @param scenario Optional scenario containing component model and context
   * @returns this component instance for method chaining
   * @cliHide
   */
  init(scenario?: Scenario<Web4TSComponentModel>): this {
    if (!this.model) {
    // Initialize with version from directory (single source of truth)
    const currentFileUrl = new URL(import.meta.url);
    const currentVersionDir = path.resolve(path.dirname(currentFileUrl.pathname), '..', '..', '..');
    const componentDirName = path.basename(currentVersionDir);
    const isVersionDir = /^\d+\.\d+\.\d+\.\d+$/.test(componentDirName);
    
      // ✅ Discover component's own root ONCE and store in model (OOP!)
      const componentRoot = currentVersionDir;
      
      // ✅ Create version INSTANCE (radical OOP)
      const versionString = isVersionDir ? componentDirName : '0.0.0.0';
      const versionComponent = SemanticVersion.fromString(versionString);
      
    this.model = {
      uuid: randomUUID(),
      name: '',
      origin: '',
      definition: '',
      component: 'Web4TSComponent',
        version: versionComponent,  // ✅ INSTANCE with behavior!
      componentRoot: componentRoot, // ✅ Component's OWN root (for test/ access)
      projectRoot: scenario?.model?.projectRoot || componentRoot, // ✅ Overall project root (from CLI)
      targetDirectory: scenario?.model?.targetDirectory || componentRoot // ✅ Where to CREATE components
      // Note: createdAt/updatedAt removed per Web4 principle - belong in ChangeEvent
      // Note: componentStandards, validationRules, scaffoldingTemplates removed - never used
    };
  }

    if (scenario?.model) {
      // Merge scenario data
      const { version: scenarioVersion, ...otherFields } = scenario.model;
      this.model = { ...this.model, ...otherFields };
      
      // ✅ If scenario has version, reconstruct instance
      if (scenarioVersion) {
        if (scenarioVersion instanceof SemanticVersion) {
          this.model.version = scenarioVersion;
        } else {
          // Reconstruct from VersionModel data
          this.model.version = new SemanticVersion().init({
            ior: { uuid: '', component: 'SemanticVersion', version: '0.0.0.0' },
            owner: '',
            model: scenarioVersion as any
          });
        }
      }
    }
    
    return this;
  }

  /**
   * Lazy initialization of User service for owner data generation
   * NOT a build dependency - warns if unavailable, continues with fallback
   * Pattern: components/User/0.3.0.4/src/ts/layer2/DefaultUser.ts
   * @cliHide
   */
  private async getUser(): Promise<User> {
    if (this.user) return this.user;
    
    try {
      // Dynamic ESM import - fails gracefully if User not available
      // @ts-ignore - Optional dependency, path resolved at runtime
      const userModule = await import('../../User/latest/dist/ts/layer2/DefaultUser.js');
      const { DefaultUser } = userModule;
      
      // Initialize User with empty constructor (uses system/localhost defaults)
      this.user = new DefaultUser();
      
      return this.user!; // Non-null assertion: we just assigned it
    } catch (error) {
      // User service not available - throw for caller to handle fallback
      throw new Error('User service not available');
    }
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
   * @param version Version of component to build (defaults to latest)
   * @cliHide
   */
  async buildDependencies(componentName: string, version?: string): Promise<void> {
    const componentDir = this.resolveComponentDirectory(componentName);
    
    // Determine which version to build
    let targetVersion: string;
    if (version) {
      // Use specified version
      targetVersion = version;
    } else {
      // Find latest version
      const versionDirs = readdirSync(componentDir)
        .filter(name => /^\d+\.\d+\.\d+\.\d+$/.test(name))
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
      
      if (versionDirs.length === 0) {
        console.log(`⚠️  No versions found for ${componentName}, skipping dependency build`);
        return;
      }
      
      targetVersion = versionDirs[0];
    }
    
    const componentVersionDir = path.join(componentDir, targetVersion);
    const packageJsonPath = path.join(componentVersionDir, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      console.log(`⚠️  No package.json in ${componentName}/${targetVersion}, skipping`);
      return;
    }
    
    console.log(`🔧 Building dependency: ${componentName}/${targetVersion}`);
    
    try {
      // Build the dependency
      const buildScript = path.join(componentVersionDir, 'src/sh/build.sh');
      if (existsSync(buildScript)) {
        execSync('./src/sh/build.sh', {
          cwd: componentVersionDir,
          stdio: 'inherit'
        });
        console.log(`✅ Dependency built: ${componentName}/${targetVersion}`);
      } else {
        console.log(`⚠️  No build.sh in ${componentName}/${targetVersion}, skipping`);
      }
    } catch (error) {
      console.error(`❌ Failed to build dependency ${componentName}/${targetVersion}: ${(error as Error).message}`);
      throw new Error(`Dependency build failed: ${componentName}/${targetVersion}`);
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
   * Load template from Web4TSComponent's templates directory
   * This ensures updateBuildSystem always uses the latest Web4TSComponent templates
   * @cliHide
   */
  private async loadWeb4TSComponentTemplate(templatePath: string, substitutions: Record<string, string>): Promise<string> {
    // Always load from Web4TSComponent's templates, not the current component
    const web4tsComponentPath = this.resolveComponentPath('Web4TSComponent', this.model.version.toString());
    const templateFullPath = path.join(web4tsComponentPath, 'templates', templatePath);
    
    if (!existsSync(templateFullPath)) {
      throw new Error(`Web4TSComponent template not found: ${templateFullPath}`);
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
   * Transform component data (Web4 lifecycle method)
   * @param data Optional data to transform
   * @returns this component instance for method chaining
   * @cliHide
   */

  /**
   * Validate component configuration (Web4 lifecycle method)
   * @param object Optional object to validate against component rules
   * @returns this component instance for method chaining
   * @cliHide

  validate(object?: any): this {
    // Validate component configuration
    if (object) {
      // Note: updatedAt removed - belongs in ChangeEvent tracking
    }
    return this;
  }
 */


  /**
   * Convert component to scenario (Web4 pattern)
   * Essential for Web4 compliance and hibernation/restoration
   * Uses User service for proper owner data generation with fallback
   * @pdca 2025-10-28-UTC-2015.user-scenario-antipattern.pdca.md - Use User.toScenario()
   * @cliHide
   */
  async toScenario(name?: string): Promise<Scenario<Web4TSComponentModel>> {
    // ✅ RADICAL OOP: Generate owner data using User.toScenario() (Web4 component interface)
    let ownerData: string;
    try {
      // Try to use User service if available (NOT a build dependency)
      const user = await this.getUser();
      
      // ✅ Use User component's toScenario() - universal Web4 interface
      const userScenario = await user.toScenario();
      
      // ✅ Owner data IS the entire User scenario serialized
      const ownerJson = JSON.stringify(userScenario);
      
      ownerData = Buffer.from(ownerJson).toString('base64');
    } catch (error) {
      // ✅ Fallback: Generate minimal User-like scenario without User service
      const fallbackJson = JSON.stringify({
        ior: {
          uuid: this.model.uuid,
          component: 'User',
          version: '0.0.0.0',
          timestamp: new Date().toISOString()
        },
        owner: '',  // No nested owner in fallback
        model: {
          user: process.env.USER || 'system',
          hostname: process.env.HOSTNAME || 'localhost',
          uuid: this.model.uuid,
          component: this.model.component,
          version: this.model.version.toString()
        }
      });
      ownerData = Buffer.from(fallbackJson).toString('base64');
    }

      return {
      ior: {
        uuid: this.model.uuid,
        component: this.model.component,
        version: this.model.version.toString()  // ✅ Serialize to string
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Set target directory for component operations
   * 
   * ✅ BASELINE COMPLIANCE (2025-10-28-UTC-0934.pdca.md:158):
   * This method ONLY stores the targetDirectory value.
   * It does NOT calculate projectRoot - that's DefaultCLI's responsibility (path authority).
   * 
   * Usage:
   * - Production: CLI calculates and passes project root as targetDirectory
   * - Test isolation: Tests pass test/data path as targetDirectory
   * 
   * @param directory Target directory path (absolute, calculated by caller)
   * @pdca 2025-10-29-UTC-1323.path-separation-violation-fix.pdca.md
   * @cliHide
   */
  setTargetDirectory(directory: string): void {
    // ✅ ONLY store the value - no calculation
    // Sets PROJECT ROOT for this component to operate in (test isolation support)
    this.model.targetDirectory = directory;
    // Note: projectRoot calculation removed - violates path separation baseline
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
      return [this.model.version.toString()];  // ✅ Serialize to string
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
   * Resolve component path using model.targetDirectory (DRY: no duplication)
   * Web4 OOP principle: Always use model.targetDirectory (no test detection needed)
   * Protected: Allow subclasses/CLI to access for delegation patterns
   * @cliHide
   */
  protected resolveComponentPath(componentName: string, version: string): string {
    const componentPath = path.join(this.model.targetDirectory, 'components', componentName, version);
    
    // ✅ RUNTIME DETECTION: Prevent nested components/ directories (test isolation violation)
    // 
    // CRITICAL: If targetDirectory points to a component version directory,
    // we're about to create: components/MyComponent/0.1.0.0/components/...
    // 
    // This happens when:
    // 1. targetDirectory was not provided (VIOLATION!)
    // 2. Tests run from component directory without test isolation
    // 3. CLI not properly setting targetDirectory to project root
    // 
    // @pdca 2025-10-31-UTC-1230.test-isolation-violation-fix.pdca.md
    const targetDirName = path.basename(this.model.targetDirectory);
    const isVersionDir = /^\d+\.\d+\.\d+\.\d+$/.test(targetDirName);
    
    if (isVersionDir) {
      throw new Error(
        `CRITICAL TEST ISOLATION VIOLATION: Attempting to create nested components/ directory!\n` +
        `\n` +
        `Current targetDirectory: ${this.model.targetDirectory}\n` +
        `Would create: ${componentPath}\n` +
        `\n` +
        `This indicates targetDirectory is set to a component version directory\n` +
        `instead of the project root or test/data.\n` +
        `\n` +
        `WEB4 PATH AUTHORITY PRINCIPLE VIOLATION:\n` +
        `  DefaultCLI must calculate and provide correct targetDirectory.\n` +
        `  Component is FORBIDDEN from calculating paths (including cwd access).\n` +
        `\n` +
        `Expected patterns:\n` +
        `  Production: /path/to/project/root\n` +
        `  Tests: /path/to/component/version/test/data\n` +
        `\n` +
        `Current (WRONG): /path/to/components/MyComponent/0.1.0.0\n` +
        `\n` +
        `Fix: Ensure CLI passes correct targetDirectory in init() scenario.`
      );
    }
    
    return componentPath;
  }

  /**
   * Print quick header for fast commands (DRY helper)
   * Shows component name and version immediately without full usage dialog
   * @cliHide
   */
  protected printQuickHeader(): void {
    const target = this.model.context || this;
    const cyan = '\x1b[36m';
    const yellow = '\x1b[33m';
    const dim = '\x1b[2m';
    const reset = '\x1b[0m';
    
    // Show calling component's info
    let header = `${cyan}Web4 ${target.model.component} CLI Tool${reset} v${yellow}${target.model.version.toString()}${reset}`;
    
    // If delegating AND the delegation target is different, show it
    // @pdca 2025-11-03-UTC-1237.pdca.md - Only show delegation when component/version differ
    if (this.model.context) {
      // Get the actual Web4TSComponent version from the file system or package
      // Since we initialized with target's identity, we need to show actual delegation
      // For now, just check if it's actually a different component (not self-delegation)
      const isDifferentComponent = target.model.component !== 'Web4TSComponent';
      if (isDifferentComponent) {
        // Get Web4TSComponent's actual version dynamically
        // Read from latest symlink (projectRoot is Path Authority field in model)
        try {
          const web4tsDir = path.join(this.model.projectRoot, 'components', 'Web4TSComponent');
          const latestSymlink = path.join(web4tsDir, 'latest');
          const web4tsVersion = readlinkSync(latestSymlink);
          header += ` ${dim}(via Web4TSComponent v${web4tsVersion})${reset}`;
        } catch (error) {
          // Fallback: if symlink can't be read, don't show version
          header += ` ${dim}(via Web4TSComponent)${reset}`;
        }
      }
    }
    
    console.log(header + ' - Dynamic Method Discovery with Structured Documentation\n');
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
   * Resolve semantic version link to actual version number
   * DRY helper: Used by on(), setCICDVersion(), upgrade(), and other methods
   * 
   * @param componentName Component to resolve version for
   * @param version Version or semantic link (latest/dev/test/prod/current or actual version)
   * @param contextVersion Optional: current context version for 'current' resolution
   * @returns Actual version number (e.g., "0.3.13.2")
   * @cliHide
   */
  private resolveActualVersion(
    componentName: string,
    version: string,
    contextVersion?: string
  ): string {
    // Handle 'current' keyword
    if (version === 'current') {
      if (!contextVersion) {
        throw new Error('Cannot resolve "current" version without context');
      }
      return contextVersion;
    }
    
    // If already a version number, return as-is
    if (/^\d+\.\d+\.\d+\.\d+$/.test(version)) {
      return version;
    }
    
    // Resolve semantic link (latest/dev/test/prod) to actual version
    const semanticLinks = ['latest', 'dev', 'test', 'prod'];
    if (semanticLinks.includes(version)) {
      const componentDir = this.resolveComponentDirectory(componentName);
      const linkPath = path.join(componentDir, version);
      
      if (existsSync(linkPath) && lstatSync(linkPath).isSymbolicLink()) {
        const resolvedVersion = readlinkSync(linkPath);
        // Extract version number from link target (handles both "0.1.0.0" and "../0.1.0.0")
        const versionMatch = resolvedVersion.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (versionMatch) {
          return versionMatch[1];
        }
        // If no version pattern, assume it's already a clean version
        return resolvedVersion;
      } else {
        throw new Error(`Semantic link '${version}' does not exist or is not a symlink for ${componentName}`);
      }
    }
    
    // Unknown format - return as-is and let caller validate
    return version;
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
    // Semantic links are set by setCICDVersion() in create() method
    // setCICDVersion intelligently sets links based on build number:
    // - Build 0 (*.*.*.0): prod + latest
    // - Build 1+ (*.*.*.1+): dev + test + latest
    await this.updateLatestSymlink(componentName, version);
    await this.updateScriptsSymlinks(componentName, version);
    
    // Create base package.json for npm start ONLY principle
    await this.createBasePackageJson(componentName, version);
    
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
    return await this.loadTemplate('sh/version-wrapper.sh.template', {
      COMPONENT_NAME: componentName,
      VERSION: version
    });
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

  
  /**
   * Initialize or upgrade project with Web4 global configuration files
   * 
   * Creates root-level tsconfig.json and package.json for global node_modules
   * and TypeScript extends pattern (DRY principle). Safe to run multiple times.
   * 
   * @param targetDir Absolute path to project root (§ = discovered root, test/data = test isolation)
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
   * @TODO cliDefault targetDir §
   * @cliValues targetDir § test/data
   */
  async initProject(targetDir: string = '§', force: boolean = false): Promise<this> {
    // ✅ BASELINE COMPLIANCE: Use targetDirectory as-is (set by CLI or test via setTargetDirectory)
    const projectRoot = targetDir === '§' 
      ? this.model.targetDirectory  // ✅ Use stored value, don't calculate
      : targetDir; // Already absolute from bash wrapper
    
    // Detect test isolation mode
    const isTestIsolation = projectRoot.includes('/test/data');
    
    // if (isTestIsolation) {
    //   console.log(`🧪 Initializing test isolation environment at: ${projectRoot}`);
    //   // Use this component's own name and version for current version test isolation
    //   return await this.initTestIsolationEnvironment(projectRoot, this.model.component, this.model.version);
    // }
    
    console.log(`🚀 Initializing Web4 project at: ${projectRoot}`);
    
    // Create root directory if needed
    await fs.mkdir(projectRoot, { recursive: true });
    
    // Get template path (same logic as loadTemplate method) - needed for all template sync operations
    const currentDir = path.dirname(new URL(import.meta.url).pathname);
    
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
      // Timestamp-based sync: Check if template is newer than existing file
      // @pdca 2025-11-03-UTC-1430.pdca.md - force parameter skips timestamp check
      const tsconfigTemplatePath = path.join(currentDir, '../../../templates', 'config/root-tsconfig.json.template');
      const tsConfigStats = await fs.stat(tsConfigPath);
      const tsconfigTemplateStats = await fs.stat(tsconfigTemplatePath);
      
      if (force || tsconfigTemplateStats.mtime > tsConfigStats.mtime) {
        // Template is newer OR force mode - update the file
        const tsConfigContent = await this.loadTemplate('config/root-tsconfig.json.template', {});
        await fs.writeFile(tsConfigPath, tsConfigContent);
        console.log(`   ✅ ${force ? 'Force updated' : 'Updated'} tsconfig.json${force ? '' : ' (template is newer)'}`);
      } else {
        console.log(`   ℹ️  tsconfig.json already up to date`);
      }
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
      // Timestamp-based sync: Check if template is newer than existing file
      // @pdca 2025-11-03-UTC-1430.pdca.md - force parameter skips timestamp check
      const packageTemplatePath = path.join(currentDir, '../../../templates', 'config/root-package.json.template');
      const packageStats = await fs.stat(packageJsonPath);
      const packageTemplateStats = await fs.stat(packageTemplatePath);
      
      if (force || packageTemplateStats.mtime > packageStats.mtime) {
        // Template is newer OR force mode - update the file
        const packageJsonContent = await this.loadTemplate('config/root-package.json.template', {});
        await fs.writeFile(packageJsonPath, packageJsonContent);
        console.log(`   ✅ ${force ? 'Force updated' : 'Updated'} package.json${force ? '' : ' (template is newer)'}`);
      } else {
        console.log(`   ℹ️  package.json already up to date`);
      }
    }
    
    // Create global node_modules directory
    const nodeModulesPath = path.join(projectRoot, 'node_modules');
    await fs.mkdir(nodeModulesPath, { recursive: true });
    console.log(`   ✅ Ensured node_modules directory exists`);
    
    // 🛡️ SELF-HEALING: Create or update source.env (essential for tab completion)
    const sourceEnvPath = path.join(projectRoot, 'source.env');
    const templatePath = path.join(currentDir, '../../../templates', 'project/source.env.template');
    
    if (existsSync(sourceEnvPath)) {
      // Timestamp-based sync: Check if template is newer than existing file
      // @pdca 2025-11-03-UTC-1430.pdca.md - force parameter skips timestamp check
      const sourceEnvStats = await fs.stat(sourceEnvPath);
      const templateStats = await fs.stat(templatePath);
      
      if (force || templateStats.mtime > sourceEnvStats.mtime) {
        // Template is newer OR force mode - update the file
        const sourceEnvContent = await this.loadTemplate('project/source.env.template', {});
        await fs.writeFile(sourceEnvPath, sourceEnvContent);
        await fs.chmod(sourceEnvPath, 0o755);
        console.log(`   ✅ ${force ? 'Force updated' : 'Updated'} source.env${force ? '' : ' (template is newer)'}`);
      } else {
        console.log(`   ℹ️  source.env already up to date`);
      }
    } else {
      // File doesn't exist - create it
      const sourceEnvContent = await this.loadTemplate('project/source.env.template', {});
      await fs.writeFile(sourceEnvPath, sourceEnvContent);
      await fs.chmod(sourceEnvPath, 0o755);
      console.log(`   ✅ Created source.env (tab completion, PATH)`);
    }
    
    console.log(`\n✅ Project initialized successfully!`);
    console.log(`   Root configs: ${projectRoot}`);
    console.log(`   Components can now use: "extends": "../../../tsconfig.json"`);
    console.log(`   DRY principle: All components symlink to shared node_modules`);
    console.log(`   👉 Source environment: . source.env`);
    
    // Generate version wrapper scripts for retroactive isolation
    //await this.generateVersionWrappers(projectRoot);
    
    return this;
  }

  /**
   * Initialize test isolation for a specific component version
   * Internal method called by version wrappers when test/data doesn't exist
   * Hidden from CLI help but accessible via command line
   * @param component Component name
   * @param version Version to initialize
   * @cliHide
   */
    
    
    
    





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
   * @cliSyntax component version options
   * @TODO cliDefault version 0.1.0.0
   * @TODO cliDefault options all
   * @cliValues options all cli spec vitest layers
   */
  async create(component: string, version: string = '0.1.0.0', options: string = 'all'): Promise<void> {
    // Parse options (maps from 1.0.0.0 --cli --spec --vitest --layers)
    const scaffoldOptions: any = {
      componentName: component,
      version,
      includeLayerArchitecture: options.includes('layers') || options.includes('all'),
      includeCLI: options.includes('cli') || options.includes('all'),
      includeSpecFolder: options.includes('spec') || options.includes('all'),
      includeVitest: options.includes('vitest') || options.includes('test') || options.includes('all')
    };
    
    console.log(`🏗️ Creating Web4 component: ${component} ${version}`);
    console.log(`📋 Options: ${options || 'default'}`);
    
    const metadata = await this.scaffoldComponent(scaffoldOptions);
    
    console.log(`✅ Component structure created: ${component}`);
    console.log(`   Version: ${metadata.version}`);
    console.log(`   Location: components/${component}/${version}`);
    console.log(`   CLI: ${metadata.hasLocationResilientCLI ? '✅' : '❌'}`);
    console.log(`   Layers: ${metadata.hasLayeredArchitecture ? '✅' : '❌'}`);
    console.log(`   Spec: ${metadata.hasScenarioSupport ? '✅' : '❌'}`);
    
    // @pdca 2025-11-03-HHMM.pdca.md - Create component-level source.env using project template
    const componentRoot = this.resolveComponentPath(component, version);
    const sourceEnvPath = path.join(componentRoot, 'source.env');
    
    // Use the project source.env template with component-specific substitutions
    const sourceEnvContent = await this.loadTemplate('project/source.env.template', {
      COMPONENT_VERSION: version,
      VERSION: version
    });
    
    const fsLib = await import('fs/promises');
    await fsLib.writeFile(sourceEnvPath, sourceEnvContent);
    await fsLib.chmod(sourceEnvPath, 0o755);
    console.log(`   ✅ Created component source.env (tab completion, PATH)`);
    
    // Tier 1 Improvement: Automatically initialize component integration
    // PDCA: 2025-10-10-UTC-1850-component-initialization-ux-gap.pdca.md
    console.log(`🔗 Initializing project integration...`);
    
    // Set up semantic links directly (without calling on() - respects test isolation)
    // Use setCICDVersion for proper CI/CD link setup (recovered from catastrophic failure)
    // Parse version to determine build number
    const versionParts = version.split('.');
    const buildNumber = parseInt(versionParts[3] || '0', 10);
    
    const componentDir = this.resolveComponentDirectory(component);
    const fs = await import('fs/promises');
    
    // Always set latest
    const latestPath = path.join(componentDir, 'latest');
    await fs.unlink(latestPath).catch(() => {});
    await fs.symlink(version, latestPath);
    console.log(`   🔗 latest → ${version}`);
    
    if (buildNumber === 0) {
      // Build 0: Set as prod (stable release)
      const prodPath = path.join(componentDir, 'prod');
      await fs.unlink(prodPath).catch(() => {});
      await fs.symlink(version, prodPath);
      console.log(`   🔗 prod → ${version}`);
    } else {
      // Build 1+: Set as dev and test (development/testing)
      const devPath = path.join(componentDir, 'dev');
      await fs.unlink(devPath).catch(() => {});
      await fs.symlink(version, devPath);
      console.log(`   🔗 dev → ${version}`);
      
      const testPath = path.join(componentDir, 'test');
      await fs.unlink(testPath).catch(() => {});
      await fs.symlink(version, testPath);
      console.log(`   🔗 test → ${version}`);
    }
    
    // Verify component is callable
    const cliScriptName = component.toLowerCase().replace(/\./g, '');
    const cliPath = path.join(this.model.projectRoot, 'scripts', cliScriptName);
    
    if (existsSync(cliPath)) {
      console.log(`✅ Component fully initialized and ready to use!`);
      console.log(`   CLI command: ${cliScriptName}`);
      console.log(`   Try: ${cliScriptName}`);
    } else {
      console.log(`⚠️  Component created but CLI not available at expected path: ${cliPath}`);
      console.log(`   Run manually: web4tscomponent on ${component} ${version} verifyAndFix`);
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
   * Upgrade component to next version with semantic version control
   * WITHOUT context: Upgrades current component (self-operation)
   * WITH context: Upgrades target component
   * 
   * Performs intelligent version upgrades. If no context is loaded (via 'on'),
   * upgrades the current component. Supports semantic versioning with nextBuild,
   * nextPatch, nextMinor, nextMajor patterns.
   * 
   * @param versionPromotion Version upgrade type: 'nextBuild', 'nextPatch', 'nextMinor', 'nextMajor', or specific version
   * 
   * @example
   * // WITH context: Upgrade target component
   * await component.on('Web4TSComponent', 'latest').upgrade('nextBuild');
   * 
   * @example
   * // WITHOUT context: Upgrade current component (0.1.0.0 → 0.1.0.1)
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
   * @cliSyntax versionPromotion
   * @TODO cliDefault versionPromotion nextPatch
   * @cliValues versionPromotion nextPatch nextMinor nextMajor nextBuild
   */
  async upgrade(versionPromotion: string = 'nextPatch'): Promise<this> {
        // Print quick header for immediate UX feedback
        this.printQuickHeader();  
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    // @pdca 2025-10-28-UTC-0934.pdca.md:3090 - Phase 4: Instance pattern
    const target = this.model.context || this;
  

    // ✅ Component has ALL its data in ITS model
    const componentName = target.model.component;
    const currentVersion = target.model.version.toString();
    const componentPath = this.resolveComponentPath(componentName, currentVersion);
    
    let nextVersion: string;
    
    switch (versionPromotion) {
      case 'nextBuild':
        // @pdca 2025-11-03-UTC-0800.pdca.md - Consolidated to SemanticVersion (DRY principle)
        nextVersion = (await SemanticVersion.fromString(currentVersion).promoteRevision()).toString();
        console.log(`🔧 Upgrading ${componentName} to next build: ${currentVersion} → ${nextVersion}`);
        break;
        
      case 'nextPatch':
      case 'patch':
        // @pdca 2025-11-03-UTC-0800.pdca.md - Consolidated to SemanticVersion (DRY principle)
        nextVersion = (await SemanticVersion.fromString(currentVersion).promotePatch()).toString();
        console.log(`🔧 Upgrading ${componentName} to next patch: ${currentVersion} → ${nextVersion}`);
        break;
        
      case 'nextMinor':
      case 'minor':
        // @pdca 2025-11-03-UTC-0800.pdca.md - Consolidated to SemanticVersion (DRY principle)
        nextVersion = (await SemanticVersion.fromString(currentVersion).promoteMinor()).toString();
        console.log(`🚀 Upgrading ${componentName} to next minor: ${currentVersion} → ${nextVersion}`);
        break;
        
      case 'nextMajor':
      case 'major':
        // @pdca 2025-11-03-UTC-0800.pdca.md - Consolidated to SemanticVersion (DRY principle)
        nextVersion = (await SemanticVersion.fromString(currentVersion).promoteMajor()).toString();
        console.log(`💥 Upgrading ${componentName} to next major: ${currentVersion} → ${nextVersion}`);
        break;
        
      default:
        if (versionPromotion.match(/^\d+\.\d+\.\d+\.\d+$/)) {
          nextVersion = versionPromotion;
          console.log(`🎯 Upgrading ${componentName} to specific version: ${currentVersion} → ${nextVersion}`);
        } else {
          throw new Error(`Invalid version type: ${versionPromotion}. Use: nextBuild, nextMinor, nextMajor, or specific version`);
        }
    }
    
    // Create new version from existing
    await this.createVersionFromExisting(componentName, currentVersion, nextVersion);
    
    // Update symlinks to maintain proper script accessibility
    await this.updateSymlinks(componentName, nextVersion);
    
    console.log(`✅ ${componentName} ${nextVersion} created successfully`);
    console.log(`   Location: components/${componentName}/${nextVersion}`);
    
    // ✅ RADICAL OOP: Update context INSTANCE for further chaining
    if (this.model.context) {
      this.model.context.model.version = SemanticVersion.fromString(nextVersion);
      this.model.context.model.origin = `components/${componentName}/${nextVersion}`;
    }
    
    return this;
  }

  /**
   * Display tree structure of component directory
   * WITHOUT context: Shows tree for current component (self-operation)
   * WITH context: Shows tree for target component
   * @param depth Maximum depth to traverse (default: 4)
   * @param showHidden Show hidden files and directories
   * @cliSyntax depth showHidden
   * @TODO cliDefault depth 4
   * @TODO cliDefault showHidden false
   * @cliValues showHidden false true
   */
  async tree(depth: string = '4', showHidden: string = 'false'): Promise<this> {
        // Print quick header for immediate UX feedback
        this.printQuickHeader();
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;

    const maxDepth = parseInt(depth, 10) || 4;
    const includeHidden = showHidden.toLowerCase() === 'true';
    
    // Target has ALL data in ITS model
    const componentPath = this.resolveComponentPath(target.model.component, target.model.version.toString());
    console.log(`${this.colors.cyan}${this.colors.bold}📁 Tree structure for ${target.model.component} ${target.model.version.toString()}:${this.colors.reset}`);
      console.log(`${this.colors.dim}${componentPath}${this.colors.reset}`);
      await this.displayTreeStructure(componentPath, '', maxDepth, 0, includeHidden);
    
    return this;
  }



  /**
   * Display semantic version links - shows own links if no context, or target component links if context loaded
   * When no context: Show Web4TSComponent's own semantic version links
   * When context loaded: Show semantic version links for the loaded component
   * Shows development workflow status and version progression
   * @param action Optional action: 'fix' to repair all links and symlinks
   * @cliSyntax
   * @cliValues action fix verify
   * @cliExample web4tscomponent links
   * @cliExample web4tscomponent links fix
   * @cliExample web4tscomponent on Unit 0.3.2.0 links
   */
  async links(action: string = ''): Promise<this> {
    // Print quick header for immediate UX feedback
    this.printQuickHeader();
    
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    const componentName = target.model.component;
    
    // If 'fix' action requested, run verifyAndFix first
    if (action === 'fix') {
      console.log(`\n🔧 Fixing all links and symlinks for ${componentName}...`);
      await this.verifyAndFix();
      
      // Also fix semantic links (dev, test, prod, latest)
      await this.fixSemanticLinks(componentName);
      console.log(`✅ All links repaired for ${componentName}\n`);
    }
    
    // Target has ALL data in ITS model
    const semanticLinks = await this.getSemanticLinks(target.model.component);
    const componentDir = this.resolveComponentDirectory(target.model.component);
      const availableVersions = this.getAvailableVersions(componentDir);

    console.log(`🔗 Semantic Version Links for ${target.model.component}:`);
      console.log(`   📊 Available versions: ${availableVersions.length}`);
      console.log('');

      // Display semantic links with status indicators
      const linkOrder = ['prod', 'test', 'dev', 'latest'] as const;
      for (const linkType of linkOrder) {
      const linkTarget = semanticLinks[linkType];
        const icon = this.getLinkIcon(linkType);
      const status = linkTarget ? `→ ${linkTarget}` : '(not set)';
      const exists = linkTarget && availableVersions.includes(linkTarget) ? '✅' : linkTarget ? '❌' : '⚪';
      
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
   * Repairs or creates semantic symlinks using setCICDVersion() for DRY compliance
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
    
    // Determine what links should be
    const highestVersion = this.getHighestVersion(availableVersions);
    
    // ✅ Component no longer manipulates context (context now in CLIModel)
    // @pdca 2025-10-30-UTC-1011.pdca.md - Context manipulation removed
    // TODO: Refactor setCICDVersion to work without context if needed
    
    // Fix 'latest' - should always point to highest version
    if (!semanticLinks.latest || semanticLinks.latest !== highestVersion) {
      console.log(`   🔧 Fixing 'latest' link: ${semanticLinks.latest || 'missing'} → ${highestVersion}`);
      try {
        await this.setCICDVersion('latest', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not fix 'latest': ${(error as Error).message}`);
      }
    }
    
    // Fix 'prod' - if missing, set to latest
    if (!semanticLinks.prod) {
      console.log(`   🔧 Creating missing 'prod' link → ${highestVersion}`);
      try {
        await this.setCICDVersion('prod', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not create 'prod': ${(error as Error).message}`);
      }
    } else if (!availableVersions.includes(semanticLinks.prod)) {
      console.log(`   🔧 Fixing broken 'prod' link: ${semanticLinks.prod} (missing) → ${highestVersion}`);
      try {
        await this.setCICDVersion('prod', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not fix 'prod': ${(error as Error).message}`);
      }
    }
    
    // Fix 'dev' - should point to highest version (active development)
    if (!semanticLinks.dev || semanticLinks.dev !== highestVersion) {
      const action = !semanticLinks.dev ? 'Creating missing' : 'Updating';
      console.log(`   🔧 ${action} 'dev' link → ${highestVersion}`);
      try {
        await this.setCICDVersion('dev', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not ${action.toLowerCase()} 'dev': ${(error as Error).message}`);
      }
    } else if (!availableVersions.includes(semanticLinks.dev)) {
      console.log(`   🔧 Fixing broken 'dev' link: ${semanticLinks.dev} (missing) → ${highestVersion}`);
      try {
        await this.setCICDVersion('dev', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not fix 'dev': ${(error as Error).message}`);
      }
    }
    
    // Fix 'test' - should point to highest version (ready for testing)
    if (!semanticLinks.test || semanticLinks.test !== highestVersion) {
      const action = !semanticLinks.test ? 'Creating missing' : 'Updating';
      console.log(`   🔧 ${action} 'test' link → ${highestVersion}`);
      try {
        await this.setCICDVersion('test', highestVersion);
      } catch (error) {
        console.log(`   ❌ Could not ${action.toLowerCase()} 'test': ${(error as Error).message}`);
      }
    } else if (!availableVersions.includes(semanticLinks.test)) {
      console.log(`   🔧 Fixing broken 'test' link: ${semanticLinks.test} (missing) → ${highestVersion}`);
      try {
        await this.setCICDVersion('test', highestVersion);
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
   * @TODO cliDefault scope all
   * @cliValues file describe itCase shell completion
   * @cliExample web4tscomponent test
   * @cliExample web4tscomponent test all
   * @cliExample web4tscomponent test shell
   * @cliExample web4tscomponent test file 2
   * @cliExample web4tscomponent test describe 2 1
   * @cliExample web4tscomponent test itCase 2 1 3
   * @cliExample web4tscomponent on Unit 0.3.0.5 test
   */
  async test(scope: string = 'all', ...references: string[]): Promise<this> {
    // MODE 1: Test shell (bash completion testing in isolated test/data)
    // if (scope === 'shell') {
    //   return await this.testShell(...references);
    // }
    
    // MODE 1.5: Completion test suite (end-to-end TAB completion tests)
    if (scope === 'completion') {
      return await this.testCompletion();
    }
    
    // MODE 2: Selective testing
    const selectiveScopes = ['file', 'describe', 'itCase'];
    if (selectiveScopes.includes(scope)) {
      return await this.testSelective(scope, references);
    }
    
    // MODE 3: Full test suite (NO promotion - use releaseTest for that)
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    
    console.log(`🧪 Running ${target.model.component} tests (no promotion)...`);
      
      // 🚨 RECURSION DETECTION: Check if we're already inside vitest
      const insideTestEnvironment = !!(process.env.VITEST || process.env.VITEST_WORKER_ID);
      
      if (insideTestEnvironment) {
        console.log(`🧪 Already in test environment - skipping recursive vitest execution`);
        console.log(`✅ Test execution skipped (recursion prevented)`);
        return this;
      }
      
    // Run tests for target component
    // Use target's targetDirectory (component's own root where tests are)
    const componentPath = target.model.targetDirectory;
    
    // 🚨 RECURSION PREVENTION: Detect if already called from npm test
    // @pdca 2025-11-04-UTC-2044.pdca.md - Prevent test.sh → component test → npm test → test.sh loop
    const calledFromNpmTest = process.env.npm_lifecycle_event === 'test';
    const shouldUseNpmTest = this.model.context && !calledFromNpmTest;
    
    const testCommand = shouldUseNpmTest ? 'npm test' : 'npx vitest run --bail=false';
    
    try {
      execSync(testCommand, { 
        cwd: componentPath, 
        stdio: 'inherit',
        encoding: 'utf-8',  // ✅ CRITICAL: Forces proper stream handling, prevents EPIPE hang
      });
      
      console.log(`✅ Tests completed for ${target.model.component} ${target.model.version.toString()}`);
      
    } catch (error) {
      console.error(`❌ Tests failed for ${target.model.component} ${target.model.version.toString()}`);
      throw error;
    }

    return this;
  }

  /**
   * Run comprehensive TAB completion test suite
   * Executes all end-to-end shell tests for completion integration
   * @cliHide
   */
  async testCompletion(): Promise<this> {
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    const componentRoot = this.model.projectRoot;
    const testSuitePath = path.join(componentRoot, 'test/sh/test-completion-suite.sh');
    
    console.log(`🧪 Running TAB completion test suite...`);
    console.log(`📂 Component: ${target.model.component} ${target.model.version.toString()}`);
    console.log(`📂 Test Suite: ${testSuitePath}`);
    console.log();
    
    try {
      execSync(`bash "${testSuitePath}"`, {
        cwd: componentRoot,
        stdio: 'inherit',
      });
      
      console.log(`\n✅ TAB completion test suite completed successfully`);
    } catch (error) {
      console.error(`\n❌ TAB completion test suite failed`);
      throw error;
    }
    
    return this;
  }

  /**
   * Start interactive shell in test/data environment for testing
   * Optionally for a specific version (for retroactive isolation)
   * Sources test environment's source.env for isolated completion testing
   * 
   * @param version Optional version to test (defaults to current context)
   * @param command Optional command arguments to run in test shell (rest params)
   * @cliHide
   */
    
    
    
      
      
    
    
      
      
        
    

  /**
   * Run tests with configurable release promotion 
   * Same as test() but on 100% success promotes using specified promotion level
   * 
   * Two-stage workflow:
   * - Stage 1: dev → test (nextBuild) - same as test()
   * - Stage 2: test → prod (specified promotion) + new dev (nextBuild)
   * 
   * @param versionPromotion Promotion level on test success: nextPatch, nextMinor, or nextMajor
   * @cliSyntax versionPromotion
   * @TODO cliDefault versionPromotion nextPatch
   * @cliValues versionPromotion nextPatch nextMinor nextMajor nextBuild
   * @cliExample web4tscomponent releaseTest
   * @cliExample web4tscomponent releaseTest nextMinor
   * @cliExample web4tscomponent on Unit 0.3.0.5 releaseTest nextMajor
   */
  async releaseTest(versionPromotion: string = 'nextPatch'): Promise<this> {
    const validPromotions = ['nextPatch', 'nextMinor', 'nextMajor'];
    
    if (!validPromotions.includes(versionPromotion)) {
      console.error(`❌ Invalid promotion level: ${versionPromotion}`);
      console.log(`💡 Valid options: ${validPromotions.join(', ')}`);
      throw new Error(`Invalid promotion level`);
    }
    
    // WORKFLOW REMINDER: Always work on dev → test → dev cycle
    console.log(`\n🔄 RELEASE TEST WORKFLOW (${versionPromotion.toUpperCase()}):`);
    console.log(`   🚧 ALWAYS work on dev version until you run releaseTest`);
    console.log(`   🧪 ALWAYS work on test version until test succeeds`);  
    console.log(`   🚀 On 100% success: Promotes using ${versionPromotion}`);
    console.log(`   🚧 ALWAYS work on dev version after test success\n`);
    
    if (!this.model.context) {
      // ✅ NO context: Test current component (self-operation)
      const insideTestEnvironment = !!(process.env.VITEST || process.env.VITEST_WORKER_ID);
      
      if (insideTestEnvironment) {
        console.log(`🧪 Already in test environment - skipping recursive vitest execution`);
        console.log(`✅ Test execution skipped (recursion prevented)`);
      } else {
        console.log(`🧪 Running ${this.model.component} internal tests (RELEASE MODE)...`);
        
        const componentPath = this.resolveComponentPath(this.model.component, this.model.version.toString());
        try {
          execSync('npx vitest run', { 
            cwd: componentPath,
            stdio: 'inherit',
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
        await this.handleReleaseTestSuccessPromotion('Web4TSComponent', currentVersion, versionPromotion);
      }
      
      return this;
    }

    // ✅ WITH context: Test target component (RADICAL OOP pattern)
    const target = this.model.context;

    // 🚨 RECURSION SAFETY CHECK
    if (target.model.component === 'Web4TSComponent') {
      console.log(`🚨 RECURSION SAFETY: Web4TSComponent cannot test itself via delegation`);
      throw new Error('Recursion prevented: Use without context instead.');
    }

    // Context loaded - check if dev and test are same version and do nextBuild first
    const semanticLinks = await this.getSemanticLinks(target.model.component);
    const devVersion = semanticLinks['dev'];
    const testVersion = semanticLinks['test'];
    
    let targetVersion = target.model.version.toString();
    
    // If dev and test are the same version, do nextBuild promotion first
    if (devVersion && testVersion && devVersion === testVersion && devVersion === targetVersion) {
      console.log(`🔄 Dev and test are same version (${devVersion}) - creating nextBuild for testing...`);
      
      try {
        // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
        const nextBuildVersion = (await SemanticVersion.fromString(targetVersion).promoteRevision()).toString();
        console.log(`✅ Calculated nextBuild version: ${nextBuildVersion}`);
        await this.createSemanticLink(target.model.component, 'test', nextBuildVersion);
        console.log(`✅ Test updated: test → ${nextBuildVersion}`);
        // ✅ Component no longer manipulates context (context now in CLIModel)
        // @pdca 2025-10-30-UTC-1011.pdca.md - Context manipulation removed
        // await this.on(target.model.component, nextBuildVersion);
        targetVersion = nextBuildVersion;
        console.log(`🎯 Now testing new build version: ${nextBuildVersion}`);
      } catch (error) {
        console.error(`❌ Failed to create nextBuild version: ${(error as Error).message}`);
        throw error;
      }
    }

    // Run target component tests and handle RELEASE promotion
    const componentPath = this.resolveComponentPath(target.model.component, targetVersion);
    console.log(`🧪 Running tests for ${target.model.component} ${targetVersion} (RELEASE MODE)...`);
    
    try {
      execSync('npm test', { 
        cwd: componentPath, 
        stdio: 'inherit',
      });
      
      console.log(`✅ Tests completed for ${target.model.component} ${targetVersion}`);
      
      // RELEASE promotion based on versionPromotion level
      const semanticLinksAfter = await this.getSemanticLinks(target.model.component);
      const currentTest = semanticLinksAfter.test;
      
      if (targetVersion !== currentTest) {
        // Stage 1: This is a dev version, promote to test
        await this.handleFirstTestRun(target.model.component, targetVersion);
      } else {
        // Stage 2 RELEASE: This is the test version, use specified promotion level
        await this.handleReleaseTestSuccessPromotion(target.model.component, targetVersion, versionPromotion);
      }
      
    } catch (error) {
      console.error(`❌ Tests failed for ${target.model.component} ${targetVersion}`);
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
          // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
          newProdVersion = (await SemanticVersion.fromString(currentVersion).promotePatch()).toString();
          console.log(`✅ Calculated nextPatch version: ${newProdVersion}`);
          break;
        case 'nextMinor':
          // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
          newProdVersion = (await SemanticVersion.fromString(currentVersion).promoteMinor()).toString();
          console.log(`✅ Calculated nextMinor version: ${newProdVersion}`);
          break;
        case 'nextMajor':
          // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
          newProdVersion = (await SemanticVersion.fromString(currentVersion).promoteMinor()).toString(); // Still using promoteMinor for now
          console.log(`✅ Calculated nextMajor version: ${newProdVersion}`);
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
      // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
      const nextBuildVersion = (await SemanticVersion.fromString(newProdVersion).promoteRevision()).toString();
      console.log(`✅ Calculated nextBuild version: ${nextBuildVersion}`);
      
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
      // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
      const devVersion = (await SemanticVersion.fromString(currentVersion).promoteRevision()).toString();
      console.log(`✅ Calculated nextBuild version: ${devVersion}`);
      
      // Set as dev
      await this.createSemanticLink(componentName, 'dev', devVersion);
      
      console.log(`\n✅ Stage 0 complete: ${currentVersion} (prod) → ${devVersion} (dev)`);
      
      // CRITICAL: Only auto-switch for Web4TSComponent's SELF-testing (no context)
      // For other components (with context), the caller controls version switching
      if (componentName === 'Web4TSComponent' && !this.model.context) {
        console.log(`🔄 Switching to ${devVersion} to continue testing...`);
        
        // Use execSync to run npm test in the new version's directory
        const componentPath = this.resolveComponentPath(componentName, devVersion);
        console.log(`🧪 Now running tests on ${devVersion} (dev version)...`);
        
        try {
          execSync('npm test', {
            cwd: componentPath,
            stdio: 'inherit',
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
      // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
      const testVersion = (await SemanticVersion.fromString(currentVersion).promoteRevision()).toString();
      console.log(`✅ Calculated nextBuild version: ${testVersion}`);
      
      // Set as test
      await this.createSemanticLink(componentName, 'test', testVersion);
      
      console.log(`\n✅ Stage 1 complete: ${currentVersion} (dev) → ${testVersion} (test)`);
      
      // CRITICAL: Only auto-switch for Web4TSComponent's SELF-testing (no context)
      // For other components (with context), the caller controls version switching
      if (componentName === 'Web4TSComponent' && !this.model.context) {
        console.log(`🔄 Switching to ${testVersion} to run tests...`);
        
        // Use execSync to run npm test in the new version's directory
        // (Can't use .on() because that would trigger recursion safety check)
        const componentPath = this.resolveComponentPath(componentName, testVersion);
        console.log(`🧪 Now running tests on ${testVersion} (test version)...`);
        
        try {
          execSync('npm test', {
            cwd: componentPath,
            stdio: 'inherit',
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
      // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
      const nextBuildVersion = (await SemanticVersion.fromString(currentVersion).promoteRevision()).toString();
      // Note: console.log already exists in calling context
      
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
      // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
      const nextPatchVersion = (await SemanticVersion.fromString(currentVersion).promotePatch()).toString();
      // Note: console.log already exists in calling context
      
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
      // @pdca 2025-10-30-UTC-1430.functional-helper-elimination.pdca.md - Direct SemanticVersion usage (Radical OOP)
      const nextBuildVersion = (await SemanticVersion.fromString(nextPatchVersion).promoteRevision()).toString();
      // Note: console.log already exists in calling context
      
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
    // ✅ Use model.targetDirectory (Path Authority: calculated by CLI)
    const componentsDir = path.join(this.model.targetDirectory, 'components');
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
   */
  private async getCurrentVersion(): Promise<string> {
    return this.model.version.toString();
  }


  /**
   * Execute start command in loaded component context
   * Build and run the loaded component using its build system
   * @cliSyntax
   * @cliExample web4tscomponent on Unit 0.3.0.5 start
   */
  async start(): Promise<this> {
    // ✅ RADICAL OOP: Context required for start
    if (!this.model.context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }

    const target = this.model.context;
    // ✅ PATH AUTHORITY: Use target's origin (from on()) - target is always loaded via on()
    const componentPath = this.resolveComponentPath(target.model.component, target.model.version.toString());
    
    console.log(`🚀 Starting ${target.model.component} ${target.model.version.toString()}...`);
    
    try {
      execSync('npm start', { 
        cwd: componentPath, 
        stdio: 'inherit',
      });
      console.log(`✅ Started ${target.model.component} ${target.model.version.toString()}`);
    } catch (error) {
      console.error(`❌ Failed to start ${target.model.component} ${target.model.version.toString()}`);
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
  /**
   * Build component with optional flags
   * @param flags Optional build flags: 'verbose' (default), 'silent', 'force'
   * @cliValues verbose,silent,force
   */
  async build(...flags: string[]): Promise<this> {
    // Print quick header for immediate UX feedback
    this.printQuickHeader();
    
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    
    // ✅ AUTO-BUILD DEPENDENCIES: Build dependencies before building this component
    // @pdca 2025-11-05-UTC-0230-component-dependencies.pdca.md
    if (target.model.dependencies && target.model.dependencies.length > 0) {
      console.log(`📦 Building ${target.model.dependencies.length} dependencies...`);
      for (const dep of target.model.dependencies) {
        await this.buildDependencies(dep.component, dep.version);
      }
    }
    
    // Parse flags - default to verbose if no flags provided
    const hasVerbose = flags.includes('verbose') || (flags.length === 0 && !flags.includes('silent'));
    const hasSilent = flags.includes('silent');
    const hasForce = flags.includes('force');
    
    // Build direct shell script command with flags (bypass npm to avoid shell issues)
    let buildArgs = [];
    if (hasVerbose) buildArgs.push('verbose');
    if (hasSilent) buildArgs.push('silent');
    if (hasForce) buildArgs.push('force');
    const buildCmd = `./src/sh/build.sh ${buildArgs.join(' ')}`;
    
    // ✅ PATH AUTHORITY: Use target's origin (from on()) or calculate path (self-operation)
    const componentPath = this.resolveComponentPath(target.model.component, target.model.version.toString());
    
    console.log(`🔨 Building ${target.model.component} ${target.model.version.toString()}...`);
    
    try {
      execSync(buildCmd, { 
        cwd: componentPath, 
        stdio: 'inherit',
        shell: process.env.SHELL || '/bin/sh'
      });
      console.log(`✅ Build completed for ${target.model.component} ${target.model.version.toString()}`);
    } catch (error) {
      console.error(`❌ Build failed for ${target.model.component} ${target.model.version.toString()}`);
      throw error;
    }

    return this;
  }

  /**
   * Execute selective test command (called internally from test())
   * Run specific test files, describe blocks, or it cases using vitest
   * Supports numeric references with tab completion for fast test selection
   * 
   * Web4 Principle: Use model.targetDirectory for context discovery, not cwd
   * 
   * @param scope - Type of test selection: 'file' | 'describe' | 'itCase'
   * @param references - Numeric references (1-based) for selecting tests
   * @cliHide
   */
  private async testSelective(scope: string, references: string[]): Promise<this> {
    // Import TestFileParser dynamically
    const { TestFileParser } = await import('../layer4/TestFileParser.js');
    
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    
    // ✅ CRITICAL: Use THIS (Web4TSComponent)'s componentRoot which was initialized with target's path
    // @pdca 2025-11-03-UTC-1237.pdca.md - Delegation uses web4ts.model.componentRoot, not target.model.componentRoot
    const componentPath = this.model.componentRoot;
    const testDir = path.join(componentPath, 'test');
    
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
   * Execute test for specific file (by numeric reference OR file path)
   * @pdca 2025-10-28-UTC-1950 - Fix for layered test structure
   * @pdca 2025-11-03-UTC-1430 - Support both numbers and file paths
   * @test test/ts/layer2/DefaultWeb4TSComponent.baseline.test.ts:testFile
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
      console.log(`\n💡 Usage: web4tscomponent test file <number|path>`);
      console.log(`   Example: web4tscomponent test file 5`);
      console.log(`   Example: web4tscomponent test file test/vitest/my-test.test.ts`);
      return;
    }
    
    let targetFile;
    const input = references[0];
    
    // Check if input is a number or a file path
    const fileNum = parseInt(input, 10);
    if (!isNaN(fileNum) && /^\d+$/.test(input)) {
      // It's a number - use numeric lookup
      targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);
      
      if (!targetFile) {
        console.error(`❌ Invalid file number: ${fileNum}`);
        console.log(`💡 Valid range: 1-${testFiles.length}`);
        throw new Error(`Invalid file number`);
      }
    } else {
      // It's a file path - find by path matching
      let searchPath = input;
      
      // Normalize path (remove leading 'test/' if present, we'll add it back)
      if (searchPath.startsWith('test/')) {
        searchPath = searchPath.substring(5);
      }
      
      // Try to find matching file
      targetFile = testFiles.find(f => 
        f.relativePath === searchPath || 
        f.relativePath.endsWith(searchPath) ||
        path.basename(f.relativePath) === path.basename(searchPath)
      );
      
      if (!targetFile) {
        console.error(`❌ Test file not found: ${input}`);
        console.log(`💡 Available files:`);
        const formatted = TestFileParser.formatFilesForCompletion(testFiles);
        formatted.slice(0, 10).forEach(f => console.log(`   ${f}`));
        if (testFiles.length > 10) {
          console.log(`   ... and ${testFiles.length - 10} more`);
        }
        throw new Error(`Test file not found`);
      }
    }
    
    console.log(`🧪 Running tests from: ${targetFile.relativePath}`);
    
    // ✅ RADICAL OOP: Use target instance for component root
    const target = this.model.context || this;
    // ✅ PATH AUTHORITY: Use target's origin (from on()) or calculate path (self-operation)
    const componentRoot = this.resolveComponentPath(target.model.component, target.model.version.toString());
    
    try {
      // ✅ FIX: Use relativePath which includes subdirectories (ts/layer2/file.test.ts)
      execSync(`npx vitest --run ${path.join('test', targetFile.relativePath)}`, {
        cwd: componentRoot,
        stdio: 'inherit',
      });
    } catch (error) {
      // Vitest will have already shown the error output
      throw error;
    }
  }

  /**
   * Execute test for specific describe block (by numeric references)
   * Supports progressive filtering: just number shows all describes for that file
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
    const tokenMatch = ref.match(/^([0-9]+[a-z]?)/);
    if (tokenMatch) {
      ref = tokenMatch[1];
    }
    
    // Check if it's just a number (filter by file)
    if (/^\d+$/.test(ref)) {
      const fileNum = parseInt(ref, 10);
      const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);
      
      if (!targetFile) {
        console.error(`❌ Invalid file number: ${fileNum}`);
        console.log(`💡 Valid range: 1-${testFiles.length}`);
        throw new Error(`Invalid file number`);
      }
      
      // Use Web4 DRY pattern: HierarchicalCompletionFilter
      const { HierarchicalCompletionFilter } = await import('../layer4/HierarchicalCompletionFilter.js');
      const result = TestFileParser.getAllDescribesHierarchical(testDir);
      const filtered = HierarchicalCompletionFilter.applyPrefixFilter(
        result,
        ref,
        /([a-z])\)/  // Pattern to extract describe letters like "a)" - filter will add file context
      );
      
      console.log(`\n📋 Describe blocks for file ${fileNum}:\n`);
      console.log(filtered.join('\n'));
      console.log(`\n💡 Usage: web4tscomponent test describe <token> (e.g., ${fileNum}a)`);
      return;
    }
    
    // Parse compound reference (e.g., "17a")
    const result = TestFileParser.getDescribeByReference(testDir, ref);
    
    if (!result) {
      console.error(`❌ Invalid reference: ${ref}`);
      console.log(`💡 Use format: <fileNum><letter> (e.g., 5a, 17b)`);
      console.log(`   Or just <fileNum> to filter by file (e.g., 5)`);
      console.log(`   Run 'web4tscomponent test describe' to see available options`);
      throw new Error(`Invalid describe reference`);
    }
    
    const { file, describe } = result;
    
    console.log(`🧪 Running tests for describe: "${describe.name}"`);
    console.log(`   File: ${file.name}`);
    console.log(`   Reference: ${ref}`);
    
    // ✅ RADICAL OOP: Use target instance for component root
    const target = this.model.context || this;
    // ✅ PATH AUTHORITY: Use target's origin (from on()) or calculate path (self-operation)
    const componentRoot = this.resolveComponentPath(target.model.component, target.model.version.toString());
    
    try {
      execSync(`npx vitest --run -t "${describe.name}"`, {
        cwd: componentRoot,
        stdio: 'inherit',
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
      // No reference - show hierarchical list of all test cases
      const result = TestFileParser.getAllItCasesHierarchical(testDir);
      result.display.forEach(line => console.log(line));
      console.log(`\n💡 Usage: web4tscomponent test itCase <token> (e.g., 5a1)`);
      return;
    }
    
    // Parse hierarchical token (e.g., "5a1" -> file=5, describe=a, itCase=1)
    const token = references[0];
    
    // Check if it's just a number (filter by file)
    if (/^\d+$/.test(token)) {
      // User wants to see all test cases for this file
      const fileNum = parseInt(token, 10);
      const targetFile = TestFileParser.getFileByNumber(testFiles, fileNum);
      
      if (!targetFile) {
        console.error(`❌ Invalid file number: ${fileNum}`);
        console.log(`💡 Valid range: 1-${testFiles.length}`);
        throw new Error(`Invalid file number`);
      }
      
      // Use Web4 DRY pattern: HierarchicalCompletionFilter
      const { HierarchicalCompletionFilter } = await import('../layer4/HierarchicalCompletionFilter.js');
      const result = TestFileParser.getAllItCasesHierarchical(testDir);
      const filtered = HierarchicalCompletionFilter.applyPrefixFilter(
        result,
        token,
        /(\d+[a-z]\d+)\)/  // Pattern to extract itCase tokens like "2a1)"
      );
      
      filtered.forEach(line => console.log(line));
      console.log(`\n💡 Usage: web4tscomponent test itCase <token> (e.g., ${fileNum}a1)`);
      return;
    }
    
    const match = token.match(/^(\d+)([a-z])(\d+)$/);
    
    if (!match) {
      console.error(`❌ Invalid it case token: ${token}`);
      console.log(`💡 Expected format: <fileNum><describeLetter><itNum> (e.g., 5a1)`);
      console.log(`💡 Or just <fileNum> to filter by file (e.g., 5)`);
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
    
    // ✅ RADICAL OOP: Use target instance for component root
    const target = this.model.context || this;
    // ✅ PATH AUTHORITY: Use target's origin (from on()) or calculate path (self-operation)
    const componentRoot = this.resolveComponentPath(target.model.component, target.model.version.toString());
    
    try {
      execSync(`npx vitest --run -t "${targetIt.name}"`, {
        cwd: componentRoot,
        stdio: 'inherit',
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Execute clean command
   * WITHOUT context: Clean Web4TSComponent itself (self-operation)
   * WITH context: Clean the loaded component
   * @param force If 'force', performs global clean (deletes global node_modules). Default is local clean only.
   * @cliSyntax force
   * @cliExample web4tscomponent clean
   * @cliExample web4tscomponent clean force
   * @cliExample web4tscomponent on Unit 0.3.0.5 clean
   */
  async clean(force: string = ''): Promise<this> {
    // Print quick header for immediate UX feedback
    this.printQuickHeader();
    
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    
    // ✅ PATH AUTHORITY: Use target's origin (from on()) or calculate path (self-operation)
    const componentPath = this.resolveComponentPath(target.model.component, target.model.version.toString());
    
    const isGlobalClean = force === 'force';
    const cleanType = isGlobalClean ? 'clean:global' : 'clean';
    
    console.log(`🧹 Cleaning ${target.model.component} ${target.model.version.toString()}${isGlobalClean ? ' (GLOBAL - includes project root node_modules)' : ' (local only)'}...`);
    
    try {
      execSync(`npm run ${cleanType}`, { 
        cwd: componentPath, 
        stdio: 'inherit',
      });
      console.log(`✅ Cleaned ${target.model.component} ${target.model.version.toString()}`);
    } catch (error) {
      console.error(`❌ Clean failed for ${target.model.component} ${target.model.version.toString()}`);
      throw error;
    }

    return this;
  }

  /**
   * Test and discover tab completions for debugging and development
   * WITHOUT context: Test completions on Web4TSComponent itself
   * WITH context: Test completions on the loaded component
   * 
   * Automatically discovers and lists methods or parameter completions based on 'what' parameter.
   * Supports prefix filtering to narrow down results.
   * 
   * @param what Type of completion to test: "method" or "parameter"
   * @param filter Optional prefix to filter results (e.g., "v" shows only validate*, verify*, etc.)
   * 
   * @cliSyntax what filter
   * @cliValues what method parameter
   * @cliExample web4tscomponent completion method
   * @cliExample web4tscomponent completion method v
   * @cliExample web4tscomponent completion parameter s
   * @cliExample web4tscomponent on Unit 0.3.0.5 completion method
   * 
   * @remarks TSCompletion uses convention: filterParameterCompletion (not @cliCompletion tag)
   */
  async completion(what: string, filter?: string): Promise<this> {
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    
    // OOP: Instantiate CLI and call completeParameter directly (no shell!)
    const { Web4TSComponentCLI } = await import('../layer5/Web4TSComponentCLI.js');
    const cli = new Web4TSComponentCLI();
    
    console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on ${target.model.component} ${target.model.version.toString()}${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
    if (!this.model.context) {
      // No context - call completeParameter directly via OOP
      await cli.completeParameter('completionNameParameterCompletion', 'completion', what, filter || '');
    } else {
      // Context loaded - delegate to target component's CLI
      const cliScriptName = target.model.component.toLowerCase().replace(/\./g, '');
      const cliPath = path.join(this.model.projectRoot, 'scripts', cliScriptName);
      
      execSync(`${cliPath} completeParameter completionNameParameterCompletion "completion" "${what}" "${filter || ''}" 2>/dev/null`, { 
        cwd: this.resolveComponentPath(target.model.component, target.model.version.toString()),
        stdio: 'inherit',
      });
    }
    
    return this;
  }

  /**
   * Remove a specific version of a component
   * Removes the version directory and updates symlinks accordingly
   * @param component Component name to remove version from (uses context if not provided)
   * @param version Version to remove (uses context version if not provided)
   * @cliSyntax component version
   * @TODO cliDefault component current
   * @TODO cliDefault version current
   * @cliExample web4tscomponent removeVersion Unit 0.2.0.0
   * @cliExample web4tscomponent on Unit 0.2.0.0 removeVersion
   */
  async removeVersion(component: string = 'current', version: string = 'current'): Promise<this> {
    let targetComponent: string;
    let targetVersion: string;

    // Only check context if either parameter is 'current'
    if (component === 'current' || version === 'current') {
      if (!this.model.context) {
        throw new Error('No component context loaded and no component/version specified. Use "on <component> <version>" first or provide component and version.');
      }
      const target = this.model.context;
      targetComponent = component === 'current' ? target.model.component : component;
      targetVersion = version === 'current' ? target.model.version.toString() : version;
    } else {
      // Both parameters explicitly provided
      targetComponent = component;
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
   * @param component Component name to remove completely (uses context if not provided)
   * @cliSyntax component
   * @TODO cliDefault component current
   * @cliExample web4tscomponent removeComponent TestComponent
   * @cliExample web4tscomponent on TestComponent 1.0.0.0 removeComponent
   */
  async removeComponent(component: string = 'current'): Promise<this> {
    let targetComponent: string;

    if (component === 'current') {
      if (!this.model.context) {
        throw new Error('No component context loaded and no component specified. Use "on <component> <version>" first or provide component name.');
      }
      targetComponent = this.model.context.model.component;
    } else {
      targetComponent = component;
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
    if (this.model.context && this.model.context.model.component === targetComponent) {
      this.model.context = undefined;
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
   * @TODO cliDefault message Zero config discovery works!
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
   * Version increment helpers removed - consolidated to SemanticVersion component
   * @pdca 2025-11-03-UTC-0800.pdca.md - DRY principle: Use SemanticVersion.promoteX() methods
   * 
   * Previous methods (now redundant):
   * - incrementBuild() → SemanticVersion.promoteRevision()
   * - incrementPatch() → SemanticVersion.promotePatch()
   * - incrementMinor() → SemanticVersion.promoteMinor()
   * - incrementMajor() → SemanticVersion.promoteMajor()
   */

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
   * SKIP: session directory (should be empty for new versions)
   * @cliHide
   */
  private async copyDirectory(source: string, target: string): Promise<void> {
    await fs.mkdir(target, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      // SKIP session directory - it should be empty for new versions
      if (entry.name === 'session') {
        // Create empty session directory in target
        const sessionPath = path.join(target, 'session');
        await fs.mkdir(sessionPath, { recursive: true });
        console.log(`   📁 Created empty session directory`);
        continue;
      }
      
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
   * @TODO cliDefault topic overview
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
   * @deprecated Use 'links fix' instead - this method is kept for backward compatibility
   * @cliHide
   */
  async verifyAndFix(): Promise<this> {
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    const componentName = target.model.component;
    
    console.log(`🔍 Verifying and fixing symlinks for ${componentName}...`);
    
    // Verify and fix all symlinks
    await this.verifyAndFixSymlinks(componentName);
    
    console.log(`✅ Symlink verification and repair completed for ${componentName}`);
    return this;
  }

  /**
   * Set CI/CD semantic links for a component version
   * WITHOUT context: Sets link for current component (self-operation)
   * WITH context: Sets link for target component
   * 
   * Unified method replacing individual setDev, setLatest, setProd, setTest methods
   * 
   * Sets links intelligently based on version build number:
   * - Build 0 (*.*.*.0): prod version (stable release)
   * - Build 1+ (*.*.*.1+): dev/test versions (development/testing)
   * 
   * Called during component creation to establish complete semantic link infrastructure
   * 
   * @param targetVersion Semantic link to set: 'dev', 'latest', 'prod', 'test'
   * @param version Version to set for the link (default: current context version)
   * @returns this for method chaining
   * @cliSyntax targetVersion version
   * @TODO cliDefault version current
   * @cliValues targetVersion dev latest prod test
   * @cliExample web4tscomponent setCICDVersion prod 1.0.0.0
   * @cliExample web4tscomponent setCICDVersion dev 0.1.1.1
   * @cliExample web4tscomponent on Component 0.1.0.0 setCICDVersion latest
   */
  async setCICDVersion(
    targetVersion: string,
    version: string = 'current'
  ): Promise<this> {
    // Print quick header for immediate UX feedback
    this.printQuickHeader();
    
    // ✅ RADICAL OOP: Work with component INSTANCE (this or context)
    const target = this.model.context || this;
    const componentName = target.model.component;
    const componentDir = this.resolveComponentDirectory(componentName);
    
    // Use DRY helper to resolve version (handles 'current', semantic links, and actual versions)
    const contextVersion = target.model.version.toString();
    const actualVersion = this.resolveActualVersion(componentName, version, contextVersion);
    
    // Validate targetVersion
    const validLinks = ['dev', 'latest', 'prod', 'test'];
    if (!validLinks.includes(targetVersion)) {
      throw new Error(`Invalid targetVersion: ${targetVersion}. Must be one of: ${validLinks.join(', ')}`);
    }
    
    console.log(`🔗 Setting ${targetVersion} symlink for ${componentName}:`);
    console.log(`   Target: ${actualVersion}`);
    
    const fs = await import('fs/promises');
    const linkPath = path.join(componentDir, targetVersion);
    const targetDir = path.join(componentDir, actualVersion);
    
    // Verify target version exists
    if (!existsSync(targetDir)) {
      throw new Error(`Target version ${actualVersion} does not exist at ${targetDir}`);
    }
    
    try {
      // Remove existing symlink if exists
      await fs.unlink(linkPath).catch(() => {});
      
      // Create new symlink
      await fs.symlink(actualVersion, linkPath);
      console.log(`   ✅ ${targetVersion} → ${actualVersion}`);
      
      // Also create scripts/versions semantic symlink (except for 'latest' which uses main script)
      if (targetVersion !== 'latest') {
        await this.createSemanticVersionSymlink(componentName, targetVersion, actualVersion);
      }
    } catch (error) {
      throw new Error(`Failed to set ${targetVersion} link: ${error}`);
    }
    
    return this;
  }

  /**
   * Tab completion for targetVersion parameter of 'setCICDVersion' command
   * Returns available semantic links: dev, latest, prod, test
   * @cliHide
   */
  async targetVersionParameterCompletion(): Promise<string[]> {
    return ["dev", "latest", "prod", "test"];
  }

  /**
   * Create semantic version symlink in scripts/versions
   * Example: web4tscomponent.prod → web4tscomponent-v0.3.13.2
   * @cliHide
   */
  private async createSemanticVersionSymlink(component: string, semantic: string, version: string): Promise<void> {
    // ✅ Use model.projectRoot for scripts/ (Path Authority)
    const projectRoot = this.model.projectRoot;
    const versionsDir = path.join(projectRoot, 'scripts', 'versions');
    const componentLower = component.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Semantic link name: web4tscomponent.prod
    const semanticLinkName = `${componentLower}.${semantic}`;
    const semanticLinkPath = path.join(versionsDir, semanticLinkName);
    
    // Target: web4tscomponent-v0.3.13.2
    const targetWrapperName = `${componentLower}-v${version}`;
    
    try {
      // Ensure target wrapper exists
      const targetWrapperPath = path.join(versionsDir, targetWrapperName);
      if (!existsSync(targetWrapperPath)) {
        // Create the wrapper if it doesn't exist
        await this.createVersionScriptSymlink(component, version);
      }
      
      // Remove existing semantic symlink if exists
      try {
        await fs.unlink(semanticLinkPath);
      } catch {
        // Doesn't exist, that's fine
      }
      
      // Create symlink: .prod → -v0.3.13.2
      await fs.symlink(targetWrapperName, semanticLinkPath);
      console.log(`   🔗 Created semantic symlink: ${semanticLinkName} → ${targetWrapperName}`);
    } catch (error) {
      console.log(`   ⚠️  Could not create semantic symlink ${semanticLinkName}: ${(error as Error).message}`);
    }
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
    // ✅ Use model.projectRoot (Path Authority: CLI calculates this)
    // NOT resolveProjectRoot() which returns targetDirectory
    const projectRoot = this.model.projectRoot;
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
   * Now handles two types:
   * 1. Version wrappers: {cli}-v{version} (shell scripts, not symlinks)
   * 2. Semantic symlinks: {cli}.{semantic} (symlinks pointing to version wrappers)
   * @cliHide
   */
  private async cleanupOrphanedScriptSymlinks(component: string, validVersions: string[]): Promise<void> {
    // ✅ Use model.projectRoot for scripts/ (Path Authority)
    const projectRoot = this.model.projectRoot;
    const scriptsDir = path.join(projectRoot, 'scripts');
    const versionsDir = path.join(scriptsDir, 'versions');
    const componentLower = component.toLowerCase();
    
    // Check scripts/versions directory for orphaned entries
    try {
      const entries = await fs.readdir(versionsDir);
      
      // Pattern 1: Version wrappers (shell scripts): {cli}-v{version}
      const versionPattern = new RegExp(`^${componentLower}-v(.+)$`);
      
      // Pattern 2: Semantic symlinks: {cli}.{semantic}
      const semanticPattern = new RegExp(`^${componentLower}\\.(dev|test|prod)$`);
      
      for (const entry of entries) {
        const entryPath = path.join(versionsDir, entry);
        const stats = await fs.lstat(entryPath).catch(() => null);
        
        if (!stats) continue;
        
        // Check if it's a version wrapper (shell script)
        const versionMatch = entry.match(versionPattern);
        if (versionMatch) {
          const version = versionMatch[1];
          
          if (stats.isSymbolicLink()) {
            // Old symlink format - should be replaced with wrapper
            console.log(`   🔄 Converting old symlink to wrapper: ${entry}`);
            await this.createVersionScriptSymlink(component, version);
          } else if (!validVersions.includes(version)) {
            // Orphaned wrapper - version no longer exists
            console.log(`   🧹 Removing orphaned wrapper: ${entry} (version ${version} removed)`);
            await fs.unlink(entryPath);
          }
          // else: valid wrapper, keep it
          continue;
        }
        
        // Check if it's a semantic symlink
        const semanticMatch = entry.match(semanticPattern);
        if (semanticMatch) {
          const semantic = semanticMatch[1]; // dev, test, or prod
          
          if (!stats.isSymbolicLink()) {
            // Should be a symlink but isn't - remove it
            console.log(`   🧹 Removing invalid semantic entry (not a symlink): ${entry}`);
            await fs.unlink(entryPath);
            continue;
          }
          
          try {
            // Check if symlink target exists
            const target = await fs.readlink(entryPath);
            const targetPath = path.resolve(versionsDir, target);
            
            if (!existsSync(targetPath)) {
              // Broken symlink - target doesn't exist
              console.log(`   🧹 Removing broken semantic symlink: ${entry} (target missing)`);
              await fs.unlink(entryPath);
            }
            // else: valid semantic symlink, keep it
          } catch (error) {
            // Can't read symlink - remove it
            console.log(`   🧹 Removing invalid semantic symlink: ${entry}`);
            await fs.unlink(entryPath);
          }
        }
        // else: not our component's file, ignore it
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
   * @TODO cliDefault component Web4TSComponent
   * @TODO cliDefault version 0.3.2.0
   * @cliHide
   */
  private async verifyVersionScriptSymlink(component: string, version: string): Promise<void> {
    // ✅ Use model.projectRoot for scripts/ (Path Authority)
    const projectRoot = this.model.projectRoot;
    const versionsDir = path.join(projectRoot, 'scripts', 'versions');
    const componentLower = component.toLowerCase();
    const scriptName = `${componentLower}-v${version}`;
    const scriptPath = path.join(versionsDir, scriptName);
    
    // Check if wrapper script exists (could be symlink or regular file)
    let scriptExists = false;
    let isSymlink = false;
    try {
      const stats = await fs.lstat(scriptPath);
      scriptExists = true;
      isSymlink = stats.isSymbolicLink();
    } catch {
      // Script doesn't exist
    }
    
    if (scriptExists) {
      if (isSymlink) {
        // Old symlink exists - replace with wrapper
        console.log(`   🔄 Replacing old symlink with wrapper: ${scriptName}`);
        await this.createVersionScriptSymlink(component, version);
      } else {
        // Wrapper script exists - verify it's valid
        console.log(`   ✅ Version wrapper script exists: ${scriptName}`);
      }
    } else {
      // Create new wrapper script
      console.log(`   🔧 Creating missing version wrapper: ${scriptName}`);
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
   * @TODO cliDefault outputFormat json
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
   * Update scripts and scripts/versions symlinks (restored to 0.3.13.2 behavior)
   * @cliHide
   */
  private async updateScriptsSymlinks(component: string, version: string): Promise<void> {
    try {
      // Create version-specific symlink (restored to 0.3.13.2 behavior)
      await this.createVersionScriptSymlink(component, version);
      
      // Update scripts/component symlink to point to latest version
      await this.updateMainScriptSymlink(component, version);
    } catch (error) {
      console.log(`   ⚠️ Could not update scripts symlinks: ${(error as Error).message}`);
    }
  }



  /**
   * Create version-specific script symlink (restored to 0.3.13.2 behavior)
   * @cliHide
   */
  private async createVersionScriptSymlink(component: string, version: string): Promise<void> {
    // ✅ Use model.projectRoot (Path Authority: CLI calculates this)
    // NOT resolveProjectRoot() which returns targetDirectory
    const projectRoot = this.model.projectRoot;
    const versionsDir = path.join(projectRoot, 'scripts', 'versions');
    
    // Ensure scripts/versions directory exists
    await fs.mkdir(versionsDir, { recursive: true });
    
    const componentLower = component.toLowerCase();
    const scriptName = `${componentLower}-v${version}`;
    const scriptPath = path.join(versionsDir, scriptName);
    
    // Find the CLI script in the component version (use project root directly)
    const componentVersionDir = path.join(projectRoot, 'components', component, version);
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
      // Remove existing file/symlink if it exists
      try {
        await fs.unlink(scriptPath);
      } catch {
        // File doesn't exist, that's fine
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
    // ✅ Use model.projectRoot for scripts/ (Path Authority)
    const projectRoot = this.model.projectRoot;
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
    const content = await this.loadTemplate('ts/DefaultComponent.ts.template', {
      COMPONENT_NAME: componentName,
      VERSION: version
    });
    const filePath = path.join(componentDir, 'src/ts/layer2', `Default${componentName}.ts`);
    await fs.writeFile(filePath, content);
  }

  /**
   * Create component interfaces
   * @cliHide
   */
  private async createComponentInterfaces(componentDir: string, componentName: string): Promise<void> {
    // Generate component interface
    const componentInterface = await this.loadTemplate('ts/Component.interface.ts.template', {
      COMPONENT_NAME: componentName
    });
    const interfacePath = path.join(componentDir, 'src/ts/layer3', `${componentName}.interface.ts`);
    await fs.writeFile(interfacePath, componentInterface);

    // Generate component model interface
    const modelInterface = await this.loadTemplate('ts/ComponentModel.interface.ts.template', {
      COMPONENT_NAME: componentName
    });
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
    const content = await this.loadTemplate('ts/ComponentCLI.ts.template', {
      COMPONENT_NAME: componentName,
      VERSION: version
    });
    const cliPath = path.join(componentDir, 'src/ts/layer5', `${componentName}CLI.ts`);
    await fs.writeFile(cliPath, content);
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
      'CLIModel.interface.ts',           // ✅ Added for Path Authority architecture
      'User.interface.ts',               // ✅ Added for Path Authority - User service in CLIModel
      'MethodInfo.interface.ts',
      'MethodSignature.interface.ts',    // ✅ Added for Phase 3 DefaultCLI refactoring
      'Component.interface.ts',          // ✅ Added for Phase 1 architecture migration
      'Completion.ts',
      'Colors.interface.ts'              // ✅ Added for DRY refactoring - centralized colors
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
    
    // Copy layer4 files (DefaultColors for DRY refactoring)
    const layer4Files = [
      'DefaultColors.ts'              // ✅ Added for DRY refactoring - centralized color implementation
    ];
    
    for (const file of layer4Files) {
      const currentDir = path.dirname(new URL(import.meta.url).pathname);
      const sourcePath = path.join(currentDir, '../../../src/ts/layer4', file);
      const targetPath = path.join(componentDir, 'src/ts/layer4', file);
      
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
    // ✅ RADICAL OOP: Context required for updateBuildSystem
    if (!this.model.context) {
      throw new Error('No component context loaded. Use "on <component> <version>" first.');
    }
    
    const target = this.model.context;
    
    console.log(`🔧 Updating build system for ${target.model.component} ${target.model.version.toString()}...`);
    
    // Update shell scripts with latest templates
    await this.createShellScriptStructure(target.model.origin, target.model.component);
    
    console.log(`✅ Build system updated with smart build templates`);
    console.log(`   Location: ${target.model.origin}`);
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
      'clean-global.sh', 
      'install-deps.sh',
      'build.sh',
      'start.sh',
      'start-clean.sh',
      'test.sh'
    ];

    for (const script of scripts) {
      // ✅ Use loadWeb4TSComponentTemplate to ensure we always use Web4TSComponent's templates
      const scriptContent = await this.loadWeb4TSComponentTemplate(`sh/${script}.template`, {
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
    // ✅ Use model.projectRoot for scripts/ (Path Authority)
    const projectRoot = this.model.projectRoot;
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
    // ✅ Use model.projectRoot for scripts/ (Path Authority)
    const projectRoot = this.model.projectRoot;
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
   * @TODO cliDefault format json
   * @cliValues format json bash text xml csv
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
