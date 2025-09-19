/**
 * DependencyManager - Web4 Radical OOP Dependency Management
 * Replaces shell script dependency checking with TypeScript class
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export class DependencyManager {
    private projectRoot: string;
    private logger: any;

    constructor(projectRoot: string, logger?: any) {
        this.projectRoot = projectRoot;
        this.logger = logger || console;
    }

    /**
     * Check if a package is installed
     */
    public async isPackageInstalled(packageName: string, workingDir?: string): Promise<boolean> {
        try {
            const cwd = workingDir || this.projectRoot;
            await execAsync(`npm list ${packageName}`, { cwd });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Install a package if not already installed
     */
    public async ensurePackageInstalled(packageName: string, workingDir?: string): Promise<boolean> {
        const cwd = workingDir || this.projectRoot;
        
        this.logger.info(`📦 Checking ${packageName}...`);
        
        if (await this.isPackageInstalled(packageName, cwd)) {
            this.logger.info(`✅ ${packageName} already installed`);
            return true;
        }

        this.logger.info(`Installing ${packageName}...`);
        try {
            await execAsync(`npm install ${packageName}`, { cwd });
            this.logger.info(`✅ ${packageName} installed successfully`);
            return true;
        } catch (error) {
            this.logger.error(`❌ Failed to install ${packageName}:`, error);
            return false;
        }
    }

    /**
     * Ensure all required dependencies are installed
     */
    public async ensureAllDependencies(packages: string[], workingDir?: string): Promise<boolean> {
        this.logger.info(`📦 Checking ${packages.length} dependencies...`);
        
        let allInstalled = true;
        for (const pkg of packages) {
            const installed = await this.ensurePackageInstalled(pkg, workingDir);
            if (!installed) {
                allInstalled = false;
            }
        }

        if (allInstalled) {
            this.logger.info('✅ All dependencies ready');
        } else {
            this.logger.error('❌ Some dependencies failed to install');
        }

        return allInstalled;
    }

    /**
     * Get package.json path for a directory
     */
    private getPackageJsonPath(workingDir: string): string {
        return path.join(workingDir, 'package.json');
    }

    /**
     * Check if package.json exists
     */
    public hasPackageJson(workingDir?: string): boolean {
        const cwd = workingDir || this.projectRoot;
        return fs.existsSync(this.getPackageJsonPath(cwd));
    }
}
