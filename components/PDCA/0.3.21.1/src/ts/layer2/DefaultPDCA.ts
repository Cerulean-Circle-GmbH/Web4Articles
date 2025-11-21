/**
 * DefaultPDCA - PDCA Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { PDCA } from '../layer3/PDCA.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { PDCAModel } from '../layer3/PDCAModel.interface.js';
import { User } from '../layer3/User.interface.js';
import { MethodSignature } from '../layer3/MethodSignature.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

/**
 * Training topic definition - CMM3: Objective, Reproducible, Verifiable
 */
interface TrainingTopic {
  title: string;
  description: string;
  requiredReading: Array<{
    path: string;
    reason: string;
    depth: number;
  }>;
  keyLessons: string[];
  verificationChecklist: string[];
}

export class DefaultPDCA implements PDCA {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model: PDCAModel;
  private web4ts?: any; // Lazy-initialized Web4TSComponent for delegation (dynamic import, no static dependency)
  private user?: User; // Optional User service (lazy initialization) - @pdca 2025-11-03-1135.pdca.md
  private methods: Map<string, MethodSignature> = new Map(); // @pdca 2025-11-05-UTC-2301 - Match Web4TSComponent type

  constructor() {
    // Empty constructor - Web4 pattern
    // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Initialize with component name for CLI display
    this.model = {
      uuid: crypto.randomUUID(),
      name: '',
      origin: '',
      definition: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      component: 'PDCA',  // For CLI display
      version: '0.3.21.1'             // Component version
    };
  }

  /**
   * Check if method exists (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  hasMethod(name: string): boolean {
    return this.methods.has(name);
  }
  
  /**
   * Get method signature (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  getMethodSignature(name: string): MethodSignature | null {
    return this.methods.get(name) || null;
  }
  
  /**
   * List all method names (Component interface)
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  listMethods(): string[] {
    return Array.from(this.methods.keys());
  }

  /**
   * Discover public methods for CLI completion
   * @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md - Method discovery for tab completion
   * @cliHide
   */
  private discoverMethods(): void {
    const prototype = Object.getPrototypeOf(this);
    const methodNames = Object.getOwnPropertyNames(prototype)
      .filter((name) => typeof prototype[name] === "function")
      .filter((name) => !name.startsWith("_") && name !== "constructor")
      .filter((name) => !["init", "toScenario", "hasMethod", "getMethodSignature", "listMethods", "discoverMethods"].includes(name));

    for (const methodName of methodNames) {
      const method = prototype[methodName];
      this.methods.set(methodName, {
        name: methodName,
        paramCount: method.length,
        isAsync: method.constructor.name === "AsyncFunction",
      });
    }
  }

  /**
   * Lazy initialization of User service for owner data generation
   * NOT a build dependency - warns if unavailable, continues with fallback
   * @pdca 2025-11-03-1135.pdca.md - User service integration pattern
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
   * Lazy initialization of Web4TSComponent for delegation (DRY principle)
   * Dynamic imports resolve paths at runtime, enabling location-independent operation
   * @cliHide
   */
  private async getWeb4TSComponent(): Promise<any> {
    if (this.web4ts) return this.web4ts;

    const path = await import('path');
    const url = new URL(import.meta.url);
    const __filename = url.pathname;
    const componentRoot = path.resolve(path.dirname(__filename), '../../..');

    // @pdca 2025-11-10-UTC-1230.test-isolation-path-pollution-analysis.pdca.md
    // Web4 Principle: Detect project root correctly for test isolation
    // Component path: .../test/data/components/ComponentName/0.1.0.0
    // OR: .../components/ComponentName/0.1.0.0
    // Project root is 2 levels up from component directory
    // (ComponentName/ and components/)
    const componentsDir = path.dirname(path.dirname(componentRoot)); // Go up 2: version → component → components
    const projectRoot = path.dirname(componentsDir); // Go up 1 more: components → project root
    
    // @pdca 2025-11-10-UTC-1230.test-isolation-path-pollution-analysis.pdca.md
    // Web4 Principle: Detect test isolation from model paths, NOT environment variables
    // Test isolation: projectRoot contains '/test/data'
    const isTestIsolation = projectRoot.includes('/test/data');
    
    // @pdca 2025-11-10-UTC-1010.pdca.md - Set THIS component's paths for delegation
    // When Web4TSComponent reads context, it needs to know THIS component's paths
    this.model.componentRoot = componentRoot;
    this.model.projectRoot = projectRoot;
    this.model.targetDirectory = projectRoot;
    this.model.targetComponentRoot = componentRoot;
    this.model.isTestIsolation = isTestIsolation;

    // Import Web4TSComponent and SemanticVersion dynamically
    const web4tscomponentModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js`
    );
    const semanticVersionModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/SemanticVersion.js`
    );
    const { DefaultWeb4TSComponent } = web4tscomponentModule;
    const { SemanticVersion } = semanticVersionModule;

    // ✅ CRITICAL: Initialize Web4TSComponent for delegation
    // @pdca 2025-11-03-UTC-1237.pdca.md - Full delegation initialization
    // @pdca 2025-11-04-UTC-1630.pdca.md - Added projectRoot for version display fix
    // @pdca 2025-11-10-UTC-1010.pdca.md - DO NOT override component identity!
    // Web4TSComponent must retain its own identity ('Web4TSComponent')
    // The delegating component's identity will be set via context in delegateToWeb4TS()
    this.web4ts = new DefaultWeb4TSComponent().init({
      model: {
        // DO NOT set 'component' here - let Web4TSComponent keep its own identity
        version: await SemanticVersion.fromString(this.model.version || '0.0.0.0'), // THIS component's version
        componentRoot: componentRoot,              // THIS component's root directory
        projectRoot: projectRoot,                  // Project root for Path Authority (version display needs this)
        targetDirectory: projectRoot               // Project root for path authority
      }
    });

    return this.web4ts;
  }

  /**
   * ✅ REMOVED: delegateToWeb4TS() helper method
   * 
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
   * 
   * This method is NO LONGER NEEDED! DelegationProxy automatically intercepts
   * missing method calls and delegates them to Web4TSComponent with proper context.
   * 
   * The old pattern was:
   *   private async delegateToWeb4TS(method, ...args) { ... }
   * 
   * The new pattern is:
   *   DelegationProxy.start(component) wraps the component in a Proxy
   *   that automatically delegates missing methods.
   * 
   * Benefits:
   *   - Zero boilerplate in generated components
   *   - Automatic delegation of ALL Web4TSComponent methods
   *   - DRY: delegation logic is in ONE place (DelegationProxy)
   */

  /**
   * @cliHide
   * @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
   * ✅ RADICAL OOP: Component knows ONLY its own methods
   */
  async init(scenario?: Scenario<PDCAModel>): Promise<this> {
    if (scenario?.model) {
      this.model = { ...this.model, ...scenario.model };
    }
    
    // Discover OWN methods only (Radical OOP)
    this.discoverMethods();
    
    // @pdca 2025-11-10-UTC-2200.fix-delegated-method-completion-radical-oop.pdca.md
    // ❌ REMOVED: Component should NOT discover delegated methods
    // ✅ RADICAL OOP: CLI discovers delegated methods separately via getDelegationTarget()
    // Component knows ONLY its own methods (create, process, completion)
    
    return this;
  }

  /**
   * @cliHide
   * @pdca 2025-11-03-1135.pdca.md - Use User service with fallback pattern
   */
  async toScenario(name?: string): Promise<Scenario<PDCAModel>> {
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
          component: 'PDCA',
          version: '0.3.21.1'
        }
      });
      ownerData = Buffer.from(fallbackJson).toString('base64');
    }

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'PDCA',
        version: '0.3.21.1'
      },
      owner: ownerData,
      model: this.model
    };
  }

  /**
   * Create example operation for PDCA
   * @param input Input data to process
   * @param format Output format (json, text, xml)
   * @cliSyntax input format
   * @cliDefault format json
   */
  async create(input: string, format: string = 'json'): Promise<this> {
    console.log(`🚀 Creating ${input} in ${format} format`);
    this.model.name = input;
    this.model.updatedAt = new Date().toISOString();
    console.log(`✅ PDCA operation completed`);
    return this;
  }

  /**
   * Process data through PDCA logic
   * @param data Data to process
   * @cliSyntax data
   */
  async process(data: string): Promise<this> {
    console.log(`🔧 Processing: ${data}`);
    this.model.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * ✅ REMOVED: Explicit delegation methods (info, test, build, clean, tree, links)
   * 
   * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
   * 
   * These methods are now automatically delegated via DelegationProxy.
   * No need for explicit boilerplate!
   * 
   * Proxy pattern intercepts missing methods and delegates them to Web4TSComponent
   * with proper context, display properties, and test isolation awareness.
   * 
   * Methods automatically delegated:
   * - info(topic)           - Show component information
   * - test(scope, ...refs)  - Run tests with auto-promotion
   * - build()               - Build component
   * - clean()               - Clean build artifacts
   * - tree(depth, hidden)   - Show directory structure
   * - links(action)         - Show/manage version links
   * - upgrade(version)      - Upgrade component version
   * - ... and any future Web4TSComponent methods!
   */

  /**
   * Test and discover tab completions for debugging and development
   * @param what Type of completion to test: "method" or "parameter"
   * @param filter Optional prefix to filter results (e.g., "v" shows only validate*, verify*, etc.)
   * @cliSyntax what filter
   * @cliDefault filter ""
   */
  async completion(what: string, filter?: string): Promise<this> {
    const context = this.getComponentContext();
    
    // OOP: Instantiate own CLI and call completeParameter directly (no shell!)
    const { PDCACLI } = await import('../layer5/PDCACLI.js');
    const cli = new PDCACLI();
    
    if (!context) {
      // No context - test completions on PDCA itself
      console.log(`🔍 Discovering ${what === 'method' ? 'methods' : 'parameter completions'} on PDCA${filter ? ` (filter: ${filter})` : ''}`);
      console.log(`---`);
      
      // Call completeParameter directly via OOP (completeParameter is on DefaultCLI)
      await cli.completeParameter('completionNameParameterCompletion', 'completion', what, filter || '');
    } else {
      // Context loaded - delegate to web4tscomponent for target component discovery
      const web4ts = await this.getWeb4TSComponent();
      await web4ts.completion(what, filter);
    }
    
    return this;
  }

  /**
   * @cliHide
   */
  protected getComponentContext(): { component: string; version: string; path: string } | null {
    const context = this.model as any;
    if (context.contextComponent && context.contextVersion && context.contextPath) {
      return {
        component: context.contextComponent,
        version: context.contextVersion,
        path: context.contextPath
      };
    }
    return null;
  }
  private async getProjectRoot(): Promise<string> {
    const path = await import('path');
    const fs = await import('fs/promises');
    
    // Start from current working directory
    let currentDir = process.cwd();
    
    while (currentDir !== '/') {
      try {
        // Check if .git exists (file or directory)
        const gitPath = path.join(currentDir, '.git');
        await fs.stat(gitPath);
        // Found .git, this is the project root
        return currentDir;
      } catch {
        // .git not found, go up one directory
        currentDir = path.dirname(currentDir);
      }
    }
    
    // Fallback to current directory if no .git found
    return process.cwd();
  }
  private getOrderedTopicsInternal(): string[] {
    return [
      'start',
      'pdca',
      'git-protocol',
      'cmm',
      'dual-links',
      'ensure-links',
      'component-upgrade',
      'merge',
      'component',
      'feature-development',
      'web4-vs-nodejs',
      'tech-stack',
      'test-workflow',
      'test-without-versioning',
      'test-first',
      'interpret-instructions',
      'collaborate',
      'chat-response',
      'report',
      'license-headers',
      'decide'
    ];
  }

  /**
   * Get available topics count (internal helper)
   * @cliHide
   */
  private getAvailableTopicsCountInternal(): number {
    return this.getOrderedTopicsInternal().length;
  }

  /**
   * Get training topic info by key (internal helper)
   * @cliHide
   */
  private getTrainingTopicInternal(key: string): any {
    const trainingTopics = this.getAllTrainingTopicsInternal();
    return trainingTopics[key] || null;
  }

  /**
   * Get all training topics definitions (internal helper)
   * @cliHide
   */
  private getAllTrainingTopicsInternal(): { [key: string]: any } {
    return {
      'start': {
        title: '🚀 How to Start: Background Agent Startup Protocol',
      },
      'pdca': {
        title: '📝 How to PDCA: Creating CMM3-Compliant Documentation',
      },
      'git-protocol': {
        title: '🔐 How to Git Protocol: Atomic Commands & Safety',
      },
      'cmm': {
        title: '📊 How to CMM: Understanding Maturity Levels',
      },
      'dual-links': {
        title: '🔗 How to Dual Links: GitHub + Local References',
      },
      'ensure-links': {
        title: '✅ How to Ensure Links: Validation & Verification',
      },
      'component-upgrade': {
        title: '🔄 How to Component Upgrade: Version Promotion',
      },
      'merge': {
        title: '🔄 How to Merge: Component merge workflow',
      },
      'component': {
        title: '🔧 How to Component: Web4 Component System',
      },
      'feature-development': {
        title: '🛠️ How to Feature Development: RAG-Powered Test-First CMM3 Pattern',
      },
      'web4-vs-nodejs': {
        title: '⚡ How to Web4 vs Node.js: Understanding the Web4 Framework',
      },
      'tech-stack': {
        title: '🛠️ How to Tech Stack: Project Technology & Testing Framework',
      },
      'test-workflow': {
        title: '🧪 How to Test Workflow: Component Testing Cycle',
      },
      'test-without-versioning': {
        title: '🧪 How to Test Without Versioning: Minimal Testing Pattern',
      },
      'test-first': {
        title: '🧪 How to Test First: Test-Driven Development for CMM3',
      },
      'interpret-instructions': {
        title: '🧠 How to Interpret Instructions: Zero-Knowledge Method Pattern',
      },
      'collaborate': {
        title: '🤝 How to Collaborate: TRON Handshake and Feedback Points',
      },
      'chat-response': {
        title: '💬 How to Chat Response: Communication Pattern',
      },
      'report': {
        title: '📋 How to Report: CMM3 Reporting Standards',
      },
      'license-headers': {
        title: '©️ How to License Headers: MIT License Application',
      },
      'decide': {
        title: '⚖️ How to Decide: QA Decision Framework for PDCAs',
      }
    };
  }
  async trainAI(topic: string = ''): Promise<this> {
    console.log(`\n🎓 AI Training Module - CMM3 Reproducible Learning\n`);

    // Check if topic is missing or empty - show comprehensive help
    if (!topic || topic.trim() === '') {
      console.log(`🚨 CRITICAL: Missing Topic Parameter\n`);
      console.log(`════════════════════════════════════════════════════════════════════════════════`);
      console.log(`\n❌ YOU JUST EXPERIENCED THE PAIN THIS TOOL EXISTS TO PREVENT\n`);
      console.log(`You called a method without knowing its parameters.`);
      console.log(`You felt frustrated, confused, unsure what to do next.`);
      console.log(`You wasted time discovering what you SHOULD have read first.\n`);
      console.log(`🔴 THIS IS EXACTLY WHY trainAI EXISTS - TO PREVENT THIS FEELING!\n`);
      console.log(`════════════════════════════════════════════════════════════════════════════════\n`);
      console.log(`💡 The Feature Development Pattern (feature-development):\n`);
      console.log(`   Phase 0 - RAG Preparation: Query trainAI BEFORE planning`);
      console.log(`   "30 min reading → 2-3 hours debugging saved"`);
      console.log(`   "Read to depth 3: document → references → secondary references"`);
      console.log(`   "Build complete mental model BEFORE coding (prevents assumption cascade)"\n`);
      console.log(`🎯 YOU MUST READ BEFORE ACTING - NOT DISCOVER WHILE ACTING\n`);
      console.log(`   Every method you call has documentation you should query FIRST.`);
      console.log(`   Every feature you build has patterns you should learn FIRST.`);
      console.log(`   Every git operation has protocols you should understand FIRST.\n`);
      console.log(`📊 The Cost of Skipping Reading:\n`);
      console.log(`   ❌ Skip reading → CMM1 chaos → 8 CMM3 violations → Delete and restart`);
      console.log(`   ❌ Skip reading → git protocol violation → Interactive commands → Stash chaos`);
      console.log(`   ❌ Skip reading → Wrong version → Manual edits → Break workflow`);
      console.log(`   ✅ Read FIRST → CMM3 compliant → One loop success → TRON validation\n`);
      console.log(`🏆 The Exponential Cost Principle:\n`);
      console.log(`   - Doing it WRONG first, then RIGHT: 100x more expensive`);
      console.log(`   - Doing it RIGHT first: Normal cost`);
      console.log(`   - The knowledge EXISTS in trainAI - USE IT!\n`);
      console.log(`🔄 CRITICAL: After 'Summarizing Chat' Events:\n`);
      console.log(`   When you see 'summarizing chat' event, you LOSE detailed context.`);
      console.log(`   IMMEDIATELY use trainAI to refresh your understanding:\n`);
      console.log(`   ✅ CORRECT: Recognize summary → trainAI start → Review protocols → Continue work`);
      console.log(`   ❌ WRONG: Continue mechanically → Repeat old mistakes → Break processes\n`);
      console.log(`   Summary events are NOT permission to forget - they're triggers to REFRESH.`);
      console.log(`   The same mistakes you made before summary will happen again unless you READ.\n`);
      console.log(`════════════════════════════════════════════════════════════════════════════════\n`);
      console.log(`📚 Available Training Topics (${this.getAvailableTopicsCountInternal()} topics): How To...\n`);
      
      const orderedTopics = this.getOrderedTopicsInternal();
      orderedTopics.forEach((key, i) => {
        const topicInfo = this.getTrainingTopicInternal(key);
        const emoji = key.includes('start') ? '🚀' :
                     key.includes('pdca') ? '📝' :
                     key.includes('git-protocol') ? '🔐' :
                     key.includes('cmm') ? '📊' :
                     key.includes('component') ? '🔧' :
                     key.includes('feature') ? '🛠️' :
                     key.includes('tech-stack') ? '🛠️' :
                     key.includes('test') ? '🧪' :
                     key.includes('dual') ? '🔗' :
                     key.includes('ensure') ? '✅' :
                     key.includes('merge') ? '🔄' :
                     key.includes('interpret') ? '🧠' :
                     key.includes('collaborate') ? '🤝' :
                     key.includes('chat') ? '💬' :
                     key.includes('report') ? '📋' :
                     key.includes('license') ? '©️' :
                     key.includes('decide') ? '⚖️' :
                     key.includes('web4-vs-nodejs') ? '⚡' : '📖';
        console.log(`   ${i + 1}:${key.padEnd(35)} ${emoji} ${topicInfo ? topicInfo.title.replace(/^[^a-zA-Z]+\s*/, '') : ''}`);
      });
      
      console.log(`💡 Usage Examples:\n`);
      console.log(`   pdca trainAI feature-development  # Learn BEFORE building features`);
      console.log(`   pdca trainAI component            # Learn BEFORE modifying components`);
      console.log(`   pdca trainAI start                # Learn startup protocol`);
      console.log(`   pdca trainAI 9                    # Use topic number for quick access\n`);
      console.log(`🧠 MEMORIZE THE KEYWORDS - Use Them as Triggers:\n`);
      console.log(`   When you see these keywords in user prompts, READ the training FIRST:\n`);
      console.log(`   - "start", "startup", "begin" → Read 'start' topic`);
      console.log(`   - "pdca", "document" → Read 'pdca' topic`);
      console.log(`   - "feature", "implement", "build" → Read 'feature-development' topic`);
      console.log(`   - "component", "modify", "web4" → Read 'component' topic`);
      console.log(`   - "test", "testing" → Read 'test-first' or 'test-workflow' topic`);
      console.log(`   - "vitest", "jest", "tech", "stack" → Read 'tech-stack' topic`);
      console.log(`   - "git", "commit", "push" → Read git protocol in 'start' or 'pdca' topic`);
      console.log(`   - "decision", "qa", "choose" → Read 'decide' topic`);
      console.log(`   - "link", "dual" → Read 'dual-links' or 'ensure-links' topic\n`);
      console.log(`   DON'T wait to discover the right approach - READ when you see the keyword!\n`);
      console.log(`🎯 REMEMBER: Perfect hindsight is worthless. Proactive reading is priceless.\n`);
      console.log(`   You KNOW what you should have read AFTER you fail.`);
      console.log(`   You SHOULD read it BEFORE you start.\n`);
      console.log(`════════════════════════════════════════════════════════════════════════════════\n`);
      
      return this;
    }

    // Future trainAI topics from gap analysis (2025-10-21-UTC-1047):
    // - how-to-environment-setup: Shell config, git setup, source.env
    // - how-to-agent-safety: Interactive command avoidance, safety protocols (CRITICAL)
    // - how-to-session-structure: Directory organization, branch management
    // - how-to-agent-identity: RequestID, agent registry
    // See: scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1047.trainai-gaps.pdca.md

    // Single source of truth: Use getOrderedTopicsInternal() to get really available topics
    const orderedTopics = this.getOrderedTopicsInternal();

    // Handle numeric input - map number to topic name
    let actualTopic = topic;
    if (/^\d+$/.test(topic)) {
      const index = parseInt(topic, 10) - 1;
      if (index >= 0 && index < orderedTopics.length) {
        actualTopic = orderedTopics[index];
        console.log(`📍 Selected: ${index + 1}:${actualTopic}\n`);
      } else {
        console.log(`❌ Error: Invalid topic number. Valid range: 1-${orderedTopics.length}\n`);
        console.log(`\n📚 Available topics:`);
        orderedTopics.forEach((key, i) => {
          console.log(`   ${i + 1}:${key}`);
        });
        console.log(`\n💡 Usage: pdca trainAI <number>  or  pdca trainAI <topic-name>\n`);
        return this;
      }
    } else {
      console.log(`📚 Topic: ${actualTopic}\n`);
    }

    // Training topic definitions - CMM3: Objective, Reproducible, Verifiable
    const trainingTopics: { [key: string]: TrainingTopic } = {
      'start': {
        title: '🚀 How to Start: Background Agent Startup Protocol',
        description: 'Complete startup sequence for new agents, including CMM4 understanding, identity setup, and initial PDCA creation',
        requiredReading: [
          {
            path: 'README.md',
            reason: 'Main entry point - defines 12-step startup protocol',
            depth: 3
          },
          {
            path: 'scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md',
            reason: 'CRITICAL: Must understand CMM4 framework FIRST before touching anything',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
            reason: 'Learn PDCA creation and compliance rules',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/template.md',
            reason: 'Official PDCA template structure',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md',
            reason: 'Decision-making framework for QA and user alignment',
            depth: 2
          }
        ],
        keyLessons: [
          '🔴 ALWAYS read CMM4 framework (howto.cmm.md) FIRST',
          '✅ Use component methods (web4tscomponent) for version control - NEVER manual cp/mkdir',
          '✅ Follow startup decisions: Focus, Role, Duration, Location, Identity',
          '✅ Create session-start PDCA using timestamp-only filename',
          '✅ Verify CMM3 compliance: objective, reproducible, verifiable',
          '⚠️ Read to depth 3: document → references → secondary references',
          '🔗 Session end: Validate dual links with `pdca ensureValidLinks <session-dir>`',
          '🛑 Feedback points: After showing results, STOP and wait for user',
          '🤝 Collaboration: User controls loop, you execute within it',
          '⚠️ "Show me" = show + STOP, not show + analyze + implement'
        ],
        verificationChecklist: [
          'Can recite the 12 startup steps from README.md',
          'Understands CMM1-CMM4 progression and why CMM4 is feedback loop mastery',
          'Can create agent identity file in correct location',
          'Can create session-start PDCA with correct filename format',
          'Knows to use web4tscomponent for ALL version operations',
          'Validates all dual links before session end',
          'Can recognize feedback points in startup sequence',
          'Knows when to wait vs continue',
          'Understands collaboration model'
        ]
      },
      'pdca': {
        title: '📝 How to PDCA: Creating CMM3-Compliant Documentation',
        description: 'Learn to create excellent PDCAs with proper structure, links, and compliance',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/_shared/PDCA/template.md',
            reason: 'Single source of truth for PDCA format',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
            reason: 'Consolidated guidelines for PDCA excellence',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: 'Complete CMM3 compliance verification',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ Use TRON format: Trigger (verbatim), Response, Outcome, Next',
          '✅ Dual linking: backward links to previous work, forward links to outcomes',
          '✅ Timestamp-only filenames: YYYY-MM-DD-UTC-HHMM.pdca.md (NO descriptive text)',
          '✅ DRY principle: cross-reference instead of duplicating content',
          '✅ Always include: "Never 2 1 (TO ONE). Always 4 2 (FOR TWO)." at end',
          '⚠️ CMM badges track compliance status throughout PDCA lifecycle',
          '🔗 Dual link format: [GitHub](URL) | [§/path](path) - see dual-links',
          '🔗 Generate dual links: `pdca getDualLink <file>` (auto-fixes git status)',
          '🔗 Validate links: `pdca ensureValidLinks <file>` before PDCA completion',
          '🚨 GIT COMMIT FORMAT (CMM3 0h/i): `git commit -m "PDCAfilename.pdca.md"` - LITERAL filename ONLY',
          '❌ NEVER descriptive messages: "PDCA: Enhanced..." is WRONG - use "2025-10-29-UTC-2330.pdca.md"',
          '✅ Git Protocol: git add [files] → git pull --no-edit → git commit -m "filename.pdca.md" → git push',
          '💡 Why: Traceability (commit = PDCA), Consistency (no variation), Tooling (automation)',
          '🛑 1f Step 2: "Interrupt immediately on unexpected observations and ask TRON"',
          '🤝 This is a feedback point - STOP and wait for TRON response',
          '⚠️ Present decisions when direction unclear (6c)',
          '❌ Never assume what user wants next',
          '🚨 "pdca" TRIGGER WORD: When TRON says just "pdca" (alone or last word) = FULL CONTEXT REBUILD',
          '🔄 Trigger Actions: 1) Stop work 2) Query `pdca trainAI` 3) Read COMPLETELY (not just first lines)',
          '📚 Read ALL relevant topics: cmm, test-first, feature-development, component, pdca',
          '🎯 Depth 3 Reading: document + 2 reference levels (NOT superficial skimming)',
          '💡 Trigger Meaning: "You\'re confused. Reboot understanding. Read everything again properly."',
          '✨ Example: Wrong template version → "pdca" → Complete trainAI reading → Correct PDCA',
          '🎓 CMM4 Connection: Trigger activates feedback loop mastery - recognize confusion, reset, rebuild'
        ],
        verificationChecklist: [
          'Can create PDCA with correct filename format',
          'Includes all sections: Links, Plan (with TRON), Do, Check, Act, Meta',
          'Uses dual links (backward + forward placeholders)',
          'DRY: references documents instead of copying content',
          'Includes philosophical insight line at end',
          'Validates dual links using getDualLink or ensureValidLinks',
          'Recognizes when to stop and ask TRON',
          'Can present decisions instead of assuming',
          'Knows collaboration protocol during PDCA creation',
          'Uses LITERAL PDCA filename as git commit message (NOT descriptive text)',
          'Follows git protocol: add → pull → commit -m "filename.pdca.md" → push',
          'Understands "pdca" trigger word = complete context rebuild',
          'Will read trainAI completely (not just first lines) when triggered'
        ]
      },
      'git-protocol': {
        title: '🔐 How to Git Protocol: Atomic Commands & Safety',
        description: 'Master git protocol for CMM3 compliance: atomic commands, specific file staging, no bulk operations, no output filtering',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-09-18-UTC-0808-session/pdca/role/developer/2025-09-18-UTC-0843-git-protocol-violation-correction.md',
            reason: 'Definitive git protocol requirements and violation examples',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: 'CMM3 checklist item 1i: git commit & push protocol',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ ATOMIC COMMANDS ONLY: Each git operation as separate command',
          '✅ SPECIFIC FILE PATHS: git add path/to/file.ext (NEVER git add ., git add -A, git add *)',
          '✅ NO COMMAND CHAINING: Never use && operators (e.g., git add file && git commit)',
          '✅ NON-INTERACTIVE: All commands without interactive prompts',
          '✅ SEQUENTIAL EXECUTION: Proper order: add → commit → push',
          '✅ COMMIT MESSAGE: ONE-LINER with PDCA filename ONLY: git commit -m "2025-11-11-UTC-1854.pdca.md"',
          '✅ ALWAYS PUSH: git push required for GitHub dual links to work',
          '🚨 CRITICAL: NO OUTPUT TRUNCATION WITH head OR tail - STRICTLY FORBIDDEN',
          '✅ GREP IS ALLOWED: Use grep to search/filter for specific patterns',
          '❌ NEVER: git add . (bulk operation - may stage unintended files)',
          '❌ NEVER: git add -A (bulk operation - stages everything)',
          '❌ NEVER: git add * (wildcard - unpredictable staging)',
          '❌ NEVER: command | head (truncates output, hides critical information)',
          '❌ NEVER: command | tail (truncates output, hides critical information)',
          '⚠️ DANGER OF BULK OPERATIONS: Unintended files, hidden changes, lack of control, quality risk',
          '⚠️ DANGER OF OUTPUT TRUNCATION: Incomplete verification, missed errors, false confidence',
          '✅ BENEFITS OF SPECIFIC STAGING: Intentional commits, change visibility, quality control, atomic operations',
          '💡 Why specific paths: Only stage files explicitly intended for commit',
          '💡 Why no head/tail: Full output needed for CMM3 reproducibility and verification',
          '💡 Why grep is OK: Searching/filtering is different from truncating',
          '🔐 Safety Protocol: Review each file before staging, verify all output completely',
          '📊 Quality Control: Understand what each file contains before committing',
          '🎯 Atomic Operations: One file or logical group per git add command'
        ],
        verificationChecklist: [
          'NEVER uses git add . (bulk operation)',
          'NEVER uses git add -A (bulk operation)',
          'NEVER uses git add * (wildcard operation)',
          'ALWAYS uses specific file paths in git add',
          'NEVER chains commands with && operator',
          'NEVER uses | head to truncate output',
          'NEVER uses | tail to truncate output',
          'CAN use | grep to search/filter (this is allowed)',
          'Uses atomic commands (one operation per command)',
          'Uses non-interactive commands only',
          'Follows sequential order: add → commit → push',
          'Uses ONE-LINER commit with PDCA filename ONLY',
          'Always pushes after committing (for GitHub dual links)',
          'Reviews each file before staging',
          'Verifies full command output (head/tail forbidden, grep allowed)',
          'Understands dangers of bulk operations',
          'Understands why head/tail break CMM3 (but grep is OK)'
        ]
      },
      'cmm': {
        title: '🎯 How to CMM: Understanding Capability Maturity Levels',
        description: 'Master the CMM framework from chaos (CMM1) to feedback loop mastery (CMM4)',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md',
            reason: 'Definitive CMM framework explanation',
            depth: 3
          },
          {
            path: 'README.md',
            reason: 'See CMM4 applied to startup process',
            depth: 2
          }
        ],
        keyLessons: [
          '📊 CMM1 (Chaos): No process, hero-dependent, unpredictable',
          '📋 CMM2 (Subjective): Basic processes exist but subjective/ad-hoc',
          '✅ CMM3 (Objective): Defined, reproducible, scientifically verifiable',
          '🔄 CMM4 (Feedback Loop): Continuous improvement through systematic iteration',
          '🎯 Goal: Processes that evolve WITHOUT breaking the system',
          '⚠️ Manual operations = CMM2. Component methods = CMM3.'
        ],
        verificationChecklist: [
          'Can explain CMM1-CMM4 levels with examples',
          'Understands PDCA as CMM4 feedback loop system',
          'Recognizes CMM2 violations (manual cp, subjective decisions)',
          'Can identify how to elevate CMM2 operations to CMM3',
          'Understands why CMM4 enables LLM capability evolution'
        ]
      },
      'dual-links': {
        title: '🔗 How to Dual Links: GitHub + § Notation for Chat Reports',
        description: 'Master dual link format: GitHub URLs for verification, § paths for local navigation',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/_shared/PDCA/chat.report.template.md',
            reason: 'Official chat report format with dual link examples',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: 'CMM3 4c: Link Compliance requirements',
            depth: 1
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/howto.PDCA.md',
            reason: 'Dual Link System section',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ Format: [GitHub](https://github.com/org/repo/blob/branch/path) | [§/path](path)',
          '✅ GitHub link: For human verification, works in any context',
          '✅ § notation: Project-root-relative, for local navigation',
          '✅ MUST be in sync: Same file, same branch, both valid',
          '⚠️ CMM3 4c: Links MUST be verifiable - file must be pushed',
          '🔧 Tool: `pdca getDualLink <file>` auto-generates correct format',
          '🔧 Auto-fix: getDualLink adds/commits/pushes if needed',
          '❌ NEVER use file:// prefix (CMM2 violation)',
          '❌ NEVER use relative paths without § notation',
          '⚠️ getDualLink returns project-root-relative in local link part',
          '⚠️ For source files NOT at root, use getDualLinkRelativePath to calculate paths',
          '🔧 Tool: `pdca getDualLinkRelativePath <from> <to>` calculates relative paths',
          '✅ Verification: cd to source dir, ls <path> to test link works',
          '❌ NEVER assume getDualLink output works without verification',
          '🚨 MANDATORY: Test every link with ls from source directory',
          '✨ Use getDualLinkRelativePath for zero-knowledge path calculation',
          '🧠 Context Window Awareness: Long sessions → assumptions → violations',
          '✅ ALWAYS run `git status` before presenting dual links',
          '🔍 Pattern: getDualLink commits PDCA, but build artifacts may remain uncommitted',
          '❌ NEVER assume all files are committed - VERIFY with git status',
          '🔄 RAG First: When uncertain, query trainAI before acting',
          '⚠️ Bootstrap Phase: Extra vigilance required - system being established (temporary)',
          '🎯 Forcing Function: git status → commit all → push → THEN present link'
        ],
        verificationChecklist: [
          'Can write dual link format from memory',
          'Understands why GitHub link is needed (verification)',
          'Understands why § notation is needed (local navigation)',
          'Can use getDualLink to generate correct links',
          'Knows file must be pushed for link to be valid',
          'Recognizes CMM2 link violations (file://, no §, unpushed files)',
          'Knows getDualLink returns project-root-relative in local part',
          'Can use getDualLinkRelativePath to calculate relative paths',
          'Always verifies links with ls from source directory',
          'Tests every link before committing',
          'Checks git status before presenting dual links',
          'Commits ALL uncommitted files, not just PDCA',
          'Queries trainAI when assumptions arise',
          'Recognizes context window exhaustion symptoms'
        ]
      },
      'ensure-links': {
        title: '✅ How to Ensure Links: CMM3 Atomic Link Validation',
        description: 'Zero-knowledge automation: Ensure all dual links are valid across entire project',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-20-UTC-1215.pdca.md',
            reason: 'Complete design of dual link methods (getDualLink, findPDCAsLinking, updateLinksToFile, ensureValidLinks)',
            depth: 2
          }
        ],
        keyLessons: [
          '🎯 CMM3 Atomic: ensureValidLinks = single command, zero knowledge needed',
          '✅ Process: Normalize → Fix git → Generate canonical → Find PDCAs → Validate → Fix → Commit → Push',
          '✅ Usage: `pdca ensureValidLinks <file>` - fully automated',
          '✅ Dry-run: `pdca ensureValidLinks <file> true` - preview without changes',
          '✅ Idempotent: Safe to run multiple times, only fixes what needs fixing',
          '🔍 findPDCAsLinking: Find all PDCAs linking to a file (building block)',
          '🔄 updateLinksToFile: Bulk update when files move/version (building block)',
          '⚠️ Always run before PDCA completion to ensure valid links',
          '⚠️ Session end: Validate all session PDCAs'
        ],
        verificationChecklist: [
          'Understands CMM3 atomic operation concept (zero-knowledge required)',
          'Can run ensureValidLinks on any file',
          'Knows when to use dry-run mode (preview)',
          'Understands idempotency (safe to run repeatedly)',
          'Can use findPDCAsLinking to find link dependencies',
          'Knows to validate links before PDCA/session completion'
        ]
      },
      'component-upgrade': {
        title: '🚀 How to Component Upgrade: Link Management During Versioning',
        description: 'Maintain valid links when components evolve: version bumps, file moves, refactoring',
        requiredReading: [
          {
            path: 'components/Web4TSComponent/latest/README.md',
            reason: 'Component versioning patterns',
            depth: 1
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-20-UTC-1215.pdca.md',
            reason: 'updateLinksToFile method design and usage',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ Workflow: Version bump → Update links → Test → Commit',
          '✅ Create version: `web4tscomponent on <Component> <version> upgrade nextPatch`',
          '✅ Update links: `pdca updateLinksToFile <old-path> <new-path>`',
          '✅ Dry-run first: `pdca updateLinksToFile <old> <new> true` to preview',
          '✅ Auto-commit: updateLinksToFile commits and pushes by default',
          '🔍 Pre-check: `pdca findPDCAsLinking <old-path>` to see impact',
          '⚠️ Always update links BEFORE deleting old version',
          '⚠️ Document moves in PDCA (backward compatibility)',
          '🎯 Example: 0.2.0.0 → 0.2.1.0 updates all linking PDCAs automatically'
        ],
        verificationChecklist: [
          'Can create new component version using web4tscomponent',
          'Knows to run findPDCAsLinking before version changes',
          'Can use updateLinksToFile in dry-run mode',
          'Understands when links need updating (path changes, version bumps)',
          'Knows to document version changes in PDCA',
          'Can maintain backward compatibility during refactoring'
        ]
      },
      'merge': {
        title: '🔀 How to Merge: Post-Merge Integration and Build Requirements',
        description: 'Complete merge integration: source + build + runtime verification for symlinked components',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-23-UTC-1530.merge-impact-analysis.pdca.md',
            reason: 'Real case: Merge brought unbuilt dependencies, CLI failure analysis',
            depth: 2
          }
        ],
        keyLessons: [
          '⚠️ Source Code Merge ≠ Complete Integration!',
          '✅ Post-Merge Checklist: Resolve conflicts → Commit → BUILD components → Test → Verify CLI',
          '🔧 Build Step: MANDATORY for components with updated symlinks',
          '⚠️ Symlink Change → Build Requirement: If latest/dev/test symlinks change, build new versions',
          '🎯 Test Types: Build-time (tests pass) vs Runtime (CLI may fail) - both must work',
          '❌ NEVER assume merged code is ready - verify runtime dependencies',
          '🔍 Check Pattern: ls components/<Component>/<version>/dist/ after merge',
          '⚠️ Missing dist/ = Unbuilt version = Runtime import failure',
          '✅ Example: Web4TSComponent latest: 0.3.13.2 → 0.3.14.4 requires building 0.3.14.4',
          '🔧 Build Command: cd components/<Component>/<version> && npm install && npm run build',
          '💡 Why Tests Pass But CLI Fails: Tests use build context, CLI uses runtime imports',
          '⚠️ Symlinks in merge: Auto-accepted, may point to unbuilt versions',
          '🎯 Forcing Function: After merge, check ALL symlink targets for dist/ directory',
          '✅ CI/CD Gap: Need automated post-merge build verification',
          '📊 Integration = Source + Build Artifacts + Runtime Verification'
        ],
        verificationChecklist: [
          'Understands source merge ≠ complete integration',
          'Knows post-merge checklist includes BUILD step',
          'Can identify when components need building (symlink changes)',
          'Recognizes build-time vs runtime import differences',
          'Checks for dist/ directory after merge',
          'Knows how to build merged component versions',
          'Understands why tests pass but CLI fails',
          'Can diagnose "Cannot find module" as missing build',
          'Verifies CLI works after merge (not just tests)',
          'Knows to check all symlink targets for build artifacts'
        ]
      },
      'component': {
        title: '🔧 How to Component: Web4 Component System',
        description: 'Learn Web4 component patterns, versioning, and CLI auto-discovery',
        requiredReading: [
          {
            path: 'components/Web4TSComponent/latest/README.md',
            reason: 'Web4 component architecture and patterns',
            depth: 2
          },
          {
            path: 'components/PDCA/0.1.0.0/src/ts/layer2/DefaultPDCA.ts',
            reason: 'Example component implementation',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ Use web4tscomponent for ALL version operations',
          '✅ Version creation: web4tscomponent on <Component> <version> upgrade <promotion>',
          '✅ Semantic versioning: nextPatch, nextMinor, nextMajor, nextBuild',
          '✅ Component pattern: Empty constructor + scenario initialization + functionality',
          '✅ Symlinks: latest (dev), prod (stable), test, dev',
          '⚠️ NEVER manually copy component versions - violates CMM3',
          '✅ Web4 CLI uses positional parameters (no --flags)',
          '✅ Parameter order defined by @cliSyntax annotation',
          '✅ Optional parameters: <?param> (trail, can omit)',
          '✅ Required parameters: <param> or !<param>',
          '✅ Example: `pdca moveFile <oldPath> <newPath> <?dryRun>`',
          '❌ NEVER use --flag syntax (Unix-style)',
          '✅ Consistency: All Web4 components follow same pattern',
          '🔧 @cliSyntax defines parameter order in method signature',
          '🔧 @cliValues enables tab completion discovery',
          '✅ DRY: Symlink node_modules, never duplicate dependencies',
          '✅ DRY: Extend tsconfig.json from project root',
          '✅ DRY: Reuse existing methods, never copy-paste logic',
          '✅ DRY: Cross-reference docs, never duplicate content',
          '✅ initProject creates global node_modules and tsconfig',
          '❌ NEVER create real node_modules directories in components',
          '⚠️ Duplicated dependencies violate CMM3 (not reproducible)',
          '✅ Radical OOP: Empty constructors (no parameters)',
          '✅ Radical OOP: All config via init(scenario) method',
          '✅ Pattern: constructor() { this.model = {}; }',
          '✅ Pattern: init(scenario: Scenario<Model>): this',
          '✅ Why: Zero-dependency instantiation (testability)',
          '✅ Why: Flexible composition (multiple scenarios)',
          '❌ NEVER use constructor parameters (breaks radical OOP)',
          '✅ Method Chaining: Always return Promise<this>',
          '✅ Enables fluent API: component.method1().method2()',
          '✅ Enables CLI chaining: pdca method1 param1 method2',
          '✅ Pattern: async myMethod(): Promise<this> { return this; }',
          '✅ Auto-Discovery: Add method → CLI command appears',
          '✅ @cliSyntax annotation defines parameter order',
          '✅ @cliValues annotation enables tab completion',
          '✅ @cliHide annotation hides internal methods',
          '✅ TSDoc becomes CLI help text automatically',
          '❌ NEVER manually edit CLI files (auto-generated)'
        ],
        verificationChecklist: [
          'Can create new component version using web4tscomponent',
          'Understands semantic version promotion types',
          'Knows component directory structure and symlink purposes',
          'Can build component using: web4tscomponent on <Component> <version> build',
          'Recognizes when to use nextPatch vs nextMinor vs nextMajor',
          'Understands Web4 uses positional parameters, not flags',
          'Can read @cliSyntax to determine parameter order',
          'Knows optional parameters trail and can be omitted',
          'Understands DRY principle for dependencies (symlinks)',
          'Knows to extend tsconfig from root, not duplicate',
          'Can identify code duplication and refactor to reuse',
          'Understands radical OOP empty constructor pattern',
          'Can write init(scenario) method for configuration',
          'Knows constructor() should have no parameters',
          'Always returns Promise<this> for method chaining',
          'Understands @cliSyntax, @cliValues, @cliHide annotations',
          'Can add methods that auto-discover as CLI commands',
          'Recognizes CMM2 violations (real node_modules, constructor params)',
          'Can explain why DRY and Radical OOP enable CMM3',
          'Knows web4tscomponent initProject sets up DRY structure'
        ]
      },
      'feature-development': {
        title: '🛠️ How to Feature Development: RAG-Powered Test-First CMM3 Pattern',
        description: 'Master CMM3-compliant feature development: RAG preparation, test-first design, automated verification, and knowledge loop closure',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1550.feature.pdca.md',
            reason: 'Real example: getDualLinkRelativePath implementation using the pattern',
            depth: 2
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1605.pdca.md',
            reason: 'Meta-learning: Pattern extraction and CMM3 compliance analysis',
            depth: 2
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1410.test-first-verification.pdca.md',
            reason: 'Test-first verification principles and anti-patterns',
            depth: 1
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1700.pdca.md',
            reason: 'One-loop success: queryTrainAI implementation and why it worked',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ Phase 0 - RAG Preparation: Query trainAI BEFORE planning (test-first, component)',
          '⏱️ RAG Preparation is Non-Negotiable: 30 min reading → 2-3 hours debugging saved',
          '📚 Read to depth 3: document → references → secondary references',
          '🧠 Build complete mental model BEFORE coding (prevents assumption cascade)',
          '✅ Phase 1 - TRON Collaboration: Accept challenges as refinement opportunities',
          '🔄 TRON Challenges → Research → Document → Improve (not defend current approach)',
          '📖 User has knowledge agent doesn\'t - research immediately when challenged',
          '✅ Phase 2 - Test-First Design: Write 5-7 comprehensive tests BEFORE implementation',
          '🎯 DRY at Planning Stage: Identify reusable parts in plan, extract helpers from start',
          '🔧 Web4 Naming: methodNameInternal() for private helpers (NO underscores!)',
          '❌ NEVER use _methodName() or _methodNameInternal() (underscore violation)',
          '✅ Correct: calculateRelativePathInternal(), getDataInternal()',
          '❌ Wrong: _calculateRelativePath(), _getTrainingTopicsInternal()',
          '📝 Leave TODO comments for future DRY refactoring opportunities',
          '✅ Phase 3 - Expected Failure: Run tests, see failure, TRUST it (no manual check)',
          '✅ Phase 4 - Minimal Implementation: Add ONLY what\'s needed to pass tests',
          '🎨 Apply Web4 principles systematically: DRY, Radical OOP, Method Chaining, Auto-Discovery',
          '✅ Phase 5 - Trust the Green: Tests pass = done (no manual verification)',
          '✅ Phase 6 - trainAI Integration: Close knowledge loop immediately',
          '✅ Phase 7 - TRON Validation: User confirms pattern, closes feedback loop',
          '🎯 CMM3 Compliance: Objective (tests) + Reproducible (git) + Systematic (process)',
          '⏱️ Time Investment: ~90 min for CMM3 feature vs quick hack',
          '🚀 Success Metric: TRON validates pattern, auto-promotion succeeds',
          '🏆 One Loop = CMM4 Excellence: Write → Fail → Implement → Pass → Done (NO iteration)',
          '❌ NEVER skip tests: Test-first is mandatory for CMM3',
          '❌ NEVER manual verify: Tests are objective arbiter, not agent judgment',
          '❌ Multiple loops = CMM2 trial-and-error (avoid this)',
          '🔄 RAG-Powered FOR TWO: Agent + trainAI + Tests + TRON = CMM3 naturally',
          '💡 Meta-Pattern: Query → Challenge → Test → Implement → Verify → Document → Validate',
          '🎓 External verification at EVERY phase prevents CMM2 violations',
          '✨ Pattern is replicable: Same 7 steps work for any new feature',
          '📊 Web4 Principles Research Has Exponential ROI: 30 min reading → Apply 7 principles forever'
        ],
        verificationChecklist: [
          'Queried trainAI before planning (test-first, relevant domain topics)',
          'Read referenced docs to depth 3 (not just surface level)',
          'Built complete mental model before coding',
          'Identified reusable parts at planning stage (not refactoring)',
          'Extracted DRY helpers from start (not after duplication)',
          'Wrote tests before implementation (5-7 test cases)',
          'Ran tests and saw expected failure (method not found, etc)',
          'Trusted failure without manual verification',
          'Applied Web4 principles systematically (DRY, Radical OOP, Chaining, Auto-Discovery)',
          'Implemented minimal code to pass tests (no gold-plating)',
          'All tests passed without manual verification',
          'Implementation completed in ONE feedback loop (no iteration cycles)',
          'TRON challenges led to research and documentation (not defense)',
          'Updated trainAI with new knowledge immediately',
          'TRON validated the pattern and result',
          'Can explain why this is CMM3 (objective, reproducible, systematic)',
          'Can replicate pattern for next feature development',
          'Understands 90-min investment pays off in reliability',
          'Recognizes external verification (trainAI + Tests + TRON) as key to CMM3',
          'Achieved "one loop" success (TRON impressed with efficiency)'
        ]
      },
      'web4-vs-nodejs': {
        title: '🔄 Web4 vs Node.js: Pattern Migration Guide',
        description: 'Web4 components use modern ES modules and strict naming conventions. This guide covers common Node.js patterns and their Web4-compliant equivalents.',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-23-UTC-1730.web4-dirname-violation.pdca.md',
            reason: 'Real violation: __dirname usage and Web4-compliant fix',
            depth: 2
          },
          {
            path: 'components/Web4TSComponent/latest/src/ts/layer2/DefaultWeb4TSComponent.ts',
            reason: 'Source of truth: Web4 file path resolution pattern',
            depth: 1
          }
        ],
        keyLessons: [
          '❌ __dirname and __filename: Node.js globals with underscores → Web4 violation!',
          '✅ Web4 Pattern: Use import.meta.url with URL() constructor',
          '📝 Example Wrong: const dir = __dirname; const file = __filename;',
          '📝 Example Right: const url = new URL(import.meta.url); const dir = path.dirname(url.pathname);',
          '⚠️ Why: Web4 Principle → NO underscores in ANY naming (including built-ins)',
          '⚠️ Why: ES Modules → __dirname/__filename don\'t exist in module scope',
          '✅ Consistency: ALL Web4 components use import.meta.url pattern',
          '📍 Pattern Source: Web4TSComponent constructor (line ~19-20)',
          '🎯 Test Files: const currentFileUrl = new URL(import.meta.url);',
          '🎯 Test Files: const testDir = path.dirname(currentFileUrl.pathname);',
          '🎯 Then use: path.join(testDir, \'data\', \'fixtures\')',
          '🎯 CLI Files: Same pattern for resolving template paths',
          '✅ When to Use: Any code needing current file location',
          '❌ Never Use: __dirname, __filename (underscore violation)',
          '🔍 Detection: Search codebase for __dirname and __filename',
          '🔧 Fix Pattern: Replace all occurrences with import.meta.url',
          '📊 RAG Queries: "dirname file path test" → finds this topic',
          '📊 RAG Queries: "web4 naming underscore" → finds this topic',
          '📊 RAG Queries: "__dirname equivalent" → finds this topic',
          '⚠️ Context Window Risk: Node.js habits persist without RAG check',
          '✅ Forcing Function: Query "test file patterns" BEFORE writing tests',
          '✅ Verification: Run tests after replacement to confirm pattern works',
          '🎓 Meta-Pattern: Don\'t assume Node.js knowledge applies → verify with RAG'
        ],
        verificationChecklist: [
          'Searched codebase for __dirname and __filename occurrences',
          'Replaced with import.meta.url + URL() constructor pattern',
          'Added const currentFileUrl = new URL(import.meta.url) at file top',
          'Used path.dirname(currentFileUrl.pathname) for directory',
          'Used currentFileUrl.pathname for full file path',
          'Verified pattern matches Web4TSComponent implementation',
          'Ran tests to confirm pattern works correctly',
          'No underscore violations remaining in code',
          'Understands why this violates Web4 naming (underscores)',
          'Understands why this violates ES modules (scope)',
          'Can explain pattern to next agent',
          'Queried RAG before using file path resolution',
          'Recognized Node.js habit required explicit checking',
          'Will query "test patterns" proactively in future'
        ]
      },
      'tech-stack': {
        title: '🛠️ Tech Stack: Project Technology & Testing Framework',
        description: 'Web4Articles uses modern TypeScript, ESM, and Vitest. Jest is BANNED. Understanding the tech stack prevents violations and ensures compatibility.',
        requiredReading: [
          {
            path: 'docs/tech-stack.md',
            reason: 'CRITICAL: Defines approved technologies and BANNED frameworks (Jest)',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ Testing Framework: Vitest ONLY - modern, ESM-native, TypeScript-first',
          '❌ Jest is BANNED: Poor ESM support, legacy CJS patterns, slow migration',
          '📦 Import Pattern: import { describe, it, expect } from \'vitest\'',
          '⚠️ Tech Debt Violation: Any Jest config, scripts, or dependencies must be removed',
          '🏗️ Architecture: Web4TSComponent v0.3.x - component-based, TypeScript-first',
          '📝 Language: TypeScript (ES2020+) with full type safety',
          '🔧 CLI System: Auto-discovery with method chaining',
          '📊 Development Level: CMM4 (systematic, automated, quantitatively managed)',
          '🎯 Tooling: PlantUML + Graphviz for architecture diagrams',
          '🐳 Environment: Docker + Devcontainer for cross-platform consistency',
          '✅ Module System: Pure ESM - NO CommonJS (require, module.exports)',
          '✅ Modern JS: Full support for import.meta.url, top-level await',
          '🔍 Detection: Search for jest, ts-jest, jest.config - all violations',
          '🔧 Fix Pattern: Replace with vitest, vitest.config.ts',
          '📊 RAG Queries: "test framework" → finds this topic',
          '📊 RAG Queries: "vitest jest" → finds this topic',
          '⚠️ Context Window Risk: Assuming Jest is allowed → BANNED',
          '✅ Forcing Function: Query "tech stack" BEFORE adding dependencies'
        ],
        verificationChecklist: [
          'Read docs/tech-stack.md completely',
          'Understands Jest is BANNED - no exceptions',
          'Knows correct import: import { describe, it, expect } from \'vitest\'',
          'Can identify Jest violations (jest, ts-jest, jest.config)',
          'Understands why Vitest: ESM-native, TypeScript-first, modern',
          'Knows project uses pure ESM - no CommonJS',
          'Understands Web4TSComponent architecture',
          'Will query "tech stack" before adding new dependencies',
          'Will check docs/tech-stack.md for approved technologies',
          'Can explain to next agent why Jest is banned'
        ]
      },
      'test-workflow': {
        title: '🧪 How to Test Workflow: Semantic Versioning and Test Iteration',
        description: 'Master the test workflow: latest → test → dev → prod with auto-promotion and test iteration',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1234.pdca-test-workflow.pdca.md',
            reason: 'Complete test workflow documentation with semantic versioning',
            depth: 3
          },
          {
            path: 'components/Web4TSComponent/latest/README.md',
            reason: 'Component versioning and testing patterns',
            depth: 1
          }
        ],
        keyLessons: [
          '🔗 Semantic links: latest (dev work) → test (testing) → dev (stable) → prod (production)',
          '🧪 Test workflow: Work on `latest` → run `pdca test` → auto-promotes to `test` on success',
          '✅ Auto-promotion: `pdca test` creates/updates `test` symlink when all tests pass',
          '🔧 Test iteration: `web4tscomponent on <Component> latest test itCase` shows test tree',
          '📊 View state: `web4tscomponent on <Component> latest tree links` shows semantic links',
          '🛑 WORKFLOW REMINDER: Always work on dev until test → work on test until success → work on dev after success',
          '⚠️ Version promotion: Use component commands (promote, upgrade), NEVER manual symlinks',
          '🎯 Test selection: `web4tscomponent test itCase <token>` to run specific tests (e.g., 2a1)',
          '🔍 When tests fail: Fix on `test` version, not `latest`',
          '❌ Violated pattern: Fixing tests on `latest` instead of switching to `test` version',
          '💡 Test fixtures can pollute component structure (components/X/version/components/)',
          '⚠️ Obey forcing functions: WORKFLOW REMINDER is there for a reason',
          '📝 Commit discipline: Always commit new versions after successful `pdca test` auto-promotion',
          '🔄 Version lifecycle: `pdca test` manages symlinks but does NOT commit - that\'s your job',
          '✨ Test success = commit trigger: Auto-promotion signals "this version is ready to track"'
        ],
        verificationChecklist: [
          'Understands 4-level semantic versioning (latest, test, dev, prod)',
          'Knows the complete test workflow (latest → test → dev → prod)',
          'Recognizes auto-promotion happens on test success',
          'Can use `test itCase` to view and select tests',
          'Can use `tree links` to view semantic version state',
          'Knows to obey the WORKFLOW REMINDER',
          'Understands why manual symlink changes are CMM3 violations',
          'Can identify when to work on `test` vs `latest` version',
          'Recognizes test fixture pollution issues',
          'Commits new versions after `pdca test` auto-promotion',
          'Understands that `pdca test` manages symlinks but does not commit'
        ]
      },
      'test-without-versioning': {
        title: '🧪 How to Test Without Versioning: Baseline Verification',
        description: 'Learn to run tests without triggering version creation: test itCase for discovery, specific tests for verification, direct vitest for baseline',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1710.pdca.md',
            reason: 'Real-world learning: Baseline truth testing before DRY refactoring',
            depth: 2
          },
          {
            path: 'components/Web4TSComponent/latest/README.md',
            reason: 'Test itCase functionality documentation',
            depth: 1
          }
        ],
        keyLessons: [
          '🔍 Viewing Tests: `web4tscomponent on <Component> latest test itCase` shows complete test tree',
          '📊 Test tree displays: file number, describe blocks, test cases with tokens (no execution, no versioning)',
          '🎯 Running Specific Tests: `web4tscomponent on <Component> latest test itCase <token>` (e.g., 5a1)',
          '✅ Specific tests run ONLY that test using vitest filtering - safe for baseline checks',
          '🧪 Running All Tests: `cd components/<Component>/latest && npx vitest run` bypasses auto-promotion',
          '📝 Direct vitest call useful for comprehensive baseline verification without versioning',
          '✓ Before refactoring (establish baseline) - use test itCase or direct vitest',
          '✓ During debugging (isolate failures) - use specific test tokens',
          '✓ When testing in `latest` (not ready for auto-promotion) - avoid `pdca test`',
          '❌ When ready to promote - use `pdca test` instead (triggers auto-promotion)',
          '⚠️ Why NOT `pdca test`: Triggers auto-promotion workflow, creates new versions (test, prod, dev)',
          '🚫 `pdca test` not suitable for baseline checks - it modifies semantic version links',
          '🔢 Test Tokens Format: `<file><describe><test>` (e.g., 5a1 = file 5, describe a, test 1)',
          '📁 File: Test file number (1-7), Describe: Letter (a, b, c), Test: Number (1, 2, 3)',
          '🎓 Zero-Knowledge Principle: Use `web4tscomponent test itCase` FIRST to discover tests',
          '🔍 Don\'t assume test names or structure - let the tool show you what exists',
          '💡 Baseline truth test: Run tests BEFORE refactoring to prove system works',
          '✅ If tests fail after refactoring, you KNOW you broke something (objective proof)',
          '📊 CMM3 Compliance: Objective baseline = verifiable before/after comparison'
        ],
        verificationChecklist: [
          'Can view test tree without executing tests',
          'Can run specific test by token (e.g., 5a1)',
          'Understands when to use `itCase` vs `pdca test`',
          'Knows how to establish baseline before refactoring',
          'Recognizes `pdca test` creates versions (auto-promotion)',
          'Can explain test token format (<file><describe><test>)',
          'Uses zero-knowledge approach (discover tests first, don\'t assume)',
          'Understands baseline truth testing for CMM3 verification'
        ]
      },
      'test-first': {
        title: '🧪 How to Test-First Verification: Trust Tests, Avoid Manual Verification',
        description: 'Master the test-first pattern: Write tests first, trust them to show pass/fail, avoid manual verification loops',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1410.test-first-verification.pdca.md',
            reason: 'Meta-learning from violating test-first pattern',
            depth: 3
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1007.meta-learning.pdca.md',
            reason: 'Context on over-implementation and assumption cascade',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ Test-First Pattern: Write test → Run test → See it fail → Fix code → See it pass',
          '🎯 Trust the tests: If tests pass, functionality works. No manual verification needed.',
          '❌ Anti-pattern: "Let me manually verify that the test failed before fixing"',
          '❌ Anti-pattern: "I\'ll run the command manually to confirm the bug exists"',
          '🔄 CMM4 feedback loop: Test IS the verification mechanism',
          '⚡ Efficiency: Manual verification duplicates test effort and wastes time',
          '🛡️ Safety: Tests are reproducible; manual checks are subjective and error-prone',
          '📊 Test output is authoritative: PASS = works, FAIL = broken, no interpretation needed',
          '🚫 Never skip directly to fixing: Always run the test first to see the failure',
          '✨ Test-first enforces CMM3: Objective criteria (test assertions) over subjective judgment',
          '⚠️ Root cause: Efficiency bias → assumption cascade → skipping verification step',
          '💡 When debugging: Write a test that reproduces the bug, then fix until test passes'
        ],
        verificationChecklist: [
          'Can write a failing test before implementing a feature',
          'Trusts test output as authoritative (no manual verification)',
          'Recognizes manual verification as an anti-pattern',
          'Understands test-first as a CMM4 feedback loop',
          'Can identify when bias is leading to assumption cascade',
          'Knows to run tests first, not fix first',
          'Understands why test-first is CMM3-compliant (objective criteria)',
          'Can explain why manual verification is CMM2 (subjective)',
          'Avoids over-implementation (doing more than requested)',
          'Stops after showing test results, waits for user direction'
        ]
      },
      'interpret-instructions': {
        title: '🎯 How to Interpret Instructions: Literal vs Implied Actions',
        description: 'Master the art of parsing user instructions to understand exactly what\'s requested vs what\'s assumed',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: '6d - No assumptions about user intent',
            depth: 2
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1007.meta-learning.pdca.md',
            reason: 'Real example of instruction misinterpretation',
            depth: 3
          }
        ],
        keyLessons: [
          '✅ "Show me X" means: Execute X, Display result, STOP',
          '✅ "Fix X" means: Analyze, Propose, Implement (after confirmation)',
          '✅ "X and Y" means: Do X, then do Y',
          '✅ "X" does NOT imply Y, even if Y seems logical',
          '⚠️ Punctuation matters: "pdca" vs "pdca!" vs "PDCA"',
          '🛑 Feedback points: Where control returns to user',
          '❌ Never add implied actions',
          '❌ Never assume "next logical step"',
          '💡 Examples: "run tests" → Execute + show output + STOP (NOT: run + analyze + fix + commit)',
          '💡 "show me file.md" → Display file + STOP (NOT: show + analyze + suggest)',
          '💡 "pdca!" → Create PDCA file (NOT: write PDCA-formatted response)',
          '💡 "read X" → Read X, provide dual link, STOP (NOT: read + summarize + analyze)'
        ],
        verificationChecklist: [
          'Can parse "show me X" correctly (execute + display + stop)',
          'Understands difference between command and suggestion',
          'Recognizes punctuation significance (!, CAPS, etc)',
          'Can identify feedback points in instructions',
          'Knows when to ask vs assume'
        ]
      },
      'collaborate': {
        title: '🤝 How to Collaborate: User-in-the-Loop CMM4 Pattern',
        description: 'Understand CMM4 collaboration where user controls the loop and agent enables execution',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-09-22-UTC-1908-session/howto.cmm.md',
            reason: 'CMM4 as feedback loop mastery',
            depth: 3
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-21-UTC-1007.meta-learning.pdca.md',
            reason: 'Real example of collaboration violation',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md',
            reason: 'Decision-making framework for user alignment',
            depth: 2
          }
        ],
        keyLessons: [
          '🔄 CMM4 Loop: User decides → Agent executes → FEEDBACK POINT → User reflects → User decides',
          '✅ User controls WHAT to do',
          '✅ Agent controls HOW to do it',
          '✅ Feedback points = where control returns to user',
          '🛑 STOP at feedback points, don\'t assume next step',
          '⚠️ "Helpful" = enabling user, NOT solving without asking',
          '❌ Never close feedback loop prematurely',
          '❌ Never assume user wants problem solved',
          '💡 Collaboration Model: User (Decision) → Agent (Execute) → FEEDBACK POINT 🛑 STOP → User (Reflection) → User (Decision)',
          '💡 Anti-Pattern: User → Agent → (everything done) → User sees result ❌',
          '💡 Correct: User → Agent → Result → STOP → User → Next instruction ✅'
        ],
        verificationChecklist: [
          'Understands CMM4 collaboration loop',
          'Can identify feedback points',
          'Knows when to STOP vs continue',
          'Recognizes "helpful" vs "presumptuous"',
          'Waits for user decision at feedback points'
        ]
      },
      'chat-response': {
        title: '💬 How to Chat Response: CMM3 Compliance for Agent Replies',
        description: 'Master the art of chat responses - links only, no explanatory text, proper dual link format',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/_shared/PDCA/chat.report.template.md',
            reason: 'Official chat report format',
            depth: 2
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: '3a-3c chat response compliance',
            depth: 2
          }
        ],
        keyLessons: [
          '✅ CMM3 3a: Links only, no explanatory text',
          '✅ CMM3 3c: Dual link format: [GitHub](URL) | [§/path](path)',
          '✅ CMM3 4c: Local link uses project-root-relative path',
          '✅ When user says "read X" → provide dual link, that\'s it',
          '⚠️ No summaries, no analysis, no "key points"',
          '⚠️ Exception: QA Decisions must be copied verbatim',
          '❌ NEVER add explanatory text before/after link',
          '❌ NEVER provide summary instead of link',
          '💡 Wrong: "I\'ve read the CMM3 compliance checklist. Key points: ... [link]" ❌',
          '💡 Right: "[GitHub](URL) | [§/path](path)" ✅'
        ],
        verificationChecklist: [
          'Can provide links without explanatory text',
          'Uses correct dual link format',
          'Knows when to add text (QA Decisions only)',
          'Recognizes 3a violations in own responses',
          'Can generate project-root-relative paths'
        ]
      },
      'report': {
        title: '📊 How to Report: Concise Task Completion Without Summary Generation',
        description: 'Master concise reporting - avoid elaborate summaries (context window symptom), query RAG first, follow CMM3 format',
        requiredReading: [
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-23-UTC-1445.meta-meta-learning-summary-instinct.pdca.md',
            reason: 'Documents summary generation as context window pressure indicator',
            depth: 2
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-23-UTC-1430.context-window-recovery-trainai.pdca.md',
            reason: 'Context window exhaustion patterns and git status protocol',
            depth: 2
          }
        ],
        keyLessons: [
          '🚨 Summary Generation = Red Flag: Elaborate formatting/boxes indicate context window pressure',
          '✅ Query RAG BEFORE Reporting: `pdca queryTrainAI "How should I report task completion?"`',
          '✅ Concise Format: Facts + dual links + git status + STOP',
          '❌ NEVER generate elaborate summaries without RAG query',
          '❌ NEVER use boxes, multiple heading levels, decorative elements',
          '❌ NEVER speculate on "What\'s Next" (user controls loop)',
          '⚠️ Characteristics of Summary Mode: Comprehensive recaps, "executive summary" style, next steps speculation',
          '⚠️ Why It Happens: Context window pressure → compression instinct → violation risk',
          '🎯 Forcing Function Checklist: 1) git status 2) commit all 3) push 4) query trainAI 5) follow guidance 6) report 7) STOP',
          '💡 Pattern: Integration into trainAI ≠ Active use of trainAI',
          '💡 Even recent learning requires RAG queries (memory ≠ RAG)',
          '🔄 Bootstrap Phase: Extra vigilance - query RAG for EVERY reporting task',
          '✨ Correct Report: "Task complete. Files: [dual link]. Git status: clean. *Awaiting instruction.*"',
          '🧠 Meta-Pattern: When you DON\'T think you need RAG is when you need it most',
          '🤝 User Controls Loop: Report facts, provide links, STOP - no loop closure',
          '⚠️ Summary instinct compensates for fuzzy memory - trigger for RAG query',
          '🎓 Test: If you\'re about to write "Summary:", query trainAI instead'
        ],
        verificationChecklist: [
          'Recognizes summary generation as context window symptom',
          'Queries trainAI before reporting task completion',
          'Uses concise format (facts + links + status + STOP)',
          'Avoids elaborate formatting and decorative elements',
          'Does not speculate on next steps',
          'Checks git status before reporting',
          'Commits ALL files, not just main deliverable',
          'Understands forcing function checklist',
          'Recognizes when assumptions are arising',
          'Can identify "summary mode" in own writing',
          'Knows to query RAG when NOT feeling uncertain (paradox)'
        ]
      },
      'license-headers': {
        title: '📄 How to License Headers: AI-GPL License Management',
        description: 'Master license header management - why headers matter, how to use licensetool, when to run checks',
        requiredReading: [
          {
            path: 'AI-GPL.md',
            reason: 'Complete AI-GPL addendum specification and rationale',
            depth: 2
          },
          {
            path: '.reuse/dep5',
            reason: 'Machine-readable license mappings for all file types',
            depth: 1
          },
          {
            path: 'scrum.pmo/project.journal/2025-10-20-UTC-1008-session/2025-10-23-UTC-0904.feature.pdca.md',
            reason: 'Complete LicenseTool implementation with test-first pattern',
            depth: 2
          },
          {
            path: 'scrum.pmo/sprints/sprint-10/planning.md',
            reason: 'Original requirements and business context',
            depth: 1
          }
        ],
        keyLessons: [
          '📄 Why Headers Matter: Legal protection, AI training clarity, copyleft enforcement',
          '🎯 AGPL-3.0-only WITH AI-GPL-Addendum: All files get this license',
          '📁 Process Artifacts: Subset with commercial dual-licensing (scrum.pmo/, *.pdca.md)',
          '✅ licensetool check: Verify all headers present and up-to-date',
          '✅ licensetool apply: Add/update headers automatically',
          '✅ licensetool apply . true: Dry-run mode (see changes before applying)',
          '🔧 Shebang Pattern: Remove from .ts source (causes build errors), only in .js',
          '📝 Required Header Elements: SPDX-License-Identifier, SPDX-FileComment, Copyright, Copyleft, Backlinks',
          '🔗 Relative Path to AI-GPL.md: Use calculateRelativePathInternal() pattern',
          '🏗️ CI Integration: GitHub Actions runs licensetool check on all pushes/PRs',
          '❌ NEVER manual headers: Use licensetool to ensure consistency',
          '❌ NEVER skip CI: License compliance is mandatory',
          '⚠️ Test Fixtures Exception: test/data/ files NOT process artifacts',
          '💡 When adding new file types: Update shouldSkipFileInternal() in LicenseTool',
          '💡 Web4 Naming: NO underscores, Internal suffix for private helpers',
          '📊 REUSE Compliance: Industry standard for machine-readable license metadata',
          '🎓 Dual-Licensing Model: Open-source (AGPLv3) + Commercial (AI use cases)',
          '🔄 Header Updates: Run licensetool apply after copyright year changes',
          '✨ Auto-Completion: Tab completion works for file paths and dryRun parameter',
          '🧪 Test-First Pattern: 60 tests written before implementation (98.3% pass rate)'
        ],
        verificationChecklist: [
          'Can run licensetool check and interpret results',
          'Understands difference between missing vs outdated headers',
          'Can use dry-run mode before applying changes',
          'Knows when headers are required (all tracked files)',
          'Understands AI-GPL scope (all files, process artifacts subset)',
          'Can add headers to new file types if needed',
          'Knows to check CI status after header changes',
          'Understands shebang conflicts with headers',
          'Can explain why headers use relative paths',
          'Recognizes process artifacts vs regular files'
        ]
      },
      'decide': {
        title: '⚖️ How to Decide: QA Decision Framework for PDCAs',
        description: 'Master the art of presenting QA decisions - when to ask, what to ask, how to format decisions properly',
        requiredReading: [
          {
            path: 'scrum.pmo/roles/_shared/PDCA/PDCA.howto.decide.md',
            reason: 'Complete decision-making framework with examples',
            depth: 3
          },
          {
            path: 'scrum.pmo/roles/SaveRestartAgent/cmm3.compliance.checklist.md',
            reason: 'Section 1j: QA Decisions format compliance',
            depth: 1
          },
          {
            path: 'scrum.pmo/roles/_shared/PDCA/template.md',
            reason: 'See QA Decisions section structure in official template',
            depth: 1
          }
        ],
        keyLessons: [
          '✅ QA Decisions are for USER decisions, not agent decisions',
          '⚖️ The 42 Rule: When in doubt, ASK! The answer to everything is often another question',
          '✅ Three valid formats: Pending decisions [ ], Completed [x], or "All clear, no decisions to make"',
          '✅ Present decisions when: Real risk exists, Multiple valid approaches, Ambiguous requirements, Significant impact',
          '❌ DON\'T present when: User already decided, No real risk, Only one sensible option, Fake opposites',
          '🚨 Destructive operations REQUIRE warnings (force push, delete, overwrite)',
          '📋 Format: Numbered decisions with options a/b/c including rationale/consequences',
          '✅ Check official docs BEFORE creating decisions (semver.org, CMMI, git docs, project glossary)',
          '✅ Decision lifecycle: Pending [ ] → TRON answers → Agent implements → Completed [x]',
          '❌ NEVER create different QA Decisions in chat - copy EXACTLY from PDCA',
          '⚠️ Startup decisions: Focus Area, Role Selection, Session Duration, PDCA Location, Agent Identity',
          '🔧 Interactive decisions: Checkbox pattern with indented metadata for branch updates',
          '💡 Good decisions empower users, bad decisions waste time',
          '🤝 Collaboration pattern: Present decision, STOP, wait for user response',
          '❌ No fake opposites: Never present "do it" vs "don\'t do it" as options',
          '✅ Decision quality: Clear title, distinct options, consequences explained, official sources checked'
        ],
        verificationChecklist: [
          'Can identify when a decision is needed vs when it\'s not',
          'Understands the three valid QA Decision formats',
          'Can format decisions with proper checkbox syntax',
          'Knows to check official documentation before creating decisions',
          'Recognizes fake opposites and avoids them',
          'Can write destructive operation warnings properly',
          'Understands decision lifecycle from pending to completed',
          'Knows to copy EXACT decisions from PDCA to chat (no paraphrasing)',
          'Can present startup decisions with focus/role/duration/location',
          'Understands the 42 Rule - asking when unsure is correct behavior'
        ]
      }
    };

    // Check if topic exists in really available topics first
    const availableTopicInfo = this.getTrainingTopicInternal(actualTopic);
    if (!availableTopicInfo) {
      console.error(`❌ Unknown training topic: ${actualTopic}`);
      console.log(`\n📚 Available topics (${this.getAvailableTopicsCountInternal()} topics):`);
      orderedTopics.forEach((key, i) => {
        const topicInfo = this.getTrainingTopicInternal(key);
        if (topicInfo) {
          const emoji = key.includes('start') ? '🚀' :
                       key.includes('pdca') ? '📝' :
                       key.includes('git-protocol') ? '🔐' :
                       key.includes('cmm') ? '📊' :
                       key.includes('component') ? '🔧' :
                       key.includes('feature') ? '🛠️' :
                       key.includes('tech-stack') ? '🛠️' :
                       key.includes('test') ? '🧪' :
                       key.includes('dual') ? '🔗' :
                       key.includes('ensure') ? '✅' :
                       key.includes('merge') ? '🔄' :
                       key.includes('interpret') ? '🧠' :
                       key.includes('collaborate') ? '🤝' :
                       key.includes('chat') ? '💬' :
                       key.includes('report') ? '📋' :
                       key.includes('license') ? '©️' :
                       key.includes('decide') ? '⚖️' :
                       key.includes('web4-vs-nodejs') ? '⚡' : '📖';
          console.log(`   ${i + 1}:${key.padEnd(35)} ${emoji} ${topicInfo.title.replace(/^[^a-zA-Z]+\s*/, '')}`);
        }
      });
      console.log(`\n💡 Usage: pdca trainAI <number>  or  pdca trainAI <topic-name>\n`);
      return this;
    }

    const training = trainingTopics[actualTopic];
    
    if (!training) {
      console.error(`❌ Training content not available for topic: ${actualTopic}`);
      console.log(`   Topic exists but full training content is not yet implemented.`);
      console.log(`   Title: ${availableTopicInfo.title}`);
      console.log(`\n💡 This topic is available but needs full training content. Contact maintainer.\n`);
      return this;
    }

    // Display training content
    console.log(`${training.title}`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(`${training.description}\n`);

    console.log(`📖 Required Reading (Reading Depth Protocol):`);
    console.log(`${'─'.repeat(80)}`);
    training.requiredReading.forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc.path}`);
      console.log(`   Reason: ${doc.reason}`);
      console.log(`   Depth: ${doc.depth} (read document + ${doc.depth - 1} levels of references)`);
    });

    console.log(`\n\n🎯 Key Lessons (Memorize These):`);
    console.log(`${'─'.repeat(80)}`);
    training.keyLessons.forEach((lesson, i) => {
      console.log(`${i + 1}. ${lesson}`);
    });

    console.log(`\n\n✓ Verification Checklist:`);
    console.log(`${'─'.repeat(80)}`);
    training.verificationChecklist.forEach((check, i) => {
      console.log(`[ ] ${i + 1}. ${check}`);
    });

    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`📊 Training Status: Content displayed`);
    console.log(`🎓 Next: Read all required documents, verify understanding with checklist`);
    console.log(`💡 CMM4 Note: As you complete this training, you evolve beyond base LLM limitations\n`);

    return this;
  }

}
