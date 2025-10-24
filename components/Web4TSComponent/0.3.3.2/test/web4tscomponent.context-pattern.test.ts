/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../LICENSE) and AI-GPL Addendum (../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultWeb4TSComponent } from '../src/ts/layer2/DefaultWeb4TSComponent.js';
import { ProjectRootMocker } from './utils/ProjectRootMocker.js';
import { existsSync, rmSync } from 'fs';
import * as fs from 'fs/promises';
import path from 'path';

/**
 * Helper function to clean up test data content (not the directory itself)
 */
async function cleanupTestDataContent(testDataDir: string) {
  try {
    if (existsSync(testDataDir)) {
      const entries = await fs.readdir(testDataDir);
      for (const entry of entries) {
        const entryPath = path.join(testDataDir, entry);
        await fs.rm(entryPath, { recursive: true, force: true });
      }
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}

describe('🔄 Web4TSComponent Context Pattern Tests', () => {
    const testDataDir = path.join(process.cwd(), 'test', 'data');
    let mockProjectRoot: ProjectRootMocker;
    let web4ts: DefaultWeb4TSComponent;

    beforeEach(async () => {
        // Clean test data CONTENT (not the directory itself)
        await cleanupTestDataContent(testDataDir);
        
        // Set up isolated test environment
        mockProjectRoot = new ProjectRootMocker(testDataDir);
        web4ts = new DefaultWeb4TSComponent();
        
        // Initialize project with root configs (DRY principle)
        await web4ts.initProject();
    });

    afterEach(async () => {
        // Clean up test data CONTENT (preserve directory)
        await cleanupTestDataContent(testDataDir);
    });

    describe('🔧 Lifecycle Methods WITHOUT Context (Self-Operation)', () => {
        it('should run build WITHOUT context (builds Web4TSComponent itself)', async () => {
            // No context loaded - should build Web4TSComponent itself
            let buildOutput = '';
            const originalLog = console.log;
            console.log = (msg: string) => { buildOutput += msg + '\n'; };
            
            try {
                await web4ts.build();
                
                // Should mention building Web4TSComponent itself
                expect(buildOutput).toContain('Building Web4TSComponent itself');
                expect(buildOutput).toContain('Web4TSComponent build completed successfully');
                
                console.log('✅ Build WITHOUT context works: builds Web4TSComponent itself');
            } finally {
                console.log = originalLog;
            }
        });

        it('should run test WITHOUT context (tests Web4TSComponent itself)', async () => {
            // No context loaded - should test Web4TSComponent itself
            let testOutput = '';
            const originalLog = console.log;
            console.log = (msg: string) => { testOutput += msg + '\n'; };
            
            try {
                await web4ts.test();
                
                // Should mention testing Web4TSComponent internal tests
                expect(testOutput).toContain('Running Web4TSComponent internal tests');
                expect(testOutput).toContain('Web4TSComponent internal tests completed successfully');
                
                console.log('✅ Test WITHOUT context works: tests Web4TSComponent itself');
            } finally {
                console.log = originalLog;
            }
        });

        it('should show links WITHOUT context (shows Web4TSComponent own links)', async () => {
            // No context loaded - should show Web4TSComponent's own links
            let linksOutput = '';
            const originalLog = console.log;
            console.log = (msg: string) => { linksOutput += msg + '\n'; };
            
            try {
                await web4ts.links();
                
                // Should show Web4TSComponent's semantic links
                expect(linksOutput).toContain('Semantic Version Links for Web4TSComponent');
                expect(linksOutput).toContain('prod');
                expect(linksOutput).toContain('dev');
                expect(linksOutput).toContain('test');
                expect(linksOutput).toContain('latest');
                expect(linksOutput).toContain('Workflow: dev → test → prod');
                
                console.log('✅ Links WITHOUT context works: shows Web4TSComponent own links');
            } finally {
                console.log = originalLog;
            }
        });
    });

    describe('🎯 Lifecycle Methods WITH Context (Target Component Operation)', () => {
        it('should run build WITH context (builds target component)', { timeout: 60000 }, async () => {
            // Create a test component first
            await web4ts.create('ContextTestComponent', '0.1.0.0', 'all');
            
            // Load context
            await web4ts.on('ContextTestComponent', '0.1.0.0');
            
            let buildOutput = '';
            const originalLog = console.log;
            console.log = (msg: string) => { buildOutput += msg + '\n'; };
            
            try {
                await web4ts.build();
                
                // Should mention building the target component
                expect(buildOutput).toContain('Building ContextTestComponent 0.1.0.0');
                expect(buildOutput).toContain('Build completed for ContextTestComponent 0.1.0.0');
                
                console.log('✅ Build WITH context works: builds target component');
            } finally {
                console.log = originalLog;
            }
        });

        it('should show links WITH context (shows target component links)', async () => {
            // Create a test component first
            await web4ts.create('LinkTestComponent', '0.1.0.0', 'all');
            
            // Load context
            await web4ts.on('LinkTestComponent', '0.1.0.0');
            
            let linksOutput = '';
            const originalLog = console.log;
            console.log = (msg: string) => { linksOutput += msg + '\n'; };
            
            try {
                await web4ts.links();
                
                // Should show target component's semantic links
                expect(linksOutput).toContain('Semantic Version Links for LinkTestComponent');
                expect(linksOutput).toContain('prod');
                expect(linksOutput).toContain('dev');
                expect(linksOutput).toContain('test');
                expect(linksOutput).toContain('latest');
                expect(linksOutput).toContain('Workflow: dev → test → prod');
                
                console.log('✅ Links WITH context works: shows target component links');
            } finally {
                console.log = originalLog;
            }
        });

        it.skip('should run test WITH context (tests target component with promotion)', { timeout: 30000 }, async () => {
            // Create a test component first
            await web4ts.create('TestPromotionComponent', '0.1.0.0', 'all');
            
            // Set up semantic links for promotion workflow
            await web4ts.on('TestPromotionComponent', '0.1.0.0');
            await web4ts.setDev('0.1.0.0');
            await web4ts.setTest('0.1.0.0');
            
            let testOutput = '';
            const originalLog = console.log;
            console.log = (msg: string) => { testOutput += msg + '\n'; };
            
            try {
                await web4ts.test();
                
                // Should show workflow and promotion
                expect(testOutput).toContain('WORKFLOW REMINDER');
                expect(testOutput).toContain('Running tests for TestPromotionComponent');
                expect(testOutput).toContain('100% test success confirmed');
                expect(testOutput).toContain('Version promotion workflow completed successfully');
                
                console.log('✅ Test WITH context works: tests target component with promotion');
            } finally {
                console.log = originalLog;
            }
        });
    });

    describe('🔄 Context Switching Pattern', () => {
        it('should switch between WITH and WITHOUT context seamlessly', async () => {
            let output = '';
            const originalLog = console.log;
            console.log = (msg: string) => { output += msg + '\n'; };
            
            try {
                // 1. WITHOUT context - should work on Web4TSComponent itself
                await web4ts.links();
                expect(output).toContain('Semantic Version Links for Web4TSComponent');
                
                output = ''; // Reset output
                
                // 2. Load context
                await web4ts.create('SwitchTestComponent', '0.1.0.0', 'all');
                await web4ts.on('SwitchTestComponent', '0.1.0.0');
                
                // 3. WITH context - should work on target component
                await web4ts.links();
                expect(output).toContain('Semantic Version Links for SwitchTestComponent');
                
                output = ''; // Reset output
                
                // 4. Clear context (simulate new CLI instance)
                web4ts = new DefaultWeb4TSComponent();
                
                // 5. WITHOUT context again - should work on Web4TSComponent itself
                await web4ts.links();
                expect(output).toContain('Semantic Version Links for Web4TSComponent');
                
                console.log('✅ Context switching works: seamless WITH/WITHOUT context operation');
            } finally {
                console.log = originalLog;
            }
        });

        it.skip('should maintain consistent behavior pattern across all lifecycle methods', { timeout: 30000 }, async () => {
            // Test that all lifecycle methods follow the same pattern
            const methods = ['build', 'test', 'links'];
            
            for (const method of methods) {
                let outputWithoutContext = '';
                let outputWithContext = '';
                
                const originalLog = console.log;
                
                try {
                    // Test WITHOUT context
                    console.log = (msg: string) => { outputWithoutContext += msg + '\n'; };
                    await (web4ts as any)[method]();
                    expect(outputWithoutContext).toContain('Web4TSComponent');
                    
                    // Test WITH context
                    await web4ts.create('PatternTestComponent', '0.1.0.0', 'all');
                    await web4ts.on('PatternTestComponent', '0.1.0.0');
                    
                    console.log = (msg: string) => { outputWithContext += msg + '\n'; };
                    await (web4ts as any)[method]();
                    expect(outputWithContext).toContain('PatternTestComponent');
                    
                    console.log(`✅ Method '${method}' follows consistent WITH/WITHOUT context pattern`);
                } finally {
                    console.log = originalLog;
                }
                
                // Reset for next method test
                web4ts = new DefaultWeb4TSComponent();
            }
        });
    });

    describe('🔗 Cross-Component Delegation Pattern', () => {
        it('should verify generated components have test method that delegates to web4tscomponent', async () => {
            // Create a new component
            await web4ts.create('DelegationTestComponent', '0.1.0.0', 'all');
            
            // Check that the generated component has test method
            const componentPath = path.join(testDataDir, 'components', 'DelegationTestComponent', '0.1.0.0');
            const defaultComponentPath = path.join(componentPath, 'src', 'ts', 'layer2', 'DefaultDelegationTestComponent.ts');
            
            expect(existsSync(defaultComponentPath)).toBe(true);
            
            // Read the generated file and verify it has the test method with correct delegation
            const fs = await import('fs');
            const content = fs.readFileSync(defaultComponentPath, 'utf-8');
            
            expect(content).toContain('async test(): Promise<this>');
            expect(content).toContain('web4tscomponent on DelegationTestComponent dev test');
            expect(content).toContain('Running DelegationTestComponent tests via Web4TSComponent infrastructure');
            
            console.log('✅ Generated components have correct test delegation pattern');
        });

        it.skip('should verify template system prevents DRY violations', async () => {
            // Create a component
            await web4ts.create('DRYTestComponent', '0.1.0.0', 'all');
            
            // Load context and build it (this uses the fixed install-deps.sh template)
            await web4ts.on('DRYTestComponent', '0.1.0.0');
            await web4ts.build();
            
            // Check that it has symlinked node_modules (not real directory)
            const componentPath = path.join(testDataDir, 'components', 'DRYTestComponent', '0.1.0.0');
            const nodeModulesPath = path.join(componentPath, 'node_modules');
            
            expect(existsSync(nodeModulesPath)).toBe(true);
            
            const fs = await import('fs');
            const stats = fs.lstatSync(nodeModulesPath);
            expect(stats.isSymbolicLink()).toBe(true);
            expect(stats.isDirectory()).toBe(false);
            
            console.log('✅ Template system prevents DRY violations: generates symlinked node_modules');
        });
    });
});
