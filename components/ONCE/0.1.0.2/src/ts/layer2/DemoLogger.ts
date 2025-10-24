/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH TestVeränderung
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

export class DemoLogger {
    private chalk: any;

    constructor() {
        // Dynamic import will be handled by the consumer
        this.chalk = null;
    }

    static fromScenario(scenario: any): DemoLogger {
        const logger = new DemoLogger();
        return logger;
    }

    public async initialize(): Promise<void> {
        try {
            // Dynamic import for ESM compatibility
            const chalkModule = await import('chalk');
            this.chalk = chalkModule.default;
        } catch (error) {
            // Fallback to plain console logging
            this.chalk = {
                cyan: (text: string) => text,
                green: (text: string) => text,
                red: (text: string) => text,
                yellow: (text: string) => text,
                magenta: (text: string) => text,
                blue: (text: string) => text,
                bold: {
                    cyan: (text: string) => text,
                    yellow: (text: string) => text
                },
                gray: (text: string) => text
            };
        }
    }

    public info(message: string): void {
        if (this.chalk) {
            console.log(this.chalk.cyan('ℹ️  ' + message));
        } else {
            console.log('ℹ️  ' + message);
        }
    }

    public success(message: string): void {
        if (this.chalk) {
            console.log(this.chalk.green('✅ ' + message));
        } else {
            console.log('✅ ' + message);
        }
    }

    public error(message: string): void {
        if (this.chalk) {
            console.log(this.chalk.red('❌ ' + message));
        } else {
            console.log('❌ ' + message);
        }
    }

    public warn(message: string): void {
        if (this.chalk) {
            console.log(this.chalk.yellow('⚠️  ' + message));
        } else {
            console.log('⚠️  ' + message);
        }
    }

    public demo(message: string): void {
        if (this.chalk) {
            console.log(this.chalk.magenta('🎭 ' + message));
        } else {
            console.log('🎭 ' + message);
        }
    }

    public key(key: string, description: string): void {
        if (this.chalk) {
            console.log(this.chalk.blue(`  [${key}]`) + ' ' + description);
        } else {
            console.log(`  [${key}] ${description}`);
        }
    }

    public showHeader(): void {
        console.clear();
        if (this.chalk) {
            console.log(this.chalk.bold.cyan('╔════════════════════════════════════════════════╗'));
            console.log(this.chalk.bold.cyan('║       ONCE Interactive Demo Controller         ║'));
            console.log(this.chalk.bold.cyan('╚════════════════════════════════════════════════╝'));
        } else {
            console.log('╔════════════════════════════════════════════════╗');
            console.log('║       ONCE Interactive Demo Controller         ║');
            console.log('╚════════════════════════════════════════════════╝');
        }
        console.log();
    }

    public showHelp(): void {
        if (this.chalk) {
            console.log(this.chalk.bold('\n📋 Keyboard Controls:'));
            console.log(this.chalk.gray('─────────────────────'));
        } else {
            console.log('\n📋 Keyboard Controls:');
            console.log('─────────────────────');
        }
        
        this.key('h', 'Show this help menu');
        this.key('s', 'Start/Stop ONCE server');
        this.key('b', 'Launch Browser Client simulation');
        this.key('c', 'Launch Node.js Client');
        this.key('w', 'Launch Web Worker simulation');
        this.key('d', 'Discover peers (from all clients)');
        this.key('e', 'Exchange scenarios between clients');
        this.key('m', 'Show metrics and status');
        this.key('backspace', 'Clear screen');
        this.key('k', 'Kill all demo processes gracefully');
        this.key('q', 'Quit demo (with cleanup)');
        console.log();
    }

    public toScenario(): any {
        return {
            uuid: `demo-logger-${Date.now()}`,
            objectType: 'DemoLogger',
            version: '0.1.0.1',
            state: {
                initialized: this.chalk !== null
            }
        };
    }
}
