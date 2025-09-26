/**
 * Port Manager v0.2.0.0 - Handles port 42777 default and 8080+ fallback
 * Implements requirement 9beee86b-09c2-43c8-b449-b9a7b8f2b338
 */

import { createServer } from 'http';
import { ONCE_DEFAULT_CONFIG } from '../layer3/ONCEServerModel.js';

/**
 * Port availability result
 */
export interface PortAvailabilityResult {
    port: number;
    available: boolean;
    isPrimary: boolean; // true if port 42777
}

/**
 * Port Manager - handles ONCE v0.2.0.0 port hierarchy
 * Always tries 42777 first, then falls back to 8080+
 */
export class PortManager {
    private static instance: PortManager | null = null;

    private constructor() {
        // Singleton pattern for port management
    }

    static getInstance(): PortManager {
        if (!PortManager.instance) {
            PortManager.instance = new PortManager();
        }
        return PortManager.instance;
    }

    /**
     * Check if a port is available
     */
    async isPortAvailable(port: number): Promise<boolean> {
        return new Promise((resolve) => {
            const server = createServer();
            
            server.listen(port, () => {
                server.close(() => {
                    resolve(true);
                });
            });

            server.on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    resolve(false);
                } else {
                    resolve(false);
                }
            });
        });
    }

    /**
     * Get next available port following ONCE v0.2.0.0 hierarchy:
     * 1. Try 42777 (primary server port)
     * 2. If occupied, try 8080, 8081, 8082... up to MAX_PORT_SCAN
     */
    async getNextAvailablePort(): Promise<PortAvailabilityResult> {
        // First try the primary server port 42777
        const primaryAvailable = await this.isPortAvailable(ONCE_DEFAULT_CONFIG.PRIMARY_PORT);
        
        if (primaryAvailable) {
            return {
                port: ONCE_DEFAULT_CONFIG.PRIMARY_PORT,
                available: true,
                isPrimary: true
            };
        }

        // Primary port is occupied, scan fallback range starting from 8080
        for (let port = ONCE_DEFAULT_CONFIG.FALLBACK_PORT_START; 
             port < ONCE_DEFAULT_CONFIG.FALLBACK_PORT_START + ONCE_DEFAULT_CONFIG.MAX_PORT_SCAN; 
             port++) {
            
            const available = await this.isPortAvailable(port);
            
            if (available) {
                return {
                    port,
                    available: true,
                    isPrimary: false
                };
            }
        }

        // No ports available in range
        throw new Error(`No available ports found in range ${ONCE_DEFAULT_CONFIG.FALLBACK_PORT_START}-${ONCE_DEFAULT_CONFIG.FALLBACK_PORT_START + ONCE_DEFAULT_CONFIG.MAX_PORT_SCAN}`);
    }

    /**
     * Check if primary server (port 42777) is running
     */
    async isPrimaryServerRunning(): Promise<boolean> {
        return !(await this.isPortAvailable(ONCE_DEFAULT_CONFIG.PRIMARY_PORT));
    }

    /**
     * Get primary server port
     */
    getPrimaryPort(): number {
        return ONCE_DEFAULT_CONFIG.PRIMARY_PORT;
    }

    /**
     * Check if a port is the primary server port
     */
    isPrimaryPort(port: number): boolean {
        return port === ONCE_DEFAULT_CONFIG.PRIMARY_PORT;
    }
}
