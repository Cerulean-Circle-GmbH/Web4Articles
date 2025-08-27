/**
 * Web4 Scenario - Universal hibernation container
 *
 * The simplest possible structure for object state persistence.
 * All Web4 components use this for hibernation/resurrection.
 */
export class Scenario {
    constructor(data) {
        if (data) {
            this.IOR = data.IOR || { uuid: '', component: '', version: '' };
            this.owner = data.owner || '';
            this.model = data.model || {};
        }
        else {
            this.IOR = { uuid: '', component: '', version: '' };
            this.owner = '';
            this.model = {};
        }
    }
    /**
     * Create scenario from JSON string
     */
    static fromJSON(json) {
        try {
            const data = JSON.parse(json);
            return new Scenario(data);
        }
        catch (error) {
            throw new Error(`Invalid scenario JSON: ${error}`);
        }
    }
    /**
     * Serialize scenario to JSON string
     */
    toJSON() {
        return JSON.stringify({
            IOR: this.IOR,
            owner: this.owner,
            model: this.model
        }, null, 2);
    }
    /**
     * Get scenario as plain object
     */
    toObject() {
        return {
            IOR: this.IOR,
            owner: this.owner,
            model: this.model
        };
    }
    /**
     * Clone scenario with optional model updates
     */
    clone(modelUpdates) {
        return new Scenario({
            IOR: { ...this.IOR },
            owner: this.owner,
            model: modelUpdates ? { ...this.model, ...modelUpdates } : { ...this.model }
        });
    }
    /**
     * Validate scenario has required fields
     */
    validate() {
        return !!(this.IOR &&
            this.IOR.uuid &&
            this.IOR.component &&
            this.IOR.version &&
            this.owner !== undefined &&
            this.model !== undefined);
    }
}
