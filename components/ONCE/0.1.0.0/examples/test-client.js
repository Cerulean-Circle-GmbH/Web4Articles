import WebSocket from 'ws';

console.log('🔗 ONCE Test Client - Testing server connection...\n');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

console.log(`🌐 Using server: ${HOST}:${PORT}`);

// Test health endpoint first
try {
    const healthResponse = await fetch(`http://${HOST}:${PORT}/health`);
    const health = await healthResponse.json();
    console.log('✅ Health check passed:', health);
} catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
}

// Connect via WebSocket
const ws = new WebSocket(`ws://${HOST}:${PORT}`);

ws.on('open', () => {
    console.log('\n✅ WebSocket connected!');
    
    // Test scenario request
    console.log('📦 Requesting user scenario...');
    ws.send(JSON.stringify({
        type: 'request-scenario',
        scenarioId: 'af0b6e99-85c9-4ce5-9945-031767f375c9'
    }));
    
    // Test peer discovery
    setTimeout(() => {
        console.log('🔍 Discovering peers...');
        ws.send(JSON.stringify({
            type: 'discover-peers'
        }));
    }, 1000);
    
    // Create and share a new scenario
    setTimeout(() => {
        console.log('📤 Creating and sharing new scenario...');
        ws.send(JSON.stringify({
            type: 'share-scenario',
            scenario: {
                uuid: '12345678-test-test-test-123456789012',
                objectType: 'TestMessage',
                version: '0.1.0.0',
                state: {
                    IOR: 'message:12345678-test-test-test-123456789012',
                    owner: 'test-client',
                    model: {
                        content: 'Hello from test client!',
                        timestamp: new Date().toISOString()
                    }
                }
            }
        }));
    }, 2000);
    
    // Close after 5 seconds
    setTimeout(() => {
        console.log('\n👋 Closing connection...');
        ws.close();
    }, 5000);
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('\n📨 Received:', message.type);
    
    if (message.type === 'scenario') {
        console.log('  Scenario:', message.scenario.objectType, '-', message.scenario.state.model);
    } else if (message.type === 'peers') {
        console.log('  Peers:', message.peers);
    } else if (message.type === 'new-scenario') {
        console.log('  New scenario from peer:', message.scenario.objectType);
    } else {
        console.log('  Data:', JSON.stringify(message, null, 2));
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
});

ws.on('close', () => {
    console.log('\n✅ Test completed!');
    process.exit(0);
});