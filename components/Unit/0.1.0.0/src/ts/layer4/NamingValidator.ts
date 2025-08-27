/**
 * Web4 Unit Naming Validator - Layer 4 (Business Logic)
 * 
 * Validates that code follows Web4 naming standards:
 * - No Hungarian notation (I prefix for interfaces, T prefix for types)
 * - Clean, descriptive names
 */

export class NamingValidator {
    private violations: string[] = [];
    
    constructor() {
        // Empty constructor - Web4 principle
    }
    
    /**
     * Validates interface/type names against Web4 standards
     */
    public validateName(name: string, kind: 'interface' | 'type' | 'class'): boolean {
        this.violations = [];
        
        // Check for Hungarian notation
        if (kind === 'interface' && name.startsWith('I') && name.length > 1 && name[1] === name[1].toUpperCase()) {
            this.violations.push(`Interface '${name}' uses Hungarian notation. Use '${name.substring(1)}' instead.`);
            return false;
        }
        
        if (kind === 'type' && name.startsWith('T') && name.length > 1 && name[1] === name[1].toUpperCase()) {
            this.violations.push(`Type '${name}' uses Hungarian notation. Use '${name.substring(1)}' instead.`);
            return false;
        }
        
        return true;
    }
    
    /**
     * Validates TypeScript source code for naming violations
     */
    public validateSource(source: string): ValidationResult {
        const result: ValidationResult = {
            valid: true,
            violations: []
        };
        
        // Simple regex patterns for interface and type declarations
        const interfacePattern = /interface\s+([A-Z][A-Za-z0-9]*)/g;
        const typePattern = /type\s+([A-Z][A-Za-z0-9]*)/g;
        
        // Check interfaces
        let match;
        while ((match = interfacePattern.exec(source)) !== null) {
            const name = match[1];
            if (!this.validateName(name, 'interface')) {
                result.valid = false;
                result.violations.push(...this.violations);
            }
        }
        
        // Check types
        while ((match = typePattern.exec(source)) !== null) {
            const name = match[1];
            if (!this.validateName(name, 'type')) {
                result.valid = false;
                result.violations.push(...this.violations);
            }
        }
        
        return result;
    }
    
    /**
     * Get requirement reference
     */
    public getRequirementReference(): RequirementReference {
        return {
            uuid: 'c11dc297-da75-48ac-a2d8-bbf18e33690f',
            title: 'No Hungarian Notation - Ban Interface and Type Prefixes',
            description: 'Never use I prefix for interfaces or T prefix for types',
            link: 'spec/requirements.md/c11dc297-da75-48ac-a2d8-bbf18e33690f.requirement.md'
        };
    }
    
    /**
     * Get violations found
     */
    public getViolations(): string[] {
        return [...this.violations];
    }
}

export interface ValidationResult {
    valid: boolean;
    violations: string[];
}

export interface RequirementReference {
    uuid: string;
    title: string;
    description: string;
    link: string;
}