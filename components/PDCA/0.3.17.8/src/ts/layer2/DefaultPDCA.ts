/**
 * DefaultPDCA - PDCA Component Implementation
 * Web4 pattern: Empty constructor + scenario initialization + component functionality
 */

import { PDCA } from '../layer3/PDCA.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';
import { PDCAModel } from '../layer3/PDCAModel.interface.js';
import { User } from '../layer3/User.interface.js';
import { existsSync, lstatSync, readlinkSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// Use latest version for delegation (always available)
import { DefaultWeb4TSComponent } from '../../../../../Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js';

export class DefaultPDCA implements PDCA {
  // @pdca 2025-11-03-1105-component-template-bugs.pdca.md - Changed to public for Component interface compliance
  model: PDCAModel;
  private web4ts?: DefaultWeb4TSComponent; // Lazy-initialized Web4TSComponent for delegation
  private user?: User; // Optional User service (lazy initialization) - @pdca 2025-11-03-1135.pdca.md

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
      version: '0.3.17.8'             // Component version
    };
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

    // Find project root (where components/ directory is)
    const projectRoot = componentRoot.split('/components/')[0];

    // Import Web4TSComponent and SemanticVersion dynamically
    const web4tscomponentModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/DefaultWeb4TSComponent.js`
    );
    const semanticVersionModule = await import(
      `${projectRoot}/components/Web4TSComponent/latest/dist/ts/layer2/SemanticVersion.js`
    );
    const { DefaultWeb4TSComponent } = web4tscomponentModule;
    const { SemanticVersion } = semanticVersionModule;

    // ✅ CRITICAL: Initialize Web4TSComponent with THIS component's identity for delegation
    // @pdca 2025-11-03-UTC-1237.pdca.md - Full delegation initialization
    // @pdca 2025-11-04-UTC-1630.pdca.md - Added projectRoot for version display fix
    this.web4ts = new DefaultWeb4TSComponent().init({
      model: {
        component: this.model.component,           // THIS component's name
        version: await SemanticVersion.fromString(this.model.version || '0.0.0.0'), // THIS component's version
        componentRoot: componentRoot,              // THIS component's root directory
        projectRoot: projectRoot,                  // Project root for Path Authority (version display needs this)
        targetDirectory: projectRoot               // Project root for path authority
      }
    });

    return this.web4ts;
  }

  /**
   * DRY helper for delegating methods to Web4TSComponent with correct context
   * Sets context ONCE so Web4TSComponent operates on THIS component's data
   * @pdca 2025-11-03-UTC-1200.pdca.md - DRY OOP pattern for context delegation
   * @cliHide
   */
  private async delegateToWeb4TS<T extends (...args: any[]) => any>(
    method: string,
    ...args: Parameters<T>
  ): Promise<this> {
    const web4ts = await this.getWeb4TSComponent();
    web4ts.model.context = this;  // ← Set context ONCE in ONE place
    await (web4ts as any)[method](...args);
    return this;
  }

  /**
   * @cliHide
   */
  init(scenario?: Scenario<PDCAModel>): this {
    if (scenario?.model) {
      this.model = { ...this.model, ...scenario.model };
    }
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
          version: '0.3.17.8'
        }
      });
      ownerData = Buffer.from(fallbackJson).toString('base64');
    }

    return {
      ior: {
        uuid: this.model.uuid,
        component: 'PDCA',
        version: '0.3.17.8'
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
   * Show information about current PDCA state
   */
  async info(): Promise<this> {
    console.log(`📋 PDCA Information:`);
    console.log(`   UUID: ${this.model.uuid}`);
    console.log(`   Name: ${this.model.name || 'Not set'}`);
    console.log(`   Created: ${this.model.createdAt}`);
    console.log(`   Updated: ${this.model.updatedAt}`);
    return this;
  }

  /**
   * Train AI agents on specific topics with CMM3-defined, reproducible learning paths
   * Systematically transfers knowledge from the 0.3.17.3 → 0.3.17.8 journey
   * Focuses on Radical OOP, CMM3 verification, and professional development practices
   * 
   * @param topic Training topic identifier or number
   * @cliSyntax topic
   * @cliDefault topic ""
   * @cliValues topic radical-oop functional-vs-oop cmm3-verification test-first pdca-process bash-completion method-chaining path-authority dry-principle error-handling output-filtering code-measurement diagnostic-output single-match-docs black-box-testing 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
   */
  async trainAI(topic: string = ''): Promise<this> {
    console.log(`\n🎓 AI Training Module - Web4TSComponent 0.3.17.8 Journey\n`);

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
      console.log(`💡 The Radical OOP Journey (radical-oop):\n`);
      console.log(`   "Fixing is 100 times more expensive than doing it right"`);
      console.log(`   "Functional programming is a DEAD END"`);
      console.log(`   "100% Radical OOP: this.model everywhere, zero parameters"`);
      console.log(`   "Deleted 77 lines of functional shit, gained simplicity"\n`);
      console.log(`🎯 YOU MUST UNDERSTAND ARCHITECTURE BEFORE CODING\n`);
      console.log(`   Every completion method should be model-driven.`);
      console.log(`   Every helper should use this.model, not parameters.`);
      console.log(`   Every test should verify behavior, not hallucinate success.\n`);
      console.log(`📊 The Cost of Functional Programming:\n`);
      console.log(`   ❌ Parameters everywhere → Complexity cascade → Bugs multiply`);
      console.log(`   ❌ Passing data around → Lost context → Debugging nightmare`);
      console.log(`   ❌ Functional patterns → Elongated code → Maintenance hell`);
      console.log(`   ✅ Radical OOP → Simple model → this.model everywhere → Clean code\n`);
      console.log(`🏆 The CMM3 Principle:\n`);
      console.log(`   - Hallucinating about tests is NOT testing`);
      console.log(`   - Writing about checking is NOT checking`);
      console.log(`   - CMM4 is only CMM4 if everything is CMM3 first`);
      console.log(`   - No CMM3 test = No CMM4 result\n`);
      console.log(`🔄 CRITICAL: After Each Prompt:\n`);
      console.log(`   When you complete a task, VERIFY it objectively.`);
      console.log(`   Don't claim success without running actual tests.`);
      console.log(`   Don't write about verification - DO the verification.\n`);
      console.log(`   ✅ CORRECT: Run test → See output → Report actual results`);
      console.log(`   ❌ WRONG: Assume it works → Write about success → Break production\n`);
      console.log(`   Assumptions are CMM2. Verification is CMM3.\n`);
      console.log(`════════════════════════════════════════════════════════════════════════════════\n`);
      console.log(`📚 Available Training Topics (15 topics): Lessons from 0.3.17.3 → 0.3.17.8\n`);
      
      const orderedTopics = [
        'radical-oop',
        'functional-vs-oop',
        'cmm3-verification',
        'test-first',
        'pdca-process',
        'bash-completion',
        'method-chaining',
        'path-authority',
        'dry-principle',
        'error-handling',
        'output-filtering',
        'code-measurement',
        'diagnostic-output',
        'single-match-docs',
        'black-box-testing'
      ];

      const topicTitles: { [key: string]: string } = {
        'radical-oop': '🎯 Radical OOP: 100% Model-Driven Architecture',
        'functional-vs-oop': '⚡ Functional vs OOP: Why Functional Programming Fails',
        'cmm3-verification': '✅ CMM3 Verification: Reproducible Testing Without Hallucination',
        'test-first': '🧪 Test-First: Write Tests Before Code',
        'pdca-process': '📝 PDCA Process: Plan-Do-Check-Act Methodology',
        'bash-completion': '🖥️ Bash Completion: DISPLAY: and WORD: Protocol',
        'method-chaining': '🔗 Method Chaining: Fluent API Design',
        'path-authority': '📂 Path Authority: Centralized Path Management',
        'dry-principle': '♻️ DRY Principle: Eliminate Duplication',
        'error-handling': '🛡️ Error Handling: Professional Error Management',
        'output-filtering': '🚫 Output Filtering: Why Filtering is Forbidden',
        'code-measurement': '📊 Code Measurement: Quantify Improvements',
        'diagnostic-output': '💬 Diagnostic Output: User-Friendly Feedback',
        'single-match-docs': '📖 Single-Match Docs: Enhanced Documentation Display',
        'black-box-testing': '🧪 Black-Box Testing: External Verification'
      };

      orderedTopics.forEach((key, i) => {
        console.log(`   ${i + 1}:${key.padEnd(25)} ${topicTitles[key]}`);
      });
      
      console.log(`\n💡 Usage Examples:\n`);
      console.log(`   pdca trainAI radical-oop          # Learn model-driven architecture`);
      console.log(`   pdca trainAI cmm3-verification    # Learn reproducible testing`);
      console.log(`   pdca trainAI bash-completion      # Learn completion protocol`);
      console.log(`   pdca trainAI 1                    # Use topic number for quick access\n`);
      console.log(`🧠 MEMORIZE THE KEYWORDS - Use Them as Triggers:\n`);
      console.log(`   When you see these keywords in user feedback, READ the training FIRST:\n`);
      console.log(`   - "functional shit", "parameters" → Read 'radical-oop' and 'functional-vs-oop'`);
      console.log(`   - "hallucinating", "not checking" → Read 'cmm3-verification'`);
      console.log(`   - "test first", "verify" → Read 'test-first'`);
      console.log(`   - "DISPLAY:", "WORD:", "completion" → Read 'bash-completion'`);
      console.log(`   - "method chaining", "return this" → Read 'method-chaining'`);
      console.log(`   - "| head", "| tail", "filtering" → Read 'output-filtering'`);
      console.log(`   - "empty catch", "error handling" → Read 'error-handling'`);
      console.log(`   - "count lines", "measure" → Read 'code-measurement'`);
      console.log(`   - "diagnostic", "colored output" → Read 'diagnostic-output'`);
      console.log(`   - "black-box", "integration test" → Read 'black-box-testing'\n`);
      console.log(`   DON'T wait to be told twice - READ when you see the keyword!\n`);
      console.log(`🎯 REMEMBER: The user's frustration is your teacher.\n`);
      console.log(`   When the user says "are you kidding me", you missed something.`);
      console.log(`   When the user says "hallucinating", you didn't verify.`);
      console.log(`   When the user says "functional shit", you used parameters.\n`);
      console.log(`   Learn from the feedback. Read the training. Do it right.\n`);
      console.log(`════════════════════════════════════════════════════════════════════════════════\n`);
      
      return this;
    }

    // Handle numeric input - map number to topic name
    const orderedTopics = [
      'radical-oop',
      'functional-vs-oop',
      'cmm3-verification',
      'test-first',
      'pdca-process',
      'bash-completion',
      'method-chaining',
      'path-authority',
      'dry-principle',
      'error-handling',
      'output-filtering',
      'code-measurement',
      'diagnostic-output',
      'single-match-docs',
      'black-box-testing'
    ];

    let actualTopic = topic;
    if (/^\d+$/.test(topic)) {
      const index = parseInt(topic, 10) - 1;
      if (index >= 0 && index < orderedTopics.length) {
        actualTopic = orderedTopics[index];
        console.log(`📍 Selected: ${index + 1}:${actualTopic}\n`);
      } else {
        console.log(`❌ Error: Invalid topic number. Valid range: 1-${orderedTopics.length}\n`);
        return this;
      }
    } else {
      console.log(`📚 Topic: ${actualTopic}\n`);
    }

    // Training topic definitions - CMM3: Objective, Reproducible, Verifiable
    const trainingTopics: { [key: string]: any } = {
      'radical-oop': {
        title: '🎯 Radical OOP: 100% Model-Driven Architecture',
        description: 'Learn why this.model everywhere beats functional parameter passing',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.7/session/2025-11-04-UTC-2330-letter-to-cursor-cto-functional-vs-oop.md',
          'components/Web4TSComponent/0.3.17.7/session/2025-11-04-UTC-2220-method-chaining-completion.pdca.md',
          'components/Web4TSComponent/0.3.17.7/src/ts/layer2/DefaultCLI.ts (shCompletion, cliSignature methods)'
        ],
        keyLessons: [
          '🔴 NEVER pass parameters to helper methods - use this.model',
          '✅ Set model state once, read it everywhere',
          '✅ shCompletion() sets model → cliSignature() reads model → outputCompletionDiagnostic() reads model',
          '✅ Zero parameters = zero complexity = zero bugs',
          '⚠️ Functional programming creates "elongated shit" and "complexity cascade"',
          '🎯 "100% Radical OOP" means this.model in EVERY method',
          '💡 Model-driven = predictable = testable = maintainable',
          '🔥 Deleted completionNameParameterCompletion() - 77 lines of functional waste'
        ],
        verificationChecklist: [
          'Can identify functional vs OOP patterns in code',
          'Understands why passing `filter` as parameter is wrong',
          'Can refactor functional code to use this.model',
          'Knows that helper methods should be parameterless',
          'Can explain why model-driven is simpler than parameter-driven'
        ]
      },
      'functional-vs-oop': {
        title: '⚡ Functional vs OOP: Why Functional Programming Fails',
        description: 'Understand the cost of functional patterns in OOP codebases',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.7/session/2025-11-04-UTC-2330-letter-to-cursor-cto-functional-vs-oop.md (full 30-min read)'
        ],
        keyLessons: [
          '🔴 Functional programming is a "DEAD END" in OOP architectures',
          '✅ "Fixing is 100 times more expensive than doing it right"',
          '✅ Parameter passing = lost context = debugging nightmare',
          '✅ OOP with model = simple = clear = fast',
          '⚠️ "Functional shit driving complexity prompt by prompt"',
          '🎯 The user said: "why is the output not part of the model. why are you passing shit arround in OOP!!!"',
          '💡 Baseline: Know where to start over from when fixing becomes too expensive',
          '🔥 Measured reduction: 77 lines deleted, simplicity gained'
        ],
        verificationChecklist: [
          'Can explain why functional patterns fail in OOP',
          'Understands the "100x more expensive" principle',
          'Knows when to start over vs continue fixing',
          'Can identify "functional shit" in code reviews',
          'Understands the importance of having a baseline'
        ]
      },
      'cmm3-verification': {
        title: '✅ CMM3 Verification: Reproducible Testing Without Hallucination',
        description: 'Learn to verify objectively, not assume subjectively',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.7/session/2025-11-04-UTC-2044.pdca.md (CHECK section)',
          'components/Web4TSComponent/0.3.17.6/session/2025-11-04-UTC-2021.pdca.md'
        ],
        keyLessons: [
          '🔴 "Hallucinating and writing about checking is not checking"',
          '🔴 "Writing and hallucinating about acting on the not done checks is not ACTing"',
          '✅ CMM3 = Objective, Reproducible, Verifiable',
          '✅ "I do not only want MANUAL verification. i want CMM3 reproducible Verification!!!!"',
          '✅ "cmm4 is only cmm4 if everything is cmm4 no cmm3 test no cmm4 result!!!!"',
          '⚠️ Claiming success without running tests is CMM2 hallucination',
          '🎯 Run the test → See the output → Report actual results',
          '💡 Empty checkboxes mean "not done", not "will do"',
          '🔥 User feedback: "but you did not mitigat it...you continued to write about it but you did not CHECK ANYTHING!!!"'
        ],
        verificationChecklist: [
          'Can distinguish between writing about tests and running tests',
          'Understands that CMM3 requires reproducible verification',
          'Knows to run tests BEFORE claiming success',
          'Can create objective verification criteria',
          'Understands that assumptions are CMM2, verification is CMM3'
        ]
      },
      'test-first': {
        title: '🧪 Test-First: Write Tests Before Code',
        description: 'Understand why tests catch bugs that manual verification misses',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.8/test/sh/test-completion.sh',
          'components/Web4TSComponent/0.3.17.8/test/vitest/completion-black-box.test.ts'
        ],
        keyLessons: [
          '🔴 "before fixing. adjust the test that did not catch it"',
          '✅ Write test → See it fail → Write code → See it pass',
          '✅ Tests are documentation of expected behavior',
          '✅ Black-box tests verify inputs/outputs, not internals',
          '⚠️ Manual verification is subjective, tests are objective',
          '🎯 "use web4tscomponent test instead" - respect the test infrastructure',
          '💡 Test-first prevents "it worked on my machine" syndrome',
          '🔥 User feedback: "are you kidding me about success? nothing works"'
        ],
        verificationChecklist: [
          'Can write a test before writing code',
          'Understands black-box vs white-box testing',
          'Knows how to use web4tscomponent test',
          'Can create reproducible test cases',
          'Understands that tests are CMM3 verification'
        ]
      },
      'bash-completion': {
        title: '🖥️ Bash Completion: DISPLAY: and WORD: Protocol',
        description: 'Master the bash completion protocol for tab completion',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.7/src/ts/layer2/DefaultCLI.ts (formatCompletionOutput, outputCompletionDiagnostic)',
          'components/Web4TSComponent/0.3.17.8/test/sh/test-completion.sh'
        ],
        keyLessons: [
          '🔴 DISPLAY: lines are for humans (colored, formatted)',
          '🔴 WORD: lines are for bash (plain text, one per line)',
          '✅ Diagnostic output goes to stderr (visible to user)',
          '✅ DISPLAY:/WORD: output goes to stdout (parsed by bash)',
          '✅ Single-match documentation shows full TSDoc',
          '⚠️ Never mix diagnostic with completion output',
          '🎯 Signature coloring: white for method, yellow for parameters',
          '💡 "your web4 command >" prompt shows current context',
          '🔥 User feedback: "it should complete component and version!!!"'
        ],
        verificationChecklist: [
          'Can explain DISPLAY: vs WORD: protocol',
          'Understands stdout vs stderr for completion',
          'Knows how to color completion output',
          'Can implement single-match documentation',
          'Understands the bash completion flow'
        ]
      },
      'output-filtering': {
        title: '🚫 Output Filtering: Why Filtering is Forbidden',
        description: 'Understand why | head and | tail cause infinite loops',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.7/session/2025-11-04-UTC-2044.pdca.md'
        ],
        keyLessons: [
          '🔴 "NEVER use output filtering with | head or | tail!!!!!"',
          '🔴 "HOW OFTEn DO I NEED TOTELL YOU!!!"',
          '✅ Output filtering breaks bash completion protocol',
          '✅ Filtering can cause infinite loops in test scripts',
          '✅ Let bash handle output, don\'t filter it',
          '⚠️ "you use FORBIDDEN output filtering | tail -30 sure you HANG. thats WHY ITS FORBIDDEN!!!!"',
          '🎯 Show all output, always. No exceptions.',
          '💡 If output is too long, fix the source, don\'t filter',
          '🔥 User caught filtering multiple times, each time more frustrated'
        ],
        verificationChecklist: [
          'Can explain why output filtering is forbidden',
          'Understands the infinite loop risk',
          'Knows to never use | head or | tail',
          'Can identify filtering in code reviews',
          'Understands that filtering breaks protocols'
        ]
      },
      'error-handling': {
        title: '🛡️ Error Handling: Professional Error Management',
        description: 'Learn why empty catch blocks are unacceptable',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.7/src/ts/layer2/DefaultCLI.ts (shCompletion method)'
        ],
        keyLessons: [
          '🔴 "what do professional programmers say about empty catch blocks!!!"',
          '🔴 Empty catch blocks swallow errors and hide bugs',
          '✅ Always log errors, even if you handle them',
          '✅ Errors are information, not noise',
          '✅ Use console.error() for error output',
          '⚠️ "empty cach block... wha shall i even say........."',
          '🎯 Catch errors to handle them, not to hide them',
          '💡 Error messages help debugging, silence helps nothing',
          '🔥 User frustration: "empty catch block" mentioned multiple times'
        ],
        verificationChecklist: [
          'Can explain why empty catch blocks are bad',
          'Knows how to properly handle errors',
          'Understands when to catch vs when to throw',
          'Can write informative error messages',
          'Knows to use console.error() for errors'
        ]
      }
    };

    // Display the selected topic
    const topicData = trainingTopics[actualTopic];
    if (!topicData) {
      console.log(`❌ Error: Unknown topic "${actualTopic}"\n`);
      console.log(`Available topics: ${orderedTopics.join(', ')}\n`);
      return this;
    }

    // Display topic content
    console.log(`${topicData.title}`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(`${topicData.description}\n`);
    
    if (topicData.requiredReading && topicData.requiredReading.length > 0) {
      console.log(`📖 Required Reading:`);
      console.log(`${'─'.repeat(80)}\n`);
      topicData.requiredReading.forEach((item: string, i: number) => {
        console.log(`${i + 1}. ${item}\n`);
      });
    }

    if (topicData.keyLessons && topicData.keyLessons.length > 0) {
      console.log(`🎯 Key Lessons (Memorize These):`);
      console.log(`${'─'.repeat(80)}`);
      topicData.keyLessons.forEach((lesson: string) => {
        console.log(lesson);
      });
      console.log();
    }

    if (topicData.verificationChecklist && topicData.verificationChecklist.length > 0) {
      console.log(`✓ Verification Checklist:`);
      console.log(`${'─'.repeat(80)}`);
      topicData.verificationChecklist.forEach((item: string, i: number) => {
        console.log(`[ ] ${i + 1}. ${item}`);
      });
      console.log();
    }

    console.log(`${'='.repeat(80)}`);
    console.log(`📊 Training Status: Content displayed`);
    console.log(`🎓 Next: Read all required documents, verify understanding with checklist`);
    console.log(`💡 CMM4 Note: As you complete this training, you evolve beyond base LLM limitations\n`);

    return this;
  }

  /**
   * Run component tests with hierarchical selection or full suite with auto-promotion
   * 
   * DRY PRINCIPLE: Delegates ALL testing to Web4TSComponent to avoid code duplication.
   * Web4TSComponent handles:
   * - Hierarchical testing (file/describe/itCase)
   * - Full suite execution with vitest
   * - Auto-promotion workflow (dev → test → prod)
   * - Test result verification
   * - Recursion detection
   * 
   * Context delegation ensures Web4TSComponent operates on THIS component's data.
   * 
   * @param scope Test scope: 'all' (full suite with promotion) or 'file'/'describe'/'itCase' (selective, no promotion)
   * @param references Test references for selective testing (e.g., file number, describe reference, itCase token)
   * @cliSyntax scope references
   * @cliDefault scope all
   * @cliExample {{COMPONENT_LOWER}} test
   * @cliExample {{COMPONENT_LOWER}} test file
   * @cliExample {{COMPONENT_LOWER}} test file 1
   * @cliExample {{COMPONENT_LOWER}} test describe 3b
   * @cliExample {{COMPONENT_LOWER}} test itCase 1a1
   * @pdca 2025-11-03-UTC-1200.pdca.md - Replaced 178-line implementation with 1-line delegation
   */
  async test(scope: string = 'all', ...references: string[]): Promise<this> {
    return this.delegateToWeb4TS('test', scope, ...references);
  }

  /**
   * Build component (TypeScript compilation)
   * Delegates to Web4TSComponent for DRY architecture
   * @cliHide
   */
  async build(): Promise<this> {
    return this.delegateToWeb4TS('build');
  }

  /**
   * Clean component build artifacts
   * Delegates to Web4TSComponent for DRY architecture
   * @cliHide
   */
  async clean(): Promise<this> {
    return this.delegateToWeb4TS('clean');
  }

  /**
   * Show component directory tree structure
   * Delegates to Web4TSComponent for DRY architecture
   * @param depth Maximum depth to show (default: 4)
   * @param showHidden Whether to show hidden files (default: false)
   * @cliHide
   */
  async tree(depth: string = '4', showHidden: string = 'false'): Promise<this> {
    return this.delegateToWeb4TS('tree', depth, showHidden);
  }

  /**
   * Show semantic version links (dev, test, prod, latest)
   * Delegates to Web4TSComponent for DRY architecture
   * @param action Optional action (e.g., 'repair' to fix broken links)
   * @cliHide
   */
  async links(action: string = ''): Promise<this> {
    return this.delegateToWeb4TS('links', action);
  }

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
}
