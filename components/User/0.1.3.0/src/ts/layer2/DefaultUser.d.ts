import { IUser } from '../layer3/IUser';
export declare class DefaultUser implements IUser {
    readonly uuid: string;
    readonly username: string;
    readonly hostname: string;
    constructor(username?: string, hostname?: string);
    /**
     * Generate a deterministic UUID v4 based on username
     * This ensures the same user always gets the same UUID
     */
    getUserUUID(username: string): string;
    getScenario(): any;
    /**
     * Static method to get consistent owner object for any component
     */
    static getOwnerObject(username?: string, hostname?: string): any;
}
