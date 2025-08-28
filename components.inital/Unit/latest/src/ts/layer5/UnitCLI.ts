/**
 * Unit Command Line Interface - Layer 5 (User Experience)
 * 
 * Provides CLI interface for Unit component operations
 */

import { DefaultUnit } from '../layer2/DefaultUnit.js';
import { Unit, UnitScenario, UnitInput, UnitState, UnitLifecyclePhase } from '../layer3/Unit.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class UnitCLI {
  private unit: DefaultUnit;

  constructor() {
    // Get directory context from environment variable set by shell script
    const directoryContext = process.env.DIRECTORY_CONTEXT || 'arbitrary:' + process.cwd();
    this.unit = new DefaultUnit();
  }

  async handleCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
      this.showUsage();
      return;
    }

    const command = args[0];
    
    switch (command) {
      case 'create':
        await this.handleCreate(args.slice(1));
        break;
      case 'execute':
        await this.handleExecute(args.slice(1));
        break;
      case 'activate':
        await this.handleActivate(args.slice(1));
        break;
      case 'deactivate':
        await this.handleDeactivate(args.slice(1));
        break;
      case 'hibernate':
        await this.handleHibernate(args.slice(1));
        break;
      case 'restore':
        await this.handleRestore(args.slice(1));
        break;
      case 'status':
        await this.handleStatus(args.slice(1));
        break;
      case 'capabilities':
        await this.handleCapabilities(args.slice(1));
        break;
      case 'metadata':
        await this.handleMetadata(args.slice(1));
        break;
      case 'list':
        await this.handleList(args.slice(1));
        break;
      default:
        console.error(`❌ Unknown command: ${command}`);
        this.showUsage();
    }
  }

  private async handleCreate(args: string[]): Promise<void> {
    if (args.length < 3) {
      console.error('❌ Usage: unit create <unitId> <unitName> <description> [businessLogicType]');
      return;
    }

    const [unitId, unitName, description] = args;
    const businessLogicType = args[3] || 'transform';

    try {
      // Create a basic unit scenario
      const scenario = this.createUnitScenario(unitId, unitName, description, businessLogicType);
      
      // Initialize unit with scenario
      this.unit.init(scenario);
      
      // Save scenario to file
      const scenarioPath = await this.saveUnitScenario(scenario, unitId);
      
      console.log('✅ Unit created successfully');
      console.log(`📋 Unit ID: ${unitId}`);
      console.log(`📄 Unit Name: ${unitName}`);
      console.log(`📝 Description: ${description}`);
      console.log(`⚙️  Business Logic: ${businessLogicType}`);
      console.log(`💾 Scenario saved: ${scenarioPath}`);

    } catch (error) {
      console.error('❌ Error creating unit:', (error as Error).message);
    }
  }

  private async handleExecute(args: string[]): Promise<void> {
    if (args.length < 2) {
      console.error('❌ Usage: unit execute <unitId> <inputData>');
      return;
    }

    const [unitId, inputDataStr] = args;

    try {
      // Load unit scenario
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);

      // Parse input data
      let inputData: any;
      try {
        inputData = JSON.parse(inputDataStr);
      } catch {
        inputData = inputDataStr; // Use as string if not valid JSON
      }

      // Create unit input
      const unitInput: UnitInput = {
        data: inputData,
        metadata: this.unit.getMetadata(),
        context: {
          environmentType: 'nodejs',
          resourceLimits: {
            maxMemoryMB: 100,
            maxExecutionTimeMs: 5000,
            maxNetworkCallsPerSecond: 10,
            maxDiskUsageMB: 10
          },
          securityContext: {
            permissions: ['read', 'write'],
            securityLevel: 'internal',
            encryptionRequired: false
          },
          networkContext: {
            allowedHosts: ['*'],
            networkZone: 'internal',
            timeoutMs: 3000
          }
        }
      };

      // Execute unit
      console.log('⚡ Executing unit...');
      const output = await this.unit.execute(unitInput);

      console.log('✅ Unit execution completed');
      console.log(`📊 Execution ID: ${output.evidence.executionId}`);
      console.log(`⏱️  Duration: ${output.evidence.resourceUsage.executionTimeMs}ms`);
      console.log(`💾 Memory: ${output.evidence.resourceUsage.memoryUsedMB}MB`);
      console.log('📤 Result:');
      console.log(JSON.stringify(output.result, null, 2));

    } catch (error) {
      console.error('❌ Error executing unit:', (error as Error).message);
    }
  }

  private async handleActivate(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: unit activate <unitId>');
      return;
    }

    const [unitId] = args;

    try {
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);
      await this.unit.activate();
      
      console.log('✅ Unit activated successfully');
      console.log(`📋 Unit ID: ${unitId}`);
      console.log(`🔄 Current State: ${scenario.getCurrentState()}`);

    } catch (error) {
      console.error('❌ Error activating unit:', (error as Error).message);
    }
  }

  private async handleDeactivate(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: unit deactivate <unitId>');
      return;
    }

    const [unitId] = args;

    try {
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);
      await this.unit.deactivate();
      
      console.log('✅ Unit deactivated successfully');
      console.log(`📋 Unit ID: ${unitId}`);

    } catch (error) {
      console.error('❌ Error deactivating unit:', (error as Error).message);
    }
  }

  private async handleHibernate(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: unit hibernate <unitId>');
      return;
    }

    const [unitId] = args;

    try {
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);
      const hibernatedScenario = await this.unit.hibernate();
      
      // Save hibernated scenario
      const scenarioPath = await this.saveUnitScenario(hibernatedScenario, unitId);
      
      console.log('✅ Unit hibernated successfully');
      console.log(`📋 Unit ID: ${unitId}`);
      console.log(`💾 Hibernated scenario saved: ${scenarioPath}`);

    } catch (error) {
      console.error('❌ Error hibernating unit:', (error as Error).message);
    }
  }

  private async handleRestore(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: unit restore <unitId>');
      return;
    }

    const [unitId] = args;

    try {
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);
      await this.unit.restore(scenario);
      
      console.log('✅ Unit restored successfully');
      console.log(`📋 Unit ID: ${unitId}`);

    } catch (error) {
      console.error('❌ Error restoring unit:', (error as Error).message);
    }
  }

  private async handleStatus(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: unit status <unitId>');
      return;
    }

    const [unitId] = args;

    try {
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);
      const metadata = this.unit.getMetadata();
      
      console.log('📊 Unit Status');
      console.log(`📋 Unit ID: ${metadata.unitId}`);
      console.log(`📄 Unit Name: ${metadata.unitName}`);
      console.log(`🔢 Version: ${metadata.version}`);
      console.log(`🔄 Current State: ${scenario.getCurrentState()}`);
      console.log(`📅 Lifecycle Phase: ${scenario.getLifecyclePhase()}`);
      console.log(`⏱️  Last Updated: ${metadata.timestamp}`);
      console.log(`🏷️  Tags:`, metadata.tags);

    } catch (error) {
      console.error('❌ Error getting unit status:', (error as Error).message);
    }
  }

  private async handleCapabilities(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: unit capabilities <unitId>');
      return;
    }

    const [unitId] = args;

    try {
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);
      const capabilities = this.unit.getCapabilities();
      
      console.log('🔧 Unit Capabilities');
      console.log(`📋 Unit ID: ${unitId}`);
      
      if (capabilities.length === 0) {
        console.log('📝 No capabilities defined');
      } else {
        capabilities.forEach((capability, index) => {
          console.log(`\n${index + 1}. ${capability.name}`);
          console.log(`   📝 Description: ${capability.description}`);
          console.log(`   📥 Input Types: ${capability.inputTypes.join(', ')}`);
          console.log(`   📤 Output Types: ${capability.outputTypes.join(', ')}`);
          console.log(`   🔗 Dependencies: ${capability.dependencies.join(', ') || 'None'}`);
        });
      }

    } catch (error) {
      console.error('❌ Error getting unit capabilities:', (error as Error).message);
    }
  }

  private async handleMetadata(args: string[]): Promise<void> {
    if (args.length < 1) {
      console.error('❌ Usage: unit metadata <unitId>');
      return;
    }

    const [unitId] = args;

    try {
      const scenario = await this.loadUnitScenario(unitId);
      this.unit.init(scenario);
      const metadata = this.unit.getMetadata();
      const unitInterface = this.unit.getInterface();
      
      console.log('📊 Unit Metadata');
      console.log(JSON.stringify({
        ...metadata,
        interface: unitInterface,
        scenario: {
          description: scenario.getUnitDescription(),
          dependencies: scenario.getDependencies().length,
          businessLogic: scenario.getBusinessLogic()
        }
      }, null, 2));

    } catch (error) {
      console.error('❌ Error getting unit metadata:', (error as Error).message);
    }
  }

  private async handleList(args: string[]): Promise<void> {
    try {
      const unitsDir = path.join(process.cwd(), 'units');
      
      // Check if units directory exists
      try {
        await fs.access(unitsDir);
      } catch {
        console.log('📝 No units found - units directory does not exist');
        console.log(`💡 Create units using: unit create <unitId> <unitName> <description>`);
        return;
      }

      const files = await fs.readdir(unitsDir);
      const unitFiles = files.filter(file => file.endsWith('.unit.json'));
      
      if (unitFiles.length === 0) {
        console.log('📝 No units found');
        console.log(`💡 Create units using: unit create <unitId> <unitName> <description>`);
        return;
      }

      console.log('📋 Available Units');
      console.log('──────────────────');
      
      for (const file of unitFiles) {
        const unitId = file.replace('.unit.json', '');
        try {
          const scenario = await this.loadUnitScenario(unitId);
          console.log(`🔧 ${scenario.getUnitName()} (${unitId})`);
          console.log(`   📝 ${scenario.getUnitDescription()}`);
          console.log(`   🔢 Version: ${scenario.getUnitVersion()}`);
          console.log(`   📅 Phase: ${scenario.getLifecyclePhase()}`);
          console.log('');
        } catch (error) {
          console.log(`❌ ${unitId} (error loading: ${(error as Error).message})`);
        }
      }

    } catch (error) {
      console.error('❌ Error listing units:', (error as Error).message);
    }
  }

  private showUsage(): void {
    console.log(`
Unit CLI - Web4 Unit Management Tool

Usage: unit <command> [arguments]

Commands:
  create <unitId> <unitName> <description> [businessLogicType]
                        Create a new unit with the given parameters
                        businessLogicType: transform|validate|compute|coordinate|persist|communicate
  
  execute <unitId> <inputData>
                        Execute a unit with the provided input data
  
  activate <unitId>     Activate a unit (make it ready for execution)
  deactivate <unitId>   Deactivate a unit
  hibernate <unitId>    Hibernate a unit (save state and deactivate)
  restore <unitId>      Restore a unit from hibernated state
  
  status <unitId>       Show unit status and metadata
  capabilities <unitId> Show unit capabilities
  metadata <unitId>     Show detailed unit metadata (JSON format)
  
  list                  List all available units

Examples:
  unit create calc-001 "Calculator" "Basic math operations" compute
  unit execute calc-001 '{"operation": "add", "a": 5, "b": 3}'
  unit status calc-001
  unit list

Note: Units are stored in the ./units/ directory as .unit.json files
`);
  }

  private createUnitScenario(unitId: string, unitName: string, description: string, businessLogicType: string): UnitScenario {
    return {
      // Scenario interface methods
      serialize: () => JSON.stringify({
        unitId,
        unitName,
        description,
        businessLogicType,
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }),
      validate: () => true,
      getReferences: () => [],

      // UnitScenario interface methods
      getUnitId: () => unitId,
      getUnitName: () => unitName,
      getUnitDescription: () => description,
      getUnitVersion: () => '1.0.0',
      
      getCapabilities: () => [{
        name: `${businessLogicType}-capability`,
        description: `Capability for ${businessLogicType} operations`,
        inputTypes: ['any'],
        outputTypes: ['any'],
        dependencies: [],
        qualityOfService: {
          maxExecutionTime: 5000,
          maxMemoryUsage: 100,
          reliability: 0.95,
          availability: 0.99,
          consistency: 'strong'
        }
      }],
      
      getInputInterface: () => ({
        name: 'default-input',
        version: '1.0.0',
        parameters: [{
          name: 'data',
          type: { name: 'any', schema: {}, constraints: [] },
          required: true,
          description: 'Input data for processing',
          validation: []
        }],
        returnType: { name: 'any', schema: {}, constraints: [] },
        errorTypes: []
      }),
      
      getOutputInterface: () => ({
        name: 'default-output',
        version: '1.0.0',
        parameters: [],
        returnType: { name: 'any', schema: {}, constraints: [] },
        errorTypes: []
      }),
      
      getDependencies: () => [],
      getCollaborators: () => [],
      getParentComponent: () => ({
        resolve: async () => null,
        getEndpoint: () => 'component://Unit/latest',
        isLocal: () => true,
        serialize: () => JSON.stringify({ component: 'Unit', version: 'latest' })
      }),
      
      getExecutionContext: () => ({
        environmentType: 'nodejs',
        resourceLimits: {
          maxMemoryMB: 100,
          maxExecutionTimeMs: 5000,
          maxNetworkCallsPerSecond: 10,
          maxDiskUsageMB: 10
        },
        securityContext: {
          permissions: ['read', 'write'],
          securityLevel: 'internal',
          encryptionRequired: false
        },
        networkContext: {
          allowedHosts: ['*'],
          networkZone: 'internal',
          timeoutMs: 3000
        }
      }),
      
      getBusinessLogic: () => ({
        operationType: businessLogicType as any,
        algorithmDescription: `Default ${businessLogicType} algorithm`,
        businessRules: [],
        validationRules: [],
        transformationRules: []
      }),
      
      getCurrentState: () => UnitState.INITIALIZED,
      getLifecyclePhase: () => UnitLifecyclePhase.IMPLEMENTATION
    };
  }

  private async saveUnitScenario(scenario: UnitScenario, unitId: string): Promise<string> {
    const unitsDir = path.join(process.cwd(), 'units');
    await fs.mkdir(unitsDir, { recursive: true });
    
    const scenarioPath = path.join(unitsDir, `${unitId}.unit.json`);
    const scenarioData = {
      unitId: scenario.getUnitId(),
      unitName: scenario.getUnitName(),
      unitDescription: scenario.getUnitDescription(),
      unitVersion: scenario.getUnitVersion(),
      currentState: scenario.getCurrentState(),
      lifecyclePhase: scenario.getLifecyclePhase(),
      businessLogic: scenario.getBusinessLogic(),
      capabilities: scenario.getCapabilities(),
      inputInterface: scenario.getInputInterface(),
      outputInterface: scenario.getOutputInterface(),
      executionContext: scenario.getExecutionContext(),
      timestamp: new Date().toISOString()
    };
    
    await fs.writeFile(scenarioPath, JSON.stringify(scenarioData, null, 2));
    return scenarioPath;
  }

  private async loadUnitScenario(unitId: string): Promise<UnitScenario> {
    const unitsDir = path.join(process.cwd(), 'units');
    const scenarioPath = path.join(unitsDir, `${unitId}.unit.json`);
    
    try {
      const scenarioData = JSON.parse(await fs.readFile(scenarioPath, 'utf8'));
      
      return {
        serialize: () => JSON.stringify(scenarioData),
        validate: () => true,
        getReferences: () => [],
        
        getUnitId: () => scenarioData.unitId,
        getUnitName: () => scenarioData.unitName,
        getUnitDescription: () => scenarioData.unitDescription,
        getUnitVersion: () => scenarioData.unitVersion,
        
        getCapabilities: () => scenarioData.capabilities || [],
        getInputInterface: () => scenarioData.inputInterface,
        getOutputInterface: () => scenarioData.outputInterface,
        
        getDependencies: () => [],
        getCollaborators: () => [],
        getParentComponent: () => ({
          resolve: async () => null,
          getEndpoint: () => 'component://Unit/latest',
          isLocal: () => true,
          serialize: () => JSON.stringify({ component: 'Unit', version: 'latest' })
        }),
        
        getExecutionContext: () => scenarioData.executionContext,
        getBusinessLogic: () => scenarioData.businessLogic,
        
        getCurrentState: () => scenarioData.currentState || UnitState.INITIALIZED,
        getLifecyclePhase: () => scenarioData.lifecyclePhase || UnitLifecyclePhase.IMPLEMENTATION
      };
      
    } catch (error) {
      throw new Error(`Failed to load unit scenario for ${unitId}: ${(error as Error).message}`);
    }
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new UnitCLI();
  const args = process.argv.slice(2);
  
  cli.handleCommand(args).catch(error => {
    console.error('Fatal error:', error.message);
    process.exit(1);
  });
}
