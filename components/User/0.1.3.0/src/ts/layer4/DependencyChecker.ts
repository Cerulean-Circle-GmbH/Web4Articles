/**
 * Web4 User Component Dependency Checker
 * Radical OOP TypeScript implementation
 */

import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

<<<<<<< HEAD
export interface IDependencyCheck {
=======
<<<<<<< HEAD
export interface DependencyCheck {
=======
export interface IDependencyCheck {
>>>>>>> origin/dev/2025-09-14-UTC-1425
>>>>>>> origin/start/save.v5
    check(): Promise<boolean>;
    getErrors(): string[];
}

<<<<<<< HEAD
export class DependencyChecker implements IDependencyCheck {
=======
<<<<<<< HEAD
export class DependencyChecker implements DependencyCheck {
=======
export class DependencyChecker implements IDependencyCheck {
>>>>>>> origin/dev/2025-09-14-UTC-1425
>>>>>>> origin/start/save.v5
    private errors: string[] = [];
    private componentRoot: string;
    private requiredDevDeps: string[] = [
        'typescript',
        'ts-node',
        '@types/node',
        '@types/glob',
        'vitest',
        'eslint',
        'prettier',
        'glob'
    ];

    constructor() {
        // Empty constructor - Web4 principle
        const __dirname = dirname(fileURLToPath(import.meta.url));
        this.componentRoot = resolve(__dirname, '../../..');
    }

    public async check(): Promise<boolean> {
        this.errors = [];
        console.log('🔍 Checking Web4 User component dependencies...\n');

        await this.checkNodeModules();
        await this.checkDevDependencies();
        await this.checkComponentDependencies();
        await this.checkTypeScriptConfig();
        await this.checkBuildArtifacts();

        if (this.errors.length > 0) {
            console.error('\n❌ Dependency check failed. Please fix the issues above.');
            return false;
        }

        console.log('\n✅ All dependencies satisfied! Ready to build.');
        return true;
    }

    public getErrors(): string[] {
        return [...this.errors];
    }

    private async checkNodeModules(): Promise<void> {
        const nodeModulesPath = resolve(this.componentRoot, 'node_modules');
        if (!existsSync(nodeModulesPath)) {
            const error = 'node_modules not found. Run npm install first.';
            console.error(`❌ ${error}`);
            this.errors.push(error);
            throw new Error(error); // Stop further checks
        }
    }

    private async checkDevDependencies(): Promise<void> {
        console.log('Checking dev dependencies...');
        const nodeModulesPath = resolve(this.componentRoot, 'node_modules');

        for (const dep of this.requiredDevDeps) {
            const depPath = resolve(nodeModulesPath, dep);
            if (!existsSync(depPath)) {
                const error = `Missing dev dependency: ${dep}`;
                console.error(`❌ ${error}`);
                this.errors.push(error);
            } else {
                console.log(`✅ ${dep}`);
            }
        }
    }

    private async checkComponentDependencies(): Promise<void> {
        console.log('\nChecking component dependencies...');
        const unitComponentPath = resolve(this.componentRoot, '../../Unit/latest');
        
        if (!existsSync(unitComponentPath)) {
            const error = 'Unit component not found at expected path';
            console.error(`❌ ${error}`);
            this.errors.push(error);
            return;
        }

        const unitDistPath = resolve(unitComponentPath, 'dist');
        if (!existsSync(unitDistPath)) {
            const error = 'Unit component not built (dist/ missing)';
            console.error(`❌ ${error}`);
            console.log('  ℹ️  Run: cd ../../Unit/latest && npm install && npm run build');
            this.errors.push(error);
        } else {
            console.log('✅ Unit component available');
        }
    }

    private async checkTypeScriptConfig(): Promise<void> {
        const tsconfigPath = resolve(this.componentRoot, 'tsconfig.json');
        if (!existsSync(tsconfigPath)) {
            const error = 'tsconfig.json not found';
            console.error(`❌ ${error}`);
            this.errors.push(error);
        } else {
            console.log('✅ TypeScript configuration found');
        }
    }

    private async checkBuildArtifacts(): Promise<void> {
        const distPath = resolve(this.componentRoot, 'dist');
        if (existsSync(distPath)) {
            try {
                const stats = execSync('find dist -name "*.js" | wc -l', { 
                    cwd: this.componentRoot,
                    encoding: 'utf-8'
                }).trim();
                console.log(`ℹ️  Found ${stats} JS files in dist/`);
            } catch (error) {
                console.warn('⚠️  Could not count dist files');
            }
        }
    }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
    const checker = new DependencyChecker();
    checker.check().then(success => {
        process.exit(success ? 0 : 1);
    });
}