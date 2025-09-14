import type { Completion } from '../layer3/Completion.js';
export declare class TSCompletion implements Completion {
    private static extractJsDocText;
    private static extractParamJsDoc;
    static getProjectSourceFiles(): string[];
    static getClasses(): string[];
    static getClassMethods(className: string): string[];
    static getMethodParameters(className: string, methodName: string, paramName?: string): any[];
    static getClassDoc(className: string): string;
    static getMethodDoc(className: string, methodName: string): string;
    static getParamDoc(className: string, methodName: string, paramName: string): string;
    complete(args: string[]): string[];
    /**
     * Enhanced method parameter extraction with union type support
     * Web4 pattern: TypeScript AST parsing with union type detection for CLI generation
     */
    static getEnhancedMethodParameters(className: string, methodName: string): any[];
    /**
     * Check if type string represents a union type
     * Web4 pattern: Union type detection from TypeScript AST
     */
    private static isUnionType;
    /**
     * Extract individual types from union type string
     * Web4 pattern: Union type parsing from TypeScript AST
     */
    private static extractUnionTypes;
    /**
     * Extract CLI annotations from JSDoc (@cliHide, @cliSyntax, etc.)
     * Web4 pattern: Pure TSDoc annotation parsing for zero config CLI generation
     */
    static extractCliAnnotations(className: string, methodName: string, paramName?: string): any;
    /**
     * Parse CLI annotations from JSDoc text
     * Web4 pattern: Zero config annotation parsing
     */
    private static parseCliAnnotations;
    /**
     * Extract value from @annotation pattern
     */
    private static extractAnnotationValue;
    static start(): void;
}
//# sourceMappingURL=TSCompletion.d.ts.map