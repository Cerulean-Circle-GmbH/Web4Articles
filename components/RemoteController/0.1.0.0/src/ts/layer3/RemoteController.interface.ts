/**
 * RemoteController - RemoteController Component Interface
 * Web4 pattern: Component interface definition
 * 
 * @pdca 2025-11-10-UTC-1845.eliminate-delegation-dry-violation.pdca.md
 * NOTE: Delegated methods (info, test, build, clean, tree, links, etc.) are NOT declared here.
 * They are automatically available via DelegationProxy wrapping in the CLI.
 */

import { Scenario } from './Scenario.interface.js';
import { RemoteControllerModel } from './RemoteControllerModel.interface.js';

export interface RemoteController {
  init(scenario?: Scenario<RemoteControllerModel>): Promise<this>;
  toScenario(name?: string): Promise<Scenario<RemoteControllerModel>>;
  create(input: string, format?: string): Promise<this>;
  process(data: string): Promise<this>;
  startApp(appName: string): Promise<this>;
  startCursor(path?: string): Promise<this>;
  stopCursor(): Promise<this>;
  identifyCurrentField(): Promise<this>;
  startMonitoring(): Promise<this>;
  generateTest(appName: string, selector: string, action?: string, outputFile?: string): Promise<this>;
  navigateTo(url: string, browserName?: string): Promise<this>;
  getPageElements(selector?: string): Promise<this>;
  connectBrowser(port?: string): Promise<this>;
  // Delegated methods (info, test, etc.) are available via DelegationProxy but not declared here
}

