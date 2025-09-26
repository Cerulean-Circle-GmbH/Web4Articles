/**
 * DefaultIOR - Default implementation of Internet Object Reference
 * Web4 pattern: Network-aware object references
 */

import { IOR, NetworkLocation } from '../layer3/IOR.js';

export class DefaultIOR implements IOR {
    objectType: string;
    uuid: string;
    location: NetworkLocation;
    version?: string;

    constructor() {
        // Empty constructor - Web4 pattern
        this.objectType = '';
        this.uuid = '';
        this.location = new DefaultNetworkLocation();
    }

    /**
     * Initialize from IOR string or components
     */
    init(iorString?: string): IOR {
        if (iorString) {
            return this.parse(iorString);
        }
        return this;
    }

    toURL(): string {
        const versionPart = this.version ? `/${this.version}` : '';
        return `${this.location.toURL()}/${this.objectType}/${this.uuid}${versionPart}`;
    }

    parse(iorString: string): IOR {
        // Format: protocol://host:port/objectType/uuid/version
        const url = new URL(iorString);
        
        this.location = new DefaultNetworkLocation();
        this.location.protocol = url.protocol.replace(':', '');
        this.location.host = url.hostname;
        this.location.port = url.port ? parseInt(url.port) : undefined;
        
        const pathParts = url.pathname.split('/').filter(p => p);
        if (pathParts.length >= 2) {
            this.objectType = pathParts[0];
            this.uuid = pathParts[1];
            if (pathParts.length >= 3) {
                this.version = pathParts[2];
            }
        }
        
        return this;
    }

    isLocal(): boolean {
        const localHosts = ['localhost', '127.0.0.1', '::1'];
        return localHosts.includes(this.location.host);
    }

    async resolve(): Promise<any> {
        if (this.isLocal()) {
            return this.resolveLocal();
        } else {
            return this.resolveRemote();
        }
    }

    private async resolveLocal(): Promise<any> {
        // In a real implementation, this would:
        // 1. Look up the object in local ONCE registry
        // 2. Load the component/scenario from local storage
        // 3. Return the instantiated object
        throw new Error(`Local resolution for ${this.objectType}:${this.uuid} not implemented`);
    }

    private async resolveRemote(): Promise<any> {
        // In a real implementation, this would:
        // 1. Connect to remote ONCE kernel at the specified location
        // 2. Request the object through P2P protocol
        // 3. Receive and instantiate the object from scenario
        throw new Error(`Remote resolution for ${this.toURL()} not implemented`);
    }

    /**
     * Create IOR from components
     */
    static create(objectType: string, uuid: string, location: NetworkLocation, version?: string): IOR {
        const ior = new DefaultIOR();
        ior.objectType = objectType;
        ior.uuid = uuid;
        ior.location = location;
        ior.version = version;
        return ior;
    }
}

export class DefaultNetworkLocation implements NetworkLocation {
    protocol: string = 'web4';
    host: string = 'localhost';
    port?: number;
    path?: string;

    toURL(): string {
        const portPart = this.port ? `:${this.port}` : '';
        const pathPart = this.path ? this.path : '';
        return `${this.protocol}://${this.host}${portPart}${pathPart}`;
    }

    static create(protocol: string, host: string, port?: number, path?: string): NetworkLocation {
        const location = new DefaultNetworkLocation();
        location.protocol = protocol;
        location.host = host;
        location.port = port;
        location.path = path;
        return location;
    }
}