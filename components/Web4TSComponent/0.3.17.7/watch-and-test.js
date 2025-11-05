#!/usr/bin/env node
/**
 * Filesystem Watcher for DefaultCLI.ts
 * 
 * Watches for changes in DefaultCLI.ts and automatically triggers:
 * web4tscomponent test
 * 
 * This creates an automated AI-assisted development loop where
 * every change triggers test execution.
 */

import { watch } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class DefaultCLIWatcher {
    constructor() {
        this.isRunning = false;
        this.debounceTimer = null;
        this.watchPath = join(__dirname, 'src/ts/layer2/DefaultCLI.ts');
        this.componentDir = __dirname;
    }

    start() {
        console.log('🤖 AI-Assisted Development Mode Activated');
        console.log('📁 Watching:', this.watchPath);
        console.log('🧪 Auto-command: web4tscomponent test');
        console.log('━'.repeat(60));
        console.log('');

        const watcher = watch(this.watchPath, (eventType, filename) => {
            if (eventType === 'change') {
                this.handleChange(filename);
            }
        });

        watcher.on('error', (error) => {
            console.error('❌ Watcher error:', error);
        });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n\n🛑 Stopping watcher...');
            watcher.close();
            process.exit(0);
        });

        console.log('✅ Watcher started. Edit DefaultCLI.ts to trigger tests.');
        console.log('   Press Ctrl+C to stop.\n');
    }

    handleChange(filename) {
        // Debounce: Wait for rapid successive changes to settle
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.triggerTest();
        }, 500); // 500ms debounce
    }

    async triggerTest() {
        if (this.isRunning) {
            console.log('⏳ Test already running, skipping...');
            return;
        }

        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        console.log('\n' + '═'.repeat(60));
        console.log(`🔄 [${timestamp}] Change detected in DefaultCLI.ts`);
        console.log('🧪 Running: web4tscomponent test');
        console.log('═'.repeat(60));
        console.log('');

        this.isRunning = true;

        const testProcess = spawn('./web4tscomponent', ['test'], {
            cwd: this.componentDir,
            stdio: 'inherit', // Show output in real-time
            shell: true
        });

        testProcess.on('close', (code) => {
            this.isRunning = false;
            console.log('');
            console.log('─'.repeat(60));
            
            if (code === 0) {
                console.log('✅ Tests passed!');
            } else {
                console.log(`❌ Tests failed with exit code ${code}`);
            }
            
            console.log('⏱️  Waiting for next change...');
            console.log('─'.repeat(60));
            console.log('');
        });

        testProcess.on('error', (error) => {
            this.isRunning = false;
            console.error('❌ Failed to execute web4tscomponent test:', error);
        });
    }
}

// Start the watcher
const watcher = new DefaultCLIWatcher();
watcher.start();

