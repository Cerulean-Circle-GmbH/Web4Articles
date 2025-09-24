/**
 * ONCE Server Model v0.2.0.0 - Enhanced server state model
 * Implements requirement 471d2d0a-4914-4900-9aed-74b69e032679
 */

import { LifecycleState } from './LifecycleEvents.js';
import { EnvironmentInfo } from './ONCE.js';

/**
 * Server capability definition
 */
export interface ServerCapability {
    capability: string;  // 'httpPort', 'httpsPort', 'wsPort', 'p2pPort'
    port: number;
}

/**
 * Enhanced ONCE Server Model for v0.2.0.0
 * Contains all server instance information including process, network, and capabilities
 */
export interface ONCEServerModel {
    /** Process ID of the server */
    pid: number;
    
    /** Current lifecycle state */
    state: LifecycleState;
    
    /** Platform/environment information */
    platform: EnvironmentInfo;
    
    /** Reverse internet domain (default: "local.once") */
    domain: string;
    
    /** Fully qualified hostname (e.g., "McDonges-3.fritz.box") */
    host: string;
    
    /** IP address (fallback: "127.0.0.1") */
    ip: string;
    
    /** Server capabilities with their assigned ports */
    capabilities: ServerCapability[];
    
    /** Server UUID for unique identification */
    uuid: string;
    
    /** Whether this server is the primary name server (port 42777) */
    isPrimaryServer: boolean;
    
    /** If not primary, the IOR of the primary server this one registered with */
    primaryServerIOR?: string;
}

/**
 * Default configuration for ONCE v0.2.0.0
 */
export const ONCE_DEFAULT_CONFIG = {
    /** Default primary server port */
    PRIMARY_PORT: 42777,
    
    /** Default fallback port range start */
    FALLBACK_PORT_START: 8080,
    
    /** Default reverse domain */
    DEFAULT_DOMAIN: 'local.once',
    
    /** Default IP fallback */
    DEFAULT_IP: '127.0.0.1',
    
    /** Maximum port scan range */
    MAX_PORT_SCAN: 100
} as const;

/**
 * Create default server model
 */
export function createDefaultServerModel(): Partial<ONCEServerModel> {
    return {
        pid: process.pid,
        state: LifecycleState.CREATED,
        domain: ONCE_DEFAULT_CONFIG.DEFAULT_DOMAIN,
        host: 'localhost', // Will be detected at runtime
        ip: ONCE_DEFAULT_CONFIG.DEFAULT_IP,
        capabilities: [],
        isPrimaryServer: false
    };
}
