/**
 * PeerManager - Manages P2P connections using WebRTC adapted for scenarios
 * Web4 pattern: All communication through scenario exchange
 */

import { IOR } from '../layer3/IOR.js';
import { Scenario } from '../layer3/Scenario.js';

interface PeerConnection {
    ior: IOR;
    rtcConnection?: RTCPeerConnection;
    dataChannel?: RTCDataChannel;
    connected: boolean;
    scenariosExchanged: number;
}

export class PeerManager {
    private peers: Map<string, PeerConnection> = new Map();
    private totalExchanged: number = 0;

    constructor() {
        // Empty constructor - Web4 pattern
    }

    async init(state?: any): Promise<void> {
        if (state) {
            this.totalExchanged = state.totalExchanged || 0;
        }
    }

    async connect(peerIOR: IOR): Promise<void> {
        const peerId = `${peerIOR.objectType}:${peerIOR.uuid}`;
        
        if (this.peers.has(peerId)) {
            return; // Already connected
        }

        // Create peer connection entry
        const peer: PeerConnection = {
            ior: peerIOR,
            connected: false,
            scenariosExchanged: 0
        };

        // Check if WebRTC is available
        if (typeof RTCPeerConnection !== 'undefined') {
            await this.establishWebRTCConnection(peer);
        } else {
            // Fallback to other transport mechanisms
            console.warn('WebRTC not available, P2P functionality limited');
        }

        this.peers.set(peerId, peer);
    }

    private async establishWebRTCConnection(peer: PeerConnection): Promise<void> {
        // WebRTC configuration adapted for scenario exchange
        const config: RTCConfiguration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        };

        peer.rtcConnection = new RTCPeerConnection(config);

        // Create data channel for scenario exchange
        peer.dataChannel = peer.rtcConnection.createDataChannel('scenarios', {
            ordered: true,
            maxRetransmits: 3
        });

        // Set up event handlers
        peer.dataChannel.onopen = () => {
            peer.connected = true;
        };

        peer.dataChannel.onmessage = (event) => {
            this.handleScenarioMessage(peer, event.data);
        };

        peer.dataChannel.onerror = (error) => {
            console.error('DataChannel error:', error);
            peer.connected = false;
        };

        // Handle ICE candidates
        peer.rtcConnection.onicecandidate = (event) => {
            if (event.candidate) {
                // In a real implementation, this would be sent to the peer
                // through a signaling server
            }
        };

        // Create and set local description
        const offer = await peer.rtcConnection.createOffer();
        await peer.rtcConnection.setLocalDescription(offer);

        // In a real implementation, the offer would be sent to the peer
        // and we would await their answer
    }

    async exchangeScenario(peerIOR: IOR, scenario: Scenario): Promise<void> {
        const peerId = `${peerIOR.objectType}:${peerIOR.uuid}`;
        const peer = this.peers.get(peerId);

        if (!peer) {
            throw new Error(`Not connected to peer ${peerId}`);
        }

        if (!peer.connected) {
            throw new Error(`Peer ${peerId} not ready for scenario exchange`);
        }

        // Send scenario through data channel
        if (peer.dataChannel && peer.dataChannel.readyState === 'open') {
            const message = {
                type: 'scenario',
                scenario: scenario
            };
            peer.dataChannel.send(JSON.stringify(message));
            peer.scenariosExchanged++;
            this.totalExchanged++;
        } else {
            throw new Error(`Data channel to peer ${peerId} not open`);
        }
    }

    private handleScenarioMessage(peer: PeerConnection, data: string): void {
        try {
            const message = JSON.parse(data);
            if (message.type === 'scenario') {
                // In a real implementation, this would emit an event
                // or call a handler to process the received scenario
                console.log(`Received scenario from peer ${peer.ior.uuid}`);
                peer.scenariosExchanged++;
                this.totalExchanged++;
            }
        } catch (error) {
            console.error('Error processing scenario message:', error);
        }
    }

    getConnectedCount(): number {
        let count = 0;
        for (const peer of this.peers.values()) {
            if (peer.connected) count++;
        }
        return count;
    }

    getExchangedCount(): number {
        return this.totalExchanged;
    }

    toScenario(): any {
        const peers: any[] = [];
        for (const [id, peer] of this.peers.entries()) {
            peers.push({
                id,
                ior: peer.ior,
                connected: peer.connected,
                scenariosExchanged: peer.scenariosExchanged
            });
        }
        return {
            peers,
            totalExchanged: this.totalExchanged
        };
    }
}