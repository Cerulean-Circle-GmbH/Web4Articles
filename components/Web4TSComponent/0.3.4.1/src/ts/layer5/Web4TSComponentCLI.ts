#!/usr/bin/env node

/**
 * Web4TSComponentCLI - Web4TSComponent CLI implementation with chaining support
 * Web4 pattern: Dependency-free CLI with component creation and chaining
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultWeb4TSComponent } from '../layer2/DefaultWeb4TSComponent.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';

interface MethodSignature {
  name: string;
  paramCount: number;
  isAsync: boolean;
}

export class Web4TSComponentCLI extends DefaultCLI {
  private tsComponent: DefaultWeb4TSComponent | null;
  protected methodSignatures: Map<string, MethodSignature> = new Map();

  constructor() {
    super(); // Call DefaultCLI constructor
    // Don't instantiate tsComponent for usage display - command-based instantiation only
    this.tsComponent = null;
    // Initialize with component class reference (NOT instance) - no garbage creation
    // ✅ Read version dynamically from package.json (single source of truth)
    const version = this.readVersionFromPackageJson();
    this.initWithComponentClass(DefaultWeb4TSComponent, 'Web4TSComponent', version);
    // Discover methods for chaining support
    this.discoverMethods();
  }

  /**
   * Read version - HYBRID APPROACH
   * 
   * TRUTH HIERARCHY:
   * 1. Directory name is authoritative (Web4 principle)
   * 2. package.json must match (validated/auto-fixed)
   * 3. Fallback to package.json if not in version directory
   * 
   * @cliHide
   */
  private readVersionFromPackageJson(): string {
    try {
      // Get the directory of this file
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      
      // Navigate up to component root (from layer5 to root: ../../../)
      const componentRoot = join(__dirname, '..', '..', '..');
      const componentDirName = basename(componentRoot);
      
      // Check if we're in a version directory
      const isVersionDir = /^\d+\.\d+\.\d+\.\d+$/.test(componentDirName);
      
      if (isVersionDir) {
        // Directory name is TRUTH
        const dirVersion = componentDirName;
        
        // Validate/fix package.json
        this.validateAndFixPackageJsonVersion(componentRoot, dirVersion);
        
        return dirVersion;
      }
      
      // Fallback: read from package.json
      const packageJsonPath = join(componentRoot, 'package.json');
      const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      console.warn(`⚠️  CLI not in version directory, using package.json: ${packageJson.version}`);
      return packageJson.version;
      
    } catch (error) {
      // Fallback only if everything fails
      console.error('⚠️  Warning: Could not determine version, using fallback');
      return '0.0.0';
    }
  }

  /**
   * Validate and auto-fix package.json version
   * @cliHide
   */
  private validateAndFixPackageJsonVersion(componentRoot: string, correctVersion: string): void {
    try {
      const packageJsonPath = join(componentRoot, 'package.json');
      const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      if (packageJson.version !== correctVersion) {
        console.error(`❌ VERSION MISMATCH DETECTED!`);
        console.error(`   Directory (TRUTH): ${correctVersion}`);
        console.error(`   package.json:      ${packageJson.version}`);
        console.error(`   Auto-fixing package.json...`);
        
        // Create backup
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/[T.]/g, '-').slice(0, -1);
        const backupPath = join(componentRoot, `package.json.backup.${timestamp}`);
        writeFileSync(backupPath, packageJsonContent);
        console.error(`   📦 Backup: package.json.backup.${timestamp}`);
        
        // Fix version
        packageJson.version = correctVersion;
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        console.error(`   ✅ Fixed to ${correctVersion}`);
      }
    } catch (error) {
      console.warn(`⚠️  Could not validate package.json: ${(error as Error).message}`);
    }
  }

  /**
   * Discover methods from component class for chaining support
   */
  protected discoverMethods(): void {
    const prototype = DefaultWeb4TSComponent.prototype as any;
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter(name => typeof (prototype as any)[name] === 'function')
      .filter(name => !name.startsWith('_') && name !== 'constructor')
      .filter(name => !['init', 'toScenario', 'validateModel', 'getModel'].includes(name));

    for (const methodName of methodNames) {
      const method = (prototype as any)[methodName];
      this.methodSignatures.set(methodName, {
        name: methodName,
        paramCount: method.length,
        isAsync: method.constructor.name === 'AsyncFunction'
      });
    }
  }

  /**
   * Static start method - Web4 radical OOP entry point
   */
  static async start(args: string[]): Promise<void> {
    const cli = new Web4TSComponentCLI();
    await cli.execute(args);
  }

  /**
   * Get component instance (Web4TSComponent-specific)
   */
  private getOrCreateTSComponent(): DefaultWeb4TSComponent {
    if (!this.tsComponent) {
      this.tsComponent = new DefaultWeb4TSComponent();
    }
    return this.tsComponent;
  }

  /**
   * Web4TSComponent-specific usage display using DefaultCLI dynamic generation
   */
  showUsage(): void {
    // Use DefaultCLI's auto-discovery which respects @cliHide annotations
    if (typeof super.generateStructuredUsage === 'function') {
      console.log(super.generateStructuredUsage());
    } else {
      // Implement showUsage directly since it's abstract
      console.log('Web4TSComponent CLI - Use --help for more information');
    }
  }

  /**
   * Execute CLI commands with Unit pattern - dynamic discovery with chaining support
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    try {
      await this.executeWithChaining(args);
    } catch (error) {
      console.error(this.formatError((error as Error).message));
      process.exit(1);
    }
  }

  /**
   * Execute commands with chaining support
   * Supports: web4tscomponent on Unit 0.3.0.5 tree 2
   */
  private async executeWithChaining(args: string[]): Promise<void> {
    let remainingArgs = [...args];
    
    while (remainingArgs.length > 0) {
      const command = remainingArgs[0];
      
      // Try dynamic command execution
      const result = await this.executeDynamicCommandWithChaining(command, remainingArgs.slice(1));
      
      if (result.executed) {
        // Command executed successfully, continue with remaining args
        remainingArgs = result.remainingArgs;
        continue;
      }

      // Special cases (minimal switch - only help)
      switch (command) {
        case 'help':
          this.showUsage();
      return;
          
        default:
          throw new Error(`Unknown command: ${command}`);
      }
    }
  }

  /**
   * Execute dynamic command and return remaining arguments for chaining
   */
  private async executeDynamicCommandWithChaining(command: string, args: string[]): Promise<{executed: boolean, remainingArgs: string[]}> {
    if (!this.methodSignatures.has(command)) {
      return { executed: false, remainingArgs: args };
    }

    const signature = this.methodSignatures.get(command)!;
    const minArgs = Math.min(signature.paramCount, 1); // At least 1 arg for most methods
    
    if (args.length < minArgs && signature.paramCount > 0) {
      throw new Error(`At least ${minArgs} arguments required for ${command} command`);
    }

    // Intelligently determine how many arguments this method consumes
    const consumedArgs = this.determineArgumentConsumption(command, args);
    const methodArgs = args.slice(0, consumedArgs);
    const remainingArgs = args.slice(consumedArgs);

    // Execute the method
    const componentInstance = this.getOrCreateTSComponent();
    const method = (componentInstance as any)[command];
    
    if (signature.isAsync) {
      await method.apply(componentInstance, methodArgs);
    } else {
      method.apply(componentInstance, methodArgs);
    }
    
    return { executed: true, remainingArgs };
  }

  /**
   * Intelligently determine how many arguments a method should consume
   * Stops at next known command to enable chaining
   */
  private determineArgumentConsumption(command: string, args: string[]): number {
    const signature = this.methodSignatures.get(command)!;
    
    // Special handling for methods with default parameters
    const methodSpecificMaxArgs = this.getMethodMaxArguments(command);
    const maxArgs = methodSpecificMaxArgs || signature.paramCount;
    
    // Look for next command in the arguments
    for (let i = 0; i < Math.min(maxArgs, args.length); i++) {
      if (this.methodSignatures.has(args[i])) {
        // Found next command, consume up to this point
        return i;
      }
    }
    
    // No next command found, consume up to method's parameter count
    return Math.min(maxArgs, args.length);
  }

  /**
   * Get maximum arguments for methods with default parameters
   */
  private getMethodMaxArguments(command: string): number | null {
    // Methods with default parameters that should consume more args than function.length shows
    const methodMaxArgs: { [key: string]: number } = {
      'tree': 2,  // depth and showHidden parameters (both have defaults)
      'create': 3, // name, version, options (options has default)
      'upgrade': 1, // versionType
      'on': 2, // component and version
      'setLatest': 1, // targetVersion (has default)
      'setDev': 1, // targetVersion (has default)
      'setTest': 1, // targetVersion (has default)
      'setProd': 1, // targetVersion (has default)
      'removeVersion': 2, // componentName and version (both have defaults)
      'removeComponent': 1 // componentName (has default)
    };
    
    return methodMaxArgs[command] || null;
  }
}

// Static entry point for shell execution - Web4 radical OOP pattern
if (import.meta.url === `file://${process.argv[1]}`) {
  Web4TSComponentCLI.start(process.argv.slice(2));
}