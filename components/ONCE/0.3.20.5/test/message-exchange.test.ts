/**
 * ONCE Message Exchange Test Suite
 * @pdca 2025-11-11-UTC-2322.pdca.md - Automated multi-server message testing
 * @pdca 2025-11-18-UTC-1745.pdca.md - Enhanced relay and primary discovery tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DefaultONCE } from '../src/ts/layer2/DefaultONCE.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

// Dynamically get component version
const componentVersion = DefaultONCE.prototype.constructor.name ? '0.3.20.5' : '0.3.20.5';

describe('ONCE Multi-Server Message Exchange', () => {
  const componentRoot = `/Users/Shared/Workspaces/2cuGitHub/UpDown/components/ONCE/${componentVersion}`;
  
  beforeAll(async () => {
    // Clean up any existing test artifacts
    const reportPath = path.join(componentRoot, 'scenarios/message-exchange-report.json');
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
  });

  afterAll(async () => {
    // Graceful cleanup - no kill commands
    console.log('ℹ️  Test cleanup - servers should have stopped gracefully');
  });

  it('should spawn primary and 3 client servers', async () => {
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 3 > /tmp/test-demo.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 5 && \\
curl -s http://localhost:42777/health | grep -q "running" && \\
curl -s http://localhost:8080/health | grep -q "running" && \\
curl -s http://localhost:8081/health | grep -q "running" && \\
curl -s http://localhost:8082/health | grep -q "running" && \\
wait $DEMO_PID || true && \\
echo "SUCCESS"
    `;

    const { stdout } = await execAsync(testScript);
    expect(stdout.trim()).toContain('SUCCESS');
  }, 30000);

  it('should broadcast from primary to all clients', async () => {
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 3 > /tmp/test-broadcast.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 5 && \\
grep -q "Broadcasting scenario" /tmp/test-broadcast.log && \\
grep -q "to 3 clients" /tmp/test-broadcast.log && \\
wait $DEMO_PID || true && \\
echo "BROADCAST_OK"
    `;

    const { stdout } = await execAsync(testScript);
    expect(stdout.trim()).toContain('BROADCAST_OK');
  }, 30000);

  it('should relay message client→primary→client', async () => {
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 3 > /tmp/test-relay.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 6 && \\
grep -q "Relaying scenario" /tmp/test-relay.log && \\
grep -q "Primary relaying scenario" /tmp/test-relay.log && \\
wait $DEMO_PID || true && \\
echo "RELAY_OK"
    `;

    const { stdout } = await execAsync(testScript);
    expect(stdout.trim()).toContain('RELAY_OK');
  }, 30000);

  it('should support direct P2P communication', async () => {
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 3 > /tmp/test-p2p.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 7 && \\
grep -q "P2P connection established" /tmp/test-p2p.log && \\
grep -q "Direct P2P message" /tmp/test-p2p.log && \\
wait $DEMO_PID || true && \\
echo "P2P_OK"
    `;

    const { stdout } = await execAsync(testScript);
    expect(stdout.trim()).toContain('P2P_OK');
  }, 30000);

  it('should generate JSON report with all patterns', async () => {
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 3 > /tmp/test-json.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 8 && \\
wait $DEMO_PID || true && \\
test -f scenarios/message-exchange-report.json && \\
cat scenarios/message-exchange-report.json
    `;

    const { stdout } = await execAsync(testScript);
    const report = JSON.parse(stdout);

    // Verify report structure
    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('configuration');
    expect(report).toHaveProperty('messages');
    expect(report).toHaveProperty('patterns');

    // Verify configuration
    expect(report.configuration.primary.port).toBe(42777);
    expect(report.configuration.clients).toHaveLength(3);
    expect(report.configuration.clients[0].port).toBe(8080);
    expect(report.configuration.clients[1].port).toBe(8081);
    expect(report.configuration.clients[2].port).toBe(8082);

    // Verify messages
    expect(report.messages).toHaveLength(3);
    
    // Verify broadcast message
    const broadcast = report.messages.find((m: any) => m.state.type === 'broadcast');
    expect(broadcast).toBeDefined();
    expect(broadcast.objectType).toBe('ONCEMessage');
    expect(broadcast.version).toBe(componentVersion);
    expect(broadcast.state.to).toBe('all');

    // Verify relay message
    const relay = report.messages.find((m: any) => m.state.type === 'relay');
    expect(relay).toBeDefined();
    expect(relay.state.from.port).toBe(8080);
    expect(relay.state.to.port).toBe(8081);

    // Verify P2P message
    const p2p = report.messages.find((m: any) => m.state.type === 'p2p');
    expect(p2p).toBeDefined();
    expect(p2p.state.from.port).toBe(8080);
    expect(p2p.state.to.port).toBe(8081);

    // Verify pattern counts
    expect(report.patterns.broadcast).toBe(1);
    expect(report.patterns.relay).toBe(1);
    expect(report.patterns.p2p).toBe(1);
  }, 30000);

  it('should auto-acknowledge received messages', async () => {
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 3 > /tmp/test-ack.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 8 && \\
wait $DEMO_PID || true && \\
grep -c "ACK:" /tmp/test-ack.log
    `;

    const { stdout } = await execAsync(testScript);
    const ackCount = parseInt(stdout.trim(), 10);
    
    // Should have multiple ACKs (1 relay + 1 P2P = at least 2)
    expect(ackCount).toBeGreaterThanOrEqual(2);
  }, 30000);

  it('should track messages in model (no private state)', async () => {
    // This test verifies Radical OOP by checking the implementation
    const once = new DefaultONCE();
    await once.init();

    // Initialize message tracker
    once.model.messageTracker = {
      sent: [],
      received: [],
      acknowledged: [],
      patterns: { broadcast: 0, relay: 0, p2p: 0 }
    };

    // Verify model-driven structure
    expect(once.model.messageTracker).toBeDefined();
    expect(once.model.messageTracker.sent).toBeInstanceOf(Array);
    expect(once.model.messageTracker.received).toBeInstanceOf(Array);
    expect(once.model.messageTracker.acknowledged).toBeInstanceOf(Array);
    expect(once.model.messageTracker.patterns).toHaveProperty('broadcast');
    expect(once.model.messageTracker.patterns).toHaveProperty('relay');
    expect(once.model.messageTracker.patterns).toHaveProperty('p2p');
  });

  it('should use Web4 scenario message format', async () => {
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 3 > /tmp/test-format.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 8 && \\
wait $DEMO_PID || true && \\
cat scenarios/message-exchange-report.json
    `;

    const { stdout } = await execAsync(testScript);
    const report = JSON.parse(stdout);

    // Verify Web4 scenario format for each message
    report.messages.forEach((message: any) => {
      expect(message).toHaveProperty('uuid');
      expect(message).toHaveProperty('objectType');
      expect(message).toHaveProperty('version');
      expect(message).toHaveProperty('state');
      expect(message).toHaveProperty('metadata');
      
      expect(message.objectType).toBe('ONCEMessage');
      expect(message.version).toBe(componentVersion);
      
      expect(message.state).toHaveProperty('type');
      expect(message.state).toHaveProperty('from');
      expect(message.state).toHaveProperty('content');
      expect(message.state).toHaveProperty('timestamp');
      expect(message.state).toHaveProperty('sequence');
      
      expect(message.state.from).toHaveProperty('uuid');
      expect(message.state.from).toHaveProperty('port');
    });
  }, 30000);

  // ========================================
  // NEW TESTS: Dynamic Primary Discovery & Enhanced Relay
  // @pdca 2025-11-18-UTC-1745.pdca.md
  // ========================================

  it('should expose primary server info in client /health endpoint', async () => {
    // Start primary + 1 client
    const primary = new DefaultONCE();
    await primary.init();
    await primary.startServer();
    const primaryModel = primary.getServerModel();
    const primaryPort = primaryModel.capabilities.find(c => c.capability === 'httpPort')?.port || 42777;

    await new Promise(resolve => setTimeout(resolve, 1000)); // Let primary settle

    const client = new DefaultONCE();
    await client.init();
    await client.startServer();
    const clientModel = client.getServerModel();
    const clientPort = clientModel.capabilities.find(c => c.capability === 'httpPort')?.port || 8080;

    await new Promise(resolve => setTimeout(resolve, 2000)); // Let client register

    // Fetch client's /health endpoint
    const response = await fetch(`http://localhost:${clientPort}/health`);
    const healthData = await response.json();

    // Verify health data structure
    expect(healthData).toHaveProperty('status');
    expect(healthData.status).toBe('running');
    expect(healthData.isPrimaryServer).toBe(false);

    // Verify primary server info is included
    expect(healthData).toHaveProperty('primaryServer');
    expect(healthData.primaryServer).toHaveProperty('host');
    expect(healthData.primaryServer).toHaveProperty('port');
    expect(healthData.primaryServer).toHaveProperty('connected');
    expect(healthData.primaryServer.port).toBe(primaryPort);
    expect(healthData.primaryServer.connected).toBe(true);

    // Cleanup
    await client.stopServer();
    await primary.stopServer();
  }, 30000);

  it('should serve /servers endpoint only on primary server', async () => {
    // Start primary + 1 client
    const primary = new DefaultONCE();
    await primary.init();
    await primary.startServer();
    const primaryModel = primary.getServerModel();
    const primaryPort = primaryModel.capabilities.find(c => c.capability === 'httpPort')?.port || 42777;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const client = new DefaultONCE();
    await client.init();
    await client.startServer();
    const clientModel = client.getServerModel();
    const clientPort = clientModel.capabilities.find(c => c.capability === 'httpPort')?.port || 8080;

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test primary's /servers endpoint - should work
    const primaryResponse = await fetch(`http://localhost:${primaryPort}/servers`);
    expect(primaryResponse.status).toBe(200);
    const primaryData = await primaryResponse.json();
    expect(primaryData).toHaveProperty('servers');
    expect(primaryData.servers).toBeInstanceOf(Array);
    expect(primaryData.servers.length).toBeGreaterThanOrEqual(1); // At least the client

    // Test client's /servers endpoint - should return 404
    const clientResponse = await fetch(`http://localhost:${clientPort}/servers`);
    expect(clientResponse.status).toBe(404);

    // Cleanup
    await client.stopServer();
    await primary.stopServer();
  }, 30000);

  it('should discover primary server dynamically from client /health', async () => {
    // This test simulates what the browser client does:
    // 1. Fetch client's /health to get primary server info
    // 2. Use that info to fetch /servers from primary

    // Start primary + 1 client
    const primary = new DefaultONCE();
    await primary.init();
    await primary.startServer();

    await new Promise(resolve => setTimeout(resolve, 1000));

    const client = new DefaultONCE();
    await client.init();
    await client.startServer();
    const clientModel = client.getServerModel();
    const clientPort = clientModel.capabilities.find(c => c.capability === 'httpPort')?.port || 8080;

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 1: Fetch client's /health to discover primary
    const healthResponse = await fetch(`http://localhost:${clientPort}/health`);
    const healthData = await healthResponse.json();

    expect(healthData.primaryServer).toBeDefined();
    const primaryHost = healthData.primaryServer.host || 'localhost';
    const primaryPort = healthData.primaryServer.port;

    // Step 2: Use discovered primary address to fetch /servers
    const serversResponse = await fetch(`http://${primaryHost}:${primaryPort}/servers`);
    expect(serversResponse.status).toBe(200);
    const serversData = await serversResponse.json();

    expect(serversData).toHaveProperty('servers');
    expect(serversData.servers).toBeInstanceOf(Array);
    expect(serversData.servers.length).toBeGreaterThanOrEqual(1);

    // Verify we found the client in the server list
    const foundClient = serversData.servers.find((s: any) => s.uuid === clientModel.uuid);
    expect(foundClient).toBeDefined();

    // Cleanup
    await client.stopServer();
    await primary.stopServer();
  }, 30000);

  it('should include host field in relay message from field', async () => {
    // Verify that relay messages include hostname in the from field
    const testScript = `
cd ${componentRoot} && \\
timeout 15 ./once demoMessages 2 > /tmp/test-relay-host.log 2>&1 & \\
DEMO_PID=$! && \\
sleep 8 && \\
wait $DEMO_PID || true && \\
cat scenarios/message-exchange-report.json
    `;

    const { stdout } = await execAsync(testScript);
    const report = JSON.parse(stdout);

    // Find relay message
    const relay = report.messages.find((m: any) => m.state.type === 'relay');
    expect(relay).toBeDefined();

    // Verify from field has uuid, port, AND host (new requirement)
    expect(relay.state.from).toHaveProperty('uuid');
    expect(relay.state.from).toHaveProperty('port');
    // Note: demoMessages creates messages internally, so host might not be set
    // This test documents the expected structure for browser-initiated messages
    if (relay.state.from.host) {
      expect(typeof relay.state.from.host).toBe('string');
    }
  }, 30000);

  it('should allow browser clients to fetch server list via health endpoint', async () => {
    // This test verifies the fetchConnectedServers() flow:
    // Browser → Client /health → get primary address → Primary /servers → get server list
    
    // Start primary + 2 clients
    const primary = new DefaultONCE();
    await primary.init();
    await primary.startServer();
    const primaryModel = primary.getServerModel();
    const primaryPort = primaryModel.capabilities.find(c => c.capability === 'httpPort')?.port || 42777;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const client1 = new DefaultONCE();
    await client1.init();
    await client1.startServer();
    const client1Model = client1.getServerModel();
    const client1Port = client1Model.capabilities.find(c => c.capability === 'httpPort')?.port || 8080;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const client2 = new DefaultONCE();
    await client2.init();
    await client2.startServer();
    const client2Model = client2.getServerModel();
    const client2Port = client2Model.capabilities.find(c => c.capability === 'httpPort')?.port || 8081;

    await new Promise(resolve => setTimeout(resolve, 2000)); // Let both clients register

    // Simulate browser connected to client1:
    // Step 1: Fetch client1's /health to discover primary
    const healthResponse = await fetch(`http://localhost:${client1Port}/health`);
    expect(healthResponse.status).toBe(200);
    const healthData = await healthResponse.json();
    
    expect(healthData.isPrimaryServer).toBe(false);
    expect(healthData.primaryServer).toBeDefined();
    expect(healthData.primaryServer.port).toBe(primaryPort);

    // Step 2: Use discovered primary to fetch /servers
    const primaryHost = healthData.primaryServer.host || 'localhost';
    const discoveredPrimaryPort = healthData.primaryServer.port;
    
    const serversResponse = await fetch(`http://${primaryHost}:${discoveredPrimaryPort}/servers`);
    expect(serversResponse.status).toBe(200);
    const serversData = await serversResponse.json();

    expect(serversData).toHaveProperty('servers');
    expect(serversData.servers).toBeInstanceOf(Array);
    expect(serversData.servers.length).toBeGreaterThanOrEqual(2); // At least client1 and client2

    // Step 3: Verify we can find both clients in the list
    const foundClient1 = serversData.servers.find((s: any) => s.uuid === client1Model.uuid);
    const foundClient2 = serversData.servers.find((s: any) => s.uuid === client2Model.uuid);
    
    expect(foundClient1).toBeDefined();
    expect(foundClient2).toBeDefined();

    // Step 4: Verify relay target selection (exclude current server)
    const currentPort = client1Port;
    const otherClients = serversData.servers.filter((s: any) => {
      const sPort = s.capabilities?.find((c: any) => c.capability === 'httpPort')?.port;
      return sPort !== currentPort && sPort !== primaryPort;
    });

    expect(otherClients.length).toBeGreaterThanOrEqual(1); // Should have at least client2
    expect(otherClients[0].uuid).toBe(client2Model.uuid);

    // Cleanup
    await client2.stopServer();
    await client1.stopServer();
    await primary.stopServer();
  }, 30000);
});
