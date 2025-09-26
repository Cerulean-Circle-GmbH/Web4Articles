/**
 * RequirementCLI - Revolutionary Requirement Management CLI with Unit 0.3.0.5 Principles
 * Web4 pattern: Extension over modification - extends DefaultCLI without modifying shared component
 * Purpose: Requirement-specific CLI functionality with command chaining and JEDI MODE search
 */

import { DefaultCLI } from '../layer2/DefaultCLI.js';
import { DefaultRequirement } from '../layer2/DefaultRequirement.js';
import { RequirementIdentifier } from '../layer3/RequirementIdentifier.type.js';

/**
 * Revolutionary RequirementCLI extending DefaultCLI
 * Web4 patterns: Extension over modification, component-specific functionality
 * 
 * @example
 * ```bash
 * # ✅ COMMAND CHAINING: Natural language DSL
 * requirement create "Auth Fix" "Fix authentication" set priority high md execute
 * 
 * # ✅ JEDI MODE: Enhanced search with interactive browsing
 * requirement find "authentication" list
 * 
 * # ✅ UNION TYPES: Flexible parameter handling
 * requirement set 44443290-015c-4720-be80-c42caf842252 implemented true
 * requirement set requirement.json status completed
 * ```
 */
export class RequirementCLI extends DefaultCLI {
  private requirement: DefaultRequirement;

  /**
   * Web4 Empty Constructor with proper extension
   * Extends DefaultCLI without modifying shared component
   */
  constructor() {
    super(); // Call parent constructor
    
    // Initialize with Requirement-specific component
    this.requirement = new DefaultRequirement();
    this.initWithComponentClass(DefaultRequirement, 'Web4Requirement', '0.3.0.5');
  }

  /**
   * Static start method - Web4 radical OOP pattern
   * Entry point for RequirementCLI operations
   */
  static async start(args: string[]): Promise<void> {
    const cli = new RequirementCLI();
    await cli.execute(args);
  }

  /**
   * Execute CLI command with requirement-specific enhancements
   * Web4 pattern: Override parent method with component-specific logic
   */
  async execute(args: string[]): Promise<void> {
    if (args.length === 0) {
      this.showUsage();
      return;
    }

    const command = args[0].toLowerCase();

    // Check for method chaining commands first
    if (this.isMethodChain(args)) {
      await this.executeMethodChain(args);
      return;
    }

    // Handle individual commands
    try {
      switch (command) {
        case 'create':
          await this.createRequirement(args.slice(1));
          break;
        case 'on':
          await this.setComponentContext(args.slice(1));
          break;
        case 'md':
          await this.generateMD(args.slice(1));
          break;
        case 'set':
          await this.setProperty(args.slice(1));
          break;
        case 'update':
          await this.updateOverview(args.slice(1));
          break;
        case 'mv':
          await this.moveRequirement(args.slice(1));
          break;
        case 'delete':
          await this.deleteRequirement(args.slice(1));
          break;
        case 'find':
          await this.findRequirements(args.slice(1));
          break;
        case 'list':
          await this.listResults(args.slice(1));
          break;
        case 'replace':
          await this.replacePattern(args.slice(1));
          break;
        case 'process-file':
        case 'processfile':
          await this.processFile(args.slice(1));
          break;
        case 'help':
        case '--help':
        case '-h':
          this.showUsage();
          break;
        default:
          // Try dynamic command execution from parent
          await this.executeDynamicCommand(command, args.slice(1));
          break;
      }
    } catch (error) {
      console.error(`❌ Command failed: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  /**
   * Execute method chaining commands
   * Web4 pattern: Natural language DSL with command chaining
   */
  private async executeMethodChain(args: string[]): Promise<void> {
    let currentRequirement = new DefaultRequirement();
    let i = 0;

    while (i < args.length) {
      const method = args[i].toLowerCase();

      switch (method) {
        case 'create':
          if (i + 2 >= args.length) {
            throw new Error('create requires title and description');
          }
          await currentRequirement.create(args[i + 1], args[i + 2]);
          i += 3;
          break;

        case 'set':
          if (i + 2 >= args.length) {
            throw new Error('set requires property and value');
          }
          await currentRequirement.set(args[i + 1] as RequirementIdentifier, args[i + 2], args[i + 3] || '');
          i += 4;
          break;

        case 'md':
          await currentRequirement.md(args[i + 1]);
          i += args[i + 1] ? 2 : 1;
          break;

        case 'find':
          if (i + 1 >= args.length) {
            throw new Error('find requires search term');
          }
          await currentRequirement.find(args[i + 1]);
          i += 2;
          break;

        case 'list':
          await currentRequirement.list();
          i += 1;
          break;

        case 'execute':
          await currentRequirement.execute();
          console.log('✅ Command chain executed successfully');
          return;

        default:
          throw new Error(`Unknown method in chain: ${method}`);
      }
    }

    // Auto-execute if no explicit execute
    await currentRequirement.execute();
    console.log('✅ Command chain executed successfully');
  }

  /**
   * Check if arguments represent a method chain
   */
  private isMethodChain(args: string[]): boolean {
    const chainMethods = ['create', 'set', 'md', 'find', 'list', 'execute'];
    let methodCount = 0;

    for (const arg of args) {
      if (chainMethods.includes(arg.toLowerCase())) {
        methodCount++;
      }
    }

    return methodCount >= 2; // At least 2 chainable methods
  }

  /**
   * Create new requirement
   */
  private async createRequirement(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ Usage: requirement create "title" "description"');
      return;
    }

    const requirement = new DefaultRequirement();
    await (await requirement.create(args[0], args[1])).execute();
  }

  /**
   * Set component context
   */
  private async setComponentContext(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ Usage: requirement on <component> <version>');
      return;
    }

    this.requirement.on(args[0], args[1]);
  }

  /**
   * Generate markdown view
   */
  private async generateMD(args: string[]): Promise<void> {
    const requirement = new DefaultRequirement();
    await (await requirement.md(args[0])).execute();
  }

  /**
   * Set requirement property
   */
  private async setProperty(args: string[]): Promise<void> {
    if (args.length < 3) {
      console.error('❌ Usage: requirement set <uuid|reqfile> <property> <value>');
      return;
    }

    const requirement = new DefaultRequirement();
    await (await requirement.set(args[0] as RequirementIdentifier, args[1], args[2])).execute();
  }

  /**
   * Update requirements overview
   */
  private async updateOverview(args: string[]): Promise<void> {
    const requirement = new DefaultRequirement();
    await (await requirement.update()).execute();
  }

  /**
   * Move requirement to different component
   */
  private async moveRequirement(args: string[]): Promise<void> {
    if (args.length < 3) {
      console.error('❌ Usage: requirement mv <uuid|reqfile> <component> <version>');
      return;
    }

    const requirement = new DefaultRequirement();
    await (await requirement.mv(args[0] as RequirementIdentifier, args[1], args[2])).execute();
  }

  /**
   * Delete requirement
   */
  private async deleteRequirement(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: requirement delete <uuid|reqfile>');
      return;
    }

    const requirement = new DefaultRequirement();
    await (await requirement.delete(args[0] as RequirementIdentifier)).execute();
  }

  /**
   * Find requirements with JEDI MODE search
   */
  private async findRequirements(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: requirement find <searchTerm>');
      return;
    }

    const requirement = new DefaultRequirement();
    await (await requirement.find(args[0])).execute();
  }

  /**
   * List search results in interactive viewer
   */
  private async listResults(args: string[]): Promise<void> {
    const requirement = new DefaultRequirement();
    await (await requirement.list()).execute();
  }

  /**
   * Replace requirement pattern with dual link
   */
  private async replacePattern(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ Usage: requirement replace "pattern" <filePath> [targetUuid]');
      return;
    }

    const requirement = new DefaultRequirement();
    await (await requirement.replace(args[0], args[1], args[2])).execute();
  }

  /**
   * Process file for requirement patterns
   */
  private async processFile(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: requirement process-file <filePath>');
      return;
    }

    const requirement = new DefaultRequirement();
    await (await requirement.processFile(args[0])).execute();
  }

  /**
   * Show usage information with requirement-specific help
   * Override parent method with component-specific documentation
   */
  showUsage(): void {
    const usage = this.generateStructuredUsage();
    console.log(usage);
  }

  /**
   * Generate structured usage documentation
   * Web4 pattern: Override parent method with component-specific content
   */
  generateStructuredUsage(): string {
    return `Web4Requirement CLI Tool v0.3.0.5 - Revolutionary Requirement Management with Unit 0.3.0.5 Principles

REVOLUTIONARY FEATURES:
• Command Chaining: Natural language DSL with fluent interface
• JEDI MODE Search: Enhanced grep with precise line:column positioning
• Union Types: Flexible parameter handling (UUID or file paths)
• Interactive Browsing: Less viewer for search results with GitTextIOR examples

COMMAND CHAINING EXAMPLES:
requirement create "Auth Fix" "Fix authentication" set priority high md execute
requirement find "authentication" list
requirement on Unit 0.3.0.5 create "Unit Enhancement" "Add new features" execute

CORE COMMANDS:

create <title> <description>
  Create new requirement with title and description

on <component> <version>
  Set component context for subsequent operations

md <folder> <?optional>
  Generate markdown view from requirement

set <uuid|reqfile> <property> <value>
  Set requirement property value with union type support

update
  Update requirements overview

mv <uuid|reqfile> <component> <version>
  Move requirement to different component/version

delete <uuid|reqfile>
  Delete requirement by identifier

find <searchTerm>
  Find requirements with JEDI MODE positioning

list
  Display search results in interactive less viewer

replace <pattern> <filePath> <uuid> <?optional>
  Replace requirement pattern with dual link

process-file <filePath>
  Process file for requirement patterns and replace with dual links

PARAMETER TYPES:
<uuid|reqfile>     UUID string or requirement file path
<title>           Requirement title (quoted string)
<description>     Detailed requirement description
<component>       Component name (e.g., Unit, User)
<version>         Component version (e.g., 0.3.0.5, latest)
<property>        Property name (status, priority, implemented)
<value>           Property value
<searchTerm>      Text to search for in requirements
<filePath>        File path relative to project root
<pattern>         Requirement pattern to replace

JEDI MODE EXAMPLES:
requirement find "authentication"     # Find with precise positioning
requirement find "authentication" list # Interactive browsing

UNION TYPE EXAMPLES:
requirement set 44443290-015c-4720-be80-c42caf842252 implemented true
requirement set requirement.json priority high
requirement delete requirement.scenario.json

---

Web4Requirement 0.3.0.5 - Revolutionary requirement management with atomic executable element architecture`;
  }

  /**
   * Get requirement-specific component instance
   * Override parent method with component-specific logic
   */
  protected getComponentInstance(): DefaultRequirement {
    if (!this.requirement) {
      this.requirement = new DefaultRequirement();
    }
    return this.requirement;
  }

  /**
   * Get component-specific help text
   * Override parent method with requirement-specific content
   */
  protected getComponentSpecificHelp(): string {
    return 'Web4Requirement 0.3.0.5 - Revolutionary requirement management with Unit 0.3.0.5 principles';
  }
}