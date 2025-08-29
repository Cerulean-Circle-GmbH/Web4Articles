#!/usr/bin/env node

/**
 * ONCE Interactive Demo Controller
 * Features keyboard controls and graceful lifecycle management
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import readline from 'readline';
import WebSocket from 'ws';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execAsync = promisify(exec);

// Demo state
const state = {
    serverProcess: null,
    serverPID: null,
    serverURL: null,
    clients: new Map(),
    running: false,
    HOST: null,
    PORT: 8080,
    testMode: false,
    keyboardEnabled: true
};

// Console styling
const log = {
    info: (msg) => console.log(chalk.cyan('ℹ️  ' + msg)),
    success: (msg) => console.log(chalk.green('✅ ' + msg)),
    error: (msg) => console.log(chalk.red('❌ ' + msg)),
    warn: (msg) => console.log(chalk.yellow('⚠️  ' + msg)),
    demo: (msg) => console.log(chalk.magenta('🎭 ' + msg)),
    key: (key, desc) => console.log(chalk.blue(`  [${key}]`) + ' ' + desc)
};

// Get host IP
async function getHostIP() {
    try {
        const { stdout } = await execAsync("hostname -I | awk '{print $1}'");
        return stdout.trim();
    } catch (error) {
        log.warn('Could not detect host IP, using localhost');
        return 'localhost';
    }
}

// Clear screen and show header
function showHeader() {
    console.clear();
    console.log(chalk.bold.cyan('╔════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║       ONCE Interactive Demo Controller         ║'));
    console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝'));
    console.log();
}

// Show help menu
function showHelp() {
    console.log(chalk.bold('\n📋 Keyboard Controls:'));
    console.log(chalk.gray('─────────────────────'));
    log.key('h', 'Show this help menu');
    log.key('s', 'Start/Stop ONCE server');
    log.key('1', 'Launch Browser Client simulation');
    log.key('2', 'Launch Node.js Client');
    log.key('3', 'Launch Web Worker simulation');
    log.key('d', 'Discover peers (from all clients)');
    log.key('e', 'Exchange scenarios between clients');
    log.key('m', 'Show metrics and status');
    log.key('c', 'Clear screen');
    log.key('k', 'Kill all demo processes gracefully');
    log.key('q', 'Quit demo (with cleanup)');
    console.log();
}

// Start ONCE server
async function startServer() {
    if (state.serverProcess) {
        log.warn('Server already running');
        return;
    }

    log.info('Starting ONCE server...');
    
    state.HOST = await getHostIP();
    const serverPath = join(__dirname, '../node-server/server.mjs');
    
    state.serverProcess = spawn('node', [serverPath], {
        env: { ...process.env, HOST: state.HOST, PORT: state.PORT },
        cwd: join(__dirname, '../node-server')
    });
    
    state.serverPID = state.serverProcess.pid;
    state.serverURL = `http://${state.HOST}:${state.PORT}`;
    
    state.serverProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output.includes('listening')) {
            state.running = true;
            log.success(`Server started on ${state.serverURL}`);
        }
    });
    
    state.serverProcess.stderr.on('data', (data) => {
        log.error('Server error: ' + data.toString());
    });
    
    state.serverProcess.on('exit', (code) => {
        log.info(`Server exited with code ${code}`);
        state.serverProcess = null;
        state.running = false;
    });
    
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
}

// Stop server gracefully
async function stopServer() {
    if (!state.serverProcess) {
        log.warn('Server not running');
        return;
    }
    
    log.info('Stopping server gracefully...');
    
    // Send SIGTERM for graceful shutdown
    state.serverProcess.kill('SIGTERM');
    
    // Wait for process to exit
    await new Promise(resolve => {
        state.serverProcess.on('exit', resolve);
        setTimeout(resolve, 5000); // Timeout after 5 seconds
    });
    
    if (state.serverProcess) {
        log.warn('Force killing server...');
        state.serverProcess.kill('SIGKILL');
    }
    
    state.serverProcess = null;
    state.running = false;
    log.success('Server stopped');
}

// Launch client
async function launchClient(type) {
    if (!state.running) {
        log.error('Server not running. Start server first (press "s")');
        return;
    }
    
    const clientId = `${type}-${Date.now()}`;
    log.info(`Launching ${type} client...`);
    
    try {
        const ws = new WebSocket(`ws://${state.HOST}:${state.PORT}`);
        
        ws.on('open', () => {
            log.success(`${type} client connected (${clientId})`);
            state.clients.set(clientId, { ws, type, connected: true });
            
            // Register client
            ws.send(JSON.stringify({
                type: 'register',
                peerInfo: {
                    name: `${type} Client ${clientId}`,
                    platform: type.toLowerCase(),
                    capabilities: ['scenario-exchange', 'p2p']
                }
            }));
        });
        
        ws.on('message', (data) => {
            const msg = JSON.parse(data);
            if (msg.type === 'new-scenario') {
                log.demo(`${type} received new scenario: ${msg.scenario.objectType}`);
            }
        });
        
        ws.on('close', () => {
            log.info(`${type} client disconnected`);
            state.clients.delete(clientId);
        });
        
        ws.on('error', (err) => {
            log.error(`${type} client error: ${err.message}`);
            state.clients.delete(clientId);
        });
        
    } catch (error) {
        log.error(`Failed to launch ${type} client: ${error.message}`);
    }
}

// Discover peers from all clients
async function discoverPeers() {
    if (state.clients.size === 0) {
        log.warn('No clients connected');
        return;
    }
    
    log.info('Discovering peers from all clients...');
    
    state.clients.forEach((client, id) => {
        if (client.connected && client.ws.readyState === WebSocket.OPEN) {
            client.ws.send(JSON.stringify({ type: 'discover-peers' }));
            
            client.ws.once('message', (data) => {
                const msg = JSON.parse(data);
                if (msg.type === 'peers') {
                    log.demo(`${client.type} discovered ${msg.peers.length} peers`);
                }
            });
        }
    });
}

// Exchange scenarios
async function exchangeScenarios() {
    if (state.clients.size < 2) {
        log.warn('Need at least 2 clients for scenario exchange');
        return;
    }
    
    log.info('Initiating scenario exchange...');
    
    // Get first client to share a scenario
    const [firstClient] = state.clients.values();
    if (firstClient.connected && firstClient.ws.readyState === WebSocket.OPEN) {
        firstClient.ws.send(JSON.stringify({
            type: 'share-scenario',
            scenario: {
                uuid: `demo-${Date.now()}`,
                objectType: 'DemoMessage',
                version: '0.1.0.0',
                state: {
                    IOR: `message:demo-${Date.now()}`,
                    owner: firstClient.type,
                    model: {
                        content: `Hello from ${firstClient.type}!`,
                        timestamp: new Date().toISOString()
                    }
                }
            }
        }));
        
        log.success('Scenario shared from first client');
    }
}

// Show metrics
async function showMetrics() {
    console.log(chalk.bold('\n📊 System Metrics:'));
    console.log(chalk.gray('─────────────────'));
    
    if (state.running) {
        try {
            const response = await fetch(`${state.serverURL}/health`);
            const health = await response.json();
            
            console.log(`  Server Status: ${chalk.green('RUNNING')}`);
            console.log(`  Server URL: ${state.serverURL}`);
            console.log(`  ONCE Version: ${health.once.version}`);
            console.log(`  Connected Peers: ${health.peers}`);
            console.log(`  Total Scenarios: ${health.scenarios}`);
        } catch (error) {
            console.log(`  Server Status: ${chalk.red('ERROR')}`);
        }
    } else {
        console.log(`  Server Status: ${chalk.red('STOPPED')}`);
    }
    
    console.log(`  Active Clients: ${state.clients.size}`);
    if (state.clients.size > 0) {
        state.clients.forEach((client, id) => {
            console.log(`    - ${client.type}: ${client.connected ? chalk.green('connected') : chalk.red('disconnected')}`);
        });
    }
    console.log();
}

// Kill all processes gracefully
async function killAllProcesses() {
    log.warn('Shutting down all demo processes...');
    
    // Close all client connections
    for (const [id, client] of state.clients) {
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.close();
        }
    }
    state.clients.clear();
    
    // Stop server
    await stopServer();
    
    // Clean up any orphaned processes
    try {
        await execAsync(`ps -edalf | grep -E "(server.mjs|once-demo)" | grep -v grep | awk '{print $4}' | xargs -r kill -TERM 2>/dev/null`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await execAsync(`ps -edalf | grep -E "(server.mjs|once-demo)" | grep -v grep | awk '{print $4}' | xargs -r kill -KILL 2>/dev/null`);
    } catch (error) {
        // Ignore errors from kill commands
    }
    
    log.success('All processes terminated');
}

// Setup keyboard input
function setupKeyboard() {
    if (!state.keyboardEnabled) return;
    
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    
    process.stdin.on('keypress', async (str, key) => {
        if (key.ctrl && key.name === 'c') {
            await cleanup();
            process.exit(0);
        }
        
        switch (key.name) {
            case 'h':
                showHelp();
                break;
                
            case 's':
                if (state.running) {
                    await stopServer();
                } else {
                    await startServer();
                }
                break;
                
            case '1':
                await launchClient('Browser');
                break;
                
            case '2':
                await launchClient('NodeJS');
                break;
                
            case '3':
                await launchClient('Worker');
                break;
                
            case 'd':
                await discoverPeers();
                break;
                
            case 'e':
                await exchangeScenarios();
                break;
                
            case 'm':
                await showMetrics();
                break;
                
            case 'c':
                showHeader();
                showHelp();
                break;
                
            case 'k':
                await killAllProcesses();
                break;
                
            case 'q':
                log.info('Quitting demo...');
                await cleanup();
                process.exit(0);
                break;
                
            default:
                if (key.name) {
                    log.warn(`Unknown command: ${key.name}`);
                }
        }
    });
}

// Cleanup function
async function cleanup() {
    log.info('Performing cleanup...');
    
    // Gracefully close all connections
    for (const [id, client] of state.clients) {
        if (client.ws.readyState === WebSocket.OPEN) {
            client.ws.close();
        }
    }
    
    // Stop server gracefully
    if (state.serverProcess) {
        await stopServer();
    }
    
    // Final process cleanup
    await killAllProcesses();
    
    log.success('Cleanup complete');
}

// Parse test sequence into actions
function parseSequence(sequence) {
    const actions = [];
    let i = 0;
    
    while (i < sequence.length) {
        const char = sequence[i];
        
        // Check if it's a digit
        if (/\d/.test(char)) {
            // Collect all consecutive digits
            let numStr = '';
            while (i < sequence.length && /\d/.test(sequence[i])) {
                numStr += sequence[i];
                i++;
            }
            actions.push({ type: 'pause', value: parseInt(numStr) });
        } else {
            // It's a key command
            actions.push({ type: 'key', value: char });
            i++;
        }
    }
    
    return actions;
}

// Simulate a keypress
async function simulateKeypress(key) {
    log.key(key, 'Simulating keypress');
    
    switch (key) {
        case 'h':
            showHelp();
            break;
            
        case 's':
            if (state.running) {
                await stopServer();
            } else {
                await startServer();
            }
            break;
            
        case '1':
            await launchClient('Browser');
            break;
            
        case '2':
            await launchClient('NodeJS');
            break;
            
        case '3':
            await launchClient('Worker');
            break;
            
        case 'd':
            await discoverPeers();
            break;
            
        case 'e':
            await exchangeScenarios();
            break;
            
        case 'm':
            await showMetrics();
            break;
            
        case 'c':
            showHeader();
            showHelp();
            break;
            
        case 'k':
            await killAllProcesses();
            break;
            
        case 'q':
            log.info('Quit command received');
            await cleanup();
            process.exit(0);
            break;
            
        default:
            log.warn(`Unknown key: ${key}`);
    }
}

// Run test mode with sequence
async function runTestMode(sequence) {
    state.testMode = true;
    state.keyboardEnabled = false;
    
    console.log(chalk.bold.yellow('\n🤖 ONCE Demo Test Mode'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(chalk.cyan(`Sequence: ${sequence}`));
    console.log(chalk.gray('─'.repeat(40)) + '\n');
    
    const actions = parseSequence(sequence);
    
    // Show parsed actions
    console.log('📋 Parsed actions:');
    actions.forEach((action, index) => {
        if (action.type === 'key') {
            console.log(`  ${index + 1}. Press '${action.value}'`);
        } else {
            console.log(`  ${index + 1}. Wait ${action.value} second${action.value > 1 ? 's' : ''}`);
        }
    });
    console.log();
    
    // Initialize
    await getHostIP().then(ip => state.HOST = ip);
    
    // Execute sequence
    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        
        if (action.type === 'key') {
            console.log(chalk.blue(`\n[${i + 1}/${actions.length}] ⌨️  Pressing '${action.value}'...`));
            await simulateKeypress(action.value);
        } else if (action.type === 'pause') {
            console.log(chalk.yellow(`\n[${i + 1}/${actions.length}] ⏸️  Waiting ${action.value} second${action.value > 1 ? 's' : ''}...`));
            await new Promise(resolve => setTimeout(resolve, action.value * 1000));
        }
    }
    
    console.log(chalk.green('\n✅ Test sequence completed!'));
}

// Main function
async function main() {
    // Check for test mode
    const args = process.argv.slice(2);
    if (args[0] === 'demo' && args[1]) {
        await runTestMode(args[1]);
        return;
    }
    
    // Setup exit handlers
    process.on('SIGINT', async () => {
        await cleanup();
        process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
        await cleanup();
        process.exit(0);
    });
    
    // Show interface
    showHeader();
    log.demo('Welcome to ONCE Interactive Demo!');
    showHelp();
    
    // Setup keyboard
    setupKeyboard();
    
    log.info('Ready for commands. Press "h" for help, "q" to quit.');
}

// Check if chalk is installed
try {
    await import('chalk');
    main().catch(console.error);
} catch (error) {
    console.error('Please install chalk: npm install chalk');
    console.error('Run: cd /workspace/components/ONCE/0.1.0.0/examples && npm install chalk');
}