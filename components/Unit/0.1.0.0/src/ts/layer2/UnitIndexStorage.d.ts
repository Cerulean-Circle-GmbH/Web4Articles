/**
 * Unit Index Storage - Layer 2 (Implementation)
 *
 * Implements UUID-based storage system for Unit scenarios with symbolic link management
 * Storage pattern: scenarios/index/1/a/1/2/3/uuid.scenario.json (5 levels deep)
 * Symbolic links track all locations where units are referenced
 */
export interface UnitStorageResult {
    success: boolean;
    message: string;
    scenarioPath?: string;
    symlinkPaths?: string[];
    issues?: string[];
}
export interface UnitBacklinkInfo {
    uuid: string;
    indexPath: string;
    symlinkPaths: string[];
    createdAt: string;
    updatedAt: string;
}
export declare class UnitIndexStorage {
    private projectRoot;
    private indexBaseDir;
    constructor();
    /**
     * Initialize with project root path
     */
    init(projectRoot: string): this;
    /**
     * Generate UUID-based folder path (5 levels deep)
     * Example: 1a123c8b-e76f-4c2b-b6b2-375620179ce6 -> scenarios/index/1/a/1/2/3/
     */
    private generateUUIDFolderPath;
    /**
     * Get the full scenario file path in the index
     */
    private getScenarioIndexPath;
    /**
     * Create UUID folder structure if it doesn't exist
     */
    private ensureUUIDFolders;
    /**
     * Save scenario to UUID index location
     */
    saveScenario(uuid: string, scenario: any, symlinkLocations?: string[]): Promise<UnitStorageResult>;
    /**
     * Load scenario from UUID index
     */
    loadScenario(uuid: string): Promise<{
        success: boolean;
        scenario?: any;
        message: string;
    }>;
    /**
     * Create symbolic link to scenario
     */
    private createSymbolicLink;
    /**
     * Add symbolic link to existing scenario
     */
    addSymbolicLink(uuid: string, symlinkPath: string): Promise<UnitStorageResult>;
    /**
     * Remove symbolic link and update backlink tracking
     */
    removeSymbolicLink(uuid: string, symlinkPath: string): Promise<UnitStorageResult>;
    /**
     * Get backlink information for a unit
     */
    getBacklinkInfo(uuid: string): Promise<UnitBacklinkInfo | null>;
    /**
     * Move scenario and update all symbolic links
     */
    moveScenario(uuid: string, newSymlinkLocations: string[]): Promise<UnitStorageResult>;
    /**
     * List all scenarios in index
     */
    listScenarios(): Promise<{
        uuids: string[];
        count: number;
    }>;
    private walkIndexFolders;
    private isValidUUID;
}
