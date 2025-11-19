/**
 * Broadcast to All Servers Test - Including Primary Server Browser Clients
 * Tests that broadcast messages reach ALL servers including the primary server's browser clients
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import WebSocket from 'ws';
import { randomUUID } from 'crypto';

describe('Broadcast to All Servers (Including Primary)', () => {
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
        
        // Start primary server
        primaryServer = new DefaultONCE();
        await primaryServer.init();
        await primaryServer.startServer();
        console.log('✅ Primary server started on 42777');
        
        // Start two client servers
        clientServer1 = new DefaultONCE();
        await clientServer1.init();
        await clientServer1.startServer();
        console.log('✅ Client server 1 started on 8080');
        
        clientServer2 = new DefaultONCE();
        await clientServer2.init();
        await clientServer2.startServer();
        console.log('✅ Client server 2 started on 8081');
        
        // Wait for clients to register
        await new Promise(resolve => setTimeout(resolve, 2000));
    }, 30000);
    
    afterAll(async () => {
        await clientServer2?.stopServer();
        await clientServer1?.stopServer();
        await primaryServer?.stopServer();
    }, 10000);
    
    it('should deliver broadcast from client to primary server browser clients', async () => {
        const receivedMessages: any[] = [];
        
        // Connect browser client to primary server
        const primaryBrowser = new WebSocket('ws://localhost:42777');
        
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Primary browser connection timeout')), 5000);
            primaryBrowser.on('open', () => {
                clearTimeout(timeout);
                resolve();
            });
            primaryBrowser.on('error', reject);
        });
        
        // Connect browser client to client server 1
        const client1Browser = new WebSocket('ws://localhost:8080');
        
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Client1 browser connection timeout')), 5000);
            client1Browser.on('open', () => {
                clearTimeout(timeout);
                resolve();
            });
            client1Browser.on('error', reject);
        });
        
        // Listen for messages on primary browser
        primaryBrowser.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log('📥 Primary browser received:', message.type);
                if (message.type === 'scenario-message') {
                    receivedMessages.push(message);
                }
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        });
        
        // Wait for connections to stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Send broadcast from client1 browser
        const broadcastMessage = {
            type: 'scenario-message',
            scenario: {
                uuid: randomUUID(),
                objectType: 'ONCEMessage',
                version: componentVersion,
                state: {
                    type: 'broadcast',
                    to: 'all',
                    content: 'Test broadcast from client1 browser - should reach primary browser',
                    timestamp: new Date().toISOString()
                }
            }
        };
        
        console.log('📤 Client1 browser sending broadcast...');
        client1Browser.send(JSON.stringify(broadcastMessage));
        
        // Wait for message propagation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify primary browser received the broadcast
        expect(receivedMessages.length).toBeGreaterThan(0);
        const broadcastReceived = receivedMessages.find(msg => 
            msg.scenario?.state?.content?.includes('should reach primary browser')
        );
        expect(broadcastReceived).toBeDefined();
        expect(broadcastReceived.scenario.state.type).toBe('broadcast');
        
        console.log('✅ Primary browser successfully received broadcast from client');
        
        // Clean up
        primaryBrowser.close();
        client1Browser.close();
    }, 15000);
    
    it('should deliver broadcast from primary browser to all client servers', async () => {
        const client1Messages: any[] = [];
        const client2Messages: any[] = [];
        
        // Connect browser client to primary server
        const primaryBrowser = new WebSocket('ws://localhost:42777');
        
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Primary browser connection timeout')), 5000);
            primaryBrowser.on('open', () => {
                clearTimeout(timeout);
                resolve();
            });
            primaryBrowser.on('error', reject);
        });
        
        // Connect browser clients to client servers
        const client1Browser = new WebSocket('ws://localhost:8080');
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Client1 browser connection timeout')), 5000);
            client1Browser.on('open', () => {
                clearTimeout(timeout);
                resolve();
            });
            client1Browser.on('error', reject);
        });
        
        const client2Browser = new WebSocket('ws://localhost:8081');
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Client2 browser connection timeout')), 5000);
            client2Browser.on('open', () => {
                clearTimeout(timeout);
                resolve();
            });
            client2Browser.on('error', reject);
        });
        
        // Listen for messages on client browsers
        client1Browser.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === 'scenario-message') {
                    client1Messages.push(message);
                    console.log('📥 Client1 browser received broadcast');
                }
            } catch (error) {
                console.error('Client1 parse error:', error);
            }
        });
        
        client2Browser.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === 'scenario-message') {
                    client2Messages.push(message);
                    console.log('📥 Client2 browser received broadcast');
                }
            } catch (error) {
                console.error('Client2 parse error:', error);
            }
        });
        
        // Wait for connections to stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Send broadcast from primary browser
        const broadcastMessage = {
            type: 'scenario-message',
            scenario: {
                uuid: randomUUID(),
                objectType: 'ONCEMessage',
                version: componentVersion,
                state: {
                    type: 'broadcast',
                    to: 'all',
                    content: 'Test broadcast from primary browser - should reach all clients',
                    timestamp: new Date().toISOString()
                }
            }
        };
        
        console.log('📤 Primary browser sending broadcast...');
        primaryBrowser.send(JSON.stringify(broadcastMessage));
        
        // Wait for message propagation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify both client browsers received the broadcast
        expect(client1Messages.length).toBeGreaterThan(0);
        expect(client2Messages.length).toBeGreaterThan(0);
        
        const client1Received = client1Messages.find(msg => 
            msg.scenario?.state?.content?.includes('should reach all clients')
        );
        const client2Received = client2Messages.find(msg => 
            msg.scenario?.state?.content?.includes('should reach all clients')
        );
        
        expect(client1Received).toBeDefined();
        expect(client2Received).toBeDefined();
        
        console.log('✅ Both client browsers successfully received broadcast from primary');
        
        // Clean up
        primaryBrowser.close();
        client1Browser.close();
        client2Browser.close();
    }, 15000);
    
    it('should handle bidirectional broadcasts (client→primary→all and primary→all)', async () => {
        const primaryMessages: any[] = [];
        const client1Messages: any[] = [];
        
        // Connect browsers
        const primaryBrowser = new WebSocket('ws://localhost:42777');
        const client1Browser = new WebSocket('ws://localhost:8080');
        
        await Promise.all([
            new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Primary timeout')), 5000);
                primaryBrowser.on('open', () => { clearTimeout(timeout); resolve(); });
                primaryBrowser.on('error', reject);
            }),
            new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Client1 timeout')), 5000);
                client1Browser.on('open', () => { clearTimeout(timeout); resolve(); });
                client1Browser.on('error', reject);
            })
        ]);
        
        // Set up message listeners
        primaryBrowser.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === 'scenario-message') {
                    primaryMessages.push(message);
                }
            } catch (error) {}
        });
        
        client1Browser.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type === 'scenario-message') {
                    client1Messages.push(message);
                }
            } catch (error) {}
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test 1: Client → Primary
        const clientToPrimary = {
            type: 'scenario-message',
            scenario: {
                uuid: randomUUID(),
                objectType: 'ONCEMessage',
                version: componentVersion,
                state: {
                    type: 'broadcast',
                    to: 'all',
                    content: 'From client to primary',
                    timestamp: new Date().toISOString()
                }
            }
        };
        
        console.log('📤 Test 1: Client→Primary broadcast');
        client1Browser.send(JSON.stringify(clientToPrimary));
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Test 2: Primary → Client
        const primaryToClient = {
            type: 'scenario-message',
            scenario: {
                uuid: randomUUID(),
                objectType: 'ONCEMessage',
                version: componentVersion,
                state: {
                    type: 'broadcast',
                    to: 'all',
                    content: 'From primary to client',
                    timestamp: new Date().toISOString()
                }
            }
        };
        
        console.log('📤 Test 2: Primary→Client broadcast');
        primaryBrowser.send(JSON.stringify(primaryToClient));
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verify bidirectional communication
        const primaryReceivedFromClient = primaryMessages.find(msg => 
            msg.scenario?.state?.content?.includes('From client to primary')
        );
        const clientReceivedFromPrimary = client1Messages.find(msg => 
            msg.scenario?.state?.content?.includes('From primary to client')
        );
        
        expect(primaryReceivedFromClient).toBeDefined();
        expect(clientReceivedFromPrimary).toBeDefined();
        
        console.log('✅ Bidirectional broadcast communication verified');
        
        // Clean up
        primaryBrowser.close();
        client1Browser.close();
    }, 20000);
});

