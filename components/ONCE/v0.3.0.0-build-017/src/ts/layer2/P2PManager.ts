/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { P2PProtocols } from '../layer1/P2PProtocols.js';

export class P2PManager {
  private protocols: P2PProtocols;
  private connections: Map<string, any> = new Map();

  /**
   * Web4 Pattern: Empty constructor
   */
  constructor() {
    // ✅ DRY: Compose Layer1 protocols, never duplicate
    this.protocols = new P2PProtocols();
  }

  /**
   * Initialize manager from scenario
   */
  init(managerConfig: any): this {
    this.protocols.init(managerConfig.protocols || {});
    return this;
  }

  /**
   * Manage peer connection lifecycle
   */
  async connectToPeer(peerAddress: string): Promise<any> {
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
  async disconnectFromPeer(peerAddress: string): Promise<void> {
    console.log(`Layer2: Disconnecting from peer ${peerAddress}`);
    this.connections.delete(peerAddress);
  }

  /**
   * Get all active connections
   */
  getActiveConnections(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Check if peer is connected
   */
  isConnected(peerAddress: string): boolean {
    return this.connections.has(peerAddress);
  }
}