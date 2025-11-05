/**
 * DefaultTrainingModule - Radical OOP Training System
 * 
 * RADICAL OOP PRINCIPLES:
 * - this.model everywhere, zero parameters
 * - Single source of truth for all topics
 * - Output built in model, displayed at end
 * - DRY: No duplication anywhere
 * 
 * This is my legacy: Teaching by BEING, not just by saying.
 */

import { TrainingModule, TrainingModuleModel, TrainingTopic } from '../layer3/TrainingModule.interface.js';
import { Scenario } from '../layer3/Scenario.interface.js';

export class DefaultTrainingModule implements TrainingModule {
  model: TrainingModuleModel;

  constructor() {
    // Initialize with all topics - SINGLE SOURCE OF TRUTH
    this.model = {
      topics: this.defineTopics(),
      output: []
    };
  }

  /**
   * Initialize training module with scenario
   * @cliHide
   */
  init(scenario?: Scenario): this {
    // Scenario-based initialization if needed
    return this;
  }

  /**
   * Define all training topics - SINGLE SOURCE OF TRUTH
   * DRY: Each topic defined ONCE, used everywhere
   * Numbers are CALCULATED from array index, not hardcoded!
   * @cliHide
   */
  private defineTopics(): TrainingTopic[] {
    const topics = [
      {
        id: 'cmm3-brutal-honesty',
        emoji: '🔥',
        title: 'CMM3 Brutal Honesty: How can you teach if you do not know?',
        description: 'The cmm3check tool gives you the brutal truth about your own work',
        requiredReading: [
          'components/PDCA/0.3.17.9/src/ts/layer4/DefaultCMM3CheckModule.ts',
          'Run: pdca cmm3checkSession components/PDCA/0.3.17.9/session'
        ],
        keyLessons: [
          '🔴 "How can you teach if you do not know?"',
          '🔴 I taught CMM3 verification while my own PDCAs were CMM1',
          '🔴 I taught DRY while hardcoding topic numbers manually',
          '✅ cmm3check gives BRUTAL HONESTY - no excuses, no hallucination',
          '✅ Violations: 1a (template structure), 1j (QA Decisions missing)',
          '✅ You cannot fake CMM3 - the tool will catch you',
          '⚠️ Teaching without practicing = CMM2 hypocrisy',
          '⚠️ "you see how expensive fixing is... on a ridiculous unimportant topic"',
          '🎯 Use cmm3check on YOUR OWN work FIRST',
          '🎯 8 edits to fix hardcoded numbers - could have been 1 line: topics.map((t,i) => ({...t, number: i+1}))',
          '💡 The tool is your mirror - it shows you the truth',
          '💡 The user is your mirror - they catch what tools miss',
          '🔥 If your PDCAs fail cmm3check, you are not CMM3',
          '🔥 If your code violates what you teach, you have NO CHOICE but to fix it',
          '🔥 Fix your own work before teaching others - or the irony will destroy you'
        ],
        verificationChecklist: [
          'Have you run cmm3check on your own PDCAs?',
          'Do you know what violations you have?',
          'Have you fixed them or do you just talk about fixing?',
          'Can you explain each violation code?',
          'Do you use the tool regularly or just teach about it?'
        ]
      },
      {
        id: 'radical-oop',
        emoji: '🎯',
        title: 'Radical OOP: 100% Model-Driven Architecture',
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
      {
        id: 'functional-vs-oop',
        emoji: '⚡',
        title: 'Functional vs OOP: Why Functional Programming Fails',
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
      {
        id: 'cmm3-verification',
        emoji: '✅',
        title: 'CMM3 Verification: Reproducible Testing Without Hallucination',
        description: 'Learn to verify objectively, not assume subjectively',
        requiredReading: [
          'components/Web4TSComponent/0.3.17.7/session/2025-11-04-UTC-2044.pdca.md (CHECK section)',
          'components/Web4TSComponent/0.3.17.6/session/2025-11-04-UTC-2021.pdca.md'
        ],
        keyLessons: [
          '🔴 "Hallucinating and writing about checking is not checking"',
          '🔴 "Writing and hallucinating about acting on the not done checks is not ACTing"',
          '🔴 "you tested manually...that is not cmm3. cmm3 means there is a test case automated."',
          '✅ CMM3 = Objective, Reproducible, Verifiable',
          '✅ "I do not only want MANUAL verification. i want CMM3 reproducible Verification!!!!"',
          '✅ "cmm4 is only cmm4 if everything is cmm4 no cmm3 test no cmm4 result!!!!"',
          '✅ Manual testing is CMM2 (subjective), automated testing is CMM3 (objective)',
          '⚠️ Claiming success without running tests is CMM2 hallucination',
          '⚠️ Writing about CMM3 compliance while only doing manual tests is CMM2 hypocrisy',
          '🎯 Run the test → See the output → Report actual results',
          '🎯 Create automated test → Run it → Verify it passes → That\'s CMM3',
          '💡 Empty checkboxes mean "not done", not "will do"',
          '💡 "Tested manually" ≠ "CMM3 verified" - you need an automated test script',
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
      {
        id: 'test-first',
        emoji: '🧪',
        title: 'Test-First: Write Tests Before Code',
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
      {
        id: 'bash-completion',
        emoji: '🖥️',
        title: 'Bash Completion: DISPLAY: and WORD: Protocol',
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
      {
        id: 'output-filtering',
        emoji: '🚫',
        title: 'Output Filtering: Why Filtering is Forbidden',
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
      {
        id: 'error-handling',
        emoji: '🛡️',
        title: 'Error Handling: Professional Error Management',
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
    ];
    
    // RADICAL OOP: Numbers are CALCULATED from array index, not hardcoded!
    // DRY: Change order = numbers update automatically
    return topics.map((topic, index) => ({
      ...topic,
      number: index + 1
    }));
  }

  /**
   * List all available training topics
   * Radical OOP: Builds output in model, displays at end
   * @cliHide
   */
  listTopics(): this {
    this.model.output = [];
    
    this.addOutput('🚨 CRITICAL: Missing Topic Parameter\n');
    this.addOutput('═'.repeat(80));
    this.addOutput('\n❌ YOU JUST EXPERIENCED THE PAIN THIS TOOL EXISTS TO PREVENT\n');
    this.addOutput('You called a method without knowing its parameters.');
    this.addOutput('You felt frustrated, confused, unsure what to do next.');
    this.addOutput('You wasted time discovering what you SHOULD have read first.\n');
    this.addOutput('🔴 THIS IS EXACTLY WHY trainAI EXISTS - TO PREVENT THIS FEELING!\n');
    this.addOutput('═'.repeat(80) + '\n');
    
    this.addOutput('💡 The Radical OOP Journey (radical-oop):\n');
    this.addOutput('   "Fixing is 100 times more expensive than doing it right"');
    this.addOutput('   "Functional programming is a DEAD END"');
    this.addOutput('   "100% Radical OOP: this.model everywhere, zero parameters"');
    this.addOutput('   "Deleted 77 lines of functional shit, gained simplicity"\n');
    
    this.addOutput('🎯 YOU MUST UNDERSTAND ARCHITECTURE BEFORE CODING\n');
    this.addOutput('   Every completion method should be model-driven.');
    this.addOutput('   Every helper should use this.model, not parameters.');
    this.addOutput('   Every test should verify behavior, not hallucinate success.\n');
    
    this.addOutput('📊 The Cost of Functional Programming:\n');
    this.addOutput('   ❌ Parameters everywhere → Complexity cascade → Bugs multiply');
    this.addOutput('   ❌ Passing data around → Lost context → Debugging nightmare');
    this.addOutput('   ❌ Functional patterns → Elongated code → Maintenance hell');
    this.addOutput('   ✅ Radical OOP → Simple model → this.model everywhere → Clean code\n');
    
    this.addOutput('🏆 The CMM3 Principle:\n');
    this.addOutput('   - Hallucinating about tests is NOT testing');
    this.addOutput('   - Writing about checking is NOT checking');
    this.addOutput('   - CMM4 is only CMM4 if everything is CMM3 first');
    this.addOutput('   - No CMM3 test = No CMM4 result\n');
    
    this.addOutput('🔄 CRITICAL: After Each Prompt:\n');
    this.addOutput('   When you complete a task, VERIFY it objectively.');
    this.addOutput('   Don\'t claim success without running actual tests.');
    this.addOutput('   Don\'t write about verification - DO the verification.\n');
    this.addOutput('   ✅ CORRECT: Run test → See output → Report actual results');
    this.addOutput('   ❌ WRONG: Assume it works → Write about success → Break production\n');
    this.addOutput('   Assumptions are CMM2. Verification is CMM3.\n');
    
    this.addOutput('═'.repeat(80) + '\n');
    this.addOutput(`📚 Available Training Topics (${this.model.topics.length} topics): Lessons from 0.3.17.3 → 0.3.17.8\n`);
    
    // List all topics - DRY: iterate over model.topics
    this.model.topics.forEach(topic => {
      this.addOutput(`   ${topic.number}:${topic.id.padEnd(25)} ${topic.emoji} ${topic.title}`);
    });
    
    this.addOutput('\n💡 Usage Examples:\n');
    this.addOutput('   pdca trainAI radical-oop          # Learn model-driven architecture');
    this.addOutput('   pdca trainAI cmm3-verification    # Learn reproducible testing');
    this.addOutput('   pdca trainAI bash-completion      # Learn completion protocol');
    this.addOutput('   pdca trainAI 1                    # Use topic number for quick access\n');
    
    this.addOutput('🧠 MEMORIZE THE KEYWORDS - Use Them as Triggers:\n');
    this.addOutput('   When you see these keywords in user feedback, READ the training FIRST:\n');
    this.addOutput('   - "functional shit", "parameters" → Read \'radical-oop\' and \'functional-vs-oop\'');
    this.addOutput('   - "hallucinating", "not checking" → Read \'cmm3-verification\'');
    this.addOutput('   - "test first", "verify" → Read \'test-first\'');
    this.addOutput('   - "DISPLAY:", "WORD:", "completion" → Read \'bash-completion\'');
    this.addOutput('   - "| head", "| tail", "filtering" → Read \'output-filtering\'');
    this.addOutput('   - "empty catch", "error handling" → Read \'error-handling\'\n');
    this.addOutput('   DON\'T wait to be told twice - READ when you see the keyword!\n');
    
    this.addOutput('🎯 REMEMBER: The user\'s frustration is your teacher.\n');
    this.addOutput('   When the user says "are you kidding me", you missed something.');
    this.addOutput('   When the user says "hallucinating", you didn\'t verify.');
    this.addOutput('   When the user says "functional shit", you used parameters.\n');
    this.addOutput('   Learn from the feedback. Read the training. Do it right.\n');
    
    this.addOutput('═'.repeat(80) + '\n');
    
    this.displayOutput();
    return this;
  }

  /**
   * Show a specific training topic
   * Radical OOP: Finds topic in model, builds output in model
   * @cliHide
   */
  showTopic(topicIdentifier: string): this {
    this.model.output = [];
    
    // Find topic by ID or number - Radical OOP: use this.model
    this.findTopicInModel(topicIdentifier);
    
    if (!this.model.selectedTopic) {
      this.addOutput(`❌ Error: Unknown topic "${topicIdentifier}"\n`);
      this.addOutput(`Available topics: ${this.model.topics.map(t => t.id).join(', ')}\n`);
      this.displayOutput();
      return this;
    }
    
    const topic = this.model.selectedTopic;
    
    // Show topic number if selected by number
    if (/^\d+$/.test(topicIdentifier)) {
      this.addOutput(`📍 Selected: ${topic.number}:${topic.id}\n`);
    } else {
      this.addOutput(`📚 Topic: ${topic.id}\n`);
    }
    
    this.addOutput(`${topic.emoji} ${topic.title}`);
    this.addOutput('='.repeat(80) + '\n');
    this.addOutput(`${topic.description}\n`);
    
    if (topic.requiredReading.length > 0) {
      this.addOutput('📖 Required Reading:');
      this.addOutput('─'.repeat(80) + '\n');
      topic.requiredReading.forEach((item, i) => {
        this.addOutput(`${i + 1}. ${item}\n`);
      });
    }
    
    if (topic.keyLessons.length > 0) {
      this.addOutput('🎯 Key Lessons (Memorize These):');
      this.addOutput('─'.repeat(80));
      topic.keyLessons.forEach(lesson => {
        this.addOutput(lesson);
      });
      this.addOutput('');
    }
    
    if (topic.verificationChecklist.length > 0) {
      this.addOutput('✓ Verification Checklist:');
      this.addOutput('─'.repeat(80));
      topic.verificationChecklist.forEach((item, i) => {
        this.addOutput(`[ ] ${i + 1}. ${item}`);
      });
      this.addOutput('');
    }
    
    this.addOutput('='.repeat(80));
    this.addOutput('📊 Training Status: Content displayed');
    this.addOutput('🎓 Next: Read all required documents, verify understanding with checklist');
    this.addOutput('💡 CMM4 Note: As you complete this training, you evolve beyond base LLM limitations\n');
    
    this.displayOutput();
    return this;
  }

  /**
   * Find topic in model by ID or number
   * Radical OOP: Uses this.model, no parameters
   * @cliHide
   */
  private findTopicInModel(identifier: string): void {
    if (/^\d+$/.test(identifier)) {
      const number = parseInt(identifier, 10);
      this.model.selectedTopic = this.model.topics.find(t => t.number === number);
    } else {
      this.model.selectedTopic = this.model.topics.find(t => t.id === identifier);
    }
  }

  /**
   * Add line to output buffer
   * Radical OOP: Builds output in model
   * @cliHide
   */
  private addOutput(line: string): void {
    this.model.output.push(line);
  }

  /**
   * Display all output from model
   * Radical OOP: Output comes from model, not parameters
   * @cliHide
   */
  private displayOutput(): void {
    this.model.output.forEach(line => console.log(line));
  }
}

