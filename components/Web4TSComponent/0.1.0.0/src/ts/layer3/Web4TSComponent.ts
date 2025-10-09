/**
 * Web4TSComponent - Web4 Architecture Layer 3 Interface
 * Defines the contract for TypeScript component standards enforcement
 */

export interface ComponentDependency {
  component: string;  // 'IOR', 'Scenario', 'User', etc.
  version: string;    // '0.3.0.3'
  path?: string;      // Optional custom path
}

export interface ComponentMetadata {
  name: string;
  version: string;
  type: 'Web4Component';
  hasLocationResilientCLI: boolean;
  hasEmptyConstructors: boolean;
  hasScenarioSupport: boolean;
  hasLayeredArchitecture: boolean;
  dependencies?: ComponentDependency[];  // Component dependencies with auto-build
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
  dependencies?: ComponentDependency[];
}

export interface Web4TSComponent {
  // Web4 Empty Constructor Principle
  // Component must be initialized empty, then configured

  // Configuration methods
  setComponentName(name: string): void;
  setVersion(version: string): void;
  setTargetDirectory(directory: string): void;
  setDependencies(dependencies: ComponentDependency[]): void;

  // Standard enforcement methods  
  validateLocationResilientCLI(scriptPath: string): Promise<CLIStandardValidation>;
  generateLocationResilientCLI(componentName: string, version: string): Promise<string>;
  scaffoldComponent(options: ComponentScaffoldOptions): Promise<ComponentMetadata>;
  
  // Dependency management
  buildDependencies(componentName: string): Promise<void>;
  generateInstallDepsScript(componentName: string, version: string, dependencies: ComponentDependency[]): Promise<string>;
  generateBuildScript(componentName: string, version: string, dependencies: ComponentDependency[]): Promise<string>;
  
  // Compliance checking
  auditComponentCompliance(componentPath: string): Promise<ComponentMetadata>;
  generateComplianceReport(components: string[]): Promise<string>;

  // Standard documentation
  getLocationResilientCLIStandard(): string;
  getWeb4ArchitectureGuidelines(): string;

  // Scenario support (Web4 Scenario-First Development)
  toScenario(): any;
  fromScenario(scenario: any): void;
}



