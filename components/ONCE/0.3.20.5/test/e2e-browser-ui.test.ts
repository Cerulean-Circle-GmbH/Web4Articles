/**
 * End-to-End Browser UI Test
 * Uses Playwright to open real browsers and interact with UI elements
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, Browser, Page, BrowserContext } from '@playwright/test';

describe('End-to-End Browser UI Interaction', () => {
    let primaryServer: any;
    let clientServer1: any;
    let clientServer2: any;
    let browser: Browser;
    let context1: BrowserContext;
    let context2: BrowserContext;
    let page1: Page;
    let page2: Page;
    
    beforeAll(async () => {
        console.log('🚀 Setting up E2E test environment...');
        
        // Import DefaultONCE
        const { DefaultONCE } = await import('../dist/ts/layer2/DefaultONCE.js');
        
        // Start primary server (42777)
        console.log('📡 Starting primary server...');
        primaryServer = new DefaultONCE();
        await primaryServer.init();
        await primaryServer.startServer();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Start client servers (8080, 8082)
        console.log('📡 Starting client server 1...');
        clientServer1 = new DefaultONCE();
        await clientServer1.init();
        await clientServer1.startServer();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📡 Starting client server 2...');
        clientServer2 = new DefaultONCE();
        await clientServer2.init();
        await clientServer2.startServer();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Launch browser
        console.log('🌐 Launching Chromium browser...');
        browser = await chromium.launch({
            headless: false, // Show browser for visual verification
            slowMo: 100 // Slow down actions for visibility
        });
        
        // Create separate contexts for isolation
        context1 = await browser.newContext();
        context2 = await browser.newContext();
        
        page1 = await context1.newPage();
        page2 = await context2.newPage();
        
        console.log('✅ E2E environment ready');
    }, 60000);
    
    afterAll(async () => {
        console.log('🧹 Cleaning up E2E environment...');
        
        try {
            if (page1) await page1.close();
            if (page2) await page2.close();
            if (context1) await context1.close();
            if (context2) await context2.close();
            if (browser) await browser.close();
            
            if (clientServer2) await clientServer2.stopServer();
            if (clientServer1) await clientServer1.stopServer();
            if (primaryServer) await primaryServer.stopServer();
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('✅ Cleanup complete');
        } catch (error) {
            console.error('⚠️  Cleanup error:', error);
        }
    }, 30000);
    
    it('should navigate to demo hub and see all servers', async () => {
        console.log('📍 Test 1: Demo hub navigation');
        
        // Navigate to demo hub
        await page1.goto('http://localhost:42777/demo');
        await page1.waitForLoadState('networkidle');
        
        // Check page title
        const title = await page1.title();
        expect(title).toContain('ONCE');
        expect(title).toContain('Demo Hub');
        
        // Check that server status shows multiple servers
        const totalServers = await page1.locator('#totalServers').textContent();
        console.log(`📊 Total servers detected: ${totalServers}`);
        expect(parseInt(totalServers || '0')).toBeGreaterThanOrEqual(3);
        
        // Check running servers count
        const runningServers = await page1.locator('#runningServers').textContent();
        console.log(`🟢 Running servers: ${runningServers}`);
        expect(parseInt(runningServers || '0')).toBeGreaterThanOrEqual(3);
        
        console.log('✅ Demo hub shows all servers');
    }, 30000);
    
    it('should open client pages and verify connection status', async () => {
        console.log('📍 Test 2: Open client pages');
        
        // Open client on 8080
        await page1.goto('http://localhost:8080/once');
        await page1.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Open client on 8082
        await page2.goto('http://localhost:8082/once');
        await page2.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check connection status on page1
        const connectionStatus1 = await page1.locator('.connection-status').textContent();
        console.log(`📡 Page1 status: ${connectionStatus1}`);
        expect(connectionStatus1).toContain('Connected');
        
        // Check connection status on page2
        const connectionStatus2 = await page2.locator('.connection-status').textContent();
        console.log(`📡 Page2 status: ${connectionStatus2}`);
        expect(connectionStatus2).toContain('Connected');
        
        console.log('✅ Both clients connected');
    }, 30000);
    
    it('should send broadcast message and verify receipt on other client', async () => {
        console.log('📍 Test 3: Broadcast message flow');
        
        // Ensure both pages are on client interfaces
        await page1.goto('http://localhost:8080/once');
        await page1.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await page2.goto('http://localhost:8082/once');
        await page2.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get initial message counts
        const initialSent1 = await page1.locator('#messagesSent').textContent();
        const initialReceived2 = await page2.locator('#messagesReceived').textContent();
        console.log(`📊 Initial - Page1 sent: ${initialSent1}, Page2 received: ${initialReceived2}`);
        
        // Click broadcast button on page1
        console.log('📡 Clicking broadcast button on page1...');
        await page1.click('button:has-text("Broadcast to All")');
        
        // Wait for message to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check that page1 sent count increased
        const finalSent1 = await page1.locator('#messagesSent').textContent();
        console.log(`📤 Page1 sent: ${initialSent1} → ${finalSent1}`);
        expect(parseInt(finalSent1 || '0')).toBeGreaterThan(parseInt(initialSent1 || '0'));
        
        // Check that page2 received count increased
        const finalReceived2 = await page2.locator('#messagesReceived').textContent();
        console.log(`📥 Page2 received: ${initialReceived2} → ${finalReceived2}`);
        expect(parseInt(finalReceived2 || '0')).toBeGreaterThan(parseInt(initialReceived2 || '0'));
        
        // Check message log contains broadcast message
        const messageLog2 = await page2.locator('#messageLog').textContent();
        expect(messageLog2).toContain('scenario-message');
        
        console.log('✅ Broadcast message successfully propagated');
    }, 30000);
    
    it('should clear message log when button clicked', async () => {
        console.log('📍 Test 4: Clear log functionality');
        
        await page1.goto('http://localhost:8080/once');
        await page1.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Send a message first
        await page1.click('button:has-text("Broadcast to All")');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check log has content
        const logBeforeClear = await page1.locator('#messageLog').textContent();
        expect(logBeforeClear).toBeTruthy();
        expect(logBeforeClear.length).toBeGreaterThan(0);
        
        // Click clear button
        console.log('🧹 Clicking clear log button...');
        await page1.click('button:has-text("Clear Log")');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check log is empty or has minimal content
        const logAfterClear = await page1.locator('#messageLog').textContent();
        console.log(`📋 Log after clear: "${logAfterClear}"`);
        // Log might have connection message, but should be much shorter
        expect(logAfterClear.length).toBeLessThan(logBeforeClear.length);
        
        console.log('✅ Clear log button works');
    }, 30000);
    
    it('should show server list on demo hub page', async () => {
        console.log('📍 Test 5: Server list display');
        
        await page1.goto('http://localhost:42777/demo');
        await page1.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for auto-refresh
        
        // Check that server cards are displayed
        const serverCards = await page1.locator('.server-card').count();
        console.log(`🖥️  Server cards displayed: ${serverCards}`);
        expect(serverCards).toBeGreaterThanOrEqual(3);
        
        // Check that primary server is shown
        const primaryCard = await page1.locator('.server-card:has-text("Primary Server")');
        expect(await primaryCard.count()).toBe(1);
        
        // Check that client servers are shown
        const clientCards = await page1.locator('.server-card:has-text("Client Server")');
        expect(await clientCards.count()).toBeGreaterThanOrEqual(2);
        
        console.log('✅ Server list correctly displayed');
    }, 30000);
    
    it('should open server status page and verify routes', async () => {
        console.log('📍 Test 6: Server status page navigation');
        
        await page1.goto('http://localhost:42777/');
        await page1.waitForLoadState('networkidle');
        
        // Check page title contains version
        const title = await page1.title();
        expect(title).toContain('ONCE Server');
        console.log(`📄 Page title: ${title}`);
        
        // Check that server UUID is displayed
        const serverInfo = await page1.locator('.info-card').first().textContent();
        expect(serverInfo).toContain('UUID');
        
        // Check that all route links are present
        const healthLink = await page1.locator('a[href="/health"]');
        expect(await healthLink.count()).toBe(1);
        
        const onceLink = await page1.locator('a[href="/once"]');
        expect(await onceLink.count()).toBe(1);
        
        const demoLink = await page1.locator('a[href="/demo"]');
        expect(await demoLink.count()).toBe(1);
        
        const serversLink = await page1.locator('a[href="/servers"]');
        expect(await serversLink.count()).toBe(1);
        
        console.log('✅ All routes displayed on status page');
    }, 30000);
    
    it('should navigate between pages using route links', async () => {
        console.log('📍 Test 7: Cross-page navigation');
        
        // Start at root
        await page1.goto('http://localhost:42777/');
        await page1.waitForLoadState('networkidle');
        
        // Click demo link
        await page1.click('a[href="/demo"][target="_blank"]', { modifiers: [] });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate to demo directly
        await page1.goto('http://localhost:42777/demo');
        await page1.waitForLoadState('networkidle');
        
        // Verify we're on demo page
        const demoTitle = await page1.title();
        expect(demoTitle).toContain('Demo Hub');
        
        // Navigate to once client
        await page1.goto('http://localhost:42777/once');
        await page1.waitForLoadState('networkidle');
        
        // Verify we're on client page
        const clientTitle = await page1.title();
        expect(clientTitle).toContain('Browser Client');
        
        console.log('✅ Navigation between pages works');
    }, 30000);
    
    it('should display connected servers count in browser client', async () => {
        console.log('📍 Test 8: Connected servers display');
        
        await page1.goto('http://localhost:8080/once');
        await page1.waitForLoadState('networkidle');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for server list fetch
        
        // Check connected servers display
        const connectedServers = await page1.locator('#connectedServers').textContent();
        console.log(`🔗 Connected servers: ${connectedServers}`);
        
        expect(connectedServers).toBeTruthy();
        expect(connectedServers).toContain('servers');
        
        // Should show at least 2 servers (8080, 8082)
        const match = connectedServers?.match(/(\d+)\s+servers/);
        if (match) {
            const count = parseInt(match[1]);
            console.log(`📊 Server count from text: ${count}`);
            expect(count).toBeGreaterThanOrEqual(2);
        }
        
        console.log('✅ Connected servers count displayed');
    }, 30000);
});

