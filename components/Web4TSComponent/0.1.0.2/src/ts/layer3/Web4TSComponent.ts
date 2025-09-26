/**
 * Web4TSComponent - Web4 Architecture Layer 3 Interface
 * Defines the contract for TypeScript component standards enforcement
 */

export interface ComponentMetadata {
  name: string;
  version: string;
  type: 'Web4Component';
  hasLocationResilientCLI: boolean;
  hasEmptyConstructors: boolean;
  hasScenarioSupport: boolean;
  hasLayeredArchitecture: boolean;
}

export interface CLIStandardValidation {
  isCompliant: boolean;
  issues: string[];
  hasProjectRootDetection: boolean;
  hasAutoBuilder: boolean;
  hasContextPreservation: boolean;
  hasVersionResolution: boolean;
}

export interface ComponentScaffoldOptions {
  componentName: string;
  version: string;
  includeLayerArchitecture: boolean;
  includeCLI: boolean;
  includeSpecFolder: boolean;
  includeVitest: boolean;
}

export interface Web4TSComponent {
  // Web4 Empty Constructor Principle
  // Component must be initialized empty, then configured

  // Configuration methods
  setComponentName(name: string): void;
  setVersion(version: string): void;
  setTargetDirectory(directory: string): void;

  // Standard enforcement methods  
  validateLocationResilientCLI(scriptPath: string): Promise<CLIStandardValidation>;
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  scaffoldComponent(options: ComponentScaffoldOptions): Promise<ComponentMetadata>;
  
  // Compliance checking
  auditComponentCompliance(componentPath: string): Promise<ComponentMetadata>;
  generateComplianceReport(components: string[]): Promise<string>;

  // Standard documentation
  getLocationResilientCLIStandard(): string;
  getWeb4ArchitectureGuidelines(): string;

  // Scenario support (Web4 Scenario-First Development)
  toScenario(): Promise<any>;
  fromScenario(scenario: any): void;
}



