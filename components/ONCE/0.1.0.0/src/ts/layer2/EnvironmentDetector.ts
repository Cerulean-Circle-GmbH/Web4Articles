/**
 * EnvironmentDetector - Detects runtime environment and capabilities
 */

import { EnvironmentInfo } from '../layer3/ONCE.js';

export class EnvironmentDetector {
    private environment?: EnvironmentInfo;

    constructor() {
        // Empty constructor - Web4 pattern
    }

    async init(): Promise<void> {
        this.environment = this.detectEnvironment();
    }

    getEnvironment(): EnvironmentInfo {
        if (!this.environment) {
            throw new Error('EnvironmentDetector not initialized');
        }
        return this.environment;
    }

    private detectEnvironment(): EnvironmentInfo {
        const platform = this.detectPlatform();
        const version = this.detectVersion(platform);
        const capabilities = this.detectCapabilities(platform);
        const isOnline = this.detectOnlineStatus();

        return {
            platform,
            version,
            capabilities,
            isOnline
        };
    }

    private detectPlatform(): 'browser' | 'node' | 'worker' | 'service-worker' | 'pwa' | 'iframe' {
        // Node.js detection
        if (typeof process !== 'undefined' && process.versions && process.versions.node) {
            return 'node';
        }

        // Browser environment checks
        if (typeof window !== 'undefined') {
            // iframe detection
            if (window.parent !== window) {
                return 'iframe';
            }

            // PWA detection
            if ('serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches) {
                return 'pwa';
            }

            return 'browser';
        }

        // Worker detection
        if (typeof WorkerGlobalScope !== 'undefined' && typeof importScripts === 'function') {
            // Service Worker detection
            if (typeof ServiceWorkerGlobalScope !== 'undefined') {
                return 'service-worker';
            }
            return 'worker';
        }

        // Default to browser if uncertain
        return 'browser';
    }

    private detectVersion(platform: string): string {
        switch (platform) {
            case 'node':
                return process.version;
            case 'browser':
            case 'pwa':
            case 'iframe':
                return navigator.userAgent;
            case 'worker':
            case 'service-worker':
                return 'worker-env';
            default:
                return 'unknown';
        }
    }

    private detectCapabilities(platform: string): string[] {
        const capabilities: string[] = [];

        // Common capabilities
        capabilities.push('scenario-exchange');
        capabilities.push('component-lifecycle');

        // Platform-specific capabilities
        switch (platform) {
            case 'node':
                capabilities.push('filesystem');
                capabilities.push('network-server');
                capabilities.push('child-process');
                break;
            case 'browser':
            case 'pwa':
                capabilities.push('dom');
                capabilities.push('local-storage');
                capabilities.push('indexed-db');
                if ('serviceWorker' in navigator) {
                    capabilities.push('service-worker');
                }
                break;
            case 'worker':
                capabilities.push('parallel-compute');
                capabilities.push('message-port');
                break;
            case 'service-worker':
                capabilities.push('fetch-intercept');
                capabilities.push('cache-api');
                capabilities.push('push-notifications');
                break;
        }

        // P2P capabilities
        if (typeof RTCPeerConnection !== 'undefined') {
            capabilities.push('webrtc');
        }
        if (typeof WebSocket !== 'undefined') {
            capabilities.push('websocket');
        }

        return capabilities;
    }

    private detectOnlineStatus(): boolean {
        if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
            return navigator.onLine;
        }
        // Assume online in Node.js
        return true;
    }

    /**
     * Get network address with localhost fallback
     * Implements robust network discovery for ONCE P2P communication
     */
    getNetworkAddress(): string {
        try {
            // Platform-specific network address detection
            const platform = this.getEnvironment().platform;
            
            switch (platform) {
                case 'node':
                    return this.detectNodeNetworkAddress();
                case 'browser':
                case 'pwa':
                case 'iframe':
                    return this.detectBrowserNetworkAddress();
                case 'worker':
                case 'service-worker':
                    return this.detectWorkerNetworkAddress();
                default:
                    console.warn('Unknown platform for network detection:', platform);
                    break;
            }
        } catch (error) {
            console.warn('Network address detection failed:', error.message);
        }
        
        // Final fallback to localhost
        console.info('Using localhost fallback for network address');
        return 'localhost';
    }

    private detectNodeNetworkAddress(): string {
        try {
            if (typeof require !== 'undefined') {
                const os = require('os');
                const interfaces = os.networkInterfaces();
                
                // Look for first non-internal IPv4 address
                for (const [name, nets] of Object.entries(interfaces)) {
                    if (nets) {
                        for (const net of nets) {
                            if (net.family === 'IPv4' && !net.internal) {
                                console.info(`Detected network address: ${net.address} (${name})`);
                                return net.address;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('Node.js network interface detection failed:', error.message);
        }
        throw new Error('No Node.js network interfaces detected');
    }

    private detectBrowserNetworkAddress(): string {
        try {
            // Browser environment - try WebRTC for local IP detection
            if (typeof RTCPeerConnection !== 'undefined') {
                return this.detectWebRTCLocalAddress();
            }
            
            // Fallback to window.location if available
            if (typeof window !== 'undefined' && window.location) {
                const hostname = window.location.hostname;
                if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
                    console.info(`Using window.location hostname: ${hostname}`);
                    return hostname;
                }
            }
        } catch (error) {
            console.warn('Browser network detection failed:', error.message);
        }
        throw new Error('No browser network address detected');
    }

    private detectWebRTCLocalAddress(): string {
        // Note: This is a simplified version - real implementation would be async
        // For now, we throw to trigger localhost fallback
        throw new Error('WebRTC local address detection not implemented (async required)');
    }

    private detectWorkerNetworkAddress(): string {
        // Worker environments have limited network detection capabilities
        console.info('Worker environment - limited network detection');
        throw new Error('Worker network detection limited');
    }
}