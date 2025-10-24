/**
 * SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
 * SPDX-FileComment: See ../../../../../../AI-GPL.md for AI-specific terms.
 * Copyright (c) 2025 Cerulean Circle GmbH
 * Copyleft: See AGPLv3 (../../../../../../LICENSE) and AI-GPL Addendum (../../../../../../AI-GPL.md)
 * Backlinks: /LICENSE, /AI-GPL.md
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export interface IEnvironmentCheck {
    check(): Promise<boolean>;
    getErrors(): string[];
}

export class EnvironmentChecker implements IEnvironmentCheck {
    private errors: string[] = [];
    private projectRoot: string;
    private componentRoot: string;

    constructor() {
        // Empty constructor - Web4 principle
        const __dirname = dirname(fileURLToPath(import.meta.url));
        this.componentRoot = resolve(__dirname, '../../..');
        this.projectRoot = resolve(this.componentRoot, '../../..');
    }

    public async check(): Promise<boolean> {
        this.errors = [];
        console.log('🔍 Checking Web4 User component environment...\n');

        await this.checkNodeVersion();
        await this.checkTypeScript();
        await this.checkProjectStructure();
        await this.checkESMConfiguration();

        if (this.errors.length > 0) {
            console.error('\n❌ Environment check failed. Please fix the issues above.');
            return false;
        }

        console.log('\n✅ Environment check passed! Ready to install.');
        return true;
    }

    public getErrors(): string[] {
        return [...this.errors];
    }

    private async checkNodeVersion(): Promise<void> {
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
        
        if (majorVersion < 18) {
            const error = `Node.js 18 or higher required. Found: ${nodeVersion}`;
            console.error(`❌ ${error}`);
            this.errors.push(error);
        } else {
            console.log(`✅ Node.js version: ${nodeVersion}`);
        }
    }

    private async checkTypeScript(): Promise<void> {
        try {
            const tscPath = resolve(this.projectRoot, 'node_modules/.bin/tsc');
            if (!existsSync(tscPath)) {
                const error = 'TypeScript not found. Run npm install in project root.';
                console.error(`❌ ${error}`);
                this.errors.push(error);
            } else {
                console.log('✅ TypeScript available');
            }
        } catch (error: any) {
            const errorMsg = `Error checking TypeScript: ${error.message}`;
            console.error(`❌ ${errorMsg}`);
            this.errors.push(errorMsg);
        }
    }

    private async checkProjectStructure(): Promise<void> {
        const requiredPaths = [
            'src/ts/layer2/DefaultUser.ts',
            'src/ts/layer3/IUser.ts',
            'tsconfig.json'
        ];

        for (const path of requiredPaths) {
            const fullPath = resolve(this.componentRoot, path);
            if (!existsSync(fullPath)) {
                const error = `Required file missing: ${path}`;
                console.error(`❌ ${error}`);
                this.errors.push(error);
            } else {
                console.log(`✅ Found: ${path}`);
            }
        }
    }

    private async checkESMConfiguration(): Promise<void> {
        const packageJsonPath = resolve(this.componentRoot, 'package.json');
        
        if (!existsSync(packageJsonPath)) {
            const error = 'package.json not found';
            console.error(`❌ ${error}`);
            this.errors.push(error);
            return;
        }

        try {
            const pkg = await import(packageJsonPath, { assert: { type: 'json' } });
            if (pkg.default.type !== 'module') {
                const error = 'package.json must have "type": "module" for ESM support';
                console.error(`❌ ${error}`);
                this.errors.push(error);
            } else {
                console.log('✅ ESM configuration correct');
            }
        } catch (error: any) {
            const errorMsg = `Error reading package.json: ${error.message}`;
            console.error(`❌ ${errorMsg}`);
            this.errors.push(errorMsg);
        }
    }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
    const checker = new EnvironmentChecker();
    checker.check().then(success => {
        process.exit(success ? 0 : 1);
    });
}