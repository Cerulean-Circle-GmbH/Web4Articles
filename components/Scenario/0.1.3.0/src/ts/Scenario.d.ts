/**
 * Web4 Scenario - Universal hibernation container
 *
 * The simplest possible structure for object state persistence.
 * All Web4 components use this for hibernation/resurrection.
 */
export interface IOR {
    uuid: string;
    component: string;
    version: string;
}
export interface ScenarioData {
    IOR: IOR;
    owner: string;
    model: any;
}
export declare class Scenario {
    readonly IOR: IOR;
    readonly owner: string;
    readonly model: any;
    constructor(data?: Partial<ScenarioData>);
    /**
     * Create scenario from JSON string
     */
    static fromJSON(json: string): Scenario;
    /**
     * Serialize scenario to JSON string
     */
    toJSON(): string;
    /**
     * Get scenario as plain object
     */
    toObject(): ScenarioData;
    /**
     * Clone scenario with optional model updates
     */
    clone(modelUpdates?: any): Scenario;
    /**
     * Validate scenario has required fields
     */
    validate(): boolean;
}
//# sourceMappingURL=Scenario.d.ts.map