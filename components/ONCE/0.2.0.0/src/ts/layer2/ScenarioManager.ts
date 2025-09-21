/**
 * Scenario Manager v0.2.0.0 - Handles scenario-based configuration and storage
 * Implements requirements 9b768111-7a06-4266-9d71-0ef72e90c62b and 6707a628-bf3b-4dd4-a750-562f9f0c5fa4
 */

import { Scenario } from '../layer3/Scenario.js';
import { ONCEServerModel } from '../layer3/ONCEServerModel.js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

/**
 * Scenario Manager - handles ONCE v0.2.0.0 scenario storage and loading
 * Implements organized directory structure: /scenarios/domain/component/version/uuid.json
 */
export class ScenarioManager {
    private projectRoot: string;

    constructor(projectRoot?: string) {
        // No environment variables - use current working directory by default
        this.projectRoot = projectRoot || process.cwd();
    }

    /**
     * Save scenario to organized directory structure
     * /scenarios/reverseDomain/component/version/uuid.scenario.json
     */
    async saveScenario(scenario: Scenario): Promise<string> {
        const domain = scenario.metadata.domain || 'local.once';
        const component = scenario.objectType;
        const version = scenario.version;
        const uuid = scenario.uuid;

        // Create organized path
        const scenarioDir = join(
            this.projectRoot,
            'scenarios',
            domain,
            component,
            version
        );

        // Ensure directory exists
        if (!existsSync(scenarioDir)) {
            mkdirSync(scenarioDir, { recursive: true });
        }

        const scenarioPath = join(scenarioDir, `${uuid}.scenario.json`);

        // Update modified timestamp
        scenario.metadata.modified = new Date().toISOString();

        // Save scenario
        writeFileSync(scenarioPath, JSON.stringify(scenario, null, 2));
        
        console.log(`💾 Scenario saved: ${scenarioPath}`);
        return scenarioPath;
    }

    /**
     * Load scenario from file
     */
    async loadScenario(scenarioPath: string): Promise<Scenario> {
        if (!existsSync(scenarioPath)) {
            throw new Error(`Scenario file not found: ${scenarioPath}`);
        }

        const content = readFileSync(scenarioPath, 'utf8');
        const scenario = JSON.parse(content) as Scenario;
        
        console.log(`📂 Scenario loaded: ${scenarioPath}`);
        return scenario;
    }

    /**
     * Load scenario by UUID and domain/component/version
     */
    async loadScenarioByUUID(
        uuid: string, 
        domain: string = 'local.once', 
        component: string = 'ONCE', 
        version: string = '0.2.0.0'
    ): Promise<Scenario> {
        const scenarioPath = join(
            this.projectRoot,
            'scenarios',
            domain,
            component,
            version,
            `${uuid}.scenario.json`
        );

        return this.loadScenario(scenarioPath);
    }

    /**
     * Create scenario from server model
     */
    createScenarioFromServerModel(serverModel: ONCEServerModel): Scenario {
        return {
            uuid: serverModel.uuid,
            objectType: 'ONCE',
            version: '0.2.0.0',
            state: {
                ...serverModel,
                // Remove circular references and non-serializable data
                platform: {
                    ...serverModel.platform,
                    // Keep only serializable platform data
                }
            },
            metadata: {
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
                creator: 'ONCE-v0.2.0.0',
                description: `ONCE server ${serverModel.isPrimaryServer ? 'Primary' : 'Client'} server instance`,
                tags: ['server', 'once', serverModel.isPrimaryServer ? 'primary' : 'client'],
                domain: serverModel.domain,
                host: serverModel.host,
                port: serverModel.capabilities.find(c => c.capability === 'httpPort')?.port,
                isPrimaryServer: serverModel.isPrimaryServer
            }
        };
    }

    /**
     * Create server model from scenario
     */
    createServerModelFromScenario(scenario: Scenario): ONCEServerModel {
        if (scenario.objectType !== 'ONCE') {
            throw new Error(`Invalid scenario type for server model: ${scenario.objectType}`);
        }

        return scenario.state as ONCEServerModel;
    }

    /**
     * Find scenarios by pattern
     */
    async findScenarios(
        domain?: string,
        component?: string,
        version?: string
    ): Promise<string[]> {
        const scenariosPath = join(this.projectRoot, 'scenarios');
        const results: string[] = [];

        // TODO: Implement recursive directory scanning
        // For now, return empty array
        console.log(`🔍 Scenario search requested: domain=${domain}, component=${component}, version=${version}`);
        
        return results;
    }

    /**
     * Get project root (no environment variables)
     */
    getProjectRoot(): string {
        return this.projectRoot;
    }

    /**
     * Set project root
     */
    setProjectRoot(projectRoot: string): void {
        this.projectRoot = projectRoot;
    }
}
