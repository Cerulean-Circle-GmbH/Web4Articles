/**
 * Web4 User Component Documentation Generator
 * Radical OOP TypeScript implementation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

export interface DocumentationGenerator {
    generate(): Promise<void>;
    getGeneratedFiles(): string[];
}

export interface PackageInfo {
    name: string;
    version: string;
    description: string;
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

export class ComponentDocumentationGenerator implements DocumentationGenerator {
    private generatedFiles: string[] = [];
    private componentRoot: string;
    private docsPath: string;
    private packageInfo: PackageInfo | null = null;
    private gitInfo = {
        commit: 'unknown',
        branch: 'unknown'
    };

    constructor() {
        // Empty constructor - Web4 principle
        const __dirname = dirname(fileURLToPath(import.meta.url));
        this.componentRoot = resolve(__dirname, '../../..');
        this.docsPath = resolve(this.componentRoot, 'docs');
    }

    public async generate(): Promise<void> {
        console.log('📚 Generating Web4 User component documentation...\n');

        await this.ensureDocsDirectory();
        await this.loadPackageInfo();
        await this.loadGitInfo();
        await this.generateOverview();
        await this.generateAPIReference();

        console.log('\n✅ Documentation generation complete!');
    }

    public getGeneratedFiles(): string[] {
        return [...this.generatedFiles];
    }

    private async ensureDocsDirectory(): Promise<void> {
        if (!existsSync(this.docsPath)) {
            mkdirSync(this.docsPath, { recursive: true });
        }
    }

    private async loadPackageInfo(): Promise<void> {
        const packageJsonPath = resolve(this.componentRoot, 'package.json');
        const content = readFileSync(packageJsonPath, 'utf-8');
        this.packageInfo = JSON.parse(content);
    }

    private async loadGitInfo(): Promise<void> {
        try {
            this.gitInfo.commit = execSync('git rev-parse --short HEAD', { 
                encoding: 'utf-8' 
            }).trim();
            this.gitInfo.branch = execSync('git rev-parse --abbrev-ref HEAD', { 
                encoding: 'utf-8' 
            }).trim();
        } catch (error) {
            console.warn('⚠️  Could not get git information');
        }
    }

    private async generateOverview(): Promise<void> {
        if (!this.packageInfo) return;

        const overview = this.createOverviewContent();
        const overviewPath = resolve(this.docsPath, 'README.md');
        
        writeFileSync(overviewPath, overview);
        this.generatedFiles.push(overviewPath);
        console.log(`✅ Generated: docs/README.md`);
    }

    private createOverviewContent(): string {
        const pkg = this.packageInfo!;
        const timestamp = new Date().toISOString();

        return `# Web4 User Component Documentation

**Component:** ${pkg.name}  
**Version:** ${pkg.version}  
**Description:** ${pkg.description}  
**Generated:** ${timestamp}  
**Git Commit:** ${this.gitInfo.commit}  
**Git Branch:** ${this.gitInfo.branch}

## Overview

The Web4 User component provides consistent user identification across the Web4Articles ecosystem. It implements:

- **Empty Constructor Pattern**: Objects created without parameters
- **Scenario-Based Users**: User objects as hibernatable scenarios
- **Deterministic UUIDs**: Consistent UUID generation based on username
- **IOR References**: Support for distributed object references

## Architecture

### Layer Structure
- **Layer 2 (Default Implementation)**: \`DefaultUser.ts\`
- **Layer 3 (Interface)**: \`User.ts\`
- **Layer 4 (Lifecycle Management)**: \`EnvironmentChecker.ts\`, \`DependencyChecker.ts\`, \`ComponentDocumentationGenerator.ts\`

### Key Features
1. **Deterministic UUID Generation**: Same username always produces same UUID
2. **Scenario Management**: Import/export user scenarios
3. **Batch Operations**: Fix owner UUIDs across multiple files
4. **CLI Integration**: Full command-line interface
5. **Self-Management**: Complete lifecycle automation with TypeScript OOP

## Usage

### CLI Commands
\`\`\`bash
# Create a new user
user create "username" [hostname]

# Get user UUID
user get "username"

# Fix scenario files
user fix-scenario <file>
user fix-scenarios --all

# List all users
user list
\`\`\`

### Programmatic Usage
\`\`\`typescript
import { DefaultUser } from '@web4/user';

const user = new DefaultUser();
user.setUsername('donges');
user.setHostname('localhost');
const uuid = user.getUuid(); // Deterministic based on username
\`\`\`

## Web4 Compliance

✅ **Empty Constructors**: All objects created without parameters  
✅ **Scenario Objects**: Full state serialization support  
✅ **IOR Support**: Ready for distributed references  
✅ **Self-Management**: Complete lifecycle scripts with TypeScript OOP  
✅ **Radical OOP**: All lifecycle management in TypeScript classes  

## Scripts

${this.formatScripts(pkg.scripts || {})}

## Dependencies

### Runtime
${this.formatDependencies(pkg.dependencies || {})}

### Development
${this.formatDependencies(pkg.devDependencies || {})}

---

Generated by Web4 Component Documentation Generator (TypeScript OOP)
`;
    }

    private formatScripts(scripts: Record<string, string>): string {
        return Object.entries(scripts)
            .map(([name, cmd]) => `- **${name}**: \`${cmd}\``)
            .join('\n');
    }

    private formatDependencies(deps: Record<string, string>): string {
        const entries = Object.entries(deps);
        return entries.length > 0 
            ? entries.map(([name, version]) => `- ${name}: ${version}`).join('\n')
            : 'None';
    }

    private async generateAPIReference(): Promise<void> {
        const apiDoc = this.createAPIContent();
        const apiPath = resolve(this.docsPath, 'API.md');
        
        writeFileSync(apiPath, apiDoc);
        this.generatedFiles.push(apiPath);
        console.log(`✅ Generated: docs/API.md`);
    }

    private createAPIContent(): string {
        return `# Web4 User Component API Reference

## Interfaces

### User
\`\`\`typescript
interface User {
  getUuid(): string;
  getUsername(): string;
  getHostname(): string;
  setUsername(username: string): void;
  setHostname(hostname: string): void;
}
\`\`\`

### EnvironmentCheck
\`\`\`typescript
interface EnvironmentCheck {
    check(): Promise<boolean>;
    getErrors(): string[];
}
\`\`\`

### DependencyCheck
\`\`\`typescript
interface DependencyCheck {
    check(): Promise<boolean>;
    getErrors(): string[];
}
\`\`\`

### DocumentationGenerator
\`\`\`typescript
interface DocumentationGenerator {
    generate(): Promise<void>;
    getGeneratedFiles(): string[];
}
\`\`\`

## Classes

### DefaultUser
Implements the User interface with deterministic UUID generation.

#### Methods
- \`constructor()\`: Creates empty user instance
- \`getUuid(): string\`: Returns deterministic UUID based on username
- \`getUsername(): string\`: Returns current username
- \`getHostname(): string\`: Returns current hostname
- \`setUsername(username: string): void\`: Sets username
- \`setHostname(hostname: string): void\`: Sets hostname

### EnvironmentChecker
Validates component environment before installation.

#### Methods
- \`constructor()\`: Creates empty checker instance
- \`check(): Promise<boolean>\`: Performs all environment checks
- \`getErrors(): string[]\`: Returns list of validation errors

### DependencyChecker
Validates component dependencies before build.

#### Methods
- \`constructor()\`: Creates empty checker instance
- \`check(): Promise<boolean>\`: Performs all dependency checks
- \`getErrors(): string[]\`: Returns list of missing dependencies

### ComponentDocumentationGenerator
Generates component documentation in Web4 format.

#### Methods
- \`constructor()\`: Creates empty generator instance
- \`generate(): Promise<void>\`: Generates all documentation files
- \`getGeneratedFiles(): string[]\`: Returns list of generated file paths

## CLI API

### Commands
- \`create <username> [hostname]\`: Create new user scenario
- \`get <username>\`: Get user UUID and details
- \`fix-scenario <file>\`: Fix owner UUID in scenario file
- \`fix-scenarios --all\`: Fix all scenario files
- \`list\`: List all user scenarios

### Options
- \`--help\`: Show help information
- \`--verify\`: Verify component installation
`;
    }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
    const generator = new ComponentDocumentationGenerator();
    generator.generate().catch(error => {
        console.error('❌ Documentation generation failed:', error);
        process.exit(1);
    });
}