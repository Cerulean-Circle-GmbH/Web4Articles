/**
 * Server Lifecycle Management Tests
 * Tests housekeeping, graceful shutdown, and dynamic server management
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';
import * as http from 'http';

/**
 * Helper: Spawn a server as a separate process
 * Returns: ChildProcess, port, and UUID
 */
async function spawnServer(isPrimary: boolean = false): Promise<{ process: ChildProcess; port: number; uuid: string }> {
    return new Promise((resolve, reject) => {
        const serverType = isPrimary ? 'primary' : 'client';
        const scriptPath = path.resolve(__dirname, 'spawn-server.mjs');
        
        // Spawn node process running the spawn script
        const serverProcess = spawn('node', [scriptPath, serverType], {
            cwd: path.resolve(__dirname, '..'),
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, NODE_ENV: 'test' }
        });
        
        let resolved = false;
        
        serverProcess.stdout?.on('data', (data) => {
            const lines = data.toString().split('\n');
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                
                try {
                    // Try to parse as JSON
                    const serverInfo = JSON.parse(trimmed);
                    if (!resolved && serverInfo.pid && serverInfo.port && serverInfo.uuid) {
                        resolved = true;
                        resolve({
                            process: serverProcess,
                            port: serverInfo.port,
                            uuid: serverInfo.uuid
                        });
                    }
                } catch (e) {
                    // Not JSON, just log output
                    console.log(`[Server ${serverProcess.pid}]:`, trimmed);
                }
            }
        });
        
        serverProcess.stderr?.on('data', (data) => {
            console.error(`[Server ${serverProcess.pid} stderr]:`, data.toString());
        });
        
        serverProcess.on('error', (error) => {
            if (!resolved) {
                resolved = true;
                reject(error);
            }
        });
        
        serverProcess.on('exit', (code) => {
            if (!resolved) {
                resolved = true;
                reject(new Error(`Server exited with code ${code} before outputting info`));
            }
        });
        
        // Timeout after 15 seconds
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                serverProcess.kill('SIGKILL');
                reject(new Error(`Server spawn timeout after 15s (type: ${serverType})`));
            }
        }, 15000);
    });
}

/**
 * Helper: Check if server is healthy via HTTP
 */
async function checkServerHealth(port: number, timeout: number = 1000): Promise<boolean> {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port,
            path: '/health',
            method: 'GET',
            timeout
        }, (res) => {
            resolve(res.statusCode === 200);
        });
        
        req.on('error', () => resolve(false));
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        req.end();
    });
}

/**
 * Helper: Wait for condition with timeout
 */
async function waitFor(
    condition: () => Promise<boolean>,
    maxWaitMs: number = 15000,
    intervalMs: number = 1000
): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
        if (await condition()) {
            return true;
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    return false;
}

describe('Server Lifecycle Management', () => {
    // Scenarios are stored in project root - use path authority from DefaultONCE instance
    let testProjectRoot: string;
    let scenarioBaseDir: string;
    let componentVersion: string;
    let detectedDomain: string; // ✅ Dynamic domain detection
    let detectedHostname: string; // ✅ Dynamic hostname detection
    let domainPath: string[]; // ✅ Domain as path components
    
    beforeEach(async () => {
        // Get project root and version from DefaultONCE path authority (TRUE Radical OOP)
        const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
        const tempInstance = new DefaultONCE();
        await tempInstance.init();
        
        // Trigger web4ts initialization to populate model.projectRoot
        await (tempInstance as any).getWeb4TSComponent();
        
        testProjectRoot = tempInstance.model.projectRoot;
        componentVersion = tempInstance.model.version;
        
        // ✅ Get the actual domain/hostname being used by servers
        await tempInstance.startServer();
        const serverModel = (tempInstance as any).serverHierarchyManager.getServerModel();
        detectedDomain = serverModel.domain;
        detectedHostname = serverModel.hostname;
        
        // Parse domain into path components
        const fqdn = serverModel.host;
        if (fqdn === 'localhost') {
            domainPath = ['local', 'once'];
        } else if (fqdn.includes('.')) {
            const parts = fqdn.split('.');
            const domain = parts.slice(1);
            domainPath = domain.reverse();
        } else {
            domainPath = ['local', fqdn];
        }
        
        await tempInstance.stopServer();
        
        scenarioBaseDir = path.join(testProjectRoot, 'scenarios', ...domainPath, detectedHostname, 'ONCE', componentVersion);
        console.log(`📂 Using scenario directory: scenarios/${domainPath.join('/')}/${detectedHostname}/ONCE/${componentVersion}`);
        
        // Ensure scenario directory exists for tests
        if (!fs.existsSync(scenarioBaseDir)) {
            fs.mkdirSync(scenarioBaseDir, { recursive: true });
        }
        
        // Clean up any existing test scenarios (but keep directory)
        const files = fs.readdirSync(scenarioBaseDir).filter(f => f.endsWith('.scenario.json'));
        for (const file of files) {
            const filePath = path.join(scenarioBaseDir, file);
            if (fs.lstatSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            }
        }
        
        // Clean up capability symlinks (tests will recreate them)
        const capabilityDir = path.join(scenarioBaseDir, 'capability');
        if (fs.existsSync(capabilityDir)) {
            const httpPortDir = path.join(capabilityDir, 'httpPort');
            if (fs.existsSync(httpPortDir)) {
                const ports = fs.readdirSync(httpPortDir);
                for (const port of ports) {
                    const portDir = path.join(httpPortDir, port);
                    if (fs.existsSync(portDir) && fs.lstatSync(portDir).isDirectory()) {
                        const symlinks = fs.readdirSync(portDir);
                        for (const symlink of symlinks) {
                            fs.unlinkSync(path.join(portDir, symlink));
                        }
                        // Remove empty port directory
                        if (fs.readdirSync(portDir).length === 0) {
                            fs.rmdirSync(portDir);
                        }
                    }
                }
            }
        }
    });
    
    afterEach(async () => {
        // Clean up test scenarios (ONLY delete files, NOT directories!)
        // CRITICAL: Never delete scenario directories - other components may store data there
        if (fs.existsSync(scenarioBaseDir)) {
            // Delete all .scenario.json files in main directory
            const files = fs.readdirSync(scenarioBaseDir).filter(f => f.endsWith('.scenario.json'));
            for (const file of files) {
                const filePath = path.join(scenarioBaseDir, file);
                if (fs.lstatSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            }
            
            // Clean up capability symlinks
            const capabilityDir = path.join(scenarioBaseDir, 'capability');
            if (fs.existsSync(capabilityDir)) {
                const httpPortDir = path.join(capabilityDir, 'httpPort');
                if (fs.existsSync(httpPortDir)) {
                    const ports = fs.readdirSync(httpPortDir);
                    for (const port of ports) {
                        const portDir = path.join(httpPortDir, port);
                        if (fs.existsSync(portDir) && fs.lstatSync(portDir).isDirectory()) {
                            const symlinks = fs.readdirSync(portDir);
                            for (const symlink of symlinks) {
                                fs.unlinkSync(path.join(portDir, symlink));
                            }
                            // Remove empty port directory
                            if (fs.readdirSync(portDir).length === 0) {
                                fs.rmdirSync(portDir);
                            }
                        }
                    }
                }
            }
        }
    });
    
    describe('Housekeeping at Startup', () => {
        it('should delete shutdown server scenarios on primary startup', async () => {
            const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
            
            // Create a shutdown scenario (main location + symlink)
            const shutdownScenario = {
                uuid: 'test-shutdown-server',
                objectType: 'ONCE',
                version: componentVersion,
                state: {
                    state: 'shutdown',
                    capabilities: [{ capability: 'httpPort', port: 8080 }]
                }
            };
            
            // Write to main location
            const mainPath = `${scenarioBaseDir}/test-shutdown-server.scenario.json`;
            fs.writeFileSync(mainPath, JSON.stringify(shutdownScenario, null, 2));
            
            // Create symlink
            const shutdownScenarioDir = `${scenarioBaseDir}/capability/httpPort/8080`;
            fs.mkdirSync(shutdownScenarioDir, { recursive: true });
            const symlinkPath = `${shutdownScenarioDir}/test-shutdown-server.scenario.json`;
            fs.symlinkSync(path.relative(shutdownScenarioDir, mainPath), symlinkPath);
            
            // Verify both exist
            expect(fs.existsSync(mainPath)).toBe(true);
            expect(fs.lstatSync(symlinkPath).isSymbolicLink()).toBe(true);
            
            // Start primary server (triggers housekeeping)
            const primaryServer = new DefaultONCE();
            await primaryServer.init();
            await primaryServer.startServer();
            
            // Wait for housekeeping to complete
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verify shutdown scenario and symlink were deleted
            expect(fs.existsSync(mainPath)).toBe(false);
            expect(fs.existsSync(symlinkPath)).toBe(false);
            
            // Cleanup
            await primaryServer.stopServer();
        }, 15000);
        
        it('should discover and keep running client server scenarios', async () => {
            const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
            
            // Start PRIMARY server first to claim port 42777
            const primaryServer = new DefaultONCE();
            await primaryServer.init();
            await primaryServer.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Now start a client server (will get port 8080)
            const clientServer = new DefaultONCE();
            await clientServer.init();
            await clientServer.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get the client's scenario path
            const clientModel = clientServer.getServerModel();
            const clientPort = clientModel.capabilities.find(c => c.capability === 'httpPort')?.port;
            const clientScenarioPath = `${scenarioBaseDir}/capability/httpPort/${clientPort}/${clientModel.uuid}.scenario.json`;
            
            // Verify client scenario exists
            expect(fs.existsSync(clientScenarioPath)).toBe(true);
            expect(clientPort).not.toBe(42777); // Should be client, not primary
            
            // Stop client but keep scenario as "running" (simulating crash)
            await clientServer.stopServer();
            
            // Manually set scenario back to running state (simulate unclean shutdown)
            const scenarioData = JSON.parse(fs.readFileSync(clientScenarioPath, 'utf8'));
            scenarioData.state.state = 'running';
            fs.writeFileSync(clientScenarioPath, JSON.stringify(scenarioData, null, 2));
            
            // Scenario should be deleted by housekeeping since server is not reachable
            // We'll restart primary to trigger housekeeping again
            await primaryServer.stopServer();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const primaryServer2 = new DefaultONCE();
            await primaryServer2.init();
            await primaryServer2.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Scenario should be deleted because server is not reachable
            expect(fs.existsSync(clientScenarioPath)).toBe(false);
            
            // Cleanup
            await primaryServer2.stopServer();
        }, 25000);
    });
    
    describe('Graceful Shutdown', () => {
        it('should update scenario state to STOPPING then SHUTDOWN', async () => {
            const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
            
            // Start server
            const server = new DefaultONCE();
            await server.init();
            await server.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get scenario path
            const serverModel = server.getServerModel();
            const port = serverModel.capabilities.find(c => c.capability === 'httpPort')?.port;
            const scenarioPath = `${scenarioBaseDir}/capability/httpPort/${port}/${serverModel.uuid}.scenario.json`;
            
            // Verify scenario exists with RUNNING state
            expect(fs.existsSync(scenarioPath)).toBe(true);
            const runningScenario = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
            expect(runningScenario.state.state).toBe('running');
            
            // Stop server (triggers graceful shutdown)
            await server.stopServer();
            
            // Verify scenario was updated to SHUTDOWN state
            expect(fs.existsSync(scenarioPath)).toBe(true);
            const shutdownScenario = JSON.parse(fs.readFileSync(scenarioPath, 'utf8'));
            expect(shutdownScenario.state.state).toBe('shutdown');
        }, 10000);
    });
    
    describe('Dynamic Server Addition', () => {
        it('should register new client server dynamically', async () => {
            const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
            
            // Start primary server
            const primaryServer = new DefaultONCE();
            await primaryServer.init();
            await primaryServer.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify no clients initially
            const initialServers = primaryServer.getRegisteredServers();
            expect(initialServers.length).toBe(0);
            
            // Start first client server
            const client1 = new DefaultONCE();
            await client1.init();
            await client1.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify client registered
            const afterClient1 = primaryServer.getRegisteredServers();
            expect(afterClient1.length).toBe(1);
            
            // Start second client server dynamically
            const client2 = new DefaultONCE();
            await client2.init();
            await client2.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify second client registered
            const afterClient2 = primaryServer.getRegisteredServers();
            expect(afterClient2.length).toBe(2);
            
            // Verify both clients have different ports
            const ports = afterClient2.map(s => 
                s.capabilities.find(c => c.capability === 'httpPort')?.port
            );
            expect(new Set(ports).size).toBe(2);
            
            // Cleanup
            await client2.stopServer();
            await client1.stopServer();
            await primaryServer.stopServer();
        }, 20000);
        
        it('should handle client disconnect and cleanup', async () => {
            const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
            
            // Start primary and client
            const primaryServer = new DefaultONCE();
            await primaryServer.init();
            await primaryServer.startServer();
            
            const clientServer = new DefaultONCE();
            await clientServer.init();
            await clientServer.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verify client registered
            expect(primaryServer.getRegisteredServers().length).toBe(1);
            
            // Get client scenario path
            const clientModel = clientServer.getServerModel();
            const clientPort = clientModel.capabilities.find(c => c.capability === 'httpPort')?.port;
            const clientScenarioPath = `${scenarioBaseDir}/capability/httpPort/${clientPort}/${clientModel.uuid}.scenario.json`;
            
            // Stop client (triggers graceful shutdown)
            await clientServer.stopServer();
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verify scenario shows shutdown state
            expect(fs.existsSync(clientScenarioPath)).toBe(true);
            const scenario = JSON.parse(fs.readFileSync(clientScenarioPath, 'utf8'));
            expect(scenario.state.state).toBe('shutdown');
            
            // Cleanup
            await primaryServer.stopServer();
        }, 15000);
    });
    
    describe('Scenario Persistence', () => {
        it('should persist server state across restarts', async () => {
            const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
            
            // Start server
            const server1 = new DefaultONCE();
            await server1.init();
            await server1.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const serverModel1 = server1.getServerModel();
            const port = serverModel1.capabilities.find(c => c.capability === 'httpPort')?.port;
            const uuid = serverModel1.uuid;
            
            // Stop server gracefully
            await server1.stopServer();
            
            // Verify shutdown scenario exists
            const scenarioPath = `${scenarioBaseDir}/capability/httpPort/${port}/${uuid}.scenario.json`;
            expect(fs.existsSync(scenarioPath)).toBe(true);
            
            // Start new server instance (different UUID)
            const server2 = new DefaultONCE();
            await server2.init();
            await server2.startServer();
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Original shutdown scenario should be cleaned up by housekeeping
            expect(fs.existsSync(scenarioPath)).toBe(false);
            
            // Cleanup
            await server2.stopServer();
        }, 15000);
    });
    
    describe('Primary Server Crash Recovery', () => {
        it('should restart primary and rediscover running clients after crash', async () => {
            // Multi-process architecture: servers run as separate OS processes
            // This allows us to kill the primary without killing the test process
            
            const spawnedProcesses: ChildProcess[] = [];
            
            try {
                console.log('🚀 Starting primary server as separate process...');
                const primary = await spawnServer(true);
                spawnedProcesses.push(primary.process);
                
                // Wait for primary to be healthy
                const primaryHealthy = await waitFor(
                    () => checkServerHealth(42777),
                    15000,
                    1000
                );
                expect(primaryHealthy).toBe(true);
                console.log('✅ Primary server running on port 42777');
                
                // Start 2 client servers as separate processes
                console.log('🚀 Starting client servers as separate processes...');
                const client1 = await spawnServer(false);
                spawnedProcesses.push(client1.process);
                
                // Small delay between spawns to avoid port conflicts
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const client2 = await spawnServer(false);
                spawnedProcesses.push(client2.process);
                
                // Wait for clients to be healthy
                await new Promise(resolve => setTimeout(resolve, 2000));
                const client1Healthy = await checkServerHealth(client1.port);
                const client2Healthy = await checkServerHealth(client2.port);
                expect(client1Healthy).toBe(true);
                expect(client2Healthy).toBe(true);
                console.log(`✅ Client servers running on ports ${client1.port}, ${client2.port}`);
                
                // Verify client scenarios exist in filesystem
                // Note: Spawned servers run as separate processes and detect their own domain
                // They will use the detected domain and hostname from the system
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Find scenario directory dynamically - it will be under the detected domain/hostname
                const scenariosRoot = path.join(testProjectRoot, 'scenarios');
                
                // Recursively find all scenario files for this version
                const findScenarios = (dir: string): string[] => {
                    let files: string[] = [];
                    if (!fs.existsSync(dir)) return files;
                    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                        const fullPath = path.join(dir, entry.name);
                        if (entry.isDirectory()) {
                            files = files.concat(findScenarios(fullPath));
                        } else if (entry.name.endsWith('.scenario.json') && !fullPath.includes('capability')) {
                            // Only count files in the correct version
                            if (fullPath.includes(`ONCE/${componentVersion}/`)) {
                                files.push(fullPath);
                            }
                        }
                    }
                    return files;
                };
                
                const scenarioFiles = findScenarios(scenariosRoot);
                console.log(`📂 Found ${scenarioFiles.length} scenario files in ${scenariosRoot}`);
                expect(scenarioFiles.length).toBeGreaterThanOrEqual(2); // At least 2 clients
                
                // 💥 SIMULATE CRASH: Kill primary server process forcefully
                console.log(`💥 Simulating crash: killing primary server PID ${primary.process.pid}`);
                primary.process.kill('SIGKILL');
                
                // Wait for kill to take effect
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Verify primary is dead
                const primaryDead = !(await checkServerHealth(42777));
                expect(primaryDead).toBe(true);
                console.log('✅ Primary server killed');
                
                // Verify clients are still running
                const client1StillAlive = await checkServerHealth(client1.port);
                const client2StillAlive = await checkServerHealth(client2.port);
                expect(client1StillAlive).toBe(true);
                expect(client2StillAlive).toBe(true);
                console.log('✅ Client servers still running after primary crash');
                
                // ♻️  RESTART: Start new primary server
                console.log('♻️  Restarting primary server...');
                const newPrimary = await spawnServer(true);
                spawnedProcesses.push(newPrimary.process);
                
                // Wait for new primary to be healthy
                const newPrimaryHealthy = await waitFor(
                    () => checkServerHealth(42777),
                    15000,
                    1000
                );
                expect(newPrimaryHealthy).toBe(true);
                console.log('✅ New primary server running');
                
                // Wait for housekeeping to discover existing clients
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Verify client scenarios still exist (in spawned server's domain directory)
                const scenarioFilesAfter = findScenarios(scenariosRoot);
                expect(scenarioFilesAfter.length).toBeGreaterThanOrEqual(2);
                console.log(`✅ Client scenarios persisted: ${scenarioFilesAfter.length} files`);
                
                // Verify clients are still healthy
                const client1FinalCheck = await checkServerHealth(client1.port);
                const client2FinalCheck = await checkServerHealth(client2.port);
                expect(client1FinalCheck).toBe(true);
                expect(client2FinalCheck).toBe(true);
                console.log('✅ Clients remain healthy after primary restart');
                
                console.log('✅ Crash recovery test completed successfully');
            } finally {
                // Cleanup: kill all spawned processes
                console.log('🧹 Cleaning up spawned processes...');
                for (const proc of spawnedProcesses) {
                    try {
                        if (!proc.killed) {
                            proc.kill('SIGTERM');
                        }
                    } catch (error) {
                        // Process might already be dead
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }, 30000);
    });
});

