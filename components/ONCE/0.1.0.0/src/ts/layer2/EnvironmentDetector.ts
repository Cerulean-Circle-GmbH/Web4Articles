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
}