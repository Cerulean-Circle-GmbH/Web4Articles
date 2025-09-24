/**
 * Keyboard Controller for ONCE CLI
 * Provides interactive keyboard input handling
 */

import * as readline from 'readline';
import { EventEmitter } from 'events';

export interface KeyBinding {
    key: string;
    description: string;
    handler: () => void | Promise<void>;
}

export class KeyboardController extends EventEmitter {
    private bindings: Map<string, KeyBinding> = new Map();
    private enabled: boolean = false;
    private rl?: readline.Interface;

    constructor() {
        super();
        this.setupDefaultBindings();
    }

    /**
     * Setup default key bindings
     */
    private setupDefaultBindings(): void {
        this.bind('q', 'Quit application', () => {
            this.emit('quit');
        });

        this.bind('h', 'Show help', () => {
            this.showHelp();
        });
    }

    /**
     * Bind a key to an action
     */
    bind(key: string, description: string, handler: () => void | Promise<void>): void {
        this.bindings.set(key, { key, description, handler });
    }

    /**
     * Start listening for keyboard input
     */
    start(): void {
        if (this.enabled) return;

        this.enabled = true;
        readline.emitKeypressEvents(process.stdin);
        
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', this.handleKeypress.bind(this));
        this.emit('started');
    }

    /**
     * Stop listening for keyboard input
     */
    stop(): void {
        if (!this.enabled) return;

        this.enabled = false;
        
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }

        process.stdin.removeAllListeners('keypress');
        this.emit('stopped');
    }

    /**
     * Handle keypress events
     */
    private async handleKeypress(str: string, key: readline.Key): Promise<void> {
        if (!this.enabled) return;

        // Handle Ctrl+C
        if (key.ctrl && key.name === 'c') {
            this.emit('interrupt');
            return;
        }

        // Handle bound keys
        const binding = this.bindings.get(key.name || str);
        if (binding) {
            try {
                await binding.handler();
            } catch (error) {
                this.emit('error', error);
            }
        } else if (key.name) {
            this.emit('unknown-key', key.name);
        }
    }

    /**
     * Show help for all key bindings
     */
    showHelp(): void {
        console.log('\n📋 Keyboard Controls:');
        console.log('─────────────────────');
        
        this.bindings.forEach(binding => {
            console.log(`  [${binding.key}] ${binding.description}`);
        });
        
        console.log('  [Ctrl+C] Force quit\n');
        this.emit('help-shown');
    }

    /**
     * Get all bindings
     */
    getBindings(): KeyBinding[] {
        return Array.from(this.bindings.values());
    }

    /**
     * Clear a key binding
     */
    unbind(key: string): void {
        this.bindings.delete(key);
    }

    /**
     * Check if controller is active
     */
    isActive(): boolean {
        return this.enabled;
    }
}