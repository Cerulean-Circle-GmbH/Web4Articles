/**
 * Test: Server Initialization - Domain and Hostname Detection
 * 
 * PURPOSE: Verify that ServerHierarchyManager correctly detects and sets
 * domain, hostname, host (FQDN), and IP address during construction.
 * 
 * CONTEXT: Bug investigation - scenarios are being saved to wrong paths
 * with fallback values instead of actual detected hostname/domain.
 * 
 * @pdca 2025-11-18-UTC-1100.pdca.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import os from 'os';

describe('Server Initialization - Domain and Hostname Detection', () => {
    let serverInstance: any;

    afterEach(async () => {
        if (serverInstance) {
            await serverInstance.stopServer?.();
            serverInstance = null;
        }
    });

    describe('Constructor - Domain Detection', () => {
        it('should detect actual hostname from os.hostname() not fallback to localhost', async () => {
            // GIVEN: Operating system has a hostname configured
            const actualHostname = os.hostname();
            console.log(`Test environment hostname: "${actualHostname}"`);

            // WHEN: ServerHierarchyManager is constructed
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // THEN: Server model should use actual hostname, not "localhost"
            expect(manager.serverModel.host).toBe(actualHostname);
            expect(manager.serverModel.host).not.toBe('localhost');
            
            console.log(`✅ Detected host: ${manager.serverModel.host}`);
        });

        it('should extract domain correctly from FQDN', async () => {
            // GIVEN: System hostname is an FQDN (e.g., "McDonges-3.fritz.box")
            const actualHostname = os.hostname();
            
            // WHEN: ServerHierarchyManager is constructed
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // THEN: Domain should be extracted correctly
            if (actualHostname.includes('.')) {
                // For FQDN like "McDonges-3.fritz.box"
                const parts = actualHostname.split('.');
                const expectedDomain = parts.slice(1).reverse().join('.');
                
                expect(manager.serverModel.domain).toBe(expectedDomain);
                expect(manager.serverModel.domain).not.toBe('local.once');
                
                console.log(`✅ FQDN: ${actualHostname}`);
                console.log(`✅ Detected domain: ${manager.serverModel.domain}`);
                console.log(`✅ Expected domain: ${expectedDomain}`);
            } else {
                // For simple hostname without dots
                expect(manager.serverModel.domain).toBe(`local.${actualHostname}`);
                console.log(`✅ Simple hostname: ${actualHostname}`);
                console.log(`✅ Detected domain: ${manager.serverModel.domain}`);
            }
        });

        it('should extract short hostname from FQDN', async () => {
            // GIVEN: System hostname may be FQDN
            const actualHostname = os.hostname();
            
            // WHEN: ServerHierarchyManager is constructed
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // THEN: hostname field should be short form (first part only)
            if (actualHostname.includes('.')) {
                const expectedShortHostname = actualHostname.split('.')[0];
                expect(manager.serverModel.hostname).toBe(expectedShortHostname);
                
                console.log(`✅ FQDN: ${actualHostname}`);
                console.log(`✅ Short hostname: ${manager.serverModel.hostname}`);
            } else {
                expect(manager.serverModel.hostname).toBe(actualHostname);
                console.log(`✅ Hostname: ${manager.serverModel.hostname}`);
            }
        });

        it('should detect actual IP address not 127.0.0.1 for networked systems', async () => {
            // GIVEN: System may have network interfaces
            const networkInterfaces = os.networkInterfaces();
            const hasNetworkInterface = Object.values(networkInterfaces).some(iface =>
                iface?.some(addr => !addr.internal && addr.family === 'IPv4')
            );

            // WHEN: ServerHierarchyManager is constructed
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // THEN: IP should be detected (may be 127.0.0.1 if no network interfaces)
            if (hasNetworkInterface) {
                expect(manager.serverModel.ip).not.toBe('127.0.0.1');
                console.log(`✅ Network IP detected: ${manager.serverModel.ip}`);
            } else {
                expect(manager.serverModel.ip).toBe('127.0.0.1');
                console.log(`⚠️  No network interfaces, using loopback: ${manager.serverModel.ip}`);
            }
        });

        it('should set all required fields in server model', async () => {
            // WHEN: ServerHierarchyManager is constructed
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // THEN: All fields should be set (not null/undefined)
            expect(manager.serverModel.uuid).toBeDefined();
            expect(manager.serverModel.pid).toBe(process.pid);
            expect(manager.serverModel.domain).toBeDefined();
            expect(manager.serverModel.domain).not.toBe('');
            expect(manager.serverModel.hostname).toBeDefined();
            expect(manager.serverModel.hostname).not.toBe('');
            expect(manager.serverModel.host).toBeDefined();
            expect(manager.serverModel.host).not.toBe('');
            expect(manager.serverModel.ip).toBeDefined();
            expect(manager.serverModel.ip).not.toBe('');
            
            console.log('✅ All server model fields populated:');
            console.log(`   UUID: ${manager.serverModel.uuid}`);
            console.log(`   Domain: ${manager.serverModel.domain}`);
            console.log(`   Hostname: ${manager.serverModel.hostname}`);
            console.log(`   Host (FQDN): ${manager.serverModel.host}`);
            console.log(`   IP: ${manager.serverModel.ip}`);
        });
    });

    describe('Scenario Path Construction', () => {
        it('should construct hierarchical path based on detected domain/hostname', async () => {
            // GIVEN: ServerHierarchyManager with detected domain/hostname
            const actualHostname = os.hostname();
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // WHEN: Server starts and saves scenario
            await manager.startServer();
            serverInstance = manager;

            // THEN: Scenario should be in hierarchical path
            // For "McDonges-3.fritz.box" -> scenarios/box/fritz/McDonges-3/ONCE/0.3.20.5/
            // For "localhost" -> scenarios/local/once/localhost/ONCE/0.3.20.5/
            const fs = await import('fs');
            const path = await import('path');
            
            // Get project root
            const projectRoot = process.cwd();
            
            // Expected path structure
            let expectedPathParts: string[];
            if (actualHostname.includes('.')) {
                const parts = actualHostname.split('.');
                const hostname = parts[0];
                const domainParts = parts.slice(1).reverse();
                expectedPathParts = ['scenarios', ...domainParts, hostname, 'ONCE'];
            } else if (actualHostname === 'localhost') {
                expectedPathParts = ['scenarios', 'local', 'once', 'localhost', 'ONCE'];
            } else {
                expectedPathParts = ['scenarios', 'local', actualHostname, 'ONCE'];
            }
            
            const expectedBasePath = path.join(projectRoot, ...expectedPathParts);
            
            console.log(`Expected scenario base path: ${expectedBasePath}`);
            console.log(`Checking if directory exists...`);
            
            // Wait a bit for scenario to be saved
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if directory exists
            const exists = fs.existsSync(expectedBasePath);
            expect(exists).toBe(true);
            
            console.log(`✅ Hierarchical path created: ${expectedBasePath}`);
            
            // Verify NO scenarios in old flat structure
            const oldFlatPath = path.join(projectRoot, 'scenarios', 'local.once', 'ONCE');
            if (fs.existsSync(oldFlatPath)) {
                console.log(`⚠️  Old flat path still exists: ${oldFlatPath}`);
                console.log(`   This should be cleaned up by housekeeping`);
            } else {
                console.log(`✅ Old flat path does not exist (good)`);
            }
        });

        it('should save scenario file with correct domain/hostname metadata', async () => {
            // GIVEN: ServerHierarchyManager with detected domain/hostname
            const actualHostname = os.hostname();
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // WHEN: Server starts and saves scenario
            await manager.startServer();
            serverInstance = manager;

            // Wait for scenario to be saved
            await new Promise(resolve => setTimeout(resolve, 1000));

            // THEN: Find the scenario file
            const fs = await import('fs');
            const path = await import('path');
            const glob = await import('glob');
            
            const projectRoot = process.cwd();
            const scenarioPattern = path.join(projectRoot, 'scenarios', '**', `${manager.serverModel.uuid}.scenario.json`);
            const scenarioFiles = glob.sync(scenarioPattern);
            
            expect(scenarioFiles.length).toBeGreaterThan(0);
            
            const scenarioFile = scenarioFiles[0];
            console.log(`Found scenario file: ${scenarioFile}`);
            
            // Read scenario content
            const scenarioContent = JSON.parse(fs.readFileSync(scenarioFile, 'utf-8'));
            
            // Verify metadata has correct values (not fallbacks)
            expect(scenarioContent.metadata.domain).toBe(manager.serverModel.domain);
            expect(scenarioContent.metadata.host).toBe(manager.serverModel.host);
            
            // State should also have correct values
            expect(scenarioContent.state.domain).toBe(manager.serverModel.domain);
            expect(scenarioContent.state.host).toBe(manager.serverModel.host);
            expect(scenarioContent.state.ip).toBe(manager.serverModel.ip);
            
            // If FQDN, verify it's not using fallbacks
            if (actualHostname.includes('.') && actualHostname !== 'localhost') {
                expect(scenarioContent.metadata.domain).not.toBe('local.once');
                expect(scenarioContent.metadata.host).not.toBe('localhost');
                expect(scenarioContent.state.ip).not.toBe('127.0.0.1');
            }
            
            console.log('✅ Scenario metadata:');
            console.log(`   domain: ${scenarioContent.metadata.domain}`);
            console.log(`   host: ${scenarioContent.metadata.host}`);
            console.log(`   state.ip: ${scenarioContent.state.ip}`);
        });
    });

    describe('Regression Tests - Bug Verification', () => {
        it('should NOT save scenarios to old flat path (local.once/ONCE/)', async () => {
            // GIVEN: ServerHierarchyManager on system with FQDN
            const actualHostname = os.hostname();
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // WHEN: Server starts
            await manager.startServer();
            serverInstance = manager;
            
            await new Promise(resolve => setTimeout(resolve, 1000));

            // THEN: Scenario should NOT be in old flat path
            const fs = await import('fs');
            const path = await import('path');
            const projectRoot = process.cwd();
            
            const oldFlatPath = path.join(
                projectRoot,
                'scenarios',
                'local.once',
                'ONCE',
                manager.component.version,
                `${manager.serverModel.uuid}.scenario.json`
            );
            
            const existsInOldPath = fs.existsSync(oldFlatPath);
            expect(existsInOldPath).toBe(false);
            
            if (existsInOldPath) {
                console.log(`❌ REGRESSION: Scenario saved to old flat path: ${oldFlatPath}`);
            } else {
                console.log(`✅ Scenario NOT in old flat path (correct)`);
            }
        });

        it('should NOT use localhost fallback when system has FQDN', async () => {
            // GIVEN: System with FQDN hostname
            const actualHostname = os.hostname();
            
            if (!actualHostname.includes('.') || actualHostname === 'localhost') {
                console.log('⏭️  Skipping: System does not have FQDN');
                return;
            }

            // WHEN: ServerHierarchyManager is constructed
            const { ServerHierarchyManager } = await import('../src/ts/layer2/ServerHierarchyManager.js');
            const manager = new ServerHierarchyManager();

            // THEN: Should NOT use fallback values
            expect(manager.serverModel.domain).not.toBe('local.once');
            expect(manager.serverModel.host).not.toBe('localhost');
            expect(manager.serverModel.hostname).not.toBe('localhost');
            
            console.log('✅ Not using fallback values:');
            console.log(`   domain: ${manager.serverModel.domain} (not "local.once")`);
            console.log(`   host: ${manager.serverModel.host} (not "localhost")`);
            console.log(`   hostname: ${manager.serverModel.hostname} (not "localhost")`);
        });
    });
});

/**
 * EXPECTED BEHAVIOR FOR THIS TEST ENVIRONMENT:
 * 
 * System hostname: McDonges-3.fritz.box
 * 
 * Constructor should detect:
 * - host (FQDN): "McDonges-3.fritz.box"
 * - domain: "box.fritz"
 * - hostname: "McDonges-3"
 * - ip: "192.168.178.43" (or actual network IP)
 * 
 * Scenario should be saved to:
 * - scenarios/box/fritz/McDonges-3/ONCE/0.3.20.5/{uuid}.scenario.json
 * 
 * Scenario should NOT be saved to:
 * - scenarios/local.once/ONCE/0.3.20.5/{uuid}.scenario.json
 * 
 * Scenario metadata should contain:
 * - domain: "box.fritz"
 * - host: "McDonges-3.fritz.box"
 * - NOT: domain: "local.once", host: "localhost"
 */

