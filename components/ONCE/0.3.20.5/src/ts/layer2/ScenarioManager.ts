/**
 * Scenario Manager v0.3.20.3 - Handles scenario-based configuration and storage
 * Implements requirements 9b768111-7a06-4266-9d71-0ef72e90c62b and 6707a628-bf3b-4dd4-a750-562f9f0c5fa4
 */

import { Scenario } from '../layer3/Scenario.js';
import { ONCEServerModel } from '../layer3/ONCEServerModel.js';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, resolve, basename } from 'path';
import { fileURLToPath } from 'url';
import { logAction, serverIdentity } from '../layer1/LoggingUtils.js';

/**
 * Scenario Manager - handles ONCE scenario storage and loading
 * Implements organized directory structure: /scenarios/domain/component/version/uuid.json
 * ✅ TRUE Radical OOP: Uses backward link for path authority
 */
export class ScenarioManager {
    private _projectRoot: string | undefined;
    component?: any; // Backward link to DefaultONCE for path authority

    constructor(projectRoot?: string) {
        // Allow explicit projectRoot override, otherwise derive from component path
        this._projectRoot = projectRoot;
    }

    /**
     * Get version via path authority
     * ✅ TRUE Radical OOP: Query parent first, fallback to own path extraction
     */
    private get version(): string {
        // First: try backward link to component
        if (this.component?.model?.version) {
            return this.component.model.version;
        }
        
        // Fallback: extract from own path
        const currentFile = fileURLToPath(import.meta.url);
        const match = currentFile.match(/ONCE\/(\d+\.\d+\.\d+\.\d+)/);
        return match ? match[1] : 'unknown';
    }

    /**
     * Get project root - derive from component path if not explicitly set
     * ✅ TRUE Radical OOP: Uses path authority hierarchy
     */
    private get projectRoot(): string {
        // Explicit override takes precedence
        if (this._projectRoot) {
            return this._projectRoot;
        }
        
        // Path authority: Use backward link to component instance if available
        if (this.component?.model?.projectRoot) {
            return this.component.model.projectRoot;
        }
        
        // Fallback: derive from component path properly
        const currentFile = fileURLToPath(import.meta.url);
        const currentDir = dirname(currentFile);
        // From dist/ts/layer2/ go up to component root, then to project root
        const componentRoot = resolve(currentDir, '../../../'); // -> 0.3.20.X
        const onceDir = resolve(componentRoot, '..'); // -> ONCE
        const componentsDir = resolve(onceDir, '..'); // -> components
        return resolve(componentsDir, '..'); // -> project root
    }

    /**
     * Save scenario to organized directory structure
     * /scenarios/{domain-parts}/{hostname}/component/version/uuid.scenario.json
     */
    async saveScenario(scenario: Scenario): Promise<string> {
        const component = scenario.objectType;
        const version = scenario.version;
        const uuid = scenario.uuid;
        
        // Extract domain and hostname from metadata
        const fullDomain = scenario.metadata.domain || 'local.once';
        const fqdn = scenario.metadata.host || 'localhost';
        
        // Parse domain into path components
        let domainPath: string[];
        let hostname: string;
        
        if (fqdn === 'localhost') {
            domainPath = ['local', 'once'];
            hostname = 'localhost';
        } else if (fqdn.includes('.')) {
            const parts = fqdn.split('.');
            hostname = parts[0]; // First part is hostname
            const domainParts = parts.slice(1); // Rest is domain
            domainPath = domainParts.reverse(); // Reverse for proper hierarchy
        } else {
            // Simple hostname
            domainPath = ['local', fqdn];
            hostname = fqdn;
        }

        // Create organized path: scenarios/{domain-parts}/{hostname}/ONCE/version
        const scenarioDir = join(
            this.projectRoot,
            'scenarios',
            ...domainPath,
            hostname,
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
        
        logAction('💾', scenario.uuid, 'Scenario saved', `${serverIdentity(scenario.state.hostname, scenario.state.httpPort)} → ${basename(scenarioPath)}`);
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
     * Load scenario by UUID, domain/hostname, component, and version
     * Note: This method needs domain AND hostname or full FQDN to construct the path
     */
    async loadScenarioByUUID(
        uuid: string, 
        fqdn: string = 'localhost',
        component: string = 'ONCE', 
        version?: string
    ): Promise<Scenario> {
        // ✅ Use dynamic version if not provided
        const actualVersion = version || this.version;
        
        // Parse FQDN into domain path and hostname
        let domainPath: string[];
        let hostname: string;
        
        if (fqdn === 'localhost') {
            domainPath = ['local', 'once'];
            hostname = 'localhost';
        } else if (fqdn.includes('.')) {
            const parts = fqdn.split('.');
            hostname = parts[0];
            const domainParts = parts.slice(1);
            domainPath = domainParts.reverse();
        } else {
            domainPath = ['local', fqdn];
            hostname = fqdn;
        }
        
        const scenarioPath = join(
            this.projectRoot,
            'scenarios',
            ...domainPath,
            hostname,
            component,
            actualVersion,
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
            version: this.version, // ✅ Use dynamic version
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
                creator: `ONCE-v${this.version}`, // ✅ Use dynamic version
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
        this._projectRoot = projectRoot;
    }
}

