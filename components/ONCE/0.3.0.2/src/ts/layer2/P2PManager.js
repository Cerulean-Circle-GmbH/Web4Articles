/**
 * P2P Manager - Layer 2 Implementation
 *
 * Web4 EAM Layer 2: Implementation and management
 * Decision 3d: P2P management in Layer2
 */
import { P2PProtocols } from '../layer1/P2PProtocols.js';
export class P2PManager {
    /**
     * Web4 Pattern: Empty constructor
     */
    constructor() {
        this.connections = new Map();
        // ✅ DRY: Compose Layer1 protocols, never duplicate
        this.protocols = new P2PProtocols();
    }
    /**
     * Initialize manager from scenario
     */
    init(managerConfig) {
        this.protocols.init(managerConfig.protocols || {});
        return this;
    }
    /**
     * Manage peer connection lifecycle
     */
    async connectToPeer(peerAddress) {
        console.log(`Layer2: Managing peer connection to ${peerAddress}`);
        // ✅ DRY: Delegate protocol handling to Layer1
        const bestProtocol = await this.protocols.detectBestProtocol(peerAddress);
        let connection;
        switch (bestProtocol) {
            case 'webrtc':
                connection = await this.protocols.establishWebRTC(peerAddress);
                break;
            case 'websocket':
                connection = await this.protocols.establishWebSocket(peerAddress);
                break;
            case 'http':
                connection = await this.protocols.establishHTTP(peerAddress);
                break;
            default:
                throw new Error(`Unsupported protocol: ${bestProtocol}`);
        }
        // Manage connection in Layer2
        this.connections.set(peerAddress, connection);
        return connection;
    }
    /**
     * Disconnect from peer
     */
    async disconnectFromPeer(peerAddress) {
        console.log(`Layer2: Disconnecting from peer ${peerAddress}`);
        this.connections.delete(peerAddress);
    }
    /**
     * Get all active connections
     */
    getActiveConnections() {
        return Array.from(this.connections.keys());
    }
    /**
     * Check if peer is connected
     */
    isConnected(peerAddress) {
        return this.connections.has(peerAddress);
    }
}
