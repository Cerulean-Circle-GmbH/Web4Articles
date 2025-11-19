/**
 * Browser Broadcast Integration Test
 * @pdca 2025-11-11-UTC-2322.pdca.md
 * 
 * Tests that browser-initiated broadcasts propagate through the server hierarchy:
 * 1. Browser on Client 8080 sends broadcast
 * 2. Client 8080 forwards to Primary 42777
 * 3. Primary broadcasts to all clients (8080, 8081)
 * 4. Clients forward to their browser clients
 * 5. Browser on Client 8081 receives the broadcast
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import WebSocket from 'ws';
import { randomUUID } from 'crypto';

describe('Browser Broadcast Flow', () => {
    let primaryServer: any;
    let clientServer1: any;
    let clientServer2: any;
    let componentVersion: string;
    
    beforeAll(async () => {
        const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
        
        // Get component version
        const tempInstance = new DefaultONCE();
        await tempInstance.init();
        componentVersion = tempInstance.model.version;
        
        // Start primary server (42777)
        primaryServer = new DefaultONCE();
        await primaryServer.init();
        await primaryServer.startServer();
        
        // Wait for primary to be fully ready
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Start client servers (8080, 8081)
        clientServer1 = new DefaultONCE();
        await clientServer1.init();
        await clientServer1.startServer();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        clientServer2 = new DefaultONCE();
        await clientServer2.init();
        await clientServer2.startServer();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('✅ All servers started');
    }, 30000);
    
    afterAll(async () => {
        console.log('🧹 Cleaning up servers...');
        try {
            if (clientServer2) await clientServer2.stopServer();
            if (clientServer1) await clientServer1.stopServer();
            if (primaryServer) await primaryServer.stopServer();
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('✅ All servers stopped');
        } catch (error) {
            console.error('Error stopping servers:', error);
        }
    }, 10000);
    
    it('should propagate browser broadcast from client 8080 to client 8081', async () => {
        console.log('🔌 Connecting browser clients...');
        
        // Simulate browser clients connecting to both servers
        const browser1 = new WebSocket('ws://localhost:8080');
        const browser2 = new WebSocket('ws://localhost:8081');
        
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Browser1 connection timeout')), 5000);
            browser1.on('open', () => {
                clearTimeout(timeout);
                console.log('✅ Browser1 connected to 8080');
                resolve(undefined);
            });
            browser1.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
        
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Browser2 connection timeout')), 5000);
            browser2.on('open', () => {
                clearTimeout(timeout);
                console.log('✅ Browser2 connected to 8081');
                resolve(undefined);
            });
            browser2.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });
        
        // Wait for connections to stabilize
        console.log('⏳ Waiting for connections to stabilize...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set up message listener on browser2
        const receivedMessages: any[] = [];
        browser2.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log('📥 Browser2 received:', message.type, message.scenario?.state?.content?.substring(0, 50));
                receivedMessages.push(message);
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });
        
        // Browser1 sends broadcast message
        const broadcastMessage = {
            type: 'scenario-message',
            scenario: {
                uuid: randomUUID(),
                objectType: 'ONCEMessage',
                version: componentVersion,
                state: {
                    type: 'broadcast',
                    from: { uuid: 'browser-test', port: 8080 },
                    to: 'all',
                    content: '📡 Test broadcast from browser1',
                    timestamp: new Date().toISOString(),
                    sequence: 1
                },
                metadata: {
                    created: new Date().toISOString(),
                    modified: new Date().toISOString(),
                    creator: 'vitest',
                    description: 'Automated broadcast test'
                }
            }
        };
        
        console.log('📡 Sending broadcast from browser1...');
        browser1.send(JSON.stringify(broadcastMessage));
        
        // Wait for message propagation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`📊 Browser2 received ${receivedMessages.length} messages`);
        
        // Verify browser2 received the broadcast
        expect(receivedMessages.length).toBeGreaterThan(0);
        
        const broadcastReceived = receivedMessages.find(msg => 
            msg.type === 'scenario-message' && 
            msg.scenario?.state?.content?.includes('Test broadcast from browser1')
        );
        
        expect(broadcastReceived).toBeDefined();
        expect(broadcastReceived.scenario.state.type).toBe('broadcast');
        expect(broadcastReceived.scenario.state.to).toBe('all');
        
        console.log('✅ Broadcast test passed!');
        
        // Clean up
        browser1.close();
        browser2.close();
        
        // Wait for websockets to close
        await new Promise(resolve => setTimeout(resolve, 500));
    }, 30000);
});

