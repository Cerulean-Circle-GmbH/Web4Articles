/**
 * Mock Interfaces - Temporary interfaces to break dependency cycles
 * 
 * These will be replaced with real imports once build chain works
 * Used to get ONCE building first, then integrate real components
 */

// Mock IOR interface
export interface IOR {
  uuid: string;
  component: string;
  version: string;
  location?: string;
  endpoint?: string;
}

// Mock Model interface
export interface Model {
  uuid: string;
  name: string;
  description: string;
  [key: string]: any;
}

// Mock Scenario interface
export interface Scenario {
  ior: IOR;
  owner: string;
  model: any;
  validate(): boolean;
  init(data: any): this;
}

// Mock DefaultIOR
export class DefaultIOR {
  private data: IOR = { uuid: '', component: '', version: '' };
  
  init(data: Partial<IOR>): this {
    Object.assign(this.data, data);
    return this;
  }
  
  toJSON(): IOR {
    return { ...this.data };
  }
  
  get uuid(): string { return this.data.uuid; }
}

// Mock DefaultUser
export class DefaultUser {
  private model: any = {};
  
  init(scenario: Scenario): this {
    this.model = scenario.model || {};
    return this;
  }
  
  generateOwnerData(data: any): Promise<string> {
    return Promise.resolve('mock-owner-data');
  }
}

// Mock Scenario implementation
export class MockScenario implements Scenario {
  ior: IOR = { uuid: '', component: '', version: '' };
  owner: string = '';
  model: any = {};
  
  validate(): boolean {
    return true;
  }
  
  init(data: any): this {
    Object.assign(this, data);
    return this;
  }
}

// Export MockScenario as Scenario for compatibility
export { MockScenario as Scenario };

// Mock DefaultCLI
export class DefaultCLI {
  static createForComponent(component: any, name: string): DefaultCLI {
    return new DefaultCLI();
  }
  
  async execute(command: string, args: string[]): Promise<void> {
    console.log(`Mock CLI: ${command} executed`);
  }
}

// Mock CLIColors
export class CLIColors {
  static readonly CYAN = '\x1b[36m';
  static readonly YELLOW = '\x1b[33m';
  static readonly GREEN = '\x1b[32m';
  static readonly BOLD = '\x1b[1m';
  static readonly RESET = '\x1b[0m';
  
  static cyan(text: string): string { return `${CLIColors.CYAN}${text}${CLIColors.RESET}`; }
  static yellow(text: string): string { return `${CLIColors.YELLOW}${text}${CLIColors.RESET}`; }
  static green(text: string): string { return `${CLIColors.GREEN}${text}${CLIColors.RESET}`; }
  static bold(text: string): string { return `${CLIColors.BOLD}${text}${CLIColors.RESET}`; }
  static cliHeader(tool: string, desc: string): string { return `${CLIColors.CYAN}${tool}${CLIColors.RESET} - ${desc}`; }
  static usageLine(cmd: string, args: string, comment: string): string { return `  ${cmd} ${args} # ${comment}`; }
  static commandDesc(cmd: string, desc: string): string { return `  ${cmd} - ${desc}`; }
  static yellowParam(param: string): string { return `<${param}>`; }
}